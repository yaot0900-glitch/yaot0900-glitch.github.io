/**
 * 生成游戏入口二维码
 * 用法: node scripts/generate-qr.mjs
 * 输出: public/images/qr-game.png
 */
import QRCode from 'qrcode'
import { writeFileSync } from 'fs'

const GAME_URL = 'https://yaot0900-glitch.github.io/'

QRCode.toBuffer(GAME_URL, {
  type: 'png',
  width: 512,
  margin: 2,
  color: { dark: '#2c2416', light: '#ffffff' },
})
  .then(buffer => {
    writeFileSync('public/images/qr-game.png', buffer)
    console.log(`✅ 游戏二维码已生成: public/images/qr-game.png`)
    console.log(`   URL: ${GAME_URL}`)
  })
  .catch(err => {
    console.error('❌ 二维码生成失败:', err)
    process.exit(1)
  })
