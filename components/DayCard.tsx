import React, { useState, useEffect } from 'react';
import { DayPlan } from '../types';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';
import { Spinner } from './ui/Spinner';
import { translateText } from '../services/geminiService';

interface DayCardProps {
  dayPlan: DayPlan;
}

const DayCard: React.FC<DayCardProps> = ({ dayPlan }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  // Cleanup speech synthesis on component unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeakClick = async () => {
    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    if (translatedText) {
      speak(translatedText);
      return;
    }

    setIsTranslating(true);
    try {
      const textToTranslate = `
        ${dayPlan.day}, Focus: ${dayPlan.focus}. 
        ${dayPlan.exercises.map(ex => 
          `${ex.name}: ${ex.sets} sets, ${ex.reps_or_duration}, with ${ex.rest} rest.`
        ).join(' ')}
      `;
      const hindiText = await translateText(textToTranslate, 'Hindi');
      setTranslatedText(hindiText);
      speak(hindiText);
    } catch (error) {
      console.error("Failed to translate or speak:", error);
      alert("Sorry, there was an error with the text-to-speech feature. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel(); // Stop any currently speaking utterance
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
    };
    synth.speak(utterance);
  };


  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{dayPlan.day}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{dayPlan.focus}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
              onClick={handleSpeakClick}
              disabled={isTranslating}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-wait transition-colors"
              aria-label={isSpeaking ? "Stop speaking" : "Speak day's plan in Hindi"}
              title={isSpeaking ? "Stop speaking" : "Speak day's plan in Hindi"}
          >
              {isTranslating ? (
                  <Spinner size="sm" />
              ) : isSpeaking ? (
                  <Icon name="stop" className="w-6 h-6 text-red-500" />
              ) : (
                  <Icon name="speaker" className="w-6 h-6 text-blue-500" />
              )}
          </button>
          <Icon name="dumbbell" className="w-8 h-8 text-slate-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Exercise</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Sets</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Reps / Duration</th>
              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Rest</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-slate-200 dark:divide-slate-700">
            {dayPlan.exercises.map((exercise, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">{exercise.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{exercise.sets}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{exercise.reps_or_duration}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{exercise.rest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DayCard;
