import { useTranslation } from "react-i18next"
import PanelItem from "../../components/panel/panel.item"
import PanelItemIcon from "../../components/panel/panel.icon"
import { Home, Plus, X } from "lucide-react"
import PanelGroup from "../../components/panel/panel.group"
import { categories } from "../../utils/constants.planning"
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from "../../components/panel/panel.info"
import { useState } from "react"
import CreateCategoryModal from "./create-category-modal"
const Planning = () => {
  const { t } = useTranslation()
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false)

  return (
    <section className="flex flex-col w-full h-full gap-y-5 max-w-300">
      <h1 className="heading-lg self-baseline">{t('planning')}</h1>
      <div className="bg-smoke-100 w-full h-80"></div>
      <div className="flex justify-center">
        <PanelGroup className="flex-row flex-wrap gap-10 max-w-286">
          {categories.map((category) => (
            <PanelItem key={category.id} className="w-64">
              <PanelItemIcon style={{ backgroundColor: `#${category.color}`}} className="group-hover:brightness-110 transition">
                <Home />
              </PanelItemIcon>
              <PanelItemInfo className="flex-1">
                <PanelItemInfoTitle>{category.name}</PanelItemInfoTitle>
                <PanelItemInfoDetail>Custos - 1900</PanelItemInfoDetail>
              </PanelItemInfo>
              <button className="flex flex-none items-baseline">
                <X />
              </button>
            </PanelItem>
          ))}
          <PanelItem className="w-64 h-16 bg-slate-300 p-0">
            <button onClick={() => setCategoryModalOpen(true)} className="flex flex-1 items-center justify-center cursor-pointer">
              <Plus size={32}/>
            </button>
          </PanelItem>
        </PanelGroup>
      </div>
      {isCategoryModalOpen && (<CreateCategoryModal onClose={() => setCategoryModalOpen(false)}/>)}
    </section>
  )
}

export default Planning