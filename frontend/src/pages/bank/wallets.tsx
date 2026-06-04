import { ChevronLeft, Plus, Wallet, PiggyBank, CreditCard, Landmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Panel from '../../components/panel'
import PanelLabel from '../../components/panel/panel.label'
import PanelGroup from '../../components/panel/panel.group'
import PanelItem from '../../components/panel/panel.item'
import PanelItemIcon from '../../components/panel/panel.icon'
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from '../../components/panel/panel.info'
import Amount from '../../components/amount'
import { AmountCurrency, AmountValue } from '../../components/amount/price'
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import Button from '../../components/button'
import { useQuery } from '@tanstack/react-query'
import { get_bank_accounts } from '../../services/account'
import type { AccountType } from '../../types/account'

const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case 'SAVINGS': 
      return <PiggyBank size={24} className="text-emerald-500" />;
    case 'CREDIT': 
      return <CreditCard size={24} className="text-amber-500" />;
    case 'CHECKING': 
    default:
      return <Landmark size={24} className="text-blue-500" />;
  }
}

const chartConfig = {
  checking: { label: "Checking", color: "var(--color-checking, #3b82f6)" },
  saving: { label: "Saving", color: "var(--color-saving, #10b981)" },
  credit: { label: "Credit", color: "var(--color-credit, #f59e0b)" },
}

const Wallets = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { error: accountsError, isLoading: accountsLoading, data: accounts = [] } = useQuery({ queryKey: ['accounts'], queryFn: get_bank_accounts})

  const chartData = accounts.map(acc => ({
    name: acc.name,
    value: acc.balance,
    fill: acc.account_type === 'CHECKING' ? '#3b82f6' : acc.account_type === 'SAVINGS' ? '#10b981' : '#f59e0b'
  }));

  return (
    <section className="flex flex-col w-full h-full gap-y-6 px-4 md:px-10 mx-auto max-w-7xl dark:text-slate-100">
      <div className="w-full pt-2">
        <button 
          onClick={() => nav(-1)} 
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-paris-daisy-600 dark:hover:text-paris-daisy-400 transition-colors w-fit cursor-pointer"
        >
          <ChevronLeft size={24} />
          <span className="font-medium">Voltar</span>
        </button>
      </div>

      <div className="flex items-center justify-between w-full">
        <h1 className="heading-lg">{t('bank.wallets')}</h1>
        
        <Button variants='standard' colors='primary' className="flex items-center gap-x-2 px-4 py-2 rounded-xl font-medium text-sm">
          <Plus size={16} />
          {t('wallets.new_account', 'Nova Conta')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-1 flex flex-col gap-y-6">
          <Panel className="flex flex-col justify-between h-full">
            {accounts && (
              <>
                <div>
                  <PanelLabel className="dark:text-zinc-400">Distribuição do Saldo</PanelLabel>
                  <div className="h-56 w-full mt-4 flex items-center justify-center">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-50 w-full">
                      <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          strokeWidth={5}
                          className="stroke-white dark:stroke-zinc-900"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
                  {accounts.map(account => (
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-2 text-zinc-500"><span className="w-3 h-3 rounded-full bg-amber-500" />{account.account_type}</span>
                      <span className="dark:text-zinc-300">R$ {account.balance}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel className="h-full">
            <PanelLabel className="dark:text-zinc-400 mb-4">Suas Carteiras</PanelLabel>
            
            <PanelGroup className="space-y-3">
              {!accountsError && !accountsLoading && !(accounts.length === 0) &&  accounts.map((account) => (
                <PanelItem key={account.id} className="dark:hover:bg-zinc-800/40 rounded-xl transition-colors border border-zinc-100 dark:border-zinc-800/40 p-4 cursor-pointer">
                  <PanelItemIcon className="dark:bg-zinc-800">
                    {getAccountIcon(account.account_type)}
                  </PanelItemIcon>
                  
                  <PanelItemInfo>
                    <PanelItemInfoTitle className="dark:text-zinc-100">{account.name}</PanelItemInfoTitle>
                    <PanelItemInfoDetail className="dark:text-zinc-500 flex gap-x-2 items-center mt-1">
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full uppercase tracking-wider">
                        {account.account_type}
                      </span>
                      <span className="text-xs text-zinc-400">• {account.currency}</span>
                    </PanelItemInfoDetail>
                  </PanelItemInfo>
                  
                  <Amount className='flex-1 py-2.5 justify-end font-semibold text-lg'>
                    <AmountCurrency>{account.currency === 'BRL' ? 'R$' : '$'}</AmountCurrency>
                    <AmountValue>{account.balance}</AmountValue>
                  </Amount>
                </PanelItem>
              ))}
            </PanelGroup>
          </Panel>
        </div>
      </div>
    </section>
  );
};

export default Wallets;