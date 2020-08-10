import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        const key = "12401eaa67d847e987ca2759ee59f892";
        const proxy = "https://cors-anywhere.herokuapp.com/"; 
        try{
             const info = await axios(`${proxy}https://api.spoonacular.com/recipes/${this.id}/information?includeNutrition=false&apiKey=${key}`);
             this.title = info.data.title;
             this.author = info.data.sourceName;
             this.img = info.data.image;    
             this.url = info.data.sourceUrl;
             console.log(info);
             this.ingredients = info.data.extendedIngredients;
            //  console.log(this.ingredients);
        }
        catch(error){
         alert(error);
        }
    }

    calcTime(){
       // Assuming we need 15 min for each 3 ingredients 
       const numIng = this.ingredients.length;
       const period = Math.ceil(numIng / 3);
       this.time = period * 15;
    }
    calcServings(){
        this.serving = 4;
    }
    parseIngredients(){

        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','grams','gram','teaspoons','teaspoon','cups','pounds','servings' ];
        const unitsShort = ['tbsp','tbsp','oz','oz','g','g','tsp','tsp','cup','pound','serving'];

        const newIngredients = this.ingredients.map(el => {
          // 1. Uniform Units
            //  let ingredient = el.toLowerCase();
             let inge = el.name.toLowerCase();
             let units = el.unit;
             let amt = el.amount;
             if(amt === ''|| amt < 1)
             amt = 1; 
           
              unitsLong.forEach((unit,i) => {
                  units = units.replace(unit,unitsShort[i]);
              });
            //   unitsLong.forEach((unit,i) => {
            //     inge = inge.replace(unit,unitsShort[i]);
            //   });
           // 2. Replace parenthesis
              inge = inge.replace(/ *\([^)]*\) */g, ' ');

           // 3. Parse ingredient into count, unit and ingredients
              
              let objIng = {
                  count: amt,
                  unit: units,
                  ingredients: inge,
              }

                         
              return objIng;
        }); 
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.serving - 1 : this.serving + 1;
        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.serving);
        })  

        this.serving = newServings;
    } 
}