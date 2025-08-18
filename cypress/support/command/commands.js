// // HTML5 drag-and-drop technique using DataTransfer
// Cypress.Commands.add(
//   "html5DnD",
//   (fromEl, toEl, { payload = "Chart", steps = 8 } = {}) => {
//     const doc = fromEl[0].ownerDocument;

//     // Use constructors from the AUT's window
//     const DataTransferCtor = doc.defaultView.DataTransfer || DataTransfer;
//     const DragEventCtor    = doc.defaultView.DragEvent    || DragEvent;
//     const MouseEventCtor   = doc.defaultView.MouseEvent   || MouseEvent;

//     // One DataTransfer for the whole gesture
//     const dt = new DataTransferCtor();
//     dt.setData("text/plain", String(payload));
//     dt.setData("text/html",  `<div>${String(payload)}</div>`);   // <-- fixed (string, not JSX)
//     dt.setData("text/uri-list", "about:blank");
//     // Optional custom type if your app expects it:
//     // dt.setData("application/x-creatingly", JSON.stringify({ kind: "chart" }));
//     dt.effectAllowed = "copyMove";

//     const rectFrom = fromEl[0].getBoundingClientRect();
//     const rectTo   = toEl[0].getBoundingClientRect();
//     const start = { x: rectFrom.left + rectFrom.width / 2, y: rectFrom.top + rectFrom.height / 2 };
//     const end   = { x: rectTo.left   + rectTo.width  / 2,  y: rectTo.top  + rectTo.height  / 2  };

//     const fire = (el, type, opts = {}) => {
//       const ev = new DragEventCtor(type, {
//         bubbles: true,
//         cancelable: true,
//         composed: true,
//         clientX: opts.clientX ?? 0,
//         clientY: opts.clientY ?? 0,
//         dataTransfer: dt,
//       });
//       if (type === "dragover" || type === "drop") dt.dropEffect = "move";
//       el.dispatchEvent(ev);
//       return ev;
//     };

//     // Prefer a child handle if draggable is on a child
//     const dragHandle = fromEl[0].querySelector('[draggable="true"]') || fromEl[0];

//     // start
//     dragHandle.dispatchEvent(new MouseEventCtor("mousedown", {
//       bubbles: true, clientX: start.x, clientY: start.y, buttons: 1
//     }));
//     fire(dragHandle, "dragstart", { clientX: start.x, clientY: start.y });

//     // walk across (helps libs that require movement)
//     for (let i = 1; i <= steps; i++) {
//       const t = i / (steps + 1);
//       const x = start.x + (end.x - start.x) * t;
//       const y = start.y + (end.y - start.y) * t;
//       const under = doc.elementFromPoint(x, y) || doc.body;
//       fire(under, "dragover", { clientX: x, clientY: y });
//     }

//     // drop on the element actually under the cursor
//     const finalTarget = doc.elementFromPoint(end.x, end.y) || toEl[0];
//     fire(finalTarget, "dragenter", { clientX: end.x, clientY: end.y });
//     const overEv = fire(finalTarget, "dragover", { clientX: end.x, clientY: end.y });
//     const dropEv = fire(finalTarget, "drop",     { clientX: end.x, clientY: end.y });

//     dragHandle.dispatchEvent(new MouseEventCtor("mouseup", {
//       bubbles: true, clientX: end.x, clientY: end.y
//     }));
//     fire(dragHandle, "dragend", { clientX: end.x, clientY: end.y });

//     // Yield a boolean so you can assert acceptance if you want
//     const accepted = !!(overEv.defaultPrevented || dropEv.defaultPrevented);
//     return cy.wrap(accepted, { log: false });
//   }
// );
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

// -------------- Minimal, reliable drag (pointer-based) --------------
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

