"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const videoSrc = "/video/upscale.mp4";

export default function Upscale() {
  const upscaleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let objectUrl: string | null = null;
    let isCancelled = false;

    fetch(videoSrc)
      .then((res) => res.blob())
      .then((blob) => {
        if (isCancelled || !videoRef.current) return;
        objectUrl = URL.createObjectURL(blob);
        videoRef.current.src = objectUrl;
        videoRef.current.load();

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (!videoRef.current) return;
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
              ScrollTrigger.refresh();
            })
            .catch(() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            });
        }
      })
      .catch(() => {
        if (videoRef.current) {
          videoRef.current.src = videoSrc;
          videoRef.current.load();
        }
      });

    return () => {
      isCancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useGSAP(
    () => {
      const section = upscaleRef.current;
      const video = videoRef.current;

      if (!section || !video) return;

      let targetTime = 0;

      const requestFrameUpdate = () => {
        if (!video.duration || Number.isNaN(video.duration)) return;

        if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.01) {
          video.currentTime = targetTime;
        }
      };

      const onSeeked = () => {
        if (Math.abs(video.currentTime - targetTime) > 0.01) {
          video.currentTime = targetTime;
        }
      };

      const onLoadedMetadata = () => {
        ScrollTrigger.refresh();
      };

      video.addEventListener("seeked", onSeeked);
      video.addEventListener("loadedmetadata", onLoadedMetadata);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=350%", 
        pin: true,
        scrub: true,
        refreshPriority: -1, 
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (video.duration && !Number.isNaN(video.duration)) {
            targetTime = self.progress * video.duration;
            requestFrameUpdate();
          }
        },
      });

      return () => {
        st.kill();
        video.removeEventListener("seeked", onSeeked);
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      };
    },
    { scope: upscaleRef }
  );

  return (
    <section className={styles.upscale} ref={upscaleRef}>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          preload="auto"
        />
      </div>
    </section>
  );
}