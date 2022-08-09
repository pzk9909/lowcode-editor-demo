export default interface Schema {
    type: string,
    body?: Array<Schema>
    id: number
    name?: string
    title?: string
    options?:Array<any>
    columns?:Array<any>
}