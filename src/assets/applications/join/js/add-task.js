let ellipses = ['assets/img/ellipse-lightblue.svg', 'assets/img/ellipse-green.svg', 'assets/img/ellipse-red.svg', 'assets/img/ellipse-blue.svg', 'assets/img/ellipse-orange.svg', 'assets/img/ellipse-violet.svg'];
let ellipsesColors = ['#8AA4FF', '#2AD300', '#FF0000', '#0038FF', '#FF8A00', '#E200BE'];
let priority = 'low';
let category = '';
let nbOfSubtasks = 0;
let data = '';
let teporaryCategory = [];
let temporaryPersons = []
let id1 = 'checkbox-contacts'
let id2 = 'checkbox-contacts-two'

/**
 * clear the array's after closing the edit window
 * the array's for the edit window (contacts to assing)
 */
function clearArray() {
    removedChars = [];
    removedInitials = [];
    removerArray = [];
    removeInitials = [];
}


/**
 * sort a array with strings by the first letter
 * 
 * @param {sting} names 
 * @returns array with sortet names
 */
function sortNamesByFirstLetter(names) {
    names.sort();
    const groupedNames = {};
    names.forEach(name => {
        const words = name.split(' ');
        const firstLetter = words[0].charAt(0).toUpperCase();
        if (groupedNames[firstLetter]) {
            groupedNames[firstLetter].push(name);
        } else {
            groupedNames[firstLetter] = [name];
        }
    });
    const sortedGroups = Object.entries(groupedNames).sort();
    const sortedNames = [];
    sortedGroups.forEach(group => {
        sortedNames.push(...group[1]);
    });
    return sortedNames;
}


/**
 * check which checkboxes are open
 * 
 * @param {number} k 
 */
function savePersonTemorary(k) {
    if (k == 1) {
        saveExtension(id1)
    }
    else if (k == 2) {
        saveExtension(id2)
    }
}


/**
 * get the contact to assign based on the checkbox which choosen.
 * 
 * @param {object} id 
 */
function saveExtension(id) {
    let inputElements = document.getElementsByClassName(id);
    for (let i = 0; inputElements[i]; ++i) {
        if (istNameImArray(contacts[i]['name'] + ' ' + contacts[i]['second-name'], temporaryPersons) == true && inputElements[i].checked) {
        }
        if (inputElements[i].checked && istNameImArray(contacts[i]['name'] + ' ' + contacts[i]['second-name'], temporaryPersons) == false) {
            temporaryPersons.push(contacts[i]['name'] + ' ' + contacts[i]['second-name']);
        }
        if (!inputElements[i].checked && istNameImArray(contacts[i]['name'] + ' ' + contacts[i]['second-name'], temporaryPersons) == true) {
            temporaryPersons = removeStringFromArray(temporaryPersons, contacts[i]['name'] + ' ' + contacts[i]['second-name'], temporaryPersons)
        }
    }
    sortNamesByFirstLetter(temporaryPersons)
}


/**
 * This function adds a task to the board's To Do list
 * 
 */
async function addTask() {
    let title = document.getElementById('task-title').value;
    let text = document.getElementById('task-description').value;
    let dueDate = document.getElementById('due-date').value;
    getSubTasks();
    await pushTask(title, text, dueDate);
    //window.location.href = "board.html";
}


/**
 * This function pushes all data of a new task in the array taskToDo and sves them in the backend
 * 
 * @param {string} title 
 * @param {string} text 
 * @param {date} dueDate 
 */
async function pushTask(title, text, dueDate) {
    data = {
        category: `${category}`,
        titel: `${title}`,
        text: `${text}`,
        inCharge: [],
        initials: [],
        dueDate: `${dueDate}`,
        priority: `assets/img/${priority}.svg`,
        priorityByName: `${priority}`,
        subtasks: [],
        alreadyDone: []
    };
    getCheckboxes()

    await saveNewTaskinFolder(data);
}


/**
 * this function searchs for checked ckeckboxes
 * 
 */
function getCheckboxes() {
    getInCharge();
    getSubtasksForm();
    getSubtasksChecked();
}


/**
 * this function pushes the new task in the choosen tasklist
 * 
 * @param {Array} data 
 */
async function saveNewTaskinFolder(data) {
    switch (containerToAdd) {
        case ('toDo'):
            tasksToDo.push(data);
            window.addNewTask(data, 'tasksToDo')
            break;
        case ('inProgress'):
            tasksInProgress.push(data);
            window.addNewTask(data, 'tasksInProgress')
            break;
        case ('awaitFeedback'):
            tasksAwaitFeedback.push(data);
            window.addNewTask(data, 'tasksAwaitFeedback')
            break;
        case ('done'):
            tasksDone.push(data);
            window.addNewTask(data, 'tasksDone')
            break;
    }
}


/**
 * this function pushes the array of people assigned to the task in the data array
 * 
 */
function getInCharge() {
    for (let i = 0; i < assignedTo.length; i++) {
        data['inCharge'].push(assignedTo[i]);
        data['initials'].push(initials[i]);
    }
}


/**
 * this function registers the new added subtasks in the data array
 * 
 */
function getSubtasksForm() {
    for (let i = 0; i < subtasks.length; i++) {
        data['subtasks'].push(subtasks[i]);
    }
}


/**
 * this function checks if there are crossed subtasks
 * 
 */
function getSubtasksChecked() {
    let checkboxChecked = [];
    let inputElements = document.getElementsByClassName('checkbox-subtask');
    for (let i = 0; inputElements[i]; ++i) {
        if (inputElements[i].checked) {
            checkboxChecked.push(1);
        } else {
            checkboxChecked.push(0);
        }
    }
    for (let i = 0; i < checkboxChecked.length; i++) {
        data['alreadyDone'].push(checkboxChecked[i]);
    }
}


/**
 * this function registers the new task's category
 * 
 */
function getCategory() {
    let inputElements = document.getElementsByClassName('messageCheckbox');
    for (let i = 0; inputElements[i]; ++i) {
        if (inputElements[i].checked) {
            category = categories[i];
            break;
        }
    }
    checkEmptyCategory(category);
}


/**
 * Push a person in an temporary array
 * 
 * @param {number} i 
 */
function teporaryAdd(i) {
    let inputElements = document.getElementsByClassName('messageCheckbox');
    for (let i = 0; inputElements[i]; ++i) {
        if (istNameImArray(categories[i], teporaryCategory) == true && inputElements[i].checked) {
        }
        if (inputElements[i].checked && istNameImArray(categories[i], teporaryCategory) == false) {
            teporaryCategory.push(categories[i]);
        }
        if (!inputElements[i].checked && istNameImArray(categories[i], teporaryCategory) == true) {
            teporaryCategory = removeStringFromArray(teporaryCategory, categories[i], teporaryCategory)
        }
    }
}


/**
 * this function checks if a category is selected
 * 
 * @param {string} category 
 */
function checkEmptyCategory(category) {
    if (category == '') {
        document.getElementById('error-msg').classList.remove('d-none');
        document.getElementById('category-msg').classList.remove('d-none');
    } else {
        addTask();
    }
}


/**
 * this function registers the people who are assigned to the new task
 * 
 */
function getAssignedTo() {
    assignedTo = [];
    initials = [];
    let inputElements = document.getElementsByClassName('checkbox-contacts');
    for (let i = 0; inputElements[i]; ++i) {
        if (inputElements[i].checked) {
            assignedTo.push(contacts[i]['name'] + ' ' + contacts[i]['second-name']);
            initials.push(contacts[i]['name'].charAt(0) + contacts[i]['second-name'].charAt(0));
        }
    }
    checkEmptyAssignedTo(assignedTo);
    renderBoard();
    closeAddTask()
}


/**
 * this function checks if a contact is assigned to the task
 * 
 * @param {string} assignedTo 
 */
function checkEmptyAssignedTo(assignedTo) {
    if (assignedTo == '') {
        document.getElementById('error-msg').classList.remove('d-none');
        document.getElementById('assignedTo-msg').classList.remove('d-none');
    } else {
        getCategory()
    }
}


/**
 * this function closes the error message if no contact or category is selected
 * 
 */
function closeErrorMsg() {
    document.getElementById('assignedTo-msg').classList.add('d-none');
    document.getElementById('category-msg').classList.add('d-none');
    document.getElementById('new-category-msg').classList.add('d-none');
    document.getElementById('color-msg').classList.add('d-none');
    document.getElementById('error-msg').classList.add('d-none');
}


/**
 * this function pushes all new subtasks in the subtasks array
 * 
 */
function getSubTasks() {
    subtasks = [];
    let inputElements = document.getElementsByClassName('checkbox-subtask');
    for (let i = 0; inputElements[i]; ++i) {
        subtask = document.getElementById(`${i}`).innerHTML;
        subtasks.push(subtask);
    }
}


/**
 * this function opens the name list container 
 * 
 */
function openContactsToAssign() {
    document.getElementById('list-assigned-to').classList.toggle('d-none');
    if (document.getElementById('list-assigned-to-two')) {
        document.getElementById('list-assigned-to-two').classList.toggle('d-none')
    }
}


/**
 * this function opens the category list
 * 
 */
function openTaskCategory() {
    document.getElementById('list-task-category').classList.toggle('d-none');
}


/**
 * this function renders the assigned to list
 * 
 */
function renderListAssignedTo() {
    if (temporaryPersons.length === 0) {
        let content = document.getElementById('checkbox-list-assigned-to');
        content.innerHTML = '';
        for (let i = 0; i < contacts.length; i++)
            content.innerHTML +=
                htmlTemplateListAssignedTo(i);
    }
    else if (temporaryPersons.lenght > 0) {

    }
}

/**
 * render the contact list if you click on an task to edit
 * 
 * @param {object} taskStatus 
 * @param {number} x 
 */
function renderListAssignedToTwo(taskStatus, x) {
    if (temporaryPersons.length === 0) {
        let content = document.getElementById('checkbox-list-assigned-to-two');
        content.innerHTML = '';
        for (let i = 0; i < contacts.length; i++)
            content.innerHTML +=
                htmlTemplateListAssignedToTwo(i, taskStatus, x);
    }
    else if (temporaryPersons.lenght > 0) {

    }
}


/**
 * this function renders the category list
 * 
 */
function renderListTaskCategory() {
    if (teporaryCategory.length === 0) {
        content = document.getElementById('category-row').innerHTML =
            htmlTemplateNewCategory();
        for (let i = 0; i < categories.length; i++) {
            categoryToRender = categories[i];
            categoryColorToRender = categoryColors[i];
            document.getElementById('category-row').innerHTML +=
                htmlTemplateCategory(categoryToRender, categoryColorToRender, i)
        }
    }
}


/**
 * this function renders the subtasks list
 * 
 */
function renderSubtasks() {
    let content = document.getElementById('task-subtask');
    newtaskSubtask = content.value;
    if (newtaskSubtask.length > 0) {
        document.getElementById('ckeckbox-subtasks').innerHTML +=
            htmlTemplateSubtasks(newtaskSubtask, nbOfSubtasks)
        nbOfSubtasks++;
    }
    content.value = '';
}