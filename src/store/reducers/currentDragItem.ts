// 定义一个状态
import Schema from '../../schemaInterface'

interface InitialState {
    currentDragType:string
}

const initialState: InitialState = {
    currentDragType: '',
};


const currentDragItem:Schema={
    type:'',
    id:-9998,
}

// 利用reducer将store和action串联起来
function reducer(state = initialState, action: any) {
    switch (action.type) {
        case 'setDragType':
            return { currentDragType: action.itemType};
        default:
            return state;
    }
}

export default reducer;
