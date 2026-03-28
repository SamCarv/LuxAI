import { ArrowRight, ArrowRightLeft, BanknoteArrowDown, BanknoteArrowUp, Circle, CreditCard, FileInput, FileText, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Panel from '../../components/panel'
import PanelLabel from '../../components/panel/panel.label'
import PanelGroup from '../../components/panel/panel.group'
import PanelItem from '../../components/panel/panel.item'
import PanelItemIcon from '../../components/panel/panel.icon'
import{ PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from '../../components/panel/panel.info'
import Amount from '../../components/amount'
import { AmountCurrency, AmountValue } from '../../components/amount/price'
import { walletItems } from '../../components/panel/constants'
import { groupTransaction } from '../../utils/sort'
import { transactions } from '../../utils/constants.example'
import { dateToHour } from '../../utils/date'

const Bank = () => {
  const { t } = useTranslation()
  const transactionsGrouped = groupTransaction(transactions)
  const chartData = [
    {key: 'SumUp', data: 3700.26},
    {key: 'Master', data: 5500.81},
    {key: 'Nubank', data: 1200.48}
  ]

  return (
    <section className="flex flex-col w-full h-full gap-y-5 px-30 max-w-300">
        <h1 className="heading-lg self-baseline">{t('bank')}</h1>

        <div className="flex w-full h-full space-x-15 max-h-90 ">
          <Panel>
            <PanelLabel>{t('bank.accounts')}</PanelLabel>
            <PanelGroup className='gap-y-1'>
              <p className='body-lg'>Saldo atual</p>
              <Amount>
                <AmountCurrency>R$</AmountCurrency>
                <AmountValue>12000.12</AmountValue>
              </Amount>
            </PanelGroup>
            
          </Panel>
          <Panel>
            <div className='flex w-full justify-between'>
              <PanelLabel className='self-end'>{t('bank.wallets')}</PanelLabel>
              <button className='bg-smoke-50 w-9 h-9 flex justify-center cursor-pointer items-center border-2 border-smoke-300 rounded-lg hover:bg-slate-200'>
                <Plus size={32} strokeWidth={2} absoluteStrokeWidth={false}/>
              </button>
            </div>
            <PanelGroup>
              {walletItems.map(wallet => (
                <PanelItem>
                  <PanelItemIcon>
                    <CreditCard size={32} strokeWidth={2.1} absoluteStrokeWidth={false}/>
                  </PanelItemIcon>
                  <PanelItemInfo>
                    <PanelItemInfoTitle>{wallet.name}</PanelItemInfoTitle>
                    <PanelItemInfoDetail>{t('section.bank.desc', {time: wallet.lastTransaction})}</PanelItemInfoDetail>
                  </PanelItemInfo>
                  <Amount className='flex-1 justify-end mr-2 py-2.5'>
                    <AmountCurrency>{wallet.amountCurrency}</AmountCurrency>
                    <AmountValue>{wallet.amountValue}</AmountValue>
                  </Amount>
                </PanelItem>
              ))}
            </PanelGroup>
          </Panel>
        </div>
        <div className="flex w-full h-full justify-between max-h-100">
          <div className='flex w-full max-w-112.5 justify-between'>
              <div className='flex flex-col items-center min gap-y-2'>
                <button className='bg-smoke-50  rounded-4xl p-4 cursor-pointer hover:bg-slate-300/40 hover:shadow-2xl group shadow-md' >
                  <BanknoteArrowUp size={30} className='group-hover:text-candy-corn-500'/>
                </button>
                <p className='body-md'>Transação</p>
              </div>
              <div className='flex flex-col items-center gap-y-2'>
                <button className='bg-smoke-50  rounded-4xl p-4 cursor-pointer hover:bg-slate-300/40 hover:shadow-2xl group shadow-md' >
                  <ArrowRightLeft size={30} className='group-hover:text-candy-corn-500'/>
                </button>
                <p className='body-md'>Repasse</p>
              </div>
              <div className='flex flex-col items-center gap-y-2'>
                <button className='bg-smoke-50  rounded-4xl p-4 cursor-pointer hover:bg-slate-300/40 hover:shadow-2xl group shadow-md' >
                  <FileInput size={30} className='group-hover:text-candy-corn-500'/>
                </button>
                <p className='body-md'>CSV</p>
              </div>
              <div className='flex flex-col items-center gap-y-2'>
                <button className='bg-smoke-50  rounded-4xl p-4 cursor-pointer hover:bg-slate-300/40 hover:shadow-2xl group shadow-md' >
                  <FileText size={30} className='group-hover:text-candy-corn-500'/>
                </button>
                <p className='body-md'>Extrato</p>
              </div>
              
          </div>
          <Panel className='max-w-96'>
            <div className='flex w-full justify-between'>
              <PanelLabel>{t('bank.transactions')}</PanelLabel>
              <button className='bg-smoke-50 w-9 h-9 flex justify-center cursor-pointer items-center border-2 border-smoke-300 rounded-lg hover:bg-slate-200'>
                <ArrowRight size={30} strokeWidth={2} absoluteStrokeWidth={false}/>
              </button>
            </div>
            {Object.entries(transactionsGrouped).map(([group, items]) => (
              <PanelGroup key={group}>
                <PanelLabel className='pb-2 heading-sm'>{t(group)}</PanelLabel>
                {items.map((item) => (
                  <PanelItem>
                    <PanelItemIcon>
                      {item.type === 'income' && (<BanknoteArrowUp size={32} strokeWidth={1.8} absoluteStrokeWidth={false}/>)
                        || (<BanknoteArrowDown size={32} strokeWidth={1.8} absoluteStrokeWidth={false}/>)   
                      }
                    </PanelItemIcon>
                    <PanelItemInfo>
                      <PanelItemInfoTitle>Nexflix inc.</PanelItemInfoTitle>
                      <PanelItemInfoDetail>{dateToHour(item.date)} - {t(String(item.type))}</PanelItemInfoDetail>
                    </PanelItemInfo>
                    <Amount transactionType={item.type} className='flex-1 justify-end mr-2 py-2.5'>
                      <AmountCurrency>R$</AmountCurrency>
                      <AmountValue>{item.amount}</AmountValue>
                    </Amount>
                  </PanelItem>
                ))}
              </PanelGroup>
            ))}
          </Panel>
        </div>
    </section>
  )
}

export default Bank