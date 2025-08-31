import * as path from 'path';
import { promises as fs } from 'fs';
import { FileConverterFacade } from "./facade/FileConverterFacade";
import { LocalFileSource } from "./io/LocalFileSource";
import { S3FileSource } from "./io/S3FileSource";

const facade = new FileConverterFacade();
const baseDir = path.join(__dirname, '..', 'examples');

async function setupDirectory(dirPath: string): Promise<void> {
    await fs.rm(dirPath, { recursive: true, force: true });
    await fs.mkdir(dirPath, { recursive: true });
}

(async () => {
    try {
        const localInputPath = path.join(baseDir, 'input', 'csv.csv');
        const localOutputPath = path.join(baseDir, 'output', 'local-output.json');
        
        await setupDirectory(path.dirname(localOutputPath));
        
        console.log("--- Starting Local CSV -> Local JSON Conversion ---");
        const localInputSource = new LocalFileSource(localInputPath);
        const localOutputSource = new LocalFileSource(localOutputPath);
        await facade.convertFile(localInputSource, localOutputSource, 'csv', 'json');
        console.log("--- Conversion complete. Check 'examples/output/local-output.json' ---"); 
    } catch (error) {
        console.error("Conversion process failed:", (error as Error).message);
    }
})();