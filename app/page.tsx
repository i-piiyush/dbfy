import type { Metadata } from "next";
import LandingExperience from "@/components/LandingExperience";

export const metadata: Metadata = {
  title: "DBFY — Make your database schema make sense",
  description: "Design database schemas visually, connect fields, and copy generated SQL or Prisma code.",
};

export default function HomePage() {
  return <LandingExperience />;
}
