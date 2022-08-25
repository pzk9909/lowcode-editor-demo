import store from "../../store/store";
import './style.css'
import { useEffect,} from "react";
import InputPre from "../../component/InputPre/InputPre"
import TextAreaPre from "../../component/TextAreaPre/TextAreaPre"
import SelectPre from "../../component/SelectPre/SelectPre"
import NumberInputPre from "../NumberInputPre/NumberInputPre";
import {  changeValueAsync } from '../../store/action'
export default function PreGrid(props: any) {

    useEffect(() => {
        // console.log(props);
        // const dataJSON = localStorage.getItem('data')
        // if (dataJSON) {
        //     const data = JSON.parse(dataJSON)
        //     console.log(data);
        //     setData(data)
        //     console.log(dataa);
        // }
        // console.log(props.data);
    }, [])

    const fun = () => {

    }
    const onChange = (e: any, name: string) => {
        console.log(e);
        let value
        if (e === null) {
            value = 0
        }
        if (e) {
            if (typeof e === 'number') {
                value = e ? e : 0
            } else {
                value = e.target.value ? e.target.value : 0
            }
        }
        console.log(name, ':', value);
        store.dispatch(changeValueAsync(name, value))
    }
    store.subscribe(() => {
    }); //store状态更新触发

    return (
        <>
            {/* <div className='component-label'>{props.item.title}</div> */}
            <div className='grid'>
                {props.item.columns.map((itm: any, index: any) => {
                    return (
                        <div
                            id={itm.id}
                            key={itm.id}
                            style={{ width: `${95 / (props.item.columns.length)}%` }}
                            className='grid-pre-column'>
                            {
                                itm?.body.length === 0 ? (null) : (itm?.body.map((item: any, index: any) => {
                                    switch (item.type) {
                                        case 'input':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <InputPre onChange={onChange} item={item} data={props.data}></InputPre>
                                                </div>
                                            )
                                        case 'numberInput':
                                            return (
                                                <div id={`${item.id}`}
                                                    key={item.id}
                                                    className={'pre-component-container'}>
                                                    <NumberInputPre onChange={onChange} item={item} data={props.data}></NumberInputPre>
                                                </div>
                                            )
                                        case 'textarea':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <TextAreaPre item={item} data={props.data}></TextAreaPre>
                                                </div>
                                            )
                                        case 'select':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <SelectPre item={item} data={props.data}></SelectPre>
                                                </div>
                                            )
                                        case 'grid':
                                            return (
                                                <div id={`${item.id}`}
                                                    className={'grid-pre-component-container'}
                                                    key={item.id}>
                                                    <PreGrid data={props.data} item={item}></PreGrid>
                                                </div>
                                            )
                                        default: return null
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
