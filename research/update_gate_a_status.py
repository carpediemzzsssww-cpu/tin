"""Apply the user's 2026-09-24 direction A decision to the research surfaces."""
from pathlib import Path
BASE=Path(__file__).resolve().parent
replacements={
 'index.html':[
  ('与待确认的制作规范','与已确认的 A 方向制作规范'),
  ('视觉研究 · 待确认','A 已确认 · 样品阶段'),
  ('当前交付为研究与规范，尚未生产产品素材。','A 方向已确认，六材质样品进入审核。'),
  ('<strong>建议从 A 开始。</strong> 中性的银色容器更适合检验材质一致性，再放入 B 的鲜亮、奇怪小物；最后由你的选择确定。','<strong>已确认 A「银色日常收藏」。</strong> 采用裸银铁盒、浅灰硬质桌面与白纸内衬。<a href="samples/">查看资产清单与六材质样品 ↗</a>'),
  ('以上为待确认的项目基线，不是来源图片的实测参数；六材质样品与手机性能仍需后续验证。','以上为已确认的 A 方向样品基线，不是来源图片的实测参数；六材质样品待审，手机性能待后续验证。'),
  ('<h2>先选世界，再做物件。</h2><p>确认一套主方向及共用规范后，进入资产清单与六材质样品阶段。样品通过 Gate B 后，开始可玩原型开发。</p>','<h2>A 方向已确认。</h2><p>按你的选择，进入「银色日常收藏」资产清单与六材质样品阶段。样品通过 Gate B 后，开始可玩原型开发。</p>'),
  ('<span class="review-prompt">在对话中回复你的选择即可</span><div><span>A · 银色日常收藏</span><span>B · 鲜亮塑料杂物</span><span>C · 深色夜间纪念盒</span></div><small>也可以指定一处调整，例如“A 的盒子 + B 的鲜色小物”。</small>','<span class="review-prompt">2026.09.24 · 已记录你的选择</span><div><a href="samples/">前往六材质样品室 ↗</a></div><small>B / C 继续保留为研究方向。当前需要审核的是资产清单与样品。</small>'),
  ('Research v0.1','Research v0.2')
 ],
 'app.js':[("label:'建议首个原型'","label:'已确认 · 执行方向'"),("desk:'冷灰浅木 / 浅灰硬质桌面'","desk:'浅灰硬质桌面'")],
 'render_documents.py':[('视觉研究 · 待确认','A 已确认 · 样品阶段')]
}
for name,pairs in replacements.items():
    path=BASE/name;body=path.read_text()
    for old,new in pairs: body=body.replace(old,new)
    path.write_text(body)
print('Gate A decision reflected in board and document renderer')
