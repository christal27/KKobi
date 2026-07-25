/**
 * ===============================================
 *  효과음 재생 헬퍼
 * ===============================================
 *  SOUND.play("correct" | "wrong" | "click" | "relic") 형태로 어디서든 호출.
 *  - STATE.soundOn이 false면 자동으로 재생 안 함 (상단바 소리 버튼과 연동)
 *  - 소리 파일이 없거나 재생 실패해도 게임 진행에 영향 없도록 조용히 무시함
 *  - 효과음을 새로 넣고 싶으면 assets.js의 sounds 경로만 바꾸면 됨(다른 코드 안 건드려도 됨)
 * ===============================================
 */
const SOUND = {
  play(name, volume = 0.6) {
    if (STATE.soundOn === false) return;
    const src = ASSETS.sounds && ASSETS.sounds[name];
    if (!src) return;
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {
      /* 재생 실패는 무시 (게임 진행에 영향 없어야 함) */
    }
  },
};

if (typeof module !== "undefined") module.exports = { SOUND };
