const API_KEY = "AIzaSyCBfDADtsOWAQDQimJaeC1iabphTH0f2Hk";
const videosContainer = document.getElementById("videos");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  videosContainer.innerHTML = "<p>Loading...</p>";

  
  fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${query}&type=video&part=snippet&maxResults=6`)
    .then(res => res.json())
    .then(data => {
      videosContainer.innerHTML = "";

      data.items.forEach(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.medium.url;

       
        fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=contentDetails`)
          .then(res => res.json())
          .then(detailsData => {
            const durationISO = detailsData.items[0]?.contentDetails?.duration || "PT0S";
            const duration = formatDuration(durationISO);

            videosContainer.innerHTML += `
  <div class="col-md-4 mb-4">
    <div class="card shadow">
      <img src="${thumbnail}" class="card-img-top">
      <div class="card-body">
        <h6>${title}</h6>
        <span class="video-duration">${duration}</span>
        <a href="video.html?v=${videoId}" class="btn btn-danger mt-2">Watch</a>
      </div>
    </div>
  </div>
`;
          })
          .catch(err => console.error("Details Error:", err));
      });
    })
    .catch(err => console.error("Search Error:", err));
});

function formatDuration(iso) {
  const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return `${hours ? hours + "h " : ""}${minutes ? minutes + "m " : ""}${seconds ? seconds + "s" : ""}`;
}