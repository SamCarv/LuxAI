type ChatMessage = {
    role: "user" | "assistant",
    content: string,
}

type ChatAttachment = {
    filename: string,
    content_type: string,
    base64_data: string,
    title: string | null,
}

type ChatRequest = {
    message: string,
    history: ChatMessage[],
    attachments: ChatAttachment[],
}

export type { ChatRequest, ChatMessage, ChatAttachment}