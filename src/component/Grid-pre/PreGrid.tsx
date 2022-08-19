import store from "../../store/store";
import { Input, Form, Select } from 'antd';
import './style.css'
import { useEffect, useState } from "react";

export default function PreGrid(props: any) {
    const { TextArea } = Input;
    const { Option } = Select;

    const [a, setA] = useState(1)
    useEffect(() => {
        // console.log(props);
        // const dataJSON = localStorage.getItem('data')
        // if (dataJSON) {
        //     const data = JSON.parse(dataJSON)
        //     console.log(data);
        //     setData(data)
        //     console.log(dataa);
        // }
        console.log(props.data);
    }, [])


    const fun = () => {
        let b = a + 1
        setA(b)
        console.log(b);

    }

    store.subscribe(() => {
    }); //store状态更新触发

    return (
        <>
            {/* <div className='component-label'>{props.item.title}</div> */}
            <div className='grid'>
                {props.item.columns.map((itm: any, index: any) => {
                    return (
                        <div
                            id={itm.id}
                            key={itm.id}
                            style={{ width: `${95 / (props.item.columns.length)}%` }}
                            className='grid-pre-column'>
                            {
                                itm?.body.length === 0 ? (null) : (itm?.body.map((item: any, index: any) => {
                                    switch (item.type) {
                                        case 'input':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <Form.Item
                                                        label={item.title}
                                                        name={item.name}
                                                        initialValue={props.data[item.name] ? props.data[item.name] : ''}
                                                    >
                                                        <Input className='pre-component'></Input>
                                                    </Form.Item>
                                                </div>
                                            )
                                        case 'textarea':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <Form.Item
                                                        label={item.title}
                                                        name={item.name}
                                                        initialValue={props.data[item.name] ? props.data[item.name] : ''}
                                                    >
                                                        <TextArea className='pre-component' />
                                                    </Form.Item>
                                                </div>
                                            )
                                        case 'select':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <Form.Item
                                                        label={item.title}
                                                        name={item.name}
                                                        initialValue={props.data[item.name] ? props.data[item.name] : ''}
                                                    >
                                                        <Select
                                                            placeholder="请选择"
                                                            allowClear
                                                        >
                                                            {item.options?.map((item: any) => {
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
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <PreGrid data={props.data} item={item}></PreGrid>
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
