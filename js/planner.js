document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'studentPlannerTasks';
  let currentFilter = 'all';
  let sortByDueDate = false;

  const form = document.getElementById('taskForm');
  const taskTableBody = document.getElementById('taskTableBody');
  const emptyState = document.getElementById('emptyState');
  const emptyStateMessage = document.getElementById('emptyStateMessage');
  const plannerFeedback = document.getElementById('plannerFeedback');
  const todayDate = document.getElementById('todayDate');

  const summaryEls = {
    total: document.getElementById('totalTasks'),
    completed: document.getElementById('completedTasks'),
    pending: document.getElementById('pendingTasks'),
    overdue: document.getElementById('overdueTasks')
  };

  const fieldNames = {
    taskTitle: document.getElementById('taskTitle'),
    courseName: document.getElementById('courseName'),
    taskCategory: document.getElementById('taskCategory'),
    taskDueDate: document.getElementById('taskDueDate'),
    taskPriority: document.getElementById('taskPriority')
  };

  const errorMap = {
    taskTitle: document.getElementById('taskTitleError'),
    courseName: document.getElementById('courseNameError'),
    taskCategory: document.getElementById('taskCategoryError'),
    taskDueDate: document.getElementById('taskDueDateError'),
    taskPriority: document.getElementById('taskPriorityError')
  };

  if (todayDate) {
    const currentDate = new Date();
    todayDate.textContent = currentDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function loadTasks() {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (!savedTasks) return [];

      const parsed = JSON.parse(savedTasks);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter((task) => {
        if (!task || typeof task !== 'object') return false;
        return typeof task.title === 'string' && typeof task.course === 'string'
          && typeof task.dueDate === 'string' && typeof task.completed === 'boolean';
      });
    } catch (error) {
      console.warn('Saved planner data could not be loaded:', error);
      return [];
    }
  }

  function saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      if (plannerFeedback) plannerFeedback.textContent = 'Changes saved in this browser.';
      return true;
    } catch (error) {
      console.error('Planner tasks could not be saved:', error);
      if (plannerFeedback) plannerFeedback.textContent = 'Could not save changes in this browser. Check available storage and try again.';
      return false;
    }
  }

  function getTodayDate() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  function isTaskOverdue(task) {
    if (task.completed || !task.dueDate) return false;
    const [year, month, day] = task.dueDate.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    return dueDate < getTodayDate();
  }

  function clearFieldErrors() {
    Object.keys(errorMap).forEach((key) => {
      if (errorMap[key]) {
        errorMap[key].textContent = '';
      }
    });
  }

  function validateTask(task) {
    clearFieldErrors();

    let isValid = true;

    if (!task.title || task.title.trim() === '') {
      errorMap.taskTitle.textContent = 'Task title is required.';
      isValid = false;
    }

    if (!task.course || task.course.trim() === '') {
      errorMap.courseName.textContent = 'Course is required.';
      isValid = false;
    }

    if (!task.category) {
      errorMap.taskCategory.textContent = 'Please choose a category.';
      isValid = false;
    }

    if (!task.dueDate) {
      errorMap.taskDueDate.textContent = 'Due date is required.';
      isValid = false;
    }

    if (!task.priority) {
      errorMap.taskPriority.textContent = 'Please choose a priority.';
      isValid = false;
    }

    return isValid;
  }

  function getTasks() {
    return loadTasks();
  }

  function updateTaskSummary() {
    const tasks = getTasks();
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(isTaskOverdue).length;

    if (summaryEls.total) summaryEls.total.textContent = total;
    if (summaryEls.completed) summaryEls.completed.textContent = completed;
    if (summaryEls.pending) summaryEls.pending.textContent = pending;
    if (summaryEls.overdue) summaryEls.overdue.textContent = overdue;
  }

  function renderTasks() {
    const tasks = getTasks();
    const filteredTasks = tasks.filter((task) => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      if (currentFilter === 'overdue') return isTaskOverdue(task);
      return true;
    });

    if (sortByDueDate) {
      filteredTasks.sort((a, b) => {
        const [aYear, aMonth, aDay] = a.dueDate.split('-').map(Number);
        const [bYear, bMonth, bDay] = b.dueDate.split('-').map(Number);
        return new Date(aYear, aMonth - 1, aDay) - new Date(bYear, bMonth - 1, bDay);
      });
    }

    updateTaskSummary();
    if (!taskTableBody) return;
    taskTableBody.innerHTML = '';

    if (filteredTasks.length === 0) {
      emptyState.hidden = false;
      if (emptyStateMessage) {
        emptyStateMessage.textContent = tasks.length === 0
          ? 'No tasks yet. Add your first academic task to get started.'
          : `No ${currentFilter === 'all' ? '' : `${currentFilter} `}tasks match this filter.`;
      }
      return;
    }

    emptyState.hidden = true;

    filteredTasks.forEach((task) => {
      const row = document.createElement('tr');

      const isOverdue = isTaskOverdue(task);
      row.classList.toggle('task-overdue', isOverdue);
      row.classList.toggle('task-high-priority', task.priority === 'High');

      const statusText = task.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending';

      const taskTitle = document.createElement('td');
      taskTitle.textContent = task.title;

      const course = document.createElement('td');
      course.textContent = task.course;

      const category = document.createElement('td');
      category.textContent = task.category;

      const dueDate = document.createElement('td');
      dueDate.textContent = task.dueDate;

      const priority = document.createElement('td');
      const priorityLabel = document.createElement('span');
      priorityLabel.className = `priority-label priority-${(task.priority || 'medium').toLowerCase()}`;
      priorityLabel.textContent = task.priority || 'Medium';
      priority.appendChild(priorityLabel);

      const status = document.createElement('td');
      status.textContent = statusText;
      status.className = `task-status task-status-${statusText.toLowerCase()}`;

      const actions = document.createElement('td');
      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'action-btn';
      toggleButton.textContent = task.completed ? 'Reopen' : 'Complete';
      toggleButton.addEventListener('click', () => toggleTaskStatus(task.id));

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'action-btn danger';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteTask(task.id));

      actions.appendChild(toggleButton);
      actions.appendChild(deleteButton);

      row.append(taskTitle, course, category, dueDate, priority, status, actions);
      taskTableBody.appendChild(row);
    });

  }

  function addTask(taskData) {
    const tasks = getTasks();
    const newTask = {
      id: Date.now(),
      title: taskData.title.trim(),
      course: taskData.course.trim(),
      category: taskData.category,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      completed: false
    };

    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
  }

  function toggleTaskStatus(taskId) {
    const tasks = getTasks();
    const task = tasks.find((item) => item.id === taskId);

    if (!task) return;

    task.completed = !task.completed;
    saveTasks(tasks);
    renderTasks();
    if (plannerFeedback) plannerFeedback.textContent = task.completed ? 'Task marked complete.' : 'Task reopened.';
  }

  function deleteTask(taskId) {
    const tasks = getTasks().filter((task) => task.id !== taskId);
    saveTasks(tasks);
    renderTasks();
    if (plannerFeedback) plannerFeedback.textContent = 'Task deleted.';
  }

  function filterTasks(filterValue) {
    currentFilter = filterValue;
    document.querySelectorAll('.task-filter').forEach((button) => {
      const isSelected = button.dataset.filter === filterValue;
      button.classList.toggle('active', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    renderTasks();
  }

  function handleTaskSubmit(event) {
    event.preventDefault();

    const task = {
      title: fieldNames.taskTitle.value,
      course: fieldNames.courseName.value,
      category: fieldNames.taskCategory.value,
      dueDate: fieldNames.taskDueDate.value,
      priority: fieldNames.taskPriority.value
    };

    if (!validateTask(task)) {
      return;
    }

    addTask(task);
    form.reset();
    clearFieldErrors();
    if (plannerFeedback) plannerFeedback.textContent = 'Task added and saved in this browser.';
  }

  if (form) {
    form.addEventListener('submit', handleTaskSubmit);
  }

  document.querySelectorAll('.task-filter').forEach((button) => {
    button.addEventListener('click', () => filterTasks(button.dataset.filter));
  });

  document.getElementById('sortByDate')?.addEventListener('click', () => {
    sortByDueDate = !sortByDueDate;
    document.getElementById('sortByDate').textContent = sortByDueDate ? 'Sort: newest due first' : 'Sort by Due Date';
    renderTasks();
  });

  const clearAllButton = document.getElementById('clearAllTasks');
  if (clearAllButton) {
    clearAllButton.addEventListener('click', () => {
      const confirmed = window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.');
      if (!confirmed) return;

      if (!saveTasks([])) return;
      renderTasks();
      if (plannerFeedback) plannerFeedback.textContent = 'All tasks cleared.';
    });
  }

  renderTasks();
});
