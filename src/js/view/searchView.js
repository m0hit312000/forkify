import { elements } from './base';

export const getInput = () => elements.searchInput.value; 

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}


// 'Pasta with tomato and spinach'
// acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
// acc: 5 / acc + cur.length = 8 / newTitle = ['Pasta','with']
// acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta','with','tomato']
// acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta','with','tomato']
// acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta','with','tomato']

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit)
    {
      title.split(' ').reduce((acc, cur) => {
         if(acc + cur.length <= limit)
         {
             newTitle.push(cur);
         }
         return acc + cur.length;
      },0);
      return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe =  recipe => {
   const markup = `
    <li>
     <a class="results__link" href="#${recipe.id}">
         <figure class="results__fig">
             <img src="${recipe.image}" alt="${recipe.title}">
         </figure>
         <div class="results__data">
             <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
         </div>
      </a>
    </li>
   `;
   elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

export const renderResults = ( recipes, page = 1 , resPerPage = 10 ) => {
    
    recipes.forEach(renderRecipe);

}