export function FlashContainer({ flashMsg = null }) {
  return (
    <div id="flash-container">
      {flashMsg && (
        <p>
          {flashMsg.Error instanceof Array ? flashMsg.Error[0] : flashMsg.Error}
        </p>
      )}
    </div>
  );
}
