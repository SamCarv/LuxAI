import { Activity, AirVent, Ambulance, Anchor, Amphora, Apple, Armchair, Axe, BadgeDollarSign, Bath, Bike, BicepsFlexed, Bone, BookOpen, Brush, BrushCleaning, Building2, CakeSlice, Cat, Cctv, Church, Cpu, Dna, Dog, DollarSign, Dumbbell, Gauge, Gem, Gamepad2, GraduationCap, Heart, HeartPlus, Home, Leaf, MapPinned, Music, Palette, Plane, Recycle, Router, Rss, Stethoscope, Truck } 
from "lucide-react"

import type { Category } from "../types/category";

export const categories: Category[] = [
    {
        id: 1,
        name: 'Moradia',
        icon: 'Home',
        color: '99E500',
        user_id: 1
    },
    {
        id: 2,
        name: 'Saúde',
        icon: 'HeartPlus',
        color: 'EC9393',
        user_id: 1
    },
    {
        id: 3,
        name: 'Lazer',
        icon: 'Bike',
        color: 'F2B3FF',
        user_id: 1
    },
    {
        id: 4,
        name: 'Finanças',
        icon: 'DollarSign',
        color: 'FFD500',
        user_id: 1
    },
    {
        id: 5,
        name: 'Compras',
        icon: 'CakeSlice',
        color: 'B3E6FF',
        user_id: 1
    },
    {
        id: 6,
        name: 'Transporte',
        icon: 'Truck',
        color: 'CCB3FF',
        user_id: 1
    },
    {
        id: 7,
        name: 'Educação',
        icon: 'BookOpen',
        color: 'DB1F1F',
        user_id: 1
    },
    {
        id: 8,
        name: 'Limpeza',
        icon: 'BrushCleaning',
        color: '33CC61',
        user_id: 1
    },
    

]

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