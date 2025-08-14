function html5DragAndDrop($from, $to, { payload = 'Chart', steps = 6 } = {}) {
  const doc = $from[0].ownerDocument;
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', String(payload)); // make types non-empty
  dataTransfer.effectAllowed = 'all';

  const fromRect = $from[0].getBoundingClientRect();
  const toRect   = $to[0].getBoundingClientRect();

  const start = { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 };
  const end   = { x: toRect.left + toRect.width / 2,    y: toRect.top  + toRect.height  / 2    };

  // helper to make real DragEvents
  const fire = (el, type, opts = {}) => {
    const ev = new DragEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: opts.clientX ?? 0,
      clientY: opts.clientY ?? 0,
      dataTransfer,
    });
    // Some libs read dropEffect on dragover
    if (type === 'dragover' || type === 'drop') dataTransfer.dropEffect = 'move';
    el.dispatchEvent(ev);
    return ev;
  };

  // Start drag on source
  $from[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: start.x, clientY: start.y, buttons: 1 }));
  fire($from[0], 'dragstart', { clientX: start.x, clientY: start.y });

  // Walk several dragover steps toward the center of the target
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    fire(doc.elementFromPoint(x, y) || doc.body, 'dragover', { clientX: x, clientY: y });
  }

  // Ensure we're “over” the actual drop zone
  fire($to[0], 'dragenter', { clientX: end.x, clientY: end.y });
  fire($to[0], 'dragover',  { clientX: end.x, clientY: end.y });

  // Drop + end
  const dropEv = fire($to[0], 'drop', { clientX: end.x, clientY: end.y });
  $from[0].dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: end.x, clientY: end.y }));
  fire($from[0], 'dragend', { clientX: end.x, clientY: end.y });

  return dropEv.defaultPrevented; // true means target accepted the drop
}
