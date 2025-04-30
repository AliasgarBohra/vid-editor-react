import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    videoDuration: 0,
    currentTime: 0,
    uploading: false,
    uploadProgress: 0,
    previewUrl: null,
    fileName: null,
    scenes: [],
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setFileName(state, action) {
            state.fileName = action.payload;
        },
        setPreviewUrl(state, action) {
            state.previewUrl = action.payload;
        },
        setUploading(state, action) {
            state.uploading = action.payload;
        },
        setUploadProgress(state, action) {
            state.uploadProgress = action.payload;
        },
        setVideoDuration(state, action) {
            state.videoDuration = action.payload;
        },
        setCurrentTime(state, action) {
            state.currentTime = action.payload;
        },
        moveScene(state, action) {
            const { fromIndex, toIndex } = action.payload;
            const updated = [...state.scenes];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            state.scenes = updated;
        },
        removeScene(state, action) {
            state.scenes = state.scenes.filter(scene => scene.id !== action.payload);
        },
        addScene(state, action) {
            state.scenes.push({ ...action.payload, muted: false });
          },

        reorderScenes(state, action) {
            state.scenes = action.payload;
        },
        toggleSceneMute(state, action) {
            const scene = state.scenes.find(s => s.id === action.payload);
            if (scene) scene.muted = !scene.muted;
          },          
    },
});

export const {
    setFileName,
    setPreviewUrl,
    setUploading,
    setUploadProgress,
    setVideoDuration,
    setCurrentTime,
    moveScene,
    removeScene,
    addScene,
    reorderScenes,
    toggleSceneMute,
} = videoSlice.actions;

export default videoSlice.reducer;