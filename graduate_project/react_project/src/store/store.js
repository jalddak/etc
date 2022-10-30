import { configureStore, createSlice } from '@reduxjs/toolkit'
import products from './products.js'

let access = createSlice({
  name : 'access',
  initialState : {
    isAuth: false,
    email: '',
    username: '',
    _id: '',
  },
  reducers : {
    logIn(state, action){
      state.isAuth = action.payload.isAuth;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state._id = action.payload._id;
    },
    logOut(state){
      state.isAuth = '';
      state.email = '';
      state.username = '';
      state._id = '';
    }
    // ... 
  }

});

export let {logIn, logOut} = access.actions;

export default configureStore({
  reducer: { 
    access : access.reducer,
    products : products.reducer,
  }
}) 