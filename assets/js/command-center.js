(function () {
  function formatTime(d) {
    return d.toLocaleTimeString([], { hour12: false });
  }

  function updateTimeTargets() {
    var now = new Date();
    var time = formatTime(now);
    var clock = document.getElementById("localTime");
    if (clock) clock.textContent = time;
    document.querySelectorAll("#statusTime").forEach(function (el) {
      el.textContent = time;
    });
  }

  function setupHeaderAndProgress() {
    var header = document.getElementById("siteHeader");
    var progress = document.getElementById("scrollProgress");

    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("is-scrolled", y > 24);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var w = h > 0 ? (y / h) * 100 : 0;
        progress.style.width = w + "%";
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function setupCursorDot() {
    var dot = document.getElementById("cursorDot");
    if (!dot || window.matchMedia("(max-width: 640px)").matches) return;

    window.addEventListener("mousemove", function (event) {
      dot.style.left = event.clientX + "px";
      dot.style.top = event.clientY + "px";
      dot.style.opacity = "1";
    });

    window.addEventListener("mouseout", function () {
      dot.style.opacity = "0";
    });
  }

  function setupThemeToggle() {
    var button = document.getElementById("themeToggle");
    if (!button) return;

    var root = document.documentElement;
    var saved = localStorage.getItem("hanief-theme") || "crt";
    root.setAttribute("data-theme", saved === "cyber" ? "cyber" : "crt");

    function syncLabel() {
      var cyber = root.getAttribute("data-theme") === "cyber";
      button.textContent = cyber ? "CYBER MODE" : "CRT MODE";
    }

    syncLabel();
    button.addEventListener("click", function () {
      var cyber = root.getAttribute("data-theme") === "cyber";
      var next = cyber ? "crt" : "cyber";
      root.setAttribute("data-theme", next);
      localStorage.setItem("hanief-theme", next);
      syncLabel();
    });
  }

  function setupMobileMenu() {
    var header = document.getElementById("siteHeader");
    var toggle = document.getElementById("menuToggle");
    var panel = document.getElementById("commandPanel");
    if (!header || !toggle || !panel) return null;

    function closeMenu() {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      header.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function setMenu(open) {
      if (open) { openMenu(); } else { closeMenu(); }
    }

    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(); });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeMenu();
    });

    return { open: openMenu, close: closeMenu, set: setMenu };
  }

  var fKeyRoutes = {
    F1: "/",
    F2: "/about/",
    F3: "/projects/",
    F4: "/writing/",
    F5: "/now/",
    F6: "/contact/"
  };

  function setupKeyboardShortcuts(commandInput, menuApi) {
    document.addEventListener("keydown", function (event) {
      var tag = (event.target && event.target.tagName || "").toLowerCase();
      var isTyping = tag === "input" || tag === "textarea";

      // F1–F6: navigate to menu entries (works everywhere)
      if (fKeyRoutes[event.key]) {
        event.preventDefault();
        window.location.href = fKeyRoutes[event.key];
        return;
      }

      // / key: focus command input
      if (!isTyping && event.key === "/") {
        event.preventDefault();
        if (commandInput) {
          commandInput.focus();
          commandInput.value = "/";
        }
        return;
      }

      // Alt+M: toggle mobile menu
      if (!isTyping && event.altKey && event.key.toLowerCase() === "m" && menuApi) {
        event.preventDefault();
        var expanded = document.getElementById("menuToggle").getAttribute("aria-expanded") === "true";
        menuApi.set(!expanded);
        return;
      }

      // Any printable character while not typing → capture to command input
      if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.length === 1 && commandInput) {
        event.preventDefault();
        commandInput.focus();
        commandInput.value += event.key;
        return;
      }
    });
  }

  var ALL_SUGGESTIONS = [
    { cmd: "/home",     desc: "Go to home page",                key: "F1" },
    { cmd: "/about",    desc: "About me",                       key: "F2" },
    { cmd: "/projects", desc: "Projects archive",               key: "F3" },
    { cmd: "/writing",  desc: "Writing & essays",               key: "F4" },
    { cmd: "/now",      desc: "What I'm doing now",             key: "F5" },
    { cmd: "/contact",  desc: "Get in touch",                   key: "F6" },
    { cmd: "ls",        desc: "List files in current directory", key: null },
    { cmd: "cat",       desc: "Show file or page content",      key: null },
    { cmd: "cd",        desc: "Change directory",               key: null },
    { cmd: "theme",     desc: "Toggle CRT / Cyber theme",       key: null },
    { cmd: "top",       desc: "Scroll to top",                  key: null },
    { cmd: "bottom",    desc: "Scroll to bottom",               key: null },
    { cmd: "help",      desc: "Show all commands",              key: null }
  ];

  function setupCommandConsole(menuApi) {
    var form = document.getElementById("commandConsole");
    var input = document.getElementById("commandInput");
    var feedback = document.getElementById("commandFeedback");
    var themeToggle = document.getElementById("themeToggle");
    var suggestionsEl = document.getElementById("cmdSuggestions");
    var suggestionsListEl = document.getElementById("cmdSuggestionsList");
    if (!form || !input) return { input: null };

    var selectedIndex = -1;

    function hideSuggestions() {
      if (!suggestionsEl) return;
      suggestionsEl.setAttribute("aria-hidden", "true");
      selectedIndex = -1;
    }

    function renderSuggestions(items) {
      if (!suggestionsEl || !suggestionsListEl) return;
      if (!items.length) { hideSuggestions(); return; }

      suggestionsListEl.innerHTML = "";
      items.forEach(function (item, idx) {
        var row = document.createElement("div");
        row.className = "cmd-suggestion-item";
        row.setAttribute("role", "option");
        row.dataset.cmd = item.cmd;

        var cmdSpan = document.createElement("span");
        cmdSpan.className = "cmd-suggestion-cmd";
        cmdSpan.textContent = item.cmd;

        var descSpan = document.createElement("span");
        descSpan.className = "cmd-suggestion-desc";
        descSpan.textContent = item.desc;

        row.appendChild(cmdSpan);
        row.appendChild(descSpan);

        if (item.key) {
          var keySpan = document.createElement("span");
          keySpan.className = "cmd-suggestion-key";
          keySpan.textContent = item.key;
          row.appendChild(keySpan);
        }

        row.addEventListener("mousedown", function (e) {
          e.preventDefault(); // don't blur input
          input.value = item.cmd;
          hideSuggestions();
          syncCaret();
          form.dispatchEvent(new Event("submit"));
        });

        row.addEventListener("mouseover", function () {
          selectedIndex = idx;
          updateSelection();
        });

        suggestionsListEl.appendChild(row);
      });

      selectedIndex = -1;
      suggestionsEl.setAttribute("aria-hidden", "false");
    }

    function updateSelection() {
      var items = suggestionsListEl ? suggestionsListEl.querySelectorAll(".cmd-suggestion-item") : [];
      items.forEach(function (el, i) {
        el.classList.toggle("is-selected", i === selectedIndex);
      });
    }

    function getSuggestions(val) {
      if (!val || val === "") return [];
      var lower = val.toLowerCase();
      if (lower.charAt(0) === "/") {
        var slashItems = ALL_SUGGESTIONS.filter(function (s) { return s.cmd.charAt(0) === "/"; });
        if (lower === "/") return slashItems;
        return slashItems.filter(function (s) { return s.cmd.toLowerCase().indexOf(lower) === 0; });
      }
      // non-slash: match ls, cat, cd, etc.
      var nonSlash = ALL_SUGGESTIONS.filter(function (s) { return s.cmd.charAt(0) !== "/"; });
      return nonSlash.filter(function (s) { return s.cmd.toLowerCase().indexOf(lower) === 0; });
    }

    var routeMap = {
      home: "/",
      about: "/about/",
      projects: "/projects/",
      writing: "/writing/",
      essays: "/writing/",
      now: "/now/",
      contact: "/contact/"
    };

    // ── Virtual filesystem ────────────────────────────────────────

    var siteData = window.SITE_DATA || { projects: [], writing: [], pages: [] };

    var currentDir = (function () {
      var p = window.location.pathname;
      if (p.indexOf("/projects") === 0) return "projects";
      if (p.indexOf("/writing")  === 0) return "writing";
      return "";
    })();

    var brandPromptEl = document.getElementById("brandPrompt");

    function dirToPath(dir) { return dir ? "~/" + dir : "~"; }

    function updateBrandPrompt(dir) {
      currentDir = dir;
      if (brandPromptEl) brandPromptEl.textContent = "haniefutama@web:" + dirToPath(dir) + "$";
    }

    updateBrandPrompt(currentDir);

    // Terminal output panel
    var outputPanel  = document.getElementById("terminalOutput");
    var outputBody   = document.getElementById("terminalOutputBody");
    var outputCmdEl  = document.getElementById("terminalOutputCmd");
    var outputClose  = document.getElementById("terminalOutputClose");

    function showOutput(cmdText, html) {
      if (!outputPanel || !outputBody) return;
      if (outputCmdEl) outputCmdEl.textContent = cmdText;
      outputBody.innerHTML = html;
      outputPanel.setAttribute("aria-hidden", "false");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function hideOutput() {
      if (!outputPanel) return;
      outputPanel.setAttribute("aria-hidden", "true");
      if (outputBody) outputBody.innerHTML = "";
    }

    if (outputClose) outputClose.addEventListener("click", hideOutput);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && outputPanel && outputPanel.getAttribute("aria-hidden") === "false") {
        hideOutput();
      }
    });

    function escHtml(s) {
      return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function findBySlug(arr, slug) {
      var exact = arr.filter(function (p) { return p.slug === slug; })[0];
      if (exact) return exact;
      return arr.filter(function (p) { return p.slug.indexOf(slug) !== -1; })[0] || null;
    }

    function buildCatHtml(item, type) {
      var h = '<div class="cat-output">';
      h += '<div class="cat-header">── ' + escHtml(item.title) + ' ──</div>';
      if (item.date || type) {
        h += '<div class="cat-meta">' + (item.date || "") + (item.date && type ? " · " : "") + (type || "") + "</div>";
      }
      h += '<div class="cat-desc">' + escHtml(item.description || "No description.") + "</div>";
      h += '<a class="terminal-button cat-link" href="' + item.url + '">[ open → ]</a>';
      h += "</div>";
      return h;
    }

    function cmdLs(args) {
      var dir = (args && args.trim()) ? args.trim().replace(/^\/|\/$/g, "").toLowerCase() : currentDir;

      if (!dir || dir === "~") {
        var h = '<div class="ls-output">';
        h += '<div class="ls-row"><span class="ls-badge ls-badge-dir">DIR</span><a class="ls-name ls-dir" href="/projects/">projects/</a><span class="ls-info">' + siteData.projects.length + ' items</span></div>';
        h += '<div class="ls-row"><span class="ls-badge ls-badge-dir">DIR</span><a class="ls-name ls-dir" href="/writing/">writing/</a><span class="ls-info">' + siteData.writing.length + ' items</span></div>';
        siteData.pages.forEach(function (p) {
          h += '<div class="ls-row"><span class="ls-badge ls-badge-file">FILE</span><a class="ls-name" href="' + p.url + '">' + escHtml(p.slug) + '</a><span class="ls-info">' + escHtml(p.description) + '</span></div>';
        });
        h += "</div>";
        showOutput("ls " + dirToPath(""), h);

      } else if (dir === "projects") {
        var h = '<div class="ls-output">';
        if (!siteData.projects.length) {
          h += '<div class="ls-empty">No projects found.</div>';
        } else {
          siteData.projects.forEach(function (p, i) {
            h += '<div class="ls-row"><span class="ls-index">[' + String(i + 1).padStart(2, "0") + ']</span><span class="ls-name">' + escHtml(p.slug) + '</span><span class="ls-info">' + escHtml(p.title) + '</span></div>';
          });
        }
        h += "</div>";
        showOutput("ls ~/projects", h);

      } else if (dir === "writing") {
        var h = '<div class="ls-output">';
        if (!siteData.writing.length) {
          h += '<div class="ls-empty">No posts found.</div>';
        } else {
          siteData.writing.forEach(function (p, i) {
            h += '<div class="ls-row"><span class="ls-index">[' + String(i + 1).padStart(2, "0") + ']</span><span class="ls-date">' + (p.date || "") + '</span><span class="ls-name">' + escHtml(p.slug) + '</span><span class="ls-info">' + escHtml(p.title) + '</span></div>';
          });
        }
        h += "</div>";
        showOutput("ls ~/writing", h);

      } else {
        setFeedback("ls: " + dir + ": no such directory");
      }
    }

    function cmdCat(args) {
      if (!args || !args.trim()) { setFeedback("usage: cat <name>"); return; }

      var target = args.trim().replace(/^\//, "");
      var parts  = target.split("/");
      var dir    = parts.length > 1 ? parts[0].toLowerCase() : currentDir;
      var slug   = parts.length > 1 ? parts[1] : parts[0];

      // Pages (root level)
      var page = siteData.pages.filter(function (p) { return p.slug === slug; })[0];
      if (page && (!dir || dir === "~")) { showOutput("cat " + slug, buildCatHtml(page, null)); return; }

      // Projects
      var project = findBySlug(siteData.projects, slug);
      if (project && (dir === "projects" || !dir)) { showOutput("cat " + slug, buildCatHtml(project, "project")); return; }

      // Writing
      var post = findBySlug(siteData.writing, slug);
      if (post && (dir === "writing" || !dir)) { showOutput("cat " + slug, buildCatHtml(post, "essay")); return; }

      setFeedback("cat: " + slug + ": no such file — try ls to see available files");
    }

    function cmdCd(args) {
      var target = (args || "").trim().replace(/^\/|\/$/g, "").toLowerCase();

      if (!target || target === "~") { updateBrandPrompt(""); setFeedback(dirToPath("")); return; }
      if (target === "..")           { updateBrandPrompt(""); setFeedback(dirToPath("")); return; }

      if (target === "projects" || target === "writing") {
        updateBrandPrompt(target);
        setFeedback(dirToPath(target));
        return;
      }

      // Pages are files, not dirs → navigate
      var page = siteData.pages.filter(function (p) { return p.slug === target; })[0];
      if (page) { executeRoute(page.url); return; }

      setFeedback("cd: " + target + ": not a directory");
    }

    // ── End virtual filesystem ────────────────────────────────────

    function setFeedback(message) {
      if (!feedback) return;
      feedback.textContent = message;
      clearTimeout(setFeedback._timer);
      setFeedback._timer = setTimeout(function () {
        feedback.textContent = "";
      }, 2400);
    }

    function executeRoute(path) {
      setFeedback("navigating " + path);
      window.location.href = path;
    }

    function parseCommand(raw) {
      var command = (raw || "").trim();
      if (!command) return;

      var normalized = command.toLowerCase();
      var tokens = normalized.split(/\s+/);
      var head = tokens[0];
      var tail = tokens.slice(1).join(" ");

      // Filesystem commands — intercept before any stripping
      if (head === "ls")  { cmdLs(tail);  return; }
      if (head === "cat") { cmdCat(tail); return; }
      if (head === "cd")  { cmdCd(tail);  return; }

      if (head === "go" || head === "open") {
        normalized = tail;
        head = (tail.split(/\s+/)[0] || "").toLowerCase();
      }

      if (!normalized) return;

      if (normalized === "help" || normalized === "?") {
        setFeedback("F1-F6 navigate · /about /projects /writing /now /contact · theme · top · bottom");
        return;
      }

      if (normalized === "menu") {
        if (menuApi) menuApi.open();
        setFeedback("menu opened");
        return;
      }

      if (normalized === "close") {
        if (menuApi) menuApi.close();
        setFeedback("menu closed");
        return;
      }

      if (normalized === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setFeedback("scrolling top");
        return;
      }

      if (normalized === "bottom") {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        setFeedback("scrolling bottom");
        return;
      }

      if (normalized === "theme" || normalized === "cyber" || normalized === "crt") {
        if (themeToggle) {
          if (normalized === "cyber" && themeToggle.textContent !== "CYBER MODE") themeToggle.click();
          if (normalized === "crt" && themeToggle.textContent !== "CRT MODE") themeToggle.click();
          if (normalized === "theme") themeToggle.click();
          setFeedback("theme switched");
        }
        return;
      }

      if (normalized.charAt(0) === "/") {
        executeRoute(normalized);
        return;
      }

      if (routeMap[head]) {
        executeRoute(routeMap[head]);
        return;
      }

      setFeedback("unknown: " + command + " — try /about or press F1-F6");
    }

    // Show | caret only when input is unfocused AND empty
    var caret = document.getElementById("commandCaret");
    function syncCaret() {
      if (!caret) return;
      var show = document.activeElement !== input && input.value.length === 0;
      caret.style.visibility = show ? "visible" : "hidden";
    }
    input.addEventListener("focus", syncCaret);
    input.addEventListener("blur", function () {
      syncCaret();
      // small delay so mousedown on a suggestion fires first
      setTimeout(hideSuggestions, 120);
    });
    input.addEventListener("input", function () {
      syncCaret();
      renderSuggestions(getSuggestions(input.value));
    });

    // Arrow key + Escape navigation inside suggestions
    input.addEventListener("keydown", function (e) {
      var items = suggestionsListEl ? suggestionsListEl.querySelectorAll(".cmd-suggestion-item") : [];
      var open = suggestionsEl && suggestionsEl.getAttribute("aria-hidden") === "false";

      if (e.key === "Escape") {
        if (suggestionsEl && suggestionsEl.getAttribute("aria-hidden") === "false") {
          hideSuggestions();
        } else {
          hideOutput();
        }
        return;
      }

      if (!open || !items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection();
        return;
      }

      if (e.key === "Tab" || e.key === "Enter") {
        if (selectedIndex >= 0 && items[selectedIndex]) {
          e.preventDefault();
          input.value = items[selectedIndex].dataset.cmd;
          hideSuggestions();
          syncCaret();
          if (e.key === "Enter") form.dispatchEvent(new Event("submit"));
          return;
        }
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hideSuggestions();
      parseCommand(input.value);
      input.value = "";
      syncCaret();
    });

    return { input: input };
  }

  function typeLine(el, text) {
    return new Promise(function (resolve) {
      var i = 0;
      el.style.opacity = "1";

      // Blinking block cursor that follows typing
      var cursor = document.createElement("span");
      cursor.className = "type-cursor";
      el.appendChild(cursor);

      function next() {
        if (i < text.length) {
          // Insert text node before the cursor
          var textNode = el.firstChild && el.firstChild.nodeType === 3 ? el.firstChild : null;
          if (textNode) {
            textNode.textContent = text.slice(0, i + 1);
          } else {
            el.insertBefore(document.createTextNode(text.slice(0, i + 1)), cursor);
          }
          i += 1;
          var delay = 12 + Math.random() * 22;
          setTimeout(next, delay);
        } else {
          cursor.remove();
          resolve();
        }
      }

      next();
    });
  }

  async function runBootSequence() {
    var lines = Array.prototype.slice.call(document.querySelectorAll(".boot-line"));
    var heading = document.getElementById("bootHeading");
    var bootCaret = document.getElementById("bootCaret");
    var dock = document.getElementById("commandDock");
    if (!lines.length || !heading) return;

    for (var idx = 0; idx < lines.length; idx += 1) {
      await typeLine(lines[idx], lines[idx].dataset.text || "");
      await new Promise(function (r) { setTimeout(r, 45); });
    }

    // Reveal heading
    if (window.gsap) {
      await new Promise(function (r) {
        window.gsap.to(heading, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          onComplete: r
        });
      });
    } else {
      heading.style.opacity = "1";
      heading.style.transform = "translateY(0)";
    }

    // Boot caret blinks under the ASCII art for a moment, then fades out
    // signalling the caret has "moved" to the command dock
    await new Promise(function (r) { setTimeout(r, 1400); });

    if (bootCaret) {
      if (window.gsap) {
        window.gsap.to(bootCaret, { opacity: 0, duration: 0.4, ease: "power2.in" });
      } else {
        bootCaret.style.opacity = "0";
      }
    }

    // Flash the command dock: caret is now "down there"
    await new Promise(function (r) { setTimeout(r, 300); });
    if (dock) {
      dock.classList.add("is-ready");
      setTimeout(function () { dock.classList.remove("is-ready"); }, 1200);
    }
  }

  function setupGsapScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;
    window.gsap.registerPlugin(window.ScrollTrigger);

    var ctx = window.gsap.context(function () {
      window.gsap.utils.toArray(".profile-row").forEach(function (row, index) {
        window.gsap.to(row, {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: "power3.out",
          delay: index * 0.08,
          scrollTrigger: {
            trigger: row,
            start: "top 84%"
          }
        });
      });

      window.gsap.utils.toArray(".data-block").forEach(function (block) {
        window.gsap.from(block, {
          opacity: 0,
          y: 22,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 90%"
          }
        });
      });
    });

    window.addEventListener("beforeunload", function () {
      ctx.revert();
    });
  }

  function setupMagneticButtons() {
    if (!window.gsap) return;

    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (event) {
        var rect = btn.getBoundingClientRect();
        var x = event.clientX - rect.left - rect.width / 2;
        var y = event.clientY - rect.top - rect.height / 2;
        window.gsap.to(btn, {
          x: x * 0.14,
          y: y * 0.18,
          duration: 0.32,
          ease: "power3.out"
        });
      });

      btn.addEventListener("mouseleave", function () {
        window.gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power3.out"
        });
      });
    });
  }

  function setupProjectBlocks() {
    var modal = document.getElementById("projectModal");
    if (!modal) return;

    var modalTitle = document.getElementById("modalTitle");
    var modalStatus = document.getElementById("modalStatus");
    var modalDescription = document.getElementById("modalDescription");
    var modalLink = document.getElementById("modalLink");
    var modalClose = document.getElementById("modalClose");

    function openModal(block) {
      modalTitle.textContent = block.dataset.title || "Project";
      modalStatus.textContent = "Status: " + (block.dataset.status || "Active");
      modalDescription.textContent = block.dataset.description || "No description available.";
      modalLink.href = block.dataset.link || "#";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".project-block").forEach(function (block) {
      block.style.cursor = "pointer";
      block.addEventListener("click", function () { openModal(block); });

      block.addEventListener("mousemove", function (event) {
        var rect = block.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        block.style.transform = "perspective(900px) rotateX(" + (-y * 3.2) + "deg) rotateY(" + (x * 4) + "deg)";
      });

      block.addEventListener("mouseleave", function () {
        block.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      });
    });

    if (modalClose) modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateTimeTargets();
    setInterval(updateTimeTargets, 1000);
    setupHeaderAndProgress();
    var menuApi = setupMobileMenu();
    var commandApi = setupCommandConsole(menuApi);
    setupCursorDot();
    setupThemeToggle();
    setupKeyboardShortcuts(commandApi.input, menuApi);
    setupMagneticButtons();
    setupProjectBlocks();
    setupGsapScroll();
    runBootSequence();
  });
})();
