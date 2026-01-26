// app.js

// Data storage
let tasks = [];
let habits = [];
let goals = [];
let quickNote = "";
let activityLog = [];

// Theme storage
let themeSettings = {
    hue: 204,
    saturation: 70,
    brightness: 50
};

// Pomodoro state
let pomoTimer;
let pomoTimeLeft = 25 * 60; // default 25 minutes
let isPomoRunning = false;
let pomoMode = 'work'; // work, short, long

// Meditation state
let medTimer;
let medTimeLeft = 5 * 60; // 5 minutes default
let isMedRunning = false;

// Load data from localStorage
function loadData() {
    console.log('Function called: loadData - Loading data from LocalStorage');
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    habits = JSON.parse(localStorage.getItem('habits')) || [];
    goals = JSON.parse(localStorage.getItem('goals')) || [];
    themeSettings = JSON.parse(localStorage.getItem('themeSettings')) || themeSettings;
    quickNote = localStorage.getItem('quickNote') || "";
    activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
}

// Save data to localStorage
function saveData() {
    console.log('Function called: saveData - Saving state to LocalStorage');
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
    localStorage.setItem('quickNote', quickNote);
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

// Display current date
function displayDate() {
    console.log('Function called: displayDate - Updating header date');
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = date.toLocaleDateString('en-US', options);
}

// Theme functions
function applyTheme() {
    console.log('Function called: applyTheme - Applying CSS variables');
    document.documentElement.style.setProperty('--primary-hue', themeSettings.hue);
    document.documentElement.style.setProperty('--primary-saturation', themeSettings.saturation + '%');
    document.documentElement.style.setProperty('--primary-brightness', themeSettings.brightness + '%');

    const hueSlider = document.getElementById('hueSlider');
    const satSlider = document.getElementById('saturationSlider');
    const briSlider = document.getElementById('brightnessSlider');

    if (hueSlider) hueSlider.value = themeSettings.hue;
    if (satSlider) satSlider.value = themeSettings.saturation;
    if (briSlider) briSlider.value = themeSettings.brightness;

    const hueVal = document.getElementById('hueValue');
    const satVal = document.getElementById('saturationValue');
    const briVal = document.getElementById('brightnessValue');

    if (hueVal) hueVal.textContent = themeSettings.hue + '°';
    if (satVal) satVal.textContent = themeSettings.saturation + '%';
    if (briVal) briVal.textContent = themeSettings.brightness + '%';
}

function updateTheme(property, value) {
    console.log(`Function called: updateTheme - Updating ${property} to ${value}`);
    themeSettings[property] = parseInt(value);
    applyTheme();
    saveData();
}

function randomTheme() {
    console.log('Function called: randomTheme - Generating random colors');
    themeSettings.hue = Math.floor(Math.random() * 360);
    themeSettings.saturation = Math.floor(Math.random() * 50) + 50;
    themeSettings.brightness = Math.floor(Math.random() * 30) + 40;
    applyTheme();
    saveData();
}

function resetTheme() {
    console.log('Function called: resetTheme - Resetting to default');
    themeSettings = { hue: 204, saturation: 70, brightness: 50 };
    applyTheme();
    saveData();
}

// Task functions
function renderTasks() {
    console.log(`Function called: renderTasks - Rendering ${tasks.length} tasks`);
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');

    if (!taskList) return;

    taskCount.textContent = tasks.length;

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No tasks yet</li>';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <li class="list-item priority-${task.priority} ${task.completed ? 'completed' : ''}">
            <div class="item-content">
                <input type="checkbox" class="item-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})">
                <span class="item-text">${task.text}</span>
            </div>
            <div class="item-actions">
                <button class="btn-small btn-delete" onclick="deleteTask(${task.id})">DEL</button>
            </div>
        </li>
    `).join('');
}

function addTask(e) {
    console.log('Function called: addTask - Adding new task');
    e.preventDefault();
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('taskPriority');

    if (!input.value.trim()) return;

    const task = {
        id: Date.now(),
        text: input.value.trim(),
        priority: priority.value,
        completed: false
    };

    tasks.push(task);
    saveData();
    renderTasks();

    input.value = '';
    priority.value = 'medium';
}

function toggleTask(id) {
    console.log(`Function called: toggleTask - Toggling ID ${id}`);
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            logActivity('task', 1);
        }
        saveData();
        renderTasks();
    }
}

function deleteTask(id) {
    console.log(`Function called: deleteTask - Deleting ID ${id}`);
    tasks = tasks.filter(t => t.id !== id);
    saveData();
    renderTasks();
}

// Habit functions
function renderHabits() {
    console.log(`Function called: renderHabits - Rendering ${habits.length} habits`);
    const habitList = document.getElementById('habitList');
    const habitCount = document.getElementById('habitCount');

    if (!habitList) return;

    habitCount.textContent = habits.length;

    if (habits.length === 0) {
        habitList.innerHTML = '<li class="empty-message">No habits yet</li>';
        return;
    }

    habitList.innerHTML = habits.map(habit => {
        const today = new Date().toDateString();
        const completedToday = habit.completions && habit.completions.includes(today);

        return `
            <li class="list-item">
                <div class="item-content">
                    <span class="item-text">${habit.text}</span>
                    <span class="goal-stats" style="margin-left: auto; margin-right: 15px;">${habit.completions ? habit.completions.length : 0} days</span>
                </div>
                <div class="item-actions">
                    <button class="btn-small ${completedToday ? 'btn-secondary' : 'btn-action'}" 
                            onclick="toggleHabit(${habit.id})">
                        ${completedToday ? 'UNDO' : 'DONE'}
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteHabit(${habit.id})">DEL</button>
                </div>
            </li>
        `;
    }).join('');
}

function addHabit(e) {
    console.log('Function called: addHabit - Adding new habit');
    e.preventDefault();
    const input = document.getElementById('habitInput');

    if (!input.value.trim()) return;

    const habit = {
        id: Date.now(),
        text: input.value.trim(),
        completions: []
    };

    habits.push(habit);
    saveData();
    renderHabits();

    input.value = '';
}

function toggleHabit(id) {
    console.log(`Function called: toggleHabit - Toggling habit ID ${id}`);
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    if (!habit.completions) habit.completions = [];

    const today = new Date().toDateString();
    const index = habit.completions.indexOf(today);

    if (index > -1) {
        habit.completions.splice(index, 1);
    } else {
        habit.completions.push(today);
    }

    saveData();
    renderHabits();
}

function deleteHabit(id) {
    console.log(`Function called: deleteHabit - Deleting habit ID ${id}`);
    habits = habits.filter(h => h.id !== id);
    saveData();
    renderHabits();
}

// Goal functions
function renderGoals() {
    console.log(`Function called: renderGoals - Rendering ${goals.length} goals`);
    const goalList = document.getElementById('goalList');
    const goalCount = document.getElementById('goalCount');

    if (!goalList) return;

    goalCount.textContent = goals.length;

    if (goals.length === 0) {
        goalList.innerHTML = '<li class="empty-message">No goals yet</li>';
        return;
    }

    goalList.innerHTML = goals.map(goal => {
        const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));

        return `
            <li class="list-item">
                <div class="item-content">
                    <div class="goal-info">
                        <span class="item-text">${goal.text}</span>
                        <div style="display:flex; justify-content:space-between; margin-top:5px;">
                            <span class="goal-stats">${goal.current} / ${goal.target}</span>
                            <span class="goal-stats">${percentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
                <div class="item-actions" style="flex-direction: column; justify-content: center;">
                    <div style="display:flex; gap: 5px;">
                         <button class="btn-small btn-action" onclick="updateGoal(${goal.id}, 1)">+</button>
                         <button class="btn-small btn-secondary" onclick="updateGoal(${goal.id}, -1)">-</button>
                    </div>
                    <button class="btn-small btn-delete" onclick="deleteGoal(${goal.id})">DEL</button>
                </div>
            </li>
        `;
    }).join('');
}

function addGoal(e) {
    console.log('Function called: addGoal - Adding new goal');
    e.preventDefault();
    const input = document.getElementById('goalInput');
    const target = document.getElementById('goalTarget');

    if (!input.value.trim() || !target.value) return;

    const goal = {
        id: Date.now(),
        text: input.value.trim(),
        current: 0,
        target: parseInt(target.value)
    };

    goals.push(goal);
    saveData();
    renderGoals();

    input.value = '';
    target.value = '';
}

function updateGoal(id, change) {
    console.log(`Function called: updateGoal - Updating goal ID ${id} by ${change}`);
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    goal.current = Math.max(0, Math.min(goal.target, goal.current + change));
    saveData();
    renderGoals();
}

function deleteGoal(id) {
    console.log(`Function called: deleteGoal - Deleting goal ID ${id}`);
    goals = goals.filter(g => g.id !== id);
    saveData();
    renderGoals();
}

// Quick Notes Functions
function renderNote() {
    console.log('Function called: renderNote - Render saved note');
    const noteArea = document.getElementById('quickNote');
    if (noteArea) {
        noteArea.value = quickNote;
    }
}

function saveNote() {
    console.log('Function called: saveNote - Auto-saving note');
    const noteArea = document.getElementById('quickNote');
    if (noteArea) {
        quickNote = noteArea.value;
        saveData();
    }
}

// Pomodoro Functions
function updatePomoDisplay() {
    // console.log('Function called: updatePomoDisplay'); // Commented out to avoid spamming console every second
    const display = document.getElementById('pomoDisplay');
    if (!display) return;

    const minutes = Math.floor(pomoTimeLeft / 60);
    const seconds = pomoTimeLeft % 60;

    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startPomo() {
    console.log('Function called: startPomo - Timer started');
    if (isPomoRunning) return;

    isPomoRunning = true;
    pomoTimer = setInterval(() => {
        if (pomoTimeLeft > 0) {
            pomoTimeLeft--;
            updatePomoDisplay();
        } else {
            stopPomo();
            logActivity('pomo', pomoMode === 'work' ? 25 : (pomoMode === 'long' ? 15 : 5));
            alert("Timer Complete!");
        }
    }, 1000);
}

function stopPomo() {
    console.log('Function called: stopPomo - Timer stopped/paused');
    isPomoRunning = false;
    clearInterval(pomoTimer);
}

function resetPomo() {
    console.log('Function called: resetPomo - Timer reset');
    stopPomo();
    if (pomoMode === 'work') pomoTimeLeft = 25 * 60;
    else if (pomoMode === 'short') pomoTimeLeft = 5 * 60;
    else if (pomoMode === 'long') pomoTimeLeft = 15 * 60;
    updatePomoDisplay();
}

function setPomoMode(mode) {
    console.log(`Function called: setPomoMode - Switching to ${mode}`);
    pomoMode = mode;
    resetPomo();

    // Update active tab styling
    document.querySelectorAll('.pomo-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.mode === mode) {
            tab.classList.add('active');
        }
    });
}

function adjustPomoTime(minutes) {
    console.log(`Function called: adjustPomoTime - Adjusting by ${minutes} minutes`);
    const seconds = minutes * 60;

    // Check if new time would be negative
    if (pomoTimeLeft + seconds < 0) {
        return;
    }

    pomoTimeLeft += seconds;
    updatePomoDisplay();
}

// Meditation Functions
function updateMedDisplay() {
    // console.log('Function called: updateMedDisplay'); // Commented out to avoid spam
    const display = document.getElementById('meditationTimer');
    if (!display) return;

    const minutes = Math.floor(medTimeLeft / 60);
    const seconds = medTimeLeft % 60;

    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startMeditation() {
    console.log('Function called: startMeditation - Session started');
    if (isMedRunning) return;

    const audio = document.getElementById('meditationAudio');
    const circle = document.getElementById('breathCircle');

    if (audio) audio.play().catch(e => console.log("Audio play failed (maybe no user interaction yet or file missing)", e));
    if (circle) circle.classList.add('active');

    isMedRunning = true;
    medTimer = setInterval(() => {
        if (medTimeLeft > 0) {
            medTimeLeft--;
            updateMedDisplay();
        } else {
            stopMeditation();
        }
    }, 1000);
}

function stopMeditation() {
    console.log('Function called: stopMeditation - Session stopped');
    isMedRunning = false;
    clearInterval(medTimer);

    const audio = document.getElementById('meditationAudio');
    const circle = document.getElementById('breathCircle');

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    if (circle) circle.classList.remove('active');

    medTimeLeft = 5 * 60; // reset to 5 mins
    updateMedDisplay();
}

// Activity Logging
function logActivity(type, value) {
    console.log(`Function called: logActivity - Logged ${type}`);
    activityLog.push({
        type: type,
        value: value,
        date: new Date().toISOString()
    });
    saveData();
}

// Analytics Logic
function renderCharts() {
    console.log('Function called: renderCharts - Updating analytics views');
    const dailyCanvas = document.getElementById('dailyChart');
    const monthlyCanvas = document.getElementById('monthlyChart');
    const studyCanvas = document.getElementById('studyChart');

    if (!dailyCanvas || !monthlyCanvas) return;

    // Process Data
    const today = new Date();
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-US');
    }).reverse();

    const dailyData = {
        tasks: Array(7).fill(0),
        pomoMinutes: Array(7).fill(0)
    };

    activityLog.forEach(log => {
        const logDate = new Date(log.date).toLocaleDateString('en-US');
        const index = last7Days.indexOf(logDate);
        if (index > -1) {
            if (log.type === 'task' && log.value === 1) dailyData.tasks[index]++;
            if (log.type === 'pomo') dailyData.pomoMinutes[index] += log.value;
        }
    });

    // Chart Colors
    const primaryColor = `hsl(${themeSettings.hue}, ${themeSettings.saturation}%, ${themeSettings.brightness}%)`;
    const fontColor = '#000000';
    const gridColor = '#e0e0e0';

    // Helper to destroy old chart instance if exists
    // We attach chart instances to the canvas element to track them
    if (dailyCanvas.chartInstance) dailyCanvas.chartInstance.destroy();
    if (monthlyCanvas.chartInstance) monthlyCanvas.chartInstance.destroy();
    if (studyCanvas && studyCanvas.chartInstance) studyCanvas.chartInstance.destroy();

    // Daily Chart
    dailyCanvas.chartInstance = new Chart(dailyCanvas, {
        type: 'bar',
        data: {
            labels: last7Days.map(d => d.slice(0, -5)), // Remove year
            datasets: [{
                label: 'Tasks Completed',
                data: dailyData.tasks,
                backgroundColor: primaryColor,
                borderWidth: 2,
                borderColor: 'black'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: fontColor } },
                x: { grid: { display: false }, ticks: { color: fontColor } }
            },
            plugins: {
                legend: { labels: { color: fontColor, font: { family: 'Courier New', weight: 'bold' } } }
            }
        }
    });

    // Render Study Chart (Focus Hours)
    if (studyCanvas) {
        renderStudyChart(studyCanvas, primaryColor, fontColor, gridColor);
    }




    // Monthly Chart
    const monthlyCounts = { task: 0, pomo: 0, habit: 0 };
    activityLog.forEach(log => {
        if (monthlyCounts[log.type] !== undefined) monthlyCounts[log.type]++;
    });

    monthlyCanvas.chartInstance = new Chart(monthlyCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Tasks', 'Pomodoros', 'Habits'],
            datasets: [{
                data: [monthlyCounts.task, monthlyCounts.pomo, habits.reduce((acc, h) => acc + (h.completions?.length || 0), 0)],
                backgroundColor: [
                    primaryColor,
                    '#ff4d4d', // Red
                    '#ffa502'  // Orange
                ],
                borderColor: 'black',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: fontColor, font: { family: 'Courier New', weight: 'bold' } } }
            }
        }
    });
}

// Event listeners
const taskForm = document.getElementById('taskForm');
if (taskForm) taskForm.addEventListener('submit', addTask);

const habitForm = document.getElementById('habitForm');
if (habitForm) habitForm.addEventListener('submit', addHabit);

const goalForm = document.getElementById('goalForm');
if (goalForm) goalForm.addEventListener('submit', addGoal);

// Theme panel events
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) themeToggle.addEventListener('click', () => {
    console.log('Event: Theme Toggle Clicked');
    document.getElementById('themePanel').classList.add('active');
});

const closePanel = document.getElementById('closePanel');
if (closePanel) closePanel.addEventListener('click', () => {
    console.log('Event: Close Panel Clicked');
    document.getElementById('themePanel').classList.remove('active');
});

const hueSlider = document.getElementById('hueSlider');
if (hueSlider) hueSlider.addEventListener('input', (e) => {
    updateTheme('hue', e.target.value);
});

const satSlider = document.getElementById('saturationSlider');
if (satSlider) satSlider.addEventListener('input', (e) => {
    updateTheme('saturation', e.target.value);
});

const briSlider = document.getElementById('brightnessSlider');
if (briSlider) briSlider.addEventListener('input', (e) => {
    updateTheme('brightness', e.target.value);
});

const randomBtn = document.getElementById('randomBtn');
if (randomBtn) randomBtn.addEventListener('click', randomTheme);

const resetBtn = document.getElementById('resetBtn');
if (resetBtn) resetBtn.addEventListener('click', resetTheme);

// Note Events
const noteArea = document.getElementById('quickNote');
if (noteArea) noteArea.addEventListener('input', saveNote);

// Pomo Events
const startPomoBtn = document.getElementById('startPomo');
if (startPomoBtn) startPomoBtn.addEventListener('click', startPomo);

const pausePomoBtn = document.getElementById('pausePomo');
if (pausePomoBtn) pausePomoBtn.addEventListener('click', stopPomo); // Stop acts as pause here

const resetPomoBtn = document.getElementById('resetPomo');
if (resetPomoBtn) resetPomoBtn.addEventListener('click', resetPomo);

document.querySelectorAll('.pomo-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        setPomoMode(e.target.dataset.mode);
    });
});

const pomoPlusBtn = document.getElementById('pomoPlus');
if (pomoPlusBtn) pomoPlusBtn.addEventListener('click', () => adjustPomoTime(5));

const pomoMinusBtn = document.getElementById('pomoMinus');
if (pomoMinusBtn) pomoMinusBtn.addEventListener('click', () => adjustPomoTime(-5));

if (pomoMinusBtn) pomoMinusBtn.addEventListener('click', () => adjustPomoTime(-5));

// Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Add to clicked
        e.target.classList.add('active');
        // Re-render
        renderCharts();
    });
});

// Meditation Events
const startMedBtn = document.getElementById('startMeditation');
if (startMedBtn) startMedBtn.addEventListener('click', startMeditation);

const stopMedBtn = document.getElementById('stopMeditation');
if (stopMedBtn) stopMedBtn.addEventListener('click', stopMeditation);

// Initialize app
function init() {
    console.log('Function called: init - Application starting');
    loadData();
    applyTheme();
    displayDate();
    renderTasks();
    renderHabits();
    renderGoals();
    renderNote();
    updatePomoDisplay();
    updateMedDisplay();
    renderCharts();
}

window.addEventListener('DOMContentLoaded', init);
