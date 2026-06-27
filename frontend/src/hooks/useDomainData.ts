import { useState, useEffect, useCallback } from 'react';
import { userService, courseService, domainService } from '../services/apiService';
import { useAuth } from '../store/AuthContext';

// Shared hook for domain-aware data refresh
export function useDomainData(role?: string) {
  const { user } = useAuth();
  const [domainStats, setDomainStats] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [domainInterns, setDomainInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, courses, users] = await Promise.all([
        domainService.getStats().catch(() => []),
        courseService.getAll().catch(() => []),
        userService.getAll().catch(() => []),
      ]);
      setDomainStats(stats);
      setAllCourses(courses);
      if (user?.domain) {
        setDomainInterns(users.filter((u: any) => u.role === 'INTERN' && u.domain?.toLowerCase() === user.domain?.toLowerCase() && u.isApproved));
      }
    } finally {
      setLoading(false);
    }
  }, [user?.domain]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { domainStats, allCourses, domainInterns, loading, refresh };
}
