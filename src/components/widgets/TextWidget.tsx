/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import BaseWidget from "./BaseWidget";

const TextWidget = (props) => {
    const { config } = props;

    return (
        <BaseWidget {...props}>
            <div
                className="h-full"
                style={{
                    backgroundColor: config.backgroundColor,
                    color: config.textColor,
                    padding: config.padding,
                    textAlign: config.textAlign
                }}
            >
                <div className="whitespace-pre-wrap">{config.content}</div>
            </div>
        </BaseWidget>
    );
};

export default TextWidget;