import currentDragItem from "./reducers/currentDragItem";
import schema from "./reducers/schema";
import editorItem from './reducers/editorItem'
import { combineReducers } from "redux";

//所有的reducer保存为一个reducer
export default combineReducers({
    currentDragItem: currentDragItem, //count可以根据需求任意命名，比如：c，haha,shu等等
    schema: schema,
    editorItem: editorItem
})
