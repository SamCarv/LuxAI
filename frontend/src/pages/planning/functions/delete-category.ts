import type { Category } from "../../../types/category";
import { categories, setCategories } from "../../../utils/constants.planning";

export const deleteCategory = (category: Category) => {
    const newCategories = categories.filter(c => c.id !== category.id)

    setCategories(newCategories)

    console.log(categories)
}