/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// import { Button, Form, message, Modal, Tree } from 'antd';
// import { useState } from 'react';

// interface SidebarItem {
//     key: string;
//     title: string;
//     children?: SidebarItem[];
// }

// const SidebarConfig = ({
//     dashboard,
//     onSave,
//     visible,
//     onClose
// }: {
//     dashboard: any;
//     onSave: (config: any) => void;
//     visible: boolean;
//     onClose: () => void;
// }) => {
//     const [form] = Form.useForm();
//     const [treeData, setTreeData] = useState<SidebarItem[]>(
//         dashboard?.sidebarConfig || [
//             {
//                 key: 'root',
//                 title: 'Navigation',
//                 children: dashboard?.pages?.map(page => ({
//                     key: page.id,
//                     title: page.name
//                 })) || []
//             }
//         ]
//     );

//     const onFinish = () => {
//         onSave(treeData);
//         onClose();
//         message.success('Sidebar configuration saved');
//     };

//     console.log('Sidebar Config:', visible);

//     return (
//         <Modal
//             title="Sidebar Configuration"
//             visible={visible}
//             onOk={onFinish}
//             onCancel={onClose}
//             width={800}
//         >
//             <Form form={form} layout="vertical">
//                 <Form.Item label="Navigation Structure">
//                     <Tree
//                         treeData={treeData}
//                         draggable
//                         blockNode
//                         onDrop={({ dragNode, node }) => {
//                             // Handle drag and drop logic
//                             const newData = [...treeData];
//                             // Update treeData state
//                             setTreeData(newData);
//                         }}
//                     />
//                 </Form.Item>
//                 <Button
//                     type="dashed"
//                     onClick={() => {
//                         setTreeData([...treeData, {
//                             key: `new-group-${Date.now()}`,
//                             title: 'New Group',
//                             children: []
//                         }]);
//                     }}
//                 >
//                     Add Group
//                 </Button>
//             </Form>
//         </Modal>
//     );
// };

// export default SidebarConfig;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Button, Form, Input, message, Modal, Tree, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

interface SidebarItem {
  key: string;
  title: string;
  children?: SidebarItem[];
  isEditing?: boolean;
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
    dashboard?.config?.sidebar || [
      {
        key: 'root',
        title: 'Navigation',
        children:
          dashboard?.pages?.map(page => ({
            key: page.id,
            title: page.name
          })) || []
      }
    ]
  );

  /** Find and update node recursively */
  const updateNode = (data: SidebarItem[], key: string, callback: (node: SidebarItem) => void) => {
    data.forEach(item => {
      if (item.key === key) {
        callback(item);
      } else if (item.children) {
        updateNode(item.children, key, callback);
      }
    });
  };

  /** Remove node by key */
  const removeNode = (data: SidebarItem[], key: string): SidebarItem[] => {
    return data
      .map(item => {
        if (item.key === key) return null;
        if (item.children) {
          item.children = removeNode(item.children, key);
        }
        return item;
      })
      .filter(Boolean) as SidebarItem[];
  };

  /** Handle drag-and-drop */
  const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: SidebarItem[], key: string, callback: any) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };

    const data = [...treeData];
    let dragObj: SidebarItem;
    loop(data, dragKey, (item: SidebarItem, index: number, arr: SidebarItem[]) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: SidebarItem) => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else if (
      (info.node.children || []).length > 0 &&
      info.node.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, (item: SidebarItem) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: SidebarItem[] = [];
      let i: number;
      loop(data, dropKey, (item: SidebarItem, index: number, arr: SidebarItem[]) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj);
      } else {
        ar.splice(i! + 1, 0, dragObj);
      }
    }
    setTreeData(data);
  };

  /** Handle rename save */
  const saveRename = (key: string, newName: string) => {
    const newData = [...treeData];
    updateNode(newData, key, node => {
      node.title = newName || node.title;
      node.isEditing = false;
    });
    setTreeData(newData);
  };

  /** Start rename */
  const startRename = (key: string) => {
    const newData = [...treeData];
    updateNode(newData, key, node => {
      node.isEditing = true;
    });
    setTreeData(newData);
  };

  /** Confirm save */
  const onFinish = () => {
    onSave(treeData);
    onClose();
    message.success('Sidebar configuration saved');
  };

  return (
    <Modal
      title="Sidebar Configuration"
      open={visible}
      onOk={onFinish}
      onCancel={onClose}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Navigation Structure">
          <Tree
            treeData={treeData.map(item => ({
              ...item,
              title: (
                <Space>
                  {item.isEditing ? (
                    <Input
                      size="small"
                      defaultValue={item.title}
                      onBlur={e => saveRename(item.key, e.target.value)}
                      onPressEnter={e => saveRename(item.key, (e.target as HTMLInputElement).value)}
                      autoFocus
                    />
                  ) : (
                    <span>{item.title}</span>
                  )}
                  <EditOutlined
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                    onClick={() => startRename(item.key)}
                  />
                  <Popconfirm
                    title="Delete this item?"
                    onConfirm={() => setTreeData(removeNode(treeData, item.key))}
                  >
                    <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                  </Popconfirm>
                </Space>
              )
            }))}
            draggable
            blockNode
            onDrop={onDrop}
          />
        </Form.Item>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() =>
            setTreeData([
              ...treeData,
              {
                key: `new-group-${Date.now()}`,
                title: 'New Group',
                children: []
              }
            ])
          }
        >
          Add Group
        </Button>
      </Form>
    </Modal>
  );
};

export default SidebarConfig;
