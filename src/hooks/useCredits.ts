import { useState, useEffect } from "react";
import { notifications } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export const useCredits = () => {
 const { user } = useAuthStore();
 const [loading, setLoading] = useState<boolean>(false);

 const fetchCredits = async () => {
   if (!user?.id) return;
    setLoading(true)
    const { data, error } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id) 
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
      setLoading(false);
      return;
    }
    setLoading(false)
    return data.credits
   };

 const deductCredits = async (amount: number) => {
    if (!user) return;

   const credits = await fetchCredits()

    try {
       // Check if user has enough credits
     if (credits < amount) {
        throw new Error("Insufficient credits");
     }

        // Show notification if credits are low
      if (credits - amount < 5) {
         notifications.warning.lowCredits();
      }

     const { error } = await supabase 
      .from("users")
      .update({
         credits: credits - amount,  
      })
      .eq("id", user.id);

      if (error) throw error;
       
      
     // Record transaction
      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        amount: -amount,  
        type: "lead_purchase",
        status: "completed",
     });
    } catch (error) {
       console.error("Error deducting credits:", error);
       throw error;
    } finally {
      return "success"
    }
  };
 
const hasEnoughCredits = async (amount: number) => {
 const credits = await fetchCredits()
  return credits >= amount
}
 
 return {
    loading,
    deductCredits,
    hasEnoughCredits,
 };
};