from collections import Counter
from contextlib import asynccontextmanager
import json
import math
import platform
import re
import secrets
import time
from typing import Any, Literal

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

from backend.database import db_session, init_db, utc_now_iso

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Rakesh Roshan Portfolio API",
    version="1.0.0",
    lifespan=lifespan,
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    field_errors: dict[str, str] = {}
    for err in exc.errors():
        loc = err.get("loc", ())
        field = str(loc[-1]) if loc else "form"
        msg = err.get("msg", "Invalid input.")
        if msg.startswith("Value error, "):
            msg = msg[len("Value error, ") :]
        field_errors[field] = msg
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "ok": False,
            "message": "Please correct the highlighted fields and try again.",
            "errors": field_errors,
        },
    )


class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2 or len(cleaned) > 100:
            raise ValueError("Please enter your name (2-100 characters).")
        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        cleaned = v.strip()
        if not EMAIL_REGEX.match(cleaned) or len(cleaned) > 160:
            raise ValueError("Please enter a valid email address.")
        return cleaned

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 3 or len(cleaned) > 150:
            raise ValueError("Please enter a subject (3-150 characters).")
        return cleaned

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 10 or len(cleaned) > 2500:
            raise ValueError("Please enter a message (10-2500 characters).")
        return cleaned


class PythonAnalyzeRequest(BaseModel):
    mode: Literal["sequence", "text"]
    terms: int | None = Field(default=10, ge=1, le=35)
    text: str | None = Field(default="")


class CalorieLogRequest(BaseModel):
    food_name: str
    meal_type: Literal["Breakfast", "Lunch", "Dinner", "Snack"]
    calories: int = Field(ge=1, le=5000)
    protein_g: float = Field(default=0.0, ge=0.0, le=500.0)
    carbs_g: float = Field(default=0.0, ge=0.0, le=500.0)
    fat_g: float = Field(default=0.0, ge=0.0, le=500.0)

    @field_validator("food_name")
    @classmethod
    def validate_food_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2 or len(cleaned) > 100:
            raise ValueError("Food name must be between 2 and 100 characters.")
        return cleaned


def _is_prime(num: int) -> bool:
    if num < 2:
        return False
    if num == 2:
        return True
    if num % 2 == 0:
        return False
    limit = math.isqrt(num)
    for factor in range(3, limit + 1, 2):
        if num % factor == 0:
            return False
    return True


def _fetch_recent_python_runs(limit: int = 6) -> list[dict[str, Any]]:
    with db_session() as conn:
        rows = conn.execute(
            """
            SELECT id, tool_name, input_summary, output_json, execution_ms, created_at
            FROM python_lab_runs
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    results = []
    for row in rows:
        results.append(
            {
                "id": row["id"],
                "toolName": row["tool_name"],
                "inputSummary": row["input_summary"],
                "output": json.loads(row["output_json"]),
                "executionMs": row["execution_ms"],
                "createdAt": row["created_at"],
            }
        )
    return results


def _fetch_calorie_state() -> dict[str, Any]:
    with db_session() as conn:
        entries = conn.execute(
            """
            SELECT id, food_name, meal_type, calories, protein_g, carbs_g, fat_g, logged_at
            FROM calorie_logs
            ORDER BY id DESC
            LIMIT 25
            """
        ).fetchall()

        totals = conn.execute(
            """
            SELECT
                COUNT(*) AS entry_count,
                COALESCE(SUM(calories), 0) AS total_calories,
                COALESCE(SUM(protein_g), 0) AS total_protein_g,
                COALESCE(SUM(carbs_g), 0) AS total_carbs_g,
                COALESCE(SUM(fat_g), 0) AS total_fat_g
            FROM calorie_logs
            """
        ).fetchone()

    protein_kcal = float(totals["total_protein_g"]) * 4.0
    carbs_kcal = float(totals["total_carbs_g"]) * 4.0
    fat_kcal = float(totals["total_fat_g"]) * 9.0
    macro_kcal_sum = protein_kcal + carbs_kcal + fat_kcal

    macro_split = {
        "proteinPct": round((protein_kcal / macro_kcal_sum) * 100, 1) if macro_kcal_sum > 0 else 0.0,
        "carbsPct": round((carbs_kcal / macro_kcal_sum) * 100, 1) if macro_kcal_sum > 0 else 0.0,
        "fatPct": round((fat_kcal / macro_kcal_sum) * 100, 1) if macro_kcal_sum > 0 else 0.0,
    }

    return {
        "entries": [
            {
                "id": row["id"],
                "foodName": row["food_name"],
                "mealType": row["meal_type"],
                "calories": row["calories"],
                "proteinG": row["protein_g"],
                "carbsG": row["carbs_g"],
                "fatG": row["fat_g"],
                "loggedAt": row["logged_at"],
            }
            for row in entries
        ],
        "totals": {
            "entryCount": int(totals["entry_count"]),
            "calories": int(totals["total_calories"]),
            "proteinG": round(float(totals["total_protein_g"]), 1),
            "carbsG": round(float(totals["total_carbs_g"]), 1),
            "fatG": round(float(totals["total_fat_g"]), 1),
            "macroSplit": macro_split,
        },
    }


@app.get("/api/health")
def health_check() -> dict[str, Any]:
    with db_session() as conn:
        conn.execute("SELECT 1").fetchone()
    return {
        "status": "ok",
        "backend": "Python FastAPI",
        "pythonVersion": platform.python_version(),
        "database": "SQLite",
        "dbConnected": True,
        "timestamp": utc_now_iso(),
    }


@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactRequest) -> dict[str, Any]:
    reference_id = f"msg_{int(time.time())}_{secrets.token_hex(3)}"
    created_at = utc_now_iso()

    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO contact_messages (reference_id, name, email, subject, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (reference_id, payload.name, payload.email, payload.subject, payload.message, created_at),
        )

    return {
        "ok": True,
        "id": reference_id,
        "submittedAt": created_at,
        "message": "Thank you for reaching out. Your message has been saved in SQLite via FastAPI.",
    }


@app.get("/api/projects/endorsements")
def get_project_endorsements() -> dict[str, Any]:
    with db_session() as conn:
        rows = conn.execute(
            "SELECT project_id, endorsements FROM project_endorsements"
        ).fetchall()
    return {
        "endorsements": {row["project_id"]: row["endorsements"] for row in rows}
    }


@app.post("/api/projects/{project_id}/endorse")
def endorse_project(project_id: str) -> dict[str, Any]:
    now = utc_now_iso()
    with db_session() as conn:
        existing = conn.execute(
            "SELECT endorsements FROM project_endorsements WHERE project_id = ?",
            (project_id,),
        ).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="Project not found.")

        updated = existing["endorsements"] + 1
        conn.execute(
            """
            UPDATE project_endorsements
            SET endorsements = ?, updated_at = ?
            WHERE project_id = ?
            """,
            (updated, now, project_id),
        )

    return {"ok": True, "projectId": project_id, "endorsements": updated}


@app.get("/api/python/history")
def get_python_history() -> dict[str, Any]:
    return {"runs": _fetch_recent_python_runs()}


@app.post("/api/python/analyze")
def run_python_analyzer(payload: PythonAnalyzeRequest) -> dict[str, Any]:
    started = time.perf_counter()

    if payload.mode == "sequence":
        n = payload.terms if payload.terms is not None else 10
        seq: list[int] = []
        a, b = 0, 1
        for _ in range(n):
            seq.append(a)
            a, b = b, a + b

        primes = [val for val in seq if _is_prime(val)]
        golden_ratio = round(seq[-1] / seq[-2], 6) if n >= 2 and seq[-2] != 0 else None

        result: dict[str, Any] = {
            "sequence": seq,
            "count": len(seq),
            "sum": sum(seq),
            "primeValues": primes,
            "goldenRatioApprox": golden_ratio,
        }
        tool_name = "Fibonacci & Prime Analyzer"
        input_summary = f"{n} terms"
    else:
        raw_text = (payload.text or "").strip()
        if len(raw_text) < 3 or len(raw_text) > 3000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide between 3 and 3000 characters to analyze.",
            )

        words = re.findall(r"[A-Za-z0-9']+", raw_text.lower())
        sentences = [s for s in re.split(r"[.!?]+", raw_text) if s.strip()]
        word_counts = Counter(words)
        top_words = [{"word": w, "count": c} for w, c in word_counts.most_common(5)]

        result = {
            "characters": len(raw_text),
            "words": len(words),
            "uniqueWords": len(word_counts),
            "sentences": len(sentences),
            "readingSeconds": max(1, round(len(words) / 3.3)) if words else 0,
            "topTerms": top_words,
        }
        tool_name = "Python Text Analyzer"
        preview = raw_text[:44] + ("..." if len(raw_text) > 44 else "")
        input_summary = preview

    execution_ms = round((time.perf_counter() - started) * 1000, 3)
    created_at = utc_now_iso()

    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO python_lab_runs (tool_name, input_summary, output_json, execution_ms, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (tool_name, input_summary, json.dumps(result), execution_ms, created_at),
        )

    return {
        "ok": True,
        "toolName": tool_name,
        "executionMs": execution_ms,
        "result": result,
        "recentRuns": _fetch_recent_python_runs(),
    }


@app.get("/api/python/calories")
def list_calories() -> dict[str, Any]:
    return _fetch_calorie_state()


@app.post("/api/python/calories", status_code=status.HTTP_201_CREATED)
def add_calorie_entry(payload: CalorieLogRequest) -> dict[str, Any]:
    logged_at = utc_now_iso()
    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO calorie_logs (food_name, meal_type, calories, protein_g, carbs_g, fat_g, logged_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.food_name,
                payload.meal_type,
                payload.calories,
                payload.protein_g,
                payload.carbs_g,
                payload.fat_g,
                logged_at,
            ),
        )

    state = _fetch_calorie_state()
    return {"ok": True, **state}


@app.delete("/api/python/calories/{entry_id}")
def delete_calorie_entry(entry_id: int) -> dict[str, Any]:
    with db_session() as conn:
        cursor = conn.execute("DELETE FROM calorie_logs WHERE id = ?", (entry_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Calorie entry not found.")

    state = _fetch_calorie_state()
    return {"ok": True, **state}
