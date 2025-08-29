import * as fs from 'fs/promises';
import * as path from 'path';
import { FileConverterFacade } from "./facade/FileConverterFacade";

const facade = new FileConverterFacade();
const inputDir = path.join(__dirname, '..', 'examples/input');
const outputDir = path.join(__dirname, '..', 'examples/output');

async function prepareDirectory(dirPath: string): Promise<void> {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
        }
    }

    await fs.mkdir(dirPath, { recursive: true });
}

async function convertFileToMultipleFormats(
    fileName: string,
    fromFormat: 'csv' | 'json' | 'yaml',
    toFormats: ('csv' | 'json' | 'yaml' | 'xml')[]
): Promise<void> {
    const inputFilePath = path.join(inputDir, fileName);

    try {
        const inputFileContent = await fs.readFile(inputFilePath, 'utf-8');
        console.log(`\n--- Converting ${fromFormat.toUpperCase()} file to multiple formats ---`);

        for (const toFormat of toFormats) {
            const outputFileName = `${path.parse(fileName).name}.${toFormat}`;
            const outputFilePath = path.join(outputDir, outputFileName);
            
            console.log(`\tConverting to ${toFormat.toUpperCase()}...`);
            const convertedContent = await facade.convert(inputFileContent, fromFormat, toFormat);
            await fs.writeFile(outputFilePath, convertedContent);
            console.log(`\t✅ Success! Data written to: ${outputFilePath}`);
        }
    } catch (error) {
        console.error(`❌ Failed to convert ${fileName}:`, (error as Error).message);
    }
}

(async () => {
    await prepareDirectory(outputDir);
    await prepareDirectory(inputDir);

    const sampleData = {
        'csv.csv': `id,name,age\n1,Akash,28\n2,Aman,32\n3,Arpit,25`,
        'json.json': `[{"id":1,"name":"Akash","age":28},{"id":2,"name":"Aman","age":32},{"id":3,"name":"Arpit","age":25}]`,
        'yaml.yaml': `users:\n  - id: 1\n    name: Akash\n    age: 28\n  - id: 2\n    name: Aman\n    age: 32\n  - id: 3\n    name: Arpit\n    age: 25`
    };

    for (const [fileName, content] of Object.entries(sampleData)) {
        await fs.writeFile(path.join(inputDir, fileName), content);
    }

    await convertFileToMultipleFormats('csv.csv', 'csv', ['json', 'yaml', 'xml']);
    await convertFileToMultipleFormats('json.json', 'json', ['csv', 'yaml', 'xml']);
    await convertFileToMultipleFormats('yaml.yaml', 'yaml', ['csv', 'json', 'xml']);
})();