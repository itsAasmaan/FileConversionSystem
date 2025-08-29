import { IConverter } from "./IConverter";
import { parseStringPromise, Builder } from "xml2js";

export class XMLAdapter implements IConverter {

  /**
   * Converts a string of XML data to a JSON string.
   * @param input The XML data as a string.
   * @returns A promise that resolves to a JSON string.
   */
  public async toJSON(input: string): Promise<string> {
    if (!input || input.trim() === "") {
        throw new Error("Empty or invalid XML input provided.");
    }
    
    try {
      const result = await parseStringPromise(input, { explicitArray: false, mergeAttrs: true });
      return JSON.stringify(result, null, 2);
    } catch (error) {
      console.error("Error converting XML to JSON:", error);
      throw new Error("Invalid XML input provided.");
    }
  }

  /**
   * Converts a JSON string to an XML string.
   * @param input The JSON data as a string.
   * @returns A promise that resolves to an XML string.
   */
  public async fromJSON(input: string): Promise<string> {
    if (!input || input.trim() === "") {
        throw new Error("Empty or invalid JSON input provided.");
    }
    
    try {
      const jsonObj = JSON.parse(input);
      const builder = new Builder({ headless: true });
      return builder.buildObject(jsonObj);
    } catch (error) {
      console.error("Error converting JSON to XML:", error);
      throw new Error("Invalid JSON input for conversion.");
    }
  }
}