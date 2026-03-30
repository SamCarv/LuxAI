import { Home, Plus, X } from 'lucide-react'
import Modal from '../../modal'
import PanelItem from '../../components/panel/panel.item'
import PanelItemIcon from '../../components/panel/panel.icon'
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from '../../components/panel/panel.info'
import { useState, type FC } from 'react'
import { preColorsSelection, preIconsSelection } from '../../utils/constants.planning'
import { shuffleColor } from './functions/random-color'
import { DynamicIcon, type IconName } from './dynamic-icon'
import { createCategory } from './functions/create-category'

interface CreateCategoryModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void
}

const CreateCategoryModal: FC<CreateCategoryModalProps> = ({onClose}) => {
  const [color, setColor] = useState('ebebeb')
  const [iconName, setIconName] = useState('')

  return (
    <Modal onSubmit={createCategory}>
      <button onClick={() => onClose()} className='cursor-pointer flex justify-self-end'>
        <X size={32}/>
      </button>
      <div className=''>
        <h1 className='heading-lg '>Edição de Categoria</h1>
        <div className='w-56 h-3 bg-candy-corn-400'></div>
      </div>
      <div className='flex pt-10 justify-between'>
        <div className='flex flex-col'>
          <div className='flex flex-col gap-1 w-90'>
            <label htmlFor="name" className='heading-sm'>Nome</label>
            <input type="text" id='name' name='name' className='bg-smoke-50 rounded-md h-8' />
            <p className='text-end body-sm text-smoke-500 font-light'>Caracteres 0/25</p>
          </div>
          <div className='flex flex-col gap-1 w-90'>
            <label htmlFor="description" className='heading-sm'>Descrição</label>
            <input type="text" id='description' name='description' className='bg-smoke-50 rounded-md h-16' />
            <p className='text-end body-sm text-smoke-500 font-light'>Caracteres 0/250</p>
          </div>
        </div>
        <div className='w-81 bg-smoke-200 p-4 rounded-3xl'>
          <p className='heading-sm'>Visualização</p>
          <PanelItem className='mt-10 h-16'>
            <PanelItemIcon style={{ backgroundColor: `#${color}` }} className='group-hover:brightness-110 transition'>
              {iconName ? (
                <DynamicIcon name={iconName as IconName} />
              ) : (
                <Home size={30} strokeWidth={2.2} absoluteStrokeWidth />
              )}
            </PanelItemIcon>
            <PanelItemInfo className='flex-1'>
              <PanelItemInfoTitle>Moradia</PanelItemInfoTitle>
              <PanelItemInfoDetail>Custos - R$ 0</PanelItemInfoDetail>
            </PanelItemInfo>
            <X />
          </PanelItem>
        </div>
      </div>
      <div className='flex flex-col gap-y-1'>
        <p className='heading-sm'>Cor do Card</p>
        <div className='flex w-min h-22  flex-col flex-wrap'>
          <button onClick={() => setColor(shuffleColor(color, preColorsSelection))} className={`rounded-full border-4 size-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 border-slate-200`}>
            <div className="rounded-full size-6" style={{ background: `radial-gradient(circle, white 0%, transparent 40%), conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`}}/>
          </button>
          {preColorsSelection.map(c => (
          <button type='button' key={c} onClick={() => setColor(c)} className={`rounded-full border-4 size-10 flex justify-center items-center cursor-pointer hover:bg-slate-200 group
            ${color === c ? 'border-candy-corn-400' : 'border-slate-200'}
          `}>
            <div style={{ backgroundColor: `#${c}` }} className={`rounded-full size-6 group-hover:brightness-90 transition`}></div>
          </button>
          ))}
        </div>
      </div>
      <div className='flex h-60 gap-x-9'>
        <div className='flex flex-col w-full gap-y-2 max-w-114'>
          <div className='flex justify-between'>
            <p className='heading-sm'>Ícones</p>
            <button type='button' className='bg-smoke-50 size-8 flex justify-center cursor-pointer items-center border-2 border-smoke-300 rounded-lg hover:bg-slate-200'>
              <Plus size={32} strokeWidth={2} absoluteStrokeWidth={false}/>
            </button>
          </div>
          <div className='bg-smoke-200 flex flex-wrap w-full h-full p-2 gap-2 overflow-auto scrollbar rounded-md'>
            {preIconsSelection.map((icon) => (
              <button type='button' key={icon} onClick={() => {setIconName(icon)}} className={`
                size-10 bg-smoke-50 flex items-center justify-center rounded-lg cursor-pointer hover:bg-slate-200 border-4 group
                ${iconName === icon && 'border-candy-corn-400'}
              `}>
                <DynamicIcon name={icon}/>
              </button>
            ))}
          </div>
        </div>
        <div className='flex items-end gap-x-3'>
          <button className='w-32 h-15 bg-white rounded-4xl shadow-2xl heading-md cursor-pointer hover:bg-slate-200' onClick={() => onClose()}>Cancelar</button>
          <button className='w-32 h-15 bg-candy-corn-400 rounded-4xl shadow-2xl heading-md cursor-pointer hover:bg-candy-corn-400/60' type='submit'>Salvar</button>
        </div>
      </div>
      <input type="hidden" name="icon" value={iconName} />
      <input type="hidden" name="color" value={color} />
    </Modal>
  )
}

export default CreateCategoryModal