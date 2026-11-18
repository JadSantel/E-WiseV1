"""Populate the design prototype with illustrative listing and valuation data."""
import base64
import gzip
import json
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
pages = root / 'outputs/e-wise-live'
home_path = pages / 'homepage.html'
home = home_path.read_text(encoding='utf-8')
assert home.count('[DEVICE NAME]') == 4, 'Mock data is already populated; edit the current pages directly'
examples = [
    ('Apple iPhone 13', 'Good · 128 GB · 2 years', '₱18,500', '₱19,500'),
    ('Samsung Galaxy S21', 'Fair · 256 GB · 3 years', '₱9,000', '₱12,500'),
    ('Apple iPhone 11', 'Damaged · 64 GB · 4 years', '₱2,500', '₱3,000'),
    ('Xiaomi Redmi Note 12', 'Good · 128 GB · 1 year', '₱5,500', '₱6,000'),
]
cards = re.findall(r'<div class="card" style="padding:16px;.*?</button></div>', home, re.S)
assert len(cards) == len(examples), 'Expected four marketplace cards'
for card, (name, specs, price, estimate) in zip(cards, examples):
    updated = card.replace('[DEVICE NAME]', name)
    updated = updated.replace('[Condition] · [Storage] · [Age]', specs)
    updated = updated.replace('[Fault] · [Parts available]', specs)
    updated = updated.replace('<div class="price">[PRICE]</div>', '<div class="price">' + price + '</div>')
    if 'Est. value [PRICE]' in updated:
        updated = updated.replace('Est. value [PRICE]', 'Est. value ' + estimate)
    else:
        updated = updated.replace('<div class="price">' + price + '</div>', '<div class="price">' + price + '</div><div style="font-size:14px;color:#4A4A4A">Est. value ' + estimate + '</div>')
    updated = updated.replace('[N] bids · ends in [TIME]', '6 bids · ends in 2d 4h')
    updated = updated.replace('For technicians &amp; refurbishers', 'Won’t power on · Screen intact')
    updated = updated.replace('<button class="out">', '<button class="out" style="margin-top:auto">')
    assert not re.search(r'\[(?:DEVICE NAME|Condition|Storage|Age|Fault|Parts available|PRICE|N|TIME)\]', updated)
    home = home.replace(card, updated, 1)
heading = '<h2 style="font-size:24px;font-weight:600;margin:0 0 16px">Live on E-wise</h2>'
home = home.replace(heading, heading + '\n<p style="font-size:14px;color:#4A4A4A;margin:0 0 16px">Sample listings · Prices and estimates are illustrative.</p>')
home_path.write_text(home, encoding='utf-8')

eval_path = pages / 'evaluate.html'
evaluate = eval_path.read_text(encoding='utf-8')
evaluate = evaluate.replace('<option>[BRAND]</option>', '<option>Apple</option>')
evaluate = evaluate.replace('placeholder="Search model, e.g. [MODEL]"', 'placeholder="Search model" value="iPhone 13"')
evaluate = evaluate.replace('[BRAND] [MODEL] · 1 to 2 years', 'Apple iPhone 13 · 128 GB · 1 to 2 years')
evaluate = evaluate.replace('[PRICE RANGE]', '₱18,000–₱20,000', 1)
evaluate = evaluate.replace('[PRICE RANGE]', '₱3,000–₱5,000', 1)
evaluate = evaluate.replace('[LEVEL]', 'Moderate')
evaluate = evaluate.replace('</span>Updating</div>', '</span>Demo</div>')
evaluate = evaluate.replace('<div class="lbl">Device</div>', '<div class="lbl">Sample device · Illustrative estimates</div>')
assert not re.search(r'\[(?:BRAND|MODEL|PRICE RANGE|LEVEL)\]', evaluate)
eval_path.write_text(evaluate, encoding='utf-8')

# Keep the user's open, single-file board synchronized with the editable pages.
# Its original is retained before the first refresh of the packed assets.
board_path = root / 'outputs/E-wise-design-baseline.html'
board = board_path.read_text(encoding='utf-8')
backup = root / 'work/original-design-baseline.html'
if not backup.exists():
    backup.write_bytes(board_path.read_bytes())
font_url = 'data:font/woff2;base64,' + base64.b64encode((pages / 'figtree-latin.woff2').read_bytes()).decode('ascii')
manifest = {}
for key, name in [('80fe0b9b-3f78-4cbd-9bee-26ef64b221ce', 'homepage.html'), ('1d5efe2e-cbf0-435e-9942-f8624e6301e0', 'evaluate.html')]:
    text = (pages / name).read_text(encoding='utf-8').replace('figtree-latin.woff2', font_url)
    manifest[key] = {'mime': 'text/html', 'compressed': True, 'data': base64.b64encode(gzip.compress(text.encode('utf-8'), mtime=0)).decode('ascii')}
    assert gzip.decompress(base64.b64decode(manifest[key]['data'])).decode('utf-8') == text
pattern = r'(<script type="__bundler/manifest">).*?(</script>)'
board, count = re.subn(pattern, lambda m: m.group(1) + json.dumps(manifest, separators=(',', ':')) + m.group(2), board, count=1, flags=re.S)
assert count == 1
assert 'Choose what to do with it' not in home, 'Keep the accepted section removal'
board_path.write_text(board, encoding='utf-8')
print('Updated four sample listings, sample evaluation values, and the single-file design board.')
