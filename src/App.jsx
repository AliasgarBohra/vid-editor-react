import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VideoUploader from './components/VideoUploader';
import VideoTimeline from './components/VideoTimeline';
import AudioPanel from './components/AudioPanel';
import OverlayEditor from './components/OverlayEditor';

export default function App() {
  const { previewUrl, scenes } = useSelector((state) => state.video);
  const [subtitles, setSubtitles] = useState([]);
  const [imageOverlay, setImageOverlay] = useState(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const activeScene = scenes.find(
        (scene) => current >= scene.startTime && current <= scene.endTime
      );
      video.muted = activeScene?.muted ?? false;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [scenes, videoRef]);


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">🎬 Video Editor</h1>
      </header>

      <section className="mb-4 max-w-4xl mx-auto">
        <VideoUploader />
      </section>

      {previewUrl && (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">

          <div className="w-full lg:w-1/3 space-y-6">
            <OverlayEditor
              subtitles={subtitles}
              setSubtitles={setSubtitles}
              setImageOverlay={setImageOverlay}
            />
            {videoRef.current?.muted && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                🔇 Muted
              </div>
            )}

            <AudioPanel />
          </div>

          <div className="w-full lg:w-2/3 space-y-6">
            <div className="relative border rounded shadow overflow-hidden bg-black">
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                className="w-full h-auto max-h-[400px]"
              />

              {subtitles.map((sub, idx) => (
                <div
                  key={idx}
                  className="absolute w-full text-center pointer-events-none"
                  style={{
                    top: sub.position === 'top' ? '5%' : '85%',
                    color: sub.color,
                    fontSize: `${sub.fontSize}px`,
                    textShadow: '0 0 5px black',
                  }}
                >
                  {sub.text}
                </div>
              ))}

              {imageOverlay && (
                <img
                  ref={imageRef}
                  src={imageOverlay}
                  alt="Overlay"
                  className="absolute top-10 left-10 w-32 h-32 object-contain cursor-move opacity-80"
                  draggable
                  onDrag={(e) => {
                    if (imageRef.current) {
                      imageRef.current.style.left = `${e.clientX - 50}px`;
                      imageRef.current.style.top = `${e.clientY - 50}px`;
                    }
                  }}
                />
              )}
            </div>

            <VideoTimeline videoRef={videoRef} />

          </div>
        </div>
      )}
    </div>
  );
}
