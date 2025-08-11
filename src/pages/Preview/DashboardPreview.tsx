/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Spin, message, Tabs } from 'antd';

// const { TabPane } = Tabs;

// const DashboardPreview = () => {
//   const { dashboardId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [activeTab, setActiveTab] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const dashboardRes = await fetch(`/api/dashboards/${dashboardId}`);
//         if (!dashboardRes.ok) throw new Error('Dashboard not found');
//         const dashboard = await dashboardRes.json();
        
//         setDashboardData(dashboard);
//         if (dashboard.pages?.length > 0) {
//           setActiveTab(dashboard.pages[0].id);
//         }
//       } catch (error: any) {
//         console.error('Failed to load dashboard:', error);
//         message.error(error.message || 'Failed to load dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [dashboardId]);

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (!dashboardData) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <div style={{ textAlign: 'center' }}>
//           <h2>Dashboard not found</h2>
//           <p>The requested dashboard could not be loaded.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <header style={{ 
//         padding: '16px', 
//         borderBottom: '1px solid #f0f0f0',
//         background: '#fff',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//       }}>
//         <h1 style={{ margin: 0 }}>{dashboardData.name}</h1>
//       </header>
      
//       <Tabs 
//         activeKey={activeTab}
//         onChange={setActiveTab}
//         style={{ margin: '0 20px' }}
//       >
//         {dashboardData.pages?.map(page => (
//           <TabPane tab={page.name} key={page.id}>
//             <div style={{ 
//               flex: 1, 
//               position: 'relative', 
//               height: 'calc(100vh - 120px)',
//               overflow: 'auto',
//               padding: '20px',
//               background: '#f5f5f5'
//             }}>
//               {page.layout?.widgets?.map(widget => (
//                 <div key={widget.id} style={{
//                   position: 'absolute',
//                   left: `${widget.position.x}px`,
//                   top: `${widget.position.y}px`,
//                   width: `${widget.size.width}px`,
//                   height: `${widget.size.height}px`
//                 }}>
//                   {createWidget(widget.type, {
//                     config: widget.config,
//                     position: widget.position,
//                     size: widget.size,
//                     isSelected: false,
//                     onSelect: () => {},
//                     onSettingsClick: () => {},
//                     onConfigChange: () => {},
//                     onPositionChange: () => {},
//                     onSizeChange: () => {},
//                     onDelete: () => {}
//                   })}
//                 </div>
//               ))}
//             </div>
//           </TabPane>
//         ))}
//       </Tabs>
//     </div>
//   );
// };

// export default DashboardPreview;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React, { useEffect, useState } from 'react';
// 1. Import hooks and Link from react-router-dom
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spin, message, Row, Col, Card, Layout, Menu, Empty, Typography, Descriptions } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
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


const DashboardPreview = () => {
  // 2. Get both dashboardId and pageId from the URL
  const { dashboardId, pageId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardRes = await fetch(`/api/dashboards/${dashboardId}`);
        if (!dashboardRes.ok) throw new Error('Dashboard not found');
        const dashboard = await dashboardRes.json();
        
        setDashboardData(dashboard);

        // 3. If no pageId is in the URL, redirect to the first page
        // if (!pageId && dashboard.pages?.length > 0) {
        //   navigate(`/preview/${dashboardId}/${dashboard.pages[0].id}`, { replace: true });
        // }

      } catch (error: any) {
        console.error('Failed to load dashboard:', error);
        message.error(error.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dashboardId, pageId, navigate]); // Add dependencies

  // Find the currently active page based on the pageId from the URL
  const activePage = dashboardData?.pages?.find(p => p.id === pageId);

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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
        {/* 4. Update Menu to be dynamic and use pageId for selection */}
        <Menu theme="dark" selectedKeys={[pageId]} mode="inline">
            {/* <Menu.Item key="home" icon={<PieChartOutlined />}>
              <Link to="/some-other-home-route">Home</Link>
            </Menu.Item> */}
            {/* <Menu.SubMenu key="dashboard-pages" icon={<AppstoreOutlined />} title={dashboardData.name}> */}
                {dashboardData.pages?.map(page => (
                    <Menu.Item key={page.id} icon={<PieChartOutlined />}>
                        <Link to={`/preview/${dashboardId}/${page.id}`} >{page.name}</Link>
                    </Menu.Item>
                ))}
            {/* </Menu.SubMenu> */}
            {/* <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item> */}
          </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: '0 24px', background: '#fff', height: 'auto' }}>
            <div>
                <Title level={3} style={{ margin: '8px 0 0 0' }}>{dashboardData.name}</Title>
                <Text type="secondary">{dashboardData.config?.description}</Text>
            </div>
        </Header>
        {/* 5. Remove Tabs and render only the active page's content */}
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            {activePage ? (
                <>
                    <Title level={4}>{activePage.name}</Title>
                    {activePage.layout?.widgets && activePage.layout.widgets.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {activePage.layout.widgets.map(widget => (
                                <Col 
                                key={widget.id} 
                                xs={24}
                                sm={24}
                                md={12}
                                lg={widget.size.width}
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
                </>
            ) : (
                 <div style={{textAlign: 'center', marginTop: '50px'}}>
                    <Empty description={<span>Please select a page from the menu.</span>} />
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

export default DashboardPreview;
