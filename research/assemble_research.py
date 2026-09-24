"""Assemble the curated research ledger and verify the local image collection."""
import collections, hashlib, json, pathlib, shutil
from PIL import Image

BASE = pathlib.Path(__file__).resolve().parent
ROOT = BASE.parent
metadata = json.loads((BASE / 'references.json').read_text())

for r in metadata:
    im = Image.open(BASE / r['local_path'])
    im.verify()
    im = Image.open(BASE / r['local_path'])
    r['width'], r['height'] = im.size
    blob = (BASE / r['local_path']).read_bytes()
    r['bytes'] = len(blob)
    r['sha256'] = hashlib.sha256(blob).hexdigest()
    r['license_url'] = r.get('license_url') or r['source_url']

expected = {'tin': 6, 'edc': 6, 'charms': 4, 'collage': 4, 'trays': 4, 'composition': 4, 'materials': 6, 'motion': 3, 'technical': 3}
assert len(metadata) == 40
assert collections.Counter(r['category'] for r in metadata) == expected
assert len(set(r['id'] for r in metadata)) == 40
assert len(set(r['sha256'] for r in metadata)) == 40, 'Duplicate research image'
for r in metadata:
    assert r['width'] >= 200 and r['height'] >= 120, r['id']
    for key in ['creator', 'reference', 'avoid', 'license', 'attribution', 'source_url', 'image_url']:
        assert r.get(key), (r['id'], key)
    assert r['source_url'].startswith('https://')

serialized = json.dumps(metadata, ensure_ascii=False, indent=2)
(BASE / 'references.json').write_text(serialized)
(BASE / 'references.js').write_text('window.TIN_REFERENCES = ' + serialized.replace('</', '<\\/') + ';\n')
labels = {'tin':'铁盒结构','edc':'当代随身物件','charms':'挂件与珠串','collage':'小卡与拼贴','trays':'杂物托盘','composition':'构图','materials':'材质光影','motion':'触摸动效','technical':'2.5D / 3D 技术'}
lines=['# TIN · 40 张参考来源台账', '', '研究日期：2026-09-24。当前状态：Gate A 已确认 A「银色日常收藏」，Gate B 已通过，进入手机原型。', '',
       '每张图片均已保存到本地并核验格式；图片能访问不代表具有产品复用许可。作者不明确时记录发布者并明确说明。', '',
       '**5 张为开放许可候选，35 张在本项目中仅用于研究。** 部分 CC BY-SA 或公有领域照片因视角、品牌等原因仍划入仅研究。', '']
for key in expected:
    lines += ['## ' + labels[key], '']
    for r in metadata:
        if r['category'] != key: continue
        lines += [f"### {r['id']} · {r['title']}", '', f"![{r['title']}]({r['local_path']})", '',
                  f"- **参考什么：** {r['reference']}", f"- **不照搬什么：** {r['avoid']}",
                  f"- **作者 / 发布者：** {r['creator']}", f"- **原始来源：** [{r['title']}]({r['source_url']})",
                  f"- **图片地址：** [原始图片]({r['image_url']})", f"- **许可：** {r['license']}（[核查链接]({r['license_url']})）",
                  f"- **使用范围：** {r['attribution']}", f"- **核验：** {r['source_verified']}",
                  f"- **本地尺寸：** {r['width']} × {r['height']} px；访问日期 {r['accessed_at']}。", '']
        if r.get('interaction_url'): lines += [f"- **交互示例：** [打开可操作示例]({r['interaction_url']})", '']
(BASE / 'REFERENCES.md').write_text('\n'.join(lines))
report = {'reference_count': len(metadata), 'categories': expected, 'unique_images': 40,
          'image_validation': '40/40 decoded and verified with Pillow; 40 distinct SHA-256 hashes',
          'source_metadata_complete': True, 'reuse_candidates': sum(r['reuse_status'] != 'research_only' for r in metadata),
          'source_page_limitations': ['R21: source body timed out; image and visible credit checked', 'R23: auction page body unavailable; image checked'],
          'gate_a': 'approved_direction_A', 'gate_b': 'approved_with_revisions', 'product_implementation': 'prototype_ready',
          'total_image_bytes': sum(r['bytes'] for r in metadata)}
prior = BASE / 'verification.json'
if prior.exists():
    previous = json.loads(prior.read_text())
    if previous.get('browser_checks'):
        report['previous_browser_checks'] = previous['browser_checks']
        report['browser_recheck_required_after_changes'] = True
(BASE / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False, indent=2))

from render_documents import render
render('ART_BIBLE.md')
render('REFERENCES.md')
