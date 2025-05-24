
import { useAuthState } from './auth/useAuthState';
import { useAuthActions } from './auth/useAuthActions';

export function useAuthProvider() {
  const authState = useAuthState();
  const authActions = useAuthActions();

  return {
    ...authState,
    ...authActions,
  };
}
