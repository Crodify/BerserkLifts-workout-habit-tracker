import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/lib/AuthContext';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Name is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = isSignUp
      ? await signUp(email.trim(), password, name.trim())
      : await signIn(email.trim(), password);
    setLoading(false);

    if (result.error) setError(result.error);
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={s.logoSection}>
          <Text style={s.logoIcon}>⚔️</Text>
          <Text style={s.logoTitle}>BERSERKLIFTS</Text>
          <Text style={s.logoSub}>Workout & Habit Tracker</Text>
        </View>

        {/* Auth Card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{isSignUp ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</Text>
          <Text style={s.cardSub}>
            {isSignUp ? 'Start your training journey' : 'Log in to continue'}
          </Text>

          {/* Error */}
          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorTxt}>{error}</Text>
            </View>
          ) : null}

          {/* Name (signup only) */}
          {isSignUp && (
            <>
              <Text style={s.label}>NAME</Text>
              <TextInput
                style={s.input}
                placeholder="Your name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </>
          )}

          {/* Email */}
          <Text style={s.label}>EMAIL</Text>
          <TextInput
            style={s.input}
            placeholder="you@email.com"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password */}
          <Text style={s.label}>PASSWORD</Text>
          <TextInput
            style={s.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={s.submitTxt}>{loading ? 'LOADING...' : isSignUp ? 'SIGN UP' : 'LOG IN'}</Text>
          </TouchableOpacity>

          {/* Toggle */}
          <TouchableOpacity style={s.toggleBtn} onPress={() => { setIsSignUp(!isSignUp); setError(''); }}>
            <Text style={s.toggleTxt}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={s.toggleBold}>{isSignUp ? 'Log In' : 'Sign Up'}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={s.footer}>Your data is encrypted and stored securely in the cloud.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },

  logoSection: { alignItems: 'center', marginBottom: Spacing.xl },
  logoIcon: { fontSize: 56, marginBottom: Spacing.md },
  logoTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, letterSpacing: 3 },
  logoSub: { fontSize: FontSize.sm, color: Colors.primary, marginTop: Spacing.xs },

  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text, letterSpacing: 1, textAlign: 'center' },
  cardSub: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },

  errorBox: { backgroundColor: Colors.error + '15', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.error + '40' },
  errorTxt: { fontSize: FontSize.sm, color: Colors.error, textAlign: 'center', fontWeight: '600' },

  label: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  input: { backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },

  submitBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.full, paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.md },
  submitBtnDisabled: { opacity: 0.6 },
  submitTxt: { fontSize: FontSize.md, fontWeight: '900', color: Colors.white, letterSpacing: 1 },

  toggleBtn: { alignItems: 'center', marginTop: Spacing.lg },
  toggleTxt: { fontSize: FontSize.sm, color: Colors.textMuted },
  toggleBold: { color: Colors.primary, fontWeight: '800' },

  footer: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
