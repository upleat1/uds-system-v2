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

// 숫자(px)를 10px = 1rem 기준 rem 문자열로 변환
function convertPxNumbersToRem(obj, base = 10) {
  for (const key in obj) {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      if (typeof val.value === 'number' && val.type === 'number') {
        const rem = (val.value / base).toFixed(4).replace(/\.?0+$/, '');
        val.value = `${rem}rem`;
      } else {
        convertPxNumbersToRem(val, base); // 재귀
      }
    }
  }
}

// 깊은 병합 함수
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

  // 불필요한 데이터 제거
  for (const key in inputJson) {
    if (REMOVE_KEYS.includes(key)) {
      mergeDeep(outputJson, inputJson[key]);
    } else {
      outputJson[key] = inputJson[key];
    }
  }

  // px → rem 변환 (10px = 1rem 기준)
  convertPxNumbersToRem(outputJson);

  // 변환된 JSON 파일로 저장
  fs.writeFileSync(outputFile, JSON.stringify(outputJson, null, 2), 'utf8');
  console.log(`✅ 변환 완료! 모든 px 숫자가 10px 기준 rem으로 처리되었습니다. 저장 경로: ${outputFile}`);

} catch (err) {
  console.error('❌ 변환 중 오류 발생:', err.message);
}
