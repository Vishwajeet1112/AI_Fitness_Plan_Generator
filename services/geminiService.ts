import { GoogleGenAI, Type } from "@google/genai";
import { FitnessPlan, FormData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        weekly_plan: {
            type: Type.ARRAY,
            description: "An array of daily workout plans for the week.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Day of the week (e.g., 'Monday')." },
                    focus: { type: Type.STRING, description: "The main focus of the workout for the day (e.g., 'Chest & Triceps')." },
                    exercises: {
                        type: Type.ARRAY,
                        description: "A list of exercises for the day.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Name of the exercise." },
                                sets: { type: Type.STRING, description: "Number of sets (e.g., '3' or '3-4')." },
                                reps_or_duration: { type: Type.STRING, description: "Number of repetitions or duration of the exercise (e.g., '8-12 reps', '30 seconds')." },
                                rest: { type: Type.STRING, description: "Rest period between sets (e.g., '60-90 seconds')." }
                            },
                             required: ["name", "sets", "reps_or_duration", "rest"]
                        }
                    }
                },
                 required: ["day", "focus", "exercises"]
            }
        },
        disclaimer: {
            type: Type.STRING,
            description: "A standard disclaimer advising the user to consult a healthcare professional."
        }
    },
    required: ["weekly_plan", "disclaimer"]
};


const buildPrompt = (data: FormData) => {
  return `
    Please create a personalized weekly fitness plan based on the following user details.
    The output MUST be a JSON object that strictly follows the provided schema. Do not include any markdown formatting like \`\`\`json.
    
    User Details:
    - Age: ${data.age}
    - Gender: ${data.gender}
    - Height: ${data.height} cm
    - Weight: ${data.weight} kg
    - Fitness Level: ${data.fitnessLevel}
    - Main Goal: ${data.mainGoal}
    - Workout Days Per Week: ${data.daysPerWeek}
    - Time per Session: ${data.timePerSession} minutes
    - Preferences/Notes: ${data.preferences || 'None'}

    Generate a detailed plan for the ${data.daysPerWeek} workout days. Include appropriate warm-ups or cool-downs if relevant within the exercise list or as a general note. The exercises should be suitable for the user's fitness level and goals. Ensure the plan includes a variety of exercises targeting different muscle groups as appropriate for the user's focus. The plan should be structured logically across the week.
  `;
};

export const generateFitnessPlan = async (formData: FormData): Promise<FitnessPlan> => {
  try {
    const prompt = buildPrompt(formData);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const plan: FitnessPlan = JSON.parse(jsonText);
    
    if (!plan.weekly_plan || !plan.disclaimer) {
        throw new Error("Invalid response format from API.");
    }

    return plan;
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    let errorMessage = "Failed to generate fitness plan. The AI model may be overloaded or the request was invalid.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    // Re-throw a more user-friendly error
    throw new Error(errorMessage);
  }
};


export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
        const prompt = `Translate the following English text to ${targetLanguage}. Provide ONLY the raw translated text, without any introductory phrases, explanations, or markdown formatting.\n\nEnglish Text:\n"""\n${text}\n"""`;

        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.2,
        }
        });

        return response.text.trim();
    } catch (error) {
        console.error(`Error translating text to ${targetLanguage}:`, error);
        // Re-throw a more user-friendly error
        throw new Error(`Failed to translate text. Please try again.`);
    }
};
