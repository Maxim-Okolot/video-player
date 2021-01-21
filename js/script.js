"use strict";
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');
const video = document.getElementById("video-player");
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const buttonPlay = document.getElementById("button-play");
const playbackAnimation = document.getElementById('playback-animation');
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');
const playerWindow = document.getElementById('player-window');
const btnAriaPlay = document.getElementById('play-aria');
const btnFullScreenAria = document.getElementById('fullscreen-aria');
const titleWrap = document.getElementById('title-wrap');
const controlsWrap = document.getElementById('controls-wrap');
const durationBar = document.getElementById('durationBar');


function play() {
  if (video.paused) {
    video.play();
    buttonPlay.classList.remove("video-pause");
    btnAriaPlay.innerHTML = "Пауза (k)";
    animatePlayback();
    if (playbackAnimation.classList.contains("stop")) {
      playbackAnimation.classList.remove("stop");
      playbackAnimation.classList.add("play");
    } else {
      playbackAnimation.classList.add("stop");
      playbackAnimation.classList.remove("play");
    }
  } else {
    video.pause();
    buttonPlay.classList.add("video-pause");
    btnAriaPlay.innerHTML = "Смотреть (k)";
    animatePlayback();
    if (playbackAnimation.classList.contains("stop")) {
      playbackAnimation.classList.remove("stop");
      playbackAnimation.classList.add("play");
    } else {
      playbackAnimation.classList.add("stop");
      playbackAnimation.classList.remove("play");
    }
  }
}

function animatePlayback() {
  playbackAnimation.animate (
    [
      {
        opacity: 1,
        zIndex: 5,
        transform: 'scale(1)',
      },
      {
        opacity: 0,
        zIndex: 0,
        transform: 'scale(1.3)',
      },
    ],
    {
      duration: 500,
    }
  );
}

function progressUpdate() {
  // Заполняем полосу прогруженности видео
  video.addEventListener('progress', function () {
    let bufferedBar = document.getElementById('bufferedBar');
    if (video.duration > 0) {
      for (var i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
          bufferedBar.style.width = (video.buffered.end(video.buffered.length - 1 - i) / video.duration) * 100 + "%";
          break;
        }
      }
    }
  });
}

function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}

function skipAhead(event) {
  const skipTo = event.target.dataset.seek
    ? event.target.dataset.seek
    : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

function rangeVolume() {
  // получаем и сохраняем значение ползунка и сразу переводим в числовое значение
  let rangeVolumeValue = parseInt(document.getElementById("range-input").value);

  // расчитываем процентное соотношение текущего значения ползунка и его максимального значения
  let progressVolume = rangeVolumeValue * 10 + '%';

  // присваиваем процент длине линии закрашивающей ползунок
  document.getElementById("range-line").style.width = progressVolume;

  // присваиваем значение громкости видео
  video.volume = rangeVolumeValue / 10;
  let buttonVolume = document.getElementById("button-volume");
  if (rangeVolumeValue == 0) {
    buttonVolume.classList.add("volume-mutt");
    video.volume = 0;
  } else {
    buttonVolume.classList.remove("volume-mutt");
  }
}

function videoVolumeMutt() {
  let buttonVolume = document.getElementById("button-volume");

  if (buttonVolume.classList.contains("volume-mutt")) {
    video.volume = 1;
    document.getElementById("range-input").value = 10;
    rangeVolume();
    buttonVolume.classList.remove("volume-mutt");
  } else {
    document.getElementById("range-input").value = 0;
    rangeVolume();
    buttonVolume.classList.add("volume-mutt");
  }
}

function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}

function updateSeekTooltip(event) {
  const skipTo = Math.round(
    (event.offsetX / event.target.clientWidth) *
    parseInt(event.target.getAttribute('max'), 10)
  );

  seek.setAttribute('data-seek', skipTo);
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = playerWindow.getBoundingClientRect();
  seekTooltip.style.left = `${event.clientX - rect.left - 30}px`;
}

function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

function keyboardShortcuts(event) {
  const {key} = event;
  switch (key) {
    case 'k':
      play();
      animatePlayback();
      break;
    case 'm':
      videoVolumeMutt();
      break;
    case 'f':
      toggleFullScreen();
      break;
  }
}

function updateFullscreenButton() {
  fullscreenIcons.forEach((icon) => icon.classList.toggle('hidden'));

  if (document.fullscreenElement) {
    btnFullScreenAria.innerHTML = "Во весь экран (f)"
  } else {
    btnFullScreenAria.innerHTML = "Выход из полноэкранного режима (f)"
  }
}

function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    // Need this to support Safari
    document.webkitExitFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    // Need this to support Safari
    playerWindow.webkitRequestFullscreen();

  } else {
    playerWindow.requestFullscreen();
  }
}

let timeout;
function alive() {
  clearTimeout(timeout);
  titleWrap.classList.remove("hide");
  controlsWrap.classList.remove("hide");
  timeout = setTimeout(remind, 5000);
}

function remind() {
  titleWrap.classList.add("hide");
  controlsWrap.classList.add("hide");
}
timeout = setTimeout(remind, 5000);

function openSettings() {
  let windowSettings = document.getElementById("settings");
  if (windowSettings.classList.contains("active")) {
    windowSettings.classList.remove("active");
  } else {
    windowSettings.classList.add("active");
  }
}

function openSettingSpeed() {
  let videoSpeed = document.getElementById("video-speed");
  let videoQuality = document.getElementById("video-quality");

  if (videoSpeed.classList.contains("active")) {
    videoSpeed.classList.remove("active");
    videoQuality.classList.remove("hide");
  } else {
    videoSpeed.classList.add("active");
    videoQuality.classList.add("hide");
  }

}

function openSettingQuality() {
  let videoSpeed = document.getElementById("video-speed");
  let videoQuality = document.getElementById("video-quality");

  if (videoQuality.classList.contains("active")) {
    videoSpeed.classList.remove("hide");
    videoQuality.classList.remove("active");
  } else {
    videoSpeed.classList.add("hide");
    videoQuality.classList.add("active");
  }
}

function slowPlaySpeed() {
  let speedList = document.getElementsByClassName("speed-list__item");
  for (let i = 0; i < 3; i++) {
    speedList[i].classList.remove("active");
    speedList[0].classList.add("active");
  }
  video.playbackRate = 0.5;
}

function normalPlaySpeed() {
  video.playbackRate = 1;
  let speedList = document.getElementsByClassName("speed-list__item");
  for (let i = 0; i < 3; i++) {
    speedList[i].classList.remove("active");
    speedList[1].classList.add("active");
  }
}

function fastPlaySpeed() {
  video.playbackRate = 2;
  let speedList = document.getElementsByClassName("speed-list__item");
  for (let i = 0; i < 3; i++) {
    speedList[i].classList.remove("active");
    speedList[2].classList.add("active");
  }
}



video.addEventListener('loadedmetadata', initializeVideo);
document.addEventListener('mousemove', alive);
video.addEventListener('click', play);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateProgress);
seek.addEventListener('input', skipAhead);
seek.addEventListener('mousemove', updateSeekTooltip);
document.addEventListener('keyup', keyboardShortcuts);
video.addEventListener('click', play);
fullscreenButton.addEventListener('click', toggleFullScreen);
videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);
video.addEventListener('click', animatePlayback);
