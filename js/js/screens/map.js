/**
 * 공간(현재는 꼬비의 서재) 클리어 후 보여주는 지도 화면.
 * 실제 서비스에서는 STATE.spaceName / STATE.nextSpaceName 값을
 * 전체 36개 공간 리스트에서 순서대로 넘겨주면 됨(현재는 5개 조선 공간 예시).
 */
function renderMap(container, options = {}) {
  const { onBack, onOpenWrongNote, onEnterSpace, justCollectedRelic } = options;
  const bubbleFace = justCollectedRelic ? ASSETS.images.kkobiMapHappy : ASSETS.images.kkobiMapFace;
  const bubbleText = justCollectedRelic
    ? "정말 잘했네!<br>자, 이제 다음 서재로 출발해보세!"
    : "자네라면 5개의 서재를<br>통과할 수 있을 걸세. 힘내시게!";
  container.innerHTML = `
    <div class="screen" style="min-height:100vh; min-height:100dvh; padding:26px 6px 16px; display:flex;
         flex-direction:column; align-items:center; position:relative;
         background-image: linear-gradient(rgba(40,34,20,.32), rgba(40,34,20,.42)), url('${ASSETS.images.mapBg}');
         background-size:cover; background-position:center top; background-attachment:fixed;">

      ${
        onBack
          ? `<div id="map-back-btn" style="position:absolute; top:32px; right:14px; z-index:10; cursor:pointer;
               width:38px; height:38px; border-radius:50%; background:rgba(0,0,0,0.4);
               border:2px solid #e3c878;
               display:flex; align-items:center; justify-content:center;">
               <svg width="14" height="14" viewBox="0 0 14 14">
                 <line x1="2" y1="2" x2="12" y2="12" stroke="#e3c878" stroke-width="1.8" stroke-linecap="round"/>
                 <line x1="12" y1="2" x2="2" y2="12" stroke="#e3c878" stroke-width="1.8" stroke-linecap="round"/>
               </svg>
             </div>`
          : ""
      }

      <div style="width:100%; max-width:340px; display:flex; align-items:center; gap:10px; margin-bottom:14px; padding:0 4px;">
        <div id="chest-group" style="display:flex; align-items:center; flex-shrink:0; cursor:pointer;">
          <img src="${ASSETS.images.chestIcon}" style="width:50px; height:50px; object-fit:contain; display:block;
               position:relative; z-index:2; margin-right:-16px;
               filter: drop-shadow(1px 1px 0 #241c14) drop-shadow(-1px -1px 0 #241c14);">
          <div class="capsule" style="font-size:15px; height:38px; padding:0 12px 0 20px; gap:2px;
               background:rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,.25);
               box-shadow:0 2px 6px rgba(0,0,0,0.35);">
            <b style="color:var(--brass-light); font-size:17px; line-height:1;">${STATE.spaceProgress}</b>
            <span style="color:#fff; line-height:1;">&nbsp;/ ${STATE.spaceTotal}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; flex-shrink:0; gap:6px;">
          <div id="wrongnote-btn" style="width:34px; height:34px; border-radius:50%; border:2px solid #e3c878;
               display:flex; align-items:center; justify-content:center; cursor:pointer;">
            <svg width="20" height="18" viewBox="0 0 20 18">
              <path d="M2 3 C2 3 6 2 9 4 L9 16 C6 14 2 15 2 15 Z" fill="none" stroke="#e3c878" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M18 3 C18 3 14 2 11 4 L11 16 C14 14 18 15 18 15 Z" fill="none" stroke="#e3c878" stroke-width="1.6" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="capsule" style="font-size:15px; height:38px; padding:0 12px 0 16px; gap:2px;
               background:rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,.25);
               box-shadow:0 2px 6px rgba(0,0,0,0.35);">
            <b style="color:var(--brass-light); font-size:17px; line-height:1;">${STATE.wrongCount}</b>
          </div>
        </div>
      </div>

      <div class="stage" style="position:relative; width:100%; max-width:340px; height:600px;">
        <svg width="340" height="600" style="position:absolute; top:0; left:0; z-index:0;">
          <path d="M 78 46 L 262 46 L 262 136 L 78 136 L 78 226"
                fill="none" stroke="#4a3324" stroke-width="9" stroke-linecap="round"/>
        </svg>

        ${mapNode({ left: 14, top: 16, idx: 0 })}
        ${mapNode({ left: 198, top: 16, idx: 1 })}
        ${mapNode({ left: 198, top: 106, idx: 2 })}
        ${mapNode({ left: 14, top: 106, idx: 3 })}
        ${mapNode({ left: 14, top: 196, idx: 4 })}

        <div style="position:absolute; left:20px; right:20px; top:320px; z-index:4;">
          <div style="position:relative; background:rgba(45,58,72,0.6); backdrop-filter:blur(3px);
                      border:2px solid rgba(255,255,255,.25); border-radius:22px; padding:56px 18px 18px;
                      box-shadow:0 10px 24px rgba(0,0,0,.5); text-align:center;">
            <div style="position:absolute; top:-46px; left:50%; transform:translateX(-50%);
                        width:96px; height:96px; border-radius:50%; border:4px solid var(--brass);
                        overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,.4);">
              <img src="${bubbleFace}" alt="꼬비" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="font-size:15.5px; font-weight:800; color:var(--text); line-height:1.6;">
              ${bubbleText}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  if (onBack) {
    container.querySelector("#map-back-btn").addEventListener("click", () => {
      onBack();
    });
  }
  container.querySelector("#chest-group").addEventListener("click", () => {
    showRelicDogam(container);
  });
  container.querySelector("#wrongnote-btn").addEventListener("click", () => {
    if (onOpenWrongNote) onOpenWrongNote();
  });
  const currentNode = container.querySelector(`#space-node-${STATE.currentSpaceIndex}`);
  if (currentNode && onEnterSpace) {
    currentNode.addEventListener("click", () => {
      SOUND.play("click");
      onEnterSpace();
    });
  }
}

function mapNode({ left, top, idx }) {
  const name = STATE.spaceOrder[idx];
  const state = idx < STATE.currentSpaceIndex ? "done" : idx === STATE.currentSpaceIndex ? "current" : "locked";
  const isLocked = state === "locked";
  const isDone = state === "done";
  const isCurrent = state === "current";

  const faceStyle = isLocked
    ? "background:linear-gradient(180deg,#a89e8c 0%,#8a7f6f 55%,#675e50 100%); border-color:#3d382f;"
    : `background:linear-gradient(180deg,#e3c878 0%,var(--brass) 55%,var(--brass-dark) 100%); border-color:${
        isCurrent ? "var(--gold)" : "var(--wood-line)"
      };`;

  const glow = isCurrent
    ? `animation:unlockGlow 1.1s ease-in-out infinite;`
    : "";

  const badge = isDone
    ? `<div style="position:absolute; top:-9px; right:-6px; width:24px; height:24px; border-radius:50%;
         background:#8bc24a; border:2px solid #5e8c2e; display:flex; align-items:center;
         justify-content:center; z-index:3;">
         <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7.5L5.5 11L12 3.5"
           fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
       </div>`
    : isLocked
    ? `<div style="position:absolute; top:-13px; right:-10px; font-size:26px; z-index:3;
         filter:drop-shadow(1.3px 0 0 var(--wood-line)) drop-shadow(-1.3px 0 0 var(--wood-line))
         drop-shadow(0 1.3px 0 var(--wood-line)) drop-shadow(0 -1.3px 0 var(--wood-line));">🔒</div>`
    : "";

  return `
    <div id="space-node-${idx}" style="position:absolute; left:${left}px; top:${top}px; width:138px; height:60px;
         ${isCurrent ? "cursor:pointer;" : ""}">
      ${badge}
      <div style="position:absolute; inset:0; top:5px; border-radius:15px; background:#6e551f;"></div>
      <div style="position:absolute; inset:0; bottom:5px; border-radius:15px; border:3px solid;
                  display:flex; align-items:center; justify-content:center; ${faceStyle} ${glow}">
        <div style="font-size:17px; font-weight:900;
             color:${isLocked ? "#3d3830" : isCurrent ? "#ffffff" : "var(--ink)"};
             text-align:center;">${name}</div>
      </div>
    </div>
  `;
}

if (typeof module !== "undefined") module.exports = { renderMap };
