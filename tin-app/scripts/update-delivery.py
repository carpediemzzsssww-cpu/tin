# -*- coding: utf-8 -*-
from pathlib import Path
import json, shutil

root = Path(__file__).resolve().parents[2]
p = root / 'research/ART_BIBLE.md'
s = p.read_text().replace('v0.2', 'v0.3').replace('候选 Tin 外尺寸 **90 × 125 × 19 mm**', '执行 Tin 外尺寸 **140 × 90 × 19 mm**').replace('视线与表面法线夹角约 12°', '视线与表面法线夹角约 10°').replace('场景像素比封顶 1.5', '场景像素比封顶 1.7（轻量模式 1.0）')
s = s.replace('当前执行：18 件资产清单与六材质样品。样品及清单提交 Gate B 审核后进入可玩原型开发。', 'Gate B 亦已确认，按用户反馈改为横向长盒并修正开盖穿模。18 件公共素材与本地手机网页原型已实现，真机验收待进行。')
s = s.replace('桌面固定为浅灰硬质桌面，内衬固定为白色微折纸。', '默认浅灰硬质桌面，可切换原创酒红针织与折痕纸页背景；内衬保留白色微折纸。用户提供的 3 张参考见 USER_DIRECTION_UPDATE.md，仅供研究，不提取其中照片、品牌或作品。')
if '## 10.' not in s:
    s += '\n## 10. 本轮结构修正\n\n盒盖铰链位于盒壁外侧，绕 X 轴向上旋转到 -186°；盖内物件附着于铰链组，正面朝内，背面简化，使用真实深度遮挡。盒盖与底盘独立局部坐标，以毫米记录布局。三类背景均为原创程序纹理，不使用参考截图的像素。\n'
p.write_text(s)
p = root / 'research/assemble_research.py'
s = p.read_text().replace('进入 Gate B 样品审核', 'Gate B 已通过，进入手机原型').replace("'samples_pending_review'", "'approved_with_revisions'").replace("'product_implementation': 'not_started'", "'product_implementation': 'prototype_ready'")
p.write_text(s)
p = root / 'research/index.html'
s = p.read_text().replace('A 方向已确认，六材质样品进入审核。', 'A 方向与样品已确认，手机原型已就绪。').replace('90 × 125 × 19 mm', '140 × 90 × 19 mm').replace('六材质样品待审，手机性能待后续验证。', '样品已通过，手机真机性能待验证。')
s = s.replace('按你的选择，进入「银色日常收藏」资产清单与六材质样品阶段。样品通过 Gate B 后，开始可玩原型开发。', '已按你的选择完成「银色日常收藏」，并根据新参考改成长盒。18 件素材和可玩创作流程已就绪。').replace('当前需要审核的是资产清单与样品。', '下一步可直接试玩，感受自己的创作空间。').replace('Research v0.2', 'Research v0.3').replace('<a href="samples/">前往六材质样品室 ↗</a>', '<a href="prototype.html">打开手机创作原型 ↗</a>')
p.write_text(s)
(root / 'research/prototype.html').write_text('''<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><title>打开 TIN</title><p>正在打开 TIN 手机原型…</p><script>location.replace('http://'+(location.hostname||'127.0.0.1')+':5175/');</script></html>''')
p = root / 'research/samples/data/decisions.json'
d = json.loads(p.read_text())
d['gate_b'] = {'status':'approved_with_revisions','user_instruction':'不错不错继续推进，盒盖开闭有些穿模可以处理一下，另外盒子最好是长一点的那种','approved_at':'2026-09-24','revisions':['140 × 90 mm landscape tin','upward hinge without clipping','personal photo and text composition'],'prototype_ready':True,'real_phone_verified':False}
d['tabletop_options'] = ['light_gray','wine_knit_original','notebook_original']
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
a = json.loads((root / 'tin-app/public/asset-manifest.json').read_text())
for item in a['objects']:
    src = root / ('tin-app/public'+item['asset_path'])
    dest = root / 'research/samples/assets' / src.name
    shutil.copy2(src,dest)
    item['asset_path'] = 'assets/'+src.name
    if item['source']['kind'] == 'ai_pre_generated':
        item['source']['record'] = 'assets/'+('prototype-generation-log.json' if 'generated-assets' in item['source']['record'] else 'generation-log.json')+'#'+item['id']
(root / 'research/samples/data/inventory.json').write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
(root / 'research/samples/data/inventory-data.js').write_text('window.TIN_INVENTORY = '+json.dumps(a,ensure_ascii=False)+';\n')
shutil.copy2(root / 'tin-app/public/ASSET_INVENTORY.md',root / 'research/samples/ASSET_INVENTORY.md')
shutil.copy2(root / 'tin-app/public/provenance/generated-assets.json',root / 'research/samples/assets/prototype-generation-log.json')
p = root / 'research/samples/samples.js'
if "prototype_ready:" not in p.read_text():
    p.write_text(p.read_text().replace("const statusText={planned:","const statusText={prototype_ready:'原型就绪',planned:"))
p = root / 'research/samples/index.html'
s = p.read_text().replace('<h2>下一步，从样品走向创作。</h2>','<h2>现在，可以动手创作了。</h2>')
if '../prototype.html' not in s:
    s = s.replace('<a href="generation-log.json">查看 AI 生成记录 ↗</a>','<a href="../prototype.html">打开手机可玩原型 ↗</a><a href="generation-log.json">查看 AI 生成记录 ↗</a>')
p.write_text(s)
