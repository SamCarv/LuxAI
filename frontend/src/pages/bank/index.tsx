import { ArrowRight, BanknoteArrowDown, BanknoteArrowUp, CreditCard, HelpCircle, Loader2} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Panel from '../../components/panel'
import PanelLabel from '../../components/panel/panel.label'
import PanelGroup from '../../components/panel/panel.group'
import PanelItem from '../../components/panel/panel.item'
import PanelItemIcon from '../../components/panel/panel.icon'
import { PanelItemInfo, PanelItemInfoDetail, PanelItemInfoTitle } from '../../components/panel/panel.info'
import Amount from '../../components/amount'
import { AmountCurrency, AmountValue } from '../../components/amount/price'
import { walletItems } from '../../components/panel/constants'
import { groupTransaction } from '../../utils/sort'
import { dateToHour } from '../../utils/date'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/button'
import { useState } from 'react'
import TransactionModal from './transaction-modal'
import type { Transaction, TransactionView } from '../../types/transaction'
import { categories } from '../../utils/constants.planning'
import { bankOptions } from '../bank/constants'
import ButtonIcon from '../../components/button/icon'
import ButtonLabel from '../../components/button/text'
import { TransactionDetailsModal } from '../../components/detail-payment-modal'
import { useQuery } from '@tanstack/react-query'
import { get_bank_accounts } from '../../services/account'
import { list_transactions } from '../../services/transaction'
import InfoBankSectionModal from './info-section-modal'

const Bank = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const {isPending: accountsLoading, error: accountsError, data: accounts} = useQuery({queryKey: ['accounts'], queryFn: get_bank_accounts});
  const {isPending: transactionsLoading, error: transactionsError, data: transactions = []} = useQuery({queryKey:['transactions'], queryFn: list_transactions});
  const [isTranscationModalOpen, setIsTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionView | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  
  const transactionsGrouped = groupTransaction(transactions);
  
  return (
    <section className="p-6 w-full max-w-7xl mx-auto h-full">
      <Button onClick={() => setIsBankModalOpen(true)} variants='ghost' colors='no_color' className="relative group flex flex-row items-center gap-4 mb-8 before:absolute before:bottom-0 before:left-0 before:h-1 before:w-0 before:bg-current hover:before:w-full before:transition-all before:duration-300 before:ease-in-out" title='Saber mais sobre essa seção'>
        <h1 className="heading-lg tracking-tight group-hover:text-gray-500 dark:group-hover:text-gray-300">Banco</h1>
        <HelpCircle className='fill-white group-hover:fill-slate-200 stroke-gray-600 group-hover:gray-400 duration-100 ease-in'/>
      </Button>
      

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <div className='flex-col space-y-6 w-full'>
          <Panel>
            <div className='flex w-full justify-between items-center mb-4'>
              <PanelLabel className='dark:text-zinc-400'>{t('bank.wallets')}</PanelLabel>

              <button type='button' onClick={() => nav('wallets')} className='bg-gray-50 dark:bg-zinc-800 size-9 flex justify-center items-center border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer'>
                <ArrowRight size={20} className="dark:text-zinc-300" />
              </button>
            </div>

            <PanelGroup className="space-y-2">
              {accountsLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                  <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
                  <p className="text-sm">Buscando carteiras...</p>
                </div>
              )}

              {!accountsLoading && accountsError && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-rose-500 font-medium">Não foi possível carregar as carteiras.</p>
                  <p className="text-xs text-zinc-400 mt-1">Tente atualizar a página mais tarde.</p>
                </div>
              )}

              {!accountsLoading && !accountsError && (!accounts || accounts.length === 0) && (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 shadow-sm rounded-2xl text-zinc-400 dark:text-zinc-500 mb-4">
                    <CreditCard className='size-10' strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Nenhuma carteira vinculada</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-xs">
                    Você ainda não possui contas ou carteiras cadastradas. Adicione uma para começar a gerenciar seu saldo.
                  </p>
                  <Button 
                    onClick={() => nav('wallets')}
                    variants="standard"
                    colors="primary"
                    className="text-xs flex items-center gap-2 px-4 py-2"
                  >
                    <span>Criar Carteira</span>
                  </Button>
                </div>
              )}

              {!accountsLoading && !accountsError && accounts && accounts.length > 0 && (
                accounts.map((wallet, index) => (
                  <PanelItem key={index} className="dark:hover:bg-zinc-800/50 rounded-xl transition-colors">
                    <PanelItemIcon className="dark:bg-zinc-800">
                      <CreditCard size={24} className="dark:text-zinc-400" />
                    </PanelItemIcon>
                    <PanelItemInfo>
                      <PanelItemInfoTitle className="dark:text-zinc-100">{wallet.name}</PanelItemInfoTitle>
                      <PanelItemInfoDetail className="dark:text-zinc-500 flex gap-x-2 items-center mt-1">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full uppercase tracking-wider">
                          {wallet.account_type}
                        </span>
                        <span className="text-xs text-zinc-400">• {wallet.currency}</span>
                      </PanelItemInfoDetail>
                    </PanelItemInfo>
                    <Amount className='flex-1 py-2.5 justify-end font-medium'>
                      <AmountCurrency>{wallet.currency === 'BRL' ? 'R$' : '$'}</AmountCurrency>
                      <AmountValue>{wallet.balance}</AmountValue>
                    </Amount>
                  </PanelItem>
                ))
              )}
            </PanelGroup>
          </Panel>
        </div>

        <Panel>
          <div className='flex w-full justify-between items-center mb-4'>
            <PanelLabel className="dark:text-zinc-400">{t('bank.transactions')}</PanelLabel>
            <button onClick={() => nav('transactions')} className='bg-gray-50 dark:bg-zinc-800 size-9 flex justify-center items-center border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer'>
              <ArrowRight size={20} className="dark:text-zinc-300" />
            </button>
          </div>

          <div className="space-y-6">
            {transactionsLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
                <p className="text-sm">Buscando transações...</p>
              </div>
            )}

            {!transactionsLoading && transactionsError && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-rose-500 font-medium">Não foi possível carregar as transações.</p>
                <p className="text-xs text-zinc-400 mt-1">Tente atualizar a página mais tarde.</p>
              </div>
            )}

            {!transactionsLoading && !transactionsError && (!transactionsGrouped || Object.keys(transactionsGrouped).length === 0) && (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 shadow-sm rounded-2xl text-zinc-400 dark:text-zinc-500 mb-4">
                  <BanknoteArrowUp className='size-10' strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Nenhuma transação encontrada</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-xs">
                  Você ainda não possui movimentações registradas nesta conta. Clique abaixo para adicionar a primeira.
                </p>
                <Button 
                  onClick={() => setIsTransactionOpen(true)}
                  variants="standard"
                  colors="primary"
                  className="text-xs flex items-center gap-2 px-4 py-2"
                >
                  <span>Nova Movimentação</span>
                </Button>
              </div>
            )}

            {!transactionsLoading && !transactionsError && transactionsGrouped && (
              Object.entries(transactionsGrouped).map(([group, items]) => (
                <PanelGroup key={group} className='space-y-2'>
                  <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2'>{t(group)}</h3>
                  {items.map((item, idx) => (
                    <PanelItem key={idx} className="group dark:hover:bg-zinc-800/30 rounded-lg">
                      <button className="flex w-full cursor-pointer" onClick={() => setSelectedTransaction(item)}>
                        {item.type === 'income' ? (
                          <PanelItemIcon className='bg-emerald-50 dark:bg-emerald-500/10'>
                            <BanknoteArrowUp size={24} className='text-emerald-500' />
                          </PanelItemIcon>
                        ) : (
                          <PanelItemIcon className='bg-rose-50 dark:bg-rose-500/10'>
                            <BanknoteArrowDown size={24} className='text-rose-500' />
                          </PanelItemIcon>
                        )}
                        <PanelItemInfo>
                          <PanelItemInfoTitle className="dark:text-zinc-200">{item.description}</PanelItemInfoTitle>
                          <PanelItemInfoDetail className="dark:text-zinc-500">{dateToHour(item.date)} - {t(String(item.type))}</PanelItemInfoDetail>
                        </PanelItemInfo>
                        <Amount transactionType={item.type} className='flex-1 py-2.5 justify-end font-medium'>
                          <AmountCurrency>R$</AmountCurrency>
                          <AmountValue>{item.amount}</AmountValue>
                        </Amount>
                      </button>
                    </PanelItem>
                  ))}
                </PanelGroup>
              ))
            )}
          </div>
        </Panel>
      </div>

      {isTranscationModalOpen && <TransactionModal onClose={() => setIsTransactionOpen(false)} onSave={function (transaction: Omit<Transaction, 'id'>): void {
        throw new Error('Function not implemented.')
      }} categories={categories} wallets={walletItems} />
      }

      <TransactionDetailsModal 
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {isBankModalOpen && <InfoBankSectionModal onClose={() => setIsBankModalOpen(false)}/>}
      
    </section>
  );
};

export default Bank;