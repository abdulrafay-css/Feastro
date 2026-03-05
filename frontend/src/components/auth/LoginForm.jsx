import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { useAuth } from '@hooks/useAuth';
import { validateEmail } from '@utils/validators';

/**
 * Login Form Component
 */
export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      navigate('/feed');
    } catch (error) {
      setErrors({
        submit: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        icon={<IoMail size={20} />}
        error={errors.email}
        autoComplete="email"
      />

      {/* Password Input */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={<IoLockClosed size={20} />}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Toggle Password Visibility */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[42px] text-gray hover:text-white transition-colors"
        >
          {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </button>
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:text-primary-light transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
          <p className="text-sm text-red-500">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Login
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-light">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-primary hover:text-primary-light font-semibold transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};