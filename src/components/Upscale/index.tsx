"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TOTAL_FRAMES = 361;

interface UpscaleProps {
  totalFrames?: number;
  frameStep?: number;
  scrollDistance?: string;
  children?: ReactNode;
}

const getFrameSrc = (frameNumber: number) =>
  `/images/frames/frame_${String(frameNumber).padStart(4, "0")}.webp`;

function buildFrameNumbers(total: number, step: number): number[] {
  const safeStep = Math.max(1, Math.floor(step));
  const list: number[] = [];
  for (let i = 1; i <= total; i += safeStep) {
    list.push(i);
  }
  if (list[list.length - 1] !== total) {
    list.push(total);
  }
  return list;
}

export default function Upscale({
  totalFrames = TOTAL_FRAMES,
  frameStep = 1,
  scrollDistance = "+=350%",
  children,
}: UpscaleProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const playheadRef = useRef({ index: 0 });
  const lastDrawnRef = useRef<number>(-1);

  const renderFrame = (targetIndex: number, force = false) => {
    const frames = imagesRef.current;
    if (frames.length === 0) return;

    const clamped = Math.max(0, Math.min(targetIndex, frames.length - 1));
    if (!force && clamped === lastDrawnRef.current) return;

    let img = frames[clamped];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < frames.length; offset++) {
        const prev = frames[clamped - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = frames[clamped + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastDrawnRef.current = clamped;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d", { alpha: false });
    let isCancelled = false;

    const frameNumbers = buildFrameNumbers(totalFrames, frameStep);
    const count = frameNumbers.length;
    const slots: (HTMLImageElement | null)[] = new Array(count).fill(null);
    imagesRef.current = slots;

    const syncCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      renderFrame(Math.round(playheadRef.current.index), true);
    };

    const loadSlot = (slotIdx: number) =>
      new Promise<void>((resolve) => {
        if (slots[slotIdx] || isCancelled) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.src = getFrameSrc(frameNumbers[slotIdx]);
        img.onload = () => {
          if (isCancelled) return;
          slots[slotIdx] = img;
          if (slotIdx === 0) renderFrame(0, true);
          resolve();
        };
        img.onerror = () => resolve();
      });

    const loadProgressively = async () => {
      await loadSlot(0);
      const keyframeIndices: number[] = [];
      for (let i = 8; i < count; i += 8) keyframeIndices.push(i);
      if (keyframeIndices[keyframeIndices.length - 1] !== count - 1) {
        keyframeIndices.push(count - 1);
      }

      for (let i = 0; i < keyframeIndices.length; i += 16) {
        if (isCancelled) return;
        await Promise.all(keyframeIndices.slice(i, i + 16).map(loadSlot));
      }

      const remaining: number[] = [];
      for (let i = 1; i < count; i++) {
        if (!slots[i]) remaining.push(i);
      }

      for (let i = 0; i < remaining.length; i += 20) {
        if (isCancelled) return;
        await Promise.all(remaining.slice(i, i + 20).map(loadSlot));
      }
    };

    syncCanvasSize();
    loadProgressively();

    window.addEventListener("resize", syncCanvasSize);
    return () => {
      isCancelled = true;
      window.removeEventListener("resize", syncCanvasSize);
    };
  }, [totalFrames, frameStep]);

  useGSAP(
    () => {
      const sampledCount = buildFrameNumbers(totalFrames, frameStep).length;
      playheadRef.current.index = 0;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: scrollDistance,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.05,
          invalidateOnRefresh: true,
        },
      });

      tl.to(playheadRef.current, {
        index: sampledCount - 1,
        snap: "index",
        ease: "none",
        duration: 0.85,
        onUpdate: () => {
          renderFrame(Math.round(playheadRef.current.index));
        },
      });

      tl.to(
        {},
        {
          duration: 0.15,
          onStart: () => renderFrame(sampledCount - 1, true),
        }
      );
    },
    { scope: sectionRef, dependencies: [totalFrames, frameStep, scrollDistance] }
  );

  return (
    <section ref={sectionRef} className={styles.upscaleSection}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {children && <div className={styles.overlay}>{children}</div>}
    </section>
  );
}