type Props = {
  onNext: () => void;
};

export default function SceneBirthday({ onNext }: Props) {
  return (
    <div className="screen">

      <img src="/sora2.jfif" className="main-image" />

      <div className="overlay" />

      <div className="content">
        <h1 className="happy-title">
          HAPPY BIRTHDAY ARWA 💖
        </h1>

        <button className="thanks-btn" onClick={onNext}>
          THANKS ✨
        </button>
      </div>
    </div>
  );
}