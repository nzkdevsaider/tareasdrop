import { Button } from "@/components/ui/button";
import { $CONST } from "@/lib/constants";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const page = async ({ params: { taskId } }: { params: { taskId: string } }) => {
  const supabase = createClient();
  const { data: tasks } = await supabase.from("tasks").select("*");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const getTaskFromId = () => {
    if (!tasks) return null;
    return tasks.find((task) => task.id === taskId);
  };

  if (!user) {
    return redirect($CONST.routes.signIn);
  }

  if (!tasks) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl">¿Quieres aplicar a esta tarea?</p>
      <div className="flex gap-2">
        <p>{getTaskFromId()?.title}</p>
      </div>
      <Button>Aplicar</Button>
    </div>
  );
};

export default page;
