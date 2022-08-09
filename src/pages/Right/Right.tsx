import { useState } from 'react';
import './style.css';
import store from '../../store/store';
import Editor from '../../component/Editor/Editor'
import Schema from '../../schemaInterface'
export default function Right() {

    const [editorItem, setEditorItem] = useState<Schema>() //当前编辑的组件
    const [isEditor, setIsEditor] = useState<boolean>(false)  //是否选中编辑组件

    const findItemById = (schema: any, id: number) => {
        for (let key in schema) {
            if (key === 'id' && schema[key] === id) {
                // console.log(schema, '找到了');
                setEditorItem(schema)
                setIsEditor(true)
                return schema
            }
            if (key === 'body') {
                for (let i = 0; i < schema[key].length; i++) {
                    findItemById(schema[key][i], id)
                }
            }
        }
    } //根据ID在schema中找到所编辑的组件

    store.subscribe(() => {
        const schema = store.getState().schema
        if (store.getState().editorItem.currentEditorItemId === -9999) {
            setIsEditor(false)
        } else {
            findItemById(schema, store.getState().editorItem.currentEditorItemId)
        }
    }) //store状态更新触发

    return (
        <div className='right-container'>
            <h1>编辑区</h1>
            {isEditor ? (
                <div>
                    <div>类型:{editorItem?.type}</div>
                    <div>id:{editorItem?.id}</div>
                    <Editor schema={editorItem}></Editor>
                </div >
            ) : (
                <div></div >)}

        </div>
    );
}
