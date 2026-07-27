/**
 * 인트로 화면: 대문 이미지(모험 시작) -> 꼬비 인사(타자기 효과로 순서대로 등장) -> 입장 버튼
 * onEnter: 입장 버튼을 눌렀을 때 실행할 콜백 (router가 넘겨줌)
 */
function renderIntro(container, onEnter) {
  container.innerHTML = `
    <div class="screen" id="intro-screen">
      <div id="cover-screen" style="min-height:100vh; min-height:100dvh; display:flex; flex-direction:column;
           background:#1c110a; cursor:pointer;">
        <div style="position:relative;">
          <img src="${ASSETS.images.introCover}" style="width:100%; display:block;">
          <div style="position:absolute; left:44%; top:26%; width:54%;">
            <img src="${ASSETS.images.titleLogo}" style="width:100%; display:block;">
          </div>
        </div>
        <div style="flex:1; background:linear-gradient(180deg, #2a1a0d 0%, #1c110a 100%);
             display:flex; align-items:center; justify-content:center;">
          <div id="skip-indicator" style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:12px; font-weight:700; color:#d9b98a; letter-spacing:1px;">SKIP</span>
            <div style="width:30px; height:30px; border-radius:50%; border:2px solid #e3c878;
                 display:flex; align-items:center; justify-content:center;">
              <svg width="13" height="12" viewBox="0 0 13 12">
                <path d="M1 1 L11 6 L1 11" fill="none" stroke="#e3c878" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div id="greeting" style="display:none; min-height:100vh; min-height:100dvh; position:relative;
           background-image:url('${ASSETS.images.roomBg}'); background-size:cover; background-position:center;
           padding:20px 20px 40px; flex-direction:column; justify-content:space-between;">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,14,8,0.05) 0%, rgba(20,14,8,0.6) 100%);"></div>

        <div style="position:relative; z-index:1; margin-top:56px;">
          <div style="position:relative; background:rgba(45,58,72,0.55); backdrop-filter:blur(3px); border:2px solid rgba(255,255,255,.25);
                      border-radius:24px; padding:80px 22px 24px; box-shadow:0 14px 34px rgba(0,0,0,.5); text-align:left;">
            <div style="position:absolute; top:-56px; left:50%; transform:translateX(-50%);
                        width:120px; height:120px; border-radius:50%; border:4px solid var(--brass);
                        overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,.4);">
              <img src="${ASSETS.images.kkobiJoyful}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div id="bubble-text" style="font-size:19px; font-weight:800; line-height:1.6; color:var(--text);"></div>
            <img id="bubble-coin" src="${ASSETS.images.coinIcon}" style="width:56px; height:56px; display:block; margin:4px auto 0; visibility:hidden;">
          </div>
        </div>

        <div id="control-btn-wrap" style="position:relative; z-index:1; min-height:52px; display:flex; justify-content:center;"></div>
      </div>
    </div>
  `;

  const coverScreen = container.querySelector("#cover-screen");
  const greeting = container.querySelector("#greeting");
  const bubbleText = container.querySelector("#bubble-text");
  const bubbleCoin = container.querySelector("#bubble-coin");

  // dvh 미지원 브라우저 대비: 실제 보이는 높이로 강제 보정
  function fixGreetingHeight() {
    greeting.style.minHeight = window.innerHeight + "px";
  }
  fixGreetingHeight();
  window.addEventListener("resize", fixGreetingHeight);

  /** 타자기 효과: HTML(태그 포함)을 한 글자씩 순서대로 채워넣는다 */
  function typewriter(el, html, speed, onDone) {
    el.innerHTML = "";
    // 태그는 그대로, 나머지는 "어절(공백 기준 단어)+뒤따르는 공백" 단위로 토큰화
    const tokens = html.match(/<[^>]+>|[^\s<]+\s*/g) || [];
    let i = 0;
    function step() {
      if (i >= tokens.length) {
        if (onDone) onDone();
        return;
      }
      el.innerHTML += tokens[i];
      const isTag = tokens[i].startsWith("<");
      i++;
      setTimeout(step, isTag ? 0 : speed);
    }
    step();
  }

  const lines = [
    { text: "어서오시게나!<br>이곳은 나의 서재일세.", coin: false },
    { text: "요즘들어 단어들이 입안에서 뱅뱅 맴돌고 잘 안떠오른다지?", coin: false },
    { text: "내가 도와주겠네!<br>나와 함께 매일 방방곡곡의 서재를 돌며<br>잊어버린 단어들을 찾아보세.", coin: false },
    { text: `엽전 ${STATE.coins}개를 줄테니 힌트가 필요할때 쓰시게나.`, coin: true },
  ];

  const controlWrap = container.querySelector("#control-btn-wrap");

  function renderArrowBtn(onClick) {
    controlWrap.innerHTML = `
      <button id="control-btn" style="margin:0 auto; padding:0; background:none; border:none;
              cursor:pointer; opacity:0; pointer-events:none; transition:opacity 0.5s ease;">
        <div style="width:52px; height:52px; border-radius:50%; border:2px solid #e3c878;
             background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;
             animation: skipBounce 1.4s ease-in-out infinite, skipGlow 1.6s ease-in-out infinite;">
          <svg width="16" height="20" viewBox="0 0 16 20">
            <path d="M2 1 L14 10 L2 19" fill="none" stroke="#e3c878" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </button>`;
    const btn = controlWrap.querySelector("#control-btn");
    btn.addEventListener("click", () => {
      SOUND.play("click");
      onClick();
    });
    requestAnimationFrame(() => {
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    });
  }

  function renderEnterBtn() {
    controlWrap.innerHTML = `
      <button id="control-btn" style="width:60%; padding:13px; font-size:18px; font-weight:800;
              background:rgba(0,0,0,0.3); color:#e3c878; border:2px solid #e3c878; border-radius:999px;
              cursor:pointer; opacity:0; pointer-events:none; transition:opacity 0.5s ease;
              animation: skipGlow 1.6s ease-in-out infinite;">입장</button>`;
    const btn = controlWrap.querySelector("#control-btn");
    btn.addEventListener("click", () => {
      SOUND.play("click");
      onEnter();
    });
    requestAnimationFrame(() => {
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    });
  }

  const showGreeting = () => {
    coverScreen.style.display = "none";
    greeting.style.display = "flex";

    let idx = 0;
    function playNext() {
      const line = lines[idx];
      bubbleCoin.style.visibility = "hidden";
      controlWrap.innerHTML = "";

      // 타이핑 중 박스가 흔들리지 않도록, 전체 문장을 먼저 넣어 높이를 재고 고정한다
      bubbleText.style.height = "auto";
      bubbleText.innerHTML = line.text;
      const finalHeight = bubbleText.getBoundingClientRect().height;
      bubbleText.style.height = finalHeight + "px";

      typewriter(bubbleText, line.text, 150, () => {
        if (line.coin) bubbleCoin.style.visibility = "visible";
        if (idx < lines.length - 1) {
          renderArrowBtn(() => {
            idx++;
            playNext();
          });
        } else {
          renderEnterBtn();
        }
      });
    }
    playNext();
  };

  let coverAdvanced = false;
  const advanceFromCover = () => {
    if (coverAdvanced) return;
    coverAdvanced = true;
    SOUND.play("click");
    showGreeting();
  };
  coverScreen.addEventListener("click", advanceFromCover);
  setTimeout(advanceFromCover, 4000);
}

if (typeof module !== "undefined") module.exports = { renderIntro };
