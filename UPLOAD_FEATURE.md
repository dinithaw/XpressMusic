# Music Upload Feature - XpressMusic

## Overview
Your XpressMusic player now supports uploading and playing user's own music files! The files are stored temporarily in the browser's memory and will work as long as the page is open.

## Features Added

### 1. **Upload Button**
- A new upload button has been added to the top bar (next to the playlist button)
- Click the upload icon to select music files from your device
- Supports multiple file selection

### 2. **Supported Audio Formats**
- MP3
- WAV
- OGG
- M4A
- FLAC
- Any other audio format supported by your browser

### 3. **Automatic Metadata Extraction**
The player automatically extracts:
- Song title
- Artist name
- Album name
- Year
- Album artwork (if available in the file)

Uses the **jsmediatags** library for reading ID3 tags from audio files.

### 4. **Visual Feedback**
- Toast notifications show upload progress and success/error messages
- Upload button opacity changes during upload
- Success/error messages with different colors

### 5. **Dynamic Playlist**
- Uploaded songs are automatically added to the playlist
- Playlist updates in real-time
- Uploaded songs appear alongside the 3 demo songs
- All player features work with uploaded songs (shuffle, repeat, skip, etc.)

## How to Use

1. **Start the web server** (if not already running):
   ```bash
   python3 -m http.server 8000
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

3. **Upload music**:
   - Click the upload button (📁 icon) in the top bar
   - Select one or multiple audio files
   - Wait for the upload to complete
   - Your songs will appear in the playlist!

4. **Play your music**:
   - Click the playlist button to see all songs
   - Click on any song to play it
   - Use all controls (play/pause, skip, shuffle, repeat, volume)

## Technical Details

### Files Modified:
1. **index.html**
   - Added upload button in top bar
   - Added hidden file input
   - Added toast notification container
   - Included jsmediatags library for metadata extraction

2. **script.js**
   - Changed `musicData` from const to let for dynamic updates
   - Added file upload handler
   - Added metadata extraction function
   - Added playlist rebuild function
   - Added toast notification system
   - Updated playlist item handling for dynamic content

3. **style.css**
   - Added toast notification styles
   - Success/error color variants

### Browser Storage
- Files are stored using **Blob URLs** (Object URLs)
- Temporary storage - persists only while page is open
- No server upload required
- No data leaves your device

### Memory Considerations
- Each uploaded file creates a Blob URL in memory
- Files remain in memory until page refresh
- For large collections, consider memory limitations
- Recommended: Upload music as needed, not entire library at once

## Limitations

1. **Temporary Storage**: Uploaded files are lost on page refresh
2. **Memory Constraints**: Very large files or many files may impact performance
3. **No Persistence**: Files are not saved to disk or server
4. **Browser Dependent**: Some audio formats may not work in all browsers

## Future Enhancements (Possible)

- **LocalStorage/IndexedDB**: Persist uploaded music across sessions
- **Playlist Management**: Create, save, and load custom playlists
- **File Management**: Remove individual songs from the list
- **Drag & Drop**: Drag files directly onto the player
- **Queue Management**: Add songs to a play queue
- **Search/Filter**: Search through your music library

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Requires a modern browser with support for:
- File API
- Blob URLs
- ES6+ JavaScript
- HTML5 Audio

---

**Enjoy your personalized music experience with XpressMusic!** 🎵
