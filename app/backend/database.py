"""
Chemical Thinking - Local SQLite Database
Stores student profiles, progress, and homework submissions
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any

# Database file location
DB_PATH = Path(__file__).parent / "chem_thinking.db"


def get_connection():
    """Get database connection with row factory"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Initialize database tables"""
    conn = get_connection()
    cursor = conn.cursor()

    # Students table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Progress tracking (mastery per primitive/topic)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            primitive TEXT NOT NULL,
            topic TEXT NOT NULL,
            streak INTEGER DEFAULT 0,
            mastery_achieved BOOLEAN DEFAULT FALSE,
            attempts INTEGER DEFAULT 0,
            last_attempt TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(student_id),
            UNIQUE(student_id, primitive, topic)
        )
    """)

    # Practice attempts (individual problems)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS practice_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            primitive TEXT NOT NULL,
            topic TEXT NOT NULL,
            problem_text TEXT,
            student_answer TEXT,
            correct_answer TEXT,
            is_correct BOOLEAN,
            feedback TEXT,
            attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(student_id)
        )
    """)

    # Homework assignments
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS homework_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            lecture_id INTEGER,
            primitives TEXT,  -- JSON list of primitives covered
            due_date TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
    """)

    # Homework submissions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS homework_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            assignment_id INTEGER NOT NULL,
            answers TEXT NOT NULL,  -- JSON object of answers
            score REAL,
            feedback TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            graded_at TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(student_id),
            FOREIGN KEY (assignment_id) REFERENCES homework_assignments(id),
            UNIQUE(student_id, assignment_id)
        )
    """)

    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")


# Student operations
def create_student(student_id: str, name: str, email: str) -> Dict[str, Any]:
    """Register a new student"""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO students (student_id, name, email) VALUES (?, ?, ?)",
            (student_id, name, email)
        )
        conn.commit()
        return {"success": True, "student_id": student_id, "message": "Student registered"}
    except sqlite3.IntegrityError as e:
        if "student_id" in str(e):
            return {"success": False, "error": "Student ID already exists"}
        elif "email" in str(e):
            return {"success": False, "error": "Email already registered"}
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def get_student(student_id: str) -> Optional[Dict[str, Any]]:
    """Get student by ID"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE student_id = ?", (student_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def update_last_active(student_id: str):
    """Update student's last active timestamp"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE students SET last_active = ? WHERE student_id = ?",
        (datetime.now(), student_id)
    )
    conn.commit()
    conn.close()


# Progress operations
def get_progress(student_id: str) -> List[Dict[str, Any]]:
    """Get all progress for a student"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM progress WHERE student_id = ? ORDER BY primitive, topic",
        (student_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def update_progress(student_id: str, primitive: str, topic: str, is_correct: bool) -> Dict[str, Any]:
    """Update progress after a practice attempt"""
    conn = get_connection()
    cursor = conn.cursor()

    # Get current progress
    cursor.execute(
        "SELECT streak, attempts FROM progress WHERE student_id = ? AND primitive = ? AND topic = ?",
        (student_id, primitive, topic)
    )
    row = cursor.fetchone()

    if row:
        streak = row["streak"] + 1 if is_correct else 0
        attempts = row["attempts"] + 1
        mastery = streak >= 3

        cursor.execute("""
            UPDATE progress
            SET streak = ?, attempts = ?, mastery_achieved = ?, last_attempt = ?
            WHERE student_id = ? AND primitive = ? AND topic = ?
        """, (streak, attempts, mastery, datetime.now(), student_id, primitive, topic))
    else:
        streak = 1 if is_correct else 0
        cursor.execute("""
            INSERT INTO progress (student_id, primitive, topic, streak, attempts, mastery_achieved, last_attempt)
            VALUES (?, ?, ?, ?, 1, ?, ?)
        """, (student_id, primitive, topic, streak, streak >= 3, datetime.now()))

    conn.commit()
    conn.close()

    return {
        "streak": streak,
        "mastery_achieved": streak >= 3,
        "attempts": attempts if row else 1
    }


def record_attempt(student_id: str, primitive: str, topic: str,
                   problem_text: str, student_answer: str, correct_answer: str,
                   is_correct: bool, feedback: str):
    """Record a practice attempt"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO practice_attempts
        (student_id, primitive, topic, problem_text, student_answer, correct_answer, is_correct, feedback)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (student_id, primitive, topic, problem_text, student_answer, correct_answer, is_correct, feedback))
    conn.commit()
    conn.close()


# Homework operations
def create_assignment(title: str, description: str, lecture_id: int,
                     primitives: List[str], due_date: str) -> int:
    """Create a new homework assignment"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO homework_assignments (title, description, lecture_id, primitives, due_date)
        VALUES (?, ?, ?, ?, ?)
    """, (title, description, lecture_id, json.dumps(primitives), due_date))
    assignment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return assignment_id


def get_active_assignments() -> List[Dict[str, Any]]:
    """Get all active homework assignments"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM homework_assignments
        WHERE is_active = TRUE
        ORDER BY due_date
    """)
    rows = cursor.fetchall()
    conn.close()

    assignments = []
    for row in rows:
        assignment = dict(row)
        assignment["primitives"] = json.loads(assignment["primitives"]) if assignment["primitives"] else []
        assignments.append(assignment)
    return assignments


def submit_homework(student_id: str, assignment_id: int, answers: Dict[str, Any]) -> Dict[str, Any]:
    """Submit homework answers"""
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO homework_submissions (student_id, assignment_id, answers)
            VALUES (?, ?, ?)
        """, (student_id, assignment_id, json.dumps(answers)))
        conn.commit()
        return {"success": True, "message": "Homework submitted successfully"}
    except sqlite3.IntegrityError:
        return {"success": False, "error": "You have already submitted this assignment"}
    finally:
        conn.close()


def get_student_submissions(student_id: str) -> List[Dict[str, Any]]:
    """Get all homework submissions for a student"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT hs.*, ha.title, ha.due_date
        FROM homework_submissions hs
        JOIN homework_assignments ha ON hs.assignment_id = ha.id
        WHERE hs.student_id = ?
        ORDER BY hs.submitted_at DESC
    """, (student_id,))
    rows = cursor.fetchall()
    conn.close()

    submissions = []
    for row in rows:
        sub = dict(row)
        sub["answers"] = json.loads(sub["answers"]) if sub["answers"] else {}
        submissions.append(sub)
    return submissions


def get_leaderboard(primitive: str = None, limit: int = 10) -> List[Dict[str, Any]]:
    """Get top students by mastery count"""
    conn = get_connection()
    cursor = conn.cursor()

    if primitive:
        cursor.execute("""
            SELECT s.name, s.student_id, COUNT(*) as mastery_count
            FROM progress p
            JOIN students s ON p.student_id = s.student_id
            WHERE p.mastery_achieved = TRUE AND p.primitive = ?
            GROUP BY p.student_id
            ORDER BY mastery_count DESC
            LIMIT ?
        """, (primitive, limit))
    else:
        cursor.execute("""
            SELECT s.name, s.student_id, COUNT(*) as mastery_count
            FROM progress p
            JOIN students s ON p.student_id = s.student_id
            WHERE p.mastery_achieved = TRUE
            GROUP BY p.student_id
            ORDER BY mastery_count DESC
            LIMIT ?
        """, (limit,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


# Initialize on import
init_database()
