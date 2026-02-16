import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoMail, IoLockClosed, IoPerson, IoEye, IoEyeOff } from 'react-icons/io5';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { useAuth } from '@hooks/useAuth';
import { validateEmail, validatePassword, validateUsername } from '@utils/validators';

/**
 * Register Form Component
 */
export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Username validation
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      navigate('/feed');
    } catch (error) {
      setErrors({
        submit: error.message || 'Registration failed. Please try again.',
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

      {/* Username Input */}
      <Input
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Choose a username"
        icon={<IoPerson size={20} />}
        error={errors.username}
        autoComplete="username"
      />

      {/* Password Input */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          icon={<IoLockClosed size={20} />}
          error={errors.password}
          autoComplete="new-password"
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

      {/* Confirm Password Input */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          icon={<IoLockClosed size={20} />}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {/* Toggle Confirm Password Visibility */}
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-[42px] text-gray hover:text-white transition-colors"
        >
          {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </button>
      </div>

      {/* Password Requirements */}
      <div className="p-4 bg-dark-light rounded-lg">
        <p className="text-sm text-gray-light mb-2">Password must contain:</p>
        <ul className="text-sm text-gray-light space-y-1">
          <li className="flex items-center gap-2">
            <span className={formData.password.length >= 8 ? 'text-green-500' : ''}>
              {formData.password.length >= 8 ? '✓' : '○'}
            </span>
            At least 8 characters
          </li>
          <li className="flex items-center gap-2">
            <span className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>
              {/[A-Z]/.test(formData.password) ? '✓' : '○'}
            </span>
            One uppercase letter
          </li>
          <li className="flex items-center gap-2">
            <span className={/[a-z]/.test(formData.password) ? 'text-green-500' : ''}>
              {/[a-z]/.test(formData.password) ? '✓' : '○'}
            </span>
            One lowercase letter
          </li>
          <li className="flex items-center gap-2">
            <span className={/\d/.test(formData.password) ? 'text-green-500' : ''}>
              {/\d/.test(formData.password) ? '✓' : '○'}
            </span>
            One number
          </li>
        </ul>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
          <p className="text-sm text-red-500">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Create Account
      </Button>

      {/* Terms */}
      <p className="text-center text-xs text-gray-light">
        By signing up, you agree to our{' '}
        <Link to="/terms" className="text-primary hover:text-primary-light">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-primary hover:text-primary-light">
          Privacy Policy
        </Link>
      </p>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-light">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary hover:text-primary-light font-semibold transition-colors"
        >
          Login
        </Link>
      </p>
    </form>
  );
};