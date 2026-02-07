import { motion } from "framer-motion";
import { getTagColor, type Task } from "@/types/kanban";
import { Progress } from "@/components/ui/progress";
import { Clock, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onToggleSubtask: (subtaskId: string) => void;
}

export function TaskCard({ task, onDelete, onToggleSubtask }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const tagColor = getTagColor(task.tag);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2, boxShadow: "0 8px 25px -8px hsl(var(--kanban-card-shadow))" }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-border bg-card p-4 cursor-grab active:cursor-grabbing transition-colors group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-sm text-card-foreground leading-tight pr-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {task.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted -mt-1 -mr-1">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tag */}
      <div className="mb-3">
        <span
          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: `hsl(${tagColor} / 0.12)`,
            color: `hsl(${tagColor})`,
          }}
        >
          {task.tag}
        </span>
      </div>

      {/* Subtasks progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground font-medium">Subtasks</span>
            <span className="text-xs text-muted-foreground">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: `hsl(var(--kanban-progress))` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Footer: due date & priority */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {task.priority === "high" && (
            <span className="h-2 w-2 rounded-full bg-destructive" title="High priority" />
          )}
          {task.priority === "medium" && (
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(35 85% 55%)" }} title="Medium priority" />
          )}
          {task.priority === "low" && (
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(150 50% 50%)" }} title="Low priority" />
          )}
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
