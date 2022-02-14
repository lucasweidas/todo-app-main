(() => {
  // Check if the user submitted an empty value
  function isInputEmpty(inputValue) {
    if (inputValue.trim().length === 0) return true;
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

    addClassToNewElements(elements);
    // Attributes set
    itemContainer.setAttribute('data-completed', status);
    itemContainer.setAttribute('data-active', !status);
    checkBox.checked = status;
    checkBox.type = 'checkbox';
    checkBox.setAttribute('data-item-cb', '');
    checkBox.addEventListener('click', checkOrUncheckCheckbox);
    label.innerText = value;
    label.setAttribute('data-item-lbl', '');
    customCheckBox.addEventListener('click', checkOrUncheckCheckbox);
    deleteBtn.addEventListener('click', removeTodoItem);
    // Putting all elements in their respective container
    itemContainer.append(checkBox, label, customCheckBox, deleteBtn);
    todoList.appendChild(itemContainer);

    reorderCheckBoxesId();
    setItemsLeftCounter();
    updateDisplayedItems();
  }

  // Add some class for all new elements created
  function addClassToNewElements(todoElements) {
    todoElements.forEach(todoElement => {
      todoElement.element.classList.add(todoElement.className);
    });
  }

  // Will check or uncheck the input checkbox and the custom checkbox
  function checkOrUncheckCheckbox(event) {
    // This will only be executed if the user clicks on the form custom checkbox
    if (event.currentTarget.matches('[data-form-custom-cb]')) {
      const status = formCheckbox.checked;
      formCheckbox.checked = !status;
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
    updateDisplayedItems();
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

  // Will verify how many todo items are NOT check, and show them on the screen
  function setItemsLeftCounter() {
    const todoItemContainers = document.querySelectorAll('[data-active="true"]');
    const itemsLeft = todoItemContainers.length;

    itemsLeftCounter.innerText = `${itemsLeft} item${itemsLeft === 1 ? '' : 's'} left`;
  }

  // Remove ONE todo item from the list when the user clicks the delete button inside the todo item container
  function removeTodoItem(event) {
    const todoList = getTodoList();
    const todoItemContainer = event.currentTarget.parentElement;

    todoList.removeChild(todoItemContainer);
    setItemsLeftCounter();
  }

  // Remove ALL todo items check as completed from the list, when the user clicks the delete completed button
  function removeCompletedTodoItems() {
    const todoList = getTodoList();
    const completedTodoItems = document.querySelectorAll('[data-completed="true"]');

    completedTodoItems.forEach(todoItem => todoList.removeChild(todoItem));
  }

  // Will get ALL todo item containers created
  function getAllTodoItemContainers() {
    return document.querySelectorAll('.hero-item-container');
  }

  // ADDS class for the currently selected filter button
  function addClassOnCurrentFilterButton(button) {
    button.classList.add('filter__button--on');
    button.setAttribute('data-filter-on', true);
  }

  // REMOVES class from the previously selected filter button
  function removeClassOnPreviousFilterButton() {
    const previousFilterBtnOn = document.querySelector('[data-filter-on="true"]');

    previousFilterBtnOn.classList.remove('filter__button--on');
    previousFilterBtnOn.setAttribute('data-filter-on', false);
  }

  // ADD class that will hide all todo item containers passed as arguments
  function addClassHideInSomeTodoItems(todoItems) {
    todoItems.forEach(todoItem => {
      todoItem.classList.add('hero-item-container--hide');
    });
  }

  // REMOVE class that hides for all todo item containers passed as arguments
  function removeClassHideOfAllTodoItems(todoItems) {
    todoItems.forEach(todoItem => {
      todoItem.classList.remove('hero-item-container--hide');
    });
  }

  // "Filters" and shows all todo items on the screen
  function displayAllTodoItems() {
    const hasFilterOn = buttonFilterAll.classList.contains('filter__button--on');
    if (hasFilterOn) return;

    removeClassOnPreviousFilterButton();
    addClassOnCurrentFilterButton(buttonFilterAll);
    removeClassHideOfAllTodoItems(getAllTodoItemContainers());
  }

  // Will filter all todo items NOT marked as completed and show only them on the screen
  function displayOnlyActiveTodoItems() {
    const completedTodoItems = document.querySelectorAll('[data-active="false"]');

    removeClassOnPreviousFilterButton();
    addClassOnCurrentFilterButton(buttonFilterActive);
    removeClassHideOfAllTodoItems(getAllTodoItemContainers());
    addClassHideInSomeTodoItems(completedTodoItems);
  }

  // Will filter all todo items MARKED as completed and show only them on the screen
  function displayOnlyCompletedTodoItems() {
    const activeTodoItems = document.querySelectorAll('[data-completed="false"]');

    removeClassOnPreviousFilterButton();
    addClassOnCurrentFilterButton(buttonFilterCompleted);
    removeClassHideOfAllTodoItems(getAllTodoItemContainers());
    addClassHideInSomeTodoItems(activeTodoItems);
  }

  // It will update the todo items shown if the user is already in one of these two filters and marks or unmarks any todo item
  function updateDisplayedItems() {
    const currentFilterBtnOn = document.querySelector('[data-filter-on="true"]');

    if (currentFilterBtnOn.id === 'btn-active') {
      return displayOnlyActiveTodoItems();
    }
    if (currentFilterBtnOn.id === 'btn-completed') {
      return displayOnlyCompletedTodoItems();
    }
  }

  // It will add or remove the "light-mode" class from the body tag and change the current theme icon displayed
  function changeCurrentTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    themeIcons.forEach(icon => icon.classList.toggle('active-theme'));
  }

  // All main variables declarations
  const todoForm = document.querySelector('#todo-form');
  const formCheckbox = document.querySelector('#todo-form__cb');
  const formInputText = document.querySelector('#todo-form__txt');
  const todoItemCheckboxes = document.querySelectorAll('[data-item-cb]');
  const customCheckboxes = document.querySelectorAll('.hero-custom-cb');
  const todoItemDeleteButtons = document.querySelectorAll('.hero-btn-del');
  const itemsLeftCounter = document.querySelector('#todo-items__left');
  const buttonFilterAll = document.querySelector('#btn-all');
  const buttonFilterActive = document.querySelector('#btn-active');
  const buttonFilterCompleted = document.querySelector('#btn-completed');
  const buttonClearCompleted = document.querySelector('#btn-clear');
  const buttonThemeToggle = document.querySelector('#btn-theme-toggle');
  const themeIcons = document.querySelectorAll('.theme-icon');

  setItemsLeftCounter();

  // Event Listener for the Todo Form
  todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputTextValue = formInputText.value;

    if (isInputEmpty(inputTextValue)) {
      return alert('Please enter a name');
    }

    const formCheckboxStatus = formCheckbox.checked;
    createNewTodo(inputTextValue, formCheckboxStatus);
  });

  // Event Listener for all Todo Item Checkboxes
  todoItemCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', checkOrUncheckCheckbox);
  });

  // Event Listener for all Custom Checkbox
  customCheckboxes.forEach(customCheckbox => {
    customCheckbox.addEventListener('click', checkOrUncheckCheckbox);
  });

  // Event Listener for all Todo Item Delete Button
  todoItemDeleteButtons.forEach(button => {
    button.addEventListener('click', removeTodoItem);
  });

  // Event Listener for the Filter All Button
  buttonFilterAll.addEventListener('click', displayAllTodoItems);

  // Event Listener for the Filter Active Button
  buttonFilterActive.addEventListener('click', displayOnlyActiveTodoItems);

  // Event Listener for the Filter Completed Button
  buttonFilterCompleted.addEventListener('click', displayOnlyCompletedTodoItems);

  // Event Listener for the Clear Completed Button
  buttonClearCompleted.addEventListener('click', removeCompletedTodoItems);

  buttonThemeToggle.addEventListener('click', changeCurrentTheme);
})();
