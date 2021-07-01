// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "The Spectre",
      singer: "Alan Walker",
      path: "./music/the-spectre.mp3",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfdrDLHjL0mVz35cWspQhf-sEFAajkIlR7lg&usqp=CAU"
    },
    {
      name: "Disfigure",
      singer: "Blank",
      path: "./music/disfigure.mp3",
      image: "data:image/jpeg;base64,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"
    } 
    ,
    {
      name: "Heroes Tonight",
      singer: "Janji",
      path: "./music/hero-tonight.mp3",
      image: "data:image/jpeg;base64,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"
    }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    // Handles CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    // Handle when click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    // When the song is pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    // When the song progress changes
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    // Handling when seek
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    // When next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song
    // When prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    // Handling on / off random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý lặp lại một song
    // Single-parallel repeat processing
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    // Handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    // Listen to playlist clicks
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    // Assign configuration from config to application
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    // Defines properties for the object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    // Listening / handling events (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    // Load the first song information into the UI when running the app
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  }
};

app.start();
