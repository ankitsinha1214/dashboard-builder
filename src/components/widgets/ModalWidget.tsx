/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React from 'react';
import { Modal, Empty } from 'antd';

/**
 * Interface for the configuration of the Modal widget.
 * Defines the properties that can be set by the user in the configuration panel.
 */
interface ModalWidgetConfig {
  title?: string;
  content?: string;
}

/**
 * Interface for the props of the ModalWidget component.
 * It extends React.HTMLAttributes to allow standard HTML attributes.
 */
interface ModalWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ModalWidgetConfig;
  visible: boolean;
  onClose: () => void; // Corrected to match the Modal's onCancel signature
}

/**
 * A dedicated widget component for rendering a modal.
 * Its visibility is controlled by a parent component's state.
 *
 * @param {object} props The component props.
 * @param {object} props.config The configuration object for the modal.
 * @param {boolean} props.visible A prop to control the visibility of the modal.
 * @param {Function} props.onClose A function to be called when the modal is closed.
 */
const ModalWidget: React.FC<ModalWidgetProps> = ({ config, visible, onClose, ...restProps }) => {

  /**
   * Handles the modal's close event, invoking the onClose callback passed from the parent.
   */
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      title={config.title || "Modal"}
      open={visible} // Use 'open' instead of 'visible' for Antd v5+
      onCancel={handleCancel}
      footer={null} // Hides the default footer buttons
      centered
      {...restProps}
    >
      <div style={{ padding: '24px' }}>
        {config.content ? (
          <p>{config.content}</p>
        ) : (
          <Empty description="No content configured for this modal." />
        )}
      </div>
    </Modal>
  );
};

export default ModalWidget;
