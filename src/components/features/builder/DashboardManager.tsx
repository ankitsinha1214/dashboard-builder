/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { DashboardOutlined, DeleteOutlined, EditOutlined, EyeOutlined, HolderOutlined, MenuOutlined, PlusOutlined, SettingOutlined, } from '@ant-design/icons';
import { Button, Card, Form, Grid, Image, Input, List, Modal, Space, Typography, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import DashboardService from '../../../services/DashboardService';
import PageManager from './PageManager';
import SidebarConfig from './SidebarConfig';
import { useDashboards } from '../../../hooks/useDashboards';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

const DashboardManager = () => {
  // const [dashboards, setDashboards] = useState([]);
  // const [currentDashboard, setCurrentDashboard] = useState(null);
  const { dashboards, loading, createDashboard, updateDashboard, deleteDashboard, saveDashboardConfig } = useDashboards();
  const [currentDashboard, setCurrentDashboard] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [currentDashboardSettings, setCurrentDashboardSettings] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [sidebarConfigVisible, setSidebarConfigVisible] = useState(false);
  const screens = useBreakpoint();

  // useEffect(() => {
  //   fetchDashboards();
  // }, []);

  // const fetchDashboards = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await DashboardService.fetchDashboards();
  //     setDashboards(data);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const createDashboard = async () => {
  //   if (!dashboardName.trim()) return;

  //   try {
  //     const newDashboard = await DashboardService.createDashboard({
  //       name: dashboardName,
  //       description: dashboardDescription,
  //       thumbnail: fileList[0]?.thumbUrl || ''
  //     });
  //     setDashboards([...dashboards, newDashboard]);
  //     setCreateModalVisible(false);
  //     setDashboardName('');
  //     setDashboardDescription('');
  //     setFileList([]);
  //   } catch (error) {
  //     console.error('Failed to create dashboard:', error);
  //   }
  // };

  // const updateDashboard = async () => {
  //   if (!currentDashboardSettings) return;

  //   try {
  //     const updatedDashboard = await DashboardService.updateDashboard(currentDashboardSettings.id, {
  //       name: dashboardName,
  //       description: dashboardDescription,
  //       thumbnail: fileList[0]?.thumbUrl || currentDashboardSettings.thumbnail
  //     });

  //     setDashboards(dashboards.map(d =>
  //       d.id === updatedDashboard.id ? updatedDashboard : d
  //     ));

  //     if (currentDashboard?.id === updatedDashboard.id) {
  //       setCurrentDashboard(updatedDashboard);
  //     }

  //     setSettingsModalVisible(false);
  //   } catch (error) {
  //     console.error('Failed to update dashboard:', error);
  //   }
  // };

  // const deleteDashboard = async (id) => {
  //   try {
  //     await DashboardService.deleteDashboard(id);
  //     setDashboards(dashboards.filter(d => d.id !== id));
  //     if (currentDashboard?.id === id) {
  //       setCurrentDashboard(null);
  //     }
  //   } catch (error) {
  //     console.error('Failed to delete dashboard:', error);
  //   }
  // };

  const handleCreateDashboard = async () => {
    if (!dashboardName.trim()) return;
    await createDashboard({
        name: dashboardName,
        description: dashboardDescription,
        thumbnail: fileList[0]?.thumbUrl || ''
    });
    setCreateModalVisible(false);
    setDashboardName('');
    setDashboardDescription('');
    setFileList([]);
  };

  const handleUpdateDashboard = async () => {
    if (!currentDashboardSettings) return;
    const updated = await updateDashboard(currentDashboardSettings.id, {
      name: dashboardName,
      description: dashboardDescription,
      thumbnail: fileList[0]?.thumbUrl || currentDashboardSettings.thumbnail
    });
  
    if (updated && currentDashboard?.id === updated.id) {
        setCurrentDashboard(updated);
    }
    setSettingsModalVisible(false);
  };

  const handleDeleteDashboard = async (id) => {
    const success = await deleteDashboard(id);
    if (success && currentDashboard?.id === id) {
        setCurrentDashboard(null);
    }
  }

  const handleSaveSidebarConfig = async (config) => {
    if (!currentDashboard) return;
    await saveDashboardConfig(currentDashboard.id, {
        ...currentDashboard.config,
        sidebar: config
    });
  };

  const handlePreview = (dashboard) => {
    const previewUrl = `/preview/dashboard/${dashboard.id}`;
    window.open(previewUrl, '_blank');
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  const handleUploadChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Only allow one file
    setFileList(fileList);
  };

  const openSettingsModal = (dashboard) => {
    setCurrentDashboardSettings(dashboard);
    setDashboardName(dashboard.name);
    setDashboardDescription(dashboard.description || '');
    setFileList(dashboard.thumbnail ? [{
      uid: '-1',
      name: 'thumbnail',
      status: 'done',
      url: dashboard.thumbnail,
      thumbUrl: dashboard.thumbnail
    }] : []);
    setSettingsModalVisible(true);
  };

  // Dummy images for dashboard cards
  const dummyImages = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  ];

  const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

  // const saveSidebarConfig = async (config) => {
  //   try {
  //     await DashboardService.saveDashboardConfig(currentDashboard.id, {
  //       ...currentDashboard.config,
  //       sidebar: config
  //     });
  //     // Update local state
  //   } catch (error) {
  //     message.error('Failed to save sidebar config');
  //   }
  // };

  return (
    <div className="dashboard-manager">

      {!currentDashboard ? (
        <Card
          title={<Title level={4} style={{ margin: 0 }}><DashboardOutlined /> My Dashboards</Title>}
          bordered={false}
          style={{
            width: '100%',
            minHeight: 'calc(100vh - 0px)',
            boxShadow: 'none',
          }}
          bodyStyle={{ padding: screens.md ? '24px' : '16px' }}
          extra={
            // <Button
            //   type="primary"
            //   icon={<PlusOutlined />}
            //   // size={screens.md ? 'middle' : 'small'}
            //   onClick={() => setCreateModalVisible(true)}
            // >
            //   New Dashboard
            // </Button>,

            <Button
              icon={<PlusOutlined />}
              // onClick={() => setSidebarConfigVisible(true)}
              onClick={() => setCreateModalVisible(true)}
              size={screens.md ? 'middle' : 'small'}
            >
              Add Dashboard
            </Button>
          }
        >
          <List
            loading={loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={dashboards}
            renderItem={(dashboard) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={dashboard.name}
                      src={dashboard.thumbnail || getRandomImage()}
                      height={160}
                      preview={false}
                      style={{ objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<SettingOutlined />}
                      onClick={() => openSettingsModal(dashboard)}
                      title="Settings"
                    />,
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => setCurrentDashboard(dashboard)}
                      title="Edit"
                    />,
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(dashboard)}
                      title="Preview"
                    />,
                    <Button
                    type="text"
                    icon={<HolderOutlined />}
                    onClick={() => setSidebarConfigVisible(true)}
                    title="Configuration"
                  />,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                      title="Delete"
                    />,
                
                  ]}
                >
                  <Card.Meta
                    title={dashboard.name}
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary" ellipsis>
                          {dashboard.description || 'Sample dashboard with analytics and metrics'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Last updated: {new Date(dashboard.updatedAt || dashboard.createdAt).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </Card>
      ) : (
        <>
          <PageManager
            dashboard={currentDashboard}
            onBack={() => setCurrentDashboard(null)}
          />
        </>
      )}

      {!currentDashboard &&
        <SidebarConfig
          dashboard={currentDashboard}
          // onSave={saveSidebarConfig}
          visible={sidebarConfigVisible}
          onClose={() => setSidebarConfigVisible(false)}
          onSave={handleSaveSidebarConfig}
        />
      }
      {/* Create Dashboard Modal */}
      <Modal
        title="Create New Dashboard"
        visible={createModalVisible}
        onOk={handleCreateDashboard}
        onCancel={() => {
          setCreateModalVisible(false);
          setDashboardName('');
          setDashboardDescription('');
          setFileList([]);
        }}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ disabled: !dashboardName.trim() }}
      >
        <Form layout="vertical">
          <Form.Item label="Dashboard Name" required>
            <Input
              placeholder="Enter dashboard name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              size="large"
              autoFocus
            />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea
              placeholder="Enter dashboard description"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              rows={3}
            />
          </Form.Item>
          <Form.Item label="Thumbnail Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              accept="image/*"
              maxCount={1}
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Dashboard Settings Modal */}
      <Modal
        title="Dashboard Settings"
        visible={settingsModalVisible}
        onOk={handleUpdateDashboard}
        onCancel={() => setSettingsModalVisible(false)}
        okText="Save Changes"
        cancelText="Cancel"
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Dashboard Name" required>
            <Input
              placeholder="Enter dashboard name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              size="large"
            />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea
              placeholder="Enter dashboard description"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              rows={3}
            />
          </Form.Item>
          <Form.Item label="Thumbnail Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              accept="image/*"
              maxCount={1}
            >
              {fileList.length < 1 && '+ Upload'}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardManager;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// import { DashboardOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
// import { Button, Card, Form, Grid, Image, Input, List, Modal, Space, Typography, Upload, message } from 'antd';
// import { useState } from 'react';
// import PageManager from './PageManager';
// import SidebarConfig from './SidebarConfig';
// import { useDashboards } from '../hooks/useDashboards'; // <-- IMPORT THE HOOK

// const { Title, Text } = Typography;
// const { useBreakpoint } = Grid;
// const { TextArea } = Input;

// const DashboardManager = () => {
//   // --- HOOK-MANAGED STATE ---
//   const { dashboards, loading, createDashboard, updateDashboard, deleteDashboard, setDashboards, saveDashboardConfig } = useDashboards();

//   // --- UI-ONLY STATE ---
//   const [currentDashboard, setCurrentDashboard] = useState(null);
//   const [createModalVisible, setCreateModalVisible] = useState(false);
//   const [settingsModalVisible, setSettingsModalVisible] = useState(false);
//   const [sidebarConfigVisible, setSidebarConfigVisible] = useState(false);
  
//   // State for the forms
//   const [dashboardName, setDashboardName] = useState('');
//   const [dashboardDescription, setDashboardDescription] = useState('');
//   const [currentDashboardSettings, setCurrentDashboardSettings] = useState(null);
//   const [fileList, setFileList] = useState([]);
  
//   const screens = useBreakpoint();

//   // --- HANDLER FUNCTIONS (now much simpler) ---
//   const handleCreateDashboard = async () => {
//     if (!dashboardName.trim()) return;
//     await createDashboard({
//         name: dashboardName,
//         description: dashboardDescription,
//         thumbnail: fileList[0]?.thumbUrl || ''
//     });
//     setCreateModalVisible(false);
//     setDashboardName('');
//     setDashboardDescription('');
//     setFileList([]);
//   };
  
//   const handleUpdateDashboard = async () => {
//     if (!currentDashboardSettings) return;
//     const updated = await updateDashboard(currentDashboardSettings.id, {
//       name: dashboardName,
//       description: dashboardDescription,
//       thumbnail: fileList[0]?.thumbUrl || currentDashboardSettings.thumbnail
//     });

//     if (updated && currentDashboard?.id === updated.id) {
//         setCurrentDashboard(updated);
//     }
//     setSettingsModalVisible(false);
//   };
  
//   const handleDeleteDashboard = async (id) => {
//     const success = await deleteDashboard(id);
//     if (success && currentDashboard?.id === id) {
//         setCurrentDashboard(null);
//     }
//   }
  
//   const handleSaveSidebarConfig = async (config) => {
//     if (!currentDashboard) return;
//     await saveDashboardConfig(currentDashboard.id, {
//         ...currentDashboard.config,
//         sidebar: config
//     });
//     // You might want to update the currentDashboard state here as well
//   }

//   const handlePreview = (dashboard) => {
//     const previewUrl = `/preview/dashboard/${dashboard.id}`;
//     window.open(previewUrl, '_blank');
//   };

//   const beforeUpload = (file) => {
//     const isImage = file.type.startsWith('image/');
//     if (!isImage) {
//       message.error('You can only upload image files!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error('Image must be smaller than 2MB!');
//     }
//     return isImage && isLt2M;
//   };

//   const handleUploadChange = (info) => {
//     let fileList = [...info.fileList];
//     fileList = fileList.slice(-1); // Only allow one file
//     setFileList(fileList);
//   };

//   const openSettingsModal = (dashboard) => {
//     setCurrentDashboardSettings(dashboard);
//     setDashboardName(dashboard.name);
//     setDashboardDescription(dashboard.description || '');
//     setFileList(dashboard.thumbnail ? [{
//       uid: '-1',
//       name: 'thumbnail',
//       status: 'done',
//       url: dashboard.thumbnail,
//       thumbUrl: dashboard.thumbnail
//     }] : []);
//     setSettingsModalVisible(true);
//   };

//   const dummyImages = [
//     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//   ];

//   const getRandomImage = () => dummyImages[Math.floor(Math.random() * dummyImages.length)];

//   // --- RENDER ---
//   return (
//     <div className="dashboard-manager">

//       {!currentDashboard ? (
//         <Card
//           title={<Title level={4} style={{ margin: 0 }}><DashboardOutlined /> My Dashboards</Title>}
//           bordered={false}
//           style={{
//             width: '100%',
//             minHeight: 'calc(100vh - 0px)',
//             boxShadow: 'none',
//           }}
//           bodyStyle={{ padding: screens.md ? '24px' : '16px' }}
//           extra={
//             <>
//               <Button
//                 type="primary"
//                 icon={<PlusOutlined />}
//                 onClick={() => setCreateModalVisible(true)}
//                 size={screens.md ? 'middle' : 'small'}
//               >
//                 New Dashboard
//               </Button>

//               <Button
//                 icon={<MenuOutlined />}
//                 onClick={() => setSidebarConfigVisible(true)}
//               >
//                 Configure Sidebar
//               </Button>
//             </>
//           }
//         >
//           <List
//             loading={loading}
//             grid={{
//               gutter: 16,
//               xs: 1,
//               sm: 2,
//               md: 3,
//               lg: 3,
//               xl: 4,
//               xxl: 4,
//             }}
//             dataSource={dashboards}
//             renderItem={(dashboard) => (
//               <List.Item>
//                 <Card
//                   hoverable
//                   cover={
//                     <Image
//                       alt={dashboard.name}
//                       src={dashboard.thumbnail || getRandomImage()}
//                       height={160}
//                       preview={false}
//                       style={{ objectFit: 'cover' }}
//                     />
//                   }
//                   actions={[
//                     <Button
//                       type="text"
//                       icon={<SettingOutlined />}
//                       onClick={() => openSettingsModal(dashboard)}
//                       title="Settings"
//                     />,
//                     <Button
//                       type="text"
//                       icon={<EditOutlined />}
//                       onClick={() => setCurrentDashboard(dashboard)}
//                       title="Edit"
//                     />,
//                     <Button
//                       type="text"
//                       icon={<EyeOutlined />}
//                       onClick={() => handlePreview(dashboard)}
//                       title="Preview"
//                     />,
//                     <Button
//                       type="text"
//                       danger
//                       icon={<DeleteOutlined />}
//                       onClick={() => handleDeleteDashboard(dashboard.id)}
//                       title="Delete"
//                     />,
//                   ]}
//                 >
//                   <Card.Meta
//                     title={dashboard.name}
//                     description={
//                       <Space direction="vertical" size={2}>
//                         <Text type="secondary" ellipsis>
//                           {dashboard.description || 'Sample dashboard with analytics and metrics'}
//                         </Text>
//                         <Text type="secondary" style={{ fontSize: 12 }}>
//                           Last updated: {new Date(dashboard.updatedAt || dashboard.createdAt).toLocaleDateString()}
//                         </Text>
//                       </Space>
//                     }
//                   />
//                 </Card>
//               </List.Item>
//             )}
//           />
//         </Card>
//       ) : (
//         <PageManager
//           dashboard={currentDashboard}
//           onBack={() => setCurrentDashboard(null)}
//         />
//       )}

//       {!currentDashboard &&
//         <SidebarConfig
//           dashboard={currentDashboard}
//           onSave={handleSaveSidebarConfig}
//           visible={sidebarConfigVisible}
//           onClose={() => setSidebarConfigVisible(false)}
//         />
//       }
//       {/* Create Dashboard Modal */}
//       <Modal
//         title="Create New Dashboard"
//         visible={createModalVisible}
//         onOk={handleCreateDashboard}
//         onCancel={() => {
//           setCreateModalVisible(false);
//           setDashboardName('');
//           setDashboardDescription('');
//           setFileList([]);
//         }}
//         okText="Create"
//         cancelText="Cancel"
//         okButtonProps={{ disabled: !dashboardName.trim() }}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Dashboard Name" required>
//             <Input
//               placeholder="Enter dashboard name"
//               value={dashboardName}
//               onChange={(e) => setDashboardName(e.target.value)}
//               size="large"
//               autoFocus
//             />
//           </Form.Item>
//           <Form.Item label="Description">
//             <TextArea
//               placeholder="Enter dashboard description"
//               value={dashboardDescription}
//               onChange={(e) => setDashboardDescription(e.target.value)}
//               rows={3}
//             />
//           </Form.Item>
//           <Form.Item label="Thumbnail Image">
//             <Upload
//               listType="picture-card"
//               fileList={fileList}
//               beforeUpload={beforeUpload}
//               onChange={handleUploadChange}
//               accept="image/*"
//               maxCount={1}
//             >
//               {fileList.length < 1 && '+ Upload'}
//             </Upload>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Dashboard Settings Modal */}
//       <Modal
//         title="Dashboard Settings"
//         visible={settingsModalVisible}
//         onOk={handleUpdateDashboard}
//         onCancel={() => setSettingsModalVisible(false)}
//         okText="Save Changes"
//         cancelText="Cancel"
//         width={600}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Dashboard Name" required>
//             <Input
//               placeholder="Enter dashboard name"
//               value={dashboardName}
//               onChange={(e) => setDashboardName(e.target.value)}
//               size="large"
//             />
//           </Form.Item>
//           <Form.Item label="Description">
//             <TextArea
//               placeholder="Enter dashboard description"
//               value={dashboardDescription}
//               onChange={(e) => setDashboardDescription(e.target.value)}
//               rows={3}
//             />
//           </Form.Item>
//           <Form.Item label="Thumbnail Image">
//             <Upload
//               listType="picture-card"
//               fileList={fileList}
//               beforeUpload={beforeUpload}
//               onChange={handleUploadChange}
//               accept="image/*"
//               maxCount={1}
//             >
//               {fileList.length < 1 && '+ Upload'}
//             </Upload>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default DashboardManager;