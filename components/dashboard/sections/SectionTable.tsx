import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Loader2, Eye } from "lucide-react";

interface SectionTableProps {
    section: Section[];
    isLoading: boolean;
    onPreview: (section: Section) => void;
    onCreateSection: () => void;
}

const SectionTable = ({ section, isLoading, onPreview, onCreateSection }: SectionTableProps) => {
    
    const getToneBadge = (tone: Tone) => {
        switch (tone) {
            case "strict":
                return <Badge variant="outline" className="border-red-500/20 text-red-400 bg-red-500/10 font-medium">Strict</Badge>;
            case "neutral":
                return <Badge variant="outline" className="border-blue-500/20 text-blue-400 bg-blue-500/10 font-medium">Neutral</Badge>;
            case "Friendly":
                return <Badge variant="outline" className="border-purple-500/20 text-purple-400 bg-purple-500/10 font-medium">Friendly</Badge>;
            case "empathetic":
                return <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/10 font-medium">Empathetic</Badge>;
            default:
                return null;
        }
    };

    const getStatus = (status: SectionStatus) => {
        switch (status) {
            case "active":
                return (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                        Active
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <div className="rounded-md border border-white/10 bg-black/20 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="h-10 text-xs uppercase tracking-wider font-semibold text-zinc-400">Name</TableHead>
                        <TableHead className="h-10 text-xs uppercase tracking-wider font-semibold text-zinc-400">Sources</TableHead>
                        <TableHead className="h-10 text-xs uppercase tracking-wider font-semibold text-zinc-400">Tone</TableHead>
                        <TableHead className="h-10 text-xs uppercase tracking-wider font-semibold text-zinc-400">Scope</TableHead>
                        <TableHead className="h-10 text-xs uppercase tracking-wider font-semibold text-zinc-400">Status</TableHead>
                        <TableHead className="h-10 text-xs uppercase tracking-wider font-semibold text-zinc-400 text-right pr-12">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-48">
                                <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                                    <span className="text-sm font-medium">Loading sections...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : section?.length > 0 ? (
                        section.map((sec) => (
                            <TableRow 
                                key={sec.id} 
                                className="border-white/5 transition-colors hover:bg-white/5 group"
                            >
                                <TableCell className="font-medium text-zinc-200">
                                    {sec.name}
                                </TableCell>
                                <TableCell className="text-sm text-zinc-400 font-mono">
                                    {sec.sourceCount}
                                </TableCell>
                                <TableCell className="font-medium text-zinc-400">
                                    {getToneBadge(sec.tone)}
                                </TableCell>
                                <TableCell className="text-zinc-400 text-sm">{sec.scopeLabel}</TableCell>
                                <TableCell>{getStatus(sec.status)}</TableCell>
                                <TableCell className="text-right pr-4">
                                    <Button 
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white hover:bg-white/10"
                                        onClick={() => onPreview(sec)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Preview
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="p-3 rounded-full bg-white/5 mb-2">
                                        <ShieldAlert className="w-8 h-8 text-zinc-500" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-zinc-300 font-medium">No sections found</span>
                                        <span className="text-zinc-500 text-sm">Get started by creating your first section.</span>
                                    </div>
                                    <Button 
                                        variant="default" 
                                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        onClick={onCreateSection}
                                    >
                                        Create Section
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default SectionTable;