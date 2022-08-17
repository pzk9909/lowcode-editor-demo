import store from "../../store/store";
import { moveSchema, setCurrentDragItem, setEditorItemId } from '../../store/action'
import { Input, Form,Select } from 'antd';
import './style.css'
import { useState } from "react";

export default function Grid(props: any) {
    const { TextArea } = Input;
    const { Option } = Select;

    const [clickId, setClickId] = useState<number>() //记录当前点击的组件的ID

    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => e.dataTransfer.dropEffect = 'none';
    const handleDrop = (e: any, id: number) => {
        e.preventDefault();
        console.log(e.target, '当前drop元素');
        console.dir(e.target, '当前drop元素')
        console.log('move');
        store.dispatch(moveSchema(Number(id), store.getState().currentDragItem))
    } //画布放置事件

    const findDragItem = (id: number) => {
        let schemaMap  = store.getState().schemaMap
        // console.log(schemaa);
        // console.log(id);
        return schemaMap.get(id)

    }

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

    const handleDragEnter = (e: any, id: number) => {

    } //拖拽过程进入组件触发事件




    store.subscribe(() => {
        setClickId(store.getState().editorItem.currentEditorItemId)
    }); //store状态更新触发

    const handleComponentClick = (e: any, id: number) => {

        console.log(id);
        setClickId(id)
        store.dispatch(setEditorItemId(id))
        console.log(store.getState().editorItem.currentEditorItemId);

    } //组件点击选中事件



    if(props.isPre){  //预览模式
        return (
            <>
                <div className='component-label'>{props.item.title}{props.item.id}</div>
                <div className='grid'>
                    {props.item.columns.map((itm: any, index: any) => {
                        return (
                            <div
                                id={itm.id}
                                key={itm.id}
                                style={{ width: `${95 / (props.item.columns.length)}%` }}
                                className='grid-column'>
                                {
                                    itm?.body.length === 0 ? (null) : (itm?.body.map((item: any, index: any) => {
                                        switch (item.type) {
                                            case 'input':
                                                return (
                                                    <div id={`${item.id}`}
                                                        className={'grid-component-container'}
                                                        key={item.id}>
                                                        <Form.Item
                                                            label={item.title}
                                                            name={item.name}
                                                        >
                                                            <Input className='pre-component'></Input>
                                                        </Form.Item>
                                                    </div>
                                                )
                                            case 'textarea':
                                                return (
                                                    <div id={`${item.id}`}
                                                        className={'grid-component-container'}
                                                        key={item.id}>
                                                        <Form.Item
                                                            label={item.title}
                                                            name={item.name}
                                                        >
                                                            <TextArea className='pre-component' />
                                                        </Form.Item>
                                                    </div>
                                                )
                                            case 'select':
                                                return (
                                                    <div id={`${item.id}`}
                                                        className={'grid-component-container'}
                                                        key={item.id}>
                                                        <Form.Item
                                                            label={item.title}
                                                            name={item.name}
                                                        >
                                                            <Select
                                                                placeholder="请选择"
                                                                allowClear
                                                            >
                                                                {item.options?.map((item:any) => {
                                                                    return (
                                                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                )
                                            case 'grid':
                                                return (
                                                    <div id={`${item.id}`}
                                                        className={'grid-component-container'}
                                                        key={item.id}>
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
    }else{ //编辑模式
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
                                                        <div className='component-label'>{item.title}{item.id}</div>
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
                                                        <div className='component-label'>{item.title}{item.id}</div>
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
    
}