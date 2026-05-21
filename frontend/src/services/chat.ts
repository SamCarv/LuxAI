import type { ChatRequest } from "../types/chatDTO/chatRequest";
import { api } from "./api";

const ROUTER = "/chat"

const chat = (chatRequest :ChatRequest) => {
    const token = localStorage.getItem("token");
    return api.post(`${ROUTER}/`, chatRequest, {headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }})
}

export { chat }