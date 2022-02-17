(() => {
  // All main variables declaration
  const todoForm = document.querySelector('#todo-form');
  const formCheckbox = document.querySelector('#todo-form__cb');
  const formInputText = document.querySelector('#todo-form__txt');
  const todoList = document.querySelector('#todo-list');
  const todoItemCheckboxes = document.querySelectorAll('[data-item-cb]');
  const todoItemDeleteButtons = document.querySelectorAll('.hero-btn-del');
  const itemsLeftCounter = document.querySelector('#todo-items__left');
  const buttonFilterAll = document.querySelector('#btn-all');
  const buttonFilterActive = document.querySelector('#btn-active');
  const buttonFilterCompleted = document.querySelector('#btn-completed');
  const buttonClearCompleted = document.querySelector('#btn-clear');
  const buttonThemeToggle = document.querySelector('#btn-theme-toggle');
  const themeIcons = document.querySelectorAll('.theme-icon');
  const buttonLockUnlock = document.querySelector('#btn__lock-unlock');
  // Creating an object of the "Sortable" Framework, which will take care of the drag and drop functionality
  const sortable = new Sortable(todoList, {
    delay: 200,
    delayOnTouchOnly: true,
    animation: 200,
    ghostClass: 'blue-background-class',
    dragClass: 'sortable-drag',
  });

  setItemsLeftCounter();

  // Check if the user submitted an empty value
  function isInputEmpty(inputValue) {
    if (inputValue.trim().length === 0) return true;
    return false;
  }

  // Every time a new valid todo item is submitted, it will create new elements, configure and call up all necessary functions, and show it on the screen
  function createNewTodo(value, status) {
    // Creating all the new todo item elements
    const todoItemContainer = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const buttonDelete = document.createElement('button');

    // Adding class to new elements
    todoItemContainer.classList.add('hero-item-container');
    checkbox.classList.add('hero-cb');
    label.classList.add('hero-label');
    buttonDelete.classList.add('hero-btn-del');

    // Setting up the new elements
    todoItemContainer.setAttribute('data-completed', status);
    todoItemContainer.setAttribute('data-active', !status);
    checkbox.checked = status;
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-item-cb', '');
    label.innerText = value;
    label.setAttribute('data-item-lbl', '');
    buttonDelete.ariaLabel = 'Click to delete todo';

    // Adding Event Listener to new elements
    checkbox.addEventListener('click', checkOrUncheckCheckbox);
    buttonDelete.addEventListener('click', removeTodoItem);

    // Putting all todo item elements in their respective container
    todoItemContainer.append(checkbox, label, buttonDelete);
    todoList.appendChild(todoItemContainer);

    reorderCheckBoxesId();
    setItemsLeftCounter();
    updateDisplayedItems();
  }

  // Will check or uncheck the input checkbox
  function checkOrUncheckCheckbox(event) {
    const todoItemContainer = event.currentTarget.parentElement;
    const status = event.currentTarget.checked;

    todoItemContainer.setAttribute('data-completed', status);
    todoItemContainer.setAttribute('data-active', !status);

    setItemsLeftCounter();
    updateDisplayedItems();
  }

  // Every time a new todo item is created, it will reorder the ids for all checkboxes inside a "Todo item container"
  function reorderCheckBoxesId() {
    const todoItemContainers = document.querySelectorAll('.hero-item-container');
    const todoItemCheckBoxes = document.querySelectorAll('[data-item-cb]');
    const todoItemLabels = document.querySelectorAll('[data-item-lbl]');

    for (let i = 0, idNumber = 1; i < todoItemContainers.length; i++, idNumber++) {
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
    const todoItemContainer = event.currentTarget.parentElement;

    todoList.removeChild(todoItemContainer);
    reorderCheckBoxesId();
    setItemsLeftCounter();
  }

  // Remove ALL todo items check as completed from the list, when the user clicks the delete completed button
  function removeCompletedTodoItems() {
    const completedTodoItems = document.querySelectorAll('[data-completed="true"]');

    completedTodoItems.forEach(todoItem => todoList.removeChild(todoItem));
    reorderCheckBoxesId();
  }

  // Will remove the class that was hidden from the previous todo items, and then add this same class to the current filtered todo items
  function changeCurrentFilteredTodoItems(currentTodoItemsFiltered) {
    const previousTodoItemsFiltered = document.querySelectorAll('.hero-item-container--hide');

    previousTodoItemsFiltered.forEach(todoItem => {
      todoItem.classList.remove('hero-item-container--hide');
    });

    // If the parameter value is "truthy", this will be executed
    if (currentTodoItemsFiltered) {
      currentTodoItemsFiltered.forEach(todoItem => {
        todoItem.classList.add('hero-item-container--hide');
      });
    }
  }

  // Will remove class and attribute from the previous filter button, and add to the current filter button
  function changeCurrentFilterButtonOn(currentFilterButton) {
    const previousFilterButton = document.querySelector('[data-filter-on="true"]');

    previousFilterButton.classList.remove('filter__button--on');
    previousFilterButton.setAttribute('data-filter-on', false);
    currentFilterButton.classList.add('filter__button--on');
    currentFilterButton.setAttribute('data-filter-on', true);
  }

  // "Filters" and shows all todo items on the screen
  function displayAllTodoItems() {
    changeCurrentFilterButtonOn(buttonFilterAll);
    changeCurrentFilteredTodoItems();
  }

  // Will filter all todo items NOT marked as completed and show only them on the screen
  function displayOnlyActiveTodoItems() {
    const completedTodoItems = document.querySelectorAll('[data-active="false"]');

    changeCurrentFilterButtonOn(buttonFilterActive);
    changeCurrentFilteredTodoItems(completedTodoItems);
  }

  // Will filter all todo items MARKED as completed and show only them on the screen
  function displayOnlyCompletedTodoItems() {
    const activeTodoItems = document.querySelectorAll('[data-completed="false"]');

    changeCurrentFilterButtonOn(buttonFilterCompleted);
    changeCurrentFilteredTodoItems(activeTodoItems);
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

  // It will add or remove the "light-mode" class on the body tag and change the current theme icon displayed
  function changeCurrentTheme() {
    const body = document.body;
    const backgroundImageContainer = document.querySelector('#background-img');

    body.classList.toggle('light-theme');
    backgroundImageContainer.classList.toggle('light-theme');
    themeIcons.forEach(icon => icon.classList.toggle('active-theme'));

    const isLightModeOn = body.classList.contains('light-theme');
    if (isLightModeOn) {
      buttonThemeToggle.ariaLabel = 'Click to change theme to dark mode';
      return;
    }
    buttonThemeToggle.ariaLabel = 'Click to change theme to light mode';
  }

  // This will lock or unclock the drag and drop function for the user. It is most useful for mobile users
  function lockUnclockDragAndDrop() {
    const state = sortable.option('disabled'); // get the current boolean value

    sortable.option('disabled', !state); // set the new boolean value
    buttonLockUnlock.classList.toggle('lock-drag-drop');

    if (state) {
      buttonLockUnlock.ariaLabel = 'Click to disable the drag and drop function';
      buttonLockUnlock.title = 'disable drag and drop';
      return;
    }
    buttonLockUnlock.ariaLabel = 'Click to enable the drag and drop function';
    buttonLockUnlock.title = 'enable drag and drop';
  }

  // Event Listener for the Todo Form
  todoForm.addEventListener('submit', event => {
    event.preventDefault();
    const inputTextValue = formInputText.value;

    if (isInputEmpty(inputTextValue)) {
      return todoForm.classList.add('invalid-value');
    }

    const formCheckboxStatus = formCheckbox.checked;
    todoForm.classList.remove('invalid-value');
    createNewTodo(inputTextValue, formCheckboxStatus);
  });

  // Event Listener for all Todo Item Checkboxes
  todoItemCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', checkOrUncheckCheckbox);
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

  // Event Listener for the Theme Toggle Button
  buttonThemeToggle.addEventListener('click', changeCurrentTheme);

  // Event Listener for the Lock Drag and Drop Button
  buttonLockUnlock.addEventListener('click', lockUnclockDragAndDrop);
})();
