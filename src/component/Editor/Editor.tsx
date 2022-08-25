import { useState } from 'react';
import './style.css';
import { Form, Input, Tooltip, message, Collapse, Switch } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import store from '../../store/store';
import Schema from '../../schemaInterface'
import { editorSchema, pushName, setEditorItemId, changeExpression } from '../../store/action'
export default function Editor(props: any) {
    const { Panel } = Collapse;
    const [schema, setSchema] = useState<Schema>() //当前编辑的组件
    const [isNew, setIsNew] = useState(false)
    const [hidden, setHidden] = useState({
        opened: false,
        expression: ''
    })
    const [readOnly, setReadOnly] = useState({
        opened: false,
        expression: ''
    })
    store.subscribe(() => {
        const schemaMap = store.getState().schemaMap
        let newSchema = schemaMap.get(store.getState().editorItem.currentEditorItemId)
        let hiddenOpenTmp = false
        let readOnlyOpenTmp = false
        let hiddenExpressionTmp = ''
        let readOnlyExpressionTmp = ''
        if (newSchema && newSchema.expressions) {
            newSchema.expressions.map((item: any) => {
                if (item.indexOf('hidden') !== -1) {
                    hiddenOpenTmp = true
                    hiddenExpressionTmp = item.replace(/ /g, '').split('when')[1]
                }
                if (item.indexOf('readOnly') !== -1) {
                    readOnlyOpenTmp = true
                    readOnlyExpressionTmp = item.replace(/ /g, '').split('when')[1]
                }
            })
        }
        setSchema(newSchema)
        setIsNew(store.getState().editorItem.isNew)
        setHidden({ opened: hiddenOpenTmp, expression: hiddenExpressionTmp })
        setReadOnly({ opened: readOnlyOpenTmp, expression: readOnlyExpressionTmp })
    }) //store状态更新触发

    const handleChange = (e: any) => {
        const arr = e.target.id.split('-')
        store.dispatch(editorSchema(schema!.id, arr[1], e.target.value))
    }//编辑组件属性触发


    const saveName = () => {
        const nameArray = store.getState().nameArray
        console.log(nameArray);
        if (nameArray.indexOf(schema!.name) !== -1) {
            message.error('保存失败，字段名重复')
        } else {
            store.dispatch(setEditorItemId(schema!.id, false))
            store.dispatch(pushName(schema!.name!))
        }
    }
    function changeReactInputValue(inputDom: any, newText: any) {
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event('input', { bubbles: true });
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    }//改变输入框的value


    const handleSwitchChange = (checked: boolean, status: string) => {
        let hiddenOpenTmp = hidden.opened
        let readOnlyOpenTmp = readOnly.opened
        let hiddenExpressionTmp = hidden.expression
        let readOnlyExpressionTmp = readOnly.expression
        switch (status) {
            case 'hidden':
                hiddenOpenTmp = checked;
                if (checked === false) {
                    handleExpressionChange('hidden', '');//删除该表达式

                    const dom = document.getElementById(`hidden-${schema!.id}`) as HTMLInputElement;
                    console.log(dom);
                    if (dom.value) {
                        changeReactInputValue(dom, '');
                    } //如果输入框已经有值了则清空一下
                }//关闭开关
                else {
                    setTimeout(() => {
                        const dom = document.getElementById(`hidden-${schema!.id}`) as HTMLInputElement;
                        console.log(dom);
                        if (dom.value) {
                            changeReactInputValue(dom, '');
                        } //如果输入框已经有值了则清空一下
                    });//用定时器将动作延迟一下避免获取不到打开后的dom
                }//打开开关
                break;
            case 'readOnly':
                readOnlyOpenTmp = checked;
                if (checked === false) {
                    handleExpressionChange('readOnly', '');//删除该表达式
                    const dom = document.getElementById(`readOnly-${schema!.id}`) as HTMLInputElement;
                    if (dom.value) {
                        changeReactInputValue(dom, '');
                    }//如果输入框已经有值了则清空一下
                }//关闭开关
                else {
                    setTimeout(() => {
                        const dom = document.getElementById(`readOnly-${schema!.id}`) as HTMLInputElement;
                        if (dom.value) {
                            changeReactInputValue(dom, '');
                        }//如果输入框已经有值了则清空一下
                    }, 0);//用定时器将动作延迟一下避免获取不到打开后的dom
                }//打开开关
                break;
        }
        setHidden({ opened: hiddenOpenTmp, expression: hiddenExpressionTmp })
        setReadOnly({ opened: readOnlyOpenTmp, expression: readOnlyExpressionTmp })

    }

    const handleExpressionChange = (status: string, value: string) => {
        store.dispatch(changeExpression(schema!.id, status, value))
    }


    if (schema) {  //根据编辑的组件类型返回不同的编辑区
        switch (schema.type) {
            case 'input': return (
                <div>
                    <div>类型:{schema.type}</div>
                    <div>id:{schema.id}</div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Collapse defaultActiveKey={['1', '2']} bordered={false} ghost >
                            <Panel header="基本" key="1">
                                <Form.Item initialValue={schema.name} label="字段名" name={`input-name-${schema.id}`}>
                                    <div>
                                        <Input autoFocus status="error" disabled={!isNew} id={`input-name-${schema.id}`} defaultValue={schema.name} style={{ width: 'calc(100% - 30px)' }} onChange={handleChange}></Input>
                                        {isNew ?
                                            (
                                                <Tooltip title="保存字段名">
                                                    <SaveOutlined style={{ marginLeft: '10px' }} onClick={saveName} />
                                                </Tooltip>
                                            )
                                            :
                                            (<></>)}
                                    </div>
                                </Form.Item>
                                <Form.Item initialValue={schema.title} label="标题" name={`input-title-${schema.id}`}>
                                    <Input onChange={handleChange}></Input>
                                </Form.Item>
                            </Panel>
                            <Panel header="状态" key="2">
                                <div className='status-container'>
                                    <div className='switch-container'>
                                        <div className='label'>隐藏</div>
                                        <Switch checked={hidden.opened} onChange={(checked: boolean) => {
                                            handleSwitchChange(checked, 'hidden')
                                        }} />
                                    </div>
                                    {
                                        hidden.opened ? (
                                            <div className='expression-container'>
                                                <Form.Item initialValue={hidden.expression} label="表达式" name={`hidden-${schema.id}`}>
                                                    <Input></Input>
                                                </Form.Item>
                                                <Tooltip title="保存表达式">
                                                    <SaveOutlined className='expression-save' onClick={() => {
                                                        let value = (document.getElementById(`hidden-${schema!.id}`) as HTMLInputElement).value;
                                                        handleExpressionChange('hidden', value)
                                                    }} />
                                                </Tooltip>
                                            </div>
                                        ) : (<></>)
                                    }
                                </div>
                                <div className='status-container'>
                                    <div className='switch-container'>
                                        <div className='label'>只读</div>
                                        <Switch checked={readOnly.opened} onChange={(checked: boolean) => {
                                            handleSwitchChange(checked, 'readOnly')
                                        }} />
                                    </div>
                                    {
                                        readOnly.opened ? (<div className='expression-container'>
                                            <Form.Item initialValue={readOnly.expression} label="表达式" name={`readOnly-${schema.id}`}>
                                                <Input ></Input>
                                            </Form.Item>
                                            <Tooltip title="保存表达式">
                                                <SaveOutlined className='expression-save' onClick={() => {
                                                    let value = (document.getElementById(`readOnly-${schema!.id}`) as HTMLInputElement).value;
                                                    handleExpressionChange('readOnly', value)
                                                }} />
                                            </Tooltip>
                                        </div>) : (<></>)
                                    }
                                </div>
                            </Panel>
                        </Collapse>
                    </Form>
                </div>
            )


            case 'numberInput': return (
                <div>
                    <div>类型:{schema.type}</div>
                    <div>id:{schema.id}</div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Collapse defaultActiveKey={['1', '2']} bordered={false} ghost >
                            <Panel header="基本" key="1">
                                <Form.Item initialValue={schema.name} label="字段名" name={`numberInput-name-${schema.id}`}>
                                    <div>
                                        <Input autoFocus status="error" disabled={!isNew} id={`numberInput-name-${schema.id}`} defaultValue={schema.name} style={{ width: 'calc(100% - 30px)' }} onChange={handleChange}></Input>
                                        {isNew ?
                                            (
                                                <Tooltip title="保存字段名">
                                                    <SaveOutlined style={{ marginLeft: '10px' }} onClick={saveName} />
                                                </Tooltip>
                                            )
                                            :
                                            (<></>)}
                                    </div>
                                </Form.Item>
                                <Form.Item initialValue={schema.title} label="标题" name={`numberInput-title-${schema.id}`}>
                                    <Input onChange={handleChange}></Input>
                                </Form.Item>
                            </Panel>
                            <Panel header="状态" key="2">
                                <div className='status-container'>
                                    <div className='switch-container'>
                                        <div className='label'>隐藏</div>
                                        <Switch checked={hidden.opened} onChange={(checked: boolean) => {
                                            handleSwitchChange(checked, 'hidden')
                                        }} />
                                    </div>
                                    {
                                        hidden.opened ? (
                                            <div className='expression-container'>
                                                <Form.Item initialValue={hidden.expression} label="表达式" name={`hidden-${schema.id}`}>
                                                    <Input></Input>
                                                </Form.Item>
                                                <Tooltip title="保存表达式">
                                                    <SaveOutlined className='expression-save' onClick={() => {
                                                        let value = (document.getElementById(`hidden-${schema!.id}`) as HTMLInputElement).value;
                                                        handleExpressionChange('hidden', value)
                                                    }} />
                                                </Tooltip>
                                            </div>
                                        ) : (<></>)
                                    }
                                </div>
                                <div className='status-container'>
                                    <div className='switch-container'>
                                        <div className='label'>只读</div>
                                        <Switch checked={readOnly.opened} onChange={(checked: boolean) => {
                                            handleSwitchChange(checked, 'readOnly')
                                        }} />
                                    </div>
                                    {
                                        readOnly.opened ? (
                                            <div className='expression-container'>
                                                <Form.Item initialValue={readOnly.expression} label="表达式" name={`readOnly-${schema.id}`}>
                                                    <Input></Input>
                                                </Form.Item>
                                                <Tooltip title="保存表达式">
                                                    <SaveOutlined className='expression-save' onClick={() => {
                                                        let value = (document.getElementById(`readOnly-${schema!.id}`) as HTMLInputElement).value;
                                                        handleExpressionChange('readOnly', value)
                                                    }} />
                                                </Tooltip>
                                            </div>
                                        ) : (<></>)
                                    }
                                </div>
                            </Panel>
                        </Collapse>
                    </Form>
                </div>
            )


























            case 'select': return (
                <div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Form.Item initialValue={schema.name} label="字段名" name={`input-name-${schema.id}`}>
                            <div>
                                <Input autoFocus status="error" disabled={!isNew} id={`input-name-${schema.id}`} defaultValue={schema.name} style={{ width: 'calc(100% - 30px)' }} onChange={handleChange}></Input>
                                {isNew ?
                                    (
                                        <Tooltip title="保存字段名">
                                            <SaveOutlined style={{ marginLeft: '10px' }} onClick={saveName} />
                                        </Tooltip>
                                    )
                                    :
                                    (<></>)}
                            </div>
                        </Form.Item>
                        <Form.Item initialValue={schema.title} label="标题" name={`select-title-${schema.id}`}>
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
                        <Form.Item initialValue={schema.name} label="字段名" name={`input-name-${schema.id}`}>
                            <div>
                                <Input autoFocus status="error" disabled={!isNew} id={`input-name-${schema.id}`} defaultValue={schema.name} style={{ width: 'calc(100% - 30px)' }} onChange={handleChange}></Input>
                                {isNew ?
                                    (
                                        <Tooltip title="保存字段名">
                                            <SaveOutlined style={{ marginLeft: '10px' }} onClick={saveName} />
                                        </Tooltip>
                                    )
                                    :
                                    (<></>)}
                            </div>
                        </Form.Item>
                        <Form.Item initialValue={schema.title} label="标题" name={`textarea-title-${schema.id}`}>
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
                        <Form.Item initialValue={schema.title} label="标题" name={`textarea-title-${schema.id}`}>
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
