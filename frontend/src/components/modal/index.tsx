import type { FC } from 'react'
import ReactDom from 'react-dom'
import { cn } from '../../lib/utils'


interface ModalProps extends React.HTMLAttributes<HTMLFormElement> {
}

const Modal: FC<ModalProps> = ({children, className, ...props}) => {
  const modalRoot = document.getElementById('modal')

  if (!modalRoot) return null

  return ReactDom.createPortal(
    <div className='fixed z-10 top-0 left-0 bg-black/45 w-screen h-screen'>
      <form className={cn('bg-smoke-100 dark:bg-zinc-900 w-[90%] h-auto max-h-[90vh] px-6 py-8 rounded-3xl drop-shadow-2xl shadow-2xl','md:fixed md:w-230 md:h-205 md:top-1/2 md:left-1/2 md:px-20 md:py-12 md:transform md:-translate-x-1/2 md:-translate-y-1/2', className)} {...props}>
        {children}
      </form>
    </div>,
    modalRoot
  )
}

export default Modal