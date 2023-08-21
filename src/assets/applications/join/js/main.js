setURL('https://tim-mellentin.developerakademie.net/Join/backend');
let users = [];
let allContacts = [];
let tasksToDo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];
let assignedTo = [];
let initials = [];
let subtasks = [];
let categoriesBackground = [];
let categoryColors = [];
let categories = [];


/**
 * this function loads the tasks from backend
 * 
 */
function loadTasksFromBackend() {
    let taskstringToDo = backend.getItem('tasksToDo');
    let taskstringInProgress = backend.getItem('tasksInProgress');
    let taskstringAwaitFeedback = backend.getItem('tasksAwaitFeedback');
    let taskstringDone = backend.getItem('tasksDone');
    tasksToDo = JSON.parse(taskstringToDo) || [];
    tasksInProgress = JSON.parse(taskstringInProgress) || [];
    tasksAwaitFeedback = JSON.parse(taskstringAwaitFeedback) || [];
    tasksDone = JSON.parse(taskstringDone) || [];    
}


/**
 * this function loads the contacts from backend
 * 
 */
function loadContactsFromBackend() {
    contacts = JSON.parse(backend.getItem('contacts'));
}


/**
 * this function loads the categories from the backend
 * 
 */
function loadCategoriesFromBackend() {
    categoriesBackground = JSON.parse(backend.getItem('categoriesBackground')) || [];
    categoryColors = JSON.parse(backend.getItem('categoryColors')) || [];
    categories = JSON.parse(backend.getItem('categories')) || [];
}


/**
 * This function is used to INIT the backend.
 *
 * @returns {JSON} - Will return a JSON of all saved elements
 */

async function initBackend() {
    await downloadFromServer();
}


/**
 * this function inits the board.html
 * 
 */
async function initBoard() {
    await downloadFromServer();
    loadTasksFromBackend();
    loadContactsFromBackend();
    loadCategoriesFromBackend();
    renderBoard();
}


/**
 * this function inits the add_task.html
 * 
 */
async function initAddTask() {
    await downloadFromServer();
    loadTasksFromBackend();
    loadContactsFromBackend();
    loadCategoriesFromBackend();
    renderDueDate();
    containerToAdd = 'toDo';
}


/**
 * This function is used to GET all the users from the backend
 * @returns {Promise<void>}
 */

function getSavedUsersFromBackend() {
    users = JSON.parse(backend.getItem('registeredUsers')) || [];
}


/**
 * This function is used to SAVE the users into the backend
 * @returns {Promise<void>}
 */

async function saveUsersToBackend() {
    let allUsersAsString = JSON.stringify(users);
    await backend.setItem("registeredUsers", allUsersAsString);
}


/**
 * This function is used to include HTML files from other folders
 * @returns {Promise<void>}
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 *  This function RETURNS all registered users as an ARRAY
 * @returns {array} - All registred users
 */

function getUsersAsArray() {
    return JSON.parse(backend.getItem("registeredUsers"));
}


/**
 * This function is used to reset the values of the passed input fields
 * @param element01 - field 01
 * @param element02 - field 01
 */

function emptyValues(element01, element02) {
    element01.value = "";
    element02.value = "";
}


/**
 * This function is used to get the parameter of the URL
 * @param param - "email" or "success" parameters
 * @returns {string} - returns the value of the URL
 */
function getUrlParameters(param) {
    let urlParams = new URLSearchParams(window.location.search);
    let success = urlParams.get(param);
    return success;
}


/**
 * This function is used to show/hide the log off menu (toggle class)
 */
function showLogOffBox() {
    let logOffBox = document.getElementById("more-details");
    logOffBox.classList.toggle("showit");
}


/**
 * this function is used to include the add_task_template.html
 * 
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function setFullscreen(x){
    if(x == 1){
        document.getElementById('img1').style.display = 'flex'
    }
    if(x == 2){
        document.getElementById('img2').style.display = 'flex'
    }
    if(x == 3){
        document.getElementById('img3').style.display = 'flex'
    }
}

function finish(){
    document.getElementById('overlayContainer').style.display = 'none';
}