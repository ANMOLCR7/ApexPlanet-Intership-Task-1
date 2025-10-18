document.addEventListener("DOMContentLoaded", function () {
  // Contact Form Validation
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formMessage = document.getElementById("formMessage");
  const submitBtn = document.getElementById("submitBtn");

  // Error elements
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  // Real-time validation
  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", validateEmail);
  messageInput.addEventListener("input", validateMessage);

  function validateName() {
    const name = nameInput.value.trim();
    if (name === "") {
      showError(nameInput, nameError, "Name is required");
      return false;
    } else if (name.length < 3) {
      showError(nameInput, nameError, "Name must be at least 3 characters");
      return false;
    } else {
      clearError(nameInput, nameError);
      return true;
    }
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      showError(emailInput, emailError, "Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      showError(emailInput, emailError, "Please enter a valid email address");
      return false;
    } else {
      clearError(emailInput, emailError);
      return true;
    }
  }

  function validateMessage() {
    const message = messageInput.value.trim();
    if (message === "") {
      showError(messageInput, messageError, "Message is required");
      return false;
    } else if (message.length < 10) {
      showError(
        messageInput,
        messageError,
        "Message must be at least 10 characters"
      );
      return false;
    } else {
      clearError(messageInput, messageError);
      return true;
    }
  }

  function showError(input, errorElement, message) {
    input.style.borderColor = "#dc2626";
    errorElement.textContent = message;
  }

  function clearError(input, errorElement) {
    input.style.borderColor = "#ccc";
    errorElement.textContent = "";
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
      // Simulate form submission
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      // In a real application, you would send the data to a server here
      setTimeout(() => {
        formMessage.textContent = "Form submitted successfully!";
        formMessage.className = "success";
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";

        // Clear message after 5 seconds
        setTimeout(() => {
          formMessage.textContent = "";
          formMessage.className = "";
        }, 5000);
      }, 1500);
    } else {
      formMessage.textContent = "Please fix the errors above.";
      formMessage.className = "error";
    }
  });

  // Enhanced To-Do List
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  const clearCompletedBtn = document.getElementById("clearCompletedBtn");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  // Load tasks from localStorage
  loadTasks();
  updateTaskCount();

  // Add task functionality
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    updateTaskCount();
  }

  function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter((task) => {
      if (currentFilter === "all") return true;
      if (currentFilter === "pending") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    });

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      if (task.completed) {
        li.classList.add("completed");
      }

      li.innerHTML = `
                <span class="task-content">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="remove-btn">Remove</button>
                    <button class="toggle-btn">${
                      task.completed ? "Mark as Pending" : "Mark as Completed"
                    }</button>
                </div>
            `;

      // Toggle completion button
      li.querySelector(".toggle-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleTaskCompletion(task.id);
      });

      // Edit task
      li.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        editTask(task.id);
      });

      // Remove task
      li.querySelector(".remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        removeTask(task.id);
      });

      taskList.appendChild(li);
    });
  }

  function toggleTaskCompletion(id) {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    saveTasks();
    renderTasks();
    updateTaskCount();
  }

  function editTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const newText = prompt("Edit task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }

  function removeTask(id) {
    if (confirm("Are you sure you want to remove this task?")) {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
      updateTaskCount();
    }
  }

  function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    taskCount.textContent = `${pendingTasks} pending, ${completedTasks} completed, ${totalTasks} total`;
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    renderTasks();
  }

  // Filter tasks
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Clear completed tasks
  clearCompletedBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all completed tasks?")) {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
      updateTaskCount();
    }
  });
});
