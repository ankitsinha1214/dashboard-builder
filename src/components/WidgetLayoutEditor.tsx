/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { AppstoreOutlined, ArrowLeftOutlined, FileTextOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Drawer, Empty, Form, Input, message, Modal, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/skeleton/Title";
import { useEffect, useRef, useState } from "react";
import { WIDGET_TYPES } from "../constants/widgetTypes";
import ConfigPanel from "./ConfigPanel";
import WidgetLibrary from "./WidgetLibrary";
import BarChartWidget from "./widgets/BarChartWidget";
import CalendarWidget from "./widgets/CalendarWidget";
import DataTableWidget from "./widgets/DataTableWidget";
import FormWidget from "./widgets/FormWidget";
import ImageWidget from "./widgets/ImageWidget";
import MetricCardWidget from "./widgets/MetricCardWidget";
import TextWidget from "./widgets/TextWidget";
import ButtonWidget from "./widgets/Button/ButtonWidget";

// Widget Layout Editor Component
const WidgetLayoutEditor = ({ initialLayout, onSave, onBack }) => {
    const [widgets, setWidgets] = useState(initialLayout.widgets || []);
    const [selectedWidget, setSelectedWidget] = useState(null);
    const [draggedWidget, setDraggedWidget] = useState(null);
    const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
    const [customWidgetModalVisible, setCustomWidgetModalVisible] = useState(false);
    const [customWidgetForm] = Form.useForm();
    const canvasRef = useRef(null);
    const [lastSaved, setLastSaved] = useState(null);

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

    const handleSave = async () => {
        const layout = {
            widgets,
            gridConfig: initialLayout.gridConfig || { cols: 12, rowHeight: 30 }
        };

        try {
            message.loading({ content: 'Saving layout...', key: 'saveLayout' });
            await onSave(layout);
            setLastSaved(new Date());
            message.success({
                content: 'Layout saved successfully!',
                key: 'saveLayout',
                duration: 3
            });
        } catch (error) {
            console.error('Failed to save layout:', error);
            message.error({
                content: 'Failed to save layout',
                key: 'saveLayout',
                duration: 3
            });
        }
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

    const createWidget = (type, props) => {
        switch (type) {
            case 'data-table':
                return <DataTableWidget {...props} />;
            case 'chart-bar':
                return <BarChartWidget {...props} />;
            case 'metric-card':
                return <MetricCardWidget {...props} />;
            case 'button':
                return <ButtonWidget {...props} />;
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

    const selectedWidgetData = widgets.find(w => w.id === selectedWidget);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 bg-white border-b">
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={onBack}>Back to Pages</Button>
                    <Title level={4} style={{ margin: 0 }}>Widget Editor</Title>
                    {lastSaved && (
                        <span style={{ fontSize: 12, color: '#888' }}>
                            Last saved: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
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
                            image={null}
                            description={
                                <div className="flex items-center justify-center text-left">
                                    <AppstoreOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                                    <div>
                                        <p>Build Your Dashboard</p>
                                        <p className="text-sm mt-2">Drag widgets from the library to get started</p>
                                    </div>
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

export default WidgetLayoutEditor;