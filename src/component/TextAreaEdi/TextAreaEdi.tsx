import './style.css'
import { Input } from 'antd'
import {
    DeleteOutlined,
} from '@ant-design/icons';
export default function TextAreaEdi(props: any) {
    const { item, clickId, handleDelete } = props
    const { TextArea } = Input
    return (
        <div className='TextAreaEdi-container'>
            <div className='component-top'>
                <div className='component-top-label'>{item.title}</div>
                {item.id === clickId ? (<div style={{ pointerEvents: 'auto' }}
                    onClick={() => handleDelete(item.id)}
                    className='delete'><DeleteOutlined /></div>) : (<></>)}
            </div>
            <TextArea rows={2} name={item.name} className='middle-component' />
        </div>
    )
}
