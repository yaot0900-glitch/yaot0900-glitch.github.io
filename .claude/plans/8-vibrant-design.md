# 第八期：多彩明亮视觉重构

## 背景

用户反馈：
1. 当前配色太单调，所有卡片都是同一奶油白，缺乏视觉冲击力
2. 背景平铺单色 #B8D8E8，太单一
3. 报告页面布局不居中
4. 需要模仿参考图的丰富明亮色彩风格

---

## 一、新色彩系统

### 1.1 全局背景 — 多彩径向渐变

废弃纯色背景，改用多个径向光斑叠加：

```css
body {
  background:
    /* 左上：暖金色柔和光斑 */
    radial-gradient(ellipse 600px 500px at 15% 20%, rgba(244, 197, 66, 0.18) 0%, transparent 60%),
    /* 右上：珊瑚粉光斑 */
    radial-gradient(ellipse 500px 450px at 80% 15%, rgba(240, 160, 144, 0.16) 0%, transparent 55%),
    /* 左下：天蓝光斑 */
    radial-gradient(ellipse 550px 500px at 20% 75%, rgba(126, 200, 227, 0.20) 0%, transparent 55%),
    /* 右下：淡紫光斑 */
    radial-gradient(ellipse 450px 400px at 75% 80%, rgba(184, 160, 224, 0.14) 0%, transparent 55%),
    /* 基底浅蓝 */
    #D6EAEF;
}
```

效果：四个彩色光斑从不同角落柔和过渡，类似参考图的丰富背景。

### 1.2 卡片差异化配色

每个功能区用不同颜色卡片，一眼可辨：

| 卡片 | 背景色 | 边框色 | 用途 |
|------|--------|--------|------|
| `.card-question` | `#FFFDF8` 暖白 | `#E8DDD0` 暖灰 | 题目内容 |
| `.card-countdown` | `#EDF6FA` 淡蓝 | `#B8D8E8` 天蓝 | 倒计时（传达时间感） |
| `.card-credibility` | `#FFF8E8` 暖金淡 | `#F0D878` 金色 | 信誉值（传达温暖/信任） |
| `.card-info` | `#F5F0FF` 淡紫 | `#D0C8E8` 淡紫灰 | 辅助信息（赛道、进度） |
| `.panel-dark` | `rgba(212,168,67,0.10)` | `rgba(212,168,67,0.25)` | 暖金面板（保持） |

### 1.3 增强色板 Tokens

在现有色板基础上，增加明亮变体：

```css
--color-sky-bright: #5BA4CF;        /* 更饱和的天蓝（倒计时hover边框） */
--color-gold-bright: #F4C542;       /* 更亮的金色（背景光斑） */
--color-coral-bright: #F0A090;      /* 明亮的珊瑚（强调点缀） */
--color-lavender: #B8A0E0;          /* 淡紫（背景光斑+info卡片） */
--color-lavender-light: #F0EBF8;    /* 极淡紫（info卡片bg） */
--color-blue-light: #EDF6FA;        /* 极淡蓝（倒计时卡片bg） */
--color-gold-light: #FFF8E8;        /* 极淡金（信誉值卡片bg） */
```

---

## 二、卡片 CSS 类

### 2.1 新增卡片变体

```css
/* 倒计时卡片 — 淡蓝调 */
.card-countdown {
  background: #EDF6FA;
  border: 1px solid #B8D8E8;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(44, 62, 90, 0.04);
  padding: 32px;
  transition: box-shadow 0.2s ease;
}
.card-countdown:hover {
  box-shadow: 0 0 20px rgba(91, 164, 207, 0.25);
}

/* 信誉值卡片 — 暖金淡调 */
.card-credibility {
  background: #FFF8E8;
  border: 1px solid #F0D878;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(44, 62, 90, 0.04);
  padding: 32px;
  transition: box-shadow 0.2s ease;
}
.card-credibility:hover {
  box-shadow: 0 0 20px rgba(212, 168, 67, 0.3);
}

/* 题目卡片 — 暖白调（原 glass-card 升级） */
.card-question {
  background: #FFFDF8;
  border: 1px solid #E8DDD0;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(44, 62, 90, 0.05);
  color: #2C3E5A;
  padding: 32px;
  transition: box-shadow 0.2s ease;
}
.card-question:hover {
  box-shadow: 0 2px 16px rgba(44, 62, 90, 0.08);
}

/* 辅助信息卡片 — 淡紫调 */
.card-info {
  background: #F5F0FF;
  border: 1px solid #D0C8E8;
  border-radius: 20px;
  padding: 28px;
  transition: box-shadow 0.2s ease;
}
.card-info:hover {
  box-shadow: 0 0 16px rgba(184, 160, 224, 0.2);
}
```

### 2.2 旧 `.glass-card` 保留

`.glass-card` 保留为通用卡片类（暖白），向后兼容。

---

## 三、组件更新

### 3.1 `CountdownBar.tsx`
- `className` 从 `glass-card` → `card-countdown`
- 进度条内部色：`bg-[#E8DDD0]` → `bg-[#D0E4F0]`（淡蓝底）
- hover 发光：蓝色系

### 3.2 `CredibilityStars.tsx`
- `className` 从 `glass-card` → `card-credibility`
- hover 发光：金色系

### 3.3 `QuestionCard.tsx`
- `className` 从 `glass-card` → `card-question`
- 来源栏：`bg-[#F5EDE0]` → `bg-[#F8F4EB]`

### 3.4 `TrackCard.tsx`
- 保持 `glass-card` 但 hover 增强金色霓虹

### 3.5 `FeedbackModal.tsx`
- 弹窗卡片：保持 `glass-card`

---

## 四、页面更新

### 4.1 `QuizPage.tsx`
- 侧边栏 info 卡片：`glass-card` → `card-info`
- 题目卡片：保持 QuestionCard（内部已用 card-question）
- 报告页面居中问题也在此修复

### 4.2 `AiImagePage.tsx`
- 侧边栏 info 卡片：`card-info`
- 图片区：淡蓝背景保留

### 4.3 `AiTextPage.tsx`
- 侧边栏 info 卡片：`card-info`
- 选项卡片 hover 保持霓虹效果

### 4.4 `ReportPage.tsx`
- 居中修复：
  - `page-container` 添加 `items-center`（全局CSS）
  - 所有 `lg:max-w-3xl lg:mx-auto` 确保在flex列中正确居中
- 各类卡片分别使用对应变体

### 4.5 其余页面
- `HomePage.tsx`, `TrackSelectPage.tsx`, `RewardPage.tsx`, `Level2Invite.tsx`, `SkipEndPage.tsx`：统一使用 `card-question` 或 `glass-card`

---

## 五、居中对齐修复

`.page-container` 目前只是 `display: flex; flex-direction: column;`，没有 `align-items: center`。改为：

```css
.page-container {
  align-items: center;  /* 新增：子元素水平居中 */
}
```

ReportPage 内部的 `lg:max-w-3xl lg:mx-auto` 配合 `.page-container` 的 `items-center` 即可正确居中。

---

## 六、执行顺序

1. `src/index.css` — 背景渐变、新增 card-* CSS类、增强色板
2. `src/components/CountdownBar.tsx` — 改用 card-countdown
3. `src/components/CredibilityStars.tsx` — 改用 card-credibility
4. `src/components/QuestionCard.tsx` — 改用 card-question
5. `src/pages/QuizPage.tsx` — info卡+居中
6. `src/pages/AiImagePage.tsx` — info卡
7. `src/pages/AiTextPage.tsx` — info卡
8. `src/pages/ReportPage.tsx` — 居中+卡片配色
9. 其余页面适配
10. TypeScript 编译验证

---

## 七、验证

```bash
npm run dev   # → http://localhost:5173
npx tsc --noEmit
```

### 检查清单
1. ✅ 背景有多色径向渐变光斑，不再单调
2. ✅ 倒计时卡片淡蓝色、信誉值卡片暖金色、题目卡片暖白色——每个不同
3. ✅ 报告页面内容居中
4. ✅ 整体色彩丰富明亮，有视觉冲击力
5. ✅ TypeScript 零错误
