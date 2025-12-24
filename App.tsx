
import React, { useState, useCallback } from 'react';
import { FitnessPlan, FormData } from './types';
import { generateFitnessPlan } from './services/geminiService';
import FitnessForm from './components/FitnessForm';
import PlanDisplay from './components/PlanDisplay';
import { Icon } from './components/ui/Icon';

function App() {
  const [formData, setFormData] = useState<FormData>({
    age: '30',
    gender: 'Male',
    height: '180',
    weight: '75',
    fitnessLevel: 'Intermediate',
    mainGoal: 'Build muscle',
    daysPerWeek: 4,
    timePerSession: 60,
    preferences: 'I enjoy lifting weights, but have limited access to machines. I prefer compound exercises.',
  });

  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSliderChange = useCallback((name: string, value: number) => {
    setFormData(prev => ({...prev, [name]: value}));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFitnessPlan(null);

    try {
      const plan = await generateFitnessPlan(formData);
      setFitnessPlan(plan);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="logo" className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Fitness Plan Generator
            </h1>
          </div>
          <a href="https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221Wc-jt5NYsOS5NwZhXwkw2-yQfdjQ5dkp%22%5D,%22action%22:%22open%22,%22userId%22:%22104288301432939401570%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View Prompt in AI Studio
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 xl:col-span-3">
            <FitnessForm
              formData={formData}
              isLoading={isLoading}
              onChange={handleFormChange}
              onSliderChange={handleSliderChange}
              onSubmit={handleSubmit}
            />
          </aside>
          <section className="lg:col-span-8 xl:col-span-9">
            <PlanDisplay
              plan={fitnessPlan}
              isLoading={isLoading}
              error={error}
            />
          </section>
        </div>
      </main>

       <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>Powered by Google Gemini. Not medical advice.</p>
      </footer>
    </div>
  );
}

export default App;
