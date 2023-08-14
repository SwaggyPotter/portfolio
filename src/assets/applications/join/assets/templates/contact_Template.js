function detailScreenAdd(j) {
    return `
    <img class="deleteContactLook" id="deleteContact" onclick="deleteContact(${j})" src="assets/img/trash.svg">
    <img onclick="closeDetail()" id="close-detail-arrow" src="assets/img/arrow-back.svg" alt="">
    <div class="name-and-embleme-container">
        <div style="background-color:${getBackgroundColor(document.getElementById(`userBackgroundId${j}`))};" class="detail-embleme">
            <span>${getTheFirstLetterOfName(j)}</span>
        </div>
        <div>
            <p class="detail-name"><span>${sortedContacts[j]['name']}</span><span> ${sortedContacts[j]['second-name']}</span></p>
            <p onclick="openAddTask(${j}); initAddTask()" class="add-task-desgine clickable">Add Task</p>
        </div>
    </div>
    <div id="contact-information-info-container">
        <p><span class="contact-information-designe">Contact Information</span><span class="clickable" onclick="openEdit(${j})"><img class="edit-pic" src="assets/img/edit-contact.svg" alt=""></span></p>
        <p class="detail-email-designe"><span class="email-mobile-designe">Email</span><span class="add-task-desgine">${sortedContacts[j]['email']}</span></p>
        <p class="detail-email-designe"><span class="email-mobile-designe">Mobil</span><span>${sortedContacts[j]['tel']}</span></p>
        <div onclick="openEdit(${j})" id="edit-smartphone-button">
            <img src="assets/img/edit-button.svg" alt="">
        </div>
    </div>`
}


function openEditScreen(o) {
    return `
    <form style="height:100%"; onsubmit="saveTheEdit(${o}); return false" >
        <div id="close-container">
            <p onclick="closeEdit()" id="close-edit-btn">
                <img src="assets/img/close-btn-edit.svg" alt="close-btn">
            </p>
        </div>
        <div class="edit-join-symbol-and-text">
            <img src="assets/img/logo-join-small.svg" alt="join symbol">
            <p>Edit contact</p>
        </div>
        <div class="embleme-and-input">
            <p style="background-color:${getBackgroundColor(document.getElementById(`userBackgroundId${o}`))};" class="embleme-edit ">${getTheFirstLetterOfName(o)}</p>
            
            <div id="edit-input-field" class="input-container"><input id="nameInputEdit${o}" required placeholder="Name" type="text"><img src="assets/img/contact-dummy-name.svg" alt=""></div>
            <div class="input-container"><input id="emailInputEdit${o}" required placeholder="Email" type="email"><img src="assets/img/email-contacts.svg" alt=""></div>
            <div class="input-container"><input id="phoneInputEdit${o}" required placeholder="Phone" type="number"><img src="assets/img/telephone-contacts.svg" alt=""></div>
        <button class="save-edit-btn" id="save-edit-btn">Save</button>
        </div>
    </form>`
}