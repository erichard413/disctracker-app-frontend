export function FlashContainer({ flashMsg = null }) {
  return (
    <div id="flash-container">
      <p>{flashMsg && flashMsg.message}</p>
    </div>
  );
}
