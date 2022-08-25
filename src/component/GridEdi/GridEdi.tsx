import store from "../../store/store";
import { moveSchema, setCurrentDragItem, setEditorItemId, deleteSchema, initSchemaMap, initNameArray } from '../../store/action'
import { Modal, message } from 'antd';
import './style.css'
import { useEffect, useState } from "react";
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import InputEdi from "../InputEdi/InputEdi";
import TextAreaEdi from '../../component/TextAreaEdi/TextAreaEdi';
import SelectEdi from '../../component/SelectEdi/SelectEdi';
import NumberInputEdi from "../NumberInputEdi/NumberInputEdi";
import clone from '../../clone'

export default function Grid(props: any) {
    const { confirm } = Modal;
    const [clickId, setClickId] = useState<number>() //记录当前点击的组件的ID
    const [allowDrag, setAllowDrag] = useState(true)

    store.subscribe(() => {
        setClickId(store.getState().editorItem.currentEditorItemId)
        setAllowDrag(!store.getState().editorItem.isNew)
    }); //store状态更新触发

    const handleDelete = (id: number) => {
        confirm({
            title: '是否确认删除该组件?',
            icon: <ExclamationCircleOutlined />,
            content: '本操作将同时删除该组件下的所有子组件',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                console.log('OK');
                store.dispatch(setEditorItemId(-9999, false))
                const schemaMap = store.getState().schemaMap
                store.dispatch(deleteSchema(id))
                const newSchema = clone(schemaMap.get(0))
                store.dispatch(initSchemaMap(newSchema))
                store.dispatch(initNameArray(newSchema))
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }//组件删除事件

    const getSchemaById = (id: number) => {
        let schemaMap = store.getState().schemaMap
        return schemaMap.get(id)
    } //根据ID获取对应的schema

    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDrop = (e: any, id: number) => {
        e.preventDefault();
        document.getElementById(`${e.target.id}`)?.classList.remove('dragEnter-bottom')
        document.getElementById(`${e.target.id}`)?.classList.remove('dragEnter-top')
        if (!allowDrag) {
            message.warn('新增组件未设置字段名')
            return
        }
        console.log(e.target, '当前drop元素');
        console.dir(e.target, '当前drop元素')
        console.log('move');
        const dragItem = store.getState().currentDragItem
        if (JSON.stringify(dragItem) !== '{}') {
            store.dispatch(moveSchema(Number(id), store.getState().currentDragItem))
            console.log(dragItem);
            if (dragItem.parentId === -1) {
                if (!(dragItem.hasOwnProperty('body') || dragItem.hasOwnProperty('columns'))) {
                    store.dispatch(setEditorItemId(dragItem.id, true))
                }
            }//如果是左侧拖入则自动进入编辑状态
            store.dispatch(setCurrentDragItem({}))//放置完成后重置当前拖动状态
        }
    } //画布放置事件
    const handleDragStart = (e: any, index: number, id: number) => {
        // console.log(e.target);
        // console.log(id);
        if (!allowDrag) {
            return
        }
        store.dispatch(setCurrentDragItem(getSchemaById(id)))
        store.dispatch(setEditorItemId(store.getState().currentDragItem.id, false))
        console.log(store.getState().currentDragItem, '当前拖拽的元素');
        e.target.className += ' onDrag'
    } //组件开始拖拽事件
    const handleDragEnd = (e: any) => {
        store.dispatch(setCurrentDragItem({}));
        e.target.className = e.target.className.replace(' onDrag', '')
    } //组件结束拖拽事件


    const handleComponentClick = (e: any, id: number) => {
        if (!allowDrag) {
            message.warn('新增组件未设置字段名')
            return
        }
        setClickId(id)
        store.dispatch(setEditorItemId(id, false))
        console.log(store.getState().editorItem.currentEditorItemId);
    } //组件点击选中事件


    return (
        <>
            <div className='middle-component-top'>
                <div className='component-label'>{props.item.title}</div>
                {props.item.id === clickId ? (<div style={{ pointerEvents: 'auto' }} onClick={() => handleDelete(props.item.id)} className='delete'><DeleteOutlined /></div>) : (<></>)}
            </div>
            <div className='grid'>
                {props.item.columns.map((itm: any, index: any) => {
                    return (
                        <div
                            id={itm.id}
                            onDragOver={handleDragOver}
                            onDrop={(event) => {
                                event.stopPropagation();
                                handleDrop(event, itm.id)
                            }}
                            key={itm.id}
                            style={{ width: `${98 / (props.item.columns.length)}%` }}
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
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, index, item.id) }}
                                                    onDragEnd={handleDragEnd}
                                                    draggable>
                                                    <InputEdi item={item} clickId={clickId} handleDelete={handleDelete}></InputEdi>
                                                </div>
                                            )
                                        case 'numberInput':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, index, item.id) }}
                                                    onDragEnd={handleDragEnd}
                                                    draggable>
                                                    <NumberInputEdi item={item} clickId={clickId} handleDelete={handleDelete}></NumberInputEdi>
                                                </div>
                                            )
                                        case 'textarea':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, index, item.id) }}
                                                    onDragEnd={handleDragEnd}
                                                    draggable>
                                                    <TextAreaEdi item={item} clickId={clickId} handleDelete={handleDelete}></TextAreaEdi>
                                                </div>
                                            )
                                        case 'select':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, index, item.id) }}
                                                    onDragEnd={handleDragEnd}
                                                    draggable>
                                                    <SelectEdi item={item} clickId={clickId} handleDelete={handleDelete}></SelectEdi>
                                                </div>
                                            )
                                        case 'grid':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={item.id === clickId ? 'click grid-component-container' : 'grid-component-container'}
                                                    key={item.id}
                                                    onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                                    onClick={(event: any) => { event.stopPropagation(); handleComponentClick(event, item.id) }}
                                                    onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, index, item.id) }}
                                                    onDragEnd={handleDragEnd}
                                                    draggable>
                                                    <Grid item={item}></Grid>
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
