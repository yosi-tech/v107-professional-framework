import { useContext } from 'react';
import { LanguageContext } from '@/components/i18n/LanguageContext';
import { translations } from '@/components/i18n/translations';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  const t = (key, replacements = {}) => {
    const keys = key.split('.');
    let text = translations[language];

    for (const k of keys) {
      if (text && typeof text === 'object' && k in text) {
        text = text[k];
      } else {
        // Fallback to Hebrew if English translation is missing for a specific key
        if (language === 'en') {
            let fallbackText = translations['he'];
            for (const fk of keys) {
                if (fallbackText && typeof fallbackText === 'object' && fk in fallbackText) {
                    fallbackText = fallbackText[fk];
                } else {
                    return key; // Return key if not found in hebrew either
                }
            }
            text = fallbackText;
            break;
        }
        return key; // Return the key if translation not found
      }
    }

    if (typeof text === 'string' && Object.keys(replacements).length > 0) {
        Object.entries(replacements).forEach(([keyToReplace, value]) => {
            text = text.replace(new RegExp(`{{${keyToReplace}}}`, 'g'), value);
        });
    }

    return text;
  };

  return { t, language };
};