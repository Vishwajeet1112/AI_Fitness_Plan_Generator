
export interface Exercise {
  name: string;
  sets: string;
  reps_or_duration: string;
  rest: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface FitnessPlan {
  weekly_plan: DayPlan[];
  disclaimer: string;
}

export interface FormData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessLevel: string;
  mainGoal: string;
  daysPerWeek: number;
  timePerSession: number;
  preferences: string;
}
