import { getRandomItem } from "../../../utils/random-item"

export const shuffleColor = (actual: string, colors: string[]) => {
    const colorsOptions = colors.filter(c => c !== actual)

    return getRandomItem(colorsOptions)
}