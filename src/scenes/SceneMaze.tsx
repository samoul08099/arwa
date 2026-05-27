
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onWin: () => void;
}

// 0 = path, 1 = wall, 2 = goal
const MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
  [1,1,1,1,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,1,0,1,0,0,0,1],
  [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
  [1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const ROWS = MAZE.length;
const COLS = MAZE[0].length;
const START = { row: 1, col: 1 };

// Pixel-art girl sprite using canvas-drawn approach via CSS
function AnaisSprite({ facing }: { facing: "up"|"down"|"left"|"right" }) {
  const flip = facing === "right";
  return (
    <div className="pixel-walk w-full h-full flex items-center justify-center"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <svg viewBox="0 0 16 24" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
        {/* Hair */}
        <rect x="4" y="0" width="8" height="2" fill="#b45309"/>
        <rect x="3" y="1" width="10" height="3" fill="#b45309"/>
        <rect x="3" y="4" width="1" height="3" fill="#b45309"/>
        <rect x="12" y="4" width="1" height="3" fill="#b45309"/>
        {/* Face */}
        <rect x="4" y="2" width="8" height="7" fill="#fcd9b0"/>
        {/* Eyes */}
        <rect x="5" y="5" width="2" height="2" fill="#1a1a2e"/>
        <rect x="9" y="5" width="2" height="2" fill="#1a1a2e"/>
        <rect x="5" y="5" width="1" height="1" fill="#60a5fa"/>
        <rect x="9" y="5" width="1" height="1" fill="#60a5fa"/>
        {/* Smile */}
        <rect x="6" y="7" width="4" height="1" fill="#e87874"/>
        <rect x="5" y="8" width="1" height="1" fill="#e87874"/>
        <rect x="10" y="8" width="1" height="1" fill="#e87874"/>
        {/* Bow */}
        <rect x="4" y="0" width="3" height="2" fill="#ec4899"/>
        <rect x="9" y="0" width="3" height="2" fill="#ec4899"/>
        <rect x="6" y="1" width="4" height="1" fill="#f472b6"/>
        {/* Body/dress */}
        <rect x="4" y="9" width="8" height="8" fill="#7c3aed"/>
        {/* Collar */}
        <rect x="5" y="9" width="6" height="2" fill="#a78bfa"/>
        {/* Arms */}
        <rect x="1" y="9" width="3" height="5" fill="#fcd9b0"/>
        <rect x="12" y="9" width="3" height="5" fill="#fcd9b0"/>
        {/* Skirt */}
        <rect x="3" y="15" width="10" height="3" fill="#8b5cf6"/>
        <rect x="2" y="17" width="12" height="1" fill="#7c3aed"/>
        {/* Legs */}
        <rect x="5" y="18" width="2" height="4" fill="#fcd9b0"/>
        <rect x="9" y="18" width="2" height="4" fill="#fcd9b0"/>
        {/* Shoes */}
        <rect x="4" y="22" width="4" height="2" fill="#1e1b4b"/>
        <rect x="8" y="22" width="4" height="2" fill="#1e1b4b"/>
      </svg>
    </div>
  );
}

function GoalSprite() {
  return (
    <div className="w-full h-full flex items-center justify-center"
      style={{ animation: "pulseGreen 1s ease-in-out infinite" }}>
      <span style={{ fontSize: "1.1em", filter: "drop-shadow(0 0 4px gold)" }}>🎂</span>
    </div>
  );
}

export default function SceneMaze({ onWin }: Props) {
  const [pos, setPos] = useState(START);
  const [facing, setFacing] = useState<"up"|"down"|"left"|"right">("down");
  const [won, setWon] = useState(false);
  const [steps, setSteps] = useState(0);
  const [pressed, setPressed] = useState<string>("");
  const pressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canMove = (row: number, col: number) =>
    row >= 0 && row < ROWS && col >= 0 && col < COLS && MAZE[row][col] !== 1;

  const move = useCallback((dir: "up"|"down"|"left"|"right") => {
    if (won) return;
    setFacing(dir);
    setPos((p) => {
      const next = {
        up: { row: p.row - 1, col: p.col },
        down: { row: p.row + 1, col: p.col },
        left: { row: p.row, col: p.col - 1 },
        right: { row: p.row, col: p.col + 1 },
      }[dir];
      if (!canMove(next.row, next.col)) return p;
      setSteps((s) => s + 1);
      if (MAZE[next.row][next.col] === 2) {
        setTimeout(() => setWon(true), 200);
      }
      return next;
    });
  }, [won]);

  const flashPress = (dir: string) => {
    setPressed(dir);
    if (pressRef.current) clearTimeout(pressRef.current);
    pressRef.current = setTimeout(() => setPressed(""), 200);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, "up"|"down"|"left"|"right"> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        w: "up", s: "down", a: "left", d: "right",
        W: "up", S: "down", A: "left", D: "right",
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); move(dir); flashPress(dir); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  // Responsive cell size
  const cellSize = Math.min(
    Math.floor((typeof window !== "undefined" ? Math.min(window.innerWidth * 0.98, 900) : 480) / COLS),
    Math.floor((typeof window !== "undefined" ? Math.min(window.innerHeight * 0.72, 700) : 340) / ROWS)
  );

  const wallColors = ["#2d1b69", "#1e1b4b", "#312e81"];

  return (
    <div className={`scene-enter relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none ${won ? "win-flash" : ""}`}
      style={{ background: "linear-gradient(160deg, #0f0a1e 0%, #1a0a2e 60%, #0a1a1e 100%)" }}>

      {/* Pixel stars bg */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              top: `${(i * 17 + 3) % 98}%`,
              left: `${(i * 31 + 5) % 96}%`,
              opacity: 0.2 + (i % 4) * 0.1,
            }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-2 px-2">
        <h2 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(8px, 2.5vw, 13px)",
          color: "#c084fc",
          textShadow: "0 0 8px #c084fc",
          lineHeight: 2,
        }}>
          🕹 Anais's Maze 🕹
        </h2>
        <p style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "clamp(6px, 1.8vw, 9px)",
          color: "#7dd3fc",
          lineHeight: 1.8,
        }}>
          Help Anais reach the 🎂! Steps: {steps}
        </p>
      </div>

      {/* Maze Grid */}
      <div className="relative z-10 mb-3"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
          border: "3px solid #7c3aed",
          boxShadow: "0 0 20px #7c3aed88, 0 0 40px #7c3aed44",
        }}>
        {MAZE.map((row, ri) =>
          row.map((cell, ci) => {
            const isPlayer = pos.row === ri && pos.col === ci;
            const isGoal = cell === 2 && !isPlayer;
            const wallVariant = ((ri * 3 + ci * 7) % 3);
            return (
              <div key={`${ri}-${ci}`}
                className="maze-cell"
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: cell === 1
                    ? wallColors[wallVariant]
                    : cell === 2
                    ? "#1a0a2e"
                    : ri % 2 === ci % 2 ? "#0f0a1e" : "#12102a",
                  borderRight: cell === 1 ? "1px solid #3730a3" : undefined,
                  borderBottom: cell === 1 ? "1px solid #3730a3" : undefined,
                  position: "relative",
                  overflow: "hidden",
                }}>
                {/* Wall texture */}
                {cell === 1 && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `repeating-linear-gradient(
                      90deg,
                      transparent 0px,
                      transparent ${cellSize - 2}px,
                      rgba(99,102,241,0.15) ${cellSize - 2}px,
                      rgba(99,102,241,0.15) ${cellSize}px
                    )`,
                  }} />
                )}
                {/* Path dots */}
                {cell === 0 && !isPlayer && (
                  <div style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: Math.max(2, cellSize * 0.12),
                    height: Math.max(2, cellSize * 0.12),
                    borderRadius: "50%",
                    background: "#4338ca",
                    opacity: 0.4,
                  }} />
                )}
                {isGoal && <GoalSprite />}
                {isPlayer && (
                  <div style={{ position: "absolute", inset: 0 }}>
                    <AnaisSprite facing={facing} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* D-Pad Controls */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <button className={`btn-ctrl ${pressed === "up" ? "pressed" : ""}`}
          onPointerDown={() => { move("up"); flashPress("up"); }}>▲</button>
        <div className="flex gap-1">
          <button className={`btn-ctrl ${pressed === "left" ? "pressed" : ""}`}
            onPointerDown={() => { move("left"); flashPress("left"); }}>◀</button>
          <div className="btn-ctrl" style={{ background: "#374151", cursor: "default" }}>
            <span style={{ fontSize: 14, opacity: 0.5 }}>✦</span>
          </div>
          <button className={`btn-ctrl ${pressed === "right" ? "pressed" : ""}`}
            onPointerDown={() => { move("right"); flashPress("right"); }}>▶</button>
        </div>
        <button className={`btn-ctrl ${pressed === "down" ? "pressed" : ""}`}
          onPointerDown={() => { move("down"); flashPress("down"); }}>▼</button>
      </div>

      {/* Win overlay */}
      {won && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
          <div className="text-center px-6" style={{ animation: "fadeInScale 0.5s ease" }}>
            <div style={{ fontSize: "clamp(32px, 10vw, 56px)" }}>🎉</div>
            <h2 className="text-rainbow mt-2" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(11px, 3.5vw, 18px)",
              lineHeight: 2,
            }}>
              Anais made it!
            </h2>
            <p style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(7px, 2vw, 10px)",
              color: "#facc15",
              lineHeight: 2,
            }}>
              {steps} steps — amazing! 🌸
            </p>
            <button className="btn-glow-green mt-6 px-8 py-4 rounded-xl text-white"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(9px, 2.5vw, 13px)" }}
              onClick={onWin}>
              🎵 Celebrate!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}