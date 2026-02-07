import { useState, useCallback } from "react";
import type { KanbanData, Task, Column } from "@/types/kanban";

const generateId = () => Math.random().toString(36).substring(2, 10);

const initialData: KanbanData = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: generateId(),
        title: "Create wireframes for landing page",
        description: "Design wireframes for the new landing page",
        tag: "Wireframes",
        tagColor: "258 60% 55%",
        subtasks: [
          { id: generateId(), title: "Research competitors", completed: true },
          { id: generateId(), title: "Sketch layouts", completed: false },
          { id: generateId(), title: "Create hi-fi mockup", completed: false },
        ],
        priority: "high",
        dueDate: "7d",
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Data Entry Cleanup",
        description: "Clean up and validate all data entries",
        tag: "Data Entry",
        tagColor: "20 80% 55%",
        subtasks: [
          { id: generateId(), title: "Audit existing data", completed: true },
          { id: generateId(), title: "Fix duplicates", completed: true },
          { id: generateId(), title: "Validate formats", completed: false },
          { id: generateId(), title: "Update records", completed: false },
          { id: generateId(), title: "Generate report", completed: false },
        ],
        priority: "medium",
        dueDate: "6d",
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Social Media Scheduling",
        description: "Plan and schedule social media posts",
        tag: "Media",
        tagColor: "340 65% 55%",
        subtasks: [
          { id: generateId(), title: "Create content calendar", completed: true },
          { id: generateId(), title: "Design graphics", completed: true },
          { id: generateId(), title: "Write captions", completed: false },
          { id: generateId(), title: "Schedule posts", completed: false },
        ],
        priority: "low",
        dueDate: "1d",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: generateId(),
        title: "Graphic Design Edits",
        description: "Revise graphic design assets based on feedback",
        tag: "Graphic Design",
        tagColor: "290 50% 55%",
        subtasks: [
          { id: generateId(), title: "Review feedback", completed: true },
          { id: generateId(), title: "Update hero banner", completed: false },
          { id: generateId(), title: "Resize for mobile", completed: false },
        ],
        priority: "high",
        dueDate: "3d",
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: "Presentation Slide Design",
        description: "Create presentation slides for the quarterly review",
        tag: "UI Design",
        tagColor: "200 70% 50%",
        subtasks: [
          { id: generateId(), title: "Outline content", completed: true },
          { id: generateId(), title: "Design template", completed: false },
          { id: generateId(), title: "Add data visuals", completed: false },
        ],
        priority: "medium",
        dueDate: "5d",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

export function useKanbanStore() {
  const [columns, setColumns] = useState<KanbanData>(initialData);

  const addTask = useCallback((columnId: string, task: Omit<Task, "id" | "createdAt">) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                { ...task, id: generateId(), createdAt: new Date().toISOString() },
              ],
            }
          : col
      )
    );
  }, []);

  const moveTask = useCallback(
    (sourceColId: string, destColId: string, sourceIndex: number, destIndex: number) => {
      setColumns((prev) => {
        const newCols = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
        const sourceCol = newCols.find((c) => c.id === sourceColId);
        const destCol = newCols.find((c) => c.id === destColId);
        if (!sourceCol || !destCol) return prev;

        const [moved] = sourceCol.tasks.splice(sourceIndex, 1);
        destCol.tasks.splice(destIndex, 0, moved);
        return newCols;
      });
    },
    []
  );

  const deleteTask = useCallback((columnId: string, taskId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      )
    );
  }, []);

  const toggleSubtask = useCallback(
    (columnId: string, taskId: string, subtaskId: string) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((t) =>
                  t.id === taskId
                    ? {
                        ...t,
                        subtasks: t.subtasks.map((s) =>
                          s.id === subtaskId ? { ...s, completed: !s.completed } : s
                        ),
                      }
                    : t
                ),
              }
            : col
        )
      );
    },
    []
  );

  return { columns, addTask, moveTask, deleteTask, toggleSubtask };
}
