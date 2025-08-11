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
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spin, message, Row, Col, Card, Layout, Menu, Empty, Typography } from 'antd';
import {
  AppstoreOutlined,
  FileOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

// A placeholder for your actual widget creation logic
const createWidget = (type, props) => {
  return (
    <div>
      <p>Config: {JSON.stringify(props.config)}</p>
    </div>
  );
};

const PreviewPage = () => {
    const { dashboardId, pageId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null); // For Sider and Header
    const [pageData, setPageData] = useState(null); // For Content
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        // Fetch both dashboard data (for nav) and specific page data (for content)
        const fetchData = async () => {
            try {
                setLoading(true);

                // Use Promise.all to fetch in parallel for efficiency
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
        };

        // Redirect if pageId is missing
        if (!pageId) {
            // We need to fetch dashboard data first to find the first page
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

    }, [dashboardId, pageId, navigate]);

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

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
                <Menu theme="dark" selectedKeys={[pageId]} mode="inline">
            
                
                        {dashboardData.pages?.map(page => (
                            <Menu.Item key={page.id} icon={<PieChartOutlined />}>
                                <Link to={`/preview/${dashboardId}/${page.id}`}>{page.name}</Link>
                            </Menu.Item>
                        ))}
   
           
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: '0 24px', background: '#fff', height: 'auto' }}>
                    <div>
                        <Title level={3} style={{ margin: '8px 0 0 0' }}>{pageData.name}</Title>
                        <Text type="secondary">{pageData.config?.description}</Text>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                    {pageData.layout?.widgets && pageData.layout.widgets.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {pageData.layout.widgets.map(widget => (
                                <Col 
                                    key={widget.id} 
                                    xs={24}
                                    sm={24}
                                    md={12}
                                    lg={widget.size.width} // Assuming width is based on a 24-col grid
                                >
                                    <Card title={`${widget.type} Widget`} bordered={false} style={{ height: '100%', background: '#f0f2f5' }}>
                                        {createWidget(widget.type, {
                                            config: widget.config,
                                        })}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div style={{textAlign: 'center', marginTop: '50px'}}>
                            <Empty description={<span>This page has no widgets.</span>} />
                        </div>
                    )}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Example ©{new Date().getFullYear()} Created by You
                </Footer>
            </Layout>
        </Layout>
    );
};

export default PreviewPage;