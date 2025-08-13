/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FileOutlined, PlusOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Image, Input, List, message, Modal, Space, Typography, Upload, Grid } from 'antd';
import { useState } from 'react';
import DashboardService from '../../../services/DashboardService';
import WidgetLayoutEditor from './WidgetLayoutEditor';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PageManager = ({ dashboard, onBack }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(null);
  const [pageToConfigure, setPageToConfigure] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pageName, setPageName] = useState('');
  const [pageConfigModalVisible, setPageConfigModalVisible] = useState(false);
  const [pageConfig, setPageConfig] = useState({
    route: '',
    title: '',
    description: '',
    thumbnail: null
  });
  const screens = useBreakpoint();

  const createPage = async () => {
    if (!pageName.trim()) return;

    try {
      const newPage = await DashboardService.createPage(dashboard.id, pageName);
      if (!dashboard.pages) dashboard.pages = [];
      dashboard.pages = [...dashboard.pages, newPage];
      setModalVisible(false);
      setPageName('');
      window.dispatchEvent(new Event('pagesUpdated'));
      message.success('Page created successfully');
    } catch (error) {
      console.error('Failed to create page:', error);
      message.error('Failed to create page');
    }
  };

  // const createPage = async () => {
  //   if (!pageName.trim()) return;
  
  //   try {
  //     // 1. This correctly calls your API service to create the page.
  //     await DashboardService.createPage(dashboard.id, pageName);
  
  //     // 2. This is the crucial new line. It notifies other components
  //     //    (like PreviewPage) that they need to refresh their data.
  //     window.dispatchEvent(new Event('pagesUpdated'));
  
  //     // 3. The rest of your logic for closing the modal and showing
  //     //    a success message is perfect.
  //     setModalVisible(false);
  //     setPageName('');
  //     message.success('Page created successfully');
      
  //   } catch (error) {
  //     console.error('Failed to create page:', error);
  //     message.error('Failed to create page');
  //   }
  // };

  const deletePage = async (pageId) => {
    try {
      await DashboardService.deletePage(dashboard.id, pageId);
      dashboard.pages = dashboard.pages.filter(p => p.id !== pageId);
      if (currentPage?.id === pageId) {
        setCurrentPage(null);
      }
      message.success('Page deleted successfully');
    } catch (error) {
      console.error('Failed to delete page:', error);
      message.error('Failed to delete page');
    }
  };

  const saveLayout = async (layout) => {
    try {
      await DashboardService.saveLayout(currentPage.id, layout);
      currentPage.layout = layout;
      message.success('Layout saved successfully');
    } catch (error) {
      console.error('Failed to save layout:', error);
      message.error('Failed to save layout');
    }
  };

  const savePageConfig = async () => {
    if (!pageToConfigure) return;
   
    try {
      await DashboardService.savePageConfig(pageToConfigure.id, pageConfig);
      const pageIndex = dashboard.pages.findIndex(p => p.id === pageToConfigure.id);
    if (pageIndex > -1) {
      dashboard.pages[pageIndex].config = pageConfig;
    }

    setCurrentPage(pageToConfigure);

    setPageConfigModalVisible(false);
    setPageToConfigure(null); // Clean up the temporary state
    message.success('Page configuration saved successfully');
   
      // currentPage.config = pageConfig;
      // setPageConfigModalVisible(false);
      // message.success('Page configuration saved successfully');
 
    } catch (error) {
      console.error('Failed to save page config:', error);
      message.error('Failed to save page config');
    }
  };

  const handlePreview = (page) => {
    const previewUrl = `/preview/${dashboard.id}/${page.id}`;
    // window.open(previewUrl, '_blank');
    navigate(previewUrl); 
  };

  const handleThumbnailUpload = (info) => {
    if (info.file.status === 'done') {
      setPageConfig({
        ...pageConfig,
        thumbnail: info.file.response.url
      });
      message.success('Thumbnail uploaded successfully');
    }
  };

  const openPageSettings = (page) => {
    // setCurrentPage(page);
    setPageToConfigure(page);
    setPageConfig(page.config || {
      route: '',
      title: page.name,
      description: '',
      thumbnail: null
    });
    setPageConfigModalVisible(true);
  };

  return (
    <div className="page-manager">
      {!currentPage ? (
        <Card
          bordered={false}
          style={{
            width: '100%',
            minHeight: 'calc(100vh - 48px)',
            boxShadow: 'none',
          }}
          bodyStyle={{ padding: screens.md ? '24px' : '16px' }}
          title={
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                size={screens.md ? 'middle' : 'small'}
              />
              <Title level={4} style={{ margin: 0 }}>{dashboard.name} Pages</Title>
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              size={screens.md ? 'middle' : 'small'}
            >
              New Page
            </Button>
          }
        >
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={dashboard.pages || []}
            renderItem={(page) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    page.config?.thumbnail ? (
                      <Image
                        src={page.config.thumbnail}
                        height={160}
                        preview={false}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        height: 160,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f2f5'
                      }}>
                        <FileOutlined style={{ fontSize: 48, color: '#999' }} />
                      </div>
                    )
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<SettingOutlined />}
                      onClick={() => openPageSettings(page)}
                      title="Settings"
                    />,
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => setCurrentPage(page)}
                      title="Edit"
                    />,
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handlePreview(page)}
                      title="Preview"
                    />,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deletePage(page.id)}
                      title="Delete"
                    />,
                  ]}
                >
                  <Card.Meta
                    title={page.name}
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary" ellipsis>
                          {page.config?.route || 'No route configured'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Last updated: {new Date(page.updatedAt || page.createdAt).toLocaleDateString()}
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
        <WidgetLayoutEditor
          initialLayout={currentPage.layout || { widgets: [], gridConfig: { cols: 12, rowHeight: 30 } }}
          onSave={saveLayout}
          onBack={() => setCurrentPage(null)}
          page={currentPage}
          onConfigOpen={() => {
            setPageConfig(currentPage.config || {
              route: '',
              title: currentPage.name,
              description: '',
              thumbnail: null
            });
            setPageConfigModalVisible(true);
          }}
        />
      )}

      {/* Create Page Modal */}
      <Modal
        title="Create New Page"
        visible={modalVisible}
        onOk={createPage}
        onCancel={() => setModalVisible(false)}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ disabled: !pageName.trim() }}
      >
        <Form layout="vertical">
          <Form.Item label="Page Name" required>
            <Input
              placeholder="Enter page name"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              size="large"
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Page Configuration Modal */}
      <Modal
        title="Page Configuration"
        visible={pageConfigModalVisible}
        onOk={savePageConfig}
        onCancel={() => setPageConfigModalVisible(false)}
        width={600}
        okText="Save"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Route Path">
            <Input
              value={pageConfig.route}
              onChange={(e) => setPageConfig({ ...pageConfig, route: e.target.value })}
              placeholder="/dashboard/sales"
              addonBefore={window.location.origin}
            />
          </Form.Item>
          <Form.Item label="Page Title">
            <Input
              value={pageConfig.title}
              onChange={(e) => setPageConfig({ ...pageConfig, title: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Meta Description">
            <Input.TextArea
              value={pageConfig.description}
              onChange={(e) => setPageConfig({ ...pageConfig, description: e.target.value })}
              rows={3}
            />
          </Form.Item>
          <Form.Item label="Thumbnail Image">
            <Upload
              action="/api/upload"
              onChange={handleThumbnailUpload}
              accept="image/*"
              showUploadList={false}
            >
              {pageConfig.thumbnail ? (
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src={pageConfig.thumbnail}
                    width={200}
                    height={150}
                    style={{ objectFit: 'cover', marginBottom: 8 }}
                  />
                  <Button>Change Thumbnail</Button>
                </div>
              ) : (
                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PageManager;