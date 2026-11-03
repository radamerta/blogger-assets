document.addEventListener("DOMContentLoaded", function () {
  // 1. FUNGSI UNTUK MENGACAK OPSI JAWABAN (Fisher-Yates Shuffle)
  function shuffleOptions() {
    const optionGroups = document.querySelectorAll(".cbt-options-group");
    optionGroups.forEach((group) => {
      const options = Array.from(group.children);
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      options.forEach((option) => group.appendChild(option));
    });
  }

  // Jalankan pengacakan pilihan jawaban sejak awal
  shuffleOptions();

  // 2. FUNGSI HITUNG PAPAN SKOR KUMULATIF
  const quizItems = document.querySelectorAll(".cbt-quiz-item");
  
  function updateScoreboard() {
    let totalSoal = quizItems.length;
    let terjawab = 0;
    let benar = 0;
    let salah = 0;

    quizItems.forEach((item) => {
      if (item.classList.contains("is-submitted")) {
        terjawab++;
        if (item.classList.contains("is-correct")) {
          benar++;
        } else if (item.classList.contains("is-wrong")) {
          salah++;
        }
      }
    });

    // Kalkulasi skor (skala 0 - 100)
    let skorAkhir = totalSoal > 0 ? Math.round((benar / totalSoal) * 100) : 0;

    // Render ke HTML widget papan skor jika elemennya ada
    if(document.getElementById("cbt-total-soal")) document.getElementById("cbt-total-soal").textContent = totalSoal;
    if(document.getElementById("cbt-terjawab")) document.getElementById("cbt-terjawab").textContent = terjawab;
    if(document.getElementById("cbt-benar")) document.getElementById("cbt-benar").textContent = benar;
    if(document.getElementById("cbt-salah")) document.getElementById("cbt-salah").textContent = salah;
    if(document.getElementById("cbt-skor-akhir")) document.getElementById("cbt-skor-akhir").textContent = skorAkhir;
  }

  // Set inisialisasi awal papan skor
  updateScoreboard();

  // 3. MANAJEMEN LOGIKA TOMBOL INTERAKTIF TIAP SOAL
  quizItems.forEach((item) => {
    const submitBtn = item.querySelector(".btn-cbt-submit");
    const resetBtn = item.querySelector(".btn-cbt-reset");
    const feedbackStatus = item.querySelector(".cbt-feedback-status");
    const accordionBox = item.querySelector(".accordion");
    const correctAnswer = item.getAttribute("data-answer");

    // LOGIKA TOMBOL KIRIM
    submitBtn.addEventListener("click", function () {
      // Jika kuis untuk soal ini sudah dikunci/dikirim sebelumnya, abaikan klik berulang
      if (item.classList.contains("is-submitted")) return;

      const selectedOption = item.querySelector('input[type="radio"]:checked');

      if (!selectedOption) {
        alert("Silakan pilih salah satu jawaban terlebih dahulu!");
        return;
      }

      // Tambahkan penanda bahwa soal telah dikirim dan bersihkan status lama
      item.classList.add("is-submitted");
      item.classList.remove("is-correct", "is-wrong");
      feedbackStatus.classList.remove("benar", "salah");

      // Kunci semua radio button pada soal ini biar tidak bisa diganti-ganti
      const radios = item.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => radio.disabled = true);

      // Cek Validasi Jawaban
      if (selectedOption.value === correctAnswer) {
        feedbackStatus.textContent = "✓ JAWABAN BENAR";
        feedbackStatus.classList.add("benar");
        item.classList.add("is-correct"); // Triggers CSS background hijau
      } else {
        feedbackStatus.textContent = "✗ JAWABAN SALAH";
        feedbackStatus.classList.add("salah");
        item.classList.add("is-wrong"); // Triggers CSS background merah
      }

      // Tampilkan Pembahasan
      if (accordionBox) {
        accordionBox.classList.remove("d-none");
      }

      // Perbarui total nilai di widget papan skor
      updateScoreboard();
    });

    // LOGIKA TOMBOL HAPUS / RESET
    resetBtn.addEventListener("click", function () {
      // Hilangkan status penguncian kelas CSS
      item.classList.remove("is-submitted", "is-correct", "is-wrong");

      // Buka kembali kunci radio button dan kosongkan pilihan
      const radios = item.querySelectorAll('input[type="radio"]');
      radios.forEach((radio) => {
        radio.checked = false;
        radio.disabled = false;
      });

      // Sembunyikan status feedback teks
      feedbackStatus.textContent = "";
      feedbackStatus.classList.remove("benar", "salah");
      
      // Sembunyikan dan lipat kembali akordeon pembahasan
      if (accordionBox) {
        accordionBox.classList.add("d-none");
        const collapseElement = accordionBox.querySelector(".accordion-collapse");
        if (collapseElement && collapseElement.classList.contains("show")) {
          const triggerBtn = accordionBox.querySelector(".cbt-btn-trigger");
          if (triggerBtn) triggerBtn.click();
        }
      }

      // Perbarui ulang nilai di widget papan skor setelah dihapus
      updateScoreboard();
    });
  });
});
