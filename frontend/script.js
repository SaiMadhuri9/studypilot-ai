console.log("StudyPilot Frontend Loaded");

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const goalInput = document.getElementById("goalInput");
const generateBtn = document.getElementById("generateBtn");
const daysInput = document.getElementById("daysInput");

function loadTasks() {

  taskList.innerHTML = "";

  fetch("http://localhost:5000/api/tasks")
    .then((response) => response.json())
    .then((data) => {

      data.data.forEach((task) => {

        taskList.innerHTML += `
        <li>
          ${task.completed ? "✅" : "❌"} ${task.title}

          <button onclick="completeTask('${task._id}')">
            Complete
          </button>

          <button onclick="deleteTask('${task._id}')">
            Delete
          </button>
        </li>
        `;

      });

    });

}
loadTasks();


async function deleteTask(id) {

  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks();

}


  addBtn.addEventListener("click", () => {

  if (taskInput.value === "") {
    alert("Please enter a task");
    return;
  }

 fetch("http://localhost:5000/api/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: taskInput.value
  })
})
.then((response) => response.json())
.then((data) => {
  console.log(data);

  taskInput.value = "";

  loadTasks();
});

});


async function completeTask(id) {

  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: true
    })
  });

  loadTasks();

}

generateBtn.addEventListener("click", () => {

 
  const goal = goalInput.value;
const days = daysInput.value;

  if (goal === "") {
    alert("Please enter a goal");
    return;
  }
  if (days === "") {
  alert("Please enter number of days");
  return;
}

  fetch("http://localhost:5000/api/studyplan/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
  goal: goal,
  days: days
})
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    goalInput.value = "";

    loadTasks();
  });

});