/**
 * NEXYROTH CLICKER - CLIENT-SIDE ZERO-DEPENDENCY ZIP EXPORTER
 * Creates a valid, uncompressed standard ZIP archive of the entire project
 * Pure JavaScript - 100% Offline, Zero Server Dependency, Zero CDN
 */
(function (global) {
  'use strict';

  // CRC-32 Table
  const crcTable = (function () {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function strToUtf8Bytes(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  /**
   * Builds a valid standard ZIP archive buffer from array of { name: string, data: Uint8Array | string }
   */
  function buildZip(files) {
    const fileEntries = [];
    let localHeadersOffset = 0;

    // 1. Process files and calculate local headers
    files.forEach(function (f) {
      const nameBytes = strToUtf8Bytes(f.name);
      const dataBytes = (typeof f.data === 'string') ? strToUtf8Bytes(f.data) : f.data;
      const fileCrc = crc32(dataBytes);
      const uncompressedSize = dataBytes.length;

      // Local file header: 30 bytes + filename length + data length
      const localHeader = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(localHeader.buffer);

      view.setUint32(0, 0x04034b50, true); // Local file header signature
      view.setUint16(4, 20, true);         // Version needed to extract
      view.setUint16(6, 0, true);          // General purpose bit flag
      view.setUint16(8, 0, true);          // Compression method (0 = Store)
      view.setUint16(10, 0, true);         // File last mod time
      view.setUint16(12, 0, true);         // File last mod date
      view.setUint32(14, fileCrc, true);   // CRC-32
      view.setUint32(18, uncompressedSize, true); // Compressed size
      view.setUint32(22, uncompressedSize, true); // Uncompressed size
      view.setUint16(26, nameBytes.length, true); // Filename length
      view.setUint16(28, 0, true);         // Extra field length
      localHeader.set(nameBytes, 30);

      fileEntries.push({
        nameBytes: nameBytes,
        dataBytes: dataBytes,
        localHeader: localHeader,
        crc: fileCrc,
        size: uncompressedSize,
        offset: localHeadersOffset
      });

      localHeadersOffset += localHeader.length + dataBytes.length;
    });

    // 2. Central Directory Headers
    const centralDirectoryEntries = [];
    let centralDirSize = 0;

    fileEntries.forEach(function (entry) {
      // 46 bytes + filename length
      const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
      const view = new DataView(cdHeader.buffer);

      view.setUint32(0, 0x02014b50, true); // Central directory header signature
      view.setUint16(4, 20, true);         // Version made by
      view.setUint16(6, 20, true);         // Version needed
      view.setUint16(8, 0, true);          // Bit flag
      view.setUint16(10, 0, true);         // Compression method (0)
      view.setUint16(12, 0, true);         // Mod time
      view.setUint16(14, 0, true);         // Mod date
      view.setUint32(16, entry.crc, true); // CRC-32
      view.setUint32(20, entry.size, true);// Compressed size
      view.setUint32(24, entry.size, true);// Uncompressed size
      view.setUint16(28, entry.nameBytes.length, true); // Filename length
      view.setUint16(30, 0, true);         // Extra field len
      view.setUint16(32, 0, true);         // Comment len
      view.setUint16(34, 0, true);         // Disk number start
      view.setUint16(36, 0, true);         // Internal file attributes
      view.setUint32(38, 0, true);         // External file attributes
      view.setUint32(42, entry.offset, true); // Relative offset of local header
      cdHeader.set(entry.nameBytes, 46);

      centralDirectoryEntries.push(cdHeader);
      centralDirSize += cdHeader.length;
    });

    // 3. End of Central Directory Record (22 bytes)
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
    eocdView.setUint16(4, 0, true);          // Number of this disk
    eocdView.setUint16(6, 0, true);          // Disk with start of CD
    eocdView.setUint16(8, files.length, true); // Total entries this disk
    eocdView.setUint16(10, files.length, true);// Total entries overall
    eocdView.setUint32(12, centralDirSize, true); // Size of CD
    eocdView.setUint32(16, localHeadersOffset, true); // Offset of start of CD
    eocdView.setUint16(20, 0, true);         // Comment length

    // Assemble total byte array
    const totalLength = localHeadersOffset + centralDirSize + eocd.length;
    const zipBytes = new Uint8Array(totalLength);

    let currentPos = 0;
    fileEntries.forEach(function (entry) {
      zipBytes.set(entry.localHeader, currentPos);
      currentPos += entry.localHeader.length;
      zipBytes.set(entry.dataBytes, currentPos);
      currentPos += entry.dataBytes.length;
    });

    centralDirectoryEntries.forEach(function (cd) {
      zipBytes.set(cd, currentPos);
      currentPos += cd.length;
    });

    zipBytes.set(eocd, currentPos);

    return zipBytes;
  }

  async function fetchFileContent(path) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        return await res.text();
      }
    } catch (e) {
      console.warn('Could not fetch file for export: ' + path, e);
    }
    return null;
  }

  async function downloadFullProjectZip() {
    const btn = document.getElementById('headerExportZipBtn') || document.getElementById('btnSettingsExportZip');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.innerHTML = '⏳ Packaging ZIP...';
      btn.disabled = true;
    }

    try {
      // Direct fallback if pre-packaged zip exists
      const fileList = [
        'index.html',
        'style.css',
        'css/variables.css',
        'css/layout.css',
        'css/components.css',
        'css/animations.css',
        'css/modals.css',
        'css/events-daily.css',
        'js/numeric.js',
        'js/bonuses.js',
        'js/audio.js',
        'js/state.js',
        'js/daily.js',
        'js/events.js',
        'js/ui-core.js',
        'js/ui-upgrades.js',
        'js/ui-modals.js',
        'js/zip-export.js',
        'js/main.js'
      ];

      const files = [];

      for (let i = 0; i < fileList.length; i++) {
        const filePath = fileList[i];
        const content = await fetchFileContent('./' + filePath);
        if (content) {
          files.push({ name: filePath, data: content });
        }
      }

      // Add project README
      files.push({
        name: 'README.md',
        data: `# NEXYROTH CLICKER RPG (v8.0)
Pure JavaScript & CSS - 100% Offline Compatible
No Build Tools or Server Required!

## Structure:
- \`index.html\`: Game entry point
- \`game.html\`: Game standalone entry point
- \`style.css\`: Unified styles bundle
- \`css/\`: Modular CSS stylesheets (variables, layout, components, animations, modals, events-daily)
- \`js/\`: Modular JS game modules (numeric, bonuses, audio, state, daily, events, ui-core, ui-upgrades, ui-modals, zip-export, main)
- \`assets/images/\`: Visual image assets

## Features (v8.0):
- 41 Cosmic Upgrades
- 5 Constellation Skill Branches (including 🍀 Vận May with infinite node)
- 27 Relics with ⚡ Auto-Equip (max 4 equipped)
- 35 Achievements with Real Multiplier & CPS Buffs (+17.5% total)
- 4 Worlds (including ⛩️ Thiên Giới Vĩnh Hằng) & 18 Pets + Cú Đêm Vĩnh Cửu
- 4 Bonuses Multipliers (Boss Damage, Item Drop, Gem Drop, Offline Efficiency)
- Personal Records (Highest CPS, Highest Click, Max Clicks in 10s)
- Visual Juice: Crit bounce, GPU ripple waves, Neon pulsing glow when buffs active, Spacebar click & 1-4 shortcuts
- Base64 Save String Export / Import in Settings

## How to Run:
Just open \`index.html\` directly in any modern browser, or drop into your Capacitor/Cordova/WebView Android project!`
      });

      if (files.length > 0) {
        const zipBytes = buildZip(files);
        const blob = new Blob([zipBytes], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nexyroth-clicker-v8.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (global.Sound) global.Sound.playAchievement();
      } else {
        // Fallback to static archive link if fetch fails
        window.location.href = './nexyroth-clicker-phase4.zip';
      }
    } catch (err) {
      console.error('Export zip failed, falling back:', err);
      window.location.href = './nexyroth-clicker-phase4.zip';
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  }

  global.ZipExport = {
    download: downloadFullProjectZip,
    buildZip: buildZip
  };
})(typeof window !== 'undefined' ? window : this);
