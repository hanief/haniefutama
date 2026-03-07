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
      if (open) {
        openMenu();
      } else {
        closeMenu();
      }
    }

    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeMenu();
    });

    return {
      open: openMenu,
      close: closeMenu,
      set: setMenu
    };
  }

  function setupKeyboardShortcuts(commandInput, menuApi) {
    var links = {
      p: "/projects/",
      w: "/writing/",
      a: "/about/",
      h: "/",
      n: "/now/",
      c: "/contact/"
    };

    document.addEventListener("keydown", function (event) {
      var tag = (event.target && event.target.tagName || "").toLowerCase();
      var isTyping = tag === "input" || tag === "textarea";

      if (!isTyping && event.key === "/") {
        event.preventDefault();
        if (commandInput) {
          commandInput.focus();
          commandInput.select();
        }
        return;
      }

      if (!isTyping && event.altKey && event.key.toLowerCase() === "m" && menuApi) {
        event.preventDefault();
        var expanded = document.getElementById("menuToggle").getAttribute("aria-expanded") === "true";
        menuApi.set(!expanded);
        return;
      }

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;
      var key = event.key.toLowerCase();
      if (links[key]) {
        window.location.href = links[key];
      }
    });
  }

  function setupCommandConsole(menuApi) {
    var form = document.getElementById("commandConsole");
    var input = document.getElementById("commandInput");
    var feedback = document.getElementById("commandFeedback");
    var themeToggle = document.getElementById("themeToggle");
    if (!form || !input) return { input: null };

    var routeMap = {
      home: "/",
      about: "/about/",
      projects: "/projects/",
      writing: "/writing/",
      essays: "/writing/",
      now: "/now/",
      contact: "/contact/"
    };

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

      if (head === "go" || head === "open" || head === "cd") {
        normalized = tail;
        head = (tail.split(/\s+/)[0] || "").toLowerCase();
      }

      if (!normalized) return;

      if (normalized === "help" || normalized === "?") {
        setFeedback("commands: home about projects writing now contact /path top bottom theme");
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

      setFeedback("unknown command: " + command);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      parseCommand(input.value);
      input.value = "";
    });

    return { input: input };
  }

  function typeLine(el, text) {
    return new Promise(function (resolve) {
      var i = 0;
      el.style.opacity = "1";

      function next() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i += 1;
          var delay = 12 + Math.random() * 22;
          setTimeout(next, delay);
        } else {
          resolve();
        }
      }

      next();
    });
  }

  async function runBootSequence() {
    var lines = Array.prototype.slice.call(document.querySelectorAll(".boot-line"));
    var heading = document.getElementById("bootHeading");
    if (!lines.length || !heading) return;

    for (var idx = 0; idx < lines.length; idx += 1) {
      await typeLine(lines[idx], lines[idx].dataset.text || "");
      await new Promise(function (r) { setTimeout(r, 45); });
    }

    if (window.gsap) {
      window.gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out"
      });
    } else {
      heading.style.opacity = "1";
      heading.style.transform = "translateY(0)";
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
    // var modalStack = document.getElementById("modalStack");
    var modalDescription = document.getElementById("modalDescription");
    var modalLink = document.getElementById("modalLink");
    var modalClose = document.getElementById("modalClose");

    function openModal(block) {
      modalTitle.textContent = block.dataset.title || "Project";
      modalStatus.textContent = "Status: " + (block.dataset.status || "Active");
      // modalStack.textContent = "Stack: " + (block.dataset.stack || "React / Node / AI");
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
      var trigger = block.querySelector(".project-open");
      if (trigger) {
        trigger.addEventListener("click", function () {
          openModal(block);
        });
      }

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
