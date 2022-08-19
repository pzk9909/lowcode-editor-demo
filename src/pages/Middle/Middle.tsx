import { useState, useEffect } from 'react';
import './style.css';
import store from '../../store/store';
import { setEditorItemId, setCurrentDragItem, moveSchema, deleteSchema, initSchemaMap, initNameArray } from '../../store/action'
import clone from '../../clone'
import { Input, Modal, message, InputNumber } from 'antd';
import Schema from '../../schemaInterface'
import Grid from '../../component/Grid/Grid';
import {
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';


export default function Middle() {
    const { confirm } = Modal;
    const { TextArea } = Input;
    const [schema, setSchema] = useState<Schema>() //画布数据
    const [clickId, setClickId] = useState<number>() //记录当前点击的组件的ID
    const [allowDrag, setAllowDrag] = useState(true) //是否允许拖拽
    useEffect(() => {
        let schema = store.getState().schemaMap.get(0)
        setSchema(clone(schema))
    }, []) //取出根schema
    store.subscribe(() => {
        let schema = store.getState().schemaMap.get(0)
        setSchema(clone(schema)) //更新schema
        setAllowDrag(!store.getState().editorItem.isNew) //更新是否允许拖拽
        setClickId(store.getState().editorItem.currentEditorItemId) //更新当前编辑的组件
    }); //store状态更新触发
    const findSchemaById = (id: number) => {
        let schemaMap = store.getState().schemaMap
        return schemaMap.get(id)
    }//根据ID在schema中找到所编辑的组件

    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        document.getElementById(`${e.target.id}`)?.classList.remove('dragEnter-bottom')
        document.getElementById(`${e.target.id}`)?.classList.remove('dragEnter-top')
    }
    const handleDrop = (e: any, id: number) => {
        e.preventDefault();
        document.getElementById(`${e.target.id}`)?.classList.remove('dragEnter-bottom')
        document.getElementById(`${e.target.id}`)?.classList.remove('dragEnter-top')
        if (!allowDrag) {
            message.warn('新增组件未设置字段名')
            return
        } //如果不允许拖拽则不进行操作直接返回
        console.log(e.target, '当前drop元素');
        console.dir(e.target, '当前drop元素')
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
    const handleDragStart = (e: any, id: number) => {
        // console.log(e.target);
        // console.log(id);
        if (!allowDrag) {
            return
        }
        store.dispatch(setCurrentDragItem(findSchemaById(id)))
        store.dispatch(setEditorItemId(store.getState().currentDragItem.id,false))
        console.log(store.getState().currentDragItem, '当前拖拽的元素');
        e.target.className += ' onDrag'

    } //组件开始拖拽事件
    const handleDragEnd = (e: any) => {
        store.dispatch(setCurrentDragItem({}))
        e.target.className = e.target.className.replace(' onDrag', '')
    } //组件结束拖拽事件

    const findIndexInParentSchema = (id: number) => {
        const schemaMap = store.getState().schemaMap
        const parent = schemaMap.get(schemaMap.get(id).parentId)
        console.log(parent);
        for (let i = 0; i < parent.body.length; i++) {
            if (parent.body[i].id === id) {
                return i
            }
        }
        return schemaMap.get(id)
    }

    const getParentIdList: any = (id: number, list: Array<number>) => {
        const index = store.getState().schemaMap.get(id)
        if (index.id === 0) return list
        list.push(index.parentId)
        if (index.parentId !== 0) {
            return getParentIdList(index.parentId, list)
        } else {
            return list
        }
    }


    const handleDragEnter = (e: any) => {
        if (e.target.id === `0`) {
            return
        }
        if(!e.target.id){
            return
        }
        console.log(e);
        console.log(e.target.id);
        const dragItem = store.getState().currentDragItem
        console.log(dragItem, '当前拖拽的元素');
        const enterItem = findSchemaById(Number(e.target.id))
        console.log(enterItem, '当前enter的元素');
        const pathArr = getParentIdList(enterItem.id, [])
        console.log(pathArr);

        if (pathArr.indexOf(dragItem.id) !== -1) {
            console.log('拖进子元素');
            return
        }

        if (dragItem.parentId === enterItem.parentId) {
            if (findIndexInParentSchema(dragItem.id) > findIndexInParentSchema(enterItem.id)) {
                document.getElementById(`${e.target.id}`)?.classList.add('dragEnter-top')
                return
            }
        }
        document.getElementById(`${e.target.id}`)?.classList.add('dragEnter-bottom')
    } //拖拽过程进入组件触发事件

    const handleComponentClick = (id: number) => {
        if (!allowDrag) {
            message.warn('新增组件未设置字段名')
            return
        }
        store.dispatch(setEditorItemId(id, false))//设置编辑组件
    } //组件点击选中事件

    const fun = () => {
        console.log(1);

        allowDrag ? setAllowDrag(false) : setAllowDrag(true)
    }

    const handleDelete = (id: number) => {

        console.log(store.getState().currentDragItem);
        confirm({
            title: '是否确认删除该组件?',
            icon: <ExclamationCircleOutlined />,
            content: '本操作将同时删除该组件下的所有子组件',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                console.log('OK');
                store.dispatch(setEditorItemId(-9999, false)) //取消编辑状态
                const schemaMap = store.getState().schemaMap
                store.dispatch(deleteSchema(id))  //删除组件
                const newSchema = clone(schemaMap.get(0))
                store.dispatch(initSchemaMap(newSchema)) //重置schemaMap
                store.dispatch(initNameArray(newSchema)) //重置nameArray
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }//组件删除事件

    return (
        <div
            id='0'
            onDragOver={handleDragOver}
            onDrop={(event) => { event.stopPropagation(); handleDrop(event, 0) }}
            onDragEnter={(event: any) => { handleDragEnter(event) }}
            onDragLeave={(event) => { handleDragLeave(event) }}
            onClick={(e: any) => {
                console.dir(e.target);

                if (e.target.id === '0' || e.target.tagName === 'H1') {  //当点击画布其他地方时，取消编辑组件的选中状态
                    if (!allowDrag) {
                        message.warn('新增组件未设置字段名')
                        return
                    } //强制编辑状态不允许取消
                    setClickId(-9999)
                    store.dispatch(setEditorItemId(-9999, false))
                }
            }}
            className='middle-container'>
            <h1>画布</h1>
            {/* <div>{allowDrag ? 'true' : 'false'}</div>
            <button onClick={fun}>点击</button> */}
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
                                        onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, item.id) }}
                                        // onDragEnter={(event: any) => { handleDragEnter(event) }}
                                        // onDragLeave={(event) => { handleDragLeave(event) }}
                                        onDragEnd={handleDragEnd}
                                        draggable>
                                        <div className='middle-component-top'>
                                            <div className='component-label'>{item.title}</div>
                                            {item.id === clickId ?
                                                (<div style={{ pointerEvents: 'auto' }} onClick={() => {
                                                    handleDelete(item.id)
                                                }} className='delete'><DeleteOutlined /></div>
                                                ) : (<></>)}
                                        </div>
                                        <Input name={item.name} className='middle-component'></Input>
                                        {/* <InputNumber min={0} max={0} defaultValue={0}></InputNumber> */}
                                    </div>
                                )
                            case 'textarea':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={item.id === clickId ? 'middle-component-container click' : 'middle-component-container'}
                                        onDrop={(event) => { event.stopPropagation(); handleDrop(event, item.id) }}
                                        onClick={() => { handleComponentClick(item.id) }}
                                        onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, item.id) }}
                                        // onDragEnter={(event: any) => { handleDragEnter(event) }}
                                        // onDragLeave={(event) => { handleDragLeave(event) }}
                                        onDragEnd={handleDragEnd}
                                        draggable>
                                        <div className='middle-component-top'>
                                            <div className='component-label'>{item.title}</div>
                                            {item.id === clickId ? (<div style={{ pointerEvents: 'auto' }} onClick={() => handleDelete(item.id)} className='delete'><DeleteOutlined /></div>) : (<></>)}
                                        </div>
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
                                        onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, item.id) }}
                                        // onDragEnter={(event: any) => { handleDragEnter(event) }}
                                        // onDragLeave={(event) => { handleDragLeave(event) }}
                                        onDragEnd={handleDragEnd}
                                        draggable>
                                        <div className='middle-component-top'>
                                            <div className='component-label'>{item.title}</div>
                                            {item.id === clickId ? (<div style={{ pointerEvents: 'auto' }} onClick={() => handleDelete(item.id)} className='delete'><DeleteOutlined /></div>) : (<></>)}
                                        </div>
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
                                        onDragStart={(event: any) => { event.stopPropagation(); handleDragStart(event, item.id) }}
                                        // onDragEnter={(event: any) => { handleDragEnter(event) }}
                                        // onDragLeave={(event) => { handleDragLeave(event) }}
                                        onDragEnd={handleDragEnd}
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
