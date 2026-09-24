"""Download explicit research image URLs; keep originals and a verification ledger."""
import concurrent.futures, hashlib, io, json, pathlib, sys, urllib.request
from PIL import Image

BASE = pathlib.Path(__file__).resolve().parent
DATA = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else BASE / 'references.json'
items = json.loads(DATA.read_text())
MEDIA = BASE / 'media'
MEDIA.mkdir(exist_ok=True)

def download(item):
    result = {'id': item['id'], 'url': item['image_url']}
    try:
        request = urllib.request.Request(item['image_url'], headers={'User-Agent': 'Mozilla/5.0 TINVisualResearch/1.0'})
        with urllib.request.urlopen(request, timeout=35) as response:
            data = response.read(24 * 1024 * 1024)
            result.update(status=response.status, final_url=response.url, content_type=response.headers.get('Content-Type'))
        im = Image.open(io.BytesIO(data))
        im.verify()
        im = Image.open(io.BytesIO(data))
        extension = {'JPEG': 'jpg', 'PNG': 'png', 'WEBP': 'webp', 'GIF': 'gif', 'AVIF': 'avif'}.get(im.format)
        if not extension:
            raise ValueError('Unsupported image format: ' + str(im.format))
        path = MEDIA / (item['id'] + '.' + extension)
        path.write_bytes(data)
        result.update(local_path='media/' + path.name, width=im.width, height=im.height,
                      bytes=len(data), sha256=hashlib.sha256(data).hexdigest(), verified=True)
    except Exception as exc:
        result.update(verified=False, error=str(exc))
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(download, items))
report = BASE / (DATA.stem + '-downloads.json')
report.write_text(json.dumps(results, ensure_ascii=False, indent=2))
for row in results:
    print(row['id'], 'OK' if row['verified'] else 'FAILED', row.get('bytes', ''), row.get('error', ''))
print('Verified', sum(r['verified'] for r in results), '/', len(results))
