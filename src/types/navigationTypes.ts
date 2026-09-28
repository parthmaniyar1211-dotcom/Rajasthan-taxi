export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

export interface AppRoute {
  path: string;
  title: string;
  params: Record<string, string>;
  state?: any;
  timestamp?: number;
}

export interface FallbackRoute {
  path: string;
  label: string;
}
