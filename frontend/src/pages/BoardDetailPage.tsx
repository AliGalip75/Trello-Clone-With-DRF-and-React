import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoard, deleteBoard } from '@/services/boardService';
import { createList } from '@/services/listService';
import BoardList from './components/BoardList';
import AddListButton from './components/AddListButton';

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: board, isLoading, isError } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId as string),
    enabled: !!boardId,
  });

  const addListMutation = useMutation({
    mutationFn: ({ name, board, order }: { name: string; board: number; order: number }) =>
      createList({ name, board, order }),
    onSuccess: () => {
      // Invalidate the board query to trigger a refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => deleteBoard(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      navigate('/dashboard/boards/');
    },
  });

  const handleAddList = (name: string, boardIdNum: number) => {
    // If we have lists, find the highest order and add 1, otherwise start at 1
    const lists = board?.lists || [];
    const maxOrder = lists.length > 0 
      ? Math.max(...lists.map((l: any) => l.order || 0)) 
      : 0;
    const newOrder = maxOrder + 1;
    
    addListMutation.mutate({ name, board: Number(boardIdNum), order: newOrder });
  };

  const handleDeleteBoard = () => {
    if (window.confirm('Are you sure you want to delete this entire board? This action cannot be undone.')) {
      deleteBoardMutation.mutate(boardId as string);
    }
  };

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
        <button 
          onClick={handleDeleteBoard}
          title="Delete Board"
          className="bg-red-500/80 hover:bg-red-600/100 backdrop-blur-sm px-3 py-1 rounded border border-red-500/50 shadow-sm cursor-pointer transition text-white"
        >
          Delete Board
        </button>
      </div>

      {/* Horizontal Scrolling Lists Container */}
      <div className="flex overflow-x-auto gap-4 h-full pb-2 custom-scrollbar items-start">
        
        {/* Render Lists */}
        {board.lists?.map((list) => (
          <BoardList key={list.id} list={list} />
        ))}

        {/* Add List Button */}
        <AddListButton boardId={board.id} onAdd={handleAddList} />

      </div>
    </div>
  );
};

export default BoardDetailPage;