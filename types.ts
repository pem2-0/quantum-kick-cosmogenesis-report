export interface FigureData {
  file: string;
  caption: string;
}

export interface ReportData {
  title: string;
  author: string;
  date: string;
  contact: string;
  abstract: string;
  keywords: string[];
  sections: {
    [key: string]: string;
  };
  appendices: {
    [key: string]: string;
  };
  figures: FigureData[];
  code: string;
  license: string;
}