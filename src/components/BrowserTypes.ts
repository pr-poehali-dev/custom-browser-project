export interface Tab {
  id: number;
  title: string;
  url: string;
  isSecure: boolean;
  favicon?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

export interface HistoryItem {
  id: number;
  url: string;
  title: string;
  timestamp: Date;
  isSecure: boolean;
}

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  folder: string;
}

export interface Download {
  id: number;
  filename: string;
  url: string;
  size: string;
  status: 'completed' | 'downloading' | 'paused';
  progress: number;
}

export interface Extension {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  description: string;
  isSecure: boolean;
}
