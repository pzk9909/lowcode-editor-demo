import './style.css'
import { Form, Select } from "antd"
export default function SelectPre(props: any) {
    const { item, data } = props
    const { Option } = Select;
    return (
        <>
            <Form.Item
                label={item.title}
                name={item.name}
                initialValue={data ? data[item.name ? item.name : ''] : ''}
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
        </>
    )
}
