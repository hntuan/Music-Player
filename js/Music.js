
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBTn = $('.btn-repeat')
const playlist = $('.playlist')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [
        {
            name: "Despacito",
            singer: "Luis Fonsi",
            path: "./Music/Despacito.mp3",
            image: "./img/img-despacito.jpg"
        },   
        {
            name: "Faded",
            singer: "Alan Walker",
            path: "./Music/Faded.mp3",
            image: "./img/img-faded.jpg"
        },  
        {
            name: "I-MV",
            singer: "Tae Yeon",
            path: "./Music/I-MV.mp3",
            image: "./img/img-i.jpg"
        },   
        {
            name: "Shape Of You",
            singer: "Ed Sheeran",
            path: "./Music/Shape of You.mp3",
            image: "./img/img-shape.jpg"
        },    
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: "./Music/Sugar.mp3",
            image: "./img/img-sugar.jpg"
        },
        {
            name: "Despacito",
            singer: "Luis Fonsi",
            path: "./Music/Despacito.mp3",
            image: "./img/img-despacito.jpg"
        },   
        {
            name: "Faded",
            singer: "Alan Walker",
            path: "./Music/Faded.mp3",
            image: "./img/img-faded.jpg"
        },  
        {
            name: "I-MV",
            singer: "Tae Yeon",
            path: "./Music/I-MV.mp3",
            image: "./img/img-i.jpg"
        },   
        {
            name: "Shape Of You",
            singer: "Ed Sheeran",
            path: "./Music/Shape of You.mp3",
            image: "./img/img-shape.jpg"
        },    
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: "./Music/Sugar.mp3",
            image: "./img/img-sugar.jpg"
        },
   
           
    ],
        
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index =" ${index}">
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
             `
        })
        playlist.innerHTML = htmls.join('')

    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        //xử lý Cd quay / dừng
         const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lý phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function(){
            if (_this.isPlaying){              
                audio.pause()
            }else{
                audio.play()
            }
        }

        //khi song đc play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //xử lý khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

        }

        //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        //khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()  
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lý bật tắt random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
      
        }

        //xử lý lặp lại 1 song
        repeatBTn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBTn.classList.toggle('active', _this.isRepeat)

        }

        //xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
            
        }

        //lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')){
               //xửu lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    
                }
                //xửu lý khi click vào option
                if(e.target.closest('.option')){

                }

            }

        }
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        },500)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },

    nextSong: function() {
        this.currentIndex++
        if( this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if( this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex) 
        
        this.currentIndex = newIndex
        this.loadCurrentSong()  
    },

    start: function(){
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //định nghiz các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe / xử lý các sự kiện DOM event
        this.handleEvents();

        //tải thông tin bài hát đâu tiên vào khi chạy
        this.loadCurrentSong();
        
        //render playlist
        this.render();

        //hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBTn.classList.toggle('active', this.isRepeat)

    }
}

app.start();  