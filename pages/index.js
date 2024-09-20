import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, signInWithGoogle } from '@/pages/api/firebaseConfig';  
import styles from '@/styles/login.module.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const user = await signInWithGoogle();
    setLoading(false);
    if (user) {
      const email = user.email;
      if (email === 'u6228105@au.edu' || email === 'razielpark1@gmail.com') {
        router.push('/admin/adminHome'); 
      } else {
        router.push('/customer/customerHome'); 
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <button 
        className={styles.signInButton} 
        onClick={handleGoogleSignIn} 
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
}
