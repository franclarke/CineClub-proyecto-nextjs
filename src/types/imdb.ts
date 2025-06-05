export interface ImdbData {
  Title: string;
  Plot: string;
  Poster: string;
  Error?: string; // OMDb returns an Error field if not found
} 