let nbDone;
let checkboxChecked;
let containerToAdd;
let bgColor;

/**
 * this function renders the board
 * 
 */
function renderBoard() {
    renderAllTasks(tasksToDo);
    renderAllTasks(tasksInProgress);
    renderAllTasks(tasksAwaitFeedback);
    renderAllTasks(tasksDone);
    resetDummyPosition();
}


/**
 * Reset the dummy and hide it after placing an task
 */
function resetDummyPosition() {
    document.getElementById('done-container').style.marginTop = '0px'
    document.getElementById('await-feedback-container').style.marginTop = '0px'
    document.getElementById('in-progress-container').style.marginTop = '0px'
    document.getElementById('to-do-container').style.marginTop = '0px'
    document.getElementById('doneContainer').style.display = 'none'
    document.getElementById('inProgressContainer').style.display = 'none'
    document.getElementById('awaitContainer').style.display = 'none'
    document.getElementById('todoContainer').style.display = 'none'
}


/**
 * 
 * @param {array} tasktype 
 * @returns the container of the tasktype
 */
function giveBackTheTaskTheme(tasktype) {
    if (tasktype == tasksToDo) {
        return `to-do-container`
    }
    if (tasktype == tasksInProgress) {
        return `in-progress-container`
    }
    if (tasktype == tasksAwaitFeedback) {
        return `await-feedback-container`
    }
    if (tasktype == tasksDone) {
        return `done-container`
    }
}


/**
 * 
 * @param {array} tasktype 
 * @returns the id
 */
function giveBackTheId(tasktype) {
    if (tasktype == tasksToDo) {
        return `selected-person-to-do`
    }
    if (tasktype == tasksInProgress) {
        return `selected-person-in-progress`
    }
    if (tasktype == tasksAwaitFeedback) {
        return `selected-person-await-feedback`
    }
    if (tasktype == tasksDone) {
        return `selected-person-done`
    }
}


/**
 * this function sets the background color for the category
 * 
 * @param {string} category 
 */
function getCategoryColor(category) {
    for (let i = 0; i < categoriesBackground.length; i++) {
        if (category == categories[i]) {
            bgColor = categoriesBackground[i];
        }
    }
}


/**
 * render the tasks
 * 
 * @param {array} tasktype 
 */
function renderAllTasks(tasktype) {
    let taskContainer = document.getElementById(`${giveBackTheTaskTheme(tasktype)}`);
    taskContainer.innerHTML = '';
    setAllDummys(taskContainer, tasktype);
    for (let i = 0; i < tasktype.length; i++) {
        let category = tasktype[i]['category'];
        getCategoryColor(`${category}`);
        checkDoneTasks(i, `${startDragNameFinder(tasktype)}`);
        const widthProgressBar = nbDone / tasktype[i]['subtasks'].length * 100;
        taskContainer.innerHTML +=
            htmlTemplateTasks(i, widthProgressBar, nbDone, tasktype);
        renderSelectedPerson(i, tasktype);
    }
}

/**
 * Set the dummys after redering the board wirth the task
 * @param {*} taskContainer 
 * @param {*} tasktype 
 */
function setAllDummys(taskContainer, tasktype) {
    if (giveBackTheTaskTheme(tasktype) == 'to-do-container') {
        taskContainer.innerHTML += `<div class="dummy" id="todoContainer"></div>`
    }
    if (giveBackTheTaskTheme(tasktype) == 'in-progress-container') {
        taskContainer.innerHTML += `<div class="dummy" id="inProgressContainer"></div>`
    }
    if (giveBackTheTaskTheme(tasktype) == 'await-feedback-container') {
        taskContainer.innerHTML += `<div class="dummy" id="awaitContainer"></div>`
    }
    if (giveBackTheTaskTheme(tasktype) == 'done-container') {
        taskContainer.innerHTML += `<div class="dummy" id="doneContainer"></div>`
    }
}


/**
 * render the persons on the task
 * 
 * @param {number} i 
 * @param {array} tasktype 
 */
function renderSelectedPerson(i, tasktype) {
    let selectedPerson = document.getElementById(`${giveBackTheId(tasktype)}${i}`);
    let nbOfInCharge = tasktype[i]['inCharge'].length;
    if (nbOfInCharge > 2) {
        countTo = 3;
    } else {
        countTo = nbOfInCharge
    }
    selectedPerson.innerHTML = '';
    for (let j = 0; j < countTo; j++) {
        selectedPerson.innerHTML +=
            htmlTemplateSelectedPerson(i, j, tasktype)
    }
    fxNbOfInCharge(nbOfInCharge, selectedPerson);
}


/**
 * this function checks which subtaskss are already done
 * 
 * @param {number} i 
 * @param {string} taskStatus 
 */
function checkDoneTasks(i, taskStatus) {
    nbDone = 0;
    switch (taskStatus) {
        case 'tasksToDo':
            for (let j = 0; j < tasksToDo[i]['alreadyDone'].length; j++) {
                done = tasksToDo[i]['alreadyDone'][j];
                nbDone = nbDone + done;
            };
            break;
        case 'tasksInProgress':
            for (let j = 0; j < tasksInProgress[i]['alreadyDone'].length; j++) {
                done = tasksInProgress[i]['alreadyDone'][j];
                nbDone = nbDone + done;
            };
            break;
        case 'tasksAwaitFeedback':
            for (let j = 0; j < tasksAwaitFeedback[i]['alreadyDone'].length; j++) {
                done = tasksAwaitFeedback[i]['alreadyDone'][j];
                nbDone = nbDone + done;
            };
            break;
        case 'tasksDone':
            for (let j = 0; j < tasksDone[i]['alreadyDone'].length; j++) {
                done = tasksDone[i]['alreadyDone'][j];
                nbDone = nbDone + done;
            };
            break;
    }
}


/**
 * this function checks if there are more than 3 persons assigned to the task and renders a circle with that number inside
 * 
 * @param {number} nbOfInCharge 
 * @param {string} selectedPerson 
 */
function fxNbOfInCharge(nbOfInCharge, selectedPerson) {
    if (nbOfInCharge > 3) {
        nbMore = nbOfInCharge - 3;
        selectedPerson.innerHTML += `
        <div class="initials-icon bg3">+${nbMore}</div>`;
    }
}


/**
 * this function calls the filter function with the value of the search field
 * 
 */
function filter() {
    let search = document.getElementById('search').value; /*nimmtText aus Input Feld*/
    search = search.toLowerCase();
    filterToDo(search);
    filterInProgress(search);
    filterAwaitFeedback(search);
    filterDone(search);
}


/**
 * this function filters the tasks to do by search
 * 
 * @param {string} search 
 */
function filterToDo(search) {
    document.getElementById('to-do-container').innerHTML = '';
    for (let i = 0; i < tasksToDo.length; i++) {
        if (tasksToDo[i]['titel'].toLowerCase().includes(search) || tasksToDo[i]['text'].toLowerCase().includes(search)) {
            let category = tasksToDo[i]['category'];
            getCategoryColor(`${category}`);
            checkDoneTasks(i, 'tasksToDo');
            const widthProgressBar = nbDone / tasksToDo[i]['subtasks'].length * 100;
            document.getElementById('to-do-container').innerHTML +=
                htmlTemplateTasks(i, widthProgressBar, nbDone, tasksToDo);
            renderSelectedPerson(i, tasksToDo);
        }
    }
}


/**
 * this function filters the tasks in progress by search
 * 
 * @param {string} search 
 */
function filterInProgress(search) {
    document.getElementById('in-progress-container').innerHTML = '';
    for (let i = 0; i < tasksInProgress.length; i++) {
        if (tasksInProgress[i]['titel'].toLowerCase().includes(search) || tasksInProgress[i]['text'].toLowerCase().includes(search)) {
            let category = tasksInProgress[i]['category'];
            getCategoryColor(`${category}`);
            checkDoneTasks(i, 'tasksInProgress');
            const widthProgressBar = nbDone / tasksInProgress[i]['subtasks'].length * 100;
            document.getElementById('in-progress-container').innerHTML +=
                htmlTemplateTasks(i, widthProgressBar, nbDone, tasksInProgress);
            renderSelectedPerson(i, tasksInProgress);
        }
    }
}


/**
 * this function filters the tasks await feedback by search
 * 
 * @param {string} search 
 */
function filterAwaitFeedback(search) {
    document.getElementById('await-feedback-container').innerHTML = '';
    for (let i = 0; i < tasksAwaitFeedback.length; i++) {
        if (tasksAwaitFeedback[i]['titel'].toLowerCase().includes(search) || tasksAwaitFeedback[i]['text'].toLowerCase().includes(search)) {
            let category = tasksAwaitFeedback[i]['category'];
            getCategoryColor(`${category}`);
            checkDoneTasks(i, 'tasksAwaitFeedback');
            const widthProgressBar = nbDone / tasksAwaitFeedback[i]['subtasks'].length * 100;
            document.getElementById('await-feedback-container').innerHTML +=
                htmlTemplateTasks(i, widthProgressBar, nbDone, tasksAwaitFeedback);
            renderSelectedPerson(i, tasksAwaitFeedback);
        }
    }
}


/**
 * this function filters the tasks done by search
 * 
 * @param {string} search 
 */
function filterDone(search) {
    document.getElementById('done-container').innerHTML = '';
    for (let i = 0; i < tasksDone.length; i++) {
        if (tasksDone[i]['titel'].toLowerCase().includes(search) || tasksDone[i]['text'].toLowerCase().includes(search)) {
            let category = tasksDone[i]['category'];
            getCategoryColor(`${category}`);
            checkDoneTasks(i, 'tasksDone');
            const widthProgressBar = nbDone / tasksDone[i]['subtasks'].length * 100;
            document.getElementById('done-container').innerHTML +=
                htmlTemplateTasks(i, widthProgressBar, nbDone, tasksDone);
            renderSelectedPerson(i, tasksDone);;
        }
    }
}


/**
 * this function opens the add task popup
 * 
 */
function openAddTaskPopup(containerString) {
    containerToAdd = containerString;
    document.getElementById('add-task-popup-container').classList.remove('d-none');
    document.getElementById('body').style.overflow = 'hidden';
    renderDueDate();
}


/**
 * this function closes the add task popup
 * 
 */
function closeAddTask() {
    document.getElementById('add-task-popup-container').classList.add('d-none');
    document.getElementById('list-task-category').classList.add('d-none');
    document.getElementById('list-assigned-to').classList.add('d-none');
    document.getElementById('body').style.overflow = 'visible';
    temporaryPersons = []
}


