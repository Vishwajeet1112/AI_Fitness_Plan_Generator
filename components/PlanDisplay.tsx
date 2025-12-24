
import React from 'react';
import { FitnessPlan } from '../types';
import DayCard from './DayCard';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { Icon } from './ui/Icon';

interface PlanDisplayProps {
  plan: FitnessPlan | null;
  isLoading: boolean;
  error: string | null;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Spinner />
        <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">Generating your personalized plan...</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">This might take a moment.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50">
         <Icon name="error" className="w-12 h-12 text-red-500" />
        <h3 className="mt-4 text-xl font-semibold text-red-800 dark:text-red-300">Oops! Something went wrong.</h3>
        <p className="mt-2 text-red-600 dark:text-red-400 max-w-md">{error}</p>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[50vh] text-center border-dashed">
        <Icon name="logo" className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">Your Fitness Plan Awaits</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Fill out the form on the left to get started.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {plan.weekly_plan.map((dayPlan) => (
          <DayCard key={dayPlan.day} dayPlan={dayPlan} />
        ))}
      </div>
      
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
             <Icon name="info" className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Disclaimer</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{plan.disclaimer}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlanDisplay;
