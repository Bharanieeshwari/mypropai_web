import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { X, AlertCircle, Crop, Files } from "lucide-react";
import DragDropIcon from "../../../../assets/postproperty/drag&drop-post-mpai.svg";
import CoverImage from "../../../../assets/postproperty/cover-image-icon.svg";
import { getCroppedImg } from "@/utils/helpers";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Cropper from "react-easy-crop";
import { BASE_URL } from "@/lib/api";

import preview_image_icon from '@/assets/postproperty/preview-icon-pp.svg'
import DialogBox from "@/components/common/DialogBox";

export default function PropertyPhotos({ formData, setFormData, isEdit }) {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [coverIndex, setCoverIndex] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [photosLoaded, setPhotosLoaded] = useState(false);

  // Cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ unit: "%", x: 20, y: 10, width: 100, height: 100 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [cropHistory, setCropHistory] = useState({});

  // 
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const MaxImageCount = 8;
  const MaxVideoCount = 2;
  const MaxImageSize = 5 * 1024 * 1024;
  const MaxVideoSize = 1024 * 1024 * 1024;
  const MaxPdfSize = 10 * 1024 * 1024;

  // --- Handle file uploads ---
  const handleFiles = (selectedFiles) => {
    setErrorText("");
    const fileArray = Array.from(selectedFiles).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type === "application/pdf"
    );

    let imageCount = files.filter((f) => f.type?.startsWith("image/")).length;
    let videoCount = files.filter((f) => f.type?.startsWith("video/")).length;

    const newFiles = [];
    let imageLimitReached = false;
    let videoLimitReached = false;
    let sizeLimitExceeded = false;

    for (const file of fileArray) {
      const ext = file.name.split(".").pop().toLowerCase();
      let detectedType = file.type;

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) detectedType = "image/" + ext;
      else if (["mp4", "avi", "mov", "wmv", "webm"].includes(ext)) detectedType = "video/" + ext;
      else if (ext === "pdf") detectedType = "application/pdf";

      if ((detectedType.startsWith("image/") && file.size > MaxImageSize) ||
        (detectedType.startsWith("video/") && file.size > MaxVideoSize) ||
        (detectedType === "application/pdf" && file.size > MaxPdfSize)) {
        sizeLimitExceeded = true;
        continue;
      }

      if (detectedType.startsWith("image/") && imageCount < MaxImageCount) {
        const previewUrl = URL.createObjectURL(file);
        newFiles.push({
          file,
          preview: previewUrl,
          originalPreview: previewUrl,
          type: detectedType,
          isCover: false,
        });
        imageCount++;
      } else if (detectedType.startsWith("video/") && videoCount < MaxVideoCount) {
        newFiles.push({ file, preview: URL.createObjectURL(file), type: detectedType });
        videoCount++;
      } else if (detectedType === "application/pdf") {
        newFiles.push({ file, preview: URL.createObjectURL(file), type: detectedType });
      } else {
        if (detectedType.startsWith("image/")) imageLimitReached = true;
        if (detectedType.startsWith("video/")) videoLimitReached = true;
      }
    }

    // Error messages
    if (sizeLimitExceeded) setErrorText("File size exceeded (5 MB for images, 1 GB for videos, 10 MB for PDFs).");
    else if (imageLimitReached && videoLimitReached) setErrorText("Maximum limit reached (8 images & 2 videos only).");
    else if (imageLimitReached) setErrorText("Maximum limit reached (8 images only).");
    else if (videoLimitReached) setErrorText("Maximum limit reached (2 videos only).");

    if (newFiles.length > 0) {
      setFiles((prev) => {
        const updated = [...prev, ...newFiles];
        if (coverIndex === null) {
          const firstImageIdx = updated.findIndex((f) => f.type?.startsWith("image/"));
          if (firstImageIdx !== -1) {
            setCoverIndex(firstImageIdx);
            setFormData((prevData) => ({ ...prevData, cover_image: firstImageIdx }));
          }
        }

        // Update formData photos & videos
        setFormData((prevData) => ({
          ...prevData,
          photos: updated
            .filter(f => f.type?.startsWith("image/") || f.type === "application/pdf")
            .map((f, idx) => ({ id: idx, file: f.file })),
          video: updated
            .filter(f => f.type?.startsWith("video/"))
            .map((f, idx) => ({ id: idx, file: f.file })),

        }));

        return updated;
      });
    }
  };

  // Edit Mode
  useEffect(() => {
    if (isEdit && !photosLoaded) {
      let parsedPhotos = [];
      let parsedVideos = [];

      // --- Parse photos ---
      if (formData.photos) {
        if (typeof formData.photos === "string") {
          try {
            parsedPhotos = JSON.parse(formData.photos);
          } catch (e) {
            console.error("Invalid photos JSON:", e);
          }
        } else if (Array.isArray(formData.photos)) {
          parsedPhotos = formData.photos;
        }
      }

      // --- Parse videos ---
      if (formData.video) {
        if (typeof formData.video === "string") {
          try {
            parsedVideos = JSON.parse(formData.video);
          } catch (e) {
            console.error("Invalid video JSON:", e);
          }
        } else if (Array.isArray(formData.video)) {
          parsedVideos = formData.video;
        }
      }

      const existingFiles = [
        ...parsedPhotos.map((item) => {
          const url = item.startsWith("http") ? item : `${BASE_URL}${item}`;
          const ext = url.split(".").pop().toLowerCase();
          return { file: null, preview: url, type: "image/" + ext, path: item };
        }),
        ...parsedVideos.map((item) => {
          const url = item.startsWith("http") ? item : `${BASE_URL}${item}`;
          const ext = url.split(".").pop().toLowerCase();
          return { file: null, preview: url, type: "video/mp4", path: item };
        }),
      ];

      setFiles(existingFiles);
      setPhotosLoaded(true);

      // Default cover assignment
      const firstImageIdx = existingFiles.findIndex((f) =>
        f.type.startsWith("image/")
      );
      if (firstImageIdx !== -1) {
        setCoverIndex(firstImageIdx);
        setFormData((prev) => ({
          ...prev,
          cover_image: firstImageIdx,
        }));
      }
    }
  }, [isEdit, formData, photosLoaded]);
  // --- Open Cropper ---
  const openCropper = (index) => {
    if (!files[index]) return;
    setCurrentCropIndex(index);
    setCrop(cropHistory[index] || { unit: "%", x: 10, y: 10, width: 30, height: 30 });
    setCroppedAreaPixels(null);
    setShowCropper(true);
  };

  // --- On Crop Complete ---
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };


  // --- Save Cropped Image ---
  const saveCroppedImage = async () => {
    if (currentCropIndex === null) return;

    try {
      const fileObj = files[currentCropIndex].originalPreview;
      if (!fileObj) throw new Error("File not found");
      const croppedFile = await getCroppedImg(fileObj, croppedAreaPixels, currentCropIndex);
      if (!croppedFile) throw new Error("Cropped image is empty");
      const croppedPreview = URL.createObjectURL(croppedFile);

      // Update files array
      setFiles((prev) => {
        const updated = [...prev];
        updated[currentCropIndex] = {
          ...updated[currentCropIndex],
          file: croppedFile,
          preview: croppedPreview,
        };

        // Update formData photos with real File objects
        setFormData((prevData) => ({
          ...prevData,
          photos: updated
            .filter(f => f.type?.startsWith("image/") || f.type === "application/pdf")
            .map((f, idx) => ({ id: idx, file: f.file })), // always use File
        }));

        return updated;
      });

      setCropHistory((prev) => ({ ...prev, [currentCropIndex]: crop }));
      setShowCropper(false);
    } catch (err) {
      console.error("Error cropping image:", err);
    }
  };


  // --- Remove file ---
  const removeFile = (index) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        photos: updated.filter((f) => f.type?.startsWith("image/") || f.type === "application/pdf").map((f) => f.file || f.preview),
        video: updated.filter((f) => f.type?.startsWith("video/")).map((f) => f.file || f.preview),
      }));
      return updated;
    });
  };

  // --- Cover Image ---
  const handleCoverImage = (index) => {
    setFiles((prev) => prev.map((f, i) => ({ ...f, isCover: i === index })));
    setCoverIndex(index);
    setFormData((prev) => ({ ...prev, cover_image: index }));
  };

  // preview image
  const handleOpenPreview = (index) => {
    if (!files[index]) return;
    setPreviewIndex(index);
    setShowPreview(true)


  }

  return (
    <div className="mb-3 items-center-safe rounded-lg bg-[#ECEAFF] mt-7">
      <div className="p-[30px]">
        <h2 className="mb-1 text-[24px] font-bold">Add Photos of Your Property</h2>
        <p className="mb-5 max-w-sm text-sm text-[#36334D]">Important part of post property is photos. 95% of buyers usually take a look at property photos.</p>

        {/* Upload Box */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 cursor-pointer transition ${isDragging ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-transparent"}`}
        >
          <Input id="pictures" type="file" multiple accept="image/*,video/*,application/pdf" ref={inputRef} onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          <img src={DragDropIcon} alt="" className="mt-5" />
          <div className="my-5 text-center text-sm font-medium text-[#292C93]">
            Drag & drop Files here
            <div className="my-5 flex items-center gap-4 text-gray-400">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="text-sm font-light text-[#292C93]">(or)</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="my-5 rounded-full border-2 px-4 py-1 text-[#292C93]">Upload Files</div>
          </div>
        </div>

        {/* Previews */}
        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {files.map((item, index) => {
              const isImage = item.type?.startsWith("image/");
              const isVideo = item.type?.startsWith("video/");
              const isPdf = item.type === "application/pdf";

              return (
                <div key={index} className="relative group cursor-pointer">
                  {isImage && (
                    <div className="relative inline-block">
                      <img
                        src={item.preview}
                        alt={`preview-${index}`}
                        onClick={() => handleCoverImage(index)}
                        className={`h-26 w-26 rounded-md border object-cover ${coverIndex === index ? "brightness-50" : ""}`}
                      />
                      {coverIndex === index && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 cursor-pointer">
                          <img src={CoverImage} alt="cover" className="h-5 w-5 inline" />
                          <p className="text-[13px] text-white font-bold text-center p-1 cursor-pointer">Set as cover image</p>
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0">
                        <img src={preview_image_icon} alt="preview image" onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPreview(index);
                          setShowPreview(true);
                        }} />
                      </div>
                    </div>
                  )}
                  {isVideo && <video src={item.preview} className="h-24 w-24 rounded-md border object-cover" autoPlay loop muted controls />}
                  {isPdf && (
                    <a href={item.preview} target="_blank" rel="noopener noreferrer" className="flex h-24 w-24 items-center justify-center rounded-md border bg-gray-100 text-sm font-medium text-blue-600">PDF</a>
                  )}

                  <button type="button" onClick={() => removeFile(index)} className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-xs cursor-pointer text-white opacity-80 group-hover:opacity-100" title="Remove">
                    <X size={16} />
                  </button>

                  {isImage && (
                    <button type="button" onClick={() => openCropper(index)} className="absolute top-6 -right-2 rounded-full bg-purple-600 p-1 text-xs cursor-pointer text-white opacity-80 group-hover:opacity-100" title="Crop">
                      <Crop size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {errorText && <div className="text-xs mt-2 text-red-500">{errorText}</div>}

        <p className="mt-4 text-[#36334D] text-[13px] font-light">
          <span className="font-bold">Note: </span>
          Upload up to 8 photos (5 MB each), 2 videos (1 GB each), and PDFs (10 MB).
        </p>

        {!isEdit && (
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-500">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span>Without photos, your AD gets very low response.</span>
          </div>
        )}

        {/* Cropper Modal */}
        {showCropper && currentCropIndex !== null && (
          <div className="fixed inset-0 bg-[#2B2A36CC]/80 flex items-center justify-center z-50 p-4">
            <div className="flex flex-col w-full max-w-[800px] h-full max-h-[500px]">
              {currentCropIndex === coverIndex ? (
                <div className="relative bg-gray-200 rounded-md w-full max-w-[800px] h-full max-h-[500px]  pb-6">
                  <div className="w-full h-full relative border-4 border-gray-300 rounded-md bg-black p-5">
                    <Cropper
                      image={files[currentCropIndex].originalPreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      className="w-full h-full"
                    />

                  </div>
                  <div className="text-gray-800 text-md font-bold flex justify-center items-center">
                    Thumbnail Image
                  </div>

                </div>
              ) : (
                <div className="relative bg-white rounded-md w-full max-w-[800px] max-h-[70vh] flex flex-col pb-2">
                  {/* Image Container */}
                  <div className="relative w-full h-full flex-1 border-4 border-gray-300 rounded-md bg-black flex justify-center items-center ">
                    <ReactCrop
                      crop={crop}
                      onChange={setCrop}
                      onComplete={onCropComplete}
                      className="w-full h-full"
                    >
                      <img
                        src={files[currentCropIndex].originalPreview}
                        alt="preview"
                        className="w-full h-full object-contain"
                        style={{ maxHeight: '60vh' }}
                      />
                    </ReactCrop>

                  </div>
                  <div className="text-gray-800 text-md font-bold flex justify-center items-center">
                    Property Images*
                  </div>
                </div>
              )}
              <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                <button
                  type="button"
                  className="bg-white text-[#36334D]  font-medium px-4 py-1 cursor-pointer rounded-md  w-full sm:w-auto"
                  onClick={() => setShowCropper(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-[#FFD300] text-[#36334D]  font-medium px-6 py-1 rounded-md hover:bg-[#FFD300] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  onClick={saveCroppedImage}
                  disabled={!croppedAreaPixels}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {showPreview && (
          <div className="fixed inset-0 bg-[#2B2A36CC]/80 flex items-center justify-center z-50 p-4">
            <div className="w-full h-full max-w-[800px] max-h-[500px] relative border-4 border-gray-300 rounded-md bg-black p-5">
              <div className="flex justify-center items-center w-full h-full">
                <button type="button" onClick={() => setShowPreview(false)} className="absolute top-2 right-2 rounded-full p-1 text-lg cursor-pointer text-white opacity-80 group-hover:opacity-100" title="Remove">
                  <X size={25} />
                </button>
                <img
                  src={files[previewIndex].preview}
                  alt="image preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

          </div>
        )}
      </div >
    </div >
  );
} 