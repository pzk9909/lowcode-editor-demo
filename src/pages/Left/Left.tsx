import './style.css';
import store from '../../store/store';
import { setDragType } from '../../store/action'
export default function Left() {

    const componentList = [{
        type: 'input',
    },
    {
        type: 'textarea',
    },
    {
        type: 'select',
    },
    {
        type: 'grid',
    }] //组件类型列表

    const onDragStart = (type: string) => {
        store.dispatch(setDragType(type))
        // console.log(store.getState());
    } //组件开始拖拽事件

    const handleDragEnd = () => {
        store.dispatch(setDragType(''))
    }
    const handleDragOver = (e: any) => {e.preventDefault();}
    const handleDragLeave = (e: any) => e.dataTransfer.dropEffect = 'none';
    return (
        <div className='left-container' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => {
            e.preventDefault();
            console.log('11111111111');
        }} >

            <h1 className='left-title'>物料区</h1>
            <div className='component-list'>
                {componentList.map(item => {
                    return (
                        <div
                            key={item.type}
                            draggable
                            onDragEnd={handleDragEnd}
                            onDragStart={() => { onDragStart(item.type) }}
                            className='left-component'
                        >
                            {item.type}
                        </div>
                    )
                })}
            </div>
        </div>

    );
}
