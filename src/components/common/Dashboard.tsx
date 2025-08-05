/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Dashboard.tsx
import { useState } from 'react';
import DataTableWidget from '../widgets/DataTableWidget';

interface Widget {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
}

export const Dashboard = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'data-table',
      position: { x: 20, y: 20 },
      size: { width: 500, height: 400 },
      config: {
        title: 'User Data',
        fontSize: 14,
        striped: true,
        showBorder: true,
        showHeader: true,
        columns: ['id', 'name', 'email', 'role'],
      },
    },
  ]);

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const handleResize = (id: string, width: number, height: number) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, size: { width, height } } : widget
      )
    );
  };

  const handleDrag = (id: string, x: number, y: number) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, position: { x, y } } : widget
      )
    );
  };

  const handleRemove = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {widgets.map((widget) => {
        if (widget.type === 'data-table') {
          return (
            <DataTableWidget
              key={widget.id}
              config={widget.config}
              data={[]}
              onResize={(width, height) => handleResize(widget.id, width, height)}
              onRemove={() => handleRemove(widget.id)}
              onDrag={(x, y) => handleDrag(widget.id, x, y)}
              position={widget.position}
              size={widget.size}
              isSelected={selectedWidgetId === widget.id}
              onSelect={() => setSelectedWidgetId(widget.id)}
            />
          );
        }
        return null;
      })}
    </div>
  );
};