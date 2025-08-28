import { IConverter } from "./IConverter";
import { parseStringPromise } from "xml2js";

export class XMLAdapter implements IConverter {
  public async convert(input: string): Promise<string> {
    const result = await parseStringPromise(input);
    
    return JSON.stringify(result, null, 2);
  }
}
