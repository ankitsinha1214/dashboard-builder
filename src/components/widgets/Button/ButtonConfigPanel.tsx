/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  ColorPicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
} from 'antd';
import { useEffect } from "react";

const { Option } = Select;

const ButtonConfigPanel = ({ config, onConfigChange, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const handleValuesChange = (changedValues, allValues) => {
    onConfigChange(allValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={config}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="Button Text" name="text">
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

      <Form.Item label="Size" name="size">
        <Select>
          <Option value="large">Large</Option>
          <Option value="middle">Medium</Option>
          <Option value="small">Small</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Shape" name="shape">
        <Select>
          <Option value="default">Default</Option>
          <Option value="round">Round</Option>
          <Option value="circle">Circle</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Icon" name="icon">
        <Select allowClear>
          <Option value="download">Download</Option>
          <Option value="search">Search</Option>
          <Option value="power">Power</Option>
          <Option value="upload">Upload</Option>
          <Option value="delete">Delete</Option>
          <Option value="edit">Edit</Option>
          <Option value="add">Add</Option>
        </Select>
      </Form.Item>

      <Divider orientation="left">Appearance</Divider>

      <Form.Item label="Background Color" name="bgColor">
        <ColorPicker showText />
      </Form.Item>

      <Form.Item label="Text Color" name="textColor">
        <ColorPicker showText />
      </Form.Item>

      <Form.Item label="Border Color" name="borderColor">
        <ColorPicker showText />
      </Form.Item>

      <Space>
        <Form.Item label="Danger" name="danger" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Ghost" name="ghost" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Disabled" name="disabled" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Block" name="block" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Space>

      <Divider orientation="left">Behavior</Divider>

      <Form.Item label="Action" name="action">
        <Select>
          <Option value="loading">Show Loading</Option>
          <Option value="link">Navigate to Link</Option>
          <Option value="function">Execute Function</Option>
          <Option value="model">Open Model</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Tooltip" name="tooltip">
        <Input />
      </Form.Item>

      <Form.Item label="Alignment" name="align">
        <Radio.Group>
          <Radio.Button value="left">Left</Radio.Button>
          <Radio.Button value="center">Center</Radio.Button>
          <Radio.Button value="right">Right</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Divider orientation="left">Advanced</Divider>

      <Form.Item label="With Badge" name="withBadge" valuePropName="checked">
        <Switch />
      </Form.Item>

      {config.withBadge && (
        <>
          <Form.Item label="Badge Count" name="badgeCount">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Overflow Count" name="overflowCount">
            <InputNumber min={0} />
          </Form.Item>
        </>
      )}

      <Form.Item label="Confirm Before Action" name="confirmBeforeAction" valuePropName="checked">
        <Switch />
      </Form.Item>

      {config.confirmBeforeAction && (
        <>
          <Form.Item label="Confirmation Title" name="confirmTitle">
            <Input />
          </Form.Item>
          <Form.Item label="OK Text" name="confirmOkText">
            <Input />
          </Form.Item>
          <Form.Item label="Cancel Text" name="confirmCancelText">
            <Input />
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default ButtonConfigPanel;