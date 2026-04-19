/**
 * Per-apartment visited-room map in localStorage (object: room id -> true).
 * Loaded by each floor plan’s main.js with its own storage key.
 */
(function (global) {
  function loadVisited(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return {};
      const o = JSON.parse(raw);
      if (o && typeof o === 'object' && !Array.isArray(o)) return o;
    } catch (_e) {
      /* ignore */
    }
    return {};
  }

  function saveVisited(key, map) {
    try {
      localStorage.setItem(key, JSON.stringify(map));
    } catch (_e) {
      /* private mode / quota */
    }
  }

  /** If primary key is empty, copy legacy key into primary (one-time migration). */
  function loadVisitedWithOptionalMigrate(primaryKey, legacyKey) {
    let map = loadVisited(primaryKey);
    if (Object.keys(map).length || !legacyKey) return map;
    map = loadVisited(legacyKey);
    if (Object.keys(map).length) saveVisited(primaryKey, map);
    return map;
  }

  global.uhtVisitedStorage = {
    loadVisited,
    saveVisited,
    loadVisitedWithOptionalMigrate
  };
})(typeof window !== 'undefined' ? window : this);
