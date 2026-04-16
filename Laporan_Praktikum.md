# Laporan Praktikum Cybersecurity - Kriptografi

Berikut adalah hasil penyelesaian soal-soal praktikum beserta algoritma yang digunakan dalam proses enkripsi/dekripsi. Semua penyelesaian dapat dicoba atau divalidasi langsung menggunakan aplikasi **CryptoLab** lokal yang disertakan (`index.html`).

---

### **Soal 1**
**Ciphertext:** `edqbdn ehodmdu edqbdn oxsd vhglnlw ehodmdu vhglnlw oxsd wlgdn ehodmdu wlgdn oxsd`
- **Algoritma:** Caesar Cipher
- **Langkah & Kunci:** Teks digeser mundur sebanyak 3 langkah (`Shift: 3` mode Decrypt).
- **Plaintext:**
  > banyak belajar banyak lupa sedikit belajar sedikit lupa tidak belajar tidak lupa

---

### **Soal 2**
**Ciphertext:** `hikplac kplac lievnv hikifpfm kifpfm li cixapf hikrplac rplac gpevnv npnv opca liovgapf`
- **Algoritma:** Substitution Cipher (Monoalphabetic)
- **Kunci Substitusi:** `phqgiumeaylnofdxjkrcvstzwb`
- **Plaintext:**
  > berakit rakit kehulu berenang renang ke tepian bersakit sakit dahulu lalu mati kemudian

---

### **Soal 3 (Algoritma Dirahasiakan Pertama)**
**Ciphertext:** `UIJT JT B TFDSFU NFTTBHF`
- **Algoritma:** Caesar Cipher (Shift 1)
- **Langkah:** Mundur 1 huruf di alfabet.
- **Plaintext:**
  > THIS IS A SECRET MESSAGE

---

### **Soal 4**
**Ciphertext:** `fewepqlgiicrkmlymhttoxuajvrpssuckxlxmmxvsdvroikrtalx`
- **Algoritma:** Vigenère Cipher
- **Langkah Identifikasi Kunci:** Kunci enkripsi diberikan dalam bentuk tersandi *Caesar Cipher*: `whonrpxqlyhuvlwb`. Setelah di-decrypt dengan shift 3, didapatkan kunci sebenarnya: **`telkomuniversity`**
- **Plaintext:**
  > malubertanyasesatdijalanbanyakbertanyadikirawartawan

---

### **Soal 5**
**Plaintext:** `Keamanan Jaringan`
- **Algoritma:** Vigenère Cipher (mode Encrypt)
- **Kunci:** `TelkomUniversity`
- **Ciphertext:**
  > Dilwozua Rvvzfotl

---

### **Soal 6**
**Ciphertext:** `071097109112097110103`
- **Algoritma:** Decimal / ASCII Array
- **Langkah:** Setiap blok 3 digit mewakili kode ASCII satu huruf (`071` -> `G`, `097` -> `a`, dst).
- **Plaintext:**
  > Gampang

---

### **Soal 7 (Algoritma Dirahasiakan Kedua)**
**Ciphertext:** `UGVueWVzYWxhbiBpdHUgZGF0YW5nbnlhIGRpIGFraGlyLCBrYXJlbmEgamlrYSBkYXRhbmcgZGkgYXdhbCBtYWthIGl0dSBuYW1hbnlhIHBlbmRhZnRhcmFu`
- **Algoritma:** Base64 Encoding
- **Plaintext:**
  > Penyesalan itu datangnya di akhir, karena jika datang di awal maka itu namanya pendaftaran

---

### **Soal 8**
**Plaintext:** `Selamat Datang di Lab Cybersecurity`
- **Algoritma:** AES-128
- **Mode:** CBC
- **Key (Hex):** `4d616e676f3132333435363738393031` ("Mango12345678901")
- **IV (Hex):** `30303030303030303030303030303030`
- **Format Output:** Base64
- **Ciphertext:**
  > pCFGl5p2daxnLS5r38+bgMzbHvyj2tI2eEAPcHUMPORm7m9Q+VCpBPO1YYSVhsf2

---

### **Soal 9**
**Ciphertext (Hex):** `0dd9126c4e10cf0ec71dee35a8e484076bcb4ffc7679d45ef6af51eca0511bb4014c8884fd3e3bcc68e08287efebc6990450893dc5204ece5f0915ad7628cfeb3dbcab284dc92cef57ba7b924bc60cf37708b933f9868a97755f96d55776beda`
- **Algoritma:** AES-128 Decrypt
- **Mode:** CBC
- **Key (UTF8):** `TelkomUniversity`
- **IV (UTF8):** `1234567890123456`
- **Plaintext:**
  > Belajarlah dari jaelangkung, hidup mandiri datang tak dijemput pulang tak diantar

---
**Catatan Penting:** 
Seluruh cipher text di Praktikum ini memuat kata-kata unik seperti humor parodi lagu/peribahasa (*"berakit-rakit ke hulu... mati kemudian"*, *"banyak bertanya dikira wartawan"*, *"belajar dari jaelangkung"*). Hal ini membuat proses pengidentifikasian makna kalimat menjadi relatif jelas jika dekripsi sudah dilakukan dengan benar.
