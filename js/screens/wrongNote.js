/**
 * 오답노트 화면: 지도화면의 책 아이콘을 누르면 뜨는 페이지.
 * 지금까지 틀린 단어들을 두루마리 배경 위에 깔끔하게 정리해서 보여준다.
 * onBack: 닫기(✕) 눌렀을 때 실행할 콜백 (router가 넘겨줌 — 어디서 열었는지에 따라 돌아갈 곳이 다름)
 */
function renderWrongNote(container, options = {}) {
  const { onBack } = options;
  const items = STATE.wrongWords.slice().reverse(); // 최근 오답이 위로

  const listHtml = items.length
    ? `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 8px;">
        ${items
          .map(
            (item) => `
          <div style="font-size:15px; font-weight:800; color:#333; text-align:center;
               padding:8px 4px; border-bottom:1px solid rgba(74,51,36,0.18);">${item.answer}</div>`
          )
          .join("")}
      </div>`
    : `<div style="text-align:center; color:var(--ink); opacity:.6; font-size:13.5px;
         margin-top:40%; line-height:1.7;">아직 틀린 단어가 없어요!<br>이대로만 쭉 가보자구~</div>`;

  container.innerHTML = `
    <div class="screen" style="background:var(--header); min-height:100vh; min-height:100dvh;
         display:flex; flex-direction:column; align-items:center; padding:26px 6px 30px; position:relative;">

      ${
        onBack
          ? `<div id="wrongnote-back-btn" style="position:absolute; top:14px; right:14px; z-index:10; cursor:pointer;
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

      <div style="position:relative; width:100%; max-width:340px; aspect-ratio:656/921; margin-top:20px;">
        <img src="${ASSETS.images.scrollBg}" style="position:absolute; inset:0; width:100%; height:100%;
             object-fit:fill; display:block; pointer-events:none;">

        <div style="position:absolute; left:16%; right:16%; top:17%; bottom:18%;
             display:flex; flex-direction:column; overflow:hidden;">
          <div id="wrongnote-list" style="flex:1; overflow-y:auto; padding-right:2px;">
            ${listHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  if (onBack) {
    container.querySelector("#wrongnote-back-btn").addEventListener("click", () => {
      onBack();
    });
  }
}

if (typeof module !== "undefined") module.exports = { renderWrongNote };
