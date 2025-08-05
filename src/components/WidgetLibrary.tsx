/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { 
  DatabaseOutlined, PlusOutlined, BarChartOutlined,
  TableOutlined, UnorderedListOutlined, PictureOutlined,
  FormOutlined, CalendarOutlined
} from "@ant-design/icons";
import { 
  Button, Card, Divider, Dropdown, Menu, Space, Typography,
  Modal, Form, Input, Select, InputNumber, Switch, Tabs, 
  ColorPicker, Radio, message
} from "antd";
import { useState } from "react";
import { WIDGET_CATEGORIES } from "../constants/widgetCategories";
import { WIDGET_TYPES } from "../constants/widgetTypes";

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const WIDGET_TEMPLATES = {
  chart: {
    name: "Custom Chart",
    icon: BarChartOutlined,
    category: "charts",
    defaultConfig: {
      title: "Custom Chart",
      chartType: "bar",
      dataSource: "",
      xAxis: "",
      yAxis: "",
      color: "#1890ff"
    }
  },
  table: {
    name: "Custom Table",
    icon: TableOutlined,
    category: "data",
    defaultConfig: {
      title: "Custom Table",
      dataSource: "",
      columns: [],
      pageSize: 10,
      sortable: true
    }
  },
  list: {
    name: "Custom List",
    icon: UnorderedListOutlined,
    category: "data",
    defaultConfig: {
      title: "Custom List",
      dataSource: "",
      itemLayout: "horizontal",
      renderItem: ""
    }
  },
  image: {
    name: "Custom Image",
    icon: PictureOutlined,
    category: "media",
    defaultConfig: {
      title: "Custom Image",
      imageUrl: "",
      altText: "Image",
      fit: "cover"
    }
  },
  form: {
    name: "Custom Form",
    icon: FormOutlined,
    category: "input",
    defaultConfig: {
      title: "Custom Form",
      fields: [],
      submitText: "Submit"
    }
  },
  button: {
    name: "Custom Button",
    icon: FormOutlined,
    category: "ui",
    defaultConfig: {
      text: "Button",
      type: "primary",
      size: "middle",
      action: ""
    }
  },
  calendar: {
    name: "Custom Calendar",
    icon: CalendarOutlined,
    category: "productivity",
    defaultConfig: {
      title: "Calendar",
      viewMode: "month",
      showWeekends: true
    }
  }
};

const WidgetLibrary = ({ onDragStart, onAddCustomWidget }) => {
  const [selectedCategory, setSelectedCategory] = useState('data');
  const [customWidgetModalVisible, setCustomWidgetModalVisible] = useState(false);
  const [widgetType, setWidgetType] = useState(null);
  const [form] = Form.useForm();

  const handleDragStart = (widget) => {
    onDragStart(widget);
  };

  const handleAddCustomWidget = () => {
    setCustomWidgetModalVisible(true);
  };

  const handleWidgetTypeSelect = (type) => {
    setWidgetType(type);
    form.setFieldsValue(WIDGET_TEMPLATES[type].defaultConfig);
  };

  const handleCreateWidget = () => {
    form.validateFields().then(values => {
      const newWidget = {
        id: `custom-${Date.now()}`,
        name: values.name || `Custom ${widgetType}`,
        icon: WIDGET_TEMPLATES[widgetType].icon,
        category: WIDGET_TEMPLATES[widgetType].category,
        defaultConfig: {
          ...WIDGET_TEMPLATES[widgetType].defaultConfig,
          ...values
        },
        defaultSize: { width: 400, height: 300 }
      };

      // Add to widget types
      WIDGET_TYPES[newWidget.id] = newWidget;
      
      // Trigger drag start with new widget
      handleDragStart(newWidget);
      
      message.success('Custom widget created successfully!');
      setCustomWidgetModalVisible(false);
      form.resetFields();
    });
  };

  const renderWidgetConfigForm = () => {
    if (!widgetType) return null;

    const commonFields = (
      <>
        <Form.Item label="Widget Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Enter widget name" />
        </Form.Item>
        <Form.Item label="Width" name={['defaultSize', 'width']} initialValue={400}>
          <InputNumber min={200} max={1000} />
        </Form.Item>
        <Form.Item label="Height" name={['defaultSize', 'height']} initialValue={300}>
          <InputNumber min={150} max={800} />
        </Form.Item>
      </>
    );

    switch (widgetType) {
      case 'chart':
        return (
          <>
            {commonFields}
            <Form.Item label="Chart Type" name="chartType" rules={[{ required: true }]}>
              <Select>
                <Option value="bar">Bar Chart</Option>
                <Option value="line">Line Chart</Option>
                <Option value="pie">Pie Chart</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Data Source" name="dataSource">
              <Input placeholder="Enter data source" />
            </Form.Item>
            <Form.Item label="X Axis Field" name="xAxis">
              <Input placeholder="Enter x-axis field" />
            </Form.Item>
            <Form.Item label="Y Axis Field" name="yAxis">
              <Input placeholder="Enter y-axis field" />
            </Form.Item>
            <Form.Item label="Color" name="color">
              <ColorPicker />
            </Form.Item>
          </>
        );
      case 'table':
        return (
          <>
            {commonFields}
            <Form.Item label="Data Source" name="dataSource">
              <Input placeholder="Enter data source" />
            </Form.Item>
            <Form.Item label="Columns" name="columns">
              <Select mode="tags" placeholder="Add columns (comma separated)" />
            </Form.Item>
            <Form.Item label="Page Size" name="pageSize">
              <InputNumber min={5} max={100} />
            </Form.Item>
            <Form.Item label="Sortable" name="sortable" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        );
      case 'button':
        return (
          <>
            {commonFields}
            <Form.Item label="Button Text" name="text" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Button Type" name="type">
              <Select>
                <Option value="primary">Primary</Option>
                <Option value="default">Default</Option>
                <Option value="dashed">Dashed</Option>
                <Option value="text">Text</Option>
                <Option value="link">Link</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Action" name="action">
              <Input placeholder="Enter action (e.g., URL or function)" />
            </Form.Item>
          </>
        );
      default:
        return commonFields;
    }
  };

  const filteredWidgets = Object.entries(WIDGET_TYPES).filter(
    ([id, widget]) => widget.category === selectedCategory
  );

  const menu = (
    <Menu>
      {Object.entries(WIDGET_CATEGORIES).map(([key, category]) => (
        <Menu.Item
          key={key}
          onClick={() => setSelectedCategory(key)}
          icon={<category.icon />}
        >
          {category.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <Card
        title={
          <Space>
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button type="text" icon={<DatabaseOutlined />} />
            </Dropdown>
            <span>Widget Library</span>
          </Space>
        }
        bordered={false}
        className="w-80 h-full overflow-y-auto"
        bodyStyle={{ padding: 0 }}
        extra={
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={handleAddCustomWidget}
            title="Add Custom Widget"
          />
        }
      >
        <div className="p-4 overflow-y-auto" style={{ height: '80vh' }}>
          {Object.entries(WIDGET_CATEGORIES).map(([key, category]) => (
            <div key={key}>
              <Divider orientation="left" orientationMargin={0}>
                <Space>
                  <category.icon />
                  <Text strong>{category.name}</Text>
                </Space>
              </Divider>
              <div className="space-y-2 mb-4">
                {Object.entries(WIDGET_TYPES)
                  .filter(([id, widget]) => widget.category === key)
                  .map(([id, widget]) => (
                    <Card
                      key={id}
                      hoverable
                      draggable
                      onDragStart={() => handleDragStart({ id, ...widget })}
                      className="cursor-move"
                      style={{
                        width: '100%',
                        marginBottom: 8,
                        borderRadius: "0%"
                      }}
                      size="small"
                    >
                      <Card.Meta
                        avatar={<widget.icon />}
                        title={widget.name}
                        description={widget.description}
                      />
                      <div style={{ marginTop: 8, textAlign: 'right' }}>
                        <Button
                          type="text"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDragStart({ id, ...widget });
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        title="Create Custom Widget"
        width={800}
        visible={customWidgetModalVisible}
        onCancel={() => {
          setCustomWidgetModalVisible(false);
          setWidgetType(null);
          form.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => setCustomWidgetModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleCreateWidget}
            disabled={!widgetType}
          >
            Create Widget
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Select Type" key="1">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {Object.entries(WIDGET_TEMPLATES).map(([key, template]) => (
                <Card
                  key={key}
                  hoverable
                  onClick={() => handleWidgetTypeSelect(key)}
                  style={{
                    border: widgetType === key ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    textAlign: 'center'
                  }}
                >
                  <template.icon style={{ fontSize: '32px', marginBottom: '8px' }} />
                  <div>{template.name}</div>
                </Card>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Configure" key="2" disabled={!widgetType}>
            <Form
              form={form}
              layout="vertical"
              initialValues={widgetType ? WIDGET_TEMPLATES[widgetType].defaultConfig : {}}
            >
              {renderWidgetConfigForm()}
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export default WidgetLibrary;