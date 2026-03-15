import React, { useState } from 'react';
import type { List } from '@/types';
import BoardCard from './BoardCard';
import AddCardButton from './AddCardButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCard } from '@/services/cardService';
import { deleteList, updateList } from '@/services/listService';
import { useParams } from 'react-router-dom';
import { GoKebabHorizontal } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BoardListProps {
  list: List;
}

const BoardList: React.FC<BoardListProps> = ({ list }) => {
  const queryClient = useQueryClient();
  const { boardId } = useParams();

  const [isRenaming, setIsRenaming] = useState(false);
  const [listName, setListName] = useState(list.name);

  const addCardMutation = useMutation({
    mutationFn: ({ name, list_id, order }: { name: string; list_id: number; order: number }) =>
      createCard({ name, list_id, order }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: number) => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const updateListMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateList(id, { name }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const handleAddCard = (name: string, listId: number) => {
    const cards = list.cards || [];
    const maxOrder = cards.length > 0
      ? Math.max(...cards.map((c: any) => c.order || 0))
      : 0;
    const newOrder = maxOrder + 1;
    
    addCardMutation.mutate({ name, list_id: Number(listId), order: newOrder });
  };

  const handleDeleteList = () => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteListMutation.mutate(list.id);
    }
  };

  const handleRenameSubmit = () => {
    if (listName.trim() && listName !== list.name) {
      updateListMutation.mutate({ id: list.id, name: listName });
    } else {
      setListName(list.name); // revert on empty or no change
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleRenameSubmit();
    if (e.key === 'Escape') {
      setListName(list.name);
      setIsRenaming(false);
    }
  };

  return (
    <div className="w-72 flex-shrink-0 bg-gray-100 dark:bg-zinc-800 rounded-lg p-2 max-h-full flex flex-col shadow-lg border border-transparent dark:border-zinc-700">
      {/* List Title Context Menu Area */}
      <div className="flex justify-between items-center mb-2 relative">
        
        {/* Title / Rename Input */}
        {isRenaming ? (
          <input
            type="text"
            className="font-semibold text-gray-700 dark:text-zinc-200 text-sm flex-1 bg-white dark:bg-slate-900 border border-blue-500 rounded px-1 py-0.5 outline-none"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleRenameKeyDown}
            autoFocus
          />
        ) : (
          <h3 
            className="font-semibold text-gray-700 dark:text-slate-200 text-sm flex-1 cursor-pointer" 
            onClick={() => setIsRenaming(true)}
          >
            {list.name}
          </h3>
        )}

        {/* Shadcn Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 px-2 py-1 rounded cursor-pointer transition select-none flex items-center outline-none">
              <GoKebabHorizontal />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 dark:bg-slate-800 dark:border-slate-700">
            <DropdownMenuItem 
              onClick={() => setIsRenaming(true)}
              className="cursor-pointer dark:text-slate-200 dark:focus:bg-slate-700"
            >
              Rename List
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-slate-700" />
            <DropdownMenuItem 
              onClick={handleDeleteList}
              className="text-red-500 focus:text-red-500 cursor-pointer dark:text-red-400 dark:focus:text-red-400 dark:focus:bg-red-900/30"
            >
              Delete List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards Area */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {list.cards?.map((card) => (
          <BoardCard key={card.id} card={card} />
        ))}
      </div>

      {/* Add Card Button */}
      <AddCardButton listId={list.id} onAdd={handleAddCard} />
    </div>
  );
};

export default BoardList;
