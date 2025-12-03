/**
 * Django API Client
 * 
 * This module provides a centralized API client for communicating with the Django backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

type Role = 'USER' | 'LAWYER';

interface User {
  id: number;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  is_verified?: boolean;
  lawyer_status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
}

interface LawyerRegistrationData {
  phone?: string;
  city?: string;
  address?: string;
  primary_specialization?: string;
  bar_council_number?: string;
  experience_years?: number;
  firm?: string;
  bio?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  requiresVerification?: boolean;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle Django REST Framework error format
        let errorMessage = data.detail || data.message || data.error;
        
        // Handle field-specific validation errors (e.g., {"password": ["Too common"]})
        if (!errorMessage && typeof data === 'object') {
          const fieldErrors = Object.entries(data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('; ');
          errorMessage = fieldErrors || 'Request failed';
        }
        
        const error = new Error(errorMessage || 'Request failed') as Error & { data: ApiError };
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', endpoint, error);
      throw error;
    }
  }

  // ============================================================================
  // AUTH ENDPOINTS
  // ============================================================================

  async login(email: string, password: string, role: Role): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role,
    lawyerData?: LawyerRegistrationData
  ): Promise<RegisterResponse> {
    // Backend expects full_name and confirm_password
    const fullName = `${firstName} ${lastName}`.trim();
    return this.request<RegisterResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        confirm_password: password, // Frontend already validates passwords match
        full_name: fullName,
        role,
        ...lawyerData, // Spread lawyer-specific fields if provided
      }),
    });
  }

  async logout(refreshToken: string): Promise<void> {
    return this.request<void>('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    return this.request<{ access: string }>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.request<void>('/auth/password/change/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  }

  async verifyEmail(code: string): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async resendVerification(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/resend-verification/', {
      method: 'POST',
    });
  }

  async getVerificationStatus(): Promise<{ isVerified: boolean; email: string }> {
    return this.request<{ isVerified: boolean; email: string }>('/auth/verification-status/');
  }

  // ============================================================================
  // USER ENDPOINTS
  // ============================================================================

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me/');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/users/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // DOCUMENT ENDPOINTS
  // ============================================================================

  async getDocuments(): Promise<any[]> {
    const response = await this.request<any>('/documents/');
    // Handle paginated response
    return Array.isArray(response) ? response : (response?.results || []);
  }

  async getDocument(id: number): Promise<any> {
    return this.request<any>(`/documents/${id}/`);
  }

  async uploadDocument(file: File, title?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    // Django serializer expects 'name' field, not 'title'
    if (title) formData.append('name', title);

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseUrl}/documents/`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Upload failed:', data);
      // Format error message from Django REST Framework errors
      const errorMsg = data.file?.[0] || data.name?.[0] || data.detail || data.non_field_errors?.[0] || 'Upload failed';
      throw new Error(errorMsg);
    }
    
    return response.json();
  }

  async deleteDocument(id: number): Promise<void> {
    return this.request<void>(`/documents/${id}/`, {
      method: 'DELETE',
    });
  }

  async analyzeDocument(id: number): Promise<any> {
    return this.request<any>(`/documents/${id}/analyze/`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // LAWYER DIRECTORY ENDPOINTS (PUBLIC)
  // ============================================================================

  async getLawyers(params?: { specialization?: string; city?: string }): Promise<any[]> {
    const searchParams = new URLSearchParams();
    if (params?.specialization) searchParams.set('specialization', params.specialization);
    if (params?.city) searchParams.set('city', params.city);
    
    const query = searchParams.toString();
    const response = await this.request<any>(`/lawyers/${query ? `?${query}` : ''}`);
    // Handle paginated response
    return Array.isArray(response) ? response : (response?.results || []);
  }

  async getLawyer(id: number): Promise<any> {
    return this.request<any>(`/lawyers/${id}/`);
  }

  // ============================================================================
  // LAWYER PROFILE ENDPOINTS (FOR LAWYERS)
  // ============================================================================

  async getMyLawyerProfile(): Promise<any> {
    return this.request<any>('/lawyer-profile/me/');
  }

  async createLawyerProfile(data: any): Promise<any> {
    return this.request<any>('/lawyer-profile/me/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLawyerProfile(data: any): Promise<any> {
    return this.request<any>('/lawyer-profile/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getLawyerStats(): Promise<any> {
    return this.request<any>('/lawyer-profile/stats/');
  }

  // ============================================================================
  // CONSULTATION ENDPOINTS
  // ============================================================================

  async getConsultations(): Promise<any[]> {
    const response = await this.request<any>('/consultations/');
    // Handle paginated response
    return Array.isArray(response) ? response : (response?.results || []);
  }

  async getConsultation(id: number): Promise<any> {
    return this.request<any>(`/consultations/${id}/`);
  }

  async createConsultation(lawyerId: number, subject: string, description: string, documentId?: number): Promise<any> {
    const body: any = { 
      lawyer_id: lawyerId, 
      subject,
      description 
    };
    if (documentId) {
      body.document_id = documentId;
    }
    return this.request<any>('/consultations/', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async updateConsultationStatus(id: number, status: string): Promise<any> {
    return this.request<any>(`/consultations/${id}/status/`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getLawyerConsultations(): Promise<any[]> {
    const response = await this.request<any>('/consultations/?role=lawyer');
    // Handle paginated response
    return Array.isArray(response) ? response : (response?.results || []);
  }

  // ============================================================================
  // MESSAGING ENDPOINTS
  // ============================================================================

  async getConversations(): Promise<any[]> {
    const response = await this.request<any>('/messages/conversations/');
    return Array.isArray(response) ? response : (response?.results || []);
  }

  async getMessages(userId: number): Promise<any[]> {
    const response = await this.request<any>(`/messages/?user_id=${userId}`);
    return Array.isArray(response) ? response : (response?.results || []);
  }

  async sendMessage(receiverId: number, content: string, consultationId?: number): Promise<any> {
    return this.request<any>('/messages/', {
      method: 'POST',
      body: JSON.stringify({ 
        receiver_id: receiverId, 
        content,
        consultation_id: consultationId 
      }),
    });
  }

  async markMessagesRead(userId: number): Promise<void> {
    return this.request<void>('/messages/mark-read/', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async getUnreadCount(): Promise<{ unread_count: number }> {
    return this.request<{ unread_count: number }>('/messages/unread-count/');
  }

  // ============================================================================
  // LEGAL UPDATES ENDPOINTS
  // ============================================================================

  async getLegalUpdates(): Promise<any[]> {
    const response = await this.request<any>('/legal-updates/');
    // Handle paginated response
    return Array.isArray(response) ? response : (response?.results || []);
  }

  async getLegalUpdate(id: number): Promise<any> {
    return this.request<any>(`/legal-updates/${id}/`);
  }

  // ============================================================================
  // AI ENDPOINTS
  // ============================================================================

  async getDocumentAnalysis(documentId: number): Promise<DocumentAnalysisResult> {
    return this.request<DocumentAnalysisResult>(`/ai/documents/${documentId}/analyze/`);
  }

  async analyzeDocumentAI(documentId: number, force: boolean = false): Promise<DocumentAnalysisResult> {
    return this.request<DocumentAnalysisResult>(`/ai/documents/${documentId}/analyze/`, {
      method: 'POST',
      body: JSON.stringify({ force }),
    });
  }

  async chatWithAI(message: string, sessionId?: string, documentId?: number): Promise<ChatResponse> {
    return this.request<ChatResponse>('/ai/chat/', {
      method: 'POST',
      body: JSON.stringify({
        message,
        session_id: sessionId,
        document_id: documentId,
      }),
    });
  }

  async chatAboutDocument(documentId: number, message: string, sessionId?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/ai/documents/${documentId}/chat/`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });
  }

  async getChatSuggestions(documentId?: number): Promise<{ questions: string[] }> {
    const endpoint = documentId 
      ? `/ai/documents/${documentId}/chat/suggestions/`
      : '/ai/chat/suggestions/';
    return this.request<{ questions: string[] }>(endpoint);
  }

  async clearChatHistory(sessionId: string): Promise<void> {
    return this.request<void>(`/ai/chat/${sessionId}/clear/`, {
      method: 'DELETE',
    });
  }
}

// AI Types
interface DocumentAnalysisResult {
  id: number;
  document: number;
  summary: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  key_findings: KeyFinding[];
  key_terms: KeyTerm[];
  recommendations: string[];
  clauses_detected: ClauseDetected[];
  document_metrics: DocumentMetrics;
  analyzed_at: string;
}

interface KeyFinding {
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
  clause: string;
}

interface KeyTerm {
  term: string;
  value: string;
}

interface ClauseDetected {
  type: string;
  content: string;
  risk_level: 'low' | 'medium' | 'high';
  explanation: string;
}

interface DocumentMetrics {
  clarity: number;
  fairness: number;
  completeness: number;
  complexity: number;
}

interface Citation {
  source: 'documents' | 'laws';
  id: string | number;
  chunk_index?: number;
  snippet: string;
  score: number;
}

interface ChatResponse {
  role: 'assistant';
  content: string;
  type: string;
  source: string;
  confidence?: 'low' | 'medium' | 'high';
  session_id: string;
  references?: string[];
  citations?: Citation[];
  disclaimer?: string;
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
export type { User, LoginResponse, RegisterResponse, ApiError, Role, LawyerRegistrationData };
