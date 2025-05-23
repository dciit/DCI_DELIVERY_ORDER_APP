const initialData = {


    warningStockState:{
         vdCode : '', 
         partNo : '',
         isRoute:true,
         isShowModal:true,
         isFilter:false
 
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
            isFilter:true,
            isShowModal:false
          } 
        }


        case 'ADJ_WARNING_STOCK_RESET': 
        return{
            ...state,warningStockState :{
            vdcode :"",
            partNo :""  ,
            isRoute:false,
            isShowModal:true,
            isFilter:false
          } 
        }


        
    
   
        
       
              
   
      default:
        return state
  
  
    }
  }


  export default warningStockReducer
   