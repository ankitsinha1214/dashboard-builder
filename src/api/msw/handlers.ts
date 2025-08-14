/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { http, HttpResponse } from 'msw';
import { v4 as uuid } from 'uuid';

interface Dashboard {
  id: string;
  name: string;
  createdAt: string;
  config: { sidebar: { key: string; title: string }[] };
  pages: Page[];
}

interface Page {
  id: string;
  name: string;
  layout: {
    widgets: any[];
    gridConfig: {
      cols: number;
      rowHeight: number;
    };
  };
}

let dashboards: Dashboard[] = [
  {
    id: '1',
    name: 'Main Dashboard',
    createdAt: new Date().toISOString(),
    config: {
      sidebar: [
        { key: 'p1', title: 'Overview' }
      ]
    },
    pages: [
      {
        id: 'p1',
        name: 'Overview',
        layout: {
          widgets: [],
          gridConfig: { cols: 12, rowHeight: 30 }
        }
      }
    ]
  }
];

export const handlers = [
  // Authentication endpoint
  http.post('/api/login', async ({ request }) => {
    try {
      const { username, password } = await request.json() as any;

      if (username === 'admin' && password === 'password') {
        return HttpResponse.json(
          { token: 'demo-token' },
          { status: 200 }
        );
      }

      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    } catch (error) {
      return HttpResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
  }),

  // Dashboard endpoints
  http.get('/api/dashboards', () => {
    return HttpResponse.json(dashboards);
  }),

  http.post('/api/dashboards', async ({ request }) => {
    try {
      const { name } = await request.json() as any;
      const newDashboard: Dashboard = {
        id: uuid(),
        name,
        config: { sidebar: [] },
        createdAt: new Date().toISOString(),
        pages: []
      };
      dashboards.push(newDashboard);
      return HttpResponse.json(newDashboard);
    } catch (error) {
      return HttpResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
  }),

  http.delete('/api/dashboards/:id', ({ params }) => {
    const { id } = params;
    dashboards = dashboards.filter(d => d.id !== id);
    return HttpResponse.json({ success: true });
  }),

  // Page endpoints
  http.post('/api/dashboards/:dashboardId/pages', async ({ request, params }) => {
    try {
      const { dashboardId } = params;
      const { name } = await request.json() as any;

      const dashboard = dashboards.find(d => d.id === dashboardId);
      if (!dashboard) {
        return HttpResponse.json(
          { message: 'Dashboard not found' },
          { status: 404 }
        );
      }

      const newPage: Page = {
        id: uuid(),
        name,
        layout: {
          widgets: [],
          gridConfig: { cols: 12, rowHeight: 30 }
        }
      };

      dashboard.pages.push(newPage);
      return HttpResponse.json(newPage);
    } catch (error) {
      return HttpResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
  }),

  http.delete('/api/dashboards/:dashboardId/pages/:pageId', ({ params }) => {
    const { dashboardId, pageId } = params;
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) {
      return HttpResponse.json(
        { message: 'Dashboard not found' },
        { status: 404 }
      );
    }

    dashboard.pages = dashboard.pages.filter(p => p.id !== pageId);
    return HttpResponse.json({ success: true });
  }),

  // Layout endpoint
  http.put('/api/pages/:pageId/layout', async ({ request, params }) => {
    try {
      const { pageId } = params;
      const layout = await request.json() as any;

      for (const dashboard of dashboards) {
        const page = dashboard.pages.find(p => p.id === pageId);
        if (page) {
          page.layout = layout;
          return HttpResponse.json({ success: true });
        }
      }

      return HttpResponse.json(
        { message: 'Page not found' },
        { status: 404 }
      );
    } catch (error) {
      return HttpResponse.json(
        { message: 'Invalid request format' },
        { status: 400 }
      );
    }
  }),

  http.put('/api/dashboards/:id/config', async ({ request, params }) => {
    try {
      const { id } = params;
      const config = await request.json() as any;

      const dashboard = dashboards.find(d => d.id === id);
      const dashboardIndex = dashboards.findIndex(d => d.id === id);
      if (!dashboard) {
        return HttpResponse.json(
          { message: 'Dashboard not found' },
          { status: 404 }
        );
      }

      // Add config to dashboard object
      (dashboard as any).config = config;

      // Update the dashboard with new data
      dashboards[dashboardIndex] = {
        ...dashboards[dashboardIndex],
        ...config
      };

      return HttpResponse.json(dashboards[dashboardIndex]);
    } catch (error) {
      return HttpResponse.json(
        { message: 'Failed to update dashboard config' },
        { status: 500 }
      );
    }
  }),

  // Page Configuration Handler
  http.put('/api/pages/:id/config', async ({ request, params }) => {
    try {
      const { id } = params;
      const config = await request.json() as any;

      for (const dashboard of dashboards) {
        const page = dashboard.pages.find(p => p.id === id);
        if (page) {
          // Add config to page object
          (page as any).config = config;
          return HttpResponse.json(page);
        }
      }

      return HttpResponse.json(
        { message: 'Page not found' },
        { status: 404 }
      );
    } catch (error) {
      return HttpResponse.json(
        { message: 'Failed to update page config' },
        { status: 500 }
      );
    }
  }),

  // Get single dashboard with details
  http.get('/api/dashboards/:dashboardId', async ({ params }) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 150));

    const { dashboardId } = params;

    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      return HttpResponse.json({
        ...dashboard,
        config: {
          ...dashboard.config,
          title: dashboard.name,
          description: 'This is a sample dashboard',
          thumbnail: '/thumbnails/sample.png'
        }
      });
    }

    // Return mock data if not found in our array
    return HttpResponse.json({
      id: dashboardId,
      name: 'Sample Dashboard',
      config: {
        title: 'Sample Dashboard',
        description: 'This is a sample dashboard',
        thumbnail: '/thumbnails/sample.png'
      },
      pages: [
        {
          id: 'page-1',
          name: 'Sample Page',
          config: {
            route: '/sample',
            title: 'Sample Page',
            description: 'This is a sample page'
          }
        }
      ]
    });
  }),

  // Get Page with Layout
  http.get('/api/dashboards/:dashboardId/pages/:pageId', async ({ params }) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 150));

    const { dashboardId, pageId } = params;

    // Try to find the page in our data
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      const page = dashboard.pages.find(p => p.id === pageId);
      if (page) {
        return HttpResponse.json({
          ...page,
          dashboard,
          config: {
            route: '/sample',
            title: page.name,
            description: 'This is a sample page'
          }
        });
      }
    }

    // Return mock data with sample widgets
    return HttpResponse.json({
      id: pageId,
      name: 'Sample Page',
      config: {
        route: '/sample',
        title: 'Sample Page',
        description: 'This is a sample page'
      },
      layout: {
        widgets: [
          {
            id: 'widget-1',
            type: 'text-widget',
            position: { x: 100, y: 100 },
            size: { width: 300, height: 200 },
            config: {
              title: 'Sample Text',
              content: 'This is a sample text widget',
              fontSize: 14,
              textAlign: 'left',
              backgroundColor: '#ffffff',
              textColor: '#000000'
            }
          },
          {
            id: 'widget-2',
            type: 'metric-card',
            position: { x: 450, y: 100 },
            size: { width: 250, height: 150 },
            config: {
              title: 'Sample Metric',
              metric: 'Total Users',
              value: '1,234',
              change: '+12%',
              changeType: 'positive'
            }
          }
        ],
        gridConfig: {
          cols: 12,
          rowHeight: 30
        }
      }
    });
  }),

  // File Upload Handler (Enhanced)
  http.post('/api/upload', async ({ request }) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return HttpResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }

      // For demo purposes, return a mock URL
      // Support different file types
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const fileUrl = `/uploads/${fileName}`;

      return HttpResponse.json({ url: fileUrl });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }
  })
];