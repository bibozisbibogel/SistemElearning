from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from uuid import UUID

from database import get_db, engine, Base
from models import User, Course, Subject, Exercise, VirtualClass, StudentSubmission
from schemas import (
    UserCreate, UserUpdate, UserResponse,
    CourseCreate, CourseUpdate, CourseResponse,
    SubjectCreate, SubjectUpdate, SubjectResponse,
    ExerciseCreate, ExerciseUpdate, ExerciseResponse,
    VirtualClassCreate, VirtualClassUpdate, VirtualClassResponse,
    SubmissionCreate, SubmissionUpdate, SubmissionResponse
)

app = FastAPI(
    title="E-Learning API",
    description="API pentru sistemul E-Learning - Cerinta 7",
    version="1.0.0"
)

# CORS pentru frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# USER ENDPOINTS
# ============================================================================
@app.get("/api/users", response_model=List[UserResponse], tags=["Users"])
def get_users(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    user_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Obtine lista de utilizatori cu filtrare optionala"""
    query = db.query(User)

    if search:
        query = query.filter(
            or_(
                User.first_name.ilike(f"%{search}%"),
                User.last_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
    if user_type:
        query = query.filter(User.user_type == user_type)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    return query.offset(skip).limit(limit).all()

@app.get("/api/users/{user_id}", response_model=UserResponse, tags=["Users"])
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    """Obtine un utilizator dupa ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/users", response_model=UserResponse, tags=["Users"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Creeaza un utilizator nou"""
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/api/users/{user_id}", response_model=UserResponse, tags=["Users"])
def update_user(user_id: UUID, user: UserUpdate, db: Session = Depends(get_db)):
    """Actualizeaza un utilizator"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/api/users/{user_id}", tags=["Users"])
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    """Sterge un utilizator"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

# ============================================================================
# COURSE ENDPOINTS
# ============================================================================
@app.get("/api/courses", response_model=List[CourseResponse], tags=["Courses"])
def get_courses(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    is_published: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Obtine lista de cursuri cu filtrare optionala"""
    query = db.query(Course)

    if search:
        query = query.filter(
            or_(
                Course.title.ilike(f"%{search}%"),
                Course.description.ilike(f"%{search}%")
            )
        )
    if is_published is not None:
        query = query.filter(Course.is_published == is_published)

    return query.offset(skip).limit(limit).all()

@app.get("/api/courses/{course_id}", response_model=CourseResponse, tags=["Courses"])
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    """Obtine un curs dupa ID"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.post("/api/courses", response_model=CourseResponse, tags=["Courses"])
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    """Creeaza un curs nou"""
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.put("/api/courses/{course_id}", response_model=CourseResponse, tags=["Courses"])
def update_course(course_id: UUID, course: CourseUpdate, db: Session = Depends(get_db)):
    """Actualizeaza un curs"""
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")

    update_data = course.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_course, key, value)

    db.commit()
    db.refresh(db_course)
    return db_course

@app.delete("/api/courses/{course_id}", tags=["Courses"])
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    """Sterge un curs"""
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted successfully"}

# ============================================================================
# SUBJECT ENDPOINTS
# ============================================================================
@app.get("/api/subjects", response_model=List[SubjectResponse], tags=["Subjects"])
def get_subjects(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    is_published: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Obtine lista de subiecte cu filtrare optionala"""
    query = db.query(Subject)

    if search:
        query = query.filter(
            or_(
                Subject.title.ilike(f"%{search}%"),
                Subject.description.ilike(f"%{search}%")
            )
        )
    if is_published is not None:
        query = query.filter(Subject.is_published == is_published)

    return query.offset(skip).limit(limit).all()

@app.post("/api/subjects", response_model=SubjectResponse, tags=["Subjects"])
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    """Creeaza un subiect nou"""
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.put("/api/subjects/{subject_id}", response_model=SubjectResponse, tags=["Subjects"])
def update_subject(subject_id: UUID, subject: SubjectUpdate, db: Session = Depends(get_db)):
    """Actualizeaza un subiect"""
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    update_data = subject.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_subject, key, value)

    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.delete("/api/subjects/{subject_id}", tags=["Subjects"])
def delete_subject(subject_id: UUID, db: Session = Depends(get_db)):
    """Sterge un subiect"""
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(db_subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

# ============================================================================
# VIRTUAL CLASS ENDPOINTS
# ============================================================================
@app.get("/api/classes", response_model=List[VirtualClassResponse], tags=["Virtual Classes"])
def get_classes(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Obtine lista de clase virtuale cu filtrare optionala"""
    query = db.query(VirtualClass)

    if search:
        query = query.filter(
            or_(
                VirtualClass.name.ilike(f"%{search}%"),
                VirtualClass.access_code.ilike(f"%{search}%")
            )
        )
    if is_active is not None:
        query = query.filter(VirtualClass.is_active == is_active)

    return query.offset(skip).limit(limit).all()

@app.post("/api/classes", response_model=VirtualClassResponse, tags=["Virtual Classes"])
def create_class(virtual_class: VirtualClassCreate, db: Session = Depends(get_db)):
    """Creeaza o clasa virtuala noua"""
    db_class = VirtualClass(**virtual_class.model_dump())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@app.put("/api/classes/{class_id}", response_model=VirtualClassResponse, tags=["Virtual Classes"])
def update_class(class_id: UUID, virtual_class: VirtualClassUpdate, db: Session = Depends(get_db)):
    """Actualizeaza o clasa virtuala"""
    db_class = db.query(VirtualClass).filter(VirtualClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Virtual class not found")

    update_data = virtual_class.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_class, key, value)

    db.commit()
    db.refresh(db_class)
    return db_class

@app.delete("/api/classes/{class_id}", tags=["Virtual Classes"])
def delete_class(class_id: UUID, db: Session = Depends(get_db)):
    """Sterge o clasa virtuala"""
    db_class = db.query(VirtualClass).filter(VirtualClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Virtual class not found")

    db.delete(db_class)
    db.commit()
    return {"message": "Virtual class deleted successfully"}

# ============================================================================
# SUBMISSION ENDPOINTS
# ============================================================================
@app.get("/api/submissions", response_model=List[SubmissionResponse], tags=["Submissions"])
def get_submissions(
    skip: int = 0,
    limit: int = 100,
    student_id: Optional[UUID] = None,
    exercise_id: Optional[UUID] = None,
    is_correct: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Obtine lista de trimiteri cu filtrare optionala"""
    query = db.query(StudentSubmission)

    if student_id:
        query = query.filter(StudentSubmission.student_id == student_id)
    if exercise_id:
        query = query.filter(StudentSubmission.exercise_id == exercise_id)
    if is_correct is not None:
        query = query.filter(StudentSubmission.is_correct == is_correct)

    return query.offset(skip).limit(limit).all()

@app.post("/api/submissions", response_model=SubmissionResponse, tags=["Submissions"])
def create_submission(submission: SubmissionCreate, db: Session = Depends(get_db)):
    """Creeaza o trimitere noua"""
    db_submission = StudentSubmission(**submission.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

@app.put("/api/submissions/{submission_id}", response_model=SubmissionResponse, tags=["Submissions"])
def update_submission(submission_id: UUID, submission: SubmissionUpdate, db: Session = Depends(get_db)):
    """Actualizeaza o trimitere"""
    db_submission = db.query(StudentSubmission).filter(StudentSubmission.id == submission_id).first()
    if not db_submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    update_data = submission.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_submission, key, value)

    db.commit()
    db.refresh(db_submission)
    return db_submission

@app.delete("/api/submissions/{submission_id}", tags=["Submissions"])
def delete_submission(submission_id: UUID, db: Session = Depends(get_db)):
    """Sterge o trimitere"""
    db_submission = db.query(StudentSubmission).filter(StudentSubmission.id == submission_id).first()
    if not db_submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    db.delete(db_submission)
    db.commit()
    return {"message": "Submission deleted successfully"}

# ============================================================================
# ROOT ENDPOINT
# ============================================================================
@app.get("/", tags=["Root"])
def root():
    return {"message": "E-Learning API - Cerinta 7", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
