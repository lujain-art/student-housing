/* java.js — منطق مبدّل اللغة المشترك لجميع صفحات السكن
   يُحمَّل في نهاية الـ body بعد اكتمال الـ DOM */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     ANTI-FLASH: أخفِ الـ body فوراً ريثما تُطبَّق اللغة
     (يُضاف هذا الـ style من الـ head عبر lang-data.js،
      لكن نتأكد هنا كذلك لأي حالة)
  ══════════════════════════════════════════════════════ */
  function showBody() {
    document.documentElement.style.removeProperty('opacity');
    document.documentElement.style.removeProperty('visibility');
  }

  /* ── تحديث نص عنصر بذكاء:
     إذا كان العنصر يحتوي على أبناء (مثل <small> داخل .feat-text)
     نحدّث أول text node فقط ولا نمس الأبناء.
     إذا كان العنصر نصياً بحتاً نستخدم textContent مباشرة. ── */
  function setText(el, value) {
    /* إذا أي ابن مباشر عنده data-t:
       فرّغ text nodes الأب المباشرة ولا تضف شيئاً —
       الأبناء سيُترجَمون مستقلاً في الـ loop الرئيسي */
    var childHasDataT = false;
    for (var i = 0; i < el.children.length; i++) {
      if (el.children[i].hasAttribute('data-t')) { childHasDataT = true; break; }
    }
    if (childHasDataT) {
      for (var n = 0; n < el.childNodes.length; n++) {
        if (el.childNodes[n].nodeType === 3) el.childNodes[n].nodeValue = ' ';
      }
      return;
    }
    /* هل في أبناء elements بدون data-t (مثل <small>)؟ */
    var hasChildEl = false;
    for (var j = 0; j < el.childNodes.length; j++) {
      if (el.childNodes[j].nodeType === 1) { hasChildEl = true; break; }
    }
    if (!hasChildEl) {
      el.textContent = value;
    } else {
      for (var k = 0; k < el.childNodes.length; k++) {
        if (el.childNodes[k].nodeType === 3) {
          el.childNodes[k].nodeValue = value;
          return;
        }
      }
      el.insertBefore(document.createTextNode(value), el.firstChild);
    }
  }

  /* ── WhatsApp links ── */
  function applyWhatsApp(lang) {
    /* رسالة أيقونة الفوتر */
    var genericMsgs = {
      ar: 'مرحباً، أود حجز إقامة في سكن الطالبات.',
      en: 'Hello, I would like to book a stay at Student Housing.'
    };
    var genericText = genericMsgs[lang] || genericMsgs['ar'];
    document.querySelectorAll('.soc-whatsapp').forEach(function (a) {
      a.href = 'https://wa.me/962775444643?text=' + encodeURIComponent(genericText);
    });

    /* رقم 77967 — زر التواصل في صفحة Contact */
    var secondNumMsgs = {
      ar: 'مرحباً، أود حجز إقامة في سكن الطالبات.',
      en: 'Hello, I would like to book a stay at Student Housing.'
    };
    var secondNumText = secondNumMsgs[lang] || secondNumMsgs['ar'];
    document.querySelectorAll('a[href*="wa.me/962775444643"]').forEach(function (a) {
      a.href = 'https://wa.me/962775444643?text=' + encodeURIComponent(secondNumText);
    });

    /* رسائل أزرار الغرف — مخصصة لكل نوع */
    var roomMsgs = {
      ar: {
        room_single_royal_name: 'مرحباً، أودّ الاستفسار عن حجز غرفة مفردة ملوكية 👑',
        room_single_ordinary_name: 'مرحباً، أودّ الاستفسار عن حجز غرفة مفردة عادية 🏡',
        room_double_vip_name: 'مرحباً، أودّ الاستفسار عن حجز غرفة مزدوجة VIP ✨',
        room_double_ordinary_name: 'مرحباً، أودّ الاستفسار عن حجز غرفة مزدوجة عادية 🏡',
        room_triple_name: 'مرحباً، أودّ الاستفسار عن حجز غرفة ثلاثية 🏡'
      },
      en: {
        room_single_royal_name: 'Hello, I would like to inquire about booking a Royal Single Room 👑',
        room_single_ordinary_name: 'Hello, I would like to inquire about booking a Standard Single Room 🏡',
        room_double_vip_name: 'Hello, I would like to inquire about booking a Double VIP Room ✨',
        room_double_ordinary_name: 'Hello, I would like to inquire about booking a Standard Double Room 🏡',
        room_triple_name: 'Hello, I would like to inquire about booking a Triple Room 🏡'
      }
    };
    var msgs = roomMsgs[lang] || roomMsgs['ar'];

    /* لكل بطاقة غرفة: نقرأ data-t الاسم ونطابقه مع رسالته */
    document.querySelectorAll('.room-card').forEach(function (card) {
      var nameEl = card.querySelector('[data-t$="_name"]');
      if (!nameEl) return;
      var key = nameEl.getAttribute('data-t');
      var msg = msgs[key];
      if (!msg) return;
      var btn = card.querySelector('.room-book');
      if (!btn) return;
      btn.href = 'https://wa.me/962775444643?text=' + encodeURIComponent(msg);
    });
  }

  /* ── Apply translations ── */
  function applyTranslations(lang) {
    if (!window.AM_T || !window.AM_T[lang]) return;
    var T = window.AM_T[lang];
    /* ترجمة النصوص العادية */
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var key = el.getAttribute('data-t');
      if (T[key] !== undefined) setText(el, T[key]);
    });
    /* ترجمة placeholder للحقول */
    document.querySelectorAll('[data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (T[key] !== undefined) el.placeholder = T[key];
    });
  }

  /* ── Apply language ── */
  function apply(lang) {
    localStorage.setItem('am_lang', lang);

    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    var langFlag = document.getElementById('langFlag');
    var langLabel = document.getElementById('langLabel');
    var switcher = document.getElementById('langSwitcher');
    var langBtn = document.getElementById('langBtn');

    if (langFlag) langFlag.textContent = lang === 'ar' ? '🇯🇴' : 'EN';
    if (langLabel) langLabel.textContent = lang === 'ar' ? 'العربية' : 'English';

    document.querySelectorAll('.lang-option').forEach(function (o) {
      o.classList.toggle('active', o.dataset.lang === lang);
    });

    if (switcher) switcher.classList.remove('open');
    if (langBtn) langBtn.setAttribute('aria-expanded', 'false');

    /* ── تحديث عنوان الصفحة (title) حسب اللغة ── */
    var pageTitles = {
      ar: {
        'index.html': 'سكن الطالبات',
        '': 'سكن الطالبات',
        'Rooms_Page.html': 'الغرف — سكن الطالبات',
        'Services_Page.html': 'الخدمات والمرافق — سكن الطالبات',
        'News_Page.html': 'الأخبار والفعاليات — سكن الطالبات',
        'Guide_Page.html': 'دليل السكن — سكن الطالبات',
        'Contact_Page.html': 'تواصل معنا — سكن الطالبات'
      },
      en: {
        'index.html': 'Student Housing for Female Students',
        '': 'Student Housing for Female Students',
        'Rooms_Page.html': 'Rooms — Student Housing',
        'Services_Page.html': 'Services & Facilities — Student Housing',
        'News_Page.html': 'News & Events — Student Housing',
        'Guide_Page.html': 'Residency Guide — Student Housing',
        'Contact_Page.html': 'Contact Us — Student Housing'
      }
    };
    var page = window.location.pathname.split('/').pop();
    var titles = pageTitles[lang] || pageTitles['ar'];
    if (titles[page] !== undefined) document.title = titles[page];

    applyTranslations(lang);
    applyWhatsApp(lang);

    /* ── تحديث لغة UserWay Accessibility Widget ── */
    try {
      var uwLang = lang === 'ar' ? 'ar' : 'en';
      if (window.UserWay && typeof window.UserWay.changeWidgetLanguage === 'function') {
        window.UserWay.changeWidgetLanguage(uwLang);
      } else {
        document.addEventListener('userway:init_completed', function (e) {
          e.detail.userWayInstance.changeWidgetLanguage(uwLang);
        }, { once: true });
      }
    } catch (e) { /* UserWay غير محمّل — تجاهل */ }

    /* أظهر الصفحة بعد تطبيق اللغة */
    showBody();
  }

  /* ── Wire up the switcher ── */
  function initSwitcher() {
    var switcher = document.getElementById('langSwitcher');
    var langBtn = document.getElementById('langBtn');
    if (!switcher || !langBtn) return;

    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = switcher.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.addEventListener('click', function () { apply(opt.dataset.lang); });
      opt.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') apply(opt.dataset.lang);
      });
    });

    document.addEventListener('click', function (e) {
      if (!switcher.contains(e.target)) switcher.classList.remove('open');
    });
  }

  /* ══════════════════════════════════════════════════════
     زر الموسيقى — تشغيل/إيقاف موسيقى الخلفية
     الزر و<audio> موجودان في الصفحة الرئيسية من الأصل،
     لكن لا يوجد كود يشغّلهما، فكان الزر بلا أي أثر.
  ══════════════════════════════════════════════════════ */
  function initMusicToggle() {
    var btn = document.getElementById('music-btn');
    var audio = document.getElementById('bg-music');
    var icon = document.getElementById('music-icon');
    if (!btn || !audio || !icon) return;          // غير موجود بهذه الصفحة

    var ON = 'icons/sound.gif';
    var OFF = 'icons/mute.gif';
    var KEY = 'am_music';

    /* مستوى هادئ — الموسيقى خلفية وليست المحتوى الأساسي */
    audio.volume = 0.35;

    var T = window.AM_T || {};
    var playing = false;

    function label(on) {
      var dict = T[localStorage.getItem('am_lang') || 'ar'] || {};
      var txt = on ? (dict.music_pause || 'إيقاف الموسيقى')
                   : (dict.music_play || 'تشغيل الموسيقى');
      btn.setAttribute('aria-label', txt);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    function paint(on) {
      playing = on;
      icon.src = on ? ON : OFF;
      icon.alt = on ? 'الصوت يعمل' : 'الصوت مكتوم';
      label(on);
    }

    function start() {
      var p = audio.play();
      /* المتصفحات ترفض التشغيل التلقائي خارج تفاعل المستخدم —
         النقر تفاعل، لكن بعض المتصفحات قد ترفض رغم ذلك */
      if (p && typeof p.catch === 'function') {
        p.catch(function () { paint(false); localStorage.setItem(KEY, '0'); });
      }
    }

    btn.addEventListener('click', function () {
      if (audio.paused) { start(); paint(true); localStorage.setItem(KEY, '1'); }
      else { audio.pause(); paint(false); localStorage.setItem(KEY, '0'); }
    });

    /* لا يمكن بدء الصوت تلقائياً عند فتح الصفحة (سياسة المتصفحات)،
       لذا نحفظ الرغبة فقط ونعرض حالة "متوقف" دائماً حتى يضغط المستخدم */
    label(false);
    paint(false);
  }

  /* ── Init ── */
  function init() {
    initSwitcher();
    initMusicToggle();
    apply(localStorage.getItem('am_lang') || 'ar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Fallback: إذا java.js تأخر لأي سبب، أظهر الصفحة بعد 300ms على الأكثر */
  setTimeout(showBody, 300);

})();
