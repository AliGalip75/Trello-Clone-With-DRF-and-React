// components/dashboard/CreateBoardModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "@/services/boardService";
import { PlusCircle } from 'lucide-react';

export function CreateBoardModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#ffffff");
  const [image, setImage] = useState<File | null>(null);
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      // Refresh the boards list after successful creation
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setOpen(false);
      setName("");
      setColor("#ffffff");
      setImage(null);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append("name", name);
    formData.append("background_color", color);
    
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
        <Button className="cursor-pointer" variant="default">
            <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Board Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Launch Campaign"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="color" className="text-sm font-medium">Background Color</label>
            <div className="flex gap-2">
              <Input
                id="color"
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
          <div className="grid gap-2">
            <label htmlFor="image" className="text-sm font-medium">Background Image (Optional)</label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}