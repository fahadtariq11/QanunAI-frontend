import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, FileText, User, Calendar, Loader2, MessageCircle, ClipboardList } from "lucide-react";
import { useLawyerConsultations, useUpdateConsultationStatus, useSendMessage } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Consultation = {
  id: number;
  user_id?: number;
  user_name: string;
  user_email: string;
  subject?: string;
  description?: string;
  document_title: string;
  document_summary?: string;
  top_risks?: string[];
  risk_level: string;
  requested_at: string;
  status: string;
};

const Consultations = () => {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();
  
  const { data: consultations = [], isLoading, error, refetch } = useLawyerConsultations();
  const updateStatus = useUpdateConsultationStatus();
  const sendMessage = useSendMessage();

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, { variant: "destructive" | "default" | "secondary"; label: string }> = {
      high: { variant: "destructive", label: "High Risk" },
      medium: { variant: "default", label: "Medium Risk" },
      low: { variant: "secondary", label: "Low Risk" },
    };
    const riskLower = (risk || 'medium').toLowerCase();
    const config = variants[riskLower] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      "in-progress": { className: "bg-blue-100 text-blue-800", label: "In Progress" },
      completed: { className: "bg-green-100 text-green-800", label: "Completed" },
      rejected: { className: "bg-red-100 text-red-800", label: "Rejected" },
    };
    const statusLower = (status || 'pending').toLowerCase();
    const config = variants[statusLower] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedConsultation) return;
    
    try {
      await updateStatus.mutateAsync({ 
        id: selectedConsultation.id, 
        status: newStatus 
      });
      toast({
        title: "Status Updated",
        description: `Consultation marked as ${newStatus}.`,
      });
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update consultation status.",
        variant: "destructive",
      });
    }
  };

  const handleAccept = () => handleStatusUpdate('in-progress');
  const handleReject = () => handleStatusUpdate('rejected');
  const handleMarkCompleted = () => handleStatusUpdate('completed');

  const handleOpenReply = () => {
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedConsultation || !replyMessage.trim()) return;
    
    try {
      // We need the user_id from the consultation - if not present, we'll parse from user_email
      // For now, we'll use a workaround by extracting user info
      await sendMessage.mutateAsync({
        receiverId: selectedConsultation.user_id || 0, // This needs the actual user id
        content: replyMessage.trim(),
        consultationId: selectedConsultation.id,
      });
      
      toast({
        title: "Message Sent",
        description: "Your reply has been sent to the client.",
      });
      setIsReplyModalOpen(false);
      setReplyMessage('');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
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
        <p className="text-muted-foreground mt-2">Manage all your client consultation requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Consultation Requests</CardTitle>
          <CardDescription>Review and respond to client requests for legal consultation</CardDescription>
        </CardHeader>
        <CardContent>
          {consultations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No consultation requests yet.</p>
              <p className="text-sm">When users request your consultation, they will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation: Consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">{consultation.user_name}</TableCell>
                    <TableCell>{consultation.subject || consultation.document_title || '—'}</TableCell>
                    <TableCell>{getRiskBadge(consultation.risk_level)}</TableCell>
                    <TableCell>{new Date(consultation.requested_at).toLocaleDateString()}</TableCell>
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
          )}
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
                {(selectedConsultation.subject || selectedConsultation.description) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ClipboardList className="h-4 w-4" />
                      Consultation Request
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      {selectedConsultation.subject && (
                        <p className="font-medium mb-2">{selectedConsultation.subject}</p>
                      )}
                      {selectedConsultation.description && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedConsultation.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Document Summary (if any) */}
                {(selectedConsultation.document_title || selectedConsultation.document_summary) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4" />
                      Document Summary
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      {selectedConsultation.document_title && (
                        <p className="font-medium mb-2">{selectedConsultation.document_title}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {selectedConsultation.document_summary || 'No summary provided.'}
                      </p>
                      {selectedConsultation.risk_level && (
                        <div className="mt-2">
                          {getRiskBadge(selectedConsultation.risk_level)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Top Risk Clauses */}
                {selectedConsultation.top_risks && selectedConsultation.top_risks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="h-4 w-4" />
                      Top Risk Clauses
                    </div>
                    <div className="space-y-2">
                      {selectedConsultation.top_risks.map((risk: string, index: number) => (
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
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedConsultation?.status?.toLowerCase() === "pending" && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Reject
                </Button>
                <Button 
                  onClick={handleAccept}
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Accept Consultation
                </Button>
              </>
            )}
            {selectedConsultation?.status?.toLowerCase() === "in-progress" && (
              <>
                <Button 
                  variant="outline"
                  onClick={handleOpenReply}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Reply to Client
                </Button>
                <Button 
                  onClick={handleMarkCompleted}
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Mark as Completed
                </Button>
              </>
            )}
            {(selectedConsultation?.status?.toLowerCase() === "completed" || 
              selectedConsultation?.status?.toLowerCase() === "rejected") && (
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to {selectedConsultation?.user_name}</DialogTitle>
            <DialogDescription>
              Send a message to the client regarding their consultation request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reply">Your Message</Label>
              <Textarea
                id="reply"
                placeholder="Type your response to the client..."
                rows={5}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReplyModalOpen(false)}
              disabled={sendMessage.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply}
              disabled={sendMessage.isPending || !replyMessage.trim()}
            >
              {sendMessage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Consultations;
