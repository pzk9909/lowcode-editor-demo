import './style.css'
import {Input } from 'antd'
import {
    DeleteOutlined,
} from '@ant-design/icons';
export default function NumberInputEdi(props: any) {
    const { item, clickId, handleDelete } = props
    return (
        <div className='numberInputEdi-container'>
            <div className='component-top'>
                <div className='component-top-label'>{item.title}</div>
                {item.id === clickId ?
                    (<div style={{ pointerEvents: 'auto' }}
                        onClick={() => {
                            handleDelete(item.id)
                        }}
                        className='delete'><DeleteOutlined /></div>
                    ) : (<></>)}
            </div>
            <Input name={item.name} className='middle-component'></Input >
        </div>
    )
}
