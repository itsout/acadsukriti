import { notFound } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Marks feature removed — route disabled.
  notFound();
  return null;
}
