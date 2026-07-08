// components/dashboard/CreateBoardModal.tsx
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
import { createBoard } from "@/services/boardService";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface CreateBoardModalProps {
  /** The workspace this board will be created inside */
  workspaceId: number;
  /** When provided, renders a custom trigger element instead of the default button */
  trigger?: React.ReactNode;
}

export function CreateBoardModal({ workspaceId, trigger }: CreateBoardModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#4a90d9");
  const [image, setImage] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      // Refresh both the workspace detail and the global board list
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board created!", { position: "bottom-right" });
      setOpen(false);
      setName("");
      setColor("#4a90d9");
      setImage(null);
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

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("background_color", color);
    // Attach the workspace — required by the backend
    formData.append("workspace", String(workspaceId));
    if (image) {
      formData.append("background_image", image);
    }

    mutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="cursor-pointer" variant="default" size="sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            New Board
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Board name */}
          <div className="grid gap-2">
            <label htmlFor="board-name" className="text-sm font-medium">
              Board Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Launch Campaign"
              required
            />
          </div>

          {/* Background color */}
          <div className="grid gap-2">
            <label htmlFor="board-color" className="text-sm font-medium">
              Background Color
            </label>
            <div className="flex gap-2">
              <Input
                id="board-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                className="flex-1 uppercase"
              />
            </div>
          </div>

          {/* Background image */}
          <div className="grid gap-2">
            <label htmlFor="board-image" className="text-sm font-medium">
              Background Image{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Input
              id="board-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="cursor-pointer">
            {mutation.isPending ? "Creating…" : "Create Board"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}