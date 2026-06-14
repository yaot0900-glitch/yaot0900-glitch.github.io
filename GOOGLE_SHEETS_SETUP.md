# Google Sheets 数据收集 — 设置指南

## 第一步：创建 Google Sheet

1. 打开 [sheets.google.com](https://sheets.google.com)
2. 创建空白表格，第一行填入列名：

```
A: 参与者编号
B: 玩家代号
C: 时间戳
D: 赛道
E: 赛道得分
F: 正确数
G: 总题数
H: 正确率
I: 答题详情(JSON)
J: 总分
K: 总正确数
L: 总题数
M: 总正确率
N: AI关卡完成
O: AI关卡得分
P: 信誉值
Q: 是否复活
```

## 第二步：创建 Apps Script

1. 菜单 **扩展程序 → Apps Script**
2. 粘贴以下代码：

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    const rows = [];
    for (const track of data.tracks) {
      rows.push([
        data.participantId,
        data.playerName,
        data.timestamp,
        track.track,
        track.score,
        track.correct,
        track.total,
        track.correctRate,
        JSON.stringify(track.answers),
        data.totalScore,
        data.totalCorrect,
        data.totalAnswered,
        data.overallCorrectRate,
        data.level2Complete ? '是' : '否',
        data.level2Score,
        data.credibility,
        data.hasRevived ? '是' : '否',
      ]);
    }

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, rows[0].length).setValues(rows);

    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.toString());
  }
}

function doGet() {
  return ContentService.createTextOutput('Google Sheets data collector is running.');
}
```

3. 保存，重命名为「真相解码局数据收集」

## 第三步：部署

1. 右上角 **部署 → 新部署**
2. 类型：**网页应用**
3. 执行身份：**我**，访问权限：**任何人**
4. 点击部署，复制 URL

## 第四步：配置

编辑 `src/config/survey.ts`，填入 URL：

```ts
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/xxxxx/exec'
```

重新构建：

```bash
npm run build
```
