async function previewVideo() {
    const url = document.getElementById("url").value;
    const preview = document.getElementById("preview");
    const title = document.getElementById("video-title");
    const thumbnail = document.getElementById("thumbnail");
  
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      preview.classList.add("hidden");
      return;
    }
  
    // Extract video ID
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      thumbnail.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      title.textContent = "Preview loaded";
      preview.classList.remove("hidden");
    }
  }
  
  async function downloadVideo() {
    const url = document.getElementById("url").value;
    const format = document.querySelector('input[name="format"]:checked').value;
    const status = document.getElementById("status");
    const progressBar = document.getElementById("progress-bar");
    const progressFill = document.getElementById("progress-fill");
  
    if (!url) {
      status.textContent = "⚠️ Please enter a YouTube URL";
      status.style.color = "red";
      return;
    }
  
    status.textContent = "⏳ Preparing download...";
    status.style.color = "black";
    progressBar.style.display = "block";
    progressFill.style.width = "30%";
  
    try {
      const response = await fetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format })
      });
  
      const result = await response.json();
  
      if (result.status === "success") {
        progressFill.style.width = "100%";
        status.innerHTML = `✅ ${result.title}<br><a href="/get_file/${result.filename}" class="btn small">💾 Save file</a>`;
        status.style.color = "green";
      } else {
        status.textContent = "❌ Error: " + result.message;
        status.style.color = "red";
      }
    } catch (err) {
      status.textContent = "❌ Request failed: " + err.message;
      status.style.color = "red";
    }
  }
  