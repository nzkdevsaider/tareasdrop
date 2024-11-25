"use client";
import { Database } from "@/lib/database.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { $CONST } from "@/lib/constants";

const TaskCard = ({
  task,
}: {
  task: Database["public"]["Tables"]["tasks"]["Row"];
}) => {
  const [loading, setLoading] = useState(true);
  const [canApply, setCanApply] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const canUserApply = useCallback(async () => {
    try {
      const user = await getUser();

      if (user?.user?.id === task.creator_id) {
        return false;
      }

      return true;
    } catch (error) {}
  }, [getUser, task]);

  useEffect(() => {
    canUserApply().then((result) => setCanApply(result ?? false));
  }, [canUserApply]);

  return (
    <Card className="max-w-xl w-[25rem]">
      <CardHeader className="flex justify-between flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </div>
        <div className="flex gap-2 flex-col">
          <p>Recompensa de ${task.budget}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>Ver detalles</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
                <DialogDescription>{task.description}</DialogDescription>
              </DialogHeader>
              <p>Recompensa de ${task.budget}</p>
              <p>
                Plazo máximo de entrega{" "}
                {new Date(task.deadline).toLocaleDateString()}
              </p>
              <p>Estado: {task.status}</p>
              <p>
                Creado el{" "}
                {task.created_at
                  ? new Date(task.created_at).toLocaleDateString()
                  : "Fecha no disponible"}
              </p>
              <p>
                Última vez actualizado el{" "}
                {task.updated_at
                  ? new Date(task.updated_at).toLocaleDateString()
                  : "Fecha no disponible"}
              </p>
            </DialogContent>
          </Dialog>
          <Button
            disabled={loading || !canApply}
            onClick={() => {
              router.push(`${$CONST.routes.apply}/${task.id}`);
            }}
          >
            {loading ? "Cargando..." : canApply ? "Postularse" : "No permitido"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center gap-3">
          <p className="text-sm">
            Plazo máximo de entrega{" "}
            {new Date(task.deadline).toLocaleDateString()} (faltan{" "}
            {Math.floor(
              (new Date(task.deadline).getTime() - Date.now()) / 86400000
            )}{" "}
            días)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
