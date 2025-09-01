import { IConverter } from "./IConverter";

export class JSONAdapter implements IConverter {
  /**
   * Converts a string to JSON. Since the adapter's native format is JSON,
   * this method validates the input and returns it, effectively acting as a passthrough.
   * @param input The JSON string to be validated.
   * @returns A Promise that resolves to the formatted JSON string.
   */
  public async toJSON(input: string): Promise<string> {
    try {
      const jsonObj = JSON.parse(input);
      return JSON.stringify(jsonObj, null, 2);
    } catch (error) {
      console.error("Error: Invalid JSON input provided to JSONAdapter.");
      throw new Error("Invalid JSON input for conversion.");
    }
  }

  /**
   * Converts a JSON string to JSON. This method is the reverse of toJSON,
   * and for the JSONAdapter, it also acts as a passthrough.
   * @param input The JSON string to be formatted.
   * @returns A Promise that resolves to the formatted JSON string.
   */
  public async fromJSON(input: string): Promise<string> {
    try {
      const jsonObj = JSON.parse(input);
      return JSON.stringify(jsonObj, null, 2);
    } catch (error) {
      console.error("Error: Invalid JSON input provided to JSONAdapter.");
      throw new Error("Invalid JSON input for conversion.");
    }
  }
}
