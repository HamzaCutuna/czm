declare module 'react-chrono' {
  import { ReactNode } from 'react';

  export interface ChronoItem {
    title: string;
    cardTitle?: string;
    cardDetailedText?: string;
    cardSubtitle?: string;
    media?: {
      type: 'IMAGE' | 'VIDEO';
      source: { url: string };
    };
  }

  export interface ChronoProps {
    items: ChronoItem[];
    mode?: 'VERTICAL' | 'HORIZONTAL' | 'VERTICAL_ALTERNATING' | 'VERTICAL_ALTERNATING' | 'HORIZONTAL_SLIDER';
    theme?: {
      primary?: string;
      secondary?: string;
      cardBgColor?: string;
      cardForeColor?: string;
      titleColor?: string;
      titleColorActive?: string;
    };
    fontSizes?: {
      cardSubtitle?: string;
      cardText?: string;
      cardTitle?: string;
      title?: string;
    };
    onItemSelect?: (item: ChronoItem) => void;
  }

  export const Chrono: React.FC<ChronoProps>;
}
