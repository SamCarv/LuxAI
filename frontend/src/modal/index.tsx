import type { FC } from 'react'
import ReactDom from 'react-dom'
import { cn } from '../lib/utils'


interface ModalProps extends React.HTMLAttributes<HTMLFormElement> {
}

const Modal: FC<ModalProps> = ({children, ...props}) => {
  const modalRoot = document.getElementById('modal')

  if (!modalRoot) return null

  return ReactDom.createPortal(
    <div className='fixed z-10 top-0 left-0 bg-black/45 w-screen h-screen'>
      <form className={cn('bg-smoke-100 fixed w-230 h-205 top-1/2 left-1/2 px-20 py-12 rounded-3xl drop-shadow-2xl shadow-2xl transform -translate-x-1/2 -translate-y-1/2')} {...props}>
        {children}
      </form>
    </div>,
    modalRoot
  )
}

export default Modal