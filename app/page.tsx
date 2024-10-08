'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authentication from './lib/data/authentication';
import Login from './login/page';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Authentication.checkLogin()) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border" role="status">
          </div>
        </div>
      ) : (
        <div className="_login">
          <Login />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
