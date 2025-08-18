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

// cypress/support/commands.js
// Robust pointer-based drag (for Angular CDK / custom canvases / non-HTML5 DnD)
Cypress.Commands.add("pointerDragTo", (fromSelector, toSelector) => {
  cy.get(fromSelector)
    .should("be.visible")
    .then(($from) => {
      const f = $from[0].getBoundingClientRect();
      const start = {
        clientX: f.left + f.width / 2,
        clientY: f.top + f.height / 2,
      };

      // Start drag
      cy.wrap($from)
        .trigger("pointerdown", { ...start, button: 0, force: true })
        .trigger("mousedown", { ...start, which: 1, force: true });

      // Small move to exceed drag threshold
      const kick = { clientX: start.clientX + 10, clientY: start.clientY + 10 };
      cy.document()
        .trigger("pointermove", { ...kick, force: true })
        .trigger("mousemove", { ...kick, force: true });

      // Move to center of drop target
      cy.get(toSelector)
        .should("be.visible")
        .then(($to) => {
          const t = $to[0].getBoundingClientRect();
          const end = {
            clientX: t.left + t.width / 2,
            clientY: t.top + t.height / 2,
          };

          cy.document()
            .trigger("pointermove", { ...end, force: true })
            .trigger("mousemove", { ...end, force: true });

          // Drop
          cy.wrap($to)
            .trigger("pointerup", { ...end, button: 0, force: true })
            .trigger("mouseup", { ...end, which: 1, force: true });
        });
    });
});
