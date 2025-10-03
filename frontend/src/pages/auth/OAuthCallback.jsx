import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          toast.error('Login failed. Please try again.');
          navigate('/login');
          return;
        }

        if (accessToken && refreshToken) {
          // Store tokens in localStorage
          localStorage.setItem('accessToken', decodeURIComponent(accessToken));
          localStorage.setItem('refreshToken', decodeURIComponent(refreshToken));
          
          // Check authentication status to update the store
          await checkAuth();
          
          toast.success('Successfully logged in with Google!');
          navigate('/dashboard');
        } else {
          console.error('No tokens received from OAuth callback');
          toast.error('Login failed. Please try again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback processing error:', error);
        toast.error('Login failed. Please try again.');
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
          <span className="text-white text-lg font-medium">Completing login...</span>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;