const initialData = {


    fixDates : []
  
    
   }


   const fixDateReducer = (state = initialData  ,action) => {
    switch(action.type){
        case 'SET_FIX_DATE': 
        return{    

          fixDates:action.payload
        
        }
          
      default:
        return state
  
  
    }
  }
  
  export default fixDateReducer
   
  