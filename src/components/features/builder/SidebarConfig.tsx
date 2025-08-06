/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Button, Form, message, Modal, Tree } from 'antd';
import { useState } from 'react';

interface SidebarItem {
    key: string;
    title: string;
    children?: SidebarItem[];
}

const SidebarConfig = ({
    dashboard,
    onSave,
    visible,
    onClose
}: {
    dashboard: any;
    onSave: (config: any) => void;
    visible: boolean;
    onClose: () => void;
}) => {
    const [form] = Form.useForm();
    const [treeData, setTreeData] = useState<SidebarItem[]>(
        dashboard?.sidebarConfig || [
            {
                key: 'root',
                title: 'Navigation',
                children: dashboard?.pages?.map(page => ({
                    key: page.id,
                    title: page.name
                })) || []
            }
        ]
    );

    const onFinish = () => {
        onSave(treeData);
        onClose();
        message.success('Sidebar configuration saved');
    };

    console.log('Sidebar Config:', visible);

    return (
        <Modal
            title="Sidebar Configuration"
            visible={visible}
            onOk={onFinish}
            onCancel={onClose}
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Navigation Structure">
                    <Tree
                        treeData={treeData}
                        draggable
                        blockNode
                        onDrop={({ dragNode, node }) => {
                            // Handle drag and drop logic
                            const newData = [...treeData];
                            // Update treeData state
                            setTreeData(newData);
                        }}
                    />
                </Form.Item>
                <Button
                    type="dashed"
                    onClick={() => {
                        setTreeData([...treeData, {
                            key: `new-group-${Date.now()}`,
                            title: 'New Group',
                            children: []
                        }]);
                    }}
                >
                    Add Group
                </Button>
            </Form>
        </Modal>
    );
};

export default SidebarConfig;