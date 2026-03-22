export interface IConverter {
  /**
   * Converts data from its native format to a standard JSON string.
   * @param input The data string in its native format (e.g., CSV, XML, YAML).
   * @returns A promise that resolves to a JSON string.
   */
  toJSON(input: string): Promise<string>;

  /**
   * Converts a standard JSON string to the adapter's native format.
   * @param input The JSON string to be converted.
   * @returns A promise that resolves to a string in the adapter's native format.
   */
  fromJSON(input: string): Promise<string>;
}
