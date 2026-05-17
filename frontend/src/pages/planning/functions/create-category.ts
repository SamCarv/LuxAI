import type { ChangeEvent, FormEvent } from "react";
import type { Category } from "../../../types/category";
import { categories } from "../../../utils/constants.planning";
import { useNavigate } from "react-router-dom";

export const createCategory = async(event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    
    const name = formData.get('name')?.toString()
    const description = formData.get('description')?.toString()
    const icon = formData.get('icon')?.toString()
    const color = formData.get('color')?.toString()

    if(name === undefined || icon === undefined || color === undefined) return
    
    const category: Category = {
        id: 1,
        name: name,
        icon: icon,
        color: color,
        user_id: 1,
    }

    categories.push(category)

    console.log(category)
}