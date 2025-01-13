const initialData = {


    warningStockState:{
         vdCode : '', 
         partNo : '',
         isRoute:true,
         isShowModal:true
 
     }
    
   }


   const warningStockReducer = (state = initialData  ,action) => {
    switch(action.type){
        case 'ADJ_WARNING_STOCK_TO_DELIVERLY': 
        return{
            ...state,warningStockState :{
            vdcode :action.payload.vdCode,
            partNo :action.payload.partNo ,
            isRoute:true,
            isShowModal:false
          } 
        }


        case 'ADJ_WARNING_STOCK_RESET': 
        return{
            ...state,warningStockState :{
            vdcode :"",
            partNo :""  ,
            isRoute:false,
            isShowModal:true
          } 
        }


        
    
   
        
       
              
   
      default:
        return state
  
  
    }
  }


  export default warningStockReducer
   