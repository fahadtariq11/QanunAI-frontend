import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, Calendar, Loader2, MessageCircle, ClipboardList, Paperclip } from "lucide-react";
import { useLawyerConsultations } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

type Consultation = {
  id: number;
  user_id?: number;
  user_name: string;
  user_email: string;
  subject?: string;
  description?: string;
  document_id?: number;
  document_name?: string;
  requested_at: string;
  status: string;
};

const Consultations = () => {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: consultations = [], isLoading, error, refetch } = useLawyerConsultations();

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const handleOpenChat = () => {
    if (!selectedConsultation?.user_id) {
      toast({
        title: "Error",
        description: "Unable to start chat. User information not available.",
        variant: "destructive",
      });
      return;
    }
    
    // Close the modal and navigate to messages with this user
    setIsModalOpen(false);
    navigate(`/lawyer/messages?userId=${selectedConsultation.user_id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load consultations. Please try again.</p>
            <Button onClick={() => refetch()} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Consultations</h1>
        <p className="text-muted-foreground mt-2">View and respond to client consultation requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consultation Requests</CardTitle>
          <CardDescription>Click on a request to view details and start a conversation</CardDescription>
        </CardHeader>
        <CardContent>
          {consultations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No consultation requests yet.</p>
              <p className="text-sm">When users request your consultation, they will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation: Consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">{consultation.user_name}</TableCell>
                    <TableCell>{consultation.subject || '—'}</TableCell>
                    <TableCell>
                      {consultation.document_name ? (
                        <Badge variant="secondary" className="gap-1">
                          <Paperclip className="h-3 w-3" />
                          Attached
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(consultation.requested_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewConsultation(consultation)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Consultation Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Consultation Request</DialogTitle>
            <DialogDescription>Review the client's request and respond via chat</DialogDescription>
          </DialogHeader>
          
          {selectedConsultation && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Client Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4" />
                    Client Information
                  </div>
                  <div className="bg-muted p-4 rounded-lg space-y-1">
                    <p className="font-medium">{selectedConsultation.user_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedConsultation.user_email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Requested: {new Date(selectedConsultation.requested_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consultation Request Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ClipboardList className="h-4 w-4" />
                    Request Details
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    {selectedConsultation.subject && (
                      <p className="font-medium mb-2">{selectedConsultation.subject}</p>
                    )}
                    {selectedConsultation.description ? (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {selectedConsultation.description}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No description provided.</p>
                    )}
                  </div>
                </div>

                {/* Attached Document (if any) */}
                {selectedConsultation.document_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4" />
                      Attached Document
                    </div>
                    <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{selectedConsultation.document_name}</p>
                        <p className="text-xs text-muted-foreground">Document attached by client</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleOpenChat}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Open Chat with Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Consultations;
