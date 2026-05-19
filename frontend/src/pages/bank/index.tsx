import { ArrowRight, BanknoteArrowDown, BanknoteArrowUp, CreditCard, Monitor, Plus } from 'lucide-react'
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
import { transactions } from '../bank/constants'
import { dateToHour } from '../../utils/date'
import { useNavigate } from 'react-router-dom'

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from '../../components/ui/chart'
import Button from '../../components/button'
import { useState } from 'react'
import TransactionModal from './transaction-modal'
import type { Transaction } from '../../types/transaction'
import { categories } from '../../utils/constants.planning'
import { bankOptions } from '../bank/constants'
import ButtonIcon from '../../components/button/icon'
import ButtonLabel from '../../components/button/text'

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    color: "#ECC900",
  },
  mobile: {
    label: "Mobile",
    icon: Monitor,
    color: "#FFDF25",
  },
} satisfies ChartConfig

const Bank = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const transactionsGrouped = groupTransaction(transactions);
  const [isTranscationModalOpen, setIsTransactionOpen] = useState(false);

  return (
    <section className="flex flex-col w-full h-full gap-y-6 px-4 md:px-10 mx-auto max-w-7xl dark:text-slate-100">
      <h1 className="heading-lg mb-2">{t('bank')}</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <Panel>
          <PanelLabel className="dark:text-zinc-400">{t('bank.accounts')}</PanelLabel>
          
          <PanelGroup className='gap-y-1'>
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>Saldo atual</p>
            <Amount>
              <AmountCurrency className="dark:text-white">R$</AmountCurrency>
              <AmountValue className="dark:text-white font-bold">12000.12</AmountValue>
            </Amount>
          </PanelGroup>
          
          <div className="mt-4 h-64 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  className="fill-zinc-500"
                />
                <ChartTooltip content={<ChartTooltipContent className="dark:bg-zinc-950" />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </Panel>

        <Panel>
          <div className='flex w-full justify-between items-center mb-4'>
            <PanelLabel className='dark:text-zinc-400'>{t('bank.wallets')}</PanelLabel>
            <div className='flex gap-2'>
              <button className='bg-zinc-50 dark:bg-zinc-800 w-9 h-9 flex justify-center items-center border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'>
                <Plus size={20} className="dark:text-zinc-300" />
              </button>
              <button type='button' onClick={() => nav('wallets')} className='bg-zinc-50 dark:bg-zinc-800 w-9 h-9 flex justify-center items-center border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'>
                <ArrowRight size={20} className="dark:text-zinc-300" />
              </button>
            </div>
          </div>
          
          <PanelGroup className="space-y-2">
            {walletItems.map((wallet, index) => (
              <PanelItem key={index} className="dark:hover:bg-zinc-800/50 rounded-xl transition-colors">
                <PanelItemIcon className="dark:bg-zinc-800">
                  <CreditCard size={24} className="dark:text-zinc-400"/>
                </PanelItemIcon>
                <PanelItemInfo>
                  <PanelItemInfoTitle className="dark:text-zinc-100">{wallet.name}</PanelItemInfoTitle>
                  <PanelItemInfoDetail className="dark:text-zinc-500">
                    {t('section.bank.desc', {time: wallet.lastTransaction})}
                  </PanelItemInfoDetail>
                </PanelItemInfo>
                <Amount className='flex-1 justify-end dark:text-white'>
                  <AmountCurrency>{wallet.amountCurrency}</AmountCurrency>
                  <AmountValue>{wallet.amountValue}</AmountValue>
                </Amount>
              </PanelItem>
            ))}
          </PanelGroup>
        </Panel>

        <div className='grid grid-cols-2 sm:grid-cols-4 row-start-2 col-start-1 gap-4 w-full'>
            {bankOptions.map(options => (
              <Button variants='ghost' colors='no_color' onClick={() => setIsTransactionOpen(true)}> 
                <ButtonIcon className='p-4'><options.icon size={32}/></ButtonIcon>
                <ButtonLabel>{options.label}</ButtonLabel>
              </Button>  
            ))}
        </div>

        <Panel>
          <div className='flex w-full justify-between items-center mb-4'>
            <PanelLabel className="dark:text-zinc-400">{t('bank.transactions')}</PanelLabel>
            <button onClick={() => nav('transactions')} className='bg-zinc-50 dark:bg-zinc-800 w-9 h-9 flex justify-center items-center border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'>
              <ArrowRight size={20} className="dark:text-zinc-300" />
            </button>
          </div>

          <div className="space-y-6">
            {Object.entries(transactionsGrouped).map(([group, items]) => (
              <PanelGroup key={group} className='space-y-2'>
                <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2'>{t(group)}</h3>
                {items.map((item, idx) => (
                  <PanelItem key={idx} className="group dark:hover:bg-zinc-800/30 rounded-lg">
                    {item.type === 'income' ? (
                      <PanelItemIcon className='bg-emerald-50 dark:bg-emerald-500/10'>
                        <BanknoteArrowUp size={24} className='text-emerald-500'/>
                      </PanelItemIcon>
                    ) : (
                      <PanelItemIcon className='bg-rose-50 dark:bg-rose-500/10'>
                        <BanknoteArrowDown size={24} className='text-rose-500'/> 
                      </PanelItemIcon>
                    )}
                    <PanelItemInfo>
                      <PanelItemInfoTitle className="dark:text-zinc-200">Netflix inc.</PanelItemInfoTitle>
                      <PanelItemInfoDetail className="dark:text-zinc-500">{dateToHour(item.date)} - {t(String(item.type))}</PanelItemInfoDetail>
                    </PanelItemInfo>
                    <Amount transactionType={item.type} className='flex-1 py-2.5 justify-end font-medium'>
                      <AmountCurrency>R$</AmountCurrency>
                      <AmountValue>{item.amount}</AmountValue>
                    </Amount>
                  </PanelItem>
                ))}
              </PanelGroup>
            ))}
          </div>
        </Panel>
      </div>

      {isTranscationModalOpen && <TransactionModal onClose={() => setIsTransactionOpen(false)} onSave={function (transaction: Omit<Transaction, 'id'>): void {
        throw new Error('Function not implemented.')
      } } categories={categories} wallets={walletItems}/>}
    </section>
  )
}

export default Bank