# 第九期：半透明毛玻璃 + 亮色 + 明暗对比

## 背景

用户反馈：
1. 当前卡片颜色太寡淡，需要更亮、更透明
2. 侧边卡片做半透明毛玻璃效果，透出背景光斑
3. 亮黄色、亮蓝色玻璃卡片 + 深棕色边框，形成明暗对比
4. 部分卡片用暗底（深棕）+ 亮字，交替明暗

---

## 一、新增色板

| Token | Hex | 用途 |
|-------|-----|------|
| `--color-brown-dark` | `#4A3525` | 暗底卡片背景、深色边框 |
| `--color-brown-mid` | `#8B7355` | 浅棕色边框 |
| `--color-brown-light` | `#C4A882` | 极浅棕（暗卡片内边框） |
| `--color-gold-glass` | `rgba(244,197,66,0.20)` | 暖金毛玻璃底 |
| `--color-blue-glass` | `rgba(91,164,207,0.18)` | 天蓝毛玻璃底 |
| `--color-cream-glass` | `rgba(255,253,248,0.65)` | 暖白毛玻璃底 |
| `--color-lavender-glass` | `rgba(184,160,224,0.14)` | 淡紫毛玻璃底 |
| `--color-brown-glass` | `rgba(74,53,37,0.85)` | 深棕毛玻璃暗卡 |

---

## 二、毛玻璃卡片体系（全部带 backdrop-blur）

### 2.1 亮色玻璃卡

| 类名 | 底色 | 边框 | 用途 |
|------|------|------|------|
| `.card-credibility` | 暖金玻璃 `rgba(244,197,66,0.20)` | 深棕 `#8B7355` | 信誉值 |
| `.card-countdown` | 天蓝玻璃 `rgba(91,164,207,0.18)` | 深棕 `#8B7355` | 倒计时 |
| `.card-info` | 淡紫玻璃 `rgba(184,160,224,0.14)` | 深棕 `#8B7355` | 辅助信息 |

### 2.2 中性玻璃卡

| 类名 | 底色 | 边框 | 用途 |
|------|------|------|------|
| `.glass-card` | 暖白玻璃 `rgba(255,253,248,0.65)` | 深棕 `#8B7355` | 通用内容卡 |
| `.card-question` | 暖白玻璃 `rgba(255,253,248,0.70)` | 深棕 `#8B7355` | 题目卡 |

### 2.3 暗底卡片（明暗对比）

| 类名 | 底色 | 边框 | 文字色 | 用途 |
|------|------|------|--------|------|
| `.card-dark` | 深棕玻璃 `rgba(74,53,37,0.88)` | `#6B5B3E` | `#F0D878` 金 + `#D4C8B0` 浅棕 | 面板、雷达图、特殊区块 |

暗卡片内部：
```css
.card-dark { color: #D4C8B0; }
.card-dark .text-accent { color: #F4C542; }
.card-dark .text-text-primary { color: #F0D878; }
.card-dark .text-text-secondary { color: #C4A882; }
.card-dark .text-text-muted { color: #A09080; }
```

---

## 三、全局毛玻璃基础

所有卡片统一添加 `backdrop-filter: blur(12px)`：

```css
.glass-card,
.card-countdown,
.card-credibility,
.card-question,
.card-info,
.card-dark {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

---

## 四、组件/页面改动

### 4.1 `src/index.css`
- 添加深棕色系 tokens
- 所有 card-* 改为半透明底色 + blur
- 新增 `.card-dark` 暗底卡片
- 背景光斑稍微加强饱和度

### 4.2 `ReportPage.tsx`
- 雷达图面板 `.panel-dark` → `.card-dark`
- 维度详情面板 → `.card-dark`
- 部分卡片暗底亮字，形成明暗交替

### 4.3 `FeedbackModal.tsx` — 弹窗放大 1.5 倍
- padding：`p-8` → `p-12`
- 标题：`text-2xl` → `text-3xl`
- emoji：`text-5xl` → `text-6xl`
- 正文：`text-base` → `text-lg`
- 分数：`text-xl` → `text-2xl`
- 按钮：`btn-primary` 已是统一样式
- 弹窗宽度：`max-w-md` → `max-w-lg`

### 4.4 其余页面
- 保持现有卡片类名，自动继承新的毛玻璃效果
- 部分区域可选择性用 `.card-dark`

---

## 五、执行顺序

1. `src/index.css` — 色板+毛玻璃+暗卡类
2. `ReportPage.tsx` — 暗卡交替
3. 验证效果
4. TypeScript 编译

---

## 六、验证

```bash
npx tsc --noEmit
```

检查清单：
1. ✅ 所有卡片半透明 blur，透出背景光斑
2. ✅ 倒计时亮蓝玻璃、信誉值亮金玻璃
3. ✅ 深棕色边框形成明暗对比
4. ✅ 部分区域暗底+亮字
5. ✅ TypeScript 零错误
