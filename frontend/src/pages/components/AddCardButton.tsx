import React, { useState } from 'react';

interface AddCardButtonProps {
  listId: number;
  onAdd: (name: string, listId: number) => void;
}

const AddCardButton: React.FC<AddCardButtonProps> = ({ listId, onAdd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cardName, setCardName] = useState('');

  const handleAdd = () => {
    if (cardName.trim()) {
      onAdd(cardName, listId);
      setCardName('');
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setCardName('');
    }
  };

  if (isEditing) {
    return (
      <div className="mt-2 text-sm">
        <input
          type="text"
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2 text-gray-800 dark:text-slate-200 "
          placeholder="Enter a title for this card..."
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition cursor-pointer"
          >
            Add card
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setCardName('');
            }}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="mt-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700/50 text-left p-2 rounded text-sm transition flex items-center gap-1 cursor-pointer"
    >
      <span>+</span> Add a card
    </button>
  );
};

export default AddCardButton;
