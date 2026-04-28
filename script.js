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
let intelSent = false;

function activeIntel() {
  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollTotal) * 100;

    if (scrollPercent > 50 && !intelSent) {
      // PERBAIKAN: Ambil judul dari <title> yang sudah diupdate oleh post.html
      // Kita hapus bagian " | Jurnal Faisal" agar hanya judulnya saja
      let fixTitle = document.title.split(' | ')[0];
      
      const params = new URLSearchParams(window.location.search);
      const postSlug = params.get("slug") || "homepage";
      const infoDevice = navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || "Browser";

      fetch("/.netlify/functions/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: fixTitle, // Judul asli artikel
          slug: postSlug,
          deviceInfo: infoDevice,
          url: window.location.href 
        })
      });

      intelSent = true;
    }
  });
}

// Tambah durasi tunggu jadi 3 detik agar post.html selesai update document.title
setTimeout(activeIntel, 3000);
