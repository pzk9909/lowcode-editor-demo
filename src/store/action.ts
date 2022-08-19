import Schema from '../schemaInterface'

// 利用action来修改状态

export const initSchemaMap = (schema: Schema | {}) => {
    return { type: 'initSchemaMap', schema: schema };
};

export const initNameArray = (schema: Schema | {}) => {
    return { type: 'initNameArray', schema: schema };
};

export const pushName = (name:string) => {
    return { type: 'pushName', name: name };
};


export const setCurrentDragItem = (item: Schema | {}) => {
    return { type: 'setCurrentDragItem', item: item };
};

export const moveSchema = (dropId: number, item: object) => {
    return { type: 'moveSchema', dropId: dropId, item: item };
};


export const editorSchema = (id: number, item: string, value: string) => {
    return { type: 'editorSchema', id: id, item: item, value: value };
};

export const setEditorItemId = (id: number,isNew:boolean) => {
    return { type: 'setEditorItemId', id: id,isNew:isNew };
};

export const deleteSchema = (id: number) => {
    return { type: 'deleteSchema', id: id };
};