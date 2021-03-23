
const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();

router.get('/svg', (req, res) => {
  const cap = svgCaptcha.create({
    // 翻转颜色
    inverse: false,
    // 字体大小
    fontSize: 36,
    // 噪声线条数
    noise: 3,
    // 宽度
    width: 80,
    // 高度
    height: 30,
  });
  if (req.session.user != '') {
    req.session.captcha = cap.text; // session 存储验证码数值
  }
  res.type('svg'); // 响应的类型
  res.send(cap.data)
})

module.exports = router;