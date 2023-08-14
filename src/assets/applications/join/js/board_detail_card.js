let openTask;

//Test renderSubtask Done
function renderSubtaksInDetailCard(x, tasktype) {
    document.getElementById('subtasks').innerHTML = '';
    for (let j = 0; j < tasktype[x]['subtasks'].length; j++) {
        if (tasktype[x]['alreadyDone'][j] == 1) {
            checkedStatus = 'checked';
        } else {
            checkedStatus = '';
        };
        document.getElementById('subtasks').innerHTML +=
            htmlTemplateSubtasksDetailCard(x, j, checkedStatus, tasktype);
    }
}


/**
 * open the detail card on the board
 * 
 * @param {number} x 
 * @param {string} tasktype 
 */
function openDetailcard(x, tasktype) {
    document.getElementById('details').classList.remove('d-none');
    let category = tasktype[x]['category'];
    getCategoryColor(`${category}`);
    document.getElementById('detail-popup').innerHTML =
        htmltemplateDetailCard(x, tasktype);

    document.getElementById('names-container').innerHTML = '';
    for (let j = 0; j < tasktype[x]['inCharge'].length; j++) {
        document.getElementById('names-container').innerHTML +=
            htmlTemplatePersonsDetailCard(x, j, tasktype);
    };
    renderSubtaksInDetailCard(x, tasktype);
    document.getElementById('body').style.overflow = 'hidden';
    document.getElementById('details').setAttribute('onclick', `closeDetailCard('${startDragNameFinder(tasktype)}', ${x})`)
    openTask = tasktype[x];
}


/**
 * this function closes the detail card
 * 
 * @param {string} taskStatus 
 * @param {number} x 
 */
function closeDetailCard(taskStatus, x) {
    let inputElements = document.getElementsByClassName('sutaskCheckbox');
    getCheckedCheckBoxes(inputElements);
    updateCheckboxChecked(taskStatus, x, checkboxChecked);
    document.getElementById('details').classList.add('d-none');
    saveTasksToBackend();
    renderBoard();
    document.getElementById('body').style.overflow = 'visible';
}


/**
 * this function checks which checkboxes are checked
 * 
 * @param {string} inputElements 
 */
function getCheckedCheckBoxes(inputElements) {
    checkboxChecked = [];
    for (let i = 0; inputElements[i]; ++i) {
        if (inputElements[i].checked) {
            checkboxChecked.push(1);
        } else {
            checkboxChecked.push(0);
        }
    };
}


/**
 * this function registers which checkboxes are checked
 * 
 * @param {string} taskStatus 
 * @param {number} x 
 * @param {Array} checkboxChecked 
 */
function updateCheckboxChecked(taskStatus, x, checkboxChecked) {
    switch (taskStatus) {
        case 'tasksToDo':
            updateCheckboxCheckedExtension(taskStatus, x, checkboxChecked, tasksToDo)
            break;
        case 'tasksInProgress':
            updateCheckboxCheckedExtension(taskStatus, x, checkboxChecked, tasksInProgress)
            break;
        case 'tasksAwaitFeedback':
            updateCheckboxCheckedExtension(taskStatus, x, checkboxChecked, tasksAwaitFeedback)
            break;
        case 'tasksDone':
            updateCheckboxCheckedExtension(taskStatus, x, checkboxChecked, tasksDone)
            break;
    }
}


/**
 * check if the checkbox is checked
 * 
 * @param {string} taskStatus 
 * @param {number} x 
 * @param {array} checkboxChecked 
 * @param {array} taskType 
 */
function updateCheckboxCheckedExtension(taskStatus, x, checkboxChecked, taskType) {
    taskType[x]['alreadyDone'] = [];
    for (let i = 0; i < checkboxChecked.length; i++) {
        taskType[x]['alreadyDone'].push(checkboxChecked[i]);
    };
}


/**
 * this function deletes the selected task
 * 
 * @param {string} taskToDelete 
 * @param {number} x 
 */
function deleteTask(taskToDelete, x) {
    const isGoodValue = val => val && val !== '-' && val !== 'N/A'; /* check for empty arrays*/
    switch (taskToDelete) {
        case 'tasksToDo':
            delete tasksToDo[x];
            tasksToDo = tasksToDo.filter(isGoodValue);
            break;
        case 'tasksInProgress':
            delete tasksInProgress[x];
            tasksInProgress = tasksInProgress.filter(isGoodValue);
            break;
        case 'tasksAwaitFeedback':
            delete tasksAwaitFeedback[x];
            tasksAwaitFeedback = tasksAwaitFeedback.filter(isGoodValue);
            break;
        case 'tasksDone':
            delete tasksDone[x];
            tasksDone = tasksDone.filter(isGoodValue);
            break;
    }


    closeDetailCard();
    saveTasksToBackend();
    renderBoard();
}