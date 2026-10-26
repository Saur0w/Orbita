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

  // 1. Preload entire video into memory as a Blob
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let objectUrl: string | null = null;
    let isCancelled = false;

    fetch(videoSrc)
      .then((res) => res.blob())
      .then((blob) => {
        if (isCancelled || !video) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      })
      .catch(() => {
        if (!isCancelled && video) {
          video.src = videoSrc;
          video.load();
        }
      });

    return () => {
      isCancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // 2. Sync ScrollTrigger to GSAP's RAF ticker
  useGSAP(
    () => {
      const section = upscaleRef.current;
      const video = videoRef.current;

      if (!section || !video) return;

      let targetTime = 0;
      let isUnlocked = false;

      // Unlock hardware decoder once metadata is ready
      const unlockVideo = () => {
        if (isUnlocked) return;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              video.pause();
              video.currentTime = targetTime;
              isUnlocked = true;
              ScrollTrigger.refresh();
            })
            .catch(() => {
              isUnlocked = true;
            });
        }
      };

      const onLoadedMetadata = () => {
        unlockVideo();
        ScrollTrigger.refresh();
      };

      if (video.readyState >= 1) {
        onLoadedMetadata();
      } else {
        video.addEventListener("loadedmetadata", onLoadedMetadata, {
          once: true,
        });
      }

      // Tick on every animation frame instead of chaining "seeked" events
      const syncVideoFrame = () => {
        if (!video.duration || Number.isNaN(video.duration)) return;

        if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.008) {
          video.currentTime = targetTime;
        }
      };

      gsap.ticker.add(syncVideoFrame);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=350%",
        pin: true,
        scrub: 0.4, // Smooths out discrete mouse-wheel ticks
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (video.duration && !Number.isNaN(video.duration)) {
            // Clamp slightly below duration so EOF never flushes the video decoder
            targetTime = Math.min(
              video.duration - 0.05,
              Math.max(0, self.progress * video.duration)
            );
          }
        },
      });

      return () => {
        st.kill();
        gsap.ticker.remove(syncVideoFrame);
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
          disablePictureInPicture
          disableRemotePlayback
        />
      </div>
    </section>
  );
}