# 第七期改版：全局放大 + 圆角增大 + 霓虹光效

## 背景

用户反馈 UI 太挤，要求参考 sbti.how 的宽敞风格：
1. 所有卡片字体放大、间距拉宽
2. 圆角增大（卡片 20px、按钮 16px）
3. 悬停时金色霓虹光效
4. 侧边卡片内容放大到与题目区域同等视觉重量

---

## 一、全局 CSS 改动（`src/index.css`）

### 1.1 圆角统一增大

| 元素 | 旧 | 新 |
|------|-----|-----|
| `.glass-card` | `border-radius: 16px` | `border-radius: 20px` |
| `.panel-dark` | `border-radius: 16px` | `border-radius: 20px` |
| `.btn-primary` | `border-radius: 12px` | `border-radius: 16px` |
| `.btn-secondary` | `border-radius: 12px` | `border-radius: 16px` |
| `.btn-judge` | `border-radius: 14px` | `border-radius: 16px` |

### 1.2 间距拉宽

| 元素 | 旧 | 新 |
|------|-----|-----|
| `.glass-card` padding (mobile) | `24px` | `32px` |
| `.glass-card` padding (desktop) | `32px` | `40px` |
| `.page-container` padding (mobile) | `40px 16px` | `56px 20px` |
| `.page-container` padding (tablet) | `56px 24px` | `72px 28px` |
| `.page-container` padding (desktop) | `64px 32px` | `80px 36px` |
| `.page-container` max-width (desktop) | `960px` | `1024px` |
| `.btn-primary` min-height | `52px` | `56px` |
| `.btn-primary` padding | `14px 36px` | `16px 40px` |
| `.btn-secondary` min-height | `48px` | `52px` |
| `.btn-secondary` padding | `12px 32px` | `14px 36px` |
| `.btn-judge` min-height | `60px` | `64px` |
| `.btn-judge` padding | `16px 44px` | `18px 48px` |
| h1 | `32px` | `36px` |
| h2 | `26px` | `28px` |
| h3 | `20px` | `22px` |
| `.panel-dark` padding | `20px` | `28px` |

### 1.3 金色霓虹光效（新增）

```css
/* 卡片悬浮 — 金色霓虹光晕 */
.glass-card:hover {
  box-shadow: 0 0 24px rgba(212, 168, 67, 0.2), 0 1px 3px rgba(44, 62, 90, 0.06);
}

/* 按钮悬浮 — 增强金色发光 */
.btn-primary:hover {
  box-shadow: 0 0 32px rgba(212, 168, 67, 0.55), 0 6px 28px rgba(212, 168, 67, 0.4);
}

/* 选项卡片 — 霓虹边框悬浮 */
.option-card-hover:hover {
  border-color: rgba(212, 168, 67, 0.5);
  box-shadow: 0 0 16px rgba(212, 168, 67, 0.2);
  background: #FFFAF2; /* 微微变亮 */
}
```

### 1.4 面板悬浮

```css
.panel-dark:hover {
  box-shadow: 0 0 20px rgba(212, 168, 67, 0.15);
}
```

---

## 二、组件改动

### 2.1 `Button.tsx` — 圆角+尺寸+光效

| 属性 | 旧 | 新 |
|------|-----|-----|
| primary rounded | `rounded-xl` (12px) | `rounded-2xl` (16px) |
| primary min-h | `52px` | `56px` |
| primary px | `px-10` | `px-12` |
| primary py | `py-3.5` | `py-4` |
| secondary rounded | `rounded-xl` | `rounded-2xl` |
| secondary min-h | `48px` | `52px` |
| judge rounded | `rounded-2xl` | `rounded-[16px]`（等于 rounded-2xl，保持不变） |
| judge min-h | `60px` | `64px` |
| All variants hover | 旧 shadow | 加入金色霓虹 glow: `hover:shadow-[0_0_28px_rgba(212,168,67,0.35)]` |

### 2.2 `CountdownBar.tsx` — 内容放大

| 属性 | 旧 | 新 |
|------|-----|-----|
| card padding | `!p-5` | `!p-7` |
| icon | `text-3xl` | `text-4xl` |
| number | `text-3xl` | `text-4xl` |
| progress bar height | `h-3` | `h-4` |
| label "秒" | `text-xs` | `text-sm` |

### 2.3 `CredibilityStars.tsx` — 内容放大

| 属性 | 旧 | 新 |
|------|-----|-----|
| card padding | `!p-5` | `!p-7` |
| icon | `text-3xl` | `text-4xl` |
| stars | `text-2xl` | `text-3xl` |
| star gap | `gap-1.5` | `gap-2` |
| label | `text-sm` | `text-base` |

### 2.4 `QuestionCard.tsx` — 内容放大

| 属性 | 旧 | 新 |
|------|-----|-----|
| text padding | `p-4` | `p-6` |
| text size | `text-base` | `text-lg` |
| source bar padding | `px-4 py-2` | `px-5 py-2.5` |
| source text | `text-xs` | `text-sm` |

### 2.5 `TrackCard.tsx` — hover 霓虹光效

| 属性 | 旧 | 新 |
|------|-----|-----|
| card | `glass-card` | `glass-card` + hover neon glow |
| active glow | `shadow-[0_0_30px_rgba(...)]` | enhanced gold component: `shadow-[0_0_40px_rgba(212,168,67,0.3)]` |
| card padding | `p-4` | `p-5` |
| title | `text-base` | `text-lg` |
| tagline | `text-xs` | `text-sm` |

---

## 三、页面改动

### 3.1 `QuizPage.tsx`

- 按钮间距：`gap-4` → `gap-5`
- 侧边栏间距：`space-y-4` → `space-y-5`（约一指宽 20px）
- 手机端侧边栏间距：`space-y-3` → `space-y-4`（16px）
- 分数显示：`text-2xl` → `text-3xl`
- 题目卡片外间距：`mt-6` → `mt-8`

### 3.2 `AiImagePage.tsx`

- 侧边栏：`space-y-4` → `space-y-5`
- 手机端：`space-y-3` → `space-y-4`
- 图片区域圆角：`rounded-xl` → `rounded-2xl`（12px→16px）
- 标签间距：`gap-1` → `gap-2`
- 已标记区域：`mt-3` → `mt-4`

### 3.3 `AiTextPage.tsx`

- 侧边栏：`space-y-4` → `space-y-5`
- 手机端：`space-y-3` → `space-y-4`
- 选项卡片：`p-3` → `p-4`，`rounded-xl` → `rounded-2xl`
- 选项卡片 hover：加入金色霓虹边框 + 背景微微变亮
- 消息内容卡片：`p-4` → `p-5`，文字 `text-sm` → `text-base`

### 3.4 `TrackSelectPage.tsx`

- 卡片间距：`space-y-4` → `space-y-5`
- 页面标题：`text-xl` → `text-2xl`
- 已完成卡片 padding：`p-5` → `p-6`

### 3.5 `HomePage.tsx`

- 故事卡片：`p-6` → `p-8`，`min-h-[260px]` → `min-h-[300px]`
- 输入框：`px-4 py-3.5` → `px-5 py-4`
- 输入框圆角：`rounded-xl` → `rounded-2xl`
- 按钮：`mt-4` → `mt-6`

### 3.6 `ReportPage.tsx`

- 所有 `.glass-card` 内 `p-5` → `p-7`
- 面板 `.panel-dark` 内 `p-5` → `p-7`
- 卡片间距：`mb-5` → `mb-6`
- 雷达图面板：`p-5` → `p-7`

### 3.7 `FeedbackModal.tsx`

- 弹窗：`p-6` → `p-8`
- 按钮间距：`mt-4` → `mt-6`

### 3.8 其余页面（`Level2Invite`, `RewardPage`, `SkipEndPage`）

- Card padding 统一：`p-4`/`p-5` → `p-6`/`p-7`
- 间距统一放大一个档位

---

## 四、执行顺序

1. ⚙️ `src/index.css` — 圆角、padding、字体、霓虹光效 CSS
2. 🔘 `src/components/Button.tsx` — 圆角+尺寸+glow
3. 🕐 `src/components/CountdownBar.tsx` — 内容放大
4. ☀️ `src/components/CredibilityStars.tsx` — 内容放大
5. 📦 `src/components/QuestionCard.tsx` — padding+字体
6. 🃏 `src/components/TrackCard.tsx` — hover glow
7. 📄 `src/pages/QuizPage.tsx` — 间距+侧边栏
8. 📄 `src/pages/AiImagePage.tsx` — 间距+圆角
9. 📄 `src/pages/AiTextPage.tsx` — 选项卡片hover+间距
10. 📄 `src/pages/TrackSelectPage.tsx` — 间距
11. 📄 `src/pages/HomePage.tsx` — padding+间距
12. 📄 `src/pages/ReportPage.tsx` — padding
13. 📄 `src/pages/FeedbackModal.tsx` — padding
14. 📄 其余页面快速适配
15. ✅ TypeScript 编译验证

---

## 五、验证

```bash
npm run dev   # → http://localhost:5173
npx tsc --noEmit
```

### 检查清单
1. ✅ 所有卡片圆角增大（20px），按钮圆角增大（16px）
2. ✅ 卡片内边距明显增大，字体放大，不拥挤
3. ✅ 悬停任意卡片/按钮有金色霓虹光晕
4. ✅ 侧边栏卡片内容放大，与题目区视觉重量一致
5. ✅ 卡片之间间距约一指宽（16-20px）
6. ✅ 手机端同样放大、不拥挤
7. ✅ TypeScript 零错误
