import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, hu, de, fr } from 'date-fns/locale';
import i18n from '../i18n';
import type { AppLanguage } from '../i18n';

const locales: Record<AppLanguage, Locale> = {
  en: enUS,
  hu: hu,
  de: de,
  fr: fr,
};

export function formatDate(date: Date | string | number, pattern = 'yyyy. MMMM dd.'): string {
  const lang = i18n.language as AppLanguage; // cast to our safe type
  const currentLocale = locales[lang] || enUS;
  return format(new Date(date), pattern, { locale: currentLocale });
}
