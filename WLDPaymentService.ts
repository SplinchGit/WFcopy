// src/services/WLDPaymentService.ts
import { authService } from './AuthService';

// Transaction status enum
export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

// Transaction interface
export interface WLDTransaction {
  txHash: string;
  from: string;
  to: string;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  campaignId?: string;
}

// Payment service class
class WLDPaymentService {
  private static instance: WLDPaymentService;

  private constructor() {}

  public static getInstance(): WLDPaymentService {
    if (!WLDPaymentService.instance) {
      WLDPaymentService.instance = new WLDPaymentService();
    }
    return WLDPaymentService.instance;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const { token } = await authService.checkAuthStatus();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const apiKey = import.meta.env.VITE_WORLD_APP_API;
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    return headers;
  }

  private getApiBase(): string {
    const apiBase = import.meta.env.VITE_AMPLIFY_API;
    if (!apiBase) {
      throw new Error('Backend API URL is not configured');
    }
    return apiBase;
  }

  // Donate to a campaign
  public async donateWLD(
    campaignId: string, 
    amount: number, 
    txHash: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const apiBase = this.getApiBase();
      const headers = await this.getHeaders();

      const response = await fetch(`${apiBase}/campaigns/${campaignId}/donate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount, txHash }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to record donation' }));
        throw new Error(errorData.message || 'Failed to record donation');
      }

      const data = await response.json();
      return { success: true };
    } catch (error: any) {
      console.error('Failed to donate WLD:', error);
      return { success: false, error: error.message || 'Failed to donate WLD' };
    }
  }

  // Get donation instructions
  public async getDonationInstructions(campaignId: string): Promise<{
    campaignAddress: string;
    instructions: string[];
    minAmount: number;
  }> {
    // In a real app, this would fetch from the API
    // For now, return mock data
    return {
      campaignAddress: '0x5816E346C014e4BE06bA48de8c0Bf08A61f9033F',
      instructions: [
        'Send WLD tokens to the campaign address using your wallet',
        'Copy the transaction hash once the transaction is confirmed',
        'Submit the transaction hash and amount to record your donation'
      ],
      minAmount: 0.01
    };
  }

  // Verify a transaction
  public async verifyTransaction(txHash: string): Promise<{
    success: boolean;
    transaction?: WLDTransaction;
    error?: string;
  }> {
    // In a real app, this would call the API to verify the transaction
    // For now, simulate a successful verification
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock transaction data
      return {
        success: true,
        transaction: {
          txHash,
          from: '0x' + Math.random().toString(16).substring(2, 42),
          to: '0x5816E346C014e4BE06bA48de8c0Bf08A61f9033F',
          amount: Math.random() * 100,
          status: TransactionStatus.CONFIRMED,
          timestamp: Date.now()
        }
      };
    } catch (error: any) {
      console.error('Failed to verify transaction:', error);
      return { success: false, error: error.message || 'Failed to verify transaction' };
    }
  }
}

export const wldPaymentService = WLDPaymentService.getInstance();