import { useState } from "react";

import SceneStart from "./scenes/SceneStart";
import SceneBirthday from "./scenes/SceneBirthday";
import SceneMaze from "./scenes/SceneMaze";
import SceneVideo from "./scenes/SceneVideo";

type Scene = "start" | "birthday" | "maze" | "video";

export default function App() {

  const [scene, setScene] = useState<Scene>("start");

  return (
    <>
      {scene === "start" && (
        <SceneStart onYes={() => setScene("birthday")} />
      )}

      {scene === "birthday" && (
        <SceneBirthday onNext={() => setScene("maze")} />
      )}

      {scene === "maze" && (
        <SceneMaze onWin={() => setScene("video")} />
      )}

      {scene === "video" && (
      <SceneVideo onDone={() => {}} />
      )}
    </>
  );
}