import { sanitizeHtml } from 'core/functions';

describe('sanitizeHtml', () => {
  test.each([
    ['Le <b>dossier</b> est <em>validé</em>.<br>Merci', 'Le <b>dossier</b> est <em>validé</em>.<br>Merci'],
    [
      '<p><strong>Un</strong> <i>deux</i></p><ul><li>a</li></ul><ol><li>b</li></ol>',
      '<p><strong>Un</strong> <i>deux</i></p><ul><li>a</li></ul><ol><li>b</li></ol>'
    ],
    ['<b onclick="steal()" class="x" style="color: red">gras</b>', '<b>gras</b>'],
    ['<div><p>texte</p></div>', '<p>texte</p>'],
    ['<a href="javascript:steal()">lien</a>', 'lien'],
    ['<img src="x" onerror="steal()">', ''],
    ['<script>steal()</script>', 'steal()'],
    ['<svg onload="steal()"><b>x</b></svg>', '<b>x</b>'],
    ['a<!-- commentaire -->b', 'ab'],
    ['1 < 2 & 3 > 2', '1 &lt; 2 &amp; 3 &gt; 2'],
    ['', ''],
    [undefined, '']
  ])('sanitizes %p as %p', (html, sanitized) => {
    expect(sanitizeHtml(html)).toBe(sanitized);
  });

  // mutation XSS: the sanitized html is parsed again when displayed, it must still hold only bare formatting tags
  test.each([
    '<iframe srcdoc="<script>steal()</script>"></iframe>',
    '<noscript><p title="</noscript><img src=x onerror=steal()>">',
    '<math><mi><style><img src=x onerror=steal()></style></mi></math>',
    '<form><math><mtext></form><form><mglyph><style></math><img src onerror=steal()>',
    '<template><img src=x onerror=steal()></template>'
  ])('leaves no active content once %p is parsed again', html => {
    const displayed = document.createElement('div');
    displayed.innerHTML = sanitizeHtml(html);
    for (const element of displayed.querySelectorAll('*')) {
      expect(['B', 'STRONG', 'I', 'EM', 'BR', 'P', 'UL', 'OL', 'LI']).toContain(element.tagName);
      expect(element.getAttributeNames()).toEqual([]);
    }
  });
});
