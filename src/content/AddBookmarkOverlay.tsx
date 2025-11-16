import { useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddBookmarkOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function AddBookmarkOverlay({
  open,
  onClose,
}: AddBookmarkOverlayProps) {
  const [taskInput, setTaskInput] = useState("");
  const [note, setNote] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Get current page info
  const pageTitle = document.title || "Untitled Page";

  // Mock existing tasks
  const existingTasks = [
    "Database optimization",
    "Backend performance",
    "React best practices",
    "React performance",
  ];

  const filteredTasks = taskInput
    ? existingTasks.filter((task) =>
        task.toLowerCase().includes(taskInput.toLowerCase())
      )
    : existingTasks;

  const handleTaskInputChange = (value: string) => {
    setTaskInput(value);
    setShowAutocomplete(value.length > 0);
  };

  const handleTaskSelect = (task: string) => {
    setTaskInput(task);
    setShowAutocomplete(false);
  };

  const handleSubmit = () => {
    console.log("Adding bookmark:", {
      title: pageTitle,
      url: window.location.href,
      task: taskInput,
      note,
    });
    onClose();
  };

  const isNewTask =
    taskInput &&
    !existingTasks.some((t) => t.toLowerCase() === taskInput.toLowerCase());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="page-title"
              className="text-[13px] font-medium text-muted-foreground"
            >
              Page Title
            </Label>
            <Input
              id="page-title"
              value={pageTitle}
              readOnly
              className="bg-muted/50 text-muted-foreground cursor-default"
            />
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="task"
              className="text-[13px] font-medium text-muted-foreground"
            >
              Task
            </Label>
            <Input
              id="task"
              placeholder="Select or create task..."
              value={taskInput}
              onChange={(e) => handleTaskInputChange(e.target.value)}
              onFocus={() => taskInput && setShowAutocomplete(true)}
              onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
              autoFocus
            />

            {showAutocomplete && (
              <div className="absolute top-full left-0 right-0 mt-0 bg-background border border-border border-t-0 rounded-b-md max-h-40 overflow-y-auto shadow-md z-10">
                {filteredTasks.map((task) => (
                  <div
                    key={task}
                    onClick={() => handleTaskSelect(task)}
                    className="py-2.5 px-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {task}
                  </div>
                ))}
                {isNewTask && (
                  <div
                    onClick={() => handleTaskSelect(taskInput)}
                    className="py-2.5 px-3 text-sm text-muted-foreground border-t border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-semibold">+ </span>Create "{taskInput}
                    "
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="note"
              className="text-[13px] font-medium text-muted-foreground"
            >
              Note
            </Label>
            <Textarea
              id="note"
              placeholder="Why are you saving this? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[60px] resize-y"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!taskInput}>
            Add Bookmark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
