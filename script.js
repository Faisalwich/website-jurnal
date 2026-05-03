document.addEventListener("DOMContentLoaded", () => {
  // --- 1. LOGIKA DARK/LIGHT MODE (TETAP MEKANIS) ---
  const themeToggleButton = document.getElementById("theme-toggle-btn");
  const body = document.body;

  if (themeToggleButton) {
    const updateThemeIcon = () => {
      themeToggleButton.textContent = body.classList.contains("light-mode") ? "🌙" : "☀️";
    };

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") body.classList.add("light-mode");
    updateThemeIcon();

    themeToggleButton.addEventListener("click", () => {
      body.classList.toggle("light-mode");
      body.classList.contains("light-mode") ? localStorage.setItem("theme", "light") : localStorage.removeItem("theme");
      updateThemeIcon();
    });
  }

  // --- 2. LOGIKA HALAMAN UTAMA (INDEX.HTML) ---
  const postsListContainer = document.getElementById("posts-list");
  if (postsListContainer) {
    const searchInput = document.getElementById("search-input");
    let allPosts = [];

    // Mengambil data jurnal
    fetch("jurnal-list.json")
      .then((res) => res.json())
      .then((posts) => {
        allPosts = posts;
        renderPosts(allPosts);
      })
      .catch((err) => console.error("Gagal mengambil daftar jurnal:", err));

    function renderPosts(postsToRender) {
      if (postsToRender.length === 0) {
        postsListContainer.innerHTML = "<p>Tidak ada tulisan yang cocok.</p>";
        return;
      }

      // Sort terbaru ke terlama
      postsToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

      let html = "";
      postsToRender.forEach((post) => {
        const postDate = new Date(post.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        // PEMBARUAN: Seluruh kartu bisa diklik dengan onclick
        // Menjaga elemen snippet dan meta tetap ada sesuai kode Tuan Faisal
        html += `
          <article class="post-card" onclick="window.location.href='post.html?slug=${post.slug}'">
            <h3>${post.title}</h3>
            <p>${post.snippet}</p>
            <div class="post-meta">📅 ${postDate}</div>
            <div class="read-more-label" style="margin-top:1rem; font-weight:bold; font-family:var(--font-heading);">Buka Jurnal →</div>
          </article>`;
      });

      postsListContainer.innerHTML = html;
    }

    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allPosts.filter((p) => p.title.toLowerCase().includes(term) || p.snippet.toLowerCase().includes(term));
      renderPosts(filtered);
    });
  }
});

// ======================================================
// LOGIKA INTEL V2 (MONEYWICH VERSION) - TETAP AMAN!
// ======================================================
console.log("Intel System: Deploying...");
let intelSent = false;

function activeIntel() {
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY || window.pageYOffset;
    const scrollPercent = ((scrolled + windowHeight) / fullHeight) * 100;

    if (scrollPercent > 50 && !intelSent) {
      try {
        const fixTitle = document.title.split(" | ")[0];
        const params = new URLSearchParams(window.location.search);
        const postSlug = params.get("slug") || "homepage";

        const ua = navigator.userAgent;
        let deviceType = "PC/Desktop";
        if (/android/i.test(ua)) deviceType = "Android Device";
        else if (/iPhone|iPad|iPod/i.test(ua)) deviceType = "iOS Device";

        const isInstagram = /Instagram/i.test(ua) ? " (via Instagram)" : "";
        const fullDeviceInfo = deviceType + isInstagram;

        console.log("Intel: Sending report to command center...");

        fetch("/.netlify/functions/intel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: fixTitle,
            slug: postSlug,
            deviceInfo: fullDeviceInfo,
            url: window.location.href,
          }),
        })
          .then(() => console.log("Intel: Laporan diterima!"))
          .catch((e) => console.error("Intel: Fetch failed", e));
      } catch (err) {
        console.error("Intel: Logic error", err);
      }
      intelSent = true;
    }
  });
}

setTimeout(activeIntel, 3000);
