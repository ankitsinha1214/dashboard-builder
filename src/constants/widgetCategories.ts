import { AppstoreOutlined, BarChartOutlined, CalendarOutlined, DatabaseOutlined, FileTextOutlined, LineChartOutlined, PictureOutlined } from "@ant-design/icons";

export const WIDGET_CATEGORIES = {
    data: { name: 'Data', icon: DatabaseOutlined },
    charts: { name: 'Charts', icon: BarChartOutlined },
    metrics: { name: 'Metrics', icon: LineChartOutlined },
    content: { name: 'Content', icon: FileTextOutlined },
    media: { name: 'Media', icon: PictureOutlined },
    productivity: { name: 'Productivity', icon: CalendarOutlined },
    ui: {
        name: 'UI Elements',
        icon: AppstoreOutlined,
        description: 'Interactive UI components'
    }
};