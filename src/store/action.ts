import Schema from '../schemaInterface'

// 利用action来修改状态

export const setDragType = (itemType: string) => {
    return { type: 'setDragType', itemType: itemType };
};

export const setCurrentDragItem = (item: Schema | {}) => {
    return { type: 'setCurrentDragItem', item: item };
};

// export const pushSchema = (item: object) => {
//     return { type: 'pushSchema', item: item };
// };
export const pushSchema = (dropId: number, item: object) => {
    return { type: 'pushSchema', dropId: dropId, item: item };
};
export const moveSchemaByWrapId = (dropId: number, item: object) => {
    return { type: 'moveSchemaByWrapIdd', dropId: dropId, item: item };
};
export const spitSchema = (oldIndex: number, newIndex: number) => {
    return { type: 'spitSchema', oldIndex: oldIndex, newIndex: newIndex };
};
export const spitSchemaById = (dragItem: Schema, enterId: number) => {
    return { type: 'spitSchemaById', dragItem: dragItem, enterId: enterId };
};
export const editorSchema = (id: number, item: string, value: string) => {
    return { type: 'editorSchema', id: id, item: item, value: value };
};

export const setEditorItemId = (id: number) => {
    return { type: 'setEditorItemId', id: id };
};
