let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

function addTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const taskDate = document.getElementById("taskDate").value;
    const taskPriority = document.getElementById("taskPriority").value;

    if (!taskName || !taskDate) {
        alert("Lengkapi data tugas!");
        return;
    }

    tasks.push({
        id: Date.now(),
        name: taskName,
        date: taskDate,
        priority: taskPriority,
        completed: false
    });

    saveTasks();

    document.getElementById("taskName").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskPriority").value = "Sedang";

    renderTasks();
}

function getDeadlineStatus(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(date);

    const diff = Math.ceil(
        (deadline - today) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return "🔴 Terlambat";
    if (diff === 0) return "🟠 Hari Ini";
    if (diff === 1) return "🟡 Besok";

    return `🟢 ${diff} Hari Lagi`;
}

function getPriorityClass(priority) {
    switch (priority) {
        case "Tinggi":
            return "priority-high";

        case "Sedang":
            return "priority-medium";

        default:
            return "priority-low";
    }
}

function renderTasks() {
    const list = document.getElementById("taskList");
    if (!list) return;

    const keyword =
        document.getElementById("searchTask")?.value.toLowerCase() || "";

    list.innerHTML = "";

    let completed = 0;

    tasks.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );

    tasks
        .filter(task =>
            task.name
                .toLowerCase()
                .includes(keyword)
        )
        .forEach(task => {

            if (task.completed) completed++;

            const li = document.createElement("li");

            li.className = task.completed
                ? "task-completed"
                : "";

            li.innerHTML = `
                <div class="task-header">
                    <strong>${task.name}</strong>
                </div>

                <div>
                    📅 ${task.date}
                </div>

                <div>
                    ${getDeadlineStatus(task.date)}
                </div>

                <div>
                    <span class="${getPriorityClass(task.priority)}">
                        ⭐ ${task.priority}
                    </span>
                </div>

                <div class="task-buttons">

                    <button onclick="toggleTask(${task.id})">
                        ${
                            task.completed
                                ? "↩️ Batal"
                                : "✅ Selesai"
                        }
                    </button>

                    <button onclick="deleteTask(${task.id})">
                        🗑️ Hapus
                    </button>

                </div>
            `;

            list.appendChild(li);
        });

    document.getElementById("totalTask").innerText =
        tasks.length;

    document.getElementById("completedTask").innerText =
        completed;

    document.getElementById("pendingTask").innerText =
        tasks.length - completed;

    const percent =
        tasks.length === 0
            ? 0
            : Math.round(
                (completed / tasks.length) * 100
            );

    document.getElementById("progressText").innerText =
        percent + "%";

    document.getElementById("progressBar").style.width =
        percent + "%";
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    if (!confirm("Hapus tugas ini?")) return;

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}