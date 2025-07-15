// Menjalankan kode setelah semua elemen HTML dimuat
document.addEventListener("DOMContentLoaded", () => {
  // --- LOGIKA UNTUK DARK/LIGHT MODE ---
  const themeToggleButton = document.getElementById("theme-toggle-btn");
  const body = document.body;

  if (themeToggleButton) {
    // Fungsi untuk mengubah ikon
    const updateThemeIcon = () => {
      if (body.classList.contains("light-mode")) {
        themeToggleButton.textContent = "🌙";
      } else {
        themeToggleButton.textContent = "☀️";
      }
    };

    // Cek tema yang tersimpan saat halaman dimuat
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      body.classList.add("light-mode");
    }
    updateThemeIcon();

    // Event listener untuk tombol
    themeToggleButton.addEventListener("click", () => {
      body.classList.toggle("light-mode");
      if (body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.removeItem("theme");
      }
      updateThemeIcon();
    });
  }

  // ======================================================
  // LOGIKA HANYA UNTUK HALAMAN UTAMA (index.html)
  // ======================================================
  const postsListContainer = document.getElementById("posts-list");
  if (postsListContainer) {
    const searchInput = document.getElementById("search-input");
    let allPosts = [];

    fetch("jurnal-list.json")
      .then((response) => response.json())
      .then((posts) => {
        allPosts = posts;
        renderPosts(allPosts);
      })
      .catch((error) => {
        postsListContainer.innerHTML = "<p>Gagal memuat daftar tulisan.</p>";
        console.error("Gagal mengambil daftar jurnal:", error);
      });

    function renderPosts(postsToRender) {
      let allPostsHtml = "<h2>Semua Tulisan</h2>";
      if (postsToRender.length === 0) {
        postsListContainer.innerHTML = "<h2>Hasil Pencarian</h2><p>Tidak ada tulisan yang cocok.</p>";
        return;
      }
      postsToRender.sort((a, b) => new Date(b.date) - new Date(a.date));
      postsToRender.forEach((post) => {
        const postDate = new Date(post.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        allPostsHtml += `
            <article class="post-card">
                <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                <p class="post-meta">Dipublikasikan pada ${postDate}</p>
                <p>${post.snippet}</p>
                <a href="post.html?slug=${post.slug}" class="read-more">Baca Selengkapnya &rarr;</a>
            </article>
        `;
      });
      postsListContainer.innerHTML = allPostsHtml;
    }

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredPosts = allPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm) || post.snippet.toLowerCase().includes(searchTerm);
      });
      renderPosts(filteredPosts);
    });
  }
});
