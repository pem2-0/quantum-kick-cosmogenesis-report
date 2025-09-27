import React, { useState, useEffect } from 'react';

interface TableOfContentsProps {
  sections: string[];
  sectionIds: string[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ sections, sectionIds }) => {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0px 0px -75% 0px' } // Trigger when section is 25% from top
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        // Add figures and appendices to observer
        const figuresEl = document.getElementById('figures');
        if (figuresEl) observer.observe(figuresEl);
        const appendicesEl = document.getElementById('appendices--resources');
        if (appendicesEl) observer.observe(appendicesEl);

        return () => {
            sectionIds.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.unobserve(element);
                }
            });
            if (figuresEl) observer.unobserve(figuresEl);
            if (appendicesEl) observer.unobserve(appendicesEl);
        };
    }, [sectionIds]);

    const navItems = [...sections, 'Figures', 'Appendices & Resources'];
    const navIds = [...sectionIds, 'figures', 'appendices--resources'];

    return (
        <nav className="sticky top-24">
            <h3 className="text-sm font-bold font-sans text-gray-500 uppercase tracking-wider mb-3">
                On this page
            </h3>
            <ul className="space-y-2">
                {navItems.map((title, index) => {
                    const id = navIds[index];
                    const isActive = activeId === id;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                className={`block text-sm font-sans transition-all duration-200 border-l-2 pl-4 ${
                                    isActive
                                        ? 'border-accent text-accent font-semibold'
                                        : 'border-transparent text-secondary hover:text-primary hover:border-gray-300'
                                }`}
                            >
                                {title.charAt(0).toUpperCase() + title.slice(1)}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default TableOfContents;
