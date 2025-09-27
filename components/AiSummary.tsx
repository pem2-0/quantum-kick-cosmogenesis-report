import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface AiSummaryProps {
    abstract: string;
}

const AiSummary: React.FC<AiSummaryProps> = ({ abstract }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSimpleExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setSummary(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY environment variable is not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Explain the following scientific abstract to a general audience in two or three simple, easy-to-understand sentences. Abstract: "${abstract}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setSummary(response.text);

        } catch (e) {
            console.error('AI simple explanation generation failed:', e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to generate explanation. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 p-4 bg-gray-50 border border-dashed rounded-lg">
            <div className="flex items-center gap-4">
                <h3 className="text-sm font-bold font-sans text-gray-500 uppercase tracking-wider">Simple Terms</h3>
                <button 
                    onClick={generateSimpleExplanation}
                    disabled={isLoading}
                    className="px-3 py-1 text-xs font-bold text-white bg-green-600 rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                    Explain Simply
                </button>
            </div>
            
            {isLoading && (
                <div className="mt-4 text-sm text-secondary font-sans italic">Generating...</div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">{error}</div>
            )}

            {summary && (
                 <div className="mt-4 p-3 bg-blue-50 border-l-4 border-accent text-secondary text-sm rounded-r-md">
                    <strong className="font-sans text-primary">
                        In Simple Terms: 
                    </strong>
                    {summary}
                </div>
            )}
        </div>
    );
};

export default AiSummary;