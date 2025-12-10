// SCRIPT BY WARUNGERIK
// ORDER ATAU TANYA TANYA BISA KE 
// WHATSAPP : 085183129647
// TELEGRAM : @WARUNGERIK
const config = require('./config.js');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers, delay, downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const readline = require('readline');
const AdmZip = require('adm-zip');
const os = require('os');
const { confuser } = require('js-confuser');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const mime = require('mime-types');
const fetch = require('node-fetch');
const scraper = require('ruhend-scraper');
const axios = require('axios');
const FormData = require('form-data');
const moment = require('moment-timezone');
const osu = require('node-os-utils');
const ssh2 = require('ssh2');
const crypto = require('crypto');
const chalk = require('chalk');
const func = {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    toRupiah: (angka) => {
        let rev = parseInt(angka, 10).toString().split('').reverse().join('');
        let rev2 = '';
        for (let i = 0; i < rev.length; i++) {
            rev2 += rev[i];
            if ((i + 1) % 3 === 0 && i !== rev.length - 1) {
                rev2 += '.';
            }
        }
        return rev2.split('').reverse().join('');
    },
    generateRandomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    tanggal: (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    },
    capital: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};
const schedule = require('node-schedule');

function scheduleDailyRestart() {
    const restartJob = schedule.scheduleJob({ hour: 11, minute: 28, second: 0, tz: 'Asia/Jakarta' }, async () => {
        try {
            if (sockInstance && config.adminNumber) {
                const adminJid = `${config.adminNumber}@s.whatsapp.net`;
                await sendText(sockInstance, adminJid, "🤖 *Auto-Restart* 🤖\n\nBot akan direstart secara otomatis sesuai jadwal.");
            }

            if (restartBot) {
                setTimeout(() => restartBot(adminJid), 2000);
            } else {
                console.error('[AUTO-RESTART] Fungsi restartBot tidak ditemukan. Restart dibatalkan.');
            }
        } catch (error) {
            console.error('[AUTO-RESTART] Gagal mengirim notifikasi atau memulai restart:', error);
             if (restartBot) {
                setTimeout(() => restartBot(), 2000);
            }
        }
    });
}
global.ApikeyRestApi = 'free'; 
global.QrisOrderKuota = 'YOUR_QRIS_CODE'; // Kode QRIS Anda dari Orderkuota
global.IdMerchant = 'YOUR_MERCHANT_ID'; // ID Merchant Anda dari Orderkuota
global.ApikeyOrderKuota = 'YOUR_ORDERKUOTA_API_KEY'; // API Key Orderkuota Anda
global.nestid = 5; 
global.domain = config.domain;
global.apikey = config.apikey;
global.capikey = config.capikey;
global.eggsnya = config.eggsnya;
global.location = config.location;
global.namasaluran = config.namasaluran;
global.idsaluran = config.idsaluran;
global.linksaluran = config.linksaluran;

const ADMIN_NUMBER = config.adminNumber;
const STARTUP_NOTIFICATION_NUMBER = config.startupNotificationNumber;
const PREFIX = config.prefix;
const BOT_NAME = config.botName;
const BOT_VERSION = config.botVersion;
const OWNER_NAME = config.ownerName;
const OWNER_ORGANIZATION = config.ownerOrganization;
const OWNER_TITLE = config.ownerTitle;
const OWNER_EMAIL = config.ownerEmail;
const OWNER_WEBSITE = config.ownerWebsite;
const IMAGE_URL = config.imageUrl;
const STICKER_PACK_NAME = config.stickerPackName;
const STICKER_AUTHOR_NAME = config.stickerAuthorName;
const API_KEY = config.apiKey; 
const GITHUB_TOKEN = config.githubToken;
const GITHUB_REPO_URL = config.githubRepoUrl;

function spintax(text) {
    const pattern = /\{([^{}]+)\}/g;
    while (pattern.test(text)) {
        text = text.replace(pattern, (match, p1) => {
            const choices = p1.split('|');
            return choices[Math.floor(Math.random() * choices.length)];
        });
    }
    return text;
}

function getGreeting() {
    const hour = new Date().getHours();
    const timeZone = 'Asia/Jakarta';
    const localHour = new Date(new Date().toLocaleString("en-US", { timeZone })).getHours();

    if (localHour >= 5 && localHour < 11) {
        return "Pagi";
    } else if (localHour >= 11 && localHour < 15) {
        return "Siang";
    } else if (localHour >= 15 && localHour < 18) {
        return "Sore";
    } else {
        return "Malam";
    }
}
const PUSH_CONTACT_BATCH_SIZE = 25;
let minDelay = 15000;
let maxDelay = 20000;
let broadcastIntervalHours = 1;

const contactsDbPath = path.join(__dirname, 'json/numbers.json');
const savedContactsPath = path.join(__dirname, 'json/saved_contacts.json')
const backupDir = path.join(__dirname, 'backups')
const backupZipPath = path.join(backupDir, 'backup_bot.zip')
const MESSAGE_FILE = path.join(__dirname, 'json/message.json');
const ANTILINK_FILE = path.join(__dirname, 'json/antilink.json');
const SETTINGS_FILE = path.join(__dirname, 'json/settings.json');
const JPM_IMAGE_PATH = path.join(__dirname, 'img/jpm_image.jpg');
const PAYMENT_MESSAGE_FILE = path.join(__dirname, 'json/payment_message.json');
const PAYMENT_IMAGE_PATH = path.join(__dirname, 'img/qris.jpg');
const ANTILINK_GROUPS_FILE = path.join(__dirname, 'json/antilink_groups.json');
const WELCOME_GROUPS_FILE = path.join(__dirname, 'json/welcome_groups.json');
const LEFT_GROUPS_FILE = path.join(__dirname, 'json/left_groups.json');
const WELCOME_MESSAGES_FILE = path.join(__dirname, 'json/welcome_messages.json');
const LEFT_MESSAGES_FILE = path.join(__dirname, 'json/left_messages.json');
const CUSTOM_RESPONSES_FILE = path.join(__dirname, 'json/custom_responses.json');
const CUSTOM_RESPONSES_IMG_DIR = path.join(__dirname, 'img/responses');
const PREMIUM_USERS_FILE = path.join(__dirname, 'json/premium.json'); 
const PRODUCTS_FILE = path.join(__dirname, 'json/products.json');
const JPM_BLACKLIST_FILE = path.join(__dirname, 'json/bljpm.json');
const ANTITAGSW_GROUPS_FILE = path.join(__dirname, 'json/antitagsw_groups.json'); 
const CHAT_COUNTS_FILE = path.join(__dirname, 'json/chat_counts.json');
const BOT_SETTINGS_FILE = path.join(__dirname, 'json/bot_settings.json');
const VSBOT_DATA_FILE = path.join(__dirname, 'json/vsbot_data.json');
const KATA_TERLARANG_FILE = path.join(__dirname, 'json/antikata.json');
const ANTIKATA_GROUPS_FILE = path.join(__dirname, 'json/antikata_groups.json');
const ANTILONGTEXT_GROUPS_FILE = path.join(__dirname, 'json/antilongtext_groups.json');
const ANTIPOLL_GROUPS_FILE = path.join(__dirname, 'json/antipoll_groups.json');
let antipollEnabledGroups = [];
const LONG_TEXT_LIMIT = 80; 
let antilongtextEnabledGroups = [];

let adminJid = `${ADMIN_NUMBER}@s.whatsapp.net`;
let isRestarting = false;
let isJpmRunning = false;
let broadcastMessage = "Halo semua! Ini adalah broadcast dari bot!";
let paymentMessage = "Ini adalah info pembayaran default. Silakan atur menggunakan .setpayment";
let antilinkList = [];
let antilinkEnabledGroups = [];
let restartBot = null;
let sockInstance = null;
let isAutoBroadcastEnabled = false;
let broadcastIntervalId = null;
let jpmGroupDelaySeconds = 15; 
let welcomeEnabledGroups = [];
let leftEnabledGroups = [];
let groupWelcomeMessages = {};
let groupLeftMessages = {};
let customResponses = {};
let premiumUsers = []; 
let botSettings = {};
let products = [];
let jpmBlacklist = [];
let antitagswEnabledGroups = [];
let chatCounts = {};
let vsbotData = {};
let kataTerlarangList = [];
let antikataEnabledGroups = []; 
let transactions = {};
let botMode = 'self'; // 'public' atau 'self'
const viewOnceCache = new Map();
const VIEW_ONCE_CACHE_MAX_SIZE = 80;
let antitagswWarningMessage = '🚨 Peringatan untuk @sender!\nDilarang keras menggunakan tag status.';


const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}
if (!fs.existsSync(path.join(__dirname, 'json'))) {
    fs.mkdirSync(path.join(__dirname, 'json'), { recursive: true });
}
if (!fs.existsSync(CUSTOM_RESPONSES_IMG_DIR)) {
    fs.mkdirSync(CUSTOM_RESPONSES_IMG_DIR, { recursive: true });
    console.log(`[i] Direktori untuk gambar respon dibuat di: ${CUSTOM_RESPONSES_IMG_DIR}`);
}

function loadPremiumUsers() {
    try {
        if (fs.existsSync(PREMIUM_USERS_FILE)) {
            const data = fs.readFileSync(PREMIUM_USERS_FILE, 'utf-8');
            premiumUsers = JSON.parse(data);
            console.log(`[i] Memuat ${premiumUsers.length} pengguna premium.`);
        } else {
            fs.writeFileSync(PREMIUM_USERS_FILE, JSON.stringify([], null, 2));
            console.log('[i] File premium.json dibuat.');
        }
    } catch (e) {
        console.error('[!] Gagal memuat premium.json:', e);
        premiumUsers = [];
    }
}
function loadBotSettings() {
    try {
        const defaultSettings = {
            autoread: false,
            autoreadsw: false,
            anticall: true,
            autotyping: false,
            autorecording: false,
        };

        if (fs.existsSync(BOT_SETTINGS_FILE)) {
            const data = fs.readFileSync(BOT_SETTINGS_FILE, 'utf-8');
            const savedSettings = data ? JSON.parse(data) : {};
            botSettings = { ...defaultSettings, ...savedSettings };
            console.log('[i] Pengaturan bot (bot_settings.json) berhasil dimuat.');
        } else {
            botSettings = defaultSettings;
            saveBotSettings();
            console.log('[i] File bot_settings.json dibuat dengan pengaturan default.');
        }
    } catch (e) {
        console.error('[!] Gagal memuat bot_settings.json, menggunakan pengaturan default:', e);
        botSettings = {
            autoread: false,
            autoreadsw: false,
            anticall: true,
            autotyping: false,
            autorecording: false,
        };
    }
}
function saveBotSettings() {
    fs.writeFileSync(BOT_SETTINGS_FILE, JSON.stringify(botSettings, null, 2));
}
function saveAntipollGroups() {
    fs.writeFileSync(ANTIPOLL_GROUPS_FILE, JSON.stringify(antipollEnabledGroups, null, 2));
}
function loadVsbotData() {
    try {
        if (fs.existsSync(VSBOT_DATA_FILE)) {
            const data = fs.readFileSync(VSBOT_DATA_FILE, 'utf-8');
            vsbotData = JSON.parse(data);
            console.log(`[i] Memuat data VS Bot untuk ${Object.keys(vsbotData).length} user.`);
        } else {
            fs.writeFileSync(VSBOT_DATA_FILE, JSON.stringify({}, null, 2));
            console.log('[i] File vsbot_data.json dibuat.');
        }
    } catch (e) {
        console.error('[!] Gagal memuat vsbot_data.json:', e);
        vsbotData = {};
    }
}

function saveVsbotData() {
    fs.writeFileSync(VSBOT_DATA_FILE, JSON.stringify(vsbotData, null, 2));
}
function loadJpmBlacklist() {
    try {
        if (fs.existsSync(JPM_BLACKLIST_FILE)) {
            const data = fs.readFileSync(JPM_BLACKLIST_FILE, 'utf-8');
            jpmBlacklist = JSON.parse(data);
            console.log(`[i] Memuat ${jpmBlacklist.length} grup dalam blacklist JPM.`);
        } else {
            fs.writeFileSync(JPM_BLACKLIST_FILE, JSON.stringify([], null, 2));
            console.log('[i] File bljpm.json dibuat.');
        }
    } catch (e) {
        console.error('[!] Gagal memuat bljpm.json:', e);
        jpmBlacklist = [];
    }
}
function loadChatCounts() {
    try {
        if (fs.existsSync(CHAT_COUNTS_FILE)) {
            const data = fs.readFileSync(CHAT_COUNTS_FILE, 'utf-8');
            chatCounts = JSON.parse(data);
            console.log(`[i] Memuat data chat untuk ${Object.keys(chatCounts).length} grup.`);
        } else {
            fs.writeFileSync(CHAT_COUNTS_FILE, JSON.stringify({}, null, 2));
            console.log('[i] File chat_counts.json dibuat.');
        }
    } catch (e) {
        console.error('[!] Gagal memuat chat_counts.json:', e);
        chatCounts = {}; 
    }
}
function saveAntilongtextGroups() {
    fs.writeFileSync(ANTILONGTEXT_GROUPS_FILE, JSON.stringify(antilongtextEnabledGroups, null, 2));
}
function saveAntikataGroups() {
    fs.writeFileSync(ANTIKATA_GROUPS_FILE, JSON.stringify(antikataEnabledGroups, null, 2));
}
function saveKataTerlarang() {
    fs.writeFileSync(KATA_TERLARANG_FILE, JSON.stringify(kataTerlarangList, null, 2));
}
function saveChatCounts() {
    fs.writeFileSync(CHAT_COUNTS_FILE, JSON.stringify(chatCounts, null, 2));
}

function saveJpmBlacklist() {
    fs.writeFileSync(JPM_BLACKLIST_FILE, JSON.stringify(jpmBlacklist, null, 2));
}
function saveAntitagswGroups() {
    fs.writeFileSync(ANTITAGSW_GROUPS_FILE, JSON.stringify(antitagswEnabledGroups, null, 2));
}
function savePremiumUsers() {
    fs.writeFileSync(PREMIUM_USERS_FILE, JSON.stringify(premiumUsers, null, 2));
}
function loadProducts() {
    try {
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
            products = JSON.parse(data);
           
            let needsSave = false;
            products.forEach(p => {
                if (p.stock !== undefined && !p.items) {
                    console.log(`[i] Migrasi produk '${p.name}' ke format stok baru.`);
                    p.items = Array(p.stock).fill("STOK_FORMAT_LAMA_HARAP_UPDATE"); 
                    delete p.stock;
                    needsSave = true;
                } else if (!p.items) {
                    p.items = [];
                    needsSave = true;
                }
            });

            if(needsSave) {
                console.log('[i] Menyimpan struktur produk yang telah dimigrasi.');
                saveProducts();
            }

            console.log(`[i] Memuat ${products.length} produk dari database.`);
        } else {
            fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
            console.log('[i] File products.json dibuat.');
        }
    } catch (e) {
        console.error('[!] Gagal memuat atau migrasi products.json:', e);
        products = [];
    }
} 
function saveProducts() {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function loadCustomResponses() {
    try {
        if (fs.existsSync(CUSTOM_RESPONSES_FILE)) {
            const data = fs.readFileSync(CUSTOM_RESPONSES_FILE, 'utf-8');
            customResponses = JSON.parse(data);
            console.log(`[i] Memuat ${Object.keys(customResponses).length} respon kustom.`);
        } else {
            fs.writeFileSync(CUSTOM_RESPONSES_FILE, JSON.stringify({}, null, 2));
            console.log('[i] File custom_responses.json dibuat.');
        }
    } catch (e) {
        console.error('[!] Gagal memuat custom_responses.json:', e);
        customResponses = {};
    }
}

function saveCustomResponses() {
    fs.writeFileSync(CUSTOM_RESPONSES_FILE, JSON.stringify(customResponses, null, 2));
}

loadPremiumUsers();
loadCustomResponses();
loadJpmBlacklist();
loadChatCounts(); 
loadBotSettings(); 
loadVsbotData();

if (fs.existsSync(MESSAGE_FILE)) {
    try {
        const saved = JSON.parse(fs.readFileSync(MESSAGE_FILE, 'utf-8'));
        if (saved.message) {
            broadcastMessage = saved.message;
            console.log(`[i] Memuat pesan broadcast tersimpan: ${broadcastMessage}`);
        }
    } catch (e) { console.error('[!] Gagal memuat message.json:', e); }
}

if (fs.existsSync(PAYMENT_MESSAGE_FILE)) {
    try {
        const saved = JSON.parse(fs.readFileSync(PAYMENT_MESSAGE_FILE, 'utf-8'));
        if (saved.message) {
            paymentMessage = saved.message;
            console.log(`[i] Memuat pesan payment tersimpan.`);
        }
    } catch (e) { console.error('[!] Gagal memuat payment_message.json:', e); }
}

if (fs.existsSync(ANTILINK_FILE)) {
    try {
        antilinkList = JSON.parse(fs.readFileSync(ANTILINK_FILE, 'utf-8'));
        console.log(`[i] Memuat list antilink: ${antilinkList.join(', ')}`);
    } catch (e) { console.error('[!] Gagal memuat antilink.json:', e); }
} else {
    fs.writeFileSync(ANTILINK_FILE, JSON.stringify(["chat.whatsapp.com"], null, 2));
    antilinkList = ["chat.whatsapp.com"];
    console.log('[i] File antilink.json dibuat dengan daftar default.');
}

try {
    if (fs.existsSync(ANTILINK_GROUPS_FILE)) {
        antilinkEnabledGroups = JSON.parse(fs.readFileSync(ANTILINK_GROUPS_FILE, 'utf-8'));
        console.log(`[i] Memuat ${antilinkEnabledGroups.length} grup dengan antilink aktif.`);
    } else {
        fs.writeFileSync(ANTILINK_GROUPS_FILE, JSON.stringify([], null, 2));
        console.log('[i] File antilink_groups.json dibuat.');
    }
    if (fs.existsSync(ANTITAGSW_GROUPS_FILE)) {
        antitagswEnabledGroups = JSON.parse(fs.readFileSync(ANTITAGSW_GROUPS_FILE, 'utf-8'));
        console.log(`[i] Memuat ${antitagswEnabledGroups.length} grup dengan Anti-Tag-SW aktif.`);
    } else {
        fs.writeFileSync(ANTITAGSW_GROUPS_FILE, JSON.stringify([], null, 2));
    }
    if (fs.existsSync(WELCOME_GROUPS_FILE)) {
        welcomeEnabledGroups = JSON.parse(fs.readFileSync(WELCOME_GROUPS_FILE, 'utf-8'));
        console.log(`[i] Memuat ${welcomeEnabledGroups.length} grup dengan pesan welcome aktif.`);
    } else {
        fs.writeFileSync(WELCOME_GROUPS_FILE, JSON.stringify([], null, 2));
    }
    if (fs.existsSync(LEFT_GROUPS_FILE)) {
        leftEnabledGroups = JSON.parse(fs.readFileSync(LEFT_GROUPS_FILE, 'utf-8'));
        console.log(`[i] Memuat ${leftEnabledGroups.length} grup dengan pesan left aktif.`);
    } else {
        fs.writeFileSync(LEFT_GROUPS_FILE, JSON.stringify([], null, 2));
    }
    if (fs.existsSync(WELCOME_MESSAGES_FILE)) {
        groupWelcomeMessages = JSON.parse(fs.readFileSync(WELCOME_MESSAGES_FILE, 'utf-8'));
        console.log(`[i] Memuat ${Object.keys(groupWelcomeMessages).length} pesan welcome kustom.`);
    } else {
        fs.writeFileSync(WELCOME_MESSAGES_FILE, JSON.stringify({}, null, 2));
    }
if (fs.existsSync(ANTILONGTEXT_GROUPS_FILE)) {
        antilongtextEnabledGroups = JSON.parse(fs.readFileSync(ANTILONGTEXT_GROUPS_FILE, 'utf-8'));
        console.log(`[i] Memuat ${antilongtextEnabledGroups.length} grup dengan anti-long-text aktif.`);
    } else {
        fs.writeFileSync(ANTILONGTEXT_GROUPS_FILE, JSON.stringify([], null, 2));
        console.log('[i] File antilongtext_groups.json dibuat.');
    }
    if (fs.existsSync(LEFT_MESSAGES_FILE)) {
        groupLeftMessages = JSON.parse(fs.readFileSync(LEFT_MESSAGES_FILE, 'utf-8'));
        console.log(`[i] Memuat ${Object.keys(groupLeftMessages).length} pesan left kustom.`);
    } else {
        fs.writeFileSync(LEFT_MESSAGES_FILE, JSON.stringify({}, null, 2));
    }
} catch (e) {
    console.error('[!] Gagal memuat file konfigurasi grup:', e);
}
if (fs.existsSync(ANTIKATA_GROUPS_FILE)) {
    antikataEnabledGroups = JSON.parse(fs.readFileSync(ANTIKATA_GROUPS_FILE, 'utf-8'));
    console.log(`[i] Memuat ${antikataEnabledGroups.length} grup dengan antikata aktif.`);
} else {
    fs.writeFileSync(ANTIKATA_GROUPS_FILE, JSON.stringify([], null, 2));
    console.log('[i] File antikata_groups.json dibuat.');
}
if (fs.existsSync(ANTIPOLL_GROUPS_FILE)) {
    antipollEnabledGroups = JSON.parse(fs.readFileSync(ANTIPOLL_GROUPS_FILE, 'utf-8'));
    console.log(`[i] Memuat ${antipollEnabledGroups.length} grup dengan anti-polling aktif.`);
} else {
    fs.writeFileSync(ANTIPOLL_GROUPS_FILE, JSON.stringify([], null, 2));
    console.log('[i] File antipoll_groups.json dibuat.');
}
if (fs.existsSync(KATA_TERLARANG_FILE)) {
    try {
        kataTerlarangList = JSON.parse(fs.readFileSync(KATA_TERLARANG_FILE, 'utf-8'));
        console.log(`[i] Memuat list kata terlarang: ${kataTerlarangList.join(', ')}`);
    } catch (e) { console.error('[!] Gagal memuat antikata.json:', e); }
} else {
    fs.writeFileSync(KATA_TERLARANG_FILE, JSON.stringify([], null, 2));
    kataTerlarangList = [];
    console.log('[i] File antikata.json dibuat.');
}
if (fs.existsSync(SETTINGS_FILE)) {
    try {
        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
        isAutoBroadcastEnabled = settings.autoBroadcast ?? true;
        broadcastIntervalHours = settings.broadcastInterval ?? 1;
        jpmGroupDelaySeconds = settings.jpmGroupDelay ?? 15;
        antitagswWarningMessage = settings.antitagswWarningMessage ?? '🚨 Peringatan untuk @sender!\nDilarang keras menggunakan tag status/tag all di grup ini.';
    } catch (e) { console.error('[!] Gagal memuat settings.json:', e); }
} else {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ autoBroadcast: true, broadcastInterval: 1, jpmGroupDelay: 15, antitagswWarningMessage: '🚨 Peringatan untuk @sender!\nDilarang keras menggunakan tag status/tag all di grup ini.' }, null, 2));
}
console.log(`[i] JPM Otomatis: ${isAutoBroadcastEnabled ? 'AKTIF' : 'NONAKTIF'}`);
console.log(`[i] Interval JPM Otomatis: ${broadcastIntervalHours} jam`);

function getTargetInfo(args, senderJid, isGroup) {
    let targetId = null;
    let remainingArgs = [...args];
    if (args[0] && args[0].endsWith('@g.us')) {
        targetId = args[0];
        remainingArgs.shift();
    } else if (isGroup) {
        targetId = senderJid;
    }
    return { id: targetId, args: remainingArgs };
}

function loadContacts() { if (!fs.existsSync(contactsDbPath)) { fs.writeFileSync(contactsDbPath, JSON.stringify([])); return []; } try { const data = JSON.parse(fs.readFileSync(contactsDbPath)); if (data.length > 0 && typeof data[0] === 'string') { console.log('[!] Migrasi format database lama ke baru...'); const migratedData = data.map(number => ({ number: number, name: `Kontak ${number}` })); saveContacts(migratedData); console.log('[√] Migrasi selesai.'); return migratedData; } return data; } catch (error) { console.error('[!] Gagal memuat atau mem-parsing database kontak:', error); return []; } }
function saveContacts(contacts) { fs.writeFileSync(contactsDbPath, JSON.stringify(contacts, null, 2)); }
function loadSavedContacts() { if (!fs.existsSync(savedContactsPath)) fs.writeFileSync(savedContactsPath, JSON.stringify([])); try { return JSON.parse(fs.readFileSync(savedContactsPath)); } catch { return []; } }
function saveSavedContacts(contacts) { fs.writeFileSync(savedContactsPath, JSON.stringify(contacts, null, 2)); }
function addContactIfNotExist(number, name) { let contacts = loadContacts(); let savedContacts = loadSavedContacts(); const numberExists = contacts.some(c => c.number === number); const alreadySaved = savedContacts.includes(number); if (!numberExists && !alreadySaved) { contacts.push({ number: number, name: name || `Kontak ${number}` }); saveContacts(contacts); console.log(`[+] Save kontak baru: ${name} (${number})`); return true; } return false; }
function removeContact(number) { let contacts = loadContacts().filter(c => c.number !== number); saveContacts(contacts); console.log(`[-] Hapus kontak: ${number}`); }
function clearContacts() { saveContacts([]); console.log('[!] Semua kontak telah dihapus dari database'); }
function saveAntilinkGroups() { fs.writeFileSync(ANTILINK_GROUPS_FILE, JSON.stringify(antilinkEnabledGroups, null, 2)); }
function saveWelcomeGroups() { fs.writeFileSync(WELCOME_GROUPS_FILE, JSON.stringify(welcomeEnabledGroups, null, 2)); }
function saveLeftGroups() { fs.writeFileSync(LEFT_GROUPS_FILE, JSON.stringify(leftEnabledGroups, null, 2)); }
function saveWelcomeMessages() { fs.writeFileSync(WELCOME_MESSAGES_FILE, JSON.stringify(groupWelcomeMessages, null, 2)); }
function saveLeftMessages() { fs.writeFileSync(LEFT_MESSAGES_FILE, JSON.stringify(groupLeftMessages, null, 2)); }
async function sendText(sock, jid, text, mentions = []) { try { await sock.sendMessage(jid, { text: text, mentions: mentions }); return true; } catch (error) { console.log(`[!] Error mengirim pesan teks ke ${jid}: ${error.message}`); return false; } }
async function sendImageWithText(sock, jid, imageSource, caption, mentions = []) { try { let imageMessage; if (Buffer.isBuffer(imageSource)) { imageMessage = imageSource; } else if (typeof imageSource === 'string' && imageSource.startsWith('http')) { imageMessage = { url: imageSource }; } else if (typeof imageSource === 'string' && fs.existsSync(imageSource)) { imageMessage = fs.readFileSync(imageSource); } else { console.log(`[!] File gambar tidak ditemukan di path: ${imageSource}`); await sendText(sock, jid, `Error: File gambar untuk menu tidak ditemukan. Harap hubungi admin.`); return false; } await sock.sendMessage(jid, { image: imageMessage, caption: caption, mentions: mentions }); console.log(`[√] Gambar dari "${typeof imageSource === 'string' ? imageSource : 'buffer'}" dikirim ke ${jid}.`); return true; } catch (error) { console.log(`[!] Error mengirim gambar ke ${jid}: ${error.message}`); return false; } }
async function sendContact(sock, jid, number, name, details = {}) { let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL;waid=${number}:${number}`; if (details.organization) vcard += `\nORG:${details.organization}`; if (details.title) vcard += `\nTITLE:${details.title}`; if (details.email) vcard += `\nEMAIL:${details.email}`; vcard += `\nEND:VCARD`; try { await sock.sendMessage(jid, { contacts: { displayName: name, contacts: [{ vcard }] } }); console.log(`[√] vCard lengkap untuk ${name} dikirim ke ${jid}`); let savedContacts = loadSavedContacts(); if (!savedContacts.includes(number)) { savedContacts.push(number); saveSavedContacts(savedContacts); console.log(`[+] Nomor ${number} ditambahkan ke saved_contacts.json`); } return true; } catch (error) { console.log(`[!] Error mengirim vCard untuk ${number} ke ${jid}: ${error.message}`); return false; } }
async function sendOwnerVCard(sock, jid) { const waMeLink = `https://wa.me/${ADMIN_NUMBER}`; const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${OWNER_NAME}\nORG:${OWNER_ORGANIZATION}\nTITLE:${OWNER_TITLE}\nTEL;TYPE=CELL;waid=${ADMIN_NUMBER}:${ADMIN_NUMBER}\nEMAIL:${OWNER_EMAIL}\nURL:${OWNER_WEBSITE}\nNOTE:Ini adalah kontak resmi dari Owner Bot. Klik link di bawah untuk chat langsung.\nURL;type=Whatsapp:${waMeLink}\nEND:VCARD`; try { await sock.sendMessage(jid, { contacts: { displayName: OWNER_NAME, contacts: [{ vcard }] } }); console.log(`[√] vCard Owner lengkap dikirim ke ${jid}`); return true; } catch (error) { console.log(`[!] Gagal mengirim vCard Owner: ${error.message}`); await sendText(sock, jid, "Gagal mengirim kontak Owner."); return false; } }
async function getGroupList(sock) { try { const groups = await sock.groupFetchAllParticipating(); return Object.values(groups); } catch (error) { console.log(`[!] Error mendapatkan daftar grup: ${error.message}`); return []; } }
async function saveNumbersFromGroup(sock, jid, groupId) { try { const metadata = await sock.groupMetadata(groupId); const participants = metadata.participants; if (!participants || participants.length === 0) { await sendText(sock, jid, `Tidak dapat menemukan anggota di grup: ${groupId}`); return; } await sendText(sock, jid, `Memulai proses pengambilan ${participants.length} kontak dari grup "${metadata.subject}"...`); const botJid = sock.user.id; for (const participant of participants) { if (participant.id === botJid || participant.id === adminJid) continue; addContactIfNotExist(participant.id.replace('@s.whatsapp.net', ''), participant.id.split('@')[0]); } await sendText(sock, jid, `Proses pengambilan kontak dari grup selesai.`); console.log(`[+] Proses save dari grup ${groupId} selesai.`); } catch (error) { console.log(`[!] Error mengambil nomor dari grup ${groupId}: ${error.message}`); await sendText(sock, jid, `Gagal mengambil nomor dari grup.`); } }

async function broadcastToGroups(sock, imageToSend, textToSend) {
    if (!sock) {
        console.error('[!] Gagal broadcast: instance socket tidak valid.');
        return 0;
    }
    try {
        const groups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        if (groupIds.length === 0) {
            console.log('[i] Tidak ada grup untuk di-broadcast.');
            return 0;
        }
        console.log(`[i] Memulai broadcast ke ${groupIds.length} grup...`);

        let successCount = 0;
        for (let groupId of groupIds) {
         if (jpmBlacklist.includes(groupId)) continue; 
         const randomizedMessage = spintax(textToSend); 
            try {
                await sock.sendPresenceUpdate('composing', groupId);
                await delay(1500);

                const sent = await sendImageWithText(sock, groupId, imageToSend, randomizedMessage);
                await sock.sendPresenceUpdate('paused', groupId);

                if (sent) {
                    successCount++;
                    console.log(`[BROADCAST] Terkirim ke grup: ${groupId}`);
                }
               
                await delay(jpmGroupDelaySeconds * 1000 + (Math.random() * 5000));
            } catch (err) {
                console.error(`[!] Gagal broadcast ke ${groupId}:`, err);
            }
        }
        console.log(`[√] Broadcast selesai! Berhasil terkirim ke ${successCount} dari ${groupIds.length} grup.`);
        return successCount;
    } catch (err) {
        console.error('[!] Gagal mengambil data grup untuk broadcast:', err);
        return 0;
    }
}

async function startPushContact(sock, adminJid, groupId, messageText) {
    minDelay = 30000; // 30 detik
    maxDelay = 90000; // 90 detik

    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        const participants = groupMetadata.participants.filter(p => p.id !== adminJid && p.id !== sock.user.id);
        const totalTargets = participants.length;
        if (totalTargets === 0) {
            await sendText(sock, adminJid, `Tidak ada target valid di grup "${groupMetadata.subject}"`);
            return;
        }

        await sendText(sock, adminJid, `✅ Memulai push kontak ke ${totalTargets} anggota dari grup "${groupMetadata.subject}".\nJeda waktu *AMAN*: ${minDelay / 1000}-${maxDelay / 1000} detik.`);

        let successCount = 0, failureCount = 0, processedCount = 0;
        let dailyLimit = 100;

        for (const participant of participants) {
            if (processedCount >= dailyLimit) {
                 await sendText(sock, adminJid, `⚠️ Batas pengiriman harian (${dailyLimit}) tercapai. Proses dihentikan untuk keamanan.`);
                 break;
            }
           
            const randomizedMessage = spintax(messageText);
            const targetJid = participant.id;

            await sock.sendPresenceUpdate('composing', targetJid);
            await delay(Math.floor(Math.random() * 2000) + 1000);

            const success = await sendText(sock, targetJid, randomizedMessage);
            await sock.sendPresenceUpdate('paused', targetJid);

            if (success) {
                successCount++;
                console.log(`[PUSH] Pesan terkirim ke ${targetJid}`);
            } else {
                failureCount++;
                console.log(`[PUSH] Gagal mengirim ke ${targetJid}`);
                await sendText(sock, adminJid, `❌ Gagal mengirim pesan ke nomor: ${targetJid.split('@')[0]}`);
            }

            processedCount++;
            if (processedCount % 10 === 0 && processedCount < totalTargets) {
                await sendText(sock, adminJid, `⏳ *Laporan Progres:*\n${processedCount} dari ${totalTargets} kontak telah diproses.`);
            }

            const currentDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
            await delay(currentDelay);
        }
        await sendText(sock, adminJid, `🎉 *Push Kontak Selesai!*\n\n*Laporan Akhir:*\n✅ Berhasil Terkirim: ${successCount}\n❌ Gagal Terkirim: ${failureCount}\n‼️ Total Target Diproses: ${processedCount}`);
    } catch (error) {
        console.log(`[!] Error pada fitur pushkontak: ${error.message}`);
        await sendText(sock, adminJid, `Gagal memulai push kontak. Pastikan ID Grup sudah benar dan bot adalah anggota dari grup tersebut.`);
    }
}

function startScheduledBroadcast() { if (broadcastIntervalId) { console.log('[i] Jadwal broadcast sudah berjalan, tidak memulai yang baru.'); return; } console.log(`[i] JPM Otomatis diaktifkan. Interval: ${broadcastIntervalHours} jam.`); broadcastIntervalId = setInterval(() => { const imageSource = fs.existsSync(JPM_IMAGE_PATH) ? JPM_IMAGE_PATH : IMAGE_URL; broadcastToGroups(sockInstance, imageSource, broadcastMessage); }, broadcastIntervalHours * 60 * 60 * 1000); }
function stopScheduledBroadcast() { if (broadcastIntervalId) { clearInterval(broadcastIntervalId); broadcastIntervalId = null; console.log('[i] JPM Otomatis dinonaktifkan.'); } }
function createBackup() { try { const zip = new AdmZip(); const itemsToBackup = fs.readdirSync(__dirname).filter(item => !['json', 'node_modules', 'backups', 'sesi', 'package-lock.json', '.npm', '.cache'].includes(item) && !item.endsWith('.zip') && !item.endsWith('.log') && !item.endsWith('.tmp')); console.log('[i] Memulai proses backup...'); itemsToBackup.forEach(item => { const itemPath = path.join(__dirname, item); try { const stats = fs.statSync(itemPath); if (stats.isDirectory()) { zip.addLocalFolder(itemPath, item); console.log(`  -> Menambahkan direktori: ${item}`); } else if (stats.isFile()) { zip.addLocalFile(itemPath); console.log(`  -> Menambahkan file: ${item}`); } } catch (e) { console.log(`[!] Gagal memproses item: ${item} - ${e.message}`); } }); zip.writeZip(backupZipPath); console.log(`[√] Backup file dan folder berhasil dibuat di ${backupZipPath}`); return true; } catch (error) { console.log(`[!] Error saat membuat file zip backup: ${error.message}`); return false; } }
async function sendBackupFile(sock, jid) { try { if (!fs.existsSync(backupZipPath)) { await sendText(sock, jid, 'File backup tidak ditemukan. Buat backup terlebih dahulu.'); return false; } const fileBuffer = fs.readFileSync(backupZipPath); await sock.sendMessage(jid, { document: fileBuffer, fileName: 'backup_bot.zip', mimetype: 'application/zip' }); console.log(`[√] File backup dikirim ke ${jid}`); return true; } catch (error) { console.log(`[!] Error mengirim file backup: ${error.message}`); return false; } }
function getUptime() { const uptimeSeconds = os.uptime(); const days = Math.floor(uptimeSeconds / (3600 * 24)); const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600); const minutes = Math.floor((uptimeSeconds % 3600) / 60); const seconds = Math.floor(uptimeSeconds % 60); return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`; }
async function getVPSSpecs() { const totalMem = os.totalmem() / (1024 * 1024 * 1024), freeMem = os.freemem() / (1024 * 1024 * 1024); const usedMem = (totalMem - freeMem).toFixed(2); const cpuInfo = os.cpus(), cpuModel = cpuInfo[0]?.model || 'N/A', cpuCores = cpuInfo.length; const cpuSpeed = cpuInfo[0]?.speed ? `${(cpuInfo[0].speed / 1000).toFixed(2)} GHz` : 'N/A'; const osInfo = `${os.type()} ${os.release()} (${os.platform()})`, arch = os.arch(); const getCPUUsage = () => new Promise(resolve => { const start = os.cpus(); setTimeout(() => { const end = os.cpus(); let idle = 0, total = 0; for (let i = 0; i < start.length; i++) { const s = start[i].times, e = end[i].times; idle += e.idle - s.idle; total += Object.values(e).reduce((a, b) => a + b, 0) - Object.values(s).reduce((a, b) => a + b, 0); } resolve(((1 - idle / total) * 100).toFixed(2)); }, 100); }); const cpuUsage = await getCPUUsage(); return `*Spesifikasi Server:*\n- CPU: ${cpuModel}\n- Core: ${cpuCores}\n- Speed: ${cpuSpeed}\n- Usage: ${cpuUsage}%\n- RAM Total: ${totalMem.toFixed(2)} GB\n- RAM Used: ${usedMem} GB\n- OS: ${osInfo}\n- Arch: ${arch}`.trim(); }
function getCurrentWIBDateTime() { const now = new Date(); const options = { timeZone: 'Asia/Jakarta', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }; return new Intl.DateTimeFormat('id-ID', options).format(now).replace(/\./g, ':'); }
function getFormattedDateTimeList() { const now = new Date(); const timeZone = 'Asia/Jakarta'; const dateOptions = { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; const timeOptions = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }; const dateString = new Intl.DateTimeFormat('id-ID', dateOptions).format(now); const timeString = new Intl.DateTimeFormat('id-ID', timeOptions).format(now).replace(/\./g, ':'); return `🗓️ *Tanggal:* ${dateString}\n⏰ *Waktu:* ${timeString} WIB`; }
async function encryptCode(code) { try { const obfuscationResult = JavaScriptObfuscator.obfuscate(code, { compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 1, numbersToExpressions: true, simplify: true, stringArrayShuffle: true, splitStrings: true, stringArrayThreshold: 1 }); return obfuscationResult.getObfuscatedCode(); } catch (error) { console.error('[!] Gagal mengenkripsi kode:', error); return null; } }
async function clearTempFiles() { const tmpDir = os.tmpdir(); const extensionsToDelete = ['.tmp', '.log', '.bak', '.old']; let deletedCount = 0; try { const files = await fs.promises.readdir(tmpDir); for (const file of files) { const filePath = path.join(tmpDir, file); if (extensionsToDelete.some(ext => file.endsWith(ext))) { try { await fs.promises.unlink(filePath); console.log(`[BOOST] Menghapus file sampah: ${file}`); deletedCount++; } catch (e) { console.error(`[!] Gagal menghapus file ${file}: ${e.message}`); } } } } catch (e) { console.error(`[!] Gagal membaca direktori temporary: ${e.message}`); } return deletedCount; }
async function createPanelUserAndServer(sock, senderJid, username, targetNumber, resources) {
    if (global.domain === 'https://panel.example.com' || global.apikey === 'ptla_xxxxxxxxxxxx' || global.domain === '-') {
        await sendText(sock, senderJid, '❌ *Konfigurasi Panel Belum Diisi!*\n\nHarap edit file skrip dan isi variabel `global.domain` dan `global.apikey` (ptla) di bagian atas.');
        return;
    }

    await sendText(sock, senderJid, `⏳ Memulai pembuatan akun panel untuk *${username}*...`);

    const userJid = `${targetNumber}@s.whatsapp.net`;
    const password = `${username}${Math.floor(Math.random() * 9000) + 1000}`;
    const serverName = `${username} Server`;
    const userEmail = `${username}@${(new URL(global.domain)).hostname}`;

    const startupCommand = `if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z \${NODE_PACKAGES} ]]; then /usr/local/bin/npm install \${NODE_PACKAGES}; fi; if [[ ! -z \${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall \${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; if [[ ! -z \${CUSTOM_ENVIRONMENT_VARIABLES} ]]; then vars=$(echo \${CUSTOM_ENVIRONMENT_VARIABLES} | tr ";" "\\n"); for line in $vars; do export $line; done; fi; /usr/local/bin/node /home/container/{{CMD_RUN}}`;

    let userId;

    try {
        await sendText(sock, senderJid, `[1/3] Membuat atau mencari user di panel...`);
        let userCreationResponse = await fetch(`${global.domain}/api/application/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${global.apikey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'email': userEmail,
                'first_name': username,
                'last_name': 'User',
                'password': password,
                'language': 'en'
            })
        });

        let userData = await userCreationResponse.json();

        if (userData.errors) {
            const errorDetail = userData.errors[0].detail;
            if (errorDetail && (errorDetail.includes('taken') || errorDetail.includes('exists'))) {
                await sendText(sock, senderJid, `⚠️ User *${username}* sudah ada. Mencoba mengambil data user yang ada...`);
                const usersListResponse = await fetch(`${global.domain}/api/application/users?filter[email]=${encodeURIComponent(userEmail)}`, {
                    headers: { 'Authorization': `Bearer ${global.apikey}`, 'Accept': 'application/json' }
                });
                const usersListData = await usersListResponse.json();
                if (usersListData.data && usersListData.data.length > 0) {
                    userId = usersListData.data[0].attributes.id;
                    await sendText(sock, senderJid, `✅ User ditemukan dengan ID: ${userId}. Melanjutkan pembuatan server...`);
                } else {
                    throw new Error(`Gagal menemukan user yang sudah ada dengan email: ${userEmail}`);
                }
            } else {
                throw new Error(`API Error (User): ${errorDetail}`);
            }
        } else {
            userId = userData.attributes.id;
        }

        await sendText(sock, senderJid, `[2/3] Membuat server dengan resource:\n- RAM: ${resources.ram} MB\n- CPU: ${resources.cpu} %\n- DISK: ${resources.disk} MB`);

        const serverCreationResponse = await fetch(`${global.domain}/api/application/servers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${global.apikey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "name": serverName,
                "user": userId,
                "egg": parseInt(global.eggsnya),
                "docker_image": "ghcr.io/parkervcp/yolks:nodejs_21",
                "startup": startupCommand,
                "environment": { "CMD_RUN": "index.js" },
                "limits": {
                    "memory": resources.ram,
                    "swap": 0,
                    "disk": resources.disk,
                    "io": 500,
                    "cpu": resources.cpu
                },
                "feature_limits": { "databases": 5, "allocations": 1, "backups": 5 },
                "deploy": {
                    "locations": [parseInt(global.location)],
                    "dedicated_ip": false,
                    "port_range": []
                }
            })
        });

        const serverData = await serverCreationResponse.json();
        if (serverData.errors) {
            throw new Error(`API Error (Server): ${serverData.errors[0].detail}`);
        }

        await sendText(sock, senderJid, `[3/3] Mengirim detail akun ke nomor ${targetNumber}...`);

        const detailMessage = `*『 AKUN PANEL ANDA BERHASIL DIBUAT 』*\n\n` +
                                `Berikut adalah detail akun Anda:\n\n` +
                                `*👤 USERNAME:* ${username}\n` +
                                `*🔐 PASSWORD:* ${password}\n` +
                                `*🌐 LOGIN:* ${global.domain}\n\n` +
                                `*📊 DETAIL SERVER:*\n` +
                                `*- SERVER ID:* ${serverData.attributes.id}\n` +
                                `*- RAM:* ${resources.ram} MB\n` +
                                `*- CPU:* ${resources.cpu === 0 ? 'Unlimited' : resources.cpu + ' %'}\n\n`+
                                `*NOTE:*\n` +
                                `[1] Harap simpan detail akun ini dengan baik.\n` +
                                `[2] Jangan bagikan akun panel Anda kepada siapapun.\n\n` +
                                `Terima kasih!`;

        await sendText(sock, userJid, detailMessage);
        await sendText(sock, senderJid, `✅ *SUKSES!*\n\nAkun dan server untuk *${username}* telah berhasil dibuat dan detailnya telah dikirim ke nomor target.`);

    } catch (error) {
        console.error('[!] Gagal membuat akun panel:', error);
        await sendText(sock, senderJid, `❌ *PROSES GAGAL!*\n\nTerjadi kesalahan: ${error.message}`);
    }
}
async function uploadToCatbox(filePath) {
    try {
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', fs.createReadStream(filePath));

        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        if (response.status === 200 && response.data) {
             return response.data;
        } else {
            throw new Error(`Gagal mengunggah: Catbox tidak memberikan respon yang valid. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Upload ke Catbox gagal:', error.response ? error.response.data : error.message);
        throw new Error('Proses upload ke Catbox gagal.');
    }
}
async function listPanelServers(sock, senderJid) {
    await sendText(sock, senderJid, "⏳ Mengambil daftar server dari panel, mohon tunggu...");

    try {
        const response = await fetch(`${global.domain}/api/application/servers?include=user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${global.apikey}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.errors?.[0]?.detail || `Status code: ${response.status}`;
            throw new Error(errorMessage);
        }

        const serverData = await response.json();

        if (!serverData.data || serverData.data.length === 0) {
            await sendText(sock, senderJid, "✅ Tidak ada server yang ditemukan di panel.");
            return;
        }

        let listMessage = `📋 *Daftar Server di Panel*\n\nTotal Server: *${serverData.meta.pagination.total}*\n\n`;

        for (const server of serverData.data) {
            const attr = server.attributes;
            const userAttr = attr.relationships.user.attributes;
            listMessage += `*${attr.name}*\n` +
                         `  - ID Server: \`${attr.id}\`\n` +
                         `  - Owner: ${userAttr.username} (\`${userAttr.id}\`)\n` +
                         `  - RAM: ${attr.limits.memory} MB\n` +
                         `  - Status: ${attr.suspended ? 'Suspended' : 'Aktif'}\n\n`;
        }
       
        await sendText(sock, senderJid, listMessage.trim());

    } catch (error) {
        console.error('[!] Gagal mengambil daftar server panel:', error);
        await sendText(sock, senderJid, `❌ *PROSES GAGAL!*\n\nTerjadi kesalahan: ${error.message}`);
    }
}
async function listPanelUsers(sock, senderJid) {
    await sendText(sock, senderJid, "⏳ Mengambil daftar user dari panel, mohon tunggu...");

    try {
        const response = await fetch(`${global.domain}/api/application/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${global.apikey}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.errors?.[0]?.detail || `Status code: ${response.status}`;
            throw new Error(errorMessage);
        }

        const userData = await response.json();

        if (!userData.data || userData.data.length === 0) {
            await sendText(sock, senderJid, "✅ Tidak ada user yang ditemukan di panel.");
            return;
        }

        let listMessage = `👤 *Daftar User di Panel*\n\nTotal User: *${userData.meta.pagination.total}*\n\n`;

        for (const user of userData.data) {
            const attr = user.attributes;
            listMessage += `*${attr.username}* (${attr.first_name} ${attr.last_name})\n` +
                         `  - ID User: \`${attr.id}\`\n` +
                         `  - Email: ${attr.email}\n` +
                         `  - Admin: ${attr.root_admin ? 'Ya' : 'Tidak'}\n\n`;
        }
       
        await sendText(sock, senderJid, listMessage.trim());

    } catch (error) {
        console.error('[!] Gagal mengambil daftar user panel:', error);
        await sendText(sock, senderJid, `❌ *PROSES GAGAL!*\n\nTerjadi kesalahan: ${error.message}`);
    }
}
async function deletePanelUser(sock, senderJid, userId) {
    if (!userId || isNaN(parseInt(userId))) {
        await sendText(sock, senderJid, `❌ *Format Salah!*\n\nGunakan: \`${PREFIX}deluserpanel <user_id>\`\nUntuk melihat ID User, ketik \`${PREFIX}listuserpanel\`\nContoh: \`${PREFIX}deluserpanel 4\``);
        return;
    }

    await sendText(sock, senderJid, `⏳ Memproses penghapusan user dengan ID: \`${userId}\`...`);

    try {
        const endpoint = `${global.domain}/api/application/users/${userId}`;
       
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${global.apikey}`,
                'Accept': 'application/json'
            }
        });

        if (response.status === 204) {
            await sendText(sock, senderJid, `✅ *SUKSES!*\n\nUser dengan ID \`${userId}\` telah berhasil dihapus.`);
        } else {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.errors?.[0]?.detail || `Gagal dengan status code: ${response.status}`;
            throw new Error(errorMessage);
        }

    } catch (error) {
        console.error(`[!] Gagal menghapus user panel (ID: ${userId}):`, error);
        await sendText(sock, senderJid, `❌ *PROSES GAGAL!*\n\nTerjadi kesalahan: ${error.message}\n\n_Tips: Anda tidak bisa menghapus user yang masih memiliki server._`);
    }
}
async function deletePanelServer(sock, senderJid, serverId) {
    if (!serverId || isNaN(parseInt(serverId))) {
        await sendText(sock, senderJid, `❌ *Format Salah!*\n\nGunakan: \`${PREFIX}delpanel <server_id>\`\nContoh: \`${PREFIX}delpanel 15\``);
        return;
    }

    await sendText(sock, senderJid, `⏳ Memproses penghapusan server dengan ID: \`${serverId}\`...`);

    try {
        const endpoint = `${global.domain}/api/application/servers/${serverId}`;
       
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${global.apikey}`,
                'Accept': 'application/json'
            }
        });

        if (response.status === 204) {
            await sendText(sock, senderJid, `✅ *SUKSES!*\n\nServer dengan ID \`${serverId}\` telah berhasil dihapus.`);
        } else {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.errors?.[0]?.detail || `Gagal dengan status code: ${response.status}`;
            throw new Error(errorMessage);
        }

    } catch (error) {
        console.error(`[!] Gagal menghapus server panel (ID: ${serverId}):`, error);
        await sendText(sock, senderJid, `❌ *PROSES GAGAL!*\n\nTerjadi kesalahan: ${error.message}\n\n_Tips: Jika server tidak kosong, penghapusan mungkin gagal._`);
    }
}
const builtInCommands = [
    // Panel
    'addprem', 'delprem', 'listprem', '1gb', '2gb', '3gb', '4gb', '5gb', '6gb', '7gb', '8gb', '9gb', '10gb', 'unli', 'listpanel', 'delpanel', 'listuserpanel', 'deluserpanel',
    // Store
    'addrespon', 'delrespon', 'listrespon', 'payment', 'setqris', 'setpayment', 'done', 'testi', 'uptesti', 'sendtesti', 'addproduk', 'addstok', 'cekstok', 'buy', 'batalbeli',
    // JPM
    'jpm', 'bljpm', 'blgcjpm', 'setimgjpm', 'settimejpm', 'setdelayjpm', 'setpesan', 'cekpesan', 'jpmv1', 'jpmv2',
    // Push Kontak
    'list', 'save', 'remove', 'clear', 'savegrub', 'pushkontak', 'setdelay', 'checkdelay',
    // Grup
    'cekgrub', 'listgroups', 'kick', 'promote', 'demote', 'hidetag', 'ht', 'antilink', 'welcome', 'left', 'setwelcome', 'setleft', 'antitagsw', 'setantitagsw', 'welcomeall', 'leftall', 'open', 'close', 'setnamegc', 'setdeskgc', 'totag', 'antilongtext', 'antikata', 'setkata',
    // Owner
    'public', 'joingc', 'self', 'enc', 'backup', 'restart', 'ceksetgc', 'addsewa', 'delsewa', 'listsewa', 'boost', 'cekidch', 'idch', 'story',
    // Maker
  'sticker', 's', 'ttp', 'brat', 'remini', 'hd', 'tohd', 'antilinkall', 'ssweb',
    // Lainnya
    'allmenu', 'menu', 'help', 'owner', 'rvo', 'savebot', 'ping', 'cekvps', 'tourl', 'debugrvo' , 'ai', 'totalchat', 'tagall'
];
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('sesi');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.appropriate('chrome'),
    });
    sockInstance = sock;

    if (!sock.authState.creds.registered) {
        console.clear();
        try {
            console.log(chalk.green('==============================================='));
            console.log(chalk.yellow('MASUKAN NOMER WHATSAPP KAMU Contoh: 628xxxx'));
            console.log(chalk.green('==============================================='));
            let phoneNumber = await question('');
            phoneNumber = phoneNumber.replace(/\D/g, '');
            if (!phoneNumber) {
                console.log('[!] Nomor tidak valid, proses dihentikan.');
                rl.close();
                process.exit(1);
            }
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(chalk.yellow(`\n========================================\nKODE PAIRING KAMU : ${code.match(/.{1,4}/g).join('-')}\n========================================`));
            console.log(chalk.green('SCRIPT BY WARUNGERIK'));

        } catch (error) {
            console.error('\n[!] Gagal melakukan aktivasi:', error.message);
            rl.close();
            process.exit(1);
        }
    }
    restartBot = async (jid) => {
        console.log('[!] Memulai ulang bot...')
        isRestarting = true;
        adminJid = jid;
        stopScheduledBroadcast();
        if (sockInstance) await sockInstance.end();
        startBot();
    };

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('call', async (calls) => {
        const call = calls[0];
        if (botSettings.anticall) {
            console.log(`[!] Menerima panggilan dari ${call.from}, menolak panggilan...`);
            await sock.rejectCall(call.id, call.from);
           
            await sendText(sock, call.from, 'Maaf, bot tidak dapat menerima panggilan. Panggilan otomatis diblokir.');
        }
    });
sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('[!] Koneksi terputus, mencoba menghubungkan kembali:', shouldReconnect);
        stopScheduledBroadcast();
        if (shouldReconnect && !isRestarting) {
            startBot();
        } else if (isRestarting) {
        } else {
            console.log('[!] Koneksi terputus permanen. Hapus folder "sesi" jika ingin pairing ulang.');
        }
    } else if (connection === 'open') {
        console.clear();
        console.log(chalk.green('[√] BOT BERHASIL TERHUBUNG'));
        if (rl && !rl.closed) rl.close();
        scheduleDailyRestart();

        const startupJid = `${STARTUP_NOTIFICATION_NUMBER}@s.whatsapp.net`;
        const menuImagePath = path.join(__dirname, 'img/menu.jpg');

        if (isRestarting) {
            const restartMessage = `✅ *Bot Berhasil Di-restart*`;
            await sendText(sock, adminJid, restartMessage);
            isRestarting = false;
        } else {
            if (STARTUP_NOTIFICATION_NUMBER && STARTUP_NOTIFICATION_NUMBER.length > 5 && fs.existsSync(menuImagePath)) {
               
                const startupMessageText = `Bot berhasil terhubung dan siap digunakan!\n\n*ORDER SCRIPT INI KE WARUNGERIK*\nWHATSAPP : 085183129647\nTELEGRAM : @WARUNGERIK`;
                await sock.sendMessage(startupJid, {
                    text: startupMessageText,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: global.idsaluran,
                            newsletterName: global.namasaluran,
                        },
                        externalAdReply: {
                            title: `🤖 ${BOT_NAME} - STATUS ONLINE`,
                            body: `Terhubung pada: ${getCurrentWIBDateTime()}`,
                            thumbnail: fs.readFileSync(menuImagePath),
                            renderLargerThumbnail: true,
                            sourceUrl: global.linksaluran,
                            mediaType: 1
                        }
                    }
                });

            } else {
                console.log('[i] Nomor notifikasi startup tidak diatur atau file img/menu.jpg tidak ditemukan.');
                const connectMessage = `*🤖 BOT ONLINE*\n\nORDER SCRIPT KE WARUNGERIK\nWHATSAPP : 085183129647\nTELEGRAM : @WARUNGERIK`;
                await sendText(sock, startupJid, connectMessage);
            }
        }


        if (isAutoBroadcastEnabled) {
            setTimeout(() => {
                const imageSource = fs.existsSync(JPM_IMAGE_PATH) ? JPM_IMAGE_PATH : IMAGE_URL;
                broadcastToGroups(sockInstance, imageSource, broadcastMessage);
                startScheduledBroadcast();
            }, 10000);
        }
    }
});

sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    try {
        const groupMetadata = await sock.groupMetadata(id);
       
        const welcomeImagePath = path.join(__dirname, 'img/menu.jpg');
        const leftImagePath = path.join(__dirname, 'img/menu.jpg');

        for (const participantJid of participants) {
            const userNumber = participantJid.split('@')[0];

            if (action === 'add' && welcomeEnabledGroups.includes(id)) {
                console.log(`[WELCOME] Member baru ${userNumber} di grup ${id}`);
               
                const defaultMessage = `Halo @${userNumber}, selamat datang di *${groupMetadata.subject}*! 🎉`;
                const welcomeMessageText = groupWelcomeMessages[id] ? groupWelcomeMessages[id].replace(/@user/g, `@${userNumber}`).replace(/@subject/g, groupMetadata.subject) : defaultMessage;

                await sock.sendMessage(id, {
                    text: welcomeMessageText,
                    contextInfo: {
                        mentionedJid: [participantJid],
                        externalAdReply: {
                            title: `SELAMAT DATANG!`,
                            body: `@${userNumber}`, // Body pesan diisi dengan nomor user
                            thumbnail: fs.existsSync(welcomeImagePath) ? fs.readFileSync(welcomeImagePath) : null,
                            renderLargerThumbnail: true,
                            sourceUrl: global.linksaluran,
                            mediaType: 1
                        }
                    }
                });
            } 
            else if (action === 'remove' && leftEnabledGroups.includes(id)) {
                console.log(`[LEFT] Member keluar ${userNumber} dari grup ${id}`);

                const defaultMessage = `Selamat tinggal @${userNumber}. Sampai jumpa lagi. 👋`;
                const leftMessageText = groupLeftMessages[id] ? groupLeftMessages[id].replace(/@user/g, `@${userNumber}`).replace(/@subject/g, groupMetadata.subject) : defaultMessage;

                await sock.sendMessage(id, {
                    text: leftMessageText,
                    contextInfo: {
                        mentionedJid: [participantJid],
                        externalAdReply: {
                            title: `SAMPAI JUMPA`,
                            body: `@${userNumber}`, // Body pesan diisi dengan nomor user
                            thumbnail: fs.existsSync(leftImagePath) ? fs.readFileSync(leftImagePath) : null,
                            renderLargerThumbnail: true,
                            sourceUrl: global.linksaluran,
                            mediaType: 1
                        }
                    }
                });
            }
        }
    } catch (e) {
        console.log(`[!] Error pada event group-participants.update: ${e.message}`);
    }
});
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
            console.log("--- RAW MESSAGE OBJECT ---\n", JSON.stringify(msg.message, null, 2)); 
        try {
            if (botSettings.autoread) {
                await sock.readMessages([msg.key]);
            }
            if (botSettings.autoreadsw && msg.key.remoteJid === 'status@broadcast') {
                 await sock.readMessages([msg.key]);
                 console.log(`[i] Auto-read status dari ${msg.pushName}`);
            }
            if (msg.message && !msg.key.fromMe) {
                 if (botSettings.autotyping) {
                     await sock.sendPresenceUpdate('composing', msg.key.remoteJid);
                 } else if (botSettings.autorecording) {
                     await sock.sendPresenceUpdate('recording', msg.key.remoteJid);
                 }
            }
        } catch (e) {
            console.error('[!] Error pada implementasi bot settings:', e);
        }
        try {
            const voMessage = msg.message.viewOnceMessageV2 || msg.message.viewOnceMessageV2Extension || msg.message.viewOnceMessage;
            if (voMessage && voMessage.message) {
                const type = Object.keys(voMessage.message)[0];
                if (type === 'imageMessage' || type === 'videoMessage') {
                    const messageId = msg.key.id;
                    console.log(`[RVO] Mendeteksi & menyimpan pesan 'Sekali Lihat' (ID: ${messageId}) ke cache.`);
                    viewOnceCache.set(messageId, voMessage.message);

                    if (viewOnceCache.size > VIEW_ONCE_CACHE_MAX_SIZE) {
                        const oldestKey = viewOnceCache.keys().next().value;
                        viewOnceCache.delete(oldestKey);
                        console.log(`[RVO CACHE] Menghapus item cache terlama: ${oldestKey}`);
                    }
                }
            }
        } catch (e) {
            console.log('[!] Error saat memproses deteksi view once:', e);
        }

        const senderJid = msg.key.remoteJid;
        const fromMe = msg.key.fromMe;
        const isGroup = senderJid.endsWith('@g.us');
        const senderNumber = isGroup ? (msg.key.participant?.replace('@s.whatsapp.net', '') || senderJid.replace('@s.whatsapp.net', '')) : senderJid.replace('@s.whatsapp.net', '');
        const senderName = msg.pushName || senderNumber;
if (isGroup && !fromMe && msg.key.participant) {
    const groupId = senderJid;
    const userId = msg.key.participant;

    if (!chatCounts[groupId]) {
        chatCounts[groupId] = {};
    }
    if (!chatCounts[groupId][userId]) {
        chatCounts[groupId][userId] = 0;
    }

    chatCounts[groupId][userId]++;
    saveChatCounts();
}
        const messageType = Object.keys(msg.message)[0];
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';

        if (text.startsWith(PREFIX)) {
            const potentialCommand = text.slice(PREFIX.length).trim().toLowerCase().split(' ')[0];
            if (customResponses[potentialCommand]) {
                const responseData = customResponses[potentialCommand];
                if (fs.existsSync(responseData.imagePath)) {
                    await sendImageWithText(sock, senderJid, responseData.imagePath, responseData.caption);
                } else {
                    console.log(`[!] File gambar untuk respon kustom '${potentialCommand}' tidak ditemukan di path: ${responseData.imagePath}`);
                    await sendText(sock, senderJid, `Maaf, terjadi error saat mengambil data untuk respon ini. Harap hubungi Admin.`);
                }
                return;
            }
        }

        if (!fromMe && !isGroup) {
            addContactIfNotExist(senderNumber, senderName);
        }

        if (isGroup && antilinkList.length > 0 && antilinkEnabledGroups.includes(senderJid)) {
            const regexLink = new RegExp(antilinkList.join('|'), 'gi');
            if (regexLink.test(text)) {
                try {
                    const metadata = await sock.groupMetadata(senderJid);
                    const participantId = msg.key.participant || msg.key.remoteJid;
                    const participant = metadata.participants.find(p => p.id === participantId);
                    const isAdmin = fromMe || (participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));

                    if (!isAdmin) {
                        await sock.sendMessage(senderJid, { delete: msg.key });
                    }
                } catch (e) {
                    console.error(`[!] Error pada fitur antilink: ${e.message}`);
                }
            }
        }
if (isGroup && antilongtextEnabledGroups.includes(senderJid) && text.length > LONG_TEXT_LIMIT) {
            try {
                const metadata = await sock.groupMetadata(senderJid);
                const participantId = msg.key.participant || msg.key.remoteJid;
                const participant = metadata.participants.find(p => p.id === participantId);
                const isAdmin = fromMe || (participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));

                if (!isAdmin) {
                    await sock.sendMessage(senderJid, { delete: msg.key });
                    console.log(`[ANTI LONG TEXT] Menghapus pesan panjang dari ${participantId} di grup ${senderJid}`);
                }
            } catch (e) {
                console.error(`[!] Error pada fitur anti-long-text: ${e.message}`);
            }
        }
        if (isGroup && antikataEnabledGroups.includes(senderJid) && kataTerlarangList.length > 0) {
    try {
        const containsForbiddenWord = kataTerlarangList.some(forbiddenWord => 
            text.toLowerCase().includes(forbiddenWord.toLowerCase())
        );

        if (containsForbiddenWord) {
            const metadata = await sock.groupMetadata(senderJid);
            const participantId = msg.key.participant || msg.key.remoteJid;
            const participant = metadata.participants.find(p => p.id === participantId);
            const isAdmin = fromMe || (participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));

            if (!isAdmin) {
                await sock.sendMessage(senderJid, { delete: msg.key });
                console.log(`[ANTI KATA] Menghapus pesan dari ${participantId} di grup ${senderJid} karena mengandung kata terlarang.`);
            }
        }
    } catch (e) {
        console.error(`[!] Error pada fitur antikata: ${e.message}`);
    }
}
        if (isGroup && antitagswEnabledGroups.includes(senderJid)) {
            try {
                const metadata = await sock.groupMetadata(senderJid);
                const participantId = msg.key.participant;
                const participant = metadata.participants.find(p => p.id === participantId);
                const isAdmin = fromMe || (participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));
                const mentionedJids = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const isTagSw = mentionedJids.includes('0@s.whatsapp.net');

                if (!isAdmin && isTagSw) {
                    const senderNumberOnly = participantId.split('@')[0];
                    console.log(`[!] Tag Status/All terdeteksi dari ${senderNumberOnly} di grup ${senderJid}. Menghapus pesan.`);
                   
                    await sock.sendMessage(senderJid, { delete: msg.key });
                   
                    const warningMessage = antitagswWarningMessage.replace(/@sender/g, `@${senderNumberOnly}`);
                    await sendText(sock, senderJid, warningMessage, [participantId]);
                }
            } catch(e) {
                console.error(`[!] Error pada fitur Anti-Tag-SW: ${e.message}`);
            }
        }
// GANTI SELURUH BLOK ANTI-POLLING ANDA DENGAN YANG INI
// Sudah termasuk console.log untuk debugging jika masih gagal
if (isGroup && (msg.message.pollCreationMessage || msg.message.pollCreationMessageV2 || msg.message.pollCreationMessageV3)) {
    // --- DEBUG START ---
    console.log('--- [DEBUG ANTI-POLL] Pesan Polling Terdeteksi! ---');
    console.log(`> Grup: ${senderJid}`);
    console.log(`> Daftar Grup Aktif:`, antipollEnabledGroups);
    // --- DEBUG END ---

    if (antipollEnabledGroups.includes(senderJid)) {
        console.log(`> FITUR AKTIF untuk grup ini. Melakukan pengecekan admin...`);
        try {
            const metadata = await sock.groupMetadata(senderJid);
            const participantId = msg.key.participant || msg.key.remoteJid;
            const participant = metadata.participants.find(p => p.id === participantId);
            const isAdmin = fromMe || (participant && (participant.admin === 'admin' || participant.admin === 'superadmin'));
            
            console.log(`> Pengirim: ${participantId}`);
            console.log(`> Apakah Pengirim Admin?: ${isAdmin}`);

            if (!isAdmin) {
                console.log(`> HASIL: Pengirim BUKAN ADMIN. MENCOBA HAPUS PESAN...`);
                await sock.sendMessage(senderJid, { delete: msg.key });
                console.log(`> SUKSES: Polling dari ${participantId} di grup ${senderJid} telah dihapus.`);
            } else {
                console.log(`> HASIL: Pengirim adalah ADMIN. Pesan tidak dihapus.`);
            }
        } catch (e) {
            console.error(`[!] Error pada fitur anti-polling: ${e.message}`);
        }
    } else {
        console.log(`> FITUR TIDAK AKTIF untuk grup ini. Pesan diabaikan.`);
    }
    console.log('--- [DEBUG ANTI-POLL] Pengecekan Selesai ---');
}
        const isCmd = text.startsWith(PREFIX);
        const isAdminSender = senderNumber === ADMIN_NUMBER || fromMe;
        const isPremiumSender = premiumUsers.includes(msg.key.participant || senderJid); 

        if (isCmd && botMode === 'self' && !isAdminSender) {
            console.log(`[SELF MODE] Perintah '${text}' dari ${senderNumber} diabaikan.`);
            return;
        }

        if (text.toLowerCase() === '.sticker' || text.toLowerCase() === '.s') {
            const isImage = msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

            if (isImage) {
                try {
                    await sendText(sock, senderJid, "⏳ Membuat stiker, mohon tunggu...");
                    const imageMessage = msg.message.imageMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
                    const imageBuffer = await downloadMediaMessage(
                        { message: { imageMessage: imageMessage }, key: msg.key },
                        'buffer', {}, { logger: pino({ level: 'silent' }) }
                    );

                    const sticker = new Sticker(imageBuffer, {
                        pack: STICKER_PACK_NAME,
                        author: STICKER_AUTHOR_NAME,
                        type: StickerTypes.FULL,
                        quality: 50
                    });

                    const stickerMessage = await sticker.toMessage();
                    await sock.sendMessage(senderJid, stickerMessage);

                } catch (e) {
                    console.error('[!] Gagal membuat stiker:', e);
                    await sendText(sock, senderJid, '❌ Gagal membuat stiker. Pastikan gambar valid dan coba lagi.');
                }
            } else {
                await sendText(sock, senderJid, '❌ Perintah salah. Anda harus mengirim atau membalas sebuah gambar dengan caption .sticker atau .s');
            }
            return; 
        }

        if (text.toLowerCase().startsWith(PREFIX + 'ttp')) {
            const textToSticker = text.substring((PREFIX + 'ttp').length).trim();
            if (!textToSticker) {
                await sendText(sock, senderJid, `❌ Perintah salah. Masukkan teks yang ingin dijadikan stiker.\n\nContoh: *${PREFIX}ttp Halo Dunia*`);
                return;
            }
            if (API_KEY === 'GANTI_DENGAN_APIKEY_ANDA') { 
                await sendText(sock, senderJid, `❌ API Key belum diatur. Harap hubungi Admin untuk mengatur API Key di dalam file skrip.`);
                return;
            }
            await sendText(sock, senderJid, "⏳ Membuat stiker dari teks, mohon tunggu...");
            try {
                const apiUrl = `https://api.autoresbot.com/api/maker/ttp?text=${encodeURIComponent(textToSticker)}&apikey=${API_KEY}`;
                const sticker = new Sticker(apiUrl, { pack: STICKER_PACK_NAME, author: STICKER_AUTHOR_NAME, type: StickerTypes.FULL, quality: 70 });
                const stickerMessage = await sticker.toMessage();
                await sock.sendMessage(senderJid, stickerMessage);
            } catch (e) {
                console.error('[!] Gagal membuat stiker TTP:', e);
                await sendText(sock, senderJid, '❌ Gagal membuat stiker. Pastikan API Key Anda benar dan API sedang tidak bermasalah.');
            }
            return;
        }

        if (text.toLowerCase().startsWith(PREFIX + 'brat')) {
            const textToSticker = text.substring((PREFIX + 'brat').length).trim();
            if (!textToSticker) {
                await sendText(sock, senderJid, `❌ Perintah salah. Masukkan teks yang ingin dijadikan stiker.\n\nContoh: *${PREFIX}brat Halo Dunia*`);
                return;
            }
            if (API_KEY === 'GANTI_DENGAN_APIKEY_ANDA') { 
                await sendText(sock, senderJid, `❌ API Key belum diatur. Harap hubungi Admin untuk mengatur API Key di dalam file skrip.`);
                return;
            }
            await sendText(sock, senderJid, "⏳ Membuat stiker dari teks, mohon tunggu...");
            try {
                const apiUrl = `https.api.autoresbot.com/api/maker/brat?text=${encodeURIComponent(textToSticker)}&apikey=${API_KEY}`;
                const sticker = new Sticker(apiUrl, { pack: STICKER_PACK_NAME, author: STICKER_AUTHOR_NAME, type: StickerTypes.FULL, quality: 70 });
                const stickerMessage = await sticker.toMessage();
                await sock.sendMessage(senderJid, stickerMessage);
            } catch (e) {
                console.error('[!] Gagal membuat stiker BRAT:', e);
                await sendText(sock, senderJid, '❌ Gagal membuat stiker. Pastikan API Key Anda benar dan API sedang tidak bermasalah.');
            }
            return;
        }

        if (!isCmd) return;
        const command = text.slice(PREFIX.length).trim().toLowerCase().split(' ')[0];
        const args = text.split(' ').slice(1);
        const fullArgs = args.join(' ');

if (command === 'menu' || command === 'help') {
    const choice = args[0]?.toLowerCase();

    if (!choice) {
        const userToTagJid = msg.key.participant || senderJid;
        const greeting = getGreeting(); 
        const botModeText = botMode === 'public' ? "Public" : "Self";
        const customFeaturesCount = Object.keys(customResponses).length;
        const totalFeatures = builtInCommands.length + customFeaturesCount; 
        const dateTimeInfo = getFormattedDateTimeList();
        const menuImagePath = path.join(__dirname, 'img/menu.jpg'); 
       
        const menuText = ` Halo @${userToTagJid.split("@")[0]} 👋
 Selamat ${greeting}
 
Nama Bot : *${BOT_NAME}*
Mode Bot : *${botModeText}*
Versi Bot : *${BOT_VERSION}*
 
*MENU PANEL*
${PREFIX}addprem
${PREFIX}delprem
${PREFIX}listprem
${PREFIX}listpanel
${PREFIX}delpanel
${PREFIX}listuserpanel
${PREFIX}deluserpanel
${PREFIX}1gb user,nomor
${PREFIX}2gb user,nomor
${PREFIX}3gb user,nomor
${PREFIX}4gb user,nomor
${PREFIX}5gb user,nomor
${PREFIX}6gb user,nomor
${PREFIX}7gb user,nomor
${PREFIX}8gb user,nomor
${PREFIX}9gb user,nomor
${PREFIX}10gb user,nomor
${PREFIX}unli user,nomor
${PREFIX}batalbeli

*MENU STORE*
${PREFIX}addproduk
${PREFIX}addstok
${PREFIX}cekstok
${PREFIX}buy
${PREFIX}addrespon
${PREFIX}delrespon
${PREFIX}listrespon
${PREFIX}payment
${PREFIX}setqris
${PREFIX}setpayment
${PREFIX}done
${PREFIX}uptesti

*MENU JPM*
${PREFIX}jpm
${PREFIX}bljpm
${PREFIX}jpmpoll
${PREFIX}setimgjpm
${PREFIX}settimejpm
${PREFIX}setdelayjpm
${PREFIX}setpesan
${PREFIX}cekpesan
${PREFIX}jpmv1
${PREFIX}jpmv2

*MENU PUSHKONTAK*
${PREFIX}list
${PREFIX}save
${PREFIX}clear
${PREFIX}savegrub
${PREFIX}pushkontak
${PREFIX}setdelay
${PREFIX}checkdelay

*MENU GRUP*
${PREFIX}cekgrub
${PREFIX}kick
${PREFIX}promote
${PREFIX}demote
${PREFIX}hidetag
${PREFIX}antilink
${PREFIX}antitagsw
${PREFIX}setantitagsw
${PREFIX}welcome
${PREFIX}left
${PREFIX}setwelcome
${PREFIX}setleft
${PREFIX}welcomeall
${PREFIX}leftall
${PREFIX}antilinkall
${PREFIX}open
${PREFIX}close
${PREFIX}totalchat
${PREFIX}tagall
${PREFIX}totag
${PREFIX}setnamegc
${PREFIX}setdeskgc
${PREFIX}antilongtext
${PREFIX}antilongtextall
${PREFIX}kudetagrup
${PREFIX}joingc
${PREFIX}antikata
${PREFIX}setkata
${PREFIX}antipoll

*MENU OWNER*
${PREFIX}public
${PREFIX}self
${PREFIX}enc
${PREFIX}backup
${PREFIX}restart
${PREFIX}ceksetgc
${PREFIX}boost
${PREFIX}idch

*MENU MAKER*
${PREFIX}ttp
${PREFIX}sticker
${PREFIX}brat
${PREFIX}ssweb

*MENU MOBILE LEGENDS*
${PREFIX}addvip
${PREFIX}minvip
${PREFIX}listvip

*MENU BOT*
${PREFIX}autoread
${PREFIX}autoreadsw
${PREFIX}anticall
${PREFIX}autotyping
${PREFIX}autorecording
${PREFIX}ceksetbot

*MENU LAINNYA*
${PREFIX}owner
${PREFIX}rvo
${PREFIX}savebot
${PREFIX}ping
${PREFIX}tourl
${PREFIX}ai`;
        await sock.sendMessage(senderJid, {
            text: menuText,
            contextInfo: {
                isForwarded: true, 
                mentionedJid: [userToTagJid, adminJid], 
                forwardedNewsletterMessageInfo: {
                    newsletterJid: global.idsaluran,
                    newsletterName: global.namasaluran
                }, 
                externalAdReply: {
                    title: `© ${BOT_NAME} - ${BOT_VERSION}`, 
                    body: `Created by WARUNGERIK`, 
                    thumbnail: fs.readFileSync(menuImagePath),
                    renderLargerThumbnail: true,
                    sourceUrl: global.linksaluran,
                    mediaType: 1
                }
            }
        }, { quoted: null });

    return;
    }
}
        if (command === 'owner') {
            const userToTagJid = msg.key.participant || senderJid;
            const introText = `Halo @${userToTagJid.split('@')[0]}.\nIni adalah kontak owner saya!`;
            await sendText(sock, senderJid, introText, [userToTagJid]);
            await sendOwnerVCard(sock, senderJid);
            return;
        }
		if (command === 'ht' || command === 'hidetag') {
    if (!isGroup) {
        return await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
    }
    if (!fullArgs) {
        return await sendText(sock, senderJid, `❌ Teks untuk hidetag tidak boleh kosong.\n\nContoh:\n${PREFIX}hidetag Ada pengumuman penting!`);
    }
    try {
        const metadata = await sock.groupMetadata(senderJid);
        const participants = metadata.participants.map(p => p.id);
        await sendText(sock, senderJid, fullArgs, participants);
        console.log(`[HIDETAG] Berhasil mengirim hidetag ke grup ${senderJid}`);
    } catch (e) {
        console.error(`[!] Error pada fitur hidetag:`, e);
        await sendText(sock, senderJid, '❌ Gagal mengirim hidetag. Pastikan bot adalah admin di grup ini.');
    }
    return;
}
        if (command === 'antikata') {
            if (!isGroup) {
                return await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
            }
            try {
                const groupMetadata = await sock.groupMetadata(senderJid);
                const senderParticipant = groupMetadata.participants.find(p => p.id === msg.key.participant);
                const isSenderGroupAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin');

                if (!isAdminSender && !isSenderGroupAdmin) {
                    return await sendText(sock, senderJid, '⛔ Maaf, perintah ini hanya untuk Admin Grup atau Owner Bot.');
                }

                const subCmd = args[0]?.toLowerCase();
                if (subCmd === 'on') {
                    if (!antikataEnabledGroups.includes(senderJid)) {
                        antikataEnabledGroups.push(senderJid);
                        saveAntikataGroups();
                        await sendText(sock, senderJid, `✅ Fitur Anti-Kata Terlarang berhasil *DIAKTIFKAN*.`);
                    } else {
                        await sendText(sock, senderJid, 'ℹ️ Fitur Anti-Kata Terlarang sudah aktif di grup ini.');
                    }
                } else if (subCmd === 'off') {
                    if (antikataEnabledGroups.includes(senderJid)) {
                        antikataEnabledGroups = antikataEnabledGroups.filter(id => id !== senderJid);
                        saveAntikataGroups();
                        await sendText(sock, senderJid, '✅ Fitur Anti-Kata Terlarang berhasil *DINONAKTIFKAN*.');
                    } else {
                        await sendText(sock, senderJid, 'ℹ️ Fitur Anti-Kata Terlarang memang tidak aktif di grup ini.');
                    }
                } else {
                    const status = antikataEnabledGroups.includes(senderJid) ? 'AKTIF' : 'NONAKTIF';
                    await sendText(sock, senderJid, `Status Anti-Kata Terlarang: *${status}*\n\nGunakan: \`${PREFIX}antikata on/off\``);
                }
            } catch (e) {
                console.error('[!] Error pada fitur antikata:', e);
                await sendText(sock, senderJid, '❌ Terjadi kesalahan saat memproses perintah antikata.');
            }
            return; // <-- Penting untuk menghentikan eksekusi
        }
if (command === 'antikataall') {
            if (!isAdminSender) {
                return await sendText(sock, senderJid, `⛔ Maaf, perintah ini hanya untuk Owner Bot.`);
            }

            const subCmd = args[0]?.toLowerCase();
            if (subCmd === 'on') {
                try {
                    await sendText(sock, senderJid, `⏳ Mengaktifkan Fitur Anti-Kata untuk semua grup...`);
                    const allGroups = await sock.groupFetchAllParticipating();
                    const groupIds = Object.keys(allGroups);
                   
                    antikataEnabledGroups = groupIds;
                    saveAntikataGroups();
                    await sendText(sock, senderJid, `✅ Fitur Anti-Kata berhasil *DIAKTIFKAN* untuk ${groupIds.length} grup.`);
                } catch (e) {
                    console.error(`[!] Gagal mengaktifkan Anti-Kata untuk semua grup:`, e);
                    await sendText(sock, senderJid, '❌ Terjadi kesalahan saat mengambil daftar grup.');
                }
            } else if (subCmd === 'off') {
                antikataEnabledGroups = [];
                saveAntikataGroups();
                await sendText(sock, senderJid, `✅ Fitur Anti-Kata berhasil *DINONAKTIFKAN* untuk semua grup.`);
            } else {
                await sendText(sock, senderJid, `❌ *Format Salah*\nGunakan: \`${PREFIX}antikataall on\` atau \`${PREFIX}antikataall off\``);
            }
            return;
        }
if (command === 'setkata') {
            if (!isAdminSender) {
                return await sendText(sock, senderJid, `⛔ Maaf, perintah .setkata hanya untuk Owner Bot.`);
            }

            const subCmd = args[0]?.toLowerCase();
            const word = args.slice(1).join(' ').toLowerCase();

            if (!subCmd || (subCmd !== 'add' && subCmd !== 'del' && subCmd !== 'list' && subCmd !== 'clear')) {
                return await sendText(sock, senderJid, `❌ *Format Salah*\n\nGunakan:\n- \`${PREFIX}setkata add <kata>\`\n- \`${PREFIX}setkata del <kata>\`\n- \`${PREFIX}setkata list\`\n- \`${PREFIX}setkata clear\``);
            }

            if (subCmd === 'add') {
                if (!word) {
                    await sendText(sock, senderJid, '❌ Kata yang akan ditambahkan tidak boleh kosong.');
                } else if (kataTerlarangList.includes(word)) {
                    await sendText(sock, senderJid, `ℹ️ Kata "${word}" sudah ada dalam daftar.`);
                } else {
                    kataTerlarangList.push(word);
                    saveKataTerlarang();
                    await sendText(sock, senderJid, `✅ Kata "${word}" berhasil ditambahkan ke daftar kata terlarang.`);
                }
            } else if (subCmd === 'del') {
                if (!word) {
                    await sendText(sock, senderJid, '❌ Kata yang akan dihapus tidak boleh kosong.');
                } else {
                    const index = kataTerlarangList.indexOf(word);
                    if (index > -1) {
                        kataTerlarangList.splice(index, 1);
                        saveKataTerlarang();
                        await sendText(sock, senderJid, `✅ Kata "${word}" berhasil dihapus dari daftar.`);
                    } else {
                        await sendText(sock, senderJid, `❌ Kata "${word}" tidak ditemukan dalam daftar.`);
                    }
                }
            } else if (subCmd === 'list') {
                if (kataTerlarangList.length === 0) {
                    await sendText(sock, senderJid, 'ℹ️ Daftar kata terlarang saat ini kosong.');
                } else {
                    await sendText(sock, senderJid, `🚫 *Daftar Kata Terlarang:*\n\n- ${kataTerlarangList.join('\n- ')}`);
                }
            } else if (subCmd === 'clear') {
                kataTerlarangList = [];
                saveKataTerlarang();
                await sendText(sock, senderJid, `✅ Semua kata terlarang berhasil dihapus.`);
            }
            return;
        }
if (command === 'totalchat') {
    if (!isGroup) {
        return await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
    }

    try {
        const groupMetadata = await sock.groupMetadata(senderJid);
        const currentParticipantIds = new Set(groupMetadata.participants.map(p => p.id));
        const groupChatData = chatCounts[senderJid] || {};

        let activeChatters = [];
        for (const userId in groupChatData) {
            if (groupChatData[userId] > 0 && currentParticipantIds.has(userId)) {
                activeChatters.push({
                    id: userId,
                    chatCount: groupChatData[userId]
                });
            }
        }

        if (activeChatters.length === 0) {
            return await sendText(sock, senderJid, 'ℹ️ Belum ada aktivitas chat yang tercatat dari anggota yang masih ada di grup ini.');
        }

        activeChatters.sort((a, b) => b.chatCount - a.chatCount);

        const totalGroupChats = Object.values(groupChatData).reduce((sum, count) => sum + count, 0);

        let responseText = `💬 *Aktivitas Chat Grup*\n\nBerikut adalah peringkat anggota berdasarkan jumlah chat:\n\n`;
        let mentions = [];

        activeChatters.forEach((member, index) => {
            responseText += `${index + 1}. @${member.id.split('@')[0]} : ${member.chatCount} pesan\n`;
            mentions.push(member.id);
        });

        responseText += `\n\nTotal semua pesan yang tercatat di grup: *${totalGroupChats} pesan*`;

        await sendText(sock, senderJid, responseText, mentions);

    } catch (e) {
        console.error('[!] Error pada fitur totalchat:', e);
        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat memproses perintah totalchat.');
    }
    return;
}

if (command === 'tagall') {
    if (!isGroup) {
        return await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
    }

    try {
        const groupMetadata = await sock.groupMetadata(senderJid);
        const participants = groupMetadata.participants;
        const messageContent = fullArgs.trim() || 'Panggilan kepada semua anggota.';

        let tagallText = `══✪〘 *👥 Panggilan Grup* 〙✪══\n➲ *Pesan:* ${messageContent}\n\n`;
        const mentions = [];

        participants.forEach(member => {
            tagallText += `⭔ @${member.id.split('@')[0]}\n`;
            mentions.push(member.id);
        });

        await sock.sendMessage(
            senderJid,
            { text: tagallText.trim(), mentions: mentions },
            { quoted: msg }
        );

    } catch (e) {
        console.error('[!] Error pada fitur tagall:', e);
        await sendText(sock, senderJid, '❌ Gagal melakukan tagall. Terjadi kesalahan pada server.');
    }
    return;
}

if (command === 'totag') {
    // Pastikan perintah digunakan di dalam grup
    if (!isGroup) {
        return await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
    }

    // Cek apakah pengguna me-reply sebuah pesan
    const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
    const quotedMessage = quotedInfo?.quotedMessage;

    if (!quotedMessage) {
        return await sendText(sock, senderJid, '❌ Perintah salah. Anda harus membalas (reply) sebuah pesan untuk menggunakan perintah ini.');
    }

    try {
        // Ambil teks dari pesan yang di-reply (mendukung teks biasa, caption gambar/video)
        const originalMessageText = quotedMessage.conversation ||
                                      quotedMessage.extendedTextMessage?.text ||
                                      quotedMessage.imageMessage?.caption ||
                                      quotedMessage.videoMessage?.caption ||
                                      '';

        // Ambil semua metadata dan anggota grup
        const metadata = await sock.groupMetadata(senderJid);
        const participants = metadata.participants;
        const mentions = participants.map(p => p.id); // Buat array berisi JID semua anggota

        // Siapkan teks mention (@user1 @user2 ...)
        let tagText = '';
        for (const jid of mentions) {
            tagText += `@${jid.split('@')[0]} `;
        }
       
        const messageWithTags = originalMessageText 
            ? `pesan yang diteruskan:\n*${originalMessageText}*\n\n${tagText.trim()}`
            : tagText.trim(); 

        await sock.sendMessage(senderJid, {
            text: messageWithTags,
            mentions: mentions 
        });

    } catch (e) {
        console.error('[!] Error pada fitur totag (versi baru):', e);
        await sendText(sock, senderJid, '❌ Gagal melakukan tag. Pastikan bot adalah anggota grup.');
    }
    return;
}

            if (command === 'cekproduk' || command === 'cekstok') {
                if (products.length === 0) {
                    return await sendText(sock, senderJid, 'ℹ️ Belum ada produk yang tersedia saat ini.');
                }

                let productListMessage = '📦 *Daftar Produk & Stok Tersedia*\n\n';
                products.forEach((product, index) => {
                    const stockCount = product.items.length;
                    const stockStatus = stockCount > 0 ? `*Tersedia (${stockCount})*` : '*Habis*';
                    productListMessage += `*${index + 1}. ${func.capital(product.name)}*\n` +
                                          `   - Stok: ${stockStatus}\n` +
                                          `   - Harga: Rp${func.toRupiah(product.price)}\n\n`;
                });
               
                productListMessage += `Gunakan *.buy <nama_produk>* untuk membeli.`;

                await sendText(sock, senderJid, productListMessage.trim());
                return;
            }

            if (command === 'buy') {
                if (isGroup) {
                    return await sendText(sock, senderJid, "❌ Pembelian hanya bisa dilakukan melalui chat pribadi (PC) ke bot.");
                }
                if (transactions[senderJid]) {
                    return await sendText(sock, senderJid, `⚠️ Anda masih memiliki transaksi yang belum selesai.\nKetik *.batalbeli* untuk membatalkan transaksi sebelumnya.`);
                }

                const productName = args[0]?.toLowerCase();
                if (!productName) {
                    return await sendText(sock, senderJid, `❌ *Format Salah*\n\nGunakan: \`${PREFIX}buy <nama_produk>\`\nContoh: \`${PREFIX}buy netflix\`\n\nKetik *.cekstok* untuk melihat daftar produk.`);
                }

                const productIndex = products.findIndex(p => p.name === productName);
                if (productIndex === -1) {
                    return await sendText(sock, senderJid, `❌ Produk "${productName}" tidak ditemukan.`);
                }
               
                const product = products[productIndex];
                if (product.items.length === 0) {
                    return await sendText(sock, senderJid, `🙏 Maaf, stok untuk produk *${productName}* sedang habis. Silakan kembali lagi nanti.`);
                }
               
                const amount = Number(product.price) + func.generateRandomNumber(110, 250);

                try {
                    await sendText(sock, senderJid, '⏳ Sedang membuat QR Code pembayaran, mohon tunggu...');
                    const get = await axios.get(`https://api-simplebot.vercel.app/orderkuota/createpayment?apikey=${global.ApikeyRestApi}&amount=${amount}&codeqr=${global.QrisOrderKuota}`);

                    if (!get.data || !get.data.result || !get.data.result.idtransaksi) {
                        throw new Error('Respon API createpayment tidak valid.');
                    }

                    const paymentInfoText = `*── DETAIL PEMBELIAN ──*\n \n*• ID Transaksi :* WARUNGERIK\n*• Produk :* ${func.capital(product.name)}\n*• Total Bayar :* Rp${func.toRupiah(get.data.result.jumlah)}\n*• Expired Dalam :* 5 Menit\n\n*Note :* \n_Scan QRIS di atas dan pastikan nominal transfer sesuai._\n\nKetik *.batalbeli* untuk membatalkan.`;
                   
                    let msgQr = await sock.sendMessage(senderJid, {
                        image: { url: get.data.result.imageqris.url },
                        caption: paymentInfoText,
                    });

                    transactions[senderJid] = {
                        productName: product.name, // Menyimpan nama produk yang dibeli
                        msg: msgQr, chat: senderJid, idDeposit: get.data.result.idtransaksi,
                        amount: get.data.result.jumlah.toString(), status: true,
                        exp: setTimeout(async () => {
                            if (transactions[senderJid] && transactions[senderJid].status) {
                                await sendText(sock, transactions[senderJid].chat, "Waktu pembayaran telah habis (expired).", { quoted: transactions[senderJid].msg });
                                await sock.sendMessage(transactions[senderJid].chat, { delete: transactions[senderJid].msg.key });
                                delete transactions[senderJid];
                            }
                        }, 300000) // 5 menit
                    };

                    while (transactions[senderJid] && transactions[senderJid].status) {
                        await func.sleep(8000);
                        try {
                            const resultcek = await axios.get(`https://api-simplebot.vercel.app/orderkuota/cekstatus?apikey=${global.ApikeyRestApi}&merchant=${global.IdMerchant}&keyorkut=${global.ApikeyOrderKuota}`);
                            const req = resultcek.data;

                            if (transactions[senderJid] && req?.result?.amount == transactions[senderJid].amount) {
                                transactions[senderJid].status = false;
                                clearTimeout(transactions[senderJid].exp);
                               
                                await sendText(sock, senderJid, `*PEMBAYARAN BERHASIL ✅*\n\nTerima kasih! Pesanan Anda sedang diproses...`);
                               
                                // --- LOGIKA PENGIRIMAN STOK ---
                                const pIndex = products.findIndex(p => p.name === transactions[senderJid].productName);
                                if (pIndex !== -1 && products[pIndex].items.length > 0) {
                                    const itemToSend = products[pIndex].items.shift(); // Ambil & hapus item pertama dari stok
                                    saveProducts(); // Simpan perubahan stok

                                    const deliveryMessage = `🎉 *Pesanan Anda, ${func.capital(transactions[senderJid].productName)}:*\n\n\`\`\`${itemToSend}\`\`\`\n\nHarap segera amankan akun dan jangan bagikan data ini kepada siapa pun. Terima kasih!`;
                                    await sendText(sock, senderJid, deliveryMessage);
                                } else {
                                    await sendText(sock, senderJid, '❌ Terjadi kesalahan internal. Stok tidak ditemukan setelah pembayaran. Harap hubungi admin dengan screenshot chat ini.');
                                }
                                // --- AKHIR LOGIKA PENGIRIMAN ---

                                delete transactions[senderJid]; // Selesaikan transaksi
                                break; // Keluar dari loop pengecekan
                            }
                        } catch (checkError) {
                            console.error('[!] Gagal mengecek status pembayaran:', checkError.message);
                        }
                    }
                } catch (err) {
                    console.error("Terjadi kesalahan saat proses pembelian:", err);
                    await sendText(sock, senderJid, "Gagal memproses pembelian. Layanan pembayaran mungkin sedang gangguan. Silakan hubungi admin.");
                    if(transactions[senderJid]) delete transactions[senderJid];
                }
                return; // Penting
            }
        if (command === 'tourl') {
            try {
                let messageToDownload = msg;
                let mediaContent = msg.message;
                const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
                if (quotedInfo && quotedInfo.quotedMessage) {
                    mediaContent = quotedInfo.quotedMessage;
                    messageToDownload = {
                        key: { remoteJid: msg.key.remoteJid, id: quotedInfo.stanzaId, participant: quotedInfo.participant },
                        message: mediaContent
                    };
                }

                const mediaType = Object.keys(mediaContent)[0];
                const supportedTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'];
                if (!supportedTypes.includes(mediaType)) {
                    return await sendText(sock, senderJid, `❌ *Perintah Salah*\n\nKirim atau balas media (foto, video, stiker, audio, dokumen) dengan caption *${PREFIX}tourl2*`);
                }

                await sendText(sock, senderJid, "⏳ Mengunggah media ke Catbox, mohon tunggu...");

                const buffer = await downloadMediaMessage(
                    messageToDownload,
                    'buffer', {}, { logger: pino({ level: 'silent' }) }
                );

                const mimeType = mediaContent[mediaType]?.mimetype || 'application/octet-stream';
                const extension = mime.extension(mimeType) || 'bin';
                const tempFilePath = path.join(os.tmpdir(), `${msg.key.id}.${extension}`);
               
                fs.writeFileSync(tempFilePath, buffer);

                const resultUrl = await uploadToCatbox(tempFilePath);

                await sendText(sock, senderJid, `✅ *Upload Sukses!*\n\n*Link:* ${resultUrl}`);

                fs.unlinkSync(tempFilePath);

            } catch (error) {
                console.error('[!] Error pada fitur tourl2:', error);
                await sendText(sock, senderJid, `❌ Gagal mengunggah media. Terjadi kesalahan: ${error.message}`);
            }
            return;
        }

if (command === 'savebot') {
    const botNumber = sock.user.id.split(':')[0];
    const botVCard = `BEGIN:VCARD\nVERSION:3.0\nFN:${BOT_NAME}\nORG:${OWNER_ORGANIZATION}\nTEL;TYPE=CELL;waid=${botNumber}:${botNumber}.\nEND:VCARD`;
   
    await sock.sendMessage(senderJid, {
        contacts: {
            displayName: BOT_NAME,
            contacts: [{ vcard: botVCard }]
        }
    });
    await sendText(sock, senderJid, `👆 Klik chat di atas untuk menyimpan kontak *${BOT_NAME}* secara otomatis.`);
    return;
}
        if (command === 'payment') {
            if (!fs.existsSync(PAYMENT_IMAGE_PATH)) {
                await sendText(sock, senderJid, "Mohon maaf, gambar pembayaran belum diatur oleh admin.");
                console.log(`[!] Perintah .payment gagal: file ${PAYMENT_IMAGE_PATH} tidak ditemukan.`);
                return;
            }
            await sendImageWithText(sock, senderJid, PAYMENT_IMAGE_PATH, paymentMessage);
            return;
        }

        if (command === 'ping' || command === 'cekvps') {
            const specs = await getVPSSpecs();
            const uptime = getUptime();
            await sendText(sock, senderJid, `*Waktu Aktif VPS:*\n${uptime}\n\n${specs}`);
            return;
        }
        if (command === 'rvo') {
            const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
            if (!quotedInfo || !quotedInfo.stanzaId) {
                await sendText(sock, senderJid, '❌ Perintah salah. Anda harus membalas (reply) pesan "Sekali Lihat" untuk menggunakan perintah ini.');
                return;
            }
            const quotedId = quotedInfo.stanzaId;
            console.log(`[RVO CMD] User ${senderNumber} meminta RVO untuk ID: ${quotedId}`);
            const cachedViewOnceMessage = viewOnceCache.get(quotedId);
            if (cachedViewOnceMessage) {
                try {
                    await sendText(sock, senderJid, '⏳ Media ditemukan di cache bot, sedang memproses...');
                    const type = Object.keys(cachedViewOnceMessage)[0];
                    const originalCaption = cachedViewOnceMessage[type]?.caption || '';
                    const buffer = await downloadMediaMessage({ key: { id: quotedId }, message: cachedViewOnceMessage }, 'buffer', {}, { logger: pino({ level: 'silent' }) });
                    if (type === 'imageMessage') {
                        await sock.sendMessage(senderJid, { image: buffer, caption: originalCaption });
                    } else if (type === 'videoMessage') {
                        await sock.sendMessage(senderJid, { video: buffer, caption: originalCaption });
                    }
                } catch (e) {
                    console.error('[!] Gagal memproses .rvo dari cache:', e);
                }
            } else {
                console.log(`[RVO CACHE MISS] ID ${quotedId} tidak ditemukan. Cache keys:`, Array.from(viewOnceCache.keys()));
                try {
                    const quotedMsg = quotedInfo.quotedMessage;
                    if (quotedMsg && (quotedMsg.viewOnceMessageV2 || quotedMsg.viewOnceMessageV2Extension || quotedMsg.viewOnceMessage)) {
                        const voMessage = quotedMsg.viewOnceMessageV2 || quotedMsg.viewOnceMessageV2Extension || quotedMsg.viewOnceMessage;
                        const type = Object.keys(voMessage.message)[0];
                        const originalCaption = voMessage.message[type]?.caption || '';
                        const mediaMessage = { key: { remoteJid: senderJid, id: quotedId, participant: quotedInfo.participant }, message: voMessage.message };
                        const buffer = await downloadMediaMessage(mediaMessage, 'buffer', {}, { logger: pino({ level: 'silent' }) });
                        if (type === 'imageMessage') {
                            await sock.sendMessage(senderJid, { image: buffer, caption: originalCaption });
                        } else if (type === 'videoMessage') {
                            await sock.sendMessage(senderJid, { video: buffer, caption: originalCaption });
                        }
                    } else {
                        await sendText(sock, senderJid, '❌ Gagal. Metode cadangan juga tidak berhasil menemukan media "Sekali Lihat".');
                    }
                } catch(e) {
                    console.error('[!] Gagal pada metode cadangan RVO:', e);
                    await sendText(sock, senderJid, '❌ Gagal. Metode cadangan juga tidak berhasil. Media kemungkinan besar sudah dibuka atau kedaluwarsa.');
                }
            }
            return;
        }
        const panelCommands = ["1gb", "2gb", "3gb", "4gb", "5gb", "6gb", "7gb", "8gb", "9gb", "10gb", "unli"];
        if (panelCommands.includes(command)) {
            if (isAdminSender || isPremiumSender) {
                const t = fullArgs.split(',');
                if (t.length < 2) {
                    return await sendText(sock, senderJid, `*Format salah!*\nPenggunaan: ${PREFIX}${command} username,nomor\nContoh: ${PREFIX}${command} erik,628123456789`);
                }
                const username = t[0].trim().toLowerCase();
                const number = t[1].replace(/\D/g, '');
                if (!username || !number) {
                    return await sendText(sock, senderJid, `*Format salah!*\nUsername atau nomor tidak boleh kosong.`);
                }
                let resources = {};
                switch(command) {
                    case "1gb": resources = { ram: 1024, disk: 1024, cpu: 30 }; break;
                    case "2gb": resources = { ram: 2048, disk: 2048, cpu: 50 }; break;
                    case "3gb": resources = { ram: 3072, disk: 3072, cpu: 70 }; break;
                    case "4gb": resources = { ram: 4096, disk: 4096, cpu: 90 }; break;
                    case "5gb": resources = { ram: 5120, disk: 5120, cpu: 110 }; break;
                    case "6gb": resources = { ram: 6144, disk: 6144, cpu: 130 }; break;
                    case "7gb": resources = { ram: 7168, disk: 7168, cpu: 150 }; break;
                    case "8gb": resources = { ram: 8192, disk: 8192, cpu: 170 }; break;
                    case "9gb": resources = { ram: 9216, disk: 9216, cpu: 190 }; break;
                    case "10gb": resources = { ram: 10240, disk: 10240, cpu: 210 }; break;
                    case "unli": resources = { ram: 0, disk: 0, cpu: 0 }; break;
                }
                await createPanelUserAndServer(sock, senderJid, username, number, resources);
                return;
            } else {
                await sendText(sock, senderJid, `⛔ Maaf, perintah *${PREFIX}${command}* hanya untuk pengguna Premium. Hubungi Admin untuk upgrade.`);
                return;
            }
        }
       
        if (isAdminSender) {
            switch (command) {
                case 'addprem': {
                    let targetJid;
                    const repliedUser = msg.message.extendedTextMessage?.contextInfo?.participant;
                    const textNumber = args[0] ? args[0].replace(/[^0-9]/g, "") : null;
                    if (repliedUser) {
                        targetJid = repliedUser;
                    } else if (textNumber) {
                        targetJid = `${textNumber}@s.whatsapp.net`;
                    } else {
                        return await sendText(sock, senderJid, `❌ *Format Salah*\nBalas pesan user atau ketik nomornya.\n\nContoh:\n1. (Balas pesan) ${PREFIX}addprem\n2. ${PREFIX}addprem 62812...`);
                    }
                    const targetNumber = targetJid.split('@')[0];
                    if (targetJid === `${ADMIN_NUMBER}@s.whatsapp.net` || premiumUsers.includes(targetJid)) {
                        return await sendText(sock, senderJid, `ℹ️ Nomor ${targetNumber} sudah menjadi Premium.`);
                    }
                    premiumUsers.push(targetJid);
                    savePremiumUsers();
                    await sendText(sock, senderJid, `✅ *Sukses!*\nNomor *${targetNumber}* berhasil ditambahkan sebagai pengguna Premium.`);
                    await sendText(sock, targetJid, `🎉 Selamat! Akun Anda telah di-upgrade ke Premium oleh Admin.`);
                    break;
                }
// GANTI SELURUH BLOK CASE 'antipoll' ANDA DENGAN VERSI INI
case 'antipoll': {
    try {
        const { id: targetGroupId, args: remainingArgs } = getTargetInfo(args, senderJid, isGroup);

        if (!targetGroupId) {
            return await sendText(sock, senderJid, `❌ Perintah tidak lengkap.\n\nGunakan di dalam grup atau sertakan ID grup dari PC.\nContoh (di grup): \`.antipoll on\`\nContoh (dari PC): \`.antipoll 123@g.us on\``);
        }

        // --- BLOK PERBAIKAN ---
        let isUserAuthorized = isAdminSender; // Bot owner selalu diizinkan
        if (isGroup) {
            const groupMetadata = await sock.groupMetadata(senderJid);
            const senderParticipant = groupMetadata.participants.find(p => p.id === msg.key.participant);
            const isSenderGroupAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin');
            if (isSenderGroupAdmin) {
                isUserAuthorized = true; // Admin grup juga diizinkan
            }
        }

        if (!isUserAuthorized) {
            return await sendText(sock, senderJid, '⛔ Maaf, perintah ini hanya untuk Admin Grup atau Owner Bot.');
        }
        // --- AKHIR BLOK PERBAIKAN ---
        
        const subCmd = remainingArgs[0]?.toLowerCase();
        const groupMetadata = await sock.groupMetadata(targetGroupId);

        if (subCmd === 'on') {
            if (!antipollEnabledGroups.includes(targetGroupId)) {
                antipollEnabledGroups.push(targetGroupId);
                saveAntipollGroups();
                await sendText(sock, senderJid, `✅ Fitur Anti-Polling berhasil *DIAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
            } else {
                await sendText(sock, senderJid, `ℹ️ Fitur Anti-Polling sudah aktif di grup *${groupMetadata.subject}*.`);
            }
        } else if (subCmd === 'off') {
            if (antipollEnabledGroups.includes(targetGroupId)) {
                antipollEnabledGroups = antipollEnabledGroups.filter(id => id !== targetGroupId);
                saveAntipollGroups();
                await sendText(sock, senderJid, `✅ Fitur Anti-Polling berhasil *DINONAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
            } else {
                await sendText(sock, senderJid, `ℹ️ Fitur Anti-Polling memang tidak aktif di grup *${groupMetadata.subject}*.`);
            }
        } else {
            const status = antipollEnabledGroups.includes(targetGroupId) ? 'AKTIF' : 'NONAKTIF';
            await sendText(sock, senderJid, `Status Anti-Polling untuk grup *${groupMetadata.subject}*: *${status}*`);
        }

    } catch (e) {
        console.error('[!] Error pada fitur antipoll:', e);
        await sendText(sock, senderJid, '❌ Terjadi kesalahan. Pastikan ID Grup valid dan bot adalah anggota dari grup tersebut.');
    }
    return;
}
                case 'cekidch':
                case 'idch': {
                    if (!fullArgs || !fullArgs.includes("whatsapp.com/channel")) {
                        await sendText(sock, senderJid, `❌ *Perintah Salah*\n\nMasukkan link channel WhatsApp yang valid.\nContoh: *${PREFIX}idch https://whatsapp.com/channel/0029VaC1fJ7GZ_j2gM...*`);
                        break;
                    }
                    try {
                        const channelCode = fullArgs.split('https://whatsapp.com/channel/')[1];
                        await sendText(sock, senderJid, '⏳ Mencari channel...');
                        const metadata = await sock.newsletterMetadata("invite", channelCode.trim());
                        const responseText = `✅ *Channel Found!*\n\n` +
                                             `*Nama:* ${metadata.name}\n` +
                                             `*ID:* \`${metadata.id}\`\n` +
                                             `*Pengikut:* ${metadata.subscribers}`;
                        await sendText(sock, senderJid, responseText);
                    } catch (e) {
                        console.error('[!] Error pada fitur cekidch:', e);
                        await sendText(sock, senderJid, '❌ Gagal mendapatkan data channel. Pastikan link valid dan bot dapat mengaksesnya.');
                    }
                    break;
                }
                case 'listpanel': {
                    await listPanelServers(sock, senderJid);
                    break;
                }
                case 'delpanel': {
                    const serverId = args[0];
                    await deletePanelServer(sock, senderJid, serverId);
                    break;
                }
				case 'listuserpanel': {
                    await listPanelUsers(sock, senderJid);
                    break;
                }
                case 'deluserpanel': {
                    const userId = args[0];
                    await deletePanelUser(sock, senderJid, userId);
                    break;
                }
    case "bljpm":
    case "blgcjpm": {
        if (!isGroup) {
            await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
            break;
        }
        const action = args[0]?.toLowerCase();
        if (action !== 'on' && action !== 'off') {
            await sendText(sock, senderJid, '❌ Format salah. Gunakan `.bljpm on` atau `.bljpm off`');
            break;
        }

        if (action === 'on') {
            if (jpmBlacklist.includes(senderJid)) {
                await sendText(sock, senderJid, 'ℹ️ Grup ini sudah ada dalam daftar blacklist JPM.');
            } else {
                jpmBlacklist.push(senderJid);
                saveJpmBlacklist();
                await sendText(sock, senderJid, '✅ Berhasil menambahkan grup ini ke dalam blacklist JPM.');
            }
        } else if (action === 'off') {
            const index = jpmBlacklist.indexOf(senderJid);
            if (index > -1) {
                jpmBlacklist.splice(index, 1);
                saveJpmBlacklist();
                await sendText(sock, senderJid, '✅ Berhasil menghapus grup ini dari blacklist JPM.');
            } else {
                await sendText(sock, senderJid, 'ℹ️ Grup ini tidak ada dalam daftar blacklist JPM.');
            }
        }
        break;
    }
    case "jpmv2": {
        if (!msg.message.imageMessage || !fullArgs) {
            await sendText(sock, senderJid, `❌ *Format Salah!*\n\nKirim gambar, lalu pada caption/keterangan gambar, ketik:\n.jpmv2 teksnya`);
            break;
        }

        await sendText(sock, senderJid, `⏳ Memproses JPM`);

        try {
            const imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: pino({ level: 'silent' }) });
            const allGroups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(allGroups);
            let successCount = 0;
            const captionText = fullArgs;
            try {
                 await sock.sendMessage(global.idsaluran, {
                    image: imageBuffer,
                    caption: captionText
                });
            } catch(e) {
                console.error(`[!] Gagal mengirim${global.idsaluran}:`, e);
                await sendText(sock, senderJid, `⚠️ Gagal mengirim ke`);
            }
           
            await sendText(sock, senderJid, `Memulai jpm ke ${groupIds.length} grup...`);
            for (const groupId of groupIds) {
                 if (jpmBlacklist.includes(groupId)) continue; // <--- TAMBAHKAN BARIS INI
                 try {
                await sock.sendMessage(groupId, {
                    image: imageBuffer,
                    caption: captionText,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: global.idsaluran,
                            newsletterName: global.namasaluran,
                            serverMessageId: 1 
                        }
                    }
                });
                successCount++;
            } catch (err) {
                console.log(`Gagal mengirim ke grup ${groupId}: ${err.message}`);
            }
                await delay(4000); // Jeda 4 detik antar grup
            }

            await sendText(sock, senderJid, `✅ *JPM Selesai Dikirim*\n\nBerhasil terkirim ke ${successCount} grup.`);

        } catch (error) {
            console.error('[!] Error pada fitur JPM', error);
            await sendText(sock, senderJid, '❌ Terjadi kesalahan saat memproses JPM.');
        }
        break;
    }
               // FITUR BARU: JPM POLLING
case 'jpmpoll': {
    // Cek apakah ada teks setelah perintah
    if (!fullArgs) {
        return await sendText(sock, senderJid, `❌ *Format Salah!*\n\nGunakan format: \`${PREFIX}jpmpoll Pertanyaan Anda | Opsi 1 | Opsi 2 | ...\`\n\n*Contoh:*\n\`${PREFIX}jpmpoll Tim mana yang akan menang? | Indonesia | Malaysia\``);
    }

    // Pisahkan pertanyaan dan pilihan berdasarkan tanda '|'
    const pollParts = fullArgs.split('|').map(p => p.trim());
    
    // Pastikan ada pertanyaan dan minimal 2 pilihan
    if (pollParts.length < 3) { 
        return await sendText(sock, senderJid, '❌ *Input Tidak Lengkap!*\n\nPolling harus memiliki satu pertanyaan dan minimal dua pilihan. Pisahkan dengan tanda `|`.');
    }

    const pollQuestion = pollParts[0];
    const pollOptions = pollParts.slice(1);

    try {
        await sendText(sock, senderJid, "⏳ Mempersiapkan JPM Polling...");
        
        // Ambil semua grup dan filter yang ada di blacklist
        const allGroups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(allGroups).filter(id => !jpmBlacklist.includes(id));

        if (groupIds.length === 0) {
            return await sendText(sock, senderJid, 'ℹ️ Tidak ada grup target untuk JPM (semua grup ada di blacklist atau bot tidak ada di grup manapun).');
        }

        await sendText(sock, senderJid, `✅ Memulai JPM Polling ke *${groupIds.length}* grup.\n\n*Pertanyaan:* ${pollQuestion}`);

        let successCount = 0;
        
        // Siapkan pesan polling
        const pollMessage = {
            poll: {
                name: pollQuestion,
                values: pollOptions,
                selectableCount: 1 // Hanya bisa memilih 1 opsi
            }
        };

        // Looping untuk mengirim ke setiap grup
        for (const groupId of groupIds) {
            try {
                await sock.sendMessage(groupId, pollMessage);
                successCount++;
                console.log(`[JPM POLLING] Terkirim ke grup: ${allGroups[groupId]?.subject || groupId}`);
                // Gunakan jeda waktu yang sudah ada untuk keamanan
                await delay(jpmGroupDelaySeconds * 1000 + (Math.random() * 2000));
            } catch (err) {
                console.error(`[!] Gagal mengirim polling ke ${groupId}:`, err.message);
            }
        }

        await sendText(sock, senderJid, `📊 *JPM Polling Selesai!*\n\nBerhasil terkirim ke *${successCount}* dari *${groupIds.length}* grup.`);

    } catch (error) {
        console.error('[!] Error fatal pada fitur jpmpoll:', error);
        await sendText(sock, senderJid, `❌ Terjadi kesalahan saat memproses JPM Polling: ${error.message}`);
    }
    break;
}     
                case 'delprem': {
                    let targetJid;
                    const repliedUser = msg.message.extendedTextMessage?.contextInfo?.participant;
                    const textNumber = args[0] ? args[0].replace(/[^0-9]/g, "") : null;
                    if (repliedUser) {
                        targetJid = repliedUser;
                    } else if (textNumber) {
                        targetJid = `${textNumber}@s.whatsapp.net`;
                    } else {
                        return await sendText(sock, senderJid, `❌ *Format Salah*\nBalas pesan user atau ketik nomornya.\n\nContoh:\n1. (Balas pesan) ${PREFIX}delprem\n2. ${PREFIX}delprem 62812...`);
                    }
                    const userIndex = premiumUsers.indexOf(targetJid);
                    if (userIndex === -1) {
                        return await sendText(sock, senderJid, `ℹ️ Nomor ${targetJid.split('@')[0]} tidak ditemukan dalam daftar Premium.`);
                    }
                    premiumUsers.splice(userIndex, 1);
                    savePremiumUsers();
                    await sendText(sock, senderJid, `✅ *Sukses!*\nNomor *${targetJid.split('@')[0]}* berhasil dihapus dari daftar Premium.`);
                    break;
                }
                case 'listprem': {
                    if (premiumUsers.length === 0) {
                        return await sendText(sock, senderJid, 'ℹ️ Tidak ada pengguna Premium yang terdaftar.');
                    }
                    let responseText = `👑 *Daftar Pengguna Premium*\n\nTotal: ${premiumUsers.length} pengguna\n\n`;
                    premiumUsers.forEach((jid, index) => {
                        responseText += `${index + 1}. wa.me/${jid.split('@')[0]}\n`;
                    });
                    await sendText(sock, senderJid, responseText.trim());
                    break;
                }
                case 'boost': {
                    const memBefore = (process.memoryUsage().rss / 1024 / 1024);
                    await sendText(sock, senderJid, "🚀 *Boosting Server...*\nMencari dan membersihkan file sampah...");
                    const deletedFilesCount = await clearTempFiles();
                    await sendText(sock, senderJid, `🗑️ ${deletedFilesCount} file sampah ditemukan dan dihapus.\nSekarang mengoptimalkan memori...`);
                    let gcTriggered = false;
                    if (global.gc) {
                        global.gc();
                        gcTriggered = true;
                    }
                    await delay(1000); 
                    const memAfter = (process.memoryUsage().rss / 1024 / 1024);
                    const memFreed = memBefore - memAfter;
                    let response = `✅ *Boost Selesai!*\n\n` +
                                   `*File Dihapus:* ${deletedFilesCount} file\n` +
                                   `*Memori Digunakan:* ${memAfter.toFixed(2)} MB\n` +
                                   `*Memori Dilepaskan:* ${memFreed > 0 ? memFreed.toFixed(2) : '0.00'} MB\n\n`;
                    if (!gcTriggered) {
                        response += `🔄 Untuk pembersihan total dan memulai bot dari keadaan baru, gunakan perintah *${PREFIX}restart*.`;
                    }
                    await sendText(sock, senderJid, response);
                    break;
                }
case 'public': {
                    if (botMode === 'public') {
                        await sendText(sock, senderJid, 'ℹ️ Bot sudah dalam mode PUBLIK.');
                        break;
                    }
                    botMode = 'public';
                    await sendText(sock, senderJid, '✅ Bot sekarang dalam mode *PUBLIK*. Semua pengguna dapat menggunakan perintah.');
                    console.log(`[MODE] Bot diubah ke mode PUBLIK oleh admin.`);
                    break;
                }

                case 'self': {
                    if (botMode === 'self') {
                        await sendText(sock, senderJid, 'ℹ️ Bot sudah dalam mode SELF.');
                        break;
                    }
                    botMode = 'self';
                    await sendText(sock, senderJid, '🔒 Bot sekarang dalam mode *SELF*. Hanya owner yang dapat menggunakan perintah.');
                    console.log(`[MODE] Bot diubah ke mode SELF oleh admin.`);
                    break;
                }
               
                case 'addrespon': {
                    const quotedMessageInfo = msg.message.extendedTextMessage?.contextInfo;
                    const quotedMessage = quotedMessageInfo?.quotedMessage;

                    if (!quotedMessage || !quotedMessage.imageMessage) {
                        await sendText(sock, senderJid, `❌ *Perintah Salah*\n\nUntuk menambah respon, balas (reply) sebuah gambar, lalu ketik perintah di caption:\n\`${PREFIX}addrespon <nama_respon> <teks_caption>\``);
                        break;
                    }

                    const responseName = args[0]?.toLowerCase();
                    const responseCaption = args.slice(1).join(' ');

                    if (!responseName || !responseCaption) {
                        await sendText(sock, senderJid, `❌ *Format Salah*\n\nPastikan Anda menyertakan nama respon dan teks captionnya.\nContoh: \`${PREFIX}addrespon info Halo ini info penting\``);
                        break;
                    }
                   
                    const allCommands = ['allmenu', 'menu', 'help', 'owner', 'payment', 'cekvps', 'ping', 'rvo', 'boost', 'addrespon', 'delrespon', 'listrespon', 'enc', 'hidetag', 'ceksetgc', 'setpayment', 'done', 'jpm', 'setimgjpm', 'settimejpm', 'setdelayjpm', 'welcome', 'left', 'setwelcome', 'setleft', 'antilink', 'kick', 'setpesan', 'cekpesan', 'jpmv1', 'jpmv2', 'list', 'save', 'remove', 'clear', 'savegrub', 'pushkontak', 'setdelay', 'checkdelay', 'cekgrub', 'listgroups', 'restart', 'backup', 'sticker', 's',  'ttp', 'brat', 'public', 'self', 'ig', 'addvsbot'];
                    if (customResponses[responseName] || allCommands.includes(responseName)) {
                        await sendText(sock, senderJid, `❌ Nama respon \`${responseName}\` sudah digunakan oleh perintah lain. Silakan gunakan nama lain.`);
                        break;
                    }
                   
                    await sendText(sock, senderJid, "⏳ Menambahkan respon, mohon tunggu...");

                    try {
                        const buffer = await downloadMediaMessage(
                            { message: { imageMessage: quotedMessage.imageMessage }, key: msg.key },
                            'buffer', {}, { logger: pino({ level: 'silent' }) }
                        );
                       
                        const imageFileName = `${responseName.replace(/[^a-z0-9]/gi, '')}.jpg`;
                        const imagePath = path.join(CUSTOM_RESPONSES_IMG_DIR, imageFileName);
                       
                        fs.writeFileSync(imagePath, buffer);
                       
                        customResponses[responseName] = {
                            imagePath: imagePath,
                            caption: responseCaption
                        };
                        saveCustomResponses();
                       
                        await sendText(sock, senderJid, `✅ Respon berhasil ditambahkan!\n\nSekarang semua user bisa mengaksesnya dengan perintah: *${PREFIX}${responseName}*`);

                    } catch (e) {
                        console.error('[!] Gagal membuat respon kustom:', e);
                        await sendText(sock, senderJid, '❌ Gagal menyimpan respon. Terjadi kesalahan pada server.');
                    }
                    break;
                }
               
                case 'delrespon': {
                    const responseName = args[0]?.toLowerCase();
                    if (!responseName) {
                        await sendText(sock, senderJid, `❌ *Format Salah*\nGunakan: \`${PREFIX}delrespon <nama_respon>\``);
                        break;
                    }

                    if (!customResponses[responseName]) {
                        await sendText(sock, senderJid, `❌ Respon dengan nama \`${responseName}\` tidak ditemukan.`);
                        break;
                    }

                    try {
                        const imagePath = customResponses[responseName].imagePath;
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                        delete customResponses[responseName];
                        saveCustomResponses();
                        await sendText(sock, senderJid, `✅ Respon \`${responseName}\` berhasil dihapus.`);
                    } catch (e) {
                        console.error('[!] Gagal menghapus respon kustom:', e);
                        await sendText(sock, senderJid, '❌ Gagal menghapus respon. Terjadi kesalahan pada server.');
                    }
                    break;
                }

                case 'listrespon': {
                    const responseNames = Object.keys(customResponses);

                    if (responseNames.length === 0) {
                        await sendText(sock, senderJid, '❌ Belum ada respon kustom yang Anda buat.');
                        break;
                    }

                    let responseText = `📋 *Daftar Respon Kustom Anda* 📋\n\nTotal respon: ${responseNames.length}\n\n`;
                   
                    responseNames.forEach((name, index) => {
                        const caption = customResponses[name].caption;
                        responseText += `${index + 1}. *Perintah:* ${PREFIX}${name}\n   *Caption:* ${caption}\n\n`;
                    });

                    responseText += `Gunakan \`${PREFIX}delrespon <nama>\` untuk menghapus.`;

                    await sendText(sock, senderJid, responseText.trim());
                    break;
                }
					case 'debugrvo': {
                    const cacheKeys = Array.from(viewOnceCache.keys());
                    let response = `*RVO Cache Debug Info:*\n\n` +
                                   `Total item di cache: ${viewOnceCache.size} / ${VIEW_ONCE_CACHE_MAX_SIZE}\n\n`;
                    if (cacheKeys.length > 0) {
                        response += "ID Pesan yang Tersimpan:\n" + cacheKeys.join('\n');
                    } else {
                        response += "Cache saat ini kosong.";
                    }
                    await sendText(sock, senderJid, response);
                    break;
                }
               
                case 'enc': {
                    const quotedMessageInfo = msg.message.extendedTextMessage?.contextInfo;
                    const quotedMessage = quotedMessageInfo?.quotedMessage;

                    if (!quotedMessage || (!quotedMessage.documentMessage && !quotedMessage.videoMessage && !quotedMessage.extendedTextMessage)) {
                        await sendText(sock, senderJid, `❌ *Perintah Salah*\n\nUntuk mengenkripsi file, balas (reply) file yang ingin dienkripsi, lalu ketik perintah \`${PREFIX}enc\`.`);
                        return;
                    }

                    await sendText(sock, senderJid, "⏳ Memproses enkripsi file, mohon tunggu...");

                    try {
                        const buffer = await downloadMediaMessage(
                            { message: quotedMessage, key: { remoteJid: senderJid, id: quotedMessageInfo.stanzaId, participant: quotedMessageInfo.participant } },
                            'buffer', {}, { logger: pino({ level: 'silent' }) }
                        );
                       
                        const originalContent = buffer.toString('utf-8');
                        const encryptedContent = await encryptCode(originalContent);

                        if (!encryptedContent) {
                            await sendText(sock, senderJid, "❌ Gagal mengenkripsi file. Terjadi kesalahan pada server.");
                            return;
                        }

                        const originalFileName = quotedMessage.documentMessage?.fileName || 'encrypted.js';
                        const encryptedFileName = `enc-${originalFileName}`;
                        const encryptedBuffer = Buffer.from(encryptedContent, 'utf-8');

                        await sock.sendMessage(senderJid, {
                            document: encryptedBuffer,
                            fileName: encryptedFileName,
                            mimetype: 'application/javascript'
                        });

                        console.log(`[√] File "${originalFileName}" berhasil dienkripsi dan dikirim ke ${senderJid}`);

                    } catch (e) {
                        console.error('[!] Gagal mengeksekusi perintah .enc:', e);
                        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat memproses enkripsi file. Pastikan Anda membalas file yang valid.');
                    }
                    break;
                } 
               
case 'ceksetgc': {
    await sendText(sock, senderJid, "⏳ Sedang memeriksa status fitur di semua grup...");

    try {
        const allGroups = await sock.groupFetchAllParticipating();

        const getGroupNames = (groupIds) => {
            return groupIds
                .map(id => allGroups[id]?.subject)
                .filter(name => name); 
        };

        const antilinkGroups = getGroupNames(antilinkEnabledGroups);
        const welcomeGroups = getGroupNames(welcomeEnabledGroups);
        const leftGroups = getGroupNames(leftEnabledGroups);
        const antitagswGroups = getGroupNames(antitagswEnabledGroups);
        const antilongtextGroups = getGroupNames(antilongtextEnabledGroups);

        let response = "🔎 *Status Fitur Aktif di Seluruh Grup*\n\n";

        response += "🛡️ *Anti-Link Aktif di:*\n";
        if (antilinkGroups.length > 0) {
            response += antilinkGroups.map((name, index) => `${index + 1}. ${name}`).join('\n');
        } else {
            response += "   - (Tidak ada)\n";
        }
        response += "\n";
       
        response += "🚫 *Anti-Tag-SW Aktif di:*\n";
        if (antitagswGroups.length > 0) {
            response += antitagswGroups.map((name, index) => `${index + 1}. ${name}`).join('\n');
        } else {
            response += "   - (Tidak ada)\n";
        }
        response += "\n";

        response += "📝 *Anti-Long-Text Aktif di:*\n";
        if (antilongtextGroups.length > 0) {
            response += antilongtextGroups.map((name, index) => `${index + 1}. ${name}`).join('\n');
        } else {
            response += "   - (Tidak ada)\n";
        }
        response += "\n";

        response += "👋 *Welcome Aktif di:*\n";
        if (welcomeGroups.length > 0) {
            response += welcomeGroups.map((name, index) => `${index + 1}. ${name}`).join('\n');
        } else {
            response += "   - (Tidak ada)\n";
        }
        response += "\n";

        response += "🚪 *Pesan Keluar (Left) Aktif di:*\n";
        if (leftGroups.length > 0) {
            response += leftGroups.map((name, index) => `${index + 1}. ${name}`).join('\n');
        } else {
            response += "   - (Tidak ada)\n";
        }

        await sendText(sock, senderJid, response.trim());

    } catch (e) {
        console.error('[!] Error pada fitur cekfitur:', e);
        await sendText(sock, senderJid, '❌ Gagal memeriksa status fitur. Terjadi kesalahan.');
    }
    break;
}                
               
                case 'setpayment': {
                    if (args.length > 0) {
                        paymentMessage = fullArgs;
                        fs.writeFileSync(PAYMENT_MESSAGE_FILE, JSON.stringify({ message: paymentMessage }, null, 2));
                        await sendText(sock, senderJid, `✅ Pesan payment berhasil diubah menjadi:\n\n${paymentMessage}`);
                    } else {
                        await sendText(sock, senderJid, `Format salah! Contoh:\n${PREFIX}setpayment Ini adalah info pembayaran terbaru.`);
                    }
                    break;
                }

                case 'done': {
                    const priceArg = args.length > 0 ? args[args.length - 1] : null;
                    const price = priceArg ? parseInt(priceArg.replace(/\./g, ''), 10) : NaN;
                    const itemName = !isNaN(price) ? args.slice(0, -1).join(' ') : args.join(' ');
                    const quotedMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;

                    if (!itemName || isNaN(price) || !quotedMessage || !quotedMessage.imageMessage) {
                        let errorMessage = "❌ *Perintah Salah*\n\n";
                        if (!quotedMessage || !quotedMessage.imageMessage) {
                            errorMessage += "Anda harus *membalas (reply) sebuah gambar* bukti pembayaran.\n\n";
                        }
                        errorMessage += `Gunakan format yang benar:\n*${PREFIX}done <nama item> <harga>*\n\nContoh:\n*${PREFIX}done Surfshark Premium 3000*`;
                        await sendText(sock, senderJid, errorMessage);
                        break;
                    }

                    try {
                        console.log(`[i] Perintah .done diterima untuk item: "${itemName}" harga: ${price}. Mengunduh gambar...`);

                        const buffer = await downloadMediaMessage(
                            { message: { imageMessage: quotedMessage.imageMessage }, key: msg.key },
                            'buffer', {}, { logger: pino({ level: 'silent' }) }
                        );

                        const dateTimeString = getCurrentWIBDateTime();

                        const formattedPrice = new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(price);

                        const caption = `✅ *TRANSAKSI BERHASIL* ✅\n\n` +
                                        `🛍️ *Item:* ${itemName}\n` +
                                        `💰 *Harga:* ${formattedPrice}\n` +
                                        `📅 *Tanggal:* ${dateTimeString}\n\n` +
                                        `Terima kasih telah bertransaksi dengan *${OWNER_NAME}*!`;

                        await sendImageWithText(sock, senderJid, buffer, caption);
                        console.log(`[√] Pesan transaksi berhasil (.done) dikirim ke ${senderJid}`);

                    } catch (e) {
                        console.error('[!] Gagal mengeksekusi perintah .done:', e);
                        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat memproses transaksi. Gagal mengirim bukti.');
                    }
                    break;
                }

                case 'jpm': {
                    const subCommand = args[0]?.toLowerCase();
                    if (subCommand === 'on') {
                        isAutoBroadcastEnabled = true;
                        fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')), autoBroadcast: true }, null, 2));
                        startScheduledBroadcast();
                        await sendText(sock, senderJid, '✅ JPM Otomatis telah *DIAKTIFKAN*.');
                    } else if (subCommand === 'off') {
                        isAutoBroadcastEnabled = false;
                        fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')), autoBroadcast: false }, null, 2));
                        stopScheduledBroadcast();
                        await sendText(sock, senderJid, '❌ JPM Otomatis telah *DINONAKTIFKAN*.');
                    } else {
                        const status = isAutoBroadcastEnabled ? 'AKTIF' : 'NONAKTIF';
                        const interval = broadcastIntervalHours;
                        await sendText(sock, senderJid, `Status JPM Otomatis: *${status}*\nInterval: *${interval} jam*\n\nGunakan:\n- \`${PREFIX}jpm on/off\`\n- \`${PREFIX}settimejpm <jam>\``);
                    }
                    break;
                }

                case 'setimgjpm': {
                    if (!msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                        await sendText(sock, senderJid, `❌ Perintah salah. Kirim gambar, lalu balas gambar tersebut dengan perintah *${PREFIX}setimgjpm*.`);
                        return;
                    }
                    try {
                        const quotedImage = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                        const buffer = await downloadMediaMessage(
                            { message: { imageMessage: quotedImage.imageMessage }, key: msg.key },
                            'buffer', {}, { logger: pino({ level: 'silent' }) }
                        );
                        fs.writeFileSync(JPM_IMAGE_PATH, buffer);
                        await sendText(sock, senderJid, '✅ Gambar JPM berhasil diatur.');
                    } catch (e) {
                        console.error('[!] Gagal download/simpan gambar JPM:', e);
                        await sendText(sock, senderJid, '❌ Gagal mengatur gambar JPM. Coba lagi dengan gambar lain.');
                    }
                    break;
                }

                case 'settimejpm': {
                    const newInterval = parseFloat(args[0]);
                    if (isNaN(newInterval) || newInterval <= 0) {
                        await sendText(sock, senderJid, `Format salah. Masukkan angka positif.\nContoh: ${PREFIX}settimejpm 2.5`);
                        break;
                    }

                    broadcastIntervalHours = newInterval;

                    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
                    settings.broadcastInterval = broadcastIntervalHours;
                    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));

                    await sendText(sock, senderJid, `✅ Waktu JPM otomatis berhasil diatur ke tiap *${broadcastIntervalHours} jam*.`);
                    if (broadcastIntervalId) {
                        console.log('[i] Merestart jadwal JPM dengan interval baru...');
                        stopScheduledBroadcast();
                        startScheduledBroadcast();
                    }
                    break;
                }

                case 'setdelayjpm': {
                    const newDelay = parseInt(args[0], 10);
                    if (isNaN(newDelay) || newDelay < 1) {
                        await sendText(sock, senderJid, `Format salah. Masukkan angka (detik) yang valid dan lebih dari 0.\nContoh: ${PREFIX}setdelayjpm 10`);
                        break;
                    }
                    jpmGroupDelaySeconds = newDelay;
                    try {
                        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
                        settings.jpmGroupDelay = jpmGroupDelaySeconds;
                        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
                        await sendText(sock, senderJid, `✅ Jeda kirim JPM per grup berhasil diatur ke *${jpmGroupDelaySeconds} detik*.`);
                    } catch (e) {
                        console.error('[!] Gagal menyimpan pengaturan jeda JPM:', e);
                        await sendText(sock, senderJid, `❌ Gagal menyimpan pengaturan. Perubahan hanya berlaku untuk sesi ini.`);
                    }
                    break;
                }
               
                case 'setantitagsw': {
                    if (!fullArgs) {
                        await sendText(sock, senderJid, `❌ *Format Salah!*\n\nMasukkan teks peringatan. Gunakan \`@sender\` untuk me-mention pengguna.\n\nContoh:\n*${PREFIX}setantitagsw @sender jangan tag all ya!*`);
                        break;
                    }
                    antitagswWarningMessage = fullArgs;
                    try {
                        const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
                        settings.antitagswWarningMessage = antitagswWarningMessage;
                        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
                        await sendText(sock, senderJid, `✅ Pesan peringatan Anti-Tag-SW berhasil diatur menjadi:\n\n${antitagswWarningMessage}`);
                    } catch (e) {
                        console.error('[!] Gagal menyimpan setantitagsw:', e);
                        await sendText(sock, senderJid, `❌ Gagal menyimpan pengaturan. Perubahan hanya berlaku untuk sesi ini.`);
                    }
                    break;
                }

                case 'welcome': {
                    const { id: targetGroupId, args: remainingArgs } = getTargetInfo(args, senderJid, isGroup);
                    const subCmd = remainingArgs[0]?.toLowerCase();

                    if (!targetGroupId) {
                        await sendText(sock, senderJid, `❌ Perintah tidak lengkap. Gunakan di dalam grup atau sertakan ID grup.\nContoh: \`${PREFIX}welcome 123@g.us on\``);
                        break;
                    }

                    try {
                        const groupMetadata = await sock.groupMetadata(targetGroupId);
                        if (subCmd === 'on') {
                            if (!welcomeEnabledGroups.includes(targetGroupId)) {
                                welcomeEnabledGroups.push(targetGroupId);
                                saveWelcomeGroups();
                                await sendText(sock, senderJid, `✅ Fitur Welcome berhasil *DIAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur Welcome sudah aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else if (subCmd === 'off') {
                            if (welcomeEnabledGroups.includes(targetGroupId)) {
                                welcomeEnabledGroups = welcomeEnabledGroups.filter(id => id !== targetGroupId);
                                saveWelcomeGroups();
                                await sendText(sock, senderJid, `✅ Fitur Welcome berhasil *DINONAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur Welcome memang tidak aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else {
                            const status = welcomeEnabledGroups.includes(targetGroupId) ? 'AKTIF' : 'NONAKTIF';
                            await sendText(sock, senderJid, `Status Welcome untuk grup *${groupMetadata.subject}* adalah: *${status}*`);
                        }
                    } catch (e) {
                        await sendText(sock, senderJid, `❌ Gagal memproses. Pastikan ID Grup \`${targetGroupId}\` valid dan bot adalah anggota grup tersebut.`);
                    }
                    break;
                }

                case 'left': {
                    const { id: targetGroupId, args: remainingArgs } = getTargetInfo(args, senderJid, isGroup);
                    const subCmd = remainingArgs[0]?.toLowerCase();

                    if (!targetGroupId) {
                        await sendText(sock, senderJid, `❌ Perintah tidak lengkap. Gunakan di dalam grup atau sertakan ID grup.\nContoh: \`${PREFIX}left 123@g.us on\``);
                        break;
                    }
                   
                    try {
                        const groupMetadata = await sock.groupMetadata(targetGroupId);
                        if (subCmd === 'on') {
                            if (!leftEnabledGroups.includes(targetGroupId)) {
                                leftEnabledGroups.push(targetGroupId);
                                saveLeftGroups();
                                await sendText(sock, senderJid, `✅ Fitur Pesan Keluar (Left) berhasil *DIAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur Pesan Keluar (Left) sudah aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else if (subCmd === 'off') {
                            if (leftEnabledGroups.includes(targetGroupId)) {
                                leftEnabledGroups = leftEnabledGroups.filter(id => id !== targetGroupId);
                                saveLeftGroups();
                                await sendText(sock, senderJid, `✅ Fitur Pesan Keluar (Left) berhasil *DINONAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur Pesan Keluar (Left) memang tidak aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else {
                            const status = leftEnabledGroups.includes(targetGroupId) ? 'AKTIF' : 'NONAKTIF';
                            await sendText(sock, senderJid, `Status Pesan Keluar (Left) untuk grup *${groupMetadata.subject}* adalah: *${status}*`);
                        }
                    } catch (e) {
                        await sendText(sock, senderJid, `❌ Gagal memproses. Pastikan ID Grup \`${targetGroupId}\` valid dan bot adalah anggota grup tersebut.`);
                    }
                    break;
                }

                case 'setwelcome': {
                    const { id: targetGroupId, args: remainingArgs } = getTargetInfo(args, senderJid, isGroup);
                    const messageText = remainingArgs.join(' ');

                    if (!targetGroupId || !messageText) {
                        await sendText(sock, senderJid, `❌ Format salah. Sertakan teks pesan.\nContoh:\n\`${PREFIX}setwelcome 123@g.us Selamat datang @user\``);
                        break;
                    }
                   
                    try {
                        const groupMetadata = await sock.groupMetadata(targetGroupId);
                        groupWelcomeMessages[targetGroupId] = messageText;
                        saveWelcomeMessages();
                        await sendText(sock, senderJid, `✅ Pesan welcome untuk grup *${groupMetadata.subject}* berhasil diatur:\n\n${messageText}`);
                    } catch (e) {
                        await sendText(sock, senderJid, `❌ Gagal memproses. Pastikan ID Grup \`${targetGroupId}\` valid dan bot adalah anggota grup tersebut.`);
                    }
                    break;
                }

                case 'setleft': {
                    const { id: targetGroupId, args: remainingArgs } = getTargetInfo(args, senderJid, isGroup);
                    const messageText = remainingArgs.join(' ');

                    if (!targetGroupId || !messageText) {
                        await sendText(sock, senderJid, `❌ Format salah. Sertakan teks pesan.\nContoh:\n\`${PREFIX}setleft 123@g.us Sampai jumpa @user\``);
                        break;
                    }

                    try {
                        const groupMetadata = await sock.groupMetadata(targetGroupId);
                        groupLeftMessages[targetGroupId] = messageText;
                        saveLeftMessages();
                        await sendText(sock, senderJid, `✅ Pesan keluar (left) untuk grup *${groupMetadata.subject}* berhasil diatur:\n\n${messageText}`);
                    } catch (e) {
                        await sendText(sock, senderJid, `❌ Gagal memproses. Pastikan ID Grup \`${targetGroupId}\` valid dan bot adalah anggota grup tersebut.`);
                    }
                    break;
                }

                case 'antilink': {
                    const { id: targetGroupId, args: remainingArgs } = getTargetInfo(args, senderJid, isGroup);
                    const subCmd = remainingArgs[0]?.toLowerCase();

                    if (!targetGroupId) {
                        await sendText(sock, senderJid, `❌ Perintah tidak lengkap. Gunakan di dalam grup atau sertakan ID grup.\nContoh: \`${PREFIX}antilink 123@g.us on\``);
                        break;
                    }

                    try {
                        const groupMetadata = await sock.groupMetadata(targetGroupId);
                        if (subCmd === 'on') {
                            if (!antilinkEnabledGroups.includes(targetGroupId)) {
                                antilinkEnabledGroups.push(targetGroupId);
                                saveAntilinkGroups();
                                await sendText(sock, senderJid, `✅ Fitur anti-link berhasil *DIAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur anti-link sudah aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else if (subCmd === 'off') {
                            if (antilinkEnabledGroups.includes(targetGroupId)) {
                                antilinkEnabledGroups = antilinkEnabledGroups.filter(id => id !== targetGroupId);
                                saveAntilinkGroups();
                                await sendText(sock, senderJid, `✅ Fitur anti-link berhasil *DINONAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur anti-link memang tidak aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else {
                            const status = antilinkEnabledGroups.includes(targetGroupId) ? 'AKTIF' : 'NONAKTIF';
                             await sendText(sock, senderJid, `Status anti-link untuk grup *${groupMetadata.subject}* adalah: *${status}*`);
                        }
                    } catch (e) {
                         await sendText(sock, senderJid, `❌ Gagal memproses. Pastikan ID Grup \`${targetGroupId}\` valid dan bot adalah anggota grup tersebut.`);
                    }
                    break;
                }
                case 'antitagsw': {
                    const { id: targetGroupId, args: remainingArgs } = getTargetInfo(args, senderJid, isGroup);
                    const subCmd = remainingArgs[0]?.toLowerCase();

                    if (!targetGroupId) {
                        await sendText(sock, senderJid, `❌ Perintah tidak lengkap. Gunakan di dalam grup atau sertakan ID grup.\nContoh: \`${PREFIX}antitagsw on\``);
                        break;
                    }

                    try {
                        const groupMetadata = await sock.groupMetadata(targetGroupId);
                        if (subCmd === 'on') {
                            if (!antitagswEnabledGroups.includes(targetGroupId)) {
                                antitagswEnabledGroups.push(targetGroupId);
                                saveAntitagswGroups();
                                await sendText(sock, senderJid, `✅ Fitur Anti-Tag-SW berhasil *DIAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur Anti-Tag-SW sudah aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else if (subCmd === 'off') {
                            if (antitagswEnabledGroups.includes(targetGroupId)) {
                                antitagswEnabledGroups = antitagswEnabledGroups.filter(id => id !== targetGroupId);
                                saveAntitagswGroups();
                                await sendText(sock, senderJid, `✅ Fitur Anti-Tag-SW berhasil *DINONAKTIFKAN* untuk grup *${groupMetadata.subject}*.`);
                            } else {
                                await sendText(sock, senderJid, `ℹ️ Fitur Anti-Tag-SW memang tidak aktif di grup *${groupMetadata.subject}*.`);
                            }
                        } else {
                            const status = antitagswEnabledGroups.includes(targetGroupId) ? 'AKTIF' : 'NONAKTIF';
                            await sendText(sock, senderJid, `Status Anti-Tag-SW untuk grup *${groupMetadata.subject}* adalah: *${status}*`);
                        }
                    } catch (e) {
                        await sendText(sock, senderJid, `❌ Gagal memproses. Pastikan ID Grup \`${targetGroupId}\` valid dan bot adalah anggota grup tersebut.`);
                    }
                    break;
                }

                case 'kick': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }

                    let participantToKick = null;
                    const mentionedJid = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                    const repliedParticipant = msg.message.extendedTextMessage?.contextInfo?.participant;
                    const numberArg = args[0];

                    if (mentionedJid) {
                        participantToKick = mentionedJid;
                    } else if (repliedParticipant) {
                        participantToKick = repliedParticipant;
                    } else if (numberArg) {
                        let cleanNumber = numberArg.replace(/\D/g, '');
                        if (cleanNumber.startsWith('0')) {
                            cleanNumber = '62' + cleanNumber.slice(1);
                        }
                        if (cleanNumber.length > 5) {
                            participantToKick = `${cleanNumber}@s.whatsapp.net`;
                        }
                    }

                    if (!participantToKick) {
                        await sendText(sock, senderJid, `❌ *Cara Penggunaan Salah*\n\nUntuk mengeluarkan anggota, gunakan salah satu cara:\n1. *Reply* pesan anggota lalu ketik \`${PREFIX}kick\`\n2. *Mention* anggota: \`${PREFIX}kick @mention\`\n3. *Ketik nomor*: \`${PREFIX}kick 628... \``);
                        break;
                    }

                    if (participantToKick === adminJid) {
                        await sendText(sock, senderJid, '❌ Tidak bisa mengeluarkan Owner Bot.');
                        break;
                    }

                    try {
                        const groupMetadata = await sock.groupMetadata(senderJid);
                        const targetParticipant = groupMetadata.participants.find(p => p.id === participantToKick);

                        if (!targetParticipant) {
                                await sendText(sock, senderJid, '❌ Gagal. Target tidak ditemukan di dalam grup ini.');
                                break;
                        }

                        if (targetParticipant.admin) {
                            await sendText(sock, senderJid, '❌ Tidak bisa mengeluarkan sesama admin. Turunkan status adminnya terlebih dahulu.');
                            break;
                        }

                        const targetNumber = participantToKick.split('@')[0];
                        await sendText(sock, senderJid, `⏳ Berhasil mengeluarkan @${targetNumber}`, [participantToKick]);

                        await sock.groupParticipantsUpdate(senderJid, [participantToKick], 'remove');

                        console.log(`[KICK] Berhasil mengeluarkan ${participantToKick} dari grup ${senderJid}`);

                    } catch (e) {
                        console.error(`[!] Error pada fitur kick:`, e);

                        const errorMessage = e.toString().toLowerCase();
                        let replyText = '❌ Gagal mengeluarkan anggota karena terjadi error yang tidak diketahui.';

                        if (errorMessage.includes('forbidden') || errorMessage.includes('403') || errorMessage.includes('not an admin')) {
                            replyText = '❌ *Gagal!* Bot tidak memiliki hak admin untuk mengeluarkan anggota di grup ini.\n\nPastikan bot sudah dijadikan admin grup.';
                        } else if (errorMessage.includes('not a participant')) {
                            replyText = '❌ Gagal karena target sudah bukan anggota grup.';
                        }

                        await sendText(sock, senderJid, replyText);
                    }
                    break;
                }

                case 'setpesan': {
                    if (args.length > 0) { 
                        broadcastMessage = fullArgs; 
                        fs.writeFileSync(MESSAGE_FILE, JSON.stringify({ message: broadcastMessage }, null, 2)); 
                        await sendText(sock, senderJid, `✅ Pesan JPM berhasil diubah menjadi:\n\n${broadcastMessage}`); 
                    } else { 
                        await sendText(sock, senderJid, `Format salah! Contoh:\n${PREFIX}setpesan Halo semuanya, ada promo baru!`); 
                    } 
                    break; 
                }

                case 'cekpesan': {
                    await sendText(sock, senderJid, `📝 Pesan JPM saat ini adalah:\n\n${broadcastMessage}`); 
                    break; 
                }
                case 'list': {
                    const contacts = loadContacts(); 
                    let listMessage = `Total ${contacts.length} kontak tersimpan:\n\n`; 
                    if (contacts.length > 0) { 
                        contacts.forEach((c, i) => { listMessage += `${i + 1}. Nama: ${c.name}\n   Nomor: ${c.number}\n\n`; }); 
                    } else { 
                        listMessage += 'Database kosong.'; 
                    } 
                    await sendText(sock, senderJid, listMessage); 
                    break; 
                }
               
                case 'save': {
                    if (args.length > 0) { 
                        let num = args[0].replace(/\D/g, ''); 
                        if (!num.startsWith('62')) num = '62' + num.replace(/^0/, ''); 
                        const detailsText = args.slice(1).join(' '); 
                        const parts = detailsText.split('|').map(p => p.trim()); 
                        const name = parts[0] || `Kontak ${num}`; 
                        const details = { organization: parts[1] || null, title: parts[2] || null, email: parts[3] || null }; 
                        await sendContact(sock, senderJid, num, name, details); 
                        await sendText(sock, senderJid, `Kontak untuk ${name} (${num}) berhasil dibuat.`); 
                    } else { 
                        const contacts = loadContacts(); 
                        if (contacts.length === 0) { 
                            await sendText(sock, senderJid, 'Tidak ada kontak yang tersimpan untuk dijadikan file.'); 
                            return; 
                        } 
                        await sendText(sock, senderJid, `Membuat 1 file vCard yang berisi ${contacts.length} kontak. Mohon tunggu...`); 
                        let vcfString = ''; 
                        for (const contact of contacts) { 
                            vcfString += `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name || contact.number}\nTEL;TYPE=CELL;waid=${contact.number}:${contact.number}\nEND:VCARD\n\n`; 
                        } 
                        const vcfBuffer = Buffer.from(vcfString, 'utf-8'); 
                        const fileName = `Semua Kontak (${contacts.length}).vcf`; 
                        await sock.sendMessage(senderJid, { document: vcfBuffer, mimetype: 'text/vcard', fileName: fileName }); 
                        clearContacts(); 
                        await sendText(sock, senderJid, `File berisi ${contacts.length} kontak berhasil dikirim! Database kini telah dikosongkan.`); 
                    } 
                    break; 
                }

                case 'remove': {
                    let num = args[0] ? args[0].replace(/\D/g, '') : ''; 
                    if (!num) { 
                        await sendText(sock, senderJid, `Contoh: ${PREFIX}remove 62812...`); 
                        break; 
                    } 
                    removeContact(num); 
                    await sendText(sock, senderJid, `Kontak dengan nomor ${num} telah dihapus.`); 
                    break; 
                }

                case 'clear': {
                    clearContacts(); 
                    await sendText(sock, senderJid, "Semua kontak dalam database telah dibersihkan."); 
                    break; 
                }

                case 'savegrub': {
                    const groupId = args[0]?.trim(); 
                    if (!groupId || !groupId.endsWith('@g.us')) { 
                        await sendText(sock, senderJid, `Format salah. Gunakan ID Grup yang valid.\nContoh: ${PREFIX}savegrub 12036304@g.us`); 
                    } else { 
                        await saveNumbersFromGroup(sock, senderJid, groupId); 
                    } 
                    break; 
                }

                case 'pushkontak': {
                    const groupId = args[0]; 
                    const messageText = args.slice(1).join(' '); 
                    if (!groupId || !messageText) { 
                        await sendText(sock, senderJid, `Format perintah salah.\nGunakan: ${PREFIX}pushkontak idgrup teks pesan`); 
                        break; 
                    } 
                    await startPushContact(sock, senderJid, groupId, messageText); 
                    break; 
                }

                case 'setdelay': {
                    const newMin = parseInt(args[0]); 
                    const newMax = parseInt(args[1]); 
                    if (isNaN(newMin) || isNaN(newMax) || newMin < 2 || newMin >= newMax) { 
                        await sendText(sock, senderJid, `Format salah. Gunakan: ${PREFIX}setdelay <min_detik> <max_detik>\nContoh: ${PREFIX}setdelay 5 10\n(Minimal 2 detik, min harus < max)`); 
                        break; 
                    } 
                    minDelay = newMin * 1000; 
                    maxDelay = newMax * 1000; 
                    await sendText(sock, senderJid, `✅ Jeda waktu pushkontak berhasil diatur ke rentang acak antara ${newMin} hingga ${newMax} detik.`); 
                    break; 
                }

                case 'checkdelay': {
                    await sendText(sock, senderJid, `Saat ini, jeda waktu pushkontak diatur acak antara *${minDelay / 1000}* hingga *${maxDelay / 1000}* detik.`); 
                    break; 
                }

                case 'cekgrub':
                case 'listgroups': {
                    const groups = await getGroupList(sock); 
                    if (groups.length === 0) { 
                        await sendText(sock, senderJid, "Bot tidak bergabung di grup manapun."); 
                    } else { 
                        let groupList = "🔰 *Daftar Grup*\n\n"; 
                        groups.forEach((g, i) => { groupList += `${i+1}. *${g.subject||'Tanpa Nama'}*\n   - ID: \`${g.id}\`\n   - Anggota: ${g.participants.length}\n\n`; }); 
                        await sendText(sock, senderJid, groupList.trim()); 
                    } 
                    break; 
                }
case 'jpmv1': {
        if (isJpmRunning) {
            await sendText(sock, senderJid, "⚠️ Proses JPM lain sedang berlangsung. Silakan tunggu hingga selesai.");
            break;
        }

        const textMessage = fullArgs;
        if (!textMessage || textMessage.trim() === '') {
            await sendText(sock, senderJid, `❌ *Format Salah!*\n\nContoh:\n*${PREFIX}jpmv1 Halo semua, ini adalah pengumuman penting!*`);
            break;
        }

        isJpmRunning = true;
        await sock.sendMessage(senderJid, { react: { text: "⏰", key: msg.key } });

        // Helper Functions
        const detectFirstWhatsAppGroupLink = (text) => {
            const regex = /https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/;
            const match = text.match(regex);
            return match ? match[0] : null;
        };

        const fetchGroupInfo = async (url) => {
            try {
                const apiUrl = `https://api.autoresbot.com/api/stalker/whatsapp-group?url=${encodeURIComponent(url)}`;
                const response = await axios.get(apiUrl);
                return response.data;
            } catch (error) {
                console.error(`Gagal fetch info grup untuk ${url}`, error.message);
                return null;
            }
        };

        try {
            const allParticipatingGroups = await sock.groupFetchAllParticipating();
           
            const groupIds = Object.values(allParticipatingGroups)
                .filter(group => group.isCommunity == false && !jpmBlacklist.includes(group.id))
                .map(group => group.id);

            if (groupIds.length === 0) {
                await sendText(sock, senderJid, "Tidak ada grup target untuk JPM (non-komunitas yang tidak diblacklist).");
                isJpmRunning = false;
                break;
            }

            await sendText(sock, senderJid, `✅ Memulai JPM ke *${groupIds.length}* grup. Proses akan berjalan di latar belakang...`);

            const link = detectFirstWhatsAppGroupLink(textMessage);
            const quotedMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
            const isImageMessage = msg.message.imageMessage || quotedMessage?.imageMessage;

            let imageBuffer = null;
            let imageUrlFromLink = null;

            if (isImageMessage) {
                console.log("[JPM] Mendeteksi gambar dari reply/caption...");
                const imageToDownload = msg.message.imageMessage || quotedMessage.imageMessage;
                imageBuffer = await downloadMediaMessage({ message: { imageMessage: imageToDownload }, key: msg.key }, 'buffer', {}, { logger: pino({ level: 'silent' }) });
            } else if (link) {
                console.log(`[JPM] Mendeteksi link grup: ${link}`);
                const info = await fetchGroupInfo(link);
                if (info && info.imageLink) {
                    console.log(`[JPM] Menggunakan gambar profil dari grup: ${info.imageLink}`);
                    imageUrlFromLink = info.imageLink;
                }
            }

            let successCount = 0;
            const jpmDelay = 5000; // Jeda 5 detik antar grup

            for (const groupId of groupIds) {
                try {
                    await sock.sendPresenceUpdate('composing', groupId);
                    await delay(1000);

                    if (imageBuffer) {
                        await sock.sendMessage(groupId, { image: imageBuffer, caption: textMessage });
                    } else if (imageUrlFromLink) {
                        await sock.sendMessage(groupId, { image: { url: imageUrlFromLink }, caption: textMessage });
                    } else {
                        await sendText(sock, groupId, textMessage);
                    }

                    successCount++;
                    console.log(`[JPM] Terkirim ke: ${allParticipatingGroups[groupId]?.subject || groupId}`);
                    await sock.sendPresenceUpdate('paused', groupId);
                    await delay(jpmDelay);
                } catch (err) {
                    console.error(`[!] Gagal JPM ke ${groupId}:`, err.message);
                }
            }

            await sendText(sock, senderJid, `✅ *JPM Selesai!*\n\nPesan berhasil dikirim ke *${successCount}* dari *${groupIds.length}* grup.`);
        } catch (error) {
            console.error("[!] Error pada fitur JPM v1:", error);
            await sendText(sock, senderJid, "❌ Terjadi kesalahan: " + error.message);
        } finally {
            isJpmRunning = false;
        }
        break;
    }
                case 'restart': {
                    await sendText(sock, senderJid, "⏳ Memulai ulang bot, mohon tunggu..."); 
                    await restartBot(senderJid); 
                    break; 
                }
case "remini":
case "tohd":
case "hd": {
    try {
        const quotedMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMessage = msg.message.imageMessage || quotedMessage?.imageMessage;

        if (!imageMessage) {
            await sendText(sock, senderJid, `❌ Perintah salah. Anda harus mengirim atau membalas (reply) sebuah gambar dengan caption *${PREFIX}${command}*`);
            break;
        }

        await sock.sendMessage(senderJid, { react: { text: "⏰", key: msg.key } });


        const mimetype = imageMessage.mimetype;
       
        const extension = mime.extension(mimetype);
        if (!extension) {
            throw new Error("Tidak dapat menemukan ekstensi file gambar (contoh: jpg, png).");
        }

        const imageBuffer = await downloadMediaMessage(
            { message: { imageMessage: imageMessage }, key: msg.key },
            'buffer', {}, { logger: pino({ level: 'silent' }) }
        );
       
        async function uploadToCatbox(buffer, ext) {
            const form = new FormData();
            form.append("fileToUpload", buffer, "file." + ext);
            form.append("reqtype", "fileupload");
           
            const res = await fetch("https://catbox.moe/user/api.php", {
                method: "POST",
                body: form,
            });
            return await res.text();
        }

        const imageUrl = await uploadToCatbox(imageBuffer, extension);
        if (!imageUrl.startsWith("https://")) {
            throw new Error("Gagal meng-upload gambar ke server sementara.");
        }

        const apiResponse = await fetch(`https://api.autoresbot.com/api/tools/remini?apikey=${API_KEY}&url=${encodeURIComponent(imageUrl)}`);
       
        if (!apiResponse.ok) {
            throw new Error(`API Remini gagal dengan status: ${apiResponse.status}`);
        }

        const resultBuffer = await apiResponse.buffer();

        await sock.sendMessage(senderJid, {
            image: resultBuffer,
            caption: "✅ Gambar berhasil ditingkatkan kualitasnya!"
        }, { quoted: msg });
       
        await sock.sendMessage(senderJid, { react: { text: "✅", key: msg.key } });

    } catch (err) {
        console.error("[!] Error pada fitur Remini:", err);
        await sendText(sock, senderJid, "❌ Terjadi kesalahan: " + err.message);
    }
    break;
}

                            case 'welcomeall': {
                                const subCmd = args[0]?.toLowerCase();
                                if (subCmd === 'on') {
                                    try {
                                        await sendText(sock, senderJid, '⏳ Mengaktifkan Welcome untuk semua grup...');
                                        const allGroups = await sock.groupFetchAllParticipating();
                                        welcomeEnabledGroups = Object.keys(allGroups);
                                        saveWelcomeGroups();
                                        await sendText(sock, senderJid, `✅ Fitur Welcome berhasil *DIAKTIFKAN* untuk ${welcomeEnabledGroups.length} grup.`);
                                    } catch (e) {
                                        console.error('[!] Gagal mengaktifkan welcome untuk semua grup:', e);
                                        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat mengambil daftar grup.');
                                    }
                                } else if (subCmd === 'off') {
                                    welcomeEnabledGroups = [];
                                    saveWelcomeGroups();
                                    await sendText(sock, senderJid, '✅ Fitur Welcome berhasil *DINONAKTIFKAN* untuk semua grup.');
                                } else {
                                    await sendText(sock, senderJid, `❌ *Format Salah*\nGunakan: \`${PREFIX}welcomeall on\` atau \`${PREFIX}welcomeall off\``);
                                }
                                break;
                            }

                            case 'leftall': {
                                const subCmd = args[0]?.toLowerCase();
                                if (subCmd === 'on') {
                                    try {
                                        await sendText(sock, senderJid, '⏳ Mengaktifkan Pesan Keluar untuk semua grup...');
                                        const allGroups = await sock.groupFetchAllParticipating();
                                        leftEnabledGroups = Object.keys(allGroups);
                                        saveLeftGroups();
                                        await sendText(sock, senderJid, `✅ Fitur Pesan Keluar (Left) berhasil *DIAKTIFKAN* untuk ${leftEnabledGroups.length} grup.`);
                                    } catch (e) {
                                        console.error('[!] Gagal mengaktifkan left untuk semua grup:', e);
                                        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat mengambil daftar grup.');
                                    }
                                } else if (subCmd === 'off') {
                                    leftEnabledGroups = [];
                                    saveLeftGroups();
                                    await sendText(sock, senderJid, '✅ Fitur Pesan Keluar (Left) berhasil *DINONAKTIFKAN* untuk semua grup.');
                                } else {
                                    await sendText(sock, senderJid, `❌ *Format Salah*\nGunakan: \`${PREFIX}leftall on\` atau \`${PREFIX}leftall off\``);
                                }
                                break;
                            }
case 'antilinkall': {
    const subCmd = args[0]?.toLowerCase();
    if (subCmd === 'on') {
        try {
            await sendText(sock, senderJid, '⏳ Mengaktifkan Anti-Link untuk semua grup...');
            const allGroups = await sock.groupFetchAllParticipating();
           
            antilinkEnabledGroups = Object.keys(allGroups);
            saveAntilinkGroups();
           
            await sendText(sock, senderJid, `✅ Fitur Anti-Link berhasil *DIAKTIFKAN* untuk ${antilinkEnabledGroups.length} grup.\n\n*Catatan:* Fitur ini hanya akan berfungsi di grup tempat bot menjadi admin.`);
        } catch (e) {
            console.error('[!] Gagal mengaktifkan antilink untuk semua grup:', e);
            await sendText(sock, senderJid, '❌ Terjadi kesalahan saat mengambil daftar grup.');
        }
    } else if (subCmd === 'off') {
        antilinkEnabledGroups = [];
        saveAntilinkGroups();
        await sendText(sock, senderJid, '✅ Fitur Anti-Link berhasil *DINONAKTIFKAN* untuk semua grup.');
    } else {
        await sendText(sock, senderJid, `❌ *Format Salah*\nGunakan: \`${PREFIX}antilinkall on\` atau \`${PREFIX}antilinkall off\``);
    }
    break;
}
                case 'ai': {
                    const query = fullArgs;
                    if (!query) {
                        await sendText(sock, senderJid, `❌ Perintah salah. Masukkan pertanyaan Anda.\n\nContoh: *${PREFIX}ai Apa itu node.js?*`);
                        break;
                    }
                    if (API_KEY === 'GANTI_DENGAN_APIKEY_ANDA') {
                        await sendText(sock, senderJid, `❌ API Key belum diatur. Harap hubungi Admin untuk mengatur API Key.`);
                        break;
                    }

                    await sendText(sock, senderJid, "🤖 AI (Gemini) sedang berpikir, mohon tunggu...");

                    try {
                        const apiUrl = `https://api.autoresbot.com/api/gemini?text=${encodeURIComponent(query)}&apikey=${API_KEY}`;
                        const apiResponse = await fetch(apiUrl);
                        const responseData = await apiResponse.json();

                        if (responseData && responseData.status && responseData.data) {
                            await sendText(sock, senderJid, responseData.data); 
                        } else {
                            console.log('[!] Respon API AI (Gemini) tidak valid:', responseData);
                            await sendText(sock, senderJid, '❌ Gagal mendapatkan respon dari AI. Coba lagi nanti.');
                        }
                    } catch (e) {
                        console.error('[!] Error pada fitur AI (Gemini):', e);
                        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat menghubungi layanan AI.');
                    }
                    break;
                }
case 'close': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }
                    try {
                        await sock.groupSettingUpdate(senderJid, 'announcement');
                        await sendText(sock, senderJid, '✅ Grup telah ditutup. Sekarang hanya admin yang dapat mengirim pesan.');
                        console.log(`[GROUP] Grup ${senderJid} ditutup oleh admin.`);
                    } catch (e) {
                        console.error('[!] Gagal menutup grup:', e);
                        await sendText(sock, senderJid, '❌ Gagal menutup grup. Pastikan bot adalah admin di grup ini.');
                    }
                    break;
                }

                case 'open': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }
                    try {
                        await sock.groupSettingUpdate(senderJid, 'not_announcement');
                        await sendText(sock, senderJid, '✅ Grup telah dibuka. Sekarang semua peserta dapat mengirim pesan.');
                        console.log(`[GROUP] Grup ${senderJid} dibuka oleh admin.`);
                    } catch (e) {
                        console.error('[!] Gagal membuka grup:', e);
                        await sendText(sock, senderJid, '❌ Gagal membuka grup. Pastikan bot adalah admin di grup ini.');
                    }
                    break;
                }
case 'ssweb': {
                    const urlToCapture = args[0];
                    if (!urlToCapture || !/^(https?:\/\/)/i.test(urlToCapture)) {
                        await sendText(sock, senderJid, `❌ Perintah salah. Masukkan URL yang valid (harus diawali http atau https).\n\nContoh: *${PREFIX}ssweb https://google.com*`);
                        break;
                    }

                    await sendText(sock, senderJid, "⏳ Mengambil screenshot website, mohon tunggu...");

                    try {
                        const apiUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(urlToCapture)}?w=1280`;
                       
                        const response = await fetch(apiUrl);
                        if (!response.ok) {
                            throw new Error(`API gagal merespon. Status: ${response.status}`);
                        }
                       
                        const imageBuffer = await response.buffer();
                        await sock.sendMessage(senderJid, {
                            image: imageBuffer,
                            caption: `✅ Screenshot berhasil diambil dari:\n${urlToCapture}`
                        }, { quoted: msg });

                    } catch (e) {
                        console.error('[!] Gagal mengambil screenshot website:', e);
                        await sendText(sock, senderJid, '❌ Gagal mengambil screenshot. Pastikan URL valid dan dapat diakses oleh publik.');
                    }
                    break;
                }
case 'promote': {
    if (!isGroup) {
        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
        break;
    }

    let participantToPromote = null;
    const mentionedJid = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const repliedParticipant = msg.message.extendedTextMessage?.contextInfo?.participant;
    const numberArg = args[0];

    if (mentionedJid) {
        participantToPromote = mentionedJid;
    } else if (repliedParticipant) {
        participantToPromote = repliedParticipant;
    } else if (numberArg) {
        let cleanNumber = numberArg.replace(/\D/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '62' + cleanNumber.slice(1);
        }
        if (cleanNumber.length > 5) {
            participantToPromote = `${cleanNumber}@s.whatsapp.net`;
        }
    }

    if (!participantToPromote) {
        await sendText(sock, senderJid, `❌ *Cara Penggunaan Salah*\n\nUntuk menjadikan admin, gunakan salah satu cara:\n1. *Reply* pesan anggota lalu ketik \`${PREFIX}promote\`\n2. *Mention* anggota: \`${PREFIX}promote @mention\`\n3. *Ketik nomor*: \`${PREFIX}promote 628... \``);
        break;
    }

    try {
        await sock.groupParticipantsUpdate(senderJid, [participantToPromote], 'promote');
        const targetNumber = participantToPromote.split('@')[0];
        await sendText(sock, senderJid, `✅ Sukses menjadikan @${targetNumber} sebagai admin baru.`, [participantToPromote]);
        console.log(`[PROMOTE] Berhasil promote ${participantToPromote} di grup ${senderJid}`);
    } catch (e) {
        console.error(`[!] Error pada fitur promote:`, e);
        await sendText(sock, senderJid, '❌ Gagal. Pastikan bot adalah admin dan target adalah anggota grup yang valid.');
    }
    break;
}

case 'demote': {
    if (!isGroup) {
        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
        break;
    }

    let participantToDemote = null;
    const mentionedJid = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const repliedParticipant = msg.message.extendedTextMessage?.contextInfo?.participant;
    const numberArg = args[0];

    if (mentionedJid) {
        participantToDemote = mentionedJid;
    } else if (repliedParticipant) {
        participantToDemote = repliedParticipant;
    } else if (numberArg) {
        let cleanNumber = numberArg.replace(/\D/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '62' + cleanNumber.slice(1);
        }
        if (cleanNumber.length > 5) {
            participantToDemote = `${cleanNumber}@s.whatsapp.net`;
        }
    }

    if (!participantToDemote) {
        await sendText(sock, senderJid, `❌ *Cara Penggunaan Salah*\n\nUntuk menurunkan admin, gunakan salah satu cara:\n1. *Reply* pesan admin lalu ketik \`${PREFIX}demote\`\n2. *Mention* admin: \`${PREFIX}demote @mention\`\n3. *Ketik nomor*: \`${PREFIX}demote 628... \``);
        break;
    }

    try {
        await sock.groupParticipantsUpdate(senderJid, [participantToDemote], 'demote');
        const targetNumber = participantToDemote.split('@')[0];
        await sendText(sock, senderJid, `✅ Sukses menurunkan jabatan @${targetNumber} dari admin.`, [participantToDemote]);
        console.log(`[DEMOTE] Berhasil demote ${participantToDemote} di grup ${senderJid}`);
    } catch (e) {
        console.error(`[!] Error pada fitur demote:`, e);
        await sendText(sock, senderJid, '❌ Gagal. Pastikan bot adalah admin dan target adalah admin yang valid di grup ini.');
    }
    break;
}

case 'sendtesti':
case 'testi':
case 'uptesti': {
    if (!fullArgs) {
        await sendText(sock, senderJid, `❌ *Format Salah!*\n\nUntuk mengirim testimoni, kirim/balas sebuah gambar lalu ketik caption:\n*${PREFIX}testi <teks testimoni>*`);
        break;
    }

    let imageBuffer = null;
    const isImage = msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

    if (!isImage) {
        await sendText(sock, senderJid, `❌ *Gambar Dibutuhkan!*\n\nAnda harus mengirim atau membalas (reply) sebuah gambar sebagai bukti testimoni.`);
        break;
    }

    const imageMessage = msg.message.imageMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
    try {
        await sendText(sock, senderJid, '⏳ Mengunduh gambar testimoni...');
        imageBuffer = await downloadMediaMessage(
            { message: { imageMessage: imageMessage }, key: msg.key },
            'buffer', {}, { logger: pino({ level: 'silent' }) }
        );
    } catch (e) {
        console.error('[!] Gagal mengunduh gambar untuk testimoni:', e);
        await sendText(sock, senderJid, '❌ Gagal mengunduh gambar yang Anda kirim/balas. Silakan coba lagi.');
        break;
    }

    try {
        const allGroups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(allGroups).filter(id => !jpmBlacklist.includes(id));
        let successCount = 0;
        const testiText = fullArgs;

        await sendText(sock, senderJid, `⏳ Memproses testimoni ke Saluran dan *${groupIds.length}* grup...`);

        try {
            await sock.sendMessage(global.idsaluran, {
                image: imageBuffer,
                caption: testiText
            });
            console.log(`[TESTI] Berhasil dikirim ke saluran: ${global.namasaluran}`);
        } catch (e) {
            console.error(`[!] Gagal mengirim testimoni ke saluran ${global.idsaluran}:`, e);
            await sendText(sock, senderJid, `⚠️ Gagal mengirim ke saluran. Proses akan tetap dilanjutkan ke grup.`);
        }

        for (const groupId of groupIds) {
            try {
                await sock.sendMessage(groupId, {
                    image: imageBuffer,
                    caption: testiText,
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: global.idsaluran,
                            newsletterName: global.namasaluran,
                            serverMessageId: 1 
                        }
                    }
                });
                successCount++;
                console.log(`[TESTI] Terkirim ke grup: ${groupId}`);
                await delay(5000); 
            } catch (err) {
                console.error(`[!] Gagal mengirim testimoni ke grup ${groupId}:`, err);
            }
        }

        await sendText(sock, senderJid, `✅ *Testimoni Selesai Dikirim*\n\nBerhasil terkirim ke *${successCount}* grup dan 1 Saluran.`);

    } catch (e) {
        console.error('[!] Error fatal pada fitur testimoni:', e);
        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat memproses pengiriman testimoni.');
    }
    break;
}
case 'totalchat': {
    if (!isGroup) {
        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
        break;
    }

    try {
        const groupMetadata = await sock.groupMetadata(senderJid);
        const commandSenderId = msg.key.participant;
        const senderParticipant = groupMetadata.participants.find(p => p.id === commandSenderId);
        const isSenderAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin');

        if (!isSenderAdmin && !isAdminSender) {
             await sendText(sock, senderJid, `⛔ Maaf, perintah ini hanya untuk Admin Grup.`);
             break;
        }

        const currentParticipantIds = new Set(groupMetadata.participants.map(p => p.id));
        const groupChatData = chatCounts[senderJid] || {};

        let activeChatters = [];
        for (const userId in groupChatData) {
            if (groupChatData[userId] > 0 && currentParticipantIds.has(userId)) {
                activeChatters.push({
                    id: userId,
                    chatCount: groupChatData[userId]
                });
            }
        }
       
        if (activeChatters.length === 0) {
            await sendText(sock, senderJid, 'ℹ️ Belum ada aktivitas chat yang tercatat dari anggota yang masih ada di grup ini.');
            break;
        }

        activeChatters.sort((a, b) => b.chatCount - a.chatCount);

        const totalGroupChats = Object.values(groupChatData).reduce((sum, count) => sum + count, 0);

        let responseText = `💬 *Aktivitas Chat Grup*\n\nBerikut adalah peringkat anggota berdasarkan jumlah chat:\n\n`;
        let mentions = [];

        activeChatters.forEach((member, index) => {
            responseText += `${index + 1}. @${member.id.split('@')[0]} : ${member.chatCount} pesan\n`;
            mentions.push(member.id);
        });

        responseText += `\n\nTotal semua pesan yang tercatat di grup: *${totalGroupChats} pesan*`;

        await sendText(sock, senderJid, responseText, mentions);

    } catch (e) {
        console.error('[!] Error pada fitur totalchat:', e);
        await sendText(sock, senderJid, '❌ Terjadi kesalahan saat memproses perintah totalchat.');
    }
    break;
}
case 'tagall': {
    if (!isGroup) {
        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
        break;
    }

    try {
        const groupMetadata = await sock.groupMetadata(senderJid);
        const participants = groupMetadata.participants;

        const commandSenderId = msg.key.participant;
        const senderParticipant = participants.find(p => p.id === commandSenderId);
        const isSenderGroupAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin');
       
        if (!isSenderGroupAdmin && !isAdminSender) {
            await sendText(sock, senderJid, '⛔ Maaf, perintah ini hanya untuk Admin Grup.');
            break;
        }

        const messageContent = fullArgs.trim() || 'Panggilan kepada semua anggota.';

        let tagallText = `══✪〘 *👥 Panggilan Grup* 〙✪══\n➲ *Pesan:* ${messageContent}\n\n`;
        const mentions = [];

        participants.forEach(member => {
            tagallText += `⭔ @${member.id.split('@')[0]}\n`;
            mentions.push(member.id);
        });

        await sock.sendMessage(
            senderJid,
            { text: tagallText.trim(), mentions: mentions },
            { quoted: msg }
        );

    } catch (e) {
        console.error('[!] Error pada fitur tagall:', e);
        await sendText(sock, senderJid, '❌ Gagal melakukan tagall. Terjadi kesalahan pada server.');
    }
    break;
}
                case 'setnamegc': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }
                    if (!fullArgs) {
                        await sendText(sock, senderJid, `❌ *Format Salah*\n\nMasukkan nama baru untuk grup.\nContoh: \`${PREFIX}setnamegc Grup Hebat\``);
                        break;
                    }
                    try {
                        await sock.groupUpdateSubject(senderJid, fullArgs);
                        await sendText(sock, senderJid, `✅ Nama grup berhasil diubah menjadi: *${fullArgs}*`);
                        console.log(`[GROUP] Nama grup ${senderJid} diubah menjadi "${fullArgs}" oleh admin.`);
                    } catch (e) {
                        console.error('[!] Gagal mengubah nama grup:', e);
                        await sendText(sock, senderJid, '❌ Gagal mengubah nama grup. Pastikan bot adalah admin di grup ini.');
                    }
                    break;
                }
case 'setdeskgc': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }
                    if (!fullArgs) {
                        await sendText(sock, senderJid, `❌ *Format Salah*\n\nMasukkan deskripsi baru untuk grup.\nContoh: \`${PREFIX}setdeskgc Deskripsi baru yang hebat\``);
                        break;
                    }
                    try {
                        await sock.groupUpdateDescription(senderJid, fullArgs);
                        await sendText(sock, senderJid, `✅ Deskripsi grup berhasil diubah.`);
                        console.log(`[GROUP] Deskripsi grup ${senderJid} diubah oleh admin.`);
                    } catch (e) {
                        console.error('[!] Gagal mengubah deskripsi grup:', e);
                        await sendText(sock, senderJid, '❌ Gagal mengubah deskripsi grup. Pastikan bot adalah admin di grup ini.');
                    }
                    break;
                }
case 'antilongtext': {
            if (!isGroup) {
                await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                break;
            }
            const subCmd = args[0]?.toLowerCase();
            if (subCmd === 'on') {
                if (!antilongtextEnabledGroups.includes(senderJid)) {
                    antilongtextEnabledGroups.push(senderJid);
                    saveAntilongtextGroups();
                    await sendText(sock, senderJid, `✅ Fitur Anti-Long-Text berhasil *DIAKTIFKAN*.\nPesan yang melebihi ${LONG_TEXT_LIMIT} karakter akan dihapus.`);
                } else {
                    await sendText(sock, senderJid, 'ℹ️ Fitur Anti-Long-Text sudah aktif di grup ini.');
                }
            } else if (subCmd === 'off') {
                if (antilongtextEnabledGroups.includes(senderJid)) {
                    antilongtextEnabledGroups = antilongtextEnabledGroups.filter(id => id !== senderJid);
                    saveAntilongtextGroups();
                    await sendText(sock, senderJid, '✅ Fitur Anti-Long-Text berhasil *DINONAKTIFKAN*.');
                } else {
                    await sendText(sock, senderJid, 'ℹ️ Fitur Anti-Long-Text memang tidak aktif di grup ini.');
                }
            } else {
                const status = antilongtextEnabledGroups.includes(senderJid) ? 'AKTIF' : 'NONAKTIF';
                await sendText(sock, senderJid, `Status Anti-Long-Text: *${status}*\n\nGunakan: \`${PREFIX}antilongtext on/off\``);
            }
            break;
        }
case 'batalbeli': {
    if (transactions[senderJid]) {
        clearTimeout(transactions[senderJid].exp);
        delete transactions[senderJid];
        await sendText(sock, senderJid, '✅ Transaksi pembelian panel sebelumnya berhasil dibatalkan.');
    } else {
        await sendText(sock, senderJid, 'ℹ️ Tidak ada transaksi pembelian panel yang sedang berlangsung.');
    }
    break;
}

case 'addstok': {
                    const productName = args[0]?.toLowerCase();
                    if (!productName) {
                        return await sendText(sock, senderJid, `❌ *Format Salah*\n\nGunakan: \`${PREFIX}addstok <nama_produk> <data_stok>\`\n\n*Contoh (satu stok):*\n\`${PREFIX}addstok netflix email@akun.com:password123\`\n\n*Contoh (banyak stok):*\n\`${PREFIX}addstok netflix\nakun1:pass1\nakun2:pass2\``);
                    }

                    const productIndex = products.findIndex(p => p.name === productName);
                    if (productIndex === -1) {
                        return await sendText(sock, senderJid, `❌ Produk dengan nama "${productName}" tidak ditemukan. Tambahkan dulu dengan perintah \`${PREFIX}addproduk\`.`);
                    }

                    const stockDataRaw = text.substring(text.indexOf(productName) + productName.length).trim();
                    if (!stockDataRaw) {
                        return await sendText(sock, senderJid, '❌ Data stok tidak boleh kosong.');
                    }
                   
                    const itemsToAdd = stockDataRaw.split('\n').filter(item => item.trim() !== "");

                    if (itemsToAdd.length === 0) {
                        return await sendText(sock, senderJid, '❌ Tidak ada data stok yang valid untuk ditambahkan.');
                    }

                    products[productIndex].items.push(...itemsToAdd);
                    saveProducts();

                    await sendText(sock, senderJid, `✅ Berhasil menambahkan *${itemsToAdd.length}* item stok baru untuk produk *${productName}*.\nTotal stok sekarang: *${products[productIndex].items.length}*`);
                    break;
                }
case 'addproduk': {
    if (args.length < 2) {
        return await sendText(sock, senderJid, `❌ *Format Salah*\n\nGunakan: \`${PREFIX}addproduk <nama_produk> <harga>\`\nContoh: \`${PREFIX}addproduk Netflix 35000\``);
    }
    const productName = args[0].toLowerCase();
    const productPrice = parseInt(args[1], 10);

    if (isNaN(productPrice)) {
        return await sendText(sock, senderJid, '❌ Harga produk harus berupa angka.');
    }

    const existingProduct = products.find(p => p.name === productName);
    if (existingProduct) {
        return await sendText(sock, senderJid, `❌ Produk dengan nama "${productName}" sudah ada.`);
    }

    products.push({
        name: productName,
        price: productPrice,
        items: [] 
    });
    saveProducts(); 

    await sendText(sock, senderJid, `✅ Produk *${func.capital(productName)}* dengan harga *Rp${func.toRupiah(productPrice)}* berhasil ditambahkan dengan stok awal 0.`);
    break;
}
case 'joingc': {
    if (!fullArgs) {
        await sendText(sock, senderJid, `❌ *Format Salah*\n\nMasukkan link undangan grup atau ID grup.\nContoh: *${PREFIX}joingc https://chat.whatsapp.com/xxxxxxxxxx* atau *${PREFIX}joingc 123@g.us*`);
        break;
    }

    const codeMatch = fullArgs.match(/chat\.whatsapp\.com\/([A-Za-z0-9]{22})/);
    if (codeMatch && codeMatch[1]) {
        const inviteCode = codeMatch[1];
        try {
            await sendText(sock, senderJid, '⏳ Mencoba bergabung dengan grup melalui link...');
            const groupJid = await sock.groupAcceptInvite(inviteCode);
            const metadata = await sock.groupMetadata(groupJid);
            await sendText(sock, senderJid, `✅ Berhasil bergabung dengan grup: *${metadata.subject}*`);
            console.log(`[JOIN] Bot berhasil bergabung dengan grup ${metadata.subject} (${groupJid})`);
        } catch (e) {
            console.error('[!] Gagal bergabung dengan grup:', e);
            await sendText(sock, senderJid, '❌ Gagal bergabung. Pastikan link valid, tidak kedaluwarsa, dan grup tidak penuh.');
        }
    } else if (fullArgs.endsWith('@g.us')) {
        const groupId = fullArgs;
        try {
            await sendText(sock, senderJid, '⏳ Mencoba bergabung dengan grup menggunakan ID...');
            await sock.groupParticipantsUpdate(groupId, [sock.user.id], 'add');
            await sendText(sock, senderJid, `✅ Berhasil bergabung dengan grup ID: *${groupId}*`);
            console.log(`[JOIN] Bot berhasil bergabung dengan grup ID: ${groupId}`);
        } catch (e) {
            console.error('[!] Gagal bergabung dengan grup ID:', e);
            if (e.message.includes('bad-request')) {
                await sendText(sock, senderJid, '❌ Gagal bergabung. Pastikan ID grup valid dan bot memiliki izin.');
            } else {
                await sendText(sock, senderJid, '❌ Gagal bergabung. Terjadi kesalahan yang tidak terduga.');
            }
        }
    } else {
        await sendText(sock, senderJid, '❌ Format tidak valid. Pastikan Anda menggunakan link undangan atau ID grup yang benar.');
    }
    break;
}
case 'setqris': {
                    if (!msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                        await sendText(sock, senderJid, `❌ *Perintah Salah*\n\nUntuk mengatur gambar QRIS, kirim sebuah gambar, lalu balas (reply) gambar tersebut dengan perintah *${PREFIX}setqris*.`);
                        return;
                    }
                    try {
                        const quotedImage = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                       
                        const buffer = await downloadMediaMessage(
                            { message: { imageMessage: quotedImage.imageMessage }, key: msg.key },
                            'buffer', {}, { logger: pino({ level: 'silent' }) }
                        );
                       
                        fs.writeFileSync(PAYMENT_IMAGE_PATH, buffer);
                       
                        await sendText(sock, senderJid, '✅ Gambar QRIS untuk perintah `.payment` berhasil diperbarui.');

                    } catch (e) {
                        console.error('[!] Gagal mengunduh atau menyimpan gambar QRIS:', e);
                        await sendText(sock, senderJid, '❌ Gagal mengatur gambar QRIS. Pastikan Anda membalas gambar yang valid dan coba lagi.');
                    }
                    break;
                }
case 'kudetagrup': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }

                    try {
                        const groupMetadata = await sock.groupMetadata(senderJid);
                        const commandSenderId = msg.key.participant;
                       
                        const isBotOwner = commandSenderId === adminJid;
                        const isGroupOwner = commandSenderId === groupMetadata.owner;

                        if (!isBotOwner && !isGroupOwner) {
                            await sendText(sock, senderJid, '⛔ *Akses Ditolak!*\nPerintah ini terlalu berbahaya dan hanya bisa digunakan oleh *Owner Bot* atau *Pembuat Grup*.');
                            break;
                        }

                        if (args[0]?.toLowerCase() !== 'konfirmasi') {
                            await sendText(sock, senderJid, `🚨 *PERINGATAN!* 🚨\nAnda akan mengeluarkan SEMUA anggota dari grup ini kecuali diri Anda dan Bot. Tindakan ini tidak dapat diurungkan.\n\nUntuk melanjutkan, ketik: *${PREFIX}kudetagrup konfirmasi*`);
                            break;
                        }
                       
                        await sendText(sock, senderJid, `✅ *Inisiasi Kudeta Grup Dimulai!*\nMengeluarkan semua anggota...`);

                        const botJid = sock.user.id;
                        const participantsToKick = groupMetadata.participants
                            .map(p => p.id)
                            .filter(id => id !== commandSenderId && id !== botJid); 

                        if (participantsToKick.length === 0) {
                            await sendText(sock, senderJid, 'ℹ️ Tidak ada anggota lain untuk dikeluarkan.');
                            break;
                        }
                       
                        console.log(`[KUDETA] Memulai kudeta di grup ${groupMetadata.subject} (${senderJid}) atas perintah ${commandSenderId}. Target: ${participantsToKick.length} anggota.`);
                       
                        await sock.groupParticipantsUpdate(senderJid, participantsToKick, 'remove');
                       
                        await sendText(sock, senderJid, `✅ *Kudeta Berhasil!*\n*${participantsToKick.length}* anggota telah dikeluarkan dari grup.`);

                    } catch (e) {
                        console.error(`[!] Error pada fitur kudetagrup:`, e);
                        await sendText(sock, senderJid, '❌ Gagal melakukan kudeta. Pastikan bot adalah admin di grup ini.');
                    }
                    break;
                }
case 'kudetagrup': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }

                    try {
                        const groupMetadata = await sock.groupMetadata(senderJid);
                        const commandSenderId = msg.key.participant;
                       
                        const isBotOwner = commandSenderId === adminJid;
                        const isGroupOwner = commandSenderId === groupMetadata.owner;

                        if (!isBotOwner && !isGroupOwner) {
                            await sendText(sock, senderJid, '⛔ *Akses Ditolak!*\nPerintah ini hanya bisa digunakan oleh *Owner Bot* atau *Pembuat Grup*.');
                            break;
                        }

                        if (args[0]?.toLowerCase() !== 'konfirmasi') {
                            await sendText(sock, senderJid, `🚨 *PERINGATAN!* 🚨\nAnda akan mengeluarkan SEMUA *ANGGOTA BIASA* dari grup ini. Admin lain akan tetap aman. Tindakan ini tidak dapat diurungkan.\n\nUntuk melanjutkan, ketik: *${PREFIX}kudetagrup konfirmasi*`);
                            break;
                        }
                       
                        const botJid = sock.user.id;
                        const allParticipants = groupMetadata.participants;

                        const membersToKick = allParticipants
                            .filter(p => !p.admin && p.id !== commandSenderId && p.id !== botJid)
                            .map(p => p.id);

                        if (membersToKick.length === 0) {
                            await sendText(sock, senderJid, 'ℹ️ Tidak ada anggota biasa untuk dikeluarkan.');
                            break;
                        }
                       
                        await sendText(sock, senderJid, `✅ *Inisiasi Pembersihan Dimulai!*\nTarget: *${membersToKick.length}* anggota biasa.\n\nProses akan berjalan *SANGAT LAMBAT & ACAK* untuk menghindari deteksi WhatsApp. Harap bersabar.`);
                       
                        let kickCount = 0;
                        for (const memberId of membersToKick) {
                            try {
                                const randomDelay = Math.floor(Math.random() * 3000) + 9000;
                                await delay(randomDelay); 

                                await sock.groupParticipantsUpdate(senderJid, [memberId], 'remove');
                                kickCount++;
                                console.log(`[KUDETA] Mengeluarkan ${memberId.split('@')[0]} dari grup ${groupMetadata.subject}. Jeda berikutnya: ${randomDelay / 1000} detik.`);
                               
                            } catch (e) {
                                console.log(`[!] Gagal mengeluarkan ${memberId.split('@')[0]}: ${e.message}`);
                                if (e.message.includes('forbidden')) {
                                    console.log('[!] Bot kemungkinan telah dikeluarkan dari grup. Menghentikan proses kudeta.');
                                    await sendText(sock, ADMIN_NUMBER + '@s.whatsapp.net', `⚠️ Proses kudeta di grup "${groupMetadata.subject}" berhenti karena bot dikeluarkan.`);
                                    return; 
                                }
                            }
                        }
                       
                        await sendText(sock, senderJid, `✅ *Pembersihan Selesai!*\nBerhasil mengeluarkan *${kickCount}* dari *${membersToKick.length}* anggota biasa.`);

                    } catch (e) {
                        console.error(`[!] Error fatal pada fitur kudetagrup:`, e);
                        await sendText(sock, senderJid, '❌ Gagal melakukan pembersihan. Pastikan bot adalah admin di grup ini.');
                    }
                    break;
                }
case 'antilongtextall': {
    const subCmd = args[0]?.toLowerCase();
    if (subCmd === 'on') {
        try {
            await sendText(sock, senderJid, '⏳ Mengaktifkan Anti-Long-Text untuk semua grup...');
            const allGroups = await sock.groupFetchAllParticipating();
            antilongtextEnabledGroups = Object.keys(allGroups);
            saveAntilongtextGroups();
            await sendText(sock, senderJid, `✅ Fitur Anti-Long-Text berhasil *DIAKTIFKAN* untuk ${antilongtextEnabledGroups.length} grup.`);
        } catch (e) {
            console.error('[!] Gagal mengaktifkan anti-long-text untuk semua grup:', e);
            await sendText(sock, senderJid, '❌ Terjadi kesalahan saat mengambil daftar grup.');
        }
    } else if (subCmd === 'off') {
        antilongtextEnabledGroups = [];
        saveAntilongtextGroups();
        await sendText(sock, senderJid, '✅ Fitur Anti-Long-Text berhasil *DINONAKTIFKAN* untuk semua grup.');
    } else {
        await sendText(sock, senderJid, `❌ *Format Salah*\nGunakan: \`${PREFIX}antilongtextall on\` atau \`${PREFIX}antilongtextall off\``);
    }
    break;
}
case "autoread":
                case "autoreadsw":
                case "anticall":
                case "autotyping":
                case "autorecording": {
                    const getStatus = () => {
                        let teks = "🔰 *Status Pengaturan Bot*\n\n";
                        for (let i of Object.keys(botSettings)) {
                            teks += `› *${func.capital(i)}:* ${botSettings[i] ? "Aktif ✅" : "Mati ❌"}\n`;
                        }
                        return teks;
                    };

                    const subCmd = args[0]?.toLowerCase();
                    if (!subCmd || (subCmd !== 'on' && subCmd !== 'off')) {
                        await sendText(sock, senderJid, `❌ *Format Salah!*\n\nGunakan: *${PREFIX}${command} on* atau *${PREFIX}${command} off*\n\n${getStatus()}`);
                        break;
                    }

                    if (subCmd === 'on') {
                        if (botSettings[command] === true) {
                            await sendText(sock, senderJid, `ℹ️ Fitur *${func.capital(command)}* sudah aktif sebelumnya.`);
                            break;
                        }
                        if (command === "autotyping" && botSettings.autorecording === true) {
                            botSettings.autorecording = false;
                        }
                        if (command === "autorecording" && botSettings.autotyping === true) {
                            botSettings.autotyping = false;
                        }
                       
                        botSettings[command] = true;
                        saveBotSettings();
                        await sendText(sock, senderJid, `✅ Berhasil mengaktifkan *${func.capital(command)}*.\n\n${getStatus()}`);

                    } else if (subCmd === 'off') {
                        if (botSettings[command] === false) {
                            await sendText(sock, senderJid, `ℹ️ Fitur *${func.capital(command)}* sudah nonaktif sebelumnya.`);
                            break;
                        }
                        botSettings[command] = false;
                        saveBotSettings();
                        await sendText(sock, senderJid, `✅ Berhasil menonaktifkan *${func.capital(command)}*.\n\n${getStatus()}`);
                    }
                    break;
                }
case 'ceksetbot': {
                    if (Object.keys(botSettings).length === 0) {
                         await sendText(sock, senderJid, '❌ Gagal memuat data pengaturan. Coba restart bot. Jika masalah berlanjut, hubungi developer.');
                         break;
                    }
               
                    let responseText = "🔰 *Status Pengaturan Bot Saat Ini* 🔰\n\n";

                    for (const key in botSettings) {
                        if (Object.hasOwnProperty.call(botSettings, key)) {
                            responseText += `› *${func.capital(key)}:* ${botSettings[key] ? "Aktif ✅" : "Mati ❌"}\n`;
                        }
                    }

                    responseText += "\n\nGunakan perintah seperti `.autoread on/off` untuk mengubah pengaturan.";
                   
                    await sendText(sock, senderJid, responseText.trim());
                    break;
                }
                case 'addvip': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }

                    const groupMetadata = await sock.groupMetadata(senderJid);
                    const commandSenderId = msg.key.participant;
                    const senderParticipant = groupMetadata.participants.find(p => p.id === commandSenderId);
                    const isSenderGroupAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin');

                    if (!isAdminSender && !isSenderGroupAdmin) {
                        await sendText(sock, senderJid, '⛔ Maaf, perintah ini hanya untuk Admin Grup atau Owner Bot.');
                        break;
                    }

                    // Validasi Input
                    const userId = args[0];
                    const matchCount = parseInt(args[1], 10);

                    if (!userId || isNaN(matchCount) || matchCount < 0) {
                        await sendText(sock, senderJid, `❌ *Format Salah*\n\nGunakan: \`${PREFIX}addvsbot <user_id> <jumlah_match>\`\nContoh: \`${PREFIX}addvsbot 53751753 5\``);
                        break;
                    }
                   
                    if (!/^\d+$/.test(userId)) {
                        await sendText(sock, senderJid, '❌ User ID harus berupa angka.');
                        break;
                    }

                    vsbotData[userId] = matchCount;
                    saveVsbotData();

                    await sendText(sock, senderJid, `✅ *Sukses!*\n\nUser ID *${userId}* telah diatur untuk *${matchCount}* match.`);
                    console.log(`[VSBOT] User ${userId} ditambahkan/diupdate dengan ${matchCount} match oleh ${commandSenderId}`);
                    break;
                }
                case 'listvip': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }

                    const groupMetadata = await sock.groupMetadata(senderJid);
                    const commandSenderId = msg.key.participant;
                    const senderParticipant = groupMetadata.participants.find(p => p.id === commandSenderId);
                    const isSenderGroupAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin');

                    if (!isAdminSender && !isSenderGroupAdmin) {
                        await sendText(sock, senderJid, '⛔ Maaf, perintah ini hanya untuk Admin Grup atau Owner Bot.');
                        break;
                    }

                    if (Object.keys(vsbotData).length === 0) {
                        await sendText(sock, senderJid, 'ℹ️ Saat ini tidak ada data user VS Bot yang tersimpan.');
                        break;
                    }

                    let responseText = `🤖 *Daftar VIP MLBB*\n\nTotal User: *${Object.keys(vsbotData).length}*\n\n─────────────────\n`;
                    let index = 1;
                    for (const [userId, matchCount] of Object.entries(vsbotData)) {
                        responseText += `${index}. *User ID:* \`${userId}\`\n   - *Jumlah Match:* ${matchCount}\n\n`;
                        index++;
                    }

                    await sendText(sock, senderJid, responseText.trim());
                    break;
                }
                case 'minvip': {
                    if (!isGroup) {
                        await sendText(sock, senderJid, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
                        break;
                    }

                    const groupMetadata = await sock.groupMetadata(senderJid);
                    const commandSenderId = msg.key.participant;
                    const senderParticipant = groupMetadata.participants.find(p => p.id === commandSenderId);
                    const isSenderGroupAdmin = senderParticipant && (senderParticipant.admin === 'admin' || senderParticipant.admin === 'superadmin');

                    if (!isAdminSender && !isSenderGroupAdmin) {
                        await sendText(sock, senderJid, '⛔ Maaf, perintah ini hanya untuk Admin Grup atau Owner Bot.');
                        break;
                    }

                    if (Object.keys(vsbotData).length === 0) {
                        await sendText(sock, senderJid, 'ℹ️ Tidak ada data user VS Bot yang tersimpan untuk dikurangi.');
                        break;
                    }

                    let usersRemoved = [];
                    for (const userId in vsbotData) {
                        if (Object.hasOwnProperty.call(vsbotData, userId)) {
                            vsbotData[userId] -= 1; 

                            if (vsbotData[userId] <= 0) {
                                usersRemoved.push(userId); // Catat user yang dihapus
                                delete vsbotData[userId];   // Hapus user dari objek
                            }
                        }
                    }

                    saveVsbotData(); 

                    let replyText = '✅ *Sukses!*\n\nSemua match VIP telah dikurangi 1.';
                   
                    if (usersRemoved.length > 0) {
                        replyText += `\n\nUser berikut telah kehabisan match dan dihapus dari daftar:\n- \`${usersRemoved.join('\n- `')}\``;
                    }
                   
                    await sendText(sock, senderJid, replyText);
                    console.log(`[VSBOT] Match dikurangi 1 untuk semua user oleh ${commandSenderId}. User dihapus: ${usersRemoved.length}`);
                    break;
                }
                    // Letakkan kode ini di dalam blok switch(command) setelah 'case backup'
case 'story': {
    if (!isAdminSender) {
        return await sendText(sock, senderJid, '⛔ Maaf, perintah ini hanya untuk Owner Bot.');
    }

    try {
        const quotedMessage = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const isImageMessage = msg.message.imageMessage || quotedMessage?.imageMessage;
        const isVideoMessage = msg.message.videoMessage || quotedMessage?.videoMessage;
        const textForStatus = fullArgs;

        if (isImageMessage) {
            await sendText(sock, senderJid, '⏳ Memposting gambar ke status...');
            const imageBuffer = await downloadMediaMessage(
                { message: { imageMessage: isImageMessage }, key: msg.key },
                'buffer', {}, { logger: pino({ level: 'silent' }) }
            );
            
            console.log('[DEBUG] Mencoba mengirim status GAMBAR...');
            const result = await sock.sendMessage('status@broadcast', {
                image: imageBuffer,
                caption: textForStatus
            });
            console.log('[DEBUG] Hasil pengiriman status:', result);

            await sendText(sock, senderJid, '✅ Gambar berhasil diposting ke status!');
        
        } else if (isVideoMessage) {
            await sendText(sock, senderJid, '⏳ Memposting video ke status...');
            const videoBuffer = await downloadMediaMessage(
                { message: { videoMessage: isVideoMessage }, key: msg.key },
                'buffer', {}, { logger: pino({ level: 'silent' }) }
            );

            console.log('[DEBUG] Mencoba mengirim status VIDEO...');
            const result = await sock.sendMessage('status@broadcast', {
                video: videoBuffer,
                caption: textForStatus
            });
            console.log('[DEBUG] Hasil pengiriman status:', result);

            await sendText(sock, senderJid, '✅ Video berhasil diposting ke status!');

        } else if (textForStatus) {
            await sendText(sock, senderJid, '⏳ Memposting teks ke status...');
            
            console.log('[DEBUG] Mencoba mengirim status TEKS...');
            const result = await sock.sendMessage('status@broadcast', { text: textForStatus });
            console.log('[DEBUG] Hasil pengiriman status:', result);

            await sendText(sock, senderJid, '✅ Teks berhasil diposting ke status!');
        
        } else {
            await sendText(sock, senderJid, `❌ *Format Salah*\n\nUntuk membuat status, gunakan salah satu cara:\n1. Ketik: \`${PREFIX}story Teks Anda\`\n2. Kirim/balas gambar dengan caption: \`${PREFIX}story Caption gambar\`\n3. Kirim/balas video dengan caption: \`${PREFIX}story Caption video\``);
        }
    } catch (e) {
        console.error('[!] Error pada fitur story:', e);
        await sendText(sock, senderJid, '❌ Gagal memposting status. Terjadi kesalahan.');
    }
    break;
}
                case 'backup': {
                    await sendText(sock, senderJid, "Membuat backup..."); 
                    if (createBackup()) await sendBackupFile(sock, senderJid); 
                    else await sendText(sock, senderJid, "Gagal membuat backup."); 
                    break; 
                }
            }
        } else if (isCmd) {
const adminCommands = ['jpm', 'listuserpanel', 'deluserpanel', 'setimgjpm', 'settimejpm', 'setdelayjpm', 'setpesan', 'cekpesan', 'jpmv1', 'jpmv2', 'jpmpoll', 'list', 'save', 'remove', 'clear', 'savegrub', 'pushkontak', 'setdelay', 'checkdelay', 'cekgrub', 'listgroups', 'kick', 'promote', 'demote', 'restart', 'backup', 'setpayment', 'done', 'antilink', 'welcome', 'left', 'setwelcome', 'setleft', 'enc', 'hidetag', 'ceksetgc', 'addsewa', 'delsewa', 'listsewa', 'boost', 'addrespon', 'delrespon', 'listrespon', 'debugrvo', 'public', 'self', 'addprem', 'delprem', 'listprem', 'bljpm', 'blgcjpm', 'listpanel', 'delpanel', 'antitagsw', 'setantitagsw', 'antilinkall', 'welcomeall', 'leftall', 'open', 'close', 'setdeskgc', 'antilongtextall', 'antikata', 'setkata', 'antipoll'];
            if (adminCommands.includes(command)) {
                await sendText(sock, senderJid, `⛔ Maaf, perintah *${PREFIX}${command}* hanya untuk Admin.`);
                console.log(`[!] Akses ditolak untuk ${senderNumber} (Perintah: ${command})`);
            }
        }
    })
}
startBot();