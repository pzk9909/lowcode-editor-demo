
import { useEffect } from 'react';
import './style.css';
import {
    Form,
    Input
} from 'antd';
import store from '../../store/store';
import { editorSchema } from '../../store/action'
export default function Editor(props: any) {


    useEffect(() => {
        console.log(props);
    })


    const handleChange = (e: any) => {
        console.log(e.target.id);
        const arr = e.target.id.split('-')
        console.log(arr);
        console.log(e.target.value);
        store.dispatch(editorSchema(props.schema.id, arr[1], e.target.value))
    }//编辑组件属性触发

    if (props.schema) {  //根据编辑的组件类型返回不同的编辑区
        switch (props.schema.type) {
            case 'input': return (
                <div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Form.Item initialValue={props.schema.name} label="字段名" name={`input-name-${props.schema.id}`}>
                            <Input onChange={handleChange}></Input>
                        </Form.Item>
                        <Form.Item initialValue={props.schema.title} label="标题" name={`input-title-${props.schema.id}`}>
                            <Input onChange={handleChange}></Input>
                        </Form.Item>
                    </Form>
                </div>

            )
            case 'select': return (
                <div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Form.Item initialValue={props.schema.name} label="字段名" name={`select-name-${props.schema.id}`}>
                            <Input onChange={handleChange}></Input>
                        </Form.Item>
                        <Form.Item initialValue={props.schema.title} label="标题" name={`select-title-${props.schema.id}`}>
                            <Input onChange={handleChange}></Input>
                        </Form.Item>
                    </Form>
                </div>
            )
            case 'textarea': return (
                <div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Form.Item initialValue={props.schema.name} label="字段名" name={`textarea-name-${props.schema.id}`}>
                            <Input onChange={handleChange}></Input>
                        </Form.Item>
                        <Form.Item initialValue={props.schema.title} label="标题" name={`textarea-title-${props.schema.id}`}>
                            <Input onChange={handleChange}></Input>
                        </Form.Item>
                    </Form>
                </div>
            )
            default: return (
                <div>editor</div>
            )
        }
    } else return (
        <div>editor</div>
    )

}
