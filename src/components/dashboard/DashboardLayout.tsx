/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import React, { useState } from 'react';
import DynamicSidebar from './DynamicSidebar';
import type { DashboardConfig, Page } from './types/dashboard';

const { Header, Sider, Content, Footer } = Layout;

interface DashboardLayoutProps {
    config: DashboardConfig;
    pages: Page[];
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    config,
    pages,
    children
}) => {
    const [collapsed, setCollapsed] = useState(config.sidebar.defaultCollapsed);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleNavigation = (path: string) => {
        setCurrentPath(path);
        // Add your routing logic here (e.g., using react-router)
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {config.sidebar.visible && (
                <Sider
                    width={config.sidebar.width}
                    collapsedWidth={config.sidebar.collapsedWidth}
                    collapsible={config.sidebar.collapsible}
                    collapsed={collapsed}
                    trigger={null}
                    style={{
                        background: config.theme.sidebarBg,
                        overflow: 'auto',
                        height: '100vh',
                        position: config.header.fixed ? 'fixed' : 'static',
                        left: 0
                    }}
                >
                    {config.sidebar.logo && (
                        <div className="logo" style={{
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={config.sidebar.logo}
                                alt="Logo"
                                style={{
                                    maxHeight: '50px',
                                    maxWidth: collapsed ? '80%' : '60%'
                                }}
                            />
                        </div>
                    )}

                    <DynamicSidebar
                        config={config}
                        pages={pages}
                        currentPath={currentPath}
                        onNavigate={handleNavigation}
                    />
                </Sider>
            )}

            <Layout
                style={{
                    marginLeft: config.sidebar.visible && !collapsed ? config.sidebar.width :
                        config.sidebar.visible && collapsed ? config.sidebar.collapsedWidth : 0
                }}
            >
                {config.header.visible && (
                    <Header style={{
                        padding: 0,
                        background: config.theme.headerBg,
                        position: config.header.fixed ? 'fixed' : 'static',
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {config.sidebar.collapsible && (
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={toggleSidebar}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                    color: 'inherit'
                                }}
                            />
                        )}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingRight: '24px'
                        }}>
                            <span style={{
                                color: 'inherit',
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                                {config.header.title}
                            </span>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                selectedKeys={[currentPath]}
                                items={config.header.menuItems.map(item => ({
                                    ...item,
                                    onClick: () => item.path && handleNavigation(item.path)
                                }))}
                                style={{
                                    background: 'transparent',
                                    borderBottom: 'none',
                                    lineHeight: '64px'
                                }}
                            />
                        </div>
                    </Header>
                )}

                <Content style={{
                    marginTop: config.header.visible && config.header.fixed ? '64px' : 0,
                    padding: '24px',
                    minHeight: 'calc(100vh - 128px)'
                }}>
                    {children}
                </Content>

                {config.footer.visible && (
                    <Footer style={{
                        textAlign: 'center',
                        position: config.footer.fixed ? 'fixed' : 'static',
                        bottom: 0,
                        width: '100%',
                        background: config.theme.headerBg
                    }}>
                        {config.footer.content}
                    </Footer>
                )}
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;