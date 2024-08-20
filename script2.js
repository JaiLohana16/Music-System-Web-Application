let currentsong = new Audio()
let songs;
function secondtominutes(totalseconds) {
    if (isNaN(totalseconds) || totalseconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(totalseconds / 60)
    const remainingSeconds = Math.floor(totalseconds % 60)

    const formattedminutes = String(minutes).padStart(2, '0')
    const formattedseconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedminutes}:${formattedseconds}`
}
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/spotify%20clone/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])          }

    }
    return songs
}

const playmusic = (track) => {
    // let audio=new Audio("/Spotify Clone/songs/"+track+".mp3")
    currentsong.src = "/Spotify Clone/songs/" + track + ".mp3"
    currentsong.play()
    play.src = "pause.svg" 
    document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(".mp3", " ")
    document.querySelector(".songtimer").innerHTML = `00:00/00:00`

}
async function main() {

    songs = await getsongs()

    console.log(songs) 
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
 
    songs.forEach(element => {
        songul.innerHTML = songul.innerHTML +
            `<li> 
               <img src="music.svg" alt="" style="width: 25px;" class="invert">
                <span class="info">${element.replaceAll("%20", " ").replaceAll(".mp3", " ")}</span>
                <div class="playnow">
                <span>Play Now</span>
                <img src="playpause.svg" alt="" width="25px" class="invert">
                </div>  
                </li>`
            });

    // Eventlistener for each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", ele => {
            // console.log(element.querySelector(".info").innerHTML)
            playmusic(element.querySelector(".info").innerHTML.trim())
        })
    })
    // Event listener for play next and previous    
    play.addEventListener("click", () => {
        if (currentsong.paused) {     //.paused .play() inbuilt functions are there 
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }

    })

    next.addEventListener("click", () => {
        console.log(currentsong)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(index)
        console.log(songs.length)
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1].replace(".mp3", ""))
        }
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playmusic(songs[index - 1].replace(".mp3", ""))
        }
    })

    // Listen for Time Update event
    currentsong.addEventListener("timeupdate", () => {  // timeupdate is an event inbuilt 
       
        document.querySelector(".songtimer").innerHTML = `${secondtominutes(currentsong.currentTime)}/${secondtominutes(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })
    // Add an event listener to seek bar    
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
        
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    range.addEventListener("change", (e) => {
        // console.log(e)
        currentsong.volume = parseInt(e.target.value) / 100
      
    })
}
main()
