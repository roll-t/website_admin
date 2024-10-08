"use client"
import styles from '@/app/ui/login/login.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TokenConstants from '../lib/const/token_constants';
import Authentication from '../lib/data/authentication';
import HandleCookie from '../lib/data/cookie/handle_cookie';
import { LoginRequest } from '../lib/data/dto/request_types';
import { TokenResponse } from '../lib/data/dto/response_types';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter(); // Khởi tạo useRouter
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const loginRequest: LoginRequest = { email, password };
        const response = await Authentication.login(loginRequest);
        if (response.code === 0) {
            const data: TokenResponse = response.result as TokenResponse;
            if (data.token) {
                HandleCookie.setCookie(TokenConstants.Token, data.token, 7);
                // Điều hướng đến trang /dashboard
                router.push('/dashboard');
            }
        } else {
            console.log("Đăng nhập lỗi");
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.title}>
                    Login
                </div>
                <input
                    onChange={(e) => setEmail(e.target.value.trim())}
                    type="text" placeholder='Username' />
                <input onChange={(e) => setPassword(e.target.value.trim())}
                    type="password" placeholder='Password' />

                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;
