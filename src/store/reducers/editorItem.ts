// 定义一个状态

interface InitialState {
    currentEditorItemId: number
    isNew:boolean
}

const initialState: InitialState = {
    currentEditorItemId: -9999,
    isNew:false
};

// 利用reducer将store和action串联起来
function reducer(state = initialState, action: any) {
    switch (action.type) {
        case 'setEditorItemId':
            return { currentEditorItemId: action.id,isNew:action.isNew };
        default:
            return state;
    }
}

export default reducer;
