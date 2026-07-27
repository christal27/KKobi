/**
 * 10문제 채웠을 때 1회 뜨는 팝업.
 * onContinue: [이어하기] -> 문제화면으로 복귀
 * onQuit: [그만하기] -> 인트로 화면으로 복귀
 */
function renderSessionBreak(container, { onContinue, onQuit }) {
  const overlay = document.createElement("div");
  overlay.className = "dim-overlay";
  overlay.innerHTML = `
    <div style="position:relative; background:var(--panel); border:2px solid rgba(255,255,255,.16);
                border-radius:24px; padding:64px 22px 24px; width:100%; max-width:360px;
                box-shadow:0 14px 34px rgba(0,0,0,.55); text-align:center;">
      <div style="position:absolute; top:-56px; left:50%; transform:translateX(-50%);
                  width:120px; height:120px; border-radius:50%; border:4px solid var(--brass);
                  overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,.4);">
        <img src="${ASSETS.images.kkobiSurprise}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div style="margin-top:26px; font-size:19px; font-weight:800; line-height:1.6;">
        오! 벌써 오늘의 단어패를<br>모두 찾았군!<br>더 찾아볼텐가?
      </div>
      <div style="display:flex; gap:12px; margin-top:24px;">
        <button id="quit-btn" class="btn-secondary" style="flex:1; padding:16px 0; font-size:17px;">그만하기</button>
        <button id="continue-btn" class="btn-primary" style="flex:1; padding:16px 0; font-size:17px;">이어하기</button>
      </div>
    </div>
  `;
  container.appendChild(overlay);

  overlay.querySelector("#continue-btn").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
    onContinue();
  });
  overlay.querySelector("#quit-btn").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
    onQuit();
  });
}

if (typeof module !== "undefined") module.exports = { renderSessionBreak };
