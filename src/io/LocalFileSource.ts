import { promises as fs } from "fs";
import { IFileSource } from "./IFileSource";

export class LocalFileSource implements IFileSource {
  constructor(private path: string) {}

  async read(): Promise<string> {
    return fs.readFile(this.path, "utf-8");
  }

  async write(data: string): Promise<void> {
    await fs.writeFile(this.path, data, "utf-8");
  }

  getPath(): string {
    return this.path;
  }
}
