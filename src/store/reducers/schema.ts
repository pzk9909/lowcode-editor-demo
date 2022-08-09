
import clone from '../../clone'
import Schema from '../../schemaInterface'

const initialState: Schema = {
    type: 'page',
    id:-1,
    body: []
};

const changeItemById = (schema: any, id: number , item:string,value:string) => {
    for (let key in schema) {
        if (key === 'id' && schema[key] === id) {
            // console.log(schema, '找到了');
            schema[item] = value
            return schema
        }
        if (key === 'body' || key === 'columns') {
            for (let i = 0; i < schema[key].length; i++) {
                changeItemById(schema[key][i], id,item,value)
            }
        }
    }
}

const pushSchemaByWrapId = (schema: any, id: number, item: Schema) => {
    for (let key in schema) {
        if (key === 'id' && schema[key] === id) {
            console.log(schema, '找到了');
            schema.body.push(item)
            return schema
        }
        if (key === 'body' || key === 'columns') {
            for (let i = 0; i < schema[key].length; i++) {
                pushSchemaByWrapId(schema[key][i], id, item)
            }
        }
    }
}



function reducer(state = initialState, action: any) {
    const schemaTmp = clone(state)
    switch (action.type) {
        case 'pushSchema':
            if(JSON.stringify(action.item) !== '{}'){
                console.log(action.item);
                schemaTmp.body.push(action.item)
            }
            return schemaTmp;
        case 'spitSchema':
            console.log(action.oldIndex, '----', action.newIndex);
            if (action.oldIndex > action.newIndex) {
                //利用splice【替换】把oldIndex放到newIndex的位置
                schemaTmp.body.splice(action.newIndex, 0, schemaTmp.body[action.oldIndex]);
                //然后删除原来oldIndex
                schemaTmp.body.splice(action.oldIndex + 1, 1)
            } else if (action.oldIndex < action.newIndex) {
                //当item从前面往后面拖放
                schemaTmp.body.splice(action.newIndex + 1, 0, schemaTmp.body[action.oldIndex]);
                schemaTmp.body.splice(action.oldIndex, 1)
            } else { }
            console.log(schemaTmp.body);
            return schemaTmp;
        case 'editorSchema':
            console.log('editorSchema');
            changeItemById(schemaTmp,action.id,action.item,action.value)
            console.log(schemaTmp);
            return schemaTmp;
        case 'pushSchemaByWrapId':
            console.log('pushSchemaByWrapId');
            console.log(action.wrapId);
            console.log(action.item);
            
            
            pushSchemaByWrapId(schemaTmp, action.wrapId, action.item)
            console.log(schemaTmp);
            return schemaTmp;
        default:
            return state;
    }
}

export default reducer;
