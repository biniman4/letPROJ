import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define an enum for supported languages
export enum SupportedLang {
  Am = "am",
  En = "en",
}

// Define the translations object
const translations = {
  am: {
    // Home Page translations
    home: {
      title: "የደብዳቤ አስተዳደር ስርዓት",
      subtitle: "የቦታ ሳይንስ እና ጂኦስፓሺያል ኢንስቲትዩት (SSGI)",
      description: "ለSSGI የተዘጋጀ መደበኛ መዝገብን በትክክል፣ በደህናነት እና በቀና ማድረግ የሚችል መድረክ።",
      login: "ግባ",
      featuresHeading: "የስርዓቱ ጥቅሞች",
      featuresSub: "ደብዳቤዎችን በውጤታማ ሁኔታ ለማስተዳደር የሚያስፈልገው ሁሉ",
      ctaTitle: "የመገናኛ ሂደትዎን ለመለወጥ ዝግጁ ነዎት?",
      ctaSubtitle: "የSSGI ዲጂታል ለውጥ ዛሬ ይቀላቀሉ",
      seeHowItWorksNav: "እንዴት እንደሚሰራ ይመልከቱ",
      servicesHeading: "አገልግሎቶች",
      systemDemo: "የስርዓቱ አጠቃቀም",
      seeHowItWorks: "ስርዓቱን እንዴት እንደሚጠቀሙ",
      videoDescription: "የስርዓታችንን አጠቃቀም ይመልከቱ እና ለድርጅትዎ የሚያመጡትን ጥቅሞች ይወቁ",
      browserNotSupported: "የብራውዘርዎ ቪዲዮ አይደገፍም",
      minutes: "ደቂቃ",
      hdQuality: "HD ጥራት",
      systemBenefits: "የስርዓቱ ጥቅሞች",
      fastEfficient: "ፈጣን እና ቀልጣፋ",
      fastEfficientDesc: "ደብዳበዎችን በፍጹም ፍጥነት ያስተዳድሩ እና ያስገቡ",
      secureReliable: "ደህንነቱ የተጠበቀ",
      secureReliableDesc: "ደብዳበዎች በደህንነት ይቀመጣሉ እና ይጠበቃሉ",
      betterTracking: "የተሻሻለ ቁጥጥር",
      betterTrackingDesc: "የደብዳበዎችን ሁኔታ በቀጥታ ይከታተሉ",
      enhancedCollaboration: "የተሻሻለ ትብብር",
      enhancedCollaborationDesc: "ከቡድን አባላት ጋር በቀላሉ ያብቁ",
      getStartedNow: "አሁን ጀምሩ",
      professionalServices: "የሙያተኛ አገልግሎቶቻችን",
      servicesDescription: "ለSSGI የግንኙነት ፍላጎቶች የተለዩ መፍትሄዎች",
      switchToEnglish: "ወደ እንግሊዝኛ ቀይር",
      switchToAmharic: "ወደ አማርኛ ቀይር",
      applyForm: "ቅድመ ማመልከቻ",
    },
    // Features translations
    features: [
      {
        name: "አንድ ቦታ ውስጥ ደብዳቤዎችን ማስተዳደር",
        description: "በቀና እና በቅን እንዲያስተዳድሩ ሁሉንም ደብዳቤዎች ያንድ ቦታ ውስጥ ያደርጉ።",
      },
      {
        name: "በእውነተኛው ጊዜ መከታተያ",
        description: "ደብዳቤዎችን በእውነተኛ ጊዜ ይከታተሉ።",
      },
      {
        name: "የተፋጠነ ደህንነት",
        description: "በኢንተርፓይዝ ደህንነት ደረጃ አስተዳደር ያድርጉ።",
      },
      {
        name: "ኃይለኛ ፍለጋ",
        description: "አንዱን ሰነድ በቅርብ ጊዜ ያግኙ።",
      },
      {
        name: "በራስ-ሰር የሚሰሩ ስራዎች",
        description: "የማጽደቅ ሂደቶችን ቀላል ያድርጉ።",
      },
      {
        name: "ትክክለኛ ትንተና",
        description: "ከስራዎ ሂደቶች ጠቃሚ ትንተና ያግኙ።",
      },
    ],
    // Services translations
    services: [
      {
        name: "የደብዳቤ ሂደት",
        description: "የመግቢያ እና የውጪ ይፋዊ ደብዳቤዎችን ውጤታማ ማስተናገድ",
      },
      {
        name: "ሰነድ ማህደረ ትውስታ",
        description: "የተቋማት ሰነዶች ደህንነታቸው የተጠበቀ ረጅም ጊዜ ማከማቻ እና ማግኛ",
      },
      {
        name: "የማጽደቅ ስራ ፍሰቶች",
        description: "ለማጽደቅ እና ፊርማ የተመቻቸ መስመር",
      },
    ],
    // Header translations
    header: {
      profile: "መገለጫ",
      settings: "ቅንብሮች",
      signOut: "ውጣ",
    },
    // Sidebar translations
    sidebar: {
      dashboard: "ዳሽቦርድ",
      newLetter: "አዲስ ደብዳቤ",
      inbox: "የገቢ መልዕክት ሳጥን",
      sent: "የወጪ መልዕክት",
      archive: "ማህደር",
      notifications: "ማሳወቂያዎች",
      users: "ተጠቃሚዎች",
      settings: "ቅንብሮች",
      adminPanel: "አድሚን ፓነል",
      letterFlow: "ደብዳቤ ፍሎው",
    },
    // Login translations
    login: {
      title: "ወደ መለያዎ ይግቡ",
      emailLabel: "የኢሜል አድራሻ",
      passwordLabel: "የይለፍ ቃል",
      emailPlaceholder: "john@example.com",
      passwordPlaceholder: "••••••••",
      loginButton: "ግባ",
      backToHome: "ወደ መነሻ ገጽ ተመለስ",
      noAccount: "መለያ የለዎትም?",
      signUp: "ይመዝገቡ",
      forgotPassword: "የይለፍ ቃል ረሱ?",
      requiredFields: "ሁለቱም መስኮች ያስፈልጋሉ",
      errorOccurred: "ስህተት ተከስቷል",
      modalTitle: "ወደ መለያዎ ይግቡ",
      invalidCredentials: "የማያገኙ መረጃዎች"
    },
    // Signup translations
    signup: {
      title: "መለያ ይፍጠሩ",
      subtitle: "እንኳን ደህና መጡ! መረጃዎን አስገብተው ይቀላቀሉን።",
      fullNameLabel: "ሙሉ ስም",
      fullNamePlaceholder: "ጆን ዶ",
      emailLabel: "የኢሜል አድራሻ",
      emailPlaceholder: "john@example.com",
      phoneNumberLabel: "ስልክ ቁጥር",
      phoneNumberPlaceholder: "+1234567890",
      passwordLabel: "የይለፍ ቃል",
      confirmPasswordLabel: "የይለፍ ቃል ያረጋግጡ",
      passwordPlaceholder: "••••••••",
      termsAgreement: "የተጠቃሚ ስምምነትን እቀበላለሁ",
      termsAndConditions: "የአጠቃቀም ውሎች እና ሁኔታዎች",
      signUpButton: "ይመዝገቡ",
      backToAdmin: "ወደ አስተዳዳሪ ገጽ ተመለስ",
      fillAllFields: "እባክዎ ሁሉንም መስኮች ይሙሉ",
      passwordsMismatch: "የይለፍ ቃላት አይዛመዱም",
      registrationSuccessful: "ምዝገባ ተሳክቷል!",
      registrationFailed: "ምዝገባ አልተሳካም",
    },
    // Department Selector translations
    departmentSelector: {
      mainCategory: "ዋና ምድብ",
      selectMainCategory: "-- ዋና ምድብ ይምረጡ --",
      subCategory: "ንዑስ ምድብ",
      selectSubCategory: "-- ንዑስ ምድብ ይምረጡ --",
      subSubCategory: "ንዑስ ንዑስ ምድብ",
      selectSubSubCategory: "-- ንዑስ ንዑስ ምድብ ይምረጡ --",
      selectedCategory: "የተመረጠ ምድብ",
      departments: [
        {
          id: "director_general",
          label: "ዋና ዳይሬክተር",
          subDepartments: [
            {
              id: "head_of_office",
              label: "የጽፈት ቤት ኃላፊ",
              subDepartments: [
                { id: "public_relations_executive", label: "የህዝብ ግንኙነት ስራ አስፈጻሚ" },
                { id: "legal_services_executive", label: "የህግ አገልግሎት ስራ አስፈጻሚ" },
                { id: "audit_executive", label: "ኦዲት ስራ አስፈጻሚ" },
                { id: "ethics_anti_corruption_executive", label: "የስነ ምግባርና ፀረ ሙስና ስራ አስፈጻሚ" },
                { id: "women_social_inclusion_executive", label: "የሴቶችና ማህበራዊ አካቶ ትግበራ ስራ አስፈጻሚ" },
              ],
            },
            {
              id: "ceo_operations_management",
              label: "የስራ አመራር ዋና ስራ አስፈጻሚ",
              subDepartments: [
                { id: "strategic_affairs_executive", label: "ስትራቴጂክ ጉዳዎች ስራ አስፈጻሚ" },
                { id: "ict_executive", label: "ኢንፎርሜሽን ኮሙኒኬሽን ቴክኖሎጂ ስራ አስፈጻሚ" },
                { id: "procurement_finance_executive", label: "የግዢና ፋይናንስ ስራ አስፈጻሚ" },
                { id: "hr_management_executive", label: "የብቃትና ሰው ሀብት አስተዳደር ስአስፈጻሚ" },
                { id: "institutional_transformation_executive", label: "ተቋማዊ ለውጥ ስራ አስፈጻሚ" },
              ],
            },
            {
              id: "space_sector",
              label: "የስፔስ ዘርፍ",
              subDepartments: [
                { id: "astronomy_astrophysics_lead_executive", label: "አስትሮኖሚና አስትሮፊዚክስ መሪ ስራ አስፈጻሚ" },
                { id: "space_planetary_science_lead_executive", label: "ስፔስና ፕላኔታሪ ሳይንስ መሪ ስራ አስፈጻሚ" },
                { id: "remote_sensing_lead_executive", label: "የሪሞት ሴንሲንግ መሪ ስራ አስፈጻሚ" },
                { id: "geodesy_geodynamics_lead_executive", label: "ጂኦዴሲና ጂኦዳይናሚክ መሪ ስራ አስፈጻሚ" },
                { id: "aerospace_engineering_lead_executive", label: "ኤሮስፔስ ኢንጂነሪንግ መሪ ስራ አስፈጻሚ" },
                { id: "satellite_operation_lead_executive", label: "የሳተላይት ኦፕሬሽን መሪ ስራ አስፈጻሚ" },
                { id: "postgraduate_registrar_research_admin_lead_executive", label: "የድህረ ምረቃ፤ ሪጅስትራርና ምርምር አስተዳደር መሪ ስራ አስፈጻሚ" },
              ],
            },
            {
              id: "geospatial_sector",
              label: "የጂኦስፓሻል ዘርፍ",
              subDepartments: [
                { id: "aerial_survey_lead_executive", label: "የአየር ላይ ቅይሳ መሪ ስራ አስፈጻሚ" },
                { id: "photogrammetry_lidar_lead_executive", label: "የፎቶግራሜትሪና ሊዳር ዳታ ፕሮሰሲንግ መሪ ስራ አስፈጻሚ" },
                { id: "cartography_lead_executive", label: "የካርታ ስራ መሪ ስራ አስፈጻሚ" },
                { id: "geodetic_infrastructure_services_lead_executive", label: "የጂኦዴቲክ መሠረተ ልማት እና አገልግሎት መሪ ስራ አስፈጻሚ" },
                { id: "digital_image_processing_lead_executive", label: "የዲጂታል ኢሜጅ ፕሮሰሲንግ መሪ ስራ አስፈጻሚ" },
                { id: "spatial_planning_decision_support_lead_executive", label: "የስፓሻል ፕላኒንግ እና የውሳኔ ድጋፍ መሪ ስራ አስፈጻሚ" },
              ],
            },
            {
              id: "space_geospatial_enabling_sector",
              label: "የስፔስና ጂኦስፓሻል አስቻይ ዘርፍ",
              subDepartments: [
                { id: "space_geospatial_info_standardization_lead_executive", label: "የስፔስ እና ጂኦስፓሻል መረጃ ስታንዳርዳይዜሾን መሪ ስራ አስፈጻሚ" },
                { id: "platform_application_development_lead_executive", label: "የፕላትፎርምናአፕሊኬሽን ልማት መሪ ስራ አስፈጻሚ" },
                { id: "data_system_admin_lead_executive", label: "የዳታና ሲስተም አስተዳደር መሪ ስራ አስፈጻሚ" },
                { id: "technology_transfer_lead_executive", label: "የቴከኖሎጂ ሽግግር መሪ ስራ አስፈጻሚ" },
                { id: "space_science_geospatial_connectivity_lead_executive", label: "የስፔስ ሳይንስና ጂኦስፓሻል ቀጠናዊ ትስስር መሪ ስራ አስፈጻሚ" },
                { id: "policy_legal_framework_lead_executive", label: "የፖሊሲና ህግ ማዕቀፍ መሪ ስራ አስፈጻሚ" },
              ],
            },
          ],
        },
      ],
    },
    notifications: {
      title: "ማሳወቂያዎች",
      markAllAsRead: "ሁሉንም እንደተነበበ ምልክት አድርግ",
      noNotifications: "ምንም ማሳወቂያዎች የሉም",
      allCaughtUp: "ሁሉንም ጨርሰዋል። አዲስ ነገር ሲመጣ እናሳውቅዎታለን።",
      relatedTo: "የተዛመደው ለ:",
      markAsRead: "እንደተነበበ ምልክት አድርግ",
      deleteNotification: "ማሳወቂያ ሰርዝ",
      loading: "በመጫን ላይ...",
      errorFetchingNotifications: "ማሳወቂያዎችን ማምጣት ላይ ስህተት ተፈጥሯል፡",
      errorMarkingRead: "ማሳወቂያን እንደተነበበ ምልክት ማድረግ ላይ ስህተት ተፈጥሯል፡",
      errorMarkingAllRead: "ሁሉንም ማሳወቂያዎች እንደተነበበ ምልክት ማድረግ ላይ ስህተት ተፈጥሯል፡",
      errorDeletingNotification: "ማሳወቂያ መሰረዝ ላይ ስህተት ተፈጥሯል፡",
      priorityHigh: "ከፍተኛ",
      priorityMedium: "መካከለኛ",
      priorityLow: "ዝቅተኛ",
      letterRead: "ደብዳቤ ተነብቧል",
      letterReadDesc: (name: string, subject: string) =>
        `${name} የእርስዎን ደብዳቤ "${subject}" አንብበዋል`,
      regarding: "በተመለከተ",
      minutesAgo: "ከ ደቂቃዎች በፊት",
    },
    users: {
      title: "ተጠቃሚዎች",
      manageUsers: "የስርዓት ተጠቃሚዎችን እና ፍቃዶችን ያቀናብሩ",
      searchPlaceholder: "ተጠቃሚዎችን ፈልግ...",
      noUsersFound: "ምንም ተጠቃሚዎች አልተገኙም",
    },
    // Inbox translations
    inbox: {
      title: "የገቢ መልዕክት ሳጥን",
      searchPlaceholder: "በየገቢ ሳጥን ይፈልጉ...",
      filterButton: "አጣራ",
      filterOptions: {
        all: "ሁሉም",
        unread: "ያልተነበቡ",
        starred: "በኮከብ ምልክት የተደረጉ",
        urgent: "አደገኛ",
        seen: "የተዩ",
        rejected: "ውድቅ ተደርጓል"
      },
      noLetters: "ማንኛውም መልዕክት የለም።",
      from: "ከ",
      subject: "ርዕስ",
      date: "ቀን",
      viewButton: "መልዕክት አሳይ"
    },
    // Sent translations
    sent: {
      title: "የተላኩ ደብዳቤዎች",
      newLetterButton: "አዲስ ደብዳቤ",
      searchPlaceholder: "ደብዳቤዎችን ይፈልጉ...",
      allStatus: "ሁሉም ሁኔታ",
      statusSent: "ተልኳል።",
      statusDelivered: "ደረሰ",
      statusRead: "ታይቷል",
      statusPending: "በመጠባበቅ ላይ",
      statusRejected: "ውድቅ ተደርጓል",
      priorityNormal: "መደበኛ",
      priorityHigh: "ከፍተኛ",
      priorityUrgent: "አስቸኳይ",
      subjectColumn: "ርዕሰ ጉዳይ",
      toColumn: "ለ",
      departmentColumn: "መምሪያ",
      dateColumn: "ቀን",
      statusColumn: "ሁኔታ",
      priorityColumn: "ቅድመ ተራ",
      attachmentsColumn: "አባሪዎች",
      memoViewColumn: "ሜሞ",
      noAttachments: "ምንም አባሪዎች የሉም",
      viewMemoButton: "ሜሞ ይመልከቱ",
      letterSentSuccess: "ደብዳቤ በተሳካ ሁኔታ ተልኳል!",
      failedToSendLetter: "ደብዳቤ መላክ አልተሳካም።",
      errorDownloadingFile: "ፋይል በማውረድ ላይ ስህተት ተፈጥሯል።",
      errorViewingFile: "ፋይል በማየት ላይ ስህተት ተፈጥሯል።",
      composeNewLetter: "አዲስ ደብዳቤ ይጻፉ",
      subjectLabel: "ርዕሰ ጉዳይ",
      subjectRequired: "እባክዎ ርዕሰ ጉዳይ ያስገቡ",
      recipientLabel: "ተቀባይ",
      recipientRequired: "እባክዎ ተቀባይ ያስገቡ",
      departmentLabel: "መምሪያ",
      departmentRequired: "እባክዎ መምሪያ ይምረጡ",
      contentLabel: "ይዘት",
      contentRequired: "እባክዎ ይዘት ያስገቡ",
      removeAttachment: "አስወግድ",
      sendLetterButton: "ደብዳቤ ላክ",
      filePreview: "የፋይል ቅድመ-እይታ",
      closeButton: "ዝጋ",
      downloadButton: "አውርድ",
      previewNotAvailable: "ለዚህ የፋይል አይነት ቅድመ-እይታ አይገኝም።",
      downloadToView: "ለማየት እባክዎ ፋይሉን ያውርዱ።",
      memoLetterView: "የሜሞ ደብዳቤ እይታ",
      printButton: "አትም",
      manageSent: "የተላኩ ደብዳቤዎችን በቀላሉ ያከታተሉ እና ያስተዳድሩ",
      attachmentLabel: "Attachment",
    },
    // Archive translations
    archive: {
      title: "ማህደር",
      manageArchivedLetters: "የተጠራቀሙ ደብዳቤዎችን ያስተዳድሩ",
      searchPlaceholder: "የተጠራቀሙ ደብዳቤዎችን ፈልግ...",
      noArchivedLetters: "ምንም የተጠራቀሙ ደብዳቤዎች የሉም",
      restoreButton: "ዳግም አስገባ",
      deleteButton: "ሰርዝ",
      filterOptions: {
        all: "ሁሉም",
        lastWeek: "የቅርብ ሳምንት",
        lastMonth: "የቅርብ ወር",
        lastYear: "የቅርብ ዓመት",
      },
    },
    // Settings translations
    settings: {
      title: "ቅንብሮች",
      profile: {
        title: "መገለጫ",
        name: "ስም",
        email: "ኢሜይል",
        phone: "ስልክ",
        department: "ክፍል",
        saveChanges: "ለውጦችን አስቀምጥ",
        saving: "በመቀመጥ ላይ...",
        errorUpdating: "መገለጫውን ማዘምን አልተሳካም",
        profilePicture: "የመገለጫ ፎቶ",
        profilePictureHint: "ፎቶዎን ለማስቀየም የካሜራ አይኮኑን ይጫኑ",
        newProfilePicture: "አዲስ የመገለጫ ፎቶ",
        upload: "ስቀል",
        uploading: "በመስቀል ላይ...",
        cancel: "ይቅር",
        notSet: "አልተዘጋጀም",
        failedToUploadProfilePicture: "የመገለጫ ፎቶ ማስቀመጥ አልተሳካም",
      },
      notifications: {
        title: "ማሳወቂያዎች",
        emailNotifications: "ኢሜይል ማሳወቂያዎች",
        emailNotificationsDesc: "ኢሜይል በኩል ማሳወቂያዎችን ይቀበሉ",
        notificationSound: "የማሳወቂያ ድምፅ",
        notificationSoundDesc: "ማሳወቂያዎች ሲመጡ ድምፅ ያሰሙ",
      },
      appearance: {
        title: "መልክ",
        theme: "ገጽታ",
        light: "ብርሃን",
        dark: "ጨለማ",
        language: "ቋንቋ",
        english: "እንግሊዝኛ",
        amharic: "አማርኛ",
      },
      security: {
        title: "ደህንነት",
        changePassword: "የይለፍ ቃል ቀይር",
        currentPassword: "አሁን ያለው የይለፍ ቃል",
        newPassword: "አዲስ የይለፍ ቃል",
        confirmPassword: "የይለፍ ቃል ያረጋግጡ",
      },
      password: {
        title: "የይለፍ ቃል ቀይር",
        current: "አሁን ያለው የይለፍ ቃል",
        currentPlaceholder: "አሁኑን የይለፍ ቃል ያስገቡ",
        new: "አዲስ የይለፍ ቃል",
        newPlaceholder: "አዲስ የይለፍ ቃል ያስገቡ",
        confirm: "የይለፍ ቃል ያረጋግጡ",
        confirmPlaceholder: "አዲስ የይለፍ ቃል ያረጋግጡ",
        requirementsTitle: "የይለፍ ቃል መስፈርቶች",
        requirement1: "• ቢያንስ 8 ቁምፊዎች",
        requirement2: "• የፊደልና ቁጥር ቅርጸት ይዟል",
        requirement3: "• ልዩ ባህሪያት ያካትታል",
        changing: "የይለፍ ቃል በመቀየር ላይ...",
        changeButton: "የይለፍ ቃል ቀይር",
        clearButton: "ቅጽ አጽዳ"
      },
    },
    // Dashboard translations
    dashboard: {
      dashboard: "ዳሽቦርድ",
      totalUsers: "ጠቅላላ ተጠቃሚዎች",
      departments: "መደብዎች",
      refreshStats: "ስታቲስቲክስ አድስ",
      refreshing: "በመታደስ ላይ...",
      analyticsWelcome: "ወደ የትንታኔ ዳሽቦርድ እንኳን ደህና መጡ",
      lettersByStatus: "ደብዳቤዎች በሁኔታ",
      lettersByDepartment: "ደብዳቤዎች በመደብ",
      lettersOverTime: "ደብዳቤዎች በጊዜ",
      statusSent: "ተልኳል",
      statusPending: "በመጠባበቅ ላይ",
      statusRejected: "ውድቅ ተደርጓል",
      statusDelivered: "ደረሰ",
      statusRead: "ታይቷል",
      approved: "ጸድቋል",
      draft: "ረቂቅ",
      welcome: "እንኳን ደህና መጡ!",
      welcomeTitle: "ወደ የደብዳቤ የወደፊት ዘመን እንኳን ደህና መጡ!",
      welcomeDescription:
        "This is your command center for managing all official letters. Create, track, and archive with ease, knowing every communication is secure and streamlined. Our team built this with one goal: to make your workflow simpler and more powerful. Let's get started!",
      totalLetters: "ጠቅላላ ደብዳቤዎች",
      processed: "የተሰሩ",
      pending: "በመጠባበቅ ላይ",
      urgent: "አስቸኳይ",
      recentLetters: "የቅርብ ጊዜ ደብዳቤዎች",
      viewAll: "ሁሉንም ይመልከቱ",
      activityTimeline: "የእንቅስቃሴ የጊዜ መስመር",
      letterSent: (subject: string) => `ደብዳቤ "${subject}" ተልኳል!`,
      letterReceived: (subject: string) => `ደብዳቤ "${subject}" ደርሷል!`,
      letterApproved: (subject: string) => `ደብዳቤ "${subject}" ጸድቋል!`,
      recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
      activities: {
        approval: {
          title: "አዲስ ደብዳቤ ጸድቋል",
          description: "የቅርብ ጊዜውን ፖሊሲዎን ያጠናቅቁ",
          time: "ከ 2 ሰዓታት በፊት",
        },
        newPolicy: {
          title: "አዲስ ደብዳቤ ደርሷል",
          description: "አዲስ ደብዳቤዎች በመጠባበቅ ላይ ናቸው",
          time: "ከ 5 ሰዓታት በፊት",
        },
        meeting: {
          title: "ደብዳቤ ተልኳል",
          description: "ለዲፓርትመንትዎ ደብዳቤ ተልኳል",
          time: "ትናንት",
        },
        mention: {
          title: "አዲስ ተጠቃሚ ተመዝግቧል",
          description: "አዲስ ተጠቃሚ ወደ ሲስተሙ ተጨምሯል",
          time: "ከ 2 ቀናት በፊት",
        },
      },
    },
    // User roles translations
    roles: {
      user: "ተጠቃሚ",
      admin: "አስተዳዳሪ",
      label: "የተጠቃሚ ሚና"
    },
    loading: {
      pleaseWait: "እባክዎ ይጠብቁ...",
      letters: "ደብዳቤዎችን በመጫን ላይ..."
    },
    // Memo translations
    memo: {
      date: "ቀን",
      subject: "ርዕስ"
    },
    // Employees translations
    employees: {
      ccLabel: "ተጨማሪ ቅጂ",
      confidential: "ሚስጥራዊ",
      ccDescription: "ወደ ተጨማሪ ቅጂ ለማስገባት ሰራተኞችን ይምረጡ"
    },
    // Letter Management translations
    letterManagement: {
      priorityValues: {
        urgent: "አደገኛ",
        high: "ከፍተኛ",
        normal: "መደበኛ"
      }
    },
  },
  en: {
    // Home Page translations
    home: {
      title: "Letter Management System",
      subtitle: "Space Science and Geospatial Institute (SSGI)",
      description: "A centralized platform designed for SSGI to manage, track, and organize official correspondence with precision, security, and efficiency.",
      login: "Login",
      featuresHeading: "Features",
      featuresSub: "Everything you need to manage your letters effectively",
      ctaTitle: "Ready to Transform Your Communication?",
      ctaSubtitle: "Join SSGI's digital transformation today",
      seeHowItWorksNav: "See How It Works",
      servicesHeading: "Services",
      systemDemo: "System Demo",
      seeHowItWorks: "See How It Works",
      videoDescription: "Watch our system in action and discover the benefits it brings to your organization",
      browserNotSupported: "Your browser does not support the video tag.",
      minutes: "min",
      hdQuality: "HD Quality",
      systemBenefits: "System Benefits",
      fastEfficient: "Fast & Efficient",
      fastEfficientDesc: "Manage and submit letters with lightning speed and efficiency",
      secureReliable: "Secure & Reliable",
      secureReliableDesc: "Your letters are stored securely and protected at all times",
      betterTracking: "Better Tracking",
      betterTrackingDesc: "Track the status of your letters in real-time",
      enhancedCollaboration: "Enhanced Collaboration",
      enhancedCollaborationDesc: "Collaborate seamlessly with team members",
      getStartedNow: "Get Started Now",
      professionalServices: "Our Professional Services",
      servicesDescription: "Specialized solutions for SSGI's communication needs",
      switchToEnglish: "Switch to English",
      switchToAmharic: "ወደ አማርኛ ቀይር",
      applyForm: "Apply Form",
    },
    // Features translations
    features: [
      {
        name: "Smart Document Management",
        description:
          "Efficiently organize and manage all your business correspondence in one place.",
      },
      {
        name: "Real-time Tracking",
        description:
          "Track the status of your letters and documents in real-time.",
      },
      {
        name: "Advanced Security",
        description:
          "Enterprise-grade security to keep your sensitive documents safe.",
      },
      {
        name: "Powerful Search",
        description:
          "Find any document instantly with our advanced search capabilities.",
      },
      {
        name: "Automated Workflows",
        description:
          "Streamline your approval processes with automated workflows.",
      },
      {
        name: "Analytics & Insights",
        description: "Gain valuable insights into your document workflows.",
      },
    ],
    // Services translations
    services: [
      {
        name: "Letter Processing",
        description:
          "Efficient handling of incoming and outgoing official correspondence.",
      },
      {
        name: "Document Archiving",
        description:
          "Secure long-term storage and retrieval of institutional documents.",
      },
      {
        name: "Approval Workflows",
        description: "Streamlined routing for authorization and signatures.",
      },
    ],
    // Header translations
    header: {
      profile: "Profile",
      settings: "Settings",
      signOut: "Sign out",
    },
    // Sidebar translations
    sidebar: {
      dashboard: "Dashboard",
      newLetter: "New Letter",
      inbox: "Inbox",
      sent: "Sent",
      archive: "Archive",
      notifications: "Notifications",
      users: "Users",
      settings: "Settings",
      adminPanel: "Admin Panel",
      letterFlow: "LetterFlow"
    },
    // Login translations
    login: {
      title: "Log In to Your Account",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      emailPlaceholder: "john@example.com",
      passwordPlaceholder: "••••••••",
      loginButton: "Log In",
      backToHome: "Back to Home",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      forgotPassword: "Forgot Password?",
      requiredFields: "Both fields are required",
      errorOccurred: "An error occurred",
      modalTitle: "Log In to Your Account",
      invalidCredentials: "Invalid email or password"
    },
    // Signup translations
    signup: {
      title: "Create Your Account",
      subtitle: "Welcome! Fill in your details to join the platform.",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "John Doe",
      emailLabel: "Email Address",
      emailPlaceholder: "john@example.com",
      phoneNumberLabel: "Phone Number",
      phoneNumberPlaceholder: "+1234567890",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      passwordPlaceholder: "••••••••",
      termsAgreement: "I agree to the",
      termsAndConditions: "Terms and Conditions",
      signUpButton: "Sign Up",
      backToAdmin: "Back to Admin Page",
      fillAllFields: "Please fill in all fields.",
      passwordsMismatch: "Passwords do not match.",
      registrationSuccessful: "Registration successful!",
      registrationFailed: "Registration failed:",
    },
    // Department Selector translations
    departmentSelector: {
      mainCategory: "Main Category",
      selectMainCategory: "-- Select Main Category --",
      subCategory: "Sub-category",
      selectSubCategory: "-- Select Sub-category --",
      subSubCategory: "Sub-sub-category",
      selectSubSubCategory: "-- Select Sub-sub-category --",
      selectedCategory: "Selected Category",
      departments: [
        {
          id: "director_general",
          label: "Director General",
          subDepartments: [
            {
              id: "head_of_office",
              label: "Head of Office",
              subDepartments: [
                { id: "public_relations_executive", label: "Public Relations Executive" },
                { id: "legal_services_executive", label: "Legal Services Executive" },
                { id: "audit_executive", label: "Audit Executive" },
                { id: "ethics_anti_corruption_executive", label: "Ethics and Anti-Corruption Executive" },
                { id: "women_social_inclusion_executive", label: "Women and Social Inclusion Implementation Executive" },
              ],
            },
            {
              id: "ceo_operations_management",
              label: "Chief Executive Officer of Operations Management",
              subDepartments: [
                { id: "strategic_affairs_executive", label: "Strategic Affairs Executive" },
                { id: "ict_executive", label: "Information Communication Technology Executive" },
                { id: "procurement_finance_executive", label: "Procurement and Finance Executive" },
                { id: "hr_management_executive", label: "Competence and Human Resource Management Executive" },
                { id: "institutional_transformation_executive", label: "Institutional Transformation Executive" },
              ],
            },
            {
              id: "space_sector",
              label: "Space Sector",
              subDepartments: [
                { id: "astronomy_astrophysics_lead_executive", label: "Astronomy and Astrophysics Lead Executive" },
                { id: "space_planetary_science_lead_executive", label: "Space and Planetary Science Lead Executive" },
                { id: "remote_sensing_lead_executive", label: "Remote Sensing Lead Executive" },
                { id: "geodesy_geodynamics_lead_executive", label: "Geodesy and Geodynamics Lead Executive" },
                { id: "aerospace_engineering_lead_executive", label: "Aerospace Engineering Lead Executive" },
                { id: "satellite_operation_lead_executive", label: "Satellite Operation Lead Executive" },
                { id: "postgraduate_registrar_research_admin_lead_executive", label: "Postgraduate; Registrar and Research Administration Lead Executive" },
              ],
            },
            {
              id: "geospatial_sector",
              label: "Geospatial Sector",
              subDepartments: [
                { id: "aerial_survey_lead_executive", label: "Aerial Survey Lead Executive" },
                { id: "photogrammetry_lidar_lead_executive", label: "Photogrammetry and LiDAR Data Processing Lead Executive" },
                { id: "cartography_lead_executive", label: "Cartography Lead Executive" },
                { id: "geodetic_infrastructure_services_lead_executive", label: "Geodetic Infrastructure and Services Lead Executive" },
                { id: "digital_image_processing_lead_executive", label: "Digital Image Processing Lead Executive" },
                { id: "spatial_planning_decision_support_lead_executive", label: "Spatial Planning and Decision Support Lead Executive" },
              ],
            },
            {
              id: "space_geospatial_enabling_sector",
              label: "Space and Geospatial Enabling Sector",
              subDepartments: [
                { id: "space_geospatial_info_standardization_lead_executive", label: "Space and Geospatial Information Standardization Lead Executive" },
                { id: "platform_application_development_lead_executive", label: "Platform and Application Development Lead Executive" },
                { id: "data_system_admin_lead_executive", label: "Data and System Administration Lead Executive" },
                { id: "technology_transfer_lead_executive", label: "Technology Transfer Lead Executive" },
                { id: "space_science_geospatial_connectivity_lead_executive", label: "Space Science and Geospatial Regional Connectivity Lead Executive" },
                { id: "policy_legal_framework_lead_executive", label: "Policy and Legal Framework Lead Executive" },
              ],
            },
          ],
        },
      ],
    },
    notifications: {
      title: "Notifications",
      markAllAsRead: "Mark all as read",
      noNotifications: "No notifications",
      allCaughtUp:
        "You're all caught up! We'll notify you when something new arrives.",
      relatedTo: "Related to:",
      markAsRead: "Mark as read",
      deleteNotification: "Delete notification",
      loading: "Loading...",
      errorFetchingNotifications: "Error fetching notifications:",
      errorMarkingRead: "Error marking notification as read:",
      errorMarkingAllRead: "Error marking all notifications as read:",
      errorDeletingNotification: "Error deleting notification:",
      priorityHigh: "high",
      priorityMedium: "medium",
      priorityLow: "low",
      letterRead: "Letter Read",
      letterReadDesc: (name: string, subject: string) =>
        `${name} has read your letter "${subject}"`,
      regarding: "regarding",
      minutesAgo: "minutes ago",
    },
    users: {
      title: "Users",
      manageUsers: "Manage system users and permissions",
      searchPlaceholder: "Search users...",
      noUsersFound: "No users found",
    },
    // Inbox translations
    inbox: {
      title: "Inbox",
      searchPlaceholder: "Search in inbox...",
      filterButton: "Filter",
      filterOptions: {
        all: "All",
        unread: "Unread",
        starred: "Starred",
        urgent: "Urgent",
        seen: "Seen",
        rejected: "Rejected"
      },
      noLetters: "Your inbox is empty.",
      from: "From",
      subject: "Subject",
      date: "Date",
      viewButton: "View Letter"
    },
    // Sent translations
    sent: {
      title: "Sent",
      newLetterButton: "New Letter",
      searchPlaceholder: "Search letters...",
      allStatus: "All Status",
      statusSent: "Sent",
      statusDelivered: "Delivered",
      statusRead: "Read",
      statusPending: "Pending",
      statusRejected: "Rejected",
      priorityNormal: "Normal",
      priorityHigh: "High",
      priorityUrgent: "Urgent",
      subjectColumn: "Subject",
      toColumn: "To",
      departmentColumn: "Department",
      dateColumn: "Date",
      statusColumn: "Status",
      priorityColumn: "Priority",
      attachmentsColumn: "Attachments",
      memoViewColumn: "Memo View",
      noAttachments: "No attachments",
      viewMemoButton: "View Memo",
      composeNewLetter: "Compose New Letter",
      subjectLabel: "Subject",
      subjectRequired: "Subject is required",
      recipientLabel: "Recipient",
      recipientRequired: "Recipient is required",
      departmentLabel: "Department",
      departmentRequired: "Department is required",
      contentLabel: "Content",
      contentRequired: "Content is required",
      attachmentLabel: "Attachment",
      removeAttachment: "Remove Attachment",
      sendLetterButton: "Send Letter",
      filePreview: "File Preview",
      closeButton: "Close",
      downloadButton: "Download",
      previewNotAvailable: "Preview not available",
      downloadToView: "Download to view this file",
      letterSentSuccess: "Letter sent successfully!",
      failedToSendLetter: "Failed to send letter",
      errorDownloadingFile: "Error downloading file",
      errorViewingFile: "Error viewing file",
      memoLetterView: "Memo Letter View",
      manageSent: "Easily track and manage all your sent correspondence",
      printButton: "Print",
    },
    // Archive translations
    archive: {
      title: "Archive",
      manageArchivedLetters: "Manage your archived letters",
      searchPlaceholder: "Search archived letters...",
      noArchivedLetters: "No archived letters found",
      restoreButton: "Restore",
      deleteButton: "Delete",
      filterOptions: {
        all: "All",
        lastWeek: "Last Week",
        lastMonth: "Last Month",
        lastYear: "Last Year",
      },
    },
    // Settings translations
    settings: {
      title: "Settings",
      profile: {
        title: "Profile",
        name: "Name",
        email: "Email",
        phone: "Phone",
        department: "Department",
        saveChanges: "Save Changes",
        saving: "Saving...",
        errorUpdating: "Failed to update profile",
        profilePicture: "Profile Picture",
        profilePictureHint: "Click the camera icon to change your profile picture",
        newProfilePicture: "New Profile Picture",
        upload: "Upload",
        uploading: "Uploading...",
        cancel: "Cancel",
        notSet: "Not set",
        failedToUploadProfilePicture: "Failed to upload profile picture",
      },
      notifications: {
        title: "Notifications",
        emailNotifications: "Email Notifications",
        emailNotificationsDesc: "Receive notifications via email",
        notificationSound: "Notification Sound",
        notificationSoundDesc: "Play sound for notifications",
      },
      appearance: {
        title: "Appearance",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        language: "Language",
        english: "English",
        amharic: "Amharic",
      },
      security: {
        title: "Security",
        changePassword: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmPassword: "Confirm Password",
      },
      password: {
        title: "Change Password",
        current: "Current Password",
        currentPlaceholder: "Enter current password",
        new: "New Password",
        newPlaceholder: "Enter new password",
        confirm: "Confirm New Password",
        confirmPlaceholder: "Confirm new password",
        requirementsTitle: "Password Requirements",
        requirement1: "• At least 8 characters",
        requirement2: "• Mix of letters and numbers",
        requirement3: "• Include special characters",
        changing: "Changing Password...",
        changeButton: "Change Password",
        clearButton: "Clear Form"
      },
    },
    // Dashboard translations
    dashboard: {
      dashboard: "Dashboard",
      totalUsers: "Total Users",
      departments: "Departments",
      refreshStats: "Refresh Stats",
      refreshing: "Refreshing...",
      analyticsWelcome: "Welcome to your analytics dashboard",
      lettersByStatus: "Letters by Status",
      lettersByDepartment: "Letters by Department",
      lettersOverTime: "Letters Over Time",
      statusSent: "Sent",
      statusPending: "Pending",
      statusRejected: "Rejected",
      statusDelivered: "Delivered",
      statusRead: "Read",
      approved: "Approved",
      draft: "Draft",
      welcome: "Welcome!",
      welcomeTitle: "Welcome to the Future of Correspondence!",
      welcomeDescription:
        "This is your command center for managing all official letters. Create, track, and archive with ease, knowing every communication is secure and streamlined. Our team built this with one goal: to make your workflow simpler and more powerful. Let's get started!",
      totalLetters: "Total Letters",
      processed: "Processed",
      pending: "Pending",
      urgent: "Urgent",
      recentLetters: "Recent Letters",
      viewAll: "View All",
      activityTimeline: "Activity Timeline",
      letterSent: (subject: string) => `Letter "${subject}" sent!`,
      letterReceived: (subject: string) => `Letter "${subject}" received!`,
      letterApproved: (subject: string) => `Letter "${subject}" approved!`,
      recentActivity: "Recent Activity",
      activities: {
        approval: {
          title: "New Letter Approved",
          description: "Finalize your latest policy document",
          time: "2 hours ago",
        },
        newPolicy: {
          title: "New Letter Received",
          description: "New letters are pending your review",
          time: "5 hours ago",
        },
        meeting: {
          title: "Letter Sent",
          description: "Letter sent to your department",
          time: "Yesterday",
        },
        mention: {
          title: "New User Registered",
          description: "A new user has been added to the system",
          time: "2 days ago",
        },
      },
    },
    // User roles translations
    roles: {
      user: "User",
      admin: "Admin",
      label: "User Role"
    },
    loading: {
      pleaseWait: "Please wait...",
      letters: "Loading letters..."
    },
    // Memo translations
    memo: {
      date: "Date",
      subject: "Subject"
    },
    // Employees translations
    employees: {
      ccLabel: "CC",
      confidential: "Confidential",
      ccDescription: "Select employees to CC (carbon copy)"
    },
    // Letter Management translations
    letterManagement: {
      priorityValues: {
        urgent: "Urgent",
        high: "High",
        normal: "Normal"
      }
    },
  },
};

// Define the types for the translation object
type TranslationKeys = typeof translations.am;

// Define the types for the language context
type LanguageContextType = {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: TranslationKeys; // Add translation function
};

// Create the context
export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<SupportedLang>(SupportedLang.Am);

  // Load language from localStorage if available
  useEffect(() => {
    const storedLang = localStorage.getItem("appLang") as SupportedLang;
    if (storedLang === SupportedLang.Am || storedLang === SupportedLang.En) {
      setLang(storedLang);
    }
  }, []);

  // Change the language and save it to localStorage
  const changeLang = (newLang: SupportedLang) => {
    localStorage.setItem("appLang", newLang);
    setLang(newLang);
  };

  // Memoize the translation object to avoid re-renders
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { translations };
