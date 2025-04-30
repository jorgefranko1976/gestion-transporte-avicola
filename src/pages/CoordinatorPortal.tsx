
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outlet } from 'react-router-dom';
import CoordinatorHeader from '@/components/coordinator/CoordinatorHeader';
import CoordinatorTabs from '@/components/coordinator/CoordinatorTabs';
import { PageTransition } from '@/components/transitions/PageTransition';
import { useAuth } from '@/context/AuthContext';

type Stats = {
  totalDispatches: number;
  pendingDispatches: number;
  completedDispatches: number;
  totalFiles: number;
  activeDrivers: number;
  activeVehicles: number;
};

const CoordinatorPortal = () => {
  const [stats, setStats] = useState<Stats>({
    totalDispatches: 0,
    pendingDispatches: 0,
    completedDispatches: 0,
    totalFiles: 0,
    activeDrivers: 0,
    activeVehicles: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dispatchesResult, pendingResult, completedResult, filesResult, driversResult, vehiclesResult] = 
          await Promise.all([
            supabase.from('dispatches').select('*', { count: 'exact', head: true }),
            supabase.from('dispatches').select('*', { count: 'exact', head: true }).eq('status', 'pendiente'),
            supabase.from('dispatches').select('*', { count: 'exact', head: true }).eq('status', 'completado'),
            supabase.from('uploaded_files').select('*', { count: 'exact', head: true }),
            supabase.from('drivers').select('*', { count: 'exact', head: true }).eq('active', true),
            supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('active', true)
          ]);

        setStats({
          totalDispatches: dispatchesResult.count || 0,
          pendingDispatches: pendingResult.count || 0,
          completedDispatches: completedResult.count || 0,
          totalFiles: filesResult.count || 0,
          activeDrivers: driversResult.count || 0,
          activeVehicles: vehiclesResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <CoordinatorHeader stats={stats} isLoading={isLoading} />
        <div className="container mx-auto p-4 pb-16">
          <CoordinatorTabs />
          <div className="mt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CoordinatorPortal;
