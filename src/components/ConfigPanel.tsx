/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, ColorPicker, Divider, Form, Input, InputNumber, Radio, Row, Select, Slider, Space, Switch } from "antd";
import { useEffect, useState } from "react";
import { mockData } from "../constants/mockData";
import ButtonConfigPanel from "./widgets/Button/ButtonConfigPanel";

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
        onCancel();
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
            case 'button':
                return (
                    <>
                        {commonFields}
                        <ButtonConfigPanel
                            config={tempConfig}
                            onConfigChange={(newConfig) => {
                                const updatedConfig = { ...tempConfig, ...newConfig };
                                setTempConfig(updatedConfig);
                            }}
                            onCancel={handleCancel}
                        />
                    </>
                )
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

export default ConfigPanel;
