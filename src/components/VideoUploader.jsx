import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import {
    setFileName,
    setUploading,
    setUploadProgress,
    setVideoDuration,
    setPreviewUrl,
} from '../store/videoSlice';

export default function VideoUploader() {
    const dispatch = useDispatch();
    const { previewUrl, uploading, uploadProgress } = useSelector((state) => state.video);
    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        onDrop: useCallback((acceptedFiles) => {
            if (acceptedFiles.length === 0) return;
            const file = acceptedFiles[0];
            dispatch(setFileName(file.name));
            const url = URL.createObjectURL(file);
            dispatch(setPreviewUrl(url));
            simulateUpload(file);
            extractVideoDuration(file);
        }, [dispatch]),
        accept: 'video/*',
        multiple: false,
        disabled: !!previewUrl,
    });

    const simulateUpload = (file) => {
        dispatch(setUploading(true));
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            dispatch(setUploadProgress(progress));
            if (progress >= 100) {
                clearInterval(interval);
                dispatch(setUploading(false));
            }
        }, 100);
    };

    const extractVideoDuration = (file) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            dispatch(setVideoDuration(video.duration));
        };
        video.src = URL.createObjectURL(file);
    };

    return (
        <div {...getRootProps()} className="border-2 border-dashed p-6 rounded text-center bg-white shadow">
            <input {...getInputProps()} />
            <p>{previewUrl ? 'Video Uploaded' : (isDragActive ? 'Drop the video here...' : 'Drag & drop a video or click to upload')}</p>
            {uploading && (
                <div className="mt-4">
                    <progress value={uploadProgress} max="100" className="w-full h-2"></progress>
                    <p>Uploading...</p>
                </div>
            )}
            {previewUrl && !uploading && (
  <p className="mt-2 text-green-700 font-semibold">Video uploaded successfully!</p>
)}
        </div>
    );
}
