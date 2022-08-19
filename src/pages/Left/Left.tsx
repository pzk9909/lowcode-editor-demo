import './style.css';
import store from '../../store/store';
import { deleteSchema, setCurrentDragItem, setEditorItemId } from '../../store/action'
import { useRef, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';

export default function Left() {

    const [allowDrag, setAllowDrag] = useState(true)
    const componentList = [{
        type: 'input',
    },
    {
        type: 'textarea',
    },
    {
        type: 'select',
    },
    {
        type: 'grid',
    }] //组件类型列表

    store.subscribe(() => {
        setAllowDrag(!store.getState().editorItem.isNew)
    }); //store状态更新触发

    const onDragStart = (e: any, type: string) => {
        if (!allowDrag) {
            return
        } else {
            let item = {}
            console.log(type);
            let id = Date.now()
            switch (type) {
                case 'input':
                    item = {
                        type: type,
                        id: id++,
                        name: 'text',
                        title: '输入框',
                        parentId: -1
                    }; break;
                case 'select':
                    item = {
                        type: type,
                        id: id++,
                        name: 'select',
                        title: '选择器',
                        options: [{ label: '选项A', value: 'A' }, { label: '选项B', value: 'B' }, { label: '选项C', value: 'C' }],
                        parentId: -1
                    }; break;
                case 'textarea':
                    item = {
                        type: type,
                        id: id++,
                        name: 'textarea',
                        title: '多行文本',
                        parentId: -1
                    }; break;
                case 'grid':
                    item = {
                        type: type,
                        id: id++,
                        title: '栅格',
                        columns: [{
                            id: id++,
                            body: []
                        }, {
                            id: id++,
                            body: []
                        }],
                        parentId: -1
                    }; break;
            }

            store.dispatch(setCurrentDragItem(item))
        }
        // console.log(store.getState());
    } //组件开始拖拽事件

    const handleDragEnd = (e: any) => {
        store.dispatch(setCurrentDragItem({}))
    }//组件结束拖拽事件
    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => { }
    return (
        <div>
            <div className='left-container' onDragOver={handleDragOver} onDragLeave={handleDragLeave}  >
                <h1 className='left-title'>物料区</h1>
                <div className='component-list'>
                    {componentList.map(item => {
                        return (
                            <div
                                key={item.type}
                                draggable
                                onDragEnd={handleDragEnd}
                                onDragStart={(event: any) => { onDragStart(event, item.type) }}
                                className='left-component'
                            >
                                {item.type}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    );
}
