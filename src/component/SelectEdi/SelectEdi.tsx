import './style.css'
import {
    DeleteOutlined,
} from '@ant-design/icons';
export default function SelectEdi(props: any) {
    const { item, clickId, handleDelete } = props
    return (
        <div className='SelectEdi-container'>
            <div className='component-top'>
                <div className='component-top-label'>{item.title}</div>
                {item.id === clickId ? (<div style={{ pointerEvents: 'auto' }} onClick={() => handleDelete(item.id)} className='delete'><DeleteOutlined /></div>) : (<></>)}
            </div>
            <select name={item.name} className='middle-component component-select'>
                {item.options?.map((item: any) => {
                    return (
                        <option key={item.value} value={item.value}>{item.label}</option>
                    )
                })}
            </select>
        </div>
    )
}
