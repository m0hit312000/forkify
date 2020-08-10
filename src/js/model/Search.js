import axios from 'axios';

export default class Search
{
    constructor(query)
    {
        this.query = query;
    }
    async getResults()
    {
        const key = "12401eaa67d847e987ca2759ee59f892";
        const proxy = "https://cors-anywhere.herokuapp.com/"; 
  
     try{
       const res = await axios(`${proxy}https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&apiKey=${key}`);
       this.result = res.data.results;
    //    console.log(this.result);
     }
     catch(error){
       alert(error); 
     }
    }
}
