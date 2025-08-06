import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import DashboardService from '../services/DashboardService';

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  [key: string]: any; 
}

export function useDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DashboardService.fetchDashboards();
      setDashboards(data);
    } catch (error) {
      message.error('Failed to fetch dashboards');
      console.error('Failed to fetch dashboards:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  const createDashboard = async (dashboardData: { name: string; description?: string; thumbnail?: string; }) => {
    try {
      const newDashboard = await DashboardService.createDashboard(dashboardData);
      setDashboards(prev => [...prev, newDashboard]);
      message.success('Dashboard created successfully');
      return newDashboard;
    } catch (error) {
      message.error('Failed to create dashboard');
      console.error('Failed to create dashboard:', error);
      return null;
    }
  };

  const updateDashboard = async (dashboardId: string, dashboardData: { name?: string; description?: string; thumbnail?: string; }) => {
    try {
      const updatedDashboard = await DashboardService.updateDashboard(dashboardId, dashboardData);
      setDashboards(dashboards.map(d =>
        d.id === updatedDashboard.id ? updatedDashboard : d
      ));
      message.success('Dashboard updated successfully');
      return updatedDashboard;
    } catch (error) {
      message.error('Failed to update dashboard');
      console.error('Failed to update dashboard:', error);
      return null;
    }
  };

  const deleteDashboard = async (dashboardId: string) => {
    try {
      await DashboardService.deleteDashboard(dashboardId);
      setDashboards(dashboards.filter(d => d.id !== dashboardId));
      message.success('Dashboard deleted successfully');
      return true;
    } catch (error) {
      message.error('Failed to delete dashboard');
      console.error('Failed to delete dashboard:', error);
      return false;
    }
  };

  const saveDashboardConfig = async (dashboardId: string, config: any) => {
    try {
      await DashboardService.saveDashboardConfig(dashboardId, config);
      message.success('Configuration saved successfully');
    } catch (error) {
      message.error('Failed to save configuration');
      console.error('Failed to save configuration:', error);
    }
  };


  return {
    dashboards,
    loading,
    fetchDashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    saveDashboardConfig,
    setDashboards
  };
}