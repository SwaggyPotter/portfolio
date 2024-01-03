let contacts = []
let sortedContacts = sortContactsAndSave(contacts);
let contactsTransform;
const firstData = [];
const Contacts = parseContactData(firstData);

/**
 * load the contacts from the backend
 */
async function loadContactFromBackEnd() {
    setTimeout(async () => {
        sortedContacts = await parseContactData(window.FirebaseContacts) || []
        renderTheQuestContacts();
    }, 4000)
}

/**
 * @param {array} jsonStrings array with strings
 * @returns an objekt
 */
function parseContactData(jsonStrings) {
    const contacts = jsonStrings.map(jsonString => JSON.parse(jsonString));
    return contacts;
}


/**
 * render the contacts
 */
function renderTheQuestContacts() {
    sortedContacts = sortContactsAndSave(sortedContacts)
    document.getElementById('show-contacts-quest').innerHTML = ``
    for (i = 0; i < sortedContacts.length; i++) {
        document.getElementById('show-contacts-quest').innerHTML += `
        ${letterSortSet(i)}
    <div id="contact${i}" onclick="showDetail(${i})" class="contact-card-quest">
        <div id="userBackgroundId${i}" style="background-color: ${getRandomColor()};" class="embleme-designe">
            <span>${getTheFirstLetterOfName(i)}</span>
        </div>
        <div class="contact-container-name-email-designe">
            <span class="contact-card-guest-name">${sortedContacts[i]['name']} ${sortedContacts[i]['second-name']}</span>
            <span class="email-card-quest-designe">${sortedContacts[i]['email']}</span>
        </div>
    </div>`}
}


/**
 * function for giving back the first letter of the firstname and the surename
 * @param {string} x - the first letter of the choosen name
 * @returns 
 */
function getTheFirstLetterOfName(x) {
    let firstname = sortedContacts[x]['name'].charAt(0).toUpperCase()
    let surename = sortedContacts[x]['second-name'].charAt(0).toUpperCase()
    let firstletterFullName = firstname + surename
    return firstletterFullName
}

/**
 * sorting the contacts
 * @param {object} contacts 
 * @returns 
 */
function sortContactsAndSave(contacts) {
    let sortedContacts = contacts.slice();
    sortedContacts.sort(function (a, b) {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    return sortedContacts;
}


/**
 * showing the details of a contact: full name, email, telephone number
 * @param {*} j 
 */
function showDetail(j) {
    showChosenContact(j);
    document.getElementById('detail-information-screen').innerHTML = detailScreenAdd(j)
}

/**
 * Open the edit window
 * @param {object} o - the choosen contact
 */
function openEdit(o) {
    document.getElementById('edit-window').innerHTML = openEditScreen(o);
    document.getElementById('edit-window').style.left = '0';
    fillEditInput(o);
    closeAdd()
}


/**
 * Close the detail window
 */
function closeDetail() {
    if (window.innerWidth > 1340 && activShowingContact == true) {
        activShowingContact = false;
        document.getElementById('detail-information-screen').style.padding = '103px 1865px';
        document.getElementById('close-detail-arrow').style.position = 'initial';
    }
    else if (window.innerWidth < 1340 && activShowingContact == true) {
        activShowingContact = false;
        document.getElementById('detail-information-screen').style.right = '-100vw';
        document.getElementById('close-detail-arrow').style.position = 'initial';
    }
}


/**
 * Fill the input with name,number.email and phone number of the choosen contact
 * @param {object} x - the choosen contact
 */
function fillEditInput(x) {
    document.getElementById(`nameInputEdit${x}`).value = `${sortedContacts[x]['name'].concat(" ") + sortedContacts[x]['second-name']}`
    document.getElementById(`emailInputEdit${x}`).value = `${sortedContacts[x]['email']}`
    document.getElementById(`phoneInputEdit${x}`).value = `${sortedContacts[x]['tel']}`
}


/**
 * Save the changes of the choosen contact
 * @param {object} x - the choosen contact
 */
function saveTheEdit(x) {
    if (containsTwoWords(document.getElementById(`nameInputEdit${x}`).value) === true) {
        letterCounter = [];
        sortedContacts[x]['name'] = document.getElementById(`nameInputEdit${x}`).value
        sortedContacts[x]['email'] = document.getElementById(`emailInputEdit${x}`).value
        sortedContacts[x]['tel'] = document.getElementById(`phoneInputEdit${x}`).value
        document.getElementById(`edit-input-field`).style.borderColor = 'black';
        firstAndSecondNameUpdate(document.getElementById(`nameInputEdit${x}`).value, x)
        closeEdit();
        window.updateContactByEmail(sortedContacts[x]['email'], { name: sortedContacts[x]['name'], email: sortedContacts[x]['email'], tel: sortedContacts[x]['tel'] })
        renderTheQuestContacts();
        showDetail(x);
    }
    else {
        openWarning();
    }
}


/**
 * Close the edit window
 */
function closeEdit() {
    if (window.innerWidth > 1100) {
        document.getElementById('edit-window').style.left = '-50vw'
    }
    else if (window.innerWidth < 1100) {
        document.getElementById('edit-window').style.left = '-100vw'
    }
}


/**
 * Change the edit and add window's with on rezise
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) {
        document.getElementById('edit-window').style.left = '-50vw'
        document.getElementById('add-window').style.left = '-50vw'
    }
    else if (window.innerWidth < 1100) {
        document.getElementById('edit-window').style.left = '-100vw'
        document.getElementById('add-window').style.left = '-100vw'
    }
})


/**
 * change the background of the choosen contact
 */
let chosenContactCounter = 0;
let activShowingContact = null;
function showChosenContact(c) {
    activShowingContact = true;
    chosenContactCounter = c;
    document.getElementById('detail-information-screen').style.padding = '103px 65px';
    removeBackgroundFromUnchosed(c);
    if (window.innerWidth < 1340) {
        document.getElementById('detail-information-screen').style.padding = '0';
        document.getElementById('detail-information-screen').style.right = '0';
    }
}


/**
 * Change the css style of the detail information screen from the chossen contact on rezise
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 1340 && activShowingContact == true) {
        document.getElementById('detail-information-screen').style.padding = 'unset';
        document.getElementById('detail-information-screen').style.right = 'unset';
        document.getElementById('detail-information-screen').style.padding = '103px 65px';
    }
    else if (window.innerWidth < 1340 && activShowingContact == true) {
        document.getElementById('detail-information-screen').style.padding = '0';
        document.getElementById('detail-information-screen').style.right = '0';
    }
    else if (window.innerWidth < 1340 && activShowingContact == false) {
        document.getElementById('detail-information-screen').style.padding = '0';
        document.getElementById('detail-information-screen').style.right = '-100vw';
    }
    else if (window.innerWidth > 1340 && activShowingContact == false) {
        document.getElementById('detail-information-screen').style.padding = '103px 1865px';
        document.getElementById('detail-information-screen').style.right = 'unset';
    }
})


/**
 * the function remove and add the blue background in the contact list
 * @param {number} k - number in the array of the choosen contact
 */
function removeBackgroundFromUnchosed(k) {
    for (let index = 0; index < sortedContacts.length; index++) {
        if (index == chosenContactCounter) {
            document.getElementById(`contact${k}`).classList.add('chosed-contact')
        }
        else {
            document.getElementById(`contact${index}`).classList.remove('chosed-contact')
        }
    }
}


/**
 * load the letters of the first name into an array and return the letter
 * if the letter counter bigger than 1 he return nothing
 */
let letterCounter = [];
function letterSortSet(l) {
    let firstname = sortedContacts[i]['name'].charAt(0).toUpperCase()
    letterCounter.push(firstname)
    if (countLetter(letterCounter, firstname) < 2) {
        return `<div class="firstLetterSort">${firstname}<hr></div>`
    }
    else {
        return ``
    }
}


/**
 * this function giving back the amount of a letter
 * @param {Array} arr 
 * @param {string} letter 
 * @returns 
 */
function countLetter(arr, letter) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === letter) {
            count++;
        }
    }
    return count;
}


/**
 * open the add contact window
 */
function openAdd() {
    document.getElementById('add-window').style.left = '0';
    closeEdit()
}


/**
 * close the add contact window
 */
function closeAdd() {
    if (window.innerWidth > 1100) {
        document.getElementById('add-window').style.left = '-50vw';
    }
    else if (window.innerWidth < 1099) {
        document.getElementById('add-window').style.left = '-100vw';
    }
    document.getElementById('addNameInput').value = ``;
    document.getElementById('addEmailInput').value = ``;
    document.getElementById('addTelephoneInput').value = ``;
}


/**
 * Split the full name into first and second name
 * @param {string} inputValue - the full name from the input
 * @returns 
 */
function splitWords(inputValue) {
    let wordsArray = inputValue.split(" ");
    let firstWord = wordsArray[0];
    let secondWord = wordsArray[1];
    let resultArray = [firstWord, secondWord];
    return resultArray;
}


/**
 * Update the names array
 * @param {string} inputVal 
 * @param {number} number 
 */
function firstAndSecondNameUpdate(inputVal, number) {
    let input = inputVal;
    let result = splitWords(input);
    sortedContacts[number]['name'] = result[0]
    sortedContacts[number]['second-name'] = result[1]
}


/**
 * save button for adding a new contact
 */
function addNewContact() {
    if (containsTwoWords(document.getElementById('addNameInput').value) === true) {
        let nameAdd = splitWords(document.getElementById('addNameInput').value)
        let emailAdd = document.getElementById('addEmailInput').value
        let telephoneAdd = document.getElementById('addTelephoneInput').value
        let newContact = { "name": `${nameAdd[0]}`, "second-name": `${nameAdd[1]}`, "email": `${emailAdd}`, "tel": `${telephoneAdd}` }
        sortedContacts.push(newContact)
        letterCounter = [];
        window.addStringToArray(newContact);
        renderTheQuestContacts()
        clearTheAddInput();
        closeAdd();
    }
    else {
        openWarning()
    }
}


/**
 * Clear the inputs from the add window
 */
function clearTheAddInput() {
    nameAdd = document.getElementById('addNameInput').value = ``
    emailAdd = document.getElementById('addEmailInput').value = ``
    telephoneAdd = document.getElementById('addTelephoneInput').value = ``
}


/**
 * Close the add task window on the contact page
 */
function closeAddTaskContact() {
    document.getElementById('add-task-to-contact-container').style.width = '0px'
    open--
}


/**
 * Open the add task window on the contact page
 */
function openAddTask() {
    open++
    renderDueDate()
    containerToAdd = 'toDo'
    if (window.innerWidth > 600 && open == 1) {
        document.getElementById('add-task-to-contact-container').style.width = '600px'
        document.getElementById('task-add-btn').style.position = 'inherit';
    }
    else if (window.innerWidth < 600 && open == 1) {
        document.getElementById('add-task-to-contact-container').style.width = '100%'
        document.getElementById('task-add-btn').style.position = 'absolute';
        document.getElementById('task-add-btn').style.top = '20px';
        document.getElementById('task-add-btn').style.right = '-10px';
    }
}


/**
 * Change on rezise the add task to contact windows with
 */
let open = 0;
window.addEventListener('resize', () => {
    if (window.innerWidth > 600 && open == 1) {
        document.getElementById('add-task-to-contact-container').style.width = '600px'
        document.getElementById('task-add-btn').style.position = 'inherit';
    }
    else if (window.innerWidth < 600 && open == 1) {
        document.getElementById('add-task-to-contact-container').style.width = '100%'
        document.getElementById('task-add-btn').style.position = 'absolute';
        document.getElementById('task-add-btn').style.top = '20px';
        document.getElementById('task-add-btn').style.right = '-10px';
    }
})


loadContactFromBackEnd()