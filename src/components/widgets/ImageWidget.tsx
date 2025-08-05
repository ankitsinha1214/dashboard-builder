/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { PictureOutlined } from "@ant-design/icons";
import { Empty, Image as AntImage } from "antd";
import BaseWidget from "./BaseWidget";

const ImageWidget = (props) => {
    const { config } = props;

    return (
        <BaseWidget {...props}>
            <div className="p-3 h-full">
                {config.imageUrl ? (
                    <AntImage
                        src={config.imageUrl}
                        alt={config.alt}
                        className="w-full h-full object-cover rounded"
                        style={{ objectFit: config.fit }}
                    />
                ) : (
                    <Empty
                        image={<PictureOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                        description="No image selected"
                    />
                )}
            </div>
        </BaseWidget>
    );
};

export default ImageWidget;