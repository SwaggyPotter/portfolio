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
let categoryOpenClose = false;
containerToAdd = 'toDo'

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
function savePersonTemorary(k, checkboxId) {
    let checked = document.getElementById(`checkBoxNbr${checkboxId}`).checked
    if (checked == true) {
        document.getElementById(`checkBoxNbr${checkboxId}`).checked = false
    }
    else if (checked == false) {
        document.getElementById(`checkBoxNbr${checkboxId}`).checked = true
    }
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
            temporaryPersons = removeValueFromArray(temporaryPersons, contacts[i]['name'] + ' ' + contacts[i]['second-name'])
        }
    }
    sortNamesByFirstLetter(temporaryPersons)
}


/**
 * Remove an item from an array and give back the array without the element
 * @param {array} array 
 * @param {any} valueToRemove 
 * @returns a new array without the given element
 */
function removeValueFromArray(array, valueToRemove) {
    const newArray = array.filter(item => item !== valueToRemove);
    return newArray;
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
    closeAddTask();
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
        if (inputElements[i].checked && istNameImArray(categories[i], teporaryCategory) == false && document.getElementById(`checkBox${i}`).disabled == false) {
            teporaryCategory.push(categories[i]);
        }
        if (!inputElements[i].checked && istNameImArray(categories[i], teporaryCategory) == true) {
            teporaryCategory = removeValueFromArray(teporaryCategory, categories[i])
        }
    }
}


/**
 * With clicking on the field, the checkbox of the choosen category is checked
 * @param {number} x number of the category from the html document
 */
function setCheckBoxCheckt(x) {
    if (document.getElementById(`checkBox${x}`).checked == true) {
        document.getElementById(`checkBox${x}`).checked = false;
    }
    else if (document.getElementById(`checkBox${x}`).checked == false && document.getElementById(`checkBox${x}`).disabled == false) {
        document.getElementById(`checkBox${x}`).checked = true;
    }
    checkDisable(x)
}


/**
 * Set the other non choosen categorys on disable or enable if no other category is choosen
 * @param {number} x number of the category from the html document
 */
function checkDisable(x) {
    if (document.getElementById(`checkBox${x}`).disabled == true) { }
    else {
        for (i = 0; i < categories.length; i++) {
            if (document.getElementById(`checkBox${x}`).checked == true) {
                for (i = 0; i < categories.length; i++) {
                    if (document.getElementById(`checkBox${i}`).checked == false) {
                        document.getElementById(`checkBox${i}`).disabled = true;
                    }
                }
            }
            else if (document.getElementById(`checkBox${x}`).checked == false) {
                for (i = 0; i < categories.length; i++) {
                    if (document.getElementById(`checkBox${i}`).checked == false) {
                        document.getElementById(`checkBox${i}`).disabled = false;
                    }
                }
            }
        }
    }
}


/**
 * show the choosen categorys, if you dont choose one the inner html is empty
 */
function showCategorys() {
    if (teporaryCategory.length < 1) {
        document.getElementById('showCaseCategory').innerHTML = ``;
    }
    else {
        document.getElementById('showCaseCategory').innerHTML = `<span class="categoryBackground">${teporaryCategory}</span>`;
    }
}


/**
 * this function opens the category list
 * 
 */
function openTaskCategory() {
    document.getElementById('list-task-category').classList.toggle('d-none');
    showCategorys()
    document.getElementById('showCaseCategory').classList.add('d-none')
    if (categoryOpenClose == false) {
        categoryOpenClose = true
        document.getElementById('showCaseCategory').classList.add('d-none')
    }
    else if (categoryOpenClose == true) {
        categoryOpenClose = false
        document.getElementById('showCaseCategory').classList.remove('d-none')
    }
}


/**
 * Close the add category drop down
 */
function closeAddCategory() {
    showCategorys()
    categoryOpenClose = false
    document.getElementById('showCaseCategory').classList.remove('d-none')
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


let openClose = false;
/**
 * this function opens the name list container 
 * 
 */
function openContactsToAssign() {
    document.getElementById('list-assigned-to').classList.toggle('d-none');
    if (document.getElementById('list-assigned-to-two')) {
        document.getElementById('list-assigned-to-two').classList.toggle('d-none');
    }
    if (openClose == true) {
        openClose = false;
        document.getElementById('choosenContactContainer').style.display = 'inline';
    }
    else if (openClose == false) {
        openClose = true
        document.getElementById('choosenContactContainer').style.display = 'none';
    }
}


/**
 * this function renders the assigned to list
 */
function renderListAssignedTo() {
    if (temporaryPersons.length === 0) {
        let content = document.getElementById('checkbox-list-assigned-to');
        content.innerHTML = '';
        for (let i = 0; i < contacts.length; i++)
            content.innerHTML +=
                htmlTemplateListAssignedTo(i);
    }
    if (openClose == false) {
        let choosenUser = document.getElementById('choosenContactContainer');
        choosenUser.innerHTML = '';
        for (let i = 0; i < contacts.length; i++)
            if (temporaryPersons[i] != undefined) {
                choosenUser.innerHTML += `<p class="choosenUser">${temporaryPersons[i]}</p>`
            }
    }
    else if (temporaryPersons.lenght > 0) { }
}


/**
 * close the dropdown if you click on any other in the form
 */
function closeDropdown(x) {
    if (x == 'contacts') {
        document.getElementById('list-task-category').classList.add('d-none');
        closeAddCategory()
    }
    if (x == 'category') {
        closeTheContactList()
    }
    if (x == 'datePicker') {
        closeTheContactList()
        closeAddCategory()
        document.getElementById('list-task-category').classList.add('d-none');
    }
    if (x == 'prio') {
        closeTheContactList()
        closeAddCategory()
        document.getElementById('list-task-category').classList.add('d-none');
    }
    if (x == 'clear') {
        closeTheContactList()
        closeAddCategory()
        document.getElementById('list-task-category').classList.add('d-none');
    }
    if (x == 'subTask') {
        closeTheContactList()
        closeAddCategory()
        document.getElementById('list-task-category').classList.add('d-none');
    }
    if (x == 'input') {
        closeTheContactList()
        closeAddCategory()
        document.getElementById('list-task-category').classList.add('d-none');
    }
}


/**
 * close the contact list and show the choosen contacts
 */
function closeTheContactList() {
    document.getElementById('list-assigned-to').classList.add('d-none');
    openClose = false
    document.getElementById('choosenContactContainer').style.display = 'inline';
    renderListAssignedTo()
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


/**
 * seconds function for adding a task
 */
function secondAddTask() {
    containerToAdd = 'toDo'
    secondgetAssignedTo();
    addTask();
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 500)
}


/**
 * seconds function for adding a task
 */
function secondgetAssignedTo() {
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
}