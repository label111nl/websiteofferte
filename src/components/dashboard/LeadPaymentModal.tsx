import React from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { useCredits } from './CreditSystem';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertProps } from '@/components/ui/alert';

interface LeadPaymentModalProps {
  leadId: string;
  creditCost: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadPaymentModal({
  leadId,
  creditCost,
  open,
  onClose,
  onSuccess,
}: LeadPaymentModalProps) {
  const [loading, setLoading] = React.useState(false);
  const { user } = useUser();
  const { credits, deductCredits, hasEnoughCredits } = useCredits();

  const handlePurchase = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Check if user has enough credits
      if (!hasEnoughCredits(creditCost)) {
        throw new Error('Niet genoeg credits. Koop meer credits.');
      }

      // Start transaction
      const { data: lead } = await supabase
        .from('leads')
        .select('current_purchases, purchasers')
        .eq('id', leadId)
        .single();

      if (!lead) throw new Error('Lead niet gevonden');

      // Check purchase limits
      if (lead.current_purchases >= 5) {
        throw new Error('Deze lead heeft zijn aankoop limiet bereikt');
      }

      if (lead.purchasers.includes(user.id)) {
        throw new Error('Je hebt deze lead al gekocht');
      }

      // Update lead purchase count and purchasers
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          current_purchases: lead.current_purchases + 1,
          purchasers: [...lead.purchasers, user.id]
        })
        .eq('id', leadId);

      if (updateError) throw updateError;

      // Deduct credits
      await deductCredits(creditCost);

      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('lead_purchases')
        .insert({
          lead_id: leadId,
          marketer_id: user.id,
          credits_spent: creditCost,
          status: 'active'
        });

      if (purchaseError) throw purchaseError;

      toast.success('Lead succesvol gekocht!');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Koop lead</DialogTitle>
          <DialogDescription>
            Koop deze lead met je beschikbare credits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Credit Status */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Beschikbare Credits</p>
              <p className="text-2xl font-bold">{credits}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Prijs</p>
              <p className="text-2xl font-bold text-blue-600">{creditCost}</p>
            </div>
          </div>

          {/* Warning if not enough credits */}
          {!hasEnoughCredits(creditCost) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Je hebt niet genoeg credits om deze lead te kopen.
                Overweeg om meer credits te kopen.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Na aankoop, krijg je toegang tot:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Lead gegevens</li>
              <li>Contact information</li>
              <li>Project omschrijving</li>
              <li>Budget informatie</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={loading || !hasEnoughCredits(creditCost)}
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Koop lead
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}