/**
 * Custom hooks for API data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// USER HOOKS
// ============================================================================

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateProfile>[0]) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

// ============================================================================
// DOCUMENT HOOKS
// ============================================================================

export function useDocuments() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => api.getDocuments(),
    enabled: isAuthenticated,
  });
}

export function useDocument(id: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => api.getDocument(id),
    enabled: isAuthenticated && !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title?: string }) => 
      api.uploadDocument(file, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useAnalyzeDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.analyzeDocument(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// ============================================================================
// LAWYER HOOKS
// ============================================================================

export function useLawyers(params?: { specialization?: string; city?: string }) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['lawyers', params],
    queryFn: () => api.getLawyers(params),
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useLawyer(id: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['lawyer', id],
    queryFn: () => api.getLawyer(id),
    enabled: isAuthenticated && !!id,
    retry: false,
  });
}

// ============================================================================
// LAWYER PROFILE HOOKS (FOR LAWYERS)
// ============================================================================

export function useMyLawyerProfile() {
  const { isAuthenticated, role } = useAuth();
  
  return useQuery({
    queryKey: ['myLawyerProfile'],
    queryFn: () => api.getMyLawyerProfile(),
    enabled: isAuthenticated && role === 'LAWYER',
    retry: false,
  });
}

export function useCreateLawyerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.createLawyerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLawyerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
    },
  });
}

export function useUpdateLawyerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.updateLawyerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLawyerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
    },
  });
}

export function useLawyerStats() {
  const { isAuthenticated, role } = useAuth();
  
  return useQuery({
    queryKey: ['lawyerStats'],
    queryFn: () => api.getLawyerStats(),
    enabled: isAuthenticated && role === 'LAWYER',
    retry: false,
  });
}

// ============================================================================
// CONSULTATION HOOKS
// ============================================================================

export function useConsultations() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['consultations'],
    queryFn: () => api.getConsultations(),
    enabled: isAuthenticated,
  });
}

export function useLawyerConsultations() {
  const { isAuthenticated, role } = useAuth();
  
  return useQuery({
    queryKey: ['lawyerConsultations'],
    queryFn: () => api.getLawyerConsultations(),
    enabled: isAuthenticated && role === 'LAWYER',
  });
}

export function useConsultation(id: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['consultation', id],
    queryFn: () => api.getConsultation(id),
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ lawyerId, message }: { lawyerId: number; message: string }) =>
      api.createConsultation(lawyerId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}

export function useUpdateConsultationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateConsultationStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}

// ============================================================================
// MESSAGING HOOKS
// ============================================================================

export function useConversations() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.getConversations(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMessages(userId: number | null) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['messages', userId],
    queryFn: () => api.getMessages(userId!),
    enabled: isAuthenticated && !!userId,
    refetchInterval: 5000, // Refetch every 5 seconds for active chat
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ receiverId, content, consultationId }: { 
      receiverId: number; 
      content: string; 
      consultationId?: number;
    }) => api.sendMessage(receiverId, content, consultationId),
    onSuccess: (_, { receiverId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', receiverId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useUnreadCount() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => api.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
}

// ============================================================================
// LEGAL UPDATES HOOKS
// ============================================================================

export function useLegalUpdates() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['legalUpdates'],
    queryFn: () => api.getLegalUpdates(),
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useLegalUpdate(id: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['legalUpdate', id],
    queryFn: () => api.getLegalUpdate(id),
    enabled: isAuthenticated && !!id,
    retry: false,
  });
}

// ============================================================================
// AI HOOKS
// ============================================================================

export function useAnalyzeDocumentAI() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ documentId, force = true }: { documentId: number; force?: boolean }) => 
      api.analyzeDocumentAI(documentId, force),
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['documentAnalysis', documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDocumentAnalysis(documentId: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['documentAnalysis', documentId],
    queryFn: () => api.getDocumentAnalysis(documentId),
    enabled: isAuthenticated && !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes - analysis doesn't change often
    retry: false,
  });
}

export function useChatWithAI() {
  return useMutation({
    mutationFn: ({ message, sessionId, documentId }: { 
      message: string; 
      sessionId?: string; 
      documentId?: number;
    }) => api.chatWithAI(message, sessionId, documentId),
  });
}

export function useChatAboutDocument() {
  return useMutation({
    mutationFn: ({ documentId, message, sessionId }: { 
      documentId: number; 
      message: string; 
      sessionId?: string;
    }) => api.chatAboutDocument(documentId, message, sessionId),
  });
}

export function useChatSuggestions(documentId?: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['chatSuggestions', documentId],
    queryFn: () => api.getChatSuggestions(documentId),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useClearChatHistory() {
  return useMutation({
    mutationFn: (sessionId: string) => api.clearChatHistory(sessionId),
  });
}
