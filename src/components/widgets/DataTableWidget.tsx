/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs
} from "antd";
import { useEffect, useRef, useState } from "react";
import { mockData } from "../../constants/mockData";
import BaseWidget from "./BaseWidget";

const { TabPane } = Tabs;
const { Option } = Select;

const DataTableWidget = (props) => {
  const { config, onConfigChange } = props;
  const data = config.dataSource ? mockData[config.dataSource] || [] : [];
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);
  const [activeTab, setActiveTab] = useState('data');
  const searchInput = useRef(null);

  useEffect(() => {
    setTempConfig(config);
  }, [config]);

  useEffect(() => {
    let result = [...data];

    // Apply global search
    if (searchText) {
      result = result.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        ));
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        result = result.filter(item =>
          values.includes(item[key])
        )
      }
    });

    setFilteredData(result);
  }, [data, searchText, filters]);

  const handleSort = (field) => {
    if (!config.sortable) return;

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={confirm}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button size="small" onClick={() => {
          setSelectedKeys([]);
          confirm();
        }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select());
      }
    },
  });

  const columns = config.columns.map(col => ({
    title: col.charAt(0).toUpperCase() + col.slice(1),
    dataIndex: col,
    key: col,
    sorter: config.sortable,
    sortOrder: sortField === col && (sortDirection === 'asc' ? 'ascend' : 'descend'),
    onHeaderCell: () => ({
      onClick: () => handleSort(col),
    }),
    ...(config.searchable && getColumnSearchProps(col)),
  }));

  const handleFilterChange = (pagination, filters) => {
    setFilters(filters);
  };

  const handleGlobalSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleConfigChange = (key, value) => {
    setTempConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateConfig = () => {
    onConfigChange(tempConfig);
    setConfigDrawerVisible(false);
  };

  const handleCancelConfig = () => {
    setTempConfig(config);
    setConfigDrawerVisible(false);
  };

  const renderFilterModal = () => {
    if (!data.length) return null;

    return (
      <Modal
        title="Filter Data"
        centered
        visible={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        footer={[
          <Button key="reset" onClick={() => setFilters({})}>
            Reset All
          </Button>,
          <Button key="cancel" onClick={() => setFilterModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => setFilterModalVisible(false)}
          >
            Apply Filters
          </Button>,
        ]}
        width={800}
      >
        <Row gutter={[16, 16]}>
          {config.columns.map(col => {
            const uniqueValues = [...new Set(data.map(item => item[col]))];

            return (
              <Col span={8} key={col}>
                <div style={{ marginBottom: 8 }}>
                  <strong>{col.charAt(0).toUpperCase() + col.slice(1)}</strong>
                </div>
                <Select
                  mode="multiple"
                  placeholder={`Filter ${col}`}
                  value={filters[col] || []}
                  onChange={values => setFilters(prev => ({
                    ...prev,
                    [col]: values
                  }))}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {uniqueValues.map(value => (
                    <Option key={value} value={value}>{value}</Option>
                  ))}
                </Select>
              </Col>
            );
          })}
        </Row>
      </Modal>
    );
  };

  const renderConfigPanel = () => (
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane tab="Data" key="data">
        <Form layout="vertical">
          <Form.Item label="Data Source">
            <Select
              value={tempConfig.dataSource}
              onChange={value => handleConfigChange('dataSource', value)}
            >
              <Option value="">Select data source</Option>
              {Object.keys(mockData).map(key => (
                <Option key={key} value={key}>{key}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Columns">
            <Checkbox.Group
              value={tempConfig.columns}
              onChange={values => handleConfigChange('columns', values)}
            >
              <Row gutter={[16, 8]}>
                {data.length > 0 && Object.keys(data[0]).map(col => (
                  <Col span={8} key={col}>
                    <Checkbox value={col}>
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Features" key="features">
        <Form layout="vertical">
          <Form.Item label="Options">
            <Space direction="vertical">
              <Checkbox
                checked={tempConfig.sortable}
                onChange={e => handleConfigChange('sortable', e.target.checked)}
              >
                Sortable
              </Checkbox>
              <Checkbox
                checked={tempConfig.searchable}
                onChange={e => handleConfigChange('searchable', e.target.checked)}
              >
                Searchable
              </Checkbox>
              <Checkbox
                checked={tempConfig.filterable}
                onChange={e => handleConfigChange('filterable', e.target.checked)}
              >
                Filterable
              </Checkbox>
              <Checkbox
                checked={tempConfig.showBorder}
                onChange={e => handleConfigChange('showBorder', e.target.checked)}
              >
                Show Borders
              </Checkbox>
              <Checkbox
                checked={tempConfig.striped}
                onChange={e => handleConfigChange('striped', e.target.checked)}
              >
                Striped Rows
              </Checkbox>
            </Space>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  );

  return (
    <BaseWidget
      {...props}
      onSettingsClick={() => setConfigDrawerVisible(true)}
    >
      <div className="p-3">
        {config.searchable && (
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="Global search..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleGlobalSearch}
              style={{ width: 200 }}
            />
            {config.filterable && (
              <Button
                icon={<FilterOutlined />}
                style={{ marginLeft: 8 }}
                onClick={() => setFilterModalVisible(true)}
              >
                Filters
              </Button>
            )}
          </div>
        )}

        {data.length > 0 ? (
          <Table
            dataSource={sortedData}
            columns={columns}
            size="small"
            pagination={false}
            bordered={config.showBorder}
            rowClassName={(_, index) => config.striped && index % 2 === 1 ? 'bg-gray-50' : ''}
            onChange={handleFilterChange}
          />
        ) : (
          <Empty description="No data source selected" />
        )}
      </div>

      <Drawer
        title="Table Configuration"
        width={500}
        visible={configDrawerVisible}
        onClose={handleCancelConfig}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCancelConfig} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateConfig} type="primary">
              Update
            </Button>
          </div>
        }
      >
        {renderConfigPanel()}
      </Drawer>

      {renderFilterModal()}
    </BaseWidget>
  );
};

export default DataTableWidget;