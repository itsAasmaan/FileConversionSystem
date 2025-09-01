import { IConverter } from "../adapters/IConverter";

/**
 * The ConverterDecorator is an abstract base class for all decorators.
 * It implements the IConverter interface and contains a reference
 * to another IConverter object. This allows it to wrap other converters
 * to add new behavior dynamically.
 */
export abstract class ConverterDecorator implements IConverter {
  protected decoratedConverter: IConverter;

  constructor(converter: IConverter) {
    if (!converter) {
      throw new Error("A decorator must wrap a valid IConverter instance.");
    }
    this.decoratedConverter = converter;
  }

  /**
   * Delegates the conversion to the wrapped object. This method is abstract
   * to force concrete decorators to implement their own logic for this step.
   * @param input The data string to convert.
   * @returns A promise that resolves to the converted string.
   */
  public abstract toJSON(input: string): Promise<string>;

  /**
   * Delegates the conversion from JSON to the wrapped object. This method is abstract
   * to force concrete decorators to implement their own logic for this step.
   * @param input The JSON string to convert.
   * @returns A promise that resolves to the converted string.
   */
  public abstract fromJSON(input: string): Promise<string>;
}
