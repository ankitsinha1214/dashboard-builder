/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// import { Spin, message } from 'antd';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const PreviewPage = () => {
//     const { dashboardId, pageId } = useParams();
//     const [loading, setLoading] = useState(true);
//     const [pageData, setPageData] = useState(null);
//     const [dashboardData, setDashboardData] = useState(null);
//     const [layout, setLayout] = useState(null);

//     useEffect(() => {
//         const fetchLayout = async () => {
//             try {
//                 const response = await fetch(`/api/pages/${pageId}/layout`);
//                 const data = await response.json();
//                 setLayout(data);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLayout();
//     }, [pageId]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const dashboardRes = await fetch(`/api/dashboards/${dashboardId}`);
//                 const dashboard = await dashboardRes.json();

//                 const pageRes = await fetch(`/api/dashboards/${dashboardId}/pages/${pageId}`);
//                 const page = await pageRes.json();

//                 setDashboardData(dashboard);
//                 setPageData(page);
//             } catch (error) {
//                 console.error('Failed to load preview data:', error);
//                 message.error('Failed to load preview');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [dashboardId, pageId]);

//     if (loading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <Spin size="large" />
//             </div>
//         );
//     }

//     if (!pageData || !dashboardData) {
//         return <div>Page not found</div>;
//     }

//     console.log(layout);

//     return (
//         <div className="preview-container">
//             <header style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
//                 <h1>{dashboardData.name} - {pageData.name}</h1>
//             </header>
//             <div className="preview-content">
//                 {/* Render the widgets here */}
//                 {pageData.layout?.widgets?.map(widget => (
//                     <div key={widget.id} style={{
//                         position: 'absolute',
//                         left: `${widget.position.x}px`,
//                         top: `${widget.position.y}px`,
//                         width: `${widget.size.width}px`,
//                         height: `${widget.size.height}px`
//                     }}>
//                         {createWidget(widget.type, {
//                             config: widget.config,
//                             position: widget.position,
//                             size: widget.size,
//                             isSelected: false,
//                             onSelect: () => { },
//                             onSettingsClick: () => { },
//                             onConfigChange: () => { },
//                             onPositionChange: () => { },
//                             onSizeChange: () => { },
//                             onDelete: () => { }
//                         })}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default PreviewPage;


/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spin, message, Row, Col, Card, Layout, Menu, Empty, Typography } from 'antd';
import {
  AppstoreOutlined,
  FileOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const createWidget = (type, config) => {
    const textStyle = {
        color: config.textColor || '#000000',
        fontSize: config.fontSize ? `${config.fontSize}px` : '14px',
        textAlign: config.textAlign || 'left',
    };

    switch (type) {
        case 'text-widget':
            return <div style={textStyle}><p>{config.content}</p></div>;
        case 'metric-card':
            const changeStyle = {
                color: config.changeType === 'positive' ? '#3f8600' : '#cf1322',
                marginLeft: '8px',
                fontSize: '1em',
                fontWeight: 'normal',
            };
            return (
                <div style={{ ...textStyle, fontSize: '2em', fontWeight: 'bold' }}>
                    {config.value}
                    <span style={changeStyle}>{config.change}</span>
                </div>
            );
        default:
            return <p>Unknown widget type: {type}</p>;
    }
};

const PreviewPage = () => {
    const { dashboardId, pageId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null); 
    const [pageData, setPageData] = useState(null); 
    const [collapsed, setCollapsed] = useState(false);

    // 1. Define fetchData using useCallback so it can be reused.
    const fetchData = useCallback(async () => {
        // Only fetch if pageId is present
        if (!pageId) return;

        try {
            setLoading(true);
            const [dashboardRes, pageRes] = await Promise.all([
                fetch(`/api/dashboards/${dashboardId}`),
                fetch(`/api/dashboards/${dashboardId}/pages/${pageId}`)
            ]);

            if (!dashboardRes.ok) throw new Error('Dashboard data not found');
            if (!pageRes.ok) throw new Error('Page data not found');

            const dashboard = await dashboardRes.json();
            const page = await pageRes.json();

            setDashboardData(dashboard);
            setPageData(page);

        } catch (error) {
            console.error('Failed to load preview data:', error);
            message.error(error.message || 'Failed to load preview data');
        } finally {
            setLoading(false);
        }
    }, [dashboardId, pageId]); // Dependencies for the fetch logic

    // 2. useEffect for initial load and URL changes.
    useEffect(() => {
        if (!pageId) {
            const getFirstPage = async () => {
                const dashboardRes = await fetch(`/api/dashboards/${dashboardId}`);
                if (dashboardRes.ok) {
                    const dashboard = await dashboardRes.json();
                    if (dashboard.pages?.length > 0) {
                        navigate(`/preview/${dashboardId}/${dashboard.pages[0].id}`, { replace: true });
                    }
                }
            }
            getFirstPage();
        } else {
            fetchData();
        }
    }, [dashboardId, pageId, navigate, fetchData]);

    // 3. useEffect to listen for the custom 'pagesUpdated' event.
    useEffect(() => {
        const handlePagesUpdate = () => {
            console.log('Event pagesUpdated received in PreviewPage, refetching...');
            fetchData();
        };

        window.addEventListener('pagesUpdated', handlePagesUpdate);

        // Cleanup function to remove the listener
        return () => {
            window.removeEventListener('pagesUpdated', handlePagesUpdate);
        };
    }, [fetchData]); // Dependency is the memoized fetchData function

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!dashboardData || !pageData) {
        return (
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Dashboard or Page not found</h2>
                    <p>The requested content could not be loaded.</p>
                </div>
            </div>
        );
    }

      const renderMenuItems = (items, dashboardId) => {
        return items.map(item => {
          // NEW LOGIC: Only create a SubMenu if 'children' exists AND is not empty.
          if (item.children && item.children.length > 0) {
            return (
              <Menu.SubMenu key={item.key} icon={<AppstoreOutlined />} title={item.title}>
                {/* Recursively call the function for the children of the group */}
                {renderMenuItems(item.children, dashboardId)}
              </Menu.SubMenu>
            );
          }
      
          // In ALL other cases (no 'children' key, or 'children' is an empty array),
          // render a clickable link.
          return (
            <Menu.Item key={item.key} icon={<PieChartOutlined />}>
              <Link to={`/preview/${dashboardId}/${item.key}`}>{item.title}</Link>
            </Menu.Item>
          );
        });
      };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
                <Menu theme="dark" selectedKeys={[pageId]} mode="inline">
                    {dashboardData.pages?.map(page => (
                        <Menu.Item key={page.id} icon={<PieChartOutlined />}>
                            <Link to={`/preview/${dashboardId}/${page.id}`}>{page.name}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider> */}
            <Sider collapsible={collapsed} onCollapse={setCollapsed}>
                <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
                <Menu theme="dark" selectedKeys={[pageId]} mode="inline">
                    {/* This will now render the menu exactly as you want. */}
                    {dashboardData.config?.sidebar && renderMenuItems(dashboardData.config.sidebar, dashboardId)}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: '0 24px', background: '#fff', height: 'auto' }}>
                    <div>
                        <Title level={3} style={{ margin: '8px 0 0 0' }}>{pageData.name}</Title>
                        <Text type="secondary">{pageData.config?.description}</Text>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#f0f2f5' }}>
                    {pageData.layout?.widgets && pageData.layout.widgets.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {pageData.layout.widgets.map(widget => {
                                const cardStyle = {
                                    minHeight: widget.size?.height || 150, 
                                    backgroundColor: widget.config?.backgroundColor || '#ffffff', 
                                };
                                const headStyle = {
                                    color: widget.config?.textColor || '#000000', 
                                };
                                return (
                                    <Col key={widget.id} xs={24} sm={12} md={8} lg={6}>
                                        <Card 
                                            title={widget.config.title} 
                                            bordered={false} 
                                            style={cardStyle}
                                            headStyle={headStyle}
                                        >
                                            {createWidget(widget.type, widget.config)}
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    ) : (
                        <div style={{textAlign: 'center', marginTop: '50px'}}>
                            <Empty description={<span>This page has no widgets.</span>} />
                        </div>
                    )}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    © {new Date().getFullYear()} Esyasoft Technology Private Limited. All rights reserved.
                </Footer>
            </Layout>
        </Layout>
    );
};

export default PreviewPage;