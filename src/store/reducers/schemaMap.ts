import clone from '../../clone'

const schemaMap = new Map()

const page = {
    type: 'page',
    id: 0,
    body: [],
}

const initSchemaMap: any = (schema: any, schemaMap: any) => {
    schemaMap.set(schema.id, schema)
    if (schema.hasOwnProperty('body')) {
        for (let i = 0; i < schema.body.length; i++) {
            initSchemaMap(schema['body'][i], schemaMap)
        }
    }
    if (schema.hasOwnProperty('columns')) {
        for (let i = 0; i < schema['columns'].length; i++) {
            initSchemaMap(schema['columns'][i], schemaMap)
        }
    }
    return schemaMap
} //初始化

function reducer(state = schemaMap, action: any) {
    const schemaMapTmp = state
    const findIndexInSchema = (parent: any, id: number) => {
        for (let i = 0; i < parent.body.length; i++) {
            if (parent.body[i].id === id) {
                return i
            }
        }
        return 0
    }


    switch (action.type) {
        case 'initSchemaMap':
            const newSchemaMap = new Map()
            if (JSON.stringify(action.schema) === '{}') {
                newSchemaMap.set(0, page)
            } else {
                initSchemaMap(action.schema, newSchemaMap)
            }
            return newSchemaMap
        case 'moveSchema':
            {
                const dragItem = action.item
                const dropItem = schemaMapTmp.get(action.dropId)
                // console.log(dropItem);
                if (dragItem.parentId === -1) {  //从左侧拖入
                    // console.log('左侧拖入');

                    if (dropItem.hasOwnProperty('body')) {  //如果drop的位置是容器，则直接将拖拽的组件插入此容器
                        // console.log('拖入容器');

                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.parentId = dropItem.id
                        dropItem.body.push(dragItemTmp)
                        // console.log(dropItem);
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].parentId = dragItemTmp.id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                        // console.log(dropItem);

                    } else {  //如果drop的位置是组件，则将拖拽的组件插入drop的位置
                        // const dropItemPathArr = dropItem.path.split('_')
                        // console.log(dropItemPathArr);
                        // console.log('------------');

                        const dropItemWrap = schemaMapTmp.get(dropItem.parentId)
                        const dropItemIndex = findIndexInSchema(dropItemWrap, dropItem.id)
                        // console.log(dropItemIndex, 'dropItemIndex');
                        // console.log(dropItemWrap);
                        // console.log(findIndexInSchema(dropItemWrap, dropItem.id));
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.parentId = dropItemWrap.id

                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].parentId = dragItemTmp.id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                        dropItemWrap.body.splice(dropItemIndex + 1, 0, dragItemTmp)
                        // console.log(dropItemWrap);
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                    }
                } else {  //中间组件移动
                    // console.log('中间组件移动');
                    // console.log(dragItem.id);
                    // console.log('------------');
                    const getParentIdList: any = (id: number, list: Array<number>) => {
                        const index = schemaMapTmp.get(id)
                        if (index.id === 0) return list
                        list.push(index.parentId)
                        if (index.parentId !== 0) {
                            return getParentIdList(index.parentId, list)
                        } else {
                            return list
                        }
                    }

                    // console.log(dropItem);

                    const dropItemPathArr = getParentIdList(dropItem.id, [])
                    // console.log(dropItemPathArr);

                    // console.log(dropItemPathArr);
                    if (dropItemPathArr.indexOf(dragItem.id) !== -1) {
                        // console.log('父元素拖进子元素');
                        return schemaMapTmp;
                    } //判断是否将父组件拖入子组件，若是则不进行任何操作

                    let dropItemIndex = 0
                    if (!dropItem.hasOwnProperty('body')) {
                        // const dropItemPathArr = dropItem.path.split('_')
                        // console.log(dropItemPathArr);
                        const dropItemWrap = schemaMapTmp.get(dropItem.parentId)
                        // console.log(dropItemWrap);
                        dropItemIndex = findIndexInSchema(dropItemWrap, dropItem.id)
                    }//如果drop的位置不是容器，则先记录下drop的位置(如果在删除原先位置后再去获取drop位置，此时drop的位置会失真)

                    // const dragItemPathArr = dragItem.path.split('_')
                    const dragItemWrap = schemaMapTmp.get(dragItem.parentId)
                    // console.log(dragItemPathArr);
                    // console.log(dragItemWrap);
                    let index = findIndexInSchema(dragItemWrap, dragItem.id)
                    // console.log(index);
                    dragItemWrap.body.splice(index, 1)  //删除原先位置
                    // console.log(dragItemWrap);

                    if (dropItem.hasOwnProperty('body')) {  //如果drop的位置是容器，则直接将拖拽的组件插入此容器
                        const dragItemTmp = clone(dragItem)
                        // console.log(dragItemTmp);
                        // console.log(dropItem);

                        dragItemTmp.parentId = dropItem.id
                        dropItem.body.push(dragItemTmp)
                        // console.log(dropItem);
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].parentId = dragItemTmp.id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                    } else {  //如果drop的位置是组件，则将拖拽的组件插入drop的位置
                        // const dropItemPathArr = dropItem.path.split('_')
                        // console.log(dropItemPathArr);
                        const dropItemWrap = schemaMapTmp.get(dropItem.parentId)
                        if (dropItemWrap.id !== dragItemWrap.id) {
                            dropItemIndex++
                        } //如果是跨容器移动则放置的位置+1使得所有放置都是放置在drop位置的下一个
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.parentId = dropItemWrap.id
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].parentId = dragItemTmp.id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                        dropItemWrap.body.splice(dropItemIndex, 0, dragItemTmp)
                        // console.log(dropItemWrap);
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                    }
                }
            }
            return schemaMapTmp;
        case 'editorSchema':
            {
                const editorSchema = schemaMapTmp.get(action.id)
                // console.log(editorSchema);
                editorSchema[action.item] = action.value
                return schemaMapTmp;
            }
        case 'changeExpression':
            {
                const editorSchema = schemaMapTmp.get(action.id)
                // console.log(editorSchema.expressions);
                // console.log(action.status);
                // console.log(action.value);

                if (!editorSchema.expressions) {
                    if (action.value !== '') {
                        editorSchema.expressions = [`${action.status} when ${action.value}`]
                    }
                } //如果当前不存在表达式
                else {
                    if (action.value === '') {
                        // console.log('delete');

                        for (let i = 0; i < editorSchema.expressions.length; i++) {
                            if (editorSchema.expressions[i].indexOf(action.status) !== -1) {
                                // console.log(i);
                                editorSchema.expressions.splice(i, 1)
                                i--
                            }
                        }
                    } else {
                        let flag = false
                        editorSchema.expressions = editorSchema.expressions.map((item: any) => {
                            if (item.indexOf(action.status) !== -1) {
                                flag = true
                                return `${action.status} when ${action.value}`
                            } else {
                                return item
                            }
                        })
                        if (!flag) {
                            editorSchema.expressions.push(`${action.status} when ${action.value}`)
                        }
                    }
                }
                return schemaMapTmp;
            }
        case 'deleteSchema':
            const deleteItem = schemaMapTmp.get(action.id)
            const deleteItemWrap = schemaMapTmp.get(deleteItem.parentId)
            const deleteItemIndex = findIndexInSchema(deleteItemWrap, deleteItem.id)
            deleteItemWrap.body.splice(deleteItemIndex, 1)
            return schemaMapTmp;
        default:
            return state;
    }
}

export default reducer;
