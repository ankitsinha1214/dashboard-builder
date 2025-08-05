import { BarChartOutlined, CalendarOutlined, DatabaseOutlined, FileTextOutlined, FormOutlined, LineChartOutlined, PictureOutlined } from "@ant-design/icons";

// Widget type definitions
export const WIDGET_TYPES = {
    'data-table': {
        name: 'Data Table',
        icon: DatabaseOutlined,
        description: 'Display tabular data',
        category: 'data',
        defaultConfig: {
            title: 'Data Table',
            fontSize: 14,
            dataSource: '',
            showHeader: true,
            showBorder: true,
            striped: true,
            columns: ['id', 'name', 'email', 'role'],
            sortable: true,
            searchable: false,
            pageSize: 10
        },
        defaultSize: { width: 400, height: 300 }
    },
    'chart-bar': {
        name: 'Bar Chart',
        icon: BarChartOutlined,
        description: 'Display bar chart visualization',
        category: 'charts',
        defaultConfig: {
            title: 'Bar Chart',
            fontSize: 14,
            dataSource: '',
            xAxis: 'month',
            yAxis: 'sales',
            color: '#3b82f6',
            showGrid: true,
            showLegend: true
        },
        defaultSize: { width: 400, height: 300 }
    },
    'button': {
        name: 'Button',
        icon: BarChartOutlined, // Make sure to import from @ant-design/icons
        description: 'Interactive button with multiple styles and actions',
        category: 'ui',
        defaultConfig: {
            text: 'Click Me',
            type: 'primary',
            size: 'middle',
            shape: 'default',
            icon: null,
            action: null,
            bgColor: null,
            textColor: null,
            borderColor: null,
            danger: false,
            ghost: false,
            disabled: false,
            block: false,
            align: 'center'
        },
        defaultSize: { width: 300, height: 170 }
    },
    'metric-card': {
        name: 'Metric Card',
        icon: LineChartOutlined,
        description: 'Display key metrics',
        category: 'metrics',
        defaultConfig: {
            title: 'Metric Card',
            fontSize: 14,
            metric: 'Total Users',
            value: '1,234',
            change: '+12%',
            changeType: 'positive',
            showIcon: true,
            backgroundColor: '#ffffff',
            textColor: '#1f2937'
        },
        defaultSize: { width: 250, height: 150 }
    },
    'text-widget': {
        name: 'Text Widget',
        icon: FileTextOutlined,
        description: 'Display formatted text content',
        category: 'content',
        defaultConfig: {
            title: 'Text Widget',
            fontSize: 14,
            content: 'Enter your text here...',
            textAlign: 'left',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            padding: 16
        },
        defaultSize: { width: 300, height: 200 }
    },
    'image-widget': {
        name: 'Image Widget',
        icon: PictureOutlined,
        description: 'Display images',
        category: 'media',
        defaultConfig: {
            title: 'Image Widget',
            fontSize: 14,
            imageUrl: '',
            alt: 'Image',
            fit: 'cover',
            showTitle: true
        },
        defaultSize: { width: 300, height: 200 }
    },
    'calendar-widget': {
        name: 'Calendar',
        icon: CalendarOutlined,
        description: 'Display calendar view',
        category: 'productivity',
        defaultConfig: {
            title: 'Calendar',
            fontSize: 14,
            view: 'month',
            showWeekends: true,
            highlightToday: true
        },
        defaultSize: { width: 400, height: 350 }
    },
    'form-widget': {
        name: 'Form Widget',
        icon: FormOutlined,
        description: 'Collect user input with validation',
        category: 'content',
        defaultConfig: {
            title: 'Form Widget',
            fontSize: 14,
            fields: [
                {
                    name: 'name',
                    label: 'Name',
                    type: 'text',
                    placeholder: 'Enter your name',
                    required: true,
                    rules: [{ required: true, message: 'Please input your name!' }]
                },
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Enter your email',
                    required: true,
                    rules: [
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]
                }
            ],
            submitText: 'Submit',
            resetText: 'Reset',
            layout: 'vertical',
            showSubmit: true,
            showReset: true,
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            padding: 16
        },
        defaultSize: { width: 350, height: 400 }
    }
};