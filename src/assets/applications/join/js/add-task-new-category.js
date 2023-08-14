let newCategoryColor = '';
let newCategory = '';
let newCategoriesBackground = '';

/**
 * this function opens the popup to enter a new category
 * 
 */
function openNewCategory() {
    document.getElementById('new-category').innerHTML = htmlTemplateNewCategoryEnter();
    addNewCategory();
}


/**
 * this function opens a popup to enter a new category
 * 
 */
function addNewCategory() {
    content = document.getElementById('category-colors');
    content.innerHTML = '';
    for (let i = 0; i < ellipses.length; i++) {
        let ellipse = ellipses[i];
        content.innerHTML += htmlTemplateNewCategoryColor(ellipse, i);
    }
}


/**
 * this function closes the new category popup
 * 
 */
function closeNewCategory() {
    document.getElementById('new-category').innerHTML = htmlTemplateNewCategory();
}


/**
 * this function checks if name and color are given for the new category
 * 
 */
function getNewCategory() {
    newCategory = document.getElementById('register-category').value;
    if (newCategoryColor == '') {
        document.getElementById('error-msg').classList.remove('d-none');
        document.getElementById('color-msg').classList.remove('d-none');
    } else {
        if (newCategory == '') {
            document.getElementById('error-msg').classList.remove('d-none');
            document.getElementById('new-category-msg').classList.remove('d-none');
        }
        else {
            saveNewCategory(newCategory, newCategoryColor);
        }
    }
}


/**
 * this function pushes the new category in the different arrays
 * 
 * @param {string} newCategory 
 * @param {string*} newCategoryColor 
 */
async function saveNewCategory(newCategory, newCategoryColor) {
    categories.push(newCategory);
    categoryColors.push(newCategoryColor);
    categoriesBackground.push(newCategoriesBackground);
    newCategoryColor = '';
    newCategory = '';
    newCategoriesBackground = '';
    closeNewCategory();
    renderAddedCategory();
    await saveCategoriesToBackend();
}


/**
 * this function saves the categories in the backend
 * 
 */
async function saveCategoriesToBackend(){
    await backend.setItem('categoriesBackground', JSON.stringify(categoriesBackground));
    await backend.setItem('categoryColors', JSON.stringify(categoryColors));
    await backend.setItem('categories', JSON.stringify(categories));
}


/**
 * this function renders the new category to the category list
 * 
 */
function renderAddedCategory(){
    let i = categories.length -1;
    categoryToRender = categories[i];
    ellipseToRender = categoryColors[i];
    document.getElementById('category-row').innerHTML +=
            htmlTemplateCategoryChecked(categoryToRender, ellipseToRender);
};
    

/**
 * this function stes the new category color
 * 
 * @param {number} i 
 */
function setCategoryColor(i) {
    addNewCategory();
    newCategoryColor = ellipses[i];
    newCategoriesBackground = ellipsesColors[i];
    document.getElementById(`color${i}`).style = "scale:1.5";
}