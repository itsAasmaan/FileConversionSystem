import { ConverterDecorator } from "./ConverterDecorator";
import { gzipSync, gunzipSync } from "zlib";

/**
 * The CompressionDecorator adds compression and decompression functionality
 * to a converter. It compresses the output data from `fromJSON` and
 * decompresses the input data for `toJSON`.
 */
export class CompressionDecorator extends ConverterDecorator {
  public async toJSON(input: string): Promise<string> {
    let decompressedInput = input;

    // Check if the input is compressed before attempting decompression.
    // A simple heuristic is to check if it's a valid base64 string.
    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(input);
    if (isBase64) {
      try {
        const buffer = Buffer.from(input, "base64");
        // Attempt to decompress; if it fails, it's not compressed data.
        decompressedInput = gunzipSync(buffer).toString("utf-8");
      } catch (error) {
        // If decompression fails, it means the data was not compressed.
        // We can safely ignore the error and proceed with the original input.
        console.warn(
          "Input is not a compressed base64 string. Proceeding with original data."
        );
        decompressedInput = input;
      }
    }

    // Pass the decompressed (or original) data to the wrapped converter
    return this.decoratedConverter.toJSON(decompressedInput);
  }

  public async fromJSON(input: string): Promise<string> {
    try {
      // First, get the converted string from the wrapped converter
      const output = await this.decoratedConverter.fromJSON(input);

      // Then, compress the resulting output and return it as a base64 string
      const compressed = gzipSync(Buffer.from(output, "utf-8"));
      return compressed.toString("base64");
    } catch (error) {
      console.error("Error in CompressionDecorator during fromJSON:", error);
      throw error; // Re-throw the error to be handled by the facade
    }
  }
}
