// cypress/support/command/commands.js
Cypress.Commands.add('html5DnD', (fromEl, toEl, { payload = 'Chart', steps = 6 } = {}) => {
  const doc = fromEl[0].ownerDocument;
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', String(payload));
  dataTransfer.effectAllowed = 'all';

  const fromRect = fromEl[0].getBoundingClientRect();
  const toRect   = toEl[0].getBoundingClientRect();

  const start = { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 };
  const end   = { x: toRect.left + toRect.width  / 2, y: toRect.top + toRect.height / 2 };

  const fire = (el, type, opts = {}) => {
    const ev = new DragEvent(type, {
      bubbles: true, cancelable: true, composed: true,
      clientX: opts.clientX ?? 0, clientY: opts.clientY ?? 0,
      dataTransfer
    });
    if (type === 'dragover' || type === 'drop') dataTransfer.dropEffect = 'move';
    el.dispatchEvent(ev);
    return ev;
  };

  // start
  fromEl[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: start.x, clientY: start.y, buttons: 1 }));
  fire(fromEl[0], 'dragstart', { clientX: start.x, clientY: start.y });

  // path
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    fire(doc.elementFromPoint(x, y) || doc.body, 'dragover', { clientX: x, clientY: y });
  }

  fire(toEl[0], 'dragenter', { clientX: end.x, clientY: end.y });
  fire(toEl[0], 'dragover',  { clientX: end.x, clientY: end.y });

  const dropEv = fire(toEl[0], 'drop', { clientX: end.x, clientY: end.y });
  fromEl[0].dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: end.x, clientY: end.y }));
  fire(fromEl[0], 'dragend', { clientX: end.x, clientY: end.y });

  return dropEv.defaultPrevented;
});
