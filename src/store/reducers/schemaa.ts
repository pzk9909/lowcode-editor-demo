
import Item from 'antd/lib/list/Item'
import { map } from 'lodash'
import { act } from 'react-dom/test-utils'
import clone from '../../clone'

const initialState = new Map()

const page = {
    type: 'page',
    id: 0,
    body: [],
    path: '0'
}
initialState.set(0, page)


function reducer(state = initialState, action: any) {
    const schemaTmp = state


    const findIndexInSchema = (parent: any, id: number) => {
        for (let i = 0; i < parent.body.length; i++) {
            if (parent.body[i].id === id) {
                return i
            }
        }
        return 0
    }


    switch (action.type) {

        case 'spitSchema':

            return schemaTmp;

        case 'editorSchema':

            return schemaTmp;
        case 'pushSchema':
            {
                console.log(action.dropId, 'dropId');

                const dropItem = schemaTmp.get(action.dropId)
                console.log(dropItem, 'dropItem');
                console.log(dropItem);

                console.log();
                if (dropItem.hasOwnProperty('body')) {
                    action.item.path = dropItem.path + '_' + action.item.id
                    dropItem.body.push(action.item)
                    schemaTmp.set(action.item.id, action.item)
                    if (action.item.type === 'grid') {
                        for (let i = 0; i < action.item.columns.length; i++) {
                            action.item.columns[i].path = action.item.path + '_' + action.item.columns[i].id
                            schemaTmp.set(action.item.columns[i].id, action.item.columns[i])
                        }
                    }
                } else {

                }
                console.log(dropItem);
                console.log(schemaTmp);
            }
            return schemaTmp;
        case 'moveSchemaByWrapIdd':
            {
                const dragItem = action.item
                const dropItem = schemaTmp.get(action.dropId)

                if (dragItem.path === '') {  //从左侧拖入
                    if (dropItem.hasOwnProperty('body')) {
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItem.path + '_' + dragItemTmp.id
                        dropItem.body.push(dragItemTmp)
                        schemaTmp.set(dragItemTmp.id, dragItemTmp)
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                    } else {
                        const dropItemPathArr = dropItem.path.split('_')
                        console.log(dropItemPathArr);
                        const dropItemWrap = schemaTmp.get(Number(dropItemPathArr[dropItemPathArr.length - 2]))
                        const dropItemIndex = findIndexInSchema(dropItemWrap, dropItem.id)

                        console.log(dropItemIndex, 'dropItemIndex');
                        console.log(dropItemWrap);
                        console.log(findIndexInSchema(dropItemWrap, dropItem.id));
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItemWrap.path + '_' + dragItemTmp.id
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                        dropItemWrap.body.splice(dropItemIndex, 0, dragItemTmp)
                        console.log(dropItemWrap);
                        schemaTmp.set(dragItemTmp.id, dragItemTmp)
                    }
                } else {  //中间组件移动

                    console.log('中间组件移动');



                    console.log(dragItem.id);
                    const dropItemPathArr = dropItem.path.split('_')
                    console.log(dropItemPathArr);
                    if (dropItemPathArr.indexOf(`${dragItem.id}`) !== -1) {

                        console.log('父元素拖进子元素');
                        
                        return schemaTmp;
                    }



                    let dropItemIndex
                    if (!dropItem.hasOwnProperty('body')) {
                        const dropItemPathArr = dropItem.path.split('_')
                        console.log(dropItemPathArr);
                        const dropItemWrap = schemaTmp.get(Number(dropItemPathArr[dropItemPathArr.length - 2]))
                        console.log(dropItemWrap);
                        dropItemIndex = findIndexInSchema(dropItemWrap, dropItem.id)
                    }


                    const dragItemPathArr = dragItem.path.split('_')
                    const dragItemWrap = schemaTmp.get(Number(dragItemPathArr[dragItemPathArr.length - 2]))
                    console.log(dragItemPathArr);
                    console.log(dragItemWrap);
                    let index = findIndexInSchema(dragItemWrap, dragItem.id)
                    console.log(index);
                    dragItemWrap.body.splice(index, 1)  //删除原先位置

                    if (dropItem.hasOwnProperty('body')) {
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItem.path + '_' + dragItemTmp.id
                        dropItem.body.push(dragItemTmp)
                        schemaTmp.set(dragItemTmp.id, dragItemTmp)
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                    } else {
                        const dropItemPathArr = dropItem.path.split('_')
                        console.log(dropItemPathArr);
                        const dropItemWrap = schemaTmp.get(Number(dropItemPathArr[dropItemPathArr.length - 2]))
                        const dragItemTmp = clone(dragItem)
                        dragItemTmp.path = dropItemWrap.path + '_' + dragItemTmp.id
                        if (dragItemTmp.type === 'grid') {
                            for (let i = 0; i < dragItemTmp.columns.length; i++) {
                                dragItemTmp.columns[i].path = dragItemTmp.path + '_' + dragItemTmp.columns[i].id
                                schemaTmp.set(dragItemTmp.columns[i].id, dragItemTmp.columns[i])
                            }
                        }
                        dropItemWrap.body.splice(dropItemIndex, 0, dragItemTmp)
                        console.log(dropItemWrap);
                        schemaTmp.set(dragItemTmp.id, dragItemTmp)
                    }
                }
                return schemaTmp;
            }
        default:
            return state;
    }
}

export default reducer;
