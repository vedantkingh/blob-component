import Cursor from './components/Cursor'
import styles from './page.module.css'
import common from '@/app/styles/common.module.css'


export default function Home() {

  return (
    <>
      <Cursor/>
      <div className={common.play_button}></div>
    </>
  )
}
