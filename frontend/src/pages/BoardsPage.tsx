import { Link } from 'react-router-dom';

const BoardsPage = () => {
  // TODO: Replace with TanStack Query (useQuery) later
  const mockBoards = [
    { id: 1, title: 'Project Alpha', color: 'bg-blue-500' },
    { id: 2, title: 'Marketing Launch', color: 'bg-green-500' },
    { id: 3, title: 'Personal Tasks', color: 'bg-red-500' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Workspaces</h1>
      
      {/* Grid Layout for Boards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* Render existing boards */}
        {mockBoards.map((board) => (
          <Link 
            key={board.id} 
            to={`/b/${board.id}`} 
            className={`${board.color} h-32 rounded-lg p-4 text-white font-semibold hover:opacity-90 transition shadow-md flex items-start justify-between`}
          >
            <span>{board.title}</span>
          </Link>
        ))}

        {/* "Create New Board" Button */}
        <button className="h-32 bg-gray-200 rounded-lg p-4 text-gray-600 font-medium hover:bg-gray-300 transition flex items-center justify-center border-2 border-dashed border-gray-400">
          + Create New Board
        </button>

      </div>
    </div>
  );
};

export default BoardsPage;