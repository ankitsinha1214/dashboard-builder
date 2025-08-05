/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button as AntButton, Tooltip } from 'antd';
import BaseWidget from '../BaseWidget';

const ButtonWidget = (props) => {
  const { config } = props;

  const getIcon = (iconName) => {
    const icons = {
      download: <DownloadOutlined />,
      search: <SearchOutlined />,
      // ... other icons
    };
    return icons[iconName] || null;
  };

  const buttonProps = {
    type: config.type,
    size: config.size,
    shape: config.shape,
    icon: config.icon ? getIcon(config.icon) : null,
    danger: config.danger,
    ghost: config.ghost,
    disabled: config.disabled,
    block: config.block,
    style: {
      backgroundColor: config.bgColor,
      color: config.textColor,
      borderColor: config.borderColor
    }
  };

  return (
    <BaseWidget {...props}>
      <div style={{
        padding: '16px',
        display: 'flex',
        justifyContent: config.align || 'center',
        alignItems: 'center',
        height: '100%'
      }}>
        {config.tooltip ? (
          <Tooltip title={config.tooltip}>
            <AntButton  {...buttonProps}>
              {config.text}
            </AntButton>
          </Tooltip>
        ) : (
          <AntButton
            {...buttonProps}
          >
            {config.text}
          </AntButton>
        )}
      </div>
    </BaseWidget>
  );
};

export default ButtonWidget;