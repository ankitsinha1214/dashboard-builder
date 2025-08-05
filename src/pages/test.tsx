/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
    AppstoreOutlined,
    ArrowLeftOutlined,
    BarChartOutlined,
    CalendarOutlined,
    CloseOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    DeleteOutlined,
    DragOutlined,
    EditOutlined,
    EyeOutlined,
    FileOutlined,
    FileTextOutlined,
    FormOutlined,
    LineChartOutlined,
    PictureOutlined,
    PlusOutlined,
    SaveOutlined,
    SettingOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {
    Image as AntImage,
    Button,
    Card,
    Checkbox,
    Col,
    ColorPicker,
    DatePicker,
    Divider,
    Drawer,
    Dropdown,
    Empty,
    Form,
    Input,
    InputNumber,
    Layout,
    List,
    Menu,
    Modal,
    Radio,
    Row,
    Select,
    Slider,
    Space,
    Switch,
    Table,
    Tag,
    TimePicker,
    Typography,
    Upload,
    message
} from 'antd';
import { useEffect, useRef, useState } from 'react';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Content } = Layout;

// Mock data for different widget types
const mockData = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2024-02-10' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Moderator', status: 'Inactive', joinDate: '2024-01-20' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', joinDate: '2024-03-05' },
    ],
    products: [
        { id: 1, name: 'Laptop Pro', price: 1299, category: 'Electronics', stock: 25, rating: 4.5 },
        { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories', stock: 150, rating: 4.2 },
        { id: 3, name: 'Gaming Keyboard', price: 89.99, category: 'Accessories', stock: 75, rating: 4.8 },
        { id: 4, name: 'Monitor 4K', price: 399.99, category: 'Electronics', stock: 12, rating: 4.6 },
    ],
    orders: [
        { id: 1001, customer: 'John Doe', total: 1299, status: 'Delivered', date: '2024-07-10' },
        { id: 1002, customer: 'Jane Smith', total: 89.99, status: 'Processing', date: '2024-07-12' },
        { id: 1003, customer: 'Bob Wilson', total: 429.98, status: 'Shipped', date: '2024-07-11' },
        { id: 1004, customer: 'Alice Brown', total: 29.99, status: 'Pending', date: '2024-07-13' },
    ],
    analytics: [
        { month: 'Jan', sales: 4000, users: 2400, revenue: 48000 },
        { month: 'Feb', sales: 3000, users: 1398, revenue: 42000 },
        { month: 'Mar', sales: 2000, users: 9800, revenue: 35000 },
        { month: 'Apr', sales: 2780, users: 3908, revenue: 52000 },
        { month: 'May', sales: 1890, users: 4800, revenue: 38000 },
        { month: 'Jun', sales: 2390, users: 3800, revenue: 45000 },
    ]
};

// Widget type definitions
const WIDGET_TYPES = {
    'data-table': {
        name: 'Data Table',
        icon: DatabaseOutlined,
        description: 'Display tabular data',
        category: 'data',
        defaultConfig: {
            title: 'Data Table',
            fontSize: 14,
            dataSource: '',
            showHeader: true,
            showBorder: true,
            striped: true,
            columns: ['id', 'name', 'email', 'role'],
            sortable: true,
            searchable: false,
            pageSize: 10
        },
        defaultSize: { width: 400, height: 300 }
    },
    'chart-bar': {
        name: 'Bar Chart',
        icon: BarChartOutlined,
        description: 'Display bar chart visualization',
        category: 'charts',
        defaultConfig: {
            title: 'Bar Chart',
            fontSize: 14,
            dataSource: '',
            xAxis: 'month',
            yAxis: 'sales',
            color: '#3b82f6',
            showGrid: true,
            showLegend: true
        },
        defaultSize: { width: 400, height: 300 }
    },
    'metric-card': {
        name: 'Metric Card',
        icon: LineChartOutlined,
        description: 'Display key metrics',
        category: 'metrics',
        defaultConfig: {
            title: 'Metric Card',
            fontSize: 14,
            metric: 'Total Users',
            value: '1,234',
            change: '+12%',
            changeType: 'positive',
            showIcon: true,
            backgroundColor: '#ffffff',
            textColor: '#1f2937'
        },
        defaultSize: { width: 250, height: 150 }
    },
    'text-widget': {
        name: 'Text Widget',
        icon: FileTextOutlined,
        description: 'Display formatted text content',
        category: 'content',
        defaultConfig: {
            title: 'Text Widget',
            fontSize: 14,
            content: 'Enter your text here...',
            textAlign: 'left',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            padding: 16
        },
        defaultSize: { width: 300, height: 200 }
    },
    'image-widget': {
        name: 'Image Widget',
        icon: PictureOutlined,
        description: 'Display images',
        category: 'media',
        defaultConfig: {
            title: 'Image Widget',
            fontSize: 14,
            imageUrl: '',
            alt: 'Image',
            fit: 'cover',
            showTitle: true
        },
        defaultSize: { width: 300, height: 200 }
    },
    'calendar-widget': {
        name: 'Calendar',
        icon: CalendarOutlined,
        description: 'Display calendar view',
        category: 'productivity',
        defaultConfig: {
            title: 'Calendar',
            fontSize: 14,
            view: 'month',
            showWeekends: true,
            highlightToday: true
        },
        defaultSize: { width: 400, height: 350 }
    },
    'form-widget': {
        name: 'Form Widget',
        icon: FormOutlined,
        description: 'Collect user input with validation',
        category: 'content',
        defaultConfig: {
            title: 'Form Widget',
            fontSize: 14,
            fields: [
                {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    placeholder: 'Enter your name',
                    required: true,
                    rules: [{ required: true, message: 'Please input your name!' }]
                },
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Enter your email',
                    required: true,
                    rules: [
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]
                }
            ],
            submitText: 'Submit',
            resetText: 'Reset',
            layout: 'vertical',
            showSubmit: true,
            showReset: true,
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            padding: 16
        },
        defaultSize: { width: 350, height: 400 }
    }
};

// Widget categories for organization
const WIDGET_CATEGORIES = {
    data: { name: 'Data', icon: DatabaseOutlined },
    charts: { name: 'Charts', icon: BarChartOutlined },
    metrics: { name: 'Metrics', icon: LineChartOutlined },
    content: { name: 'Content', icon: FileTextOutlined },
    media: { name: 'Media', icon: PictureOutlined },
    productivity: { name: 'Productivity', icon: CalendarOutlined }
};

// Dashboard Service
class DashboardService {
    static async fetchDashboards() {
        const response = await fetch('/api/dashboards');
        return response.json();
    }

    static async createDashboard(name: string) {
        const response = await fetch('/api/dashboards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
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
        return response.json(); // Return the saved layout
    }

}

// Base Widget Component
const BaseWidget = ({
    config,
    position,
    size,
    onConfigChange,
    onPositionChange,
    onSizeChange,
    onDelete,
    isSelected,
    onSelect,
    onSettingsClick,
    children
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const widgetRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.target.closest('.resize-handle') || e.target.closest('.widget-controls')) return;

        e.stopPropagation();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        onSelect();
    };

    const handleResizeStart = (e) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                onPositionChange({
                    x: Math.max(0, e.clientX - dragOffset.x),
                    y: Math.max(0, e.clientY - dragOffset.y)
                });
            } else if (isResizing) {
                const newWidth = Math.max(200, resizeStart.width + (e.clientX - resizeStart.x));
                const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y));
                onSizeChange({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, resizeStart, onPositionChange, onSizeChange]);

    return (
        <div
            ref={widgetRef}
            className={`absolute bg-white rounded-lg shadow-lg border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200'
                } ${isDragging ? 'cursor-move' : ''}`}
            style={{
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                fontSize: `${config.fontSize}px`
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg border-b">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{config.title}</h3>
                </div>
                <div className="flex items-center gap-1 widget-controls">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSettingsClick();
                        }}
                        type="text"
                        icon={<SettingOutlined />}
                        title="Configure widget"
                    />
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        type="text"
                        icon={<DeleteOutlined />}
                        title="Delete widget"
                    />
                    <Button
                        type="text"
                        icon={<DragOutlined />}
                        className="cursor-move"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
                {children}
            </div>

            {/* Resize Handle */}
            <div
                className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-tl-lg opacity-75 hover:opacity-100 resize-handle"
                onMouseDown={handleResizeStart}
            />
        </div>
    );
};


// Data Table Widget
const DataTableWidget = (props) => {
    const { config } = props;
    const data = config.dataSource ? mockData[config.dataSource] || [] : [];
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (field) => {
        if (!config.sortable) return;

        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortField) return 0;

        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'string') {
            return sortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const columns = config.columns.map(col => ({
        title: col.charAt(0).toUpperCase() + col.slice(1),
        dataIndex: col,
        key: col,
        sorter: config.sortable ? (a, b) => {
            const aVal = a[col];
            const bVal = b[col];
            return typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
        } : false,
        sortOrder: sortField === col && (sortDirection === 'asc' ? 'ascend' : 'descend'),
        onHeaderCell: () => ({
            onClick: () => handleSort(col),
        }),
    }));

    return (
        <BaseWidget {...props}>
            <div className="p-3">
                {data.length > 0 ? (
                    <Table
                        dataSource={sortedData}
                        columns={columns}
                        size="small"
                        pagination={false}
                        bordered={config.showBorder}
                        rowClassName={(_, index) => config.striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                    />
                ) : (
                    <Empty description="No data source selected" />
                )}
            </div>
        </BaseWidget>
    );
};

// Bar Chart Widget
const BarChartWidget = (props) => {
    const { config } = props;
    const data = config.dataSource ? mockData[config.dataSource] || [] : [];

    const maxValue = Math.max(...data.map(item => item[config.yAxis] || 0));

    return (
        <BaseWidget {...props}>
            <div className="p-3">
                {data.length > 0 ? (
                    <div className="space-y-2">
                        {data.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-16 text-sm text-gray-600 text-right">
                                    {item[config.xAxis]}
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                    <div
                                        className="rounded-full h-6 flex items-center justify-end pr-2 text-white text-xs font-medium"
                                        style={{
                                            width: `${(item[config.yAxis] / maxValue) * 100}%`,
                                            backgroundColor: config.color
                                        }}
                                    >
                                        {item[config.yAxis]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="No data source selected" />
                )}
            </div>
        </BaseWidget>
    );
};

// Metric Card Widget
const MetricCardWidget = (props) => {
    const { config } = props;

    return (
        <BaseWidget {...props}>
            <Card
                style={{
                    backgroundColor: config.backgroundColor,
                    color: config.textColor,
                    height: '100%'
                }}
                bodyStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                }}
            >
                <div className="text-2xl font-bold mb-1">{config.value}</div>
                <div className="text-sm opacity-75 mb-2">{config.metric}</div>
                <Tag color={config.changeType === 'positive' ? 'success' : 'error'}>
                    {config.change}
                </Tag>
            </Card>
        </BaseWidget>
    );
};

// Text Widget
const TextWidget = (props) => {
    const { config } = props;

    return (
        <BaseWidget {...props}>
            <div
                className="h-full"
                style={{
                    backgroundColor: config.backgroundColor,
                    color: config.textColor,
                    padding: config.padding,
                    textAlign: config.textAlign
                }}
            >
                <div className="whitespace-pre-wrap">{config.content}</div>
            </div>
        </BaseWidget>
    );
};

// Image Widget
const ImageWidget = (props) => {
    const { config } = props;

    return (
        <BaseWidget {...props}>
            <div className="p-3 h-full">
                {config.imageUrl ? (
                    <AntImage
                        src={config.imageUrl}
                        alt={config.alt}
                        className="w-full h-full object-cover rounded"
                        style={{ objectFit: config.fit }}
                    />
                ) : (
                    <Empty
                        image={<PictureOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                        description="No image selected"
                    />
                )}
            </div>
        </BaseWidget>
    );
};

// Calendar Widget
const CalendarWidget = (props) => {
    const { config } = props;
    const today = new Date();

    return (
        <BaseWidget {...props}>
            <div className="p-3">
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-semibold text-gray-600 p-2">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                        const date = new Date(today.getFullYear(), today.getMonth(), i - 6);
                        const isToday = date.toDateString() === today.toDateString();
                        const isCurrentMonth = date.getMonth() === today.getMonth();

                        return (
                            <div
                                key={i}
                                className={`p-2 rounded ${isToday && config.highlightToday
                                    ? 'bg-blue-500 text-white'
                                    : isCurrentMonth
                                        ? 'text-gray-800 hover:bg-gray-100'
                                        : 'text-gray-400'
                                    }`}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </BaseWidget>
    );
};

// Form Widget
const FormWidget = (props) => {
    const { config } = props;
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Form values:', values);
        message.success('Form submitted successfully!');
    };

    const onReset = () => {
        form.resetFields();
    };

    const renderFormField = (field) => {
        const commonProps = {
            placeholder: field.placeholder,
            disabled: field.disabled,
            style: { width: '100%' }
        };

        switch (field.type) {
            case 'text':
                return <Input {...commonProps} />;
            case 'email':
                return <Input type="email" {...commonProps} />;
            case 'password':
                return <Input.Password {...commonProps} />;
            case 'number':
                return <InputNumber {...commonProps} style={{ width: '100%' }} />;
            case 'textarea':
                return <TextArea {...commonProps} rows={field.rows || 3} />;
            case 'select':
                return (
                    <Select {...commonProps}>
                        {field.options?.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            case 'checkbox':
                return <Checkbox {...commonProps}>{field.label}</Checkbox>;
            case 'switch':
                return <Switch {...commonProps} />;
            case 'radio':
                return (
                    <Radio.Group {...commonProps}>
                        {field.options?.map(option => (
                            <Radio key={option.value} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            case 'date':
                return <DatePicker {...commonProps} style={{ width: '100%' }} />;
            case 'time':
                return <TimePicker {...commonProps} style={{ width: '100%' }} />;
            case 'date-range':
                return <RangePicker {...commonProps} style={{ width: '100%' }} />;
            case 'upload':
                return (
                    <Upload {...commonProps}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                );
            default:
                return <Input {...commonProps} />;
        }
    };

    return (
        <BaseWidget {...props}>
            <div
                className="h-full"
                style={{
                    backgroundColor: config.backgroundColor,
                    color: config.textColor,
                    padding: config.padding,
                    overflow: 'auto'
                }}
            >
                <Form
                    form={form}
                    layout={config.layout}
                    onFinish={onFinish}
                    style={{ height: '100%' }}
                >
                    <div style={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
                        {config.fields.map((field, index) => (
                            <Form.Item
                                key={field.name || index}
                                label={field.label}
                                name={field.name}
                                rules={field.rules}
                                valuePropName={field.type === 'switch' || field.type === 'checkbox' ? 'checked' : 'value'}
                            >
                                {renderFormField(field)}
                            </Form.Item>
                        ))}
                    </div>

                    <div style={{ paddingTop: 16, textAlign: 'right' }}>
                        {config.showReset && (
                            <Button htmlType="button" onClick={onReset} style={{ marginRight: 8 }}>
                                {config.resetText}
                            </Button>
                        )}
                        {config.showSubmit && (
                            <Button type="primary" htmlType="submit">
                                {config.submitText}
                            </Button>
                        )}
                    </div>
                </Form>
            </div>
        </BaseWidget>
    );
};

// Widget Factory
const createWidget = (type, props) => {
    switch (type) {
        case 'data-table':
            return <DataTableWidget {...props} />;
        case 'chart-bar':
            return <BarChartWidget {...props} />;
        case 'metric-card':
            return <MetricCardWidget {...props} />;
        case 'text-widget':
            return <TextWidget {...props} />;
        case 'image-widget':
            return <ImageWidget {...props} />;
        case 'calendar-widget':
            return <CalendarWidget {...props} />;
        case 'form-widget':
            return <FormWidget {...props} />;
        default:
            return <div>Unknown widget type</div>;
    }
};

// Configuration Panel
const ConfigPanel = ({ config, widgetType, onConfigChange, onCancel }) => {
    const [tempConfig, setTempConfig] = useState(config);
    const [form] = Form.useForm();

    useEffect(() => {
        setTempConfig(config);
        form.setFieldsValue(config);
    }, [config, form]);

    const handleChange = (key, value) => {
        const newConfig = { ...tempConfig, [key]: value };
        setTempConfig(newConfig);
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = [...tempConfig.fields];
        newFields[index] = { ...newFields[index], [key]: value };
        handleChange('fields', newFields);
    };

    const handleAddField = () => {
        const newField = {
            name: `field_${tempConfig.fields.length + 1}`,
            label: `Field ${tempConfig.fields.length + 1}`,
            type: 'text',
            placeholder: '',
            required: false,
            rules: []
        };
        handleChange('fields', [...tempConfig.fields, newField]);
    };

    const handleRemoveField = (index) => {
        const newFields = [...tempConfig.fields];
        newFields.splice(index, 1);
        handleChange('fields', newFields);
    };

    const handleAddRule = (fieldIndex) => {
        const newFields = [...tempConfig.fields];
        newFields[fieldIndex].rules = [...(newFields[fieldIndex].rules || []), { required: false, message: '' }];
        handleChange('fields', newFields);
    };

    const handleRemoveRule = (fieldIndex, ruleIndex) => {
        const newFields = [...tempConfig.fields];
        newFields[fieldIndex].rules.splice(ruleIndex, 1);
        handleChange('fields', newFields);
    };

    const handleRuleChange = (fieldIndex, ruleIndex, key, value) => {
        const newFields = [...tempConfig.fields];
        newFields[fieldIndex].rules[ruleIndex] = {
            ...newFields[fieldIndex].rules[ruleIndex],
            [key]: value
        };
        handleChange('fields', newFields);
    };

    const handleUpdate = () => {
        onConfigChange(tempConfig);
    };

    const handleCancel = () => {
        setTempConfig(config);
        onCancel();
    };

    const renderConfigFields = () => {
        const commonFields = (
            <>
                <Form.Item label="Title">
                    <Input
                        value={tempConfig.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Font Size">
                    <Slider
                        min={12}
                        max={24}
                        value={tempConfig.fontSize}
                        onChange={(value) => handleChange('fontSize', value)}
                    />
                </Form.Item>
            </>
        );

        switch (widgetType) {
            case 'data-table':
                return (
                    <>
                        {commonFields}
                        <Form.Item label="Data Source">
                            <Select
                                value={tempConfig.dataSource}
                                onChange={(value) => handleChange('dataSource', value)}
                            >
                                <Option value="">Select data source</Option>
                                <Option value="users">Users</Option>
                                <Option value="products">Products</Option>
                                <Option value="orders">Orders</Option>
                            </Select>
                        </Form.Item>

                        {tempConfig.dataSource && (
                            <Form.Item label="Columns">
                                <Checkbox.Group
                                    value={tempConfig.columns}
                                    onChange={(values) => handleChange('columns', values)}
                                >
                                    <Row gutter={[16, 8]}>
                                        {Object.keys(mockData[tempConfig.dataSource]?.[0] || {}).map(col => (
                                            <Col span={8} key={col}>
                                                <Checkbox value={col}>
                                                    {col.charAt(0).toUpperCase() + col.slice(1)}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        )}

                        <Form.Item label="Options">
                            <Space direction="vertical">
                                <Checkbox
                                    checked={tempConfig.showHeader}
                                    onChange={(e) => handleChange('showHeader', e.target.checked)}
                                >
                                    Show Header
                                </Checkbox>
                                <Checkbox
                                    checked={tempConfig.showBorder}
                                    onChange={(e) => handleChange('showBorder', e.target.checked)}
                                >
                                    Show Borders
                                </Checkbox>
                                <Checkbox
                                    checked={tempConfig.striped}
                                    onChange={(e) => handleChange('striped', e.target.checked)}
                                >
                                    Striped Rows
                                </Checkbox>
                                <Checkbox
                                    checked={tempConfig.sortable}
                                    onChange={(e) => handleChange('sortable', e.target.checked)}
                                >
                                    Sortable
                                </Checkbox>
                            </Space>
                        </Form.Item>
                    </>
                );

            case 'chart-bar':
                return (
                    <>
                        {commonFields}
                        <Form.Item label="Data Source">
                            <Select
                                value={tempConfig.dataSource}
                                onChange={(value) => handleChange('dataSource', value)}
                            >
                                <Option value="">Select data source</Option>
                                <Option value="analytics">Analytics</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="X Axis">
                            <Select
                                value={tempConfig.xAxis}
                                onChange={(value) => handleChange('xAxis', value)}
                            >
                                <Option value="month">Month</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Y Axis">
                            <Select
                                value={tempConfig.yAxis}
                                onChange={(value) => handleChange('yAxis', value)}
                            >
                                <Option value="sales">Sales</Option>
                                <Option value="users">Users</Option>
                                <Option value="revenue">Revenue</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Color">
                            <ColorPicker
                                value={tempConfig.color}
                                onChange={(_, hex) => handleChange('color', hex)}
                            />
                        </Form.Item>
                    </>
                );

            case 'metric-card':
                return (
                    <>
                        {commonFields}
                        <Form.Item label="Metric Name">
                            <Input
                                value={tempConfig.metric}
                                onChange={(e) => handleChange('metric', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Value">
                            <Input
                                value={tempConfig.value}
                                onChange={(e) => handleChange('value', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Change">
                            <Input
                                value={tempConfig.change}
                                onChange={(e) => handleChange('change', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Change Type">
                            <Select
                                value={tempConfig.changeType}
                                onChange={(value) => handleChange('changeType', value)}
                            >
                                <Option value="positive">Positive</Option>
                                <Option value="negative">Negative</Option>
                            </Select>
                        </Form.Item>
                    </>
                );

            case 'text-widget':
                return (
                    <>
                        {commonFields}
                        <Form.Item label="Content">
                            <Input.TextArea
                                value={tempConfig.content}
                                onChange={(e) => handleChange('content', e.target.value)}
                                rows={4}
                            />
                        </Form.Item>

                        <Form.Item label="Text Alignment">
                            <Radio.Group
                                value={tempConfig.textAlign}
                                onChange={(e) => handleChange('textAlign', e.target.value)}
                            >
                                <Radio value="left">Left</Radio>
                                <Radio value="center">Center</Radio>
                                <Radio value="right">Right</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Background Color">
                            <ColorPicker
                                value={tempConfig.backgroundColor}
                                onChange={(_, hex) => handleChange('backgroundColor', hex)}
                            />
                        </Form.Item>

                        <Form.Item label="Text Color">
                            <ColorPicker
                                value={tempConfig.textColor}
                                onChange={(_, hex) => handleChange('textColor', hex)}
                            />
                        </Form.Item>
                    </>
                );

            case 'image-widget':
                return (
                    <>
                        {commonFields}
                        <Form.Item label="Image URL">
                            <Input
                                value={tempConfig.imageUrl}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </Form.Item>

                        <Form.Item label="Alt Text">
                            <Input
                                value={tempConfig.alt}
                                onChange={(e) => handleChange('alt', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Image Fit">
                            <Select
                                value={tempConfig.fit}
                                onChange={(value) => handleChange('fit', value)}
                            >
                                <Option value="cover">Cover</Option>
                                <Option value="contain">Contain</Option>
                                <Option value="fill">Fill</Option>
                            </Select>
                        </Form.Item>
                    </>
                );

            case 'calendar-widget':
                return (
                    <>
                        {commonFields}
                        <Form.Item label="View">
                            <Select
                                value={tempConfig.view}
                                onChange={(value) => handleChange('view', value)}
                            >
                                <Option value="month">Month</Option>
                                <Option value="week">Week</Option>
                                <Option value="day">Day</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Options">
                            <Space direction="vertical">
                                <Checkbox
                                    checked={tempConfig.showWeekends}
                                    onChange={(e) => handleChange('showWeekends', e.target.checked)}
                                >
                                    Show Weekends
                                </Checkbox>
                                <Checkbox
                                    checked={tempConfig.highlightToday}
                                    onChange={(e) => handleChange('highlightToday', e.target.checked)}
                                >
                                    Highlight Today
                                </Checkbox>
                            </Space>
                        </Form.Item>
                    </>
                );

            case 'form-widget':
                return (
                    <>
                        {commonFields}
                        <Form.Item label="Form Layout">
                            <Radio.Group
                                value={tempConfig.layout}
                                onChange={(e) => handleChange('layout', e.target.value)}
                            >
                                <Radio value="horizontal">Horizontal</Radio>
                                <Radio value="vertical">Vertical</Radio>
                                <Radio value="inline">Inline</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Submit Button Text">
                            <Input
                                value={tempConfig.submitText}
                                onChange={(e) => handleChange('submitText', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Reset Button Text">
                            <Input
                                value={tempConfig.resetText}
                                onChange={(e) => handleChange('resetText', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item label="Buttons">
                            <Space>
                                <Checkbox
                                    checked={tempConfig.showSubmit}
                                    onChange={(e) => handleChange('showSubmit', e.target.checked)}
                                >
                                    Show Submit
                                </Checkbox>
                                <Checkbox
                                    checked={tempConfig.showReset}
                                    onChange={(e) => handleChange('showReset', e.target.checked)}
                                >
                                    Show Reset
                                </Checkbox>
                            </Space>
                        </Form.Item>

                        <Divider orientation="left">Form Fields</Divider>

                        <div style={{ marginBottom: 16 }}>
                            <Button type="dashed" onClick={handleAddField} block icon={<PlusOutlined />}>
                                Add Field
                            </Button>
                        </div>

                        {tempConfig.fields.map((field, fieldIndex) => (
                            <Card
                                key={fieldIndex}
                                title={`Field ${fieldIndex + 1}`}
                                size="small"
                                style={{ marginBottom: 16 }}
                                extra={
                                    <Button
                                        danger
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveField(fieldIndex)}
                                    />
                                }
                            >
                                <Form layout="vertical">
                                    <Form.Item label="Field Name">
                                        <Input
                                            value={field.name}
                                            onChange={(e) => handleFieldChange(fieldIndex, 'name', e.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Field Label">
                                        <Input
                                            value={field.label}
                                            onChange={(e) => handleFieldChange(fieldIndex, 'label', e.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Field Type">
                                        <Select
                                            value={field.type}
                                            onChange={(value) => handleFieldChange(fieldIndex, 'type', value)}
                                        >
                                            <Option value="text">Text</Option>
                                            <Option value="email">Email</Option>
                                            <Option value="password">Password</Option>
                                            <Option value="number">Number</Option>
                                            <Option value="textarea">Text Area</Option>
                                            <Option value="select">Select</Option>
                                            <Option value="checkbox">Checkbox</Option>
                                            <Option value="switch">Switch</Option>
                                            <Option value="radio">Radio Group</Option>
                                            <Option value="date">Date Picker</Option>
                                            <Option value="time">Time Picker</Option>
                                            <Option value="date-range">Date Range</Option>
                                            <Option value="upload">File Upload</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="Placeholder">
                                        <Input
                                            value={field.placeholder}
                                            onChange={(e) => handleFieldChange(fieldIndex, 'placeholder', e.target.value)}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Required">
                                        <Switch
                                            checked={field.required}
                                            onChange={(checked) => handleFieldChange(fieldIndex, 'required', checked)}
                                        />
                                    </Form.Item>

                                    {field.type === 'select' || field.type === 'radio' ? (
                                        <Form.Item label="Options">
                                            <Button
                                                type="dashed"
                                                onClick={() => {
                                                    const newFields = [...tempConfig.fields];
                                                    newFields[fieldIndex].options = [...(newFields[fieldIndex].options || []), { value: '', label: '' }];
                                                    handleChange('fields', newFields);
                                                }}
                                                block
                                                icon={<PlusOutlined />}
                                            >
                                                Add Option
                                            </Button>
                                            {(field.options || []).map((option, optionIndex) => (
                                                <Space key={optionIndex} style={{ display: 'flex', marginBottom: 8 }}>
                                                    <Input
                                                        placeholder="Value"
                                                        value={option.value}
                                                        onChange={(e) => {
                                                            const newFields = [...tempConfig.fields];
                                                            newFields[fieldIndex].options[optionIndex].value = e.target.value;
                                                            handleChange('fields', newFields);
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="Label"
                                                        value={option.label}
                                                        onChange={(e) => {
                                                            const newFields = [...tempConfig.fields];
                                                            newFields[fieldIndex].options[optionIndex].label = e.target.value;
                                                            handleChange('fields', newFields);
                                                        }}
                                                    />
                                                    <Button
                                                        danger
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            const newFields = [...tempConfig.fields];
                                                            newFields[fieldIndex].options.splice(optionIndex, 1);
                                                            handleChange('fields', newFields);
                                                        }}
                                                    />
                                                </Space>
                                            ))}
                                        </Form.Item>
                                    ) : null}

                                    <Divider orientation="left">Validation Rules</Divider>

                                    <div style={{ marginBottom: 16 }}>
                                        <Button
                                            type="dashed"
                                            onClick={() => handleAddRule(fieldIndex)}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add Validation Rule
                                        </Button>
                                    </div>

                                    {(field.rules || []).map((rule, ruleIndex) => (
                                        <Card
                                            key={ruleIndex}
                                            size="small"
                                            style={{ marginBottom: 16 }}
                                            extra={
                                                <Button
                                                    danger
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleRemoveRule(fieldIndex, ruleIndex)}
                                                />
                                            }
                                        >
                                            <Form layout="vertical">
                                                <Form.Item label="Required">
                                                    <Switch
                                                        checked={rule.required}
                                                        onChange={(checked) => handleRuleChange(fieldIndex, ruleIndex, 'required', checked)}
                                                    />
                                                </Form.Item>

                                                <Form.Item label="Error Message">
                                                    <Input
                                                        value={rule.message}
                                                        onChange={(e) => handleRuleChange(fieldIndex, ruleIndex, 'message', e.target.value)}
                                                    />
                                                </Form.Item>

                                                {field.type === 'email' && (
                                                    <Form.Item label="Email Validation">
                                                        <Switch
                                                            checked={rule.type === 'email'}
                                                            onChange={(checked) => handleRuleChange(
                                                                fieldIndex,
                                                                ruleIndex,
                                                                'type',
                                                                checked ? 'email' : undefined
                                                            )}
                                                        />
                                                    </Form.Item>
                                                )}

                                                {field.type === 'number' && (
                                                    <Form.Item label="Minimum Value">
                                                        <InputNumber
                                                            value={rule.min}
                                                            onChange={(value) => handleRuleChange(fieldIndex, ruleIndex, 'min', value)}
                                                        />
                                                    </Form.Item>
                                                )}

                                                {field.type === 'number' && (
                                                    <Form.Item label="Maximum Value">
                                                        <InputNumber
                                                            value={rule.max}
                                                            onChange={(value) => handleRuleChange(fieldIndex, ruleIndex, 'max', value)}
                                                        />
                                                    </Form.Item>
                                                )}
                                            </Form>
                                        </Card>
                                    ))}
                                </Form>
                            </Card>
                        ))}

                        <Form.Item label="Background Color">
                            <ColorPicker
                                value={tempConfig.backgroundColor}
                                onChange={(_, hex) => handleChange('backgroundColor', hex)}
                            />
                        </Form.Item>

                        <Form.Item label="Text Color">
                            <ColorPicker
                                value={tempConfig.textColor}
                                onChange={(_, hex) => handleChange('textColor', hex)}
                            />
                        </Form.Item>
                    </>
                );

            default:
                return commonFields;
        }
    };

    return (
        <Form form={form} layout="vertical" className="p-4">
            {renderConfigFields()}

            <Divider />

            <Space>
                <Button type="primary" onClick={handleUpdate}>
                    Update
                </Button>
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
            </Space>
        </Form>
    );
};

// Widget Library with Categories
const WidgetLibrary = ({ onDragStart, onAddCustomWidget }) => {
    const [selectedCategory, setSelectedCategory] = useState('data');

    const handleDragStart = (widget) => {
        onDragStart(widget);
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
                    onClick={onAddCustomWidget}
                    title="Add Custom Widget"
                />
            }
        >
            <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 56px)' }}>
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
    );
};

// Dashboard Manager Component
const DashboardManager = () => {
    const [dashboards, setDashboards] = useState([]);
    const [currentDashboard, setCurrentDashboard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [dashboardName, setDashboardName] = useState('');

    const [dashboardConfigModalVisible, setDashboardConfigModalVisible] = useState(false);
    const [dashboardConfig, setDashboardConfig] = useState({
        title: '',
        description: '',
        thumbnail: null
    });

    useEffect(() => {
        fetchDashboards();
    }, []);

    const fetchDashboards = async () => {
        setLoading(true);
        try {
            const data = await DashboardService.fetchDashboards();
            setDashboards(data);
        } finally {
            setLoading(false);
        }
    };

    const handleDashboardConfigSave = async () => {
        try {
            await DashboardService.saveDashboardConfig(currentDashboard.id, dashboardConfig);
            currentDashboard.config = dashboardConfig;
            setDashboardConfigModalVisible(false);
            message.success('Dashboard configuration saved successfully');
        } catch (error) {
            console.error('Failed to save dashboard config:', error);
            message.error('Failed to save dashboard config');
        }
    };

    const handleDashboardThumbnailUpload = (info) => {
        if (info.file.status === 'done') {
            setDashboardConfig({
                ...dashboardConfig,
                thumbnail: info.file.response.url
            });
            message.success('Thumbnail uploaded successfully');
        }
    };


    const createDashboard = async () => {
        if (!dashboardName.trim()) return;

        try {
            const newDashboard = await DashboardService.createDashboard(dashboardName);
            setDashboards([...dashboards, newDashboard]);
            setModalVisible(false);
            setDashboardName('');
        } catch (error) {
            console.error('Failed to create dashboard:', error);
            message.error('Failed to create dashboard');
        }
    };

    const deleteDashboard = async (id) => {
        try {
            await DashboardService.deleteDashboard(id);
            setDashboards(dashboards.filter(d => d.id !== id));
            if (currentDashboard?.id === id) {
                setCurrentDashboard(null);
            }
            message.success('Dashboard deleted successfully');
        } catch (error) {
            console.error('Failed to delete dashboard:', error);
            message.error('Failed to delete dashboard');
        }
    };

    const handlePreview = (dashboard) => {
        const previewUrl = `/preview/dashboard/${dashboard.id}`;
        window.open(previewUrl, '_blank');
    };

    return (
        <div className="dashboard-manager">
            {!currentDashboard ? (
                <Card
                    title={<Title level={4}><DashboardOutlined /> My Dashboards</Title>}
                    extra={
                        <Space>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModalVisible(true)}
                            >
                                New Dashboard
                            </Button>
                        </Space>
                    }
                    className="h-full"
                >
                    <List
                        loading={loading}
                        dataSource={dashboards}
                        renderItem={dashboard => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="text"
                                        icon={<SettingOutlined />}
                                        onClick={() => {
                                            setCurrentDashboard(dashboard);
                                            setDashboardConfig(dashboard.config || {
                                                title: dashboard.name,
                                                description: '',
                                                thumbnail: null
                                            });
                                            setDashboardConfigModalVisible(true);
                                        }}
                                    />,
                                    <Button
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => handlePreview(dashboard)}
                                    />,
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => setCurrentDashboard(dashboard)}
                                    />,
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => deleteDashboard(dashboard.id)}
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        dashboard.config?.thumbnail ? (
                                            <Image
                                                src={dashboard.config.thumbnail}
                                                width={80}
                                                height={60}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <DashboardOutlined style={{ fontSize: 32 }} />
                                        )
                                    }
                                    title={dashboard.name}
                                    description={`Created: ${new Date(dashboard.createdAt).toLocaleDateString()}`}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
            ) : (
                <PageManager
                    dashboard={currentDashboard}
                    onBack={() => setCurrentDashboard(null)}
                />
            )}

            {/* Add Dashboard Config Modal */}
            <Modal
                title="Dashboard Configuration"
                visible={dashboardConfigModalVisible}
                onOk={handleDashboardConfigSave}
                onCancel={() => setDashboardConfigModalVisible(false)}
                width={600}
            >
                <Form layout="vertical">
                    <Form.Item label="Dashboard Title">
                        <Input
                            value={dashboardConfig.title}
                            onChange={(e) => setDashboardConfig({ ...dashboardConfig, title: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea
                            value={dashboardConfig.description}
                            onChange={(e) => setDashboardConfig({ ...dashboardConfig, description: e.target.value })}
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item label="Thumbnail">
                        <Upload
                            action="/api/upload"
                            onChange={handleDashboardThumbnailUpload}
                            showUploadList={false}
                        >
                            {dashboardConfig.thumbnail ? (
                                <div>
                                    <Image
                                        src={dashboardConfig.thumbnail}
                                        width={200}
                                        height={150}
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <Button style={{ marginTop: 8 }}>Change Thumbnail</Button>
                                </div>
                            ) : (
                                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Create New Dashboard"
                visible={modalVisible}
                onOk={createDashboard}
                onCancel={() => setModalVisible(false)}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                        placeholder="Dashboard name"
                        value={dashboardName}
                        onChange={(e) => setDashboardName(e.target.value)}
                        onPressEnter={createDashboard}
                    />
                </Space>
            </Modal>
        </div>
    );
};

// Page Manager Component
// Updated PageManager component
const PageManager = ({ dashboard, onBack }) => {
    const [currentPage, setCurrentPage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pageName, setPageName] = useState('');
    const [pageConfigModalVisible, setPageConfigModalVisible] = useState(false);
    const [pageConfig, setPageConfig] = useState({
        route: '',
        title: '',
        description: '',
        thumbnail: null
    });

    const createPage = async () => {
        if (!pageName.trim()) return;

        try {
            const newPage = await DashboardService.createPage(dashboard.id, pageName);
            if (!dashboard.pages) dashboard.pages = [];
            dashboard.pages = [...dashboard.pages, newPage];
            setModalVisible(false);
            setPageName('');
            message.success('Page created successfully');
        } catch (error) {
            console.error('Failed to create page:', error);
            message.error('Failed to create page');
        }
    };

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
        try {
            await DashboardService.savePageConfig(currentPage.id, pageConfig);
            currentPage.config = pageConfig;
            setPageConfigModalVisible(false);
            message.success('Page configuration saved successfully');
        } catch (error) {
            console.error('Failed to save page config:', error);
            message.error('Failed to save page config');
        }
    };

    const handlePreview = (page) => {
        const previewUrl = `/preview/${dashboard.id}/${page.id}`;
        window.open(previewUrl, '_blank');
    };

    const handleThumbnailUpload = (info) => {
        if (info.file.status === 'done') {
            setPageConfig({
                ...pageConfig,
                thumbnail: info.file.response.url // Assuming your API returns the URL
            });
            message.success('Thumbnail uploaded successfully');
        }
    };

    return (
        <div className="page-manager h-full">
            {!currentPage ? (
                <Card
                    title={
                        <Space>
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={onBack}
                            />
                            <Title level={4} style={{ margin: 0 }}>{dashboard.name} Pages</Title>
                        </Space>
                    }
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setModalVisible(true)}
                        >
                            New Page
                        </Button>
                    }
                    className="h-full"
                >
                    <List
                        dataSource={dashboard.pages || []}
                        renderItem={page => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="text"
                                        icon={<SettingOutlined />}
                                        onClick={() => setPageConfigModalVisible(true)}
                                    />,
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => setCurrentPage(page)}
                                    />,
                                    <Button
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => handlePreview(page)}
                                    />,
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => deletePage(page.id)}
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        page.config?.thumbnail ? (
                                            <Image
                                                src={page.config.thumbnail}
                                                width={64}
                                                height={48}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <FileOutlined style={{ fontSize: 24 }} />
                                        )
                                    }
                                    title={page.name}
                                    description={page.config?.route ? `Route: ${page.config.route}` : 'No route configured'}
                                />
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

            <Modal
                title="Create New Page"
                visible={modalVisible}
                onOk={createPage}
                onCancel={() => setModalVisible(false)}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                        placeholder="Page name"
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        onPressEnter={createPage}
                    />
                </Space>
            </Modal>

            <Modal
                title="Page Configuration"
                visible={pageConfigModalVisible}
                onOk={savePageConfig}
                onCancel={() => setPageConfigModalVisible(false)}
                width={600}
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
                    <Form.Item label="Thumbnail">
                        <Upload
                            action="/api/upload" // Your upload endpoint
                            onChange={handleThumbnailUpload}
                            showUploadList={false}
                        >
                            {pageConfig.thumbnail ? (
                                <div>
                                    <Image
                                        src={pageConfig.thumbnail}
                                        width={200}
                                        height={150}
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <Button style={{ marginTop: 8 }}>Change Thumbnail</Button>
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

// Widget Layout Editor Component
const WidgetLayoutEditor = ({ initialLayout, onSave, onBack }) => {
    const [widgets, setWidgets] = useState(initialLayout.widgets || []);
    const [selectedWidget, setSelectedWidget] = useState(null);
    const [draggedWidget, setDraggedWidget] = useState(null);
    const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
    const [customWidgetModalVisible, setCustomWidgetModalVisible] = useState(false);
    const [customWidgetForm] = Form.useForm();
    const canvasRef = useRef(null);

    useEffect(() => {
        setWidgets(initialLayout.widgets || []);
    }, [initialLayout]);

    const handleDragStart = (widget) => {
        setDraggedWidget(widget);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!draggedWidget) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const widgetType = WIDGET_TYPES[draggedWidget.id] || {
            ...draggedWidget,
            defaultConfig: {
                title: draggedWidget.name,
                fontSize: 14,
                content: 'Custom Widget Content',
                backgroundColor: '#ffffff',
                textColor: '#1f2937'
            },
            defaultSize: { width: 300, height: 200 }
        };

        const newWidget = {
            id: `${draggedWidget.id}-${Date.now()}`,
            type: draggedWidget.id,
            position: {
                x: Math.max(0, x - widgetType.defaultSize.width / 2),
                y: Math.max(0, y - widgetType.defaultSize.height / 2)
            },
            size: widgetType.defaultSize,
            config: {
                ...widgetType.defaultConfig,
                id: `${draggedWidget.id}-${Date.now()}`
            }
        };

        setWidgets([...widgets, newWidget]);
        setDraggedWidget(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleWidgetSelect = (widgetId) => {
        setSelectedWidget(selectedWidget === widgetId ? null : widgetId);
    };

    const handleWidgetSettingsClick = () => {
        setConfigDrawerVisible(true);
    };

    const updateWidget = (id, updates) => {
        setWidgets(widgets.map(widget =>
            widget.id === id ? { ...widget, ...updates } : widget
        ));
    };

    const deleteWidget = (id) => {
        setWidgets(widgets.filter(widget => widget.id !== id));
        if (selectedWidget === id) {
            setSelectedWidget(null);
        }
    };

    const handleSave = () => {
        const layout = {
            widgets,
            gridConfig: initialLayout.gridConfig || { cols: 12, rowHeight: 30 }
        };
        onSave(layout);
    };

    const handleAddCustomWidget = () => {
        setCustomWidgetModalVisible(true);
    };

    const handleCustomWidgetSubmit = () => {
        customWidgetForm.validateFields().then(values => {
            const newWidget = {
                id: `custom-${Date.now()}`,
                name: values.name,
                description: values.description,
                icon: FileTextOutlined,
                category: 'content',
                defaultConfig: {
                    title: values.name,
                    fontSize: 14,
                    content: values.defaultContent,
                    backgroundColor: '#ffffff',
                    textColor: '#1f2937'
                },
                defaultSize: { width: 300, height: 200 }
            };

            WIDGET_TYPES[newWidget.id] = newWidget;
            setDraggedWidget(newWidget);
            setCustomWidgetModalVisible(false);
            customWidgetForm.resetFields();
        });
    };

    const selectedWidgetData = widgets.find(w => w.id === selectedWidget);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 bg-white border-b">
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={onBack}>Back to Pages</Button>
                    <Title level={4} style={{ margin: 0 }}>Widget Editor</Title>
                </Space>
                <Space>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                    >
                        Save Layout
                    </Button>
                </Space>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <WidgetLibrary
                    onDragStart={handleDragStart}
                    onAddCustomWidget={handleAddCustomWidget}
                />

                <div
                    ref={canvasRef}
                    className="flex-1 relative overflow-hidden bg-gray-100"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedWidget(null);
                        }
                    }}
                >
                    {widgets.map((widget) =>
                        createWidget(widget.type, {
                            key: widget.id,
                            config: widget.config,
                            position: widget.position,
                            size: widget.size,
                            isSelected: selectedWidget === widget.id,
                            onSelect: () => handleWidgetSelect(widget.id),
                            onSettingsClick: () => {
                                handleWidgetSelect(widget.id);
                                handleWidgetSettingsClick();
                            },
                            onConfigChange: (config) => updateWidget(widget.id, { config }),
                            onPositionChange: (position) => updateWidget(widget.id, { position }),
                            onSizeChange: (size) => updateWidget(widget.id, { size }),
                            onDelete: () => deleteWidget(widget.id)
                        })
                    )}

                    {widgets.length === 0 && (
                        <Empty
                            className="absolute inset-0 flex items-center justify-center"
                            image={<AppstoreOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                            description={
                                <div>
                                    <p>Build Your Dashboard</p>
                                    <p className="text-sm mt-2">Drag widgets from the library to get started</p>
                                </div>
                            }
                        />
                    )}
                </div>

                <Drawer
                    title="Widget Configuration"
                    width={400}
                    onClose={() => setConfigDrawerVisible(false)}
                    visible={configDrawerVisible}
                    bodyStyle={{ paddingBottom: 80 }}
                    extra={
                        <Button
                            icon={<CloseOutlined />}
                            onClick={() => setConfigDrawerVisible(false)}
                        />
                    }
                >
                    {selectedWidgetData && (
                        <ConfigPanel
                            config={selectedWidgetData.config}
                            widgetType={selectedWidgetData.type}
                            onConfigChange={(config) => updateWidget(selectedWidgetData.id, { config })}
                            onCancel={() => setConfigDrawerVisible(false)}
                        />
                    )}
                </Drawer>

                <Modal
                    title="Add Custom Widget"
                    visible={customWidgetModalVisible}
                    onOk={handleCustomWidgetSubmit}
                    onCancel={() => setCustomWidgetModalVisible(false)}
                >
                    <Form form={customWidgetForm} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Widget Name"
                            rules={[{ required: true, message: 'Please enter widget name' }]}
                        >
                            <Input placeholder="Enter widget name" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                        >
                            <Input placeholder="Enter description" />
                        </Form.Item>
                        <Form.Item
                            name="defaultContent"
                            label="Default Content"
                        >
                            <TextArea rows={4} placeholder="Enter default content" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '24px' }}>
                <DashboardManager />
            </Content>
        </Layout>
    );
};

export default App;