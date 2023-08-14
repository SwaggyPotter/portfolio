let currentDraggedElement;
let taskStatus;
let movedTask;


/**
 * this function allows to drop an element
 * 
 * @param {Event} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * this function changes the task's status 
 * 
 * @param {string} container 
 */
function moveTo(container) {
    const isGoodValue = val => val && val !== '-' && val !== 'N/A'; /* check for empty arrays*/
    target = container['currentTarget']['id'];
    changeTaskPosition(isGoodValue)
    moveTarget()
    saveTasksToBackend();
}


/**
 * move the tast position
 * 
 * @param {*} isGoodValue 
 */
function changeTaskPosition(isGoodValue) {
    const moveTask = (taskArray) => {
        currentTask = taskArray[movedTask];
        delete taskArray[movedTask];
        return taskArray.filter(isGoodValue);
    };
    if (currentDraggedElement == 'tasksToDo') {
        tasksToDo = moveTask(tasksToDo);
    }
    if (currentDraggedElement == 'tasksInProgress') {
        tasksInProgress = moveTask(tasksInProgress);
    }
    if (currentDraggedElement == 'tasksAwaitFeedback') {
        tasksAwaitFeedback = moveTask(tasksAwaitFeedback);
    }
    if (currentDraggedElement == 'tasksDone') {
        tasksDone = moveTask(tasksDone);
    }
}


/**
 * extension of the change position function
 * 
 * @param {*} isGoodValue 
 * @param {string} taskTypeString 
 * @param {string} taskType 
 */
function changeTaskPositionExtension(isGoodValue, taskTypeString, taskType) {
    if (currentDraggedElement == taskTypeString) {
        currentTask = taskType[movedTask];
        delete taskType[movedTask];
        taskType = taskType.filter(isGoodValue);
    }
}


/**
 * Push the array into a new array
 */
function moveTarget() {
    if (target == 'to-do-container') {
        tasksToDo.push(currentTask);
        renderBoard();
    }
    if (target == 'in-progress-container') {
        tasksInProgress.push(currentTask);
        renderBoard();
    }
    if (target == 'await-feedback-container') {
        tasksAwaitFeedback.push(currentTask);
        renderBoard();
    }
    if (target == 'done-container') {
        tasksDone.push(currentTask);
        renderBoard();
    }
}


/**
 * this function rembers the task to move
 * 
 * @param {number} i 
 * @param {string} taskStatus 
 */
function startDragging(i, taskStatus) {
    movedTask = i;
    currentDraggedElement = taskStatus;
}