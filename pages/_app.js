import Layout from './layout'
import '../styles/globals.css'
import { Josefin_Sans } from 'next/font/google'

const inter = Josefin_Sans({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout >
      <main className={inter.className}>

      <Component {...pageProps} />
      </main>
    </Layout>
  )
}