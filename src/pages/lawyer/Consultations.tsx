import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, FileText, User, Calendar } from "lucide-react";

type Consultation = {
  id: string;
  userName: string;
  userEmail: string;
  documentTitle: string;
  riskLevel: "high" | "medium" | "low";
  requestedDate: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  documentSummary: string;
  topRisks: string[];
};

const Consultations = () => {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const consultations: Consultation[] = [
    {
      id: "1",
      userName: "Sarah Johnson",
      userEmail: "sarah.j@email.com",
      documentTitle: "Employment Agreement",
      riskLevel: "high",
      requestedDate: "2024-01-20",
      status: "pending",
      documentSummary: "A 15-page employment contract with several non-compete clauses and IP assignment provisions.",
      topRisks: [
        "Overly broad non-compete clause covering entire industry",
        "Unclear intellectual property ownership terms",
        "No clear termination conditions specified",
      ],
    },
    {
      id: "2",
      userName: "Michael Chen",
      userEmail: "m.chen@email.com",
      documentTitle: "NDA Contract",
      riskLevel: "medium",
      requestedDate: "2024-01-19",
      status: "pending",
      documentSummary: "A standard non-disclosure agreement for a software development project.",
      topRisks: [
        "Indefinite confidentiality period",
        "Broad definition of confidential information",
        "Limited exceptions to confidentiality obligations",
      ],
    },
    {
      id: "3",
      userName: "Emily Rodriguez",
      userEmail: "emily.r@email.com",
      documentTitle: "Partnership Agreement",
      riskLevel: "high",
      requestedDate: "2024-01-18",
      status: "in-progress",
      documentSummary: "A complex partnership agreement for a new business venture.",
      topRisks: [
        "Unequal profit distribution without clear justification",
        "No exit strategy or dissolution terms",
        "Unlimited personal liability exposure",
      ],
    },
    {
      id: "4",
      userName: "David Kim",
      userEmail: "david.k@email.com",
      documentTitle: "Service Agreement",
      riskLevel: "low",
      requestedDate: "2024-01-17",
      status: "completed",
      documentSummary: "A straightforward service agreement with standard terms.",
      topRisks: [
        "Payment terms slightly favor service provider",
        "Limited warranties on service quality",
        "Standard indemnification clause",
      ],
    },
    {
      id: "5",
      userName: "Lisa Thompson",
      userEmail: "lisa.t@email.com",
      documentTitle: "Lease Agreement",
      riskLevel: "medium",
      requestedDate: "2024-01-16",
      status: "completed",
      documentSummary: "A commercial lease agreement for office space.",
      topRisks: [
        "Landlord has broad rights to enter premises",
        "Tenant responsible for structural repairs",
        "Automatic rent escalation clause",
      ],
    },
  ];

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, { variant: "destructive" | "default" | "secondary"; label: string }> = {
      high: { variant: "destructive", label: "High Risk" },
      medium: { variant: "default", label: "Medium Risk" },
      low: { variant: "secondary", label: "Low Risk" },
    };
    const config = variants[risk] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      "in-progress": { className: "bg-blue-100 text-blue-800", label: "In Progress" },
      completed: { className: "bg-green-100 text-green-800", label: "Completed" },
      rejected: { className: "bg-red-100 text-red-800", label: "Rejected" },
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const handleAccept = () => {
    console.log("Accepting consultation:", selectedConsultation?.id);
    setIsModalOpen(false);
  };

  const handleReject = () => {
    console.log("Rejecting consultation:", selectedConsultation?.id);
    setIsModalOpen(false);
  };

  const handleMarkCompleted = () => {
    console.log("Marking consultation as completed:", selectedConsultation?.id);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Consultations</h1>
        <p className="text-muted-foreground mt-2">Manage all your client consultation requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Consultation Requests</CardTitle>
          <CardDescription>Review and respond to client requests for legal consultation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Document Title</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell className="font-medium">{consultation.userName}</TableCell>
                  <TableCell>{consultation.documentTitle}</TableCell>
                  <TableCell>{getRiskBadge(consultation.riskLevel)}</TableCell>
                  <TableCell>{new Date(consultation.requestedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewConsultation(consultation)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Consultation Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Consultation Details</DialogTitle>
            <DialogDescription>Review the client request and document analysis</DialogDescription>
          </DialogHeader>
          
          {selectedConsultation && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* User Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4" />
                    Client Information
                  </div>
                  <div className="bg-muted p-4 rounded-lg space-y-1">
                    <p className="font-medium">{selectedConsultation.userName}</p>
                    <p className="text-sm text-muted-foreground">{selectedConsultation.userEmail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Requested: {new Date(selectedConsultation.requestedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4" />
                    Document Summary
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium mb-2">{selectedConsultation.documentTitle}</p>
                    <p className="text-sm text-muted-foreground">{selectedConsultation.documentSummary}</p>
                    <div className="mt-2">
                      {getRiskBadge(selectedConsultation.riskLevel)}
                    </div>
                  </div>
                </div>

                {/* Top Risk Clauses */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    Top 3 Risk Clauses
                  </div>
                  <div className="space-y-2">
                    {selectedConsultation.topRisks.map((risk, index) => (
                      <div key={index} className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-destructive/20 text-destructive text-xs font-bold">
                            {index + 1}
                          </span>
                          <p className="text-sm">{risk}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedConsultation?.status === "pending" && (
              <>
                <Button variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
                <Button onClick={handleAccept}>
                  Accept Consultation
                </Button>
              </>
            )}
            {selectedConsultation?.status === "in-progress" && (
              <Button onClick={handleMarkCompleted}>
                Mark as Completed
              </Button>
            )}
            {selectedConsultation?.status === "completed" && (
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Consultations;
