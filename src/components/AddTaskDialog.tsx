import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, Subtask } from "@/types/kanban";
import { TAG_COLORS } from "@/types/kanban";
import { Plus, X } from "lucide-react";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (task: Omit<Task, "id" | "createdAt">) => void;
}

export function AddTaskDialog({ open, onOpenChange, onAdd }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Design");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState<{ title: string }[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  const tags = Object.keys(TAG_COLORS);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks((prev) => [...prev, { title: newSubtask.trim() }]);
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      tag,
      tagColor: TAG_COLORS[tag] || "258 60% 55%",
      subtasks: subtasks.map((s) => ({
        id: Math.random().toString(36).substring(2, 10),
        title: s.title,
        completed: false,
      })),
      priority,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setTag("Design");
    setPriority("medium");
    setDueDate("");
    setSubtasks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tag</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              placeholder="e.g. 3d, 1w, 2024-03-15"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label>Subtasks</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
              />
              <Button variant="outline" size="icon" onClick={handleAddSubtask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {subtasks.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-sm"
                  >
                    <span>{s.title}</span>
                    <button onClick={() => handleRemoveSubtask(i)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
