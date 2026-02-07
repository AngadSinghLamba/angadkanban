export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  subtasks: Subtask[];
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export type KanbanData = Column[];

export const TAG_COLORS: Record<string, string> = {
  "Wireframes": "258 60% 55%",
  "Data Entry": "20 80% 55%",
  "Media": "340 65% 55%",
  "Design": "170 60% 40%",
  "Graphic Design": "290 50% 55%",
  "UI Design": "200 70% 50%",
  "Development": "150 60% 40%",
  "Marketing": "30 80% 50%",
  "Research": "230 60% 55%",
  "Bug Fix": "0 70% 55%",
};

export const getTagColor = (tag: string): string => {
  return TAG_COLORS[tag] || "258 60% 55%";
};
