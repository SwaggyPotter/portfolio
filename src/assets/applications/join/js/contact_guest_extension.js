/**
 * check for two words in the string
 * @param {string} inputString - the full name (first- and last name)
 * @returns - return the two words that given into the name input
 */
function containsTwoWords(inputString) {
    let words = inputString.trim().split(' ');
    return words.length === 2 && !words.includes('');
}


/**
 * 
 * @returns - return a random color for the profiles in the contact
 */
function getRandomColor() {
    let colors = ["#FF4136", "#FF851B", "#FFDC00", "#2ECC40", "#0074D9", "#B10DC9", "#01FF70", "#F012BE", "#85144b", "#7FDBFF", "#001f3f", "#39CCCC", "#3D9970", "#2ECC40", "#01FF70", "#FFDC00", "#FF4136", "#85144b", "#F012BE", "#111111"];
    let randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}


/**
 * Gave the background color of the choosen profile for the edit window
 * @param {object} element 
 * @returns - the background color
 */
function getBackgroundColor(element) {
    let style = window.getComputedStyle(element);
    let backgroundColor = style.getPropertyValue("background-color");

    if (backgroundColor.indexOf("rgb") !== -1) {
        return backgroundColor;
    } else {
        let hexColor = rgbToHex(backgroundColor);
        return hexColor;
    }
}


/**
 * @param {*} rgbColor 
 * @returns the hexa code color
 */
function rgbToHex(rgbColor) {
    let rgbArray = rgbColor.substring(4, rgbColor.length - 1).split(",");
    let hexArray = [];

    for (let i = 0; i < rgbArray.length; i++) {
        let hexValue = parseInt(rgbArray[i]).toString(16);
        hexArray.push(hexValue.length === 1 ? "0" + hexValue : hexValue);
    }
    return "#" + hexArray.join("");
}


/**
 * Open a warning that tell you to gave a first and ad second name into the input
 */
function openWarning() {
    document.getElementById('warning-full-name').style.display = 'flex';
}


/**
 * Close the warning
 */
function closeWarningContact() {
    document.getElementById('warning-full-name').style.display = 'none';
}

/**
 * Show a pop up that tell you that you sucssesfully added a new contact
 */
function showAddPopUp() {
    document.getElementById('popup-container').style.display = 'flex';
    document.getElementById('popup-pic').classList.add('popupClassAnimation')
    setTimeout(() => {
        document.getElementById('popup-container').style.display = 'none';
        document.getElementById('popup-pic').classList.remove('popupClassAnimation')
    }, 1900)
}


/**
 * Handle the popup time
 */
function addTaskWithTimeOut() {
    getAssignedTo()
    closeAddTaskContact()
    showAddPopUp()
    setTimeout(() => {
        addTask()
    }, 2000)
}


/**
 * delete the contact
 * @param {number} i 
 */
async function deleteContact(i) {
    window.deleteContactByEmail(sortedContacts[i]['email'])
    sortedContacts.splice(i, 1)
    letterCounter = [];
    renderTheQuestContacts()
    closeDetail()
}