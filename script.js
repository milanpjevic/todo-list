// -------------------- Selectors --------------------------
const todoInput = document.querySelector(".todo-input");
const submit = document.querySelector(".addBtn");
const todos = document.querySelector(".todos");
const inputForm = document.querySelector(".input-form");
const importanceFilter = document.querySelector(".importance");
const timeFilter = document.querySelector(".time");
const complishonFilter = document.querySelector(".complishon");
const searchFilter = document.querySelector(".searchBtn");
const searchInput = document.querySelector(".search-input");
const resetFilter = document.querySelector(".resetBtnRight");

// --------------------- Functions -------------------------
const createTodo = (text, flaged, id, done) => {
  // Create DIV - "todo"
  const todo = document.createElement("div");
  todo.classList.add("todo");
  if (done) {
    todo.classList.add("half-opacity");
  }
  // Create INPUT - "todo-text"
  const inputText = document.createElement("input");
  inputText.classList.add("todo-text");
  if (done) {
    inputText.classList.add("line-through");
  }
  inputText.setAttribute("type", "text");
  inputText.setAttribute("value", `${text}`);
  // Create BUTTON - "btn flagBtn valueFlagBtn" data-flag
  const valueFlagBtn = document.createElement("button");
  valueFlagBtn.classList.add("btn");
  valueFlagBtn.classList.add("flagBtn");
  valueFlagBtn.classList.add("valueFlagBtn");
  if (flaged) {
    valueFlagBtn.classList.add("orange");
  }
  valueFlagBtn.setAttribute("data-flag", `${id}`);
  valueFlagBtn.innerHTML = `<i class="far fa-flag"></i>`;
  // Create BUTTON - "btn doneBtn" data-done
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("btn");
  doneBtn.classList.add("doneBtn");
  if (done) {
    doneBtn.classList.add("orange");
  }
  doneBtn.setAttribute("data-done", `${id}`);
  doneBtn.innerHTML = `<i class="fas fa-check"></i>`;
  // Create BUTTON - "btn trashBtn" data-trash
  const trashBtn = document.createElement("button");
  trashBtn.classList.add("btn");
  trashBtn.classList.add("trashBtn");
  trashBtn.setAttribute("data-trash", `${id}`);
  trashBtn.innerHTML = `<i class="far fa-trash-alt"></i>`;
  // Append
  todos.appendChild(todo);
  todo.appendChild(inputText);
  todo.appendChild(valueFlagBtn);
  todo.appendChild(doneBtn);
  todo.appendChild(trashBtn);
};

const addTodo = (e) => {
  e.preventDefault();
  const textValue = todoInput.value;
  const flag = e.target.previousElementSibling;
  let flagValue;
  if (todoInput.value !== "") {
    flag.classList.contains("orange")
      ? (flagValue = true)
      : (flagValue = false);
    const idValue = idCreator();
    createTodo(textValue, flagValue, idValue);
    setLocalData(textValue, flagValue, idValue);
  }
  todoInput.value = "";
  flag.classList.remove("orange");
};

const idCreator = () => {
  const date = new Date();
  let timestamp;
  timestamp = date.getFullYear().toString();
  timestamp +=
    (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1).toString();
  timestamp += (date.getDate() < 9 ? "0" : "") + date.getDate().toString();
  timestamp += (date.getHours() < 9 ? "0" : "") + date.getHours().toString();
  timestamp +=
    (date.getMinutes() < 9 ? "0" : "") + date.getMinutes().toString();
  timestamp +=
    (date.getSeconds() < 9 ? "0" : "") + date.getSeconds().toString();
  const ms = miliseconds(date);
  timestamp += ms;
  return timestamp;
};

const miliseconds = (date) => {
  let ms;
  if (date.getMilliseconds() < 9) {
    ms = "00" + date.getMilliseconds().toString();
  } else if (date.getMilliseconds() < 100) {
    ms = "0" + date.getMilliseconds().toString();
  } else {
    ms = date.getMilliseconds().toString();
  }
  return ms;
};

const getTodos = () => {
  let data = getLocalData();
  data.forEach((item) => {
    createTodo(item.text, item.flag, item.id, item.done);
  });
};

const setLocalData = (textValue, flagValue, idValue) => {
  let data = getLocalData();
  data.push({
    id: idValue,
    flag: flagValue,
    done: false,
    born: idValue,
    edit: idValue,
    text: textValue,
  });
  localStorage.setItem("data", JSON.stringify(data));
};

const getLocalData = () => {
  let data;
  if (localStorage.getItem("data") === null) {
    data = [];
  } else {
    data = JSON.parse(localStorage.getItem("data"));
  }
  return data;
};

const deleteTodo = (e) => {
  const target = e.target;
  if (target.classList.contains("trashBtn")) {
    const todo = target.parentElement;
    // Delete from localStorage
    deleteLocalData(todo);
    // Removes from DOM
    todo.classList.add("gone");
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }
};

const deleteLocalData = (todo) => {
  const id = todo.children[1].dataset.flag;
  let data = getLocalData();
  data.forEach((item) => {
    if (item.id === id) {
      const index = data.indexOf(item);
      data.splice(index, 1);
    }
  });
  localStorage.setItem("data", JSON.stringify(data));
};

const editTodo = (e) => {
  let data = getLocalData();
  const target = e.target;
  const newText = target.value;

  if (target.classList.contains("todo-text")) {
    const todo = target.parentElement;
    const id = todo.children[1].dataset.flag;

    data.forEach((item) => {
      if (item.id === id) {
        item.text = newText;
        item.edit = idCreator();
      }
    });
  }
  localStorage.setItem("data", JSON.stringify(data));
};

const flagInputTodo = (e) => {
  const item = e.target;
  if (item.classList.contains("inputFlagBtn")) {
    item.classList.toggle("orange");
  }
};

const flagTodo = (e) => {
  let data = getLocalData();
  const target = e.target;
  if (target.classList.contains("valueFlagBtn")) {
    const todo = target.parentElement;
    const id = todo.children[1].dataset.flag;
    target.classList.toggle("orange");
    target.classList.contains("orange");
    if (target.classList.contains("orange")) {
      data.forEach((item) => {
        if (item.id === id) {
          item.flag = true;
        }
      });
    } else {
      data.forEach((item) => {
        if (item.id === id) {
          item.flag = false;
        }
      });
    }
  }
  localStorage.setItem("data", JSON.stringify(data));
};

const checkTodo = (e) => {
  let data = getLocalData();
  const target = e.target;
  if (target.classList.contains("doneBtn")) {
    const todo = target.parentElement;
    const id = todo.children[1].dataset.flag;
    target.classList.toggle("orange");
    target.previousElementSibling.previousElementSibling.classList.toggle(
      "line-through"
    );
    target.parentElement.classList.toggle("half-opacity");

    if (target.classList.contains("orange")) {
      data.forEach((item) => {
        if (item.id === id) {
          item.done = true;
        }
      });
    } else {
      data.forEach((item) => {
        if (item.id === id) {
          item.done = false;
        }
      });
    }
  }
  localStorage.setItem("data", JSON.stringify(data));
};

const filterSearch = (e) => {
  e.preventDefault();
  // Remove all todos from DOM
  const todoList = [...todos.children];
  todoList.forEach((todo) => todo.remove());
  // Display only matched
  data = getLocalData();
  data.forEach((item) => {
    const text = item.text;
    const flag = item.flag;
    const id = item.id;
    const done = item.done;
    if (text.includes(searchInput.value)) {
      createTodo(text, flag, id, done);
    }
  });

  searchInput.value = "";
};

const filterFlag = (e) => {
  // Removes all todos from DOM
  const todoList = [...todos.children];
  todoList.forEach((todo) => todo.remove());

  // Displys todos by importance
  let data = getLocalData();
  data.forEach((item) => {
    const text = item.text;
    const flag = item.flag;
    const id = item.id;
    const done = item.done;

    const option = e.target.value;
    switch (option) {
      case "all":
        createTodo(text, flag, id, done);
        break;
      case "high":
        if (flag === true) {
          createTodo(text, flag, id, done);
        }
        break;
      case "low":
        if (flag === false) {
          createTodo(text, flag, id, done);
        }
        break;
    }
  });

  timeFilter.selectedIndex = 0;
  complishonFilter.selectedIndex = 0;
};

const filterChecked = (e) => {
  // Removes all todos from DOM
  const todoList = [...todos.children];
  todoList.forEach((todo) => todo.remove());

  // Displys todos by importance
  let data = getLocalData();
  data.forEach((item) => {
    const text = item.text;
    const flag = item.flag;
    const id = item.id;
    const done = item.done;

    const option = e.target.value;
    switch (option) {
      case "all":
        createTodo(text, flag, id, done);
        break;
      case "completed":
        if (done) {
          createTodo(text, flag, id, done);
        }
        break;
      case "uncompleted":
        if (!done) {
          createTodo(text, flag, id, done);
        }
        break;
    }
  });
  importanceFilter.selectedIndex = 0;
  timeFilter.selectedIndex = 0;
};

const filterTime = (e) => {
  // Removes all todos from DOM
  const todoList = [...todos.children];
  todoList.forEach((todo) => todo.remove());
  // Displys todos by importance
  let data = getLocalData();

  const firstBorn = [
    ...data.sort(function (a, b) {
      return parseInt(a.born) - parseInt(b.born);
    }),
  ];

  const lastEdit = [
    ...data.sort(function (a, b) {
      return parseInt(b.edit) - parseInt(a.edit);
    }),
  ];

  const option = e.target.value;
  switch (option) {
    case "older":
      firstBorn.forEach((item) => {
        createTodo(item.text, item.flag, item.id, item.done);
      });
      break;
    case "newer":
      firstBorn.reverse().forEach((item) => {
        createTodo(item.text, item.flag, item.id, item.done);
      });
      break;
    case "edited":
      lastEdit.forEach((item) => {
        createTodo(item.text, item.flag, item.id, item.done);
      });
      break;
  }
  importanceFilter.selectedIndex = 0;
  complishonFilter.selectedIndex = 0;
};

const filterReset = (e) => {
  importanceFilter.selectedIndex = 0;
  timeFilter.selectedIndex = 0;
  complishonFilter.selectedIndex = 0;

  const todoList = [...todos.children];
  todoList.forEach((todo) => todo.remove());
  getTodos();
};

// ------------------------- APP --------------------------
const app = () => {
  document.addEventListener("DOMContentLoaded", getTodos);
  inputForm.addEventListener("click", flagInputTodo);
  submit.addEventListener("click", addTodo);
  todos.addEventListener("click", deleteTodo);
  todos.addEventListener("click", flagTodo);
  todos.addEventListener("click", checkTodo);
  todos.addEventListener("change", editTodo);
  importanceFilter.addEventListener("click", filterFlag);
  timeFilter.addEventListener("click", filterTime);
  complishonFilter.addEventListener("click", filterChecked);
  searchFilter.addEventListener("click", filterSearch);
  resetFilter.addEventListener("click", filterReset);
};

app();
