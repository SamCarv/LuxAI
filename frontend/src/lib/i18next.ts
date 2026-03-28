import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from '../locals/en-us.json'
import ptBR from '../locals/pt-br.json'

const languageResoucers = {
    'pt-BR': {
        translation: ptBR
    },
    'en-US': {
        translation: enUS
    },
}

i18next
    .use(initReactI18next)
    .init({
        resources: languageResoucers,
        lng: 'pt-BR',
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        }
    })