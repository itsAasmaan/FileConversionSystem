import { IConverter } from "./IConverter";

export class JSONAdapter implements IConverter {
  public async convert(input: string): Promise<string> {
    let arr: any[];
    try {
      arr = JSON.parse(input);
    } catch (error) {
      console.error("Failed to parse JSON input:", error);
      return "";
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      return "";
    }

    // Function to handle values with commas or quotes
    const escapeCsvValue = (value: any): string => {
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const headers = Object.keys(arr[0]);
    const rows = arr.map((obj) =>
      headers.map((h) => escapeCsvValue(obj[h])).join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  }
}
