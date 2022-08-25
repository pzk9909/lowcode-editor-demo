// 定义一个状态
import Schema from '../../schemaInterface'
const dataMap = new Map()
// 利用reducer将store和action串联起来
const deep = (obj: any, args: any) => {
    for (let key in obj) {
        if (obj.hasOwnProperty('type') && obj['type'] === 'Identifier') {
            if (args.indexOf(obj['name']) === -1) {
                args.push(obj['name'])
            }
        }
        if (typeof obj[key] === 'object') {
            deep(obj[key], args)
        }
    }
    return args
}

function reducer(state = dataMap, action: any) {
    const dataMapTmp = state
    switch (action.type) {
        case 'initDataMap':
            const schemaMap = action.schemaMap
            const initData = action.data
            // console.log(initData);
            const newDataMap = new Map()
            schemaMap.forEach(function (item: Schema) {
                if (!(item.hasOwnProperty('body') || item.hasOwnProperty('columns'))) {
                    let data = {
                        name: item.name,
                        type: item.type,
                        status: 'normal',
                        value: initData[item.name!] ? initData[item.name!] : null,
                        expressions: item.expressions
                    }
                    newDataMap.set(item.name, data)
                }
            });
            console.log(newDataMap);
            return newDataMap;
        case 'changeValue':
            {
                const changeItem = dataMapTmp.get(action.name)
                changeItem.value = action.value
                return dataMapTmp
            }
        case 'changeStatus':
            {
                const changeItem = dataMapTmp.get(action.name)
                changeItem.status = action.status
                return dataMapTmp
            }
        default:
            return state;
    }
}

export default reducer;
