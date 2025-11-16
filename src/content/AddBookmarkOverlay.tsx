import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTasks, useCreateTask } from "@/hooks/useTasks";
import { useCreateBookmark } from "@/hooks/useBookmarks";

interface AddBookmarkOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function AddBookmarkOverlay({
  open,
  onClose,
}: AddBookmarkOverlayProps) {
  const [title, setTitle] = useState(document.title || "Untitled Page");
  const [url] = useState(window.location.href);
  const [taskInput, setTaskInput] = useState("");
  const [note, setNote] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch tasks and mutations
  const { data: tasks = [] } = useTasks();
  const createTask = useCreateTask();
  const createBookmark = useCreateBookmark();

  const handleSubmit = async () => {
    if (!taskInput) return;

    // Find existing task or use searchValue for new task
    const existingTask = tasks.find((t) => t.id === taskInput);
    let finalTaskId = taskInput;
    let finalTaskName = existingTask?.name || searchValue;

    // If creating a new task (taskInput equals searchValue), create it first
    if (!existingTask && searchValue) {
      const newTask = await createTask.mutateAsync(searchValue);
      finalTaskId = newTask.id;
      finalTaskName = newTask.name;
    }

    // Create bookmark
    await createBookmark.mutateAsync({
      url,
      title,
      note,
      taskId: finalTaskId,
      taskName: finalTaskName,
    });

    // Reset form and close
    setTitle(document.title || "Untitled Page");
    setTaskInput("");
    setNote("");
    setSearchValue("");
    onClose();
  };

  const handleCreateNewTask = () => {
    setTaskInput(searchValue);
    setComboboxOpen(false);
  };

  const selectedTask = tasks.find((task) => task.id === taskInput);
  const isNewTask =
    searchValue &&
    !tasks.some(
      (t) =>
        t.id === taskInput || t.name.toLowerCase() === searchValue.toLowerCase()
    );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 gap-0">
        {/* Title Field - Borderless top input */}
        <div className="border-b">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bookmark title..."
            className="border-0 text-base h-12 px-6 rounded-none focus-visible:ring-0"
          />
        </div>

        {/* Main Content */}
        <div className="px-6 py-4 space-y-3">
          {/* Task Selection */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Task
            </label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between font-normal h-9"
                >
                  <span className="truncate">
                    {selectedTask
                      ? selectedTask.name
                      : searchValue || "Select or create task..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search or create task..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandGroup>
                      {tasks.map((task) => (
                        <CommandItem
                          key={task.id}
                          value={task.name}
                          onSelect={() => {
                            setTaskInput(task.id);
                            setSearchValue(task.name);
                            setComboboxOpen(false);
                          }}
                        >
                          {task.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {isNewTask && (
                      <>
                        <Separator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={handleCreateNewTask}
                            keywords={[searchValue]}
                          >
                            <span className="font-semibold">+ </span>Create new
                            task: "{searchValue}"
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Note Field */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Note
            </label>
            <Textarea
              placeholder="Why are you saving this?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none min-h-[60px] text-sm"
              rows={2}
            />
          </div>

          {/* URL Display - Read-only, subtle */}
          <div className="pt-2">
            <div className="text-xs text-muted-foreground truncate">{url}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t px-6 py-3 flex justify-end gap-2 bg-muted/20">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={
              !taskInput || createBookmark.isPending || createTask.isPending
            }
          >
            {createBookmark.isPending || createTask.isPending
              ? "Adding..."
              : "Add Bookmark"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
