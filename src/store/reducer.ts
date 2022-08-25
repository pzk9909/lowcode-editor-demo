import currentDragItem from "./reducers/currentDragItem";
import schemaMap from "./reducers/schemaMap";
import editorItem from './reducers/editorItem'
import nameArray from './reducers/nameArray'
import previewDataMap from './reducers/previewDataMap'
import { combineReducers } from "redux";

//所有的reducer保存为一个reducer
export default combineReducers({
    currentDragItem: currentDragItem,
    editorItem: editorItem,
    schemaMap: schemaMap,
    nameArray: nameArray,
    previewDataMap: previewDataMap
})
