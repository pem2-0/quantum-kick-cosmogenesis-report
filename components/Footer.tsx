import React from 'react';

interface FooterProps {
  author: string;
  date: string;
}

const Footer: React.FC<FooterProps> = ({ author, date }) => {
  const year = new Date(date).getFullYear();
  return (
    <footer className="py-8 text-center">
      <p className="text-sm text-gray-500">
        © {year} {author}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;