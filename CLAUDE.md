# CLAUDE.md — 真相解码局项目指引

## 项目简介

「真相解码局 — 迷雾危机」是一款网页版虚假信息识别教育游戏，旨在提升玩家的媒体素养。纯前端应用，React + TypeScript + Vite 构建。

## 文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| 需求规格 | [docs/requirements.md](docs/requirements.md) | 功能清单与需求说明 |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) | 技术栈、目录结构、状态设计、路由 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 色彩、字体、组件尺寸、动画、响应式 |
| 执行步骤 | [docs/dev-steps.md](docs/dev-steps.md) | 分阶段开发清单与进度跟踪 |
| 完整方案 | [.claude/plans/5-ai-ai-ai-iu-piped-feigenbaum.md](.claude/plans/5-ai-ai-ai-iu-piped-feigenbaum.md) | 原始设计方案 |

## 开发日志

每日开发记录存放在 `devlog/` 文件夹，格式为 `YYYY-MM-DD.md`。

每次开发结束后更新对应日期的日志文件，记录：
- ✅ 完成事项
- 🚧 待办事项
- 🐛 遇到的问题

## 工作原则

1. **分阶段推进：** 严格按照 docs/dev-steps.md 中的阶段顺序开发，每阶段通过验证后再进入下一阶段。
2. **先读文档再动手：** 每次开发前查看 docs/ 下的相关规范文件。
3. **小步提交：** 每完成一个步骤就验证，不要一口气写很多代码再测试。
4. **设计规范优先：** 所有 UI 组件遵循 docs/design-spec.md 中的标准。
5. **温和反馈原则：** 所有面向用户的文字（反馈、提示、评语）必须用鼓励、温和的语气，绝不使用贬低或嘲讽的语言。
6. **手机优先：** 先确保手机端体验好，再适配电脑端。

## 常用命令

```bash
npm run dev      # 启动开发服务器（http://localhost:5173）
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```

## 素材替换指南

题目素材存放在 `src/data/questions.json`。需要替换图文内容时，编辑该文件即可，格式参考文件内注释。

图片素材放在 `public/images/` 目录下，在 questions.json 中以相对路径引用。
