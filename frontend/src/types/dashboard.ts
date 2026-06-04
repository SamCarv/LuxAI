type Report = {
    analysis: string,
    month: number,
    year: number,
}

type ReportRequest = {
    month: number,
    year: number
}

export type { Report, ReportRequest }