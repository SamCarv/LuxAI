import type { Report, ReportRequest } from "../types/dashboard";
import { api } from "./api";

const ROUTE = '/dashboard/analyze'

const get_analyze = (): Promise<Report> => {
    const token = localStorage.getItem("token");
    return api.post(`${ROUTE}`, {}, {headers:{Authorization: `Bearer ${token}`}}).then((response) => response.data);
}

export { get_analyze }