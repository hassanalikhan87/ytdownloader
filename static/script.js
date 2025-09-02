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
        status.innerHTML = `✅ ${result.title}<br><a href="/get_file/${result.filename}">Click to save</a>`;
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
  