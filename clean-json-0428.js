const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, './tokens-figma/tokens-figma.json');
const outputFile = path.join(__dirname, './tokens/tokens.json');

// 제거할 루트 경로들
const REMOVE_KEYS = [
  "primitive/Value-set",
  "component/Value-set",
  "semantic/light"
];

// font-weight 변환 맵
const fontWeightMap = {
  "regular": 400,
  "semibold": 600,
  "bold": 700
};

// font-weight 변환 함수
function convertFontWeight(obj) {
  if (typeof obj !== 'object') return;

  for (const key in obj) {
    const val = obj[key];
    if (val && val.type === 'text' && fontWeightMap[val.value.toLowerCase()]) {
      val.value = fontWeightMap[val.value.toLowerCase()]; // 숫자 값으로 변환
    } else {
      convertFontWeight(val); // 재귀
    }
  }
}

// px → rem 변환 함수
function convertPxNumbersToRem(obj, base = 10) {
  if (typeof obj !== 'object') return;

  for (const key in obj) {
    const val = obj[key];
    if (val && typeof val.value === 'number' && val.type === 'number') {
      val.value = `${(val.value / base).toFixed(4).replace(/\.?0+$/, '')}rem`; // rem으로 변환
    } else {
      convertPxNumbersToRem(val, base); // 재귀
    }
  }
}

// 깊은 병합 함수
function mergeDeep(target, source) {
  if (typeof source !== 'object' || source === null) return target;

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = mergeDeep(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  return target;
}

// 실행 함수
async function processTokens() {
  try {
    const rawData = await fs.promises.readFile(inputFile, 'utf8');
    const inputJson = JSON.parse(rawData);
    const outputJson = {};

    // 불필요한 데이터 제거 및 깊은 병합
    Object.keys(inputJson).forEach(key => {
      if (REMOVE_KEYS.includes(key)) {
        mergeDeep(outputJson, inputJson[key]);
      } else {
        outputJson[key] = inputJson[key];
      }
    });

    // font-weight 값 변환
    convertFontWeight(outputJson);

    // px → rem 변환
    convertPxNumbersToRem(outputJson);

    // 변환된 JSON 파일로 저장
    await fs.promises.writeFile(outputFile, JSON.stringify(outputJson, null, 2), 'utf8');
    console.log(`✅ 변환 완료! 모든 px 숫자가 10px 기준 rem으로 처리되었습니다. 저장 경로: ${outputFile}`);
  } catch (err) {
    console.error('❌ 변환 중 오류 발생:', err.message);
  }
}

// 실행
processTokens();
