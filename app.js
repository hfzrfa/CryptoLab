document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GUI & TAB SWITCHING
    // ==========================================
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => {
                v.classList.add('hidden');
                v.classList.remove('active');
            });

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
        });
    });


    // ==========================================
    // 2. CLASSIC & MODERN CIFER LOGIC
    // ==========================================
    // (This wraps the original logic we built entirely to keep it working perfectly)
    const initClassicCiphers = () => {
        const algorithmSelect = document.getElementById('algorithm');
        const modeSelect = document.getElementById('mode');
        
        const keyGroup = document.getElementById('key-group');
        const keyLabel = document.getElementById('key-label');
        const keyInput = document.getElementById('key');
        const keyFormat = document.getElementById('keyFormat');

        const advancedGroup = document.getElementById('advanced-group');
        const ivInput = document.getElementById('iv');
        const ivFormat = document.getElementById('ivFormat');
        const aesModeSelect = document.getElementById('aesMode');
        const dataFormatSelect = document.getElementById('dataFormat');

        const inputText = document.getElementById('inputText');
        const outputText = document.getElementById('outputText');
        const executeBtn = document.getElementById('executeBtn');
        const swapBtn = document.getElementById('swapBtn');
        const copyBtn = document.getElementById('copyBtn');
        const errorMessage = document.getElementById('errorMessage');

        const algoConfig = {
            aes: { needsKey: true, advanced: true, keyLabel: "Secret Key", placeholder: "e.g., TelkomUniversity or Hex" },
            des: { needsKey: true, advanced: true, keyLabel: "Secret Key", placeholder: "Password/Key" },
            rc4: { needsKey: true, advanced: false, keyLabel: "Secret Key", placeholder: "Password/Key" },
            caesar: { needsKey: true, advanced: false, keyLabel: "Shift Number", placeholder: "e.g., 3" },
            vigenere: { needsKey: true, advanced: false, keyLabel: "Keyword", placeholder: "e.g., SECRET" },
            substitution: { needsKey: true, advanced: false, keyLabel: "Substitution Alphabet", placeholder: "e.g., phqgiume..."},
            rot13: { needsKey: false, advanced: false },
            base64: { needsKey: false, advanced: false },
            hex: { needsKey: false, advanced: false },
            decimal: { needsKey: false, advanced: false }
        };

        function updateUI() {
            const algo = algorithmSelect.value;
            const config = algoConfig[algo];

            if (config.needsKey) {
                keyGroup.classList.remove('hidden');
                keyLabel.textContent = config.keyLabel;
                keyInput.placeholder = config.placeholder;
            } else {
                keyGroup.classList.add('hidden');
            }

            if (config.advanced) {
                advancedGroup.classList.remove('hidden');
                keyFormat.classList.remove('hidden');
            } else {
                advancedGroup.classList.add('hidden');
                keyFormat.classList.add('hidden');
            }
            errorMessage.classList.add('hidden');
        }

        algorithmSelect.addEventListener('change', updateUI);
        modeSelect.addEventListener('change', () => {
            const mode = modeSelect.value;
            executeBtn.querySelector('span').textContent = mode === 'encrypt' ? 'Encrypt / Encode' : 'Decrypt / Decode';
        });

        function caesarCipher(text, shift, decrypt = false) {
            shift = parseInt(shift);
            if (isNaN(shift)) throw new Error("Caesar Cipher requires a valid shift number.");
            shift = shift % 26;
            if (shift < 0) shift += 26; 
            if (decrypt) shift = (26 - shift) % 26;
            return text.replace(/[a-zA-Z]/g, (char) => {
                const base = char <= 'Z' ? 65 : 97;
                return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
            });
        }

        function vigenereCipher(text, key, decrypt = false) {
            if (!key || !/^[a-zA-Z]+$/.test(key)) throw new Error("Vigenère requires an alphabetic keyword.");
            key = key.toUpperCase();
            let result = '';
            let keyIndex = 0;
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (/[a-zA-Z]/.test(char)) {
                    const base = char <= 'Z' ? 65 : 97;
                    const shift = key.charCodeAt(keyIndex % key.length) - 65;
                    const actualShift = decrypt ? (26 - shift) % 26 : shift;
                    result += String.fromCharCode(((char.charCodeAt(0) - base + actualShift) % 26) + base);
                    keyIndex++;
                } else { result += char; }
            }
            return result;
        }

        function substitutionCipher(text, key, decrypt = false) {
            if (!key || key.length !== 26) throw new Error("Substitution key must be exactly 26 unique alphabetic characters.");
            key = key.toLowerCase();
            const std = 'abcdefghijklmnopqrstuvwxyz';
            const map = new Map();
            for(let i=0; i<26; i++){
                if(decrypt) map.set(key[i], std[i]);
                else map.set(std[i], key[i]);
            }
            let result = '';
            for(let i=0; i<text.length; i++){
                let char = text[i];
                let isUpper = char >= 'A' && char <= 'Z';
                let lowerChar = char.toLowerCase();
                if(map.has(lowerChar)){
                    let mapped = map.get(lowerChar);
                    result += isUpper ? mapped.toUpperCase() : mapped;
                } else { result += char; }
            }
            return result;
        }

        function textToHex(text) { return Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); }
        function hexToText(hex) {
            hex = hex.replace(/\s+/g, '');
            if (hex.length % 2 !== 0) throw new Error("Invalid hex string (odd length).");
            let text = '';
            for (let i = 0; i < hex.length; i += 2) text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return text;
        }

        function textToDecimal(text) { return Array.from(text).map(c => c.charCodeAt(0).toString().padStart(3, '0')).join(''); }
        function decimalToText(dec) {
            dec = dec.replace(/\s+/g, '');
            let text = '';
            for (let i = 0; i < dec.length; i += 3) {
                let num = parseInt(dec.substr(i, 3), 10);
                text += String.fromCharCode(num);
            }
            return text;
        }

        executeBtn.addEventListener('click', () => {
            errorMessage.classList.add('hidden');
            const algo = algorithmSelect.value;
            const mode = modeSelect.value;
            let input = inputText.value;
            const key = keyInput.value;

            if (!input) { errorMessage.textContent = "Please enter some input data."; errorMessage.classList.remove('hidden'); return; }
            if (algoConfig[algo].needsKey && !key) { errorMessage.textContent = "This algorithm requires a secret key."; errorMessage.classList.remove('hidden'); return; }

            try {
                let result = '';
                if (algo === 'aes' || algo === 'des') {
                    const parseKeyIV = (val, format) => {
                        if (!val) return null;
                        return format === 'hex' ? CryptoJS.enc.Hex.parse(val) : CryptoJS.enc.Utf8.parse(val);
                    };
                    const pKey = parseKeyIV(key, keyFormat.value);
                    const pIV = parseKeyIV(ivInput.value, ivFormat.value);
                    const options = { mode: CryptoJS.mode[aesModeSelect.value], padding: CryptoJS.pad.Pkcs7 };
                    if (pIV) options.iv = pIV;
                    const library = algo === 'aes' ? CryptoJS.AES : CryptoJS.DES;

                    if (mode === 'encrypt') {
                        const encrypted = library.encrypt(CryptoJS.enc.Utf8.parse(input), pKey, options);
                        if (dataFormatSelect.value === 'hex') result = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
                        else if (dataFormatSelect.value === 'base64') result = encrypted.toString();
                        else result = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
                    } else {
                        let cipherParams;
                        if (dataFormatSelect.value === 'hex') cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(input.replace(/\s+/g, '')) });
                        else cipherParams = input;
                        const decrypted = library.decrypt(cipherParams, pKey, options);
                        result = decrypted.toString(CryptoJS.enc.Utf8);
                        if (!result) throw new Error("Decryption failed. Invalid Key, IV, Mode, or Ciphertext.");
                    }
                }
                else if (algo === 'rc4') {
                    if (mode === 'encrypt') result = CryptoJS.RC4.encrypt(input, key).toString();
                    else {
                        const dec = CryptoJS.RC4.decrypt(input, key);
                        result = dec.toString(CryptoJS.enc.Utf8);
                        if (!result) throw new Error("RC4 Decryption failed.");
                    }
                }
                else if (algo === 'caesar') result = caesarCipher(input, key, mode === 'decrypt');
                else if (algo === 'vigenere') result = vigenereCipher(input, key, mode === 'decrypt');
                else if (algo === 'substitution') result = substitutionCipher(input, key, mode === 'decrypt');
                else if (algo === 'rot13') result = caesarCipher(input, 13);
                else if (algo === 'base64') {
                    if (mode === 'encrypt') result = btoa(unescape(encodeURIComponent(input)));
                    else result = decodeURIComponent(escape(atob(input)));
                }
                else if (algo === 'hex') {
                    if (mode === 'encrypt') result = textToHex(input);
                    else result = hexToText(input);
                }
                else if (algo === 'decimal') {
                    if (mode === 'encrypt') result = textToDecimal(input);
                    else result = decimalToText(input);
                }
                outputText.value = result;
            } catch (error) {
                console.error(error);
                errorMessage.textContent = error.message || "Execution error.";
                errorMessage.classList.remove('hidden');
                outputText.value = ''; 
            }
        });

        swapBtn.addEventListener('click', () => {
            const temp = inputText.value;
            inputText.value = outputText.value;
            outputText.value = temp;
            modeSelect.value = modeSelect.value === 'encrypt' ? 'decrypt' : 'encrypt';
            modeSelect.dispatchEvent(new Event('change'));
        });

        copyBtn.addEventListener('click', () => {
            if (!outputText.value) return;
            navigator.clipboard.writeText(outputText.value).then(() => {
                const orig = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = orig; }, 2000);
            });
        });

        updateUI();
    };

    initClassicCiphers();

    // ==========================================
    // 3. OPENPGP ASYMMETRIC CIFER LOGIC
    // ==========================================
    const initPGP = () => {
        const STORAGE_KEY = 'cryptoLab_keyring';

        // Modals & Buttons
        const pgpDashboard = document.querySelector('.pgp-dashboard');
        const btnShowGenerate = document.getElementById('btnShowGenerate');
        const btnShowImport = document.getElementById('btnShowImport');
        
        const generateModal = document.getElementById('generate-modal');
        const doGeneratePgp = document.getElementById('doGeneratePgp');
        const cancelGeneratePgp = document.getElementById('cancelGeneratePgp');
        
        const importModal = document.getElementById('import-modal');
        const doImportPgp = document.getElementById('doImportPgp');
        const cancelImportPgp = document.getElementById('cancelImportPgp');

        const exportModal = document.getElementById('export-modal');
        const cancelExportPgp = document.getElementById('cancelExportPgp');

        // Lists
        const myKeysList = document.getElementById('my-keys-list');
        const publicKeysList = document.getElementById('public-keys-list');

        // Ops
        const pgpOperation = document.getElementById('pgpOperation');
        const pgpRecipientGroup = document.getElementById('pgpRecipientGroup');
        const pgpSignerGroup = document.getElementById('pgpSignerGroup');
        const pgpPassphraseGroup = document.getElementById('pgpPassphraseGroup');
        const pgpRecipient = document.getElementById('pgpRecipient');
        const pgpMyKey = document.getElementById('pgpMyKey');
        
        const pgpInputText = document.getElementById('pgpInputText');
        const pgpOutputText = document.getElementById('pgpOutputText');
        const pgpExecuteBtn = document.getElementById('pgpExecuteBtn');
        const pgpPassphraseOps = document.getElementById('pgpPassphraseOps');
        const pgpErrorMessage = document.getElementById('pgpErrorMessage');
        const pgpSuccessMessage = document.getElementById('pgpSuccessMessage');

        // State Load
        const loadKeyring = () => {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
            return { privateKeys: [], publicKeys: [] };
        };
        const saveKeyring = (data) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        };

        const renderKeyring = () => {
            const keyring = loadKeyring();
            myKeysList.innerHTML = '';
            publicKeysList.innerHTML = '';
            pgpRecipient.innerHTML = '<option value="">- Select Friend\'s Key -</option>';
            pgpMyKey.innerHTML = '<option value="">- Select Your Key -</option>';

            if (keyring.privateKeys.length === 0) {
                myKeysList.innerHTML = '<p class="empty-text">No personal keys generated yet.</p>';
            } else {
                keyring.privateKeys.forEach((k, idx) => {
                    const div = document.createElement('div'); div.className = 'key-item';
                    div.innerHTML = `
                        <div class="key-info"><h4>${k.name}</h4><p>${k.email} &bull; RSA 2048</p></div>
                        <div class="key-actions">
                            <button class="action-icon" onclick="window.exportPgpKey('private', ${idx})" title="Export Public Key">📋</button>
                            <button class="action-icon danger" onclick="window.deletePgpKey('private', ${idx})" title="Delete Key">🗑️</button>
                        </div>
                    `;
                    myKeysList.appendChild(div);

                    const opt = document.createElement('option');
                    opt.value = idx; opt.textContent = `${k.name} <${k.email}>`;
                    pgpMyKey.appendChild(opt);
                });
            }

            if (keyring.publicKeys.length === 0) {
                publicKeysList.innerHTML = '<p class="empty-text">No friend\'s keys imported yet.</p>';
            } else {
                keyring.publicKeys.forEach((k, idx) => {
                    const div = document.createElement('div'); div.className = 'key-item';
                    div.innerHTML = `
                        <div class="key-info"><h4>${k.name}</h4><p>${k.email}</p></div>
                        <div class="key-actions">
                            <button class="action-icon danger" onclick="window.deletePgpKey('public', ${idx})" title="Delete Key">🗑️</button>
                        </div>
                    `;
                    publicKeysList.appendChild(div);

                    const opt = document.createElement('option');
                    opt.value = idx; opt.textContent = `${k.name} <${k.email}>`;
                    pgpRecipient.appendChild(opt);
                });
            }
        };

        // UI toggles
        window.deletePgpKey = (type, index) => {
            if(!confirm("Are you sure you want to delete this key?")) return;
            const keyring = loadKeyring();
            if (type === 'private') keyring.privateKeys.splice(index, 1);
            else keyring.publicKeys.splice(index, 1);
            saveKeyring(keyring); renderKeyring();
        };

        window.exportPgpKey = (type, index) => {
            const keyring = loadKeyring();
            const k = type === 'private' ? keyring.privateKeys[index] : keyring.publicKeys[index];
            document.getElementById('pgpExportBlock').value = k.armoredPublicKey || k.armoredKey;
            exportModal.classList.remove('hidden');
        };

        btnShowGenerate.addEventListener('click', () => generateModal.classList.remove('hidden'));
        cancelGeneratePgp.addEventListener('click', () => generateModal.classList.add('hidden'));
        btnShowImport.addEventListener('click', () => importModal.classList.remove('hidden'));
        cancelImportPgp.addEventListener('click', () => importModal.classList.add('hidden'));
        cancelExportPgp.addEventListener('click', () => exportModal.classList.add('hidden'));

        // Action: Generate Key
        doGeneratePgp.addEventListener('click', async () => {
            const name = document.getElementById('pgpGenName').value;
            const email = document.getElementById('pgpGenEmail').value;
            const pass = document.getElementById('pgpGenPass').value;
            const status = document.getElementById('genStatus');

            if(!name || !email || !pass) { status.className = 'mt-2 status-msg error'; status.textContent = "Please fill all fields."; return; }
            
            doGeneratePgp.textContent = "Generating RSA 2048 (Wait)...";
            doGeneratePgp.disabled = true;

            try {
                const { privateKey, publicKey } = await openpgp.generateKey({
                    type: 'rsa', rsaBits: 2048,
                    userIDs: [{ name: name, email: email }],
                    passphrase: pass, format: 'armored'
                });

                const keyring = loadKeyring();
                keyring.privateKeys.push({ name, email, armoredKey: privateKey, armoredPublicKey: publicKey });
                saveKeyring(keyring);
                renderKeyring();

                document.getElementById('pgpGenName').value = '';
                document.getElementById('pgpGenEmail').value = '';
                document.getElementById('pgpGenPass').value = '';
                generateModal.classList.add('hidden');
            } catch (err) {
                status.className = 'mt-2 status-msg error'; status.textContent = err.message;
            } finally {
                doGeneratePgp.textContent = "Generate Key"; doGeneratePgp.disabled = false;
            }
        });

        // Action: Import Focus
        doImportPgp.addEventListener('click', async () => {
            const armoredKey = document.getElementById('pgpImportBlock').value;
            const status = document.getElementById('importStatus');
            if(!armoredKey) { status.className = 'mt-2 status-msg error'; status.textContent = "Paste a key block first."; return; }

            try {
                const key = await openpgp.readKey({ armoredKey });
                const userIDs = await key.getUserIDs();
                const principal = userIDs.length > 0 ? userIDs[0] : "Unknown <unknown@unknown>";
                
                // Extremely simple parsing (Name <email>)
                let name = principal; let email = "";
                if(principal.includes('<')) {
                    const pts = principal.split('<');
                    name = pts[0].trim(); email = pts[1].replace('>','').trim();
                }

                const keyring = loadKeyring();
                keyring.publicKeys.push({ name, email, armoredKey: key.armor() });
                saveKeyring(keyring);
                renderKeyring();

                document.getElementById('pgpImportBlock').value = '';
                importModal.classList.add('hidden');
            } catch (err) {
                status.className = 'mt-2 status-msg error'; status.textContent = "Invalid PGP Public Key block.";
            }
        });

        // Operations UI Updater
        const updateOpsUI = () => {
            const op = pgpOperation.value;
            pgpRecipientGroup.classList.remove('hidden');
            pgpSignerGroup.classList.remove('hidden');
            pgpPassphraseGroup.classList.remove('hidden');

            if(op === 'encrypt') { pgpSignerGroup.classList.add('hidden'); pgpPassphraseGroup.classList.add('hidden'); }
            if(op === 'decrypt') { pgpRecipientGroup.classList.add('hidden'); }
            if(op === 'sign') { pgpRecipientGroup.classList.add('hidden'); }
            if(op === 'verify') { pgpSignerGroup.classList.add('hidden'); pgpPassphraseGroup.classList.add('hidden'); }
            
            pgpErrorMessage.classList.add('hidden');
            pgpSuccessMessage.classList.add('hidden');
        };
        pgpOperation.addEventListener('change', updateOpsUI);

        // Helper to notify
        const pgpError = (msg) => { pgpErrorMessage.textContent = msg; pgpErrorMessage.classList.remove('hidden'); };
        const pgpSuccess = (msg) => { pgpSuccessMessage.textContent = msg; pgpSuccessMessage.classList.remove('hidden'); };

        // Execute Operations
        pgpExecuteBtn.addEventListener('click', async () => {
            pgpErrorMessage.classList.add('hidden'); pgpSuccessMessage.classList.add('hidden');
            pgpOutputText.value = '';

            const op = pgpOperation.value;
            const inputTxt = pgpInputText.value;
            if(!inputTxt) return pgpError("Please provide input text or PGP block.");

            const keyring = loadKeyring();
            const recIndex = pgpRecipient.value;
            const myIndex = pgpMyKey.value;
            const pass = pgpPassphraseOps.value;

            try {
                let recipientKeyObj = null;
                if(recIndex !== "") recipientKeyObj = await openpgp.readKey({ armoredKey: keyring.publicKeys[recIndex].armoredKey });

                let myPrivKeyObj = null;
                if(myIndex !== "") {
                    const pkData = await openpgp.readPrivateKey({ armoredKey: keyring.privateKeys[myIndex].armoredKey });
                    myPrivKeyObj = await openpgp.decryptKey({ privateKey: pkData, passphrase: pass });
                }

                if(op === 'encrypt') {
                    if(!recipientKeyObj) return pgpError("Select a recipient key!");
                    const message = await openpgp.createMessage({ text: inputTxt });
                    const encrypted = await openpgp.encrypt({ message, encryptionKeys: recipientKeyObj });
                    pgpOutputText.value = encrypted;
                }
                else if(op === 'decrypt') {
                    if(!myPrivKeyObj) return pgpError("Select your private key and enter passphrase.");
                    const message = await openpgp.readMessage({ armoredMessage: inputTxt });
                    const { data: decrypted } = await openpgp.decrypt({ message, decryptionKeys: myPrivKeyObj });
                    pgpOutputText.value = decrypted;
                    pgpSuccess("🔓 Message Decrypted Successfully.");
                }
                else if(op === 'sign') {
                    if(!myPrivKeyObj) return pgpError("Select your private key and enter passphrase.");
                    const message = await openpgp.createCleartextMessage({ text: inputTxt });
                    const cleartextMessage = await openpgp.sign({ message, signingKeys: myPrivKeyObj });
                    pgpOutputText.value = cleartextMessage;
                }
                else if(op === 'verify') {
                    if(!recipientKeyObj) return pgpError("Select the sender's public key to verify signature.");
                    const message = await openpgp.readCleartextMessage({ cleartextMessage: inputTxt });
                    const verificationResult = await openpgp.verify({ message, verificationKeys: recipientKeyObj });
                    
                    const { verified, keyID } = verificationResult.signatures[0];
                    try {
                        await verified; 
                        pgpSuccess("✅ Signature Verified! Pesan ini sah.");
                        pgpOutputText.value = message.getText();
                    } catch (e) {
                         pgpError("❌ Validasi Gagal! Tanda tangan tidak sah atau kunci salah.");
                    }
                }
                else if(op === 'encrypt_sign') {
                    if(!recipientKeyObj || !myPrivKeyObj) return pgpError("Select both recipient & your private key + pass.");
                    const message = await openpgp.createMessage({ text: inputTxt });
                    const encrypted = await openpgp.encrypt({ message, encryptionKeys: recipientKeyObj, signingKeys: myPrivKeyObj });
                    pgpOutputText.value = encrypted;
                }
                else if(op === 'decrypt_verify') {
                    if(!recipientKeyObj || !myPrivKeyObj) return pgpError("Select both sender's public key (to verify) & your private key (to decrypt).");
                    const message = await openpgp.readMessage({ armoredMessage: inputTxt });
                    const { data: decrypted, signatures } = await openpgp.decrypt({ message, decryptionKeys: myPrivKeyObj, verificationKeys: recipientKeyObj });
                    
                    pgpOutputText.value = decrypted;
                    try {
                        await signatures[0].verified;
                        pgpSuccess("🔓 🟢 Success! Decrypted & Signature Verified (Asli dan belum dimodifikasi).");
                    } catch(e) {
                        pgpError("🔓 ❌ Decrypted tapi Signature TIDAK VALID / BONGKARAN.");
                    }
                }

            } catch(e) {
                console.error(e);
                pgpError(e.message || "Operation failed. Check keys and passphrases.");
            }
        });

        document.getElementById('pgpCopyBtn').addEventListener('click', () => {
            if (!pgpOutputText.value) return;
            navigator.clipboard.writeText(pgpOutputText.value);
        });

        // Initialize Call
        renderKeyring();
        updateOpsUI();
    };

    initPGP();
});
