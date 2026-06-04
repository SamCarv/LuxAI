type Document = {
    id: string;
    user_id: string;
    title: string;
    filename: string;
    content_type: string;
    storage_path: string;
    text: string;
    metadata_info?: Record<string, any>;
    created_at: string;
}

type CreateDocument = {
    title: string,
    file: File
}

export type { Document, CreateDocument }