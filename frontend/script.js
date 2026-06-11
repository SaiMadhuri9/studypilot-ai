console.log("StudyPilot Frontend Loaded");

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

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


async function deleteTask(id) {

  await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "DELETE"
  });

  location.reload();

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

  location.reload();
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

  location.reload();

}