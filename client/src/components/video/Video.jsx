import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./Video.css";

export default function Video({ src }) {
  const videoPlayerRef = useRef(null);

  const videoJSOptions = {
    muted: false,
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
  });

  return (
    <video
      id={Date.now().toString()}
      ref={videoPlayerRef}
      className="video-js postVid vjs-big-play-button vjs-sublime-skin "
      preload="metadata"
      controls
    />
  );
}
