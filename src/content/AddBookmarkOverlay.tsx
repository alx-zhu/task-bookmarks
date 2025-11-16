import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddBookmarkOverlayProps {
  onClose: () => void;
}

export default function AddBookmarkOverlay({
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

  const handleCreateTask = () => {
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
    <div className="w-full max-w-[640px] bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="p-6">
        <div className="mb-5">
          <label className="block text-[13px] font-medium text-muted-foreground mb-2">
            Page Title
          </label>
          <Input
            type="text"
            value={pageTitle}
            readOnly
            className="bg-muted/50 text-muted-foreground cursor-default"
          />
        </div>

        <div className="mb-5 relative">
          <label className="block text-[13px] font-medium text-muted-foreground mb-2">
            Task
          </label>
          <Input
            type="text"
            placeholder="Select or create task..."
            value={taskInput}
            onChange={(e) => handleTaskInputChange(e.target.value)}
            onFocus={() => taskInput && setShowAutocomplete(true)}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            autoFocus
          />

          {showAutocomplete && (
            <div className="absolute top-full left-0 right-0 mt-0 bg-white border border-border border-t-0 rounded-b-md max-h-40 overflow-y-auto shadow-md z-10">
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
                  onClick={() => handleCreateTask()}
                  className="py-2.5 px-3 text-sm text-muted-foreground border-t border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold">+ </span>Create "{taskInput}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-[13px] font-medium text-muted-foreground mb-2">
            Note
          </label>
          <Textarea
            placeholder="Why are you saving this? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[60px] resize-y"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!taskInput}>
            Add Bookmark
          </Button>
        </div>
      </div>
    </div>
  );
}
