// 定义一个状态
import Schema from '../../schemaInterface'


const currentDragItem: Schema = {
    type: '',
    id: -9998,
}

// 利用reducer将store和action串联起来
function reducer(state = currentDragItem, action: any) {
    switch (action.type) {
        case 'setCurrentDragItem':
            return action.item;
        default:
            return state;
    }
}

export default reducer;
