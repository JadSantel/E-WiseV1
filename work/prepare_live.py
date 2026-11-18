"""Unpack the supplied design board into editable static pages, retaining its styles."""
import base64
import gzip
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
source = (root / 'outputs/E-wise-design-baseline.html').read_text(encoding='utf-8')
dest = root / 'outputs/e-wise-live'
dest.mkdir(exist_ok=True)


def island(text, name):
    match = re.search(r'<script type="__bundler/' + name + r'">(.*?)</script>', text, re.S)
    return json.loads(match.group(1))


def decode(entry):
    data = base64.b64decode(entry['data'])
    return gzip.decompress(data) if entry.get('compressed') else data


manifest = island(source, 'manifest')
board = island(source, 'template')
license_comment = re.search(r'<!--.*?-->', source, re.S).group(0)
pages = {
    '80fe0b9b-3f78-4cbd-9bee-26ef64b221ce': 'homepage.html',
    '1d5efe2e-cbf0-435e-9942-f8624e6301e0': 'evaluate.html',
}
for key, name in pages.items():
    bundled_page = decode(manifest[key]).decode('utf-8')
    template = island(bundled_page, 'template')
    for asset_key, asset in island(bundled_page, 'manifest').items():
        if asset['mime'] == 'font/woff2':
            font_name = 'figtree-latin.woff2'
            (dest / font_name).write_bytes(decode(asset))
            template = template.replace(asset_key, font_name)
    # The export's runtime only supplies the accent and custom-element wrappers.
    # Keep the existing visual markup; make it ordinary editable HTML.
    template = re.sub(r'<script\b[^>]*>.*?</script>', '', template, flags=re.S)
    helmet = re.search(r'<helmet>(.*?)</helmet>', template, re.S).group(1)
    template = re.sub(r'<helmet>.*?</helmet>', '', template, flags=re.S)
    template = template.replace('</head>', license_comment + '\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + helmet + '\n</head>')
    template = re.sub(r'</?x-dc>', '', template)
    template = template.replace('{{accent}}', '#E5F77A')
    template = template.replace('sc-raw-select', 'select').replace('sc-camel-view-box', 'viewBox')
    # The Latin subset bundled with the reference covers the existing copy.
    # Avoid introducing remote requests while previewing the supplied design.
    template = re.sub(r'/\* latin-ext \*/\s*@font-face\s*\{.*?\}', '', template, flags=re.S)
    template = re.sub(r'<link rel="preconnect"[^>]*>', '', template)
    assert '{{accent}}' not in template and '<x-dc' not in template
    assert 'fonts.gstatic.com/s/' not in template
    assert len(re.findall(r'<h1\b', template)) == 1
    (dest / name).write_text(template, encoding='utf-8')
    board = board.replace('about:blank#' + key, name)

assert 'about:blank#' not in board
(dest / 'index.html').write_text(board, encoding='utf-8')
print('Prepared unchanged screen layouts: index.html, homepage.html, evaluate.html; local Figtree font.')
