import './style.css';
import store from '../../store/store';
import { deleteSchema, setCurrentDragItem } from '../../store/action'
import { useRef } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, } from 'antd';

export default function Left() {
    const { confirm } = Modal;

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
                    title: '输入框',
                    path: ''
                }; break;
            case 'select':
                item = {
                    type: type,
                    id: count.current++,
                    name: 'select',
                    title: '选择器',
                    options: [{ label: '选项A', value: 'A' }, { label: '选项B', value: 'B' }, { label: '选项C', value: 'C' }],
                    path: ''
                }; break;
            case 'textarea':
                item = {
                    type: type,
                    id: count.current++,
                    name: 'textarea',
                    title: '多行文本',
                    path: ''
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
                    }],
                    path: ''
                }; break;
        }
        store.dispatch(setCurrentDragItem(item))
        // console.log(store.getState());
    } //组件开始拖拽事件

    const handleDragEnd = () => {
        store.dispatch(setCurrentDragItem({}))
    }//组件结束拖拽事件
    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => e.dataTransfer.dropEffect = 'none';
    const handleDelete = (e: any) => {
        console.log(store.getState().currentDragItem);
        if (store.getState().currentDragItem.path !== '') {
            confirm({
                title: '是否确认删除该组件?',
                icon: <ExclamationCircleOutlined />,
                content: '本操作将同时删除该组件下的所有子组件',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk() {
                    console.log('OK');
                    console.log(store.getState().currentDragItem.id);
                    const deleteId = store.getState().currentDragItem.id
                    console.log(deleteId, 'deleteId');

                    store.dispatch(deleteSchema(deleteId))
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }

    }//删除组件

    return (
        <div className='left-container' onDragOver={handleDragOver} onDragLeave={handleDragLeave}  >
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
                <div onDrop={handleDelete} className='delete-container'>回收站</div>
            </div>
        </div>
    );
}
