import * as path from "path";
import { promises as fs } from "fs";
import { FileConverterFacade } from "./facade/FileConverterFacade";
import { LocalFileSource } from "./io/LocalFileSource";
import { CompressionDecorator } from "./decorators/CompressionDecorator";
import { EncryptionDecorator } from "./decorators/EncryptionDecorator";
import { ValidationDecorator } from "./decorators/ValidationDecorator";
import { CSVAdapter } from "./adapters/CSVAdapter";

const facade = new FileConverterFacade();
const baseDir = path.join(__dirname, "..", "..", "..", "examples");

async function setupDirectory(dirPath: string): Promise<void> {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

async function main(): Promise<void> {
  try {
    const localInputPath = path.join(baseDir, "input", "csv.csv");
    const localOutputPath = path.join(baseDir, "output", "local-output.json");
    const decoratedOutputPath = path.join(
      baseDir,
      "output",
      "decorated-output.txt"
    );

    await setupDirectory(path.dirname(localOutputPath));

    console.log(
      "--- Starting Local CSV -> Local JSON Conversion (Facade only) ---"
    );
    const localInputSource = new LocalFileSource(localInputPath);
    const localOutputSource = new LocalFileSource(localOutputPath);
    await facade.convertFile(
      localInputSource,
      localOutputSource,
      "csv",
      "json"
    );
    console.log(
      "--- Conversion complete. Check 'examples/output/local-output.json' ---"
    );

    console.log(
      "\n--- Testing Decorators (Validation + Compression + Encryption) ---"
    );
    const csvAdapter = new CSVAdapter();
    const decoratedConverter = new EncryptionDecorator(
      new CompressionDecorator(new ValidationDecorator(csvAdapter)),
      "my-secret-key"
    );

    const csvData = await fs.readFile(localInputPath, "utf-8");
    const json = await decoratedConverter.toJSON(csvData);
    console.log("CSV -> JSON (validated):", json);

    const encryptedOutput = await decoratedConverter.fromJSON(json);
    await fs.writeFile(decoratedOutputPath, encryptedOutput, "utf-8");
    console.log("Decorated output written to:", decoratedOutputPath);

    const encryptedData = await fs.readFile(decoratedOutputPath, "utf-8");
    const decryptedJSON = await decoratedConverter.toJSON(encryptedData);
    console.log("Decrypted back to JSON:", decryptedJSON);
  } catch (error) {
    console.error("Conversion process failed:", (error as Error).message);
  }
}

void main();
