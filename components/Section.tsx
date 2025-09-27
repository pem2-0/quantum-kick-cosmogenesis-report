import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  content: string;
}

const Section: React.FC<SectionProps> = ({ id, title, content }) => {
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <section id={id}>
      <h2 className="text-2xl font-bold font-sans text-primary mb-4 border-b pb-2">
        {formattedTitle}
      </h2>
      <p className="text-secondary leading-relaxed whitespace-pre-wrap">{content}</p>
    </section>
  );
};

export default Section;