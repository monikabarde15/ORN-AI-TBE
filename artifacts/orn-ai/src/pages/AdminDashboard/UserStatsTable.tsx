import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Award, PlayCircle, BookOpen, CheckCircle2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import CertificateModal from "@/pages/CoursePlayer/components/CertificateModal";

export function UserStatsTable() {
  const [selectedCert, setSelectedCert] = useState<{
    studentName: string;
    courseTitle: string;
    completionDate: string;
    certificateId: string;
  } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-course-progress"],
    queryFn: async () => {
      const res = await customFetch<{ success: boolean; data: any[] }>("/api/admin/course-progress");
      return res.data;
    },
  });

  return (
    <Card className="border shadow-sm bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden col-span-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Award className="size-5 text-primary" /> Certificate & Views Tracker
        </CardTitle>
        <CardDescription>
          Detailed user performance, video views, and generated certificates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">Failed to load user stats</div>
        ) : !data || data.length === 0 ? (
          <div className="text-muted-foreground text-center p-12">No course progress found</div>
        ) : (
          <div className="rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Certificate</TableHead>
                  <TableHead className="text-right">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    className="group"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{row.userName}</span>
                        <span className="text-xs text-muted-foreground">{row.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="size-3 shrink-0" />
                        <span className="truncate max-w-[200px]">{row.courseTitle}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="gap-1.5 whitespace-nowrap">
                        <PlayCircle className="size-3 text-blue-500" />
                        {row.completedViews} / {row.totalLessons}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold">
                        {row.totalScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {row.hasCertificate ? (
                        <div className="flex items-center justify-center gap-2">
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 gap-1">
                            <CheckCircle2 className="size-3" />
                            Generated
                          </Badge>
                          <button
                            onClick={() => setSelectedCert({
                              studentName: row.userName || row.userEmail || "Student",
                              courseTitle: row.courseTitle,
                              completionDate: row.certificateDate || new Date(row.lastActive).toLocaleDateString(),
                              certificateId: row.certificateId,
                            })}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer border border-blue-200 px-2 py-0.5 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="size-3" /> View
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(row.lastActive).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Certificate Viewer Modal */}
        {selectedCert && (
          <CertificateModal
            isOpen={!!selectedCert}
            onClose={() => setSelectedCert(null)}
            studentName={selectedCert.studentName}
            courseTitle={selectedCert.courseTitle}
            completionDate={selectedCert.completionDate}
            certificateId={selectedCert.certificateId}
          />
        )}
      </CardContent>
    </Card>
  );
}
