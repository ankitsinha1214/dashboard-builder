/* eslint-disable @typescript-eslint/no-explicit-any */
class DashboardService {
    static async fetchDashboards() {
        const response = await fetch('/api/dashboards');
        return response.json();
    }

    static async fetchDashboard(id: string) {
        const response = await fetch(`/api/dashboards/${id}`);
        return response.json();
    }

    static async createDashboard(data: {
        name: string;
        description?: string;
        thumbnail?: string;
    }) {
        const response = await fetch('/api/dashboards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async updateDashboard(
        id: string,
        data: {
            name?: string;
            description?: string;
            thumbnail?: string;
        }
    ) {
        const response = await fetch(`/api/dashboards/${id}/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    static async deleteDashboard(id: string) {
        await fetch(`/api/dashboards/${id}`, {
            method: 'DELETE'
        });
    }

    static async createPage(dashboardId: string, name: string) {
        const response = await fetch(`/api/dashboards/${dashboardId}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        return response.json();
    }

    static async deletePage(dashboardId: string, pageId: string) {
        await fetch(`/api/dashboards/${dashboardId}/pages/${pageId}`, {
            method: 'DELETE'
        });
    }

    static async savePageConfig(pageId: string, config: any) {
        const response = await fetch(`/api/pages/${pageId}/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        return response.json();
    }

    static async uploadThumbnail(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        return response.json();
    }

    static async saveDashboardConfig(dashboardId: string, config: any) {
        const response = await fetch(`/api/dashboards/${dashboardId}/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        return response.json();
    }

    static async saveLayout(pageId: string, layout: any) {
        const response = await fetch(`/api/pages/${pageId}/layout`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(layout)
        });
        return response.json();
    }
}

export default DashboardService;