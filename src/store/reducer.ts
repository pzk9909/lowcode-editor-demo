import currentDragItem from "./reducers/currentDragItem";
import schemaMap from "./reducers/schemaMap";
import editorItem from './reducers/editorItem'
import nameArray from './reducers/nameArray'
import { combineReducers } from "redux";

//所有的reducer保存为一个reducer
export default combineReducers({
    currentDragItem: currentDragItem, //count可以根据需求任意命名，比如：c，haha,shu等等
    editorItem: editorItem,
    schemaMap: schemaMap,
    nameArray: nameArray
})
