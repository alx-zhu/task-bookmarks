import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { ChevronsUpDown, Check, Copy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTasks, useCreateTask } from "@/hooks/useTasks";
import { useBookmarks, useCreateBookmark } from "@/hooks/useBookmarks";
import type { PageInfo } from "@/types/messages";
import type { Task } from "@/types/tasks";
import { formatDistanceToNow } from "date-fns";

interface AddBookmarkFormProps {
  onClose: () => void;
  pageInfo: PageInfo;
}

interface TaskWithStats extends Task {
  bookmarkCount: number;
  lastAccessed: number;
}

function AddBookmarkForm({ onClose, pageInfo }: AddBookmarkFormProps) {
  // Initialize with the page title
  const [title, setTitle] = useState(pageInfo.title);
  const [taskInput, setTaskInput] = useState("");
  const [note, setNote] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);

  const url = pageInfo.url;

  // Fetch tasks and mutations
  const { data: tasks = [] } = useTasks();
  const { data: bookmarks = [] } = useBookmarks();
  const createTask = useCreateTask();
  const createBookmark = useCreateBookmark();

  // Enrich tasks with stats client-side
  const tasksWithStats: TaskWithStats[] = useMemo(
    () =>
      tasks.map((task) => {
        const taskBookmarks = bookmarks.filter((b) => b.taskId === task.id);
        return {
          ...task,
          bookmarkCount: taskBookmarks.length,
          lastAccessed:
            taskBookmarks.length > 0
              ? Math.max(...taskBookmarks.map((b) => b.lastAccessed))
              : task.createdAt,
        };
      }),
    [tasks, bookmarks]
  );

  const handleSubmit = async () => {
    if (!taskInput || !url) return;

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

    // Create bookmark - use trimmed title or fallback to page title or "Untitled Page"
    await createBookmark.mutateAsync({
      url,
      title: title.trim() || pageInfo?.title || "Untitled Page",
      note,
      taskId: finalTaskId,
      taskName: finalTaskName,
    });

    onClose();
  };

  const handleCreateNewTask = () => {
    setTaskInput(searchValue);
    setComboboxOpen(false);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const selectedTask = tasks.find((task) => task.id === taskInput);
  const searchIsNewTask =
    searchValue &&
    !tasks.some((t) => t.name.toLowerCase() === searchValue.toLowerCase());

  return (
    <DialogContent
      className="sm:max-w-xl p-0 gap-0"
      aria-describedby="add-bookmark-content"
    >
      <DialogTitle hidden>Add Bookmark</DialogTitle>
      {/* Title Field - Borderless top input */}
      <div className="border-b">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={pageInfo?.title || "Bookmark title..."}
          className="border-0 text-base h-12 px-6 rounded-none focus-visible:ring-0"
        />
      </div>

      {/* Main Content */}
      <div className="px-6 py-4 space-y-3 overflow-hidden">
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
                    {tasksWithStats.map((task) => (
                      <CommandItem
                        key={task.id}
                        value={task.name}
                        onSelect={() => {
                          setTaskInput(task.id);
                          setComboboxOpen(false);
                        }}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span className="font-medium">{task.name}</span>
                          {task.bookmarkCount > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {task.bookmarkCount} bookmark
                                {task.bookmarkCount !== 1 ? "s" : ""}
                              </span>
                              <span>•</span>
                              <span>
                                {formatDistanceToNow(task.lastAccessed, {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        {selectedTask?.id === task.id && (
                          <Check className="h-4 w-4 ml-2 shrink-0" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {searchIsNewTask && (
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

        {/* URL Display - Clickable to copy */}
        <div className="space-y-1.5">
          {/* <label className="text-xs text-muted-foreground uppercase tracking-wide">
            URL
          </label> */}
          <button
            onClick={handleCopyUrl}
            className="w-full flex items-center gap-2 px-3 py-1 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors text-left group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground truncate">
                {url}
              </div>
            </div>
            {urlCopied ? (
              <Check className="h-3 w-3 text-green-600 shrink-0" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t px-6 py-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={
            !taskInput ||
            !url ||
            createBookmark.isPending ||
            createTask.isPending
          }
        >
          {createBookmark.isPending || createTask.isPending
            ? "Adding..."
            : "Add Bookmark"}
        </Button>
      </div>
    </DialogContent>
  );
}

interface AddBookmarkOverlayProps {
  open: boolean;
  onClose: () => void;
  pageInfo: PageInfo | null;
}

export default function AddBookmarkOverlay({
  open,
  onClose,
  pageInfo,
}: AddBookmarkOverlayProps) {
  // Use pageInfo URL as key to remount component when it changes
  const key = pageInfo?.url || "no-page";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {pageInfo && (
        <AddBookmarkForm key={key} onClose={onClose} pageInfo={pageInfo} />
      )}
    </Dialog>
  );
}
