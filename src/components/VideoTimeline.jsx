import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addScene,
    reorderScenes,
    removeScene,
    setCurrentTime,
} from '../store/videoSlice';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }).map(() => letters[Math.floor(Math.random() * 16)]).join('');
};

export default function VideoTimeline({ videoRef }) {
    const dispatch = useDispatch();
    const timelineRef = useRef(null);
    const thumbnailCanvases = useRef({});
    const { videoDuration, scenes, currentTime, previewUrl } = useSelector((state) => state.video);

    const [startMarker, setStartMarker] = useState(0);
    const [endMarker, setEndMarker] = useState(0);
    const [dragging, setDragging] = useState(null);
    const [draggedScene, setDraggedScene] = useState(null);

    const width = 600;
    const secondsToPx = videoDuration > 0 ? width / videoDuration : 1;
    const pxToSeconds = (px) => px / secondsToPx;
    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

    const handleClick = (e) => {
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = clamp(pxToSeconds(x), 0, videoDuration);
        dispatch(setCurrentTime(time));
    };

    const handleMarkerMouseDown = (e, type) => {
        e.preventDefault();
        setDragging(type);
    };

    useEffect(() => {
        if (!timelineRef.current) return;

        const onMouseMove = (e) => {
            if (!dragging) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            let time = clamp(pxToSeconds(x), 0, videoDuration);

            if (dragging === 'start') {
                setStartMarker(clamp(time, 0, endMarker - 0.01));
            } else if (dragging === 'end') {
                setEndMarker(clamp(time, startMarker + 0.01, videoDuration));
            }

            dispatch(setCurrentTime(time));
        };

        const onMouseUp = () => {
            setDragging(null);
        };

        if (dragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [dragging, videoDuration, startMarker, endMarker]);

    useEffect(() => {
        dispatch(setCurrentTime(startMarker));
    }, [startMarker]);

    useEffect(() => {
        setEndMarker(videoDuration);
    }, [videoDuration]);

    const handleAddScene = () => {
        if (endMarker > startMarker) {
            const color = getRandomColor();
            const newScene = {
                id: Date.now(),
                startTime: parseFloat(startMarker.toFixed(2)),
                endTime: parseFloat(endMarker.toFixed(2)),
                thumbnail: color,
            };
            dispatch(addScene(newScene));
        }
    };

    const handleRemoveScene = (id) => {
        dispatch(removeScene(id));
    };

    const handleCutScene = () => {
        alert(`Mock cut at ${currentTime.toFixed(2)}s`);
    };

    useEffect(() => {
        if (!previewUrl || scenes.length === 0 || !videoRef.current) return;
    
        const generateThumbnails = async () => {
            const video = videoRef.current;
            const originalTime = video.currentTime;
    
            for (const scene of scenes) {
                const canvas = thumbnailCanvases.current[scene.id];
                if (!canvas) continue;
    
                await new Promise((resolve) => {
                    const onSeeked = () => {
                        const ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        video.removeEventListener('seeked', onSeeked);
                        resolve();
                    };
                    video.addEventListener('seeked', onSeeked);
                    video.currentTime = scene.startTime;
                });
            }
    
            video.currentTime = originalTime;
        };
    
        generateThumbnails().catch(console.error);
    }, [scenes, previewUrl, videoRef]);
    

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Video Timeline</h2>

            {videoDuration > 0 ? (
                <div
                    className="relative bg-gray-200 h-20 rounded-md overflow-visible border border-gray-300"
                    ref={timelineRef}
                    style={{ width: `${width}px`, margin: '0 auto' }}
                    onClick={handleClick}
                >
                    {Array.from({ length: Math.ceil(videoDuration) }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-full w-px bg-gray-400 opacity-50"
                            style={{ left: `${i * secondsToPx}px` }}
                        >
                            <div className="text-xs text-gray-600 absolute top-full left-[-8px]">{i}s</div>
                        </div>
                    ))}

                    <div
                        className="absolute top-0 h-full w-0.5 bg-blue-600 z-20"
                        style={{ left: `${currentTime * secondsToPx}px` }}
                    />

                    <div
                        className="absolute top-0 h-full w-2 bg-green-500 cursor-pointer z-30"
                        style={{ left: `${clamp(startMarker * secondsToPx, 0, width)}px` }}
                        onMouseDown={(e) => handleMarkerMouseDown(e, 'start')}
                    />

                    <div
                        className="absolute top-0 h-full w-2 bg-red-500 cursor-pointer z-30"
                        style={{ left: `${clamp(endMarker * secondsToPx, 0, width)}px` }}
                        onMouseDown={(e) => handleMarkerMouseDown(e, 'end')}
                    />

                    <button
                        onClick={handleCutScene}
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-600 text-white px-2 py-1 rounded z-40"
                    >
                        Cut
                    </button>
                </div>
            ) : (
                <p className="text-gray-500">Upload a video to enable timeline</p>
            )}

            <div className="mt-4 flex gap-4 justify-center">
                <button
                    onClick={handleAddScene}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Scene ({startMarker.toFixed(2)}s - {endMarker.toFixed(2)}s)
                </button>
            </div>

            <div className="mt-4 flex gap-4 overflow-x-auto">
                {scenes.map((scene, index) => (
                    <div
                        key={scene.id}
                        draggable
                        onDragStart={() => setDraggedScene(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                            if (draggedScene !== null && draggedScene !== index) {
                                const updated = [...scenes];
                                const [moved] = updated.splice(draggedScene, 1);
                                updated.splice(index, 0, moved);
                                dispatch(reorderScenes(updated));
                            }
                            setDraggedScene(null);
                        }}
                        className="relative w-32 h-20 border rounded shadow bg-white text-sm flex-shrink-0"
                    >
                        <div className="w-full h-2" style={{ backgroundColor: scene.thumbnail }} />
                        <canvas
                            width="100"
                            height="60"
                            ref={(el) => {
                                if (el) thumbnailCanvases.current[scene.id] = el;
                            }}
                        />
                        <div className="text-center text-xs">
                            {scene.startTime}s - {scene.endTime}s
                        </div>
                        <button
                            onClick={() => handleRemoveScene(scene.id)}
                            className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
