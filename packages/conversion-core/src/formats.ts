export const SUPPORTED_FORMATS = ["csv", "json", "xml", "yaml"] as const;

export type SupportedFormat = (typeof SUPPORTED_FORMATS)[number];

export function isSupportedFormat(value: string): value is SupportedFormat {
  return (SUPPORTED_FORMATS as readonly string[]).includes(value);
}
