export function FlashContainer({ flashMsg = null }) {
  console.log(flashMsg);
  return (
    <div id="flash-container">
      <p>{flashMsg && flashMsg.message}</p>
    </div>
  );
}
