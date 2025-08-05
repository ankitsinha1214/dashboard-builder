/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { DeleteOutlined, DragOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";

const BaseWidget = ({
    config,
    position,
    size,
    onConfigChange,
    onPositionChange,
    onSizeChange,
    onDelete,
    isSelected,
    onSelect,
    onSettingsClick,
    children
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const widgetRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.target.closest('.resize-handle') || e.target.closest('.widget-controls')) return;

        e.stopPropagation();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        onSelect();
    };

    const handleResizeStart = (e) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                onPositionChange({
                    x: Math.max(0, e.clientX - dragOffset.x),
                    y: Math.max(0, e.clientY - dragOffset.y)
                });
            } else if (isResizing) {
                const newWidth = Math.max(200, resizeStart.width + (e.clientX - resizeStart.x));
                const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y));
                onSizeChange({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, resizeStart, onPositionChange, onSizeChange]);

    return (
        <div
            ref={widgetRef}
            className={`absolute bg-white rounded-lg shadow-lg border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200'
                } ${isDragging ? 'cursor-move' : ''}`}
            style={{
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                fontSize: `${config.fontSize}px`
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg border-b">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{config.title}</h3>
                </div>
                <div className="flex items-center gap-1 widget-controls">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSettingsClick();
                        }}
                        type="text"
                        icon={<SettingOutlined />}
                        title="Configure widget"
                    />
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        type="text"
                        icon={<DeleteOutlined />}
                        title="Delete widget"
                    />
                    <Button
                        type="text"
                        icon={<DragOutlined />}
                        className="cursor-move"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
                {children}
            </div>

            {/* Resize Handle */}
            <div
                className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-tl-lg opacity-75 hover:opacity-100 resize-handle"
                onMouseDown={handleResizeStart}
            />
        </div>
    );
};

export default BaseWidget;