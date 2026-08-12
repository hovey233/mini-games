/* scores.js — 小游戏合集共享成绩模块（localStorage）
 * 所有游戏和大厅共用，记录每款游戏的：
 *   bestScore : 最高分 / 最高关卡（含义由游戏自定义）
 *   plays     : 游玩次数
 *   clears    : 通关次数 / 胜场
 * 用法：
 *   <script src="scores.js"></script>
 *   MG.record('tetris', 1200, false)   // 一局结束，score=1200
 *   MG.get('tetris')                    // 读取成绩
 *   MG.renderBoard(document.getElementById('board'))
 */
(function () {
  const KEY = 'minigame_scores_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function get(id) {
    return load()[id] || { bestScore: 0, plays: 0, clears: 0 };
  }
  // score: 本局成绩（可为 0）；cleared: 是否通关/胜利
  function record(id, score, cleared) {
    const d = load();
    const c = d[id] || { bestScore: 0, plays: 0, clears: 0 };
    const next = {
      bestScore: Math.max(c.bestScore, score || 0),
      plays: c.plays + 1,
      clears: c.clears + (cleared ? 1 : 0)
    };
    d[id] = next;
    save(d);
    return next;
  }

  // 大厅成绩榜元数据：游戏id, 名称, 主指标('score'|'clears'|'level')
  const META = [
    ['minesweeper', '💣 扫雷', 'clears', '通关'],
    ['tetris', '🟦 俄罗斯方块', 'score', ''],
    ['breakout', '🟧 打砖块', 'score', ''],
    ['gobang', '⚫ 五子棋', 'clears', '胜场'],
    ['plane', '✈️ 飞机大战', 'score', ''],
    ['sokoban', '📦 推箱子', 'level', '']
  ];

  function fmt(s, metric, unit) {
    if (metric === 'score') return '最高 ' + s.bestScore + ' 分';
    if (metric === 'level') return '通关 ' + s.bestScore + ' 关';
    return (unit || '通关') + ' ' + s.clears + ' 次';
  }

  function renderBoard(el) {
    if (!el) return;
    let h = '<div class="score-grid">';
    META.forEach(function (m) {
      const id = m[0], name = m[1], metric = m[2], unit = m[3];
      const s = get(id);
      const val = s.plays > 0
        ? fmt(s, metric, unit) + ' · 玩 ' + s.plays + ' 次'
        : '尚未游玩';
      h += '<div class="score-row"><span class="s-name">' + name +
           '</span><span class="s-val">' + val + '</span></div>';
    });
    h += '</div>';
    el.innerHTML = h;
  }

  window.MG = { load: load, save: save, get: get, record: record, renderBoard: renderBoard };
})();
