import { createContext } from "react";
import type { SchemaFormat } from "@/lib/data";

export const SchemaFormatContext = createContext<SchemaFormat>("sql");
