const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, './tokens/tokens-figma.json');
const outputFile = path.join(__dirname, './tokens/tokens.json');

const REMOVE_KEYS = [
  "primitive/Value-set",
  "semantic/Value-set"
];

// mode/light → light, mode/dark → dark
function flattenModeKeys(obj) {
  if (obj['mode/light']) {
    obj['light'] = obj['mode/light'];
    delete obj['mode/light'];
  }
  if (obj['mode/dark']) {
    obj['dark'] = obj['mode/dark'];
    delete obj['mode/dark'];
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      flattenModeKeys(obj[key]);
    }
  }
}

// 전체 참조 경로 테이블 생성 (대소문자 구분 유지)
function buildReferenceMap(obj, pathStack = [], map = {}) {
  for (const key in obj) {
    const val = obj[key];
    const currentPath = [...pathStack, key]; // ex: ['light', 'Color', 'primary', '50']
    if (typeof val === 'object' && val !== null) {
      if (val.value !== undefined) {
        const fullPath = currentPath.join('.'); // ex: light.Color.primary.50
        const shortPath = currentPath.slice(-3).join('.'); // ex: Color.primary.50
        map[shortPath] = fullPath;
      }
      buildReferenceMap(val, currentPath, map);
    }
  }
  return map;
}

// 참조 경로 수정 (대소문자 유지)
function fixReferences(obj, refMap) {
  const refRegex = /\{([a-zA-Z0-9._-]+)\}/g;

  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      if (typeof val.value === 'string') {
        val.value = val.value.replace(refRegex, (_, refKey) => {
          return refMap[refKey] ? `{${refMap[refKey]}}` : `{${refKey}}`;
        });
      }
      fixReferences(val, refMap);
    }
  }
}

// font-weight 변환
function convertFontWeight(obj) {
  const fontWeightMap = {
    "regular": 400,
    "semibold": 600,
    "bold": 700
  };

  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      if (val.type === 'text' && fontWeightMap[val.value?.toLowerCase?.()]) {
        val.value = fontWeightMap[val.value.toLowerCase()];
      } else {
        convertFontWeight(val);
      }
    }
  }
}

// px → rem 변환
function convertPxNumbersToRem(obj, base = 10) {
  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      if (typeof val.value === 'number' && val.type === 'number') {
        const rem = (val.value / base).toFixed(4).replace(/\.?0+$/, '');
        val.value = `${rem}rem`;
      } else {
        convertPxNumbersToRem(val, base);
      }
    }
  }
}

// 깊은 병합
function mergeDeep(target, source) {
  for (const key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// 실행
try {
  const rawData = fs.readFileSync(inputFile, 'utf8');
  const inputJson = JSON.parse(rawData);

  const outputJson = {};

  // 제거 대상 루트 정리
  for (const key in inputJson) {
    if (REMOVE_KEYS.includes(key)) {
      mergeDeep(outputJson, inputJson[key]);
    } else {
      outputJson[key] = inputJson[key];
    }
  }

  // mode/light → light
  flattenModeKeys(outputJson);

  // 참조 경로 매핑 (대소문자 구분)
  const refMap = buildReferenceMap(outputJson);

  // 참조 경로 수정
  fixReferences(outputJson, refMap);

  // font-weight 변환
  convertFontWeight(outputJson);

  // px → rem 변환
  convertPxNumbersToRem(outputJson);

  // 저장
  fs.writeFileSync(outputFile, JSON.stringify(outputJson, null, 2), 'utf8');
  console.log(`✅ 참조값 대소문자 구분 포함 완료: ${outputFile}`);

} catch (err) {
  console.error('❌ 변환 오류:', err.message);
}
