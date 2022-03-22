"use strict";

// tremos Fechas del header
const numberDate = document.getElementById("numberDate");
const monthDate = document.getElementById("monthDate");
const yearDate = document.getElementById("yearDate");
const textDate = document.getElementById("textDate");

// valores de las fechas del header
const setDate = () => {
  const date = new Date();
  numberDate.textContent = date.toLocaleString("es", { day: "numeric" });
  yearDate.textContent = date.toLocaleString("es", { year: "numeric" });
  monthDate.textContent = date.toLocaleString("es", { month: "short" });
  textDate.textContent = date.toLocaleString("es", { weekday: "long" });
};
setDate();

// Tremos los elementos
const taskForm = document.querySelector("form");
const taskList = document.querySelector("ul");
const removeTasks = document.getElementById("removeTasks");

// evento checkbox
taskList.addEventListener("click", (e) => {
  if (e.target.id === "doneInput") {
    e.target.parentElement.nextElementSibling.classList.toggle("done");
  }
  const tasksFromLocal = getTasksFromLocalStorage(); // TasksLocalStorage
  const pText = e.target.parentElement.nextElementSibling.textContent; // texto
  const pClassValue = e.target.parentElement.nextElementSibling.classList.value; // valor de class
  // cambio los valores del localStorage y los guerdo de nuevo.
  const localStorageActual = tasksFromLocal.map((task) => {
    if (pClassValue === "done") {
      if (pText === task.content) {
        task.done = true;
        //tasks.checked = true;
      }
    } else {
      if (pText === task.content) {
        task.done = false;
        //tasks.checked = false;
      }
    }
    return task;
  });
  //console.log(localStorageActual);
  localStorage.setItem("tasks", JSON.stringify(localStorageActual));
});

// evento para Button = removeTasks
removeTasks.addEventListener("click", (e) => {
  const tasksFromLocalStorage = getTasksFromLocalStorage();
  const notDoneTasks = tasksFromLocalStorage.filter((task) => {
    return task.done === false;
  });
  localStorage.setItem("tasks", JSON.stringify(notDoneTasks));
  generateTasksList();
});

// evento para form
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // cancela acción Defaults
  // valores de las tareas
  const taskObject = {
    content: e.target.elements.newTask.value,
    urgency: +e.target.elements.importance.value,
    done: false,
    taskDate: new Date().toLocaleString().split(",")[0],
  };

  if (!taskObject.content) return; // no permite tareas sin contenido.
  addToList(taskObject); // llama a la función y crea los elementos en ul
  taskForm.reset(); // reset al form
  // actualizamos el localStorage
  const tasksFromLocalStorage = getTasksFromLocalStorage();
  localStorage.setItem(
    "tasks",
    JSON.stringify([...tasksFromLocalStorage, taskObject])
  );
});

// Creador de nuevas tasks
const addToList = (taskObject) => {
  if (!taskObject.content) return; // no permite tareas sin contenido.
  // elementos de la nueva tarea
  const li = document.createElement("li");
  const article = document.createElement("article");
  const input = document.createElement("input");
  const aside = document.createElement("aside");
  const taskP = document.createElement("p");
  const taskDateP = document.createElement("p");
  // clase del aside
  aside.classList.add("articleAside");
  // id taskP
  taskP.id = "taskP";
  // valor del imput
  taskP.textContent = taskObject.content;
  // fecha
  taskDateP.textContent = taskObject.taskDate;
  // li classList
  li.classList.add("roundBorder", "li");
  // se crea el checkbox para marcar la tarea
  input.type = "checkbox";
  input.id = "doneInput";
  // si se cumple, deja marcado el checket y agrega la clase "done"
  if (taskObject.done === true) {
    input.checked = true;
    taskP.classList.add("done");
  }
  // si urgency es true, se agrega la clase "importante"
  if (taskObject.urgency) {
    article.classList.add("important");
  }
  // se ordena todo
  taskList.append(li);
  li.append(article);
  article.append(aside, taskP);
  aside.append(input, taskDateP);
};

// tareas del localStorage
const getTasksFromLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasksFromLocalStorage;
};

// Itera las tareas del LocalStorage y las manda con parametro a addToList
const generateTasksList = () => {
  taskList.innerHTML = ""; // vacia la lista
  const tasksFromLocalStorage = getTasksFromLocalStorage();
  for (const taskObject of tasksFromLocalStorage) {
    addToList(taskObject);
  }
};

generateTasksList();
