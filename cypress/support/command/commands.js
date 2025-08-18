// HTML5 drag-and-drop technique using DataTransfer
Cypress.Commands.add(
  "html5DnD",
  (fromEl, toEl, { payload = "Chart", steps = 8 } = {}) => {
    const doc = fromEl[0].ownerDocument;

    // Use constructors from the AUT's window
    const DataTransferCtor = doc.defaultView.DataTransfer || DataTransfer;
    const DragEventCtor    = doc.defaultView.DragEvent    || DragEvent;
    const MouseEventCtor   = doc.defaultView.MouseEvent   || MouseEvent;

    // One DataTransfer for the whole gesture
    const dt = new DataTransferCtor();
    dt.setData("text/plain", String(payload));
    dt.setData("text/html",  `<div>${String(payload)}</div>`);   // <-- fixed (string, not JSX)
    dt.setData("text/uri-list", "about:blank");
    // Optional custom type if your app expects it:
    // dt.setData("application/x-creatingly", JSON.stringify({ kind: "chart" }));
    dt.effectAllowed = "copyMove";

    const rectFrom = fromEl[0].getBoundingClientRect();
    const rectTo   = toEl[0].getBoundingClientRect();
    const start = { x: rectFrom.left + rectFrom.width / 2, y: rectFrom.top + rectFrom.height / 2 };
    const end   = { x: rectTo.left   + rectTo.width  / 2,  y: rectTo.top  + rectTo.height  / 2  };

    const fire = (el, type, opts = {}) => {
      const ev = new DragEventCtor(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: opts.clientX ?? 0,
        clientY: opts.clientY ?? 0,
        dataTransfer: dt,
      });
      if (type === "dragover" || type === "drop") dt.dropEffect = "move";
      el.dispatchEvent(ev);
      return ev;
    };

    // Prefer a child handle if draggable is on a child
    const dragHandle = fromEl[0].querySelector('[draggable="true"]') || fromEl[0];

    // start
    dragHandle.dispatchEvent(new MouseEventCtor("mousedown", {
      bubbles: true, clientX: start.x, clientY: start.y, buttons: 1
    }));
    fire(dragHandle, "dragstart", { clientX: start.x, clientY: start.y });

    // walk across (helps libs that require movement)
    for (let i = 1; i <= steps; i++) {
      const t = i / (steps + 1);
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      const under = doc.elementFromPoint(x, y) || doc.body;
      fire(under, "dragover", { clientX: x, clientY: y });
    }

    // drop on the element actually under the cursor
    const finalTarget = doc.elementFromPoint(end.x, end.y) || toEl[0];
    fire(finalTarget, "dragenter", { clientX: end.x, clientY: end.y });
    const overEv = fire(finalTarget, "dragover", { clientX: end.x, clientY: end.y });
    const dropEv = fire(finalTarget, "drop",     { clientX: end.x, clientY: end.y });

    dragHandle.dispatchEvent(new MouseEventCtor("mouseup", {
      bubbles: true, clientX: end.x, clientY: end.y
    }));
    fire(dragHandle, "dragend", { clientX: end.x, clientY: end.y });

    // Yield a boolean so you can assert acceptance if you want
    const accepted = !!(overEv.defaultPrevented || dropEv.defaultPrevented);
    return cy.wrap(accepted, { log: false });
  }
);

// cypress/support/commands.js
Cypress.Commands.add('html5DragAndDrop', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).should('be.visible').then(($src) => {
    const srcEl = $src[0];
    const dataTransfer = new DataTransfer();
    // some libs ignore empty payloads
    dataTransfer.setData('text/plain', srcEl.id || 'drag-item');

    // start drag on source
    cy.wrap($src)
      .trigger('mousedown', { which: 1, force: true })
      .trigger('dragstart', { dataTransfer, force: true });

    // compute target center and send full event sequence
    cy.get(targetSelector).should('be.visible').then(($tgt) => {
      const tgtEl = $tgt[0];
      const rect = tgtEl.getBoundingClientRect();
      const center = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      };

      cy.wrap($tgt)
        .trigger('dragenter', { dataTransfer, ...center, force: true })
        .trigger('dragover',  { dataTransfer, ...center, force: true })
        .trigger('drop',      { dataTransfer, ...center, force: true });

      // end drag on source (prevents sticky ghost)
      cy.wrap($src).trigger('dragend', { dataTransfer, force: true });
    });
  });
});




