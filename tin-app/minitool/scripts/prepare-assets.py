from pathlib import Path
from PIL import Image
import json, shutil, sys
sys.path.insert(0,'/tmp/tin-font-tools')
from fontTools.ttLib import TTFont
root=Path(__file__).resolve().parents[1]; web=root.parent; pub=root/'public'; pub.mkdir(exist_ok=True)
records={}; sizes={}
def convert(path):
 if not path:return path
 if path in records:return records[path]
 rel=path.lstrip('/');source=web/'public'/rel
 if source.suffix not in ['.png','.jpg','.jpeg']:return './'+rel
 im=Image.open(source);before=im.size;im.thumbnail((800,800),Image.Resampling.LANCZOS)
 dest=Path(rel).with_suffix('.webp');(pub/dest).parent.mkdir(parents=True,exist_ok=True);im.save(pub/dest,'WEBP',quality=88,method=6)
 records[path]='./'+str(dest);sizes[path]=(im.width/before[0],im.height/before[1]);return records[path]
for name in ['inventory.json','curated-inventory.json']:
 data=json.loads((web/'src'/name).read_text())
 for o in data['objects']:
  old=o.get('asset_path');o['asset_path']=convert(old)
  if old and o.get('alpha_bounds'):
   sx,sy=sizes[old];o['alpha_bounds']=[round(v*(sx if i%2==0 else sy)) for i,v in enumerate(o['alpha_bounds'])]
 (root/'src'/name).write_text(json.dumps(data,ensure_ascii=False))
data=json.loads((web/'src/object-variants.json').read_text())
def visit(v):
 if isinstance(v,list):
  for x in v:visit(x)
 elif isinstance(v,dict):
  if v.get('path'):
   old=v['path'];v['path']=convert(old)
   if v.get('bounds'):
    sx,sy=sizes[old];v['bounds']=[round(n*(sx if i%2==0 else sy)) for i,n in enumerate(v['bounds'])]
  for k,x in v.items():
   if k not in ['path','bounds']:visit(x)
visit(data);(root/'src/object-variants.json').write_text(json.dumps(data,ensure_ascii=False))
data=json.loads((web/'src/memories.json').read_text())
for m in data:m['assetPath']=convert(m['assetPath'])
(root/'src/memories.json').write_text(json.dumps(data,ensure_ascii=False))
convert('/materials/cable-knit-ivory.png');shutil.copy2(web/'public/drawer-wood.svg',pub/'drawer-wood.svg')
(pub/'fonts').mkdir(exist_ok=True)
for file in (web/'public/fonts').glob('*.ttf'):
 f=TTFont(file);f.flavor='woff2';f.save(pub/'fonts'/file.with_suffix('.woff2').name)
licenses={p.name:p.read_text() for p in (web/'public/fonts').glob('*OFL.txt')};(pub/'font-licenses.json').write_text(json.dumps(licenses,ensure_ascii=False))
(root/'ASSET_CONVERSIONS.json').write_text(json.dumps({'method':'packaging-only resize to <=800px, WebP quality 88; WOFF2 lossless fonts','files':records},ensure_ascii=False,indent=2))
print('Packaged',len(records),'raster images; original assets unchanged.')
