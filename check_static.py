from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

base = Path(__file__).resolve().parent / 'site'
routes = ['index.html','office.html','practice-areas.html','family-law.html','property-law.html','debt-law.html','contact.html']
analytics = """<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "725f705bd67242419c5879c12c31735f"}'></script><!-- End Cloudflare Web Analytics -->"""
class Check(HTMLParser):
    def __init__(self):
        super().__init__(); self.h1 = 0; self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1': self.h1 += 1
        for field in ('href','src'):
            if field in attrs: self.links.append(attrs[field])
for route in routes:
    text = (base / route).read_text(encoding='utf-8')
    parser = Check(); parser.feed(text)
    assert parser.h1 == 1, route
    assert 'noindex,nofollow' in text and 'lang="el"' in text, route
    assert text.count(analytics) == 1 and analytics + '</body>' in text, route
    assert text.count('src=\'https://static.cloudflareinsights.com/beacon.min.js\'') == 1, route
    for link in parser.links:
        url = urlsplit(link)
        if not url.scheme and url.path:
            assert (base / unquote(url.path)).is_file(), (route,link)
contact = (base / 'contact.html').read_text(encoding='utf-8')
assert '<fieldset disabled>' in contact and 'type="submit" disabled' in contact
assert 'form-action \'none\'' in contact
script = (base / 'assets/site.js').read_text(encoding='utf-8')
assert 'preventDefault()' in script
for forbidden in ('fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'sendBeacon', 'FormData'):
    assert forbidden not in script, forbidden
print('PASS: 7 pages, one h1/page, local assets/internal links, noindex, one analytics snippet/page, disabled no-JS form, no form transmit/storage APIs.')
