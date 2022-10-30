import { createSlice } from '@reduxjs/toolkit'

let products = createSlice({
  name : 'products',
  initialState : [],
  reducers : {
    plusProduct(state, action){
      state.push(action.payload);
    },
    resetProducts(state){
      state.splice(0, state.length);
    }
  }

});

export let {plusProduct, resetProducts} = products.actions;
export default products