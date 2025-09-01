import { ConverterDecorator } from "./ConverterDecorator";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export class EncryptionDecorator extends ConverterDecorator {
  private key: Buffer;

  constructor(converter: any, key: string) {
    // Calling the base class constructor with the correct type
    super(converter);
    // Ensure the key is exactly 32 bytes for AES-256
    this.key = Buffer.from(key.padEnd(32, "0").slice(0, 32));
  }

  async toJSON(input: string): Promise<string> {
    // Only attempt to decrypt if the input looks like our encrypted format
    if (input.includes(":")) {
      try {
        const [ivHex, encryptedHex] = input.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const encryptedBuffer = Buffer.from(encryptedHex, "hex");
        const decipher = createDecipheriv("aes-256-cbc", this.key, iv);
        const decrypted = Buffer.concat([
          decipher.update(encryptedBuffer),
          decipher.final(),
        ]);

        // Pass the decrypted data to the wrapped converter
        return this.decoratedConverter.toJSON(decrypted.toString("utf-8"));
      } catch (error) {
        // If decryption fails, the data was likely not encrypted, or the key is wrong.
        // Proceed with the original input string.
        console.warn(
          "Input is not a valid encrypted string. Proceeding with original data."
        );
        return this.decoratedConverter.toJSON(input);
      }
    }

    // If the input doesn't contain a colon, assume it's unencrypted
    return this.decoratedConverter.toJSON(input);
  }

  async fromJSON(input: string): Promise<string> {
    try {
      // Get the output from the wrapped converter
      const output = await this.decoratedConverter.fromJSON(input);

      const iv = randomBytes(16);
      const cipher = createCipheriv("aes-256-cbc", this.key, iv);
      const encrypted = Buffer.concat([
        cipher.update(output, "utf-8"),
        cipher.final(),
      ]);

      // Return the encrypted result in a consistent format: iv:encryptedData
      return iv.toString("hex") + ":" + encrypted.toString("hex");
    } catch (error) {
      console.error("Error in EncryptionDecorator during fromJSON:", error);
      throw error;
    }
  }
}
