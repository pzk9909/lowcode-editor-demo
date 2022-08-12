import { useEffect, useState } from "react"
import store from "../../store/store"
import Schema from '../../schemaInterface'
import clone from '../../clone'
import Grid from "../../component/Grid/Grid"
import { Input } from "antd"
import './style.css'
export default function Preview() {
    const { TextArea } = Input;
    const [schema, setSchema] = useState<Schema>() //画布数据
    const fun = () => {
        console.log(JSON.stringify(store.getState().schema))
    }
    useEffect(() => {
        setSchema(clone(store.getState().schema))
    }, [])

    return (
        <div>
            <h1>preview</h1>
            <div>
                {
                    schema?.body?.length === 0 ? (<div></div>) : (schema?.body?.map((item, index) => {
                        switch (item.type) {
                            case 'input_droped':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={'pre-component-container'}>
                                        <div className='component-label'>{item.title}</div>
                                        <Input name={item.name} className='pre-component'></Input>
                                    </div>
                                )
                            case 'textarea_droped':
                                return (
                                    <div id={`${item.id}`}
                                        key={item.id}
                                        className={'pre-component-container'}>
                                        <div className='component-label'>{item.title}</div>
                                        <TextArea rows={2} name={item.name} className='pre-component' />
                                    </div>
                                )
                            case 'select_droped':
                                return (
                                    <div
                                        id={`${item.id}`}
                                        key={item.id}
                                        className={'pre-component-container'}>
                                        <div className='component-label'>{item.title}</div>
                                        <select name={item.name} className='pre-component component-select'>
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
                                        className={'pre-component-container'}>
                                        <Grid item={item}></Grid>
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
    )
}
