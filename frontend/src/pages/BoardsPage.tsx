import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getBoards, type BoardResponse } from "@/services/boardService";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BoardsPage = () => {
  const { data: boards, isLoading, isError } = useQuery<BoardResponse[]>({
    queryKey: ['boards'],
    queryFn: getBoards
  });


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Render loading skeletons */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 font-medium">Failed to load boards.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Map through the fetched boards */}
      {boards?.map((board) => (
        <Link key={board.id} to={`/dashboard/boards/${board.id}`}>
          <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden">
            {/* Background color layer with inline style for dynamic hex codes */}
            <div className="absolute inset-0 z-10"/>

            {/* Image or empty container layer */}
            { board.background_image ? (
              <img
                src={board.background_image}
                alt="Board cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40"
              />
            ) : (
              // Removed bg-muted so the background_color underneath can be seen
              <div className="relative z-20 aspect-video w-full" style={{ backgroundColor: board.background_color || 'transparent' }} />
            )}

            {/* Content layer */}
            <CardHeader className="relative z-30">
              <CardTitle>{board.name}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default BoardsPage;