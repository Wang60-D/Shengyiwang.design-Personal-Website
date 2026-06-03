# shengyiwang.design

王盛逸（Shengyi Wang）个人作品集网站。纯静态站点（HTML + CSS + 原生 JS，无构建步骤），托管于 **GitHub + Cloudflare Pages**。

## 页面结构

| 路径 | 说明 | 设计语言 |
|---|---|---|
| `index.html` | 个人介绍主页（简历、作品、背景、联系方式） | SpaceX 风 · 纯黑极简 |
| `projects/hardware.html` | 膝关节项目 · 硬件产品页 | Apple 风 · **滚动逐帧旋转 + 棚拍灯光扫过** |
| `projects/research.html` | 膝关节项目 · 阶段化康复与研究 | Apple 风 · 明亮 |
| `projects/ui.html` | 膝关节项目 · 移动端 UI 设计 | Apple 风 · 明亮 |
| `projects/knee.html` | 旧链接 → 自动跳转到 hardware.html | — |

设计 token 转写自 `awesome-design-md` 仓库的 `spacex/DESIGN.md` 与 `nike/DESIGN.md`（首页参考 SpaceX，硬件页的滚动旋转参考 Apple 产品页）。

## 目录

```
shengyiwang-site/
├── index.html                     # 个人主页
├── projects/
│   ├── hardware.html              # 硬件（滚动旋转）
│   ├── research.html              # 研究
│   ├── ui.html                    # UI
│   └── knee.html                  # 旧链接重定向
├── assets/
│   ├── css/  home.css · project.css
│   ├── js/   scrubber.js · project.js
│   └── img/
│       ├── product-seq/           # ★ 产品旋转帧序列（frame_000.jpg …）
│       ├── diagrams/              # 框架 / 算法 / 架构图
│       └── ui/                    # App 原型 · 上位机截图
├── .nojekyll
└── README.md
```

字体走 Google Fonts CDN（Inter + Bebas Neue），无需本地安装。

---

## ★ 替换产品旋转帧（硬件页核心）

硬件页的「滚动时产品旋转 + 灯光扫过」是 Apple 官方那种 **canvas 逐帧滚动**方案。目前 `assets/img/product-seq/` 里是 **48 张程序生成的占位帧**，把你渲染的真实帧按同样规则替换即可：

- 命名：`frame_000.jpg`, `frame_001.jpg` … 三位数、从 `000` 起、连续不跳号
- 数量：默认 48 张（一圈 360°）。如果数量不同，改 `projects/hardware.html` 里 `<section class="scrub" data-frames="48" …>` 的 `data-frames`
- 建议：正方形画幅、深色棚拍背景、产品居中、每帧旋转角度均匀；分辨率 1000–1600px、JPG 体积可控
- 想换格式/位数：`data-ext="png"`、`data-pad="4"` 等都可在该标签上调

帧越多旋转越顺滑（48→72→120）。不替换也能正常上线，占位帧已能演示效果。

---

## 本地预览

```bash
cd shengyiwang-site && python3 -m http.server 8080
# 打开 http://localhost:8080
```
> 滚动到硬件页「看它转一圈」区域，向下滚动即可看到逐帧旋转。

---

## 部署：GitHub + Cloudflare Pages

### 1 · 推到 GitHub
```bash
cd shengyiwang-site
git init && git add . && git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/shengyiwang-design.git
git push -u origin main
```

### 2 · Cloudflare Pages 连接仓库
1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选择该仓库
3. 构建设置（纯静态，无需构建）：**Framework preset** = `None`，**Build command** 留空，**Build output directory** = `/`
4. **Save and Deploy** → 得到 `xxx.pages.dev` 临时域名，先确认正常

### 3 · 绑定 shengyiwang.design
- **域名已在 Cloudflare**：Pages 项目 → **Custom domains** → 添加 `shengyiwang.design`，DNS 自动配置
- **域名在别处**：先 Dashboard → **Add a site** 把域名迁入 Cloudflare，按提示到注册商改 nameserver，生效后再绑定

SSL 由 Cloudflare 自动签发。之后 `git push` 到 `main` 即自动重新部署。

---

## 仍可补充的素材

见 `ASSETS_NEEDED.md`。最关键：**产品旋转帧序列**（硬件页）与**支具实物照**。当前用占位帧 + ProjectKnee 已有图，可直接上线。
