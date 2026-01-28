# Productivity Booster 🚀

## Project Title & Description
**Productivity Booster** is a comprehensive, all-in-one personal dashboard designed to help users manage their time, tasks, and well-being effectively. It combines a To-Do list, Habit Tracker, Goal visualizer, Pomodoro timer, and Meditation aid into a single, aesthetically pleasing interface with a fully customizable "Neo-Brutalism" design theme.

## Problem Statement
In today's fast-paced digital environment, users often find themselves juggling multiple apps for specific needs—one for tasks, another for focus timers, and yet another for habits. This context implementation fragmentation leads to "app fatigue" and decreased efficiency. Productivity Booster solves this by centralizing these core productivity tools into one lightweight, browser-based application that stores data locally, ensuring privacy and speed without the need for logins or internet connectivity.

## Features Implemented
### 1. 🎨 Theme Customizer (Color Boost)
- **Dynamic Theming**: Users can adjust **Hue**, **Saturation**, and **Brightness** in real-time.
- **Persistence**: Theme settings are saved automatically.
- **Randomizer**: "I'm feeling lucky" button for generating random color palettes.

### 2. ⏱️ Focus Timer (Pomodoro)
- **Three Modes**: Standard Work (25m), Short Break (5m), and Long Break (15m).
- **Customizable**: Adjust time in 5-minute increments.
- **Audio Alerts**: Notifies when the timer completes.

### 3. 🧘 Meditation Zone
- **Visual Breathing Aid**: A pulsing circle guide for breathing exercises.
- **Audio Integration**: Soothing background audio support.
- **Timer**: 5-minute default session timer.

### 4. ✅ Task Management
- **Prioritization**: Categorize tasks as Low, Medium, or High priority.
- **Management**: Add, delete, and toggle completion status.

### 5. 📅 Habit Tracker
- **Streak Tracking**: Logs daily completions.
- **Smart Toggle**: Allows marking habits as "Done" for the day or undoing actions.

### 6. 🎯 Goal Visualizer
- **Progress Bars**: Visual representation of goal progress (e.g., "Read 10 Books").
- **Incremental Control**: Easy +/- buttons to update progress.

### 7. 📝 Quick Notes
- **Auto-Save**: A persistent notepad that saves content as you type.

### 8. 📊 Analytics Dashboard
- **Visual Charts**: Powered by Chart.js.
- **Study Hours**: Track focus time by Day or Week.
- **Daily Activity**: Comparison of completed tasks vs. focus sessions.
- **Monthly Focus**: Overview of task, habit, and pomodoro distribution.

## DOM Concepts Used
This project creates a dynamic and interactive user experience using vanilla JavaScript and the Document Object Model (DOM). Key concepts include:

- **DOM Selection & Manipulation**: Using `getElementById`, `querySelector`, and `innerHTML` to dynamically render lists (Tasks, Habits, Goals) and update UI elements.
- **Event Handling**: Extensive use of `addEventListener` for handling clicks, form submissions, and input changes (e.g., updating theme sliders real-time).
- **Browser Storage API**: Using `localStorage` and `JSON.parse`/`JSON.stringify` to persist all user data (Tasks, Theme, Logs) across sessions.
- **CSS Variables & DOM**: JavaScript modifies CSS Custom Properties (`--primary-hue`, etc.) to instantly reflect theme changes across the entire application.
- **Canvas API**: Integration with Chart.js to render data visualizations in the Analytics section.
- **Audio API**: Controlling `HTMLAudioElement` for meditation sounds and timer alerts.
- **Timing Events**: Utilizing `setInterval` and `clearInterval` for the countdown logic in Pomodoro and Meditation features.

## Steps to Run the Project
1. **Download**: Clone or download the project folder to your local machine.
2. **Audio Setup**: Ensure a file named `meditation.mp3` is present in the root directory for the meditation audio to work.
3. **Launch**: Simply open the `index.html` file in any modern web browser (Chrome, Firefox, Safari, Edge).
4. **Enjoy**: No server or installation is required!

## Known Limitations
- **Local Storage**: All data is stored in the browser's LocalStorage. Clearing browser cache or using "Incognito" mode will erase/hide your data. Data does not sync between different devices or browsers.
- **Audio File**: The meditation feature relies on a local file `meditation.mp3`. If this file is missing, the audio portion of the feature will not play (though the visual timer will still function).
