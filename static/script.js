function showTab(tab) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  
    document.getElementById(tab + "-tab").classList.add("active");
    document.querySelector(`.tab-btn[onclick="showTab('${tab}')"]`).classList.add("active");
  }
  
  async function downloadVideo() {
    const url = document.getElementById("video-url").value;
    const quality = document.getElementById("video-quality").value;
    const status = document.getElementById("video-status");
  
    status.textContent = "⏳ Downloading...";
    try {
      const res = await fetch("/download_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, quality })
      });
      const data = await res.json();
  
      if (data.status === "success") {
        status.innerHTML = `✅ ${data.title}<br><a href="/get_file/${data.filename}">Download File</a>`;
      } else {
        status.textContent = "❌ " + data.message;
      }
    } catch (err) {
      status.textContent = "❌ " + err.message;
    }
  }
  
  async function downloadPlaylist() {
    const url = document.getElementById("playlist-url").value;
    const quality = document.getElementById("playlist-quality").value;
    const status = document.getElementById("playlist-status");
  
    status.textContent = "⏳ Downloading playlist...";
    try {
      const res = await fetch("/download_playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, quality })
      });
      const data = await res.json();
  
      if (data.status === "success") {
        let links = data.videos.map(v => `<li><a href="/get_file/${v.filename}">${v.title}</a></li>`).join("");
        status.innerHTML = `✅ Playlist: ${data.playlist}<br><ul>${links}</ul>`;
      } else {
        status.textContent = "❌ " + data.message;
      }
    } catch (err) {
      status.textContent = "❌ " + err.message;
    }
  }
  