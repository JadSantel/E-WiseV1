"""Refresh the portable board from its current editable screens."""
import base64
import gzip
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
pages = root / 'outputs/e-wise-live'
board_path = root / 'outputs/E-wise-design-baseline.html'
board = board_path.read_text(encoding='utf-8')
font_url = 'data:font/woff2;base64,' + base64.b64encode((pages / 'figtree-latin.woff2').read_bytes()).decode('ascii')
manifest = {}
page_files = [('80fe0b9b-3f78-4cbd-9bee-26ef64b221ce', 'homepage.html'), ('1d5efe2e-cbf0-435e-9942-f8624e6301e0', 'evaluate.html'), ('8b78852c-10d7-4a2b-84ed-e4b32510f4d0', 'verdict.html')]
navigation_source = (pages / 'preview-navigation.js').read_text(encoding='utf-8')
navigation_tag = '<script>' + navigation_source + '</script>'
for key, name in page_files:
    text = (pages / name).read_text(encoding='utf-8').replace('figtree-latin.woff2', font_url)
    text = text.replace('<script src="preview-navigation.js"></script>', navigation_tag)
    manifest[key] = {'mime': 'text/html', 'compressed': True, 'data': base64.b64encode(gzip.compress(text.encode('utf-8'), mtime=0)).decode('ascii')}
    assert gzip.decompress(base64.b64decode(manifest[key]['data'])).decode('utf-8') == text
pattern = r'(<script type="__bundler/manifest">).*?(</script>)'
board, count = re.subn(pattern, lambda m: m.group(1) + json.dumps(manifest, separators=(',', ':')) + m.group(2), board, count=1, flags=re.S)
assert count == 1, 'Expected one board asset manifest'
template = (pages / 'index.html').read_text(encoding='utf-8')
# The outer document owns board navigation; its window listener survives unpacking.
template = template.replace('<script src="preview-navigation.js"></script>', '')
for key, name in page_files:
    template = template.replace('src="' + name + '"', 'src="about:blank#' + key + '"')
for island_name, value in [('template', template), ('page_order', [key for key, _ in page_files])]:
    island_pattern = r'(<script type="__bundler/' + island_name + r'">).*?(</script>)'
    board, count = re.subn(island_pattern, lambda m: m.group(1) + json.dumps(value).replace('</', '<\\/') + m.group(2), board, count=1, flags=re.S)
    assert count == 1, 'Expected one ' + island_name + ' island'
navigation = '<script id="ewise-board-navigation">' + navigation_source + '</script>\n'
board, count = re.subn(r'<script id="ewise-board-navigation">.*?</script>\s*', lambda _: navigation, board, count=1, flags=re.S)
assert count == 1, 'Expected one board navigation script'
board_path.write_text(board, encoding='utf-8')
print('Synchronized the single-file board with all three editable screens.')
