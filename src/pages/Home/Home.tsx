import './style.css';
import Left from '../Left/Left';
import Right from '../Right/Right';
import Middle from '../Middle/Middle';
import store from '../../store/store';
import { Button } from 'antd';
export default function Home() {


    const handleSave = () => {
        const schema = store.getState().schema
        console.log(schema);
        const jsonSchema = JSON.stringify(schema)
        console.log(jsonSchema);
        localStorage.setItem('schema',jsonSchema)

    }
    return (
        <div className='home-page-container'>
            <Left></Left>
            <Middle></Middle>
            <Right></Right>
            <div className='save-button'><Button onClick={handleSave}>保存</Button></div>
        </div>

    );
}
