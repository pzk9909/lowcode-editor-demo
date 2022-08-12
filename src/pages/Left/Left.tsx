import './style.css';
import store from '../../store/store';
import { setDragType, setCurrentDragItem } from '../../store/action'
import { useRef } from 'react';
export default function Left() {


    let count = useRef(1)
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

    const onDragStart = (type: string) => {
        let item = {}
        console.log(type);

        switch (type) {
            case 'input':
                item = {
                    type: type,
                    id: count.current++,
                    name: 'text',
                    title: '输入框'
                }; break;
            case 'select':
                item = {
                    type: type,
                    id: count.current++,
                    name: 'select',
                    title: '选择器',
                    options: [{ label: '选项A', value: 'A' }, { label: '选项B', value: 'B' }, { label: '选项C', value: 'C' }]
                }; break;
            case 'textarea':
                item = {
                    type: type,
                    id: count.current++,
                    name: 'textarea',
                    title: '多行文本',
                }; break;
            case 'grid':
                item = {
                    type: type,
                    id: count.current++,
                    name: 'grid',
                    title: '栅格',
                    columns: [{
                        id: count.current++,
                        body: []
                    }, {
                        id: count.current++,
                        body: []
                    }]
                }; break;
        }
        store.dispatch(setCurrentDragItem(item))
        // console.log(store.getState());
    } //组件开始拖拽事件

    const handleDragEnd = () => {
        store.dispatch(setCurrentDragItem({}))
    }
    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => e.dataTransfer.dropEffect = 'none';
    return (
        <div className='left-container' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => {
            e.preventDefault();
            console.log(store.getState().currentDragItem);
        }} >

            <h1 className='left-title'>物料区</h1>
            <div className='component-list'>
                {componentList.map(item => {
                    return (
                        <div
                            key={item.type}
                            draggable
                            onDragEnd={handleDragEnd}
                            onDragStart={() => { onDragStart(item.type) }}
                            className='left-component'
                        >
                            {item.type}
                        </div>
                    )
                })}
            </div>
        </div>

    );
}
