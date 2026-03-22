import { IFileSource } from "./IFileSource";

const fakeS3Bucket: Record<string, string> = {};

export class S3FileSource implements IFileSource {
  constructor(private bucket: string, private key: string) {}

  public async read(): Promise<string> {
    if (!fakeS3Bucket[this.key]) {
      throw new Error(`File not found in S3: ${this.key}`);
    }
    return fakeS3Bucket[this.key];
  }

  public async write(data: string): Promise<void> {
    fakeS3Bucket[this.key] = data;
  }

  public getPath(): string {
    return `s3://${this.bucket}/${this.key}`;
  }
}
