import { useEffect, useRef, useState } from "react";

interface Props {
  onDone: () => void;
}

const VIDEOS = [
  {
    src: "/arwa/video1.mp4",
    label: "🎉 A surprise for you!",
  },
  {
    src: "/arwa/video2.mp4",
    label: "🎵 Happy Birthday Arwa! 🎵",
  },
];

export default function SceneVideo({ onDone }: Props) {

  const [videoIndex, setVideoIndex] = useState(0);

  const [loaded, setLoaded] = useState(false);

  const [transitioning, setTransitioning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isLast = videoIndex === VIDEOS.length - 1;

  const current = VIDEOS[videoIndex];

  const goNext = () => {

    if (transitioning) return;

    if (isLast) {

      onDone();

    } else {

      setTransitioning(true);

      setLoaded(false);

      setTimeout(() => {

        setVideoIndex((i) => i + 1);

        setTransitioning(false);

      }, 400);

    }

  };

  useEffect(() => {

    setLoaded(false);

  }, [videoIndex]);

  const enableSound = async () => {

    const video = videoRef.current;

    if (!video) return;

    try {

      video.muted = false;

      video.volume = 1;

      await video.play();

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div
      className="scene-enter relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        background:
          "linear-gradient(135deg, #1a0533 0%, #0d0d2b 60%, #0a1f0a 100%)",
      }}
    >

      {/* Stars background */}

      <div className="absolute inset-0 pointer-events-none">

        {Array.from({ length: 30 }).map((_, i) => (

          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              top: `${(i * 17 + 3) % 98}%`,
              left: `${(i * 31 + 5) % 96}%`,
              opacity: 0.3 + (i % 4) * 0.15,
            }}
          />

        ))}

      </div>

      {/* Label */}

      <div className="relative z-10 text-center mb-4 px-4">

        <h2
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(9px, 2.8vw, 14px)",
            color: "#facc15",
            textShadow:
              "0 0 10px #facc15, 0 0 30px #facc1566",
            lineHeight: 2,
          }}
        >
          {current.label}
        </h2>

      </div>

      {/* VIDEO */}

      <div
        className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400 bg-black"
        style={{
          width: "min(500px, 94vw)",
          height: "88vh",
          opacity: transitioning ? 0 : loaded ? 1 : 0.4,
          transition: "opacity 0.4s",
        }}
      >

        <video
          ref={videoRef}
          src={current.src}
          controls
          playsInline
          autoPlay
          className="w-full h-full object-contain bg-black"

          onLoadedData={async (e) => {

            setLoaded(true);

            const video = e.currentTarget;

            try {

              video.muted = false;

              video.volume = 1;

              await video.play();

            } catch (err) {

              console.log(err);

            }

          }}

          onClick={enableSound}

          onEnded={() => {

            if (videoIndex === 0) {

              goNext();

            }

          }}
        />

        {!loaded && (

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "#0d0d2b",
            }}
          >

            <span
              style={{
                fontSize: 36,
                animation:
                  "pulseGreen 1s ease-in-out infinite",
              }}
            >
              🎵
            </span>

          </div>

        )}

      </div>

      {/* BUTTONS */}

      <div className="relative z-10 flex gap-4 mt-5">

        {!isLast ? (

          <button
            className="btn-glow-green px-8 py-3 rounded-xl text-white"
            style={{
              fontFamily:
                "'Press Start 2P', monospace",

              fontSize:
                "clamp(8px, 2.5vw, 12px)",
            }}
            onClick={goNext}
          >
            Next 🎵
          </button>

        ) : (

          <button
            className="btn-glow-green px-8 py-3 rounded-xl text-white"
            style={{
              fontFamily:
                "'Press Start 2P', monospace",

              fontSize:
                "clamp(8px, 2.5vw, 12px)",
            }}
            onClick={onDone}
          >
            🔁 Play Again
          </button>

        )}

      </div>

      <div className="relative z-10 mt-4 text-center px-4">

        <p
          style={{
            fontFamily:
              "'Press Start 2P', monospace",

            fontSize:
              "clamp(6px, 1.8vw, 9px)",

            color: "#f9a8d4",

            lineHeight: 2,
          }}
        >
          🔊 Tap video once if sound is blocked
        </p>

      </div>

    </div>

  );

}