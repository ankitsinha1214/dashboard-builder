/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react';
import { Menu } from 'antd';
import type { DashboardConfig, Page } from './types/dashboard';

interface DynamicSidebarProps {
  config: DashboardConfig;
  pages: Page[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ 
  config, 
  pages, 
  currentPath,
  onNavigate 
}) => {
  const buildMenuItems = () => {
    const items = [];
    
    // Add custom menu items first
    if (config.sidebar.customMenuItems) {
      items.push(...config.sidebar.customMenuItems.map(item => ({
        ...item,
        onClick: () => item.path && onNavigate(item.path)
      })));
    }

    // Add pages as menu items if enabled
    if (config.sidebar.showPagesAsMenu && pages) {
      items.push({
        key: 'pages-section',
        label: 'Pages',
        type: 'group',
        children: pages.map(page => ({
          key: page.id,
          label: page.name,
          onClick: () => onNavigate(page.config?.route || `/page/${page.id}`)
        }))
      });
    }

    return items;
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[currentPath]}
      items={buildMenuItems()}
      inlineCollapsed={config.sidebar.defaultCollapsed}
    />
  );
};

export default DynamicSidebar;