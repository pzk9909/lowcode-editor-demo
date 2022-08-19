import { useEffect, useState } from "react"
import store from "../../store/store"
import Schema from '../../schemaInterface'
import clone from '../../clone'
import PreGrid from "../../component/Grid-pre/PreGrid"
import { Input, Button, Form, Select } from "antd"
import './style.css'
export default function Preview() {
    const { TextArea } = Input;
    const { Option } = Select;
    const [schema, setSchema] = useState<Schema>() //画布数据

    const [data, setData] = useState<any>({})




    useEffect(() => {
        const schema = clone(store.getState().schemaMap.get(0))
        console.log(schema);
        setSchema(schema)
        const dataJSON = localStorage.getItem('data')
        if (dataJSON) {
            const data = JSON.parse(dataJSON)
            console.log(data);
            setData(data)
        }
    }, [])

    const [form] = Form.useForm();

    const onFinish = () => {
        console.log('finish');
        const data = JSON.stringify(form.getFieldsValue())
        console.log(data);
        localStorage.setItem('data', data)
    }

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

                                        <div id={`${item.id}`}
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <Form.Item
                                                label={item.title}
                                                name={item.name}
                                                initialValue={data ? data[item.name ? item.name : ''] : ''}
                                            >
                                                <Input className='pre-component'></Input>
                                            </Form.Item>
                                        </div>
                                    )
                                case 'textarea':
                                    return (
                                        <div id={`${item.id}`}
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <Form.Item
                                                label={item.title}
                                                name={item.name}
                                                initialValue={data ? data[item.name ? item.name : ''] : ''}
                                            >
                                                <TextArea className='pre-component' />
                                            </Form.Item>
                                        </div>
                                    )
                                case 'select':
                                    return (
                                        <div
                                            id={`${item.id}`}
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <Form.Item
                                                label={item.title}
                                                name={item.name}
                                                initialValue={data ? data[item.name ? item.name : ''] : ''}
                                            >
                                                <Select
                                                    placeholder="请选择"
                                                    allowClear
                                                >
                                                    {item.options?.map(item => {
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
                                        <div id={`${item.type}-${item.id}`}
                                            key={item.id}
                                            className={'pre-component-container'}>
                                            <PreGrid data={data} item={item}></PreGrid>
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
