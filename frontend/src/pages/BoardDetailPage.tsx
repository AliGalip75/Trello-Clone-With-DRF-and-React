import React from 'react';
import { useParams } from 'react-router-dom';

const BoardDetailPage = () => {
  // Get board ID from URL parameters
  const { boardId } = useParams();

  // TODO: Fetch board details, lists, and cards using this ID via TanStack Query
  const mockLists = [
    { id: 1, title: 'To Do', cards: ['Task 1', 'Task 2'] },
    { id: 2, title: 'In Progress', cards: ['Fix Bug #12'] },
    { id: 3, title: 'Done', cards: ['Deployment'] },
  ];

  return (
    <div 
      className="h-full w-full bg-blue-600 p-4 flex flex-col overflow-hidden"
      style={{ height: 'calc(100vh - 64px)' }} // Adjust based on your header height
    >
      {/* Board Header */}
      <div className="flex justify-between items-center mb-4 text-white">
        <h2 className="text-xl font-bold bg-white/20 px-4 py-2 rounded cursor-pointer hover:bg-white/30">
          Board #{boardId}
        </h2>
        <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded">
          ... Show Menu
        </button>
      </div>

      {/* Horizontal Scrolling Lists Container */}
      <div className="flex overflow-x-auto gap-4 h-full pb-2">
        
        {/* Render Lists */}
        {mockLists.map((list) => (
          <div key={list.id} className="w-72 flex-shrink-0 bg-gray-100 rounded-lg p-2 max-h-full flex flex-col shadow-lg">
            
            {/* List Title */}
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-semibold text-gray-700 text-sm">{list.title}</h3>
              <span className="text-gray-400 cursor-pointer">...</span>
            </div>

            {/* Cards Area */}
            <div className="flex-1 overflow-y-auto space-y-2 px-1 custom-scrollbar">
              {list.cards.map((card, index) => (
                <div key={index} className="bg-white p-2 rounded shadow-sm hover:bg-gray-50 cursor-pointer text-sm text-gray-800 border border-gray-200">
                  {card}
                </div>
              ))}
            </div>

            {/* Add Card Button */}
            <button className="mt-2 text-gray-500 hover:bg-gray-200 text-left p-2 rounded text-sm transition">
              + Add a card
            </button>
          </div>
        ))}

        {/* "Add Another List" Button */}
        <div className="w-72 flex-shrink-0">
          <button className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg text-left font-medium transition backdrop-blur-sm">
            + Add another list
          </button>
        </div>

      </div>
    </div>
  );
};

export default BoardDetailPage;