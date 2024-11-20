"use client";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { $CONST } from "@/lib/constants";
import Link from "next/link";

const OnboardingPage = () => {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="text-4xl font-bold">Gracias por registrarte.</h1>
      <h2>¿Cómo te gustaría empezar?</h2>
      <div className="flex flex-col gap-4">
        <Link href={$CONST.routes.createtask}>
          <Button className="flex items-center gap-2 w-full">
            Crear una tarea
          </Button>
        </Link>
        <Link href={$CONST.routes.explorer}>
          <Button
            onClick={() => redirect($CONST.routes.explorer)}
            className="flex items-center gap-2 w-full"
          >
            Explorar tareas
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OnboardingPage;
