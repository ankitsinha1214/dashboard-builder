/* eslint-disable @typescript-eslint/no-explicit-any */
// components/common/WidgetWrapper.tsx
import { useRef, useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface WidgetWrapperProps {
  children: React.ReactNode;
  onResize: (width: number, height: number) => void;
  onRemove: () => void;
  onDrag: (x: number, y: number) => void;
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
  isSelected?: boolean;
  onSelect?: () => void;
}

export const WidgetWrapper = ({
  children,
  onResize,
  onRemove,
  onDrag,
  initialSize = { width: 400, height: 300 },
  initialPosition = { x: 0, y: 0 },
  isSelected = false,
  onSelect,
}: WidgetWrapperProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);

  // Handle mouse move for both dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - startPos.x;
        const newY = e.clientY - startPos.y;
        setPosition({ x: newX, y: newY });
        onDrag(newX, newY);
      }
      if (isResizing && widgetRef.current) {
        const newWidth = Math.max(200, size.width + (e.clientX - startPos.x));
        const newHeight = Math.max(150, size.height + (e.clientY - startPos.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      if (isResizing) {
        onResize(size.width, size.height);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startPos, size, onDrag, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    onSelect?.();
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartPos({
      x: e.clientX,
      y: e.clientY,
    });
    onSelect?.();
  };

  return (
    <Box
      ref={widgetRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        border: isSelected ? '2px solid #228be6' : '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header with controls */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconX 
            size={16} 
            style={{ cursor: 'move' }} 
            onMouseDown={handleMouseDown}
          />
          <span>Widget</span>
        </Box>
        <Box style={{ display: 'flex', gap: '8px' }}>
          <IconX 
            size={16} 
            style={{ cursor: 'nwse-resize' }} 
            onMouseDown={handleResizeStart}
          />
          <IconX 
            size={16} 
            style={{ cursor: 'pointer' }} 
            onClick={(e: any) => {
              e.stopPropagation();
              onRemove();
            }}
          />
        </Box>
      </Box>

      {/* Widget content */}
      <Box style={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
        {children}
      </Box>

      {/* Resize handle (bottom right corner) */}
      <Box
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '16px',
          height: '16px',
          backgroundColor: isSelected ? '#228be6' : '#adb5bd',
          cursor: 'nwse-resize',
        }}
        onMouseDown={handleResizeStart}
      />
    </Box>
  );
};