/* Ссылки на бэкенд (/ai, /erp, отчёты) работают только там, где он поднят.
   Пока сайт живёт на статическом хостинге, уводим их на Railway.
   После переезда домена на Railway проверка проходит — ссылки остаются локальными. */
(function () {
  "use strict";
  var FALLBACK = "https://subsoil-ai-production.up.railway.app";
  var SELECTOR = 'a[href^="/ai"], a[href^="/erp"], a[href^="/stage-reports"]';

  function rewrite() {
    var links = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < links.length; i++) {
      var a = links[i], path = a.getAttribute("href");
      if (!path || path.indexOf("http") === 0) continue;
      a.href = FALLBACK + path;
      a.target = "_blank";
      a.rel = "noopener";
    }
  }

  function probe() {
    // /ai есть только когда сайт отдаёт FastAPI
    fetch("/ai", { method: "GET", cache: "no-store" })
      .then(function (r) { if (!r.ok) rewrite(); })
      .catch(rewrite);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", probe);
  else probe();
})();
