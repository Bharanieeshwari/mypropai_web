import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function CropConatiner({ image, crop, zoom, onCropChange, onZoomChange, onCropComplete, isCover }) {
    const [containerHeight, setContainerHeight] = useState(400);

    // Dynamically adjust container height based on image aspect ratio
    useEffect(() => {
        if (!image) return;
        const img = new Image();
        img.src = image;
        img.onload = () => {
            const aspect = img.height / img.width;
            const width = Math.min(800, window.innerWidth * 0.9); // container width
            setContainerHeight(width * aspect); // adjust container height
        };
    }, [image]);

    return (
        <div
            className="relative w-full flex justify-center items-center border-4 border-gray-300 rounded-md bg-black overflow-hidden"
            style={{ height: containerHeight }}
        >
            {isCover ? (
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3} // crop aspect
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: { width: "100%", height: "100%" },
                        mediaStyle: { maxWidth: "100%", maxHeight: "100%" },
                        cropAreaStyle: { border: "2px solid #fff", borderRadius: "4px" },
                    }}
                />
            ) : (
                <ReactCrop
                    crop={crop}
                    onChange={onCropChange}
                    onComplete={onCropComplete}
                    className="w-full h-full"
                >
                    <img
                        src={image}
                        alt="preview"
                        className="w-full h-full object-contain"
                    />
                </ReactCrop>
            )}
        </div>
    );
}

export default CropConatiner;