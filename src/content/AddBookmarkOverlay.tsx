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
import { ChevronsDownUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  // Mock existing tasks
  const existingTasks = [
    { value: "database-optimization", label: "Database optimization" },
    { value: "backend-performance", label: "Backend performance" },
    { value: "react-best-practices", label: "React best practices" },
    { value: "react-performance", label: "React performance" },
  ];

  const handleSubmit = () => {
    console.log("Adding bookmark:", {
      title,
      url,
      task: taskInput,
      note,
    });
    onClose();
  };

  const handleCreateNewTask = () => {
    // Create new task with the search value
    setTaskInput(searchValue);
    setComboboxOpen(false);
    setSearchValue("");
  };

  const selectedTask = existingTasks.find((task) => task.value === taskInput);

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
                  className="w-full justify-between text-foreground font-normal"
                >
                  {selectedTask
                    ? selectedTask.label
                    : "Select or create task..."}
                  <ChevronsDownUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                      {existingTasks.map((task) => (
                        <CommandItem
                          key={task.value}
                          value={task.label}
                          onSelect={() => {
                            setTaskInput(task.value);
                            setComboboxOpen(false);
                            setSearchValue("");
                          }}
                          className="text-foreground"
                        >
                          {task.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <Separator />
                    {searchValue && (
                      <CommandGroup>
                        <CommandItem
                          className="text-foreground"
                          onSelect={handleCreateNewTask}
                          // Force this to always match by giving it keywords that include the search
                          keywords={[searchValue]}
                        >
                          <span className="font-semibold">+ </span>Create new
                          task: "{searchValue}"
                        </CommandItem>
                      </CommandGroup>
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
          <Button onClick={handleSubmit} disabled={!taskInput}>
            Add Bookmark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
