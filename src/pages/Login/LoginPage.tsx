import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  message,
  Row,
  Space,
  Typography
} from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Optional for custom styling

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        sessionStorage.setItem('auth', 'true');
        message.success('Logged in successfully!');
        window.location.reload();
        navigate('/builder');
      } else {
        message.error('Invalid credentials, try again.');
      }
    } catch {
      message.error('Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = sessionStorage.getItem('auth') === 'true';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/builder');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout className="login-layout">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card className="login-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="login-header">
                <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
                  Welcome to Dashboard Builder
                </Title>
                <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                  Use admin / password to log in (mocked API)
                </Text>
              </div>

              <Form
                form={form}
                name="login"
                initialValues={{ remember: true }}
                onFinish={handleLogin}
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="admin"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    size="large"
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default LoginPage;