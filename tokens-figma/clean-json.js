const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'tokens-figma.json');
const outputFile = path.join(__dirname, '../tokens/tokens.json');

// 제거할 루트 경로들
const REMOVE_KEYS = [
  'primitive/Value-set',
  'component/Value-set',
  'semantic/Value-set'
];

// 현재 rem 값은 1rem = 16px 기준으로 되어 있음
// 이를 1rem = 10px 기준으로 재계산하려면 rem 값을 × (16 / 10)
function adjustRemValues(str, oldBase = 16, newBase = 10) {
  const ratio = oldBase / newBase; // 1.6
  return str.replace(/(-?\d*\.?\d+)rem/g, (_, value) => {
    const rem = parseFloat(value);
    const adjusted = (rem * ratio).toFixed(4).replace(/\.?0+$/, ''); // 끝 0 제거
    return `${adjusted}rem`;
  });
}

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

try {
  const rawData = fs.readFileSync(inputFile, 'utf8');
  const inputJson = JSON.parse(rawData);

  const outputJson = {};

  for (const key in inputJson) {
    if (REMOVE_KEYS.includes(key)) {
      mergeDeep(outputJson, inputJson[key]); // 내부 값 병합
    } else {
      outputJson[key] = inputJson[key]; // 그대로 유지
    }
  }

  // rem 값 변환: 16px 기준 → 10px 기준 (값이 더 커짐)
  const adjustedJsonStr = adjustRemValues(JSON.stringify(outputJson, null, 2));

  fs.writeFileSync(outputFile, adjustedJsonStr, 'utf8');
  console.log(`✅ 변환 완료! rem 기준이 10px로 재계산되었습니다. 파일 경로: ${outputFile}`);
} catch (err) {
  console.error('❌ 변환 중 오류 발생:', err.message);
}