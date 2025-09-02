import os
import ssl
import certifi
from flask import Flask, render_template, request, send_from_directory, jsonify
from pytubefix import YouTube, Playlist

ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())

app = Flask(__name__)
DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# ---------------- ROUTES ----------------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/download_video", methods=["POST"])
def download_video():
    data = request.get_json()
    url = data.get("url")
    quality = data.get("quality")

    if not url:
        return jsonify({"status": "error", "message": "No URL provided"}), 400

    try:
        yt = YouTube(url)
        stream = None

        if quality == "audio":
            stream = yt.streams.filter(only_audio=True).first()
        elif quality == "highest":
            stream = yt.streams.get_highest_resolution()
        else:
            stream = yt.streams.filter(res=quality, progressive=True).first()

        if not stream:
            return jsonify({"status": "error", "message": f"No stream available for {quality}"}), 404

        filename = stream.default_filename
        stream.download(output_path=DOWNLOAD_FOLDER, filename=filename)

        return jsonify({"status": "success", "title": yt.title, "filename": filename})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/download_playlist", methods=["POST"])
def download_playlist():
    data = request.get_json()
    url = data.get("url")
    quality = data.get("quality")

    if not url:
        return jsonify({"status": "error", "message": "No URL provided"}), 400

    try:
        pl = Playlist(url)
        downloaded = []

        for yt in pl.videos:
            stream = None
            if quality == "audio":
                stream = yt.streams.filter(only_audio=True).first()
            elif quality == "highest":
                stream = yt.streams.get_highest_resolution()
            else:
                stream = yt.streams.filter(res=quality, progressive=True).first()

            if stream:
                filename = stream.default_filename
                stream.download(output_path=DOWNLOAD_FOLDER, filename=filename)
                downloaded.append({"title": yt.title, "filename": filename})

        return jsonify({"status": "success", "playlist": pl.title, "videos": downloaded})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/get_file/<filename>")
def get_file(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
