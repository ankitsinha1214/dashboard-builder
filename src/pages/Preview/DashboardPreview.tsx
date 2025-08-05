/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, message, Tabs } from 'antd';

const { TabPane } = Tabs;

const DashboardPreview = () => {
  const { dashboardId } = useParams();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardRes = await fetch(`/api/dashboards/${dashboardId}`);
        if (!dashboardRes.ok) throw new Error('Dashboard not found');
        const dashboard = await dashboardRes.json();
        
        setDashboardData(dashboard);
        if (dashboard.pages?.length > 0) {
          setActiveTab(dashboard.pages[0].id);
        }
      } catch (error: any) {
        console.error('Failed to load dashboard:', error);
        message.error(error.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dashboardId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Dashboard not found</h2>
          <p>The requested dashboard could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0 }}>{dashboardData.name}</h1>
      </header>
      
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ margin: '0 20px' }}
      >
        {dashboardData.pages?.map(page => (
          <TabPane tab={page.name} key={page.id}>
            <div style={{ 
              flex: 1, 
              position: 'relative', 
              height: 'calc(100vh - 120px)',
              overflow: 'auto',
              padding: '20px',
              background: '#f5f5f5'
            }}>
              {page.layout?.widgets?.map(widget => (
                <div key={widget.id} style={{
                  position: 'absolute',
                  left: `${widget.position.x}px`,
                  top: `${widget.position.y}px`,
                  width: `${widget.size.width}px`,
                  height: `${widget.size.height}px`
                }}>
                  {createWidget(widget.type, {
                    config: widget.config,
                    position: widget.position,
                    size: widget.size,
                    isSelected: false,
                    onSelect: () => {},
                    onSettingsClick: () => {},
                    onConfigChange: () => {},
                    onPositionChange: () => {},
                    onSizeChange: () => {},
                    onDelete: () => {}
                  })}
                </div>
              ))}
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default DashboardPreview;