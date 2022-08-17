import clone from '../../clone'

const schemaMap = new Map()

const page = {
    type: 'page',
    id: 0,
    body: [],
    path: '0'
}
schemaMap.set(0, page)

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
        case 'moveSchema':
            {
                const dragItem = action.item
                const dropItem = schemaMapTmp.get(action.dropId)
                if (dragItem.path === '') {  //从左侧拖入
                    if (dropItem.hasOwnProperty('body')) {  //如果drop的位置是容器，则直接将拖拽的组件插入此容器
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItem.path + '_' + dragItemTmp.id
                        dropItem.body.push(dragItemTmp)
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                    } else {  //如果drop的位置是组件，则将拖拽的组件插入drop的位置
                        const dropItemPathArr = dropItem.path.split('_')
                        console.log(dropItemPathArr);
                        const dropItemWrap = schemaMapTmp.get(Number(dropItemPathArr[dropItemPathArr.length - 2]))
                        const dropItemIndex = findIndexInSchema(dropItemWrap, dropItem.id)
                        console.log(dropItemIndex, 'dropItemIndex');
                        console.log(dropItemWrap);
                        console.log(findIndexInSchema(dropItemWrap, dropItem.id));
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItemWrap.path + '_' + dragItemTmp.id
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                        dropItemWrap.body.splice(dropItemIndex, 0, dragItemTmp)
                        console.log(dropItemWrap);
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                    }
                } else {  //中间组件移动

                    // console.log('中间组件移动');
                    // console.log(dragItem.id);
                    const dropItemPathArr = dropItem.path.split('_')
                    // console.log(dropItemPathArr);
                    if (dropItemPathArr.indexOf(`${dragItem.id}`) !== -1) {
                        // console.log('父元素拖进子元素');
                        return schemaMapTmp;
                    } //判断是否将父组件拖入子组件，若是则不进行任何操作



                    let dropItemIndex
                    if (!dropItem.hasOwnProperty('body')) {  
                        const dropItemPathArr = dropItem.path.split('_')
                        console.log(dropItemPathArr);
                        const dropItemWrap = schemaMapTmp.get(Number(dropItemPathArr[dropItemPathArr.length - 2]))
                        console.log(dropItemWrap);
                        dropItemIndex = findIndexInSchema(dropItemWrap, dropItem.id)
                    }//如果drop的位置不是容器，则先记录下drop的位置(如果在删除原先位置后再去获取drop位置，此时drop的位置会失真)

                    const dragItemPathArr = dragItem.path.split('_')
                    const dragItemWrap = schemaMapTmp.get(Number(dragItemPathArr[dragItemPathArr.length - 2]))
                    console.log(dragItemPathArr);
                    console.log(dragItemWrap);
                    let index = findIndexInSchema(dragItemWrap, dragItem.id)
                    console.log(index);
                    dragItemWrap.body.splice(index, 1)  //删除原先位置

                    if (dropItem.hasOwnProperty('body')) {  //如果drop的位置是容器，则直接将拖拽的组件插入此容器
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItem.path + '_' + dragItemTmp.id
                        dropItem.body.push(dragItemTmp)
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                    } else {  //如果drop的位置是组件，则将拖拽的组件插入drop的位置
                        const dropItemPathArr = dropItem.path.split('_')
                        console.log(dropItemPathArr);
                        const dropItemWrap = schemaMapTmp.get(Number(dropItemPathArr[dropItemPathArr.length - 2]))
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItemWrap.path + '_' + dragItemTmp.id
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaMapTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                        dropItemWrap.body.splice(dropItemIndex, 0, dragItemTmp)
                        console.log(dropItemWrap);
                        schemaMapTmp.set(dragItemTmp.id, dragItemTmp)
                    }
                }
                return schemaMapTmp;
            }

        case 'editorSchema':
            const editorSchema = schemaMapTmp.get(action.id)
            console.log(editorSchema);
            editorSchema[action.item] = action.value
            
            return schemaMapTmp;
        case 'deleteSchema':
            const deleteItem = schemaMapTmp.get(action.id)
            const deleteItemPathArr = deleteItem.path.split('_')
            const deleteItemWrap = schemaMapTmp.get(Number(deleteItemPathArr[deleteItemPathArr.length - 2]))
            const deleteItemIndex = findIndexInSchema(deleteItemWrap,deleteItem.id)
            deleteItemWrap.body.splice(deleteItemIndex,1)
            return schemaMapTmp;
        default:
            return state;
    }
}

export default reducer;
