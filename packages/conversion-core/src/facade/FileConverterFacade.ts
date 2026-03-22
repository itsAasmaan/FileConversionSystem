import { XMLAdapter } from "../adapters/XMLAdapter";
import { CSVAdapter } from "../adapters/CSVAdapter";
import { YAMLAdapter } from "../adapters/YAMLAdapter";
import { JSONAdapter } from "../adapters/JSONAdapter";
import { IConverter } from "../adapters/IConverter";
import { IFileSource } from "../io/IFileSource";
import {
  ConversionCoreError,
  ConversionError,
  UnsupportedFormatError,
} from "../errors";
import { SUPPORTED_FORMATS, SupportedFormat } from "../formats";

export class FileConverterFacade {
  public readonly adapters: Record<SupportedFormat, IConverter> = {
    xml: new XMLAdapter(),
    csv: new CSVAdapter(),
    yaml: new YAMLAdapter(),
    json: new JSONAdapter(),
  };

  public getSupportedFormats(): readonly SupportedFormat[] {
    return SUPPORTED_FORMATS;
  }

  private getAdapter(format: SupportedFormat): IConverter {
    const adapter = this.adapters[format];
    if (!adapter) {
      throw new UnsupportedFormatError(format);
    }
    return adapter;
  }

  public async toJSON(format: SupportedFormat, input: string): Promise<string> {
    const adapter = this.getAdapter(format);
    return adapter.toJSON(input);
  }

  public async fromJSON(
    format: SupportedFormat,
    jsonInput: string
  ): Promise<string> {
    const adapter = this.getAdapter(format);
    return adapter.fromJSON(jsonInput);
  }

  public async convert(
    input: string,
    fromFormat: SupportedFormat,
    toFormat: SupportedFormat
  ): Promise<string> {
    if (fromFormat === toFormat) {
      console.warn(
        `Attempted to convert from ${fromFormat} to ${toFormat}. No conversion necessary.`
      );
      return input;
    }

    try {
      const jsonString = await this.toJSON(fromFormat, input);

      const convertedString = await this.fromJSON(toFormat, jsonString);

      return convertedString;
    } catch (error) {
      if (error instanceof ConversionCoreError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ConversionError(fromFormat, toFormat, error.message);
      }
      throw new ConversionError(
        fromFormat,
        toFormat,
        "An unknown error occurred during conversion."
      );
    }
  }

  public async convertFile(
    inputSource: IFileSource,
    outputSource: IFileSource,
    from: SupportedFormat,
    to: SupportedFormat
  ): Promise<void> {
    const rawInput = await inputSource.read();

    const result = await this.convert(rawInput, from, to);

    await outputSource.write(result);
  }
}
