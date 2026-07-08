// pages/WorkspacesPage.tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/services/workspaceService";
import type { Workspace } from "@/types";
import { CreateWorkspaceModal } from "@/layouts/components/dashboard/CreateWorkspaceModal";
import { FolderOpen, LayoutGrid, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const WorkspacesPage = () => {
  const { data: workspaces, isLoading, isError } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Your Workspaces</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive font-medium mt-4">
        Failed to load workspaces. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Manage your workspaces and boards
          </p>
        </div>
        <CreateWorkspaceModal />
      </div>

      {/* Empty state */}
      {workspaces?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="bg-muted rounded-full p-6">
            <FolderOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">No workspaces yet</h2>
          <p className="text-muted-foreground max-w-sm">
            Create your first workspace to start organizing your boards and
            collaborating with your team.
          </p>
          <CreateWorkspaceModal />
        </div>
      )}

      {/* Workspace grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces?.map((ws) => (
          <Link
            key={ws.id}
            to={`/dashboard/workspaces/${ws.id}`}
            className="group block"
          >
            <div className="relative rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5">
              {/* Workspace icon + name */}
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 text-primary rounded-lg p-2.5 shrink-0">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                    {ws.name}
                  </h2>
                  {ws.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {ws.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FolderOpen className="h-3.5 w-3.5" />
                  {ws.boards.length} board{ws.boards.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(ws.updated_at).toLocaleDateString()}
                </span>
              </div>

              {/* Board preview pills */}
              {ws.boards.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {ws.boards.slice(0, 4).map((b) => (
                    <span
                      key={b.id}
                      className="text-xs bg-muted rounded-full px-2.5 py-0.5 truncate max-w-[120px]"
                    >
                      {b.name}
                    </span>
                  ))}
                  {ws.boards.length > 4 && (
                    <span className="text-xs text-muted-foreground px-1">
                      +{ws.boards.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkspacesPage;
