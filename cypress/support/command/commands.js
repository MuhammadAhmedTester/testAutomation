
// HTML5 drag-and-drop technique using DataTransfer
Cypress.Commands.add('simpleDragDrop', (fromSelOrEl, toSelOrEl) => {
  const getEl = v => Cypress.dom.isJquery(v) ? v[0] : v;
  return cy.get(fromSelOrEl).then($from => {
    return cy.get(toSelOrEl).then($to => {
      const fromEl = getEl($from);
      const toEl = getEl($to);
      const doc = fromEl.ownerDocument;
      const dataTransfer = new DataTransfer();
      dataTransfer.setData('text/plain', 'chart-drag');
      // Drag start
      fromEl.dispatchEvent(new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      }));
      // Drag enter/over
      toEl.dispatchEvent(new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      }));
      toEl.dispatchEvent(new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      }));
      // Drop
      toEl.dispatchEvent(new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      }));
      // Drag end
      fromEl.dispatchEvent(new DragEvent('dragend', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      }));
      return cy.wrap(true, { log: false });
    });
  });
});
