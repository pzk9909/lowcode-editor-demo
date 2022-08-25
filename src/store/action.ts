import Schema from '../schemaInterface'

const deep = (obj: any, args: any) => {
    for (let key in obj) {
        if (obj.hasOwnProperty('type') && obj['type'] === 'Identifier') {
            if (args.indexOf(obj['name']) === -1) {
                if (obj['name'] !== 'check') {
                    args.push(obj['name'])
                }
            }
        }
        if (typeof obj[key] === 'object') {
            deep(obj[key], args)
        }
    }
    return args
}//遍历AST获取参数列表

export const initSchemaMap = (schema: Schema | {}) => {
    return { type: 'initSchemaMap', schema: schema };
};

export const initDataMap = (schemaMap: any, data: any) => {
    return { type: 'initDataMap', schemaMap: schemaMap, data: data };
};

export const changeValue = (name: string, value: any) => {
    return { type: 'changeValue', name: name, value: value };
};

export const changeStatus = (name: string, status: any) => {
    return { type: 'changeStatus', name: name, status: status };
};

export const initDataMapAsync = (schemaMap: any, data: any) => {
    return (dispatch: any) => {
        console.log('initDataMapAsync');
        dispatch(initDataMap(schemaMap, data))
        dispatch(statusUpdateAsync())
    }
}

export const changeValueAsync = (name: string, value: any) => {
    return (dispatch: any) => {
        console.log('changeValueAsync');
        dispatch(changeValue(name, value))
        dispatch(statusUpdateAsync())
    }
}

export const statusUpdateAsync = () => {
    return (dispatch: any, getState: any) => {
        console.log('statusUpdateAsync');
        const dataMapTmp = getState().previewDataMap
        dataMapTmp.forEach(function (item: any) {
            if (item.expressions && item.expressions.length !== 0) {
                let hasChange = false
                item.expressions.map((expression: any) => {
                    const mode = expression.replace(/ /g, '').split('when')  //解析表达式
                    const status = mode[0] //表达式对应的状态
                    let condition = mode[1] //表达式
                    // console.log(condition);
                    const acorn = require("acorn")
                    // console.log(acorn.parse(condition));
                    const args = deep(acorn.parse(condition), [])  //解析表达式获取表达式中涉及的参数
                    // console.log(args, 'args');

                    const argsString = args.join(',')
                    // console.log(argsString, 'argsString');

                    const argsArr = args.map((item: any) => {
                        return dataMapTmp.get(item).value
                    })//生成参数数组

                    // console.log(argsArr);  
                    const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
                    // console.log(argsString);
                    // let functionString = "return await fetch(url,{method:'post',headers:{ 'Content-Type': 'application/json'},body:JSON.stringify({page:a})});"

                    condition = condition.replace(/check/g, 'await check') //将表达式中异步请求加上await


                    // console.log(condition);

                    // await check(b) && await check(a) && a+b>10

                    let functionString =
                        `
                    const check = async(name)=>{
                        const res = await post(url,{
                            num:name
                        })
                        console.log(res.data.data.isTrue,'isTrue')
                        return res?.data?.data?.isTrue
                    }
                    // b = await check(b)
                    // a = await check(a)
                    // const p = await Promise.all([await check(b),await check(a),a>10])
                    // console.log(p)
                    return ${condition}
                        `  //生成函数体
                    const judge = new AsyncFunction(`url,${argsString}`, functionString);
                    judge("http://101.200.234.17/picture/test", ...argsArr).then((res: any) => {
                        console.log(status,res);
                        if (res) {
                            dispatch(changeStatus(item.name, status))
                            item.status = status
                            if (status === 'hidden') {
                                dispatch(changeValue(item.name, null))
                            }
                            hasChange = true
                        } else if (!hasChange) {
                            dispatch(changeStatus(item.name, 'normal'))
                        }
                    });
                })
            }
        });
    }
}

export const initNameArray = (schema: Schema | {}) => {
    return { type: 'initNameArray', schema: schema };
};

export const pushName = (name: string) => {
    return { type: 'pushName', name: name };
};

export const setCurrentDragItem = (item: Schema | {}) => {
    return { type: 'setCurrentDragItem', item: item };
};

export const moveSchema = (dropId: number, item: object) => {
    return { type: 'moveSchema', dropId: dropId, item: item };
};

export const editorSchema = (id: number, item: string, value: string) => {
    return { type: 'editorSchema', id: id, item: item, value: value };
};

export const changeExpression = (id: number, status: string, value: string) => {
    return { type: 'changeExpression', id: id, status: status, value: value };
};

export const setEditorItemId = (id: number, isNew: boolean) => {
    return { type: 'setEditorItemId', id: id, isNew: isNew };
};

export const deleteSchema = (id: number) => {
    return { type: 'deleteSchema', id: id };
};