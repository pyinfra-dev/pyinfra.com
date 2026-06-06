(() => {
  const win = document.getElementById("hero-window");
  if (!win) return;

  const tabs = Array.from(win.querySelectorAll(".window__tab"));
  const panes = win.querySelectorAll(".window__pane");
  const statusLeft = win.querySelector("[data-status-left]");
  const statusRight = win.querySelector("[data-status-right]");

  const status = {
    deploy:    ["NORMAL  deploy.py  python",      "23 hosts ready  ·  --dry  ·  17:42"],
    inventory: ["NORMAL  inventory.py  python",   "@hosts/web · @hosts/db  ·  17:42"],
    output:    ["RUNNING  pyinfra  stream",       "23 hosts  ·  2.1s  ·  17:42"],
  };

  const activate = (tab, { focus = false } = {}) => {
    const key = tab.dataset.tab;

    tabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
      t.setAttribute("tabindex", active ? "0" : "-1");
    });

    panes.forEach(p => {
      p.classList.toggle("is-active", p.dataset.pane === key);
    });

    if (status[key]) {
      statusLeft.textContent = status[key][0];
      statusRight.textContent = status[key][1];
    }

    if (focus) tab.focus();
  };

  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      switch (e.key) {
        case "ArrowRight": next = tabs[(idx + 1) % tabs.length]; break;
        case "ArrowLeft":  next = tabs[(idx - 1 + tabs.length) % tabs.length]; break;
        case "Home":       next = tabs[0]; break;
        case "End":        next = tabs[tabs.length - 1]; break;
      }
      if (next) {
        e.preventDefault();
        activate(next, { focus: true });
      }
    });
  });
})();

(() => {
  document.querySelectorAll("[data-copy-target]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const target = document.querySelector(btn.dataset.copyTarget);
      if (!target) return;
      const text = target.textContent.trim();
      const original = btn.textContent;

      const fallback = () => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand("copy"); } catch (_) {}
        document.body.removeChild(ta);
        return ok;
      };

      let ok = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          ok = true;
        } else {
          ok = fallback();
        }
      } catch (_) {
        ok = fallback();
      }

      btn.textContent = ok ? "copied" : "press ⌘C";
      btn.classList.toggle("is-copied", ok);
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("is-copied");
      }, 1600);
    });
  });
})();
