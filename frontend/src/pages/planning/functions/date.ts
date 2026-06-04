export const formatDateForInput = (date?: string | Date) => {
    if (!date) return
    return new Date(date).toISOString().slice(0, 16)
};