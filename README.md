# 🎬 Video Editor

A lightweight web-based video editing platform built with React + Redux, allowing users to upload videos, mark scenes, overlay text/images, control audio per segment, and preview edits in real-time.

---

## ✨ Features

- 📤 **Video Upload**: Drag & drop or click-to-upload interface
- 🎞️ **Scene Timeline**: Add, reorder, and preview scene segments with thumbnails
- 🔇 **Audio Panel**: Mute/unmute scenes individually with waveform-style UI
- 📝 **Subtitle Overlay**:
  - Add multiple subtitle blocks
  - Control timing, font size, position, and color
- 🖼 **Image Overlay**:
  - Upload static image
  - Drag and resize it over the video preview
- 🎥 **Live Preview**: One unified `<video>` element with overlays applied in real time
- ⚙️ **Mock Render/Export**: Simulate rendering with progress and download button

---

## 🧱 Tech Stack

- 🧩 **React** + **Redux Toolkit**
- 🎨 **TailwindCSS** for styling
- 🎥 **HTML5 Video** API for timeline/thumbnails
- ☁️ **Blob URLs** for file previews

---

## 🧪 Testing the App

Follow these steps to test the functionality of the Smart Video Editor:

1. **Upload a video file**
   - Supported formats: `.mp4`, `.webm`, etc.
   - Drag and drop the file, or click to browse.

2. **Define scenes using the timeline**
   - Set start and end markers.
   - Add scenes to see thumbnails and duration blocks.
   - Reorder scenes by dragging.

3. **Manage audio for each scene**
   - Open the **Audio Panel**.
   - Mute/unmute individual scenes.
   - Muted scenes will automatically silence playback during those segments.

4. **Use the overlay editor**
   - **Add subtitles**:
     - Input text, timing (start/end), font size, color, and position (top/bottom).
   - **Upload an image overlay**:
     - Supports drag & drop or file picker.
     - Image is draggable and can be repositioned over the video.

5. **Play the video and verify behavior**
   - ✅ Subtitles appear at correct times.
   - ✅ Audio mutes only during scenes marked as muted.
   - ✅ Image overlay is visible and properly positioned.

6. **Simulate exporting**
   - Click the **"Render"** button.
   - A mock rendering animation will play.
   - The **"Download"** button appears after mock completion.