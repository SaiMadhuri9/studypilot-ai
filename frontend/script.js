console.log("StudyPilot Frontend Loaded");

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const goalInput = document.getElementById("goalInput");
const generateBtn = document.getElementById("generateBtn");
const daysInput = document.getElementById("daysInput");
const studyInfo = document.getElementById("studyInfo");
const progressFill =
  document.getElementById("progressFill");
const totalTasksEl =
  document.getElementById("totalTasks");

const completedTasksEl =
  document.getElementById("completedTasks");

const remainingTasksEl =
  document.getElementById("remainingTasks");

const progressPercentEl =
  document.getElementById("progressPercent");

function getDifficultyLabel(level) {

  if (level === "easy") {
    return "🟢 Easy";
  }

  if (level === "moderate") {
    return "🟡 Moderate";
  }

  if (level === "intensive") {
    return "🟠 Intensive";
  }

  if (level === "extreme") {
    return "🔴 Extreme";
  }

  return level;
}

function loadTasks() {

  taskList.innerHTML = "";

  fetch("http://localhost:5000/api/tasks")
    .then((response) => response.json())
    .then((data) => {
      const tasks = data.data;

const totalTasks = tasks.length;

const completedTasks =
  tasks.filter(task => task.completed).length;

const remainingTasks =
  totalTasks - completedTasks;

const progressPercent =
  totalTasks === 0
    ? 0
    : Math.round(
        (completedTasks / totalTasks) * 100
      );
      totalTasksEl.textContent =
  totalTasks;

completedTasksEl.textContent =
  completedTasks;

remainingTasksEl.textContent =
  remainingTasks;

progressPercentEl.textContent =
  progressPercent + "%";

  progressFill.style.width =
  progressPercent + "%";

      data.data.forEach((task) => {

        taskList.innerHTML += `
        
         <li>
  <span class="${task.completed ? "completed" : ""}">
  ${task.completed ? "✅" : "❌"} ${task.title}
</span>

<span class="difficulty ${task.difficulty}">
  ${getDifficultyLabel(task.difficulty)}
</span>

         <div class="task-actions">
  <button onclick="completeTask('${task._id}')">
    Complete
  </button>

  <button onclick="deleteTask('${task._id}')">
    Delete
  </button>
</div>
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

  if (!data.success) {

    alert(
      data.message +
      "\n\nSupported Goals:\n" +
      data.suggestions.join("\n")
    );

    return;
  }

  studyInfo.style.display = "block";

  studyInfo.innerHTML = `
    <h3>Study Plan Info</h3>
    <p><strong>Difficulty:</strong> ${data.difficulty}</p>
    <p><strong>Topics Per Day:</strong> ${data.topicsPerDay}</p>
    <p>${data.warning}</p>
  `;

  goalInput.value = "";

  loadTasks();

});

});

