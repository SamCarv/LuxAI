import { Home, Plus, X } from 'lucide-react'
import Modal from '../../../components/modal'
import PanelItem from '../../../components/panel/panel.item'
import PanelItemIcon from '../../../components/panel/panel.icon'
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from '../../../components/panel/panel.info'
import { useState, type FC, type FormEvent } from 'react' 
import { preColorsSelection, preIconsSelection } from '../../../utils/constants.planning'
import { shuffleColor } from '../functions/random-color'
import { DynamicIcon, type IconName } from '../dynamic-icon'
import Button from '../../../components/button'
import Input from '../../../components/input'
import type { CategoryView, CreateCategory, UpdateCategory } from '../../../types/category'

interface CreateCategoryModalProps extends React.HTMLAttributes<HTMLDivElement> {
  createCategory?: (createCategory: CreateCategory) => void,
  updateCategory?: ({id, updateCategory}: {id: string, updateCategory: UpdateCategory}) => void
  category?: CategoryView
  onClose: () => void
}

const CreateCategoryModal: FC<CreateCategoryModalProps> = ({ onClose, createCategory, updateCategory, category}) => {
  const [color, setColor] = useState(category?.color || 'ebebeb');
  const [iconName, setIconName] = useState(category?.icon || '');
  const [categoryName, setCategoryName] = useState(category?.name || 'Moradia');
  const [description, setDescription] = useState(category?.description || '')

  const submit = (event: FormEvent) => {
    event.preventDefault();
    
    if (createCategory) {
      createCategory({
        name: categoryName,
        color: color,
        description: description,
        icon: iconName
      });
    }

    if (updateCategory && category) {
      updateCategory(
        {id: category.id, updateCategory: {
          name: categoryName,
          color: color,
          description: description,
          icon: iconName
        }}
      )
    }

    onClose()
  };

  return (
    <Modal className='lg:max-w-4xl'> 
      <div className='mb-6'>
        <h1 className='heading-lg dark:text-white'>Edição de Categoria</h1>
        <div className='w-40 md:w-56 h-3 bg-candy-corn-400'></div>
      </div>

      <form onSubmit={submit} className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-7 flex flex-col gap-5'>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="name" className='heading-sm dark:text-zinc-300'>Nome</label>
            <Input type="text" id='name' name='name' value={categoryName} onChange={(event) => setCategoryName(event.target.value)}/>
            <p className='text-end body-sm text-smoke-500 dark:text-zinc-500 font-light'>Caracteres {categoryName.length}/25</p>
          </div>

          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="description" className='heading-sm dark:text-zinc-300'>Descrição <span className='text-xs text-gray-500 dark:text-zinc-400'>(Opcional)</span></label>
            <textarea id='description' name='description' value={description} onChange={(event) => setDescription(event.target.value)} className='w-full bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl placeholder:text-zinc-400 dark:text-white outline-none text-sm focus:ring-2 focus:ring-candy-corn-400' />
            <p className='text-end body-sm text-smoke-500 dark:text-zinc-500 font-light'>Caracteres {description.length}/250</p>
          </div>

          <div className='flex flex-col gap-y-1'>
            <p className='heading-sm dark:text-zinc-300'>Cor do Card</p>
            <div className='flex flex-wrap gap-2 w-full'>
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

          <div className='flex flex-col gap-y-2 w-full'>
            <p className='heading-sm dark:text-zinc-300'>Ícones</p>
            <div className='bg-smoke-200 dark:bg-zinc-800/50 flex flex-wrap w-full h-40 p-2 gap-2 overflow-auto scrollbar rounded-md border dark:border-zinc-700'>
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
        </div>

        <div className='lg:col-span-5 flex flex-col justify-between gap-8 lg:border-l lg:pl-8 lg:border-zinc-200 lg:dark:border-zinc-700'>
          <div className='w-full bg-smoke-200 dark:bg-zinc-800/50 p-4 rounded-3xl border dark:border-zinc-700 shadow-inner order-first lg:order-0'>
            <p className='heading-sm dark:text-zinc-300'>Visualização</p>
            <PanelItem className='mt-6 h-16 bg-white dark:bg-zinc-800'>
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

          <div className='flex flex-row items-end gap-x-3 w-full mt-auto'>
            <Button variants='standard' colors='secondary' className='flex-1' type='button' onClick={() => onClose()}>Cancelar</Button>
            <Button variants='standard' colors='primary' className='flex-1' type='submit'>Salvar</Button>
          </div>
        </div>

        <input type="hidden" name="icon" value={iconName} />
        <input type="hidden" name="color" value={color} />
      </form>
    </Modal>
  );
};

export default CreateCategoryModal;