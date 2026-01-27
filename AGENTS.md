# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-27
**Commit:** 6323251
**Branch:** main

## OVERVIEW

AI Agent 社会实验平台：配置 AI 角色/场景/问卷 → 批量运行 Agent 决策 → 统计分析报告。纯前端静态站点，无后端依赖。

## STRUCTURE

```
./
├── index.html         # 项目管理大盘（实验列表、CRUD）
├── design.html        # 实验配置中心（角色/场景/选项/参数）
├── monitor.html       # 实时执行监控（进度条、日志流）
├── report.html        # 统计报告（图表、详细记录表）
├── roles.html         # 角色模板库
├── api.html           # API 密钥配置（OpenAI）
├── settings.html      # 系统设置（主题切换、数据重置）
├── js/                # 核心逻辑
│   ├── app.js         # 状态管理、模拟引擎、API 调用
│   └── templates.js   # 角色模板定义
├── design/            # UI 设计稿参考（screen.png + code.html）
└── README.md
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| 新增页面 | `*.html` | 复制现有页面结构，保持 sidebar 一致 |
| 核心业务逻辑 | `js/app.js` | 所有状态管理、API 调用、模拟逻辑 |
| 角色模板数据 | `js/templates.js` | 预定义角色模板配置 |
| Tailwind 配置 | 各 HTML `<script id="tailwind-config">` | 每个页面内联配置 |
| LocalStorage 操作 | `js/app.js` 前 100 行 | getExperiments/saveExperiment 等 |
| OpenAI API 调用 | `js/app.js:124-196` | processAgent 函数 |
| UI 设计参考 | `design/*/screen.png` | 中文目录名，含截图和参考代码 |

## CONVENTIONS

### Tailwind 配置（每页内联）

```javascript
// 必须在每个 HTML <head> 中包含
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#136dec",           // 主色
        "background-light": "#f6f7f8",  // 浅色背景
        "background-dark": "#101822",   // 深色背景
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      }
    }
  }
}
```

### LocalStorage Keys

| Key | 用途 |
|-----|------|
| `longer_ai_experiments` | 实验数据（JSON 数组） |
| `openai_api_key` | OpenAI API Key |
| `openai_base_url` | 自定义 API 端点 |
| `openai_model` | 模型名（默认 gpt-3.5-turbo） |
| `theme` | dark/light |

### 图标系统

使用 Material Symbols Outlined：
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<span class="material-symbols-outlined">icon_name</span>
```

### 侧边栏（index/api/settings 共享）

页面间导航一致，当前页高亮用 `bg-primary/10 text-primary`。

## ANTI-PATTERNS (THIS PROJECT)

- **不要**添加构建工具（webpack/vite）- 保持纯静态
- **不要**用 npm/yarn - CDN 加载所有依赖
- **不要**修改 API 调用逻辑时忘记更新 mock fallback
- **不要**在非 sidebar 页面（design/monitor/report）添加侧边栏

## UNIQUE STYLES

### 实验状态流

```
draft → running → completed
```

### 数据结构

```javascript
experiment = {
  id: "EXP-timestamp-random",
  config: { personaName, backgroundStory, scenarioDescription, coreQuestion, options, instanceCount, isParallel },
  status: "draft|running|completed",
  logs: [{ agentId, option, reasoning, time, timestamp }],
  stats: { total, options: {A: count, B: count}, times: [] },
  viewed: boolean  // 用于通知小红点
}
```

### 并行模式

`isParallel: true` 时以 batch=10 并发执行，避免浏览器冻结。

## COMMANDS

```bash
# 无构建命令 - 直接打开 HTML
start index.html  # Windows
open index.html   # macOS

# 如需本地服务器
npx serve .
python -m http.server 8000
```

## NOTES

- API Key 为空时使用 mock 数据（随机选项 + 模板推理）
- `response_format: { type: "json_object" }` 强制 JSON 输出
- 报告页表格限制 100 条以提升性能
- 深色模式通过 `<html class="dark">` 控制
- 中文 UI，部分占位文本为英文
