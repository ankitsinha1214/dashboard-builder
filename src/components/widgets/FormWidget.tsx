/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { UploadOutlined } from "@ant-design/icons";
import { message,Form, Input, InputNumber, Select, Checkbox, Switch, Radio, DatePicker, TimePicker, Upload, Button } from "antd";

import BaseWidget from "./BaseWidget";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

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

export default FormWidget;