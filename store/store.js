// npm install @reduxjs/toolkit react-redux

// redux
// the main data holder library

// react-redux
// plugin for react-developers to easily work with redux

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./auth";
import cartSlice from "./cart";

let baraWalaReducer = combineReducers({
    authSlice:authSlice.reducer,
    cartSlice:cartSlice.reducer
});

// configureStore() ka function store bnanata h 
export let meraStore = configureStore({
    reducer:baraWalaReducer,    
});