import { IConverter } from './IConverter';
import csvtojson from 'csvtojson';
import { Parser } from 'json2csv';

export class CSVAdapter implements IConverter {
    public async toJSON(input: string): Promise<string> {
        try {
            const result = await csvtojson().fromString(input);
            return JSON.stringify(result, null, 2);
        } catch (error) {
            console.error("Error converting CSV to JSON:", error);
            throw new Error("Invalid CSV input provided.");
        }
    }

    public async fromJSON(input: string): Promise<string> {
        try {
            const jsonObj = JSON.parse(input);

            if (!Array.isArray(jsonObj) || jsonObj.length === 0) {
                return "";
            }
            
            const fields = Object.keys(jsonObj[0]);
            
            const parser = new Parser({ fields });
            const csv = parser.parse(jsonObj);
            
            return csv;
        } catch (error) {
            console.error("Error converting JSON to CSV:", error);
            throw new Error("Invalid JSON input provided.");
        }
    }
}