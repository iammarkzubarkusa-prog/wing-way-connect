import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useAgent() {
  const [isAgent, setIsAgent] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkAgentRole();
    } else {
      setIsAgent(false);
      setIsApproved(false);
      setLoading(false);
    }
  }, [user]);

  const checkAgentRole = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, is_approved')
        .eq('user_id', user.id)
        .eq('role', 'agent')
        .maybeSingle();

      if (error) throw error;
      setIsAgent(!!data);
      setIsApproved(!!data?.is_approved);
    } catch (error) {
      console.error('Error checking agent role:', error);
      setIsAgent(false);
      setIsApproved(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAgent, isApproved, loading, refetch: checkAgentRole };
}
