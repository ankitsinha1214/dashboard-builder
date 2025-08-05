/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Box, Center, Text } from '@mantine/core';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const CanvasArea: React.FC<Props> = ({ children, onDrop, onDragOver }) => {
  return (
    <Box
      style={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'auto',
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {(
        <Center style={{ height: '100%' }}>
          <Text color="dimmed">Drag widgets here to get started</Text>
        </Center>
      )}
      {children}
    </Box>
  );
};

export default CanvasArea;
