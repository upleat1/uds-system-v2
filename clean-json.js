const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, './tokens/tokens-figma.json'); // Figma에서 추출한 JSON 파일 경로
const outputFile = path.join(__dirname, './tokens/tokens.json'); // 변환된 JSON 파일을 저장할 경로

// 제거할 루트 경로들
const REMOVE_KEYS = [
  "primitive/Value-set",
  "semantic/Value-set"
];

// mode/{key} 구조를 {key}로 변환하는 함수
function removeModeKeyAndTransform(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (key.startsWith('mode/')) {
        // 'mode/' 앞부분을 제거하고 나머지 부분만 추출
        const newKey = key.replace(/^mode\//, '');
        obj[newKey] = obj[key];
        delete obj[key]; // 'mode/{key}' 키 삭제
      } else {
        // 다른 객체 속성들에 대해 재귀 호출
        removeModeKeyAndTransform(obj[key]);
      }
    }
  }
}

// 참조 경로 맵을 생성: { "primary.100": "light.primary.100", ... }
function buildReferenceMap(obj, parentPath = [], map = {}) {
  for (const key in obj) {
    const val = obj[key];
    const currentPath = [...parentPath, key];

    if (val?.value !== undefined) {
      const shortKey = currentPath.slice(-2).join('.');
      const fullKey = currentPath.join('.');
      map[shortKey] = fullKey;
    }

    if (typeof val === 'object' && val !== null) {
      buildReferenceMap(val, currentPath, map);
    }
  }
  return map;
}

// 참조 문자열을 실제 경로 기반으로 수정하고 mode 제거
function fixValueReferences(obj, refMap) {
  const refRegex = /\{([a-zA-Z0-9._-]+)\}/g;

  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      if (typeof val.value === 'string') {
        val.value = val.value.replace(refRegex, (_, refPath) => {
          // 'mode' 부분을 제거
          const fixedRefPath = refPath.replace(/^mode\./, '');  // mode를 제거
          return `{${refMap[fixedRefPath] || fixedRefPath}}`;  // 참조 경로를 실제 경로로 변경
        });
      }
      fixValueReferences(val, refMap);
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

  // 불필요한 루트 제거 및 병합
  for (const key in inputJson) {
    if (REMOVE_KEYS.includes(key)) {
      mergeDeep(outputJson, inputJson[key]);
    } else {
      outputJson[key] = inputJson[key];
    }
  }

  // mode/{key} 구조를 {key}로 변환
  removeModeKeyAndTransform(outputJson);  // 'mode' → 제거하고, 나머지 키만 추출

  // 참조 경로 자동 보정
  const refMap = buildReferenceMap(outputJson);
  fixValueReferences(outputJson, refMap);

  // font-weight 변환
  convertFontWeight(outputJson);

  // px → rem 변환
  convertPxNumbersToRem(outputJson);

  // 저장
  fs.writeFileSync(outputFile, JSON.stringify(outputJson, null, 2), 'utf8');
  console.log(`✅ 변환 완료! 저장 경로: ${outputFile}`);

} catch (err) {
  console.error('❌ 변환 중 오류 발생:', err.message);
}
