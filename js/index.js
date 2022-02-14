(() => {
  // Check if the user submitted an empty value
  function isInputEmpty(value) {
    if (value.trim().length === 0) return true;
    return false;
  }

  // I think it's self-explanatory
  function getTodoList() {
    return document.querySelector('#todo-list');
  }

  // Every time a valid new todo item submitted, it will create new elements, configure and call up all necessary functions, and show the new item on the screen
  function createNewTodo(value, status) {
    const todoList = getTodoList();
    // All new todo item elements
    const itemContainer = document.createElement('div');
    const checkBox = document.createElement('input');
    const label = document.createElement('label');
    const customCheckBox = document.createElement('span');
    const deleteBtn = document.createElement('button');
    const elements = [
      { element: itemContainer, className: 'hero-item-container' },
      { element: checkBox, className: 'hero-cb' },
      { element: label, className: 'hero-label' },
      { element: customCheckBox, className: 'hero-custom-cb' },
      { element: deleteBtn, className: 'hero-btn-del' },
    ];

    addNewClass(elements);
    // Attributes set
    itemContainer.setAttribute('data-completed', status);
    itemContainer.setAttribute('data-active', !status);
    checkBox.checked = status;
    checkBox.type = 'checkbox';
    checkBox.setAttribute('data-item-cb', '');
    checkBox.addEventListener('click', markCheckBox);
    label.innerText = value;
    label.setAttribute('data-item-lbl', '');
    customCheckBox.addEventListener('click', markCheckBox);
    deleteBtn.addEventListener('click', removeTodoItem);
    // Putting all elements in their respective container
    itemContainer.append(checkBox, label, customCheckBox, deleteBtn);
    todoList.appendChild(itemContainer);

    reorderCheckBoxesId();
    setItemsLeftCounter();
    updateShownTodoItems();
  }

  // Add some class for all new elements created
  function addNewClass(elements) {
    elements.forEach(item => {
      item.element.classList.add(item.className);
    });
  }

  // Will check or uncheck the checkbox
  function markCheckBox(event) {
    // This will only be executed if the user clicks on the form custom checkbox
    if (event.currentTarget.matches('[data-form-custom-cb]')) {
      const status = formCheckBox.checked;
      formCheckBox.checked = !status;
      return;
    }

    const todoItemContainer = event.currentTarget.parentElement;
    // This will only be executed if the user clicks on the label or input checkbox
    if (event.currentTarget.matches('[data-item-cb]')) {
      const status = event.currentTarget.checked;

      todoItemContainer.setAttribute('data-completed', status);
      todoItemContainer.setAttribute('data-active', !status);
    } else {
      // This will only be executed if the user clicks on the custom checkbox
      const inputCheckBox = todoItemContainer.firstElementChild;
      const status = inputCheckBox.checked;

      inputCheckBox.checked = !status;
      todoItemContainer.setAttribute('data-completed', !status);
      todoItemContainer.setAttribute('data-active', status);
    }
    setItemsLeftCounter();
    updateShownTodoItems();
  }

  // Every time a new todo item is created, it will reorder the ids for all checkboxes inside a "Todo item container"
  function reorderCheckBoxesId() {
    const todoItemContainers = document.querySelectorAll('.hero-item-container');
    const todoItemCheckBoxes = document.querySelectorAll('[data-item-cb]');
    const todoItemLabels = document.querySelectorAll('[data-item-lbl]');
    const checkBoxesAmount = todoItemContainers.length;

    for (let i = 0, idNumber = 1; i < checkBoxesAmount; i++, idNumber++) {
      todoItemCheckBoxes[i].id = `item${idNumber}`;
      todoItemLabels[i].setAttribute('for', `item${idNumber}`);
    }
  }

  // Will check how many todo items are NOT marked, and show them on the screen
  function setItemsLeftCounter() {
    const todoItemsContainer = document.querySelectorAll('[data-active="true"]');
    const itemsLeft = todoItemsContainer.length;

    itemsLeftCounter.innerText = `${itemsLeft} item${itemsLeft === 1 ? '' : 's'} left`;
  }

  // Remove ONE todo item from the list
  function removeTodoItem(event) {
    const todoList = getTodoList();
    const todoItemContainer = event.currentTarget.parentElement;

    todoList.removeChild(todoItemContainer);
    setItemsLeftCounter();
  }

  // Remove ALL todo items marked as completed from the list
  function removeCompletedTodoItems() {
    const todoList = getTodoList();
    const completedTodos = document.querySelectorAll('[data-completed="true"]');

    completedTodos.forEach(todo => todoList.removeChild(todo));
  }

  // Will get ALL todo item containers created
  function getAllTodoItemContainers() {
    return document.querySelectorAll('.hero-item-container');
  }

  // ADDS class for the currently selected filter button
  function addClassFilterOn(button) {
    button.classList.add('filter-on');
    button.setAttribute('data-filter-on', true);
  }

  // REMOVES class from the previously selected filter button
  function removeClassFilterOn() {
    const btnFilterOn = document.querySelector('[data-filter-on="true"]');

    btnFilterOn.classList.remove('filter-on');
    btnFilterOn.setAttribute('data-filter-on', false);
  }

  // ADD class for all todo item containers passed as arguments
  function addClassHideContainers(todoItems) {
    todoItems.forEach(todoItem => {
      todoItem.classList.add('hide-container');
    });
  }

  // REMOVE class for all todo item containers passed as arguments
  function removeClassHideContainers(todoItems) {
    todoItems.forEach(todoItem => {
      todoItem.classList.remove('hide-container');
    });
  }

  // Will REMOVE the class that hides for ALL todo item containers
  function filterShowAllItems() {
    const hasFilterOn = btnFilterAll.classList.contains('filter-on');
    if (hasFilterOn) return;

    removeClassFilterOn();
    addClassFilterOn(btnFilterAll);
    removeClassHideContainers(getAllTodoItemContainers());
  }

  // Will ADD the class that hides for all todo item containers marked as completed
  function filterShowActiveItems() {
    const completedTodoItems = document.querySelectorAll('[data-active="false"]');
    filterShowAllItems();
    removeClassFilterOn();
    addClassFilterOn(btnFilterActive);
    addClassHideContainers(completedTodoItems);
  }

  // Will ADD the class that hides for all todo item containers NOT marked as completed
  function filterShowCompletedItems() {
    const activeTodoItems = document.querySelectorAll('[data-completed="false"]');
    filterShowAllItems();
    removeClassFilterOn();
    addClassFilterOn(btnFilterCompleted);
    addClassHideContainers(activeTodoItems);
  }

  // It will update the todo items shown if the user is already in one of these two filters and marks or unmarks any todo item
  function updateShownTodoItems() {
    const btnFilterOn = document.querySelector('[data-filter-on="true"]');

    if (btnFilterOn.id === 'btn-active') return filterShowActiveItems();
    if (btnFilterOn.id === 'btn-completed') return filterShowCompletedItems();
  }

  // All main variables declarations
  const todoForm = document.querySelector('#todo-form');
  const formCheckBox = document.querySelector('#todo-form__cb');
  const formTxtInput = document.querySelector('#todo-form__txt');
  const todoCheckBoxes = document.querySelectorAll('[data-item-cb]');
  const customCheckBoxes = document.querySelectorAll('.hero-custom-cb');
  const deleteButtons = document.querySelectorAll('.hero-btn-del');
  const itemsLeftCounter = document.querySelector('#todo-items__left');
  const btnFilterAll = document.querySelector('#btn-all');
  const btnFilterActive = document.querySelector('#btn-active');
  const btnFilterCompleted = document.querySelector('#btn-completed');
  const clearCompleteBtn = document.querySelector('#btn-clear');

  setItemsLeftCounter();

  // Event Listener for the Todo Form
  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const txtInputValue = formTxtInput.value;

    if (isInputEmpty(txtInputValue)) {
      return alert('Please enter a name');
    }

    const checkBoxStatus = formCheckBox.checked;
    createNewTodo(txtInputValue, checkBoxStatus);
  });

  // Event Listener for all Todo Item Checkboxes
  todoCheckBoxes.forEach(checkbox => {
    checkbox.addEventListener('click', markCheckBox);
  });

  // Event Listener for all Custom Checkbox
  customCheckBoxes.forEach(customCheckBox => {
    customCheckBox.addEventListener('click', markCheckBox);
  });

  // Event Listener for all Todo Item Delete Button
  deleteButtons.forEach(button => {
    button.addEventListener('click', removeTodoItem);
  });

  // Event Listener for the Filter All Button
  btnFilterAll.addEventListener('click', filterShowAllItems);

  // Event Listener for the Filter Active Button
  btnFilterActive.addEventListener('click', filterShowActiveItems);

  // Event Listener for the Filter Completed Button
  btnFilterCompleted.addEventListener('click', filterShowCompletedItems);

  // Event Listener for the Clear Completed Button
  clearCompleteBtn.addEventListener('click', removeCompletedTodoItems);
})();
