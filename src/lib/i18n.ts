export type AppLanguage = "ar" | "en" | "fr";

export function getUiDirection(lang: AppLanguage): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    desk: string;
    compose: string;
    inbox: string;
    sent: string;
    archive: string;
    settings: string;
    logout: string;
  };
  welcome: {
    badge: string;
    heroTitle: string;
    heroDesc: string;
    philosophyTitle: string;
    philosophyQuote: string;
    startBtn: string;
    loginBtn: string;
    stepsTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  auth: {
    registerTitle: string;
    registerSubtitle: string;
    loginTitle: string;
    loginSubtitle: string;
    forgotTitle: string;
    forgotSubtitle: string;
    displayName: string;
    nickname: string;
    email: string;
    password: string;
    createAccountBtn: string;
    signInBtn: string;
    forgotPasswordLink: string;
    haveAccount: string;
    noAccount: string;
    requestResetBtn: string;
    resetTokenLabel: string;
    newPasswordLabel: string;
    confirmResetBtn: string;
    resetTokenGenerated: string;
    resetSuccess: string;
    invalidCredentials: string;
    emailExists: string;
    genericError: string;
  };
  connect: {
    title: string;
    subtitle: string;
    yourCodeTitle: string;
    yourCodeDesc: string;
    copyCode: string;
    copied: string;
    regenerateCode: string;
    orJoinTitle: string;
    orJoinDesc: string;
    codePlaceholder: string;
    joinBtn: string;
    waitingPartner: string;
    exclusiveNote: string;
    invalidCode: string;
    alreadyLinked: string;
  };
  desk: {
    greeting: string;
    correspondent: string;
    notLinkedYet: string;
    linkNow: string;
    mailboxTitle: string;
    unopenedCount: string;
    newArrivalBanner: string;
    noNewArrivals: string;
    inTransitNotice: string;
    openMailbox: string;
    writeLetter: string;
    inboxCard: string;
    sentCard: string;
    archiveCard: string;
    draftsCount: string;
    tapEnvelopeHint: string;
    privacyMaskedLabel: string;
  };
  compose: {
    title: string;
    stepPaper: string;
    stepWrite: string;
    stepEnvelope: string;
    stepStamp: string;
    stepPreview: string;
    stepDelivery: string;
    modeKeyboard: string;
    modeHandwriting: string;
    letterPlaceholder: string;
    draftSaved: string;
    draftSaving: string;
    resumeDraftBanner: string;
    discardDraft: string;
    textDirection: string;
    rtlLabel: string;
    ltrLabel: string;
    letterLanguage: string;
    fontCategoryClassical: string;
    fontCategoryModern: string;
    fontCategoryHandwriting: string;
    fontCategoryLatin: string;
    fontSize: string;
    inkColor: string;
    fontPreviewHint: string;
    handwritingTitle: string;
    penThickness: string;
    undo: string;
    clear: string;
    retry: string;
    saveHandwriting: string;
    handwritingAttached: string;
    removeHandwriting: string;
    recipientLabel: string;
    symbolicAddress: string;
    envelopeNote: string;
    waxSealTitle: string;
    stampTitle: string;
    envelopeTitle: string;
    paperTitle: string;
    deliveryTitle: string;
    deliveryModeImmediate: string;
    deliveryModeDelayedArrival: string;
    deliveryModeScheduledSend: string;
    deliveryModeImmediateDesc: string;
    deliveryModeDelayedDesc: string;
    deliveryModeScheduledDesc: string;
    presets: {
      instant: string;
      "5m": string;
      "30m": string;
      "1h": string;
      "6h": string;
      "12h": string;
      "24h": string;
      custom: string;
    };
    specialOccasionLabel: string;
    specialOccasionPlaceholder: string;
    customDateLabel: string;
    sendLetterBtn: string;
    scheduleDraftBtn: string;
    sealingAnimationText: string;
    sentSuccessTitle: string;
    sentSuccessDesc: string;
    scheduledSuccessDesc: string;
    nextStep: string;
    prevStep: string;
    emptyLetterWarning: string;
  };
  mailbox: {
    inboxTitle: string;
    inboxSubtitle: string;
    sentTitle: string;
    sentSubtitle: string;
    unopenedSection: string;
    openedSection: string;
    inTransitSection: string;
    deliveredSection: string;
    scheduledDraftsSection: string;
    statusInTransit: string;
    statusDelivered: string;
    statusOpened: string;
    statusScheduledDraft: string;
    arrivedAt: string;
    sentAt: string;
    expectedArrival: string;
    openedAt: string;
    notOpenedYet: string;
    fromSender: string;
    toReceiver: string;
    openEnvelopeBtn: string;
    lockedUntilArrival: string;
    noInboxLetters: string;
    noSentLetters: string;
    cancelScheduledDraft: string;
  };
  opening: {
    tapToBreakSeal: string;
    breakingSeal: string;
    unfoldingLetter: string;
    writtenOn: string;
    arrivedOn: string;
    addToFavorites: string;
    favorited: string;
    backToInbox: string;
    handwrittenAttachment: string;
    lockedMessage: string;
  };
  archive: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterFavorites: string;
    filterFromMe: string;
    filterFromPartner: string;
    dateFrom: string;
    dateTo: string;
    exportBackup: string;
    exportDesc: string;
    emptyArchive: string;
    totalLetters: string;
  };
  settings: {
    title: string;
    subtitle: string;
    profileSection: string;
    preferencesSection: string;
    notificationsSection: string;
    securitySection: string;
    relationshipSection: string;
    displayName: string;
    nickname: string;
    avatarUpload: string;
    avatarHint: string;
    languageLabel: string;
    defaultFontLabel: string;
    defaultFontSizeLabel: string;
    soundEffectsLabel: string;
    soundEffectsDesc: string;
    notificationsLabel: string;
    notificationsDesc: string;
    enablePushBtn: string;
    pushEnabledStatus: string;
    pushBrowserNote: string;
    privacyMaskLabel: string;
    privacyMaskDesc: string;
    saveSettingsBtn: string;
    savedToast: string;
    unlinkTitle: string;
    unlinkDesc: string;
    unlinkBtn: string;
    unlinkConfirmText: string;
    unlinkPendingNotice: string;
    unlinkConfirmPartnerBtn: string;
    unlinkCancelBtn: string;
    logoutBtn: string;
  };
  notifications: {
    newLetterTitle: string;
    newLetterBody: string;
    delayedLetterBody: string;
    markAllRead: string;
    empty: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  ar: {
    appName: "بين الرسائل",
    appSubtitle: "Between Letters",
    tagline: "فنُّ انتظارِ الكلماتِ المكتوبةِ على مهلٍ بين قلبين",
    nav: {
      desk: "المكتب",
      compose: "كتابة رسالة",
      inbox: "الوارد",
      sent: "الصادر",
      archive: "أرشيف الذكريات",
      settings: "الإعدادات",
      logout: "خروج",
    },
    welcome: {
      badge: "مراسلات خاصة لشخصين فقط • القرن التاسع عشر",
      heroTitle: "استعيدا دفء الرسائل الورقية… حيثُ للانتظار معنى.",
      heroDesc:
        "في زمن الرسائل الفورية العابرة، يفتح لكما «بين الرسائل» مكتباً خشبياً هادئاً؛ تكتب فيه رسالتك على ورقٍ عاجيّ، تختار خطّها وحبرها، تطويها داخل ظرفٍ ممهورٍ بختم الشمع، وتُرسلها في رحلةٍ زمنيةٍ حقيقية حتى تصل في موعدها.",
      philosophyTitle: "فلسفة فنّ الانتظار",
      philosophyQuote:
        "«لا تُقاس قيمة الكلمات بسرعة وصولها، بل بالوقت الذي قضاه القلب في كتابتها، وبالشوق الذي سبق فتح الظرف.»",
      startBtn: "ابدأ مكتب المراسلات",
      loginBtn: "لديّ حساب بالفعل",
      stepsTitle: "طقوس الرسالة الواحدة",
      step1Title: "ورقٌ وحبرٌ وخط",
      step1Desc: "اختر الورق العتيق والخط العربي أو اليدوي أو خطّ يدك المباشر.",
      step2Title: "ظرفٌ وطابعٌ وختم",
      step2Desc: "أعدّ الظرف، الصق الطابع البريدي، واختمه بالشمع المذاب.",
      step3Title: "رحلة الانتظار",
      step3Desc: "حدد وقت الوصول؛ يبقى المحتوى مقفلاً في الخادم حتى يحين الموعد.",
      step4Title: "أرشيف الذكريات",
      step4Desc: "تُحفظ كل رسالة بهيئتها الأصلية لتعودا إليها بعد سنوات.",
    },
    auth: {
      registerTitle: "فتح دفتر مراسلات جديد",
      registerSubtitle: "أنشئ حسابك الشخصي لتبدأ رحلة الرسائل الخاصة",
      loginTitle: "العودة إلى مكتبك",
      loginSubtitle: "سجّل الدخول لتفقّد صندوق البريد الوارد",
      forgotTitle: "استعادة كلمة المرور",
      forgotSubtitle: "أدخل بريدك الإلكتروني لإصدار رمز استعادة آمن",
      displayName: "الاسم الكامل",
      nickname: "الاسم المستعار (يظهر في المراسلات)",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      createAccountBtn: "إنشاء الحساب",
      signInBtn: "دخول إلى المكتب",
      forgotPasswordLink: "نسيت كلمة المرور؟",
      haveAccount: "لديك حساب بالفعل؟ سجّل الدخول",
      noAccount: "مستخدم جديد؟ أنشئ حسابك",
      requestResetBtn: "إصدار رمز الاستعادة",
      resetTokenLabel: "رمز الاستعادة",
      newPasswordLabel: "كلمة المرور الجديدة",
      confirmResetBtn: "تحديث كلمة المرور",
      resetTokenGenerated: "تم إنشاء رمز الاستعادة (صالح لمدة 30 دقيقة):",
      resetSuccess: "تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
      invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      emailExists: "هذا البريد الإلكتروني مسجل مسبقاً.",
      genericError: "حدث خطأ غير متوقع، يُرجى المحاولة مجدداً.",
    },
    connect: {
      title: "ربط الحسابين فقط",
      subtitle: "هذا التطبيق مخصص لشخصين فقط؛ بمجرد الربط يُغلق الباب أمام أي طرف ثالث.",
      yourCodeTitle: "رمز دعوتك الفريد",
      yourCodeDesc: "أرسل هذا الرمز إلى الشخص الذي تود مراسلته بشكل خاص.",
      copyCode: "نسخ الرمز",
      copied: "تم النسخ",
      regenerateCode: "توليد رمز جديد",
      orJoinTitle: "أو أدخل رمز الدعوة الذي وصلك",
      orJoinDesc: "إذا أنشأ شريكك الرمز مسبقاً، أدخله هنا للانضمام.",
      codePlaceholder: "مثال: BL-7K9P-2M4X",
      joinBtn: "ربط الحسابين",
      waitingPartner: "بانتظار انضمام شريكك باستخدام الرمز أعلاه…",
      exclusiveNote: "خصوصية تامة: لا يمكن ربط حساب ثالث بهذه العلاقة، وتتحقق قاعدة البيانات من ذلك في كل طلب.",
      invalidCode: "رمز الدعوة غير صالح أو تم استخدامه بالفعل.",
      alreadyLinked: "هذا الحساب مرتبط بالفعل بشريك آخر.",
    },
    desk: {
      greeting: "أهلاً بك في مكتبك،",
      correspondent: "رفيق المراسلات",
      notLinkedYet: "لم يُربط حسابك بعد",
      linkNow: "اربط الحسابين الآن",
      mailboxTitle: "صندوق البريد الشخصي",
      unopenedCount: "رسائل بانتظار الفتح",
      newArrivalBanner: "وصلت إليك رسالة جديدة في صندوق البريد — اضغط على الظرف لفضّ الختم.",
      noNewArrivals: "صندوق البريد هادئ الآن… ربما هناك كلماتٌ تُكتب لك في مكانٍ ما.",
      inTransitNotice: "رسالة في الطريق إليك حالياً",
      openMailbox: "تصفّح البريد الوارد",
      writeLetter: "كتابة رسالة جديدة",
      inboxCard: "البريد الوارد",
      sentCard: "البريد الصادر",
      archiveCard: "أرشيف الذكريات",
      draftsCount: "مسودات محفوظة",
      tapEnvelopeHint: "اضغط لفتح الظرف",
      privacyMaskedLabel: "مراسلة خاصة",
    },
    compose: {
      title: "مكتب كتابة الرسالة",
      stepPaper: "١. الورق",
      stepWrite: "٢. الكتابة",
      stepEnvelope: "٣. الظرف",
      stepStamp: "٤. الطابع والختم",
      stepPreview: "٥. المعاينة",
      stepDelivery: "٦. التوصيل",
      modeKeyboard: "الكتابة بلوحة المفاتيح",
      modeHandwriting: "الكتابة بخط اليد (الإصبع / الفأرة)",
      letterPlaceholder: "اكتب رسالتك هنا على مهل… تذكّر أن الكلمات الصادقة تستحق وقتها.",
      draftSaved: "تم حفظ المسودة تلقائياً",
      draftSaving: "جارٍ حفظ المسودة…",
      resumeDraftBanner: "توجد مسودة محفوظة من جلستك السابقة، يمكنك إكمالها بأمان.",
      discardDraft: "مسح المسودة والبدء من جديد",
      textDirection: "اتجاه نص الرسالة",
      rtlLabel: "من اليمين لليسار (عربي)",
      ltrLabel: "من اليسار لليمين (فرنسي / إنجليزي)",
      letterLanguage: "لغة الرسالة",
      fontCategoryClassical: "خطوط عربية كلاسيكية",
      fontCategoryModern: "خطوط عربية عصرية",
      fontCategoryHandwriting: "خطوط تحاكي الكتابة اليدوية",
      fontCategoryLatin: "خطوط إنجليزية وفرنسية",
      fontSize: "حجم الخط",
      inkColor: "لون الحبر",
      fontPreviewHint: "معاينة حيّة بخطك المختار:",
      handwritingTitle: "لوحة الكتابة اليدوية بالحبر",
      penThickness: "سُمك القلم",
      undo: "تراجع",
      clear: "مسح اللوحة",
      retry: "إعادة المحاولة",
      saveHandwriting: "اعتماد الورقة المكتوبة يدوياً",
      handwritingAttached: "تم إرفاق ورقة مكتوبة بخط يدك مع الرسالة",
      removeHandwriting: "إزالة الورقة اليدوية",
      recipientLabel: "الاسم المكتوب على الظرف",
      symbolicAddress: "عنوان رمزي اختياري",
      envelopeNote: "عبارة أو رمز قصير على الظرف",
      waxSealTitle: "اختيار الختم الشمعي",
      stampTitle: "اختيار الطابع البريدي",
      envelopeTitle: "اختيار تصميم الظرف",
      paperTitle: "اختيار الورق",
      deliveryTitle: "موعد الإرسال والوصول",
      deliveryModeImmediate: "إرسال فوري أو بمدة توصيل",
      deliveryModeDelayedArrival: "رسالة مرسلة مؤجلة الوصول",
      deliveryModeScheduledSend: "رسالة مجدولة للإرسال لاحقاً",
      deliveryModeImmediateDesc: "تُختم الآن وتبدأ رحلتها وفق مدة التوصيل المختارة.",
      deliveryModeDelayedDesc: "تُرسل الآن وتصل لصندوقه، لكنه لا يستطيع فتحها قبل الموعد المحدد.",
      deliveryModeScheduledDesc: "تبقى في مسوداتك المجدولة ولا تغادر صندوقك إلا عند حلول الموعد.",
      presets: {
        instant: "توصيل فوري",
        "5m": "بعد 5 دقائق",
        "30m": "بعد 30 دقيقة",
        "1h": "بعد ساعة واحدة",
        "6h": "بعد 6 ساعات",
        "12h": "بعد 12 ساعة",
        "24h": "بعد 24 ساعة",
        custom: "تاريخ ووقت مخصصان",
      },
      specialOccasionLabel: "وسم مناسبة خاصة (اختياري)",
      specialOccasionPlaceholder: "مثلاً: افتح هذه الرسالة في يوم مميز / ذكرى لقائنا",
      customDateLabel: "التاريخ والوقت المحددان",
      sendLetterBtn: "إرسال الرسالة — Send Letter",
      scheduleDraftBtn: "جدولة الإرسال",
      sealingAnimationText: "جارٍ طيّ الورقة، وختم الظرف بالشمع الأحمر…",
      sentSuccessTitle: "انطلقت رسالتك في رحلتها!",
      sentSuccessDesc: "تم ختم الظرف وإيداعه البريد. لا يمكن تعديل الرسالة بعد إرسالها حفاظاً على قدسية اللحظة.",
      scheduledSuccessDesc: "تمت جدولة رسالتك بنجاح؛ ستبقى في صندوق المسودات المجدولة حتى يحين موعد إرسالها.",
      nextStep: "الخطوة التالية",
      prevStep: "السابق",
      emptyLetterWarning: "يُرجى كتابة نص الرسالة أو إضافة ورقة مكتوبة بخط اليد قبل الإرسال.",
    },
    mailbox: {
      inboxTitle: "صندوق البريد الوارد",
      inboxSubtitle: "الأظرف التي وصلت إليك — لا يُكشف المحتوى إلا عند فضّ الختم",
      sentTitle: "صندوق البريد الصادر",
      sentSubtitle: "تتبّع رحلة رسائلك المرسلة وحالة وصولها وفتحها",
      unopenedSection: "أظرف لم تُفتح بعد",
      openedSection: "رسائل تم فتحها",
      inTransitSection: "في الطريق إليك…",
      deliveredSection: "وصلت إلى المستلم",
      scheduledDraftsSection: "رسائل مجدولة للإرسال (تغادر عند الموعد)",
      statusInTransit: "في الطريق إليك...",
      statusDelivered: "وصلت رسالتك!",
      statusOpened: "تم فتحها",
      statusScheduledDraft: "مجدولة للإرسال",
      arrivedAt: "تاريخ الوصول",
      sentAt: "تاريخ الإرسال",
      expectedArrival: "موعد الوصول",
      openedAt: "فُتحت في",
      notOpenedYet: "مختومة لم تُفتح بعد",
      fromSender: "من",
      toReceiver: "إلى",
      openEnvelopeBtn: "فتح الظرف",
      lockedUntilArrival: "مختومة حتى يحين موعد الوصول",
      noInboxLetters: "لا توجد رسائل في البريد الوارد بعد.",
      noSentLetters: "لم ترسل أي رسالة بعد.",
      cancelScheduledDraft: "إلغاء الجدولة وحذف المسودة",
    },
    opening: {
      tapToBreakSeal: "اضغط على الختم الشمعي لفضّ الظرف",
      breakingSeal: "ينكسر الختم الشمعي برفق…",
      unfoldingLetter: "تُفتح الورقة بين يديك…",
      writtenOn: "كُتبت في",
      arrivedOn: "وصلت في",
      addToFavorites: "حفظ في المفضلة",
      favorited: "في المفضلة",
      backToInbox: "العودة إلى البريد الوارد",
      handwrittenAttachment: "ورقة مكتوبة بخط اليد",
      lockedMessage: "هذه الرسالة لا تزال في الطريق؛ يحفظها الخادم مغلقةً حتى يحين موعد وصولها.",
    },
    archive: {
      title: "أرشيف الذكريات",
      subtitle: "Memory Archive — جميع رسائلكما محفوظةً بورقها وخطّها الأصلي إلى الأبد",
      searchPlaceholder: "ابحث في كلمات الرسائل أو اسم الظرف…",
      filterAll: "جميع الرسائل",
      filterFavorites: "المفضلة",
      filterFromMe: "رسائلي",
      filterFromPartner: "رسائل شريكي",
      dateFrom: "من تاريخ",
      dateTo: "إلى تاريخ",
      exportBackup: "تصدير نسخة احتياطية (JSON)",
      exportDesc: "تنزيل أرشيف كامل لرسائلكما محفوظ بصيغة JSON للذكرى.",
      emptyArchive: "الأرشيف بانتظار أولى رسائلكما المفتوحة.",
      totalLetters: "إجمالي الرسائل المحفوظة",
    },
    settings: {
      title: "إعدادات المكتب والخصوصية",
      subtitle: "تخصيص التجربة، الصوت، الإشعارات، وإدارة الربط الآمن",
      profileSection: "الملف الشخصي",
      preferencesSection: "الخط واللغة والتجربة",
      notificationsSection: "الإشعارات والصوت",
      securitySection: "الخصوصية والأمان",
      relationshipSection: "ارتباط الحسابين",
      displayName: "الاسم",
      nickname: "الاسم المستعار",
      avatarUpload: "تغيير الصورة الشخصية",
      avatarHint: "صورة PNG أو JPEG بحجم أقصى 750 كيلوبايت",
      languageLabel: "لغة واجهة التطبيق",
      defaultFontLabel: "الخط الافتراضي للرسائل",
      defaultFontSizeLabel: "حجم الخط الافتراضي",
      soundEffectsLabel: "المؤثرات الصوتية الكلاسيكية",
      soundEffectsDesc: "صوت حفيف الورق، فتح الظرف، وكسر الختم الشمعي (تعمل عند تفاعلك فقط).",
      notificationsLabel: "إشعارات وصول الرسائل",
      notificationsDesc: "إشعار هادئ عند وصول رسالة دون كشف أي كلمة من محتواها.",
      enablePushBtn: "تفعيل إشعارات المتصفح / الهاتف",
      pushEnabledStatus: "الإشعارات مفعّلة في هذا المتصفح",
      pushBrowserNote: "ملاحظة: تتطلب إشعارات Web Push اتصال HTTPS. على iPhone/iPad (iOS 16.4+) يجب تثبيت التطبيق على الشاشة الرئيسية أولاً.",
      privacyMaskLabel: "إخفاء اسم المرسل على سطح المكتب",
      privacyMaskDesc: "يعرض الأظرف بوسم «مراسلة خاصة» دون إظهار الاسم حتى تفتح صندوق البريد.",
      saveSettingsBtn: "حفظ التغييرات",
      savedToast: "تم حفظ الإعدادات بنجاح",
      unlinkTitle: "فك ارتباط الحسابين",
      unlinkDesc: "يتطلب فك الارتباط تأكيداً صريحاً. عند فك الارتباط لن يتمكن أي طرف من إرسال رسائل جديدة إلا بعد ربط جديد.",
      unlinkBtn: "طلب فك الارتباط الآمن",
      unlinkConfirmText: "هل أنت متأكد من طلب فك ارتباط الحسابين؟",
      unlinkPendingNotice: "تم إرسال طلب فك الارتباط؛ يكتمل فك الارتباط عند تأكيد الطرف الثاني أو تأكيدك النهائي.",
      unlinkConfirmPartnerBtn: "تأكيد فك الارتباط نهائياً",
      unlinkCancelBtn: "التراجع عن الطلب",
      logoutBtn: "تسجيل الخروج",
    },
    notifications: {
      newLetterTitle: "بين الرسائل",
      newLetterBody: "لديك رسالة جديدة...",
      delayedLetterBody: "شخص ما خصّص لك بعض الكلمات.",
      markAllRead: "تحديد الكل كمقروء",
      empty: "لا توجد إشعارات جديدة.",
    },
  },
  en: {
    appName: "Between Letters",
    appSubtitle: "بين الرسائل",
    tagline: "The art of waiting for words written slowly between two hearts",
    nav: {
      desk: "Writing Desk",
      compose: "Write Letter",
      inbox: "Inbox",
      sent: "Sent",
      archive: "Memory Archive",
      settings: "Settings",
      logout: "Sign Out",
    },
    welcome: {
      badge: "Private Two-Person Correspondence • 19th-Century Aesthetic",
      heroTitle: "Reclaim the warmth of paper letters… where waiting has meaning.",
      heroDesc:
        "In an era of instant, fleeting chats, Between Letters offers a quiet wooden writing desk for just the two of you. Compose on textured ivory paper, choose your calligraphy and ink, seal the envelope with warm wax, and let the letter travel across real server-measured time.",
      philosophyTitle: "The Art of Waiting",
      philosophyQuote:
        "“A letter is not measured by how fast it arrives, but by the stillness in which it was written and the longing before the seal is broken.”",
      startBtn: "Open Your Writing Desk",
      loginBtn: "I Already Have an Account",
      stepsTitle: "The Ritual of a Letter",
      step1Title: "Paper, Ink & Script",
      step1Desc: "Select antique parchment, calligraphic fonts, or handwrite directly on canvas.",
      step2Title: "Envelope, Stamp & Wax",
      step2Desc: "Dress your envelope with vintage stamps and press a wax seal.",
      step3Title: "Real-Time Transit",
      step3Desc: "Choose when it arrives; content stays locked on the server until then.",
      step4Title: "Memory Archive",
      step4Desc: "Every letter is preserved in its exact original paper and typography forever.",
    },
    auth: {
      registerTitle: "Begin Private Correspondence",
      registerSubtitle: "Create your account to enter your quiet writing desk",
      loginTitle: "Return to Your Desk",
      loginSubtitle: "Sign in to check your personal mailbox",
      forgotTitle: "Password Recovery",
      forgotSubtitle: "Enter your email to generate a secure recovery token",
      displayName: "Full Name",
      nickname: "Pen Name / Nickname",
      email: "Email Address",
      password: "Password",
      createAccountBtn: "Create Account",
      signInBtn: "Enter Desk",
      forgotPasswordLink: "Forgot password?",
      haveAccount: "Already registered? Sign in",
      noAccount: "New here? Create an account",
      requestResetBtn: "Generate Recovery Token",
      resetTokenLabel: "Recovery Token",
      newPasswordLabel: "New Password",
      confirmResetBtn: "Update Password",
      resetTokenGenerated: "Recovery token created (valid for 30 minutes):",
      resetSuccess: "Password updated. You may sign in now.",
      invalidCredentials: "Incorrect email or password.",
      emailExists: "This email is already registered.",
      genericError: "An unexpected error occurred. Please try again.",
    },
    connect: {
      title: "Link Your Two Accounts",
      subtitle: "Built strictly for two people. Once linked, no third account can ever join.",
      yourCodeTitle: "Your Unique Invite Code",
      yourCodeDesc: "Share this private code with the person you wish to correspond with.",
      copyCode: "Copy Code",
      copied: "Copied",
      regenerateCode: "Generate New Code",
      orJoinTitle: "Or Enter Your Partner's Invite Code",
      orJoinDesc: "If your partner already created a code, enter it below to connect.",
      codePlaceholder: "e.g., BL-7K9P-2M4X",
      joinBtn: "Connect Accounts",
      waitingPartner: "Waiting for your partner to join with the code above…",
      exclusiveNote: "Strict privacy: database rules enforce a maximum of two linked users per relationship.",
      invalidCode: "Invite code is invalid or has already been claimed.",
      alreadyLinked: "This account is already linked to a partner.",
    },
    desk: {
      greeting: "Welcome to your desk,",
      correspondent: "Correspondent",
      notLinkedYet: "Not linked with a partner yet",
      linkNow: "Connect Partner",
      mailboxTitle: "Personal Wooden Mailbox",
      unopenedCount: "Unopened Letters",
      newArrivalBanner: "A sealed letter rests in your mailbox — tap the envelope to break the seal.",
      noNewArrivals: "Your mailbox is quiet for now… perhaps someone is choosing their words.",
      inTransitNotice: "letter currently in transit to you",
      openMailbox: "Open Inbox",
      writeLetter: "Write a New Letter",
      inboxCard: "Inbox",
      sentCard: "Sent Mail",
      archiveCard: "Memory Archive",
      draftsCount: "Saved Drafts",
      tapEnvelopeHint: "Tap to unseal",
      privacyMaskedLabel: "Private Correspondence",
    },
    compose: {
      title: "Letter Writing Desk",
      stepPaper: "1. Paper",
      stepWrite: "2. Write",
      stepEnvelope: "3. Envelope",
      stepStamp: "4. Stamp & Seal",
      stepPreview: "5. Preview",
      stepDelivery: "6. Delivery",
      modeKeyboard: "Keyboard Composition",
      modeHandwriting: "Handwriting Canvas (Touch / Mouse)",
      letterPlaceholder: "Write your letter slowly… heartfelt words deserve stillness.",
      draftSaved: "Draft auto-saved",
      draftSaving: "Saving draft…",
      resumeDraftBanner: "A saved draft from earlier is loaded safely.",
      discardDraft: "Discard draft & start fresh",
      textDirection: "Letter Text Direction",
      rtlLabel: "Right-to-Left (Arabic)",
      ltrLabel: "Left-to-Right (English / French)",
      letterLanguage: "Letter Language",
      fontCategoryClassical: "Arabic Classical",
      fontCategoryModern: "Arabic Modern",
      fontCategoryHandwriting: "Arabic Handwriting",
      fontCategoryLatin: "English & French Script",
      fontSize: "Font Size",
      inkColor: "Ink Color",
      fontPreviewHint: "Live preview with your chosen typeface:",
      handwritingTitle: "Fountain Pen Handwriting Sheet",
      penThickness: "Nib Thickness",
      undo: "Undo",
      clear: "Clear",
      retry: "Start Over",
      saveHandwriting: "Attach Handwritten Sheet",
      handwritingAttached: "Handwritten sheet attached to this letter",
      removeHandwriting: "Remove handwritten sheet",
      recipientLabel: "Name on Envelope",
      symbolicAddress: "Optional Symbolic Address",
      envelopeNote: "Short phrase or emblem note",
      waxSealTitle: "Choose Wax Seal",
      stampTitle: "Choose Postage Stamp",
      envelopeTitle: "Choose Envelope",
      paperTitle: "Choose Stationery Paper",
      deliveryTitle: "Delivery & Dispatch Timing",
      deliveryModeImmediate: "Immediate or Timed Transit",
      deliveryModeDelayedArrival: "Sent Now, Sealed Until Future Date",
      deliveryModeScheduledSend: "Scheduled Dispatch (Waits in Drafts)",
      deliveryModeImmediateDesc: "Sealed now and begins transit for your chosen duration.",
      deliveryModeDelayedDesc: "Sent immediately, but locked by the server until the arrival date.",
      deliveryModeScheduledDesc: "Remains in your scheduled drafts and leaves only at the chosen time.",
      presets: {
        instant: "Instant Delivery",
        "5m": "After 5 minutes",
        "30m": "After 30 minutes",
        "1h": "After 1 hour",
        "6h": "After 6 hours",
        "12h": "After 12 hours",
        "24h": "After 24 hours",
        custom: "Custom Date & Time",
      },
      specialOccasionLabel: "Special Occasion Note (optional)",
      specialOccasionPlaceholder: "e.g., Open on our anniversary",
      customDateLabel: "Target Date & Time",
      sendLetterBtn: "Send Letter — إرسال الرسالة",
      scheduleDraftBtn: "Schedule Dispatch",
      sealingAnimationText: "Folding the stationery and pressing the wax seal…",
      sentSuccessTitle: "Your letter is on its way!",
      sentSuccessDesc: "Sealed and dispatched. Sent letters cannot be edited, preserving the authenticity of the moment.",
      scheduledSuccessDesc: "Scheduled safely. It will remain in your drafts until the exact dispatch moment.",
      nextStep: "Next Step",
      prevStep: "Back",
      emptyLetterWarning: "Please write your letter or attach a handwritten sheet before sending.",
    },
    mailbox: {
      inboxTitle: "Inbox",
      inboxSubtitle: "Arrived envelopes — contents remain hidden until you break the wax seal",
      sentTitle: "Sent Letters",
      sentSubtitle: "Track envelopes in transit, delivered, and opened",
      unopenedSection: "Sealed & Unopened",
      openedSection: "Opened Letters",
      inTransitSection: "On the Way to You…",
      deliveredSection: "Delivered",
      scheduledDraftsSection: "Scheduled to Leave Drafts",
      statusInTransit: "On its way to you...",
      statusDelivered: "Your letter has arrived!",
      statusOpened: "Opened",
      statusScheduledDraft: "Scheduled Dispatch",
      arrivedAt: "Arrived",
      sentAt: "Sent",
      expectedArrival: "Expected Arrival",
      openedAt: "Opened",
      notOpenedYet: "Sealed, not opened yet",
      fromSender: "From",
      toReceiver: "To",
      openEnvelopeBtn: "Open Envelope",
      lockedUntilArrival: "Sealed until arrival time",
      noInboxLetters: "No arrived letters yet.",
      noSentLetters: "You haven't sent any letters yet.",
      cancelScheduledDraft: "Cancel Schedule & Delete",
    },
    opening: {
      tapToBreakSeal: "Tap the wax seal to open the envelope",
      breakingSeal: "Breaking the wax seal softly…",
      unfoldingLetter: "Unfolding the stationery…",
      writtenOn: "Written on",
      arrivedOn: "Arrived on",
      addToFavorites: "Save to Favorites",
      favorited: "Favorited",
      backToInbox: "Return to Inbox",
      handwrittenAttachment: "Handwritten Sheet",
      lockedMessage: "This letter is still in transit. The server keeps it sealed until its arrival time.",
    },
    archive: {
      title: "Memory Archive",
      subtitle: "Every letter preserved in its original stationery and script forever",
      searchPlaceholder: "Search letter text or envelope label…",
      filterAll: "All Letters",
      filterFavorites: "Favorites",
      filterFromMe: "From Me",
      filterFromPartner: "From Partner",
      dateFrom: "From date",
      dateTo: "To date",
      exportBackup: "Export Backup (JSON)",
      exportDesc: "Download a full JSON keepsake archive of your correspondence.",
      emptyArchive: "Your archive awaits your first opened letters.",
      totalLetters: "Total Archived Letters",
    },
    settings: {
      title: "Desk & Privacy Settings",
      subtitle: "Customize language, typography, sound effects, notifications, and link security",
      profileSection: "Profile",
      preferencesSection: "Typography & Language",
      notificationsSection: "Sound & Notifications",
      securitySection: "Privacy & Security",
      relationshipSection: "Two-Person Link",
      displayName: "Display Name",
      nickname: "Pen Name / Nickname",
      avatarUpload: "Update Portrait",
      avatarHint: "PNG or JPEG up to 750 KB",
      languageLabel: "Interface Language",
      defaultFontLabel: "Default Letter Font",
      defaultFontSizeLabel: "Default Font Size",
      soundEffectsLabel: "Vintage Sound Effects",
      soundEffectsDesc: "Soft paper rustle, envelope opening, and wax seal crack (plays only on interaction).",
      notificationsLabel: "Arrival Notifications",
      notificationsDesc: "Gentle alert when a letter arrives without ever revealing its contents.",
      enablePushBtn: "Enable Browser / Device Push",
      pushEnabledStatus: "Notifications enabled on this browser",
      pushBrowserNote: "Web Push requires HTTPS. On iPhone/iPad (iOS 16.4+), add the app to your Home Screen first.",
      privacyMaskLabel: "Hide Sender Name on Desk",
      privacyMaskDesc: "Displays incoming desk envelopes as 'Private Correspondence' until opened.",
      saveSettingsBtn: "Save Changes",
      savedToast: "Settings saved",
      unlinkTitle: "Unlink Accounts",
      unlinkDesc: "Unlinking requires deliberate confirmation. Neither person can send new letters until linked again.",
      unlinkBtn: "Request Safe Unlink",
      unlinkConfirmText: "Are you sure you want to request unlinking these two accounts?",
      unlinkPendingNotice: "Unlink requested. Confirm again or wait for partner confirmation to finalize.",
      unlinkConfirmPartnerBtn: "Confirm Final Unlink",
      unlinkCancelBtn: "Cancel Unlink Request",
      logoutBtn: "Sign Out",
    },
    notifications: {
      newLetterTitle: "Between Letters",
      newLetterBody: "You have a new letter...",
      delayedLetterBody: "Someone set aside a few words for you.",
      markAllRead: "Mark all as read",
      empty: "No new notifications.",
    },
  },
  fr: {
    appName: "Between Letters",
    appSubtitle: "بين الرسائل",
    tagline: "L'art d'attendre des mots écrits avec lenteur entre deux cœurs",
    nav: {
      desk: "Bureau",
      compose: "Écrire",
      inbox: "Boîte reçue",
      sent: "Envoyés",
      archive: "Archives",
      settings: "Paramètres",
      logout: "Déconnexion",
    },
    welcome: {
      badge: "Correspondance privée à deux • Esthétique XIXe siècle",
      heroTitle: "Retrouvez la chaleur des lettres papier… où l'attente a un sens.",
      heroDesc:
        "À l'heure des messages éphémères, Between Letters vous offre un bureau de bois paisible pour deux. Écrivez sur papier ivoire, choisissez votre plume et votre encre, scellez à la cire et laissez le temps porter votre lettre.",
      philosophyTitle: "L'Art d'Attendre",
      philosophyQuote:
        "« La valeur d'une lettre ne se mesure pas à la vitesse de son arrivée, mais au silence dans lequel elle fut écrite. »",
      startBtn: "Ouvrir le Bureau",
      loginBtn: "J'ai déjà un compte",
      stepsTitle: "Le Rituel d'une Lettre",
      step1Title: "Papier, Encre & Plume",
      step1Desc: "Choisissez le parchemin, la calligraphie ou écrivez directement à la main.",
      step2Title: "Enveloppe, Timbre & Cire",
      step2Desc: "Préparez l'enveloppe, collez le timbre et apposez le sceau de cire.",
      step3Title: "Voyage Temporel",
      step3Desc: "Choisissez l'heure d'arrivée ; le serveur garde la lettre scellée jusqu'au moment voulu.",
      step4Title: "Archives des Souvenirs",
      step4Desc: "Chaque lettre reste préservée dans son papier et sa typographie d'origine.",
    },
    auth: {
      registerTitle: "Nouveau Carnet de Correspondance",
      registerSubtitle: "Créez votre compte pour entrer dans votre bureau privé",
      loginTitle: "Retour au Bureau",
      loginSubtitle: "Connectez-vous pour consulter votre boîte aux lettres",
      forgotTitle: "Récupération du Mot de Passe",
      forgotSubtitle: "Entrez votre e-mail pour générer un jeton de récupération",
      displayName: "Nom complet",
      nickname: "Surnom / Nom de plume",
      email: "Adresse e-mail",
      password: "Mot de passe",
      createAccountBtn: "Créer le compte",
      signInBtn: "Entrer au bureau",
      forgotPasswordLink: "Mot de passe oublié ?",
      haveAccount: "Déjà inscrit ? Se connecter",
      noAccount: "Nouveau ? Créer un compte",
      requestResetBtn: "Générer un jeton",
      resetTokenLabel: "Jeton de récupération",
      newPasswordLabel: "Nouveau mot de passe",
      confirmResetBtn: "Mettre à jour",
      resetTokenGenerated: "Jeton généré (valable 30 minutes) :",
      resetSuccess: "Mot de passe mis à jour. Vous pouvez vous connecter.",
      invalidCredentials: "E-mail ou mot de passe incorrect.",
      emailExists: "Cet e-mail est déjà enregistré.",
      genericError: "Une erreur est survenue. Veuillez réessayer.",
    },
    connect: {
      title: "Lier les Deux Comptes",
      subtitle: "Strictement réservé à deux personnes. Aucun tiers ne peut rejoindre la correspondance.",
      yourCodeTitle: "Votre Code d'Invitation Unique",
      yourCodeDesc: "Partagez ce code confidentiel avec votre destinataire.",
      copyCode: "Copier",
      copied: "Copié",
      regenerateCode: "Nouveau code",
      orJoinTitle: "Ou saisissez le code reçu",
      orJoinDesc: "Si votre partenaire a créé un code, entrez-le ici.",
      codePlaceholder: "ex. : BL-7K9P-2M4X",
      joinBtn: "Relier les comptes",
      waitingPartner: "En attente de votre partenaire avec le code ci-dessus…",
      exclusiveNote: "Confidentialité stricte : la base de données limite la relation à deux utilisateurs.",
      invalidCode: "Code invalide ou déjà utilisé.",
      alreadyLinked: "Ce compte est déjà relié.",
    },
    desk: {
      greeting: "Bienvenue à votre bureau,",
      correspondent: "Correspondant",
      notLinkedYet: "Pas encore relié",
      linkNow: "Relier maintenant",
      mailboxTitle: "Boîte aux Lettres Personnelle",
      unopenedCount: "Lettres non ouvertes",
      newArrivalBanner: "Une lettre scellée repose dans votre boîte — touchez l'enveloppe pour briser la cire.",
      noNewArrivals: "Votre boîte aux lettres est calme… quelqu'un choisit peut-être ses mots.",
      inTransitNotice: "lettre en cours d'acheminement",
      openMailbox: "Ouvrir la boîte reçue",
      writeLetter: "Écrire une nouvelle lettre",
      inboxCard: "Boîte reçue",
      sentCard: "Courrier envoyé",
      archiveCard: "Archives",
      draftsCount: "Brouillons",
      tapEnvelopeHint: "Toucher pour ouvrir",
      privacyMaskedLabel: "Correspondance privée",
    },
    compose: {
      title: "Écritoire",
      stepPaper: "1. Papier",
      stepWrite: "2. Écrire",
      stepEnvelope: "3. Enveloppe",
      stepStamp: "4. Timbre & Sceau",
      stepPreview: "5. Aperçu",
      stepDelivery: "6. Envoi",
      modeKeyboard: "Saisie au clavier",
      modeHandwriting: "Écriture manuscrite (Doigt / Souris)",
      letterPlaceholder: "Écrivez lentement… les mots sincères méritent la patience.",
      draftSaved: "Brouillon enregistré automatiquement",
      draftSaving: "Enregistrement…",
      resumeDraftBanner: "Un brouillon précédent a été restauré.",
      discardDraft: "Effacer le brouillon",
      textDirection: "Sens du texte",
      rtlLabel: "Droite à gauche (Arabe)",
      ltrLabel: "Gauche à droite (Français / Anglais)",
      letterLanguage: "Langue de la lettre",
      fontCategoryClassical: "Arabe Classique",
      fontCategoryModern: "Arabe Moderne",
      fontCategoryHandwriting: "Écriture Manuscrite Arabe",
      fontCategoryLatin: "Calligraphie Française & Anglaise",
      fontSize: "Taille",
      inkColor: "Couleur d'encre",
      fontPreviewHint: "Aperçu en direct :",
      handwritingTitle: "Feuille d'écriture manuscrite",
      penThickness: "Épaisseur",
      undo: "Annuler",
      clear: "Effacer",
      retry: "Recommencer",
      saveHandwriting: "Joindre la feuille manuscrite",
      handwritingAttached: "Feuille manuscrite jointe",
      removeHandwriting: "Retirer la feuille",
      recipientLabel: "Nom sur l'enveloppe",
      symbolicAddress: "Adresse symbolique (optionnel)",
      envelopeNote: "Courte dédicace sur l'enveloppe",
      waxSealTitle: "Choisir le sceau de cire",
      stampTitle: "Choisir le timbre postal",
      envelopeTitle: "Choisir l'enveloppe",
      paperTitle: "Choisir le papier",
      deliveryTitle: "Délai et programmation",
      deliveryModeImmediate: "Envoi immédiat ou différé",
      deliveryModeDelayedArrival: "Envoyée maintenant, scellée jusqu'à la date",
      deliveryModeScheduledSend: "Envoi programmé (reste en brouillon)",
      deliveryModeImmediateDesc: "Scellée maintenant et acheminée selon la durée choisie.",
      deliveryModeDelayedDesc: "Envoyée de suite, mais verrouillée par le serveur jusqu'à la date prévue.",
      deliveryModeScheduledDesc: "Reste dans vos brouillons programmés jusqu'à l'heure dite.",
      presets: {
        instant: "Livraison immédiate",
        "5m": "Dans 5 minutes",
        "30m": "Dans 30 minutes",
        "1h": "Dans 1 heure",
        "6h": "Dans 6 heures",
        "12h": "Dans 12 heures",
        "24h": "Dans 24 heures",
        custom: "Date et heure personnalisées",
      },
      specialOccasionLabel: "Mention d'occasion spéciale",
      specialOccasionPlaceholder: "ex. : À ouvrir pour notre anniversaire",
      customDateLabel: "Date et heure choisies",
      sendLetterBtn: "Envoyer la lettre — Send Letter",
      scheduleDraftBtn: "Programmer l'envoi",
      sealingAnimationText: "Pliage du papier et apposition du sceau de cire…",
      sentSuccessTitle: "Votre lettre a pris son envol !",
      sentSuccessDesc: "Scellée et expédiée. Une lettre envoyée ne peut plus être modifiée.",
      scheduledSuccessDesc: "Programmée avec soin. Elle quittera vos brouillons à l'heure prévue.",
      nextStep: "Suivant",
      prevStep: "Précédent",
      emptyLetterWarning: "Veuillez écrire un texte ou joindre une feuille manuscrite.",
    },
    mailbox: {
      inboxTitle: "Boîte de réception",
      inboxSubtitle: "Enveloppes arrivées — le contenu reste secret avant de briser la cire",
      sentTitle: "Lettres envoyées",
      sentSubtitle: "Suivez l'acheminement et la lecture de vos lettres",
      unopenedSection: "Scellées & Non ouvertes",
      openedSection: "Lettres ouvertes",
      inTransitSection: "En route…",
      deliveredSection: "Livrées",
      scheduledDraftsSection: "Programmées (en attente d'envoi)",
      statusInTransit: "En route vers vous...",
      statusDelivered: "Votre lettre est arrivée !",
      statusOpened: "Ouverte",
      statusScheduledDraft: "Envoi programmé",
      arrivedAt: "Arrivée",
      sentAt: "Envoyée",
      expectedArrival: "Arrivée prévue",
      openedAt: "Ouverte le",
      notOpenedYet: "Scellée, pas encore ouverte",
      fromSender: "De",
      toReceiver: "À",
      openEnvelopeBtn: "Ouvrir l'enveloppe",
      lockedUntilArrival: "Scellée jusqu'à l'arrivée",
      noInboxLetters: "Aucune lettre reçue pour le moment.",
      noSentLetters: "Vous n'avez encore envoyé aucune lettre.",
      cancelScheduledDraft: "Annuler la programmation",
    },
    opening: {
      tapToBreakSeal: "Touchez le sceau de cire pour ouvrir l'enveloppe",
      breakingSeal: "La cire se brise doucement…",
      unfoldingLetter: "Dépliage du papier…",
      writtenOn: "Écrite le",
      arrivedOn: "Arrivée le",
      addToFavorites: "Ajouter aux favoris",
      favorited: "Dans les favoris",
      backToInbox: "Retour à la boîte reçue",
      handwrittenAttachment: "Feuille manuscrite",
      lockedMessage: "Cette lettre est encore en route ; le serveur la garde scellée jusqu'à son heure.",
    },
    archive: {
      title: "Archives des Souvenirs",
      subtitle: "Toutes vos lettres conservées dans leur papier et calligraphie d'origine",
      searchPlaceholder: "Rechercher un mot ou un nom…",
      filterAll: "Toutes",
      filterFavorites: "Favoris",
      filterFromMe: "Mes lettres",
      filterFromPartner: "Celles de mon partenaire",
      dateFrom: "Du",
      dateTo: "Au",
      exportBackup: "Exporter une sauvegarde (JSON)",
      exportDesc: "Télécharger l'archive complète de vos lettres au format JSON.",
      emptyArchive: "Vos archives attendent vos premières lettres ouvertes.",
      totalLetters: "Total archivé",
    },
    settings: {
      title: "Paramètres & Confidentialité",
      subtitle: "Langue, typographie, sons, notifications et gestion du lien privé",
      profileSection: "Profil",
      preferencesSection: "Langue & Typographie",
      notificationsSection: "Sons & Notifications",
      securitySection: "Confidentialité",
      relationshipSection: "Lien à Deux",
      displayName: "Nom",
      nickname: "Nom de plume",
      avatarUpload: "Changer le portrait",
      avatarHint: "PNG ou JPEG (max 750 Ko)",
      languageLabel: "Langue de l'interface",
      defaultFontLabel: "Police par défaut",
      defaultFontSizeLabel: "Taille par défaut",
      soundEffectsLabel: "Effets sonores vintage",
      soundEffectsDesc: "Froissement du papier, ouverture et bris du sceau (uniquement sur action).",
      notificationsLabel: "Notifications d'arrivée",
      notificationsDesc: "Alerte discrète sans jamais dévoiler le texte de la lettre.",
      enablePushBtn: "Activer les notifications Push",
      pushEnabledStatus: "Notifications activées sur ce navigateur",
      pushBrowserNote: "Web Push exige HTTPS. Sur iOS 16.4+, ajoutez d'abord l'application à l'écran d'accueil.",
      privacyMaskLabel: "Masquer le nom sur le bureau",
      privacyMaskDesc: "Affiche « Correspondance privée » sur les enveloppes du bureau.",
      saveSettingsBtn: "Enregistrer",
      savedToast: "Paramètres enregistrés",
      unlinkTitle: "Délier les comptes",
      unlinkDesc: "La rupture du lien demande une confirmation explicite.",
      unlinkBtn: "Demander à délier",
      unlinkConfirmText: "Confirmez-vous la demande de séparation des deux comptes ?",
      unlinkPendingNotice: "Demande enregistrée. Confirmez pour finaliser.",
      unlinkConfirmPartnerBtn: "Confirmer définitivement",
      unlinkCancelBtn: "Annuler la demande",
      logoutBtn: "Déconnexion",
    },
    notifications: {
      newLetterTitle: "Between Letters",
      newLetterBody: "Vous avez une nouvelle lettre...",
      delayedLetterBody: "Quelqu'un vous a écrit quelques mots.",
      markAllRead: "Tout marquer comme lu",
      empty: "Aucune nouvelle notification.",
    },
  },
};

export function formatDateTime(
  isoOrDate: string | Date | null | undefined,
  lang: AppLanguage
): string {
  if (!isoOrDate) return "—";
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return "—";
  const locale = lang === "ar" ? "ar-EG" : lang === "fr" ? "fr-FR" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
