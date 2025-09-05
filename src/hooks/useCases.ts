import { useState, useEffect } from 'react';
import { supabase, Case } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentOrganization } = useAuth();

  const fetchCases = async () => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          client:clients(*),
          responsible_lawyer:profiles(*)
        `)
        .eq('organization_id', currentOrganization.organization_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (caseData: Partial<Case>) => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([{
          ...caseData,
          organization_id: currentOrganization.organization_id,
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchCases(); // Refresh the list
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCase = async (id: string, updates: Partial<Case>) => {
    try {
      const { error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchCases(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCases(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCases();
  }, [currentOrganization]);

  return {
    cases,
    loading,
    error,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
  };
};
