/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PreviewPage = () => {
    const { dashboardId, pageId } = useParams();
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [layout, setLayout] = useState(null);

    useEffect(() => {
        const fetchLayout = async () => {
            try {
                const response = await fetch(`/api/pages/${pageId}/layout`);
                const data = await response.json();
                setLayout(data);
            } finally {
                setLoading(false);
            }
        };

        fetchLayout();
    }, [pageId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const dashboardRes = await fetch(`/api/dashboards/${dashboardId}`);
                const dashboard = await dashboardRes.json();

                const pageRes = await fetch(`/api/dashboards/${dashboardId}/pages/${pageId}`);
                const page = await pageRes.json();

                setDashboardData(dashboard);
                setPageData(page);
            } catch (error) {
                console.error('Failed to load preview data:', error);
                message.error('Failed to load preview');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dashboardId, pageId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!pageData || !dashboardData) {
        return <div>Page not found</div>;
    }

    console.log(layout);

    return (
        <div className="preview-container">
            <header style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <h1>{dashboardData.name} - {pageData.name}</h1>
            </header>
            <div className="preview-content">
                {/* Render the widgets here */}
                {pageData.layout?.widgets?.map(widget => (
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
                            onSelect: () => { },
                            onSettingsClick: () => { },
                            onConfigChange: () => { },
                            onPositionChange: () => { },
                            onSizeChange: () => { },
                            onDelete: () => { }
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviewPage;