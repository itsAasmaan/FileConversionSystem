import { CSVAdapter } from "./adapters/CSVAdapter";
import { JSONAdapter } from "./adapters/JSONAdapter";
import { XMLAdapter } from "./adapters/XMLAdapter";
import { YAMLAdapter } from "./adapters/YAMLAdapter";

async function run() {
  const csvInput = `id,name,age
1,Akash,24
2,Harry,25`;

  const jsonInput = JSON.stringify([
    { id: 1, name: "Akash", age: 24 },
    { id: 2, name: "Harry", age: 25 },
  ]);

  const xmlInput = `<person><id>1</id><name>Akash</name><age>24</age></person>`;

  const yamlInput = `
id: 1
name: Akash
age: 24
`;

  const csvConverter = new CSVAdapter();
  console.log("CSV → JSON:\n", await csvConverter.convert(csvInput));

  const jsonConverter = new JSONAdapter();
  console.log("JSON → CSV:\n", await jsonConverter.convert(jsonInput));

  const xmlConverter = new XMLAdapter();
  console.log("XML → JSON:\n", await xmlConverter.convert(xmlInput));

  const yamlConverter = new YAMLAdapter();
  console.log("YAML → JSON:\n", await yamlConverter.convert(yamlInput));
}

run();
