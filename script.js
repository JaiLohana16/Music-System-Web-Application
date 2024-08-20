let currentsong = new Audio()
let songs;
let curFolder;
console.log(currentsong)
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
async function getsongs(folder) {
    curFolder=folder
    let a = await fetch (`http://127.0.0.1:3000/Spotify%20Clone/songs/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`http://127.0.0.1:3000/Spotify%20Clone/songs/${folder}/`)[1])  //splits into two parts one before the word songs and other after it and so we have then selected the second part using [1] 
        }

    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // console.log(songul.innerHTML)
    songul.innerHTML=""
    songs.forEach(element => {
        songul.innerHTML = songul.innerHTML +
            `<li> 
               <img src="music.svg" alt="" style="width: 25px;" class="invert">
                <span class="info">${element.replaceAll("%20"," ").replaceAll(".mp3","")}</span>
                <div class="playnow">
                <span>Play Now</span>
                <img src="playpause.svg" alt="" width="25px" class="invert">
                </div>  
                </li>`
        // songul.innerhtml= songul.innerhtml is done so what that is doing is ke 2nd li laga raha hai 2nd turn main toh 1st wala apne jagha rakhna hai ote sirf last wala print hoga na so phele wala and then phele wala + new li added          
        // .replaceall .mp3 jo kiya hai woh sirf show ke liye yahan kiya hai ya toh sirf yahan se show ke liye hataoge toh baki sab jagha pe jahan link de rahe hai wahan pe end main .mp3 dena padega
    });

    // Eventlistener for each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", ele => {
            // console.log(element.querySelector(".info").innerHTML)
            playmusic(element.querySelector(".info").innerHTML.trim())
        })
    })


}

const playmusic = (track) => {
    // let audio=new Audio("/Spotify Clone/songs/"+track+".mp3")
    currentsong.src = `http://127.0.0.1:3000/Spotify Clone/songs/${curFolder}/` + track + ".mp3"
    currentsong.play()
    play.src = "pause.svg" // when we target an element which has an id then we can target that directly like this
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtimer").innerHTML = `00:00/00:00`

}
async function main() {

    await getsongs("Love")
    // songs is defined as an global variable at the starting 
    console.log(songs) // an array having names of songs only


    
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
        console.log(currentsong)//returns audio element <audio preload="auto" src="/Spotify Clone/songs/Raataan%20Lambiyan.mp3"> <audio>
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        // http: , spotify clone , songs like this the src is splitted then we slice and take the last element which is song name.mp3 then it returns an array and [0] gives the name only which we want theennnnnn in the songs all that we have we ask that tell mus what is the index of this particular song from all the songs so suppose it tells it is 3 so we do index+1 and then play that song 
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
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtimer").innerHTML = `${secondtominutes(currentsong.currentTime)}/${secondtominutes(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })
    // Add an event listener to seek bar    
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
        // lets suppose we click on seekbar on a place where e.offsetX is 100 and total width of target is 1000 suppose so percent =10 now that means that song 10% chala hai so mathematically if we think of a song that hsas total duration of 180seconds so we have clicked on seek bar over a place which takes to 10% and song then should be at 18 seconds so if we calculate that using currentsong.currentTime=(180*10)/100 will give 18 seconds which is also exactly 10% of 180 seconds //


        // Also can make formula from above also
        // document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%"
        // ALSO
        // document.querySelector(".circle").style.left=percent+"%"
        // so percent+"%"=(currentsong.currentTime/currentsong.duration)*100 +"%"
        // so (perent*currentsong.duration)/100=currentsong.currentTime
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
        // e.target.value will return from 0 to 100 depending on where we have put the seekbar of volume range and then /100 so then output will become between 0 to 1 range and the .volume is inbuilt method to control sound and its between 0 and 1
    })
    
    Array.from(document.getElementsByClassName("card")).forEach(element=>{
        // for each lagana tha but for each array pe lagege collection par nahi es liye array.from kiya uss se array ban gaya 
        
        element.addEventListener("click",async item=>{
            let trial=item.currentTarget.dataset.folder
            await getsongs(trial)
            console.log(songs)
            playmusic(songs[0].replaceAll("%20"," ").replace(".mp3", ""))   
             
        })
    })
}
main()