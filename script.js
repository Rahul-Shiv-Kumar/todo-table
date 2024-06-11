document.addEventListener('DOMContentLoaded', (event) => {
  let draggedCard = null;

  // Load the state from localStorage
  const savedState = JSON.parse(localStorage.getItem('panesState'));
  if (savedState) {
    savedState.forEach((pane, paneIndex) => {
      const paneElement = document.getElementById(`pane-${paneIndex}`);
      pane.cards.forEach(cardText => {
        const cardElement = createCardElement(cardText, paneIndex);
        paneElement.appendChild(cardElement);
      });
    });
  } else {
    // Initial state
    const initialState = [
      { name: 'To do', cards: ['Learn Vue 3', 'Learn Vue Router'] },
      { name: 'Doing', cards: ['Build my awesome project'] },
      { name: 'Done', cards: ['Learn HTML', 'Learn CSS'] }
    ];
    initialState.forEach((pane, paneIndex) => {
      const paneElement = document.getElementById(`pane-${paneIndex}`);
      pane.cards.forEach(cardText => {
        const cardElement = createCardElement(cardText, paneIndex);
        paneElement.appendChild(cardElement);
      });
    });
  }

  document.querySelectorAll('.pane-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCard = card;
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      draggedCard = null;
      card.classList.remove('dragging');
      saveState();
    });
  });

  document.querySelectorAll('.pane').forEach(pane => {
    pane.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(pane, e.clientY);
      if (afterElement == null) {
        pane.appendChild(draggedCard);
      } else {
        pane.insertBefore(draggedCard, afterElement);
      }
    });

    pane.addEventListener('drop', (e) => {
      updateCardColor(draggedCard, pane.id);
      saveState();
    });
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.pane-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function createCardElement(text, paneIndex) {
    const card = document.createElement('div');
    card.classList.add('pane-card');
    card.draggable = true;
    card.textContent = text;
    updateCardColor(card, `pane-${paneIndex}`);

    card.addEventListener('dragstart', (e) => {
      draggedCard = card;
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      draggedCard = null;
      card.classList.remove('dragging');
      saveState();
    });

    return card;
  }

  function saveState() {
    const panesState = [];
    document.querySelectorAll('.pane').forEach((pane, paneIndex) => {
      const cards = [...pane.querySelectorAll('.pane-card')].map(card => card.textContent);
      panesState.push({ name: pane.querySelector('.pane-header').textContent, cards: cards });
    });
    localStorage.setItem('panesState', JSON.stringify(panesState));
  }

  function updateCardColor(card, paneId) {
    if (paneId === 'pane-1') {
      card.style.backgroundColor = 'green';
      card.style.color = '#fff';
    } else if (paneId === 'pane-2') {
      card.style.backgroundColor = 'blue';
      card.style.color = '#fff';

    } else {
      card.style.backgroundColor = '#ffffff';
      card.style.color = '#000';
    }
  }
});
