'use strict';



/**
 * all music information
 */

let musicData = [
  {
    backgroundImage: "./assets/images/poster-1.jpg",
    posterUrl: "./assets/images/poster-1.jpg",
    title: "Rocketeer",
    album: "Free Wired",
    year: 2010,
    artist: "Ryan Tedder ft. Far East Movement",
    musicPath: "./assets/music/music-1.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-2.jpg",
    posterUrl: "./assets/images/poster-2.jpg",
    title: "Sunshine Love",
    album: "LaRoxx Project",
    year: 2012,
    artist: "Dave LaRoxx",
    musicPath: "./assets/music/music-2.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-3.jpg",
    posterUrl: "./assets/images/poster-3.jpg",
    title: "What is Love (Remix)",
    album: "IBIZA Summer Party",
    year: 2018,
    artist: "VDJ Smile",
    musicPath: "./assets/music/music-3.mp3",
  },
  // {
  //   backgroundImage: "./assets/images/poster-4.jpg",
  //   posterUrl: "./assets/images/poster-4.jpg",
  //   title: "blank",
  //   album: "blank",
  //   year: 2012,
  //   artist: "blank",
  //   musicPath: "./assets/music/music-4.mp3",
  // },
  // {
  //   backgroundImage: "./assets/images/poster-5.jpg",
  //   posterUrl: "./assets/images/poster-5.jpg",
  //   title: "blank",
  //   album: "blank",
  //   year: 2012,
  //   artist: "blank",
  //   musicPath: "./assets/music/music-5.mp3",
  // },
];



/**
 * FILE UPLOAD HANDLER
 * 
 * Handle user uploaded music files
 */

const uploadBtn = document.querySelector("[data-upload-btn]");
const fileInput = document.getElementById("musicFileInput");

// Toast notification function
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

uploadBtn.addEventListener("click", function() {
  fileInput.click();
});

fileInput.addEventListener("change", async function(e) {
  const files = Array.from(e.target.files);
  
  if (files.length === 0) return;

  // Show loading state
  uploadBtn.style.opacity = "0.5";
  showToast(`Uploading ${files.length} file(s)...`, 'info');
  
  let successCount = 0;
  
  for (const file of files) {
    if (!file.type.startsWith('audio/')) {
      console.warn(`Skipped non-audio file: ${file.name}`);
      continue;
    }
    
    // Create object URL for the audio file
    const objectURL = URL.createObjectURL(file);
    
    // Extract metadata using jsmediatags or simple file info
    const musicInfo = await extractMusicMetadata(file, objectURL);
    
    // Add to musicData array
    musicData.push(musicInfo);
    successCount++;
  }
  
  if (successCount > 0) {
    // Rebuild playlist
    rebuildPlaylist();
    
    // Show success notification
    showToast(`${successCount} song(s) added successfully!`, 'success');
  } else {
    showToast('No valid audio files found', 'error');
  }
  
  // Reset file input
  fileInput.value = "";
  uploadBtn.style.opacity = "1";
});

/**
 * Extract metadata from audio file
 */
async function extractMusicMetadata(file, objectURL) {
  // Get basic file info
  const fileName = file.name.replace(/\.(mp3|wav|ogg|m4a|flac)$/i, '');
  
  // Try to extract metadata using jsmediatags if available
  // For now, we'll use basic file information
  const defaultPoster = generateGradientPoster(fileName); // Generate gradient instead of using default
  
  return new Promise((resolve) => {
    // Try to load ID3 tags if jsmediatags is available
    if (window.jsmediatags) {
      window.jsmediatags.read(file, {
        onSuccess: function(tag) {
          const tags = tag.tags;
          let posterUrl = defaultPoster;
          
          // Extract album art if available
          if (tags.picture) {
            const picture = tags.picture;
            const blob = new Blob([new Uint8Array(picture.data)], { type: picture.format });
            posterUrl = URL.createObjectURL(blob);
          }
          
          resolve({
            backgroundImage: posterUrl,
            posterUrl: posterUrl,
            title: tags.title || fileName,
            album: tags.album || "Uploaded Music",
            year: tags.year || new Date().getFullYear(),
            artist: tags.artist || "Unknown Artist",
            musicPath: objectURL,
            isUserUploaded: true,
            hasCustomArt: !!tags.picture
          });
        },
        onError: function() {
          // Fallback to basic info with gradient
          resolve({
            backgroundImage: defaultPoster,
            posterUrl: defaultPoster,
            title: fileName,
            album: "Uploaded Music",
            year: new Date().getFullYear(),
            artist: "Unknown Artist",
            musicPath: objectURL,
            isUserUploaded: true,
            hasCustomArt: false
          });
        }
      });
    } else {
      // No metadata library available, use basic info with gradient
      resolve({
        backgroundImage: defaultPoster,
        posterUrl: defaultPoster,
        title: fileName,
        album: "Uploaded Music",
        year: new Date().getFullYear(),
        artist: "Unknown Artist",
        musicPath: objectURL,
        isUserUploaded: true,
        hasCustomArt: false
      });
    }
  });
}

/**
 * Generate a gradient poster with song title overlay
 */
function generateGradientPoster(title) {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  
  // Generate colors based on title
  const colors = generateColorsFromString(title);
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, colors[1]);
  gradient.addColorStop(1, colors[2]);
  
  // Fill background with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add glow effect overlay (radial gradient from center)
  const glowGradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 100,
    canvas.width / 2, canvas.height / 2, 500
  );
  glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  glowGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add decorative circles for visual interest
  for (let i = 0; i < 5; i++) {
    const x = (Math.sin(i * 1.2) * 200) + canvas.width / 2;
    const y = (Math.cos(i * 1.5) * 200) + canvas.height / 2;
    const radius = 50 + (i * 20);
    
    const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    circleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = circleGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add dark overlay at top for title readability
  const topGradient = ctx.createLinearGradient(0, 0, 0, 250);
  topGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  topGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGradient;
  ctx.fillRect(0, 0, canvas.width, 250);
  
  // Draw title text with shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap the title if too long
  const maxWidth = canvas.width - 100;
  const lines = wrapText(ctx, title, maxWidth, 56);
  const lineHeight = 70;
  const startY = 80 + ((lines.length - 1) * lineHeight / 2);
  
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
  });
  
  // Reset shadow for music icon
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 2;
  
  // Add music note icon at bottom
  ctx.font = '80px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('♪', canvas.width / 2, canvas.height - 80);
  
  // Convert to blob URL
  return canvas.toDataURL('image/png');
}

/**
 * Generate colors from string (deterministic)
 */
function generateColorsFromString(str) {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate 3 colors with good contrast
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 120) % 360;
  const hue3 = (hue1 + 240) % 360;
  
  return [
    `hsl(${hue1}, 70%, 50%)`,
    `hsl(${hue2}, 70%, 45%)`,
    `hsl(${hue3}, 70%, 55%)`
  ];
}

/**
 * Wrap text to fit within maxWidth
 */
function wrapText(ctx, text, maxWidth, fontSize = 48) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  
  // Limit to 2 lines and add ellipsis if needed
  if (lines.length > 2) {
    lines[1] = lines[1].substring(0, 25) + '...';
    return lines.slice(0, 2);
  }
  
  // If single line is too long, truncate it
  if (lines.length === 1 && ctx.measureText(lines[0]).width > maxWidth) {
    while (ctx.measureText(lines[0] + '...').width > maxWidth && lines[0].length > 0) {
      lines[0] = lines[0].substring(0, lines[0].length - 1);
    }
    lines[0] += '...';
  }
  
  return lines;
}

/**
 * Rebuild playlist with all music including uploaded ones
 */
function rebuildPlaylist() {
  const playlist = document.querySelector("[data-music-list]");
  playlist.innerHTML = "";
  
  for (let i = 0, len = musicData.length; i < len; i++) {
    playlist.innerHTML += `
    <li>
      <button class="music-item ${i === currentMusic ? "playing" : ""}" data-playlist-toggler data-playlist-item="${i}">
        <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title} Album Poster"
          class="img-cover">

        <div class="item-icon">
          <span class="material-symbols-rounded">equalizer</span>
        </div>
      </button>
    </li>
    `;
  }
  
  // Re-attach event listeners to new playlist items
  const playlistItems = document.querySelectorAll("[data-playlist-item]");
  
  addEventOnElements(playlistItems, "click", function () {
    lastPlayedMusic = currentMusic;
    currentMusic = Number(this.dataset.playlistItem);
    changePlaylistItem();
  });
  
  addEventOnElements(playlistItems, "click", changePlayerInfo);
}



/**
 * add eventListnere on all elements that are passed
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PLAYLIST
 * 
 * add all music in playlist, from 'musicData'
 */

const playlist = document.querySelector("[data-music-list]");

// Initial playlist build
function initPlaylist() {
  for (let i = 0, len = musicData.length; i < len; i++) {
    playlist.innerHTML += `
    <li>
      <button class="music-item ${i === 0 ? "playing" : ""}" data-playlist-toggler data-playlist-item="${i}">
        <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title} Album Poster"
          class="img-cover">

        <div class="item-icon">
          <span class="material-symbols-rounded">equalizer</span>
        </div>
      </button>
    </li>
    `;
  }
}

initPlaylist();



/**
 * PLAYLIST MODAL SIDEBAR TOGGLE
 * 
 * show 'playlist' modal sidebar when click on playlist button in top app bar
 * and hide when click on overlay or any playlist-item
 */

const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
}

addEventOnElements(playlistTogglers, "click", togglePlaylist);



/**
 * PLAYLIST ITEM
 * 
 * remove active state from last time played music
 * and add active state in clicked music
 */

let playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems = document.querySelectorAll("[data-playlist-item]"); // Re-query in case list changed
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
}

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});



/**
 * PLAYER
 * 
 * change all visual information on player, based on current music
 */

const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const audioSource = new Audio(musicData[currentMusic].musicPath);

const changePlayerInfo = function () {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${musicData[currentMusic].title} Album Poster`);
  document.body.style.backgroundImage = `url(${musicData[currentMusic].backgroundImage})`;
  playerTitle.textContent = musicData[currentMusic].title;
  playerAlbum.textContent = musicData[currentMusic].album;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;

  audioSource.src = musicData[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
}

addEventOnElements(playlistItems, "click", changePlayerInfo);

/** update player duration */
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/** pass seconds and get timcode formate */
const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - (minutes * 60));
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
}

const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
}

audioSource.addEventListener("loadeddata", updateDuration);



/**
 * PLAY MUSIC
 * 
 * play and pause music when click on play button
 */

const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
}

playBtn.addEventListener("click", playMusic);


/** update running time while playing music */

const playerRunningTime = document.querySelector("[data-running-time");

const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
}



/**
 * RANGE FILL WIDTH
 * 
 * change 'rangeFill' width, while changing range value
 */

const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
}

addEventOnElements(ranges, "input", updateRangeFill);



/**
 * SEEK MUSIC
 * 
 * seek music while changing player seek range
 */

const seek = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
}

playerSeekRange.addEventListener("input", seek);



/**
 * END MUSIC
 */

const isMusicEnd = function () {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
}



/**
 * SKIP TO NEXT MUSIC
 */

const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? currentMusic = 0 : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipNextBtn.addEventListener("click", skipNext);



/**
 * SKIP TO PREVIOUS MUSIC
 */

const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? currentMusic = musicData.length - 1 : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
}

playerSkipPrevBtn.addEventListener("click", skipPrev);



/**
 * SHUFFLE MUSIC
 */

/** get random number for shuffle */
const getRandomMusic = () => Math.floor(Math.random() * musicData.length);

const shuffleMusic = () => currentMusic = getRandomMusic();

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  playerShuffleBtn.classList.toggle("active");

  isShuffled = isShuffled ? false : true;
}

playerShuffleBtn.addEventListener("click", shuffle);



/**
 * REPEAT MUSIC
 */

const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
}

playerRepeatBtn.addEventListener("click", repeat);



/**
 * MUSIC VOLUME
 * 
 * increase or decrease music volume when change the volume range
 */

const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
}

playerVolumeRange.addEventListener("input", changeVolume);


/**
 * MUTE MUSIC
 */

const muteVolume = function () {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
}

playerVolumeBtn.addEventListener("click", muteVolume);



/**
 * GRADIENT VISUALIZATION
 * 
 * Animated gradient background visualization
 */

const gradientCanvas = document.getElementById('gradientCanvas');
const gradientCtx = gradientCanvas ? gradientCanvas.getContext('2d') : null;

if (gradientCanvas && gradientCtx) {
  // Set canvas size
  function resizeCanvas() {
    gradientCanvas.width = window.innerWidth;
    gradientCanvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Gradient visualization particles
  class GradientParticle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * gradientCanvas.width;
      this.y = Math.random() * gradientCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 150 + 100;
      this.hue = Math.random() * 360;
      this.saturation = 70 + Math.random() * 30;
      this.lightness = 40 + Math.random() * 20;
      this.alpha = 0.3 + Math.random() * 0.3;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off edges
      if (this.x < -this.radius || this.x > gradientCanvas.width + this.radius) {
        this.vx *= -1;
      }
      if (this.y < -this.radius || this.y > gradientCanvas.height + this.radius) {
        this.vy *= -1;
      }
      
      // Slowly shift hue
      this.hue = (this.hue + 0.1) % 360;
    }
    
    draw() {
      const gradient = gradientCtx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      
      gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`);
      gradient.addColorStop(0.5, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha * 0.5})`);
      gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
      
      gradientCtx.fillStyle = gradient;
      gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
    }
  }
  
  // Create particles
  const particles = [];
  const particleCount = 5;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new GradientParticle());
  }
  
  // Animation loop
  function animateGradient() {
    // Clear canvas with fade effect
    gradientCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animateGradient);
  }
  
  // Start animation
  animateGradient();
  
  // Enhance visualization when music is playing
  let visualizationInterval;
  
  const enhanceVisualization = function() {
    if (!audioSource.paused) {
      // Add pulse effect based on audio
      particles.forEach(particle => {
        particle.alpha = 0.4 + Math.random() * 0.2;
      });
    }
  };
  
  // Update visualization with music
  audioSource.addEventListener('play', function() {
    visualizationInterval = setInterval(enhanceVisualization, 200);
  });
  
  audioSource.addEventListener('pause', function() {
    clearInterval(visualizationInterval);
  });
}