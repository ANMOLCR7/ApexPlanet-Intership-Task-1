const taskInput = document.getElementById('task-input');
const categorySelect = document.getElementById('category-select');
const dueDateInput = document.getElementById('due-date');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const progressFill = document.getElementById('progress-fill');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingIndex = -1;

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const updateProgress = () => {
  const completed = tasks.filter(task => task.completed).length;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  progressFill.style.width = `${progress}%`;
};

const renderTasks = (filteredTasks = tasks) => {
  taskList.innerHTML = '';
  filteredTasks.forEach((task, i) => {
    const li = document.createElement('li');
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    li.className = `${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;

    li.innerHTML = `
      <div class="task-info">
        <span>${task.text}</span>
        <div class="task-category">${task.category}</div>
        ${task.dueDate ? `<div class="task-due">Due: ${new Date(task.dueDate).toLocaleDateString()}</div>` : ''}
      </div>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${i})">✏️</button>
        <button class="complete-btn" onclick="toggleComplete(${i})">${task.completed ? '↩️' : '✅'}</button>
        <button class="delete-btn" onclick="deleteTask(${i})">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  updateProgress();
};

const addTask = () => {
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  const dueDate = dueDateInput.value;

  if (!text) return;

  if (editingIndex >= 0) {
    tasks[editingIndex] = { ...tasks[editingIndex], text, category, dueDate };
    editingIndex = -1;
    addBtn.textContent = 'Add';
  } else {
    tasks.push({ text, category, dueDate, completed: false });
  }

  saveTasks();
  taskInput.value = '';
  dueDateInput.value = '';
  renderTasks();
};

const editTask = (index) => {
  const task = tasks[index];
  taskInput.value = task.text;
  categorySelect.value = task.category;
  dueDateInput.value = task.dueDate || '';
  editingIndex = index;
  addBtn.textContent = 'Update';
  taskInput.focus();
};

const toggleComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
};

const filterTasks = () => {
  const searchTerm = searchInput.value.toLowerCase();
  const categoryFilter = filterCategory.value;

  let filtered = tasks.filter(task =>
    task.text.toLowerCase().includes(searchTerm) &&
    (categoryFilter === 'all' || task.category === categoryFilter)
  );

  renderTasks(filtered);
};

const exportTasks = () => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = 'tasks.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

const importTasks = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedTasks = JSON.parse(e.target.result);
      tasks = [...tasks, ...importedTasks];
      saveTasks();
      renderTasks();
      alert('Tasks imported successfully!');
    } catch (error) {
      alert('Invalid file format.');
    }
  };
  reader.readAsText(file);
};

addBtn.addEventListener('click', addTask);
searchInput.addEventListener('input', filterTasks);
filterCategory.addEventListener('change', filterTasks);
exportBtn.addEventListener('click', exportTasks);
importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', importTasks);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

window.onload = () => renderTasks();
