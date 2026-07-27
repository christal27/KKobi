/**
 * ===============================================
 *  세트 빌더
 * ===============================================
 *  1897문항 풀(words.json)에서, 확정된 규칙대로
 *  10문제짜리 세트를 뽑아 조립한다.
 *
 *  세트 구성 규칙 (프로젝트 확정 규칙):
 *   1세트/5세트: 맞춤법2, 유사발음1, 뜻회상5, 사자성어1, 순우리말1
 *   2~4세트   : 맞춤법2, 유사발음2, 뜻회상5, 사자성어1, 순우리말0
 *   + 같은 유형 연속 배치 금지 (한 칸씩 띄우기)
 *
 *  공간(space)마다 풀에서 순서대로 안 겹치게 소비하도록
 *  타입별 offset을 WORD_POOL.offsets 에 저장해 관리한다.
 * ===============================================
 */
const TYPE = {
  SPELL: "맞춤법 혼동형",
  SOUND: "유사발음·의미 구별형",
  RECALL: "뜻 회상형(명사)",
  IDIOM: "사자성어형",
  NATIVE: "순우리말형",
};

const WORD_POOL = {
  loaded: false,
  byType: {}, // { [TYPE.xxx]: [item, item, ...] }
  offsets: {
    [TYPE.SPELL]: 0,
    [TYPE.SOUND]: 0,
    [TYPE.RECALL]: 0,
    [TYPE.IDIOM]: 0,
    [TYPE.NATIVE]: 0,
  },

  async load(url = "data/words.json") {
    if (this.loaded) return;
    const res = await fetch(url);
    const items = await res.json();
    for (const t of Object.values(TYPE)) this.byType[t] = [];
    for (const item of items) {
      (this.byType[item.type] || (this.byType[item.type] = [])).push(item);
    }
    this.loaded = true;
  },

  /** type에서 count개를 offset부터 순서대로 꺼내고 offset을 전진시킨다 */
  take(type, count) {
    const pool = this.byType[type] || [];
    const start = this.offsets[type];
    const slice = [];
    for (let i = 0; i < count; i++) {
      slice.push(pool[(start + i) % pool.length]); // 풀 소진되면 순환(안전장치)
    }
    this.offsets[type] = start + count;
    return slice;
  },
};

// 세트 구성표 (1,5세트 vs 2~4세트)
function composition(setIndexInSpace) {
  // setIndexInSpace: 0~4 (한 공간=5세트)
  const isEdgeSet = setIndexInSpace === 0 || setIndexInSpace === 4;
  return {
    [TYPE.SPELL]: 2,
    [TYPE.SOUND]: isEdgeSet ? 1 : 2,
    [TYPE.RECALL]: 5,
    [TYPE.IDIOM]: 1,
    [TYPE.NATIVE]: isEdgeSet ? 1 : 0,
  };
}

/** 같은 유형이 연속되지 않도록 재배치 (매 반복마다 "남은 개수 최다" 버킷을 다시 골라 넣는 표준 그리디) */
function interleave(bucketsByType) {
  const buckets = Object.entries(bucketsByType)
    .filter(([, arr]) => arr.length > 0)
    .map(([type, arr]) => ({ type, items: [...arr] }));

  const result = [];
  let guard = 0;
  const maxGuard = Object.values(bucketsByType).reduce((s, a) => s + a.length, 0) + 10;
  while (buckets.some((b) => b.items.length > 0)) {
    guard++;
    if (guard > maxGuard) {
      console.warn("interleave: 안전장치 발동, 남은 항목 그대로 이어붙임");
      buckets.forEach((b) => result.push(...b.items.splice(0)));
      break;
    }
    buckets.sort((a, b) => b.items.length - a.items.length);
    const lastType = result.length > 0 ? result[result.length - 1].type : null;
    let pick = buckets.find((b) => b.items.length > 0 && b.type !== lastType);
    if (!pick) {
      pick = buckets.find((b) => b.items.length > 0);
    }
    result.push(pick.items.shift());
  }
  return result;
}

/**
 * 공간 인덱스(spaceIdx, 0부터)와 그 공간 안에서의 세트 번호(setIdx, 0~4)로
 * 10문제 배열을 만들어 돌려준다.
 */
function buildSet(setIdxInSpace) {
  const comp = composition(setIdxInSpace);
  const buckets = {};
  for (const [type, count] of Object.entries(comp)) {
    buckets[type] = WORD_POOL.take(type, count);
  }
  return interleave(buckets);
}

if (typeof module !== "undefined") {
  module.exports = { WORD_POOL, buildSet, TYPE };
}
