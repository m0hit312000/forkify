import Search from './model/Search';
import * as searchView from './view/searchView';
import { elements, renderLoader, clearLoader } from './view/base';
import Recipe from './model/Recipe'; 
import * as recipeView from './view/recipeView';
import List from './model/List';
import * as listView from './view/listView';


// Global state of the app
//  -Search object 
//  -Current recipe object
//  -Shopping list object 
//  -liked recipes
 
const state = {}
window.state = state;

// ******************************************** Search Controller ***************************************************

const controlSearch = async () => {
       // 1. Get query from view 
      const query  = searchView.getInput();
      if(query){
      // 2. New search object and add it to state
      state.search = new Search(query);
      // 3. Prepare UI for results
      searchView.clearInput();
      searchView.clearResult(); 
      renderLoader(elements.searchRes);
      try{
         // 4. Search for recipe
         await state.search.getResults();
         // 5. Render results on UI
         clearLoader(); 
         searchView.renderResults(state.search.result);
      }
      catch(err)
      {
         alert(err);
         clearLoader();
      }
   }
}

elements.searchForm.addEventListener('submit',e => {
  e.preventDefault();
  controlSearch();
});

// ******************************************** Recipe Controller ***************************************************

const controlRecipe = async () => {
   // Get id from the URL
   const id = window.location.hash.replace('#','');
   if(id){
      // Prepare UI for changes
         recipeView.clearRecipe();
         renderLoader(elements.recipe);
      // Highlight selected search item  
         if(state.search) searchView.highlightSelected(id);
      // Create new Recipe Object
         state.recipe = new Recipe(id);
      try
      {
         // Get Recipe data and parse Ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
         // Calcuate Servings and Time
            state.recipe.calcTime();
            state.recipe.calcServings();
         // Render Recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
      }   
      catch(error)
      {
         console.log(error);
      }
   }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));   



// ************************************************ List Controller ************************************************

 const controlList = () => {
    // Create a new list if there is none yet
    if(!state.list) state.list = new List();
    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredients);
        listView.renderItem(item);
    });
 }

// Handle delete and update list item events

  elements.shopping.addEventListener('click', e => {
      const id = e.target.closest('.shopping__item').dataset.itemid;
      // Handle the delete button
      if(e.target.matches('.shopping__delete, .shopping__delete *')){
         // Delete from state
            state.list.deleteItem(id);
         // Delete from UI
            listView.deleteItem(id);
      }
      else if(e.target.matches('.shopping__count-value'))
      {
         const val = parseFloat(e.target.value, 10);
         state.list.updateCount(id, val);
      }
  });



//****************************************  Handling recipe button clicks *********************************************

elements.recipe.addEventListener('click', e => {
   if(e.target.matches('.btn-decrease, .btn-decrease *')){
      // Decrease button is clicked
      if(state.recipe.serving > 1){
         state.recipe.updateServings('dec');
         recipeView.updateServingIng(state.recipe);
      }
   }
   else if(e.target.matches('.btn-increase, .btn-increase *')){
      // Increase button is clicked
      state.recipe.updateServings('inc');
      recipeView.updateServingIng(state.recipe);
   }
   else if(e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
      controlList();
   }
});