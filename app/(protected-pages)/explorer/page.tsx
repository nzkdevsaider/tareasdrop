import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { $CONST } from "@/lib/constants";
import ExplorerPage from "@/components/ExplorerPage";

export default async function ProtectedPage() {
  const supabase = createClient();
  const { data: tasks } = await supabase.from("tasks").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect($CONST.routes.signIn);
  }

  if (!tasks) {
    return <div>Cargando...</div>;
  }

  return <ExplorerPage tasks={tasks} />;
}
