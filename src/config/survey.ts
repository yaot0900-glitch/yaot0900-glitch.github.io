/**
 * 问卷与数据收集配置
 *
 * 使用方法：
 * 1. 将你的问卷星链接填入下方的 PRE_TEST_URL 和 POST_TEST_URL
 * 2. 将二维码图片放入 public/images/ 目录，更新下方路径
 * 3. Google Sheets 数据收集：参考下方 GOOGLE_SCRIPT_URL 注释说明
 */

/** 问卷星前测链接 */
export const PRE_TEST_URL = 'https://v.wjx.cn/vm/Q5r1tXu.aspx'

/** 问卷星后测链接 */
export const POST_TEST_URL = 'https://v.wjx.cn/vm/OrMMUfZ.aspx'

/** 前测问卷二维码图片路径（放在 public/images/ 下） */
export const PRE_TEST_QR = 'images/qr-pre-test.png' // 二维码图片暂未放置

/** 后测问卷二维码图片路径（放在 public/images/ 下） */
export const POST_TEST_QR = 'images/qr-post-test.png' // 二维码图片暂未放置

/**
 * Google Apps Script 部署 URL（数据收集用）
 *
 * 设置步骤：
 * 1. 创建 Google Sheet，第一行填入列名
 * 2. 扩展程序 → Apps Script，粘贴部署脚本
 * 3. 部署 → 新部署 → 网页应用（执行身份：我，访问权限：任何人）
 * 4. 将部署 URL 填入下方
 *
 * 详见 docs/google-sheets-setup.md
 */
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZmZfiyIXFkOnHAm-NKHtJWNPMQyakj7FgJs0VwMn2tQL0exT_qBK2yVyaFfCJdAR9/exec'
