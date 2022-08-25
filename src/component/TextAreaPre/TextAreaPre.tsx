import './style.css'
import { Input, Form } from "antd"
export default function TextAreaPre(props: any) {
    const { item, data } = props
    const { TextArea } = Input;
    return (
        <>
            <Form.Item
                label={item.title}
                name={item.name}
                initialValue={data ? data[item.name ? item.name : ''] : ''}
            >
                <TextArea className='pre-component' />
            </Form.Item>
        </>
    )
}
