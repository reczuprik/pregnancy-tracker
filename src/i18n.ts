import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      navigation: {
        measurement: "New Measurement",
        history: "History",
        settings: "Settings"
      },
      
      // Measurement Form
      measurement: {
        title: "Fetal Measurement",
        mode: {
          title: "Measurement Type",
          crl: "Early Pregnancy (CRL)",
          hadlock: "Later Pregnancy (Multiple Parameters)"
        },
        form: {
          date: "Measurement Date",
          crl: "Crown-Rump Length (CRL)",
          bpd: "Biparietal Diameter (BPD)",
          hc: "Head Circumference (HC)",
          ac: "Abdominal Circumference (AC)",
          fl: "Femur Length (FL)",
          save: "Save Measurement",
          clear: "Clear Form"
        },
        units: {
          mm: "mm"
        }
      },
      
      // Results
      results: {
        title: "Measurement Results",
        gestationalAge: "Gestational Age",
        weeks: "weeks",
        days: "days",
        dueDate: "Estimated Due Date",
        sizeComparison: "Your baby is about the size of a {{comparison}}",
        percentile: "{{parameter}}: {{percentile}}th percentile",
        saved: "Measurement saved successfully!",
        error: "Error saving measurement"
      },
      
      // History
      history: {
        title: "Measurement History",
        noData: "No measurements recorded yet",
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
          edit: "Edit",
          delete: "Delete",
          setOfficial: "Set as Official",
          export: "Export Data",
          chart: "Growth Chart"
        },
        confirmDelete: "Are you sure you want to delete this measurement?"
      },
      
      // Visual Features
      visual: {
        actualSize: "See Actual Size",
        howMeasured: "How This is Measured",
        shareImage: "Share Image",
        babyModel: "3D Baby Model",
        holdPhone: "Hold your phone up to your belly to see your baby's actual size!"
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
        unofficial: "Unofficial"
      }
    }
  },
  
  hu: {
    translation: {
      // Navigation
      navigation: {
        measurement: "Új Mérés",
        history: "Napló",
        settings: "Beállítások"
      },
      
      // Measurement Form
      measurement: {
        title: "Magzati Mérés",
        mode: {
          title: "Mérés Típusa",
          crl: "Korai Terhesség (CRL)",
          hadlock: "Későbbi Terhesség (Összetett Paraméterek)"
        },
        form: {
          date: "Mérés Dátuma",
          crl: "Ülő-fejtetői Hossz (CRL)",
          bpd: "Kétoldali Fejátmérő (BPD)",
          hc: "Fejkörfogat (HC)",
          ac: "Haskörfogat (AC)",
          fl: "Combcsont Hossz (FL)",
          save: "Mérés Mentése",
          clear: "Űrlap Törlése"
        },
        units: {
          mm: "mm"
        }
      },
      
      // Results
      results: {
        title: "Mérési Eredmények",
        gestationalAge: "Terhességi Kor",
        weeks: "hét",
        days: "nap",
        dueDate: "Becsült Szülési Dátum",
        sizeComparison: "A babád körülbelül egy {{comparison}} méretű",
        percentile: "{{parameter}}: {{percentile}}. percentilis",
        saved: "Mérés sikeresen elmentve!",
        error: "Hiba a mentés során"
      },
      
      // History
      history: {
        title: "Mérési Napló",
        noData: "Még nincsenek rögzített mérések",
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
          edit: "Szerkesztés",
          delete: "Törlés",
          setOfficial: "Hivatalos Mérésnek",
          export: "Adatok Exportálása",
          chart: "Növekedési Diagram"
        },
        confirmDelete: "Biztosan törli ezt a mérést?"
      },
      
      // Visual Features
      visual: {
        actualSize: "Valódi Méret Megjelenítése",
        howMeasured: "Hogyan Történik a Mérés",
        shareImage: "Kép Megosztása",
        babyModel: "3D Baba Modell",
        holdPhone: "Tartsa a telefont a hasához, hogy lássa a baba valódi méretét!"
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
        unofficial: "Nem hivatalos"
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