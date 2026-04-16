(function () {
  var y = document.getElementById("year");
  var ya = document.getElementById("year-about");
  var yr = String(new Date().getFullYear());
  if (y) y.textContent = yr;
  if (ya) ya.textContent = yr;

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var bg = document.querySelector(".page-bg");

  function updateBgReveal() {
    if (!bg || reduce) return;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var doc = document.documentElement;
    var maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    var t = Math.min(1, Math.max(0, scrollY / maxScroll));
    bg.style.backgroundPosition = "center " + t * 100 + "%";
  }

  if (!reduce) {
    window.addEventListener(
      "scroll",
      function () {
        updateBgReveal();
      },
      { passive: true }
    );
    window.addEventListener(
      "resize",
      function () {
        updateBgReveal();
      },
      { passive: true }
    );
    updateBgReveal();
  }

  var cur = document.getElementById("custom-cursor");

  if (!reduce && cur) {
    document.body.classList.add("has-custom-cursor");
    document.addEventListener(
      "mousemove",
      function (e) {
        cur.style.left = e.clientX + "px";
        cur.style.top = e.clientY + "px";
      },
      { passive: true }
    );

    function bindCursorTargets() {
      document.querySelectorAll("a, button").forEach(function (el) {
        el.addEventListener("mouseenter", function () {
          cur.classList.add("custom-cursor--link");
        });
        el.addEventListener("mouseleave", function () {
          cur.classList.remove("custom-cursor--link");
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bindCursorTargets);
    } else {
      bindCursorTargets();
    }
  }
})();
