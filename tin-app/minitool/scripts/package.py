from pathlib import Path
import zipfile,json,hashlib,re,subprocess
root=Path(__file__).resolve().parents[1];workspace=root.parents[1];dist=root/'dist';art=workspace/'artifacts';art.mkdir(exist_ok=True)
allowed={'.html','.css','.js','.png','.jpg','.jpeg','.gif','.webp','.svg','.woff','.woff2','.json'};files=[p for p in dist.rglob('*') if p.is_file()]
errors=[]
for p in files:
 if p.suffix not in allowed:errors.append('unsupported: '+str(p.relative_to(dist)))
 if p.name.startswith('.') or p.suffix=='.map':errors.append('development file: '+p.name)
html=(dist/'index.html').read_text();js=(dist/'app.js').read_text();css=(dist/'style.css').read_text()
if 'type="module"' in html or any(body.strip() for body in re.findall(r'<script[^>]*>(.*?)</script>',html,re.S)):errors.append('inline/module script')
for term in ['fetch(', 'XMLHttpRequest','new Function(', 'eval(', 'requestFullscreen', 'new Worker(', 'new SharedWorker(', 'WebAssembly.', 'navigator.clipboard', 'window.open(', 'window.prompt(', 'navigator.geolocation','serviceWorker']:
 if term in js:errors.append('forbidden capability: '+term)
for uri in re.findall(r'data:[^;]+;base64,([A-Za-z0-9+/=]+)',html+js+css):
 if len(uri)*3/4>1048576:errors.append('base64 exceeds 1MiB')
for rel in re.findall(r'(?:src|href)="(\./[^"?#]+)"',html)+re.findall(r'url\([\'\"]?(\./[^)\'\"]+)',css):
 if not (dist/rel).exists():errors.append('missing resource: '+rel)
for name in ['inventory.json','curated-inventory.json','object-variants.json','memories.json']:
 def check(v):
  if isinstance(v,dict):
   for k,x in v.items():
    if k in ['path','asset_path','assetPath'] and isinstance(x,str) and not (dist/x).exists():errors.append('missing asset: '+x)
    else:check(x)
  elif isinstance(v,list):
   for x in v:check(x)
 check(json.loads((root/'src'/name).read_text()))
if errors:raise SystemExit('\n'.join(errors))
zip_path=art/'TIN-minitool-v0.7.0.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in files:z.write(p,p.relative_to(dist).as_posix())
if zip_path.stat().st_size>10*1024*1024:raise SystemExit('ZIP >10MiB')
skill=workspace/'.codex/skills/minitool-zip-builder/scripts/audit_artifact.py';logs=[]
for target in [dist,zip_path]:
 result=subprocess.run(['python3',str(skill),str(target)],capture_output=True,text=True);logs.append(result.stdout);print(result.stdout)
 if result.returncode:raise SystemExit(result.stderr)
report={'package':str(zip_path),'bytes':zip_path.stat().st_size,'MiB':round(zip_path.stat().st_size/1048576,2),'sha256':hashlib.sha256(zip_path.read_bytes()).hexdigest(),'files':len(files),'entry':'index.html','static_checks':'PASS','errors':errors,'budget_audit':logs,'full_features':['40 public objects and variants','5 curated themes','personal photos and editable papers','gesture / layer / undo / clear confirmation','native album saving and versioned storage','portrait and landscape with top safe area','WebGL and Canvas fallback'],'pending_validation':['XHS creator-platform simulator','Android physical device scan','iOS physical device scan','Chrome 61 CSS/runtime','actual FPS, GPU memory and permissions'],'notes':['Package over recommended 2MiB: full Chinese font and all 52 image resources retained; under 10MiB upload limit.','Development browser and mock SDK results are NOT container acceptance.']}
(art/'TIN-minitool-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
