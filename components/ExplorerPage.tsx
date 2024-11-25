import { Database } from "@/lib/database.types";
import TaskCard from "./TaskCard";

const ExplorerPage = ({
  tasks,
}: {
  tasks: Database["public"]["Tables"]["tasks"]["Row"][];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Añadido recientemente</h1>
      <div className="grid grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ExplorerPage;
