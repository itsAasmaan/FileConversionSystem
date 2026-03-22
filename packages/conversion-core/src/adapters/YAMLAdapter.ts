import { IConverter } from "./IConverter";
import yaml from "js-yaml";

export class YAMLAdapter implements IConverter {
  public async toJSON(input: string): Promise<string> {
    try {
      const parsedYaml: any = yaml.load(input);
      if (
        parsedYaml &&
        typeof parsedYaml === "object" &&
        !Array.isArray(parsedYaml)
      ) {
        const arrayKey = Object.keys(parsedYaml).find((key) =>
          Array.isArray(parsedYaml[key])
        );
        if (arrayKey) {
          return JSON.stringify(parsedYaml[arrayKey], null, 2);
        }
      }

      return JSON.stringify(parsedYaml, null, 2);
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
      throw new Error("Invalid YAML input provided.");
    }
  }

  public async fromJSON(input: string): Promise<string> {
    try {
      const jsonObj = JSON.parse(input);
      return yaml.dump(jsonObj);
    } catch (error) {
      console.error("Error converting JSON to YAML:", error);
      throw new Error("Invalid JSON input for conversion.");
    }
  }
}
