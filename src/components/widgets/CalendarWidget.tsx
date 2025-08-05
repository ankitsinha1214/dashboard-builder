/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import BaseWidget from "./BaseWidget";

const CalendarWidget = (props) => {
    const { config } = props;
    const today = new Date();

    return (
        <BaseWidget {...props}>
            <div className="p-3">
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-semibold text-gray-600 p-2">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => {
                        const date = new Date(today.getFullYear(), today.getMonth(), i - 6);
                        const isToday = date.toDateString() === today.toDateString();
                        const isCurrentMonth = date.getMonth() === today.getMonth();

                        return (
                            <div
                                key={i}
                                className={`p-2 rounded ${isToday && config.highlightToday
                                    ? 'bg-blue-500 text-white'
                                    : isCurrentMonth
                                        ? 'text-gray-800 hover:bg-gray-100'
                                        : 'text-gray-400'
                                    }`}
                            >
                                {date.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        </BaseWidget>
    );
};

export default CalendarWidget;