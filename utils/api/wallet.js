import { apiClient } from './client';

export const walletAPI = {
  // Wallet Statistics
  getWalletStats: async () => {
    return await apiClient.get('/api/v1/wallet/stats/');
  },

  // Wallet Management
  getAllWallets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/wallet/wallets/${queryString ? `?${queryString}` : ''}`);
  },

  getWallet: async (walletId) => {
    return await apiClient.get(`/api/v1/wallet/wallets/${walletId}/`);
  },

  updateWallet: async (walletId, walletData) => {
    return await apiClient.put(`/api/v1/wallet/wallets/${walletId}/`, walletData);
  },

  // Transactions
  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/wallet/transactions/${queryString ? `?${queryString}` : ''}`);
  },

  getAdminTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/wallet/admin-transactions/${queryString ? `?${queryString}` : ''}`);
  },

  createTransaction: async (transactionData) => {
    return await apiClient.post('/api/v1/wallet/transactions/', transactionData);
  },

  // TRC Management
  getTRCTransfers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/wallet/trc-transfers/${queryString ? `?${queryString}` : ''}`);
  },

  createTRCTransfer: async (transferData) => {
    return await apiClient.post('/api/v1/wallet/trc-transfers/', transferData);
  },

  // Escrow
  getEscrowTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/api/v1/wallet/escrow/${queryString ? `?${queryString}` : ''}`);
  },

  getEscrowManagement: async (status = 'pending') => {
    return await apiClient.get(`/api/v1/wallet/escrow-management/?status=${status}`);
  },

  updateEscrowTransaction: async (transactionId, action) => {
    return await apiClient.post(`/api/v1/wallet/escrow-management/${transactionId}/`, { action });
  },

  createEscrow: async (escrowData) => {
    return await apiClient.post('/api/v1/wallet/escrow/', escrowData);
  },

  updateEscrow: async (escrowId, escrowData) => {
    return await apiClient.put(`/api/v1/wallet/escrow/${escrowId}/`, escrowData);
  }
};