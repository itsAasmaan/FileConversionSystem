export interface IConverter {
    convert(data: string): Promise<string>;
}