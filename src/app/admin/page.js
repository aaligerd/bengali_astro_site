import { getZodiacs } from "@/lib/get-zodiacs";
import AdminPortal from "@/components/AdminPortal";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const zodiacData = await getZodiacs();
  
  return <AdminPortal initialData={zodiacData} />;
}
