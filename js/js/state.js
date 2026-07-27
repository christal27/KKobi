/**
 * ===============================================
 *  게임 상태(State) 저장소
 * ===============================================
 *  - 여기 있는 값들이 "지금 게임이 어디까지 왔는지"를 나타냄
 *  - 화면(screens/*.js)들은 이 값을 읽고 쓰기만 하고,
 *    직접 규칙(50개 채우면 어떻게 된다 등)은 game.js 쪽에서 처리
 * ===============================================
 */
/** 공간 클리어 순서에 맞춘 유물 5종 (spaceOrder와 1:1 대응) */
const RELIC_ORDER = ["등잔걸이", "달항아리", "윤도", "마패", "옥대"];

/** 유물도감/획득 화면에서 보여줄 짧은 설명 */
const RELIC_DESC = {
  등잔걸이: "기름 등잔을 걸어 방 안을 밝히던 도구",
  달항아리: "왕실과 사대부가 즐겨 쓰던 둥근 백자 항아리",
  윤도: "방향을 가늠하던 조선의 나침반",
  마패: "역참에서 말을 징발할 때 쓰던 관리의 증표",
  옥대: "고위 관료가 예복에 두르던 옥 장식 허리띠",
};

const STATE = {
  coins: 10,                 // 엽전 개수
  spaceOrder: ["꼬비의 서재", "독서당", "집현전", "홍문관", "규장각"], // 조선 5개 공간 순서
  currentSpaceIndex: 0,      // 지금 진행 중인 공간의 인덱스 (spaceOrder 기준)
  spaceName: "꼬비의 서재",     // 현재 공간 이름
  spaceProgress: 0,          // 이 공간에서 지금까지 푼 문제 수 (0~50)
  spaceTotal: 50,            // 공간 하나를 채우는 데 필요한 문제 수
  sessionCount: 0,           // "오늘의 단어패" 세션에서 푼 문제 수 (0~10)
  sessionTotal: 10,          // 세션 목표 문제 수
  hasShownSessionBreak: false, // 10문제 달성 팝업을 이미 보여줬는지 (1회성)
  nextSpaceName: "독서당",     // 다음 잠금해제될 공간 이름
  hintUsedOnCurrentQuestion: false,
  soundOn: true, // 소리 on/off
  wrongCount: 0, // 누적 오답 개수(오답노트 캡슐에 표시)
  wrongWords: [], // 오답노트에 표시할 오답 목록 [{text, answer, type}]
  collectedRelics: [], // 지금까지 모은 유물 이름 목록 (RELIC_ORDER 기준)
  chestHintShown: false, // 유물상자 첫 안내(반짝임)를 이미 보여줬는지
};

// 진행도 갱신 헬퍼 (규칙은 여기 한 곳에만 존재)
const StateActions = {
  /** 문제 하나에 답했을 때 호출 (정답 여부와 무관하게 세션은 진행됨) */
  recordAnswer(isCorrect, question) {
    STATE.sessionCount = Math.min(STATE.sessionCount + 1, STATE.sessionTotal);
    if (isCorrect) {
      STATE.spaceProgress = Math.min(STATE.spaceProgress + 1, STATE.spaceTotal);
    } else {
      STATE.wrongCount += 1;
      if (question) {
        STATE.wrongWords.push({
          text: question.text,
          answer: question.answer,
          type: question.type,
        });
      }
    }
  },

  /** 엽전 소모(힌트 사용 등) */
  spendCoin(amount = 1) {
    STATE.coins = Math.max(0, STATE.coins - amount);
  },

  /** 세션(10문제) 완료해서 중단 팝업을 띄워야 하는 타이밍인지 */
  shouldShowSessionBreak() {
    return (
      STATE.sessionCount >= STATE.sessionTotal &&
      !STATE.hasShownSessionBreak
    );
  },

  /** 공간(50문제) 클리어했는지 */
  isSpaceCleared() {
    return STATE.spaceProgress >= STATE.spaceTotal;
  },

  /** 지금 클리어한 공간에 해당하는 유물을 수집 목록에 추가 */
  collectCurrentRelic() {
    const relic = RELIC_ORDER[STATE.currentSpaceIndex];
    if (relic && !STATE.collectedRelics.includes(relic)) {
      STATE.collectedRelics.push(relic);
    }
  },

  /** 유물 획득 확인 후, 다음 공간으로 넘어간다 */
  advanceToNextSpace() {
    STATE.currentSpaceIndex = Math.min(STATE.currentSpaceIndex + 1, STATE.spaceOrder.length - 1);
    STATE.spaceName = STATE.spaceOrder[STATE.currentSpaceIndex];
    STATE.nextSpaceName = STATE.spaceOrder[STATE.currentSpaceIndex + 1] || null;
    STATE.spaceProgress = 0;
    STATE.sessionCount = 0;
    STATE.hasShownSessionBreak = false;
  },

  reset() {
    STATE.spaceProgress = 0;
    STATE.sessionCount = 0;
    STATE.hasShownSessionBreak = false;
  },
};

if (typeof module !== "undefined") {
  module.exports = { STATE, StateActions, RELIC_ORDER, RELIC_DESC };
}
