const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  FileConverterFacade,
  SUPPORTED_FORMATS,
  UnsupportedFormatError,
} = require("../dist");

const fixtureDir = path.join(__dirname, "fixtures");

function readFixture(name) {
  return fs.readFileSync(path.join(fixtureDir, name), "utf8");
}

test("exposes the supported formats list", () => {
  const facade = new FileConverterFacade();

  assert.deepEqual(facade.getSupportedFormats(), SUPPORTED_FORMATS);
});

test("converts CSV to JSON using fixture data", async () => {
  const facade = new FileConverterFacade();
  const csv = readFixture("sample.csv");
  const output = await facade.convert(csv, "csv", "json");

  assert.deepEqual(JSON.parse(output), JSON.parse(readFixture("sample.json")));
});

test("converts YAML to JSON using fixture data", async () => {
  const facade = new FileConverterFacade();
  const yaml = readFixture("sample.yaml");
  const output = await facade.convert(yaml, "yaml", "json");

  assert.deepEqual(JSON.parse(output), JSON.parse(readFixture("sample.json")));
});

test("converts JSON to CSV with expected headers and rows", async () => {
  const facade = new FileConverterFacade();
  const json = readFixture("sample.json");
  const output = await facade.convert(json, "json", "csv");

  assert.match(output, /^"id","name","role"/m);
  assert.match(output, /"1","Ada","Engineer"/m);
  assert.match(output, /"2","Linus","Architect"/m);
});

test("converts XML to JSON preserving the document structure", async () => {
  const facade = new FileConverterFacade();
  const xml = readFixture("sample.xml");
  const output = await facade.convert(xml, "xml", "json");

  assert.deepEqual(JSON.parse(output), {
    root: {
      item: [
        { id: "1", name: "Ada", role: "Engineer" },
        { id: "2", name: "Linus", role: "Architect" },
      ],
    },
  });
});

test("throws a typed unsupported format error", async () => {
  const facade = new FileConverterFacade();

  await assert.rejects(
    facade.convert("{}", "json", "toml"),
    UnsupportedFormatError
  );
});
