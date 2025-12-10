import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import FormField from '@/components/common/FormField';
import toast from 'react-hot-toast';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill out all fields.');
      return;
    }
    dispatch(login({ username, password }));
  };

  return (
    <div className="bg-neutral-100 flex items-center justify-center  sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-4 sm:p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold text-neutral-900">
            LGU Management System
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Sign in to access your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <FormField
              className="p-3 focus:outline-none"
              label="User Name"
              name="UserName"
              type="text"
              required
              placeholder="Enter user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // onBlur={handleBlur}
              // error={errors.UserName}
              // touched={touched.UserName}
            />
            <FormField
              className="p-3 focus:outline-none"
              label="Password"
              name="Password"
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              // onBlur={handleBlur}
              // error={errors.Password}
              // touched={touched.Password}
            />
            {/* <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-neutral-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-2 rounded-md border border-neutral-200 focus:ring-primary-500 focus:border-primary-500 block w-full"
                  placeholder="admin"
                />
              </div>
            </div> */}
            {/* <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 rounded-md border border-neutral-200 focus:ring-primary-500 focus:border-primary-500 block w-full"
                  placeholder="*********"
                />
              </div>
            </div> */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="form-checkbox"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-neutral-700"
                >
                  Remember me
                </label>
              </div>
              {/* <div className='text-sm'>
                <a
                  href='#'
                  className='text-xs font-medium text-primary-600 hover:text-primary-500'
                >
                  Forgot your password?
                </a>
              </div> */}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-error-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-error-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-error-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full flex justify-center items-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\"
                    xmlns="http://www.w3.org/2000/svg\"
                    fill="none\"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25\"
                      cx="12\"
                      cy="12\"
                      r="10\"
                      stroke="currentColor\"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-neutral-500 mt-8">
          &copy; 2025 Local Government Unit. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
