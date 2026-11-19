import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Plus,
  Trash2,
  Database,
  Terminal,
  AlertCircle,
  Utensils,
} from 'lucide-react';

interface CalorieEntry {
  id: number;
  foodName: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: string;
}

interface CalorieTotals {
  entryCount: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  macroSplit: {
    proteinPct: number;
    carbsPct: number;
    fatPct: number;
  };
}

interface PythonRunRecord {
  id: number;
  toolName: string;
  inputSummary: string;
  output: Record<string, unknown>;
  executionMs: number;
  createdAt: string;
}

interface SequenceResult {
  sequence: number[];
  count: number;
  sum: number;
  primeValues: number[];
  goldenRatioApprox: number | null;
}

interface TextResult {
  characters: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  readingSeconds: number;
  topTerms: { word: string; count: number }[];
}

type LabTab = 'calories' | 'analyzer';
type AnalyzerMode = 'sequence' | 'text';

const DEFAULT_CALORIE_TOTALS: CalorieTotals = {
  entryCount: 0,
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  macroSplit: { proteinPct: 0, carbsPct: 0, fatPct: 0 },
};

export function PythonLabSection() {
  const [activeTab, setActiveTab] = useState<LabTab>('calories');

  // Calorie Tracker (Python + FastAPI + SQLite) state
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [totals, setTotals] = useState<CalorieTotals>(DEFAULT_CALORIE_TOTALS);
  const [caloriesLoading, setCaloriesLoading] = useState(true);
  const [caloriesError, setCaloriesError] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [savingFood, setSavingFood] = useState(false);

  // Python Analyzer state
  const [analyzerMode, setAnalyzerMode] = useState<AnalyzerMode>('sequence');
  const [terms, setTerms] = useState(12);
  const [textInput, setTextInput] = useState(
    'Python and FastAPI make building structured web APIs with SQLite clean, fast, and dependable.'
  );
  const [runningAnalyzer, setRunningAnalyzer] = useState(false);
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);
  const [sequenceOutput, setSequenceOutput] = useState<SequenceResult | null>(null);
  const [textOutput, setTextOutput] = useState<TextResult | null>(null);
  const [lastExecMs, setLastExecMs] = useState<number | null>(null);
  const [recentRuns, setRecentRuns] = useState<PythonRunRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [calRes, histRes] = await Promise.all([
          fetch('/api/python/calories'),
          fetch('/api/python/history'),
        ]);

        if (calRes.ok && active) {
          const calData = await calRes.json();
          setEntries(calData.entries ?? []);
          setTotals(calData.totals ?? DEFAULT_CALORIE_TOTALS);
        }
        if (histRes.ok && active) {
          const histData = await histRes.json();
          setRecentRuns(histData.runs ?? []);
        }
      } catch {
        if (active) {
          setCaloriesError('Unable to reach the Python FastAPI backend right now.');
        }
      } finally {
        if (active) {
          setCaloriesLoading(false);
        }
      }
    }

    loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  const handleAddCalorieEntry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCaloriesError(null);

    const parsedCalories = Number(caloriesInput);
    if (foodName.trim().length < 2) {
      setCaloriesError('Please enter a food name (at least 2 characters).');
      return;
    }
    if (!Number.isInteger(parsedCalories) || parsedCalories < 1 || parsedCalories > 5000) {
      setCaloriesError('Please enter whole calories between 1 and 5000.');
      return;
    }

    setSavingFood(true);
    try {
      const response = await fetch('/api/python/calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_name: foodName.trim(),
          meal_type: mealType,
          calories: parsedCalories,
          protein_g: Number(proteinInput) || 0,
          carbs_g: Number(carbsInput) || 0,
          fat_g: Number(fatInput) || 0,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setCaloriesError(data.message || 'Could not save food entry.');
        return;
      }

      setEntries(data.entries ?? []);
      setTotals(data.totals ?? DEFAULT_CALORIE_TOTALS);
      setFoodName('');
      setCaloriesInput('');
      setProteinInput('');
      setCarbsInput('');
      setFatInput('');
    } catch {
      setCaloriesError('Network error while saving entry to SQLite.');
    } finally {
      setSavingFood(false);
    }
  };

  const handleDeleteCalorieEntry = async (id: number) => {
    setCaloriesError(null);
    try {
      const response = await fetch(`/api/python/calories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok && data.ok) {
        setEntries(data.entries ?? []);
        setTotals(data.totals ?? DEFAULT_CALORIE_TOTALS);
      }
    } catch {
      setCaloriesError('Failed to remove entry.');
    }
  };

  const handleRunPythonAnalyzer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAnalyzerError(null);
    setRunningAnalyzer(true);

    try {
      const response = await fetch('/api/python/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          analyzerMode === 'sequence'
            ? { mode: 'sequence', terms }
            : { mode: 'text', text: textInput }
        ),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setAnalyzerError(data.detail || data.message || 'Python execution failed.');
        return;
      }

      setLastExecMs(data.executionMs);
      setRecentRuns(data.recentRuns ?? []);

      if (analyzerMode === 'sequence') {
        setSequenceOutput(data.result as SequenceResult);
        setTextOutput(null);
      } else {
        setTextOutput(data.result as TextResult);
        setSequenceOutput(null);
      }
    } catch {
      setAnalyzerError('Unable to reach the Python FastAPI analyzer endpoint.');
    } finally {
      setRunningAnalyzer(false);
    }
  };

  return (
    <section
      id="python-lab"
      className="border-b border-[#151515]/15 bg-[#F5F0E7] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#151515]/15 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
              Python · FastAPI · SQLite
            </p>
            <h2 className="mt-2 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
              PYTHON &amp; FASTAPI
              <br />
              LIVE FEATURE LAB
            </h2>
          </div>

          {/* Interactive Workspace Switcher */}
          <div
            role="tablist"
            aria-label="Python FastAPI interactive workspaces"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-[#151515]/15 bg-[#FAF7F2] p-1 self-start md:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'calories'}
              onClick={() => setActiveTab('calories')}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48] ${
                activeTab === 'calories'
                  ? 'bg-[#151515] text-[#F5F0E7]'
                  : 'text-[#5C574F] hover:text-[#151515]'
              }`}
            >
              <Utensils className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Calorie Tracker (SQLite)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'analyzer'}
              onClick={() => setActiveTab('analyzer')}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48] ${
                activeTab === 'analyzer'
                  ? 'bg-[#151515] text-[#F5F0E7]'
                  : 'text-[#5C574F] hover:text-[#151515]'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Python Analyzer</span>
            </button>
          </div>
        </div>

        {/* Workspace 1: Calorie Tracker backed by Python + FastAPI + SQLite */}
        {activeTab === 'calories' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Left Form: Log Food Entry */}
            <div className="rounded-xl border border-[#151515]/14 bg-[#FAF7F2] p-6 sm:p-8 lg:col-span-5">
              <div className="flex items-center justify-between border-b border-[#151515]/10 pb-4">
                <div>
                  <h3 className="font-condensed text-3xl tracking-tight text-[#151515]">
                    LOG NUTRITION ENTRY
                  </h3>
                  <p className="mt-1 text-xs text-[#5C574F]">
                    Persisted in SQLite via FastAPI (`POST /api/python/calories`)
                  </p>
                </div>
                <Database className="h-5 w-5 text-[#C96D48]" aria-hidden="true" />
              </div>

              {caloriesError && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-lg border border-red-700/30 bg-red-600/10 p-3 text-xs text-red-900"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                  <span>{caloriesError}</span>
                </div>
              )}

              <form onSubmit={handleAddCalorieEntry} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="food-name"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Food Item
                    </label>
                    <input
                      id="food-name"
                      type="text"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      placeholder="e.g. Oats & Banana"
                      className="mt-1.5 w-full rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-3 py-2 text-sm text-[#151515] placeholder-[#7C756C] focus:border-[#C96D48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="meal-type"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Meal Type
                    </label>
                    <select
                      id="meal-type"
                      value={mealType}
                      onChange={(e) =>
                        setMealType(
                          e.target.value as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
                        )
                      }
                      className="mt-1.5 w-full rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-3 py-2 text-sm text-[#151515] focus:border-[#C96D48] focus:outline-none"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <label
                      htmlFor="calories-input"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Calories
                    </label>
                    <input
                      id="calories-input"
                      type="number"
                      min={1}
                      max={5000}
                      value={caloriesInput}
                      onChange={(e) => setCaloriesInput(e.target.value)}
                      placeholder="320"
                      className="mt-1.5 w-full rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-3 py-2 text-sm text-[#151515] tabular-nums focus:border-[#C96D48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="protein-input"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Protein (g)
                    </label>
                    <input
                      id="protein-input"
                      type="number"
                      min={0}
                      step="0.5"
                      value={proteinInput}
                      onChange={(e) => setProteinInput(e.target.value)}
                      placeholder="12"
                      className="mt-1.5 w-full rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-3 py-2 text-sm text-[#151515] tabular-nums focus:border-[#C96D48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="carbs-input"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Carbs (g)
                    </label>
                    <input
                      id="carbs-input"
                      type="number"
                      min={0}
                      step="0.5"
                      value={carbsInput}
                      onChange={(e) => setCarbsInput(e.target.value)}
                      placeholder="48"
                      className="mt-1.5 w-full rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-3 py-2 text-sm text-[#151515] tabular-nums focus:border-[#C96D48] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fat-input"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Fat (g)
                    </label>
                    <input
                      id="fat-input"
                      type="number"
                      min={0}
                      step="0.5"
                      value={fatInput}
                      onChange={(e) => setFatInput(e.target.value)}
                      placeholder="7"
                      className="mt-1.5 w-full rounded-md border border-[#151515]/20 bg-[#F5F0E7] px-3 py-2 text-sm text-[#151515] tabular-nums focus:border-[#C96D48] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingFood}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#C96D48] px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#151515] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#151515]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{savingFood ? 'Saving to SQLite...' : 'Log Food Entry'}</span>
                </button>
              </form>
            </div>

            {/* Right Ledger: SQLite Aggregated Totals & History */}
            <div className="flex flex-col justify-between rounded-xl border border-[#151515]/14 bg-[#FAF7F2] p-6 sm:p-8 lg:col-span-7">
              <div>
                <div className="grid grid-cols-2 gap-4 border-b border-[#151515]/12 pb-6 sm:grid-cols-4">
                  <div className="rounded-lg border border-[#C96D48]/35 bg-[#F5F0E7] p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-[#5C574F] uppercase">
                      Total Calories
                    </p>
                    <p className="mt-1 font-condensed text-3xl text-[#151515] tabular-nums">
                      {totals.calories}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#151515]/12 bg-[#F5F0E7] p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-[#5C574F] uppercase">
                      Protein
                    </p>
                    <p className="mt-1 font-condensed text-3xl text-[#151515] tabular-nums">
                      {totals.proteinG}g
                    </p>
                    <p className="text-[11px] text-[#A8502D] tabular-nums">
                      {totals.macroSplit.proteinPct}%
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#151515]/12 bg-[#F5F0E7] p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-[#5C574F] uppercase">
                      Carbs
                    </p>
                    <p className="mt-1 font-condensed text-3xl text-[#151515] tabular-nums">
                      {totals.carbsG}g
                    </p>
                    <p className="text-[11px] text-[#A8502D] tabular-nums">
                      {totals.macroSplit.carbsPct}%
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#151515]/12 bg-[#F5F0E7] p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-[#5C574F] uppercase">
                      Fat
                    </p>
                    <p className="mt-1 font-condensed text-3xl text-[#151515] tabular-nums">
                      {totals.fatG}g
                    </p>
                    <p className="text-[11px] text-[#A8502D] tabular-nums">
                      {totals.macroSplit.fatPct}%
                    </p>
                  </div>
                </div>

                {/* Entries Table */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-[#5C574F]">
                    <span className="font-semibold uppercase tracking-wider">
                      SQLite Food Log
                    </span>
                    <span className="tabular-nums">{totals.entryCount} entries stored</span>
                  </div>

                  {caloriesLoading ? (
                    <p className="py-8 text-center text-sm text-[#5C574F]">
                      Loading SQLite records...
                    </p>
                  ) : entries.length === 0 ? (
                    <div className="mt-4 rounded-lg border border-dashed border-[#151515]/20 bg-[#F5F0E7]/60 p-6 text-center text-sm text-[#5C574F]">
                      No food entries logged yet. Add an item on the left to store it in SQLite.
                    </div>
                  ) : (
                    <div className="mt-3 max-h-[260px] divide-y divide-[#151515]/10 overflow-y-auto rounded-lg border border-[#151515]/12 bg-[#F5F0E7]">
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#151515]">
                              {entry.foodName}
                            </p>
                            <p className="text-xs text-[#5C574F] tabular-nums">
                              {entry.mealType} · P {entry.proteinG}g · C {entry.carbsG}g · F{' '}
                              {entry.fatG}g
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-condensed text-2xl text-[#151515] tabular-nums">
                              {entry.calories} kcal
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCalorieEntry(entry.id)}
                              aria-label={`Delete ${entry.foodName}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#151515]/15 text-[#5C574F] transition-colors hover:border-red-700 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Workspace 2: Python Algorithm & Text Metrics Analyzer */}
        {activeTab === 'analyzer' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            <div className="rounded-xl border border-[#151515]/14 bg-[#FAF7F2] p-6 sm:p-8 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#151515]/10 pb-4">
                <h3 className="font-condensed text-3xl tracking-tight text-[#151515]">
                  RUN PYTHON COMPUTATION
                </h3>

                <div className="flex items-center gap-1 rounded-md border border-[#151515]/15 bg-[#F5F0E7] p-1">
                  <button
                    type="button"
                    onClick={() => setAnalyzerMode('sequence')}
                    className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                      analyzerMode === 'sequence'
                        ? 'bg-[#151515] text-[#F5F0E7]'
                        : 'text-[#5C574F] hover:text-[#151515]'
                    }`}
                  >
                    Fibonacci &amp; Primes
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyzerMode('text')}
                    className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                      analyzerMode === 'text'
                        ? 'bg-[#151515] text-[#F5F0E7]'
                        : 'text-[#5C574F] hover:text-[#151515]'
                    }`}
                  >
                    Text Metrics
                  </button>
                </div>
              </div>

              {analyzerError && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-lg border border-red-700/30 bg-red-600/10 p-3 text-xs text-red-900"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                  <span>{analyzerError}</span>
                </div>
              )}

              <form onSubmit={handleRunPythonAnalyzer} className="mt-5 space-y-5">
                {analyzerMode === 'sequence' ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="fib-terms"
                        className="text-xs font-semibold text-[#151515]"
                      >
                        Number of Fibonacci Terms
                      </label>
                      <span className="font-condensed text-2xl text-[#C96D48] tabular-nums">
                        {terms}
                      </span>
                    </div>
                    <input
                      id="fib-terms"
                      type="range"
                      min={2}
                      max={35}
                      value={terms}
                      onChange={(e) => setTerms(Number(e.target.value))}
                      className="mt-3 w-full accent-[#C96D48]"
                    />
                    <p className="mt-2 text-xs text-[#5C574F]">
                      Python computes the Fibonacci sequence, filters prime numbers, and calculates the golden ratio approximation.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="python-text-input"
                      className="block text-xs font-semibold text-[#151515]"
                    >
                      Input Text for Python Analysis
                    </label>
                    <textarea
                      id="python-text-input"
                      rows={4}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="mt-2 w-full rounded-md border border-[#151515]/20 bg-[#F5F0E7] p-3 text-sm text-[#151515] focus:border-[#C96D48] focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={runningAnalyzer}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[#C96D48] px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#151515] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#151515]"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{runningAnalyzer ? 'Executing in Python...' : 'Run in Python'}</span>
                </button>
              </form>

              {/* Result Display */}
              {sequenceOutput && (
                <div className="mt-6 space-y-3 rounded-lg border border-[#151515]/12 bg-[#F5F0E7] p-4">
                  <div className="flex items-center justify-between text-xs text-[#5C574F]">
                    <span className="font-semibold text-[#151515]">Python Output</span>
                    {lastExecMs !== null && (
                      <span className="tabular-nums">{lastExecMs} ms</span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-[#2E2A26] tabular-nums break-words">
                    <span className="font-semibold">Sequence:</span>{' '}
                    {sequenceOutput.sequence.join(', ')}
                  </p>
                  <p className="text-xs text-[#2E2A26] tabular-nums">
                    <span className="font-semibold">Primes Found:</span>{' '}
                    {sequenceOutput.primeValues.length > 0
                      ? sequenceOutput.primeValues.join(', ')
                      : 'None'}
                  </p>
                  <div className="flex flex-wrap gap-4 border-t border-[#151515]/10 pt-2 text-xs text-[#4A4640] tabular-nums">
                    <span>Sum: {sequenceOutput.sum}</span>
                    {sequenceOutput.goldenRatioApprox !== null && (
                      <span>Golden Ratio Approx: {sequenceOutput.goldenRatioApprox}</span>
                    )}
                  </div>
                </div>
              )}

              {textOutput && (
                <div className="mt-6 space-y-3 rounded-lg border border-[#151515]/12 bg-[#F5F0E7] p-4">
                  <div className="flex items-center justify-between text-xs text-[#5C574F]">
                    <span className="font-semibold text-[#151515]">Python Output</span>
                    {lastExecMs !== null && (
                      <span className="tabular-nums">{lastExecMs} ms</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 tabular-nums">
                    <div>
                      <span className="text-[#5C574F]">Words:</span>{' '}
                      <strong className="text-[#151515]">{textOutput.words}</strong>
                    </div>
                    <div>
                      <span className="text-[#5C574F]">Unique:</span>{' '}
                      <strong className="text-[#151515]">{textOutput.uniqueWords}</strong>
                    </div>
                    <div>
                      <span className="text-[#5C574F]">Sentences:</span>{' '}
                      <strong className="text-[#151515]">{textOutput.sentences}</strong>
                    </div>
                    <div>
                      <span className="text-[#5C574F]">Read Time:</span>{' '}
                      <strong className="text-[#151515]">{textOutput.readingSeconds}s</strong>
                    </div>
                  </div>
                  {textOutput.topTerms.length > 0 && (
                    <p className="border-t border-[#151515]/10 pt-2 text-xs text-[#4A4640]">
                      <span className="font-semibold text-[#151515]">Top Terms:</span>{' '}
                      {textOutput.topTerms
                        .map((item) => `${item.word} (${item.count})`)
                        .join(' · ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Recent SQLite Execution Ledger */}
            <div className="rounded-xl border border-[#151515]/14 bg-[#FAF7F2] p-6 sm:p-8 lg:col-span-6">
              <div className="flex items-center justify-between border-b border-[#151515]/10 pb-4">
                <div>
                  <h3 className="font-condensed text-3xl tracking-tight text-[#151515]">
                    RECENT SQLITE RUN LOG
                  </h3>
                  <p className="mt-1 text-xs text-[#5C574F]">
                    Persisted in `python_lab_runs` (`GET /api/python/history`)
                  </p>
                </div>
                <Database className="h-5 w-5 text-[#C96D48]" aria-hidden="true" />
              </div>

              {recentRuns.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-[#151515]/20 bg-[#F5F0E7]/60 p-8 text-center text-sm text-[#5C574F]">
                  Execute a Python computation on the left to record it in SQLite.
                </div>
              ) : (
                <div className="mt-5 divide-y divide-[#151515]/10 rounded-lg border border-[#151515]/12 bg-[#F5F0E7]">
                  {recentRuns.map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#151515]">{run.toolName}</p>
                        <p className="mt-0.5 truncate text-[#5C574F]">{run.inputSummary}</p>
                      </div>
                      <div className="text-right shrink-0 tabular-nums">
                        <p className="font-semibold text-[#A8502D]">{run.executionMs} ms</p>
                        <p className="text-[11px] text-[#5C574F]">
                          {new Date(run.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
