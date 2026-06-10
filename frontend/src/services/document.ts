import type { CreateDocument, Document } from "../types/document";
import { api } from "./api";

const ROUTE = "document";

const list_documents = async (): Promise<Document[]> => {
  const token = localStorage.getItem("token");
  return api
    .get(`/${ROUTE}/`, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => response.data);
};

const upload_document = async (
  createDocument: CreateDocument,
): Promise<Document> => {
  if (!createDocument?.file) {
    console.warn(
      "upload_document foi chamada, mas o objeto 'file' está ausente ou inválido.",
      createDocument,
    );
  }

  const formData = new FormData();
  formData.append("file", createDocument.file);
  formData.append("title", createDocument.title || "");

  const token = localStorage.getItem("token");

  return api
    .post(`/${ROUTE}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

const delete_documents = async (ids: string[]): Promise<void> => {
  const token = localStorage.getItem("token");
  return api
    .delete(`/${ROUTE}/`, {
      data: ids,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);
};

export { list_documents, upload_document, delete_documents };
