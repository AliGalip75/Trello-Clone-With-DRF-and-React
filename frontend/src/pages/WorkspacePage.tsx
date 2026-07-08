// pages/WorkspacePage.tsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/services/workspaceService";
import type { Workspace } from "@/types";
import { CreateBoardModal } from "@/layouts/components/dashboard/CreateBoardModal";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: workspace, isLoading, isError } = useQuery<Workspace>({
    queryKey: ["workspace", Number(workspaceId)],
    queryFn: () => getWorkspace(workspaceId as string),
    enabled: !!workspaceId,
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="text-destructive font-medium mt-4">
        Failed to load workspace. It may not exist or you may not have access.
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb + page header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Link
          to="/dashboard/workspaces"
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Workspaces
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{workspace.name}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-muted-foreground mt-1">{workspace.description}</p>
          )}
        </div>
        <CreateBoardModal workspaceId={workspace.id} />
      </div>

      {/* Empty state */}
      {workspace.boards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="bg-muted rounded-full p-6">
            <FolderOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">No boards in this workspace</h2>
          <p className="text-muted-foreground max-w-sm">
            Create your first board to start organizing tasks into lists and
            cards.
          </p>
          <CreateBoardModal workspaceId={workspace.id} />
        </div>
      )}

      {/* Board grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {workspace.boards.map((board) => (
          <Link
            key={board.id}
            to={`/dashboard/boards/${board.id}/`}
            className="group block"
          >
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5">
              {/* Cover — real image or background color from backend */}
              <div
                className="h-20 w-full"
                style={
                  board.background_image
                    ? {
                      backgroundImage: `url(${board.background_image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                    : { backgroundColor: board.background_color || "#6366f1" }
                }
              />

              <div className="p-4">
                <h2 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {board.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
