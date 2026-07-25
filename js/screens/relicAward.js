/**
 * 공간(50문제) 클리어 시 "유물 획득!" 축하 화면.
 * 문제화면(남색, 차분한 톤)과 다르게, 이 화면은 크림/골드 톤의 축하 연출.
 * onContinue: [좋았어!] 눌렀을 때 호출 (지도 화면으로 이동)
 */
function renderRelicAward(container, { onContinue, relicName, relicImage, spaceName }) {
  relicName = relicName || RELIC_ORDER[STATE.currentSpaceIndex] || "유물";
  relicImage = relicImage || ASSETS.images.relics[relicName] || ASSETS.images.relicHero;
  const relicVideo = ASSETS.video.relics && ASSETS.video.relics[relicName];
  spaceName = spaceName || STATE.spaceName;

  container.innerHTML = `
    <div class="screen" style="min-height:100vh; min-height:100dvh; display:flex; flex-direction:column;
         background: radial-gradient(circle at 50% 38%, #fdf1d6 0%, #f3dca6 45%, #dcb46e 100%); overflow:hidden;
         position:relative;">

      ${
        relicVideo
          ? `<div id="relic-video-wrap" style="position:absolute; inset:0; z-index:5; background:#000;
               display:flex; align-items:center; justify-content:center; cursor:pointer;">
               <video id="relic-video" src="${relicVideo}" autoplay playsinline
                      style="width:100%; height:100%; object-fit:contain; display:block;"></video>
               <div style="position:absolute; bottom:22px; left:50%; transform:translateX(-50%);
                    font-size:12.5px; font-weight:700; color:rgba(255,255,255,.75);
                    background:rgba(0,0,0,0.4); padding:6px 14px; border-radius:999px;">
                 화면을 누르면 건너뛰기
               </div>
             </div>`
          : ""
      }

      <div id="relic-close-btn" style="position:absolute; top:14px; right:14px; z-index:10; cursor:pointer;
           width:38px; height:38px; border-radius:50%; background:rgba(0,0,0,0.4);
           border:2px solid rgba(255,255,255,.25); box-shadow:0 2px 6px rgba(0,0,0,0.35);
           display:flex; align-items:center; justify-content:center; font-size:14px; color:#fff;">✕</div>

      <div style="position:absolute; top:50%; left:50%; width:200vmax; height:200vmax;
           transform:translate(-50%,-50%); pointer-events:none;
           background: repeating-conic-gradient(from 0deg, rgba(255,255,255,0.25) 0deg 9deg, transparent 9deg 18deg);
           animation: relicSpin 40s linear infinite;"></div>

      <div id="relic-content" style="position:relative; z-index:2; flex:1; display:flex; flex-direction:column;
           align-items:center; justify-content:center; padding:26px 20px;
           opacity:${relicVideo ? 0 : 1}; transition:opacity 0.5s ease;">
        <div style="font-size:20px; font-weight:900; color:#6b4620; text-align:center; letter-spacing:1px;
             text-shadow: 0 0 12px rgba(255,255,255,0.9); margin-bottom:18px;">
          유물 획득!
        </div>

        <div style="background:#fff; padding:14px; border-radius:20px; border:3px solid #a6842f;
             box-shadow:0 10px 22px rgba(90,60,20,0.35);">
          <img src="${relicImage}" style="width:100%; max-width:200px; display:block; border-radius:12px;">
        </div>

        <div style="font-size:17px; font-weight:800; color:#4a2f18; text-align:center; margin-top:18px;">
          ${relicName}
        </div>
        <div style="font-size:13px; color:#7a5a34; margin-top:6px; text-align:center; line-height:1.5; max-width:260px;">
          ${RELIC_DESC[relicName] || ""}
        </div>
      </div>
    </div>

    <style>
      @keyframes relicSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    </style>
  `;

  container.querySelector("#relic-close-btn").addEventListener("click", () => {
    onContinue();
  });

  const revealContent = () => {
    const content = container.querySelector("#relic-content");
    if (content.style.opacity === "1") return; // 이미 공개됨(중복 방지)
    content.style.opacity = "1";
    SOUND.play("relic");
  };

  if (relicVideo) {
    const videoWrap = container.querySelector("#relic-video-wrap");
    const videoEl = container.querySelector("#relic-video");
    const finishVideo = () => {
      videoWrap.style.display = "none";
      revealContent();
    };
    videoEl.addEventListener("ended", finishVideo);
    videoWrap.addEventListener("click", finishVideo);
  } else {
    SOUND.play("relic");
  }
}

if (typeof module !== "undefined") module.exports = { renderRelicAward };
