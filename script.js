
let currentSong = new Audio();
let songs;
//  conversion second to minumte
function convertSecondsToMMSS(seconds) {
  if(isNaN(seconds) || seconds < 0){
    return "00:00"
  }
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  let formattedMinutes = minutes.toString().padStart(2, '0');
  let formattedSeconds = secs.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
//  songs function
async function getSongs(folder = "/songs/Romantic") {
    let a = await fetch(`http://127.0.0.1:3000${folder}`)
    let response = await a.text()
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songList = []
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
        songList.push(element.href)
      }
    }
    return songList;

}
//  folder function
async function getFolder() {
   let a = await fetch(`http://127.0.0.1:3000/songs/`)
  let response = await a.text()
  let cardContainer = document.querySelector(".cardCollections")
  let div = document.createElement("div")
  div.innerHTML = response
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if(element.href.includes("/songs")){
      let folder = element.href.split("/").slice(-2)[0]
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
  let response = await a.json()
    cardContainer.innerHTML += ` <div data-folder="${folder}" class="cards">
                            <img src="songs/${folder}/cover.jpg" alt="">
                             <div class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <h3>${response.title}</h3>
                            <p>${response.description}</p>
                        </div>`
    }
  }

}

async function main() {
  await getFolder() 
  const playsong = ((track, pause = false) => {
    currentSong.src = track
    if (pause == false ) {
      currentSong.play()
      play.src = "images/pause.svg"
    } else {
      play.src = "images/play.svg"
  }
  let fileName = decodeURIComponent(track.split("/").pop().replace(".mp3", ""));
    document.querySelector(".songInfo").innerHTML = fileName;
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
  })
  
  play.addEventListener("click", (() => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "images/pause.svg"
    } else {
      currentSong.pause()
      play.src = "images/play.svg"
    }
  }))
  // for default folder songs
  songs =  await getSongs()
  playsong(songs[0], true)
      let div = document.querySelector(".songList").getElementsByTagName("ol")[0]
      div.innerHTML = ""
    for (let index = 0; index < songs.length; index++) {
      const element = songs[index];
      let fileName = decodeURIComponent(element.split("/").pop().replace(".mp3", ""));
      div.innerHTML = div.innerHTML + `<li>
                       <img src="images/musicIcon.svg" width="20px" class="invert" alt="">
                  <div>
                  <p>${fileName}</p>
                  </div>
                  <div>
                  <p><b>Play now</b></p>
                  <img class="invert" src="images/play.svg" alt="">
                     </div>
                  </li> `
    }
     let lis = document.querySelector(".songList").getElementsByTagName("li")
Array.from(lis).forEach((e, i) => {
  e.addEventListener("click", (() => {
    playsong(songs[i]);
  }));
});

    // for update time
  currentSong.addEventListener("timeupdate", (() => {
    document.querySelector(".songTime").innerHTML = `${convertSecondsToMMSS(currentSong.currentTime)}/${convertSecondsToMMSS(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
  }))
  // for seekbar movement
  document.querySelector(".seekbar").addEventListener("click", ((e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = (currentSong.duration * percent) / 100
  }))
  // for hamburgur icon
  document.querySelector(".hamburgur").addEventListener("click", (() => {
    let leftIcon = document.querySelector(".left")
    if (leftIcon.style.left ==  "0%") {
      leftIcon.style.left = "-120%"
      document.querySelector(".hamburgur").getElementsByTagName("img")[0].src = "images/hamburgur.svg"
    } else {
      leftIcon.style.left = "0%"
      document.querySelector(".hamburgur").getElementsByTagName("img")[0].src = "images/cross.svg"
    }
  }))
 previous.addEventListener("click", () => {
   let index = songs.indexOf(currentSong.src)
   if(index > 0){
   playsong(songs[index - 1])
   }
})  
 next.addEventListener("click", () => {
   let index = songs.indexOf(currentSong.src)
   if(index < songs.length - 1 ){
    playsong(songs[index+1])
   }
}) 
 
  Array.from(document.getElementsByClassName("cards")).forEach(e =>{
    e.addEventListener("click", async (item)=>{
      songs =  await getSongs(`/songs/${item.currentTarget.dataset.folder}/`)
       playsong(songs[0])
      let div = document.querySelector(".songList").getElementsByTagName("ol")[0]
      div.innerHTML = ""
    for (let index = 0; index < songs.length; index++) {
      const element = songs[index];
      let fileName = decodeURIComponent(element.split("/").pop().replace(".mp3", ""));
      div.innerHTML = div.innerHTML + `<li>
                       <img src="images/musicIcon.svg" width="20px" class="invert" alt="">
                  <div>
                  <p>${fileName}</p>
                  </div>
                  <div>
                  <p><b>Play now</b></p>
                  <img class="invert" src="images/play.svg" alt="">
                     </div>
                  </li> `
    }
    Array.from(lis).forEach((e, i) => {
  e.addEventListener("click", (() => {
    playsong(songs[i]);
  }));
});
    })
  })

}
main()
