import { extendTheme } from '@chakra-ui/react'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/700.css'

const theme = extendTheme({
  colors: {
    brand: {
      100: '#ff3c00'
    }
  },
  fonts: {
    body: `'Open Sans', sans-serif`
  },
  styles: {
    global: () => {
      body: {
        bg: 'grey.200'
      }
    }
  }
})

export default theme
