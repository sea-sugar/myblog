const fs = require('fs');
const crypto = require('crypto');

// 生成 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // 密钥长度
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// 将公钥保存到文件
fs.writeFileSync('public.pem', publicKey);
console.log('公钥已保存到 public.pem');

// 将私钥保存到文件（请妥善保管私钥）
fs.writeFileSync('private.pem', privateKey);
console.log('私钥已保存到 private.pem');
