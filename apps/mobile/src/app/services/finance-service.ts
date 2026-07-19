import { createTransactionSchema } from "@/lib/finance-schema";
import axios from "axios";
import { parseCookies } from "nookies";
import z from "zod";
import { api } from "./api";

api.interceptors.request.use(config => {
    const cookies = parseCookies();
    const token = cookies['slowpace.token'];

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

type TransactionZodProps = z.infer<typeof createTransactionSchema>;

export type Transaction = TransactionZodProps & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateTransactionInput = TransactionZodProps;

export const financeService = {
    async getTransactions(): Promise<Transaction[]> {
        const response = await api.get('/finance/transactions');
        return response.data;
    },

    async createTransaction(data: CreateTransactionInput): Promise<Transaction> {
        const response = await api.post('/finance/transactions', data);
        const transaction = response.data;

        if (transaction && transaction.amount > data.amount) {
            transaction.amount = transaction.amount / 100;
        }

        return response.data;
    },

    async updateTransaction(id: string, data: CreateTransactionInput): Promise<Transaction> {
        const response = await api.put(`/finance/transactions/${id}`, data);

        const transaction = response.data;
        if (transaction && transaction.amount > data.amount) {
            transaction.amount = transaction.amount / 100;
        }

        return response.data;
    },

    async deleteTransaction(id: string): Promise<void> {
        await api.delete(`/finance/transactions/${id}`);
    }
};