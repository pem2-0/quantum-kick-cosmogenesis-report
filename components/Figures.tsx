import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FigureData } from '../types';

interface FiguresProps {
  figures: FigureData[];
  onFigureClick: (figure: FigureData) => void;
}

// Component for a loading placeholder
const FigureSkeleton: React.FC = () => (
  <div className="border rounded-lg overflow-hidden shadow-sm flex flex-col bg-white animate-pulse">
    <div className="p-2">
      <div className="w-full h-64 bg-gray-200 rounded-md"></div>
    </div>
    <div className="p-4 bg-gray-50 mt-auto border-t">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Component for displaying an error
const FigureError: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="border rounded-lg overflow-hidden shadow-sm flex flex-col bg-red-50 text-red-700 items-center justify-center p-4 min-h-[300px]">
    <h4 className="font-bold font-sans">Image Generation Failed</h4>
    <p className="text-sm mt-1 text-center text-red-600 max-w-xs">{error}</p>
    <button onClick={onRetry} className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600 transition-colors">
      Retry
    </button>
  </div>
);

const Figures: React.FC<FiguresProps> = ({ figures, onFigureClick }) => {
  type ImageState = {
    url: string | null;
    loading: boolean;
    error: string | null;
  };

  const [imageStates, setImageStates] = useState<ImageState[]>(() =>
    figures.map(() => ({ url: null, loading: true, error: null }))
  );

  const generateImage = async (caption: string, index: number) => {
    setImageStates(prev => {
      const newStates = [...prev];
      newStates[index] = { ...newStates[index], loading: true, error: null };
      return newStates;
    });

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `Create a technical, scientific illustration suitable for a research paper on cosmology. The style should be clean, clear, professional, and academic. The illustration must accurately depict the following concept: "${caption}"`;

      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '4:3',
        },
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("The model did not return any images.");
      }

      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

      setImageStates(prev => {
        const newStates = [...prev];
        newStates[index] = { url: imageUrl, loading: false, error: null };
        return newStates;
      });
    } catch (e) {
      console.error(`Failed to generate image for: ${caption}`, e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setImageStates(prev => {
        const newStates = [...prev];
        newStates[index] = { ...newStates[index], loading: false, error: errorMessage };
        return newStates;
      });
    }
  };
  
  useEffect(() => {
    figures.forEach((figure, index) => {
        if (!imageStates[index].url && !imageStates[index].error) {
            generateImage(figure.caption, index);
        }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figures]);


  return (
    <section className="mt-12">
      <h2 id="figures" className="text-2xl font-bold font-sans text-primary mb-6 border-b pb-2">
        Figures
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {figures.map((figure, index) => {
          const state = imageStates[index];

          if (state.loading) {
            return <FigureSkeleton key={index} />;
          }

          if (state.error) {
            return <FigureError key={index} error={state.error} onRetry={() => generateImage(figure.caption, index)} />;
          }

          return (
            <figure 
              key={index} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col bg-white cursor-pointer"
              onClick={() => onFigureClick({ ...figure, file: state.url! })}
            >
              <div className="p-2 flex items-center justify-center bg-gray-100 min-h-[300px]">
                <img
                  src={state.url!}
                  alt={figure.caption}
                  className="w-full h-auto object-contain max-h-[450px]"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-4 bg-gray-50 text-sm text-secondary font-sans mt-auto border-t">
                <strong>Figure {index + 1}:</strong> {figure.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
};

export default Figures;