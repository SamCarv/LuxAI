import { NavLink, useParams } from "react-router-dom"
import { categories } from "../../utils/constants.planning"
import { ArrowLeft, Filter, Folder, FolderPlus, Search, Trash } from "lucide-react"
import PanelItem from "../../components/panel/panel.item"

const CategoryDetails = () => {
    const { id } = useParams()
    console.log(id)

    const category = categories.find(c => c.id === Number(id))

    return (
        <div className="flex flex-col w-full h-full gap-1 max-w-300 gap-y-4">
            <h1 className="text-center">Mês Atual - April/2026</h1>
            <NavLink to={'/planning'}> 
                <button  className="bg-smoke-50 rounded-full size-10 p-1 border-3 border-black flex items-center justify-center cursor-pointer">
                    <ArrowLeft size={32} strokeWidth={2.2} />
                </button>
            </NavLink>
            <div className="flex justify-between w-full gap-x-20">
                <div className="flex flex-col w-full gap-4">
                    <div className="flex justify-between">
                        <h1 className="heading-sm">Categoria - {category?.name}</h1>
                        <p className="heading-sm">Total - R$ 1900</p>
                    </div>
                    <div className="bg-smoke-100 w-full h-35">
                        <p>Descricao</p>
                    </div>
                    <div className="flex gap-x-4">
                        <button>
                            <Filter />
                        </button>
                        <div className="bg-smoke-100 flex-1 w-full">Search</div>
                        <button>
                            <Search />
                        </button>
                    </div>
                </div>
                <div id='chart' className="flex bg-smoke-100 w-full">

                </div>
            </div>
            <div className="flex w-full h-full justify-between gap-x-20">
                <div className="flex w-full h-full bg-smoke-100 rounded-2xl p-4 gap-4">
                    <div className="flex w-full flex-col">
                        <div className="flex w-full justify-between">
                            <PanelItem className="p-1.5">
                                <FolderPlus />
                            </PanelItem>
                            <PanelItem className="p-1.5 bg-red-300 hover:bg-red-400">
                                <Trash />
                            </PanelItem>
                        </div>
                        <div className="flex flex-col">

                        </div>
                    </div>
                    <div className="flex w-full flex-col">
                        <div className="flex w-full justify-between">
                            <PanelItem className="p-1.5">
                                <FolderPlus />
                            </PanelItem>
                            <PanelItem className="p-1.5 bg-red-300 hover:bg-red-400">
                                <Trash />
                            </PanelItem>
                        </div>
                    </div>
                </div>
                <div className="flex w-full h-full bg-smoke-100 ">
                    something
                </div>
            </div>
        </div>
    )
}

export default CategoryDetails