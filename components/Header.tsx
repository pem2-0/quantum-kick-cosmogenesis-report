import React from 'react';
import AiSummary from './AiSummary';

interface HeaderProps {
  title: string;
  author: string;
  date: string;
  contact: string;
  abstract: string;
}

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ title, author, date, contact, abstract }) => {
  return (
    <header className="border-b pb-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-sans text-primary tracking-tight leading-tight">
          {title}
        </h1>
        <div className="mt-4 text-secondary">
          <p className="text-lg font-medium font-sans">{author}</p>
          <p className="text-sm mt-1">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <a href={`mailto:${contact}`} className="mt-2 inline-flex items-center text-sm text-accent hover:underline">
            <MailIcon className="w-4 h-4 mr-2" />
            {contact}
          </a>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold font-sans text-primary mb-3">Abstract</h2>
        <p className="text-secondary italic leading-relaxed">{abstract}</p>
      </div>

      <AiSummary abstract={abstract} />
    </header>
  );
};

export default Header;