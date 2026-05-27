type Props = {
  onYes: () => void;
};

export default function SceneStart({ onYes }: Props) {
  return (
    <div className="screen">
      <img src="/sora1.jfif" className="main-image" />

      <div className="overlay" />

      <div className="content">
        <h1 className="title">
          IS IT YOUR BIRTHDAY?
        </h1>

        <div className="buttons">
          <button className="yes-btn" onClick={onYes}>
            YES
          </button>

          <button className="no-btn">
            NO
          </button>
        </div>
      </div>
    </div>
  );
}