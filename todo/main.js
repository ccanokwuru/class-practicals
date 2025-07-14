// populate todos
const todo_list = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const todo_title = document.getElementById("todo");
const todo_id = document.getElementById("todo-id");

// local store of data
let todos = [];

const getTodos = () => {
  const storedTodos = localStorage.getItem("todos");
  if (!storedTodos) {
    return (todos = []);
  }
  return (todos = JSON.parse(storedTodos));
};

// let todos = [
//   {
//     id: 1,
//     completed: true,
//     title: "Todo",
//   },
//   {
//     id: 2,
//     completed: false,
//     title: "Todo 01",
//   },
//   {
//     id: 3,
//     completed: true,
//     title: "Todo 02",
//   },
//   {
//     id: 4,
//     completed: false,
//     title: "Todo 03",
//   },
//   {
//     id: 5,
//     completed: false,
//     title: "Todo 04",
//   },
//   {
//     id: 6,
//     completed: false,
//     title: "Todo 05",
//   },
// ];

let filtered_todos = todos;

// filter todos
const filterTodos = (completed = undefined) => {
  if (completed === undefined) return todos;
  return todos.filter((todo) => todo.completed == completed);
};

// count active todos
const active_count = document.getElementById("active-count");
const countActiveTodos = () => {
  const active_todos = filterTodos(false);
  return active_todos.length;
};

const setFilteredTodos = (completed = undefined) => {
  filtered_todos = filterTodos(completed);
  // update the dom
  renderTodos();
};

const updateTodo = (id) => {
  // consider each individual todo and its index
  todos = todos.map((t, i) => {
    // compare idx to i
    // if equal just return t as todo
    if (t.id !== id) return t;
    t.completed = !t.completed;
    return t;
  });

  localStorage.setItem("todos", JSON.stringify(todos));

  setFilteredTodos();
};

// render todos to page
const renderTodos = () => {
  todo_list.innerHTML = "";
  filtered_todos.forEach((todo, idx) => {
    const todo_item_id = `todo-${todo.id}`;
    //   creating indivitual todo list item using li
    const todo_item = document.createElement("li");
    todo_item.setAttribute("id", `item-${todo_item_id}`);
    // todo_item.setAttribute("id", "todo-" + idx);
    todo_item.setAttribute("class", "todo-item");

    // check box for status
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", todo_item_id);
    checkbox.setAttribute("id", todo_item_id);
    checkbox.onchange = () => updateTodo(todo.id);
    checkbox.checked = todo.completed;

    // todo title
    const label = document.createElement("label");
    label.setAttribute("for", todo_item_id);
    label.textContent = todo.title;

    // action buttons
    const edit_btn = document.createElement("button");
    edit_btn.textContent = "edit";
    edit_btn.addEventListener("click", () => {
      console.log("editing");
      todo_title.value = todo.title;
      todo_id.value = todo.id;
    });

    const delete_btn = document.createElement("button");
    delete_btn.textContent = "delete";
    delete_btn.addEventListener("click", () => {
      console.log("deleting");
      todos = todos.filter((t) => t.id != todo.id);
      localStorage.setItem("todos", JSON.stringify(todos));

      setFilteredTodos();
    });

    // add to the DOM
    todo_item.appendChild(checkbox);
    todo_item.appendChild(label);
    todo_list.appendChild(todo_item);
    todo_list.appendChild(edit_btn);
    todo_list.appendChild(delete_btn);
  });
  active_count.textContent = `${countActiveTodos()} Active Todos`;
};

// handle category toggle
const all_btn = document.getElementById("cat-all");
const active_btn = document.getElementById("cat-active");
const completed_btn = document.getElementById("cat-completed");

all_btn.addEventListener("click", () => {
  console.log("all");
  setFilteredTodos();
});

active_btn.addEventListener("click", () => {
  console.log("active");
  setFilteredTodos(false);
});

completed_btn.addEventListener("click", () => {
  console.log("completed");
  setFilteredTodos(true);
});

// handle clear completed
const clearCompleted = () => {
  todos = filterTodos(false);
  setFilteredTodos(false);
};

const clear_btn = document.getElementById("clear-completed");

clear_btn.addEventListener("click", () => {
  console.log("clear completed");
  clearCompleted();
});

// handle form
form.onsubmit = (event) => {
  event.preventDefault();
  console.log("submit clicked");
  submitTodo();
};
// handle form submition
const submitTodo = () => {
  let title = todo_title.value;
  let id = todo_id.value;
  const new_todo = !id || id == "";
  let completed = false;

  if (new_todo) {
    id = `${Math.ceil(Math.random() * 10000).toString(16)}-${Date.now()}`;
  }

  let todo = {
    title,
    id,
  };

  console.log({ todo });

  form.reset();

  if (!new_todo) {
    todos = todos.map((t) => {
      if (t.id != id) return t;
      t = { ...t, ...todo };
      return t;
    });
  } else {
    todo.completed = completed;
    todos.push(todo);
  }
  localStorage.setItem("todos", JSON.stringify(todos));
  setFilteredTodos();
};
getTodos();
filtered_todos = todos;
renderTodos();
