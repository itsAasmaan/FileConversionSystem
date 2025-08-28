import { IConverter } from './IConverter';

export class CSVAdapter implements IConverter {
    public async convert(data: string): Promise<string> {
        const lines = data.trim().split('\n');
        if (lines.length === 0) {
            return '[]';
        }

        const headers = lines[0].split(',');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const entry: any = {};
            
            headers.forEach((header, index) => {
                entry[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            result.push(entry);
        }

        return JSON.stringify(result, null, 2);
    }
}
