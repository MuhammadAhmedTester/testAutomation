// HTML5 drag-and-drop technique using DataTransfer
Cypress.Commands.add(
  "html5DnD",
  (fromEl, toEl, { payload = "Chart", steps = 8 } = {}) => {
    const doc = fromEl[0].ownerDocument;

    // Use constructors from the AUT's window
    const DataTransferCtor = doc.defaultView.DataTransfer || DataTransfer;
    const DragEventCtor = doc.defaultView.DragEvent || DragEvent;
    const MouseEventCtor = doc.defaultView.MouseEvent || MouseEvent;

    // One DataTransfer for the whole gesture
    const dt = new DataTransferCtor();
    dt.setData("text/plain", String(payload));
    dt.setData("text/html", `<div>${String(payload)}</div>`); // <-- fixed (string, not JSX)
    dt.setData("text/uri-list", "about:blank");
    // Optional custom type if your app expects it:
    // dt.setData("application/x-creatingly", JSON.stringify({ kind: "chart" }));
    dt.effectAllowed = "copyMove";

    const rectFrom = fromEl[0].getBoundingClientRect();
    const rectTo = toEl[0].getBoundingClientRect();
    const start = {
      x: rectFrom.left + rectFrom.width / 2,
      y: rectFrom.top + rectFrom.height / 2,
    };
    const end = {
      x: rectTo.left + rectTo.width / 2,
      y: rectTo.top + rectTo.height / 2,
    };

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
    const dragHandle =
      fromEl[0].querySelector('[draggable="true"]') || fromEl[0];

    // start
    dragHandle.dispatchEvent(
      new MouseEventCtor("mousedown", {
        bubbles: true,
        clientX: start.x,
        clientY: start.y,
        buttons: 1,
      })
    );
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
    const overEv = fire(finalTarget, "dragover", {
      clientX: end.x,
      clientY: end.y,
    });
    const dropEv = fire(finalTarget, "drop", {
      clientX: end.x,
      clientY: end.y,
    });

    dragHandle.dispatchEvent(
      new MouseEventCtor("mouseup", {
        bubbles: true,
        clientX: end.x,
        clientY: end.y,
      })
    );
    fire(dragHandle, "dragend", { clientX: end.x, clientY: end.y });

    // Yield a boolean so you can assert acceptance if you want
    const accepted = !!(overEv.defaultPrevented || dropEv.defaultPrevented);
    return cy.wrap(accepted, { log: false });
  }
);


Cypress.Commands.add('placeFromPalette', (fromSelector, toSelector) => {
  const pointerId = 1;

  cy.get(fromSelector).should('be.visible').then(($from) => {
    const f = $from[0].getBoundingClientRect();
    const start = { clientX: f.left + f.width / 2, clientY: f.top + f.height / 2 };

    // Start "drag" from the palette item
    cy.wrap($from)
      .trigger('pointerdown', { ...start, pointerId, pointerType: 'mouse', button: 0, buttons: 1, force: true })
      .trigger('mousedown',    { ...start, which: 1, buttons: 1, force: true });

    // Target center
    cy.get(toSelector).should('be.visible').then(($to) => {
      const r = $to[0].getBoundingClientRect();
      const end = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };

      // Step across so hover logic / overlays activate
      const steps = 8;
      for (let i = 1; i <= steps; i++) {
        const x = start.clientX + ((end.clientX - start.clientX) * i) / steps;
        const y = start.clientY + ((end.clientY - start.clientY) * i) / steps;

        cy.document()
          .trigger('pointermove', { clientX: x, clientY: y, pointerId, pointerType: 'mouse', buttons: 1, force: true })
          .trigger('mousemove',   { clientX: x, clientY: y, which: 1, buttons: 1, force: true })
          .wait(10); // tiny delay helps some drag sensors
      }

      // Release
      cy.document()
        .trigger('pointerup', { ...end, pointerId, pointerType: 'mouse', button: 0, buttons: 0, force: true })
        .trigger('mouseup',   { ...end, which: 1, buttons: 0, force: true });

      // Commit placement: click the *actual* node under the cursor
      cy.document().then((doc) => {
        const el = doc.elementFromPoint(end.clientX, end.clientY) || $to[0];
        cy.wrap(el)
          .trigger('click', { ...end, force: true }); // many builders place on click
      });
    });
  });
});


