import { useState, useEffect } from 'react';
import './style.css';
import store from '../../store/store';
import { setEditorItemId, setCurrentDragItem, moveSchema } from '../../store/action'
import clone from '../../clone'

import { Input } from 'antd';
import Schema from '../../schemaInterface'
import Grid from '../../component/Grid/Grid';
export default function Middle() {
    const { TextArea } = Input;

    const [schema, setSchema] = useState<Schema>() //画布数据
    const [clickId, setClickId] = useState<number>() //记录当前点击的组件的ID

    const handleDrop = (e: any, id: number) => {
        e.preventDefault();
        console.log(e.target, '当前drop元素');
        console.dir(e.target, '当前drop元素')
        console.log('move');
        store.dispatch(moveSchema(Number(id), store.getState().currentDragItem))
    } //画布放置事件


    useEffect(() => {
        let schema = store.getState().schemaMap.get(0)
        setSchema(clone(schema))
    }, [])

    const handleDragEnter = (e: any, id: number) => {
        console.log(id);
        // if (store.getState().currentDragItem.id !== id) {
        //     const item = document.getElementById(`${id}`)
        //     console.log(item);
        //     item?.classList.add('dragEnter')
        // }
    } //拖拽过程进入组件触发事件
    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => {
        // console.log(e);
        // document.getElementById(e.target.id)?.classList.remove('dragEnter')
        e.dataTransfer.dropEffect = 'none';
    }

    store.subscribe(() => {
        let schema = store.getState().schemaMap.get(0)
        setSchema(clone(schema))
        setClickId(store.getState().editorItem.currentEditorItemId)
    }); //store状态更新触发

    const findDragItem = (id: number) => {
        let schemaMap = store.getState().schemaMap
        // console.log(schemaa);
        // console.log(id);
        return schemaMap.get(id)
    }//根据ID在schema中找到所编辑的组件

    const handleOnDragStart = (e: any, index: number, id: number) => {
        // console.log(e.target);
        // console.log(id);
        store.dispatch(setCurrentDragItem(findDragItem(id)))
        console.log(store.getState().currentDragItem, '当前拖拽的元素');
        e.target.className += ' onDrag'

    } //组件开始拖拽事件

    const handleOnDragEnd = (e: any) => {
        e.target.className = e.target.className.replace(' onDrag', '')
    } //组件结束拖拽事件

    const handleComponentClick = (id: number) => {
        store.dispatch(setEditorItemId(id))
    } //组件点击选中事件


    return (
        <div
            id='0'
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(event) => { event.stopPropagation(); handleDrop(event, 0) }}
            onClick={(e: any) => {
                console.dir(e.target);
                if (e.target.id === '0') {  //当点击画布其他地方时，取消编辑组件的选中状态
                    setClickId(-9999)
                    store.dispatch(setEditorItemId(-9999))
                }
            }}
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
                                        onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                        onDragEnter={(event: any) => { handleDragEnter(event, item.id) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}{item.id}</div>
                                        <Input name={item.name} className='middle-component'></Input>
                                    </div>
                                )
                            case 'textarea':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                        onDragEnter={(event: any) => { event.stopPropagation() }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}{item.id}</div>
                                        <TextArea rows={2} name={item.name} className='middle-component' />
                                    </div>
                                )
                            case 'select':
                                return (
                                    <div
                                        id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                        onDragEnter={(event: any) => { event.stopPropagation(); }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <div className='component-label'>{item.title}{item.id}</div>
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
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                        onDragEnter={() => { handleDragEnter(window.event, item.id) }}
                                        onDragEnd={handleOnDragEnd}
                                        draggable>
                                        <Grid item={item}></Grid>
                                    </div>
                                )
                            default: return (
                                <div key={item.id}></div>
                            )
                        }
                    }))
                }
            </div>
        </div>
    );
}
