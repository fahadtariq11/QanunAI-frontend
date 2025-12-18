Here is a clean, professional, and developer-friendly **GitHub README.md draft** for your *Legal Document Analyzer* project.
It includes badges, descriptions, installation instructions, architecture details, screenshots placeholders, API outline, and contribution guidelines.



# 🧾 **Legal Document Analyzer – AI-Powered Contract Understanding Platform**

An intelligent, multi-agent LegalTech platform that helps individuals, freelancers, and small businesses understand legal documents using OCR, clause detection, risk analysis, RAG-based question answering, and compliance checking against Pakistani laws.

This system empowers non-lawyers to interpret contracts quickly and safely while providing access to verified lawyers for professional advice.

---

## 🏃 **Running Locally**

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL with pgvector extension (or use the hosted Render database)

### 1. Backend (Django)

```bash
# Navigate to backend
cd backend-deployment/QanunAI

# Activate virtual environment
.\venv\Scripts\Activate.ps1    # Windows PowerShell
# OR
source venv/bin/activate        # macOS/Linux

# Navigate to Django project
cd backend

# Create .env file with required variables:
# DATABASE_URL=postgres://...
# OPENROUTER_API_KEY=your-key
# DEBUG=True
# ALLOWED_HOSTS=localhost,127.0.0.1
# CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080

# Run migrations (if needed)
python manage.py migrate

# Start the server
python manage.py runserver
# Backend runs at http://localhost:8000
```

### 2. Frontend (Vite + React)

```bash
# Navigate to frontend
cd frontend-deployment/QanunAI-frontend

# Install dependencies
npm install

# Ensure .env has correct backend URL:
# VITE_API_BASE_URL="http://localhost:8000/api"

# Start dev server
npm run dev
# Frontend runs at http://localhost:8080
```

### 3. Access the App
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

---



## 🚀 **Features**

### 📝 Document Upload & OCR

* Upload PDF, DOCX, or image-based legal documents
* Automatic OCR using **Tesseract** for scanned files
* Text cleaning, segmentation, and document type identification

### 🤖 Multi-Agent AI System

The platform uses an agentic AI architecture with four specialized agents:

1. **Document Intake Agent** – OCR, cleaning, chunking, vectorization
2. **Contract Analysis Agent** – clause detection, risk scoring, summary generation
3. **Conversational QA Agent** – RAG-powered question answering
4. **Compliance Agent** – compares risky clauses to Pakistani legal corpus

### 📚 Retrieval-Augmented Generation (RAG)

* FAISS-based dual vector store (Document + Laws)
* Legal corpus grounding improves accuracy and reduces hallucinations

### 👨‍⚖️ Lawyer Directory & Consultations

* Browse verified lawyers by specialization or city
* Submit consultation requests linked to a specific document
* Lawyers receive and manage consultation requests

### 🔐 Security

* JWT-based authentication
* Encrypted file storage for all uploaded contracts
* Role-based access (user/lawyer/admin)



## 🏗️ **System Architecture**

```
Frontend (React + TypeScript + Vite)
       |
Backend API (FastAPI, JWT, Orchestration Layer)
       |
AI Layer (Multi-Agent System)
    ├── Intake Agent
    ├── Analysis Agent
    ├── QA Agent
    └── Compliance Agent
       |
Storage Layer
    ├── PostgreSQL (Structured Data)
    ├── Encrypted File Storage
    └── FAISS Vector Stores (Document + Law Corpus)
```






## 🛠️ **Tech Stack**

### **Frontend**

* React 18
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui

### **Backend**

* FastAPI
* Python 3.10+
* Pydantic
* Uvicorn

### **AI & NLP**

* Tesseract OCR
* FAISS
* Transformer Embeddings
* RAG + LLM (OpenAI-compatible API)
* Custom Multi-Agent Architecture

### **Database & Storage**

* PostgreSQL
* Encrypted file storage (documents)
* Vector stores for embeddings


## ⚙️ **Installation & Setup**

### **1. Clone the Project**

```bash
git clone https://github.com/<your-org>/legal-document-analyzer.git
cd legal-document-analyzer
```



## 🖥️ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### **Environment Variables**

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost/legal_analyzer
LLM_API_KEY=your_api_key
SECRET_KEY=your_secret_key
OCR_PATH=/usr/bin/tesseract
```

### **Run server**

```bash
uvicorn main:app --reload
```



## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Set frontend `.env`:

```
# Local backend
VITE_API_BASE_URL=http://localhost:8000/api

# Production backend (Railway)
# VITE_API_BASE_URL=https://stunning-healing-production.up.railway.app/api
```

Deployment (Vercel):

1) Root Directory: set to `frontend/QanunAI` if deploying from monorepo.
2) Framework Preset: Vite
3) Build Command: `vite build`
4) Output Directory: `dist`
5) Environment Variables: add `VITE_API_BASE_URL=https://stunning-healing-production.up.railway.app/api`

CLI deploy from this folder:

```powershell
npm install
npm run build
npm i -g vercel
vercel
vercel --prod
```


## 🧪 **Testing**

* Backend tests use `pytest`
* Frontend tests optional with Vitest/Jest
* Manual tests for document processing workflows



## 📡 **API Overview (Short Version)**

### **Authentication**

`POST /auth/register`
`POST /auth/login`

### **Documents**

`POST /documents/upload`
`GET /documents/{id}`
`GET /documents/{id}/analysis`

### **QA Chat**

`POST /qa`

### **Compliance**

`POST /compliance/check/{documentId}`

### **Lawyers**

`GET /lawyers`
`POST /consultations/request`

*(More detailed API docs are auto-generated via FastAPI’s `/docs` and `/redoc`.)*


## 🤝 **Contribution Guide**

1. Fork the repo
2. Create a feature branch
3. Follow the existing coding standards
4. Add tests where needed
5. Submit a pull request



## 📄 **License**

MIT License or choose another license depending on your preference.



## ⭐ **Acknowledgements**

* FCCU Faculty & Advisers
* OpenAI and HuggingFace ecosystems
* Tesseract OCR contributors
* PostgreSQL and FAISS developers


