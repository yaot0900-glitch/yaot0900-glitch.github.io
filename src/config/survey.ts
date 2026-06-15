/**
 * 数据收集配置
 *
 * 前后测问卷已内建到游戏中（src/data/questionnaire.ts），不再使用问卷星。
 * 游戏数据通过 Google Sheets 收集。
 *
 * Google Apps Script 设置步骤：
 * 1. 创建 Google Sheet，第一行填入列名
 * 2. 扩展程序 → Apps Script，粘贴部署脚本
 * 3. 部署 → 新部署 → 网页应用（执行身份：我，访问权限：任何人）
 * 4. 将部署 URL 填入下方
 *
 * 详见 GOOGLE_SHEETS_SETUP.md
 */
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzs4wMJS_ub03S8MvgGTiDmC3dbcjaU7_brYgSDsrixGUu9vqXulOjeTOubWoHej8YK/exec'
