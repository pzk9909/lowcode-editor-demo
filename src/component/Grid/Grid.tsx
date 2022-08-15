import store from "../../store/store";
import { pushSchema, moveSchemaByWrapId, setCurrentDragItem, setEditorItemId, spitSchema } from '../../store/action'
import { Input } from 'antd';
import './style.css'
import { debounce } from 'lodash';
import Schema from '../../schemaInterface'
import { useCallback, useRef, useState } from "react";
import clone from '../../clone'
export default function Grid(props: any) {
    const { TextArea } = Input;

    const dragIndex1 = useRef(0)  //记录当前拖拽排序的元素下标
    const dragIndex2 = useRef(0) //记录上次拖拽到达位置的下标
    const [schema, setSchema] = useState<Schema>() //画布数据
    const [clickId, setClickId] = useState<number>() //记录当前点击的组件的ID

    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => e.dataTransfer.dropEffect = 'none';
    const handleDrop = (e: any, id: number) => {
        e.preventDefault();
        console.log(e.target, '当前drop元素');
        console.dir(e.target, '当前drop元素')
        dragIndex2.current = -1 //放置后把上次拖拽到达位置重置

        if (store.getState().currentDragItem.path === '') {
            console.log('push');
            store.dispatch(moveSchemaByWrapId(Number(id), store.getState().currentDragItem))
        }
        else if (store.getState().currentDragItem.path !== '') {
            console.log('move');
            store.dispatch(moveSchemaByWrapId(Number(id), store.getState().currentDragItem))
        }

    } //画布放置事件

    const findItemById: any = (schema: any, id: number) => {
        for (let key in schema) {
            console.log(key, schema[key]);

            if (key === 'id' && schema[key] === id) {
                console.log(schema, '当前拖拽元素');
                store.dispatch(setCurrentDragItem(schema))
                return schema
            }
            if (key === 'body' || key === 'columns') {
                for (let i = 0; i < schema[key].length; i++) {
                    return findItemById(schema[key][i], id)
                }
            }
        }
        console.log('找不到拖拽元素');

    } //根据ID在schema中找到所编辑的组件


    const findDragItem = (id: number) => {
        let schemaa = store.getState().schemaa
        // console.log(schemaa);
        // console.log(id);
        return schemaa.get(id)

    }

    const handleOnDragStart = (e: any, index: number, id: number) => {
        // console.log(e.target);
        // console.log(id);
        store.dispatch(setCurrentDragItem(findDragItem(id)))
        console.log(store.getState().currentDragItem, '当前拖拽的元素');
        e.target.className += ' onDrag'
        dragIndex1.current = index
    } //组件开始拖拽事件

    const handleOnDragEnd = (e: any) => {
        e.target.className = e.target.className.replace(' onDrag', '')
    } //组件结束拖拽事件

    const handleDragEnter = (e: any, id: number) => {

        // console.log(id);
        // const dragItem = store.getState().currentDragItem
        // const enterId = id

        // if (dragItem.id !== enterId) {
        //     store.dispatch(moveSchemaByWrapId(id, dragItem))
        // }


        // if (e.target.className.indexOf('grid-column') !== -1) {
        // } else if (index !== dragIndex2.current && store.getState().currentDragItem.type.indexOf('droped') !== -1) {
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


    store.subscribe(() => {

        let schemaa = store.getState().schemaa
        setSchema(clone(schemaa.get(0)))
        setClickId(store.getState().editorItem.currentEditorItemId)
    }); //store状态更新触发

    const handleComponentClick = (e: any, id: number) => {

        console.log(id);
        setClickId(id)
        store.dispatch(setEditorItemId(id))
        console.log(store.getState().editorItem.currentEditorItemId);

    } //组件点击选中事件

    return (
        <>
            <div className='component-label'>{props.item.title}{props.item.id}</div>
            <div className='grid'>
                {props.item.columns.map((itm: any, index: any) => {
                    return (
                        <div
                            id={itm.id}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDragEnter={() => { handleDragEnter(window.event, itm.id) }}
                            onDrop={(event) => {
                                event.stopPropagation();
                                handleDrop(event, itm.id)
                            }}
                            key={itm.id}
                            style={{ width: `${95 / (props.item.columns.length)}%` }}
                            className='grid-column'>
                            {
                                itm?.body.length === 0 ? (null) : (itm?.body.map((item: any, index: any) => {
                                    switch (item.type) {
                                        case 'input':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                                    onDragEnd={handleOnDragEnd}
                                                    draggable>
                                                    <div className='component-label'>{item.title}{item.id}</div>
                                                    <Input name={item.name} className='middle-component'></Input>
                                                </div>
                                            )
                                        case 'textarea':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                                    onDragEnd={handleOnDragEnd}
                                                    draggable>
                                                    <div className='component-label'>{item.title}</div>
                                                    <TextArea rows={2} name={item.name} className='middle-component' />
                                                </div>
                                            )
                                        case 'select':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                                    onDragEnd={handleOnDragEnd}
                                                    draggable>
                                                    <div className='component-label'>{item.title}</div>
                                                    <select name={item.name} className='middle-component component-select'>
                                                        {item.options?.map((item: any) => {
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
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleOnDragStart(event, index, item.id) }}
                                                    onDragEnd={handleOnDragEnd}
                                                    draggable>
                                                    <Grid onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave} item={item}></Grid>
                                                </div>
                                            )
                                        default: return null
                                    }
                                }))
                            }
                        </div>
                    )
                })}
            </div>
        </>
    )
}