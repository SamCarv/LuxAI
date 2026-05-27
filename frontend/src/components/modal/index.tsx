import type { FC, HTMLAttributes } from 'react'
import ReactDom from 'react-dom'
import { cn } from '../../lib/utils'


interface ModalProps extends HTMLAttributes<HTMLDivElement> {
}

const Modal: FC<ModalProps> = ({children, className, ...props}) => {
  const modalRoot = document.getElementById('modal')

  if (!modalRoot) return null

  return ReactDom.createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto'>
      <div className={cn('bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 lg:p-12 shadow-xl animate-in fade-in zoom-in-95 my-auto', className)} {...props}>
        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default Modal