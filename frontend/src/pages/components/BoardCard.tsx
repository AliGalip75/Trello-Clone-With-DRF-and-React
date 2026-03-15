import React from 'react';
import type { Card } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCard } from '@/services/cardService';
import { useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";

interface BoardCardProps {
  card: Card;
}

const BoardCard: React.FC<BoardCardProps> = ({ card }) => {
  const queryClient = useQueryClient();
  const { boardId } = useParams();

  const deleteCardMutation = useMutation({
    mutationFn: (id: number) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCardMutation.mutate(card.id);
    }
  };

  return (
    <div className="group bg-white dark:bg-zinc-900/70 p-2 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer text-sm text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 flex justify-between items-start transition-colors">
      <span className="break-words flex-1">{card.name}</span>
      <button 
        onClick={handleDelete}
        title="Delete card"
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition px-1 pt-1 cursor-pointer"
      >
        <RiDeleteBin6Line />
      </button>
    </div>
  );
};

export default BoardCard;
