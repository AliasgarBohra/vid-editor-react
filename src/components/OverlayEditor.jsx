import React, { useState } from 'react';

export default function OverlayEditor({ subtitles, setSubtitles, setImageOverlay }) {
  const [rendering, setRendering] = useState(false);

  const handleSubtitleAdd = () => {
    setSubtitles([
      ...subtitles,
      {
        text: '',
        start: 0,
        end: 1,
        fontSize: 16,
        color: '#ffffff',
        position: 'bottom',
      },
    ]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageOverlay(URL.createObjectURL(file));
    }
  };

  const handleRender = () => {
    setRendering(true);
    setTimeout(() => {
      setRendering(false);
      alert('Mock Render Complete!');
    }, 2000);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Overlay Editor</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Subtitles</h3>
        {subtitles.map((sub, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input
              className="border p-1 text-sm"
              placeholder="Text"
              value={sub.text}
              onChange={(e) => {
                const updated = [...subtitles];
                updated[i].text = e.target.value;
                setSubtitles(updated);
              }}
            />
            <input
              type="number"
              className="w-16 p-1 border text-sm"
              value={sub.start}
              onChange={(e) => {
                const updated = [...subtitles];
                updated[i].start = parseFloat(e.target.value);
                setSubtitles(updated);
              }}
            />
            <input
              type="number"
              className="w-16 p-1 border text-sm"
              value={sub.end}
              onChange={(e) => {
                const updated = [...subtitles];
                updated[i].end = parseFloat(e.target.value);
                setSubtitles(updated);
              }}
            />
            <select
              value={sub.position}
              onChange={(e) => {
                const updated = [...subtitles];
                updated[i].position = e.target.value;
                setSubtitles(updated);
              }}
              className="p-1 text-sm"
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
            </select>
            <input
              type="color"
              value={sub.color}
              onChange={(e) => {
                const updated = [...subtitles];
                updated[i].color = e.target.value;
                setSubtitles(updated);
              }}
            />
            <input
              type="number"
              className="w-16 p-1 border text-sm"
              value={sub.fontSize}
              onChange={(e) => {
                const updated = [...subtitles];
                updated[i].fontSize = parseInt(e.target.value);
                setSubtitles(updated);
              }}
            />
          </div>
        ))}
        <button onClick={handleSubtitleAdd} className="mt-2 px-3 py-1 bg-gray-700 text-white rounded">
          + Add Subtitle
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Image Overlay</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <div className="mt-6">
        <button
          onClick={handleRender}
          className="px-6 py-2 bg-blue-600 text-white rounded text-lg"
        >
          {rendering ? 'Rendering...' : 'Render'}
        </button>
        {!rendering && (
          <button className="ml-4 px-6 py-2 bg-green-600 text-white rounded text-lg">
            Download
          </button>
        )}
      </div>
    </div>
  );
}
