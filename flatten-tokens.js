// flatten-tokens.js
const fs = require('fs');

// tokens.json 읽기
const raw = JSON.parse(fs.readFileSync('tokens.json', 'utf-8'));
const flattened = {};

// 폴더 제거
Object.entries(raw).forEach(([group, tokens]) => {
  Object.entries(tokens).forEach(([key, value]) => {
    flattened[key] = value;
  });
});

// 결과 저장
fs.writeFileSync('flattened-tokens.json', JSON.stringify(flattened, null, 2));
console.log('✅ 폴더 제거 완료 → flattened-tokens.json 생성');