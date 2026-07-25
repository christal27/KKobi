/**
 * 화면 전환 담당. 각 화면 모듈을 부르고, 콜백으로 다음 화면을 연결한다.
 * 새 화면을 추가하려면:
 *   1) js/screens/새화면.js 작성 (render함수 export)
 *   2) index.html에 <script> 한 줄 추가
 *   3) 아래 goXXX() 함수 하나 추가
 */
const app = document.getElementById("app");

function goIntro() {
  renderIntro(app, goQuestion);
}

function goQuestion() {
  renderQuestion(app, {
    onSessionBreak: goSessionBreak,
    onSpaceCleared: goRelicAward,
    onOpenMap: goMapPeek,
    onOpenWrongNote: () => goWrongNote(goQuestion),
    onQuit: goIntro,
  });
}

function goRelicAward() {
  renderRelicAward(app, {
    onContinue: () => {
      StateActions.collectCurrentRelic();
      StateActions.advanceToNextSpace();
      goMap(true);
    },
  });
}

function goMapPeek() {
  renderMap(app, { onBack: goQuestion, onOpenWrongNote: () => goWrongNote(goMapPeek), onEnterSpace: goQuestion });
}

function goWrongNote(onBack) {
  renderWrongNote(app, { onBack });
}

function goSessionBreak() {
  renderSessionBreak(app, {
    onContinue: () => {
      STATE.sessionCount = 0;
      currentSet = [];
      goQuestion();
    },
    onQuit: goIntro,
  });
}

function goMap(justCollectedRelic) {
  renderMap(app, { onOpenWrongNote: () => goWrongNote(goMap), onEnterSpace: goQuestion, justCollectedRelic });
}

// 시작
goIntro();
