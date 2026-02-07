import { useState, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "@/components/KanbanColumn";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import type { Task } from "@/types/kanban";

export function KanbanBoard() {
  const { columns, addTask, moveTask, deleteTask, toggleSubtask } = useKanbanStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string>("todo");

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      moveTask(source.droppableId, destination.droppableId, source.index, destination.index);
    },
    [moveTask]
  );

  const handleOpenAddDialog = (columnId: string) => {
    setActiveColumnId(columnId);
    setAddDialogOpen(true);
  };

  const handleAddTask = (task: Omit<Task, "id" | "createdAt">) => {
    addTask(activeColumnId, task);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 px-1">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={() => handleOpenAddDialog(column.id)}
              onDeleteTask={(taskId) => deleteTask(column.id, taskId)}
              onToggleSubtask={(taskId, subtaskId) => toggleSubtask(column.id, taskId, subtaskId)}
            />
          ))}
        </div>
      </DragDropContext>

      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddTask}
      />
    </>
  );
}
