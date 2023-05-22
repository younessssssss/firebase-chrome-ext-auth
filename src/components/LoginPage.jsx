// LoginPage.js
import { useState } from 'react';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import styles from '../styles/LoginPage.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    try {
      // Configure the action code settings
      const actionCodeSettings = {
        url: 'http://localhost:3000/',
        handleCodeInApp: true,
      };
  
      // Send the sign-in email link
      await sendSignInLinkToEmail(getAuth(), email, actionCodeSettings);

  
      // Save the email for sign-in completion in the service worker
      chrome.runtime.sendMessage({ type: 'SET_EMAIL_FOR_SIGN_IN', email });

  
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error sending sign-in email link:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!isSuccess && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={styles.input}
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
      )}
      {isSuccess && (
        <p className={styles.successMessage}>
          Login email successfully sent! Please check your email.
        </p>
      )}
    </div>
  );
}

export default LoginPage;
