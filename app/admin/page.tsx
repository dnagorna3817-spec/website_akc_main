import type { Metadata } from "next";
import CmsEditor from "./CmsEditor";
export const metadata: Metadata = { title: "AKC CMS — Адміністрування", robots: { index: false, follow: false } };
export default function AdminPage() { return <CmsEditor />; }
