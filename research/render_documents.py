"""Render the two authored Markdown research documents for offline browser reading."""
import html, pathlib, re

BASE = pathlib.Path(__file__).resolve().parent

def inline(value):
    value = html.escape(value, quote=True)
    value = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img loading="lazy" alt="\1" src="\2">', value)
    value = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', value)
    value = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', value)
    return re.sub(r'`([^`]+)`', r'<code>\1</code>', value)

def render(filename):
    lines = (BASE / filename).read_text().splitlines()
    body, in_list, in_table = [], False, False
    for line in lines + ['']:
        if in_list and not line.startswith('- '): body.append('</ul>'); in_list = False
        if in_table and not line.startswith('|'): body.append('</tbody></table></div>'); in_table = False
        if not line.strip(): continue
        heading = re.match(r'^(#{1,4}) (.*)', line)
        if heading:
            n = len(heading[1]); body.append(f'<h{n}>{inline(heading[2])}</h{n}>')
        elif line.startswith('|'):
            cells = [c.strip() for c in line.strip('|').split('|')]
            if all(re.fullmatch(r'[:\-\s]+', c) for c in cells): continue
            if not in_table:
                body.append('<div class="table-wrap"><table><thead><tr>' + ''.join('<th>' + inline(c) + '</th>' for c in cells) + '</tr></thead><tbody>'); in_table = True
            else: body.append('<tr>' + ''.join('<td>' + inline(c) + '</td>' for c in cells) + '</tr>')
        elif line.startswith('- '):
            if not in_list: body.append('<ul>'); in_list = True
            body.append('<li>' + inline(line[2:]) + '</li>')
        else: body.append('<p>' + inline(line) + '</p>')
    title = {'ART_BIBLE.md':'TIN · Art Bible','REFERENCES.md':'TIN · 参考来源台账','STYLE_DIRECTION_UPDATE.md':'TIN · 个人风格扩展'}.get(filename,'TIN · 研究文档')
    page = '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title><link rel="stylesheet" href="styles.css"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect x=%223%22 y=%225%22 width=%2234%22 height=%2230%22 rx=%229%22 fill=%22%23232930%22/%3E%3Cpath d=%22M12 14h16M20 14v13%22 stroke=%22white%22 stroke-width=%223%22/%3E%3C/svg%3E"><style>main.document{max-width:960px;margin:0 auto;padding:35px 26px 70px}.document h1{margin-bottom:35px}.document h2{margin:50px 0 20px;border-top:1px solid #d4d7d4;padding-top:25px}.document h3{font-size:21px;margin-top:32px}.document p,.document li{line-height:1.95}.document img{display:block;max-width:100%;max-height:460px;object-fit:contain;margin:22px 0}.document li{margin:8px 0}.document a{overflow-wrap:anywhere}.document code{font-size:.9em;background:#e4e6e2;padding:2px 5px}.document td{min-width:120px}@media(max-width:760px){main.document{padding:25px 20px}.document h1{font-size:29px}.document ul{padding-left:20px}.document li,.document p{font-size:15px}}</style></head><body><header class="top"><a class="brand" href="index.html">TIN<span>FIELD NOTES / 001</span></a><span class="gate">A / B 已确认 · 原型迭代</span><a class="text-link" href="index.html">返回参考板 ↗</a></header><main class="document">' + '\n'.join(body) + '</main></body></html>'
    (BASE / filename.replace('.md', '.html')).write_text(page)

if __name__ == '__main__':
    render('ART_BIBLE.md')
    render('REFERENCES.md')
    render('STYLE_DIRECTION_UPDATE.md')
    render('COLLECTION_REVIEW.md')
