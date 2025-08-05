/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Card, Tag } from "antd";
import BaseWidget from "./BaseWidget";

const MetricCardWidget = (props) => {
    const { config } = props;

    return (
        <BaseWidget {...props}>
            <Card
                style={{
                    backgroundColor: config.backgroundColor,
                    color: config.textColor,
                    height: '100%'
                }}
                bodyStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                }}
            >
                <div className="text-2xl font-bold mb-1">{config.value}</div>
                <div className="text-sm opacity-75 mb-2">{config.metric}</div>
                <Tag color={config.changeType === 'positive' ? 'success' : 'error'}>
                    {config.change}
                </Tag>
            </Card>
        </BaseWidget>
    );
};

export default MetricCardWidget;