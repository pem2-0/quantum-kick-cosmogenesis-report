import React from 'react';

interface KeywordsProps {
  keywords: string[];
}

const Keywords: React.FC<KeywordsProps> = ({ keywords }) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold font-sans text-gray-500 uppercase tracking-wider mb-3">Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-blue-100 text-accent text-xs font-semibold px-3 py-1 rounded-full"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Keywords;
