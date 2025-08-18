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

/**
 * dragFromPaletteTo({
 *   openSelector: '[data-testid="Chart"]',        // opens the popup
 *   fromSelector: '[data-testid="Bar Chart"]',    // the tile inside the popup
 *   hoverOver: '#section1' | ['#section1', ...],  // optional: element(s) to hover over
 *   toSelector: '#playground .design-area',       // final drop surface
 *   payloads: [{type, data}]                      // optional: app-specific DataTransfer entries
 * })
 */
Cypress.Commands.add(
  "dragFromPaletteTo",
  ({
    openSelector,
    fromSelector,
    hoverOver = [],
    toSelector,
    payloads = [
      { type: "application/x-item", data: "Chart" }, // replace with your app’s exact type if known
      { type: "text/plain", data: "Chart" },
      { type: "text", data: "Chart" },
    ],
  }) => {
    const pointerId = 1;
    const asArray = (x) => (Array.isArray(x) ? x : x ? [x] : []);

    // 1) Open the palette (if needed)
    if (openSelector) {
      cy.get(openSelector).should("be.visible").click({ force: true });
    }

    // 2) Pick the tile to drag
    cy.get(fromSelector)
      .scrollIntoView()
      .should("be.visible")
      .then(($from) => {
        const fr = $from[0].getBoundingClientRect();
        const start = {
          clientX: fr.left + fr.width / 2,
          clientY: fr.top + fr.height / 2,
        };

        // Prepare a real DataTransfer (many builders require this)
        const dt = new DataTransfer();
        dt.effectAllowed = "all";
        try {
          payloads.forEach((p) => dt.setData(p.type, p.data));
        } catch (e) {}

        // Start drag while holding the button
        cy.wrap($from)
          .trigger("pointerdown", {
            ...start,
            pointerId,
            pointerType: "mouse",
            button: 0,
            buttons: 1,
            force: true,
          })
          .trigger("mousedown", { ...start, which: 1, buttons: 1, force: true })
          .trigger("dragstart", { dataTransfer: dt, force: true });

        // helper to step-move and fire hover events along the way
        const stepMove = (fromPt, toPt, steps = 8) => {
          for (let i = 1; i <= steps; i++) {
            const x =
              fromPt.clientX + ((toPt.clientX - fromPt.clientX) * i) / steps;
            const y =
              fromPt.clientY + ((toPt.clientY - fromPt.clientY) * i) / steps;

            cy.document()
              .trigger("pointermove", {
                clientX: x,
                clientY: y,
                pointerId,
                pointerType: "mouse",
                buttons: 1,
                force: true,
              })
              .trigger("mousemove", {
                clientX: x,
                clientY: y,
                which: 1,
                buttons: 1,
                force: true,
              })
              .then((doc) => {
                const el = doc.elementFromPoint(x, y);
                if (el) {
                  cy.wrap(el)
                    .trigger("dragenter", {
                      dataTransfer: dt,
                      clientX: x,
                      clientY: y,
                      force: true,
                    })
                    .trigger("dragover", {
                      dataTransfer: dt,
                      clientX: x,
                      clientY: y,
                      force: true,
                    });
                }
              })
              .wait(10);
          }
        };

        // 3) Hover path (activate overlays)
        const hovers = asArray(hoverOver);
        let current = start;

        if (hovers.length) {
          hovers.forEach((sel) => {
            cy.get(sel)
              .should("be.visible")
              .then(($hover) => {
                const r = $hover[0].getBoundingClientRect();
                const center = {
                  clientX: r.left + r.width / 2,
                  clientY: r.top + r.height / 2,
                };
                stepMove(current, center);
                current = center;
              });
          });
        }

        // 4) Final move → drop surface
        cy.get(toSelector)
          .should("be.visible")
          .then(($to) => {
            const tr = $to[0].getBoundingClientRect();
            const end = {
              clientX: tr.left + tr.width / 2,
              clientY: tr.top + tr.height / 2,
            };
            stepMove(current, end);

            // Drop on the *actual* element under the cursor (overlay), then commit
            cy.document().then((doc) => {
              const dropEl =
                doc.elementFromPoint(end.clientX, end.clientY) || $to[0];

              cy.wrap(dropEl)
                .trigger("dragenter", { dataTransfer: dt, ...end, force: true })
                .trigger("dragover", { dataTransfer: dt, ...end, force: true })
                .trigger("drop", { dataTransfer: dt, ...end, force: true })
                .trigger("pointerup", {
                  ...end,
                  pointerId,
                  pointerType: "mouse",
                  button: 0,
                  buttons: 0,
                  force: true,
                })
                .trigger("mouseup", {
                  ...end,
                  which: 1,
                  buttons: 0,
                  force: true,
                })
                .trigger("click", { ...end, force: true }); // some editors require a final click

              cy.wrap($from).trigger("dragend", {
                dataTransfer: dt,
                force: true,
              });
            });
          });
      });
  }
);
