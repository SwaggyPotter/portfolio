let urgentCounter = 0;
let dateList = [];
let dayTime = getTimeOfDay()


/**
 * Get the username from the local storage
 * @returns - the user name 
 */
function getUsernameFromLocalStorage() {
    let username = localStorage.getItem('username');
    return username;
}


/**
 * the function give back the daytime
 * 
 * @returns return the time as word, evening, morning etc.
 */
function getTimeOfDay() {
    let currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 12) {
        return "Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Afternoon";
    } else {
        return "Evening";
    }
}


/**
 * Check the username in the url
 * @param {string} name 
 * @returns - name as a string
 */
function checkUsernameInUrl(name) {
    let urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('name');
    return username === name;
}


/**
 * username from local storage
 */
let username = getUsernameFromLocalStorage();
/**
 * Show the username for the greeting
 */
function loadUserNameForGreeting() {
    if (checkUsernameInUrl(username)) {
        if (username !== null) {
            document.getElementById('username-input').innerText = `Good ${dayTime}, ${username}`;
            document.getElementById('username-input-smartphone').innerText = `Good ${dayTime} ${username}`;
        }
    }
    else {
        document.getElementById('good-morging-smartphone').style.fontSize = '44px'
        document.getElementById('good-morging-smartphone').style.fontWeight = '700'
        document.getElementById('username-input').innerText = `Good ${dayTime}`;
        document.getElementById('username-input-smartphone').innerText = `Good ${dayTime}`
    }
}


/**
 * Get the current date
 * @param {*} x 
 * @returns - the Month name- day and year
 */
function getCurrentDate(x) {
    let today = new Date();
    let date = x.getDate();
    let month = x.getMonth() + 1;
    let year = x.getFullYear();

    return `${checkMonthName(month)} ${date}, ${year}`;
}


/**
 * Search based on the month number the matched month name
 * @param {string} dateString 
 * @returns - returns the month-name
 */
function formatDate(dateString) {
    if (dateString != undefined) {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let date = new Date(dateString);
        let monthIndex = date.getMonth();
        let monthName = months[monthIndex];
        let day = date.getDate();
        let year = date.getFullYear();
        let formattedDate = `${monthName} ${day}, ${year}`;
        return formattedDate;
    }
}


/**
 * Show the next deadline
 */
function setCurrentDay() {
    if (formatDate(nextClosestDate(today(), dateList)) == undefined) {
        document.getElementById('deadline-date').innerText = 'No'
    }
    else {
        document.getElementById('deadline-date').innerText = `${formatDate(nextClosestDate(today(), dateList))}`;
    }
}


/**
 * Check for the closest deadline date
 * @param {number} date 
 * @param {Array} dateList 
 * @returns 
 */
function nextClosestDate(date, dateList) {
    let closest = dateList[0];
    let diff = Math.abs(date - closest);
    for (let i = 1; i < dateList.length; i++) {
        let newDiff = Math.abs(date - dateList[i]);
        if (newDiff < diff) {
            diff = newDiff;
            closest = dateList[i];
        }
    }
    return closest;
}


/**
 * Load the tasks
 */
function loadTasksDates() {
    for (i = 0; i < tasksToDo.length; i++) {
        dateList.push(tasksToDo[i]['dueDate'])
    }
    for (i = 0; i < tasksInProgress.length; i++) {
        dateList.push(tasksInProgress[i]['dueDate'])
    }
    for (i = 0; i < tasksAwaitFeedback.length; i++) {
        dateList.push(tasksAwaitFeedback[i]['dueDate'])
    }
    for (i = 0; i < tasksDone.length; i++) {
        dateList.push(tasksDone[i]['dueDate'])
    }
}


/**
 * 
 * @returns - Returns the current day
 */
function today() {
    let today = new Date();
    let date = today.getDate();
    let month = today.getMonth() + 8;
    let year = today.getFullYear();
    return `${today.getFullYear()}-${checkForZero()}${(today.getMonth() + 1)}-${today.getDate()}`
}


/**
 * 
 * @returns - return a 0 if a number is under 10
 */
function checkForZero() {
    let today = new Date();
    let month = today.getMonth() + 1;
    if ((today.getMonth() + 1) < 10) {
        return `0`
    }
}


/**
 * load the tasks and push it into the array for the summary screen
 */
async function loadTasksFromForSummary() {
    await downloadFromServer();
    loadTasksFromBackend();
    let taskstringToDo = backend.getItem('tasksToDo');
    let taskstringInProgress = backend.getItem('tasksInProgress');
    let taskstringAwaitFeedback = backend.getItem('tasksAwaitFeedback');
    let taskstringDone = backend.getItem('tasksDone');
    tasksToDo = JSON.parse(taskstringToDo) || [];
    tasksInProgress = JSON.parse(taskstringInProgress) || [];
    tasksAwaitFeedback = JSON.parse(taskstringAwaitFeedback) || [];
    tasksDone = JSON.parse(taskstringDone) || [];
    setTheNumbersInHtml()
    checkForUrgentTasks()
    loadTasksDates()
    setCurrentDay()
}


/**
 * Update the summary screen with the amount of task-, todo, inBoard etc.
 */
function setTheNumbersInHtml() {
    document.getElementById('tasks-to-do-counter').innerText = tasksToDo.length;
    document.getElementById('task-in-board-counter').innerText = (tasksToDo.length + tasksInProgress.length + tasksAwaitFeedback.length + tasksDone.length)
    document.getElementById('task-in-progress').innerText = tasksInProgress.length;
    document.getElementById('task-awaiting-feedback').innerText = tasksAwaitFeedback.length;
    document.getElementById('task-done-counter').innerText = tasksDone.length;
}


/**
 * loop over all the tasks and search for a taks with priority urgent
 */
function checkForUrgentTasks() {
    for (i = 0; i < tasksToDo.length; i++) {
        checkForUrgentTasksExtension(tasksToDo)
    }
    for (i = 0; i < tasksInProgress.length; i++) {
        checkForUrgentTasksExtension(tasksInProgress)
    }
    for (i = 0; i < tasksAwaitFeedback.length; i++) {
        checkForUrgentTasksExtension(tasksAwaitFeedback)
    }
    for (i = 0; i < tasksDone.length; i++) {
        checkForUrgentTasksExtension(tasksDone)
    }
}


/**
 * check if a task is urgent
 * 
 * @param {array} taksType 
 */
function checkForUrgentTasksExtension(taksType) {
    if (taksType[i]['priorityByName'] === 'urgent') {
        urgentCounter++
        document.getElementById('tasks-urgent-counter').innerText = urgentCounter;
    }
}


/**
 * Greet the person on devices under 1140px in a full screen 
 */
function greetingOnSmartDevice() {
    if (window.innerWidth < 1140) {
        document.getElementById('full-screen-greeting').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('full-screen-greeting').style.display = 'none';
        }, 3000);
    }
}


/**
 * Check based on the month number for the month name
 * @param {number} M - the number of the month
 * @returns - the month name
 */
function checkMonthName(M) {
    if (M == 1) {
        return 'January';
    }
    if (M == 2) {
        return 'February';
    }
    if (M == 3) {
        return 'March';
    }
    if (M == 4) {
        return 'April';
    }
    if (M == 5) {
        return 'May';
    }
    if (M == 6) {
        return 'June';
    }
    if (M == 7) {
        return 'July';
    }
    if (M == 8) {
        return 'August';
    }
    if (M == 9) {
        return 'September';
    }
    if (M == 10) {
        return 'October';
    }
    if (M == 11) {
        return 'November';
    }
    if (M == 12) {
        return 'December';
    }
}


loadTasksFromForSummary()
getUsernameFromLocalStorage()
loadUserNameForGreeting()
greetingOnSmartDevice()