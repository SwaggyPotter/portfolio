/**
 * This MAIN function is used to verify if the login details are existing/correct
 */

function login() {
    let email = document.getElementById("login-mail");
    let password = document.getElementById("login-password");
    let allUsersAsArray = getUsersAsArray();
    if (allUsersAsArray != null) { // If users exists in the backend
        let userToReset = allUsersAsArray.filter((user) => user.email == email.value);
        let userCanLogin = loginValidation(userToReset, email, password, 1);
        let incorrectUserDetail = loginValidation(userToReset, email, password, 2);
        if (userCanLogin) {
            let redir = `summary.html?name=${userCanLogin.name}`;
            localStorage.setItem('username', userCanLogin.name);
            window.location.href = redir;
        } else if (incorrectUserDetail) {
            printErrorMessage("Credentials incorrect!");
            emptyValues(email, password);
        } else {
            printErrorMessage("User not found");
            emptyValues(email, password);
        }
    } else {
        printErrorMessage("User not found!");
        emptyValues(email, password);
    }
}


/**
 * This function is used to check all login possibilities
 * @param allUsersAsArray
 * @param email
 * @param password
 * @param param - case 1 or 2
 * @returns {*}
 */
function loginValidation(userToReset, email, password, param) {
    switch (param) {
        case 1:
            return userToReset.find(u => u.email == email.value && u.password == password.value);
            break;
        case 2:
            return userToReset.find(us => us.email != email.value || us.password != password.value);
            break;
        default:
            return 0;
    }
}


/**
 * This MAIN function is used to push all the sign-up information in an ARRAY
 */
async function register() {
    let name = document.getElementById("signup-name");
    let email = document.getElementById("signup-mail");
    let password = document.getElementById("signup-password");
    let allUsersAsArray = window.FireUser;

    if (allUsersAsArray != null) {
        let userAlreadyExists = allUsersAsArray.some(obj => obj.email === email.value);
        if (userAlreadyExists) {
            printErrorMessage("User already exists!");
            emptyValues(email, password);
        } else {
            let newUser = { "name": name.value, "email": email.value, "password": password.value }
            await window.addNewUser(newUser);
        }
    } else {
        let newUser = { "name": name.value, "email": email.value, "password": password.value }
        await window.addNewUser(newUser);
    }
}


/**
 * This function is used to definitely push the users to the array
 * @param users - users array
 * @param name - The name
 * @param email - The email
 * @param password - The password
 * @returns {Promise<void>} - final array
 */
async function pushToUsersArray(users, name, email, password) {
    users.push({
        name: name.value,
        email: email.value,
        password: password.value
    });
    if (users) {
        await saveUsersToBackend();
        printSuccessMessage("You have registered successfully");
        setTimeout(function () { window.location.href = "index.html"; }, 1000)
    }
}


/**
 * This function prints an error message
 * @return {string}
 * @param msg - The message to show
 */

function printErrorMessage(msg) {
    let errorMessage = document.getElementById("success");
    errorMessage.innerHTML = `<p class="red">${msg}</p>`;
    setTimeout(() => { errorMessage.innerHTML = ""; }, 3000);
}


/**
 * This function prints a success message
 * @param success - URL parameter "success"
 */
function printSuccessMessage(success) {
    let successMsg = document.getElementById("success");
    if (success) {
        successMsg.innerHTML = "<p>" + success + "</p>";
        setTimeout(() => { successMsg.innerHTML = ""; }, 3000);
    }
}


/**
 * This function is used to check if you can recover your password
 */

function recoverPassword() {
    let email = document.getElementById("password-reset-email");
    let allUsersAsArray = window.FireUser;
    if (email && allUsersAsArray != null) {
        let userExists = allUsersAsArray.find(u => u.email == email.value);
        if (userExists) {
            startPwChangeAnimation(email);
            setTimeout(function () {
                redirectToPwChange(email.value);
            }, 3000)
        } else {
            printErrorMessage("User not found!");
        }
    } else {
        printErrorMessage("User not found!");
        emptyValues(email, "");
    }
}


/**
 * This function starts the animation that the email was sent. Manipulation of several elements
 * @param email - Get the element of the email input field
 */
function startPwChangeAnimation(email) {
    let formElement = document.getElementById("forgot-pw-form");
    let popup = document.getElementById("emailSuccess");
    let popupcontainer = document.getElementById("successMsgEmail");
    email.readOnly = true;
    formElement.removeAttribute("onsubmit");
    popup.style.display, popupcontainer.style.display = "block";
}


/**
 * This function is redirecting to the page to recreate the password
 */
function redirectToPwChange(email) {
    let formElement = document.getElementById("forgot-pw-form");
    formElement.submit();
}


/**
 * This functions checks if you are allowed to stay on the page (checks also if email exists)
 */
function validatePermission() {
    let allUsersAsArray = getUsersAsArray();
    let email = getUrlParameters("email");
    let userExists = allUsersAsArray.some(obj => obj.email === email);

    if (!email || !userExists) {
        printErrorMessage("Not allowed or your email does not exists!");
        readOnlyPwInputs();
        setTimeout(function () {
            window.location.href = "index.html";
        }, 3000)
    }
}


/**
 * This function is used to check if the user can reset the PW or not
 */
function userCanReset() {
    let email = getUrlParameters("email");
    let checked = checkPasswordIdentity(email);
    if (checked) {
        finalResetPw(email, checked[1]);
    } else {
        printErrorMessage("The passwords do not match, please retry!");
    }
}


/**
 * This function is used to check IF the user was found and the insert PWs are the same
 * @param email - The value of the parameter of the URL (The email address)
 */
function checkPasswordIdentity(email) {
    let firstPwField = document.getElementById("new-password");
    let secondPwField = document.getElementById("confirm-password");
    let allUsersAsArray = getUsersAsArray();
    let emailIdentity = allUsersAsArray.find(u => u.email == email);

    if (emailIdentity && firstPwField.value == secondPwField.value) {
        return [true, firstPwField.value];
    } else {
        return false;
    }
}


/**
 * This function is used to reset definitely your password
 * @param email - The email address for resetting the pw
 * @param newPw - The value of the new PW
 */
async function finalResetPw(email, newPw) {
    getSavedUsersFromBackend();
    let userToReset = users.filter((user) => user.email == email);
    userToReset[0].password = newPw;
    await saveUsersToBackend();
    window.location.href = "index.html?success=Password changed correctly";
}


/**
 * This function is used to set the PW inputs to read only
 */
function readOnlyPwInputs() {
    let pwInput01 = document.getElementById("new-password");
    let pwInput02 = document.getElementById("confirm-password");
    pwInput01.readOnly = true;
    pwInput02.readOnly = true;
}