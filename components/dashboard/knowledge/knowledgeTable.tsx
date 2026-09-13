import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  File,
  Filter,
  Globe,
  Search,
  Upload,
  AlertCircle,
} from "lucide-react";

interface KnowledgeTableProps {
  sources: KnowledgeSource[];
  onSourceClick: (source: KnowledgeSource) => void;
  isLoading: boolean;
}

export const getTypeIcon = (type: SourceType) => {
  switch (type) {
    case "website":
      return <Globe className="w-4 h-4 text-blue-400" />;
    case "uploads":
      return <Upload className="w-4 h-4 text-emerald-400" />;
    case "text":
      return <File className="w-4 h-4 text-zinc-400" />;
    default:
      return <File className="w-4 h-4 text-zinc-500" />;
  }
};

export const getStatusBadge = (status: SourceStatus) => {
  switch (status.toLowerCase()) {
    case "active":
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-none font-medium"
        >
          Active
        </Badge>
      );
    case "tranning": // Catching the typo from original code
      return (
        <Badge
          variant="secondary"
          className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 shadow-none font-medium"
        >
          Training
        </Badge>
      );
    case "error":
      return (
        <Badge
          variant="secondary"
          className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 shadow-none font-medium"
        >
          Error
        </Badge>
      );
    case "excluded":
      return (
        <Badge
          variant="secondary"
          className="bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border border-zinc-500/20 shadow-none font-medium"
        >
          Excluded
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-zinc-400 border-zinc-700">
          {status}
        </Badge>
      );
  }
}

const KnowledgeTable = ({
  sources,
  onSourceClick,
  isLoading,
}: KnowledgeTableProps) => {
  return (
    <Card className="border-white/10 bg-[#09090b] shadow-xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-400" />
            Knowledge Sources
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              <Input
                className="pl-9 h-9 w-full sm:w-64 bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 text-sm text-zinc-200 placeholder:text-zinc-500 rounded-md transition-all"
                placeholder="Search sources..."
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-900/30">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="h-11 text-xs uppercase tracking-wider font-semibold text-zinc-400 pl-6">
                  Name
                </TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Type
                </TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Status
                </TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Last Updated
                </TableHead>
                <TableHead className="h-11 text-xs uppercase tracking-wider font-semibold text-zinc-400 text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-white/5 bg-transparent hover:bg-transparent"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-md bg-white/5" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-white/5" />
                          <Skeleton className="h-3 w-48 bg-white/5" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 bg-white/5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full bg-white/5" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 bg-white/5" />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Skeleton className="h-8 w-12 ml-auto rounded-md bg-white/5" />
                    </TableCell>
                  </TableRow>
                ))
              ) : sources.length > 0 ? (
                sources.map((source, index) => (
                  <TableRow
                    key={index}
                    className="border-white/5 bg-transparent hover:bg-white/[0.03] cursor-pointer group transition-all duration-200"
                    onClick={() => onSourceClick(source)}
                  >
                    <TableCell className="pl-6 py-3 font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-zinc-800/50 border border-white/5 group-hover:bg-zinc-800 group-hover:border-white/10 transition-colors">
                          {getTypeIcon(source.type as SourceType)}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">
                            {source.name}
                          </span>
                          {source.source_url && (
                            <span className="text-xs text-zinc-500 font-normal truncate max-w-[250px]">
                              {source.source_url}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="capitalize text-zinc-400 text-sm">
                      {source.type}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(source.status as SourceStatus)}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {new Date(source.updatedAt || source.last_updated || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:text-zinc-100 hover:bg-white/10 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents row click if user explicitly clicks 'View'
                          onSourceClick(source);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-64 text-center text-zinc-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 rounded-full bg-white/5">
                        <AlertCircle className="w-8 h-8 text-zinc-600" />
                      </div>
                      <p className="text-sm font-medium text-zinc-400">
                        No knowledge sources found.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Add a new source or adjust your filters.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeTable;
