// 定义一个状态


const initialState = <any>[]



const initSchemaMap: any = (schema: any, nameArray: Array<string>) => {

    if (schema.hasOwnProperty('name')) {
        nameArray.push(schema.name)
    }
    if (schema.hasOwnProperty('body')) {
        for (let i = 0; i < schema.body.length; i++) {
            initSchemaMap(schema['body'][i], nameArray)
        }
    }
    if (schema.hasOwnProperty('columns')) {
        for (let i = 0; i < schema['columns'].length; i++) {
            initSchemaMap(schema['columns'][i], nameArray)
        }
    }
    return nameArray
} //根据id遍历获取组件的schema路径


// 利用reducer将store和action串联起来
function reducer(state = initialState, action: any) {
    const nameArrayTmp = state
    switch (action.type) {
        case 'initNameArray':
            const newNameArray: any = []
            initSchemaMap(action.schema, newNameArray)
            return newNameArray
        case 'pushName':
            nameArrayTmp.push(action.name)
            return nameArrayTmp
        default:
            return state;
    }
}

export default reducer;
