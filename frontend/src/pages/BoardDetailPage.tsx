import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBoard } from '@/services/boardService';

const BoardDetailPage = () => {
  const { boardId } = useParams();

  const { data: board, isLoading, isError } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId as string),
    enabled: !!boardId,
  });

  if (isLoading) {
    return <div className="p-4 text-white">Loading board...</div>;
  }

  if (isError || !board) {
    return <div className="p-4 text-white">Failed to load board.</div>;
  }

  const backgroundStyle = board.background_image
    ? { backgroundImage: `url(${board.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: board.background_color || '#ffffff' };

  return (
    <div 
      className="h-full w-full p-4 flex flex-col overflow-hidden"
      style={{ ...backgroundStyle }}
    >
      {/* Board Header */}
      <div className="flex justify-between items-center mb-4 text-white">
        <h2 className="text-xl font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded cursor-pointer hover:bg-white/30 border border-white/10 shadow-sm">
          {board.name}
        </h2>
        <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 py-1 rounded border border-white/10 shadow-sm">
          ... Show Menu
        </button>
      </div>

      {/* Horizontal Scrolling Lists Container */}
      <div className="flex overflow-x-auto gap-4 h-full pb-2 custom-scrollbar items-start">
        
        {/* Render Lists */}
        {board.lists?.map((list) => (
          <div key={list.id} className="w-72 flex-shrink-0 bg-gray-100 rounded-lg p-2 max-h-full flex flex-col shadow-lg">
            
            {/* List Title */}
            <div className="flex justify-between items-center mb-2 px-2">
              <h3 className="font-semibold text-gray-700 text-sm">{list.name}</h3>
              <span className="text-gray-400 cursor-pointer">...</span>
            </div>

            {/* Cards Area */}
            <div className="flex-1 overflow-y-auto space-y-2 px-1 custom-scrollbar">
              {list.cards?.map((card) => (
                <div key={card.id} className="bg-white p-2 rounded shadow-sm hover:bg-gray-50 cursor-pointer text-sm text-gray-800 border border-gray-200">
                  {card.name}
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
          <button className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg text-left font-medium transition backdrop-blur-sm border border-white/20">
            + Add another list
          </button>
        </div>

      </div>
    </div>
  );
};

export default BoardDetailPage;