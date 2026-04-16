import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

const RoleGuard = ({ roles, children }: { roles: UserRole[]; children: React.ReactNode }) => {
  const { hasRole } = useAuth();
  if (!hasRole(roles)) return null;
  return <>{children}</>;
};

export default RoleGuard;
