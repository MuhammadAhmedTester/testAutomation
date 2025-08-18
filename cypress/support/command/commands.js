// HTML5 drag-and-drop technique using DataTransfer
Cypress.Commands.add(
  "html5DnD",
  (fromEl, toEl, { payload = "Chart", steps = 8 } = {}) => {
    const doc = fromEl[0].ownerDocument;

    // Use one DataTransfer for the whole gesture
    const dt = new DataTransfer();
    // Seed multiple types – many apps check these
    dt.setData("text/plain", String(payload));
    dt.setData("text/html", <div>${String(payload)}</div>);
    dt.setData("text/uri-list", "about:blank");

    // If your app needs a custom type, add it here too:
    dt.setData("application/x-creatingly", JSON.stringify({ kind: "chart" }));
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
      const ev = new DragEvent(type, {
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

    // Some UIs put the drag handle on a child; prefer that if present
    const dragHandle =
      fromEl[0].querySelector('[draggable="true"]') || fromEl[0];
    // start
    dragHandle.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        clientX: start.x,
        clientY: start.y,
        buttons: 1,
      })
    );
    fire(dragHandle, "dragstart", { clientX: start.x, clientY: start.y });
    // walk across the page so any hover/guard logic runs
    for (let i = 1; i <= steps; i++) {
      const t = i / (steps + 1);
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;
      const under = doc.elementFromPoint(x, y) || doc.body;
      fire(under, "dragover", { clientX: x, clientY: y });
    }

    // final target = element actually under the drop point (not just the wrapper you passed)
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
      new MouseEvent("mouseup", {
        bubbles: true,
        clientX: end.x,
        clientY: end.y,
      })
    );
    fire(dragHandle, "dragend", { clientX: end.x, clientY: end.y });

    // Yield true if either dragover or drop was prevented (most libs use dragover)
    const accepted = !!(overEv.defaultPrevented || dropEv.defaultPrevented);
    return cy.wrap(accepted, { log: false });
  }
);
