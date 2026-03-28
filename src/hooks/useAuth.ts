import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useAuthContext();
  
  return {
    user: context.user ? {
      id: context.user.id,
      name: `${context.user.firstName} ${context.user.lastName}`.trim(),
      email: context.user.email,
      avatar: context.user.profilePicture,
      hasPassword: context.user.hasPassword,
      isEmailVerified: context.user.isEmailVerified,
    } : null,
    isLoggedIn: context.isLoggedIn,
    isLoading: context.isLoading,
    login: async (email: string, password: string) => {
      await context.login(email, password);
      return true;
    },
    signup: async (firstName: string, lastName: string, email: string, password: string) => {
      await context.signup(firstName, lastName, email, password);
      return true;
    },
    logout: context.logout,
    verifyEmail: context.verifyEmail,
    resendVerification: context.resendVerification,
    forgotPassword: context.forgotPassword,
    resetPassword: context.resetPassword,
    updateProfile: async (updates: { name?: string; email?: string; avatar?: string }) => {
      if (updates.name) {
        const [firstName, ...rest] = updates.name.split(' ');
        const lastName = rest.join(' ') || '';
        await context.updateProfile({ firstName, lastName });
      }
    },
    setUserFromToken: context.setUserFromToken,
  };
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem('accessToken');
}
