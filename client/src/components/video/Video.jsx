import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./Video.css";

export default function Video({ src, reels }) {
  const videoPlayerRef = useRef(null);

  const videoJSOptions = {
    muted: localStorage.getItem("muted") === "true",
    autoplay: false,
    controls: true,
    loop: true,
  };

  useEffect(() => {
    if (videoPlayerRef) {
      const player = videojs(videoPlayerRef.current, videoJSOptions, () => {
        player.src(src);
      });
    }

    return () => {};
  });

  useEffect(() => {
    if (!reels) {
      let options = {
        rootMargin: "0px",
        threshold: [0.25, 0.75],
      };

      let handlePlay = (entries, observer) => {
        try {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              videoPlayerRef.current.play();
            } else {
              videoPlayerRef.current.pause();
            }
          });
        } catch (err) {}
      };

      let observer = new IntersectionObserver(handlePlay, options);

      observer.observe(videoPlayerRef.current);
    }
  });

  const handleMute = (e) => {
    var isMuted = videojs(e.target.id).player().muted();
    if ((localStorage.getItem("muted") === "true") !== isMuted) {
      localStorage.setItem("muted", isMuted);
      var videos = document.querySelectorAll('video[id^="video"]');
      [...videos].map((video) => videojs(video.id).player().muted(isMuted));
    }
  };

  return (
    <video
      id={"video" + Math.floor(Math.random() * 100000)}
      ref={videoPlayerRef}
      className="video-js postVid  vjs-big-play-button vjs-sublime-skin "
      preload="metadata"
      controls
      onVolumeChange={(e) => handleMute(e)}
    />
  );
}
