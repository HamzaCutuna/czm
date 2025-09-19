"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, getWallet, getTransactions } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Wallet {
  id: string;
  user_id: string;
  diamonds_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  user_id: string;
  amount: number;
  direction: 'earn' | 'spend';
  source: string;
  quiz_session_id?: string;
  metadata: any;
  created_at: string;
}

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  grant: (amount: number, reason: string, metadata?: any) => Promise<boolean>;
  spend: (amount: number, reason: string, metadata?: any) => Promise<boolean>;
  canAfford: (amount: number) => boolean;
  refreshWallet: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWallet = async () => {
    try {
      console.log('Attempting to fetch wallet...');
      const { data, error } = await getWallet();
      
      if (error) {
        console.error('Wallet fetch error:', error);
        if ('code' in error) {
          console.error('Error code:', error.code);
          console.error('Error details:', error.details);
          console.error('Error hint:', error.hint);
        }
        console.error('Error message:', error.message);
        
        // If wallet doesn't exist yet, try to create user record first, then create wallet
        if ('code' in error && error.code === 'PGRST116') {
          console.log('Wallet not found, attempting to create user record and wallet...');
          await createUserRecord();
          await createWallet();
          // Try again after creating user record and wallet
          console.log('Retrying wallet fetch after user and wallet creation...');
          const { data: retryData, error: retryError } = await getWallet();
          if (retryError) {
            console.error('Error fetching wallet after creation:', retryError);
            if ('code' in retryError) {
              console.error('Retry error code:', retryError.code);
              console.error('Retry error details:', retryError.details);
            }
            console.error('Retry error message:', retryError.message);
            setWallet(null);
            return;
          }
          console.log('Wallet fetch successful after creation:', retryData);
          setWallet(retryData);
          return;
        }
        console.error('Error fetching wallet:', error);
        setWallet(null);
        return;
      }
      console.log('Wallet fetch successful:', data);
      setWallet(data);
    } catch (error) {
      console.error('Error refreshing wallet:', error);
      setWallet(null);
    }
  };

  const createUserRecord = async () => {
    try {
      console.log('Creating user record...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      console.log('Authenticated user:', { id: user.id, email: user.email });

      // Check if user record exists
      console.log('Checking if user record exists...');
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      console.log('User check result:', { existingUser, userError });

      if (userError && 'code' in userError && userError.code === 'PGRST116') {
        // User doesn't exist, create them
        console.log('Creating user record for:', user.id);
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
                  display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            privacy_setting: 'realname'
          });

        if (createError) {
          console.error('Error creating user record:', createError);
          if ('code' in createError) {
            console.error('Create error code:', createError.code);
            console.error('Create error details:', createError.details);
          }
          console.error('Create error message:', createError.message);
          console.error('User data:', { id: user.id, email: user.email });
          return;
        }

        console.log('User record created successfully');
      } else if (userError) {
        console.error('Unexpected error checking user:', userError);
      } else {
        console.log('User record already exists');
      }
    } catch (error) {
      console.error('Error in createUserRecord:', error);
    }
  };

  const createWallet = async () => {
    try {
      console.log('Creating wallet...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      // Check if wallet already exists
      console.log('Checking if wallet exists...');
      const { data: existingWallet, error: walletError } = await supabase
        .from('user_wallets')
        .select('id')
        .eq('user_id', user.id)
        .single();

      console.log('Wallet check result:', { existingWallet, walletError });

      if (walletError && 'code' in walletError && walletError.code === 'PGRST116') {
        // Wallet doesn't exist, create it
        console.log('Creating wallet for user:', user.id);
        const { error: createError } = await supabase
          .from('user_wallets')
          .insert({
            user_id: user.id,
            diamonds_balance: 0
          });

        if (createError) {
          console.error('Error creating wallet:', createError);
          if ('code' in createError) {
            console.error('Create error code:', createError.code);
            console.error('Create error details:', createError.details);
          }
          console.error('Create error message:', createError.message);
          return;
        }

        console.log('Wallet created successfully');
      } else if (walletError) {
        console.error('Unexpected error checking wallet:', walletError);
      } else {
        console.log('Wallet already exists');
      }
    } catch (error) {
      console.error('Error in createWallet:', error);
    }
  };

  const refreshTransactions = async () => {
    try {
      const { data, error } = await getTransactions(20, 0);
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      setTransactions(data || []);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

  useEffect(() => {
    const initializeWallet = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await Promise.all([refreshWallet(), refreshTransactions()]);
        } else {
          setWallet(null);
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
        setWallet(null);
        setTransactions([]);
      }
      setLoading(false);
    };

    initializeWallet();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await initializeWallet();
      } else if (event === 'SIGNED_OUT') {
        setWallet(null);
        setTransactions([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const grant = async (amount: number, reason: string, metadata?: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('wallet_grant', {
        p_amount: amount,
        p_reason: reason,
        p_metadata: metadata || {},
      });

      if (error) {
        toast.error(`Error granting diamonds: ${error.message}`);
        return false;
      }

      toast.success(`+${amount} 💎 ${reason}`);
      await refreshWallet();
      await refreshTransactions();
      return true;
    } catch (error: any) {
      toast.error(`Error granting diamonds: ${error.message}`);
      return false;
    }
  };

  const spend = async (amount: number, reason: string, metadata?: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('wallet_spend', {
        p_amount: amount,
        p_reason: reason,
        p_metadata: metadata || {},
      });

      if (error) {
        toast.error(`Error spending diamonds: ${error.message}`);
        return false;
      }

      toast.success(`${reason} used! -${amount} 💎`);
      await refreshWallet();
      await refreshTransactions();
      return true;
    } catch (error: any) {
      toast.error(`Error spending diamonds: ${error.message}`);
      return false;
    }
  };

  const canAfford = (amount: number): boolean => {
    return wallet ? wallet.diamonds_balance >= amount : false;
  };

  const contextValue: WalletContextType = {
    wallet,
    transactions,
    loading,
    grant,
    spend,
    canAfford,
    refreshWallet,
    refreshTransactions,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
