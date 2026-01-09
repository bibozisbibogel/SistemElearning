from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# ============== USER SCHEMAS ==============
class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    user_type: str
    is_active: bool = True

class UserCreate(UserBase):
    password_hash: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_type: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ============== COURSE SCHEMAS ==============
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    slug: str
    is_published: bool = False
    thumbnail_url: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    slug: Optional[str] = None
    is_published: Optional[bool] = None
    thumbnail_url: Optional[str] = None

class CourseResponse(CourseBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ============== SUBJECT SCHEMAS ==============
class SubjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    total_points: Optional[int] = None
    time_limit_minutes: Optional[int] = None
    is_published: bool = False

class SubjectCreate(SubjectBase):
    created_by: Optional[UUID] = None

class SubjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    total_points: Optional[int] = None
    time_limit_minutes: Optional[int] = None
    is_published: Optional[bool] = None

class SubjectResponse(SubjectBase):
    id: UUID
    created_by: Optional[UUID]
    created_at: datetime

    class Config:
        from_attributes = True

# ============== EXERCISE SCHEMAS ==============
class ExerciseBase(BaseModel):
    title: str
    question: str
    exercise_type: str
    points: int = 1
    order_index: int

class ExerciseCreate(ExerciseBase):
    subject_id: UUID

class ExerciseUpdate(BaseModel):
    title: Optional[str] = None
    question: Optional[str] = None
    exercise_type: Optional[str] = None
    points: Optional[int] = None
    order_index: Optional[int] = None

class ExerciseResponse(ExerciseBase):
    id: UUID
    subject_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ============== VIRTUAL CLASS SCHEMAS ==============
class VirtualClassBase(BaseModel):
    name: str
    description: Optional[str] = None
    access_code: Optional[str] = None
    is_active: bool = True

class VirtualClassCreate(VirtualClassBase):
    teacher_id: UUID

class VirtualClassUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    access_code: Optional[str] = None
    is_active: Optional[bool] = None

class VirtualClassResponse(VirtualClassBase):
    id: UUID
    teacher_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ============== STUDENT SUBMISSION SCHEMAS ==============
class SubmissionBase(BaseModel):
    text_response: Optional[str] = None
    is_correct: Optional[bool] = None
    score: Optional[int] = None

class SubmissionCreate(SubmissionBase):
    student_id: UUID
    exercise_id: UUID

class SubmissionUpdate(BaseModel):
    text_response: Optional[str] = None
    is_correct: Optional[bool] = None
    score: Optional[int] = None

class SubmissionResponse(SubmissionBase):
    id: UUID
    student_id: UUID
    exercise_id: UUID
    submitted_at: datetime

    class Config:
        from_attributes = True

# ============== SEARCH SCHEMAS ==============
class SearchParams(BaseModel):
    query: Optional[str] = None
    user_type: Optional[str] = None
    is_active: Optional[bool] = None
    is_published: Optional[bool] = None
