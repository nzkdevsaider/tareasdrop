"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import CurrencyInput from "./ui/currency-input";
import { Label } from "./ui/label";
import { createTaskAction } from "@/app/actions";
import { toast } from "sonner";

const TaskCreator = () => {
  const [deadline, setDeadline] = useState<Date>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reward, setReward] = useState<number>(0);

  const handleChangeReward = (value: number) => {
    setReward(value);
  };

  return (
    <form
      className="flex flex-col gap-4"
      action={() =>
        createTaskAction(title, description, reward, deadline)
          .then(() => {
            toast("Tarea creada exitosamente");
          })
          .catch((error) => {
            toast(`Ocurrió un error al crear la tarea: ${error.message}`);
          })
      }
    >
      <h1 className="text-4xl font-bold">Crear una nueva tarea</h1>
      <Label>Título</Label>
      <Input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Label>Descripción</Label>
      <Input
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <CurrencyInput
        label="Recompensa"
        value={reward}
        onChange={handleChangeReward}
        prefix="$"
        placeholder="0.00"
      />
      <Label>Fecha de entrega</Label>
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
        <PlusIcon />
        Crear tarea
      </Button>
    </form>
  );
};

export default TaskCreator;
