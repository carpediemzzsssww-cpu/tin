# TIN 小工具独立版本

保留 40 件物品、款式/颜色/纸件编辑、私人照片、双指及单指调整、层级、清空确认、五套整盒随机、分类取物、撤销重做、排版和高清预览。源代码是独立快照，不修改正式网页构建。

- 构建：在 `tin-app` 执行 `npm ci`，然后 `npm --prefix minitool run build`。
- 图像/字体转换记录：`ASSET_CONVERSIONS.json`；原始素材和授权记录位于上级 `public`。字体转为 WOFF2，保留完整中文字符集。
- 入口是根目录 `index.html`，经典 IIFE 脚本，ES2017/Chrome 61 语法目标；无网络请求、Worker、内联脚本、WASM、浏览器下载和全屏 API。
- 60 px 顶部留白并叠加容器安全区；横屏使用右侧抽屉；软键盘监听 visualViewport，旧内核有 CSS/JS 局部回退。
- 保存成品：用户点击后使用 `writeTempFile` → `saveImageToPhotosAlbum`。无 SDK 的普通浏览器只显示预览和说明。
- 客户端 >=9.46 使用原生 Storage；>=9.49 照片使用原生持久文件，旧客户端使用允许的浏览器存储。保存失败有提示，作品不保证永久保存。
- 正常能力使用 Three.js 3D；WebGL 不可用时进入 Canvas 2D 轻量版，保留创作、手势、编辑与导出。

规范来源：用户指定的 minitool-zip-builder-1.7.0.skill（内部 metadata 1.6.0）和 `https://miniapp-sandbox.xiaohongshu.com/minitool/doc`，2026-09-24 下载。在线文档副本留存在工作区。

`verify.mjs` 只用于开发侧 CSP / 模拟 SDK / 降级检查。**交付后必须将同一 ZIP 上传创服平台，先平台模拟器完整验证，再 Android 和 iOS 真机扫码验证。普通浏览器检查不代表小工具验收，Chrome 61 CSS、真实容器、真机性能均未实测。**
