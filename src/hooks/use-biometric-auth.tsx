
import { useState, useEffect } from 'react';

interface BiometricAuthState {
  isSupported: boolean;
  isEnrolled: boolean;
  isAuthenticated: boolean;
}

export const useBiometricAuth = () => {
  const [authState, setAuthState] = useState<BiometricAuthState>({
    isSupported: false,
    isEnrolled: false,
    isAuthenticated: false
  });

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    if ('credentials' in navigator && 'create' in navigator.credentials) {
      try {
        const isSupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setAuthState(prev => ({ ...prev, isSupported }));
        
        if (isSupported) {
          const storedCredential = localStorage.getItem('biometric-enrolled');
          setAuthState(prev => ({ ...prev, isEnrolled: !!storedCredential }));
        }
      } catch (error) {
        console.log('Biometric check failed:', error);
      }
    }
  };

  const enrollBiometric = async () => {
    if (!authState.isSupported) return false;

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: "Toyota UAE" },
          user: {
            id: new Uint8Array(16),
            name: "user@toyota.ae",
            displayName: "Toyota User"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          }
        }
      } as CredentialCreationOptions);

      if (credential) {
        localStorage.setItem('biometric-enrolled', 'true');
        setAuthState(prev => ({ ...prev, isEnrolled: true }));
        return true;
      }
    } catch (error) {
      console.log('Biometric enrollment failed:', error);
    }
    return false;
  };

  const authenticateBiometric = async () => {
    if (!authState.isEnrolled) return false;

    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: "required"
        }
      } as CredentialRequestOptions);

      if (credential) {
        setAuthState(prev => ({ ...prev, isAuthenticated: true }));
        
        // Add haptic feedback if supported
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 50, 50]);
        }
        
        return true;
      }
    } catch (error) {
      console.log('Biometric authentication failed:', error);
    }
    return false;
  };

  return {
    ...authState,
    enrollBiometric,
    authenticateBiometric
  };
};
