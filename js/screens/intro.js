/**
 * 인트로 화면: 오프닝 영상 -> 꼬비 인사(타자기 효과로 순서대로 등장) -> 입장 버튼
 * onEnter: 입장 버튼을 눌렀을 때 실행할 콜백 (router가 넘겨줌)
 */
function renderIntro(container, onEnter) {
  container.innerHTML = `
    <div class="screen" id="intro-screen">
      <video id="opening-video" src="${ASSETS.video.opening}" autoplay muted playsinline
             style="width:100%; display:block;"></video>

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

        <button id="enter-btn" class="btn-primary shimmer-btn" style="position:relative; z-index:1; width:60%;
                margin:0 auto; padding:11px; font-size:19px; overflow:hidden;
                opacity:0; pointer-events:none; transition:opacity 0.5s ease;">입장</button>
      </div>
    </div>
  `;

  const video = container.querySelector("#opening-video");
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
    { text: "반갑네!<br>먼저 내 서재에서 잃어버린 단어패를 찾아보시게.", coin: false, hold: 1600 },
    { text: "하루에 딱 10개의 단어패만<br>찾아보자구!", coin: false, hold: 1600 },
    { text: `엽전 ${STATE.coins}개를 줄 테니<br>힌트가 필요할 때 쓰시게나!`, coin: true, hold: 0 },
  ];

  let greetingShown = false;
  const showGreeting = () => {
    if (greetingShown) return;
    greetingShown = true;
    video.style.display = "none";
    greeting.style.display = "flex";

    let idx = 0;
    function playNext() {
      const line = lines[idx];
      bubbleCoin.style.visibility = "hidden";

      // 타이핑 중 박스가 흔들리지 않도록, 전체 문장을 먼저 넣어 높이를 재고 고정한다
      bubbleText.style.height = "auto";
      bubbleText.innerHTML = line.text;
      const finalHeight = bubbleText.getBoundingClientRect().height;
      bubbleText.style.height = finalHeight + "px";

      typewriter(bubbleText, line.text, 150, () => {
        if (line.coin) bubbleCoin.style.visibility = "visible";
        if (idx < lines.length - 1) {
          setTimeout(() => {
            idx++;
            playNext();
          }, line.hold);
        } else {
          const enterBtn = container.querySelector("#enter-btn");
          enterBtn.style.opacity = "1";
          enterBtn.style.pointerEvents = "auto";
        }
      });
    }
    playNext();
  };

 video.addEventListener("ended", showGreeting);

   let fallbackTimer = setTimeout(showGreeting, 8000);
   video.addEventListener("loadedmetadata", () => {
     if (video.duration && isFinite(video.duration)) {
       clearTimeout(fallbackTimer);
       fallbackTimer = setTimeout(showGreeting, video.duration * 1000 + 1000);
     }
   });

  container.querySelector("#enter-btn").addEventListener("click", () => {
    SOUND.play("click");
    onEnter();
  });
}

if (typeof module !== "undefined") module.exports = { renderIntro };
