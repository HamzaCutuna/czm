"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWallet } from "@/components/wallet/WalletProvider";

type DebugInfo = Record<string, unknown> | null;

export function DiamondDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { wallet, refreshWallet } = useWallet();

  const runDebug = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/diamonds');
      const data: unknown = await response.json();
      if (data && typeof data === 'object') {
        setDebugInfo(data as Record<string, unknown>);
      } else {
        setDebugInfo({ value: data });
      }
    } catch {
      setDebugInfo({ error: 'Failed to fetch debug info' });
    } finally {
      setLoading(false);
    }
  };

  const testReward = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz/tf/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalQuestions: 10,
          correctAnswers: 8,
          durationMs: 120000,
          sessionData: { test: true }
        }),
      });
      
      const result: unknown = await response.json();
      setDebugInfo({ testResult: result });
      await refreshWallet();
    } catch {
      setDebugInfo({ error: 'Failed to test reward' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600">Please sign in to debug diamonds system</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="text-amber-800">💎 Diamond System Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">Current Wallet</h3>
            <div className="p-3 bg-white rounded border">
              <p><strong>Balance:</strong> {wallet?.diamonds || 0} 💎</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">Actions</h3>
            <div className="space-y-2">
              <Button 
                onClick={runDebug} 
                disabled={loading}
                size="sm"
                className="w-full"
              >
                {loading ? 'Loading...' : 'Debug Info'}
              </Button>
              <Button 
                onClick={testReward} 
                disabled={loading}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Reward'}
              </Button>
              <Button 
                onClick={refreshWallet} 
                disabled={loading}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Refresh Wallet
              </Button>
            </div>
          </div>
        </div>

        {debugInfo && (
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">Debug Results</h3>
            <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-60">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
