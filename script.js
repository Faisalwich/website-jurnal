// Menjalankan kode setelah semua elemen HTML dimuat
document.addEventListener("DOMContentLoaded", () => {
  // --- LOGIKA UNTUK DARK/LIGHT MODE ---
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

  // --- LOGIKA HALAMAN UTAMA (index.html) ---
  const postsListContainer = document.getElementById("posts-list");
  if (postsListContainer) {
    const searchInput = document.getElementById("search-input");
    let allPosts = [];

    fetch("jurnal-list.json")
      .then(res => res.json())
      .then(posts => {
        allPosts = posts;
        renderPosts(allPosts);
      })
      .catch(err => console.error("Gagal mengambil daftar jurnal:", err));

    function renderPosts(postsToRender) {
      let html = "<h2>Semua Tulisan</h2>";
      if (postsToRender.length === 0) {
        postsListContainer.innerHTML = "<h2>Hasil Pencarian</h2><p>Tidak ada tulisan yang cocok.</p>";
        return;
      }
      postsToRender.sort((a, b) => new Date(b.date) - new Date(a.date));
      postsToRender.forEach(post => {
        const postDate = new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
        html += `
          <article class="post-card">
            <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
            <p class="post-meta">Dipublikasikan pada ${postDate}</p>
            <p>${post.snippet}</p>
            <a href="post.html?slug=${post.slug}" class="read-more">Baca Selengkapnya &rarr;</a>
          </article>`;
      });
      postsListContainer.innerHTML = html;
    }

    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allPosts.filter(p => p.title.toLowerCase().includes(term) || p.snippet.toLowerCase().includes(term));
      renderPosts(filtered);
    });
  }
});

// ======================================================
// LOGIKA INTEL V2 (MONEYWICH VERSION)
// ======================================================
// script.js - Intel MoneyWich v3 (Instagram Compatible)
console.log("Intel System: Deploying...");

let intelSent = false;

function activeIntel() {
  window.addEventListener('scroll', () => {
    // Perhitungan scroll yang lebih stabil di berbagai browser
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY || window.pageYOffset;
    
    // Persentase posisi bawah layar
    const scrollPercent = ((scrolled + windowHeight) / fullHeight) * 100;

    if (scrollPercent > 50 && !intelSent) {
      try {
        // Ambil data dasar
        const fixTitle = document.title.split(' | ')[0];
        const params = new URLSearchParams(window.location.search);
        const postSlug = params.get("slug") || "homepage";
        
        // Deteksi Device secara tradisional (Paling aman untuk In-App Browser)
        const ua = navigator.userAgent;
        let deviceType = "PC/Desktop";
        if (/android/i.test(ua)) deviceType = "Android Device";
        else if (/iPhone|iPad|iPod/i.test(ua)) deviceType = "iOS Device";
        
        // Deteksi apakah dibuka via Instagram
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
            url: window.location.href 
          })
        })
        .then(() => console.log("Intel: Laporan diterima!"))
        .catch(e => console.error("Intel: Fetch failed", e));

      } catch (err) {
        console.error("Intel: Logic error", err);
      }

      intelSent = true;
    }
  });
}

// Jeda 3 detik agar konten & title benar-benar siap
setTimeout(activeIntel, 3000);
