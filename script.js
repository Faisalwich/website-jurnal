// Menjalankan kode setelah semua elemen HTML dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Menemukan kontainer di halaman
  const postsListContainer = document.getElementById("posts-list");
  const postContentContainer = document.getElementById("post-content");

  // --- LOGIKA UNTUK DARK/LIGHT MODE ---
  const themeToggleButton = document.getElementById("theme-toggle-btn");
  const body = document.body;

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
  updateThemeIcon(); // Perbarui ikon saat pertama kali dibuka

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

  // --- Kode Anda yang sudah ada untuk menampilkan jurnal ---
  document.addEventListener("DOMContentLoaded", () => {
    // ... sisa kode Anda ...
  });

  // ======================================================
  // LOGIKA UNTUK HALAMAN UTAMA (index.html) - VERSI DENGAN PENCARIAN
  // ======================================================
  if (postsListContainer) {
    const searchInput = document.getElementById("search-input");
    let allPosts = []; // Variabel untuk menyimpan semua data post

    // Ambil data dari "daftar isi"
    fetch("jurnal-list.json")
      .then((response) => response.json())
      .then((posts) => {
        allPosts = posts; // Simpan data asli
        renderPosts(allPosts); // Tampilkan semua post saat pertama kali dimuat
      })
      .catch((error) => {
        postsListContainer.innerHTML = "<p>Gagal memuat daftar tulisan.</p>";
        console.error("Gagal mengambil daftar jurnal:", error);
      });

    // Fungsi untuk menampilkan (merender) postingan
    function renderPosts(postsToRender) {
      let allPostsHtml = "<h2>Semua Tulisan</h2>";

      if (postsToRender.length === 0) {
        postsListContainer.innerHTML = "<h2>Hasil Pencarian</h2><p>Tidak ada tulisan yang cocok.</p>";
        return;
      }

      // Urutkan tulisan dari yang terbaru
      postsToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Buat kartu HTML untuk setiap tulisan
      postsToRender.forEach((post) => {
        const postDate = new Date(post.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        allPostsHtml += `
                <article class="post-card">
                    <h3>${post.title}</h3>
                    <p class="post-meta">Dipublikasikan pada ${postDate}</p>
                    <p>${post.snippet}</p>
                    <a href="post.html?slug=${post.slug}" class="read-more">Baca Selengkapnya &rarr;</a>
                </article>
            `;
      });

      postsListContainer.innerHTML = allPostsHtml;
    }

    // Event listener untuk kotak pencarian
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredPosts = allPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm) || post.snippet.toLowerCase().includes(searchTerm);
      });
      renderPosts(filteredPosts);
    });
  }

  // ======================================================
  // LOGIKA UNTUK HALAMAN DETAIL TULISAN (post.html)
  // ======================================================
  if (postContentContainer) {
    // Ambil 'slug' dari URL, contoh: post.html?slug=tulisan-pertama-saya
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get("slug");

    if (!postSlug) {
      postContentContainer.innerHTML = "<h2>Error: Tulisan tidak ditemukan.</h2>";
      return;
    }

    // Ambil file markdown yang sesuai dari folder _jurnal/
    // Pastikan folder ini dibuat oleh Netlify CMS
    fetch(`/_jurnal/${postSlug}.md`)
      .then((response) => response.text())
      .then((markdown) => {
        const parts = markdown.split("---");
        const frontMatterText = parts[1];
        const markdownBody = parts[2];

        // Mengolah metadata
        const frontMatter = {};
        frontMatterText.split("\n").forEach((line) => {
          if (line.trim()) {
            const [key, ...value] = line.split(":");
            frontMatter[key.trim()] = value.join(":").trim();
          }
        });

        // Mengubah isi tulisan (markdown) menjadi HTML
        const contentHtml = marked.parse(markdownBody);
        const postDate = new Date(frontMatter.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Mengubah judul tab browser
        document.title = `${frontMatter.title} | Jurnal Faisal`;

        // Menampilkan hasil ke halaman
        postContentContainer.innerHTML = `
                    <h1>${frontMatter.title}</h1>
                    <p class="post-meta">Dipublikasikan pada ${postDate}</p>
                    <div class="post-body">${contentHtml}</div>
                `;
      })
      .catch((error) => {
        postContentContainer.innerHTML = "<h2>Gagal memuat konten tulisan.</h2>";
        console.error("Gagal mengambil file tulisan:", error);
      });
  }
});
