import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      navigation: {
        // ✨ NEW: More personal and descriptive
        dashboard: "Your Journey",
        measurement: "New Measurement",
        history: "Your Log", 
        settings: "Settings",
        
      },
      
      // Measurement Form
      measurement: {
        title: "Add a New Measurement",
        mode: {
          title: "Measurement Type",
          // ✨ NEW: Demystified jargon
            crlDescription: "Use this for first-trimester scans where Crown-Rump Length (CRL) is the primary measurement.",

          crl: "Early Pregnancy (Baby's Length)",
          hadlock: "Later Pregnancy (Multiple Measurements)",
          hadlockDescription: "Use this for second and third-trimester scans, combining multiple measurements for the best estimate."

        },
        form: {
          title: "Measurement Details", 
          date: "Date of Measurement",
          // ✨ NEW: Demystified jargon,
          crl: "Baby's Length (CRL)",
          crlHelp: "The most accurate measurement for dating in early pregnancy (up to 14 weeks).",
          bpd: "Head Measurement (BPD)",
          hc: "Head Circumference (HC)",
          ac: "Tummy Measurement (AC)",
          fl: "Thigh Bone (FL)",
          save: "Save Measurement",
          clear: "Clear Form"
        },

        units: {
          mm: "mm"
        },
        placeholders: {
            crl: "e.g., 12.3",
            bpd: "e.g., 45.1",
            hc: "e.g., 175.0",
            ac: "e.g., 150.5",
            fl: "e.g., 35.2"
        }
      },
      dashboard: {
          welcome: "Welcome! 👶",
          getStarted: "Let's get started with your pregnancy journey",
          addFirstMeasurement: "Add First Measurement",
  
          setOfficialTitle: "Set Your Official Due Date",
          setOfficialText: "You have measurements, but none are official. Go to your log to pin the most accurate scan. This will activate your daily dashboard.",
          goToLog: "Go to Your Log",
          dailyTip: "Daily Tip: Remember to stay hydrated!",
          viewCalendar: "View Full Calendar"
        },
      // Results
      results: {
        gestationalAgeTrue: "Gestational Age (Official)",
        gestationalAgeEstimated: "Age (Estimated from this scan's size)",
        title: "Your Baby's Progress",
        gestationalAge: "Gestational Age",
        weeks: "weeks",
        days: "days",
        dueDate: "Estimated Due Date",
        sizeComparison: "Your baby is about the size of a {{comparison}}",
        percentile: "{{parameter}}: {{percentile}}th percentile",
        daysLeft_unit: "days to go", // Softened language
        saved: "Your measurement has been saved!",
        error: "Couldn't save measurement, please check the values.",
        showDetails: "Show calculation details",
        hideDetails: "Hide calculation details"
      },
      
      // History
      history: {
        title: "Your Measurement Log",
        noData: "Your journey log is empty. Add your first measurement to begin!",
        columns: {
          date: "Date",
          age: "Age",
          crl: "CRL",
          bpd: "BPD", 
          hc: "HC",
          ac: "AC",
          fl: "FL",
          edd: "Due Date"
        },
        actions: {
          delete: "Delete",
          setOfficial: "Pin as Official", // ✨ NEW: Softer, more personal action
          chart: "See Baby's Growth Journey", // ✨ NEW: More celebratory
          hideChart: "Back to Your Log" // ✨ NEW: Softer
        },
        confirmDelete: "Are you sure you want to delete this measurement from your log?",
        officialAgeLabel: "Official Age",
        estimatedAgeLabel: "Estimated Age",
        measurementDataTitle: "Measurement Data",
        growthAnalysisTitle: "Growth Analysis",
        reassuranceText: "Well within the typical range",
        estimatedAgeFromSize: "estimated age (from size)",
        growthRateLabel: "{{parameter}} Growth Rate", // ✨ NEW
      
      },
      
      charts: {
        title: "{{parameter}} Growth Journey",
        yAxisLabel: "Measurement (mm)",
        xAxisLabel: "Gestational Week",
        typicalRange: "The Typical Growth Range", // Replaces the legend
        medianJourney: "Median Journey", // New label for the 50th percentile line
        yourBaby: "Your Baby's Milestones", // More celebratory
        tooltipIntro: "A beautiful milestone:", // ✨ NEW: For custom tooltips
        tooltipGrowth: "growing beautifully within the typical range"
      },
      // Size Comparisons
      sizes: {
        "poppy seed": "poppy seed",
        "sesame seed": "sesame seed",
        "lentil": "lentil",
        "blueberry": "blueberry",
        "kidney bean": "kidney bean",
        "grape": "grape",
        "prune": "prune",
        "fig": "fig",
        "lime": "lime",
        "lemon": "lemon",
        "peach": "peach",
        "apple": "apple",
        "avocado": "avocado",
        "pomegranate": "pomegranate",
        "bell pepper": "bell pepper",
        "mango": "mango",
        "banana": "banana",
        "carrot": "carrot",
        "squash": "squash",
        "eggplant": "eggplant",
        "corn cob": "corn cob",
        "cauliflower": "cauliflower",
        "lettuce": "lettuce",
        "cabbage": "cabbage",
        "large eggplant": "large eggplant",
        "butternut squash": "butternut squash",
        "large cabbage": "large cabbage",
        "coconut": "coconut",
        "head lettuce": "head lettuce",
        "pineapple": "pineapple",
        "cantaloupe": "cantaloupe",
        "honeydew": "honeydew",
        "romaine lettuce": "romaine lettuce",
        "chard": "chard",
        "rhubarb": "rhubarb",
        "small watermelon": "small watermelon",
        "pumpkin": "pumpkin"
      },
      // Common
      common: {
        loading: "Loading...",
        error: "An error occurred",
        success: "Success!",
        cancel: "Cancel",
        confirm: "Confirm",
        close: "Close",
        back: "Back",
        next: "Next",
        official: "Official",
        congratulations: "Welcome, little one!" // ✨ NEW: Warmer message
      }
    }
  },
  
  hu: {
    translation: {
      // Navigation
      navigation: {
        // ✨ NEW: More personal and descriptive
        dashboard: "Utazásod", // "Your Journey"
        measurement: "Új Mérés",
        history: "Naplód", // "Your Log"
        settings: "Beállítások"
      },
      
      // Measurement Form
      measurement: {
        title: "Új Mérés Hozzáadása",
        mode: {
          title: "Mérés Típusa",
          crlDescription: "Használd ezt az első trimeszteri ultrahangokhoz, ahol az ülő-fejtetői hossz (CRL) az elsődleges méret.",

          // ✨ NEW: Demystified jargon
          crl: "Korai Terhesség (Baba Hossza)",
          hadlock: "Későbbi Terhesség (Több Méret)",
          hadlockDescription: "Használd ezt a második és harmadik trimeszteri ultrahangokhoz, ahol több méret kombinációja adja a legpontosabb becslést."
        },
        form: {
          title: "Mérési Részletek",
          date: "Mérés Dátuma",
          // ✨ NEW: Demystified jargon
          crl: "Baba Ülőhossz (CRL)",
          crlHelp: "A legpontosabb mérés a korai terhesség korának meghatározásához (14. hétig).",

          bpd: "Fej Mérete (BPD)",
          hc: "Fejkörfogat (HC)",
          ac: "Haskörfogat (AC)",
          fl: "Combcsont (FL)",
          save: "Mérés Mentése",
          clear: "Űrlap Törlése"
        },
        units: {
          mm: "mm"
        },
        placeholders: {
            crl: "pl. 12,3",
            bpd: "pl. 45,1",
            hc: "pl. 175,0",
            ac: "pl. 150,5",
            fl: "pl. 35,2"
        }
      },
      
      // Results
      results: {
        title: "A Babád Fejlődése",
        gestationalAgeTrue: "Terhességi Kor (Hivatalos)",
        gestationalAgeEstimated: "Kor (Méret alapján becsülve)",
        gestationalAge: "Terhességi Kor",
        weeks: "hét",
        days: "nap",
        dueDate: "Becsült Szülési Dátum",
        sizeComparison: "A babád körülbelül egy {{comparison}} méretű",
        percentile: "{{parameter}}: {{percentile}}. percentilis",
        daysLeft_unit: "nap van hátra",
        saved: "A mérésed elmentve!",
        error: "Mentési hiba, kérlek ellenőrizd az értékeket.",
        showDetails: "Számítási részletek",
        hideDetails: "Részletek elrejtése"
      },
      dashboard: {
        setOfficialTitle: "Állítsd be a Hivatalos Dátumot",
        setOfficialText: "Vannak mentett méréseid, de egyik sincs hivatalosként megjelölve. Lépj a naplódba és rögzítsd a legpontosabb mérést a napi műszerfal aktiválásához.",
        goToLog: "Ugrás a Naplóra",
        dailyTip: "Napi Tipp: Ne felejts el elég folyadékot inni!",
        viewCalendar: "Teljes Naptár Megtekintése"

      },
      // History
      history: {
        title: "Mérési Naplód",
        noData: "A naplód még üres. Add hozzá az első mérésed a kezdéshez!",
        columns: {          
          date: "Dátum",
          age: "Kor",
          crl: "CRL",
          bpd: "BPD",
          hc: "HC",
          ac: "AC",
          fl: "FL",
          edd: "Szülési Dátum"
        },
        actions: {
          delete: "Törlés",
          setOfficial: "Rögzítés Hivatosként", // ✨ NEW: Softer, more personal action
          chart: "Baba Növekedési Útja", // ✨ NEW: More celebratory
          hideChart: "Vissza a Naplóhoz" // ✨ NEW: Softer
        },
        confirmDelete: "Biztosan törlöd ezt a mérést a naplódból?",
        officialAgeLabel: "Hivatalos Kor",
        estimatedAgeLabel: "Becsült Kor",
        measurementDataTitle: "Mérési Adatok",
        growthAnalysisTitle: "Növekedési Elemzés",
        reassuranceText: "Teljesen a tipikus tartományon belül",
        estimatedAgeFromSize: "becsült kor (méret alapján)",
        growthRateLabel: "{{parameter}} Növekedési Ütem", // ✨ NEW

      },
      
      charts: {
        title: "{{parameter}} Növekedési Útja",
        yAxisLabel: "Méret (mm)",
        xAxisLabel: "Terhességi Hét",
        typicalRange: "A Tipikus Növekedési Tartomány",
        medianJourney: "Középső Növekedési Út",
        yourBaby: "A Te Babád Mérföldkövei",
        tooltipIntro: "Egy gyönyörű mérföldkő:", // ✨ NEW
        tooltipGrowth: "szépen növekszik a tipikus tartományon belül." // ✨ NEW
      },
      
      // Size Comparisons
      sizes: {
        "poppy seed": "mákszem",
        "sesame seed": "szezámmag",
        "lentil": "lencse",
        "blueberry": "áfonya",
        "kidney bean": "vörös vesebab",
        "grape": "szőlőszem",
        "prune": "aszalt szilva",
        "fig": "füge",
        "lime": "lime",
        "lemon": "citrom",
        "peach": "őszibarack",
        "apple": "alma",
        "avocado": "avokádó",
        "pomegranate": "gránátalma",
        "bell pepper": "kaliforniai paprika",
        "mango": "mangó",
        "banana": "banán",
        "carrot": "sárgarépa",
        "squash": "spárgatök",
        "eggplant": "padlizsán",
        "corn cob": "kukoricacső",
        "cauliflower": "karfiol",
        "lettuce": "jégsaláta",
        "cabbage": "káposzta",
        "large eggplant": "nagyobb padlizsán",
        "butternut squash": "vajtök",
        "large cabbage": "nagyobb káposzta",
        "coconut": "kókuszdió",
        "head lettuce": "fejessaláta",
        "pineapple": "ananász",
        "cantaloupe": "sárgadinnye",
        "honeydew": "mézdinnye",
        "romaine lettuce": "római saláta",
        "chard": "mángold",
        "rhubarb": "rebarbara szár",
        "small watermelon": "kisebb görögdinnye",
        "pumpkin": "sütőtök"
      },
      
      // Common
      common: {
        loading: "Betöltés...",
        error: "Hiba történt",
        success: "Sikeres!",
        cancel: "Mégse",
        confirm: "Megerősítés",
        close: "Bezárás",
        back: "Vissza",
        next: "Következő",
        official: "Hivatalos",
        unofficial: "Nem hivatalos",
        congratulations: "Isten hozott, kis csoda!" // ✨ NEW: Warmer message

      }
    }
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hu', // Default language (Hungarian)
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

export type AppLanguage = 'en' | 'hu' | 'de' | 'fr';
