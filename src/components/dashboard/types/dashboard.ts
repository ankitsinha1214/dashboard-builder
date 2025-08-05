/* eslint-disable @typescript-eslint/no-explicit-any */
// types/dashboard.ts
export interface DashboardConfig {
  sidebar: {
    visible: boolean;
    collapsible: boolean;
    defaultCollapsed: boolean;
    width: number;
    collapsedWidth: number;
    logo?: string;
    showPagesAsMenu: boolean; // New flag to control if pages appear in sidebar
    customMenuItems?: Array<{
      key: string;
      label: string;
      icon?: React.ReactNode;
      path?: string;
      children?: Array<{
        key: string;
        label: string;
        path: string;
      }>;
    }>;
  };
}

export interface Page {
  id: string;
  name: string;
  dashboardId: string;
  config: {
    route: string;
    title: string;
    description?: string;
    thumbnail?: string;
    visibleInMenu?: boolean;
    menuIcon?: string;
    menuOrder?: number;
  };
  layout?: {
    widgets: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      config: any;
    }>;
    gridConfig?: {
      cols: number;
      rowHeight: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}