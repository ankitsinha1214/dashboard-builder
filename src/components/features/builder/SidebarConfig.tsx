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

import { Button, Form, Input, message, Modal, Tree, Space, Popconfirm } from 'antd';
import { useState, useEffect } from 'react'; // Import useEffect
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
  
  /** Initialize the tree data based on dashboard config or pages */
  const initTreeData = () => {
    if (dashboard?.config?.sidebar?.length > 0) {
      const addKeys = (items: any[]): SidebarItem[] => {
        return items.map(item => ({
          ...item,
          key: item.key || `id-${Date.now()}-${Math.random()}`,
          children: item.children ? addKeys(item.children) : undefined,
        }));
      };
      return addKeys(dashboard.config.sidebar);
    }
  
    if (dashboard?.pages?.length > 0) {
      return dashboard.pages.map(page => ({
        key: page?.id,
        title: page?.name
      }));
    }
  
    return [];
  };

  const [treeData, setTreeData] = useState<SidebarItem[]>([]);
  const [pageSelectorVisible, setPageSelectorVisible] = useState(false);
  const [availablePages, setAvailablePages] = useState([]);
  
  /**
   * Use useEffect to synchronize state with the dashboard prop.
   * This hook will run every time the 'dashboard' prop changes.
   */
  useEffect(() => {
    if (dashboard) {
      const initialTreeData = initTreeData();
      setTreeData(initialTreeData);

      // Determine the pages that are not in the sidebar config
      const pagesInSidebar = new Set();
      const findPages = (items: SidebarItem[]) => {
        items.forEach(item => {
          pagesInSidebar.add(item.key);
          if (item.children) {
            findPages(item.children);
          }
        });
      };
      findPages(initialTreeData);
      
      const pagesToSelect = dashboard.pages.filter(
        (page: any) => !pagesInSidebar.has(page.id)
      );
      setAvailablePages(pagesToSelect);
    }
  }, [dashboard]); // Dependency array: the effect runs when `dashboard` changes.

  console.log(dashboard)
  console.log(treeData)
  const updateNode = (data: SidebarItem[], key: string, callback: (node: SidebarItem) => void) => {
    data.forEach(item => {
      if (item.key === key) {
        callback(item);
      } else if (item.children) {
        updateNode(item.children, key, callback);
      }
    });
  };

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

  const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: SidebarItem[], key: string, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = [...treeData];
    let dragObj: SidebarItem;
    loop(data, dragKey, (item: SidebarItem, index: number, arr: SidebarItem[]) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
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

  const saveRename = (key: string, newName: string) => {
    const newData = [...treeData];
    updateNode(newData, key, node => {
      node.title = newName || node.title;
      node.isEditing = false;
    });
    setTreeData(newData);
  };

  const startRename = (key: string) => {
    const newData = [...treeData];
    updateNode(newData, key, node => {
      node.isEditing = true;
    });
    setTreeData(newData);
  };

  const onFinish = () => {
    onSave({ sidebar: treeData });
    onClose();
    message.success('Sidebar configuration saved');
  };

  const handleAddPage = (page: any) => {
    setTreeData(prevData => [
      ...prevData,
      {
        key: page.id,
        title: page.name,
      },
    ]);
    setAvailablePages(prev => prev.filter(p => p.id !== page.id));
    setPageSelectorVisible(false);
  };

  const handleCancel = () => {
    const initialTreeData = initTreeData();
    setTreeData(initialTreeData);
    
    // Recalculate available pages for a clean slate
    const pagesInSidebar = new Set();
    const findPages = (items: SidebarItem[]) => {
      items.forEach(item => {
        pagesInSidebar.add(item.key);
        if (item.children) {
          findPages(item.children);
        }
      });
    };
    findPages(initialTreeData);

    const pagesToSelect = dashboard?.pages?.filter(
      (page: any) => !pagesInSidebar.has(page.id)
    ) || [];
    setAvailablePages(pagesToSelect);
    
    onClose();
  };

  const renderTreeNodes = (data: SidebarItem[]): any =>
    data.map(item => {
      const actions = (
        <Space>
          <EditOutlined
            style={{ color: '#1890ff', cursor: 'pointer' }}
            onClick={() => startRename(item.key)}
          />
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => {
              const newTreeData = removeNode(treeData, item.key);
              setTreeData(newTreeData);
              const page = dashboard?.pages?.find((p: any) => p.id === item.key);
              if (page) {
                setAvailablePages(prev => [...prev, page]);
              }
            }}
          >
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      );
      
      const title = item.isEditing ? (
        <Input
          size="small"
          defaultValue={item.title}
          onBlur={e => saveRename(item.key, e.target.value)}
          onPressEnter={e => saveRename(item.key, (e.target as HTMLInputElement).value)}
          autoFocus
        />
      ) : (
        <span>{item.title}</span>
      );

      return {
        ...item,
        title: (
          <Space>
            {title}
            {actions}
          </Space>
        ),
        children: item.children ? renderTreeNodes(item.children) : undefined,
      };
    });

  return (
    <>
      <Modal
        title="Sidebar Configuration"
        open={visible}
        onOk={onFinish}
        onCancel={handleCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Navigation Structure">
            <Tree
              treeData={renderTreeNodes(treeData)}
              draggable
              blockNode
              onDrop={onDrop}
            />
          </Form.Item>
          <Space>
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
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setPageSelectorVisible(true)}
              disabled={availablePages.length === 0}
            >
              Add Page
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* Add Page Modal */}
      <Modal
        title="Add Page to Sidebar"
        open={pageSelectorVisible}
        onCancel={() => setPageSelectorVisible(false)}
        footer={null}
      >
        {availablePages.length > 0 ? (
          <Space direction="vertical">
            {availablePages.map((page: any) => (
              <Button key={page.id} onClick={() => handleAddPage(page)}>
                {page.name}
              </Button>
            ))}
          </Space>
        ) : (
          <p>All pages are already in the sidebar.</p>
        )}
      </Modal>
    </>
  );
};

export default SidebarConfig;