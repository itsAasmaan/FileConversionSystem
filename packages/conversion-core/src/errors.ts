export class ConversionCoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnsupportedFormatError extends ConversionCoreError {
  constructor(format: string) {
    super(`Unsupported format: ${format}. Please provide a valid format.`);
  }
}

export class ConversionError extends ConversionCoreError {
  constructor(fromFormat: string, toFormat: string, message: string) {
    super(`Failed to convert from ${fromFormat} to ${toFormat}: ${message}`);
  }
}
