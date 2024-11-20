"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

const TaskCreator = () => {
  const [deadline, setDeadline] = useState<Date>();
  return (
    <form className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Crear una nueva tarea</h1>
      <Input placeholder="Título" />
      <Input placeholder="Descripción" />
      <Input placeholder="Recompensa" />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !deadline && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {deadline ? (
              format(deadline, "PPP")
            ) : (
              <span>Selecciona una fecha de entrega</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={deadline}
            onSelect={(date) => {
              setDeadline(date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button variant={"default"} type="submit">
        Crear tarea
      </Button>
    </form>
  );
};

export default TaskCreator;
