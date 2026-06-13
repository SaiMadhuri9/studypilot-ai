console.log("StudyPilot Frontend Loaded");

let allTasks = [];

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const goalInput = document.getElementById("goalInput");
const generateBtn = document.getElementById("generateBtn");
const daysInput = document.getElementById("daysInput");
const studyInfo = document.getElementById("studyInfo");
const roadmapSelect =
  document.getElementById("roadmapSelect");
const streakBox =
  document.getElementById("streakBox");
const achievementBox =
  document.getElementById("achievementBox");
const roadmapInfo =
  document.getElementById("roadmapInfo");
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

function loadTasks(goal = "") {

  taskList.innerHTML = "";

 let url = "http://localhost:5000/api/tasks";

if (goal) {
  url += `?goal=${goal}`;
}

fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tasks = data.data;
      allTasks = tasks;
      const welcomeBox =
  document.getElementById("welcomeBox");

if (tasks.length > 0) {
  welcomeBox.style.display = "none";
} else {
  welcomeBox.style.display = "block";
}
      const generatedTasks =
  tasks.filter(task => task.isGenerated);

const completedGeneratedTasks =
  generatedTasks.filter(
    task => task.completed
  ).length;

const roadmapProgress =
  generatedTasks.length === 0
    ? 0
    : Math.round(
        (
          completedGeneratedTasks /
          generatedTasks.length
        ) * 100
      );
      if (generatedTasks.length === 0) {
  roadmapInfo.style.display = "none";
} else {
  roadmapInfo.style.display = "block";
}

let achievementTitle = "";
let achievementDescription = "";

if (completedGeneratedTasks >= 1) {
  achievementTitle = "🥉 Roadmap Beginner";
  achievementDescription =
    "Completed your first study task.";
}

if (roadmapProgress >= 50) {
  achievementTitle = "🥈 Halfway Hero";
  achievementDescription =
    "Reached 50% roadmap completion.";
}

if (roadmapProgress === 100) {
  achievementTitle = "🥇 Roadmap Master";
  achievementDescription =
    "Completed your roadmap.";
}

if (achievementTitle === "") {
  achievementBox.style.display = "none";
} else {
  achievementBox.style.display = "block";

 achievementBox.innerHTML = `
  <h3>🏆 Achievement Unlocked</h3>

  <h2>${achievementTitle}</h2>

  <p>${achievementDescription}</p>
`;
}


const streak =
  Number(
    localStorage.getItem("studyStreak")
  ) || 0;

const dayText =
  streak === 1 ? "Day" : "Days";


  if (tasks.length === 0) {

  localStorage.removeItem("studyStreak");
  localStorage.removeItem("lastStudyDate");

  streakBox.style.display = "none";

} else {

  streakBox.style.display = "block";

}

streakBox.innerHTML = `
  <h3>🔥 Study Streak</h3>

  <p>
    Current Streak:
    <strong>
      ${streak} ${dayText}
    </strong>
  </p>
`;

      console.log("Generated Tasks:", generatedTasks.length);
console.log("Roadmap Progress:", roadmapProgress);

     roadmapInfo.innerHTML = `
  <h3>Roadmap Progress</h3>

  <p>
    <strong>Completed Topics:</strong>
    ${completedGeneratedTasks}
    /
    ${generatedTasks.length}
  </p>

  <p>
    <strong>Progress:</strong>
    ${roadmapProgress}%
  </p>

  <div class="roadmap-progress-bar">
    <div
      class="roadmap-progress-fill"
      style="width: ${roadmapProgress}%"
    ></div>
  </div>
`;
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

  <div class="task-content">

    <div class="task-title ${task.completed ? "completed" : ""}">
      ${task.completed ? "✅" : "❌"}
      ${task.title}
    </div>

    <span class="difficulty ${task.difficulty}">
      ${getDifficultyLabel(task.difficulty)}
    </span>

  </div>

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
loadGoals();


async function deleteTask(id) {

  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks(roadmapSelect.value);

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

function updateStudyStreak() {

  const today = new Date();

  const todayString =
    today.toDateString();

  const lastStudyDate =
    localStorage.getItem(
      "lastStudyDate"
    );

  let streak =
    parseInt(
      localStorage.getItem(
        "studyStreak"
      )
    ) || 0;

  if (!lastStudyDate) {

    streak = 1;

  } else {

    const lastDate =
      new Date(lastStudyDate);

    const differenceInDays =
      Math.floor(
        (
          today - lastDate
        ) /
        (1000 * 60 * 60 * 24)
      );

    if (differenceInDays === 0) {

      return;

    } else if (
      differenceInDays === 1
    ) {

      streak++;

    } else {

      streak = 1;

    }

  }

  localStorage.setItem(
    "studyStreak",
    streak
  );

  localStorage.setItem(
    "lastStudyDate",
    todayString
  );

}

// const resetStreakBtn =
//   document.getElementById("resetStreakBtn");

// if (resetStreakBtn) {
//   resetStreakBtn.addEventListener(
//     "click",
//     () => {

//     localStorage.removeItem(
//       "studyStreak"
//     );

//     localStorage.removeItem(
//       "lastStudyDate"
//     );

//     loadTasks();

//   }
// );
// }



async function completeTask(id) {

  const task =
    allTasks.find(
      task => task._id === id
    );

  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: true
    })
  });

  if (
    task &&
    task.isGenerated &&
    !task.completed
  ) {
    updateStudyStreak();
  }

 loadTasks(roadmapSelect.value);

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

  <p>
    <strong>Difficulty:</strong>
    ${getDifficultyLabel(data.difficulty)}
  </p>

  <p>
    <strong>Topics Per Day:</strong>
    ${data.topicsPerDay}
  </p>

  <p>
    <strong>Estimated Study Time:</strong>
    ${data.estimatedHoursPerDay} hours/day
  </p>

  <p>${data.warning}</p>
`;

  goalInput.value = "";

  loadTasks();


document.getElementById("welcomeBox").style.display = "none";
  
});


});

roadmapSelect.addEventListener(
  "change",
  () => {

    const selectedGoal =
      roadmapSelect.value;

    loadTasks(selectedGoal);

  }
);

function loadGoals() {

  fetch("http://localhost:5000/api/tasks/goals")
    .then(response => response.json())
    .then(data => {

      roadmapSelect.innerHTML =
        `<option value="">All Roadmaps</option>`;

      data.data.forEach(goal => {

        roadmapSelect.innerHTML += `
          <option value="${goal}">
            ${goal}
          </option>
        `;

      });

    });

}

