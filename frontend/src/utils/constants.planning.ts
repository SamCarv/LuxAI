import { Activity, AirVent, Ambulance, Anchor, Amphora, Apple, Armchair, Axe, BadgeDollarSign, Bath, Bike, BicepsFlexed, Bone, BookOpen, Brush, BrushCleaning, Building2, CakeSlice, Cat, Cctv, Church, Cpu, Dna, Dog, DollarSign, Dumbbell, Gauge, Gem, Gamepad2, GraduationCap, Heart, HeartPlus, Home, Leaf, MapPinned, Music, Palette, Plane, Recycle, Router, Rss, Stethoscope, Truck } 
from "lucide-react"

import type { Category } from "../types/category";

export let categories: Category[] = [
    {
        id: 1,
        name: 'Moradia',
        icon: 'Home',
        color: '99E500',
        user_id: 1,
        description: 'Despesas fixas com habitação, incluindo aluguel, condomínio e contas de luz/água.',
        transactions: [
            { id: 101, description: 'Aluguel Mensal', amount: 950.00, date: '2026-05-10', type: 'expense', status: 'successful', periodicity: 'once', category_id: 1, account_id: 1 },
            { id: 102, description: 'Conta de Energia', amount: 150.00, date: '2026-05-15', type: 'expense', status: 'pending', periodicity: 'monthly', category_id: 1, account_id: 1 }
        ]
    },
    {
        id: 2,
        name: 'Saúde',
        icon: 'HeartPlus',
        color: 'EC9393',
        user_id: 1,
        description: 'Gastos com plano de saúde, medicamentos e consultas médicas de rotina.',
        transactions: [
            { id: 201, description: 'Farmácia', amount: 85.90, date: '2026-05-05', type: 'expense', status: 'successful', periodicity: 'monthly', category_id: 2, account_id: 1 },
            { id: 202, description: 'Consulta Dentista', amount: 200.00, date: '2026-05-20', type: 'expense', status: 'pending', periodicity: 'once', category_id: 2, account_id: 1 }
        ]
    },
    {
        id: 3,
        name: 'Lazer',
        icon: 'Bike',
        color: 'F2B3FF',
        user_id: 1,
        description: 'Momentos de descontração, hobbies, viagens e atividades esportivas.',
        transactions: [
            { id: 301, description: 'Ingressos Cinema', amount: 60.00, date: '2026-05-12', type: 'expense', status: 'successful', periodicity: 'once', category_id: 3, account_id: 2 },
            { id: 302, description: 'Manutenção Bicicleta', amount: 120.00, date: '2026-05-18', type: 'expense', status: 'pending', periodicity: 'monthly', category_id: 3, account_id: 1 }
        ]
    },
    {
        id: 4,
        name: 'Finanças',
        icon: 'DollarSign',
        color: 'FFD500',
        user_id: 1,
        description: 'Gestão de investimentos, pagamentos de taxas bancárias e assinaturas de serviços.',
        transactions: [
            { id: 401, description: 'Disney+', amount: 33.90, date: '2026-05-23', type: 'expense', status: 'successful', periodicity: 'annually', category_id: 4, account_id: 1 },
            { id: 402, description: 'Netflix', amount: 55.90, date: '2026-05-23', type: 'expense', status: 'pending', periodicity: 'annually', category_id: 4, account_id: 1 },
            { id: 403, description: 'HBO Max', amount: 34.90, date: '2026-05-23', type: 'expense', status: 'failed', periodicity: 'annually', category_id: 4, account_id: 1 }
        ]
    },
    {
        id: 5,
        name: 'Compras',
        icon: 'CakeSlice',
        color: 'B3E6FF',
        user_id: 1,
        description: 'Compras de supermercado, vestuário e itens de consumo geral.',
        transactions: [
            { id: 501, description: 'Supermercado Semanal', amount: 350.00, date: '2026-05-08', type: 'expense', status: 'successful', periodicity: 'weekly', category_id: 5, account_id: 1 }
        ]
    },
    {
        id: 6,
        name: 'Transporte',
        icon: 'Truck',
        color: 'CCB3FF',
        user_id: 1,
        description: 'Gastos com combustível, transporte público ou aplicativos de mobilidade.',
        transactions: [
            { id: 601, description: 'Combustível', amount: 200.00, date: '2026-05-10', type: 'expense', status: 'successful', periodicity: 'weekly', category_id: 6, account_id: 1 },
            { id: 602, description: 'Uber / 99', amount: 45.00, date: '2026-05-14', type: 'expense', status: 'successful', periodicity: 'once',category_id: 6, account_id: 1 }
        ]
    },
    {
        id: 7,
        name: 'Educação',
        icon: 'BookOpen',
        color: 'DB1F1F',
        user_id: 1,
        description: 'Mensalidades de cursos, livros e materiais para desenvolvimento profissional.',
        transactions: [
            { id: 701, description: 'Mensalidade Faculdade', amount: 450.00, date: '2026-05-05', type: 'expense', status: 'successful', periodicity: 'monthly', category_id: 7, account_id: 1 },
            { id: 702, description: 'Livro de React', amount: 89.90, date: '2026-05-11', type: 'expense', status: 'successful', periodicity: 'once', category_id: 7, account_id: 1 }
        ]
    },
    {
        id: 8,
        name: 'Limpeza',
        icon: 'BrushCleaning',
        color: '33CC61',
        user_id: 1,
        description: 'Produtos de limpeza para a casa e serviços de lavanderia ou faxina.',
        transactions: [
            { id: 801, description: 'Produtos de Limpeza', amount: 120.00, date: '2026-05-07', type: 'expense', status: 'successful', periodicity: 'weekly', category_id: 8, account_id: 1 }
        ]
    }
];

export const setCategories = (actualCategories: Category[]) => {
    categories = actualCategories
}

export const preColorsSelection = [
    'FFC0B3',
    'C3E70C',
    'B3B3FF',
    'B3FFCC',
    'B3E6FF',
    'CCB3FF',
    'F2B3FF',
    'FFB266',
    'FFD500',
    '80FFD4',
    '93DDEC',
    'EC9393',
    'ECDD93',
    'B0EC93',
    'FF80CE',
    'DB1F1F',
    'EC5F5F',
    '99E500',
    '33CC61',
]

export const iconMap = {
  Activity,
  AirVent,
  Ambulance,
  Anchor,
  Amphora,
  Apple,
  Armchair,
  Axe,
  BadgeDollarSign,
  Bath,
  Bike,
  BicepsFlexed,
  Bone,
  BookOpen,
  Brush,
  BrushCleaning,
  Building2,
  CakeSlice,
  Cat,
  Cctv,
  Church,
  Cpu,
  Dna,
  Dog,
  DollarSign,
  Dumbbell,
  Gauge,
  Gem,
  Gamepad2,
  GraduationCap,
  Heart,
  HeartPlus,
  Home,
  Leaf,
  MapPinned,
  Music,
  Palette,
  Plane,
  Recycle,
  Router,
  Rss,
  Stethoscope,
  Truck
} as const

export const preIconsSelection = [ 
    'Activity', 
    'AirVent', 
    'Ambulance', 
    'Anchor', 
    'Amphora', 
    'Apple', 
    'Armchair', 
    'Axe', 
    'BadgeDollarSign',  
    'Bath', 
    'Bike', 
    'BicepsFlexed', 
    'Bone', 
    'BookOpen', 
    'Brush', 
    'BrushCleaning', 
    'Building2', 
    'CakeSlice', 
    'Cat', 
    'Cctv', 
    'Church', 
    'Cpu', 
    'Dna', 
    'Dog', 
    'DollarSign', 
    'Dumbbell', 
    'Gauge', 
    'Gem', 
    'Gamepad2', 
    'GraduationCap', 
    'Heart', 
    'HeartPlus', 
    'Home', 
    'Leaf', 
    'MapPinned', 
    'Music', 
    'Palette', 
    'Plane', 
    'Recycle', 
    'Router', 
    'Rss', 
    'Stethoscope', 
    'Truck' 
] as const satisfies (keyof typeof iconMap)[]