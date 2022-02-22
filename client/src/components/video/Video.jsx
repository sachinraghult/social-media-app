import React, { useEffect, useRef } from "react";
import "./Video.css";

export default function Video({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let options = {
      rootMargin: "0px",
      threshold: [0.25, 0.75],
    };

    let handlePlay = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      });
    };

    let observer = new IntersectionObserver(handlePlay, options);

    observer.observe(videoRef.current);
  });

  return (
    <div className="App">
      <h1>Scroll Down</h1>
      <div className="container">
        <div className="video-container">
          <video
            id="my-video"
            class="video-js"
            controls
            preload="metadata"
            ref={videoRef}
            src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
          ></video>
        </div>
      </div>
    </div>
  );
}
