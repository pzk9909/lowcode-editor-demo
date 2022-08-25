import './style.css'
import { Input, Form } from "antd"
import store from '../../store/store'
import { useEffect, useState } from 'react'
export default function InputPre(props: any) {
    const [status, setStatus] = useState('narmal')
    const { item, data, onChange } = props
    useEffect(() => {
        setStatus(store.getState().previewDataMap.get(item.name).status)
    }, [])

    store.subscribe(() => {
        setStatus(store.getState().previewDataMap.get(item.name).status)
    })

    return (
        <div className={status === 'hidden' ? 'inputPre-container hidden' : 'inputPre-container'}>
            <Form.Item
                label={item.title}
                name={item.name}
                initialValue={data ? data[item.name ? item.name : ''] : ''}
            >
                <Input disabled={status === 'readOnly' ? true : false} onChange={(e) => { onChange(e, item.name) }} className='pre-component'></Input>
            </Form.Item>
        </div>
    )
}
