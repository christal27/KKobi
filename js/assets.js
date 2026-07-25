/**
 * ===============================================
 *  자산(이미지/영상) 등록소
 * ===============================================
 *  이미지를 바꾸고 싶으면:
 *   1) assets/images/ 폴더에 새 파일을 넣고
 *   2) 아래 경로만 그 파일명으로 바꿔주면 끝.
 *  코드의 다른 곳(화면 파일들)은 전혀 건드릴 필요 없음 —
 *  전부 ASSETS.xxx 라는 "이름표"로만 이미지를 참조하기 때문.
 * ===============================================
 */
const ASSETS = {
  video: {
    opening: "assets/video/opening.mp4",
    relics: {
      등잔걸이: "assets/video/relics/deungjan.mp4",
      달항아리: "assets/video/relics/dalhangari.mp4",
      윤도: "assets/video/relics/yundo.mp4",
      옥대: "assets/video/relics/okdae.mp4",
      // 마패는 아직 영상 준비 안 됨 → 자동으로 기존처럼 이미지 연출로만 진행됨.
    },
  },
  sounds: {
    correct: "assets/sounds/correct.mp3",  // 정답
    wrong: "assets/sounds/wrong.mp3",      // 오답
    click: "assets/sounds/click.mp3",      // 공통 버튼 클릭
    relic: "assets/sounds/relic.mp3",      // 유물 획득
  },
  images: {
    roomBg: "assets/images/room_bg.jpg",        // 인트로 서재 배경
    logo: "assets/images/logo.png",             // 앱 로고(순우리말 배지 등에 사용)
    mapIcon: "assets/images/map_icon.png",       // 지도 바로가기 아이콘
    relicHero: "assets/images/relic_hero.png",   // 유물 획득 화면 - 빛나는 보물상자
    kkobiJoyful: "assets/images/kkobi_joyful.png", // 꼬비 기쁨 표정(인트로)
    kkobiSurprise: "assets/images/kkobi_surprise.png", // 꼬비 놀람 표정(중단팝업)
    kkobiFullbody: "assets/images/kkobi_fullbody.png", // 꼬비 전신(지도화면)
    kkobiMapFace: "assets/images/kkobi_map_face.png", // 꼬비 얼굴(지도화면 말풍선 전용)
    kkobiMapHappy: "assets/images/kkobi_map_happy.png", // 꼬비 기쁨 표정(유물 획득 직후 지도화면 전용)
    coinSmall: "assets/images/coin_small.png",   // 엽전(말풍선 안 작은 아이콘)
    coinIcon: "assets/images/coin_icon.png",     // 엽전(상태바 아이콘)
    chestIcon: "assets/images/chest_icon.png",   // 보물상자(유물진행바)
    hintScroll: "assets/images/hint_scroll.png", // 힌트 두루마리
    mapBg: "assets/images/map_bg.jpg",           // 지도 화면 배경(숲길)
    wrongNoteIcon: "assets/images/wrongnote_icon.png", // 오답노트 아이콘(지도화면)
    scrollBg: "assets/images/scroll_bg.png",     // 오답노트 페이지 배경(두루마리)
    quitIcon: "assets/images/quit_icon.png",     // 그만하기(문) 아이콘
    hintWarning: "assets/images/hint_warning.png", // 힌트 캡슐 옆 경고 아이콘
    relics: {
      등잔걸이: "assets/images/relics/deungjan.png",
      달항아리: "assets/images/relics/dalhangari.png",
      윤도: "assets/images/relics/yundo.png",
      마패: "assets/images/relics/mapae.png",
      옥대: "assets/images/relics/okdae.png",
    },
  },
};

// 브라우저(모듈 미사용 환경)와 Node 양쪽에서 다 쓸 수 있게 노출
if (typeof module !== "undefined") module.exports = ASSETS;
