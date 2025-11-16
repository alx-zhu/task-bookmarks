import { useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
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
    // Set taskInput to searchValue to indicate we're creating a new task
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
      <DialogContent className="sm:max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-foreground"
            />
          </div>

          <div className="space-y-2 w-full">
            <Label className="text-foreground font-medium">Task</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between text-foreground font-normal cursor-pointer"
                >
                  {selectedTask
                    ? selectedTask.name
                    : searchValue || "Select or create task..."}
                  {comboboxOpen ? (
                    <ChevronsDownUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  ) : (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search or create task..."
                    className="text-foreground"
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
                          className="text-foreground"
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
                            className="text-foreground"
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

          <div className="space-y-2">
            <Label htmlFor="note" className="text-foreground font-medium">
              Note
            </Label>
            <Textarea
              id="note"
              placeholder="Why are you saving this?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="text-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !taskInput || createBookmark.isPending || createTask.isPending
            }
          >
            {createBookmark.isPending || createTask.isPending
              ? "Adding..."
              : "Add Bookmark"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
