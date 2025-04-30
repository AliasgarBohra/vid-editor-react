import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSceneMute } from '../store/videoSlice';

export default function AudioPanel() {
  const dispatch = useDispatch();
  const { scenes, videoDuration } = useSelector((state) => state.video);

  const handleToggleMute = (id) => {
    dispatch(toggleSceneMute(id));
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Audio Management</h2>

      <div className="relative h-24 bg-gray-100 rounded overflow-hidden mb-4 border border-gray-300">
        {scenes.map(scene => (
          <div
            key={scene.id}
            className="absolute top-0 bottom-0 border border-white text-white text-xs flex items-center justify-center"
            style={{
              left: `${(scene.startTime / videoDuration) * 100}%`,
              width: `${((scene.endTime - scene.startTime) / videoDuration) * 100}%`,
              backgroundColor: scene.muted ? 'rgba(255,0,0,0.6)' : 'rgba(0,0,0,0.3)',
            }}
          >
            {scene.muted ? 'Muted' : `${scene.startTime}s`}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {scenes.map(scene => (
          <div key={scene.id} className="flex items-center gap-4">
            <span>{scene.startTime}s - {scene.endTime}s</span>
            <button
              onClick={() => handleToggleMute(scene.id)}
              className={`px-3 py-1 rounded text-white text-sm ${scene.muted ? 'bg-red-600' : 'bg-green-600'}`}
            >
              {scene.muted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
