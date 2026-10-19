(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=null,t=3;function n(){return typeof document>`u`?null:((!e||!document.contains(e))&&(e=document.getElementById(`cosmicToastContainer`),e||(e=document.createElement(`div`),e.id=`cosmicToastContainer`,e.style.cssText=[`position: fixed`,`top: 1rem`,`left: 50%`,`transform: translateX(-50%)`,`z-index: 99999`,`display: flex`,`flex-direction: column`,`gap: 0.5rem`,`align-items: center`,`pointer-events: none`,`width: calc(100% - 2rem)`,`max-width: 440px`].join(`;`),document.body.appendChild(e))),e)}function r(e,r,i){let a=n();if(!a)return;let o=i||3e3,s=a.querySelector(`[data-raw-msg="${encodeURIComponent(e)}"]`);if(s){let e=parseInt(s.getAttribute(`data-count`)||`1`,10)+1;s.setAttribute(`data-count`,String(e));let t=s.querySelector(`.toast-count-badge`);t&&(t.textContent=`x${e}`,t.style.display=`inline-block`),s.style.transform=`scale(1.05)`,setTimeout(()=>{s&&(s.style.transform=`scale(1)`)},150),s._removeTimeout&&clearTimeout(s._removeTimeout),s._removeTimeout=setTimeout(()=>{s.style.opacity=`0`,s.style.transform=`translateY(-10px)`,setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},200)},o);return}for(;a.children.length>=t;){let e=a.firstElementChild;e&&(e._removeTimeout&&clearTimeout(e._removeTimeout),a.removeChild(e))}let c=document.createElement(`div`);c.className=`cosmic-toast-item`,c.setAttribute(`data-raw-msg`,encodeURIComponent(e)),c.setAttribute(`data-count`,`1`);let l=`rgba(15, 23, 42, 0.95)`,u=`rgba(56, 189, 248, 0.5)`,d=`#38bdf8`,f=`✨`;r===`success`?(l=`rgba(6, 78, 59, 0.95)`,u=`#10b981`,d=`#6ee7b7`,f=`🎉`):r===`error`?(l=`rgba(136, 19, 55, 0.95)`,u=`#f43f5e`,d=`#fda4af`,f=`⚠️`):r===`warning`?(l=`rgba(120, 53, 15, 0.95)`,u=`#f59e0b`,d=`#fde68a`,f=`⏳`):r===`gold`&&(l=`rgba(146, 64, 14, 0.95)`,u=`#fbbf24`,d=`#fef08a`,f=`👑`),c.style.cssText=[`background: `+l,`border: 1.5px solid `+u,`color: #ffffff`,`border-radius: 0.75rem`,`padding: 0.65rem 1rem`,`font-size: 0.8125rem`,`font-weight: 700`,`box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px `+u,`display: flex`,`align-items: center`,`gap: 0.625rem`,`backdrop-filter: blur(12px)`,`-webkit-backdrop-filter: blur(12px)`,`pointer-events: auto`,`animation: toast-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards`,`transition: opacity 0.2s ease, transform 0.2s ease`,`width: 100%`,`box-sizing: border-box`].join(`;`),c.innerHTML=`
    <span style="font-size: 1.15rem; flex-shrink: 0;">${f}</span>
    <span class="toast-msg-text" style="flex: 1; min-width: 0; word-break: break-word; line-height: 1.35; color: ${d};">${e}</span>
    <span class="toast-count-badge" style="display: none; background: rgba(0,0,0,0.5); border: 1px solid ${u}; color: #fff; font-size: 0.6875rem; padding: 1px 6px; border-radius: 9999px; font-weight: 800; font-family: monospace;">x1</span>
    <button style="background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; padding: 0 0.25rem; line-height: 1;" onclick="this.parentNode.remove()">×</button>
  `,a.appendChild(c),c._removeTimeout=setTimeout(()=>{c.style.opacity=`0`,c.style.transform=`translateY(-10px)`,setTimeout(()=>{c.parentNode&&c.parentNode.removeChild(c)},200)},o)}var i={show:r,success:(e,t)=>r(e,`success`,t),error:(e,t)=>r(e,`error`,t),warning:(e,t)=>r(e,`warning`,t),info:(e,t)=>r(e,`info`,t)};typeof window<`u`&&(window.Toast=i),typeof globalThis<`u`&&(globalThis.Toast=i),(function(e){let t=`nexyroth_lang`,n={vi:{brand_title:`NEXYROTH`,brand_subtitle:`Bản Vũ Trụ · Phase 4`,essence:`Năng Lượng Tối`,shards:`Mảnh Astral`,gems:`Đá Quý`,daily_btn:`Quà Hàng Ngày`,event_btn:`Sự Kiện`,gem_shop_btn:`Cửa Hàng`,backpack_btn:`Balo`,backpack_title:`Balo Vật Phẩm & Cổ Vật`,export_zip_btn:`Tải ZIP`,settings_btn:`Cài Đặt`,click_power:`Sức Mạnh Bấm`,passive_cps:`Tự Động/Giây`,level:`Cấp Độ`,exp:`Kinh Nghiệm`,crit_rate:`Chí Mạng`,active_boosts:`Hiệu Ứng Kích Hoạt`,none_active:`Không có hiệu ứng`,nav_daily_title:`Quà Đăng Nhập 7 Ngày`,nav_daily_desc:`Nhận Đá Quý, Shards & Cổ Vật`,nav_event_title:`Sự Kiện: Void Incursion`,nav_event_desc:`Làm nhiệm vụ nhận Tokens`,nav_boss_title:`Boss Hư Không`,nav_boss_desc:`Đánh bại Boss nhận Đá Quý`,nav_skills_title:`Chòm Sao Astral`,nav_skills_desc:`Cây kỹ năng nội tại`,nav_gem_shop_title:`Cửa Hàng Đá Quý (Shop Gems)`,nav_gem_shop_desc:`Thuốc nhân x2..x100, Auto 50ms & Đặc quyền`,nav_inventory_title:`Balo & Túi Đồ Vũ Trụ`,nav_inventory_desc:`Dùng thuốc x2..x100, auto 50ms & Cổ vật`,nav_achievements_title:`Thành Tựu Vũ Trụ`,nav_achievements_desc:`Nhận thưởng Đá Quý theo mốc`,nav_prestige_title:`Tái Sinh Vũ Trụ (Ascension)`,nav_prestige_desc:`Tẩy tủy nhận Mảnh Shards vĩnh viễn`,conduit_title:`Dẫn Truyền Chiều Không Gian`,core_title:`Lõi Nexyroth`,click_label:`Bấm`,crit_label:`Chí mạng`,skill_overload:`Quá Tải`,skill_surge:`Xung Kích`,skill_warp:`Bẻ Cong`,boss_challenge:`⚔️ Khiêu Chiến Boss Hư Không`,upgrades_title:`Nâng Cấp`,buy_label:`Mua`,locked:`Khóa`,unlocks_at:`Mở khóa ở Cấp`,tab_core:`Lõi Bấm`,tab_upgrades:`Nâng Cấp`,tab_stats:`Nhân Vật`,tab_events:`Sự Kiện & Quà`,daily_modal_title:`Phần Thưởng Đăng Nhập 7 Ngày`,daily_banner_title:`Phước Lành Tinh Tú Mỗi Ngày`,daily_banner_desc:`Đăng nhập mỗi ngày để nhận Đá Quý, Mảnh Shards và Cổ Vật Huyền Thoại Sovereign!`,daily_streak:`Chuỗi:`,daily_days:`ngày`,daily_status:`Trạng thái:`,daily_ready:`SẴN SÀNG NHẬN QUÀ!`,daily_claimed_today:`Đã nhận hôm nay (Quay lại sau)`,daily_claim_now_btn:`🎁 NHẬN THƯỞNG NGÀY`,daily_test_skip:`⚡ Bỏ Qua 24h (Thử Nghiệm)`,claimed_tag:`ĐÃ NHẬN`,event_modal_title:`Sự Kiện: Cosmic Void Incursion`,event_banner_title:`Đại Chiến Hư Không`,event_banner_desc:`Hoàn thành các nhiệm vụ thám hiểm để tích lũy Tokens và nhận cổ vật độc quyền!`,event_ends_in:`Kết thúc sau:`,event_tokens:`Tokens Tích Lũy:`,event_milestones:`Mốc Phần Thưởng Tokens`,event_missions:`Nhiệm Vụ Sự Kiện`,progress:`Tiến độ`,done:`HOÀN THÀNH`,in_progress:`Đang Làm`,settings_modal_title:`Cài Đặt & Điều Khiển`,settings_audio:`Âm Thanh & Hiệu Ứng (SFX)`,settings_audio_desc:`Âm thanh tiếng bấm, nâng cấp và nhận quà`,settings_mute:`Tắt Tiếng (Mute All)`,settings_volume:`Âm Lượng`,settings_language:`Ngôn Ngữ (Language)`,settings_scientific:`Ký Hiệu Khoa Học (1.0e9)`,settings_scientific_desc:`Hiển thị số lớn dạng khoa học thay vì K, M, B`,settings_floating:`Chữ Số Bay Khi Bấm`,settings_floating_desc:`Hiển thị số sát thương nhảy lên khi bấm`,settings_giftcode:`Nhập Mã Quà Tặng (Giftcode)`,settings_giftcode_placeholder:`Nhập mã (VD: TANTHU, NEXYROTH, VIP999)`,settings_giftcode_btn:`Nhận Quà`,settings_save_title:`Lưu Trữ & Xuất File`,settings_export_save:`📥 Xuất Lưu (.json)`,settings_import_save:`📤 Nhập Lưu`,settings_export_zip:`📦 Tải Toàn Bộ Mã Nguồn (.ZIP)`,settings_hard_reset:`⚠️ Xóa Toàn Bộ Dữ Liệu (Chơi Lại Từ Đầu)`,settings_hard_reset_confirm:`Bạn có chắc chắn muốn xóa toàn bộ tiến trình không? Thao tác này không thể hoàn tác!`,gem_shop_title:`Kho Tàng Đá Quý`,gem_balance:`Số dư Đá Quý`,purchased:`ĐÃ MUA`},en:{brand_title:`NEXYROTH`,brand_subtitle:`Phase 4 · Cosmic Edition`,essence:`Cosmic Essence`,shards:`Astral Shards`,gems:`Astral Gems`,daily_btn:`Daily Gift`,event_btn:`Event`,gem_shop_btn:`Gem Shop`,backpack_btn:`Backpack`,backpack_title:`Backpack & Relic Vault`,export_zip_btn:`Export ZIP`,settings_btn:`Settings`,click_power:`Click Power`,passive_cps:`Passive CPS`,level:`Level`,exp:`EXP`,crit_rate:`Crit Rate`,active_boosts:`Active Boosts`,none_active:`None active`,nav_daily_title:`7-Day Login Rewards`,nav_daily_desc:`Claim Gems, Shards & Relics`,nav_event_title:`Event: Void Incursion`,nav_event_desc:`Complete quests for Tokens`,nav_boss_title:`Void Titan Encounters`,nav_boss_desc:`Defeat bosses for Gems`,nav_skills_title:`Astral Constellations`,nav_skills_desc:`Branching passive skill tree`,nav_gem_shop_title:`Celestial Gem Vault (Shop)`,nav_gem_shop_desc:`Timed x2..x100 potions, 50ms Auto & Perks`,nav_inventory_title:`Backpack & Item Bag`,nav_inventory_desc:`Use x2..x100 potions, auto 50ms & relics`,nav_achievements_title:`Cosmic Achievements`,nav_achievements_desc:`Claim milestone Gem rewards`,nav_prestige_title:`Astral Rebirth (Ascension)`,nav_prestige_desc:`Reset for permanent Shards`,conduit_title:`Dimensional Conduit`,core_title:`Nexyroth Core`,click_label:`Click`,crit_label:`Crit`,skill_overload:`Overload`,skill_surge:`Surge`,skill_warp:`Warp`,boss_challenge:`⚔️ Challenge Void Titan`,upgrades_title:`Upgrades`,buy_label:`Buy`,locked:`Locked`,unlocks_at:`Unlocks at Level`,tab_core:`Core Clicker`,tab_upgrades:`Upgrades`,tab_stats:`Profile`,tab_events:`Events & Gifts`,daily_modal_title:`7-Day Login Rewards`,daily_banner_title:`Daily Astral Blessings`,daily_banner_desc:`Log in daily to claim Gems, Shards, and the mythical Sovereign Relic!`,daily_streak:`Streak:`,daily_days:`days`,daily_status:`Status:`,daily_ready:`READY TO CLAIM!`,daily_claimed_today:`Claimed today (Check back tomorrow)`,daily_claim_now_btn:`🎁 CLAIM DAY`,daily_test_skip:`⚡ Fast-Forward 24h (Test)`,claimed_tag:`CLAIMED`,event_modal_title:`Event: Cosmic Void Incursion`,event_banner_title:`Void Expedition Incursion`,event_banner_desc:`Complete expedition missions to earn Tokens and unlock mythic artifacts!`,event_ends_in:`Ends in:`,event_tokens:`Earned Tokens:`,event_milestones:`Token Milestone Track`,event_missions:`Expedition Missions`,progress:`Progress`,done:`DONE`,in_progress:`In Progress`,settings_modal_title:`Settings & Controls`,settings_audio:`Sound & Audio Effects (SFX)`,settings_audio_desc:`Sound for clicks, upgrades, and rewards`,settings_mute:`Mute Sound Effects`,settings_volume:`Audio Volume`,settings_language:`Language (Ngôn Ngữ)`,settings_scientific:`Scientific Notation (1.0e9)`,settings_scientific_desc:`Use exponential format instead of K, M, B`,settings_floating:`Floating Combat Numbers`,settings_floating_desc:`Show floating damage numbers on click`,settings_giftcode:`Redeem Giftcode`,settings_giftcode_placeholder:`Enter code (e.g. TANTHU, NEXYROTH, VIP999)`,settings_giftcode_btn:`Redeem`,settings_save_title:`Save Data & Backup`,settings_export_save:`📥 Export Save (.json)`,settings_import_save:`📤 Import Save`,settings_export_zip:`📦 Download Full Source (.ZIP)`,settings_hard_reset:`⚠️ Hard Reset Progress (Wipe All)`,settings_hard_reset_confirm:`Are you sure you want to wipe all progress? This action cannot be undone!`,gem_shop_title:`Celestial Gem Vault`,gem_balance:`Astral Gems`,purchased:`PURCHASED`}},r=`vi`;function i(){try{let e=localStorage.getItem(t);r=e===`en`||e===`vi`?e:`vi`}catch{r=`vi`}c()}function a(n){if(n!==`vi`&&n!==`en`)return;r=n;try{localStorage.setItem(t,n)}catch{}let i=e.GameState?e.GameState.get():null;i&&i.settings&&(i.settings.language=n,e.GameState.save&&e.GameState.save()),c(),e.DailyRewards&&e.DailyRewards.render&&e.DailyRewards.render(),e.CosmicEvents&&e.CosmicEvents.render&&e.CosmicEvents.render(),e.UIUpgrades&&e.UIUpgrades.render&&e.UIUpgrades.render(),e.UI&&e.UI.updateStatsDisplay&&e.UI.updateStatsDisplay()}function o(){return r}function s(e){return(n[r]||n.vi)[e]||n.en[e]||e}function c(){document.querySelectorAll(`[data-i18n]`).forEach(function(e){let t=e.getAttribute(`data-i18n`);t&&(e.textContent=s(t))});let e=document.getElementById(`headerLangBtn`);e&&(e.innerHTML=r===`vi`?`<span>🇻🇳</span> <span style="font-weight: 800; font-size: 0.75rem;">VI</span>`:`<span>🇬🇧</span> <span style="font-weight: 800; font-size: 0.75rem;">EN</span>`,e.title=r===`vi`?`Chuyển sang Tiếng Anh`:`Switch to Vietnamese`)}e.I18n={init:i,setLang:a,getLang:o,t:s,apply:c}})(typeof window<`u`?window:void 0);var a=`.K.M.B.T.Qa.Qi.Sx.Sp.Oc.No.Dc.Ud.Dd.Td.Qad.Qid.Sxd.Spd.Ocd.Nod.Vg.Uvg.Dvg.Tvg.Qavg.Qivg.Sxvg.Spvg.Ocvg.Novg.Tg.Utg.Dtg.Ttg.Qatg.Qitg.Sxtg.Sptg.Octg.Notg.Qd.Uqd.Dqd.Tqd.Qaqd.Qiqd.Sxqd.Spqd.Ocqd.Noqd.Qq.Uqq.Dqq.Tqq.Qaqq.Qiqq.Sxqq.Spqq.Ocqq.Noqq.Sg.Usg.Dsg.Tsg.Qasg.Qisg.Sxsg.Spsg.Ocsg.Nosg.St.Ust.Dst.Tst.Qast.Qist.Sxst.Spst.Ocst.Nost.Og.Uog.Dog.Tog.Qaog.Qiog.Sxog.Spog.Ocog.Noog.Nn.Unn.Dnn.Tnn.Qann.Qinn.Sxnn.Spnn.Ocnn.Nonn.Ce.Inf`.split(`.`);function o(e,t){if(e==null||isNaN(e))return`0`;if(!isFinite(e))return`∞`;if(e<0)return`-`+o(-e,t);if(e<1e3)return e%1==0?e.toString():e.toFixed(1).replace(/\.0$/,``);if(t)return e.toExponential(2).replace(`e+`,`e`);let n=Math.floor(Math.log10(e)/3);if(n<a.length){let t=a[n],r=e/10**(n*3);return r.toFixed(r>=100?1:2).replace(/\.00$|\.0$/,``)+` `+t}return e.toExponential(2).replace(`e+`,`e`)}function s(e,t,n,r){if(r===1)return Math.floor(e*t**+n);let i=0;for(let a=0;a<r;a++)i+=Math.floor(e*t**+(n+a));return i}function c(e,t,n,r){let i=0,a=0;for(;;){let o=Math.floor(e*t**+(n+i));if(a+o>r||(a+=o,i++,i>=1e3))break}return{count:i,totalCost:a}}function l(e){if(!e||e<=0)return`00:00`;let t=Math.floor(e/60),n=Math.floor(e%60);return(t<10?`0`+t:t)+`:`+(n<10?`0`+n:n)}typeof window<`u`&&(window.Numeric={format:o,formatDuration:l,calculateBatchCost:s,calculateMaxPurchasable:c});function u(){return typeof window<`u`&&window.GameState?.get?window.GameState.get():{}}function d(e){let t=1;return e.skills&&e.skills.forEach(function(e){e.unlocked&&(e.id===`luck_boss_1`&&(t+=.25),e.id===`luck_boss_2`&&(t+=.4),e.id===`luck_infinite`&&e.level&&(t+=.05*e.level))}),e.relics&&e.relics.forEach(function(e){e.equipped&&e.bossDamageBonus&&(t+=e.bossDamageBonus)}),e.pets&&e.pets.dragon&&e.pets.dragon.level&&(t+=e.pets.dragon.level*.04),parseFloat(t.toFixed(2))}function f(e){let t=.05;return e.skills&&e.skills.forEach(function(e){e.unlocked&&(e.id===`luck_item_1`&&(t+=.15),e.id===`luck_infinite`&&e.level&&(t+=.02*e.level))}),e.relics&&e.relics.forEach(function(e){e.equipped&&e.itemDropBonus&&(t+=e.itemDropBonus)}),Math.min(.5,parseFloat(t.toFixed(3)))}function p(e){let t=.03;return e.skills&&e.skills.forEach(function(e){e.unlocked&&(e.id===`luck_gem_1`&&(t+=.12),e.id===`luck_infinite`&&e.level&&(t+=.02*e.level))}),e.relics&&e.relics.forEach(function(e){e.equipped&&e.gemDropBonus&&(t+=e.gemDropBonus)}),Math.min(.4,parseFloat(t.toFixed(3)))}function m(e){let t=.5;return e.skills&&e.skills.forEach(function(e){e.unlocked&&(e.id===`fortune_idle`&&(t+=.5*(e.level||1)),e.id===`overdrive_zenith`&&(t+=.05*(e.level||1)),e.id===`luck_offline`&&(t+=.2),e.id===`luck_infinite`&&e.level&&(t+=.03*e.level))}),e.pets&&e.pets.night_owl&&e.pets.night_owl.level&&(t+=e.pets.night_owl.level*.05),e.gemShopItems&&e.gemShopItems.some(function(e){return e.id===`gem_offline_boost`&&e.purchased})&&(t+=.35),e.relics&&e.relics.forEach(function(e){e.equipped&&e.offlineBonus&&(t+=e.offlineBonus)}),e.gamePasses&&(e.gamePasses.pass_offline_24h||e.gamePasses.pass_ultimate_bundle)&&(t+=.5),Math.min(1,parseFloat(t.toFixed(2)))}function h(e){if(!e.achievements)return 0;let t=e.achievements.filter(function(e){return e.unlocked}).length;return parseFloat((t*.5).toFixed(1))}function g(e){return{bossDamageMultiplier:d(e),itemDropChance:f(e),gemDropChance:p(e),offlineEfficiency:m(e),achievementBuffPercent:h(e)}}function _(){return d(u())}function v(){return f(u())}function y(){return p(u())}function b(){return m(u())}function x(){return h(u())}function S(){return g(u())}typeof window<`u`&&(window.Bonuses={getBossDamageMultiplier:_,getItemDropChance:v,getGemDropChance:y,getOfflineEfficiency:b,getAchievementBuffPercent:x,getAllBonuses:S}),(function(e){let t=null;function n(){if(!t&&typeof window<`u`){let e=window.AudioContext||window.webkitAudioContext;e&&(t=new e)}return t&&t.state===`suspended`&&t.resume().catch(function(){}),t}function r(t){let n=e.GameState&&e.GameState.get?e.GameState.get():null;if(n&&n.settings&&!n.settings.sfxEnabled)return 0;let r=n&&n.settings&&n.settings.sfxVolume!==void 0?n.settings.sfxVolume:.5;return(t||.25)*r}function i(e){let t=n();if(!t)return;let i=r(e?.35:.22);if(!(i<=0))try{let n=t.currentTime,r=t.createBiquadFilter();r.type=`lowpass`,r.frequency.setValueAtTime(e?2200:1350,n),r.Q.setValueAtTime(1.2,n);let a=t.createGain();a.gain.setValueAtTime(i,n),a.gain.exponentialRampToValueAtTime(1e-4,n+(e?.16:.08));let o=t.createOscillator();o.type=e?`triangle`:`sine`,o.frequency.setValueAtTime(e?580:340,n),o.frequency.exponentialRampToValueAtTime(e?1100:160,n+(e?.12:.06));let s=t.createOscillator(),c=t.createGain();if(s.type=`sine`,s.frequency.setValueAtTime(135,n),s.frequency.exponentialRampToValueAtTime(55,n+.07),c.gain.setValueAtTime(.35,n),c.gain.exponentialRampToValueAtTime(1e-4,n+.07),o.connect(r),s.connect(c),c.connect(r),r.connect(a),a.connect(t.destination),o.start(n),o.stop(n+.14),s.start(n),s.stop(n+.08),e){let e=t.createOscillator(),r=t.createGain();e.type=`sine`,e.frequency.setValueAtTime(1250,n),e.frequency.exponentialRampToValueAtTime(1880,n+.14),r.gain.setValueAtTime(i*.45,n),r.gain.exponentialRampToValueAtTime(1e-4,n+.15),e.connect(r),r.connect(t.destination),e.start(n),e.stop(n+.15)}}catch{}}function a(e){let t=n();if(!t)return;let i=r(.28);if(!(i<=0))try{let n=t.currentTime,r=[311.13,349.23,392,440,466.16,523.25],a=r[((e||1)-1)%r.length]||349.23,o=a*1.4983,s=a*2,c=t.createBiquadFilter();c.type=`lowpass`,c.frequency.setValueAtTime(1800,n),c.Q.setValueAtTime(1.5,n);let l=t.createGain();l.gain.setValueAtTime(.001,n),l.gain.linearRampToValueAtTime(i,n+.02),l.gain.exponentialRampToValueAtTime(1e-4,n+.26);let u=t.createOscillator();u.type=`triangle`,u.frequency.setValueAtTime(a,n);let d=t.createOscillator();d.type=`sine`,d.frequency.setValueAtTime(o,n+.02);let f=t.createOscillator(),p=t.createGain();f.type=`sine`,f.frequency.setValueAtTime(s,n+.04),p.gain.setValueAtTime(.35,n),u.connect(c),d.connect(c),f.connect(p),p.connect(c),c.connect(l),l.connect(t.destination),u.start(n),u.stop(n+.28),d.start(n+.02),d.stop(n+.28),f.start(n+.04),f.stop(n+.28)}catch{}}function o(){let e=n();if(!e)return;let t=r(.38);if(!(t<=0))try{let n=e.currentTime;[261.63,329.63,392,523.25].forEach(function(r,i){let a=n+i*.075,o=e.createOscillator(),s=e.createGain();o.type=i===3?`sine`:`triangle`,o.frequency.setValueAtTime(r,a),s.gain.setValueAtTime(.001,a),s.gain.linearRampToValueAtTime(t*(1-i*.1),a+.03),s.gain.exponentialRampToValueAtTime(1e-4,a+.65),o.connect(s),s.connect(e.destination),o.start(a),o.stop(a+.7)});let r=e.createOscillator(),i=e.createGain();r.type=`sine`,r.frequency.setValueAtTime(65.41,n),i.gain.setValueAtTime(t*.5,n),i.gain.exponentialRampToValueAtTime(1e-4,n+.85),r.connect(i),i.connect(e.destination),r.start(n),r.stop(n+.9)}catch{}}function s(e,t,i,a,o){let s=n();if(!s)return;let c=r(a);if(!(c<=0))try{let n=s.currentTime,r=s.createOscillator(),a=s.createGain();r.type=t||`sine`,r.frequency.setValueAtTime(e,n),o&&r.frequency.exponentialRampToValueAtTime(o,n+i),a.gain.setValueAtTime(c,n),a.gain.exponentialRampToValueAtTime(1e-4,n+i),r.connect(a),a.connect(s.destination),r.start(n),r.stop(n+i)}catch{}}function c(){let t=e.GameState&&e.GameState.get?e.GameState.get():null;return t&&t.settings?!t.settings.sfxEnabled:!1}function l(t){let n=e.GameState&&e.GameState.get?e.GameState.get():null;n&&n.settings&&(n.settings.sfxEnabled=!t,e.GameState.save&&e.GameState.save(),f())}function u(){let t=e.GameState&&e.GameState.get?e.GameState.get():null;return t&&t.settings?(t.settings.sfxEnabled=!t.settings.sfxEnabled,e.GameState.save&&e.GameState.save(),f(),!t.settings.sfxEnabled):!1}function d(t){let n=e.GameState&&e.GameState.get?e.GameState.get():null;n&&n.settings&&(n.settings.sfxVolume=Math.max(0,Math.min(1,t)),e.GameState.save&&e.GameState.save())}function f(){let t=c(),n=!e.I18n||e.I18n.getLang()===`vi`,r=document.getElementById(`headerMuteBtn`);r&&(r.innerHTML=t?`<span style="font-size: 1rem; color: #f43f5e;">🔇</span>`:`<span style="font-size: 1rem; color: #38bdf8;">🔊</span>`,r.title=t?n?`Bật âm thanh / Unmute`:`Unmute sound`:n?`Tắt tiếng / Mute`:`Mute sound`,r.classList.toggle(`is-muted`,t));let i=document.getElementById(`quickMuteBtn`);i&&(i.className=`nx-btn `+(t?`nx-btn-danger`:`nx-btn-secondary`),i.innerHTML=t?n?`🔇 Đã Tắt Tiếng`:`🔇 Muted`:n?`🔊 Đang Bật`:`🔊 Sound ON`)}e.Sound={isMuted:c,setMuted:l,toggleMute:u,setVolume:d,updateIcons:f,playClick:i,playCrit:function(){i(!0)},playUpgrade:a,playLevelUp:o,playAchievement:function(){s(523.25,`sine`,.12,.4),setTimeout(function(){s(659.25,`sine`,.12,.4)},90),setTimeout(function(){s(783.99,`sine`,.15,.4)},180),setTimeout(function(){s(1046.5,`triangle`,.35,.5,1318.51)},270)},playBossHit:function(){s(130,`sawtooth`,.1,.25,65)},playBossDefeat:function(){s(160,`sawtooth`,.35,.45,45),setTimeout(function(){o()},150)},playDailyClaim:function(){[440,554.37,659.25,880].forEach(function(e,t){setTimeout(function(){s(e,`sine`,.25,.35)},t*80)})},playQuestComplete:function(){s(587.33,`triangle`,.12,.35),setTimeout(function(){s(739.99,`triangle`,.14,.38)},80),setTimeout(function(){s(880,`sine`,.3,.45)},160)},playModalOpen:function(){s(320,`sine`,.08,.18,480)},playModalClose:function(){s(450,`sine`,.08,.15,260)},playError:function(){s(180,`sawtooth`,.14,.2,100)},playAutoClickTick:function(){s(660,`sine`,.035,.12,880)}}})(typeof window<`u`?window:void 0);function C(e){return typeof e!=`object`||!e?e:JSON.parse(JSON.stringify(e))}var w=[{id:`void_siphon`,name:`Void Siphon`,desc:`Trích xuất vật chất tối xung quanh khe nứt không gian.`,baseCost:15,costMultiplier:1.15,level:0,baseEffect:1,effectType:`cps`,unlockedAtLevel:1,icon:`zap`},{id:`astral_prism`,name:`Astral Prism`,desc:`Hội tụ các tia vũ trụ để khuếch đại lực click trực tiếp.`,baseCost:50,costMultiplier:1.18,level:0,baseEffect:2,effectType:`click`,unlockedAtLevel:1,icon:`sparkles`},{id:`nebula_harvester`,name:`Nebula Harvester`,desc:`Thu gom bụi sao từ các tinh vân lân cận.`,baseCost:250,costMultiplier:1.15,level:0,baseEffect:8,effectType:`cps`,unlockedAtLevel:2,icon:`cloud-lightning`},{id:`starlight_forge`,name:`Starlight Forge`,desc:`Tổng hợp tinh thể astral bằng nhiệt độ siêu sao.`,baseCost:1200,costMultiplier:1.14,level:0,baseEffect:35,effectType:`cps`,unlockedAtLevel:3,icon:`flame`},{id:`dimensional_drill`,name:`Dimensional Drill`,desc:`Khoan thủng không thời gian để rút cạn bản chất vực thẳm.`,baseCost:7500,costMultiplier:1.14,level:0,baseEffect:25,effectType:`click`,unlockedAtLevel:4,icon:`disc`},{id:`quantum_reactor`,name:`Quantum Reactor`,desc:`Phân hạch đồng vị hư không giải phóng năng lượng liên tục.`,baseCost:45e3,costMultiplier:1.13,level:0,baseEffect:260,effectType:`cps`,unlockedAtLevel:5,icon:`atom`},{id:`celestial_dynamo`,name:`Celestial Dynamo`,desc:`Khai thác sóng hấp dẫn quỹ đạo để sản sinh năng lượng vô tận.`,baseCost:32e4,costMultiplier:1.13,level:0,baseEffect:1800,effectType:`cps`,unlockedAtLevel:7,icon:`orbit`},{id:`singularity_core`,name:`Singularity Core`,desc:`Một lỗ đen thu nhỏ tạo ra nguồn năng lượng kinh hoàng.`,baseCost:25e5,costMultiplier:1.12,level:0,baseEffect:12e3,effectType:`cps`,unlockedAtLevel:10,icon:`sun`},{id:`chrono_accelerator`,name:`Chrono Accelerator`,desc:`Uốn cong thời gian địa phương để tăng tốc mọi cú chạm.`,baseCost:2e7,costMultiplier:1.12,level:0,baseEffect:350,effectType:`click`,unlockedAtLevel:12,icon:`clock`},{id:`nexyroth_obelisk`,name:`Nexyroth Obelisk`,desc:`Đài tưởng niệm cổ xưa truyền dẫn vực thẳm nguyên thuỷ.`,baseCost:15e7,costMultiplier:1.11,level:0,baseEffect:11e4,effectType:`cps`,unlockedAtLevel:15,icon:`shield`},{id:`pulsar_array`,name:`Pulsar Array`,desc:`Mạng lưới sao xung phát xạ xung nhịp năng lượng cao.`,baseCost:12e8,costMultiplier:1.11,level:0,baseEffect:85e4,effectType:`cps`,unlockedAtLevel:18,icon:`radio`},{id:`dark_matter_collider`,name:`Dark Matter Collider`,desc:`Máy gia tốc va chạm các hạt vật chất đen bí ẩn.`,baseCost:95e8,costMultiplier:1.11,level:0,baseEffect:2500,effectType:`click`,unlockedAtLevel:20,icon:`crosshair`},{id:`event_horizon_gate`,name:`Event Horizon Gate`,desc:`Cổng chân trời sự kiện hút năng lượng từ đa vũ trụ.`,baseCost:75e9,costMultiplier:1.1,level:0,baseEffect:62e5,effectType:`cps`,unlockedAtLevel:22,icon:`portal`},{id:`astral_warp_engine`,name:`Astral Warp Engine`,desc:`Động cơ bẻ cong thực tại, gia tăng uy lực tối hậu.`,baseCost:6e11,costMultiplier:1.1,level:0,baseEffect:18e3,effectType:`click`,unlockedAtLevel:25,icon:`fast-forward`},{id:`supernova_chamber`,name:`Supernova Chamber`,desc:`Buồng giam giữ vụ nổ siêu tân tinh giải phóng vô lượng quang.`,baseCost:5e12,costMultiplier:1.1,level:0,baseEffect:48e6,effectType:`cps`,unlockedAtLevel:28,icon:`star`},{id:`antimatter_forge`,name:`Antimatter Forge`,desc:`Lò rèn phản vật chất chuyển hóa 100% khối lượng thành năng lượng.`,baseCost:42e12,costMultiplier:1.09,level:0,baseEffect:39e7,effectType:`cps`,unlockedAtLevel:32,icon:`zap`},{id:`tachyon_condenser`,name:`Tachyon Condenser`,desc:`Ngưng tụ các hạt nhanh hơn ánh sáng để rút ngắn khoảng cách thu thập.`,baseCost:36e13,costMultiplier:1.09,level:0,baseEffect:12e4,effectType:`click`,unlockedAtLevel:36,icon:`feather`},{id:`gamma_ray_funnel`,name:`Gamma Ray Funnel`,desc:`Phễu hội tụ các chớp tia gamma huỷ diệt từ hố đen trung tâm.`,baseCost:0xb036efecdc000,costMultiplier:1.09,level:0,baseEffect:32e8,effectType:`cps`,unlockedAtLevel:40,icon:`target`},{id:`hypercube_matrix`,name:`Hypercube Matrix`,desc:`Ma trận siêu lập phương 4 chiều lưu trữ dung lượng vô hạn.`,baseCost:0x6379da05b60000,costMultiplier:1.08,level:0,baseEffect:28e9,effectType:`cps`,unlockedAtLevel:45,icon:`box`},{id:`void_monolith`,name:`Void Monolith`,desc:`Cột đá hư không khắc cổ ngữ ma pháp cổ xưa nhất.`,baseCost:0x3782dace9d90000,costMultiplier:1.08,level:0,baseEffect:85e4,effectType:`click`,unlockedAtLevel:50,icon:`award`},{id:`cosmic_string_weaver`,name:`Cosmic String Weaver`,desc:`Dệt các sợi dây vũ trụ để rung động toàn thể thực tại.`,baseCost:0x1e87f85809dc0000,costMultiplier:1.08,level:0,baseEffect:25e10,effectType:`cps`,unlockedAtLevel:55,icon:`activity`},{id:`multiverse_gateway`,name:`Multiverse Gateway`,desc:`Cổng đa vũ trụ nối liền 100 thực tại song song cùng khai thác.`,baseCost:0x1158e460913d00000,costMultiplier:1.08,level:0,baseEffect:22e11,effectType:`cps`,unlockedAtLevel:60,icon:`share-2`},{id:`infinity_prism`,name:`Infinity Prism`,desc:`Lăng kính vô cực khúc xạ ánh sáng nguyên sơ thành thực tại thuần khiết.`,baseCost:0x9c2007651b2500000,costMultiplier:1.07,level:0,baseEffect:65e5,effectType:`click`,unlockedAtLevel:65,icon:`triangle`},{id:`entropy_nullifier`,name:`Entropy Nullifier`,desc:`Bộ triệt tiêu nhiệt dịch entropy đảo ngược quy luật tàn lụi vũ trụ.`,baseCost:16e20,costMultiplier:1.07,level:0,baseEffect:21e12,effectType:`cps`,unlockedAtLevel:70,icon:`anchor`},{id:`primordial_crucible`,name:`Primordial Crucible`,desc:`Vạc nung nguyên thuỷ nấu chảy các vì sao tạo thành bản chất Nexyroth.`,baseCost:15e21,costMultiplier:1.07,level:0,baseEffect:0xb159f9bb3000,effectType:`cps`,unlockedAtLevel:75,icon:`coffee`},{id:`genesis_conduit`,name:`Genesis Conduit`,desc:`Đường dẫn sáng thế truyền sức mạnh từ thời khắc Big Bang.`,baseCost:14e22,costMultiplier:1.07,level:0,baseEffect:5e7,effectType:`click`,unlockedAtLevel:80,icon:`cpu`},{id:`celestial_foundry`,name:`Celestial Foundry`,desc:`Lò đúc thiên thần tạo tác các khối tinh thể thần thánh.`,baseCost:13e23,costMultiplier:1.07,level:0,baseEffect:0x6651728988000,effectType:`cps`,unlockedAtLevel:82,icon:`layers`},{id:`omniversal_tether`,name:`Omniversal Tether`,desc:`Dây thừng toàn năng liên kết mọi chiều không gian.`,baseCost:12e24,costMultiplier:1.07,level:0,baseEffect:17e7,effectType:`click`,unlockedAtLevel:84,icon:`link`},{id:`eternity_furnace`,name:`Eternity Furnace`,desc:`Lò thiêu vĩnh cửu đốt cháy thời gian để tạo năng lượng bất tận.`,baseCost:11e25,costMultiplier:1.06,level:0,baseEffect:0x3a9ea99ecb4000,effectType:`cps`,unlockedAtLevel:86,icon:`zap`},{id:`astral_monarch_throne`,name:`Throne of the Void King`,desc:`Ngai vàng chúa tể hư không tập trung quyền năng thống trị muôn loài.`,baseCost:1e27,costMultiplier:1.06,level:0,baseEffect:15e8,effectType:`click`,unlockedAtLevel:88,icon:`shield`},{id:`void_god_temple`,name:`Void Deity Temple`,desc:`Đền thờ thần hư không nơi các tín đồ dâng hiến linh hồn.`,baseCost:9e28,costMultiplier:1.06,level:0,baseEffect:0x226abadc42f8000,effectType:`cps`,unlockedAtLevel:90,icon:`home`},{id:`astral_hyperdrive`,name:`Astral Hyperdrive`,desc:`Bộ siêu dẫn truyền tải tức thời qua các cõi hư vô.`,baseCost:85e28,costMultiplier:1.06,level:0,baseEffect:0x136dcc951d8c0000,effectType:`cps`,unlockedAtLevel:92,icon:`wind`},{id:`chrono_collapse_device`,name:`Chrono Collapse Device`,desc:`Thiết bị sụp đổ thời gian nén 1 triệu năm vào 1 giây.`,baseCost:8e30,costMultiplier:1.06,level:0,baseEffect:12e9,effectType:`click`,unlockedAtLevel:94,icon:`clock`},{id:`divine_light_beacon`,name:`Divine Light Beacon`,desc:`Ngọn hải đăng ánh sáng thần thánh xua tan bóng tối muôn đời.`,baseCost:75e30,costMultiplier:1.05,level:0,baseEffect:0xb469471f80140000,effectType:`cps`,unlockedAtLevel:96,icon:`sun`},{id:`seraphim_sanctuary`,name:`Seraphim Sanctuary`,desc:`Thánh địa hộ vệ lục dực đại thiên thần ban phước lành.`,baseCost:7e32,costMultiplier:1.05,level:0,baseEffect:0x68155a43676e00000,effectType:`cps`,unlockedAtLevel:98,icon:`heart`},{id:`celestial_zenith`,name:`Celestial Zenith`,desc:`Đỉnh cao thiên giới hội tụ muôn vàn quy luật vũ trụ.`,baseCost:65e32,costMultiplier:1.05,level:0,baseEffect:95e9,effectType:`click`,unlockedAtLevel:100,icon:`star`},{id:`nirvana_spire`,name:`Nirvana Spire`,desc:`Ngọn tháp Niết Bàn siêu việt mọi khổ đau và giới hạn tồn tại.`,baseCost:6e34,costMultiplier:1.05,level:0,baseEffect:11e20,effectType:`cps`,unlockedAtLevel:102,icon:`compass`},{id:`endless_dominion`,name:`Endless Dominion`,desc:`Lãnh thổ vô tận của bậc chí tôn toàn tri toàn năng.`,baseCost:55e34,costMultiplier:1.05,level:0,baseEffect:1e22,effectType:`cps`,unlockedAtLevel:105,icon:`map`},{id:`primordial_click_core`,name:`Click of Creation`,desc:`Cú chạm tạo tác mở ra toàn thể đa thực tại mới.`,baseCost:5e36,costMultiplier:1.05,level:0,baseEffect:85e10,effectType:`click`,unlockedAtLevel:108,icon:`zap`},{id:`omega_singularity`,name:`Omega Singularity`,desc:`Điểm kỳ dị Omega hợp nhất mọi nguồn năng lượng vào hư vô tuyệt đối.`,baseCost:45e36,costMultiplier:1.05,level:0,baseEffect:95e21,effectType:`cps`,unlockedAtLevel:110,icon:`radio`},{id:`nexyroth_sovereign`,name:`Nexyroth Sovereign God`,desc:`Sự thức tỉnh hoàn toàn của Nexyroth - Đấng Tối Thượng Vũ Trụ!`,baseCost:4e38,costMultiplier:1.04,level:0,baseEffect:9e23,effectType:`cps`,unlockedAtLevel:115,icon:`crown`}],T=[{id:`core`,name:`Astral Core`,nameVi:`Trái Tim Tinh Vân`,branch:`core`,branchNameVi:`Lõi Tinh Vân`,x:50,y:50,requires:[],maxLevel:1,costPoints:0,unlocked:!0,level:1,icon:`core`,descVi:`Trái tim của hệ thống Tinh Vân. Cội nguồn liên kết mọi chòm sao vũ trụ.`,descEn:`The Astral Core. Center and origin of all cosmic constellations.`,effectType:`core`,effectPerLevel:0},{id:`chrono_pulse`,name:`Astral Pulse`,nameVi:`Xung Nhịp Astral`,branch:`chrono`,branchNameVi:`Chrono & Tốc Độ`,x:35,y:50,requires:[`core`],maxLevel:5,costPoints:1,unlocked:!1,level:0,icon:`zap`,descVi:`Tăng +10% sản lượng CPS tự động mỗi cấp.`,descEn:`+10% passive CPS per level.`,effectType:`cps`,effectPerLevel:.1},{id:`chrono_warp`,name:`Time Warp`,nameVi:`Gia Tốc Thời Gian`,branch:`chrono`,branchNameVi:`Chrono & Tốc Độ`,x:23,y:38,requires:[`chrono_pulse`],maxLevel:3,costPoints:2,unlocked:!1,level:0,icon:`clock`,descVi:`Tăng tốc độ bấm tự động thêm +15% mỗi cấp.`,descEn:`+15% auto-click speed per level.`,effectType:`autoSpeed`,effectPerLevel:.15},{id:`chrono_overclock`,name:`Overclock Engine`,nameVi:`Động Cơ Quá Tải`,branch:`chrono`,branchNameVi:`Chrono & Tốc Độ`,x:23,y:62,requires:[`chrono_pulse`],maxLevel:2,costPoints:3,unlocked:!1,level:0,icon:`activity`,descVi:`Tăng +25% thời lượng duy trì các bùa lợi và tăng tốc Lõi.`,descEn:`+25% buff duration and core overclock.`,effectType:`buffDuration`,effectPerLevel:.25},{id:`chrono_infinity`,name:`Chronos Infinity`,nameVi:`Vô Hạn Thời Gian (Capstone)`,branch:`chrono`,branchNameVi:`Chrono & Tốc Độ`,x:10,y:50,requires:[`chrono_warp`,`chrono_overclock`],maxLevel:1,costPoints:5,unlocked:!1,level:0,icon:`hourglass`,descVi:`Giảm 50% thời gian hồi chiêu của toàn bộ kỹ năng kích hoạt (Overload, Surge, Warp).`,descEn:`Reduce cooldowns of all active abilities by 50%.`,effectType:`cooldown`,effectPerLevel:.5},{id:`crit_focus`,name:`Starlight Focus`,nameVi:`Tiêu Điểm Tinh Tú`,branch:`crit`,branchNameVi:`Dimensional Crits`,x:65,y:50,requires:[`core`],maxLevel:3,costPoints:1,unlocked:!1,level:0,icon:`crosshair`,descVi:`Tăng +5% Tỉ lệ Bạo Kích (Crit Chance) mỗi cấp.`,descEn:`+5% Critical Strike Chance per level.`,effectType:`critChance`,effectPerLevel:.05},{id:`crit_supernova`,name:`Supernova Burst`,nameVi:`Bùng Nổ Siêu Tân Tinh`,branch:`crit`,branchNameVi:`Dimensional Crits`,x:77,y:38,requires:[`crit_focus`],maxLevel:3,costPoints:2,unlocked:!1,level:0,icon:`flame`,descVi:`Tăng +100% Sát thương Bạo Kích (Crit Damage) mỗi cấp.`,descEn:`+100% Critical Damage per level.`,effectType:`critDamage`,effectPerLevel:1},{id:`crit_chain`,name:`Chain Reaction`,nameVi:`Phản Ứng Dây Chuyền`,branch:`crit`,branchNameVi:`Dimensional Crits`,x:77,y:62,requires:[`crit_focus`],maxLevel:2,costPoints:3,unlocked:!1,level:0,icon:`disc`,descVi:`Mỗi cú Click Bạo Kích gây thêm +35% sát thương và tăng tiến trình combo.`,descEn:`Critical clicks deal +35% bonus damage and build combo.`,effectType:`clickPower`,effectPerLevel:.35},{id:`crit_collapse`,name:`Singularity Collapse`,nameVi:`Sụp Đổ Kỳ Dị (Capstone)`,branch:`crit`,branchNameVi:`Dimensional Crits`,x:90,y:50,requires:[`crit_supernova`,`crit_chain`],maxLevel:1,costPoints:5,unlocked:!1,level:0,icon:`sun`,descVi:`Mọi cú Click Bạo Kích đều nhân x2 lượng tài nguyên Năng Lượng thu được từ toàn bộ nguồn.`,descEn:`All Critical Clicks double (x2) total Essence harvested.`,effectType:`critMultiplier`,effectPerLevel:2},{id:`fortune_dust`,name:`Star Dust Collector`,nameVi:`Máy Gom Bụi Sao`,branch:`fortune`,branchNameVi:`Cosmic Fortune`,x:50,y:65,requires:[`core`],maxLevel:3,costPoints:1,unlocked:!1,level:0,icon:`cloud-lightning`,descVi:`Tăng +20% lượng Astral Shards nhận được khi Thăng Thiên / Trùng Sinh mỗi cấp.`,descEn:`+20% Astral Shards from Ascension per level.`,effectType:`shardBonus`,effectPerLevel:.2},{id:`fortune_meteor`,name:`Meteor Shower`,nameVi:`Mưa Sao Băng`,branch:`fortune`,branchNameVi:`Cosmic Fortune`,x:39,y:77,requires:[`fortune_dust`],maxLevel:3,costPoints:2,unlocked:!1,level:0,icon:`sparkles`,descVi:`Tăng tần suất xuất hiện của Sao Băng và Khe Nứt Vũ Trụ thêm +30% mỗi cấp.`,descEn:`+30% Meteor & Cosmic Rift spawn rate per level.`,effectType:`eventFreq`,effectPerLevel:.3},{id:`fortune_idle`,name:`Deep Space Idle`,nameVi:`Treo Máy Không Gian`,branch:`fortune`,branchNameVi:`Cosmic Fortune`,x:61,y:77,requires:[`fortune_dust`],maxLevel:2,costPoints:3,unlocked:!1,level:0,icon:`moon`,descVi:`Tăng sản lượng thu thập ngoại tuyến / AFK thêm +50% mỗi cấp.`,descEn:`+50% Offline/AFK collection efficiency per level.`,effectType:`offlineEff`,effectPerLevel:.5},{id:`fortune_market`,name:`Galaxy Black Market`,nameVi:`Chợ Đen Thiên Hà (Capstone)`,branch:`fortune`,branchNameVi:`Cosmic Fortune`,x:50,y:89,requires:[`fortune_meteor`,`fortune_idle`],maxLevel:1,costPoints:5,unlocked:!1,level:0,icon:`coins`,descVi:`Giảm 15% giá mua tất cả các công trình nâng cấp trong trạm vũ trụ.`,descEn:`Reduces cost of all core Upgrades by 15%.`,effectType:`costDiscount`,effectPerLevel:.15},{id:`overdrive_synergy`,name:`Dark Matter Synergy`,nameVi:`Hợp Lực Vật Chất Tối`,branch:`overdrive`,branchNameVi:`Cosmic Overdrive`,x:41,y:35,requires:[`core`],maxLevel:5,costPoints:2,unlocked:!1,level:0,icon:`atom`,descVi:`Mỗi điểm SP chưa sử dụng sẽ tự động tăng +1% tổng sản lượng CPS mỗi cấp.`,descEn:`Each unspent SP automatically boosts total CPS by +1% per level.`,effectType:`spSynergy`,effectPerLevel:.01},{id:`overdrive_horizon`,name:`Event Horizon`,nameVi:`Chân Trời Sự Kiện`,branch:`overdrive`,branchNameVi:`Cosmic Overdrive`,x:59,y:35,requires:[`core`],maxLevel:1,costPoints:4,unlocked:!1,level:0,icon:`portal`,descVi:`Mỗi khi kích hoạt kỹ năng, tăng thêm +50% sản lượng toàn diện trong 30 giây.`,descEn:`Triggering skills boosts all production by +50% for 30s.`,effectType:`skillSurge`,effectPerLevel:.5},{id:`overdrive_zenith`,name:`Cosmic Zenith`,nameVi:`Thiên Đỉnh Vô Hạn`,branch:`overdrive`,branchNameVi:`Cosmic Overdrive`,x:50,y:17,requires:[`overdrive_synergy`,`overdrive_horizon`],maxLevel:999,costPoints:3,unlocked:!1,level:0,isInfinite:!0,icon:`crown`,descVi:`Mỗi cấp tăng thêm +5% cho toàn bộ Click Power, CPS, Crit và May Mắn. Nâng cấp vô hạn!`,descEn:`+5% to all Click, CPS, Crit and Luck per level. Infinite leveling!`,effectType:`allZenith`,effectPerLevel:.05}],E=[{id:`relic_eye`,name:`Eye of the Astral Seer`,rarity:`rare`,effectDesc:`+15% Direct Click Power and +5% Critical Chance`,equipped:!0,clickBonus:.15,cpsBonus:0,critBonus:.05,icon:`eye`},{id:`relic_hourglass`,name:`Hourglass of Infinity`,rarity:`epic`,effectDesc:`+25% Passive Cosmic Generation (CPS)`,equipped:!0,clickBonus:0,cpsBonus:.25,critBonus:0,icon:`hourglass`},{id:`relic_heart`,name:`Heart of Nexyroth`,rarity:`legendary`,effectDesc:`+40% Direct Click and +40% Passive CPS`,equipped:!1,clickBonus:.4,cpsBonus:.4,critBonus:.1,icon:`heart`},{id:`relic_giant_hammer`,name:`Búa Chiến Người Khổng Lồ`,rarity:`legendary`,effectDesc:`+50% Sát Thương Lên Boss Khủng`,equipped:!1,clickBonus:.1,cpsBonus:0,critBonus:0,bossDamageBonus:.5,icon:`hammer`},{id:`relic_lucky_coin`,name:`Đồng Xu May Mắn`,rarity:`epic`,effectDesc:`+25% Tỉ Lệ Rơi Kim Cương (Gems)`,equipped:!1,clickBonus:0,cpsBonus:0,critBonus:0,gemDropBonus:.25,icon:`coins`},{id:`relic_treasure_radar`,name:`Radar Dò Kho Báu`,rarity:`rare`,effectDesc:`+30% Tỉ Lệ Rơi Item & Thuốc Quý`,equipped:!1,clickBonus:0,cpsBonus:0,critBonus:0,itemDropBonus:.3,icon:`compass`},{id:`relic_void_crown`,name:`Vương Miện Hư Không`,rarity:`epic`,effectDesc:`+30% Click Power và +10% Boss Damage`,equipped:!1,clickBonus:.3,cpsBonus:0,critBonus:.03,bossDamageBonus:.1,icon:`crown`},{id:`relic_starlight_boots`,name:`Hài Tinh Tú`,rarity:`rare`,effectDesc:`+20% CPS và +10% Offline Earnings`,equipped:!1,clickBonus:0,cpsBonus:.2,critBonus:0,offlineBonus:.1,icon:`feather`},{id:`relic_eclipse_amulet`,name:`Bùa Nhật Thực`,rarity:`epic`,effectDesc:`+8% Crit Chance và +35% Crit Damage`,equipped:!1,clickBonus:.05,cpsBonus:.05,critBonus:.08,icon:`moon`},{id:`relic_singularity_ring`,name:`Nhẫn Điểm Kỳ Dị`,rarity:`mythic`,effectDesc:`+50% Click Power và +50% CPS`,equipped:!1,clickBonus:.5,cpsBonus:.5,critBonus:.05,icon:`disc`},{id:`relic_nebula_cloak`,name:`Áo Choàng Tinh Vân`,rarity:`rare`,effectDesc:`+25% CPS và +15% Item Drop`,equipped:!1,clickBonus:0,cpsBonus:.25,critBonus:0,itemDropBonus:.15,icon:`shield`},{id:`relic_ancient_tome`,name:`Sách Cổ Khe Nứt`,rarity:`epic`,effectDesc:`+20% Tất Cả Thuốc và +20% Shards`,equipped:!1,clickBonus:.15,cpsBonus:.15,critBonus:.02,icon:`book`},{id:`relic_divine_orb`,name:`Quả Cầu Ánh Sáng Thần`,rarity:`legendary`,effectDesc:`+45% Boss Damage và +20% Gem Drop`,equipped:!1,clickBonus:.2,cpsBonus:.2,critBonus:.05,bossDamageBonus:.45,gemDropBonus:.2,icon:`sun`},{id:`relic_shadow_blade`,name:`Hắc Ma Đao`,rarity:`epic`,effectDesc:`+35% Click Power và +30% Boss Damage`,equipped:!1,clickBonus:.35,cpsBonus:0,critBonus:.05,bossDamageBonus:.3,icon:`crosshair`},{id:`relic_celestial_compass`,name:`La Bàn Thiên Hà`,rarity:`rare`,effectDesc:`+15% CPS và +15% Offline Efficiency`,equipped:!1,clickBonus:0,cpsBonus:.15,critBonus:0,offlineBonus:.15,icon:`compass`},{id:`relic_phoenix_feather`,name:`Lông Phượng Hoàng Tinh Tú`,rarity:`legendary`,effectDesc:`+30% CPS và tự động tích luỹ năng lượng`,equipped:!1,clickBonus:.1,cpsBonus:.3,critBonus:.04,icon:`wind`},{id:`relic_dragon_scale`,name:`Vảy Rồng Hư Không`,rarity:`legendary`,effectDesc:`+40% Sát Thương Boss và +15% Click`,equipped:!1,clickBonus:.15,cpsBonus:0,critBonus:.06,bossDamageBonus:.4,icon:`shield`},{id:`relic_chrono_crystal`,name:`Pha Lê Thời Gian`,rarity:`epic`,effectDesc:`+25% Thời Lượng Buff và +20% CPS`,equipped:!1,clickBonus:0,cpsBonus:.2,critBonus:.03,icon:`clock`},{id:`relic_abyssal_mirror`,name:`Gương Phản Chiếu Vực Thẳm`,rarity:`rare`,effectDesc:`+20% Click Power và +10% Crit Chance`,equipped:!1,clickBonus:.2,cpsBonus:0,critBonus:.1,icon:`layers`},{id:`relic_cosmic_dice`,name:`Xúc Xắc Vận Mệnh`,rarity:`epic`,effectDesc:`+20% Gem Drop và +20% Item Drop`,equipped:!1,clickBonus:.05,cpsBonus:.05,critBonus:.02,gemDropBonus:.2,itemDropBonus:.2,icon:`box`},{id:`relic_primordial_bell`,name:`Chuông Ngân Nguyên Thuỷ`,rarity:`legendary`,effectDesc:`+35% Toàn Bộ Thu Hoạch và +15% Shards`,equipped:!1,clickBonus:.35,cpsBonus:.35,critBonus:.05,icon:`bell`},{id:`relic_eternity_chain`,name:`Xích Vĩnh Cửu`,rarity:`rare`,effectDesc:`+18% Boss Damage và +15% CPS`,equipped:!1,clickBonus:0,cpsBonus:.15,critBonus:.02,bossDamageBonus:.18,icon:`link`},{id:`relic_quasar_core`,name:`Lõi Quasar`,rarity:`mythic`,effectDesc:`+60% CPS và +40% Click Power`,equipped:!1,clickBonus:.4,cpsBonus:.6,critBonus:.08,icon:`sun`},{id:`relic_spirit_flute`,name:`Sáo Tinh Linh`,rarity:`rare`,effectDesc:`+15% Tốc Độ EXP và +15% CPS`,equipped:!1,clickBonus:0,cpsBonus:.15,critBonus:.02,icon:`music`},{id:`relic_nirvana_lotus`,name:`Hoa Sen Niết Bàn`,rarity:`mythic`,effectDesc:`+70% Sản Lượng và +50% Boss Damage Tối Cường`,equipped:!1,clickBonus:.7,cpsBonus:.7,critBonus:.1,bossDamageBonus:.5,icon:`flower`},{id:`relic_astral_monolith`,name:`Bản Đồ Thiên Cương`,rarity:`epic`,effectDesc:`+30% Offline Earnings và +20% Click Power`,equipped:!1,clickBonus:.2,cpsBonus:0,critBonus:.03,offlineBonus:.3,icon:`map`},{id:`relic_sovereign_ring`,name:`Nhẫn Chúa Tể Nexyroth`,rarity:`mythic`,effectDesc:`+100% Sức Mạnh Toàn Diện và +100% Sát Thương Boss`,equipped:!1,clickBonus:1,cpsBonus:1,critBonus:.15,bossDamageBonus:1,icon:`award`}],D=[{id:`clicks_100`,name:`Tia Lửa Thức Tỉnh`,desc:`Bấm Lõi Nexyroth 100 lần.`,unlocked:!1,rewardGems:1,current:0,target:100,type:`clicks`},{id:`clicks_1000`,name:`Nhịp Đập Hư Không`,desc:`Bấm Lõi Nexyroth 1,000 lần.`,unlocked:!1,rewardGems:2,current:0,target:1e3,type:`clicks`},{id:`clicks_5000`,name:`Bàn Tay Tinh Tú`,desc:`Bấm Lõi Nexyroth 5,000 lần.`,unlocked:!1,rewardGems:3,current:0,target:5e3,type:`clicks`},{id:`clicks_25000`,name:`Thần Bấm Vực Thẳm`,desc:`Bấm Lõi Nexyroth 25,000 lần.`,unlocked:!1,rewardGems:4,current:0,target:25e3,type:`clicks`},{id:`clicks_100k`,name:`Clicker Vô Tận`,desc:`Bấm Lõi Nexyroth 100,000 lần.`,unlocked:!1,rewardGems:6,current:0,target:1e5,type:`clicks`},{id:`essence_10k`,name:`Người Thu Bụi Sao`,desc:`Tích luỹ tổng cộng 10,000 Năng Lượng.`,unlocked:!1,rewardGems:1,current:0,target:1e4,type:`essence`},{id:`essence_1m`,name:`Đại Gia Astral`,desc:`Tích luỹ tổng cộng 1,000,000 Năng Lượng.`,unlocked:!1,rewardGems:2,current:0,target:1e6,type:`essence`},{id:`essence_100m`,name:`Nguyên Khí Tinh Vân`,desc:`Tích luỹ tổng cộng 100,000,000 Năng Lượng.`,unlocked:!1,rewardGems:3,current:0,target:1e8,type:`essence`},{id:`essence_10b`,name:`Chúa Tể Thiên Hà`,desc:`Tích luỹ tổng cộng 10 Tỷ Năng Lượng.`,unlocked:!1,rewardGems:4,current:0,target:1e10,type:`essence`},{id:`essence_1t`,name:`Kho Báu Vô Hạn`,desc:`Tích luỹ tổng cộng 1 Nghìn Tỷ Năng Lượng.`,unlocked:!1,rewardGems:6,current:0,target:0xe8d4a51000,type:`essence`},{id:`level_5`,name:`Bước Chân Đầu Tiên`,desc:`Đạt Cấp độ người chơi 5.`,unlocked:!1,rewardGems:1,current:1,target:5,type:`level`},{id:`level_10`,name:`Học Đồ Phi Thăng`,desc:`Đạt Cấp độ người chơi 10.`,unlocked:!1,rewardGems:2,current:1,target:10,type:`level`},{id:`level_25`,name:`Cao Thủ Vũ Trụ`,desc:`Đạt Cấp độ người chơi 25.`,unlocked:!1,rewardGems:3,current:1,target:25,type:`level`},{id:`level_50`,name:`Đại Tông Sư Tinh Không`,desc:`Đạt Cấp độ người chơi 50.`,unlocked:!1,rewardGems:4,current:1,target:50,type:`level`},{id:`level_100`,name:`Bậc Thầy Tối Cao`,desc:`Đạt Cấp độ người chơi 100.`,unlocked:!1,rewardGems:8,current:1,target:100,type:`level`},{id:`boss_1`,name:`Dũng Sĩ Diệt Titan`,desc:`Hạ gục Boss đầu tiên trong Đấu Trường.`,unlocked:!1,rewardGems:2,current:0,target:1,type:`bosses`},{id:`boss_5`,name:`Thợ Săn Quái Thú`,desc:`Hạ gục 5 Boss trong Đấu Trường.`,unlocked:!1,rewardGems:3,current:0,target:5,type:`bosses`},{id:`boss_15`,name:`Chiến Binh Bất Bại`,desc:`Hạ gục 15 Boss trong Đấu Trường.`,unlocked:!1,rewardGems:4,current:0,target:15,type:`bosses`},{id:`boss_30`,name:`Kẻ Huỷ Diệt Trùm`,desc:`Hạ gục 30 Boss trong Đấu Trường.`,unlocked:!1,rewardGems:6,current:0,target:30,type:`bosses`},{id:`boss_daily`,name:`Thợ Săn Boss Ngày`,desc:`Hạ gục một 👑 Boss Ngày hiếm có.`,unlocked:!1,rewardGems:5,current:0,target:1,type:`boss_daily`},{id:`crits_50`,name:`Điểm Huyệt Chính Xác`,desc:`Gây ra 50 cú đánh Chí Mạng.`,unlocked:!1,rewardGems:1,current:0,target:50,type:`crits`},{id:`crits_500`,name:`Bão Táp Chí Mạng`,desc:`Gây ra 500 cú đánh Chí Mạng.`,unlocked:!1,rewardGems:2,current:0,target:500,type:`crits`},{id:`crits_5000`,name:`Tử Thần Đoạt Mệnh`,desc:`Gây ra 5,000 cú đánh Chí Mạng.`,unlocked:!1,rewardGems:4,current:0,target:5e3,type:`crits`},{id:`upgrades_20`,name:`Nhà Xây Dựng Tinh Cầu`,desc:`Mua 20 lượt nâng cấp.`,unlocked:!1,rewardGems:1,current:0,target:20,type:`upgrades`},{id:`upgrades_100`,name:`Công Trình Đa Tầng`,desc:`Mua 100 lượt nâng cấp.`,unlocked:!1,rewardGems:2,current:0,target:100,type:`upgrades`},{id:`upgrades_500`,name:`Kỳ Quan Cơ Khí`,desc:`Mua 500 lượt nâng cấp.`,unlocked:!1,rewardGems:4,current:0,target:500,type:`upgrades`},{id:`prestige_1`,name:`Vòng Lặp Luân Hồi`,desc:`Thực hiện Tái Sinh (Ascension) lần đầu.`,unlocked:!1,rewardGems:2,current:0,target:1,type:`prestige`},{id:`prestige_3`,name:`Khai Mở Vực Thẳm`,desc:`Thực hiện Thăng Thiên 3 lần (mở Thế Giới 3).`,unlocked:!1,rewardGems:4,current:0,target:3,type:`prestige`},{id:`prestige_6`,name:`Thiên Giới Giáng Thế`,desc:`Thực hiện Thăng Thiên 6 lần (mở Thế Giới 4: Thiên Giới Vĩnh Hằng).`,unlocked:!1,rewardGems:6,current:0,target:6,type:`prestige`},{id:`potions_10`,name:`Nhà Giả Kim Vũ Trụ`,desc:`Sử dụng 10 bình thuốc tăng cường.`,unlocked:!1,rewardGems:2,current:0,target:10,type:`potions_used`},{id:`potions_x100`,name:`Chúa Tể Năng Lượng x100`,desc:`Kích hoạt bình thuốc Chúa Tể Vũ Trụ x100.`,unlocked:!1,rewardGems:5,current:0,target:1,type:`potion_x100`},{id:`skills_5`,name:`Nhà Chiêm Tinh Học`,desc:`Mở khoá 5 kỹ năng trong Cây Chòm Sao.`,unlocked:!1,rewardGems:2,current:0,target:5,type:`skills_unlocked`},{id:`skills_luck_branch`,name:`Ngôi Sao May Mắn`,desc:`Mở khoá nhánh kỹ năng 🍀 Vận May.`,unlocked:!1,rewardGems:3,current:0,target:1,type:`luck_branch`},{id:`relics_4_equipped`,name:`Vũ Trang Tối Cường`,desc:`Trang bị đủ 4 Cổ Vật trên người cùng lúc.`,unlocked:!1,rewardGems:3,current:0,target:4,type:`relics_equipped`},{id:`all_achievements`,name:`Huyền Thoại Nexyroth`,desc:`Mở khóa 30 thành tựu trở lên.`,unlocked:!1,rewardGems:15,current:0,target:30,type:`achievements_count`}],O=[{id:`gem_mult_1`,name:`Void Surge Prism`,desc:`Permanently doubles (x2) all Essence generation across all runs.`,costGems:40,purchased:!1,value:2},{id:`gem_auto_click`,name:`Astral Drone`,desc:`Automatically clicks Core 5 times/sec continuously.`,costGems:60,purchased:!1,value:5},{id:`gem_offline_boost`,name:`Stasis Chamber`,desc:`Offline progress efficiency boosted to 100% full speed.`,costGems:50,purchased:!1,value:1},{id:`gem_crit_overload`,name:`Astral Supernova`,desc:`Permanently boosts Critical Strike Chance by +10% and Power by +200%.`,costGems:70,purchased:!1,value:.1}],k=[{id:`potion_auto_50ms`,type:`auto_50ms`,nameVi:`Thuốc Auto-Click Tinh Tú 50ms`,nameEn:`Hyper-Clicker Potion (50ms)`,icon:`⚡`,duration:300,costGems:15,descVi:`Tự động bấm Lõi 20 lần/giây (50ms/lần) trong 5 phút. Dùng 2 lần cộng dồn thời gian!`,descEn:`Automatically clicks Core every 50ms (20 clicks/sec) for 5 mins. Stacks duration!`},{id:`potion_x2`,type:`x2`,multiplier:2,nameVi:`Thuốc Năng Lượng x2`,nameEn:`Cosmic Elixir x2`,icon:`🧪`,duration:300,costGems:5,descVi:`Nhân x2 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Dùng cùng thuốc khác sẽ cộng dồn (VD: 2+50=52)!`,descEn:`x2 Essence for 5 mins. Stacks duration. Adds with other potions (e.g. 2+50=52)!`},{id:`potion_x5`,type:`x5`,multiplier:5,nameVi:`Thuốc Năng Lượng x5`,nameEn:`Astral Elixir x5`,icon:`🧪`,duration:300,costGems:12,descVi:`Nhân x5 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Cộng dồn với thuốc khác!`,descEn:`x5 Essence for 5 mins. Stacks duration. Adds with other potions!`},{id:`potion_x10`,type:`x10`,multiplier:10,nameVi:`Thuốc Năng Lượng x10`,nameEn:`Dimensional Elixir x10`,icon:`🧪`,duration:300,costGems:20,descVi:`Nhân x10 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Cộng dồn với thuốc khác!`,descEn:`x10 Essence for 5 mins. Stacks duration. Adds with other potions!`},{id:`potion_x20`,type:`x20`,multiplier:20,nameVi:`Thuốc Năng Lượng x20`,nameEn:`Void Rift Elixir x20`,icon:`⚗️`,duration:300,costGems:35,descVi:`Nhân x20 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Cộng dồn với thuốc khác!`,descEn:`x20 Essence for 5 mins. Stacks duration. Adds with other potions!`},{id:`potion_x50`,type:`x50`,multiplier:50,nameVi:`Thuốc Năng Lượng x50`,nameEn:`Singularity Elixir x50`,icon:`✨`,duration:300,costGems:75,descVi:`Nhân x50 sản lượng trong 5 phút. Dùng 2 lần cộng dồn thời gian. Khi xài với x2 sẽ thành 2+50=52!`,descEn:`x50 Essence for 5 mins. Stacks duration. Adds with other potions (e.g. 2+50=52)!`},{id:`potion_x100`,type:`x100`,multiplier:100,nameVi:`Thuốc Chúa Tể Vũ Trụ x100`,nameEn:`Primordial Overlord Elixir x100`,icon:`🪐`,duration:300,costGems:120,descVi:`Nhân x100 sản lượng trong 5 phút. Đỉnh cao sức mạnh! Cộng dồn với mọi loại thuốc khác!`,descEn:`x100 Essence for 5 mins. Ultimate cosmic surge! Adds with all other potions!`}],A={potion_auto_50ms:0,potion_x2:1,potion_x5:0,potion_x10:0,potion_x20:0,potion_x50:0,potion_x100:0},j={auto_50ms:0,x2:0,x5:0,x10:0,x20:0,x50:0,x100:0},M=[{id:`pass_autoclick_perm`,nameVi:`⚡ Tự Động Bấm Vĩnh Cửu (Infinite Astral Drone)`,nameEn:`Infinite Astral Drone Pass`,descVi:`Tự động bấm Lõi liên tục 15 lần/giây vĩnh viễn, không bao giờ hết hạn hay cần dùng thuốc!`,descEn:`Automatically clicks Core 15 times/sec continuously forever!`,priceVnd:`119,000₫`,priceUsd:`$4.99`,icon:`⚡`,badge:`HOT`,owned:!1},{id:`pass_double_essence`,nameVi:`👑 VIP Nhân Đôi Sản Lượng (x2 All Essence)`,nameEn:`VIP Double Essence Pass (x2)`,descVi:`Nhân đôi vĩnh viễn toàn bộ sản lượng Năng Lượng Vũ Trụ thu hoạch từ mọi nguồn!`,descEn:`Permanently doubles all Essence generated across all runs!`,priceVnd:`69,000₫`,priceUsd:`$2.99`,icon:`👑`,badge:`KHUYÊN DÙNG`,owned:!1},{id:`pass_fortune_loot`,nameVi:`🍀 Vận Mệnh Thần Thánh (Cosmic Fortune Pass)`,nameEn:`Cosmic Fortune Pass`,descVi:`Tăng vĩnh viễn +50% tỉ lệ rơi Cổ Vật & Quà Boss, gấp đôi tần suất xuất hiện Khe Nứt Vũ Trụ!`,descEn:`Permanently boosts Relic & Boss drop rates by +50%, doubles Cosmic Rift spawns!`,priceVnd:`89,000₫`,priceUsd:`$3.99`,icon:`🍀`,badge:`PHỔ BIẾN`,owned:!1},{id:`pass_offline_24h`,nameVi:`⏳ Treo Máy 24H Vĩnh Cửu (24H Infinite Offline)`,nameEn:`24H Infinite Offline Chamber`,descVi:`Tăng giới hạn thời gian ngoại tuyến lên 24 giờ với hiệu suất tối đa 100% full speed!`,descEn:`Boosts max offline time to 24 hours at 100% full production speed!`,priceVnd:`49,000₫`,priceUsd:`$1.99`,icon:`⏳`,owned:!1},{id:`pass_crit_overdrive`,nameVi:`🔥 Bão Tố Bạo Kích (Overdrive Crit Master)`,nameEn:`Overdrive Crit Master Pass`,descVi:`Tăng vĩnh viễn +10% Tỉ lệ Bạo Kích và +250% Sát thương Bạo Kích tối thượng!`,descEn:`Permanently adds +10% Crit Chance & +250% Crit Damage!`,priceVnd:`119,000₫`,priceUsd:`$4.99`,icon:`🔥`,owned:!1},{id:`pass_ultimate_bundle`,nameVi:`🪐 Gói Chúa Tể Toàn Năng (All-In-One Overlord)`,nameEn:`All-In-One Overlord Bundle`,descVi:`Mở khóa TOÀN BỘ 5 Game Pass trên cùng lúc với mức giá tiết kiệm 50%!`,descEn:`Unlocks ALL 5 Game Passes above at once with 50% discount!`,priceVnd:`299,000₫`,priceUsd:`$12.99`,icon:`🪐`,badge:`GIẢM 50%`,owned:!1}],N={pass_autoclick_perm:!1,pass_double_essence:!1,pass_fortune_loot:!1,pass_offline_24h:!1,pass_crit_overdrive:!1,pass_ultimate_bundle:!1},P=[{id:`pack_30`,gems:30,bonusGems:0,priceVnd:`22,000₫`,priceUsd:`$0.99`,nameVi:`Túi Đá Quý Nhỏ`,nameEn:`Pouch of Astral Gems`,icon:`💎`},{id:`pack_90`,gems:80,bonusGems:10,priceVnd:`69,000₫`,priceUsd:`$2.99`,nameVi:`Hộp Đá Quý Tinh Vân`,nameEn:`Nebula Gem Stash`,icon:`✨`,badge:`+12% TẶNG`},{id:`pack_290`,gems:250,bonusGems:40,priceVnd:`199,000₫`,priceUsd:`$7.99`,nameVi:`Rương Kho Báu Hư Không`,nameEn:`Void Gem Vault`,icon:`🔮`,badge:`BÁN CHẠY`},{id:`pack_720`,gems:600,bonusGems:120,priceVnd:`449,000₫`,priceUsd:`$18.99`,nameVi:`Túi Thần Tài Thiên Hà`,nameEn:`Galactic Treasury`,icon:`👑`,badge:`+20% TẶNG`},{id:`pack_1900`,gems:1500,bonusGems:400,priceVnd:`999,000₫`,priceUsd:`$39.99`,nameVi:`Kho Báu Chúa Tể Nexyroth`,nameEn:`Sovereign Gem Hoard`,icon:`🪐`,badge:`SIÊU GIÁ TRỊ`}],F=[{id:`w1`,name:`🌌 Hư Không Nguyên Thuỷ`,reqAscension:0,currency:`Essence`,desc:`Thế giới khởi nguyên của muôn loài, nơi năng lượng vũ trụ tràn ngập rực rỡ.`},{id:`w2`,name:`🪐 Tinh Vân Hỗn Độn`,reqAscension:1,currency:`Bụi Sao Tinh Vân`,desc:`Cõi giới hỗn độn các vì sao rực cháy, mở khoá sau lần Thăng Thiên 1.`},{id:`w3`,name:`🕳️ Vực Thẳm Vô Tận`,reqAscension:3,currency:`Tinh Thạch Vực Tối`,desc:`Vùng tối sâu thẳm vĩnh hằng, mở khoá sau lần Thăng Thiên thứ 3.`},{id:`w4`,name:`⛩️ Thiên Giới Vĩnh Hằng`,reqAscension:6,currency:`Ánh Sáng Thần Thánh`,desc:`Thế giới thứ 4 thần thánh, mở khoá ở lần Thăng Thiên thứ 6, mang theo sức mạnh bất diệt.`}],I={w1_sprite:{id:`w1_sprite`,name:`Hư Không Tinh Linh`,world:`w1`,level:1,bonusDesc:`+5% Click`},w1_ghost:{id:`w1_ghost`,name:`Bóng Ma Tinh Tú`,world:`w1`,level:0,bonusDesc:`+5% CPS`},w1_bat:{id:`w1_bat`,name:`Dơi Bóng Đêm`,world:`w1`,level:0,bonusDesc:`+2% Crit`},w1_cat:{id:`w1_cat`,name:`Mèo Hư Không`,world:`w1`,level:0,bonusDesc:`+5% Item Drop`},w1_wolf:{id:`w1_wolf`,name:`Sói Hắc Ám`,world:`w1`,level:0,bonusDesc:`+10% Boss Damage`},w2_dust:{id:`w2_dust`,name:`Hạt Bụi Tinh Vân`,world:`w2`,level:0,bonusDesc:`+10% CPS`},w2_fox:{id:`w2_fox`,name:`Hồ Ly Sao Băng`,world:`w2`,level:0,bonusDesc:`+10% Click`},w2_snake:{id:`w2_snake`,name:`Rắn Hỗn Độn`,world:`w2`,level:0,bonusDesc:`+4% Crit`},w2_bear:{id:`w2_bear`,name:`Gấu Thiên Hà`,world:`w2`,level:0,bonusDesc:`+15% Boss Damage`},w2_bird:{id:`w2_bird`,name:`Chim Sấm Tinh Vân`,world:`w2`,level:0,bonusDesc:`+10% Gem Drop`},w3_demon:{id:`w3_demon`,name:`Quỷ Lửa Vực Thẳm`,world:`w3`,level:0,bonusDesc:`+20% Click`},w3_serpent:{id:`w3_serpent`,name:`Rồng Biển Sâu`,world:`w3`,level:0,bonusDesc:`+20% CPS`},w3_scorpion:{id:`w3_scorpion`,name:`Bọ Cạp Vực Tối`,world:`w3`,level:0,bonusDesc:`+6% Crit`},w3_spider:{id:`w3_spider`,name:`Nhện Bóng Tối`,world:`w3`,level:0,bonusDesc:`+15% Item Drop`},w3_beast:{id:`w3_beast`,name:`Quái Vật Vô Tận`,world:`w3`,level:0,bonusDesc:`+25% Boss Damage`},w4_crane:{id:`w4_crane`,name:`Tiên Hạc Thần Thánh`,world:`w4`,level:0,bonusDesc:`+30% Tất Cả Thu Hoạch`},w4_pegasus:{id:`w4_pegasus`,name:`Thiên Mã Ánh Sáng`,world:`w4`,level:0,bonusDesc:`+50% Sát Thương Boss`},w4_gold_dragon:{id:`w4_gold_dragon`,name:`Kim Long Thần Giới`,world:`w4`,level:0,bonusDesc:`+35% Nhặt Đá Quý`},night_owl:{id:`night_owl`,name:`Cú Đêm Vĩnh Cửu`,level:0,bonusDesc:`+5% Hiệu Suất Ngoại Tuyến mỗi cấp`}},L=[{id:`boss_1`,name:`Mal’Zakar the Void Titan`,title:`Harbinger of Dimensional Fractures`,maxHp:25e3,currentHp:25e3,timeLimit:30,remainingTime:30,rewardGems:1,rewardShards:25,rewardExp:250,active:!1,level:1,tier:`normal`},{id:`boss_2`,name:`Vor’Thex the Astral Devourer`,title:`Ancient Nebula Wyrm`,maxHp:18e4,currentHp:18e4,timeLimit:35,remainingTime:35,rewardGems:2,rewardShards:80,rewardExp:800,active:!1,level:2,tier:`normal`},{id:`boss_3`,name:`Nexyroth, Primordial Entity`,title:`Architect of Endless Void`,maxHp:15e5,currentHp:15e5,timeLimit:45,remainingTime:45,rewardGems:3,rewardShards:300,rewardExp:3500,active:!1,level:3,tier:`normal`},{id:`boss_4`,name:`Chrono-Leviathan`,title:`Ruler of Shattered Timelines`,maxHp:12e6,currentHp:12e6,timeLimit:50,remainingTime:50,rewardGems:4,rewardShards:600,rewardExp:8e3,active:!1,level:4,tier:`normal`},{id:`boss_5`,name:`Cosmic Singularity Warden`,title:`Keeper of Black Hole Rifts`,maxHp:8e7,currentHp:8e7,timeLimit:55,remainingTime:55,rewardGems:5,rewardShards:1200,rewardExp:2e4,active:!1,level:5,tier:`normal`}],R={streakDay:0,lastClaimTimestamp:0,lastClaimDate:``,claimedDays:[]},z=[{id:`q_click`,name:`Core Resonance`,desc:`Click the Nexyroth Core 150 times.`,target:150,current:0,rewardTokens:50,rewardGems:1,type:`clicks`,claimed:!1},{id:`q_boss`,name:`Titan Executioner`,desc:`Defeat 2 Void Titans in the Arena.`,target:2,current:0,rewardTokens:80,rewardShards:30,type:`bosses`,claimed:!1},{id:`q_rifts`,name:`Anomaly Catcher`,desc:`Collect 3 Cosmic Rifts.`,target:3,current:0,rewardTokens:60,rewardGems:1,type:`rifts`,claimed:!1},{id:`q_upgrades`,name:`Ancient Engineering`,desc:`Purchase 25 total upgrades.`,target:25,current:0,rewardTokens:75,rewardGems:2,type:`upgrades`,claimed:!1},{id:`q_essence`,name:`Essence Overflow`,desc:`Gather 100,000 Cosmic Essence.`,target:1e5,current:0,rewardTokens:100,rewardGems:2,type:`essence`,claimed:!1},{id:`q_crits`,name:`Precision Strikes`,desc:`Score 50 Critical Strikes on the Core.`,target:50,current:0,rewardTokens:70,rewardShards:20,type:`crits`,claimed:!1}];function B(e=Date.now()){return{eventId:`cosmic_incursion_v8`,eventTitle:`Cosmic Void Incursion (v8.0)`,endTime:e+6048e5,eventTokens:0,claimedMilestones:[],quests:C(z)}}var V=B(0);function H(e=Date.now()){return{version:`9.0`,essence:0,totalEssence:0,astralShards:0,totalAstralShards:0,astralGems:5,divineLight:0,level:1,currentExp:0,maxExp:100,skillPoints:0,totalClicks:0,totalCrits:0,totalRifts:0,totalUpgradesBought:0,bossesDefeated:0,dailyBossesDefeated:0,lastDailyBossDate:``,potionsUsed:0,prestigeCount:0,currentWorld:`w1`,lastSaveTime:e,lastOfflineGain:0,records:{highestCps:0,highestClick:0,maxClicksIn10s:0},upgrades:C(w),skills:C(T),relics:C(E),achievements:C(D),gemShopItems:C(O),pets:C(I),gamePasses:C(N),redeemedCodes:[],daily:C(R),events:B(e),potions:C(A),activePotions:C(j),settings:{language:`vi`,sfxEnabled:!0,sfxVolume:.5,scientificNotation:!1,floatingNumbers:!0,particles:!0},activeBoosts:[]}}function U(e,t){if(!t||typeof t!=`object`)return e;let n=Object.assign({},e,t),r=e,i=t;return Object.keys(r).forEach(e=>{let t=r[e];t&&typeof t==`object`&&!Array.isArray(t)&&(n[e]=Object.assign({},t,i[e]||{}))}),n}function W(e){if(e.upgrades||=[],w.forEach(t=>{let n=e.upgrades.find(e=>e.id===t.id);n?(n.name=t.name,n.desc=t.desc,n.baseCost=t.baseCost,n.baseEffect=t.baseEffect,n.unlockedAtLevel=t.unlockedAtLevel,n.costMultiplier=t.costMultiplier):e.upgrades.push(JSON.parse(JSON.stringify(t)))}),e.skills&&e.skills.some(e=>e.id===`core`))T.forEach(t=>{let n=e.skills.find(e=>e.id===t.id);n?(n.name=t.name,n.nameVi=t.nameVi,n.branch=t.branch,n.branchNameVi=t.branchNameVi,n.x=t.x,n.y=t.y,n.requires=t.requires,n.maxLevel=t.maxLevel,n.costPoints=t.costPoints,n.icon=t.icon,n.descVi=t.descVi,n.descEn=t.descEn,n.effectType=t.effectType,n.effectPerLevel=t.effectPerLevel):e.skills.push(JSON.parse(JSON.stringify(t)))});else{let t=0;Array.isArray(e.skills)&&e.skills.forEach(e=>{e.unlocked&&e.costPoints&&(t+=e.costPoints,e.level&&e.level>1&&(t+=(e.level-1)*e.costPoints))}),e.skillPoints=(e.skillPoints||0)+t,e.skills=JSON.parse(JSON.stringify(T))}e.relics||=[],E.forEach(t=>{let n=e.relics.find(e=>e.id===t.id);if(!n)e.relics.push(JSON.parse(JSON.stringify(t)));else{n.name=t.name,n.rarity=t.rarity,n.effectDesc=t.effectDesc,n.clickBonus=t.clickBonus||0,n.cpsBonus=t.cpsBonus||0,n.critBonus=t.critBonus||0;let e=t;e.bossDamageBonus&&(n.bossDamageBonus=e.bossDamageBonus),e.itemDropBonus&&(n.itemDropBonus=e.itemDropBonus),e.gemDropBonus&&(n.gemDropBonus=e.gemDropBonus),e.offlineBonus&&(n.offlineBonus=e.offlineBonus)}}),e.achievements||=[],D.forEach(t=>{let n=e.achievements.find(e=>e.id===t.id);n?(n.name=t.name,n.desc=t.desc,n.rewardGems=t.rewardGems,n.target=t.target,n.type=t.type):e.achievements.push(JSON.parse(JSON.stringify(t)))}),e.pets||=JSON.parse(JSON.stringify(I));let t=e.pets;if(Object.keys(I).forEach(e=>{t[e]||(t[e]=JSON.parse(JSON.stringify(I[e])))}),e.records||={highestCps:0,highestClick:0,maxClicksIn10s:0},e.potions||=JSON.parse(JSON.stringify(A)),Object.keys(A).forEach(t=>{e.potions[t]===void 0&&(e.potions[t]=A[t])}),e.activePotions||=JSON.parse(JSON.stringify(j)),Object.keys(j).forEach(t=>{e.activePotions[t]===void 0&&(e.activePotions[t]=0)}),e.daily||=JSON.parse(JSON.stringify(R)),(!e.events||!e.events.quests)&&(e.events=JSON.parse(JSON.stringify(V))),e.gamePasses||={pass_autoclick_perm:!1,pass_double_essence:!1,pass_fortune_loot:!1,pass_offline_24h:!1,pass_crit_overdrive:!1,pass_ultimate_bundle:!1},e.relics&&Array.isArray(e.relics)){let t=0;for(let n of e.relics)n.equipped&&t++;if(t>4){let n=t-4;for(let t=e.relics.length-1;t>=0&&n>0;t--)e.relics[t].equipped&&(e.relics[t].equipped=!1,n--)}}(typeof e.potionsUsed!=`number`||isNaN(e.potionsUsed)||e.potionsUsed<0)&&(e.potionsUsed=0),e.version=`9.0`}var G=`nexyroth_save_v8`,ee=class{read(){return typeof localStorage>`u`?null:localStorage.getItem(`nexyroth_save_v8`)||localStorage.getItem(`nexyroth_save_v4`)}write(e){typeof localStorage<`u`&&localStorage.setItem(G,e)}remove(){typeof localStorage<`u`&&localStorage.removeItem(G)}};function te(e){let t=e.repo,n=e.now??(()=>Date.now()),r=H(n()),i=C(L[0]);function a(){try{let e=t.read();if(e){let t=JSON.parse(e);r=U(H(n()),t),r.version=`9.0`,W(r)}}catch(e){console.error(`Failed to load state:`,e)}}function o(){r.lastSaveTime=n();try{t.write(JSON.stringify(r))}catch(e){console.error(`Failed to save state:`,e)}}function s(){t.remove(),r=H(n()),i=C(L[0]),o()}function c(){r.lastSaveTime=n();let e=JSON.stringify(r);return btoa(unescape(encodeURIComponent(e)))}function l(e){try{let t=decodeURIComponent(escape(atob(e.trim()))),i=JSON.parse(t);return i&&typeof i.essence==`number`?(r=U(H(n()),i),r.version=`9.0`,W(r),o(),{success:!0}):{success:!1,error:`Dữ liệu lưu không hợp lệ.`}}catch{return{success:!1,error:`Chuỗi Base64 không đúng định dạng.`}}}return{get:function(){return r},set:function(e){r=e},getBoss:function(){return i},setBoss:function(e){i=e},getBossPresets:function(){return L},getPotionMetadata:function(){return k},getGamePasses:function(){return M},getGemTopupPacks:function(){return P},getWorlds:function(){return F},load:a,save:o,reset:s,exportBase64:c,importBase64:l}}var K=te({repo:new ee});typeof window<`u`&&(window.GameState=K),typeof globalThis<`u`&&(globalThis.GameState=K),(function(e){let t=[{day:1,titleVi:`Tia Sáng Hư Không`,titleEn:`Spark of the Abyss`,gems:1,essence:500,shards:0,icon:`💎`,descVi:`1 Đá Quý + 500 Năng Lượng`,descEn:`1 Gem + 500 Essence`},{day:2,titleVi:`Rương Tinh Vân`,titleEn:`Astral Cache`,gems:1,essence:1500,shards:2,icon:`✨`,descVi:`1 Đá Quý + 1,500 Năng Lượng + 2 Shards`,descEn:`1 Gem + 1,500 Essence + 2 Shards`},{day:3,titleVi:`Mảnh Vỡ Hư Vô`,titleEn:`Shards of the Void`,gems:2,essence:0,shards:5,icon:`🔮`,descVi:`2 Đá Quý + 5 Mảnh Shards`,descEn:`2 Gems + 5 Shards`},{day:4,titleVi:`Thuốc Tăng Lực`,titleEn:`Elixir of Power`,gems:2,essence:0,shards:0,potionKey:`potion_x2`,icon:`🧪`,descVi:`2 Đá Quý + 1 Thuốc Năng Lượng x2 (Balo)`,descEn:`2 Gems + 1 Cosmic Elixir x2 (Backpack)`},{day:5,titleVi:`Kho Báu Chiều Không Gian`,titleEn:`Dimensional Stash`,gems:3,essence:0,shards:10,icon:`💠`,descVi:`3 Đá Quý + 10 Mảnh Shards`,descEn:`3 Gems + 10 Shards`},{day:6,titleVi:`Kho Báu Tinh Cầu`,titleEn:`Cosmic Treasury`,gems:3,essence:1e4,shards:0,icon:`👑`,descVi:`3 Đá Quý + 10,000 Năng Lượng`,descEn:`3 Gems + 10,000 Essence`},{day:7,titleVi:`Trái Tim Chúa Tể Vũ Trụ`,titleEn:`Heart of the Sovereign`,gems:5,essence:0,shards:20,relic:!0,icon:`🪐`,descVi:`5 Đá Quý + 20 Shards + CỔ VẬT HUYỀN THOẠI!`,descEn:`5 Gems + 20 Shards + LEGENDARY RELIC!`}];function n(){let e=new Date;return e.getFullYear()+`-`+String(e.getMonth()+1).padStart(2,`0`)+`-`+String(e.getDate()).padStart(2,`0`)}function r(){let t=e.GameState?e.GameState.get():null;if(!t||!t.daily||!t.daily.lastClaimTimestamp||t.daily.lastClaimTimestamp===0||t.daily.streakDay===0)return!0;let r=n();return t.daily.lastClaimDate&&t.daily.lastClaimDate!==r?!0:Date.now()-t.daily.lastClaimTimestamp>=72e6}function i(){let t=e.GameState?e.GameState.get():null;return!t||!t.daily||!t.daily.lastClaimTimestamp?0:t.daily.lastClaimTimestamp+864e5}function a(){let i=e.GameState?e.GameState.get():null;if(!i)return{success:!1};i.daily||={streakDay:0,lastClaimTimestamp:0,lastClaimDate:``,claimedDays:[]};let a=e.I18n?e.I18n.getLang():`vi`;if(!r()){e.Sound&&e.Sound.playError();let t=a===`vi`?`⏳ Bạn đã nhận quà hôm nay rồi! Hãy nhấn nút "⚡ Bỏ qua 24h" bên dưới nếu bạn muốn thử nhận tiếp ngay lập tức.`:`⏳ You have already claimed today’s reward! Click "⚡ Skip 24h" below to test claiming the next reward right now.`;return e.Toast&&e.Toast.show(t,`warning`),{success:!1}}let o=i.daily.streakDay||0;o>=7&&(o=0,i.daily.claimedDays=[]);let l=t[o];if(l.gems&&(i.astralGems=(i.astralGems||0)+l.gems),l.essence&&(i.essence=(i.essence||0)+l.essence,i.totalEssence=(i.totalEssence||0)+l.essence),l.shards&&(i.astralShards=(i.astralShards||0)+l.shards,i.totalAstralShards=(i.totalAstralShards||0)+l.shards),l.potionKey&&(i.potions||={},i.potions[l.potionKey]=(i.potions[l.potionKey]||0)+1),l.elixir&&i.activeBoosts.push({id:`daily_frenzy_`+Date.now(),name:a===`vi`?`Cuồng Nộ Hư Không (x5)`:`Void Frenzy (x5)`,multiplier:5,remainingSeconds:60}),l.relic){let e=`relic_sovereign`;if(!i.relics.some(function(t){return t.id===e})){let t=(i.relics||[]).filter(function(e){return e.equipped}).length<4;i.relics.push({id:e,name:a===`vi`?`Trái Tim Chúa Tể Vũ Trụ`:`Heart of the Sovereign`,rarity:`legendary`,effectDesc:`+50% Direct Click, +50% Passive CPS, +10% Crit Chance`,equipped:t,clickBonus:.5,cpsBonus:.5,critBonus:.1,icon:`sun`})}}i.daily.streakDay=o+1,i.daily.lastClaimTimestamp=Date.now(),i.daily.lastClaimDate=n(),i.daily.claimedDays||(i.daily.claimedDays=[]),i.daily.claimedDays.includes(o+1)||i.daily.claimedDays.push(o+1),e.GameState.save(),e.Sound&&e.Sound.playDailyClaim(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay(),s(),c();let u=a===`vi`?l.descVi:l.descEn,d=a===`vi`?`🎉 NHẬN THÀNH CÔNG NGÀY ${o+1}: ${u}`:`🎉 CLAIMED DAY ${o+1}: ${u}`;return e.Toast&&e.Toast.show(d,`success`),{success:!0,reward:l}}function o(){let t=e.GameState?e.GameState.get():null;if(!t)return;t.daily||={streakDay:0,lastClaimTimestamp:0,lastClaimDate:``,claimedDays:[]},t.daily.lastClaimTimestamp=0,t.daily.lastClaimDate=`2000-01-01`,e.GameState.save(),s(),c(),e.Sound&&e.Sound.playUpgrade();let n=(e.I18n?e.I18n.getLang():`vi`)===`vi`?`⚡ Đã mở khóa quà tiếp theo! Hãy nhấn nút "NHẬN THƯỞNG" ngay bây giờ.`:`⚡ Next day unlocked! You can now click "CLAIM REWARD".`;e.Toast&&e.Toast.show(n,`info`)}function s(){let e=document.querySelectorAll(`.daily-badge-dot, #dailyBadgeDot, [data-badge="daily"]`),t=r();e.forEach(function(e){e.style.display=t?`block`:`none`})}function c(){let n=document.getElementById(`dailyModalContent`);if(!n)return;let a=e.GameState?e.GameState.get():null;if(!a)return;a.daily||={streakDay:0,lastClaimTimestamp:0,lastClaimDate:``,claimedDays:[]};let o=(e.I18n?e.I18n.getLang():`vi`)===`vi`,s=r(),c=a.daily.streakDay||0,l=c>=7?0:c,u=l+1,d=t[l],f=i(),p=Math.max(0,f-Date.now()),m=o?`SẴN SÀNG NHẬN QUÀ!`:`READY TO CLAIM!`;if(!s&&p>0){let e=Math.floor(p/36e5),t=Math.floor(p%36e5/6e4),n=Math.floor(p%6e4/1e3);m=o?`Quà tiếp theo sau ${e}h ${t}m ${n}s`:`Next reward in ${e}h ${t}m ${n}s`}let h=``;t.forEach(function(e,t){let n=t+1,r=a.daily.claimedDays&&a.daily.claimedDays.includes(n),i=n===u,c=n===7,l=`daily-day-card`;c&&(l+=` day-7-special`),r&&(l+=` claimed`),i&&s&&(l+=` ready-to-claim`);let d=o?e.titleVi:e.titleEn,f=o?e.descVi:e.descEn;h+=`
        <div class="${l}" style="position: relative; transition: all 0.2s ease;">
          <div class="daily-day-number" style="display: flex; justify-content: space-between; align-items: center;">
            <span>${o?`Ngày `+n:`Day `+n}</span>
            ${r?`<span style="color: #34d399; font-size: 0.75rem;">✓ `+(o?`Đã Nhận`:`Claimed`)+`</span>`:``}
          </div>
          <div class="daily-reward-icon" style="font-size: 2rem; margin: 0.35rem 0;">${e.icon}</div>
          <div class="daily-reward-name" style="font-weight: 800; font-size: 0.8125rem; color: #fff;">${d}</div>
          <div class="daily-reward-qty" style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.2rem;">${f}</div>
          
          <div style="margin-top: 0.625rem; width: 100%;">
            ${r?`
              <div style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; border-radius: 0.5rem; padding: 0.4rem; font-size: 0.75rem; font-weight: 800; text-align: center;">
                ✓ ${o?`ĐÃ NHẬN`:`CLAIMED`}
              </div>
            `:i&&s?`
              <button class="nx-btn nx-btn-gold" style="width: 100%; font-size: 0.8125rem; padding: 0.5rem 0.65rem; font-weight: 900; animation: pulse-ready 1.5s infinite; box-shadow: 0 0 15px rgba(251,191,36,0.6);" onclick="DailyRewards.claim();">
                🎁 ${o?`NHẬN NGAY`:`CLAIM NOW`}
              </button>
            `:`
              <div style="background: rgba(30,41,59,0.6); border: 1px solid rgba(51,65,85,0.5); color: #64748b; border-radius: 0.5rem; padding: 0.4rem; font-size: 0.75rem; font-weight: 700; text-align: center;">
                🔒 ${o?`Chưa Mở`:`Locked`}
              </div>
            `}
          </div>
        </div>
      `});let g=o?d.descVi:d.descEn;n.innerHTML=`
      <!-- Banner Box -->
      <div class="daily-banner-box" style="margin-bottom: 0.875rem;">
        <img src="./assets/images/nexyroth_daily_chest_1790490760301.jpg" alt="Daily Chest" onerror="this.style.display='none'">
        <div class="daily-banner-overlay"></div>
        <div class="daily-banner-content">
          <div class="daily-streak-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${o?`Chuỗi Điểm Danh:`:`Streak:`} ${c} / 7 ${o?`ngày`:`days`}
          </div>
          <h2 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-top: 0.35rem;">
            ${o?`Phước Lành Tinh Tú Mỗi Ngày`:`Daily Astral Blessings`}
          </h2>
          <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">
            ${o?`Điểm danh mỗi ngày để nhận Đá Quý, Shards và Cổ Vật Huyền Thoại Sovereign!`:`Log in every day to claim rare gems, astral shards, and the mythical Sovereign Relic!`}
          </p>
        </div>
      </div>

      <!-- MAIN PROMINENT CLAIM ACTION BAR -->
      <div style="margin-bottom: 1rem; border-radius: 0.875rem; padding: 0.875rem 1rem; ${s?`background: linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.25) 100%); border: 2px solid #fbbf24; box-shadow: 0 0 25px rgba(251,191,36,0.35);`:`background: rgba(18,24,38,0.8); border: 1px solid var(--nx-surface-border);`}">
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="font-size: 0.6875rem; color: #fbbf24; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                ${o?`★ PHẦN THƯỞNG HÔM NAY (NGÀY `+u+`)`:`★ TODAY'S REWARD (DAY `+u+`)`}
              </div>
              <div style="font-size: 1rem; font-weight: 900; color: #fff; margin-top: 2px;">
                ${g}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.75rem; color: ${s?`#34d399`:`#fbbf24`}; font-family: ui-monospace, monospace; font-weight: 800;">
                ● ${m}
              </span>
            </div>
          </div>

          <!-- The Unmistakable Big Claim Button -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${s?`
              <button id="dailyTopClaimBtn" class="nx-btn nx-btn-gold" style="flex: 2; min-width: 200px; padding: 0.75rem 1.25rem; font-size: 0.9375rem; font-weight: 900; box-shadow: 0 0 20px rgba(251,191,36,0.5); text-transform: uppercase;" onclick="DailyRewards.claim();">
                🎁 ${o?`NHẬN PHẦN THƯỞNG NGÀY `+u:`CLAIM REWARD DAY `+u}
              </button>
            `:`
              <button class="nx-btn nx-btn-secondary" style="flex: 2; min-width: 200px; padding: 0.75rem; font-size: 0.875rem; opacity: 0.85; cursor: default;" disabled>
                ✓ ${o?`ĐÃ NHẬN HÔM NAY (QUAY LẠI SAU)`:`CLAIMED FOR TODAY (CHECK BACK LATER)`}
              </button>
            `}

            <!-- Test / Fast-forward Skip Button to always allow instant testing -->
            <button id="dailyFastSkipBtn" class="nx-btn nx-btn-secondary" style="flex: 1; min-width: 140px; padding: 0.75rem; font-size: 0.75rem; font-weight: 800; border-color: rgba(56,189,248,0.4);" onclick="DailyRewards.simulateDay();" title="${o?`Bỏ qua thời gian chờ 24h để nhận tiếp ngày sau`:`Skip 24h cooldown to test next day`}">
              ⚡ ${o?`Bỏ Qua 24h (Nhận Tiếp)`:`Skip 24h (Test Next)`}
            </button>
          </div>
        </div>
      </div>

      <!-- 7 Days Grid -->
      <div class="daily-days-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.65rem; margin-bottom: 1rem;">
        ${h}
      </div>

      <!-- Action Footer with Secondary Claim Button -->
      <div style="padding-top: 0.75rem; border-top: 1px solid var(--nx-surface-border); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
        <div style="font-size: 0.75rem; color: #94a3b8;">
          ${o?`Chuỗi sẽ tự động làm mới sau khi hoàn thành Ngày 7.`:`Streak loops back to Day 1 upon completing Day 7.`}
        </div>
        ${s?`
          <button class="nx-btn nx-btn-gold" style="padding: 0.5rem 1rem; font-weight: 800; font-size: 0.8125rem;" onclick="DailyRewards.claim();">
            🎁 ${o?`Nhận Quà`:`Claim`}
          </button>
        `:``}
      </div>
    `}e.DailyRewards={isReady:r,claim:a,simulateDay:o,updateBadge:s,render:c}})(typeof window<`u`?window:void 0),(function(e){let t=[{id:`m_100`,tokens:100,title:`Void Pioneer`,rewardDesc:`100 Gems + +5% CPS Boost`,gems:100,shards:0,relic:!1},{id:`m_200`,tokens:200,title:`Abyssal Dominator`,rewardDesc:`50 Astral Shards + +10% Click Power`,gems:0,shards:50,relic:!1},{id:`m_350`,tokens:350,title:`Dimensional Siphon`,rewardDesc:`Relic: Void Crystal Heart (+35% All Yield)`,gems:0,shards:0,relic:!0},{id:`m_500`,tokens:500,title:`Cosmic Overlord`,rewardDesc:`500 Gems + 100 Shards + Mythic Badge`,gems:500,shards:100,relic:!1}];function n(){let t=e.GameState.get();return t.events||={eventId:`cosmic_incursion_1`,eventTitle:`Cosmic Void Incursion`,endTime:Date.now()+6048e5,eventTokens:0,claimedMilestones:[],quests:[]},t.events}function r(t,r){e.GameState.get();let i=n(),o=!1;i.quests.forEach(function(e){e.type===t&&!e.claimed&&(e.current=Math.min(e.target,e.current+(r||1)),o=!0)}),o&&a()}function i(){let e=n(),r=e.quests.some(function(e){return e.current>=e.target&&!e.claimed}),i=t.some(function(t){return e.eventTokens>=t.tokens&&(!e.claimedMilestones||!e.claimedMilestones.includes(t.id))});return r||i}function a(){let e=document.getElementById(`eventBadgeDot`);e&&(e.style.display=i()?`block`:`none`)}function o(t){let r=e.GameState.get(),i=n(),o=i.quests.find(function(e){return e.id===t});!o||o.current<o.target||o.claimed||(o.claimed=!0,i.eventTokens+=o.rewardTokens,o.rewardGems&&(r.astralGems+=o.rewardGems),o.rewardShards&&(r.astralShards+=o.rewardShards,r.totalAstralShards+=o.rewardShards),e.GameState.save(),e.Sound&&e.Sound.playQuestComplete(),a(),c())}function s(r){let i=e.GameState.get(),o=n(),s=t.find(function(e){return e.id===r});if(!(!s||o.eventTokens<s.tokens)&&(o.claimedMilestones||=[],!o.claimedMilestones.includes(r))){if(o.claimedMilestones.push(r),s.gems&&(i.astralGems+=s.gems),s.shards&&(i.astralShards+=s.shards,i.totalAstralShards+=s.shards),s.relic){let e=`relic_void_crystal_heart`;i.relics.some(function(t){return t.id===e})||i.relics.push({id:e,name:`Void Crystal Heart`,rarity:`legendary`,effectDesc:`+35% Direct Click, +35% Passive CPS`,equipped:!0,clickBonus:.35,cpsBonus:.35,critBonus:.05,icon:`heart`})}e.GameState.save(),e.Sound&&e.Sound.playAchievement(),a(),c()}}function c(){let r=document.getElementById(`cosmicEventModalContent`);if(!r)return;e.GameState.get();let i=n(),a=Math.max(0,i.endTime-Date.now()),o=Math.floor(a/864e5),s=Math.floor(a%864e5/36e5),c=Math.floor(a%36e5/6e4),l=Math.min(100,i.eventTokens/500*100),u=``;t.forEach(function(e){let t=i.eventTokens>=e.tokens,n=i.claimedMilestones&&i.claimedMilestones.includes(e.id);u+=`
        <div class="milestone-node ${t?`unlocked`:``} ${n?`claimed`:``}">
          <div style="font-size: 0.6875rem; font-family: ui-monospace, monospace; color: #c084fc; font-weight: 800;">${e.tokens} Tokens</div>
          <div style="font-size: 0.75rem; font-weight: 800; color: #fff;">${e.title}</div>
          <div style="font-size: 0.625rem; color: #94a3b8; line-height: 1.2;">${e.rewardDesc}</div>
          <div style="margin-top: 0.25rem;">
            ${n?`<span style="font-size: 0.625rem; color: #34d399; font-weight: 800;">✓ CLAIMED</span>`:t?`<button class="nx-btn nx-btn-gold" style="font-size: 0.625rem; padding: 0.2rem 0.5rem;" onclick="CosmicEvents.claimMilestone('${e.id}')">Claim</button>`:`<span style="font-size: 0.625rem; color: #64748b;">Locked</span>`}
          </div>
        </div>
      `});let d=``;i.quests.forEach(function(e){let t=e.current>=e.target,n=Math.min(100,e.current/e.target*100);d+=`
        <div class="event-quest-card ${t?`completed`:``}">
          <div class="quest-info-block">
            <div class="quest-title-row">
              <span class="quest-name">${e.name}</span>
              <span class="quest-token-badge">+${e.rewardTokens} Tokens</span>
              ${e.rewardGems?`<span style="font-size: 0.6875rem; color: #fbbf24; font-family: ui-monospace, monospace;">+${e.rewardGems} Gems</span>`:``}
              ${e.rewardShards?`<span style="font-size: 0.6875rem; color: #818cf8; font-family: ui-monospace, monospace;">+${e.rewardShards} Shards</span>`:``}
            </div>
            <div class="quest-desc">${e.desc}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.6875rem; color: #94a3b8; margin-bottom: 0.2rem;">
              <span>Progress</span>
              <span style="font-family: ui-monospace, monospace; color: #fff;">${e.current} / ${e.target}</span>
            </div>
            <div class="quest-progress-bar">
              <div class="quest-progress-fill" style="width: ${n}%;"></div>
            </div>
          </div>
          <div>
            ${e.claimed?`<span style="font-size: 0.75rem; color: #34d399; font-weight: 800;">✓ DONE</span>`:t?`<button class="nx-btn nx-btn-primary" style="padding: 0.35rem 0.75rem;" onclick="CosmicEvents.claimQuest('${e.id}')">Claim</button>`:`<button class="nx-btn nx-btn-secondary" style="padding: 0.35rem 0.75rem;" disabled>In Progress</button>`}
          </div>
        </div>
      `}),r.innerHTML=`
      <!-- Event Banner Box -->
      <div class="event-banner-box">
        <img src="./assets/images/nexyroth_event_banner_1790490739920.jpg" alt="Event Banner" onerror="this.style.display='none'">
        <div class="event-banner-overlay"></div>
        <div style="position: relative; z-index: 2; width: 100%;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
            <span class="event-timer-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Ends in: ${o}d ${s}h ${c}m
            </span>
            <span style="font-family: ui-monospace, monospace; font-size: 0.8125rem; font-weight: 800; color: #c084fc;">
              Tokens: ${i.eventTokens}
            </span>
          </div>
          <h2 class="event-title">Cosmic Void Incursion</h2>
          <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">Complete void expedition missions to earn Tokens and claim ancient astral treasures.</p>
        </div>
      </div>

      <!-- Milestone Track -->
      <div class="milestones-track-box">
        <div class="milestones-header">
          <span style="font-size: 0.8125rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">Milestones Progress</span>
          <span style="font-family: ui-monospace, monospace; font-size: 0.75rem; color: #c084fc; font-weight: 700;">${i.eventTokens} / 500 Tokens</span>
        </div>
        <div class="milestone-bar-container">
          <div class="milestone-bar-fill" style="width: ${l}%;"></div>
        </div>
        <div class="milestone-nodes-grid">
          ${u}
        </div>
      </div>

      <!-- Missions List -->
      <div style="display: flex; flex-direction: column; gap: 0.625rem;">
        <div style="font-size: 0.8125rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">
          Expedition Missions
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${d}
        </div>
      </div>
    `}e.CosmicEvents={track:r,claimQuest:o,claimMilestone:s,updateBadge:a,render:c,hasClaimable:i}})(typeof window<`u`?window:void 0);function ne(e){let t=1,n=0;e.upgrades&&e.upgrades.forEach(e=>{e.level>0&&(e.effectType===`click`?t+=e.level*e.baseEffect:e.effectType===`cps`&&(n+=e.level*e.baseEffect))});let r=1,i=1,a=0;e.relics&&e.relics.forEach(e=>{e.equipped&&(e.clickBonus&&(r+=e.clickBonus),e.cpsBonus&&(i+=e.cpsBonus),e.critBonus&&(a+=e.critBonus))});let o=1,s=1,c=0,l=0;e.skills&&e.skills.forEach(t=>{if(t.unlocked){let n=t.level||1;t.id===`chrono_pulse`&&(s+=n*.1),t.id===`chrono_overclock`&&(o+=n*.1),t.id===`crit_focus`&&(c+=n*.05),t.id===`crit_supernova`&&(l+=n*1),t.id===`crit_chain`&&(o+=n*.35),t.id===`overdrive_synergy`&&(s+=n*.01*(e.skillPoints||0)),t.id===`overdrive_zenith`&&(o+=n*.05,s+=n*.05,c+=n*.02),t.effectType===`clickPower`&&t.id!==`crit_chain`&&(o+=(t.effectPerLevel||.1)*n),t.effectType===`cps`&&t.id!==`chrono_pulse`&&(s+=(t.effectPerLevel||.1)*n),t.effectType===`critChance`&&t.id!==`crit_focus`&&(c+=(t.effectPerLevel||.05)*n)}});let u=h(e),d=1+u/100,f=1+(e.astralShards||0)*.01,p=1,m=0;e.gemShopItems&&e.gemShopItems.forEach(e=>{e.purchased&&e.id===`gem_mult_1`&&(p*=e.value),e.purchased&&e.id===`gem_crit_overload`&&(a+=.1,m+=2)});let g=1;e.activeBoosts&&e.activeBoosts.forEach(e=>{e.multiplier&&(g*=e.multiplier)});let _=0;e.activePotions&&(e.activePotions.x2>0&&(_+=2),e.activePotions.x5>0&&(_+=5),e.activePotions.x10>0&&(_+=10),e.activePotions.x20>0&&(_+=20),e.activePotions.x50>0&&(_+=50),e.activePotions.x100>0&&(_+=100));let v=_>0?_:1,y=1,b=0,x=0;return e.gamePasses&&((e.gamePasses.pass_double_essence||e.gamePasses.pass_ultimate_bundle)&&(y*=2),(e.gamePasses.pass_crit_overdrive||e.gamePasses.pass_ultimate_bundle)&&(b+=.1,x+=1.5)),{clickPower:t*r*o*f*p*v*d*y,cps:n*i*s*f*p*v*d*y,critChance:Math.min(.95,.05+a+c+b),critMultiplier:2.5+l+x+m,frenzyMultiplier:g,potionMultiplierSum:_,potionMultiplier:v,achMultiplier:d,achBuffPercent:u}}function q(e,t){return t&&e<.03?`daily`:e<.15?`rare`:`normal`}function J(e,t,n){let r=Math.floor(25e3*1.8**(e-1));return t===`rare`&&(r=Math.floor(r*1.5)),t===`daily`&&(r=Math.floor(r*3)),n&&(r=Math.floor(r*1.5)),r}function Y(e){return Math.min(60,30+e*2)}function X(e){return{rewardGems:Math.min(5,Math.floor(1+e*.25)),rewardShards:Math.floor(25*1.35**(e-1)),rewardExp:Math.floor(250*1.4**(e-1))}}function Z(e,t,n){let r=``,i=``;if(n)r=e===10?`🔱 Đại Chúa Tể Dữ Liệu`:e===20?`🔱 Ác Ma Nexyroth Nguyên Thuỷ`:e===30?`🔱 Tận Thế Click`:`🔱 Thần Vương Vô Tận Cấp ${e}`,i=`Chúa Tể Tối Cường Từng Mốc 10 Cấp`;else{let n=[`Mal’Zakar the Void Titan`,`Vor’Thex the Astral Devourer`,`Nexyroth Primordial Spawn`,`Chrono-Leviathan`,`Singularity Dreadnought`,`Cosmic Eclipse Overlord`];r=n[(e-1)%n.length]+` (Lv.`+e+`)`,i=t===`daily`?`👑 Boss Ngày Vàng Kim (Chỉ 1 lần/ngày)`:t===`rare`?`✨ Boss Tinh Anh Hiếm`:`Void Titan of the Abyss`}return t===`daily`?r=`👑 `+r:t===`rare`&&(r=`✨ `+r),{name:r,title:i}}function Q(e){let t=e.nextLevel,n=e.lastDailyBossDate!==e.today,r=q(e.roll,n),i=t%10==0,{name:a,title:o}=Z(t,r,i),s=J(t,r,i),c=Y(t),{rewardGems:l,rewardShards:u,rewardExp:d}=X(t);return{id:`boss_`+t+`_`+e.nowMs,name:a,title:o,maxHp:s,currentHp:s,timeLimit:c,remainingTime:c,rewardGems:l,rewardShards:u,rewardExp:d,active:!1,level:t,tier:r,isMilestone:i}}function re(e){return{active:!0,currentHp:e.maxHp,remainingTime:e.timeLimit}}function ie(e){let t=1;return e.tier===`rare`&&(t=2),e.tier===`daily`&&(t=5),e.isMilestone&&(t*=1.5),{rewardGems:Math.round((e.rewardGems||0)*t),rewardShards:Math.round((e.rewardShards||0)*t),rewardExp:Math.round((e.rewardExp||0)*t),dailyDefeat:e.tier===`daily`}}var ae=6e4,oe=9e4;function $(e){return e<.85?`potion_x2`:e<.97?`potion_x5`:`potion_x10`}var se=3e3;function ce(e){let t=e.hits+1,n=e.clickTimestamps.filter(function(t){return e.now-t<=1500}).length,r=Number((n/1.5).toFixed(1)),i=Math.floor(t/10),a=t%10,o=1+i*.2+a*.015+Math.min(1.5,Math.max(0,(r-1)*.08)),s=1;if(o<=10)s=Math.max(1,o);else{let e=o-10;s=10+Math.log10(1+e*.25)*2}return{hits:t,multiplier:Number(s.toFixed(2)),activeCps:r,milestone:t%10==0}}function le(e){let t=se-(e.now-e.lastClickTime);if(t<=0)return{expired:!0,remainingMs:0,activeCps:0};let n=e.clickTimestamps.filter(function(t){return e.now-t<=1500}).length;return{expired:!1,remainingMs:t,activeCps:Number((n/1.5).toFixed(1))}}function ue(e){let t=e.essence,n=e.totalEssence,r=e.cps*e.frenzyMultiplier/10;r>0&&(t+=r,n+=r);let i=null;e.activeBoosts&&e.activeBoosts.length>0?i=e.activeBoosts.map(e=>({...e,remainingSeconds:e.remainingSeconds-.1})).filter(e=>e.remainingSeconds>0):e.activeBoosts&&(i=[]);let a=null;if(e.activePotions){a={...e.activePotions};for(let t of Object.keys(a))if(a[t]>0){if(t===`auto_50ms`&&e.autoClickerPaused)continue;a[t]=Math.max(0,parseFloat((a[t]-.1).toFixed(1)))}}let o=null,s=!1;if(e.boss&&e.boss.active){let t=Math.max(0,parseFloat((e.boss.remainingTime-.1).toFixed(1)));t<=0?(s=!0,o={active:!1,currentHp:e.boss.maxHp,remainingTime:e.boss.timeLimit}):o={remainingTime:t}}return{essence:t,totalEssence:n,activeBoosts:i,activePotions:a,boss:o,bossExpired:s}}function de(e){if(!e.lastSaveTime)return null;let t=Math.max(0,(e.now-e.lastSaveTime)/1e3);if(t<10)return null;let n=e.cps*t*e.efficiency;return n<=0?null:{gain:n,elapsedSeconds:t}}function fe(e){if(!e||!e.achievements)return null;let t=(e.relics||[]).filter(e=>e.equipped).length,n=(e.skills||[]).filter(e=>e.unlocked).length,r=(e.skills||[]).some(e=>e.branch===`luck`&&e.unlocked),i=e.achievements.filter(e=>e.unlocked).length;return e.achievements.map(a=>{switch(a.type){case`clicks`:return e.totalClicks;case`essence`:return Math.floor(e.totalEssence);case`level`:return e.level;case`bosses`:return e.bossesDefeated;case`boss_daily`:return e.dailyBossesDefeated||0;case`crits`:return e.totalCrits||0;case`upgrades`:return e.totalUpgradesBought||0;case`prestige`:return e.prestigeCount;case`skills_unlocked`:return n;case`luck_branch`:return+!!r;case`relics_equipped`:return t;case`achievements_count`:return i;case`potion_x100`:return e.activePotions&&e.activePotions.x100>0?1:0;case`potions_used`:return e.potionsUsed||0;default:return a.current}})}function pe(e){return Math.floor(Math.sqrt(e/1e6))}function me(e){let t=pe(e.totalEssence||0);return t<=0||(e.totalEssence||0)<1e6?null:{shards:t,astralShards:(e.astralShards||0)+t,totalAstralShards:(e.totalAstralShards||0)+t,prestigeCount:(e.prestigeCount||0)+1,reset:{essence:0,totalEssence:0,level:1,currentExp:0,maxExp:100}}}var he=12e4;function ge(e){let t=e?e.gapMs:0,n=typeof t==`number`&&Number.isFinite(t)&&t>0?t:0;if(n>12e4)return{mode:`offline`,steps:0,hiddenSteps:0,visibleSteps:0,accumulatorMs:0,offlineSeconds:n/1e3};let r=e?e.accumulatorMs:0,i=typeof r==`number`&&Number.isFinite(r)&&r>0?r:0,a=e?e.hiddenMs:0,o=typeof a==`number`&&Number.isFinite(a)&&a>0?a:0,s=i+n,c=Math.floor(s/100),l=s-c*100,u=Math.floor(o/100),d=Math.min(c,Math.max(0,u));return{mode:`ticks`,steps:c,hiddenSteps:d,visibleSteps:c-d,accumulatorMs:l,offlineSeconds:0}}function _e(e){let{state:t,stats:n,comboMultiplier:r,rng:i,now:a,isAuto:o}=e,s=i()<n.critChance,c=t.totalCrits||0,l=s?c+1:c,u=1;s&&t.skills&&t.skills.some(e=>e.id===`crit_collapse`&&e.unlocked)&&(u=2);let d=n.clickPower*(s?n.critMultiplier:1)*u*n.frenzyMultiplier*r,f=null;s&&t.skills&&t.skills.some(e=>e.id===`crit_chain`&&e.unlocked)&&i()<.2&&(f=d*.5);let p=t.essence,m=t.totalEssence;f!==null&&(p+=f,m+=f),p+=d,m+=d;let h=t.totalClicks+1,g=[...e.clickTimestamps,a];for(;g.length>0&&g[0]<a-1e4;)g.shift();let _=null;if(t.records){let e={},n=!1;g.length>(t.records.maxClicksIn10s||0)&&(e.maxClicksIn10s=g.length,n=!0),d>(t.records.highestClick||0)&&(e.highestClick=d,n=!0),_=n?e:{}}let v=t.currentExp+Math.max(1,Math.floor(d*.02)),y=t.maxExp,b=t.level,x=t.skillPoints,S=!1,C=e.lastPotionDropTime,w=null;if(a-e.lastPotionDropTime>=6e4){let t=e.bonuses.itemDropChance;(o?i()<.003:i()<t*.3)&&(C=a,w=$(i()))}let T=e.lastGemDropTime,E=!1,D=t.astralGems;if(a-e.lastGemDropTime>=9e4){let t=e.bonuses.gemDropChance;(o?i()<.001:i()<t*.2)&&(T=a,E=!0,D+=1)}let O={kind:`inactive`},k=t.bossesDefeated,A=t.dailyBossesDefeated,j=t.lastDailyBossDate,M=t.astralShards,N=t.totalAstralShards,P=e.boss;if(P&&P.active){let t=d*e.bonuses.bossDamageMultiplier,n=Math.max(0,P.currentHp-t);if(n<=0){k++;let t=1;P.tier===`rare`&&(t=2);let n=!1;P.tier===`daily`&&(t=5,n=!0,A=(A||0)+1,j=e.today),P.isMilestone&&(t*=1.5);let r=Math.round((P.rewardGems||0)*t),o=Math.round((P.rewardShards||0)*t),s=Math.round((P.rewardExp||0)*t);D+=r,M+=o,N+=o,v+=s;let c=i(),l=Q({nextLevel:(P.level||1)+1,roll:c,today:e.today,lastDailyBossDate:j,nowMs:a});O={kind:`defeated`,rewards:{gems:r,shards:o,exp:s},dailyDefeat:n,nextBoss:l}}else O={kind:`hit`,currentHp:n}}let F=0;for(;v>=y&&F<1e3;)b++,v-=y,y=Math.floor(y*1.35),x++,S=!0,F++;let I={essence:p,totalEssence:m,totalClicks:h,totalCrits:l,currentExp:v,maxExp:y,level:b,skillPoints:x,astralGems:D,astralShards:M,totalAstralShards:N,bossesDefeated:k,...O.kind===`defeated`&&O.dailyDefeat?{dailyBossesDefeated:A,lastDailyBossDate:j}:{}};return{isCrit:s,clickGain:d,chainGain:f,patch:I,recordsPatch:_,clickTimestamps:g,leveledUp:S,potionDrop:w,gemDrop:E,boss:O,lastPotionDropTime:C,lastGemDropTime:T}}var ve={computeStats:ne,resolveClick:_e,spawnBoss:Q,summonBoss:re,bossDefeatRewards:ie,rollBossTier:q,bossMaxHp:J,bossTimeLimit:Y,bossRewardBase:X,bossLabel:Z,pickPotionDrop:$,POTION_DROP_COOLDOWN_MS:ae,GEM_DROP_COOLDOWN_MS:oe,advanceCombo:ce,comboDecayStatus:le,COMBO_RESET_MS:se,stepTick:ue,offlineGain:de,achievementCurrents:fe,prestigeShards:pe,prestigeOutcome:me,planCatchUp:ge,TICK_MS:100,ACTIVE_CATCHUP_MAX_MS:he,PAUSE_BOSS_WHILE_HIDDEN:!0,PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN:!0};typeof window<`u`&&(window.Engine=ve),typeof globalThis<`u`&&(globalThis.Engine=ve),(function(e){let t=[],n=0,r=null,i=null,a={overload:0,surge:0,warp:0},o=[],s=0,c=1,l=0,u=null,d=null,f=0,p=0,m=0,h=0,g=!1;function _(){if(r=document.getElementById(`floatingNumbersLayer`),r){r.innerHTML=``,t=[];for(let e=0;e<35;e++){let e=document.createElement(`div`);e.className=`floating-number`,e.style.display=`none`,r.appendChild(e),t.push(e)}}}function v(i,a,o,s){if(!r||t.length===0||!e.GameState.get().settings.floatingNumbers)return;let c=t[n];n=(n+1)%35,c.style.display=`none`,c.offsetWidth;let l=(Math.random()-.5)*60,u=s?(Math.random()-.5)*16:0;c.style.left=i+`px`,c.style.top=a+`px`,c.style.setProperty(`--scatter-x`,l+`px`),c.style.setProperty(`--crit-rot`,u+`deg`),s?(c.textContent=`★ `+o+` CRIT!`,c.className=`floating-number crit crit-enhanced`):(c.textContent=`+`+o,c.className=`floating-number`),c.style.display=`block`,setTimeout(function(){c.style.display=`none`},s?1e3:850)}function y(e,t){let n=document.getElementById(`coreSphereContainer`);if(!n)return;let r=n.getBoundingClientRect(),i=e-r.left,a=t-r.top,o=document.createElement(`div`);o.className=`ripple-wave`,o.style.left=i+`px`,o.style.top=a+`px`,n.appendChild(o),setTimeout(function(){o.parentNode&&o.parentNode.removeChild(o)},600)}function b(){let t=e.GameState.get(),n=e.Engine.computeStats(t);return t.records&&n.cps>(t.records.highestCps||0)&&(t.records.highestCps=n.cps),n}function x(t){let n=e.Engine.advanceCombo({hits:s,now:t,clickTimestamps:o});s=n.hits,l=t,c=n.multiplier,n.milestone&&w(s,c),C(n.activeCps,3),u||=setInterval(S,50)}function S(){let e=Date.now(),t=3e3-(e-l);if(t<=0)s=0,c=1,u&&=(clearInterval(u),null),C(0,0);else{let n=o.filter(function(t){return e-t<=1500}).length;C(Number((n/1.5).toFixed(1)),t/1e3)}}function C(t,n){let r=document.getElementById(`comboMultiplierBar`),i=document.getElementById(`comboBadgeHits`),a=document.getElementById(`comboCpsText`),o=document.getElementById(`comboMultiplierText`),l=document.getElementById(`comboGaugeBar`),u=document.getElementById(`comboDecayText`),d=document.getElementById(`comboMilestoneLabel`),f=document.getElementById(`comboIcon`);if(!r)return;let p=!e.I18n||e.I18n.getLang()===`vi`;if(s>0){if(i&&(i.style.display=`inline-block`,i.textContent=`${s} ${p?`Đòn`:`Hits`}`),a&&(a.style.display=`inline-block`,a.textContent=`${t} CPS`),o&&(o.textContent=`${c.toFixed(2)}x`,o.style.color=s>=50?`#f43f5e`:s>=20?`#fbbf24`:`#38bdf8`,o.style.boxShadow=s>=20?`0 0 12px rgba(251,191,36,0.4)`:`none`),f&&(f.style.color=s>=50?`#f43f5e`:s>=20?`#fbbf24`:`#38bdf8`),l){let e=s%10/10*100;l.style.width=`${Math.max(10,e===0?100:e)}%`,l.style.background=s>=50?`linear-gradient(90deg, #f43f5e, #fbbf24)`:s>=20?`linear-gradient(90deg, #fbbf24, #f59e0b)`:`linear-gradient(90deg, #38bdf8, #818cf8)`}if(u&&(u.textContent=`${p?`Hồi phục`:`Decay`}: ${n.toFixed(1)}s`,u.style.color=n<1?`#f43f5e`:`#94a3b8`),d){let e=Math.ceil((s+.1)/10)*10;d.textContent=p?`Mốc tiếp theo: ${e} đòn`:`Next milestone: ${e} hits`}}else i&&(i.style.display=`none`),a&&(a.style.display=`none`),o&&(o.textContent=`1.00x`,o.style.color=`#38bdf8`,o.style.boxShadow=`none`),f&&(f.style.color=`#94a3b8`),l&&(l.style.width=`0%`),u&&(u.textContent=p?`Nghỉ: 3.0s`:`Idle: 3.0s`),d&&(d.textContent=p?`Nhấp để kích hoạt Combo`:`Click to build combo`)}function w(t,n){let r=document.getElementById(`comboMilestoneTooltip`);if(!r)return;let i=!e.I18n||e.I18n.getLang()===`vi`;r.innerHTML=`
      <div style="padding: 0.45rem 1rem; border-radius: 1rem; background: rgba(15,23,42,0.96); border: 2px solid #fbbf24; box-shadow: 0 0 30px rgba(251,191,36,0.7); display: flex; align-items: center; gap: 0.6rem; backdrop-filter: blur(12px);">
        <span style="font-size: 1.25rem;">🔥</span>
        <div>
          <div style="color: #fbbf24; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;">
            ${i?`MỐC COMBO: ${t} ĐÒN!`:`COMBO MILESTONE: ${t} HITS!`}
          </div>
          <div style="color: #38bdf8; font-weight: 800; font-size: 0.8125rem; font-family: monospace;">
            ${i?`Hệ số tăng cường:`:`Temporary Multiplier:`} <span style="color: #fff; font-weight: 900;">${n.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    `,r.style.display=`block`,r.classList.remove(`combo-milestone-tooltip`),r.offsetWidth,r.classList.add(`combo-milestone-tooltip`),e.Sound&&e.Sound.playAchievement(),d&&clearTimeout(d),d=setTimeout(function(){r&&(r.style.display=`none`)},2200)}function T(){let e=new Date;return e.getFullYear()+`-`+String(e.getMonth()+1).padStart(2,`0`)+`-`+String(e.getDate()).padStart(2,`0`)}function E(t,n){let r=e.GameState.get(),a=b(),s=Date.now();x(s);let l=c>0?c:1,u=e.Engine.resolveClick({state:r,stats:a,comboMultiplier:l,boss:e.GameState.getBoss(),bonuses:{itemDropChance:e.Bonuses?e.Bonuses.getItemDropChance():.015,gemDropChance:e.Bonuses?e.Bonuses.getGemDropChance():.005,bossDamageMultiplier:e.Bonuses?e.Bonuses.getBossDamageMultiplier():1},now:s,isAuto:n,rng:Math.random,lastPotionDropTime:f,lastGemDropTime:p,clickTimestamps:o,today:T()}),d=u.isCrit,g=u.clickGain;Object.assign(r,u.patch),r.records&&u.recordsPatch&&Object.assign(r.records,u.recordsPatch),o.length=0,o.push.apply(o,u.clickTimestamps),f=u.lastPotionDropTime,p=u.lastGemDropTime;let _=t?t.clientX:null,S=t?t.clientY:null;if(t&&t.touches&&t.touches.length>0&&(_=t.touches[0].clientX,S=t.touches[0].clientY),!_&&i){let e=i.getBoundingClientRect();_=e.left+e.width/2,S=e.top+e.height/2}if(u.chainGain!==null){let t=u.chainGain;setTimeout(function(){v(_+22,S-18,`+${e.Numeric?e.Numeric.format(t):Math.round(t)} (Chain ⚡)`,!0)},90)}if(n?d?s-m>160&&(e.Sound&&e.Sound.playCrit(),m=s):s-m>320&&(e.Sound&&e.Sound.playClick(),m=s):d?e.Sound&&e.Sound.playCrit():e.Sound&&e.Sound.playClick(),d){let e=document.getElementById(`critFlashOverlay`);e&&(e.style.display=`block`,e.classList.remove(`crit-flash-overlay`),e.offsetWidth,e.classList.add(`crit-flash-overlay`),setTimeout(function(){e&&(e.style.display=`none`)},160))}if(u.leveledUp&&(e.Sound&&e.Sound.playLevelUp(),e.Toast)){let t=!e.I18n||e.I18n.getLang()===`vi`;e.Toast.show(t?`🎉 THĂNG CẤP! Bạn đạt Cấp ${r.level} (+1 Điểm Kỹ Năng)`:`🎉 LEVEL UP! You reached Level ${r.level} (+1 SP)`,`success`)}if(u.potionDrop&&D(u.potionDrop),u.gemDrop&&e.Toast){let t=!e.I18n||e.I18n.getLang()===`vi`;e.Toast.show(t?`💎 Nhặt được +1 Đá Quý hiếm từ Lõi!`:`💎 Rare find: +1 Astral Gem from Core!`,`info`)}let C=e.GameState.getBoss();if(C&&u.boss.kind===`defeated`){if(C.currentHp=0,C.active=!1,e.Sound&&e.Sound.playBossDefeat(),e.Toast){let t=!e.I18n||e.I18n.getLang()===`vi`,n=u.boss.rewards;e.Toast.show(t?`🏆 HẠ GỤC ${C.name}! Nhận +${n.gems} 💎, +${n.shards} Shards`:`🏆 DEFEATED ${C.name}! +${n.gems} Gems, +${n.shards} Shards`,`success`)}e.CosmicEvents&&e.CosmicEvents.track(`bosses`,1),e.GameState.setBoss(u.boss.nextBoss),A()}else C&&u.boss.kind===`hit`&&(C.currentHp=u.boss.currentHp,!n&&e.Sound&&e.Sound.playBossHit());e.CosmicEvents&&(e.CosmicEvents.track(`clicks`,1),d&&e.CosmicEvents.track(`crits`,1),e.CosmicEvents.track(`essence`,g));let w=!n||d||s-h>200;if(_&&S&&w){n&&(h=s);let t=e.Numeric?e.Numeric.format(g):Math.floor(g);v(_,S,t,d),n||y(_,S)}i&&(n||(i.classList.remove(`is-pressing`,`animate-click-crit`),i.offsetWidth,d?(i.classList.add(`animate-click-crit`),setTimeout(function(){i&&i.classList.remove(`animate-click-crit`)},180)):(i.classList.add(`is-pressing`),setTimeout(function(){i&&i.classList.remove(`is-pressing`)},90)))),k()}function D(t){let n=e.GameState.get(),r=t||e.Engine.pickPotionDrop(Math.random());if(n.potions||={},n.potions[r]=(n.potions[r]||0)+1,e.Toast){let t=!e.I18n||e.I18n.getLang()===`vi`,n=(e.GameState.getPotionMetadata?e.GameState.getPotionMetadata():[]).find(function(e){return e.id===r}),i=n?t?n.nameVi:n.nameEn:`Thuốc Tinh Tú`;e.Toast.show(t?`🎁 Rơi vật phẩm ngẫu nhiên: +1 ${i} vào Balo!`:`🎁 Lucky drop: +1 ${i} added to Backpack!`,`info`)}}function O(t){let n=T(),r=e.GameState.get(),i=e.Engine.spawnBoss({nextLevel:t,roll:Math.random(),today:n,lastDailyBossDate:r.lastDailyBossDate,nowMs:Date.now()});e.GameState.setBoss(i),A()}function k(){let t=e.GameState.get(),n=b(),r=e.Numeric?e.Numeric.format:function(e){return Math.floor(e)},a=document.getElementById(`headerEssence`),o=document.getElementById(`headerShards`),s=document.getElementById(`headerGems`);a&&(a.textContent=r(t.essence,t.settings.scientificNotation)),o&&(o.textContent=r(t.astralShards)),s&&(s.textContent=r(t.astralGems));let c=document.getElementById(`playerLevel`)||document.getElementById(`panelLevel`),l=document.getElementById(`expPercent`),u=document.getElementById(`expBar`)||document.getElementById(`panelExpBar`),d=document.getElementById(`expText`)||document.getElementById(`panelExpText`),f=document.getElementById(`statClickPower`)||document.getElementById(`panelClickPower`),p=document.getElementById(`statCps`)||document.getElementById(`panelCps`),m=document.getElementById(`statCritChance`);c&&(c.textContent=`Level `+t.level);let h=Math.min(100,Math.floor(t.currentExp/t.maxExp*100));l&&(l.textContent=h+`%`),u&&(u.style.width=h+`%`),d&&(d.textContent=r(t.currentExp)+` / `+r(t.maxExp)+` (`+h+`%)`);let g=r(n.clickPower*n.frenzyMultiplier),_=r(n.cps*n.frenzyMultiplier);f&&(f.textContent=g),p&&(p.textContent=_+`/s`),m&&(m.textContent=Math.round(n.critChance*100)+`%`);let v=document.getElementById(`coreClickRate`),y=document.getElementById(`coreCritRate`);v&&(v.textContent=`+`+g),y&&(y.textContent=(n.critChance*100).toFixed(1)+`% (`+n.critMultiplier+`x)`);let x=document.getElementById(`skillPointsBanner`),S=document.getElementById(`skillPointsCount`);x&&S&&(t.skillPoints>0?(x.style.display=`flex`,S.textContent=`+`+t.skillPoints):x.style.display=`none`);let C=document.getElementById(`activeBoostsList`);C&&(C.innerHTML=t.activeBoosts.length===0?`<span style="color: #64748b; font-size: 0.6875rem;">None active</span>`:t.activeBoosts.map(function(e){return`<span class="nx-badge nx-badge-gold">`+e.name+` (`+Math.ceil(e.remainingSeconds)+`s)</span>`}).join(` `));let w=n.potionMultiplierSum>0||t.activePotions&&t.activePotions.auto_50ms>0||t.activeBoosts.length>0;i&&(w?i.classList.add(`has-active-buffs`):i.classList.remove(`has-active-buffs`)),A(),F()}function A(){let t=e.GameState.getBoss(),n=document.getElementById(`bossBattleArea`),r=document.getElementById(`summonBossBtn`);if(n&&r){if(t&&t.active){n.style.display=`block`,r.style.display=`none`;let i=document.getElementById(`bossHpText`),a=document.getElementById(`bossHpBar`),o=document.getElementById(`bossTimerText`),s=document.getElementById(`bossName`);s&&(s.textContent=t.name),o&&(o.textContent=t.remainingTime.toFixed(1)+`s`);let c=Math.min(100,t.currentHp/t.maxHp*100);a&&(a.style.width=c+`%`,t.tier===`daily`?(a.style.background=`linear-gradient(90deg, #f59e0b, #fbbf24)`,a.style.boxShadow=`0 0 10px rgba(251,191,36,0.6)`):t.tier===`rare`?(a.style.background=`linear-gradient(90deg, #9333ea, #c084fc)`,a.style.boxShadow=`0 0 10px rgba(168,85,247,0.6)`):(a.style.background=`linear-gradient(90deg, #e11d48, #f43f5e)`,a.style.boxShadow=`0 0 10px rgba(244,63,94,0.4)`)),i&&(i.textContent=(e.Numeric?e.Numeric.format(t.currentHp):Math.floor(t.currentHp))+` / `+(e.Numeric?e.Numeric.format(t.maxHp):Math.floor(t.maxHp)))}else{n.style.display=`none`,r.style.display=`flex`;let e=document.getElementById(`bossSummonName`);e&&t&&(e.textContent=`Thách Đấu: `+t.name)}}}function j(){let t=e.GameState.getBoss();t&&(Object.assign(t,e.Engine.summonBoss(t)),e.Sound&&e.Sound.playBossHit(),A())}function M(t){if(a[t]>0)return;let n=e.GameState.get(),r=b();if(t===`overload`)n.activeBoosts.push({id:`skill_overload_`+Date.now(),name:`Void Overload`,multiplier:2,remainingSeconds:15}),a.overload=60,e.Sound&&e.Sound.playUpgrade();else if(t===`surge`){let t=r.cps*30;n.essence+=t,n.totalEssence+=t,a.surge=90,e.Sound&&e.Sound.playAchievement()}else t===`warp`&&(z(),a.warp=120,e.Sound&&e.Sound.playAchievement());P()}function N(e){Object.keys(a).forEach(function(t){a[t]>0&&(a[t]=Math.max(0,a[t]-e))}),P()}function P(){let e=document.getElementById(`overloadCdOverlay`),t=document.getElementById(`surgeCdOverlay`),n=document.getElementById(`warpCdOverlay`);e&&(e.style.display=a.overload>0?`flex`:`none`,e.textContent=Math.ceil(a.overload)+`s`),t&&(t.style.display=a.surge>0?`flex`:`none`,t.textContent=Math.ceil(a.surge)+`s`),n&&(n.style.display=a.warp>0?`flex`:`none`,n.textContent=Math.ceil(a.warp)+`s`)}function F(){let t=document.getElementById(`activePotionsBar`)||document.getElementById(`activeBuffsBar`);if(!t)return;let n=e.GameState.get(),r=n.activePotions||{},i=n.activeBoosts||[],a=[],o=0,s=0;if([{key:`x2`,val:2},{key:`x5`,val:5},{key:`x10`,val:10},{key:`x20`,val:20},{key:`x50`,val:50},{key:`x100`,val:100}].forEach(function(e){r[e.key]>0&&(a.push(e.val),o+=e.val,r[e.key]>s&&(s=r[e.key]))}),!(r.auto_50ms>0||o>0||i.length>0||n.gamePasses&&(n.gamePasses.pass_autoclick_perm||n.gamePasses.pass_ultimate_bundle))){t.style.display=`none`;return}t.style.display=`flex`;let c=``,l=n.gamePasses&&(n.gamePasses.pass_autoclick_perm||n.gamePasses.pass_ultimate_bundle);if(l&&(c+=`
        <span class="nx-badge nx-badge-gold" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; border-color: rgba(251,191,36,0.6); display: inline-flex; align-items: center; gap: 0.4rem;">
          <span>⚡ VIP Auto-Click Vĩnh Viễn</span>
          <button onclick="event.stopPropagation(); UI.toggleAutoClicker();" style="cursor: pointer; padding: 1px 6px; font-size: 0.6875rem; font-weight: 800; border-radius: 4px; background: rgba(0,0,0,0.5); color: #fbbf24; border: 1px solid rgba(251,191,36,0.6);">
            ${g?`▶️ Tiếp tục`:`⏸️ Tạm dừng`}
          </button>
        </span>
      `),o>0){let e=a.length>1?a.join(`+`)+`=`+o:o;c+=`
        <span class="nx-badge nx-badge-gold" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; animation: pulse 2s infinite;">
          🧪 +${o}x (${e}) [${R(s)}]
        </span>
      `}r.auto_50ms>0&&!l&&(c+=`
        <span class="nx-badge nx-badge-cyan" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; animation: pulse 2s infinite; display: inline-flex; align-items: center; gap: 0.4rem;">
          <span>⚡ Auto 50ms [${R(r.auto_50ms)}]</span>
          <button onclick="event.stopPropagation(); UI.toggleAutoClicker();" style="cursor: pointer; padding: 1px 6px; font-size: 0.6875rem; font-weight: 800; border-radius: 4px; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(56,189,248,0.5);">
            ${g?`▶️ Tiếp tục`:`⏸️ Tạm dừng`}
          </button>
        </span>
      `),n.gemShopItems&&n.gemShopItems.some(function(e){return e.id===`gem_auto_click`&&e.purchased})&&!l&&!(r.auto_50ms>0)&&(c+=`
        <span class="nx-badge nx-badge-cyan" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; display: inline-flex; align-items: center; gap: 0.4rem;">
          <span>🤖 Astral Drone (5/s)</span>
          <button onclick="event.stopPropagation(); UI.toggleAutoClicker();" style="cursor: pointer; padding: 1px 6px; font-size: 0.6875rem; font-weight: 800; border-radius: 4px; background: rgba(0,0,0,0.5); color: #fff; border: 1px solid rgba(56,189,248,0.5);">
            ${g?`▶️ Tiếp tục`:`⏸️ Tạm dừng`}
          </button>
        </span>
      `),i.forEach(function(e){c+=`
        <span class="nx-badge nx-badge-violet" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;">
          ✨ ${e.name} (${Math.ceil(e.remainingSeconds)}s)
        </span>
      `}),t.innerHTML=c}function I(){g=!g;let t=!e.I18n||e.I18n.getLang()===`vi`;e.Toast&&e.Toast.show(g?t?`⏸️ Đã tạm dừng Auto-Clicker!`:`⏸️ Auto-Clicker Paused!`:t?`▶️ Đã tiếp tục Auto-Clicker!`:`▶️ Auto-Clicker Resumed!`,`info`),F()}function L(){if(document.getElementById(`goldenMeteorEntity`))return;let t=document.createElement(`div`);t.id=`goldenMeteorEntity`,t.className=`golden-meteor-entity`,t.innerHTML=`
      <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: 9999px; background: rgba(146,64,14,0.95); border: 2px solid #fbbf24; box-shadow: 0 0 25px #fbbf24; color: #fff; font-weight: 800; font-size: 0.8125rem;">
        <span style="font-size: 1.3rem;">☄️</span>
        <span style="color: #fef08a; text-shadow: 0 0 10px #fbbf24; letter-spacing: 0.3px;">Sao Băng Vũ Trụ!</span>
      </div>
    `;let n=Math.random()<.5?-100:window.innerWidth+20,r=n<0?window.innerWidth+120:-120,i=Math.floor(Math.random()*(window.innerHeight*.4))+70,a=i+Math.floor(Math.random()*220)+80;t.style.left=n+`px`,t.style.top=i+`px`,document.body.appendChild(t);let o=e.GameState.get();o.gamePasses&&(o.gamePasses.pass_fortune_loot||o.gamePasses.pass_ultimate_bundle)&&setTimeout(function(){t&&t.parentNode&&t.click()},1500);let s=Date.now();function c(){let e=(Date.now()-s)/12e3;if(e>=1||!t.parentNode){t.parentNode&&t.parentNode.removeChild(t);return}t.style.left=n+(r-n)*e+`px`,t.style.top=i+(a-i)*e+`px`,requestAnimationFrame(c)}requestAnimationFrame(c),t.onclick=function(n){n&&n.stopPropagation&&n.stopPropagation(),t.parentNode&&t.parentNode.removeChild(t);let r=e.GameState.get(),i=b(),a=Math.random(),o=!e.I18n||e.I18n.getLang()===`vi`;if(e.Sound&&e.Sound.playAchievement(),a<.35)r.activeBoosts.push({id:`meteor_frenzy_`+Date.now(),name:o?`Siêu Tân Tinh (x7)`:`Supernova Frenzy (x7)`,multiplier:7,remainingSeconds:25}),e.Toast&&e.Toast.show(o?`🌟 BẮT ĐƯỢC SAO BĂNG: Kích hoạt Siêu Tân Tinh (x7 Năng Lượng trong 25s)!`:`🌟 CAUGHT GOLDEN COMET: Supernova Frenzy (x7 Essence for 25s)!`,`gold`);else if(a<.65){let t=Math.floor(Math.random()*2)+1;r.astralGems+=t,e.Toast&&e.Toast.show(o?`💎 BẮT ĐƯỢC SAO BĂNG: Nhận được +${t} Đá Quý!`:`💎 CAUGHT GOLDEN COMET: +${t} Astral Gems!`,`gold`)}else if(a<.85){let t=Math.max(500,i.cps*60);r.essence+=t,r.totalEssence+=t,e.Toast&&e.Toast.show(o?`⚡ BẮT ĐƯỢC SAO BĂNG: Dịch chuyển thời gian +${e.Numeric.format(t)} Năng Lượng!`:`⚡ CAUGHT GOLDEN COMET: Time Warp +${e.Numeric.format(t)} Essence!`,`gold`)}else{let t=`potion_x2`;r.potions||={},r.potions[t]=(r.potions[t]||0)+1,e.Toast&&e.Toast.show(o?`🎁 BẮT ĐƯỢC SAO BĂNG: Nhận được +1 Thuốc Năng Lượng x2 vào Balo!`:`🎁 CAUGHT GOLDEN COMET: +1 Elixir x2 added to Backpack!`,`gold`)}k()}}function R(e){let t=Math.ceil(e),n=Math.floor(t/60),r=t%60;return n+`:`+(r<10?`0`:``)+r}function z(){let t=document.querySelector(`.col-center`);if(!t)return;let n=document.createElement(`div`);n.className=`cosmic-rift`,n.style.position=`absolute`,n.style.width=`48px`,n.style.height=`48px`,n.style.borderRadius=`50%`,n.style.background=`radial-gradient(circle, #e879f9 0%, #a855f7 60%, transparent 100%)`,n.style.boxShadow=`0 0 25px #c084fc`,n.style.cursor=`pointer`,n.style.zIndex=`50`,n.style.animation=`pulse 1s infinite alternate`;let r=t.clientWidth-60,i=t.clientHeight-60;n.style.left=Math.max(20,Math.floor(Math.random()*r))+`px`,n.style.top=Math.max(40,Math.floor(Math.random()*i))+`px`,n.onclick=function(){let t=e.GameState.get(),r=b(),i=Math.max(100,r.cps*60);if(t.essence+=i,t.totalEssence+=i,t.totalRifts++,e.Sound&&e.Sound.playAchievement(),e.CosmicEvents&&e.CosmicEvents.track(`rifts`,1),e.Toast){let t=!e.I18n||e.I18n.getLang()===`vi`;e.Toast.show(t?`✨ Đã thu thập Khe Nứt! +${e.Numeric.format(i)} Năng Lượng`:`✨ Cosmic Rift Claimed! +${e.Numeric.format(i)} Essence`,`info`)}n.parentNode&&n.parentNode.removeChild(n),k()},t.appendChild(n);let a=e.GameState.get();a.gamePasses&&(a.gamePasses.pass_fortune_loot||a.gamePasses.pass_ultimate_bundle)&&setTimeout(function(){n&&n.parentNode&&n.click()},1200),setTimeout(function(){n.parentNode&&n.parentNode.removeChild(n)},15e3)}function B(){window.addEventListener(`keydown`,function(t){if(!t.target||t.target.tagName!==`INPUT`&&t.target.tagName!==`TEXTAREA`){if(t.code===`Space`||t.key===` `){if(t.preventDefault(),t.repeat)return;E(null);return}t.key===`1`||t.code===`Digit1`?e.UIModals&&e.UIModals.open(`skillsModal`):t.key===`2`||t.code===`Digit2`?e.UIModals&&e.UIModals.open(`inventoryModal`):t.key===`3`||t.code===`Digit3`?e.UIModals&&e.UIModals.open(`gemShopModal`):(t.key===`4`||t.code===`Digit4`)&&e.UIModals&&e.UIModals.open(`cosmicEventModal`)}})}function V(){i=document.getElementById(`coreSphere`)||document.getElementById(`coreSphereBtn`),i&&(i.addEventListener(`click`,function(e){E(e,!1)}),i.addEventListener(`touchstart`,function(e){E(e,!1)},{passive:!0}));let t=document.getElementById(`summonBossBtn`);t&&t.addEventListener(`click`,j);let n=document.getElementById(`skillOverloadBtn`),r=document.getElementById(`skillSurgeBtn`),a=document.getElementById(`skillWarpBtn`);n&&n.addEventListener(`click`,function(){M(`overload`)}),r&&r.addEventListener(`click`,function(){M(`surge`)}),a&&a.addEventListener(`click`,function(){M(`warp`)}),_(),B();let o=0;setInterval(function(){let t=typeof document<`u`&&document.hidden,n=!e.Engine||e.Engine.PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN;if(t&&n||g)return;let r=e.GameState.get(),i=r.gamePasses&&(r.gamePasses.pass_autoclick_perm||r.gamePasses.pass_ultimate_bundle),a=r.activePotions&&r.activePotions.auto_50ms>0,s=i||a,c=!!(r.gemShopItems&&r.gemShopItems.some(function(e){return e.id===`gem_auto_click`&&e.purchased}));s?(o=0,E(null,!0)):c&&(o=(o+1)%4,o===1&&E(null,!0))},50),setInterval(function(){Math.random()<.45&&L()},5e4),setInterval(function(){Math.random()<.35&&z()},45e3)}e.UICore={init:V,calculateStats:b,handleCoreClick:E,updateStatsDisplay:k,updateCooldowns:N,updateActiveBuffs:F,summonBoss:j,spawnNextBoss:O,formatDuration:R,toggleAutoClicker:I,isAutoClickerPaused:function(){return g},spawnGoldenMeteor:L},e.UI=e.UICore})(typeof window<`u`?window:void 0),(function(e){let t=1;function n(e){t=e,document.querySelectorAll(`.multiplier-btn`).forEach(function(t){t.dataset.mult===String(e)?t.classList.add(`active`):t.classList.remove(`active`)}),i()}function r(n){let r=e.GameState.get(),a=r.upgrades.find(function(e){return e.id===n});if(!a)return;let o=t,s=0,c=r.skills&&r.skills.some(function(e){return e.id===`fortune_market`&&e.unlocked})?.85:1;if(t===`max`){let t=e.Numeric.calculateMaxPurchasable(a.baseCost*c,a.costMultiplier,a.level,r.essence);o=t.count,s=t.totalCost}else o=parseInt(t,10)||1,s=Math.floor(e.Numeric.calculateBatchCost(a.baseCost,a.costMultiplier,a.level,o)*c);if(o<=0||r.essence<s){e.Sound&&e.Sound.playError();return}r.essence-=s,a.level+=o,r.totalUpgradesBought=(r.totalUpgradesBought||0)+o,e.Sound&&e.Sound.playUpgrade(),e.CosmicEvents&&e.CosmicEvents.track(`upgrades`,o),e.GameState.save(),e.UI.updateStatsDisplay(),i()}function i(){let n=document.getElementById(`upgradesList`);if(!n)return;let r=e.GameState.get(),i=e.Numeric?e.Numeric.format:function(e){return Math.floor(e)},a=``;r.upgrades.forEach(function(n){if(r.level<n.unlockedAtLevel){a+=`
          <div class="upgrade-card" style="opacity: 0.45; filter: grayscale(0.8);">
            <div class="upgrade-info">
              <div class="upgrade-icon-box" style="background: rgba(30, 41, 59, 0.4); color: #64748b;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="upgrade-details">
                <div class="upgrade-name">${n.name}</div>
                <div class="upgrade-effect" style="color: #64748b;">Unlocks at Level ${n.unlockedAtLevel}</div>
              </div>
            </div>
            <span class="nx-badge" style="background: rgba(30, 41, 59, 0.6); color: #64748b; font-size: 0.6875rem;">Locked</span>
          </div>
        `;return}let o=0,s=``,c=!1,l=r.skills&&r.skills.some(function(e){return e.id===`fortune_market`&&e.unlocked})?.85:1;if(t===`max`){let t=e.Numeric.calculateMaxPurchasable(n.baseCost*l,n.costMultiplier,n.level,r.essence);t.count===0?(o=Math.floor(e.Numeric.calculateBatchCost(n.baseCost,n.costMultiplier,n.level,1)*l),s=`+1`,c=r.essence>=o):(o=t.totalCost,s=`+`+t.count,c=!0)}else{let i=parseInt(t,10)||1;o=Math.floor(e.Numeric.calculateBatchCost(n.baseCost,n.costMultiplier,n.level,i)*l),s=`+`+i,c=r.essence>=o}let u=n.effectType===`click`?`+${i(n.baseEffect)} Click Power`:`+${i(n.baseEffect)}/s CPS`,d=i(n.level*n.baseEffect);a+=`
        <div class="upgrade-card ${c?`can-afford`:`cant-afford`}" onclick="UIUpgrades.buy('${n.id}')">
          <div class="upgrade-info">
            <div class="upgrade-icon-box" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div class="upgrade-details">
              <div class="upgrade-name-row">
                <span class="upgrade-name">${n.name}</span>
                <span class="upgrade-level-badge">Lv.${n.level}</span>
              </div>
              <div class="upgrade-effect">${u} <span style="color: #38bdf8; font-family: ui-monospace, monospace;">(Total: +${d})</span></div>
            </div>
          </div>
          <button class="nx-btn ${c?`nx-btn-primary`:`nx-btn-disabled`} upgrade-buy-btn" onclick="event.stopPropagation(); UIUpgrades.buy('${n.id}')">
            <span style="font-size: 0.6875rem; opacity: 0.85;">Buy ${s}</span>
            <span style="font-family: ui-monospace, monospace;">${i(o)}</span>
          </button>
        </div>
      `}),n.innerHTML=a}function a(){document.querySelectorAll(`.multiplier-btn`).forEach(function(e){e.addEventListener(`click`,function(){let t=e.dataset.mult;n(t===`max`?`max`:parseInt(t,10))})}),i(),setInterval(i,500)}e.UIUpgrades={init:a,buy:r,setMultiplier:n,render:i}})(typeof window<`u`?window:void 0),(function(e){let t={rare:{border:`#38bdf8`,glow:`rgba(56, 189, 248, 0.45)`,bgGrad1:`#082f49`,bgGrad2:`#0c192c`,accent:`#7dd3fc`,badgeBg:`rgba(56, 189, 248, 0.15)`,badgeText:`#38bdf8`,labelVi:`Hiếm`,labelEn:`Rare`},epic:{border:`#c084fc`,glow:`rgba(192, 132, 252, 0.45)`,bgGrad1:`#3b0764`,bgGrad2:`#150d2a`,accent:`#e9d5ff`,badgeBg:`rgba(168, 85, 247, 0.18)`,badgeText:`#c084fc`,labelVi:`Sử Thi`,labelEn:`Epic`},legendary:{border:`#f59e0b`,glow:`rgba(245, 158, 11, 0.5)`,bgGrad1:`#451a03`,bgGrad2:`#1f1308`,accent:`#fde68a`,badgeBg:`rgba(245, 158, 11, 0.18)`,badgeText:`#fbbf24`,labelVi:`Huyền Thoại`,labelEn:`Legendary`},mythic:{border:`#f43f5e`,glow:`rgba(244, 63, 94, 0.55)`,bgGrad1:`#4c0519`,bgGrad2:`#200713`,accent:`#fecdd3`,badgeBg:`rgba(244, 63, 94, 0.2)`,badgeText:`#fb7185`,labelVi:`Thần Thoại`,labelEn:`Mythic`}};function n(e,n,r){let i=r||52,a=(n||`rare`).toLowerCase(),o=t[a]||t.rare,s=`rel_grad_`+e+`_`+Math.floor(Math.random()*1e4),c=``;switch(e){case`relic_eye`:c=`
          <ellipse cx="26" cy="26" rx="16" ry="10" fill="none" stroke="${o.accent}" stroke-width="2"/>
          <circle cx="26" cy="26" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="26" cy="26" r="2.5" fill="#ffffff"/>
          <path d="M12 26 L8 26 M44 26 L40 26 M26 12 L26 8 M26 44 L26 40" stroke="${o.border}" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="19" cy="22" r="1" fill="#fff" opacity="0.8"/>
        `;break;case`relic_hourglass`:c=`
          <path d="M17 12 L35 12 L28 25 L35 38 L17 38 L24 25 Z" fill="none" stroke="${o.accent}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M21 16 L31 16 L26 24 Z" fill="#c084fc" opacity="0.6"/>
          <path d="M24 28 L28 28 L32 35 L20 35 Z" fill="#a855f7" opacity="0.85"/>
          <line x1="26" y1="24" x2="26" y2="28" stroke="#fff" stroke-width="1.5" stroke-dasharray="1 1"/>
          <line x1="15" y1="12" x2="37" y2="12" stroke="${o.border}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="15" y1="38" x2="37" y2="38" stroke="${o.border}" stroke-width="2.5" stroke-linecap="round"/>
        `;break;case`relic_heart`:c=`
          <path d="M26 39 C26 39 13 30 13 20 C13 14 17 11 22 13 C24 14 25.5 16 26 17 C26.5 16 28 14 30 13 C35 11 39 14 39 20 C39 30 26 39 26 39 Z" 
                fill="url(#${s}_heart)" stroke="${o.accent}" stroke-width="1.8"/>
          <path d="M26 19 L26 33 M20 23 L32 23" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="26" cy="23" r="3" fill="#fff" opacity="0.9"/>
          <defs>
            <radialGradient id="${s}_heart" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#fb7185"/>
              <stop offset="70%" stop-color="#e11d48"/>
              <stop offset="100%" stop-color="#881337"/>
            </radialGradient>
          </defs>
        `;break;case`relic_giant_hammer`:c=`
          <line x1="15" y1="37" x2="33" y2="19" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
          <rect x="25" y="11" width="16" height="11" rx="2" transform="rotate(-45 33 16)" fill="#475569" stroke="${o.border}" stroke-width="1.8"/>
          <path d="M30 13 L36 19 M32 11 L38 17" stroke="${o.accent}" stroke-width="1"/>
          <polygon points="13,39 17,35 15,33 11,37" fill="${o.border}"/>
          <circle cx="33" cy="16" r="2" fill="#fbbf24"/>
        `;break;case`relic_lucky_coin`:c=`
          <circle cx="26" cy="26" r="14" fill="#0f172a" stroke="${o.border}" stroke-width="2"/>
          <circle cx="26" cy="26" r="11" fill="none" stroke="${o.accent}" stroke-width="1" stroke-dasharray="2 1.5"/>
          <path d="M26 18 C28 21 31 24 34 26 C31 28 28 31 26 34 C24 31 21 28 18 26 C21 24 24 21 26 18 Z" fill="${o.border}"/>
          <circle cx="26" cy="26" r="2.5" fill="#fff"/>
        `;break;case`relic_treasure_radar`:c=`
          <circle cx="26" cy="26" r="15" fill="none" stroke="${o.border}" stroke-width="1.5"/>
          <circle cx="26" cy="26" r="9" fill="none" stroke="${o.border}" stroke-width="1" opacity="0.6"/>
          <circle cx="26" cy="26" r="3" fill="${o.accent}"/>
          <line x1="26" y1="11" x2="26" y2="41" stroke="${o.border}" stroke-width="1" opacity="0.4"/>
          <line x1="11" y1="26" x2="41" y2="26" stroke="${o.border}" stroke-width="1" opacity="0.4"/>
          <path d="M26 26 L36 16" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
          <circle cx="32" cy="20" r="1.8" fill="#34d399"/>
        `;break;case`relic_void_crown`:c=`
          <path d="M14 34 L14 24 L20 28 L26 16 L32 28 L38 24 L38 34 Z" fill="#3b0764" stroke="${o.border}" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="26" cy="15" r="2.5" fill="#c084fc"/>
          <circle cx="14" cy="23" r="2" fill="#a855f7"/>
          <circle cx="38" cy="23" r="2" fill="#a855f7"/>
          <rect x="14" y="32" width="24" height="4" rx="1" fill="${o.border}"/>
          <circle cx="26" cy="34" r="1.5" fill="#fff"/>
        `;break;case`relic_starlight_boots`:c=`
          <path d="M16 16 L23 16 L23 28 L33 28 C35 28 37 30 37 32 L37 34 L16 34 Z" fill="#0369a1" stroke="${o.border}" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M20 18 L27 13 L24 20 L30 16" stroke="${o.accent}" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="33" cy="32" r="1.5" fill="#fff"/>
          <line x1="14" y1="36" x2="38" y2="36" stroke="${o.border}" stroke-width="1" stroke-dasharray="2 2"/>
        `;break;case`relic_eclipse_amulet`:c=`
          <circle cx="26" cy="26" r="12" fill="#0f172a" stroke="${o.accent}" stroke-width="1.5"/>
          <path d="M22 15 C28 17 32 21 32 27 C32 33 28 37 22 39 C31 38 37 32 37 26 C37 19 31 15 22 15 Z" fill="${o.border}"/>
          <circle cx="21" cy="26" r="5" fill="#c084fc" opacity="0.8"/>
          <circle cx="21" cy="26" r="2" fill="#fff"/>
        `;break;case`relic_singularity_ring`:c=`
          <ellipse cx="26" cy="31" rx="14" ry="7" fill="none" stroke="${o.border}" stroke-width="2.5"/>
          <circle cx="26" cy="20" r="8" fill="#000" stroke="${o.accent}" stroke-width="2"/>
          <circle cx="26" cy="20" r="4" fill="#f43f5e" opacity="0.85"/>
          <ellipse cx="26" cy="20" rx="12" ry="3" fill="none" stroke="#fb7185" stroke-width="1" stroke-dasharray="3 1.5"/>
          <circle cx="26" cy="20" r="1.5" fill="#fff"/>
        `;break;case`relic_nebula_cloak`:c=`
          <path d="M18 15 C22 13 30 13 34 15 L38 37 C34 35 28 38 26 36 C24 38 18 35 14 37 Z" fill="#1e1b4b" stroke="${o.border}" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="26" cy="16" r="3" fill="${o.accent}" stroke="#fff" stroke-width="1"/>
          <path d="M22 22 Q26 26 30 22" stroke="${o.border}" stroke-width="1.2" fill="none"/>
          <circle cx="22" cy="29" r="1" fill="#38bdf8"/>
          <circle cx="30" cy="28" r="1" fill="#c084fc"/>
        `;break;case`relic_ancient_tome`:c=`
          <rect x="15" y="14" width="22" height="25" rx="2" fill="#1e1b4b" stroke="${o.border}" stroke-width="2"/>
          <path d="M15 17 L26 17 L37 17" stroke="${o.accent}" stroke-width="1.2"/>
          <circle cx="26" cy="27" r="5" fill="none" stroke="${o.accent}" stroke-width="1.5"/>
          <polygon points="26,24 28,29 23,26 29,26 24,29" fill="${o.border}"/>
          <line x1="26" y1="14" x2="26" y2="39" stroke="${o.accent}" stroke-width="1"/>
        `;break;case`relic_divine_orb`:c=`
          <circle cx="26" cy="26" r="9" fill="url(#${s}_sun)" stroke="#fff" stroke-width="1.5"/>
          <ellipse cx="26" cy="26" rx="16" ry="6" fill="none" stroke="${o.border}" stroke-width="1.5" transform="rotate(30 26 26)"/>
          <ellipse cx="26" cy="26" rx="16" ry="6" fill="none" stroke="${o.accent}" stroke-width="1" transform="rotate(-30 26 26)"/>
          <circle cx="26" cy="26" r="3" fill="#ffffff"/>
          <defs>
            <radialGradient id="${s}_sun">
              <stop offset="0%" stop-color="#fff"/>
              <stop offset="60%" stop-color="#fbbf24"/>
              <stop offset="100%" stop-color="#b45309"/>
            </radialGradient>
          </defs>
        `;break;case`relic_shadow_blade`:c=`
          <path d="M37 12 C30 18 25 24 19 32 L15 30 L22 23 C27 17 32 13 37 12 Z" fill="#475569" stroke="${o.border}" stroke-width="1.5"/>
          <line x1="16" y1="31" x2="11" y2="38" stroke="${o.accent}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="11" cy="38" r="1.8" fill="${o.border}"/>
          <path d="M28 17 C26 21 23 25 20 28" stroke="#c084fc" stroke-width="1.2" stroke-linecap="round"/>
        `;break;case`relic_celestial_compass`:c=`
          <circle cx="26" cy="26" r="14" fill="#0f172a" stroke="${o.border}" stroke-width="2"/>
          <polygon points="26,14 29,26 26,24 23,26" fill="#38bdf8"/>
          <polygon points="26,38 29,26 26,28 23,26" fill="#64748b"/>
          <circle cx="26" cy="26" r="2.5" fill="#fff"/>
          <circle cx="26" cy="14" r="1.2" fill="#fff"/>
        `;break;case`relic_phoenix_feather`:c=`
          <path d="M38 12 C28 15 20 22 14 36 C18 34 22 33 26 31 C25 28 24 25 27 22 C30 20 33 19 35 15 Z" 
                fill="url(#${s}_fire)" stroke="${o.border}" stroke-width="1.5"/>
          <path d="M38 12 Q26 24 13 38" stroke="#fff" stroke-width="1.2" fill="none"/>
          <defs>
            <linearGradient id="${s}_fire" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#b91c1c"/>
            </linearGradient>
          </defs>
        `;break;case`relic_dragon_scale`:c=`
          <path d="M26 12 C34 16 38 24 38 31 C38 38 26 41 26 41 C26 41 14 38 14 31 C14 24 18 16 26 12 Z" 
                fill="#1e1b4b" stroke="${o.border}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M26 17 C31 20 34 26 33 31 M26 23 C29 26 30 29 30 33" stroke="${o.accent}" stroke-width="1.2" fill="none"/>
          <circle cx="26" cy="26" r="2.5" fill="${o.border}"/>
        `;break;case`relic_chrono_crystal`:c=`
          <polygon points="26,11 36,19 36,33 26,41 16,33 16,19" fill="#082f49" stroke="${o.border}" stroke-width="2"/>
          <circle cx="26" cy="26" r="7" fill="none" stroke="${o.accent}" stroke-width="1" stroke-dasharray="2 1.5"/>
          <polyline points="26,22 26,26 29,26" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="26" cy="26" r="1.5" fill="#38bdf8"/>
        `;break;case`relic_abyssal_mirror`:c=`
          <ellipse cx="26" cy="24" rx="11" ry="14" fill="#0f172a" stroke="${o.border}" stroke-width="2"/>
          <ellipse cx="26" cy="24" rx="8" ry="11" fill="none" stroke="${o.accent}" stroke-width="1"/>
          <path d="M26 38 L26 43 M23 43 L29 43" stroke="${o.border}" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M22 18 Q26 23 24 29" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        `;break;case`relic_cosmic_dice`:c=`
          <polygon points="26,13 38,20 38,32 26,39 14,32 14,20" fill="#1e1b4b" stroke="${o.border}" stroke-width="2"/>
          <line x1="26" y1="13" x2="26" y2="26" stroke="${o.accent}" stroke-width="1.2"/>
          <line x1="14" y1="20" x2="26" y2="26" stroke="${o.accent}" stroke-width="1.2"/>
          <line x1="38" y1="20" x2="26" y2="26" stroke="${o.accent}" stroke-width="1.2"/>
          <line x1="26" y1="26" x2="26" y2="39" stroke="${o.accent}" stroke-width="1.2"/>
          <circle cx="22" cy="18" r="1.5" fill="#fff"/>
          <circle cx="31" cy="27" r="1.5" fill="#c084fc"/>
          <circle cx="21" cy="33" r="1.5" fill="#c084fc"/>
        `;break;case`relic_primordial_bell`:c=`
          <path d="M20 16 C20 12 32 12 32 16 L35 32 C37 34 38 36 38 37 L14 37 C14 36 15 34 17 32 Z" fill="#451a03" stroke="${o.border}" stroke-width="2"/>
          <line x1="26" y1="10" x2="26" y2="13" stroke="${o.border}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="26" cy="38" r="2.5" fill="#fbbf24"/>
          <path d="M12 30 Q8 33 12 36 M40 30 Q44 33 40 36" stroke="${o.accent}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        `;break;case`relic_eternity_chain`:c=`
          <rect x="14" y="16" width="13" height="9" rx="4.5" transform="rotate(-30 20 20)" fill="none" stroke="${o.border}" stroke-width="2.2"/>
          <rect x="25" y="27" width="13" height="9" rx="4.5" transform="rotate(-30 31 31)" fill="none" stroke="${o.border}" stroke-width="2.2"/>
          <circle cx="26" cy="26" r="2" fill="${o.accent}"/>
        `;break;case`relic_quasar_core`:c=`
          <circle cx="26" cy="26" r="8" fill="url(#${s}_qcore)" stroke="#fff" stroke-width="1.5"/>
          <line x1="26" y1="6" x2="26" y2="46" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="26" cy="26" rx="17" ry="5" fill="none" stroke="${o.border}" stroke-width="1.5" transform="rotate(25 26 26)"/>
          <circle cx="26" cy="26" r="3" fill="#ffffff"/>
          <defs>
            <radialGradient id="${s}_qcore">
              <stop offset="0%" stop-color="#fff"/>
              <stop offset="50%" stop-color="#f43f5e"/>
              <stop offset="100%" stop-color="#4c0519"/>
            </radialGradient>
          </defs>
        `;break;case`relic_spirit_flute`:c=`
          <line x1="14" y1="38" x2="38" y2="14" stroke="${o.border}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="23" cy="29" r="1.2" fill="#0f172a"/>
          <circle cx="26" cy="26" r="1.2" fill="#0f172a"/>
          <circle cx="29" cy="23" r="1.2" fill="#0f172a"/>
          <circle cx="32" cy="20" r="1.2" fill="#0f172a"/>
          <path d="M37 11 Q41 9 40 14" stroke="${o.accent}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <circle cx="39" cy="8" r="1" fill="#fff"/>
        `;break;case`relic_nirvana_lotus`:c=`
          <path d="M26 12 C29 18 30 26 26 34 C22 26 23 18 26 12 Z" fill="#f43f5e" opacity="0.9"/>
          <path d="M26 34 C21 31 15 28 14 21 C19 19 24 25 26 34 Z" fill="#e11d48" opacity="0.8"/>
          <path d="M26 34 C31 31 37 28 38 21 C33 19 28 25 26 34 Z" fill="#e11d48" opacity="0.8"/>
          <ellipse cx="26" cy="34" rx="14" ry="4" fill="#881337" stroke="${o.border}" stroke-width="1"/>
          <circle cx="26" cy="24" r="2.5" fill="#fbbf24"/>
        `;break;case`relic_astral_monolith`:c=`
          <polygon points="18,12 34,12 36,38 16,38" fill="#1e293b" stroke="${o.border}" stroke-width="2"/>
          <line x1="20" y1="20" x2="32" y2="20" stroke="${o.accent}" stroke-width="1"/>
          <line x1="22" y1="27" x2="30" y2="27" stroke="${o.accent}" stroke-width="1"/>
          <circle cx="23" cy="20" r="1.5" fill="#38bdf8"/>
          <circle cx="29" cy="20" r="1.5" fill="#c084fc"/>
          <circle cx="26" cy="33" r="2" fill="#fbbf24"/>
        `;break;case`relic_sovereign_ring`:c=`
          <ellipse cx="26" cy="31" rx="13" ry="6" fill="none" stroke="${o.border}" stroke-width="3"/>
          <path d="M20 18 L26 11 L32 18 L29 23 L23 23 Z" fill="url(#${s}_sov)" stroke="#fff" stroke-width="1.5"/>
          <circle cx="26" cy="18" r="2" fill="#fff"/>
          <line x1="26" y1="8" x2="26" y2="10" stroke="#fbbf24" stroke-width="1.5"/>
          <defs>
            <linearGradient id="${s}_sov" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fb7185"/>
              <stop offset="50%" stop-color="#c084fc"/>
              <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>
          </defs>
        `;break;default:c=`
          <polygon points="26,12 38,26 26,40 14,26" fill="none" stroke="${o.border}" stroke-width="2"/>
          <circle cx="26" cy="26" r="6" fill="${o.accent}"/>
          <circle cx="26" cy="26" r="2" fill="#fff"/>
        `}return`
      <svg width="${i}" height="${i}" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" class="relic-svg-artwork" style="filter: drop-shadow(0 0 8px ${o.glow}); flex-shrink: 0;">
        <defs>
          <linearGradient id="${s}_bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${o.bgGrad1}"/>
            <stop offset="100%" stop-color="${o.bgGrad2}"/>
          </linearGradient>
        </defs>
        <!-- Background Frame -->
        <rect x="2" y="2" width="48" height="48" rx="10" fill="url(#${s}_bg)" stroke="${o.border}" stroke-width="1.8"/>
        <!-- Inner Rarity Glow Rim -->
        <rect x="4" y="4" width="44" height="44" rx="8" fill="none" stroke="${o.border}" stroke-width="0.8" opacity="0.4"/>
        <!-- Graphic -->
        ${c}
        <!-- Corner Sparkle -->
        <circle cx="8" cy="8" r="1" fill="#fff" opacity="0.8"/>
        <circle cx="44" cy="44" r="1" fill="${o.accent}" opacity="0.6"/>
      </svg>
    `}function r(e,t,n,r){let i=r||44,a={core:{main:`#fbbf24`,bg:`#451a03`,border:`#fde047`,glow:`rgba(251,191,36,0.7)`},chrono:{main:`#38bdf8`,bg:`#082f49`,border:`#7dd3fc`,glow:`rgba(56,189,248,0.6)`},crit:{main:`#f43f5e`,bg:`#4c0519`,border:`#fb7185`,glow:`rgba(244,63,94,0.6)`},fortune:{main:`#10b981`,bg:`#064e3b`,border:`#34d399`,glow:`rgba(16,185,129,0.6)`},overdrive:{main:`#a855f7`,bg:`#2e1065`,border:`#c084fc`,glow:`rgba(168,85,247,0.6)`}},o=a[t]||a.core,s=n?o.border:`#64748b`,c=n?o.main:`#334155`,l=n?o.bg:`#0f172a`,u=``;return u=e===`core`?`
        <circle cx="22" cy="22" r="9" fill="url(#core_grad)" stroke="${s}" stroke-width="1.8"/>
        <path d="M22 6 L25 15 L34 18 L26 23 L28 32 L22 26 L16 32 L18 23 L10 18 L19 15 Z" fill="${c}" opacity="0.6"/>
        <circle cx="22" cy="22" r="3.5" fill="#fff"/>
      `:e===`chrono_pulse`?`
        <circle cx="22" cy="22" r="12" fill="none" stroke="${s}" stroke-width="1.5" stroke-dasharray="3 2"/>
        <path d="M12 22 L17 22 L19 16 L22 28 L25 18 L27 22 L32 22" fill="none" stroke="${s}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="22" cy="22" r="2" fill="${c}"/>
      `:e===`chrono_warp`?`
        <circle cx="22" cy="22" r="12" fill="none" stroke="${s}" stroke-width="1.6"/>
        <polyline points="22 13 22 22 28 22" stroke="${s}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M14 16 L12 11 L17 11" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M30 28 L32 33 L27 33" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
      `:e===`chrono_overclock`?`
        <path d="M13 29 A12 12 0 1 1 31 29" fill="none" stroke="${s}" stroke-width="2" stroke-linecap="round"/>
        <line x1="22" y1="22" x2="29" y2="15" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="22" cy="22" r="3" fill="#fff"/>
        <circle cx="29" cy="15" r="1.5" fill="#f43f5e"/>
      `:e===`chrono_infinity`?`
        <path d="M16 19 C13 16 13 28 16 25 C19 22 25 22 28 25 C31 28 31 16 28 19 C25 22 19 22 16 19 Z" fill="none" stroke="${s}" stroke-width="2"/>
        <circle cx="16" cy="22" r="2.5" fill="${c}"/>
        <circle cx="28" cy="22" r="2.5" fill="${c}"/>
      `:e===`crit_focus`?`
        <circle cx="22" cy="22" r="12" fill="none" stroke="${s}" stroke-width="1.5"/>
        <circle cx="22" cy="22" r="6" fill="none" stroke="${s}" stroke-width="1.2"/>
        <line x1="22" y1="6" x2="22" y2="12" stroke="${s}" stroke-width="2" stroke-linecap="round"/>
        <line x1="22" y1="32" x2="22" y2="38" stroke="${s}" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="22" x2="12" y2="22" stroke="${s}" stroke-width="2" stroke-linecap="round"/>
        <line x1="32" y1="22" x2="38" y2="22" stroke="${s}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="22" cy="22" r="2" fill="#fff"/>
      `:e===`crit_supernova`?`
        <polygon points="22,7 24,17 34,17 26,23 29,33 22,27 15,33 18,23 10,17 20,17" fill="${c}" stroke="${s}" stroke-width="1.2"/>
        <circle cx="22" cy="22" r="4" fill="#fff"/>
      `:e===`crit_chain`?`
        <polygon points="23,9 15,22 22,22 21,35 29,22 22,22" fill="${c}" stroke="${s}" stroke-width="1.4" stroke-linejoin="round"/>
        <circle cx="13" cy="14" r="1.5" fill="#fff"/>
        <circle cx="31" cy="30" r="1.5" fill="#fff"/>
      `:e===`crit_collapse`?`
        <circle cx="22" cy="22" r="6" fill="#000" stroke="${s}" stroke-width="2"/>
        <ellipse cx="22" cy="22" rx="14" ry="4" fill="none" stroke="${s}" stroke-width="1.5" transform="rotate(-25 22 22)"/>
        <ellipse cx="22" cy="22" rx="14" ry="4" fill="none" stroke="${c}" stroke-width="1.2" transform="rotate(35 22 22)"/>
        <circle cx="22" cy="22" r="2.5" fill="#fff"/>
      `:e===`fortune_dust`?`
        <path d="M22 8 L24 18 L34 20 L24 22 L22 32 L20 22 L10 20 L20 18 Z" fill="${c}" stroke="${s}" stroke-width="1.2"/>
        <circle cx="13" cy="12" r="2" fill="#fff"/>
        <circle cx="31" cy="30" r="2" fill="#fff"/>
        <circle cx="30" cy="12" r="1.5" fill="${c}"/>
      `:e===`fortune_meteor`?`
        <line x1="33" y1="11" x2="16" y2="28" stroke="${s}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="33" y1="16" x2="22" y2="27" stroke="${c}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
        <circle cx="15" cy="29" r="4.5" fill="${c}" stroke="#fff" stroke-width="1.5"/>
      `:e===`fortune_idle`?`
        <path d="M25 12 A10 10 0 1 0 31 27 A8 8 0 1 1 25 12 Z" fill="${c}" stroke="${s}" stroke-width="1.4"/>
        <circle cx="15" cy="15" r="1.5" fill="#fff"/>
        <circle cx="19" cy="11" r="1" fill="#fff"/>
      `:e===`fortune_market`?`
        <polygon points="22,9 31,16 27,33 17,33 13,16" fill="none" stroke="${s}" stroke-width="1.8"/>
        <line x1="13" y1="16" x2="31" y2="16" stroke="${s}" stroke-width="1.2"/>
        <line x1="22" y1="9" x2="22" y2="33" stroke="${s}" stroke-width="1.2"/>
        <circle cx="22" cy="21" r="2.5" fill="#fbbf24"/>
      `:e===`overdrive_synergy`?`
        <ellipse cx="22" cy="22" rx="13" ry="5" fill="none" stroke="${s}" stroke-width="1.5" transform="rotate(-30 22 22)"/>
        <ellipse cx="22" cy="22" rx="13" ry="5" fill="none" stroke="${s}" stroke-width="1.5" transform="rotate(30 22 22)"/>
        <ellipse cx="22" cy="22" rx="13" ry="5" fill="none" stroke="${s}" stroke-width="1.5" transform="rotate(90 22 22)"/>
        <circle cx="22" cy="22" r="4" fill="${c}"/>
      `:e===`overdrive_horizon`?`
        <circle cx="22" cy="22" r="13" fill="none" stroke="${s}" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="22" cy="22" r="7" fill="${c}" stroke="#fff" stroke-width="1.2"/>
        <circle cx="22" cy="22" r="2.5" fill="#000"/>
      `:e===`overdrive_zenith`?`
        <path d="M12 28 L15 14 L22 21 L29 14 L32 28 Z" fill="${c}" stroke="${s}" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="15" cy="14" r="2" fill="#fff"/>
        <circle cx="22" cy="21" r="2" fill="#fff"/>
        <circle cx="29" cy="14" r="2" fill="#fff"/>
        <rect x="12" y="28" width="20" height="3" rx="1" fill="${s}"/>
      `:`
        <polygon points="22,10 32,22 22,34 12,22" fill="none" stroke="${s}" stroke-width="2"/>
        <circle cx="22" cy="22" r="4" fill="${c}"/>
      `,`
      <svg width="${i}" height="${i}" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" class="skill-node-svg" style="filter: drop-shadow(0 0 ${n?`8px `+o.glow:`2px rgba(0,0,0,0.5)`}); flex-shrink: 0;">
        <defs>
          <radialGradient id="core_grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="100%" stop-color="#b45309"/>
          </radialGradient>
        </defs>
        <circle cx="22" cy="22" r="19" fill="${l}" stroke="${s}" stroke-width="${n?`2`:`1.2`}"/>
        ${u}
      </svg>
    `}e.RelicArt={getRelicSvg:n,getSkillSvg:r,RARITY_THEMES:t}})(typeof window<`u`?window:void 0),(function(e){let t=null;function n(n){let r=document.getElementById(n);r&&(t&&t!==r&&t.classList.remove(`is-open`),r.classList.add(`is-open`),t=r,e.Sound&&e.Sound.playModalOpen(),n===`gemShopModal`&&d(),n===`settingsModal`&&s(),n===`skillsModal`&&T(),n===`inventoryModal`&&P(),n===`prestigeModal`&&R(),n===`achievementsModal`&&F(),n===`statsModal`&&V(),n===`dailyRewardModal`&&e.DailyRewards&&e.DailyRewards.render(),n===`cosmicEventModal`&&e.CosmicEvents&&e.CosmicEvents.render())}function r(n){let r=null;r=n?document.getElementById(n):t,r&&(r.classList.remove(`is-open`),t===r&&(t=null),e.Sound&&e.Sound.playModalClose())}function i(e){let t=Math.ceil(e),n=Math.floor(t/60),r=t%60;return n+`:`+(r<10?`0`:``)+r}function a(){let t=e.GameState.get(),n=0;t.potions&&Object.keys(t.potions).forEach(function(e){n+=t.potions[e]||0});let r=document.getElementById(`backpackBadgeCount`);r&&(r.textContent=n);let i=document.getElementById(`mobileBackpackDot`);i&&(i.style.display=n>0?`block`:`none`)}function o(t){let n=e.GameState.get(),r=!e.I18n||e.I18n.getLang()===`vi`;if(n.redeemedCodes||=[],n.redeemedCodes.includes(t))return{success:!1,message:r?`Bạn đã đổi mã này rồi!`:`Code already redeemed!`};let i=0,o=0,s=null;if(t===`TANTHU`)i=50,s=`potion_x2`;else if(t===`NEXYROTH`)i=100,o=50;else if(t===`COSMIC2026`)i=80,s=`potion_auto_50ms`;else if(t===`VOIDPOWER`)i=150,s=`potion_x50`;else if(t===`VIP999`)i=200,o=100,s=`potion_x100`;else if(t===`V8RELEASE`)i=300,o=150,s=`potion_x100`;else return{success:!1,message:r?`Mã quà tặng không hợp lệ hoặc đã hết hạn.`:`Invalid or expired code.`};return n.redeemedCodes.push(t),n.astralGems+=i,n.astralShards+=o,n.totalAstralShards+=o,s&&(n.potions||={},n.potions[s]=(n.potions[s]||0)+1),e.Sound&&e.Sound.playAchievement(),e.GameState.save(),e.UICore&&e.UICore.updateStatsDisplay(),a(),{success:!0,message:r?`Nhận thành công: +${i} 💎, +${o} Shards${s?` và +1 Thuốc`:``}!`:`Success: +${i} 💎, +${o} Shards${s?` & 1 Potion`:``}!`}}function s(){let t=document.getElementById(`settingsModalContent`);if(!t)return;let n=e.GameState.get(),r=(e.I18n?e.I18n.getLang():`vi`)===`vi`,i=!n.settings.sfxEnabled;t.innerHTML=`
      <!-- Header Version Badge -->
      <div style="text-align: center; padding: 0.6rem; border-radius: 0.75rem; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); margin-bottom: 0.875rem;">
        <span style="font-weight: 900; font-size: 0.9375rem; color: #38bdf8;">⚔️ NEXYROTH CLICKER RPG v8.0</span>
        <span style="font-size: 0.6875rem; color: #94a3b8; margin-left: 6px;">(Build 8.0 Hybrid Web/Offline)</span>
      </div>

      <!-- 1. Language Switcher -->
      <div class="setting-row" style="background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.3); border-radius: 0.875rem; padding: 0.875rem;">
        <div>
          <div style="font-weight: 800; font-size: 0.9375rem; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
            <span>🌐</span>
            <span>${r?`Ngôn Ngữ / Language`:`Language / Ngôn Ngữ`}</span>
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">
            ${r?`Chọn ngôn ngữ giao diện (Mặc định: Tiếng Việt)`:`Select interface language (Default: Vietnamese)`}
          </div>
        </div>
        <div style="display: flex; gap: 0.35rem; background: rgba(15,23,42,0.9); padding: 4px; border-radius: 0.625rem; border: 1px solid var(--nx-surface-border);">
          <button id="langViBtn" class="nx-btn ${r?`nx-btn-primary`:`nx-btn-secondary`}" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 800;">
            🇻🇳 Tiếng Việt
          </button>
          <button id="langEnBtn" class="nx-btn ${r?`nx-btn-secondary`:`nx-btn-primary`}" style="padding: 0.35rem 0.75rem; font-size: 0.8125rem; font-weight: 800;">
            🇬🇧 English
          </button>
        </div>
      </div>

      <!-- 2. Audio & Mute Controls -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid ${i?`rgba(244,63,94,0.4)`:`rgba(56,189,248,0.3)`}; padding: 1rem; display: flex; flex-direction: column; gap: 0.875rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="font-weight: 800; font-size: 0.9375rem; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
              <span>${i?`🔇`:`🔊`}</span>
              <span>${r?`Âm Thanh & Tắt Tiếng (SFX)`:`Sound & Mute Controls`}</span>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem;">
              ${r?`Tiếng hiệu ứng khi chạm Lõi, nâng cấp và thăng cấp`:`Audio cues for clicks, upgrades, and level-ups`}
            </div>
          </div>
          <button id="quickMuteBtn" class="nx-btn ${i?`nx-btn-danger`:`nx-btn-emerald`}" style="padding: 0.5rem 1rem; font-size: 0.8125rem; font-weight: 800;">
            ${i?r?`🔇 ĐÃ TẮT TIẾNG`:`🔇 MUTED`:r?`🔊 ÂM THANH: BẬT`:`🔊 SOUND: ON`}
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding-top: 0.65rem; border-top: 1px solid rgba(255,255,255,0.08);">
          <span style="font-size: 0.8125rem; color: #cbd5e1; font-weight: 700;">
            ${r?`Âm lượng tổng:`:`Master Volume:`} <strong id="volDisplay" style="color: #38bdf8;">${Math.round((n.settings.sfxVolume||.5)*100)}%</strong>
          </span>
          <input id="volumeSlider" type="range" min="0" max="1" step="0.05" value="${n.settings.sfxVolume===void 0?.5:n.settings.sfxVolume}" style="flex: 1; max-width: 200px; accent-color: #38bdf8; cursor: pointer; height: 6px;">
        </div>
      </div>

      <!-- 3. Redeem Giftcode -->
      <div style="border-radius: 0.875rem; background: linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(168,85,247,0.12) 100%); border: 1.5px solid rgba(251,191,36,0.45); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.35rem;">
          <div style="font-weight: 800; font-size: 0.9375rem; color: #fbbf24; display: flex; align-items: center; gap: 0.4rem;">
            <span>🎁</span>
            <span>${r?`Nhập Mã Quà Tặng (Giftcode)`:`Redeem Giftcode`}</span>
          </div>
          <span style="font-size: 0.6875rem; color: #94a3b8;">
            ${r?`Bấm vào mã gợi ý để điền nhanh`:`Tap a code chip below to auto-fill`}
          </span>
        </div>

        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button class="nx-code-chip" data-code="TANTHU" style="background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.4); color: #fbbf24; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + TANTHU
          </button>
          <button class="nx-code-chip" data-code="NEXYROTH" style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.4); color: #38bdf8; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + NEXYROTH
          </button>
          <button class="nx-code-chip" data-code="V8RELEASE" style="background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.4); color: #c084fc; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + V8RELEASE
          </button>
          <button class="nx-code-chip" data-code="VIP999" style="background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.4); color: #34d399; border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-family: ui-monospace, monospace; font-weight: 700; cursor: pointer;">
            + VIP999
          </button>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <input id="settingsCodeInput" type="text" placeholder="${r?`Nhập mã tại đây (VD: V8RELEASE)`:`Enter code here (e.g. V8RELEASE)`}" style="flex: 1; padding: 0.65rem 0.875rem; border-radius: 0.5rem; background: #0b1120; border: 1.5px solid rgba(251,191,36,0.35); color: #fff; font-size: 0.875rem; font-family: ui-monospace, monospace; text-transform: uppercase; font-weight: 700; outline: none;">
          <button id="settingsCodeBtn" class="nx-btn nx-btn-gold" style="padding: 0.65rem 1.25rem; font-weight: 900; font-size: 0.875rem; flex-shrink: 0;">
            🎁 ${r?`Đổi Quà`:`Redeem`}
          </button>
        </div>
        <div id="settingsCodeFeedback" style="display: none; font-size: 0.8125rem; font-weight: 700; padding: 0.5rem 0.75rem; border-radius: 0.5rem;"></div>
      </div>

      <!-- 4. Save Management: Base64 String Export / Import (UX Feature from v8.2) -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid rgba(168,85,247,0.35); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="font-weight: 800; font-size: 0.9375rem; color: #c084fc; display: flex; align-items: center; justify-content: space-between;">
          <span style="display: flex; align-items: center; gap: 0.4rem;">
            <span>💾</span>
            <span>${r?`Xuất / Nhập Save Bằng Mã Base64`:`Base64 Save Export / Import`}</span>
          </span>
          <span style="font-size: 0.6875rem; color: #94a3b8;">${r?`Đồng bộ tiến trình đa thiết bị`:`Cross-device sync`}</span>
        </div>
        <p style="font-size: 0.75rem; color: #94a3b8; margin: 0; line-height: 1.35;">
          ${r?`Sao chép đoạn mã Base64 dưới đây để lưu trữ hoặc dán mã vào để khôi phục tiến trình chơi game của bạn.`:`Copy this base64 string to backup or paste your save code to restore progress.`}
        </p>
        <div style="display: flex; gap: 0.5rem;">
          <button id="btnGenBase64" class="nx-btn nx-btn-violet" style="padding: 0.45rem 0.9rem; font-size: 0.8125rem;">
            📥 ${r?`Tạo Mã Xuất`:`Generate Export`}
          </button>
          <button id="btnCopyBase64" class="nx-btn nx-btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.8125rem;">
            📋 ${r?`Sao Chép`:`Copy`}
          </button>
        </div>
        <textarea id="saveBase64Area" rows="3" placeholder="${r?`Mã lưu Base64 sẽ hiển thị ở đây, hoặc dán mã save của bạn vào đây...`:`Base64 save string will appear here, or paste your save here...`}" style="width: 100%; border-radius: 0.5rem; background: #0b1120; border: 1px solid rgba(168,85,247,0.3); color: #e2e8f0; font-family: ui-monospace, monospace; font-size: 0.6875rem; padding: 0.5rem; outline: none;"></textarea>
        <button id="btnApplyBase64" class="nx-btn nx-btn-emerald" style="padding: 0.5rem; font-size: 0.8125rem; font-weight: 800;">
          ⚡ ${r?`NẠP DỮ LIỆU TỪ MÃ TRÊN (IMPORT SAVE)`:`IMPORT SAVE DATA`}
        </button>
      </div>

      <!-- 5. Display Toggles -->
      <div class="setting-row">
        <div>
          <div style="font-weight: 800; font-size: 0.875rem; color: #fff;">
            ${r?`Ký Hiệu Khoa Học`:`Scientific Notation`}
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            ${r?`Hiển thị dạng 1.25e9 thay vì 1.25 B`:`Display numbers like 1.25e9 instead of 1.25 B`}
          </div>
        </div>
        <button id="toggleScientific" class="toggle-switch ${n.settings.scientificNotation?`is-active`:``}">
          <span class="toggle-handle"></span>
        </button>
      </div>

      <div class="setting-row">
        <div>
          <div style="font-weight: 800; font-size: 0.875rem; color: #fff;">
            ${r?`Chữ Số Bay Khi Bấm`:`Floating Numbers`}
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            ${r?`Hiển thị số sát thương nhảy lên khi chạm Lõi`:`Show floating damage numbers on core click`}
          </div>
        </div>
        <button id="toggleFloating" class="toggle-switch ${n.settings.floatingNumbers?`is-active`:``}">
          <span class="toggle-handle"></span>
        </button>
      </div>

      <!-- 6. Tải File Dự Án .ZIP / Download Full Source Code -->
      <div style="border-radius: 0.875rem; background: linear-gradient(135deg, rgba(8,47,73,0.9) 0%, rgba(15,23,42,0.95) 100%); border: 1.5px solid rgba(56,189,248,0.5); padding: 1rem; box-shadow: 0 4px 20px rgba(56,189,248,0.2); display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.4rem;">📦</span>
            <div>
              <div style="font-weight: 900; font-size: 0.9375rem; color: #38bdf8;">
                ${r?`Tải Mã Nguồn Dự Án (.ZIP)`:`Download Project Source (.ZIP)`}
              </div>
              <div style="font-size: 0.75rem; color: #94a3b8;">
                ${r?`Tải toàn bộ file code (HTML, CSS, JS, Ảnh) để chơi offline hoặc chỉnh sửa`:`Download complete source package to play offline or modify`}
              </div>
            </div>
          </div>
          <span style="font-size: 0.6875rem; font-weight: 800; background: rgba(56,189,248,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); padding: 2px 8px; border-radius: 9999px; font-family: monospace;">v8.0 ZIP</span>
        </div>

        <a id="btnSettingsExportZipDirect" href="./nexyroth-clicker-v8.zip" download="nexyroth-clicker-v8.zip" class="nx-btn nx-btn-primary" style="width: 100%; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 800; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 0 15px rgba(56,189,248,0.4); border-radius: 0.625rem; cursor: pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>${r?`TẢI FILE DỰ ÁN (.ZIP) VỀ MÁY`:`DOWNLOAD PROJECT (.ZIP) NOW`}</span>
        </a>
      </div>

      <!-- 7. File Backup (.json) -->
      <div style="border-top: 1px solid var(--nx-surface-border); padding-top: 0.875rem; display: flex; flex-direction: column; gap: 0.625rem;">
        <div style="font-size: 0.8125rem; font-weight: 700; color: #cbd5e1; display: flex; align-items: center; gap: 0.4rem;">
          <span>💾</span>
          <span>${r?`Sao Lưu / Phục Hồi Bằng File .JSON`:`Backup / Restore via .JSON File`}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button id="btnExportSaveJson" class="nx-btn nx-btn-secondary" style="flex: 1; padding: 0.5rem;">
            ${r?`📥 Xuất File (.json)`:`📥 Export File (.json)`}
          </button>
          <button id="btnImportSaveJson" class="nx-btn nx-btn-secondary" style="flex: 1; padding: 0.5rem;">
            ${r?`📤 Nhập File`:`📤 Import File`}
          </button>
        </div>
      </div>

      <!-- 8. Danger Zone -->
      <div style="border-top: 1px solid rgba(244,63,94,0.3); padding-top: 0.75rem;">
        <button id="btnHardReset" class="nx-btn nx-btn-danger" style="width: 100%; font-size: 0.8125rem;">
          ⚠️ ${r?`XÓA TOÀN BỘ DỮ LIỆU (CHƠI LẠI TỪ ĐẦU)`:`HARD RESET (WIPE ALL PROGRESS)`}
        </button>
      </div>
    `;let a=document.getElementById(`langViBtn`),c=document.getElementById(`langEnBtn`);a&&(a.onclick=function(){e.I18n.setLang(`vi`),s()}),c&&(c.onclick=function(){e.I18n.setLang(`en`),s()});let l=document.getElementById(`quickMuteBtn`);l&&(l.onclick=function(){e.Sound&&e.Sound.toggleMute?e.Sound.toggleMute():(n.settings.sfxEnabled=!n.settings.sfxEnabled,e.GameState.save()),s()});let u=document.getElementById(`volumeSlider`),d=document.getElementById(`volDisplay`);u&&(u.oninput=function(){let t=parseFloat(u.value);e.Sound&&e.Sound.setVolume?e.Sound.setVolume(t):(n.settings.sfxVolume=t,e.GameState.save()),d&&(d.textContent=Math.round(t*100)+`%`)});let f=document.getElementById(`toggleScientific`);f&&(f.onclick=function(){n.settings.scientificNotation=!n.settings.scientificNotation,e.GameState.save(),s(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay()});let p=document.getElementById(`toggleFloating`);p&&(p.onclick=function(){n.settings.floatingNumbers=!n.settings.floatingNumbers,e.GameState.save(),s()}),t.querySelectorAll(`.nx-code-chip`).forEach(function(e){e.onclick=function(){let t=e.getAttribute(`data-code`),n=document.getElementById(`settingsCodeInput`);n&&t&&(n.value=t,n.focus())}});let m=document.getElementById(`settingsCodeBtn`),h=document.getElementById(`settingsCodeInput`),g=document.getElementById(`settingsCodeFeedback`);m&&h&&(m.onclick=function(){let e=h.value.trim().toUpperCase();if(!e)return;let t=o(e);g&&(g.style.display=`block`,g.style.background=t.success?`rgba(16,185,129,0.2)`:`rgba(239,68,68,0.2)`,g.style.color=t.success?`#34d399`:`#f87171`,g.style.border=t.success?`1px solid #10b981`:`1px solid #ef4444`,g.textContent=(t.success?`✓ `:`✗ `)+t.message,t.success&&(h.value=``))});let _=document.getElementById(`btnGenBase64`),v=document.getElementById(`btnCopyBase64`),y=document.getElementById(`saveBase64Area`),b=document.getElementById(`btnApplyBase64`);_&&y&&(_.onclick=function(){y.value=e.GameState.exportBase64(),e.Toast&&e.Toast.show(r?`Đã tạo mã lưu thành công!`:`Base64 code generated!`,`success`)}),v&&y&&(v.onclick=function(){y.value||=e.GameState.exportBase64(),navigator.clipboard.writeText(y.value).then(function(){e.Toast&&e.Toast.show(r?`Đã sao chép mã lưu vào clipboard!`:`Copied save code to clipboard!`,`success`)})}),b&&y&&(b.onclick=function(){let t=y.value.trim();if(!t){e.Toast&&e.Toast.show(r?`Vui lòng dán mã lưu trước!`:`Please paste a save code first!`,`warning`);return}let n=e.GameState.importBase64(t);n.success?(e.Toast&&e.Toast.show(r?`🎉 Nhập tiến trình thành công! Đang tải lại...`:`🎉 Save imported! Reloading...`,`success`),setTimeout(function(){window.location.reload()},600)):e.Toast&&e.Toast.show(n.error,`error`)});let x=document.getElementById(`btnExportSaveJson`);x&&(x.onclick=function(){let e=`data:text/json;charset=utf-8,`+encodeURIComponent(JSON.stringify(n)),t=document.createElement(`a`);t.setAttribute(`href`,e),t.setAttribute(`download`,`nexyroth_save_v8_`+Date.now()+`.json`),t.click()});let S=document.getElementById(`btnImportSaveJson`);S&&(S.onclick=function(){let t=document.createElement(`input`);t.type=`file`,t.accept=`.json`,t.onchange=function(t){let n=t.target.files[0];if(!n)return;let i=new FileReader;i.onload=function(t){try{let n=JSON.parse(t.target.result);n&&typeof n.essence==`number`&&(e.GameState.set(n),e.GameState.save(),window.location.reload())}catch{e.Toast&&e.Toast.show(r?`Tệp sao lưu không hợp lệ.`:`Invalid save file format.`,`error`)}},i.readAsText(n)},t.click()});let C=document.getElementById(`btnSettingsExportZip`);C&&e.ZipExport&&(C.onclick=function(){e.ZipExport.download()});let w=document.getElementById(`btnHardReset`);w&&(w.onclick=function(){confirm(r?`CẢNH BÁO: Thao tác này sẽ xoá toàn bộ tiến trình và chơi lại từ đầu. Bạn có chắc chắn không?`:`WARNING: This will wipe all game progress and restart from zero. Are you sure?`)&&(e.GameState.reset(),window.location.reload())})}let c=`gems`,l=null;function u(e){c=e,d()}function d(){let t=document.getElementById(`gemShopModalContent`);if(!t)return;let n=e.GameState.get(),r=!e.I18n||e.I18n.getLang()===`vi`,a=e.GameState.getPotionMetadata?e.GameState.getPotionMetadata():[],o=e.GameState.getGemTopupPacks?e.GameState.getGemTopupPacks():[],s=e.GameState.getGamePasses?e.GameState.getGamePasses():[],l=`
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-radius: 1rem; background: linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(56,189,248,0.12) 100%); border: 1.5px solid rgba(251,191,36,0.5); gap: 0.75rem; flex-wrap: wrap;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.5px;">
            ${r?`Số Dư Đá Quý Của Bạn (Tiền tệ hiếm)`:`Your Rare Astral Gems`}
          </div>
          <div style="font-size: 1.65rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace; text-shadow: 0 0 12px rgba(251,191,36,0.5);">
            ${n.astralGems} 💎
          </div>
        </div>
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
          <button class="nx-btn ${c===`topup`?`nx-btn-primary`:`nx-btn-gold`}" style="font-size: 0.75rem; padding: 0.45rem 0.85rem;" onclick="UIModals.setShopTab('topup')">
            💳 ${r?`+ Nạp Đá Quý (Mô Phỏng)`:`+ Top-Up (Sandbox)`}
          </button>
          <button class="nx-btn nx-btn-secondary" style="font-size: 0.75rem; padding: 0.45rem 0.85rem;" onclick="UIModals.open('inventoryModal')">
            🎒 ${r?`Mở Balo`:`Backpack`}
          </button>
        </div>
      </div>
    `,u=`
      <div class="shop-nav-tabs" style="margin-top: 0.875rem;">
        <button class="shop-tab-btn ${c===`gems`?`is-active`:``}" onclick="UIModals.setShopTab('gems')">
          <span>💎</span>
          <span>${r?`Cửa Hàng Gem`:`Gem Store`}</span>
        </button>
        <button class="shop-tab-btn ${c===`topup`?`is-active`:``}" onclick="UIModals.setShopTab('topup')">
          <span>💳</span>
          <span>${r?`Nạp Đá Quý (Mô Phỏng)`:`Top-Up Packs`}</span>
        </button>
        <button class="shop-tab-btn tab-gamepass ${c===`gamepass`?`is-active`:``}" onclick="UIModals.setShopTab('gamepass')">
          <span>👑</span>
          <span>${r?`Game Pass Vĩnh Viễn`:`VIP Game Passes`}</span>
        </button>
      </div>
    `,d=``;if(c===`gems`){let e=``;a.forEach(function(t){let a=n.potions&&n.potions[t.id]||0,o=n.activePotions&&n.activePotions[t.type]||0,s=n.astralGems>=t.costGems,c=r?t.nameVi:t.nameEn,l=r?t.descVi:t.descEn;e+=`
          <div class="nx-card" style="padding: 0.875rem; border-color: ${o>0?`rgba(56,189,248,0.5)`:`var(--nx-surface-border)`}; background: ${o>0?`rgba(8,47,73,0.35)`:`rgba(18,24,38,0.85)`};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 2.75rem; height: 2.75rem; border-radius: 0.625rem; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; flex-shrink: 0; border: 1.5px solid rgba(56,189,248,0.3);">
                  ${t.icon}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
                    <span style="font-weight: 800; font-size: 0.875rem; color: #fff;">${c}</span>
                    <span class="nx-badge" style="background: rgba(56,189,248,0.15); color: #38bdf8; font-size: 0.6875rem; font-weight: 800;">
                      ${r?`Balo: `+a:`Bag: `+a}
                    </span>
                    ${o>0?`
                      <span class="nx-badge nx-badge-emerald" style="font-size: 0.6875rem; font-weight: 800; animation: pulse 2s infinite;">
                        ${r?`⏳ Đang chạy: `:`⏳ Active: `}${i(o)}
                      </span>
                    `:``}
                  </div>
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem; line-height: 1.35;">
                    ${l}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.25rem;">
                <button class="nx-btn ${s?`nx-btn-gold`:`nx-btn-disabled`}" style="padding: 0.4rem 0.75rem; font-size: 0.75rem;" onclick="UIModals.buyPotion('${t.id}', false)">
                  💎 ${t.costGems} Gems
                </button>
                <button class="nx-btn ${s?`nx-btn-emerald`:`nx-btn-disabled`}" style="padding: 0.4rem 0.75rem; font-size: 0.75rem;" onclick="UIModals.buyPotion('${t.id}', true)">
                  ⚡ ${r?`Dùng Ngay`:`Use Now`}
                </button>
              </div>
            </div>
          </div>
        `});let t=``;n.gemShopItems.forEach(function(e){let i=n.astralGems>=e.costGems,a=e.desc;r&&(e.id===`gem_auto_click`&&(a=`Tự động bấm lõi liên tục 5 lần/giây.`),e.id===`gem_crit_overload`&&(a=`Tăng vĩnh viễn +10% Tỉ lệ Chí Mạng và +200% (+2.0) Sát Thương Chí Mạng.`)),t+=`
          <div class="nx-card" style="padding: 0.875rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
            <div style="min-width: 0;">
              <div style="font-size: 0.875rem; font-weight: 800; color: #fff;">${e.name}</div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem;">${a}</div>
            </div>
            <div>
              ${e.purchased?`<span class="nx-badge nx-badge-cyan" style="font-size: 0.75rem; font-weight: 800;">${r?`✓ ĐÃ SỞ HỮU`:`✓ OWNED`}</span>`:`<button class="nx-btn ${i?`nx-btn-gold`:`nx-btn-disabled`}" style="padding: 0.4rem 0.8rem;" onclick="UIModals.buyGemItem('${e.id}')">
                     💎 ${e.costGems} Gems
                   </button>`}
            </div>
          </div>
        `}),d=`
        <div style="margin-top: 1rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <div style="font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; color: #38bdf8; display: flex; align-items: center; gap: 0.4rem;">
              <span>🧪</span>
              <span>${r?`Thuốc Năng Lượng & Tăng Cường (Dùng Gem)`:`Timed Potions & Boosts`}</span>
            </div>
            <span style="font-size: 0.6875rem; color: #94a3b8;">${r?`⏱️ Mỗi lọ 5 phút · Cộng dồn thời gian & hệ số`:`⏱️ 5 mins · Stacks duration & multipliers`}</span>
          </div>
          <div class="shop-items-container">
            ${e}
          </div>
        </div>

        <div style="margin-top: 1.25rem; padding-bottom: 24px;">
          <div style="font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; color: #fbbf24; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>💎</span>
            <span>${r?`Đặc Quyền Vĩnh Viễn Bằng Đá Quý`:`Permanent Astral Perks`}</span>
          </div>
          <div class="shop-items-container">
            ${t}
          </div>
        </div>
      `}else if(c===`topup`){let e=``;o.forEach(function(t){t.gems+(t.bonusGems||0),e+=`
          <div class="shop-topup-card">
            ${t.badge?`
              <div style="position: absolute; top: 0.6rem; right: 0.6rem; background: linear-gradient(135deg, #ef4444, #f97316); color: #fff; font-size: 0.625rem; font-weight: 900; padding: 2px 7px; border-radius: 9999px; letter-spacing: 0.3px; box-shadow: 0 0 10px rgba(239,68,68,0.5);">
                ${t.badge}
              </div>
            `:``}

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 3.25rem; height: 3.25rem; border-radius: 0.75rem; background: rgba(251,191,36,0.15); border: 1.5px solid rgba(251,191,36,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; box-shadow: 0 0 15px rgba(251,191,36,0.2);">
                ${t.icon}
              </div>
              <div>
                <div style="font-weight: 800; font-size: 0.875rem; color: #fff;">${r?t.nameVi:t.nameEn}</div>
                <div style="font-size: 1.15rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace; margin-top: 0.15rem;">
                  +${t.gems} 💎
                  ${t.bonusGems>0?`<span style="font-size: 0.75rem; color: #34d399; font-weight: 800;">(+${t.bonusGems} thưởng)</span>`:``}
                </div>
              </div>
            </div>

            <div style="margin-top: 0.75rem; padding-top: 0.65rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <div>
                <div style="font-size: 0.95rem; font-weight: 900; color: #fff; font-family: ui-monospace, monospace;">${t.priceVnd}</div>
                <div style="font-size: 0.6875rem; color: #94a3b8;">(${t.priceUsd})</div>
              </div>
              <button class="nx-btn nx-btn-gold" style="font-size: 0.75rem; padding: 0.45rem 0.85rem; flex-shrink: 0;" onclick="UIModals.openPaymentModal('topup', '${t.id}')">
                ⚡ ${r?`Nạp Ngay`:`Top-Up`}
              </button>
            </div>
          </div>
        `}),d=`
        <div style="margin-top: 1rem; padding-bottom: 24px;">
          <div style="padding: 0.85rem 1rem; border-radius: 0.75rem; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">ℹ️</span>
            <div style="font-size: 0.75rem; color: #bae6fd; line-height: 1.4;">
              <strong>${r?`CỔNG NẠP MÔ PHỎNG (SANDBOX):`:`SIMULATED TOP-UP GATEWAY:`}</strong>
              ${r?`Đây là chức năng nạp thẻ thử nghiệm để game thủ trải nghiệm không giới hạn. Mọi thao tác nạp tiền là HOÀN TOÀN MIỄN PHÍ, KHÔNG TRỪ TIỀN THẬT!`:`This is a simulated sandbox top-up interface. Everything is 100% FREE for testing, no real money will be charged!`}
            </div>
          </div>

          <div class="shop-topup-grid">
            ${e}
          </div>
        </div>
      `}else if(c===`gamepass`){let e=``,t=n.gamePasses||{},i=t.pass_ultimate_bundle;s.forEach(function(n){let a=t[n.id]||n.id!==`pass_ultimate_bundle`&&i,o=r?n.nameVi:n.nameEn,s=r?n.descVi:n.descEn;e+=`
          <div class="nx-card" style="position: relative; padding: 1rem; border-color: ${a?`rgba(168,85,247,0.6)`:`var(--nx-surface-border)`}; background: ${a?`rgba(88,28,135,0.25)`:`rgba(18,24,38,0.85)`};">
            ${n.badge?`
              <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; font-size: 0.625rem; font-weight: 900; padding: 2px 8px; border-radius: 9999px; letter-spacing: 0.3px;">
                ${n.badge}
              </div>
            `:``}

            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.85rem; max-width: 500px;">
                <div style="width: 3.25rem; height: 3.25rem; border-radius: 0.75rem; background: rgba(168,85,247,0.15); border: 1.5px solid rgba(168,85,247,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; box-shadow: 0 0 15px rgba(168,85,247,0.25);">
                  ${n.icon}
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.95rem; color: #fff;">${o}</div>
                  <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.25rem; line-height: 1.4;">
                    ${s}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem;">
                <div style="text-align: right;">
                  <div style="font-size: 0.95rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace;">${n.priceVnd}</div>
                  <div style="font-size: 0.6875rem; color: #94a3b8;">(${n.priceUsd})</div>
                </div>
                ${a?`
                  <span class="nx-badge nx-badge-emerald" style="font-size: 0.75rem; font-weight: 900; padding: 0.45rem 0.85rem; border-color: rgba(52,211,153,0.6);">
                    ✓ ${r?`ĐÃ KÍCH HOẠT`:`ACTIVATED`}
                  </span>
                `:`
                  <button class="nx-btn nx-btn-primary" style="font-size: 0.75rem; padding: 0.45rem 0.85rem; background: linear-gradient(135deg, #a855f7, #6366f1); border-color: #c084fc;" onclick="UIModals.openPaymentModal('gamepass', '${n.id}')">
                    👑 ${r?`Mua Vĩnh Viễn`:`Unlock Pass`}
                  </button>
                `}
              </div>
            </div>
          </div>
        `}),d=`
        <div style="margin-top: 1rem; padding-bottom: 24px;">
          <div style="padding: 0.85rem 1rem; border-radius: 0.75rem; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.35); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">👑</span>
            <div style="font-size: 0.75rem; color: #e9d5ff; line-height: 1.4;">
              <strong>${r?`ĐẶC QUYỀN VIP VĨNH VIỄN KHÔNG HẠN DÙNG:`:`PERMANENT VIP PRIVILEGES:`}</strong>
              ${r?`Các gói Game Pass được lưu trữ vĩnh viễn trên tài khoản qua mọi lần Trùng Sinh và reset. Mua 1 lần sở hữu mãi mãi (Thanh toán thử nghiệm sandbox).`:`Game Passes persist permanently across all Ascensions & resets. One-time purchase, forever yours (Simulated sandbox payment).`}
            </div>
          </div>

          <div class="shop-items-container">
            ${e}
          </div>
        </div>
      `}t.innerHTML=l+u+d}function f(t,n){let r=!e.I18n||e.I18n.getLang()===`vi`,i=null;if(t===`topup`?i=(e.GameState.getGemTopupPacks?e.GameState.getGemTopupPacks():[]).find(function(e){return e.id===n}):t===`gamepass`&&(i=(e.GameState.getGamePasses?e.GameState.getGamePasses():[]).find(function(e){return e.id===n})),!i)return;l={type:t,id:n,data:i};let a=document.getElementById(`simulatedPaymentModal`),o=document.getElementById(`simulatedPaymentModalContent`);if(!a||!o)return;let s=r?i.nameVi:i.nameEn,c=r?i.descVi||`Nhận ngay +${i.gems+(i.bonusGems||0)} Đá Quý vào tài khoản!`:i.descEn||`Receive +${i.gems+(i.bonusGems||0)} Astral Gems!`;o.innerHTML=`
      <div style="text-align: center; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="width: 4rem; height: 4rem; border-radius: 1rem; background: rgba(56,189,248,0.15); border: 2px solid #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 0.75rem auto; box-shadow: 0 0 20px rgba(56,189,248,0.3);">
          ${i.icon}
        </div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${s}</div>
        <div style="font-size: 0.8125rem; color: #94a3b8; margin-top: 0.25rem;">${c}</div>
        <div style="margin-top: 0.75rem; font-size: 1.6rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace;">
          ${i.priceVnd} <span style="font-size: 0.875rem; color: #94a3b8; font-weight: 500;">(${i.priceUsd})</span>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #38bdf8; margin-bottom: 0.5rem;">
          ${r?`Phương Thức Thanh Toán (Mô Phỏng Sandbox)`:`Simulated Payment Method`}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <label class="checkout-method-label">
            <input type="radio" name="payMethod" value="momo" checked style="accent-color: #d946ef;">
            <span class="method-inner" style="font-size: 0.8125rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.4rem;">
              <span>📱</span> <span>Ví Điện Tử MoMo / ZaloPay (Sandbox)</span>
            </span>
          </label>
          <label class="checkout-method-label">
            <input type="radio" name="payMethod" value="bank" style="accent-color: #38bdf8;">
            <span class="method-inner" style="font-size: 0.8125rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.4rem;">
              <span>🏦</span> <span>Chuyển Khoản Ngân Hàng QR Code (Sandbox)</span>
            </span>
          </label>
          <label class="checkout-method-label">
            <input type="radio" name="payMethod" value="visa" style="accent-color: #fbbf24;">
            <span class="method-inner" style="font-size: 0.8125rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.4rem;">
              <span>💳</span> <span>Thẻ Quốc Tế Visa / Master / JCB (Sandbox)</span>
            </span>
          </label>
        </div>
      </div>

      <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 0.6rem; background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.06); font-size: 0.6875rem; color: #94a3b8; line-height: 1.4; text-align: center;">
        🔒 ${r?`Môi trường Sandbox thử nghiệm tính năng. Khi bấm xác nhận, hệ thống sẽ kích hoạt vật phẩm ngay lập tức mà KHÔNG trừ tiền thật của bạn.`:`Sandbox testing environment. Confirming will instantly grant the items without charging real money.`}
      </div>

      <div style="display: flex; gap: 0.5rem; margin-top: 1.25rem;">
        <button class="nx-btn nx-btn-secondary" style="flex: 1; padding: 0.65rem;" onclick="UIModals.closePaymentModal()">
          ${r?`❌ Hủy Bỏ`:`Cancel`}
        </button>
        <button class="nx-btn nx-btn-gold" style="flex: 2; padding: 0.65rem; font-weight: 800;" onclick="UIModals.confirmSandboxPayment()">
          ✅ ${r?`Xác Nhận Nạp (Mô Phỏng)`:`Confirm (Sandbox)`}
        </button>
      </div>
    `,a.classList.add(`is-open`)}function p(){let e=document.getElementById(`simulatedPaymentModal`);e&&e.classList.remove(`is-open`),l=null}function m(){if(!l){p();return}let t=e.GameState.get(),n=!e.I18n||e.I18n.getLang()===`vi`,r=l.type,i=l.id,a=l.data;if(r===`topup`){let r=(a.gems||0)+(a.bonusGems||0);if(t.astralGems=(t.astralGems||0)+r,e.Sound&&e.Sound.playAchievement(),e.Toast){let t=n?`🎉 Nạp mô phỏng thành công ${a.nameVi}! Bạn nhận được +${r} 💎 Đá Quý vào số dư!`:`🎉 Simulated top-up successful for ${a.nameEn}! +${r} Gems added!`;e.Toast.show(t,`success`)}}else if(r===`gamepass`&&(t.gamePasses||={},t.gamePasses[i]=!0,i===`pass_ultimate_bundle`&&(t.gamePasses.pass_autoclick_perm=!0,t.gamePasses.pass_double_essence=!0,t.gamePasses.pass_fortune_loot=!0,t.gamePasses.pass_offline_24h=!0,t.gamePasses.pass_crit_overdrive=!0),e.Sound&&e.Sound.playAchievement(),e.Toast)){let t=n?`👑 Kích hoạt thành công Game Pass: ${a.nameVi} vĩnh viễn trên tài khoản!`:`👑 Game Pass Activated: ${a.nameEn} permanently unlocked!`;e.Toast.show(t,`success`)}e.GameState.save(),e.UICore&&(e.UICore.updateStatsDisplay(),e.UICore.updateActiveBuffs&&e.UICore.updateActiveBuffs()),p(),d()}function h(t,n){let r=e.GameState.get(),o=(e.GameState.getPotionMetadata?e.GameState.getPotionMetadata():[]).find(function(e){return e.id===t});if(!o)return;let s=!e.I18n||e.I18n.getLang()===`vi`;if(r.astralGems<o.costGems){let t=s?`Bạn không đủ Đá Quý (Cần ${o.costGems} 💎, hiện có ${r.astralGems} 💎)!`:`Not enough Gems!`;e.Toast&&e.Toast.show(t,`warning`),e.Sound&&e.Sound.playError();return}if(r.astralGems-=o.costGems,r.potions||={},n){r.activePotions||={};let t=r.activePotions[o.type]||0;if(r.activePotions[o.type]=t+(o.duration||300),r.potionsUsed=(r.potionsUsed||0)+1,e.Toast){let t=i(r.activePotions[o.type]),n=s?`✨ Đã mua & kích hoạt ${o.nameVi}! Thời gian hiệu lực: ${t}`:`✨ Bought & activated ${o.nameEn}! (${t})`;e.Toast.show(n,`success`)}}else if(r.potions[t]=(r.potions[t]||0)+1,e.Toast){let t=s?`🎒 Đã mua ${o.nameVi} và cất vào Balo!`:`🎒 Purchased ${o.nameEn} to Backpack!`;e.Toast.show(t,`info`)}e.Sound&&e.Sound.playUpgrade(),e.GameState.save(),e.UICore&&(e.UICore.updateStatsDisplay(),e.UICore.updateActiveBuffs&&e.UICore.updateActiveBuffs()),a(),d(),P()}function g(t){let n=e.GameState.get(),r=n.gemShopItems.find(function(e){return e.id===t});if(!r||r.purchased||n.astralGems<r.costGems){e.Sound&&e.Sound.playError();return}n.astralGems-=r.costGems,r.purchased=!0,e.Sound&&e.Sound.playAchievement(),e.GameState.save(),e.UICore&&e.UICore.updateStatsDisplay(),d(),P()}let _=`all`,v=`core`;function y(t){if(_=t,t!==`all`){let n=e.GameState.get().skills.find(function(e){return e.branch===t});n&&(v=n.id)}T()}function b(e){v=e,T()}function x(){let t=e.GameState.get(),n=!e.I18n||e.I18n.getLang()===`vi`,r=0;if(t.skills.forEach(function(e){e.id!==`core`&&(e.level&&e.level>0?(r+=e.level*e.costPoints,e.level=0,e.unlocked=!1):e.unlocked&&=(r+=e.costPoints,e.level=0,!1))}),r<=0){e.Toast&&e.Toast.show(n?`Bạn chưa đầu tư điểm kỹ năng nào để tẩy.`:`No skill points invested to reset.`,`info`);return}t.skillPoints+=r,v=`core`,e.Sound&&e.Sound.playAchievement(),e.Toast&&e.Toast.show(n?`✨ Tẩy kỹ năng thành công! Hoàn trả lại +${r} Điểm Kỹ Năng (SP)!`:`✨ Skills reset! Refunded +${r} Skill Points!`,`success`),e.GameState.save(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay(),T()}function S(t){let n=e.GameState.get(),r=n.skills.find(function(e){return e.id===t});if(r&&r.id!==`core`&&!(!r.isInfinite&&(r.level||0)>=r.maxLevel)&&!(r.requires&&r.requires.length>0&&!r.requires.every(function(e){let t=n.skills.find(function(t){return t.id===e});return t&&t.unlocked}))){if(n.skillPoints<r.costPoints){if(e.Toast){let t=!e.I18n||e.I18n.getLang()===`vi`;e.Toast.show(t?`Thiếu Điểm Kỹ Năng (${n.skillPoints}/${r.costPoints} SP)`:`Not enough SP`,`warning`)}return}if(n.skillPoints-=r.costPoints,r.level=(r.level||0)+1,r.unlocked=!0,v=r.id,e.Sound&&e.Sound.playUpgrade(),e.Toast){let t=!e.I18n||e.I18n.getLang()===`vi`,n=t&&r.nameVi||r.name;e.Toast.show(t?`⭐ Nâng cấp / Khai mở ${n} lên Cấp ${r.level}!`:`⭐ Upgraded ${r.name} to Lv ${r.level}!`,`success`)}e.GameState.save(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay(),T()}}function C(e){S(e)}function w(e){S(e)}function T(){let t=document.getElementById(`skillsModalContent`);if(!t)return;let n=e.GameState.get(),r=!e.I18n||e.I18n.getLang()===`vi`,i=0;n.skills.forEach(function(e){e.id!==`core`&&(e.level&&e.level>0?i+=e.level*e.costPoints:e.unlocked&&(i+=e.costPoints))});let a=document.getElementById(`skillPointsBadge`);a&&(a.textContent=n.skillPoints+(r?` Điểm SP`:` SP Available`));let o=[{id:`chrono`,name:r?`Chrono (Tốc Độ)`:`Chrono & Speed`,icon:`🌌`,color:`#38bdf8`,glow:`rgba(56,189,248,0.6)`,bg:`#082f49`},{id:`crit`,name:r?`Crits (Bạo Kích)`:`Crits & Damage`,icon:`💥`,color:`#f43f5e`,glow:`rgba(244,63,94,0.6)`,bg:`#4c0519`},{id:`fortune`,name:r?`Fortune (May Mắn)`:`Cosmic Fortune`,icon:`💎`,color:`#10b981`,glow:`rgba(16,185,129,0.6)`,bg:`#064e3b`},{id:`overdrive`,name:r?`Overdrive (Tối Thượng)`:`Cosmic Overdrive`,icon:`🔥`,color:`#a855f7`,glow:`rgba(168,85,247,0.6)`,bg:`#2e1065`}],s=`
      <button class="constellation-chip ${_===`all`?`is-active`:``}" 
              style="--chip-bg: rgba(129,140,248,0.25); --chip-border: #818cf8; --chip-color: #c7d2fe; --chip-glow: rgba(129,140,248,0.4);" 
              onclick="UIModals.setSkillBranch('all')">
        <span>🌟</span>
        <span>${r?`Tất Cả Chòm Sao`:`All Constellations`}</span>
      </button>
    `;o.forEach(function(e){let t=n.skills.filter(function(t){return t.branch===e.id}),r=t.filter(function(e){return e.unlocked}).length,i=_===e.id;s+=`
        <button class="constellation-chip ${i?`is-active`:``}" 
                style="--chip-bg: rgba(${e.color===`#38bdf8`?`56,189,248`:e.color===`#f43f5e`?`244,63,94`:e.color===`#10b981`?`16,185,129`:`168,85,247`}, 0.22); --chip-border: ${e.color}; --chip-color: ${e.color}; --chip-glow: ${e.glow};" 
                onclick="UIModals.setSkillBranch('${e.id}')">
          <span>${e.icon}</span>
          <span>${e.name}</span>
          <span style="font-size: 0.65rem; opacity: 0.85; font-family: ui-monospace, monospace; background: rgba(0,0,0,0.35); padding: 1px 5px; border-radius: 9999px;">
            ${r}/${t.length}
          </span>
        </button>
      `});let c=``;n.skills.forEach(function(e){e.requires&&e.requires.length!==0&&e.requires.forEach(function(t){let r=n.skills.find(function(e){return e.id===t});if(!r)return;let i=e.requires.every(function(e){let t=n.skills.find(function(t){return t.id===e});return t&&t.unlocked}),a=n.skillPoints>=e.costPoints,s=i&&a&&(e.isInfinite||(e.level||0)<e.maxLevel),l=(o.find(function(t){return t.id===e.branch})||{color:`#fbbf24`,glow:`rgba(251,191,36,0.6)`}).color;r.unlocked&&e.unlocked?c+=`
            <line x1="${r.x}%" y1="${r.y}%" x2="${e.x}%" y2="${e.y}%" stroke="${l}" stroke-width="2.5" stroke-linecap="round" opacity="0.95" filter="url(#line-neon-glow)" />
            <line x1="${r.x}%" y1="${r.y}%" x2="${e.x}%" y2="${e.y}%" stroke="#fff" stroke-width="0.8" stroke-linecap="round" opacity="0.85" />
          `:r.unlocked&&s?c+=`
            <line x1="${r.x}%" y1="${r.y}%" x2="${e.x}%" y2="${e.y}%" stroke="${l}" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 3" class="constellation-svg-line-flow" opacity="0.85" />
          `:c+=`
            <line x1="${r.x}%" y1="${r.y}%" x2="${e.x}%" y2="${e.y}%" stroke="#334155" stroke-width="1.2" stroke-dasharray="2 3" opacity="0.45" />
          `})});let l=``;n.skills.forEach(function(t){let r=t.id===`core`,i=v===t.id,a=_!==`all`&&t.branch!==_&&!r,s=!t.requires||t.requires.length===0||t.requires.every(function(e){let t=n.skills.find(function(t){return t.id===e});return t&&t.unlocked}),c=n.skillPoints>=t.costPoints,u=s&&c&&(t.isInfinite||(t.level||0)<t.maxLevel),d=o.find(function(e){return e.id===t.branch})||{color:`#fbbf24`,glow:`rgba(251,191,36,0.6)`,bg:`#451a03`},f=e.RelicArt&&e.RelicArt.getSkillSvg?e.RelicArt.getSkillSvg(t.id,t.branch,t.unlocked,r?46:38):`<span style="font-size: 1.25rem;">${r?`⭐`:d.icon}</span>`;l+=`
        <div class="constellation-node-badge ${r?`is-core`:``} ${t.unlocked?`is-unlocked`:u?`is-available`:`is-locked`} ${i?`is-selected`:``}"
             style="left: ${t.x}%; top: ${t.y}%; --node-color: ${d.color}; --node-glow: ${d.glow}; --node-bg: ${d.bg}; ${a?`opacity: 0.22;`:``}"
             onclick="UIModals.selectSkillNode('${t.id}')"
             title="${t.nameVi||t.name}">
          ${f}
          ${t.level&&t.level>0&&!r?`
            <span class="node-level-tag">${t.isInfinite?`∞`+t.level:t.level+`/`+t.maxLevel}</span>
          `:``}
          ${!t.unlocked&&!u&&!r?`
            <span class="node-lock-tag">🔒</span>
          `:``}
          ${u&&!t.unlocked?`
            <span style="position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; border-radius: 50%; background: #fde047; box-shadow: 0 0 8px #fde047; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          `:``}
        </div>
      `});let u=n.skills.find(function(e){return e.id===v})||n.skills[0],d=u.id===`core`,f=o.find(function(e){return e.id===u.branch})||{name:`Astral Core`,icon:`⭐`,color:`#fbbf24`,glow:`rgba(251,191,36,0.6)`},p=!u.requires||u.requires.length===0||u.requires.every(function(e){let t=n.skills.find(function(t){return t.id===e});return t&&t.unlocked}),m=n.skillPoints>=u.costPoints,h=p&&m&&(u.isInfinite||(u.level||0)<u.maxLevel),g=!u.isInfinite&&(u.level||0)>=u.maxLevel&&!d,y=``;u.requires&&u.requires.length>0&&(y=u.requires.map(function(e){let t=n.skills.find(function(t){return t.id===e});return t?r&&t.nameVi||t.name:e}).join(`, `));let b=``,x=``,S=u.level||0;if(u.id===`chrono_pulse`)b=S>0?`+${S*10}% CPS tự động`:``,x=`+${(S+1)*10}% CPS tự động`;else if(u.id===`chrono_warp`)b=S>0?`+${S*15}% tốc độ Auto-Click`:``,x=`+${(S+1)*15}% tốc độ Auto-Click`;else if(u.id===`chrono_overclock`)b=S>0?`+${S*25}% thời lượng bùa lợi`:``,x=`+${(S+1)*25}% thời lượng bùa lợi`;else if(u.id===`chrono_infinity`)b=S>0?`-50% hồi chiêu toàn bộ kỹ năng`:``,x=`-50% hồi chiêu toàn bộ kỹ năng kích hoạt`;else if(u.id===`crit_focus`)b=S>0?`+${S*5}% Tỉ lệ Bạo Kích (Crit Chance)`:``,x=`+${(S+1)*5}% Tỉ lệ Bạo Kích`;else if(u.id===`crit_supernova`)b=S>0?`+${S*100}% Sát thương Bạo Kích (Crit Damage)`:``,x=`+${(S+1)*100}% Sát thương Bạo Kích`;else if(u.id===`crit_chain`)b=S>0?`+${S*35}% sát thương Click Bạo Kích & tăng combo`:``,x=`+${(S+1)*35}% sát thương Click Bạo Kích`;else if(u.id===`crit_collapse`)b=S>0?`Nhân x2 Năng lượng thu hoạch từ mọi cú Bạo Kích`:``,x=`Nhân x2 Năng lượng thu hoạch từ toàn bộ cú Bạo Kích`;else if(u.id===`fortune_dust`)b=S>0?`+${S*20}% Astral Shards khi Thăng Thiên / Trùng Sinh`:``,x=`+${(S+1)*20}% Astral Shards khi Trùng Sinh`;else if(u.id===`fortune_meteor`)b=S>0?`+${S*30}% tần suất xuất hiện Thiên Thạch & Khe Nứt`:``,x=`+${(S+1)*30}% tần suất Thiên Thạch & Khe Nứt`;else if(u.id===`fortune_idle`)b=S>0?`+${S*50}% hiệu suất thu thập ngoại tuyến AFK`:``,x=`+${(S+1)*50}% hiệu suất AFK`;else if(u.id===`fortune_market`)b=S>0?`-15% giá mua tất cả nâng cấp trạm vũ trụ`:``,x=`-15% chi phí mua công trình / upgrades`;else if(u.id===`overdrive_synergy`){let e=Math.round(S*(n.skillPoints||0));b=S>0?`+${e}% CPS (+${S}% mỗi SP chưa dùng: ${n.skillPoints} SP)`:``,x=`+${S+1}% CPS cho mỗi điểm SP chưa dùng`}else u.id===`overdrive_horizon`?(b=S>0?`+50% toàn bộ sản lượng trong 30s khi dùng kỹ năng`:``,x=`+50% toàn bộ sản lượng trong 30s khi dùng kỹ năng`):u.id===`overdrive_zenith`&&(b=S>0?`+${S*5}% toàn bộ Click, CPS, Crit và May Mắn`:``,x=`+${(S+1)*5}% toàn bộ chỉ số nhân vật (Vô Hạn Cấp)`);let C=e.RelicArt&&e.RelicArt.getSkillSvg?e.RelicArt.getSkillSvg(u.id,u.branch,u.unlocked,64):`<div style="font-size: 2.5rem;">${f.icon}</div>`,w=0,T=0,E=0,D=0,O=0,k=0,A=0;n.skills.forEach(function(e){if(!e.unlocked)return;let t=e.level||1;e.id===`chrono_pulse`&&(T+=t*.1),e.id===`chrono_overclock`&&(w+=t*.1),e.id===`chrono_infinity`&&(A+=.5),e.id===`crit_focus`&&(E+=t*.05),e.id===`crit_supernova`&&(D+=t*1),e.id===`crit_chain`&&(w+=t*.35),e.id===`fortune_dust`&&(O+=t*.2),e.id===`fortune_idle`&&(k+=t*.5),e.id===`overdrive_synergy`&&(T+=t*.01*(n.skillPoints||0)),e.id===`overdrive_zenith`&&(w+=t*.05,T+=t*.05,E+=t*.02,k+=t*.05)}),t.innerHTML=`
      <!-- 1. Header Toolbar: SP Balance, Invested & Respec Button -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.65rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
          <div style="background: rgba(15,23,42,0.85); padding: 0.4rem 0.85rem; border-radius: 0.65rem; border: 1.5px solid rgba(129,140,248,0.45); font-size: 0.8125rem; font-family: ui-monospace, monospace; display: flex; align-items: center; gap: 0.45rem;">
            <span style="color: #94a3b8;">${r?`SP Khả dụng:`:`Available:`}</span>
            <strong style="color: #818cf8; font-size: 1.05rem;">${n.skillPoints} SP</strong>
          </div>

          <div style="background: rgba(15,23,42,0.85); padding: 0.4rem 0.85rem; border-radius: 0.65rem; border: 1px solid rgba(255,255,255,0.1); font-size: 0.8125rem; font-family: ui-monospace, monospace;">
            <span style="color: #94a3b8;">${r?`Đã đầu tư:`:`Invested:`}</span>
            <strong style="color: #34d399; font-size: 0.95rem; margin-left: 3px;">${i} SP</strong>
          </div>
        </div>

        <button class="nx-btn nx-btn-secondary" 
                style="padding: 0.4rem 0.85rem; font-size: 0.75rem; font-weight: 800; border-color: rgba(244,63,94,0.4); color: #fb7185;" 
                onclick="UIModals.respecSkills()" 
                title="${r?`Hoàn lại 100% điểm SP đã đầu tư`:`Refund all invested skill points`}">
          🔄 ${r?`Tẩy Điểm (Free)`:`Respec All SP`}
        </button>
      </div>

      <!-- 2. Branch Filter Bar -->
      <div class="constellation-filter-bar">
        ${s}
      </div>

      <!-- 3. Dual-View: Constellation Map Viewport + Side Glassmorphism Inspector -->
      <div class="constellation-observatory">
        
        <!-- Interactive Viewport -->
        <div class="constellation-viewport">
          <div class="constellation-nebula-bg"></div>
          <div class="constellation-stars-bg"></div>

          <!-- Cardinal Direction Labels -->
          <div class="branch-cardinal-label" style="top: 3.5%; left: 45%; color: #c084fc;">
            <span>🔥</span>
            <span>OVERDRIVE (BẮC)</span>
          </div>
          <div class="branch-cardinal-label" style="top: 48%; left: 2.5%; color: #38bdf8;">
            <span>🌌</span>
            <span>CHRONO (TÂY)</span>
          </div>
          <div class="branch-cardinal-label" style="top: 48%; right: 2.5%; color: #fb7185;">
            <span>💥</span>
            <span>CRITS (ĐÔNG)</span>
          </div>
          <div class="branch-cardinal-label" style="bottom: 3.5%; left: 45%; color: #34d399;">
            <span>💎</span>
            <span>FORTUNE (NAM)</span>
          </div>

          <!-- Dynamic SVG Connection Lines -->
          <svg class="constellation-svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="line-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            ${c}
          </svg>

          <!-- 16 Interactive Celestial Nodes -->
          ${l}
        </div>

        <!-- Side Glassmorphism Inspector Panel -->
        <div class="constellation-inspector-panel">
          <div>
            <!-- Branch Tag -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="nx-badge" style="background: rgba(${f.color===`#38bdf8`?`56,189,248`:f.color===`#f43f5e`?`244,63,94`:f.color===`#10b981`?`16,185,129`:`168,85,247`}, 0.2); color: ${f.color}; font-weight: 800; font-size: 0.75rem;">
                ${f.icon} ${d?r?`Lõi Tinh Vân`:`Astral Origin`:f.name}
              </span>
              ${d?`
                <span class="nx-badge nx-badge-gold" style="font-size: 0.6875rem; font-weight: 800;">✦ CORE</span>
              `:g?`
                <span class="nx-badge nx-badge-emerald" style="font-size: 0.6875rem; font-weight: 800;">✓ MAX LV</span>
              `:u.unlocked?`
                <span class="nx-badge nx-badge-cyan" style="font-size: 0.6875rem; font-weight: 800;">CẤP ${u.level}/${u.maxLevel}</span>
              `:h?`
                <span class="nx-badge nx-badge-gold" style="font-size: 0.6875rem; font-weight: 800; animation: pulse 1.5s infinite;">⚡ KHẢ DỤNG</span>
              `:`
                <span class="nx-badge nx-badge-rose" style="font-size: 0.6875rem; font-weight: 800;">🔒 CHƯA KHẢ DỤNG</span>
              `}
            </div>

            <!-- Header Info -->
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.85rem;">
              <div style="position: relative; width: 64px; height: 64px; border-radius: 50%; background: radial-gradient(circle, ${f.bg} 0%, #0f172a 90%); border: 2px solid ${f.color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${f.glow}; flex-shrink: 0;">
                ${C}
              </div>
              <div style="min-width: 0;">
                <div style="font-size: 1.1rem; font-weight: 900; color: #fff; line-height: 1.25; letter-spacing: -0.01em;">
                  ${r&&u.nameVi||u.name}
                </div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem; font-family: ui-monospace, monospace;">
                  ${u.name}
                </div>
              </div>
            </div>

            <!-- Lore Description -->
            <div style="font-size: 0.8125rem; color: #cbd5e1; line-height: 1.45; padding: 0.65rem 0.8rem; border-radius: 0.65rem; background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.06); margin-bottom: 0.85rem;">
              ${r?u.descVi||u.desc:u.descEn||u.desc}
            </div>

            <!-- Dynamic Bonuses Breakdown -->
            <div style="display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.75rem;">
              ${b?`
                <div style="padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); color: #34d399; font-weight: 800;">
                  ✦ ${r?`Đang kích hoạt: `:`Active: `} ${b}
                </div>
              `:``}

              ${!g&&!d&&x?`
                <div style="padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); color: #7dd3fc;">
                  ✦ ${r?`Cấp tiếp theo: `:`Next Level: `} <strong>${x}</strong>
                </div>
              `:``}

              ${!p&&y?`
                <div style="padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #f87171; font-weight: 700;">
                  🔒 ${r?`Yêu cầu mở trước: `:`Prerequisites: `} <strong>${y}</strong>
                </div>
              `:``}
            </div>
          </div>

          <!-- Bottom Action Area -->
          <div style="margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.6875rem; text-transform: uppercase; color: #94a3b8; font-weight: 800;">
                ${r?`Chi Phí Khai Mở`:`Skill Cost`}
              </div>
              <div style="font-size: 1.15rem; font-weight: 900; color: #fbbf24; font-family: ui-monospace, monospace;">
                ${d?`0 SP`:u.costPoints+` SP`}
              </div>
            </div>

            <div>
              ${d?`
                <button class="nx-btn nx-btn-secondary" style="font-size: 0.8125rem; padding: 0.5rem 1rem; opacity: 0.7; cursor: default;" disabled>
                  ✓ ${r?`Gốc Tinh Vân`:`Origin Core`}
                </button>
              `:g?`
                <button class="nx-btn nx-btn-secondary" style="font-size: 0.8125rem; padding: 0.5rem 1rem; opacity: 0.65; cursor: default;" disabled>
                  ✓ ${r?`Đã Tối Đa`:`Max Level`}
                </button>
              `:h?`
                <button class="nx-btn nx-btn-primary" 
                        style="font-size: 0.8125rem; padding: 0.55rem 1.15rem; font-weight: 900; background: linear-gradient(135deg, ${f.color}, #6366f1); border-color: ${f.color}; box-shadow: 0 0 15px ${f.glow};" 
                        onclick="UIModals.unlockOrUpgradeSkill('${u.id}')">
                  ⚡ ${u.level>0?r?`Nâng Cấp (+1 Cấp)`:`Upgrade (+1 Lv)`:r?`Khai Mở Kỹ Năng`:`Unlock Skill`}
                </button>
              `:`
                <button class="nx-btn nx-btn-disabled" style="font-size: 0.8125rem; padding: 0.5rem 1rem;" disabled>
                  🔒 ${p?r?`Thiếu SP`:`Need SP`:r?`Chưa Mở Tiên Quyết`:`Locked`}
                </button>
              `}
            </div>
          </div>

        </div>

      </div>

      <!-- 4. Active Perks HUD Summary -->
      <div style="padding: 0.75rem 1rem; border-radius: 0.875rem; background: linear-gradient(135deg, rgba(30,27,75,0.7) 0%, rgba(15,23,42,0.85) 100%); border: 1px solid rgba(129,140,248,0.3); margin-top: 0.5rem;">
        <div style="font-size: 0.75rem; font-weight: 800; color: #a5b4fc; text-transform: uppercase; margin-bottom: 0.4rem; display: flex; align-items: center; justify-content: space-between;">
          <span style="display: flex; align-items: center; gap: 0.35rem;">
            <span>✨</span>
            <span>${r?`Sức Mạnh Chòm Sao Đang Kích Hoạt`:`Active Constellation Blessings`}</span>
          </span>
          <span style="color: #94a3b8; font-size: 0.6875rem; text-transform: none;">
            ${r?`Tự động kích hoạt vĩnh viễn`:`Permanently active`}
          </span>
        </div>
        <div style="display: flex; gap: 0.5rem 1.25rem; flex-wrap: wrap; font-size: 0.75rem; font-family: ui-monospace, monospace;">
          <div style="color: #cbd5e1;">Click Power: <strong style="color: #c084fc;">+${Math.round(w*100)}%</strong></div>
          <div style="color: #cbd5e1;">Tự Động CPS: <strong style="color: #38bdf8;">+${Math.round(T*100)}%</strong></div>
          <div style="color: #cbd5e1;">Tỉ Lệ Crit: <strong style="color: #f0abfc;">+${Math.round(E*100)}%</strong></div>
          <div style="color: #cbd5e1;">Sát Thương Crit: <strong style="color: #f43f5e;">+${Math.round(D*100)}%</strong></div>
          <div style="color: #cbd5e1;">Astral Shards: <strong style="color: #818cf8;">+${Math.round(O*100)}%</strong></div>
          <div style="color: #cbd5e1;">Hiệu Suất AFK: <strong style="color: #34d399;">+${Math.round(k*100)}%</strong></div>
          ${A>0?`<div style="color: #cbd5e1;">Giảm Hồi Chiêu: <strong style="color: #fbbf24;">-${Math.round(A*100)}%</strong></div>`:``}
        </div>
      </div>
    `}let E=`relics`,D=`all`;function O(e){E=e,P()}function k(e){D=e,P()}function A(t){let n=e.GameState.get();if(!n.potions||(n.potions[t]||0)<=0)return;let r=(e.GameState.getPotionMetadata?e.GameState.getPotionMetadata():[]).find(function(e){return e.id===t});if(!r)return;--n.potions[t],n.activePotions||={};let o=n.activePotions[r.type]||0;n.activePotions[r.type]=o+(r.duration||300),n.potionsUsed=(n.potionsUsed||0)+1;let s=!e.I18n||e.I18n.getLang()===`vi`,c=s?r.nameVi:r.nameEn,l=i(n.activePotions[r.type]);e.Sound&&e.Sound.playUpgrade(),e.Toast&&e.Toast.show(s?`✨ Đã sử dụng ${c}! Thời gian hiệu lực: ${l}`:`✨ Activated ${c}! (${l})`,`success`),e.GameState.save(),e.UICore&&(e.UICore.updateStatsDisplay(),e.UICore.updateActiveBuffs&&e.UICore.updateActiveBuffs()),a(),P()}function j(){let t=e.GameState.get(),n=!e.I18n||e.I18n.getLang()===`vi`;t.relics.forEach(function(e){e.equipped=!1});let r=t.relics.map(function(e){let t=e.clickBonus||0,n=e.cpsBonus||0,r=e.critBonus||0,i=e.bossDamageBonus||0,a=e.gemDropBonus||0,o=e.itemDropBonus||0,s=e.offlineBonus||0;return{relic:e,score:t*100+n*100+r*200+i*80+a*80+o*80+s*60}});r.sort(function(e,t){return t.score-e.score});for(let e=0;e<Math.min(4,r.length);e++)r[e].relic.equipped=!0;e.Sound&&e.Sound.playAchievement(),e.Toast&&e.Toast.show(n?`⚡ Đã tự động trang bị 4 Cổ Vật mạnh nhất!`:`⚡ Auto-equipped best 4 Relics!`,`success`),e.GameState.save(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay(),P()}function M(t){let n=e.GameState.get(),r=n.relics.find(function(e){return e.id===t});if(!r)return;let i=!e.I18n||e.I18n.getLang()===`vi`;if(r.equipped)r.equipped=!1,e.Toast&&e.Toast.show(i?`Đã tháo: ${r.name}`:`Unequipped: ${r.name}`,`info`);else{if(n.relics.filter(function(e){return e.equipped}).length>=4){let t=i?`Bạn chỉ có thể trang bị tối đa 4 Cổ Vật cùng lúc. Hãy tháo bớt một món trước!`:`You can only equip up to 4 Relics. Unequip one first!`;e.Toast&&e.Toast.show(t,`warning`),e.Sound&&e.Sound.playError();return}r.equipped=!0,e.Toast&&e.Toast.show(i?`⚔️ Đã trang bị: ${r.name}!`:`⚔️ Equipped: ${r.name}!`,`success`)}e.Sound&&e.Sound.playClick(),e.GameState.save(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay(),P()}function N(t){let n=e.GameState.get().relics.find(function(e){return e.id===t});n&&n.equipped&&(n.equipped=!1,e.Sound&&e.Sound.playClick(),e.GameState.save(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay(),P())}function P(){let t=document.getElementById(`inventoryModalContent`);if(!t)return;let n=e.GameState.get(),r=!e.I18n||e.I18n.getLang()===`vi`,a=e.GameState.getPotionMetadata?e.GameState.getPotionMetadata():[],o=0;n.potions&&Object.keys(n.potions).forEach(function(e){o+=n.potions[e]||0});let s=n.relics.filter(function(e){return e.equipped}),c=s.length,l=document.getElementById(`relicsEquippedBadge`);l&&(l.textContent=E===`potions`?`${o} ${r?`Thuốc trong Balo`:`Potions in Bag`}`:`${c} / 4 ${r?`Cổ Vật Đang Dùng`:`Equipped`}`);let u=``;if(E===`potions`){let e=``;a.forEach(function(t){let a=n.potions&&n.potions[t.id]||0,o=n.activePotions&&n.activePotions[t.type]||0,s=r?t.nameVi:t.nameEn,c=r?t.descVi:t.descEn;e+=`
          <div class="nx-card" style="padding: 0.875rem; border-color: ${o>0?`rgba(56,189,248,0.5)`:a>0?`rgba(56,189,248,0.3)`:`var(--nx-surface-border)`}; background: ${o>0?`rgba(8,47,73,0.3)`:`rgba(18,24,38,0.85)`};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; border: 1.5px solid rgba(56,189,248,0.3);">
                  ${t.icon}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
                    <span style="font-weight: 800; font-size: 0.9375rem; color: #fff;">${s}</span>
                    <span class="nx-badge" style="background: ${a>0?`rgba(56,189,248,0.25)`:`rgba(71,85,105,0.4)`}; color: ${a>0?`#38bdf8`:`#94a3b8`}; font-weight: 800; font-size: 0.75rem;">
                      ${r?`Số lượng: `:`Owned: `}<strong>x${a}</strong>
                    </span>
                    ${o>0?`
                      <span class="nx-badge nx-badge-emerald" style="font-weight: 800; font-size: 0.6875rem; animation: pulse 2s infinite;">
                        ${r?`⏳ Đang chạy: `:`⏳ Active: `}${i(o)}
                      </span>
                    `:``}
                  </div>
                  <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.25rem; line-height: 1.35;">
                    ${c}
                  </div>
                </div>
              </div>

              <div>
                ${a>0?`
                  <button class="nx-btn nx-btn-emerald" style="padding: 0.5rem 1.15rem; font-weight: 800; font-size: 0.8125rem;" onclick="UIModals.usePotion('${t.id}')">
                    ✨ ${r?`SỬ DỤNG (+5 PHÚT)`:`USE (+5 MINS)`}
                  </button>
                `:`
                  <button class="nx-btn nx-btn-gold" style="padding: 0.45rem 0.85rem; font-size: 0.75rem;" onclick="UIModals.buyPotion('${t.id}', false)">
                    💎 ${r?`Mua Tại Shop`:`Buy in Shop`} (${t.costGems})
                  </button>
                `}
              </div>
            </div>
          </div>
        `}),u=`
        <div style="display: flex; flex-direction: column; gap: 0.625rem;">
          ${e}
        </div>
      `}else{let t=0,i=0,a=0,o=0,l=0,d=0,f=0;s.forEach(function(e){t+=e.clickBonus||0,i+=e.cpsBonus||0,a+=e.critBonus||0,o+=e.bossDamageBonus||0,l+=e.gemDropBonus||0,d+=e.itemDropBonus||0,f+=e.offlineBonus||0});let p=``;for(let t=0;t<4;t++){let n=s[t];if(n){let i=e.RelicArt&&e.RelicArt.RARITY_THEMES&&e.RelicArt.RARITY_THEMES[n.rarity]?e.RelicArt.RARITY_THEMES[n.rarity]:{border:`#38bdf8`,glow:`rgba(56,189,248,0.4)`,badgeText:`#38bdf8`},a=e.RelicArt&&e.RelicArt.getRelicSvg?e.RelicArt.getRelicSvg(n.id,n.rarity,42):`🔮`;p+=`
            <div class="relic-pedestal-slot is-filled" style="--slot-border: ${i.border}; --slot-glow: ${i.glow};">
              <div style="position: absolute; top: 4px; left: 6px; font-size: 0.625rem; font-weight: 800; color: #64748b;">
                #${t+1}
              </div>
              <button onclick="UIModals.unequipRelic('${n.id}')" 
                      style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); color: #f87171; border-radius: 4px; padding: 1px 4px; font-size: 0.625rem; cursor: pointer; font-weight: 800;" 
                      title="${r?`Tháo cổ vật này`:`Unequip this relic`}">
                ✕
              </button>
              ${a}
              <div style="font-weight: 800; font-size: 0.75rem; color: #fff; margin-top: 3px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${n.name}
              </div>
              <div style="font-size: 0.6875rem; color: ${i.badgeText}; font-weight: 700; margin-top: 1px;">
                ${n.rarity.toUpperCase()}
              </div>
            </div>
          `}else p+=`
            <div class="relic-pedestal-slot" style="cursor: pointer;" onclick="UIModals.setRelicFilter('all')" title="${r?`Chọn một cổ vật bên dưới để trang bị`:`Choose a relic below to equip`}">
              <div style="position: absolute; top: 4px; left: 6px; font-size: 0.625rem; font-weight: 800; color: #64748b;">
                #${t+1}
              </div>
              <div style="font-size: 1.35rem; opacity: 0.3; margin-bottom: 2px;">⚡</div>
              <div style="font-size: 0.75rem; color: #64748b; font-weight: 700;">
                ${r?`Ô Trống`:`Empty Slot`}
              </div>
              <div style="font-size: 0.65rem; color: #38bdf8; margin-top: 2px;">
                + ${r?`Trang Bị`:`Equip`}
              </div>
            </div>
          `}let m=n.relics;D===`equipped`?m=n.relics.filter(function(e){return e.equipped}):D!==`all`&&(m=n.relics.filter(function(e){return e.rarity===D}));let h=``;m.forEach(function(t){let n=e.RelicArt&&e.RelicArt.RARITY_THEMES&&e.RelicArt.RARITY_THEMES[t.rarity]?e.RelicArt.RARITY_THEMES[t.rarity]:{border:`#38bdf8`,glow:`rgba(56,189,248,0.4)`,badgeText:`#38bdf8`,labelVi:`Hiếm`},i=e.RelicArt&&e.RelicArt.getRelicSvg?e.RelicArt.getRelicSvg(t.id,t.rarity,50):`<div style="width: 50px; height: 50px; border-radius: 8px; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🔮</div>`;h+=`
          <div class="relic-card ${t.equipped?`is-equipped`:``}" style="--card-border: ${n.border}; --card-glow: ${n.glow};">
            <!-- Left: Miniature Vector Artwork -->
            ${i}

            <!-- Center: Details -->
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                <span style="font-weight: 800; font-size: 0.875rem; color: #fff;">${t.name}</span>
                <span class="nx-badge" style="background: ${n.badgeBg}; color: ${n.badgeText}; font-size: 0.625rem; font-weight: 800;">
                  ${r?n.labelVi:n.labelEn}
                </span>
                ${t.equipped?`
                  <span class="nx-badge nx-badge-emerald" style="font-size: 0.625rem; font-weight: 800;">
                    ✓ ${r?`ĐANG DÙNG`:`ACTIVE`}
                  </span>
                `:``}
              </div>
              <div style="font-size: 0.75rem; color: #38bdf8; margin-top: 0.2rem; line-height: 1.35; font-weight: 600;">
                ${t.effectDesc}
              </div>
            </div>

            <!-- Right: Action Button -->
            <div style="flex-shrink: 0;">
              <button class="nx-btn ${t.equipped?`nx-btn-danger`:c>=4?`nx-btn-secondary`:`nx-btn-primary`}" 
                      style="padding: 0.45rem 0.85rem; font-size: 0.75rem; font-weight: 800; white-space: nowrap;"
                      onclick="UIModals.toggleRelic('${t.id}')">
                ${t.equipped?r?`Tháo Ra`:`Unequip`:c>=4?r?`Trang Bị (4/4)`:`Equip (4/4)`:r?`Trang Bị`:`Equip`}
              </button>
            </div>
          </div>
        `}),u=`
        <!-- 1. Pedestal: 4 Equipped Relics Display with Live Summary -->
        <div class="relics-pedestal-container">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
            <div>
              <div style="font-size: 0.6875rem; text-transform: uppercase; color: #38bdf8; font-weight: 800; letter-spacing: 0.08em;">
                🔮 ${r?`BỆ THỜ 4 CỔ VẬN KÍCH HOẠT`:`4 ACTIVE RELIC PEDESTALS`}
              </div>
              <div style="font-size: 0.875rem; font-weight: 800; color: #fff;">
                ${r?`Đang kích hoạt: `:`Active: `}
                <strong style="color: #38bdf8;">${c} / 4 ${r?`Cổ Vật`:`Relics`}</strong>
              </div>
            </div>

            <button class="nx-btn nx-btn-emerald" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; font-weight: 800;" onclick="UIModals.autoEquipRelics()">
              ⚡ ${r?`Tự Trang Bị 4 Món Mạnh Nhất`:`Auto-Equip Top 4`}
            </button>
          </div>

          <!-- 4 Slots Grid -->
          <div class="relics-pedestal-grid">
            ${p}
          </div>

          <!-- Combined Equipped Relics Bonus HUD -->
          <div style="margin-top: 0.65rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; gap: 0.5rem 1rem; flex-wrap: wrap; font-size: 0.75rem; font-family: ui-monospace, monospace; color: #94a3b8;">
            <span>${r?`Tổng hiệu lực 4 món:`:`Total 4-relic power:`}</span>
            ${t>0?`<span style="color: #c084fc;">Click: +${Math.round(t*100)}%</span>`:``}
            ${i>0?`<span style="color: #38bdf8;">CPS: +${Math.round(i*100)}%</span>`:``}
            ${a>0?`<span style="color: #f0abfc;">Crit: +${Math.round(a*100)}%</span>`:``}
            ${o>0?`<span style="color: #f43f5e;">Boss: +${Math.round(o*100)}%</span>`:``}
            ${l>0?`<span style="color: #fbbf24;">Gems: +${Math.round(l*100)}%</span>`:``}
            ${d>0?`<span style="color: #34d399;">Item: +${Math.round(d*100)}%</span>`:``}
            ${f>0?`<span style="color: #38bdf8;">Offline: +${Math.round(f*100)}%</span>`:``}
            ${c===0?`<span style="color: #64748b;">(${r?`Chưa trang bị cổ vật nào`:`No relics equipped`})</span>`:``}
          </div>
        </div>

        <!-- 2. Relic Filters Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div class="relic-filter-bar">
            <button class="relic-filter-chip ${D===`all`?`is-active`:``}" onclick="UIModals.setRelicFilter('all')">
              ${r?`Tất Cả (27)`:`All (27)`}
            </button>
            <button class="relic-filter-chip ${D===`equipped`?`is-active`:``}" onclick="UIModals.setRelicFilter('equipped')">
              ✓ ${r?`Đang Dùng (`+c+`)`:`Equipped (`+c+`)`}
            </button>
            <button class="relic-filter-chip ${D===`rare`?`is-active`:``}" style="color: #38bdf8;" onclick="UIModals.setRelicFilter('rare')">
              ✦ ${r?`Hiếm (Rare)`:`Rare`}
            </button>
            <button class="relic-filter-chip ${D===`epic`?`is-active`:``}" style="color: #c084fc;" onclick="UIModals.setRelicFilter('epic')">
              ✦ ${r?`Sử Thi (Epic)`:`Epic`}
            </button>
            <button class="relic-filter-chip ${D===`legendary`?`is-active`:``}" style="color: #fbbf24;" onclick="UIModals.setRelicFilter('legendary')">
              ★ ${r?`Huyền Thoại`:`Legendary`}
            </button>
            <button class="relic-filter-chip ${D===`mythic`?`is-active`:``}" style="color: #fb7185;" onclick="UIModals.setRelicFilter('mythic')">
              👑 ${r?`Thần Thoại`:`Mythic`}
            </button>
          </div>
          <span style="font-size: 0.6875rem; color: #64748b; font-family: ui-monospace, monospace;">
            ${m.length} / 27 ${r?`Cổ Vật`:`Relics`}
          </span>
        </div>

        <!-- 3. Relics Catalog Grid (2 columns on Desktop, 1 on Mobile) -->
        <div class="relics-catalog-grid">
          ${h}
        </div>
      `}t.innerHTML=`
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.875rem; border-bottom: 1px solid var(--nx-surface-border); padding-bottom: 0.65rem;">
        <button class="nx-btn ${E===`relics`?`nx-btn-primary`:`nx-btn-secondary`}" 
                style="flex: 1; padding: 0.6rem; font-weight: 800; font-size: 0.8125rem;" 
                onclick="UIModals.setBackpackTab('relics')">
          🔮 ${r?`Hòm Cổ Vật Thần Bí`:`Relic Vault`} (${c}/4)
        </button>
        <button class="nx-btn ${E===`potions`?`nx-btn-primary`:`nx-btn-secondary`}" 
                style="flex: 1; padding: 0.6rem; font-weight: 800; font-size: 0.8125rem;" 
                onclick="UIModals.setBackpackTab('potions')">
          🎒 ${r?`Túi Thuốc & Shop Gems`:`Potions & Shop`} (${o})
        </button>
      </div>
      ${u}
    `}function F(){let t=document.getElementById(`achievementsModalContent`);if(!t)return;let n=e.GameState.get(),r=!e.I18n||e.I18n.getLang()===`vi`,i=n.achievements.filter(function(e){return e.unlocked}).length,a=e.Bonuses?e.Bonuses.getAchievementBuffPercent():i*.5,o=document.getElementById(`achievementsCountBadge`);o&&(o.textContent=i+` / `+n.achievements.length);let s=`
      <div style="padding: 0.75rem 1rem; border-radius: 0.75rem; background: linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(168,85,247,0.15) 100%); border: 1.5px solid rgba(251,191,36,0.4); margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 800;">
            ${r?`Hiệu Ứng Buff Từ Thành Tựu`:`Active Achievement Buff`}
          </div>
          <div style="font-size: 1.25rem; font-weight: 900; color: #fbbf24;">
            +${a}% ${r?`Toàn Bộ Sản Lượng & CPS`:`All Production & CPS`}
          </div>
        </div>
        <span class="nx-badge nx-badge-gold" style="font-size: 0.8125rem; padding: 0.35rem 0.75rem;">
          ${i} / ${n.achievements.length} ${r?`Đã Mở`:`Unlocked`}
        </span>
      </div>
    `;n.achievements.forEach(function(e){let t=e.current>=e.target,n=Math.min(100,Math.floor(e.current/e.target*100));s+=`
        <div class="nx-card" style="padding: 0.875rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.5rem;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-weight: 800; font-size: 0.875rem; color: #fff;">${e.name}</span>
              <span style="font-size: 0.6875rem; color: #fbbf24; font-family: ui-monospace, monospace;">+${e.rewardGems} Gems · (+0.5% Buff)</span>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin: 0.2rem 0 0.4rem;">${e.desc}</div>
            <div class="quest-progress-bar">
              <div class="quest-progress-fill" style="width: ${n}%;"></div>
            </div>
          </div>
          <div>
            ${e.unlocked?`<span class="nx-badge nx-badge-emerald">${r?`ĐÃ NHẬN`:`CLAIMED`}</span>`:t?`<button class="nx-btn nx-btn-gold" onclick="UIModals.claimAchievement('${e.id}')">${r?`Nhận`:`Claim`}</button>`:`<span style="font-size: 0.6875rem; font-family: ui-monospace, monospace; color: #64748b;">${n}%</span>`}
          </div>
        </div>
      `}),t.innerHTML=s}function I(t){let n=e.GameState.get(),r=n.achievements.find(function(e){return e.id===t});!r||r.unlocked||r.current<r.target||(r.unlocked=!0,n.astralGems+=r.rewardGems,e.Sound&&e.Sound.playAchievement(),e.GameState.save(),e.UI.updateStatsDisplay(),F())}let L=`ascension`;function R(){let t=document.getElementById(`prestigeModalContent`);if(!t)return;let n=e.GameState.get(),r=!e.I18n||e.I18n.getLang()===`vi`,i=e.Engine?e.Engine.prestigeShards(n.totalEssence):Math.floor(Math.sqrt(n.totalEssence/1e6)),a=i>0,o=e.GameState.getWorlds?e.GameState.getWorlds():[],s=``;if(L===`ascension`)s=`
        <div style="text-align: center; padding: 1rem 0.5rem;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(168,85,247,0.15); border: 2px solid rgba(168,85,247,0.5); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff;">
            ${r?`Tái Sinh Vũ Trụ (Ascension)`:`Astral Rebirth (Ascension)`}
          </h3>
          <p style="font-size: 0.8125rem; color: #94a3b8; max-width: 420px; margin: 0.5rem auto 1.25rem;">
            ${r?`Hiến tế Năng Lượng và Nâng Cấp hiện tại để phi thăng lên cõi giới cao hơn, nhận Mảnh Astral Shards vĩnh viễn (mỗi Mảnh tăng +1% toàn bộ sản lượng).`:`Sacrifice current Essence and Upgrades to ascend into higher dimensions, gaining permanent Astral Shards.`}
          </p>

          <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 0.75rem 1.25rem; border-radius: 0.75rem; background: rgba(18,24,38,0.8); border: 1px solid var(--nx-surface-border);">
              <div style="font-size: 0.6875rem; color: #94a3b8; text-transform: uppercase;">
                ${r?`Shards Hiện Có`:`Current Shards`}
              </div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #818cf8; font-family: ui-monospace, monospace;">${n.astralShards}</div>
            </div>
            <div style="padding: 0.75rem 1.25rem; border-radius: 0.75rem; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.4);">
              <div style="font-size: 0.6875rem; color: #c084fc; text-transform: uppercase;">
                ${r?`Nhận Khi Tái Sinh`:`Ascension Yield`}
              </div>
              <div style="font-size: 1.25rem; font-weight: 900; color: #c084fc; font-family: ui-monospace, monospace;">+${i} Shards</div>
            </div>
          </div>

          <button class="nx-btn ${a?`nx-btn-violet`:`nx-btn-disabled`}" style="padding: 0.75rem 2rem; font-size: 0.875rem;" onclick="UIModals.executePrestige()">
            ${a?r?`Phi Thăng & Nhận +`+i+` Shards`:`Ascend & Gain +`+i+` Shards`:r?`Cần tối thiểu 1,000,000 Tổng Năng Lượng`:`Requires 1,000,000 Total Essence`}
          </button>
        </div>
      `;else{let e=``;o.forEach(function(t){let r=n.prestigeCount>=t.reqAscension;e+=`
          <div class="nx-card" style="padding: 0.875rem; border-color: ${r?`rgba(56,189,248,0.4)`:`var(--nx-surface-border)`}; background: ${r?`rgba(15,23,42,0.8)`:`rgba(15,23,42,0.4)`}; margin-bottom: 0.625rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 800; font-size: 0.9375rem; color: #fff;">${t.name}</div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">${t.desc}</div>
                <div style="font-size: 0.6875rem; color: #fbbf24; margin-top: 0.2rem;">Tiền tệ riêng: ${t.currency}</div>
              </div>
              <div>
                ${r?`<span class="nx-badge nx-badge-emerald">ĐÃ MỞ KHÓA</span>`:`<span class="nx-badge" style="background: rgba(244,63,94,0.2); color: #f43f5e;">Cần Thăng Thiên ${t.reqAscension} lần</span>`}
              </div>
            </div>
          </div>
        `});let t=n.pets&&n.pets.night_owl&&n.pets.night_owl.level||0;e+=`
        <div style="margin-top: 1rem; padding: 0.875rem; border-radius: 0.75rem; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);">
          <div style="font-weight: 800; font-size: 0.875rem; color: #34d399; display: flex; align-items: center; justify-content: space-between;">
            <span>🦉 Thần Thú Gacha 5: Cú Đêm Vĩnh Cửu</span>
            <span class="nx-badge nx-badge-emerald">Cấp ${t} (+${t*5}% Offline)</span>
          </div>
          <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.25rem;">
            Tăng +5% Hiệu Suất Ngoại Tuyến mỗi cấp! Mở khóa và nhận trong Sự Kiện hoặc Gacha.
          </div>
        </div>
      `,s=e}t.innerHTML=`
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.875rem; border-bottom: 1px solid var(--nx-surface-border); padding-bottom: 0.65rem;">
        <button class="nx-btn ${L===`ascension`?`nx-btn-violet`:`nx-btn-secondary`}" style="flex: 1; padding: 0.55rem; font-weight: 800; font-size: 0.8125rem;" onclick="UIModals.setPrestigeTab('ascension')">
          🌌 ${r?`Tái Sinh Vũ Trụ`:`Astral Rebirth`}
        </button>
        <button class="nx-btn ${L===`worlds`?`nx-btn-violet`:`nx-btn-secondary`}" style="flex: 1; padding: 0.55rem; font-weight: 800; font-size: 0.8125rem;" onclick="UIModals.setPrestigeTab('worlds')">
          ⛩️ ${r?`4 Thế Giới & Thú Cưng`:`4 Worlds & Pets`}
        </button>
      </div>
      ${s}
    `}function z(e){L=e,R()}function B(){let t=e.GameState.get(),n=e.Engine?e.Engine.prestigeOutcome(t):null;n&&(t.astralShards=n.astralShards,t.totalAstralShards=n.totalAstralShards,t.prestigeCount=n.prestigeCount,t.essence=n.reset.essence,t.totalEssence=n.reset.totalEssence,t.level=n.reset.level,t.currentExp=n.reset.currentExp,t.maxExp=n.reset.maxExp,t.upgrades.forEach(function(e){e.level=0}),e.Sound&&e.Sound.playAchievement(),e.GameState.save(),r(`prestigeModal`),e.UI.updateStatsDisplay(),e.UIUpgrades&&e.UIUpgrades.render())}function V(){let t=document.getElementById(`statsModalContent`);if(!t)return;let n=e.GameState.get(),r=!e.I18n||e.I18n.getLang()===`vi`,i=e.Numeric?e.Numeric.format:function(e){return Math.floor(e)},a=e.Bonuses?e.Bonuses.getAllBonuses():{};t.innerHTML=`
      <!-- 1. PERSONAL RECORDS (v8.0: KỶ LỤC CÁ NHÂN) -->
      <div style="border-radius: 0.875rem; background: linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(56,189,248,0.15) 100%); border: 1.5px solid rgba(251,191,36,0.4); padding: 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.8125rem; font-weight: 900; text-transform: uppercase; color: #fbbf24; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.4rem;">
          <span>🏆</span>
          <span>${r?`KỶ LỤC CÁ NHÂN (PERSONAL RECORDS)`:`PERSONAL RECORDS`}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Nexyroth/giây (CPS) cao nhất từng đạt:`:`Highest CPS ever achieved:`}</span>
            <strong style="color: #38bdf8; font-family: ui-monospace, monospace;">${i(n.records.highestCps||0)}/s</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Cú click lớn nhất (kể cả Chí Mạng):`:`Highest single click ever:`}</span>
            <strong style="color: #fbbf24; font-family: ui-monospace, monospace;">+${i(n.records.highestClick||0)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Số lần bấm nhiều nhất trong 10 giây:`:`Max clicks in 10-second window:`}</span>
            <strong style="color: #c084fc; font-family: ui-monospace, monospace;">${n.records.maxClicksIn10s||0} lần</strong>
          </div>
        </div>
      </div>

      <!-- 2. 4 NEW MULTIPLIERS (v8.1) -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid var(--nx-surface-border); padding: 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.8125rem; font-weight: 900; text-transform: uppercase; color: #38bdf8; margin-bottom: 0.65rem;">
          ⚡ ${r?`HỆ SỐ CHIẾN ĐẤU & KINH TẾ (BONUSES ENGINE)`:`CORE BONUSES & ECONOMY`}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Sát Thương Boss (nhân dồn):`:`Boss Damage Multiplier:`}</span>
            <strong style="color: #f43f5e; font-family: ui-monospace, monospace;">x${a.bossDamageMultiplier||1}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Tỉ Lệ Rơi Item & Thuốc:`:`Item Drop Rate:`}</span>
            <strong style="color: #38bdf8; font-family: ui-monospace, monospace;">${Math.round((a.itemDropChance||.05)*100)}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Tỉ Lệ Rơi Kim Cương (Gems):`:`Gem Drop Rate:`}</span>
            <strong style="color: #fbbf24; font-family: ui-monospace, monospace;">${Math.round((a.gemDropChance||.03)*100)}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Hiệu Suất Ngoại Tuyến (Offline):`:`Offline Earnings Efficiency:`}</span>
            <strong style="color: #10b981; font-family: ui-monospace, monospace;">${Math.round((a.offlineEfficiency||.5)*100)}% (tối đa 100%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #cbd5e1;">
            <span>${r?`Buff từ Thành Tựu đã mở:`:`Achievement Production Buff:`}</span>
            <strong style="color: #fbbf24; font-family: ui-monospace, monospace;">+${a.achievementBuffPercent||0}%</strong>
          </div>
        </div>
      </div>

      <!-- 3. LIFETIME RUNTIME STATS -->
      <div style="border-radius: 0.875rem; background: rgba(18,24,38,0.85); border: 1px solid var(--nx-surface-border); padding: 1rem;">
        <div style="font-size: 0.8125rem; font-weight: 900; text-transform: uppercase; color: #a855f7; margin-bottom: 0.65rem;">
          📊 ${r?`THỐNG KÊ TOÀN CÕI`:`LIFETIME TOTALS`}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8125rem; color: #cbd5e1;">
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng lần bấm Lõi:</span>
            <strong>${n.totalClicks}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng cú đánh Chí Mạng:</span>
            <strong>${n.totalCrits||0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng số Boss đã hạ:</span>
            <strong>${n.bossesDefeated}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng số nâng cấp đã mua:</span>
            <strong>${n.totalUpgradesBought||0}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Tổng số lần Thăng Thiên:</span>
            <strong>${n.prestigeCount}</strong>
          </div>
        </div>
      </div>
    `}function H(){document.querySelectorAll(`.nx-modal-backdrop`).forEach(function(e){e.addEventListener(`click`,function(t){t.target===e&&r(e.id)}),e.querySelectorAll(`.nx-modal-close`).forEach(function(t){t.addEventListener(`click`,function(){r(e.id)})})}),window.addEventListener(`keydown`,function(e){let i=document.activeElement?document.activeElement.tagName.toLowerCase():``;if(i!==`input`&&i!==`textarea`){if(e.key===`Escape`||e.code===`Escape`)t&&r(t.id);else if(e.key===`g`||e.key===`G`||e.code===`KeyG`){let e=document.getElementById(`gemShopModal`);e&&e.classList.contains(`is-open`)?r(`gemShopModal`):n(`gemShopModal`)}else if(e.key===`b`||e.key===`B`||e.code===`KeyB`){let e=document.getElementById(`inventoryModal`);e&&e.classList.contains(`is-open`)?r(`inventoryModal`):n(`inventoryModal`)}}});let i=document.getElementById(`headerGemShopBtn`);i&&(i.onclick=function(){n(`gemShopModal`)});let o=document.getElementById(`headerInventoryBtn`);o&&(o.onclick=function(){n(`inventoryModal`)});let s=document.getElementById(`headerSettingsBtn`);s&&(s.onclick=function(){n(`settingsModal`)});let c=document.getElementById(`headerDailyBtn`);c&&(c.onclick=function(){n(`dailyRewardModal`)});let l=document.getElementById(`headerEventBtn`);l&&(l.onclick=function(){n(`cosmicEventModal`)});let u=document.getElementById(`headerLangBtn`);u&&(u.onclick=function(){let t=e.I18n.getLang()===`vi`?`en`:`vi`;e.I18n.setLang(t)});let d=document.getElementById(`headerMuteBtn`);d&&(d.onclick=function(){e.Sound&&e.Sound.toggleMute&&e.Sound.toggleMute()}),a()}e.UIModals={init:H,open:n,close:r,buyPotion:h,usePotion:A,setShopTab:u,openPaymentModal:f,closePaymentModal:p,confirmSandboxPayment:m,setBackpackTab:O,setRelicFilter:k,updateBackpackBadge:a,buyGemItem:g,selectSkillNode:b,unlockOrUpgradeSkill:S,unlockSkill:C,upgradeInfiniteSkill:w,respecSkills:x,setSkillBranch:y,toggleRelic:M,unequipRelic:N,autoEquipRelics:j,executePrestige:B,setPrestigeTab:z,claimAchievement:I,redeemCode:o,renderStatsContent:V}})(typeof window<`u`?window:void 0),(function(e){let t=(function(){let e,t=[];for(let n=0;n<256;n++){e=n;for(let t=0;t<8;t++)e=e&1?3988292384^e>>>1:e>>>1;t[n]=e}return t})();function n(e){let n=-1;for(let r=0;r<e.length;r++)n=n>>>8^t[(n^e[r])&255];return(n^-1)>>>0}function r(e){return new TextEncoder().encode(e)}function i(e){let t=[],i=0;e.forEach(function(e){let a=r(e.name),o=typeof e.data==`string`?r(e.data):e.data,s=n(o),c=o.length,l=new Uint8Array(30+a.length),u=new DataView(l.buffer);u.setUint32(0,67324752,!0),u.setUint16(4,20,!0),u.setUint16(6,0,!0),u.setUint16(8,0,!0),u.setUint16(10,0,!0),u.setUint16(12,0,!0),u.setUint32(14,s,!0),u.setUint32(18,c,!0),u.setUint32(22,c,!0),u.setUint16(26,a.length,!0),u.setUint16(28,0,!0),l.set(a,30),t.push({nameBytes:a,dataBytes:o,localHeader:l,crc:s,size:c,offset:i}),i+=l.length+o.length});let a=[],o=0;t.forEach(function(e){let t=new Uint8Array(46+e.nameBytes.length),n=new DataView(t.buffer);n.setUint32(0,33639248,!0),n.setUint16(4,20,!0),n.setUint16(6,20,!0),n.setUint16(8,0,!0),n.setUint16(10,0,!0),n.setUint16(12,0,!0),n.setUint16(14,0,!0),n.setUint32(16,e.crc,!0),n.setUint32(20,e.size,!0),n.setUint32(24,e.size,!0),n.setUint16(28,e.nameBytes.length,!0),n.setUint16(30,0,!0),n.setUint16(32,0,!0),n.setUint16(34,0,!0),n.setUint16(36,0,!0),n.setUint32(38,0,!0),n.setUint32(42,e.offset,!0),t.set(e.nameBytes,46),a.push(t),o+=t.length});let s=new Uint8Array(22),c=new DataView(s.buffer);c.setUint32(0,101010256,!0),c.setUint16(4,0,!0),c.setUint16(6,0,!0),c.setUint16(8,e.length,!0),c.setUint16(10,e.length,!0),c.setUint32(12,o,!0),c.setUint32(16,i,!0),c.setUint16(20,0,!0);let l=i+o+s.length,u=new Uint8Array(l),d=0;return t.forEach(function(e){u.set(e.localHeader,d),d+=e.localHeader.length,u.set(e.dataBytes,d),d+=e.dataBytes.length}),a.forEach(function(e){u.set(e,d),d+=e.length}),u.set(s,d),u}async function a(e){try{let t=await fetch(e);if(t.ok)return await t.text()}catch(t){console.warn(`Could not fetch file for export: `+e,t)}return null}async function o(){let t=document.getElementById(`headerExportZipBtn`)||document.getElementById(`btnSettingsExportZip`),n=t?t.innerHTML:``;t&&(t.innerHTML=`⏳ Packaging ZIP...`,t.disabled=!0);try{let t=[`index.html`,`style.css`,`css/variables.css`,`css/layout.css`,`css/components.css`,`css/animations.css`,`css/modals.css`,`css/events-daily.css`,`js/numeric.js`,`js/bonuses.js`,`js/audio.js`,`js/state.js`,`js/daily.js`,`js/events.js`,`js/ui-core.js`,`js/ui-upgrades.js`,`js/ui-modals.js`,`js/zip-export.js`,`js/main.js`],n=[];for(let e=0;e<t.length;e++){let r=t[e],i=await a(`./`+r);i&&n.push({name:r,data:i})}if(n.push({name:`README.md`,data:`# NEXYROTH CLICKER RPG (v8.0)
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
Just open \`index.html\` directly in any modern browser, or drop into your Capacitor/Cordova/WebView Android project!`}),n.length>0){let t=i(n),r=new Blob([t],{type:`application/zip`}),a=URL.createObjectURL(r),o=document.createElement(`a`);o.href=a,o.download=`nexyroth-clicker-v8.zip`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(a),e.Sound&&e.Sound.playAchievement()}else window.location.href=`./nexyroth-clicker-phase4.zip`}catch(e){console.error(`Export zip failed, falling back:`,e),window.location.href=`./nexyroth-clicker-phase4.zip`}finally{t&&(t.innerHTML=n,t.disabled=!1)}}e.ZipExport={download:o,buildZip:i}})(typeof window<`u`?window:void 0),(function(e){function t(){e.GameState.load(),e.I18n&&e.I18n.init(),e.Sound&&e.Sound.updateIcons&&e.Sound.updateIcons(),r(),e.UIModals&&e.UIModals.init(),e.UICore&&e.UICore.init(),e.UIUpgrades&&e.UIUpgrades.init(),e.DailyRewards&&e.DailyRewards.updateBadge(),e.CosmicEvents&&e.CosmicEvents.updateBadge(),e.UIModals&&e.UIModals.updateBackpackBadge&&e.UIModals.updateBackpackBadge(),n();let t=document.getElementById(`headerExportZipBtn`);t&&e.ZipExport&&(t.onclick=function(){e.ZipExport.download()}),setInterval(l,100),setInterval(function(){e.GameState.save()},5e3)}function n(){let t=document.querySelector(`.game-layout`);if(!t)return;t.hasAttribute(`data-mobile-tab`)||t.setAttribute(`data-mobile-tab`,`core`);let n=document.querySelectorAll(`.mobile-nav-item`);n.forEach(function(r){r.addEventListener(`click`,function(){let i=r.getAttribute(`data-tab`);if(i){if(i===`daily`){e.UIModals&&e.UIModals.open(`dailyRewardModal`),e.Sound&&e.Sound.playClick();return}if(i===`inventory`){e.UIModals&&e.UIModals.open(`inventoryModal`),e.Sound&&e.Sound.playClick();return}if(i===`shop`||i===`gemShop`){e.UIModals&&e.UIModals.open(`gemShopModal`),e.Sound&&e.Sound.playClick();return}if(i===`event`){e.UIModals&&e.UIModals.open(`cosmicEventModal`),e.Sound&&e.Sound.playClick();return}if(i===`settings`){e.UIModals&&e.UIModals.open(`settingsModal`),e.Sound&&e.Sound.playClick();return}if(i===`stats`){e.UIModals&&e.UIModals.open(`statsModal`),e.Sound&&e.Sound.playClick();return}t.setAttribute(`data-mobile-tab`,i),n.forEach(function(e){let t=e.getAttribute(`data-tab`);t===i?e.classList.add(`is-active`):t!==`daily`&&t!==`event`&&t!==`settings`&&e.classList.remove(`is-active`)}),e.Sound&&e.Sound.playClick()}})})}function r(){let t=e.GameState.get();if(!t.lastSaveTime)return;let n=Date.now(),r=e.UICore?e.UICore.calculateStats():{cps:0},i=e.Bonuses?e.Bonuses.getOfflineEfficiency():.5,a=0,o=0;if(e.Engine&&e.Engine.offlineGain){let s=e.Engine.offlineGain({lastSaveTime:t.lastSaveTime,now:n,cps:r.cps,efficiency:i});if(!s)return;a=s.gain,o=s.elapsedSeconds}else if(o=Math.max(0,(n-t.lastSaveTime)/1e3),o<10||!e.UICore||(a=r.cps*o*i,a<=0))return;t.essence+=a,t.totalEssence+=a,t.lastOfflineGain=a,setTimeout(function(){let t=e.Numeric?e.Numeric.format(a):Math.floor(a),n=Math.max(1,Math.floor(o/60)),r=Math.round(i*100),s=!e.I18n||e.I18n.getLang()===`vi`;if(e.Toast){let i=s?`💤 Chào mừng trở lại! Vắng mặt ${n} phút thu thập +${t} Năng Lượng (Hiệu suất ngoại tuyến: ${r}%)`:`💤 Welcome back! Offline for ${n} mins: +${t} Essence (Efficiency: ${r}%)`;e.Toast.show(i,`info`)}},600)}let i=0,a=0,o=typeof document<`u`&&document.hidden?Date.now():null,s=0;typeof document<`u`&&document.addEventListener&&document.addEventListener(`visibilitychange`,function(){document.hidden?o===null&&(o=Date.now()):o!==null&&(s+=Math.max(0,Date.now()-o),o=null)});function c(e){i=typeof e==`number`?e:0,a=0,o=typeof document<`u`&&document.hidden?Date.now():null,s=0}function l(){let t=Date.now(),n=i>0?Math.max(0,t-i):100;i=t;let r=s;s=0,typeof document<`u`&&document.hidden&&o!==null&&(r+=Math.max(0,t-o),o=t),r=Math.min(n,Math.max(0,r));let c=e.Engine&&e.Engine.planCatchUp?e.Engine.planCatchUp({accumulatorMs:a,gapMs:n,hiddenMs:r}):{mode:`ticks`,steps:Math.min(1200,Math.floor((a+n)/100)),hiddenSteps:0,visibleSteps:Math.min(1200,Math.floor((a+n)/100)),accumulatorMs:(a+n)%100,offlineSeconds:0};a=c.accumulatorMs;let l=e.GameState.get();if(c.mode===`offline`){let r=e.UICore?e.UICore.calculateStats():{cps:0},i=e.Bonuses?e.Bonuses.getOfflineEfficiency():.5;if(e.Engine&&e.Engine.offlineGain){let a=e.Engine.offlineGain({lastSaveTime:t-n,now:t,cps:r.cps,efficiency:i});if(a&&a.gain>0&&(l.essence+=a.gain,l.totalEssence+=a.gain,l.lastOfflineGain=a.gain,e.Toast)){let t=e.Numeric?e.Numeric.format(a.gain):Math.floor(a.gain),n=Math.max(1,Math.floor(a.elapsedSeconds/60)),r=Math.round(i*100),o=!e.I18n||e.I18n.getLang()===`vi`?`💤 Chào mừng trở lại! Vắng mặt ${n} phút thu thập +${t} Năng Lượng (Hiệu suất ngoại tuyến: ${r}%)`:`💤 Welcome back! Offline for ${n} mins: +${t} Essence (Efficiency: ${r}%)`;e.Toast.show(o,`info`)}}}else{let t=Math.min(c.steps,1200),n=!1;for(let r=0;r<t;r++){let t=r<c.hiddenSteps,i=e.Engine&&e.Engine.computeStats?e.Engine.computeStats(l):e.UICore?e.UICore.calculateStats():{cps:0,frenzyMultiplier:1},a=e.GameState.getBoss?e.GameState.getBoss():null,o=!!(e.UICore&&e.UICore.isAutoClickerPaused&&e.UICore.isAutoClickerPaused()),s=t&&(!e.Engine||e.Engine.PAUSE_BOSS_WHILE_HIDDEN)?null:a,u=t&&(!e.Engine||e.Engine.PAUSE_AUTOCLICK_POTION_WHILE_HIDDEN)?!0:o;if(e.Engine&&e.Engine.stepTick){let t=e.Engine.stepTick({essence:l.essence,totalEssence:l.totalEssence,cps:i.cps,frenzyMultiplier:i.frenzyMultiplier,activeBoosts:l.activeBoosts,activePotions:l.activePotions,boss:s,autoClickerPaused:u});l.essence=t.essence,l.totalEssence=t.totalEssence,t.activeBoosts!==null&&(l.activeBoosts=t.activeBoosts),t.activePotions!==null&&l.activePotions&&Object.assign(l.activePotions,t.activePotions),a&&t.boss!==null&&(a.remainingTime=t.boss.remainingTime,t.boss.active!==void 0&&(a.active=t.boss.active),t.boss.currentHp!==void 0&&(a.currentHp=t.boss.currentHp)),t.bossExpired&&(n=!0)}}n&&e.Sound&&e.Sound.playError&&e.Sound.playError()}c.steps>0&&e.UICore&&e.UICore.updateCooldowns&&e.UICore.updateCooldowns(c.steps*.1),e.UICore&&e.UICore.calculateStats&&e.UICore.calculateStats(),e.UICore&&e.UICore.updateStatsDisplay&&e.UICore.updateStatsDisplay(),u(),e.DailyRewards&&e.DailyRewards.updateBadge&&e.DailyRewards.updateBadge(),e.CosmicEvents&&e.CosmicEvents.updateBadge&&e.CosmicEvents.updateBadge()}function u(){let t=e.GameState.get();if(!t.achievements)return;if(e.Engine&&e.Engine.achievementCurrents){let n=e.Engine.achievementCurrents(t);if(n&&n.length===t.achievements.length){for(let e=0;e<t.achievements.length;e++){let r=n[e];r!==void 0&&(t.achievements[e].current=r)}return}}let n=(t.relics||[]).filter(function(e){return e.equipped}).length,r=(t.skills||[]).filter(function(e){return e.unlocked}).length,i=(t.skills||[]).some(function(e){return e.branch===`luck`&&e.unlocked}),a=t.achievements.filter(function(e){return e.unlocked}).length;t.achievements.forEach(function(e){e.type===`clicks`&&(e.current=t.totalClicks),e.type===`essence`&&(e.current=Math.floor(t.totalEssence)),e.type===`level`&&(e.current=t.level),e.type===`bosses`&&(e.current=t.bossesDefeated),e.type===`boss_daily`&&(e.current=t.dailyBossesDefeated||0),e.type===`crits`&&(e.current=t.totalCrits||0),e.type===`upgrades`&&(e.current=t.totalUpgradesBought||0),e.type===`prestige`&&(e.current=t.prestigeCount),e.type===`skills_unlocked`&&(e.current=r),e.type===`luck_branch`&&(e.current=+!!i),e.type===`relics_equipped`&&(e.current=n),e.type===`achievements_count`&&(e.current=a),e.type===`potion_x100`&&(e.current=t.activePotions&&t.activePotions.x100>0?1:0),e.type===`potions_used`&&(e.current=t.potionsUsed||0)})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,t):t(),e.Main={init:t,gameTick:l,resetCatchUp:c}})(typeof window<`u`?window:void 0);