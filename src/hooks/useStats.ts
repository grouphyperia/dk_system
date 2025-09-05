import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalCases: number;
  activeCases: number;
  totalClients: number;
  totalDocuments: number;
  monthlyRevenue: number;
  casesChange: number;
  clientsChange: number;
  documentsChange: number;
  revenueChange: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentOrganization } = useAuth();

  const fetchStats = async () => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      
      // Fetch cases stats
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('status, estimated_value, created_at')
        .eq('organization_id', currentOrganization.organization_id);

      if (casesError) throw casesError;

      // Fetch clients stats
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('created_at')
        .eq('organization_id', currentOrganization.organization_id);

      if (clientsError) throw clientsError;

      // Fetch documents stats
      const { data: documentsData, error: documentsError } = await supabase
        .from('case_documents')
        .select('created_at')
        .eq('organization_id', currentOrganization.organization_id);

      if (documentsError) throw documentsError;

      const totalCases = casesData.length;
      const activeCases = casesData.filter(c => c.status === 'open' || c.status === 'in_progress').length;
      const totalClients = clientsData.length;
      const totalDocuments = documentsData.length;
      
      // Calculate monthly revenue from estimated values
      const monthlyRevenue = casesData
        .filter(c => c.estimated_value && c.status !== 'closed')
        .reduce((sum, c) => sum + (c.estimated_value || 0), 0);

      // Calculate changes (simplified - would need previous period data for real calculations)
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const recentCases = casesData.filter(c => new Date(c.created_at) > lastMonth).length;
      const recentClients = clientsData.filter(c => new Date(c.created_at) > lastMonth).length;
      const recentDocuments = documentsData.filter(d => new Date(d.created_at) > lastMonth).length;

      setStats({
        totalCases,
        activeCases,
        totalClients,
        totalDocuments,
        monthlyRevenue,
        casesChange: recentCases,
        clientsChange: recentClients,
        documentsChange: recentDocuments,
        revenueChange: 15, // Placeholder percentage
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentOrganization]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};
