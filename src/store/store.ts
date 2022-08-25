import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import allReducer from "./reducer";

export default createStore(allReducer, applyMiddleware(thunk))
