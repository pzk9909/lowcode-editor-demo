import { useEffect } from 'react';
import './style.css';
import {
    Form,
    Input,
    Button, Tooltip, message
} from 'antd';
import {
    SaveOutlined
} from '@ant-design/icons';
import store from '../../store/store';
import { editorSchema, pushName, setEditorItemId } from '../../store/action'
export default function Editor(props: any) {

    useEffect(() => {
        console.log(props);
    })

    const handleChange = (e: any) => {
        console.log(e);
        console.log(e.target.id);
        const arr = e.target.id.split('-')
        console.log(arr);
        console.log(e.target.value);
        store.dispatch(editorSchema(props.schema.id, arr[1], e.target.value))
    }//编辑组件属性触发


    const saveName = () => {
        // store.dispatch(editorSchema(props.schema.id, 'name', e.target.value))
        const nameArray = store.getState().nameArray
        console.log(nameArray);
        if (nameArray.indexOf(props.schema.name) !== -1) {
            message.error('保存失败，字段名重复')
        } else {
            store.dispatch(setEditorItemId(props.schema.id, false))
            store.dispatch(pushName(props.schema.name))
        }

        // store.dispatch(setEditorItemId(props.schema.id, false))
    }

    if (props.schema) {  //根据编辑的组件类型返回不同的编辑区
        switch (props.schema.type) {
            case 'input': return (
                <div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Form.Item initialValue={props.schema.name} label="字段名" name={`input-name-${props.schema.id}`}>
                            <div>
                                <Input status="error" disabled={!props.isNew} id={`input-name-${props.schema.id}`} defaultValue={props.schema.name} style={{ width: 'calc(100% - 30px)' }} onChange={handleChange}></Input>
                                {props.isNew ?
                                    (
                                    <Tooltip  title="保存字段名">
                                            <SaveOutlined style={{ marginLeft: '10px' }} onClick={saveName} />
                                    </Tooltip>
                                    )
                                    :
                                    (<></>)}
                            </div>
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
                        <Form.Item initialValue={props.schema.name} label="字段名" name={`input-name-${props.schema.id}`}>
                            <div>
                                <Input status="error" disabled={!props.isNew} id={`input-name-${props.schema.id}`} defaultValue={props.schema.name} style={{ width: 'calc(100% - 30px)' }} onChange={handleChange}></Input>
                                {props.isNew ?
                                    (
                                        <Tooltip title="保存字段名">
                                            <SaveOutlined style={{ marginLeft: '10px' }} onClick={saveName} />
                                        </Tooltip>
                                    )
                                    :
                                    (<></>)}
                            </div>
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
                        <Form.Item initialValue={props.schema.name} label="字段名" name={`input-name-${props.schema.id}`}>
                            <div>
                                <Input status="error" disabled={!props.isNew} id={`input-name-${props.schema.id}`} defaultValue={props.schema.name} style={{ width: 'calc(100% - 30px)' }} onChange={handleChange}></Input>
                                {props.isNew ?
                                    (
                                        <Tooltip title="保存字段名">
                                            <SaveOutlined style={{ marginLeft: '10px' }} onClick={saveName} />
                                        </Tooltip>
                                    )
                                    :
                                    (<></>)}
                            </div>
                        </Form.Item>
                        <Form.Item initialValue={props.schema.title} label="标题" name={`textarea-title-${props.schema.id}`}>
                            <Input onChange={handleChange}></Input>
                        </Form.Item>
                    </Form>
                </div>
            )
            case 'grid': return (
                <div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
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
