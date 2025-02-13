import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface LeadCreditManagerProps {
  leadId: string;
  currentCost: number;
  onUpdate: () => void;
}

export function LeadCreditManager({ leadId, currentCost, onUpdate }: LeadCreditManagerProps) {
  const [creditCost, setCreditCost] = useState(currentCost);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ credit_cost: creditCost })
        .eq('id', leadId);

      if (error) throw error;
      toast.success('Credit cost updated successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update credit cost');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label htmlFor="creditCost">Credit Cost</Label>
        <Input
          id="creditCost"
          type="number"
          min="1"
          value={creditCost}
          onChange={(e) => setCreditCost(Number(e.target.value))}
          className="w-24"
        />
        <Button 
          onClick={handleUpdate} 
          disabled={loading || creditCost === currentCost}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
} 