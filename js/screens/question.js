/**
 * 문제풀이 화면
 * ------------------------------------------------
 * ⚠️ 실제 문제는 setBuilder.js의 buildSet()이 1897문항 풀에서 뽑아 채운다.
 * ------------------------------------------------
 * onSessionBreak: 세션(10문제) 다 풀었을 때 호출
 * onSpaceCleared: 공간(50문제) 클리어됐을 때 호출
 */
let currentSet = [];
let tileState = null;
let hintRevealed = false;
let isAnswering = false;

const NATIVE_TYPE = "순우리말형";
const NATIVE_BONUS_COIN = 3;

async function renderQuestion(container, callbacks) {
  await WORD_POOL.load();

  if (STATE.sessionCount === 0 || currentSet.length === 0) {
    const setIdxInSpace = Math.floor(STATE.spaceProgress / 10) % 5;
    currentSet = buildSet(setIdxInSpace);
  }

  const q = currentSet[STATE.sessionCount] || currentSet[currentSet.length - 1];
  hintRevealed = false;
  isAnswering = false;
  drawQuestion(container, q, callbacks);
}

function drawQuestion(container, q, callbacks) {
  const fillPercent = Math.round((STATE.spaceProgress / STATE.spaceTotal) * 100);
  const isSelect = q.format === "select";
  const isShortRecall = !isSelect && q.answer.length <= 2;
  const isTileRecall = !isSelect && q.answer.length >= 3;
  const isNative = q.type === NATIVE_TYPE;

  container.innerHTML = `
    <div class="screen" style="background:var(--bg); min-height:100vh; min-height:100dvh; padding:0 16px 40px;">
      <div style="margin:0 -16px 14px; padding:9px 16px; background:var(--header);
                  border-bottom:2px solid rgba(0,0,0,.22);">
        <div style="display:flex; align-items:center; gap:7px;">
          <div id="chest-group" style="display:flex; align-items:center; flex-shrink:0; cursor:pointer;">
            <img src="${ASSETS.images.chestIcon}" style="width:50px; height:50px; object-fit:contain; display:block;
                 position:relative; z-index:2; margin-right:-16px;
                 filter: drop-shadow(1px 1px 0 #241c14) drop-shadow(-1px -1px 0 #241c14);">
            <div class="capsule" style="font-size:15px; height:38px; padding:0 12px 0 20px; gap:2px;">
              <b style="color:var(--brass-light); font-size:17px; line-height:1; white-space:nowrap;">${STATE.spaceProgress}</b>
              <span style="line-height:1; white-space:nowrap;">&nbsp;/ ${STATE.spaceTotal}</span>
            </div>
          </div>
          <div id="coin-wrap" style="display:flex; align-items:center; flex-shrink:0;">
            <img src="${ASSETS.images.coinIcon}" style="width:46px; height:46px; display:block;
                 position:relative; z-index:2; margin-right:-14px;">
            <div id="coin-capsule" class="capsule" style="font-size:15px; height:38px; padding:0 12px 0 18px; gap:2px; position:relative;">
              <span id="coin-display" style="color:var(--brass-light); white-space:nowrap;">${STATE.coins}</span>
            </div>
          </div>
          <div id="wrongnote-shortcut" style="flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative;">
            <img src="${ASSETS.images.wrongNoteIcon}" style="width:30px; height:30px; object-fit:contain; display:block;
                 filter: drop-shadow(1px 1px 0 #241c14) drop-shadow(-1px -1px 0 #241c14);">
          </div>
          <div id="map-btn" style="flex-shrink:0; width:46px; height:46px; box-sizing:border-box;
               display:flex; align-items:center; justify-content:center; cursor:pointer;">
            <svg width="34" height="34" viewBox="-30 -34 60 82" style="display:block;">
              <ellipse cx="0" cy="42" rx="18" ry="5.5" fill="#000" opacity="0.3"/>
              <path d="M0 -30 C15 -30 26 -19 26 -6 C26 10 8 30 0 40 C-8 30 -26 10 -26 -6 C-26 -19 -15 -30 0 -30 Z" fill="#4f7452"/>
              <circle r="9" fill="#2c3948"/>
            </svg>
          </div>
          <div id="settings-btn" style="flex-shrink:0; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
            <svg width="24" height="24" viewBox="-24 -24 48 48" style="display:block;">
              <g fill="#e3c878">
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5"/>
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5" transform="rotate(45)"/>
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5" transform="rotate(90)"/>
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5" transform="rotate(135)"/>
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5" transform="rotate(180)"/>
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5" transform="rotate(225)"/>
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5" transform="rotate(270)"/>
                <rect x="-3.5" y="-24" width="7" height="9" rx="1.5" transform="rotate(315)"/>
              </g>
              <circle r="16" fill="#e3c878"/>
              <circle r="6" fill="#2c3948"/>
            </svg>
          </div>
          <div id="quit-chip" style="flex-shrink:0; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
            <img src="${ASSETS.images.quitIcon}" style="width:22px; height:auto; display:block;">
          </div>
        </div>
      </div>

      ${
        isNative
          ? `<div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
               <div style="background:linear-gradient(160deg,var(--brass-light),var(--brass)); color:var(--ink);
                    font-size:12.5px; font-weight:900; padding:4px 12px; border-radius:14px;">
                 순우리말
               </div>
               <div style="display:flex; align-items:center; gap:3px; font-size:14px; color:var(--brass-light); font-weight:800;">
                 <img src="${ASSETS.images.coinIcon}" style="width:20px; height:20px;">+${NATIVE_BONUS_COIN}
               </div>
             </div>`
          : ""
      }

      <div style="background:var(--panel); border-radius:22px; padding:24px 20px; margin-bottom:24px;
                  border:1.5px solid rgba(255,255,255,0.4);
                  ${isNative ? "border-color:var(--brass);" : ""}">
        <div style="font-size:21px; font-weight:800; line-height:1.5; color:#1a2530;">${q.text}</div>
      </div>

      <div id="answer-area" style="margin-bottom:24px;"></div>

      <div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom:10px;">
        ${
          isSelect
            ? ""
            : `<div style="display:flex; align-items:center; gap:8px;">
                <div id="hint-text" style="font-size:14px; font-weight:800; color:var(--brass-light); text-align:right;"></div>
                <div id="hint-chip" class="capsule" style="cursor:pointer; font-size:15px; height:38px; padding:0 16px 0 10px; gap:6px; flex-shrink:0; color:var(--text-dim);">
                  <img src="${ASSETS.images.hintWarning}" style="width:18px; height:18px; display:block;"> 힌트
                </div>
              </div>`
        }
      </div>

      ${
        isSelect || isShortRecall
          ? ""
          : `<button id="submit-btn" class="btn-primary" style="width:100%; padding:17px; font-size:19px; border-radius:999px;">확인</button>`
      }
    </div>
  `;

  const answerArea = container.querySelector("#answer-area");

  function doSubmit(given) {
    if (isAnswering) return;
    if (given === null || given === "") {
      answerArea.classList.remove("shake");
      void answerArea.offsetWidth;
      answerArea.classList.add("shake");
      return;
    }
    const correct = given === q.answer;
    SOUND.play(correct ? "correct" : "wrong");
    isAnswering = true;
    if (isSelect) {
      answerArea.querySelectorAll(".choice-btn").forEach((el) => {
        if (el.dataset.choice === q.answer) {
          el.classList.add("choice-correct");
        } else if (el.dataset.choice === given && !correct) {
          el.style.borderColor = "#e8503f";
        }
      });
    } else if (answerArea._showFeedback) {
      answerArea._showFeedback(correct);
    }

    StateActions.recordAnswer(correct, q);
    if (correct && isNative) {
      STATE.coins += NATIVE_BONUS_COIN;
      const coinDisplay = container.querySelector("#coin-display");
      if (coinDisplay) coinDisplay.textContent = STATE.coins;
      showCoinPopup(container, NATIVE_BONUS_COIN);
    }
    if (!correct) {
      showWrongNotePopup(container);
    }

    setTimeout(() => {
      if (StateActions.isSpaceCleared()) {
        callbacks.onSpaceCleared();
        return;
      }
      if (StateActions.shouldShowSessionBreak()) {
        STATE.hasShownSessionBreak = true;
        callbacks.onSessionBreak();
        return;
      }
      // 두 번째 이후의 10문제 경계는 팝업 없이 조용히 다음 세트로 이어감
      if (STATE.sessionCount >= STATE.sessionTotal) {
        STATE.sessionCount = 0;
        currentSet = [];
      }
      renderQuestion(container, callbacks);
    }, 1400);
  }

  if (isSelect) {
    const shuffledChoices = [...q.choices].sort(() => Math.random() - 0.5);
    const fontSizeFor = (text) => {
      const len = text.length;
      if (len <= 4) return 27;
      if (len <= 6) return 21;
      if (len <= 8) return 17;
      return 14;
    };
    answerArea.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        ${shuffledChoices
          .map(
            (c) => `<div class="choice-btn" data-choice="${c}"
              style="padding:20px 8px; border-radius:16px; text-align:center;
              background:var(--panel); border:3px solid var(--brass); font-weight:900;
              font-size:${fontSizeFor(c)}px; line-height:1.3; word-break:break-all; overflow-wrap:break-word;
              cursor:pointer;">${c}</div>`
          )
          .join("")}
      </div>`;
    answerArea.querySelectorAll(".choice-btn").forEach((el) => {
      // 선택형: 누르는 즉시 정답/오답 판정 (확인 버튼 없음)
      el.addEventListener("click", () => doSubmit(el.dataset.choice));
    });
  } else if (isShortRecall) {
    const firstChar = q.answer[0];
    const restLen = q.answer.length - 1;
    answerArea.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:14px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="tile-box" style="background:var(--wood-line); opacity:0.85;">${firstChar}</div>
          <input id="text-answer" type="text" maxlength="${restLen}"
            style="width:${69 * restLen}px; height:81px; text-align:center; font-size:32px; font-weight:900;
            border-radius:14px; border:3px solid var(--brass); background:var(--panel); color:var(--text); padding:0;">
        </div>
        <button id="inline-submit-btn" class="btn-primary" style="width:112px; height:60px; padding:0; font-size:22px; flex-shrink:0; border-radius:999px;">확인</button>
      </div>
    `;
    answerArea._showFeedback = (correct) => {
      const box = answerArea.querySelector("#text-answer");
      if (correct) {
        box.classList.add("choice-correct");
      } else {
        box.style.borderColor = "#e8503f";
      }
      box.disabled = true;
    };
  } else if (isTileRecall) {
    const letters = q.answer.split("");
    const firstChar = letters[0];
    const restLetters = letters.slice(1);
    const shuffled = [...restLetters]
      .map((c) => ({ c, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.c);
    tileState = { filled: [firstChar, ...new Array(restLetters.length).fill(null)], pool: shuffled, fixedFirst: true };

    answerArea.innerHTML = `
      <div id="blanks" style="display:flex; gap:8px; justify-content:center; margin-bottom:16px; flex-wrap:wrap;"></div>
      <div id="tiles" style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;"></div>
    `;
    renderTiles(answerArea);
    answerArea._showFeedback = (correct) => {
      const blanks = answerArea.querySelectorAll("#blanks > div");
      if (!correct) {
        blanks.forEach((el) => {
          el.style.borderColor = "#e8503f";
        });
        answerArea.querySelectorAll("#tiles > div").forEach((el) => (el.style.pointerEvents = "none"));
      } else {
        blanks.forEach((el) => el.classList.add("choice-correct"));
      }
    };
  }

  const hintChip = container.querySelector("#hint-chip");
  if (hintChip) {
    hintChip.addEventListener("click", () => {
      if (hintRevealed) return;
      if (STATE.coins <= 0) {
        showAdForCoinsModal(container);
        return;
      }
      StateActions.spendCoin(1);
      hintRevealed = true;
      container.querySelector("#hint-text").textContent = q.hint;
      container.querySelector("#coin-display").textContent = STATE.coins;
      showCoinPopup(container, -1);
    });
  }

  container.querySelector("#quit-chip").addEventListener("click", () => {
    SOUND.play("click");
    showConfirm(container, "그만하시겠는가?<br>찾아 놓은 단어패는 잘 기억해 놓겠네.<br>내일 또 봅세!", () => {
      if (callbacks.onQuit) callbacks.onQuit();
    });
  });

  container.querySelector("#wrongnote-shortcut").addEventListener("click", () => {
    SOUND.play("click");
    if (callbacks.onOpenWrongNote) callbacks.onOpenWrongNote();
  });

  container.querySelector("#map-btn").addEventListener("click", () => {
    SOUND.play("click");
    if (callbacks.onOpenMap) callbacks.onOpenMap();
  });

  container.querySelector("#chest-group").addEventListener("click", () => {
    SOUND.play("click");
    showRelicDogam(container);
  });

  if (!STATE.chestHintShown) {
    STATE.chestHintShown = true;
    const chestImg = container.querySelector("#chest-group img");
    const baseFilter = "drop-shadow(1px 1px 0 #241c14) drop-shadow(-1px -1px 0 #241c14)";
    const glowFilter = baseFilter + " drop-shadow(0 0 7px rgba(255,210,63,0.95)) drop-shadow(0 0 3px rgba(255,210,63,0.95))";
    chestImg.style.transition = "filter 0.6s ease-in-out";
    let tick = 0;
    const totalPulses = 3;
    const timer = setInterval(() => {
      chestImg.style.filter = tick % 2 === 0 ? glowFilter : baseFilter;
      tick++;
      if (tick >= totalPulses * 2) {
        clearInterval(timer);
        chestImg.style.filter = baseFilter;
      }
    }, 600);
  }

  container.querySelector("#settings-btn").addEventListener("click", () => {
    SOUND.play("click");
    showSettingsPanel(container);
  });

  function getRecallAnswer() {
    if (isShortRecall) {
      const val = answerArea.querySelector("#text-answer").value.trim();
      return val === "" ? null : q.answer[0] + val;
    } else if (isTileRecall) {
      return tileState.filled.some((v) => v === null) ? null : tileState.filled.join("");
    }
    return null;
  }

  const submitBtn = container.querySelector("#submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => doSubmit(getRecallAnswer()));
  }
  const inlineSubmitBtn = container.querySelector("#inline-submit-btn");
  if (inlineSubmitBtn) {
    inlineSubmitBtn.addEventListener("click", () => doSubmit(getRecallAnswer()));
  }
}

function renderTiles(answerArea) {
  const blanksEl = answerArea.querySelector("#blanks");
  const tilesEl = answerArea.querySelector("#tiles");

  blanksEl.innerHTML = tileState.filled
    .map(
      (ch, i) => `<div class="tile-box" data-fixed="${i === 0 && tileState.fixedFirst ? "1" : "0"}"
        style="background:${ch ? "var(--wood-line)" : "var(--panel)"};
        ${i === 0 && tileState.fixedFirst ? "opacity:0.85;" : "cursor:pointer;"}">${ch || ""}</div>`
    )
    .join("");

  tilesEl.innerHTML = tileState.pool
    .map(
      (ch, i) => `<div class="tile tile-box" data-idx="${i}"
        style="background:var(--panel); cursor:pointer;">${ch}</div>`
    )
    .join("");

  tilesEl.querySelectorAll(".tile").forEach((el) => {
    el.addEventListener("click", () => {
      const emptyIdx = tileState.filled.findIndex((v) => v === null);
      if (emptyIdx === -1) return;
      const poolIdx = Number(el.dataset.idx);
      tileState.filled[emptyIdx] = tileState.pool[poolIdx];
      tileState.pool.splice(poolIdx, 1);
      renderTiles(answerArea);
    });
  });

  blanksEl.querySelectorAll("div").forEach((el, idx) => {
    if (el.dataset.fixed === "1") return;
    el.addEventListener("click", () => {
      if (!tileState.filled[idx]) return;
      tileState.pool.push(tileState.filled[idx]);
      tileState.filled[idx] = null;
      renderTiles(answerArea);
    });
  });
}

/** 코인 지갑 위로 +N / -N 표시가 잠깐 떴다가 자연스럽게 사라짐 */
function showCoinPopup(container, delta) {
  const wrap = container.querySelector("#coin-capsule");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = "coin-pop";
  el.textContent = (delta > 0 ? "+" : "") + delta;
  wrap.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

/** 오답노트 아이콘 위로 +1 표시가 잠깐 떴다가 사라짐 (엽전 팝업과 동일한 스타일) */
function showWrongNotePopup(container) {
  const wrap = container.querySelector("#wrongnote-shortcut");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = "coin-pop";
  el.textContent = "+1";
  wrap.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

/** 유물상자 클릭 → 지금까지 모은 유물을 보여주는 유물도감 */
function showRelicDogam(container) {
  const overlay = document.createElement("div");
  overlay.className = "dim-overlay";

  const slotsHtml = RELIC_ORDER.map((name) => {
    const collected = STATE.collectedRelics.includes(name);
    if (collected) {
      return `
        <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
          <div style="width:100%; aspect-ratio:2/3; border-radius:12px; overflow:hidden;
               border:2px solid rgba(255,255,255,.25); background:rgba(0,0,0,0.25);">
            <img src="${ASSETS.images.relics[name]}" style="width:100%; height:100%; object-fit:cover; display:block;">
          </div>
          <span style="font-size:12.5px; font-weight:800; color:var(--text);">${name}</span>
        </div>`;
    }
    return `
      <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <div style="width:100%; aspect-ratio:2/3; border-radius:12px;
             border:2px dashed rgba(255,255,255,.25); background:rgba(0,0,0,0.2);
             display:flex; align-items:center; justify-content:center;
             font-size:24px; color:rgba(255,255,255,.25);">?</div>
        <span style="font-size:12.5px; font-weight:700; color:var(--text-dim);">???</span>
      </div>`;
  }).join("");

  overlay.innerHTML = `
    <div style="background:var(--panel); border:2px solid rgba(255,255,255,.18); border-radius:20px;
                padding:24px 20px; width:100%; max-width:340px;">
      <div style="display:flex; justify-content:center; margin-bottom:16px;">
        <div style="display:inline-block; background:rgba(0,0,0,0.4); border:2px solid rgba(255,255,255,.25);
             box-shadow:0 2px 6px rgba(0,0,0,0.35); border-radius:14px; padding:8px 22px;
             font-size:20px; font-weight:900; color:#fff;">유물도감</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px 10px;">
        ${slotsHtml}
      </div>
      <button id="dogam-close-btn" class="btn-primary" style="width:100%; padding:12px; font-size:15px; margin-top:22px;">닫기</button>
    </div>`;
  container.appendChild(overlay);

  overlay.querySelector("#dogam-close-btn").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
  });
}

/** 톱니바퀴 → 설정 패널. 지금은 효과음만 실제 동작, 배경음악/화면모드는 준비중 표시 */
function showSettingsPanel(container) {
  const overlay = document.createElement("div");
  overlay.className = "dim-overlay";
  overlay.innerHTML = `
    <div style="background:var(--panel); border:2px solid rgba(255,255,255,.18); border-radius:20px;
                padding:14px 20px 18px; width:100%; max-width:320px;">

      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 4px;
                  border-bottom:1px solid rgba(255,255,255,.12);">
        <span style="font-size:15px; font-weight:700; color:var(--text);">효과음</span>
        <div id="sfx-toggle" class="capsule" style="cursor:pointer; padding:0; width:52px; height:28px; border-radius:16px;
             background:${STATE.soundOn === false ? "rgba(0,0,0,0.35)" : "var(--brass)"}; position:relative; transition:background 0.2s;">
          <div style="position:absolute; top:2px; left:${STATE.soundOn === false ? "2px" : "26px"}; width:24px; height:24px;
               border-radius:50%; background:#fff; transition:left 0.2s;"></div>
        </div>
      </div>

      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 4px;
                  border-bottom:1px solid rgba(255,255,255,.12); opacity:0.4;">
        <span style="font-size:15px; font-weight:700; color:var(--text);">배경음악</span>
        <span style="font-size:12px; font-weight:700; color:var(--text-dim);">준비중</span>
      </div>

      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 4px; opacity:0.4;">
        <span style="font-size:15px; font-weight:700; color:var(--text);">화면 모드</span>
        <span style="font-size:12px; font-weight:700; color:var(--text-dim);">준비중</span>
      </div>

      <button id="settings-close-btn" class="btn-primary" style="width:100%; padding:11px; font-size:15px; margin-top:14px;">닫기</button>
    </div>`;
  container.appendChild(overlay);

  const sfxToggle = overlay.querySelector("#sfx-toggle");
  sfxToggle.addEventListener("click", () => {
    STATE.soundOn = STATE.soundOn === false ? true : false;
    sfxToggle.style.background = STATE.soundOn === false ? "rgba(0,0,0,0.35)" : "var(--brass)";
    sfxToggle.firstElementChild.style.left = STATE.soundOn === false ? "2px" : "26px";
    if (STATE.soundOn) SOUND.play("click");
  });

  overlay.querySelector("#settings-close-btn").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
  });
}

/** 브라우저 기본 alert 대신, 어느 환경에서도 확실히 동작하는 커스텀 안내창 */
const AD_REWARD_COIN = 3;

/** 엽전 부족 시 뜨는 안내. "광고 보고 엽전 받기"는 지금은 실제 광고 없이 바로 지급하는 자리표시자(placeholder) —
 *  나중에 앱으로 감쌀 때 이 버튼 뒤에 진짜 광고 SDK만 끼워넣으면 됨. */
function showAdForCoinsModal(container) {
  const overlay = document.createElement("div");
  overlay.className = "dim-overlay";
  overlay.innerHTML = `
    <div style="background:var(--panel); border:2px solid rgba(255,255,255,.18); border-radius:20px;
                padding:26px 22px; max-width:300px; text-align:center;">
      <div style="font-size:17px; font-weight:800; color:var(--text); line-height:1.6; margin-bottom:18px;">
        엽전이 부족해요!<br>광고를 보고 엽전을 받으시겠어요?
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button id="ad-watch-btn" class="btn-primary" style="width:100%; padding:13px; font-size:15px;
             display:flex; align-items:center; justify-content:center; gap:6px;">
          <img src="${ASSETS.images.coinIcon}" style="width:20px; height:20px;">
          광고 보고 +${AD_REWARD_COIN} 받기
        </button>
        <button id="ad-cancel-btn" class="btn-secondary" style="width:100%; padding:12px; font-size:14px;">닫기</button>
      </div>
    </div>`;
  container.appendChild(overlay);

  overlay.querySelector("#ad-watch-btn").addEventListener("click", () => {
    SOUND.play("click");
    STATE.coins += AD_REWARD_COIN;
    const coinDisplay = container.querySelector("#coin-display");
    if (coinDisplay) coinDisplay.textContent = STATE.coins;
    overlay.remove();
    showCoinPopup(container, AD_REWARD_COIN);
  });
  overlay.querySelector("#ad-cancel-btn").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
  });
}

function showModal(container, message, onClose) {
  const overlay = document.createElement("div");
  overlay.className = "dim-overlay";
  overlay.innerHTML = `
    <div style="background:var(--panel); border:2px solid rgba(255,255,255,.18); border-radius:20px;
                padding:26px 22px; max-width:300px; text-align:center; font-size:17px; font-weight:800; line-height:1.6;">
      <div style="margin-bottom:18px; white-space:pre-line;">${message}</div>
      <button class="btn-primary" style="width:100%; padding:12px; font-size:16px;">확인</button>
    </div>`;
  container.appendChild(overlay);
  overlay.querySelector("button").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
    if (onClose) onClose();
  });
}

/** 브라우저 기본 confirm 대신, 꼬비 초상+말풍선 스타일의 커스텀 확인창 */
function showConfirm(container, message, onYes) {
  const overlay = document.createElement("div");
  overlay.className = "dim-overlay";
  overlay.innerHTML = `
    <div style="position:relative; background:var(--panel); border:2px solid rgba(255,255,255,.16);
                border-radius:24px; padding:80px 22px 24px; width:100%; max-width:340px;
                box-shadow:0 14px 34px rgba(0,0,0,.5); text-align:center;">
      <div style="position:absolute; top:-56px; left:50%; transform:translateX(-50%);
                  width:120px; height:120px; border-radius:50%; border:4px solid var(--brass);
                  overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,.4);">
        <img src="${ASSETS.images.kkobiJoyful}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div style="font-size:17px; font-weight:800; line-height:1.7; color:var(--text); white-space:pre-line;">${message}</div>
      <div style="display:flex; gap:10px; margin-top:22px;">
        <button id="no-btn" class="btn-secondary" style="flex:1; padding:14px; font-size:15px;">취소</button>
        <button id="yes-btn" class="btn-primary" style="flex:1; padding:14px; font-size:15px;">그만하기</button>
      </div>
    </div>`;
  container.appendChild(overlay);
  overlay.querySelector("#no-btn").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
  });
  overlay.querySelector("#yes-btn").addEventListener("click", () => {
    SOUND.play("click");
    overlay.remove();
    onYes();
  });
}

if (typeof module !== "undefined") module.exports = { renderQuestion };
