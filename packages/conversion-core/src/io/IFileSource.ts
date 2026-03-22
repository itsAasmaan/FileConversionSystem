export interface IFileSource {
  read(): Promise<string>;

  write(data: string): Promise<void>;
  
  getPath(): string;
}
