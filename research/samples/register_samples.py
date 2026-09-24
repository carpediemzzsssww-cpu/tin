"""Register original sample outputs and read-only alpha evidence; never edit pixels."""
import hashlib,json,pathlib
from PIL import Image
from build_inventory import build

BASE=pathlib.Path(__file__).resolve().parent
data=build()
log=json.loads((BASE/'assets/generation-log.json').read_text())
records={a['id']:a for a in log['assets']}
issues={
 'key_silver_01':'高倍查看仍有少量暖色边缘；当前仅为审核样品。',
 'dice_red_01':'透明留白中残留极低 alpha 杂点；场景忽略不可见低值。',
 'plush_gray_01':'高倍查看仍有细小彩色边缘，正式入库前需要精修。',
 'earphones_white_coiled_01':'深色背景下仍可见细白边；正式入库前需要精修。',
 'blister_clear_01':'局部薄边需最终复核；泡罩保留背衬，破口真实透明。'
}
for a in data['objects']:
 if not a['sample_material']:continue
 if a['id'] in records:
  record=records[a['id']];p=pathlib.Path(record['selected_asset_path'])
  im=Image.open(p);im.verify();im=Image.open(p)
  assert im.mode=='RGBA' and im.getchannel('A').getextrema()==(0,255)
  assert hashlib.sha256(p.read_bytes()).hexdigest()==record['image_analysis']['sha256']
  bounds=im.getchannel('A').point(lambda v:255 if v>8 else 0).getbbox()
  assert list(bounds)==record['image_analysis']['alpha_bounds_gt8']
  a.update(asset_path=p.relative_to(BASE).as_posix(),alpha_bounds=list(bounds),pixel_size=list(im.size),status='sample_ready')
  a['source']={'kind':'ai_pre_generated','record':f"assets/generation-log.json#{a['id']}",'url':None}
  a['qa']={'true_alpha':True,'alpha_bounds_threshold':8,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'production_final':False,'visual_note':issues[a['id']],'generation_notes':record['qa_notes'],'input_sha_verified':True}
 else:
  p=BASE/'assets/ticket_cream_01.svg'
  a.update(asset_path='assets/ticket_cream_01.svg',alpha_bounds=None,pixel_size=[840,396],status='sample_ready')
  a['qa']={'true_alpha':'SVG has no background outside paper path','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'production_final':False,'visual_note':'原创可编辑模板；纸纹、排版与比例待审核。'}
  a['source']={'kind':'procedural_svg','record':'paper-template.js','url':None}
 for key in ['author','license_status','license_note']: assert a.get(key)
for core in data['core_assets']:core['status']='sample_ready'
data['gate_b']='pending_review'
(BASE/'data/inventory.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
# Keep a discoverable index at the path used by the reviewer, without changing the raw log.
index={**log,'raw_log':'assets/generation-log.json','other_original_assets':[
 {'id':'ticket_cream_01','source':'paper-template.js','method':'Original procedural SVG; system fonts; no external artwork'},
 {'id':'tin_silver_01','source':'tin-model.js','method':'Original parametric mesh; Three.js MIT; millimetre coordinate system'},
 {'id':'lining_white_folded_01','source':'tin-model.js','method':'Original seeded canvas paper texture and mesh'}]}
(BASE/'generation-log.json').write_text(json.dumps(index,ensure_ascii=False,indent=2))
build()
print('Registered six samples; checked five original RGBA outputs and all source records')
