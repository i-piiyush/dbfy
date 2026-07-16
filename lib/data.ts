export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  UUID: { bg: "bg-zinc-100", text: "text-zinc-500" },
  String: { bg: "bg-blue-50", text: "text-blue-500" },
  Int: { bg: "bg-orange-50", text: "text-orange-500" },
  Boolean: { bg: "bg-green-50", text: "text-green-600" },
  Float: { bg: "bg-yellow-50", text: "text-yellow-600" },
  DateTime: { bg: "bg-purple-50", text: "text-purple-500" },
  Json: { bg: "bg-pink-50", text: "text-pink-500" },
};

export const DATATYPES = [
  "String",
  "Int",
  "Boolean",
  "Float",
  "DateTime",
  "Json",
  "UUID",
];
