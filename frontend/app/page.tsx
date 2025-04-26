'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LOGIN_SERVER_URL  } from './config';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email == '' || password == '') {
      alert('正確に入力してください。');
      return ;
    }
    const response = await fetch(`${LOGIN_SERVER_URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ✅ THIS is necessary to send cookies
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    if (response.ok) {
      setEmail('');
      setPassword('');
      window.location.href = '/dashboard'; // Redirect to dashboard or another page
    } else {
      alert(data.message); // Login failure message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          ログインする
        </button>
      </div>
    </div>
  );
}