import { createContext } from "react";
import type { SchemaFormat } from "@/lib/schema-options";

export const SchemaFormatContext = createContext<SchemaFormat>("sql");
