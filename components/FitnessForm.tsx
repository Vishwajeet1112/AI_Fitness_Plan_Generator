
import React from 'react';
import { FormData } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';

interface FitnessFormProps {
  formData: FormData;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSliderChange: (name: string, value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FitnessForm: React.FC<FitnessFormProps> = ({ formData, isLoading, onChange, onSliderChange, onSubmit }) => {
  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Your Details</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Age" name="age" type="number" value={formData.age} onChange={onChange} required />
          <Select label="Gender" name="gender" value={formData.gender} onChange={onChange} options={['Male', 'Female', 'Other']} required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Height (cm)" name="height" type="number" value={formData.height} onChange={onChange} required />
          <Input label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={onChange} required />
        </div>
        
        <div>
          <Select 
            label="Fitness Level" 
            name="fitnessLevel" 
            value={formData.fitnessLevel} 
            onChange={onChange} 
            options={['Beginner', 'Intermediate', 'Advanced']}
            required 
          />
        </div>
        
        <div>
          <Select 
            label="Main Goal" 
            name="mainGoal" 
            value={formData.mainGoal} 
            onChange={onChange} 
            options={['Lose weight', 'Build muscle', 'Improve endurance', 'General fitness']}
            required
          />
        </div>

        <div>
           <Slider
            label="Workout Days per Week"
            name="daysPerWeek"
            min={1}
            max={7}
            step={1}
            value={formData.daysPerWeek}
            onChange={onSliderChange}
            unit="days"
          />
        </div>

        <div>
          <Slider
            label="Time per Session (minutes)"
            name="timePerSession"
            min={15}
            max={120}
            step={5}
            value={formData.timePerSession}
            onChange={onSliderChange}
            unit="min"
          />
        </div>

        <div>
          <label htmlFor="preferences" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferences & Notes</label>
          <textarea
            id="preferences"
            name="preferences"
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.preferences}
            onChange={onChange}
            placeholder="e.g., 'I prefer home workouts', 'I have knee pain', 'I love running'"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} fullWidth>
            {isLoading ? 'Generating Plan...' : 'Generate My Fitness Plan'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FitnessForm;
