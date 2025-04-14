import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'

import { enUS as coreenUS, esES as coresES } from '@mui/material/locale'
import { enUS, esES } from '@mui/x-date-pickers/locales'
import { enUS as dataGridenUS, esES as dataGridesEs } from '@mui/x-data-grid/locales'
import { disableDevTools } from ':disable-react-devtools'
import * as helper from '@/common/helper'
import * as UserService from '@/services/UserService'
import { strings as commonStrings } from '@/lang/common'
import env from '@/config/env.config'
import App from '@/App'

import '@/assets/css/common.css'
import '@/assets/css/index.css'

if (import.meta.env.VITE_NODE_ENV === 'production') {
  disableDevTools()
}

let language = env.DEFAULT_LANGUAGE
const user = JSON.parse(localStorage.getItem('bc-be-user') ?? 'null')
let lang = UserService.getQueryLanguage()

if (lang) {
  if (!env.LANGUAGES.includes(lang)) {
    lang = localStorage.getItem('bc-be-language')

    if (lang && !env.LANGUAGES.includes(lang)) {
      lang = env.DEFAULT_LANGUAGE
    }
  }

  try {
    if (user) {
      language = user.language
      if (lang && lang.length === 2 && user.language !== lang) {
        const data = {
          id: user.id,
          language: lang,
        }

        const status = await UserService.validateAccessToken()

        if (status === 200) {
          const _status = await UserService.updateLanguage(data)
          if (_status !== 200) {
            helper.error(null, commonStrings.CHANGE_LANGUAGE_ERROR)
          }
        }

        language = lang
      }
    } else if (lang) {
      language = lang
    }
    UserService.setLanguage(language)
    commonStrings.setLanguage(language)
  } catch (err) {
    helper.error(err, commonStrings.CHANGE_LANGUAGE_ERROR)
  }
}

language = UserService.getLanguage()
const isEn = language === 'en'
const isEs = language === 'es'

const theme = createTheme(
  {
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#fafafa',
          },
        },
      },
    },
  },
  isEn ? enUS : isEs ? esES : enUS,
  isEn ? dataGridenUS : isEs ? dataGridesEs : dataGridenUS,
  isEn ? coreenUS : isEs ? coresES : coreenUS,
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
      />
    </CssBaseline>
  </ThemeProvider>,
)
