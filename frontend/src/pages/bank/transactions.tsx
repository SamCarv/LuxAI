import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Transactions = () => {
    const nav = useNavigate()

    return (
        <div className='flex flex-col w-full h-full px-40 gap-y-3'>
            <button onClick={() => nav('../bank')} className="bg-smoke-50 rounded-full size-10 p-1 border-3 border-black flex items-center justify-center cursor-pointer">
                <ArrowLeft size={32} strokeWidth={2.2} />
            </button>
            <h1 className='heading-md'>Transactions</h1>
            <div id='filter'></div>
            <div>
                <button className='bg-smoke-50 w-20 h-10'>

                </button>
            </div>
            <div className='flex bg-smoke-100 h-20 px-5 justify-between items-center'>
                <div>
                    <input type="text" className='bg-smoke-300/40 ' />
                </div>
                <button onClick={() => nav('../planning')} className='flex gap-4 px-2 py-1 hover:bg-candy-corn-100 hover:border-2 hover:border-candy-corn-400 rounded-sm cursor-pointer'>
                    <p className='flex gap-1'><ArrowDown className='stroke-red-400'/> R$ 1900</p>
                    <p className='flex gap-1'><ArrowUp className='stroke-green-400'/> R$ 3000</p>
                    <p className='flex gap-1'><ArrowUpDown/> R$ 3000</p>
                </button>
            </div>
            <div className='bg-smoke-100 w-full h-full'>
                <div className='flex justify-around'>
                    <p>Descrição</p>
                    <p>Category</p>
                    <p>Wallet</p>
                    <p>Date</p>
                    <p>Amount</p>
                </div>
            </div>
        </div>
    )
}

export default Transactions