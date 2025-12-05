import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // handleChange

  const handleSubmit = async event => {
    event.preventDefault(); // ngan can load form
    try {
      const { data } = await axios.post(' http://localhost:3000/login', {
        email,
        password,
      });
      //   toast.success('Them tour duoc roi');
      localStorage.setItem('token', data.accessToken);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Đăng nhập</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Text input */}
        <div>
          <label htmlFor="text" className="block font-medium mb-1">
            Email
          </label>
          <input
            value={email} // document.getElementBy(id).value
            onChange={event => setEmail(event.target.value)}
            type="email"
            id="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="text" className="block font-medium mb-1">
            Password
          </label>
          <input
            value={password}
            onChange={event => setPassword(event.target.value)}
            type="password"
            id="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      <p className="text-center mt-4">
        Chưa có tài khoản? <Link className="text-blue-500" to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default LoginPage;