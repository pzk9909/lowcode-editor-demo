import { useRef, useState, useCallback } from 'react';
import './style.css';
import store from '../../store/store';
import { setDragType, spitSchema, setEditorItemId, pushSchemaByWrapId } from '../../store/action'
import clone from '../../clone'
import { debounce } from 'lodash';
import { Input } from 'antd';
import Schema from '../../schemaInterface'
import Grid from '../../component/Grid/Grid';
export default function Middle() {
    const { TextArea } = Input;

    const dragIndex1 = useRef(0)  //记录当前拖拽排序的元素下标
    const dragIndex2 = useRef(0) //记录上次拖拽到达位置的下标
    const [schema, setSchema] = useState<Schema>() //画布数据
    const [clickId, setClickId] = useState<number>() //记录当前点击的组件的ID
    const count = useRef(0) //计数生成组件ID

    const handleDrop = (e: any) => {
        e.preventDefault();
        console.log(e.target);
        dragIndex2.current = -1 //放置后把上次拖拽到达位置重置
        if (store.getState().currentDragItem.currentDragType !== '') {
            let item = {}
            switch (store.getState().currentDragItem.currentDragType) {
                case 'input':
                    item = {
                        type: store.getState().currentDragItem.currentDragType,
                        id: count.current++,
                        name: 'text',
                        title: '输入框'
                    }; break;
                case 'select':
                    item = {
                        type: store.getState().currentDragItem.currentDragType,
                        id: count.current++,
                        name: 'select',
                        title: '选择器',
                        options: [{ label: '选项A', value: 'A' }, { label: '选项B', value: 'B' }, { label: '选项C', value: 'C' }]
                    }; break;
                case 'textarea':
                    item = {
                        type: store.getState().currentDragItem.currentDragType,
                        id: count.current++,
                        name: 'textarea',
                        title: '多行文本',
                    }; break;
                case 'grid':
                    item = {
                        type: store.getState().currentDragItem.currentDragType,
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
            store.dispatch(pushSchemaByWrapId(-1, item))
            store.dispatch(setDragType(''))
            // console.log(store.getState());
        }
    } //画布放置事件

    const handleDragEnter = (e: any, index: number) => {
        if (e.target.className.indexOf('grid-column') !== -1) {

        } else if (store.getState().currentDragItem.currentDragType === '' && index !== dragIndex2.current) {
            console.log(dragIndex1.current, '----', index);
            indexChange(e, index)
        }
        // if (store.getState().currentDragItem.currentDragType === '' && index !== dragIndex2.current) {
        //     console.log(dragIndex1.current, '----', index);
        //     indexChange(e, index)
        // }
    } //拖拽过程进入组件触发事件

    const indexChange = useCallback(debounce((e: any, index: number) => {
        //index表示当前拖拽到的位置，dragIndex2表示上次拖拽到的位置
        if (index !== dragIndex2.current && index !== dragIndex1.current) {
            store.dispatch(spitSchema(dragIndex1.current, index))
            if (dragIndex1.current < index) {
                dragIndex1.current = index
            } else {
                dragIndex1.current = index
            }
        }
        dragIndex2.current = index
    }, 500, {
        'leading': true,
        'trailing': false
    }), []); //顺序改变防抖

    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => e.dataTransfer.dropEffect = 'none';

    store.subscribe(() => {
        clone(store.getState().schema)
        setSchema(clone(store.getState().schema))
    }); //store状态更新触发


    const handleOnDragStart = (e: any, index: number) => {
        console.log(e);
        e.target.className += ' onDrag'
        dragIndex1.current = index
    } //组件开始拖拽事件

    const handleOnDragEnd = (e: any) => {
        e.target.className = e.target.className.replace(' onDrag', '')
    } //组件结束拖拽事件

    const handleComponentClick = (id: number) => {
        setClickId(id)
        store.dispatch(setEditorItemId(id))
    } //组件点击选中事件


    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={(e: any) => {
                console.dir(e.target);
                if (e.target.id === 'page') {  //当点击画布其他地方时，取消编辑组件的选中状态
                    setClickId(-9999)
                    store.dispatch(setEditorItemId(-9999))
                }
            }}
            id='page'
            className='middle-container'>
            <h1>画布</h1>
            <div className='middle-component-list'>
                {
                    schema?.body?.length === 0 ? (<div></div>) : (schema?.body?.map((item, index) => {
                        switch (item.type) {
                            case 'input':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index) }}
                                        onDragEnter={() => { handleDragEnter(window.event, index) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}</div>
                                        <Input name={item.name} className='middle-component'></Input>
                                    </div>
                                )
                            case 'textarea':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index) }}
                                        onDragEnter={() => { handleDragEnter(window.event, index) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}</div>
                                        <TextArea name={item.name} className='middle-component' />
                                    </div>
                                )
                            case 'select':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index) }}
                                        onDragEnter={() => { handleDragEnter(window.event, index) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}</div>
                                        <select name={item.name} className='middle-component component-select'>
                                            {item.options?.map(item => {
                                                return (
                                                    <option key={item.value} value={item.value}>{item.label}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                )
                            case 'grid':
                                return (
                                    <div id={`${item.type}-${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index) }}
                                        onDragEnter={() => { handleDragEnter(window.event, index) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <Grid onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave} item={item}></Grid>
                                    </div>
                                )
                            default: return (
                                <div></div>
                            )
                        }
                    }))
                }
            </div>
        </div>
    );
}
