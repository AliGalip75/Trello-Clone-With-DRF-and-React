import React, { useState } from 'react';

interface AddListButtonProps {
  boardId: number;
  onAdd: (name: string, boardId: number) => void;
}

const AddListButton: React.FC<AddListButtonProps> = ({ boardId, onAdd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState('');

  const handleAdd = () => {
    if (listName.trim()) {
      onAdd(listName, boardId);
      setListName('');
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setListName('');
    }
  };

  if (isEditing) {
    return (
      <div className="w-72 flex-shrink-0 bg-gray-100 dark:bg-zinc-800 rounded-lg p-2 shadow-lg">
        <input
          type="text"
          className="w-full p-2 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2 text-gray-800 dark:text-slate-200"
          placeholder="Enter list title..."
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition cursor-pointer"
          >
            Add list
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setListName('');
            }}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 p-1 text-md cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 flex-shrink-0">
      <button
        onClick={() => setIsEditing(true)}
        className="w-full bg-white/20 dark:bg-zinc-900/20 hover:bg-white/30 text-white p-3 rounded-lg text-left font-medium transition backdrop-blur-sm border border-white/20 flex items-center gap-2 shadow-sm cursor-pointer"
      >
        <span>+</span> Add another list
      </button>
    </div>
  );
};

export default AddListButton;
