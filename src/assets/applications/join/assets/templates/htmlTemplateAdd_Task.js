function htmlTemplateSubtasks(newtaskSubtask, i) {
    return `
    <div class="row">
    <input class="checkbox-subtask" type="checkbox"> &nbsp;
    <span id="${i}">${newtaskSubtask}</span>
    </div>`;
}


function htmlTemplateListAssignedTo(i) {
    return `
    <li><input onclick="savePersonTemorary(1)" class="checkbox-contacts" type="checkbox" /> ${contacts[i]['name']} ${contacts[i]['second-name']}</li>
    `;
}


function htmlTemplateListAssignedToTwo(i, taskStatus, x) {
    if (istNameImArray(contacts[i]['name'] + ' ' + contacts[i]['second-name'], taskStatus[x]['inCharge']) === true) {
        return `
        <li class="onList"><input class="checkbox-contacts-two" type="checkbox" /> Schon auf der liste</li>
        `;
    }
    else {
        return `
        <li><input onclick="savePersonTemorary(2)" class="checkbox-contacts-two" type="checkbox" /> ${contacts[i]['name']} ${contacts[i]['second-name']}</li>
        `;
    }

}


function istNameImArray(vollerName, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === vollerName) {
            return true;
        }
    }
    return false;
}


function htmlTemplateCategory(categoryToRender, ellipseToRender, i) {
    return `
        <div class="category-row">
            <div>
                <div><input onclick="teporaryAdd(${i})" class="messageCheckbox" type="checkbox"/> ${categoryToRender}</div>
            </div>
            <img src="${ellipseToRender}">
        </div>
    `;
}


function htmlTemplateDueDate(todayDate) {
    return `
        <input type="date" id="due-date" name="trip-start" value="" min="${todayDate}" onfocus="this.showPicker()"required>
        <img src="assets/img/calendar.svg">
        `;
}


function htmlTemplateNewCategory() {
    return `
    <div class="new-category" id="new-category">
    <span class="hover" onclick="openNewCategory()">New Category</span>
    `;
}


function htmlTemplateNewCategoryEnter() {
    return `
    <div class="input-filed-new-category">
    <input type="text" placeholder="Enter New Category" id="register-category"></input>
    <button type="button" onclick="closeNewCategory()">Cancel</button>
    <button type="button" onclick="getNewCategory()">OK</button>
    </div>
    <div class="category-colors" id="category-colors"></div>
    `;
}


function htmlTemplateNewCategoryColor(ellipse, i) {
    return `
    <img src="${ellipse}" id="color${i}" onclick="setCategoryColor(${i})">
    `;
}


function htmlTemplateCategoryChecked(categoryToRender, ellipseToRender) {
    return `
        <div class="category-row">
            <div>
                <div><input class="messageCheckbox" type="checkbox" checked>${categoryToRender}</div>
            </div>
            <img src="${ellipseToRender}">
        </div>
    `;
}
