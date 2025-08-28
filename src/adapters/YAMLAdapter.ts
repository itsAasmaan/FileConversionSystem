import { IConverter } from "./IConverter";
import yaml from "js-yaml";

export class YAMLAdapter implements IConverter {
  async convert(input: string): Promise<string> {
    const result = yaml.load(input);
    
    return JSON.stringify(result, null, 2);
  }
}
