import { ConverterDecorator } from "./ConverterDecorator";

/**
 * The ValidationDecorator adds JSON validation logic to a converter.
 * It ensures that the JSON data passed between converters is valid
 * before proceeding with the conversion.
 */
export class ValidationDecorator extends ConverterDecorator {
  public async toJSON(input: string): Promise<string> {
    const json = await this.decoratedConverter.toJSON(input);
    this.validate(json);
    return json;
  }

  public async fromJSON(input: string): Promise<string> {
    this.validate(input);
    return this.decoratedConverter.fromJSON(input);
  }

  /**
   * Validates if the given string is a valid JSON.
   * @param json The string to validate.
   * @throws {Error} if the string is not valid JSON.
   */
  private validate(json: string): void {
    try {
      JSON.parse(json);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Validation failed: Not valid JSON. Original error: ${error.message}`
        );
      }
      throw new Error("Validation failed due to an unknown error.");
    }
  }
}
