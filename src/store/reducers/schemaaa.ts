import clone from '../../clone'
import Schema from '../../schemaInterface'
const initialState: Schema = {
    type: 'page',
    id: 0,
    body: [],
};

const map = new Map()
map.set(0, '0')

const changeItemById = (schema: any, id: number, item: string, value: string) => {
    for (let key in schema) {
        if (key === 'id' && schema[key] === id) {
            // console.log(schema, '找到了');
            schema[item] = value
            return schema
        }
        if (key === 'body' || key === 'columns') {
            for (let i = 0; i < schema[key].length; i++) {
                changeItemById(schema[key][i], id, item, value)
            }
        }
    }
}//修改指定ID的组件属性

const pushSchemaByWrapId = (schema: any, id: number, item: Schema) => {
    for (let key in schema) {
        if (key === 'id' && schema[key] === id) {
            console.log(schema, '找到了');
            schema.body.push(item)
            console.log(schema);

            return schema
        }
        if (key === 'body' || key === 'columns') {
            for (let i = 0; i < schema[key].length; i++) {
                pushSchemaByWrapId(schema[key][i], id, item)
            }
        }
    }
} //将组件插入到指定ID的BODY下

const spliceSchemaById = (schema: any, id: number, parentSchema: any) => {
    for (let key in schema) {
        if (key === 'id' && schema[key] === id) {
            console.log(schema, '找到了');
            console.log(parentSchema, '父节点');
            for (let i = 0; i < parentSchema.body.length; i++) {
                console.log('-----');
                console.log(parentSchema.body[i]['id'], schema.id);
                if (parentSchema.body[i]['id'] === schema.id) {
                    parentSchema.body.splice(i, 1)
                }
            }
            return schema
        }
        if (key === 'body' || key === 'columns') {
            parentSchema = schema
            for (let i = 0; i < schema[key].length; i++) {
                spliceSchemaById(schema[key][i], id, parentSchema)
            }
        }
    }
}//移除指定ID的schema

const findSchemaTreeById: any = (schema: any, id: number, treeString: string) => {
    for (let key in schema) {
        // console.log(key, ':', schema[key]);
        if (key === 'id' && schema[key] === id) {
            console.log(schema, '找到了');
        }
        if (key === 'body' || key === 'columns') {
            treeString = '_' + treeString + schema.id
            for (let i = 0; i < schema[key].length; i++) {
                findSchemaTreeById(schema[key][i], id, treeString)
            }
        }
    }
    return treeString
} //根据id遍历获取组件的schema路径

const pushSchemaByItemId = (schema: any, id: number, parentSchema: any, pushItem: any) => {
    let index
    for (let key in schema) {
        if (key === 'id' && schema[key] === id) {
            console.log(schema, '找到了');
            console.log(parentSchema, '父节点');
            for (let i = 0; i < parentSchema.body.length; i++) {
                console.log('-----');
                console.log(parentSchema.body[i]['id'], schema.id);
                if (parentSchema.body[i]['id'] === schema.id) {
                    console.log(i, '------------------');
                    index = i

                    parentSchema.body.splice(index + 1, 0, pushItem)


                }
            }

        }
        if (key === 'body' || key === 'columns') {
            parentSchema = schema
            for (let i = 0; i < schema[key].length; i++) {
                pushSchemaByItemId(schema[key][i], id, parentSchema, pushItem)
            }
        }
    }

}


function reducer(state = initialState, action: any) {
    const schemaTmp = clone(state)
    let item
    switch (action.type) {
        // case 'pushSchema':
        //     if (JSON.stringify(action.item) !== '{}') {
        //         console.log(action.item);
        //         schemaTmp.body.push(action.item)
        //     }
        //     return schemaTmp; 
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
        // case 'spitSchemaById':
        //     console.log('拖拽的元素ID', action.dragItem.id, 'ENTER的元素ID', action.enterId);
        //     let treeString = ''
        //     console.log(schemaTmp);
        //     treeString = findSchemaTreeById(schemaTmp, action.dragItem.id, treeString)
        //     console.log(treeString);
        //     let arr = treeString.split('_')
        //     console.log(arr);
        //     spliceSchemaById(schemaTmp, action.dragItem.id, schemaTmp)
        //     pushSchemaByItemId(schemaTmp, action.enterId, schemaTmp, action.dragItem)
        //     return schemaTmp;
        case 'editorSchema':
            console.log('editorSchema');
            changeItemById(schemaTmp, action.id, action.item, action.value)
            console.log(schemaTmp);
            return schemaTmp;
        case 'pushSchemaByWrapId':
            console.log('pushSchemaByWrapId');
            console.log(action.wrapId);
            console.log(action.item);
            item = action.item
            if (item.type.indexOf('droped') === -1) {
                item.type = item.type.concat('_droped')
            }
            // spliceSchemaById(schemaTmp,item.id,schemaTmp)
            pushSchemaByWrapId(schemaTmp, action.wrapId, action.item)
            console.log(schemaTmp);
            return schemaTmp;
        case 'moveSchemaByWrapId':
            console.log('moveSchemaByWrapId');
            console.log(action.wrapId);
            console.log(action.item);
            item = action.item
            if (item.type.indexOf('droped') === -1) {
                item.type = item.type.concat('_droped')
            }
            spliceSchemaById(schemaTmp, item.id, schemaTmp)
            pushSchemaByWrapId(schemaTmp, action.wrapId, action.item)
            console.log(schemaTmp);
            return schemaTmp;
        default:
            return state;
    }
}

export default reducer;
