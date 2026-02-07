import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { Column } from "@/types/kanban";
import { TaskCard } from "@/components/TaskCard";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  column: Column;
  onAddTask: () => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function KanbanColumn({ column, onAddTask, onDeleteTask, onToggleSubtask }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[320px] max-w-[360px] w-full">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {column.title}
          </h2>
          <Badge
            variant="secondary"
            className="h-5 min-w-[20px] flex items-center justify-center rounded-md text-xs font-semibold"
            style={{
              backgroundColor: "hsl(var(--primary) / 0.12)",
              color: "hsl(var(--primary))",
            }}
          >
            {column.tasks.length}
          </Badge>
        </div>
        <button
          onClick={onAddTask}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 flex-1 rounded-xl p-2 min-h-[200px] transition-colors duration-200 ${
              snapshot.isDraggingOver
                ? "bg-accent/60 ring-2 ring-primary/20"
                : "bg-transparent"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {column.tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? "z-50" : ""}
                    >
                      <TaskCard
                        task={task}
                        onDelete={() => onDeleteTask(task.id)}
                        onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
