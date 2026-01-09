from sqlalchemy import Column, String, Boolean, Integer, Text, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    user_type = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)

    # Relationships
    subjects_created = relationship("Subject", back_populates="creator")
    virtual_classes = relationship("VirtualClass", back_populates="teacher")
    class_enrollments = relationship("ClassEnrollment", back_populates="student")
    course_enrollments = relationship("CourseEnrollment", back_populates="student")
    submissions = relationship("StudentSubmission", back_populates="student")

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    slug = Column(String(255), unique=True, nullable=False)
    is_published = Column(Boolean, default=False)
    thumbnail_url = Column(String(500))
    created_at = Column(DateTime, default=func.now())

    # Relationships
    enrollments = relationship("CourseEnrollment", back_populates="course")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    total_points = Column(Integer)
    time_limit_minutes = Column(Integer)
    is_published = Column(Boolean, default=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=func.now())

    # Relationships
    creator = relationship("User", back_populates="subjects_created")
    exercises = relationship("Exercise", back_populates="subject", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    question = Column(Text, nullable=False)
    exercise_type = Column(String(20), nullable=False)
    points = Column(Integer, default=1)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    subject = relationship("Subject", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise", cascade="all, delete-orphan")
    submissions = relationship("StudentSubmission", back_populates="exercise")

class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    exercise_id = Column(UUID(as_uuid=True), ForeignKey("exercises.id", ondelete="CASCADE"), nullable=False)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    exercise = relationship("Exercise", back_populates="options")

class VirtualClass(Base):
    __tablename__ = "virtual_classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    access_code = Column(String(50), unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    teacher = relationship("User", back_populates="virtual_classes")
    enrollments = relationship("ClassEnrollment", back_populates="virtual_class", cascade="all, delete-orphan")

class ClassEnrollment(Base):
    __tablename__ = "class_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_id = Column(UUID(as_uuid=True), ForeignKey("virtual_classes.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime, default=func.now())
    status = Column(String(20), default="active")

    # Relationships
    virtual_class = relationship("VirtualClass", back_populates="enrollments")
    student = relationship("User", back_populates="class_enrollments")

class StudentSubmission(Base):
    __tablename__ = "student_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(UUID(as_uuid=True), ForeignKey("exercises.id", ondelete="CASCADE"), nullable=False)
    text_response = Column(Text)
    is_correct = Column(Boolean)
    score = Column(Integer)
    submitted_at = Column(DateTime, default=func.now())

    # Relationships
    student = relationship("User", back_populates="submissions")
    exercise = relationship("Exercise", back_populates="submissions")

class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime, default=func.now())

    # Relationships
    student = relationship("User", back_populates="course_enrollments")
    course = relationship("Course", back_populates="enrollments")
