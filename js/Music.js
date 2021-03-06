
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

        //x??? l?? Cd quay / d???ng
         const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //X??? l?? ph??ng to thu nh??? CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //X??? l?? khi click play
        playBtn.onclick = function(){
            if (_this.isPlaying){              
                audio.pause()
            }else{
                audio.play()
            }
        }

        //khi song ??c play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi song b??? pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //x??? l?? khi tua song
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

        //x??? l?? b???t t???t random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
      
        }

        //x??? l?? l???p l???i 1 song
        repeatBTn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBTn.classList.toggle('active', _this.isRepeat)

        }

        //x??? l?? next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
            
        }

        //l???ng nghe h??nh vi click v??o playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')){
               //x???u l?? khi click v??o song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    
                }
                //x???u l?? khi click v??o option
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
        //G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig()

        //?????nh nghiz c??c thu???c t??nh cho object
        this.defineProperties();

        //L???ng nghe / x??? l?? c??c s??? ki???n DOM event
        this.handleEvents();

        //t???i th??ng tin b??i h??t ????u ti??n v??o khi ch???y
        this.loadCurrentSong();
        
        //render playlist
        this.render();

        //hi???n th??? tr???ng th??i ban ?????u c???a button repeat v?? random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBTn.classList.toggle('active', this.isRepeat)

    }
}

app.start();  