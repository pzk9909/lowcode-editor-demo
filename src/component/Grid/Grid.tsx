import store from "../../store/store";
import { pushSchemaByWrapId } from '../../store/action'

export default function Grid(props: any) {
    const handleDragOver = (e: any) => { e.preventDefault(); }
    const handleDragLeave = (e: any) => e.dataTransfer.dropEffect = 'none';
    const handleDrop = (e: any, id: number) => {
        console.log(id);
        console.log(e.target);
        const item = {
            type: 'input',
            id: 999,
            name: 'text',
            title: '输入框'
        }
        store.dispatch(pushSchemaByWrapId(id, item))
    }

    return (
        <>
            <div className='component-label'>{props.item.title}</div>
            <div className='grid'>
                {props.item.columns.map((itm: any, index: any) => {
                    return (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(event) => {
                                handleDrop(event, itm.id)
                            }}
                            key={itm.id}
                            style={{ width: `${95 / (props.item.columns.length)}%` }}
                            className='grid-column'>
                            {
                                itm?.body.length === 0 ? (<div></div>) : (itm?.body.map((item: any, index: any) => {
                                    switch (item.type) {
                                        case 'input':
                                            return (
                                                <div id={`${item.id}`}
                                                    key={item.id}
                                                    draggable>
                                                    <div className='component-label'>{item.title}</div>
                                                    <input name={item.name} className='middle-component'></input>
                                                </div>
                                            )
                                        case 'textarea':
                                            return (
                                                <div id={`${item.id}`}
                                                    key={item.id}
                                                    draggable>
                                                    <div className='component-label'>{item.title}</div>
                                                    <textarea name={item.name} className='middle-component' />
                                                </div>
                                            )
                                        case 'select':
                                            return (
                                                <div id={`${item.id}`}
                                                    key={item.id}
                                                    draggable>
                                                    <div className='component-label'>{item.title}</div>
                                                    <select name={item.name} className='middle-component component-select'>
                                                        {item.options?.map((item: any) => {
                                                            return (
                                                                <option key={item.value} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            )
                                        case 'grid':
                                            return (
                                                <div id={`${item.type}-${item.id}`}
                                                    key={item.id}
                                                    draggable>
                                                    <Grid onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave} item={item}></Grid>
                                                </div>
                                            )
                                        default: return (
                                            <div></div>
                                        )
                                    }
                                }))
                            }
                        </div>
                    )
                })}
            </div>
        </>
    )
}