// -------------- Zoom/transform normalizer (1-liner to call) --------------
Cypress.Commands.add('fixZoom', (rootSelector = '#Artboard1') => {
  cy.get(rootSelector).then($root => {
    const doc = $root[0].ownerDocument;
    let n = $root[0];
    while (n && n !== doc.body) {
      const cs = doc.defaultView.getComputedStyle(n);
      if ((cs.transform && cs.transform !== 'none') || (cs.zoom && cs.zoom !== '1' && cs.zoom !== 'normal')) {
        n.style.transform = 'none';
        n.style.transformOrigin = 'top left';
        n.style.zoom = '1';
        break;
      }
      n = n.parentElement;
    }
  });
});

Cypress.Commands.add('drag', (fromSelOrEl, toSelOrEl) => {
  const wrap = v => (Cypress.dom.isJquery(v) || v?.nodeType) ? cy.wrap(v) : cy.get(v);

  return wrap(fromSelOrEl).then($from => {
    return wrap(toSelOrEl).then($to => {
      const doc = $from[0].ownerDocument;
      const fr = $from[0].getBoundingClientRect();
      const tr = $to[0].getBoundingClientRect();

      const start = { x: fr.left + fr.width / 2, y: fr.top + fr.height / 2 };
      const end   = { x: tr.left + tr.width / 2, y: tr.top + tr.height / 2 };

      // press
      $from[0].dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 1, button: 0, buttons: 1,
        clientX: start.x, clientY: start.y
      }));

      // move in a couple steps to clear drag thresholds
      const mids = [
        { x: (start.x * 2 + end.x) / 3, y: (start.y * 2 + end.y) / 3 },
        { x: (start.x + end.x * 2) / 3, y: (start.y + end.y * 2) / 3 }
      ];
      [...mids, end].forEach(p => {
        doc.dispatchEvent(new PointerEvent('pointermove', {
          bubbles: true, pointerId: 1, buttons: 1, clientX: p.x, clientY: p.y
        }));
      });

      // drop/release
      $to[0].dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 1, button: 0, clientX: end.x, clientY: end.y
      }));

      return cy.wrap(true, { log: false });
    });
  });
});
