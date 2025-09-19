declare module 'react-chrono' {
  import { ReactNode } from 'react';

  export interface TimelineItem {
    title?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    cardDetailedText?: string | string[];
    media?: {
      type: 'IMAGE' | 'VIDEO';
      source: {
        url: string;
      };
    };
  }

  export interface ChronoProps {
    items: TimelineItem[];
    mode?: 'VERTICAL' | 'HORIZONTAL' | 'VERTICAL_ALTERNATING' | 'VERTICAL_TREE';
    cardHeight?: number;
    scrollable?: boolean | { scrollbar: boolean };
    allowDynamicUpdate?: boolean;
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
    classNames?: {
      card?: string;
      cardMedia?: string;
      cardSubTitle?: string;
      cardText?: string;
      cardTitle?: string;
      controls?: string;
      title?: string;
    };
    hideControls?: boolean;
    disableClickOnCircle?: boolean;
    disableNavOnKey?: boolean;
    enableOutline?: boolean;
    enableBreakPoint?: boolean;
    lineWidth?: number;
    activeItemIndex?: number;
    slideShow?: boolean;
    slideItemDuration?: number;
    slideShowType?: 'reveal' | 'slide_in';
    onScrollEnd?: () => void;
    onItemSelect?: (item: TimelineItem | number) => void;
    useReadMore?: boolean;
    buttonTexts?: {
      first: string;
      last: string;
      next: string;
      previous: string;
    };
    itemWidth?: number;
    flipLayout?: boolean;
    timelinePointDimension?: number;
    timelinePointShape?: 'circle' | 'square' | 'diamond';
    showAllCardsHorizontal?: boolean;
    contentDetailsHeight?: number;
    nestedCardHeight?: number;
    verticalBreakPoint?: number;
    focusActiveItemOnLoad?: boolean;
    enableDarkToggle?: boolean;
    darkMode?: boolean;
    onDarkModeToggle?: (darkMode: boolean) => void;
    children?: ReactNode;
  }

  export const Chrono: React.FC<ChronoProps>;
}
