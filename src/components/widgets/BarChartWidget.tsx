/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Empty } from "antd";
import { mockData } from "../../constants/mockData";
import BaseWidget from "./BaseWidget";

const BarChartWidget = (props) => {
    const { config } = props;
    const data = config.dataSource ? mockData[config.dataSource] || [] : [];

    const maxValue = Math.max(...data.map(item => item[config.yAxis] || 0));

    return (
        <BaseWidget {...props}>
            <div className="p-3">
                {data.length > 0 ? (
                    <div className="space-y-2">
                        {data.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-16 text-sm text-gray-600 text-right">
                                    {item[config.xAxis]}
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                    <div
                                        className="rounded-full h-6 flex items-center justify-end pr-2 text-white text-xs font-medium"
                                        style={{
                                            width: `${(item[config.yAxis] / maxValue) * 100}%`,
                                            backgroundColor: config.color
                                        }}
                                    >
                                        {item[config.yAxis]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="No data source selected" />
                )}
            </div>
        </BaseWidget>
    );
};

export default BarChartWidget;