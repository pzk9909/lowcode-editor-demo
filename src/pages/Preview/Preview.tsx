import { useEffect, useState } from "react"
import Schema from '../../schemaInterface'
import clone from '../../clone'
import GridPre from "../../component/GridPre/GridPre"
import { Button, Form } from "antd"
import store from '../../store/store';
import {  initDataMapAsync,  changeValueAsync } from '../../store/action'
import './style.css'
import InputPre from "../../component/InputPre/InputPre"
import TextAreaPre from "../../component/TextAreaPre/TextAreaPre"
import SelectPre from "../../component/SelectPre/SelectPre"
import NumberInputPre from "../../component/NumberInputPre/NumberInputPre"
export default function Preview() {
    const [schema, setSchema] = useState<Schema>() //画布数据
    const [data, setData] = useState<any>({})
    const [form] = Form.useForm();
    useEffect(() => {
        const schema = clone(store.getState().schemaMap.get(0))
        console.log(schema);
        setSchema(schema)
        const dataJSON = localStorage.getItem('data')
        let data = {}
        if (dataJSON) {
            data = JSON.parse(dataJSON)
        }
        setData(data)
        store.dispatch(initDataMapAsync(store.getState().schemaMap, data))
        // console.log(store.getState().previewDataMap);
    }, [])

    store.subscribe(() => {
    })

    const onFinish = () => {
        console.log('finish');
        const dataMap = store.getState().previewDataMap
        const saveData: any = {}
        dataMap.forEach(item => {
            if (item.value !== null) {
                saveData[item.name] = item.value
            }
        })
        console.log(saveData);
        localStorage.setItem('data', JSON.stringify(saveData))
    }//提交触发

    const onChange = (e: any, name: string) => {
        console.log(e);
        let value
        if (e === null) {
            value = null
        }
        if (e) {
            if (typeof e === 'number') {
                value = e ? e : null
            } else {
                value = e.target.value ? e.target.value : null
            }
        }
        console.log(name, ':', value);
        store.dispatch(changeValueAsync(name, value))
    }//表单域中数据改变触发

    return (
        <div className="pre-container">
            <h1>预览</h1>
            <div>
                <Form
                    form={form}
                    name="basic"
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    {
                        schema?.body?.length === 0 ? (<div></div>) : (schema?.body?.map((item, index) => {
                            switch (item.type) {
                                case 'input':
                                    return (
                                        <div
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <InputPre onChange={onChange} item={item} data={data}></InputPre>
                                        </div>
                                    )
                                case 'numberInput':
                                    return (
                                        <div
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <NumberInputPre onChange={onChange} item={item} data={data}></NumberInputPre>
                                        </div>
                                    )
                                case 'textarea':
                                    return (
                                        <div
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <TextAreaPre item={item} data={data}></TextAreaPre>
                                        </div>
                                    )
                                case 'select':
                                    return (
                                        <div
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <SelectPre item={item} data={data}></SelectPre>
                                        </div>
                                    )
                                case 'grid':
                                    return (
                                        <div
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <GridPre item={item} data={data}></GridPre>
                                        </div>
                                    )
                                default: return (
                                    <div></div>
                                )
                            }
                        }))
                    }
                    {
                        schema?.body?.length !== 0 ? (<Button type="primary" onClick={onFinish}>提交</Button>) : (<div></div>)
                    }
                </Form>
            </div>
        </div>
    )
}
