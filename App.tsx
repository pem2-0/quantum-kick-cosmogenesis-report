import React, { useState, useEffect } from 'react';
import { ReportData, FigureData } from './types';
import Header from './components/Header';
import Section from './components/Section';
import Keywords from './components/Keywords';
import Figures from './components/Figures';
import Appendices from './components/Appendices';
import Footer from './components/Footer';
import TableOfContents from './components/TableOfContents';
import FigureModal from './components/FigureModal';
import ScrollAnimator from './components/ScrollAnimator';

const App: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<FigureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./data/report.json');
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        const jsonData: ReportData = await response.json();
        setData(jsonData);
      } catch (e) {
        console.error('Failed to fetch report data:', e);
        if (e instanceof Error) {
            setError(`Failed to load report data: ${e.message}`);
        } else {
            setError('An unknown error occurred while loading the report.');
        }
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (figure: FigureData) => {
    setSelectedFigure(figure);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFigure(null);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-800 font-sans">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg border border-red-200">
          <h1 className="text-2xl font-bold">Error Loading Report</h1>
          <p className="mt-2 text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" role="status" aria-label="Loading report">
          <svg className="animate-spin h-8 w-8 text-accent mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-secondary font-sans">Loading Report...</p>
        </div>
      </div>
    );
  }
  
  const sectionIds = Object.keys(data.sections).map(key => key.toLowerCase().replace(/\s+/g, '-'));

  return (
    <div className="bg-transparent text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-x-12 py-12">
          <aside className="hidden lg:block lg:col-span-1">
            <TableOfContents sections={Object.keys(data.sections)} sectionIds={sectionIds} />
          </aside>

          <main className="lg:col-span-3">
             <article className="bg-white shadow-lg rounded-lg overflow-hidden">
               <div className="p-8 sm:p-10">
                <Header
                  title={data.title}
                  author={data.author}
                  date={data.date}
                  contact={data.contact}
                  abstract={data.abstract}
                />
                
                <ScrollAnimator>
                  <Keywords keywords={data.keywords} />
                </ScrollAnimator>

                <div className="mt-10 space-y-10">
                  {Object.entries(data.sections).map(([key, value], index) => (
                    <ScrollAnimator key={key}>
                      <Section id={sectionIds[index]} title={key} content={value} />
                    </ScrollAnimator>
                  ))}
                </div>
                
                <ScrollAnimator>
                  <Figures figures={data.figures} onFigureClick={handleOpenModal} />
                </ScrollAnimator>
              </div>

              <ScrollAnimator>
                <Appendices 
                  appendices={data.appendices} 
                  code={data.code}
                  license={data.license}
                />
              </ScrollAnimator>

            </article>
          </main>
        </div>
      </div>
      <Footer author={data.author} date={data.date} />
      {isModalOpen && selectedFigure && (
        <FigureModal figure={selectedFigure} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;