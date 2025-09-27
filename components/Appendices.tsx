import React from 'react';

interface AppendicesProps {
  appendices: { [key: string]: string };
  code: string;
  license: string;
}

const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.378 2.01a.75.75 0 01.424 1.368L8.242 16.62a.75.75 0 01-1.368-.424L10.432 2.43a.75.75 0 01.946-.424z" clipRule="evenodd" />
    </svg>
);


const Appendices: React.FC<AppendicesProps> = ({ appendices, code, license }) => {
  return (
    <section id="appendices--resources" className="bg-gray-50 p-8 sm:p-10 border-t">
      <h2 className="text-2xl font-bold font-sans text-primary mb-6 border-b pb-2">
        Appendices & Resources
      </h2>
      <div className="space-y-6">
        {Object.entries(appendices).map(([key, value]) => (
          <div key={key}>
            <h3 className="font-bold font-sans text-secondary">Appendix {key}</h3>
            <p className="text-secondary mt-1">{value}</p>
          </div>
        ))}
        <div>
            <h3 className="font-bold font-sans text-secondary">Code Availability</h3>
            <div className="flex items-center mt-2 text-secondary">
                <CodeIcon className="w-5 h-5 mr-2 text-gray-400" />
                <p>
                    <span className="font-semibold">{code}</span> is available under the {license} license.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Appendices;