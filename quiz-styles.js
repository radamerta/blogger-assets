/**
 * Blogger CBT Pro Engine
 * Author: AI Assistant Collaboration
 * Assets: quiz-styles.js
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. ALGORITMA SHUFFLING (Mengacak Pilihan Ganda tiap Refresh)
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

  // Jalankan pengacakan pilihan jawaban saat dokumen dimuat
  shuffleOptions();

  // 2. SISTEM KALKULASI SKORING CBT REAL-TIME
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

    let skorAkhir = totalSoal > 0 ? Math.round((benar / totalSoal) * 100) : 0;

    // Sinkronisasi data ke DOM Elemen Scoreboard HTML
    if(document.getElementById("cbt-total-soal")) document.getElementById("cbt-total-soal").textContent = totalSoal;
    if(document.getElementById("cbt-terjawab")) document.getElementById("cbt-terjawab").textContent = terjawab;
    if(document.getElementById("cbt-benar")) document.getElementById("cbt-benar").textContent = benar;
    if(document.getElementById("cbt-salah")) document.getElementById("cbt-salah").textContent = salah;
    if(document.getElementById("cbt-skor-akhir")) document.getElementById("cbt-skor-akhir").textContent = skorAkhir;
  }

  // Inisialisasi awal papan skor (0)
  updateScoreboard();

  // 3. LOGIKA INTERAKSI FUNGSIONAL TOMBOL
  quizItems.forEach((item) => {
    const submitBtn = item.querySelector(".btn-cbt-submit");
    const resetBtn = item.querySelector(".btn-cbt-reset");
    const feedbackStatus = item.querySelector(".cbt-feedback-status");
    const accordionBox = item.querySelector(".accordion");
    const correctAnswer = item.getAttribute("data-answer");

    // AKSI TOMBOL KIRIM JAWABAN
    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        if (item.classList.contains("is-submitted")) return; // Kunci tombol jika sudah terkirim

        const selectedOption = item.querySelector('input[type="radio"]:checked');

        if (!selectedOption) {
          alert("Silakan pilih salah satu jawaban terlebih dahulu!");
          return;
        }

        // Setup status submit komponen kuis
        item.classList.add("is-submitted");
        feedbackStatus.classList.remove("benar", "salah");

        // Kunci input agar tidak bisa diretas/diganti jawabannya setelah klik kirim
        const radios = item.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.disabled = true);

        // Validasi Kunci Jawaban
        if (selectedOption.value === correctAnswer) {
          feedbackStatus.textContent = "✓ JAWABAN BENAR";
          feedbackStatus.classList.add("benar");
          item.classList.add("is-correct"); // Triggers CSS Highlight Hijau
        } else {
          feedbackStatus.textContent = "✗ JAWABAN SALAH";
          feedbackStatus.classList.add("salah");
          item.classList.add("is-wrong"); // Triggers CSS Highlight Merah
        }

        // Tampilkan Box Pembahasan Accordion Bootstrap
        if (accordionBox) {
          accordionBox.classList.remove("d-none");
        }

        // Segarkan Papan Skor
        updateScoreboard();
      });
    }

    // AKSI TOMBOL HAPUS JAWABAN / RESET
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        // Lepas status penguncian class CSS kuis
        item.classList.remove("is-submitted", "is-correct", "is-wrong");

        // Aktifkan kembali radio button dan kosongkan centangnya
        const radios = item.querySelectorAll('input[type="radio"]');
        radios.forEach((radio) => {
          radio.checked = false;
          radio.disabled = false;
        });

        // Kosongkan status teks umpan balik
        if (feedbackStatus) {
          feedbackStatus.textContent = "";
          feedbackStatus.classList.remove("benar", "salah");
        }
        
        // Sembunyikan dan gulung kembali Box Pembahasan
        if (accordionBox) {
          accordionBox.classList.add("d-none");
          const collapseElement = accordionBox.querySelector(".accordion-collapse");
          if (collapseElement && collapseElement.classList.contains("show")) {
            const triggerBtn = accordionBox.querySelector(".cbt-btn-trigger");
            if (triggerBtn) triggerBtn.click();
          }
        }

        // Segarkan Papan Skor kembali
        updateScoreboard();
      });
    }
  });
});
