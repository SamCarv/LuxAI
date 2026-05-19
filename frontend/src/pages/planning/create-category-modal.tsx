import { Home, Plus, X } from 'lucide-react'
import Modal from '../../components/modal'
import PanelItem from '../../components/panel/panel.item'
import PanelItemIcon from '../../components/panel/panel.icon'
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from '../../components/panel/panel.info'
import { useState, type FC } from 'react'
import { preColorsSelection, preIconsSelection } from '../../utils/constants.planning'
import { shuffleColor } from './functions/random-color'
import { DynamicIcon, type IconName } from './dynamic-icon'
import { createCategory } from './functions/create-category'
import Button from '../../components/button'
import Input from '../../components/input'

interface CreateCategoryModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void
}

const CreateCategoryModal: FC<CreateCategoryModalProps> = ({onClose}) => {
  const [color, setColor] = useState('ebebeb')
  const [iconName, setIconName] = useState('')
  const [categoryName, setCategoryName] = useState('Moradia')

  return (
    <Modal onSubmit={createCategory}>
      <button onClick={() => onClose()} className='cursor-pointer flex justify-self-end dark:text-zinc-400'>
        <X size={32}/>
      </button>
      
      <div className='mb-6 md:mb-0'>
        <h1 className='heading-lg dark:text-white'>Edição de Categoria</h1>
        <div className='w-40 md:w-56 h-3 bg-candy-corn-400'></div>
      </div>

      <div className='flex flex-col md:flex-row pt-6 md:pt-10 justify-between gap-8 md:gap-0'>
        <div className='flex flex-col gap-4 md:gap-0'>
          <div className='flex flex-col gap-1 w-full md:w-90'>
            <label htmlFor="name" className='heading-sm dark:text-zinc-300'>Nome</label>
            <Input type="text" id='name' name='name' value={categoryName} onChange={(event) => setCategoryName(event.target.value)} className='bg-smoke-50 dark:bg-zinc-800 dark:text-white rounded-md h-8 px-2 outline-none' />
            <p className='text-end body-sm text-smoke-500 dark:text-zinc-500 font-light'>Caracteres {categoryName.length}/25</p>
          </div>
          <div className='flex flex-col gap-1 w-full md:w-90 md:mt-4'>
            <label htmlFor="description" className='heading-sm dark:text-zinc-300'>Descrição</label>
            <textarea id='description' name='description' className='bg-smoke-50 dark:bg-zinc-800 dark:text-white rounded-md h-16 px-2 py-1 outline-none focus:ring-1 focus:ring-candy-corn-400 resize-none' />
            <p className='text-end body-sm text-smoke-500 dark:text-zinc-500 font-light'>Caracteres 0/250</p>
          </div>
        </div>

        <div className='w-full md:w-81 bg-smoke-200 dark:bg-zinc-800/50 p-4 rounded-3xl border dark:border-zinc-700 shadow-inner'>
          <p className='heading-sm dark:text-zinc-300'>Visualização</p>
          <PanelItem className='mt-6 md:mt-10 h-16 bg-white dark:bg-zinc-800'>
            <PanelItemIcon style={{ backgroundColor: `#${color}` }} className='group-hover:brightness-110 transition size-auto'>
              {iconName ? (
                <DynamicIcon name={iconName as IconName}/>
              ) : (
                <Home size={30} strokeWidth={2.2} absoluteStrokeWidth />
              )}
            </PanelItemIcon>
            <PanelItemInfo className='flex-1'>
              <PanelItemInfoTitle className="dark:text-white">{categoryName}</PanelItemInfoTitle>
              <PanelItemInfoDetail className="dark:text-zinc-400">Custos - R$ 0</PanelItemInfoDetail>
            </PanelItemInfo>
            <X className="dark:text-zinc-500" size={20} />
          </PanelItem>
        </div>
      </div>

      <div className='flex flex-col gap-y-1 mt-8 md:mt-4'>
        <p className='heading-sm dark:text-zinc-300'>Cor do Card</p>
        <div className='flex w-full md:w-min h-auto md:h-22 flex-row md:flex-col flex-wrap gap-2'>
          <button type='button' onClick={() => setColor(shuffleColor(color, preColorsSelection))} className='rounded-full border-4 size-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'>
            <div className="rounded-full size-6" style={{ background: `radial-gradient(circle, white 0%, transparent 40%), conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`}}/>
          </button>
          {preColorsSelection.map(c => (
          <button type='button' key={c} onClick={() => setColor(c)} className={`rounded-full border-4 size-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 group transition-all
            ${color === c ? 'border-candy-corn-400' : 'border-slate-200 dark:border-zinc-700'}
          `}>
            <div style={{ backgroundColor: `#${c}` }} className={`rounded-full size-6 group-hover:brightness-90 transition`}></div>
          </button>
          ))}
        </div>
      </div>

      <div className='flex flex-col md:flex-row h-auto md:h-60 gap-8 md:gap-x-9 mt-6'>
        <div className='flex flex-col w-full gap-y-2 md:max-w-114'>
          <div className='flex justify-between items-center'>
            <p className='heading-sm dark:text-zinc-300'>Ícones</p>
            <button type='button' className='bg-smoke-50 dark:bg-zinc-800 size-8 flex justify-center cursor-pointer items-center border-2 border-smoke-300 dark:border-zinc-700 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700'>
              <Plus size={24} strokeWidth={2} className="dark:text-white"/>
            </button>
          </div>
          <div className='bg-smoke-200 dark:bg-zinc-800/50 flex flex-wrap w-full h-48 md:h-full p-2 gap-2 overflow-auto scrollbar rounded-md border dark:border-zinc-700'>
            {preIconsSelection.map((icon) => (
              <button key={icon} type='button' onClick={() => {setIconName(icon)}} className={`
                size-10 bg-white dark:bg-zinc-800 flex items-center justify-center rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 border-4 transition-all group
                ${iconName === icon ? 'border-candy-corn-400' : 'border-transparent dark:border-zinc-700'}
              `}>
                <DynamicIcon name={icon} className='group-hover:stroke-candy-corn-500/80 dark:text-white'/>
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-row md:items-end gap-x-3 mt-auto pb-4 md:pb-0'>
          <Button variants='standard' colors='secondary' className='flex-1 md:w-32 md:h-15 h-12 shadow-2xl heading-md' type='button' onClick={() => onClose()}>Cancelar</Button>
          <Button variants='standard' colors='primary' className='flex-1 md:w-32 md:h-15 h-12 shadow-2xl heading-md' type='submit'>Salvar</Button>
        </div>
      </div>

      <input type="hidden" name="icon" value={iconName} />
      <input type="hidden" name="color" value={color} />
    </Modal>
  )
}

export default CreateCategoryModal