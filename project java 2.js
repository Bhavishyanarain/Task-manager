
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function addTask() {
    let taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    let task = {
        id: Date.now(),
        name: taskName,
        completed: false
    };

    tasks.push(task);
    taskInput.value = "";

    saveTasks();
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<li class="empty-message">No tasks to display!</li>';
    }

    filteredTasks.forEach(function(task) {
        let li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        let left = document.createElement("div");
        left.className = "task-left";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        let span = document.createElement("span");
        span.textContent = task.name;

        left.appendChild(checkbox);
        left.appendChild(span);

        let actions = document.createElement("div");
        actions.className = "task-actions";

        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function() {
            let newName = prompt("Edit your task:", task.name);

            if (newName !== null && newName.trim() !== "") {
                task.name = newName.trim();
                saveTasks();
                displayTasks();
            }
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {
            if (confirm("Are you sure you want to delete this task?")) {
                tasks = tasks.filter(function(t) {
                    return t.id !== task.id;
                });

                saveTasks();
                displayTasks();
            }
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(left);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    let total = tasks.length;

    let completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

document.querySelectorAll(".filter").forEach(function(button) {
    button.addEventListener("click", function() {
        document.querySelector(".filter.active").classList.remove("active");

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        displayTasks();
    });
});

document.getElementById("clearCompleted").addEventListener("click", function() {
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    displayTasks();
});

displayTasks();
