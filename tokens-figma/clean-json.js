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

function mergeDeep(target, source) {
  for (const key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key)
      && typeof source[key] === 'object'
      && !Array.isArray(source[key])
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

  fs.writeFileSync(outputFile, JSON.stringify(outputJson, null, 2), 'utf8');
  console.log(`✅ 변환 완료! 파일 경로: ${outputFile}`);
} catch (err) {
  console.error('❌ 변환 중 오류 발생:', err.message);
}