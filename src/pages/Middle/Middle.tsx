import { useRef, useState, useCallback, useEffect } from 'react';
import './style.css';
import store from '../../store/store';
import { spitSchema,  setEditorItemId, pushSchemaByWrapId, setCurrentDragItem, moveSchemaByWrapId } from '../../store/action'
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
    const [dragItem, setDragItem] = useState<Schema>()
    const handleDrop = (e: any) => {
        e.preventDefault();
        console.log(e.target, 'middle-drop');
        dragIndex2.current = -1 //放置后把上次拖拽到达位置重置
        // console.log(store.getState().currentDragItem); 
        // if (JSON.stringify(store.getState().currentDragItem) !== '{}' || store.getState().currentDragItem.type.indexOf('droped') !== -1) {
        if (store.getState().currentDragItem.type.indexOf('droped') === -1) {
            console.log('push');
            store.dispatch(pushSchemaByWrapId(0, store.getState().currentDragItem))
        } else if (store.getState().currentDragItem.type.indexOf('droped') !== -1 && e.target.id === 'page') {
            console.log('move');
            store.dispatch(moveSchemaByWrapId(0, store.getState().currentDragItem))
        }
    } //画布放置事件


    useEffect(() => {
        setSchema(clone(store.getState().schema))
    }, [])

    const handleDragEnter = (e: any, id: number) => {


        // console.log(id);
        // const dragItem = store.getState().currentDragItem
        // const enterId = id
        // if (dragItem.type.indexOf('droped') !== -1) {
        //     if (dragItem.id !== enterId) {
        //         store.dispatch(spitSchemaById(dragItem, enterId))
        //     }
        // }




        // if (e.target.className.indexOf('grid-column') !== -1 ) {
        // } else if (index !== dragIndex2.current && store.getState().currentDragItem.type.indexOf('droped') !== -1 ) {
        //     console.log(dragIndex1.current, '----', index);
        //     indexChange(e, index)
        // }

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
        setSchema(clone(store.getState().schema))
        setClickId(store.getState().editorItem.currentEditorItemId)
    }); //store状态更新触发


    const findItemById = (schema: any, id: number) => {
        for (let key in schema) {
            if (key === 'id' && schema[key] === id) {
                console.log(schema, '找到了');
                store.dispatch(setCurrentDragItem(schema))
                return schema
            }
            if (key === 'body') {
                for (let i = 0; i < schema[key].length; i++) {
                    findItemById(schema[key][i], id)
                }
            }
        }
    } //根据ID在schema中找到所编辑的组件


    const handleOnDragStart = (e: any, index: number, id: number) => {
        console.log(e.target);
        console.log(id);
        if (e.target.className.indexOf('middle-component-container') !== -1) {
            console.log(e.target, '----');
            findItemById(schema, id);
            console.log(store.getState().currentDragItem);
            e.target.className += ' onDrag'
            dragIndex1.current = index
        }
    } //组件开始拖拽事件

    const handleOnDragEnd = (e: any) => {
        e.target.className = e.target.className.replace(' onDrag', '')
    } //组件结束拖拽事件

    const handleComponentClick = (id: number) => {
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
                            case 'input_droped':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index, item.id) }}
                                        onDragEnter={() => { handleDragEnter(window.event, item.id) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}{item.id}</div>
                                        <Input name={item.name} className='middle-component'></Input>
                                    </div>
                                )
                            case 'textarea_droped':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index, item.id) }}
                                        onDragEnter={() => { handleDragEnter(window.event, item.id) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}</div>
                                        <TextArea rows={2} name={item.name} className='middle-component' />
                                    </div>
                                )
                            case 'select_droped':
                                return (
                                    <div
                                        id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index, item.id) }}
                                        onDragEnter={() => { handleDragEnter(window.event, item.id) }}
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
                            case 'grid_droped':
                                return (
                                    <div id={`${item.type}-${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={() => { handleOnDragStart(window.event, index, item.id) }}
                                        onDragEnter={() => { handleDragEnter(window.event, item.id) }}
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
