// components/dashboard/CreateWorkspaceModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "@/services/workspaceService";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";

interface CreateWorkspaceModalProps {
  /** When provided, renders a custom trigger element instead of the default button */
  trigger?: React.ReactNode;
}

export function CreateWorkspaceModal({ trigger }: CreateWorkspaceModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace created!", { position: "bottom-right" });
      setOpen(false);
      setName("");
      setDescription("");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: unknown }; message?: string };
      toast.error(`Error: ${JSON.stringify(err.response?.data || err.message)}`, {
        position: "bottom-right",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({ name: name.trim(), description: description.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
            <FolderPlus className="h-4 w-4" />
            New Workspace
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Workspace name */}
          <div className="grid gap-2">
            <label htmlFor="ws-name" className="text-sm font-medium">
              Workspace Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Team"
              required
            />
          </div>

          {/* Optional description */}
          <div className="grid gap-2">
            <label htmlFor="ws-desc" className="text-sm font-medium">
              Description{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Input
              id="ws-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="cursor-pointer">
            {mutation.isPending ? "Creating…" : "Create Workspace"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
