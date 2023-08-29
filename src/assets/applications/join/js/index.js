// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, getDoc, updateDoc, onSnapshot, addDoc, doc, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-cayHWxpqonHTNIFQGxiLF5018n_8Gok",
    authDomain: "join-98c25.firebaseapp.com",
    projectId: "join-98c25",
    storageBucket: "join-98c25.appspot.com",
    messagingSenderId: "956633801475",
    appId: "1:956633801475:web:5809838d05a46a6de3bf36",
    measurementId: "G-9TMJ40ZZY8"
};

let contactData;
let taskTodoData;
let taskAwaitData;
let taskInProgressData;
let taskDoneData;
let categories;
let categoryColors;
let categoriesBackground;
let registeredUsers;
let contactsArray = []

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

async function getData() {
    const databaseCollection = collection(db, 'database');
    const dataSnapshot = await getDocs(databaseCollection);
    const documentData = dataSnapshot.docs.map(doc => doc.data());

    // Hier fügst du den Code für die Echtzeitaktualisierung hinzu
    onSnapshot(databaseCollection, (querySnapshot) => {
        const updatedDocumentData = querySnapshot.docs.map(doc => doc.data());
        // Hier kannst du die aktualisierten Daten im Browser rendern oder verwenden
        const data = {
            "categories": JSON.stringify(updatedDocumentData[0]['categories']),
            "categoriesBackground": JSON.stringify(updatedDocumentData[1]['categoriesBackground']),
            "categoryColors": JSON.stringify(updatedDocumentData[2]['categoryColors']),
            "contacts": updatedDocumentData[3]['contacts'],
            "registeredUsers": (updatedDocumentData[4]['registeredUsers']),
            "tasksAwaitFeedback": (updatedDocumentData[5]['tasksAwaitFeedback']),
            "tasksDone": (updatedDocumentData[6]['tasksDone']),
            "tasksInProgress": (updatedDocumentData[7]['tasksInProgress']),
            "tasksToDo": (updatedDocumentData[8]['tasksToDo'])
        };

        const dataAsJSON = JSON.stringify(data, null, 2); // Konvertiere in JSON
        contactData = updatedDocumentData[3]['contacts'];
        taskTodoData = updatedDocumentData[8]['tasksToDo'];
        taskAwaitData = updatedDocumentData[5]['tasksAwaitFeedback'];
        taskInProgressData = updatedDocumentData[7]['tasksInProgress'];
        taskDoneData = updatedDocumentData[6]['tasksDone'];
        categories = JSON.stringify(updatedDocumentData[0]['categories']);
        categoryColors = JSON.stringify(updatedDocumentData[2]['categoryColors']);
        categoriesBackground = JSON.stringify(updatedDocumentData[1]['categoriesBackground']);
        registeredUsers = JSON.stringify(updatedDocumentData[4]['registeredUsers'])
        handleUser(registeredUsers)
        handleCategories(categories);
        handleCategoryColors(categoryColors);
        handleCategoryBackground(categoriesBackground);
        handleContactData(contactData);
        handleTaskTodoData(taskTodoData);
        handleTaskAwaitData(taskAwaitData);
        handleTaskInProgData(taskInProgressData);
        handleTaskDoneData(taskDoneData);
    });
}


getData()


function handleUser(registeredUsers) {
    window.FireUser = registeredUsers;
    function parseJsonArray(jsonArrayString) {
        const jsonArray = JSON.parse(jsonArrayString);
        window.FireUser = jsonArray.map(item => JSON.parse(item));
    }
    const jsonArrayString = window.FireUser;
    const parsedArray = parseJsonArray(jsonArrayString);
}


function handleCategories(categories) {
    window.FireCategory = categories;
}


function handleCategoryColors(categoryColors) {
    window.FireCategoryColors = categoryColors;
}


function handleCategoryBackground(categoriesBackground) {
    window.FireCategoryBackground = categoriesBackground;
}


function handleTaskDoneData(taskDoneData) {
    window.FirebaseDone = taskDoneData;
}


function handleTaskInProgData(taskInProgressData) {
    window.FirebaseProgData = taskInProgressData;
}

function handleTaskAwaitData(taskAwaitData) {
    window.DirebaseAwaitData = taskAwaitData;
}


function handleTaskTodoData(taskTodoData) {
    window.FirebaseTodo = taskTodoData;
}


function handleContactData(data) {
    window.FirebaseContacts = data;
}


/**
 * function to add the new information about the contact to the uploadet array
 * 
 * @param {string} newStringValue 
 */
window.addStringToArray = async function addStringToArray(newStringValue) {
    const databaseDocRef = doc(db, 'database', 'contacts'); // Referenz auf das 'contacts'-Dokument
    const contactsDocSnapshot = await getDoc(databaseDocRef);
    if (contactsDocSnapshot.exists()) {
        const updatedContactsArray = arrayUnion(`${JSON.stringify(newStringValue)}`);
        await updateDoc(contactsDocSnapshot.ref, {
            contacts: updatedContactsArray
        });
    }
}


/**
 * a function to update the contact. the contact will be find over the email
 * 
 * @param {string} email the email from the contact to find the person
 * @param {*object} updatedData the object with the updatet data of the person
 */
window.updateContactByEmail = async function updateContactByEmail(email, updatedData) {
    const databaseDocRef = doc(db, 'database', 'contacts');
    const contactsDocSnapshot = await getDoc(databaseDocRef);
    if (contactsDocSnapshot.exists()) {
        const currentContactsArray = contactsDocSnapshot.data().contacts || [];
        // Finde den Index des zu aktualisierenden Kontakts im Array anhand der E-Mail-Adresse
        const contactIndex = currentContactsArray.findIndex(contact => {
            const parsedContact = JSON.parse(contact);
            return parsedContact.email === email;
        });
        if (contactIndex !== -1) {
            // Konvertiere JSON-Zeichenkette in JavaScript-Objekt
            const parsedContact = JSON.parse(currentContactsArray[contactIndex]);

            // Aktualisiere die Daten des Kontakts im Objekt
            const updatedContact = { ...parsedContact, ...updatedData };

            // Konvertiere das aktualisierte Objekt zurück in JSON-Zeichenkette
            const updatedContactString = JSON.stringify(updatedContact);

            // Aktualisiere das Dokument mit dem aktualisierten Kontakt
            currentContactsArray[contactIndex] = updatedContactString;
            await updateDoc(contactsDocSnapshot.ref, {
                contacts: currentContactsArray
            });
        }
    }
}


/**
 * A function to delete a contact based on the email in the backend (firebase)
 * 
 * @param {string} emailToDelete 
 */
window.deleteContactByEmail = async function deleteContactByEmail(emailToDelete) {
    const databaseDocRef = doc(db, 'database', 'contacts'); // Referenz auf das 'contacts'-Dokument
    const contactsDocSnapshot = await getDoc(databaseDocRef);
    if (contactsDocSnapshot.exists()) {
        const currentContactsArray = contactsDocSnapshot.data().contacts || []; // Aktuelles Array oder leeres Array, falls es noch nicht existiert
        // Finde den Index des zu löschenden Kontakts im Array anhand der E-Mail-Adresse
        const contactIndex = currentContactsArray.findIndex(contact => {
            const parsedContact = JSON.parse(contact);
            return parsedContact.email === emailToDelete;
        });
        if (contactIndex !== -1) {
            // Entferne das Element aus dem Array
            currentContactsArray.splice(contactIndex, 1);
            // Aktualisiere das Dokument mit dem aktualisierten Array
            await updateDoc(contactsDocSnapshot.ref, {
                contacts: currentContactsArray
            });
        }
    }
}


/**
 * function to remve a task from the board an deleating it in the backend (firebase)
 * 
 * @param {number} taskNumber number from the task
 * @param {string} taskTypeString the name of the tasktype in string form
 * @param {objekt} taskType the task itfelf
 */
window.removeTask = function removeTask(taskNumber, taskTypeString, taskType) {
    const databaseDocRef = doc(db, 'database', taskTypeString);
    const rawData = wichTypeOfTasks(taskTypeString);
    const jsonArray = JSON.parse(rawData);

    // JSON-Array mit den Daten extrahieren und aktualisierte Daten vorbereiten
    const updatedTasks = jsonArray.filter((task, index) => index !== taskNumber);

    // Das aktualisierte JSON-Array zurück in eine Zeichenkette umwandeln
    const updatedData = JSON.stringify(updatedTasks);

    // Feldname dynamisch zusammenstellen
    const updateField = `${taskTypeString}`;

    // Ein Objekt erstellen, um das Feld dynamisch zuzuweisen
    const updateObj = {};
    updateObj[updateField] = updatedData;

    // Das aktualisierte JSON-Array in die Firestore-Datenbank zurückschreiben
    updateDoc(databaseDocRef, updateObj)
}


function wichTypeOfTasks(taskTypeString) {
    if (taskTypeString == 'tasksToDo') {
        return window.FirebaseTodo
    }
    else if (taskTypeString == 'tasksInProgress') {
        return window.FirebaseProgData
    }
    else if (taskTypeString == 'tasksAwaitFeedback') {
        return window.DirebaseAwaitData
    }
    else if (taskTypeString == 'tasksDone') {
        return window.FirebaseDone
    }
}


window.updateTask = function updateTask(taskNumber, updatedTaskData, taskTypeString) {
    const databaseDocRef = doc(db, 'database', taskTypeString);
    const rawData = wichTypeOfTasks(taskTypeString);
    const jsonArray = JSON.parse(rawData);
    // Überprüfen, ob der Task-Index im Bereich des Arrays liegt
    if (taskNumber >= 0 && taskNumber < jsonArray.length) {
        // Den vorhandenen Task holen
        const existingTask = jsonArray;

        // Aktualisierte Daten in den vorhandenen Task kopieren
        Object.assign(existingTask, updatedTaskData);

        // Das aktualisierte JSON-Array zurück in eine Zeichenkette umwandeln
        const updatedData = JSON.stringify(jsonArray);

        // Feldname dynamisch zusammenstellen
        const updateField = `${taskTypeString}`;

        // Ein Objekt erstellen, um das Feld dynamisch zuzuweisen
        const updateObj = {};
        updateObj[updateField] = updatedData;

        // Das aktualisierte JSON-Array in die Firestore-Datenbank zurückschreiben
        updateDoc(databaseDocRef, updateObj)
    }
}


window.addNewTask = function addNewTask(newTaskData, taskTypeString) {
    const databaseDocRef = doc(db, 'database', taskTypeString);
    const rawData = wichTypeOfTasks(taskTypeString);
    const jsonArray = JSON.parse(rawData);
    // Neuen Task hinzufügen
    jsonArray.push(newTaskData);
    // Das aktualisierte JSON-Array zurück in eine Zeichenkette umwandeln
    const updatedData = JSON.stringify(jsonArray);
    // Feldname dynamisch zusammenstellen
    const updateField = `${taskTypeString}`;
    // Ein Objekt erstellen, um das Feld dynamisch zuzuweisen
    const updateObj = {};
    updateObj[updateField] = updatedData;
    // Das aktualisierte JSON-Array in die Firestore-Datenbank zurückschreiben
    updateDoc(databaseDocRef, updateObj)
}


window.addNewUser = async function addStringToArray(newStringValue) {
    const databaseDocRef = doc(db, 'database', 'registeredUsers'); // Referenz auf das 'contacts'-Dokument
    const usersDocSnapshot = await getDoc(databaseDocRef);
    if (usersDocSnapshot.exists()) {
        const updatedUsersArray = arrayUnion(`${JSON.stringify(newStringValue)}`);
        await updateDoc(usersDocSnapshot.ref, {
            registeredUsers: updatedUsersArray
        });

    }
}