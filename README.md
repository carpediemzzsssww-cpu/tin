# TIN · 把日常装进去

**正式试玩：[tin-orpin.vercel.app](https://tin-orpin.vercel.app)** · [GitHub](https://github.com/carpediemzzsssww-cpu/tin)

v0.7：选中物品后拖动圆形手柄旋转 / 缩放，或用双指移动、旋转、缩放。整盒「随机」位于右下角，抽屉「取物」按分类随机补充三件并寻找空位。五套主题、40 件原创物品、私人照片、纸件内容、叠放、配色、撤销重做及成品放大 / PNG 导出均可用。手机横屏抽屉移至右侧。

独立小工具源代码与打包说明在 [`tin-app/minitool`](tin-app/minitool/README.md)。上方预留容器安全区，采用原生相册 / 存储接口、离线资源和轻量降级。打包产物由工作区 `artifacts/` 单独交付。

私人作品和照片仅在设备内保存。网站与小工具是不同来源，草稿不自动互通。研究用参考图及用户截图仅留本地，公开仓库保留研究文档与来源记录。

---

## 项目记录

把照片、文字和日常小物收进一只私人铁盒。当前界面为全屏仿真桌面与底部长抽屉，已移除开场步骤、侧栏和装饰文案。独立手机网页原型位于 `tin-app/`，使用 React / TypeScript / Three.js，运行时不依赖第三方服务。

## 现在试玩

- 电脑：http://127.0.0.1:5175/
- 同一 Wi-Fi：http://10.131.145.164:5175/ （本次电脑地址；手机连通性、Safari 手势和实际帧率尚未真机验证）
- 40 件精选素材总览：http://127.0.0.1:5175/assets.html
- 研究参考板：http://127.0.0.1:5174/
- 六材质样品与新版长盒：http://127.0.0.1:5174/samples/

5173 属于原有应用，未改动。照片与作品保存在当前浏览器的 IndexedDB；不同地址、不同浏览器、不同设备不共享数据。清除网站数据会清除本机作品，成品可另存 PNG。

## 已实现

- Gate A 已确认「A 银色日常收藏」。Gate B 已通过，并按新参考改为 **140 × 90 × 19 mm 横向长盒**，修正开盖方向和遮挡。
- 进入桌面 → 点击铁盒开盖 → 从底部长抽屉选物 / 拖入 → 摆放与加入私人内容 → 合盖 / 再次打开。
- 40 件公共小物、六类抽屉、YOURS；拖放、双指旋转与有限缩放、叠放、靠边辅助、桌面暂存、拖回抽屉移除、撤销重做。
- 四种照片载体与裁切、三种文字载体；票根、小票、信纸、信封、钥匙牌、日历、数字、蕾丝、胶带和火漆均有对应编辑字段；旅行画片与胶片支持私人照片，胶片可逐格选择。
- 五套风格：午夜电台、粉色旅馆、魔法来信、蓝色周末、生日俱乐部。桌面「切换」直接浏览下一套已编排的 18–19 件完整成品，可撤销、保留照片库；抽屉「随机取物」直接添 3 件，遵循当前分类，保留现有作品。
- 「设置 → 清空物件」需二次确认，清空盒盖 / 底盘 / 桌面摆放，可撤销，保留照片素材与配色。
- 选中框旁直接上移 / 下移一层；「…」只保留款式、颜色、内容和大小，移除层级列表和标签页。眼镜 3 款、发圈 3 色、兰花 3 色、手作布偶 2 款；骰子、耳机、票根及纸胶带也可换款。
- 六类背景、四种内衬，桌面 / 纹样 / 盒身 / 内衬可自定义颜色；新增纸件自动置于下层，选定风格后添加的可变色装饰跟随其主色。
- 本地花体与中文手写字体；标题颜色、字号、倾斜、位置、装饰和方形 / 竖版排版可调，同场景实时成品预览。
- 成品预览可点击放大，支持双指 / 滚轮 1–4 倍缩放、拖动和适应屏幕；预览后再保存，风格缩略图也可放大。
- 本机自动保存、1100 × 1460 或 1100 × 1100 PNG、声音与静音、可选设备震动、减少动态效果、轻量显示及失败提示。

## 启动与检查

```sh
cd tin-app
npm ci
npm run dev
```

另一个终端启动研究板：

```sh
python3 -m http.server 5174 --bind 0.0.0.0 --directory research
```

构建与端到端验收（需先运行原型服务，测试脚本使用已安装的 Google Chrome）：

```sh
cd tin-app
npm run build
node scripts/verify-prototype.mjs
node scripts/verify-styles.mjs
node scripts/verify-customization.mjs
node scripts/verify-viewer.mjs
```

## 交付索引

| 内容 | 路径 |
|---|---|
| 40 张参考板 / 每图来源与分析 | `research/index.html`、`research/REFERENCES.md`、`research/references.json` |
| Art Bible v0.6 | `research/ART_BIBLE.md`、`research/ART_BIBLE.html` |
| 物件盘点与本轮交互取舍 | `research/COLLECTION_REVIEW.md` |
| 本轮风格、元素与字体规范 | `research/STYLE_DIRECTION_UPDATE.md`、`tin-app/src/styles-presets.ts` |
| 用户新参考与方向修正 | `research/USER_DIRECTION_UPDATE.md`、`research/user-references/` |
| 正式资产清单 / 机器清单 | `tin-app/public/ASSET_INVENTORY.md`、`tin-app/public/asset-manifest.json` |
| 40 件正式物品 / 原始生成记录 | `tin-app/public/assets/`、`tin-app/public/provenance/` |
| 自建盒型、内衬与程序化素材 | `tin-app/src/tin-model.js`、`tin-app/src/textures.ts`、`tin-app/src/paper-template.js` |
| 三类核心数据 | `tin-app/src/types.ts` |
| 本地源码 / 构建产物 | `tin-app/src/`、`tin-app/dist/` |
| 验收记录 / 截图 / 可复跑脚本 | `tin-app/QA.md`、`tin-app/output/acceptance/`、`tin-app/scripts/` |
| 历史六材质样品 | `research/samples/` |

## 研究与产品的边界

40 张研究参考中有 5 张开放许可候选、35 张研究专用图片。用户提供的 10 张截图也只作为研究参考。产品未提取这些图片中的品牌、照片或作品；正式物件来自 **22 件无品牌 AI 透明图片 + 18 件原创程序化素材，另有 7 款可切换图片变体与 4 张原创摄影画片**，盒体、内衬、背景为自制。AI 生成不是 CC0 许可声明。

资产原图与提示词保留；运行时等比裁切透明留白并使用 alpha 阈值，不覆盖原始像素。全分辨率仍可能看到少量生成色边，手机显示尺寸已经目视检查。线材为固定姿态，2.5D 物件无实体碰撞或柔体模拟。

没有账户、云端链接、视频导出或实时 AI。Chrome 桌面及触摸模拟验收已完成；真实手机、Safari、局域网连通性、30 FPS 指标以及首次用户 30 秒 / 1–3 分钟体验指标均未冒充已验证。

## 更新研究资料

`research/references.json` 为参考元数据源。修改后可运行 `python3 research/assemble_research.py`；更新 Art Bible 后运行 `python3 research/render_documents.py`。正式产品资产以 `tin-app/src/inventory.json`、`curated-inventory.json` 和 `object-variants.json` 为准；在 tin-app 内运行 `node scripts/register-style-assets.mjs` 更新程序化 PNG、机器清单和素材总览。
