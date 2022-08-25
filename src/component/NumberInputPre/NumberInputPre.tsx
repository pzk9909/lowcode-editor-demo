import './style.css'
import { InputNumber, Form } from "antd"
import store from '../../store/store'
import { useEffect, useState } from 'react'
export default function NumberInputPre(props: any) {
    const { item, data, onChange } = props

    const [status, setStatus] = useState('narmal')
    useEffect(() => {
        setStatus(store.getState().previewDataMap.get(item.name).status)
    }, [])

    store.subscribe(() => {
        setStatus(store.getState().previewDataMap.get(item.name).status)
    })

    return (
        <div className='inputPre-container'>
            <Form.Item
                label={item.title}
                name={item.name}
                initialValue={data ? data[item.name ? item.name : ''] : ''}
            >
                <InputNumber onChange={(e) => { onChange(e, item.name) }} className='pre-component'></InputNumber >
            </Form.Item>
        </div>
    )
}
