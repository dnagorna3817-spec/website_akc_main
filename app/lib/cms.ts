import { unstable_noStore as noStore } from "next/cache";
/** Public read-only CMS content. Falls back to code defaults if not configured. */
export async function cmsText(key: string, fallback: string): Promise<string> {
 noStore();
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!anon) return fallback;
 try {
  const response=await fetch(url+"/rest/v1/cms_content?select=value&key=eq."+encodeURIComponent(key),{headers:{apikey:anon,Authorization:"Bearer "+anon},cache:"no-store",signal:AbortSignal.timeout(2500)});
  if(!response.ok) return fallback;
  const rows=await response.json() as {value:string}[];
  return rows[0]?.value||fallback;
 }catch{return fallback;}
}
