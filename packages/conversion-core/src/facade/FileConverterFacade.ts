import { XMLAdapter } from "../adapters/XMLAdapter";
import { CSVAdapter } from "../adapters/CSVAdapter";
import { YAMLAdapter } from "../adapters/YAMLAdapter";
import { JSONAdapter } from "../adapters/JSONAdapter";
import { IConverter } from "../adapters/IConverter";
import { IFileSource } from "../io/IFileSource";

type SupportedFormat = keyof typeof FileConverterFacade.prototype.adapters;

export class FileConverterFacade {
  public adapters = {
    xml: new XMLAdapter(),
    csv: new CSVAdapter(),
    yaml: new YAMLAdapter(),
    json: new JSONAdapter(),
  };

  private getAdapter(format: SupportedFormat): IConverter {
    const adapter = this.adapters[format];
    if (!adapter) {
      throw new Error(
        `Unsupported format: ${format}. Please provide a valid format.`
      );
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
      if (error instanceof Error) {
        throw new Error(
          `Failed to convert from ${fromFormat} to ${toFormat}: ${error.message}`
        );
      }
      throw new Error("An unknown error occurred during conversion.");
    }
  }

  async convertFile(
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
