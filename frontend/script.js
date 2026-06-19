console.log("StudyPilot Frontend Loaded");

let allTasks = [];

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const goalInput = document.getElementById("goalInput");
const generateBtn = document.getElementById("generateBtn");
const daysInput = document.getElementById("daysInput");
const studyInfo = document.getElementById("studyInfo");
const roadmapProgressCards =
document.getElementById(
  "roadmapProgressCards"
);
const loadingBox =
  document.getElementById("loadingBox");
const assistantDays =
  document.getElementById("assistantDays");
const assistantInput =
  document.getElementById("assistantInput");
  const roadmapTasks =
document.getElementById("roadmapTasks");

const assistantBtn =
  document.getElementById("assistantBtn");
const roadmapCards =
  document.getElementById("roadmapCards");
const roadmapSelect =
  document.getElementById("roadmapSelect");
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
  const streakCountEl =
document.getElementById("streakCount");

const achievementCountEl =
document.getElementById("achievementCount");

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
      let filteredTasks;

if (goal) {
  filteredTasks = tasks;
} else {
  filteredTasks =
    tasks.filter(task => !task.isGenerated);
}
      allTasks = tasks;
      const todayTasksList =
document.getElementById(
"todayTasksList"
);

if(todayTasksList){

todayTasksList.innerHTML = "";

filteredTasks
.filter(task => !task.completed)
.slice(0,5)
.forEach(task => {

todayTasksList.innerHTML += `
<li>
📖 ${task.title}
</li>
`;

});

if(filteredTasks.length === 0){

todayTasksList.innerHTML =
"<li>No tasks yet</li>";

}

}
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

  

} else {

  

}



      console.log("Generated Tasks:", generatedTasks.length);
console.log("Roadmap Progress:", roadmapProgress);

     roadmapInfo.innerHTML = `
  <h3>Roadmap Progress</h3>;

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
const totalTasks =
  tasks.length;

const completedTasks =
  tasks.filter(
    task => task.completed
  ).length;

document.getElementById(
"overviewTasks"
).textContent = totalTasks;

document.getElementById(
"overviewCompleted"
).textContent = completedTasks;

document.getElementById(
"overviewStreak"
).textContent = streak;



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

  streakCountEl.textContent = streak;

  let achievements = 0;

if (completedGeneratedTasks >= 1)
  achievements++;

if (roadmapProgress >= 50)
  achievements++;

if (roadmapProgress === 100)
  achievements++;

achievementCountEl.textContent =
  achievements;

  progressFill.style.width =
  progressPercent + "%";

      filteredTasks.forEach((task) => {

        taskList.innerHTML += `
        
<li>

<div class="task-content">

    <div class="task-top">

      <span class="task-status">
        ${task.completed ? "✅ Completed" : "⏳ In Progress"}
      </span>

      <div class="task-title ${task.completed ? "completed" : ""}">
        ${task.title}
      </div>

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

loadGoals();
loadTasks();
loadRoadmaps();
loadProgressRoadmaps();

async function deleteTask(id) {

  await fetch(
  `http://localhost:5000/api/tasks/${id}`,
  {
    method: "DELETE"
  }
)
 loadTasks(roadmapSelect.value);
loadRoadmapCards();
loadProgressRoadmaps();
if (roadmapSelect.value) {
  showRoadmapTasks(roadmapSelect.value);
}
console.log("DELETE CLICKED");
console.log("Dropdown:", roadmapSelect.value);

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
      title: taskInput.value,
      goal: roadmapSelect.value || "General"
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
loadRoadmapCards();
loadProgressRoadmaps();

if (roadmapSelect.value) {
  showRoadmapTasks(roadmapSelect.value);
}
console.log("COMPLETE CLICKED");
console.log("Dropdown:", roadmapSelect.value);

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
loadingBox.style.display = "block";

 fetch("http://localhost:5000/api/tasks/study-plan", {
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
  loadingBox.style.display = "none";

  if (!data.success) {
  loadingBox.style.display = "none";

  alert(data.message);

  console.log("Backend Error:", data);

  return;
}
console.log("API Response:", data);
  studyInfo.style.display = "block";

studyInfo.innerHTML = `
<div class="ai-summary">

  <h2>🤖 AI Roadmap Ready</h2>

  <div class="summary-grid">

    <div class="summary-card">
      <h3>
${goal
  .split(" ")
  .map(
    word =>
      word.charAt(0).toUpperCase() +
      word.slice(1)
  )
  .join(" ")}
</h3>
      <p>🎯 Learning Goal</p>
    </div>

    <div class="summary-card">
      <h3>${days}</h3>
      <p>📅 Days Available</p>
    </div>

    <div class="summary-card">
      <h3>${data.plan.length}</h3>
     <p>📚 Topics Generated</p>
    </div>

  </div>

  <div class="ai-message">
    🚀 Your personalized roadmap has been generated successfully.
  </div>

</div>

`;
goalInput.value = "";

loadTasks();
loadGoals();
loadRoadmaps();
loadProgressRoadmaps();

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

function loadRoadmapCards() {

  fetch("http://localhost:5000/api/tasks/roadmaps")
    .then(response => response.json())
.then(data => {

  roadmapCards.innerHTML = "";

  if(data.data.length > 0){

const current = data.data[0];

document.getElementById(
"currentRoadmapName"
).textContent =
current.goal || "Roadmap";

document.getElementById(
"currentRoadmapPercent"
).textContent =
(current.progress || 0) + "%";

document.getElementById(
"currentRoadmapProgress"
).style.width =
(current.progress || 0) + "%";

}
else{

document.getElementById(
"currentRoadmapName"
).textContent =
"No roadmap generated";

}

  data.data.forEach(roadmap => {
    document.getElementById(
"overviewRoadmaps"
).textContent =
data.data.length;

    roadmapCards.innerHTML += `

    <div
      class="roadmap-card"
      onclick="
        roadmapSelect.value='${roadmap.goal}';
        loadTasks('${roadmap.goal}');
      "
    >

      <div class="roadmap-header">

        <span class="roadmap-icon">
  ${getRoadmapIcon(roadmap.goal)}
</span>

        <h3>
         ${
      roadmap.goal
        .split(" ")
        .map(
          word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ")
    }
        </h3>

      </div>

      <div class="roadmap-progress-bar">
        <div
          class="roadmap-progress-fill"
          style="width:${roadmap.progress}%"
        ></div>
      </div>

   <div class="roadmap-stats">

  <div>
    <strong>${roadmap.completedTasks}</strong>
    <span>Completed</span>
  </div>

  <div>
    <strong>
      ${roadmap.totalTasks - roadmap.completedTasks}
    </strong>
    <span>Remaining</span>
  </div>

</div>

<p class="
roadmap-percent
${roadmap.progress === 100 ? " roadmap-complete" : ""}
">
  ${roadmap.progress}% Complete
</p>
     

    </div>

    `;

  });

});

    }

    function getRoadmapIcon(goal) {

  const name = goal.toLowerCase();

  if (name.includes("ai")) return "🤖";
  if (name.includes("data")) return "📊";
  if (name.includes("frontend")) return "💻";
  if (name.includes("backend")) return "⚙️";
  if (name.includes("python")) return "🐍";
  if (name.includes("cyber")) return "🔒";
  if (name.includes("dsa")) return "🧠";

  return "🚀";
}
assistantBtn.addEventListener("click", () => {

  goalInput.value =
    assistantInput.value;

  daysInput.value =
    assistantDays.value;

  generateBtn.click();

});

document.querySelectorAll(".chip").forEach(chip => {

  chip.addEventListener("click", () => {

    assistantInput.value =
      chip.textContent.replace(/^[^\w]+/, "");

  });

});

const themeToggle =
  document.getElementById("themeToggle");

if (themeToggle) {

  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    const isDark =
      document.body.classList.contains("dark-mode");

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );

    themeToggle.textContent =
      isDark ? "☀️" : "🌙";

  });

}
const menuButtons =
document.querySelectorAll(".menu-btn");

const sections =
document.querySelectorAll(".page-section");

menuButtons.forEach(btn => {

btn.addEventListener("click", () => {

sections.forEach(section => {
section.classList.remove("active-section");
});

menuButtons.forEach(button => {
button.classList.remove("active");
});

document
.getElementById(btn.dataset.section)
.classList.add("active-section");

btn.classList.add("active");

});

});

function loadRoadmaps() {
  const roadmapCards =
document.getElementById("roadmapCards");


  fetch("http://localhost:5000/api/tasks/roadmaps")
    .then(response => response.json())
    .then(data => {
    
      console.log("Roadmaps API:", data);
console.log("Roadmaps Array:", data.data);

      roadmapCards.innerHTML = "";

      data.data.forEach(roadmap => {

        console.log("Roadmap Item:", roadmap);
        roadmapCards.innerHTML += `
        
          <div
            class="roadmap-card"
           onclick="
  roadmapSelect.value='${roadmap.goal}';
  showRoadmapTasks('${roadmap.goal}');
"
          >

            <h3>${roadmap.goal}</h3>

            

            <p>
              ${roadmap.completedTasks}
              /
              ${roadmap.totalTasks}
              Completed
            </p>

            <div class="roadmap-progress-bar">
              <div
                class="roadmap-progress-fill"
                style="width:${roadmap.progress}%"
              ></div>
            </div>
            <button
onclick="
event.stopPropagation();
deleteRoadmap('${roadmap.goal}');
"
>
🗑 Delete Roadmap
</button>

            <p>${roadmap.progress}%</p>

          </div>
          
        `;
      });

    });

}
function loadProgressRoadmaps() {

  fetch(
    "http://localhost:5000/api/tasks/roadmaps"
  )
  .then(response => response.json())
  .then(data => {

    roadmapProgressCards.innerHTML = "";

    data.data.forEach(roadmap => {

progressRoadmaps.innerHTML += `
<div class="progress-roadmap-card">

  <h3>
    🚀 ${
      roadmap.goal
        .charAt(0)
        .toUpperCase() +
      roadmap.goal.slice(1)
    }
  </h3>

  <div class="roadmap-progress-bar">
    <div
      class="roadmap-progress-fill"
      style="width:${roadmap.progress}%"
    ></div>
  </div>

  <div class="progress-roadmap-stats">

    <span>
      ✅ ${roadmap.completedTasks}
      Completed
    </span>

    <span>
      ⏳ ${
        roadmap.totalTasks -
        roadmap.completedTasks
      }
      Remaining
    </span>

  </div>

  <div class="progress-badge">
    ${roadmap.progress}% Complete
  </div>

</div>
`;

    });

  });

}
function showRoadmapTasks(goal) {
  console.log("REFRESHING:", goal);

  fetch(
    `http://localhost:5000/api/tasks?goal=${goal}`
  )
  .then(response => response.json())
  .then(data => {

    roadmapTasks.innerHTML = `
      <h2>${goal} Roadmap Tasks</h2>
    `;

    const generatedTasks =
      data.data.filter(
        task => task.isGenerated
      );

    generatedTasks.forEach(task => {

      roadmapTasks.innerHTML += `

<div class="
  roadmap-task-card
  ${task.completed ? "completed" : ""}
">

  <p>
    ${task.completed ? "✅" : "⏳"}
    ${task.title}
  </p>

  ${!task.completed ? `
<button onclick="completeTask('${task._id}')">
  Complete
</button>
` : ""}

<button onclick="deleteTask('${task._id}')">
  Delete
</button>

</div>
`;

    });

  });

}
async function deleteRoadmap(goal) {

  const confirmDelete =
    confirm(
      `Delete ${goal} roadmap?`
    );

  if (!confirmDelete) return;

  await fetch(
    `http://localhost:5000/api/tasks/roadmaps/${goal}`,
    {
      method: "DELETE"
    }
  );

  roadmapTasks.innerHTML = "";

  loadRoadmaps();
  loadGoals();
  loadTasks();

}