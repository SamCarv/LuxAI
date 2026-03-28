export const dateToHour = (date: string) => {
    const dateHour = new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    
    return dateHour
}