from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
from datetime import datetime
import io

# Import your segmentation engine
from segmentation_engine import CustomerSegmentationEngine

# Initialize FastAPI app
app = FastAPI(title="Growth Analytics API", version="1.0.0")

# Enable CORS for frontend - UPDATED with all possible localhost ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the segmentation engine
engine = CustomerSegmentationEngine()

# In-memory storage
jobs = {}

@app.get("/")
def root():
    return {"message": "Growth Analytics API", "status": "running"}

@app.get("/api/health")
def health_check():
    """Health check endpoint for frontend to verify backend is running"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.post("/api/segment")
async def segment_customers(file: UploadFile = File(...)):
    """Upload customer data and run segmentation"""
    
    # Validate file type
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV or Excel files allowed")
    
    try:
        # Read file
        contents = await file.read()
        
        # Process using your Kaggle engine
        print(f"🔄 Processing file: {file.filename}")
        results = engine.process_upload(contents, file.filename)
        
        # Generate job ID
        job_id = str(uuid.uuid4())
        
        # Store job
        jobs[job_id] = {
            'id': job_id,
            'filename': file.filename,
            'timestamp': datetime.now().isoformat(),
            'results': results,
            'email_captured': False
        }
        
        print(f"✅ File processed: {file.filename} -> Job ID: {job_id}")
        print(f"📊 Found {results['segments_found']} segments")
        
        # Return preview (email required for full details)
        return {
            'job_id': job_id,
            'message': 'File processed successfully',
            'preview': {
                'total_customers': results['total_customers'],
                'segments_found': results['segments_found'],
                'segment_names': results['segment_names']
            },
            'requires_email': True
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/api/report/{job_id}")
async def get_full_report(job_id: str, email: str = None):
    """Get full report (requires email)"""
    
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    
    # If email provided, mark as captured
    if email and not job['email_captured']:
        job['email_captured'] = True
        job['email'] = email
        job['captured_at'] = datetime.now().isoformat()
        print(f"📧 Lead captured: {email} for job {job_id}")
        
    return {
        'success': True,
        'results': job['results'],
        'email_captured': job['email_captured']
    }

@app.get("/api/jobs")
def list_jobs():
    """List all jobs (for debugging)"""
    return {
        'total_jobs': len(jobs),
        'jobs': [
            {
                'id': job_id,
                'filename': job['filename'],
                'timestamp': job['timestamp'],
                'email_captured': job['email_captured']
            }
            for job_id, job in jobs.items()
        ]
    }