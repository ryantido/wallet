import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useSignIn } from '@clerk/clerk-expo';
import * as React from 'react';
import { TextInput, View } from 'react-native';

export function ResetPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const codeInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState({ code: '', password: '' });
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit() {
    if (!isLoaded) {
      return;
    }
    try {
      setIsLoading(true);
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'complete') {
        // Set the active session to
        // the newly created session (user is now signed in)
        setActive({ session: result.createdSessionId });
        return;
      }
      // TODO: Handle other statuses
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        const isPasswordMessage = err.message.toLowerCase().includes('password');
        setError({ code: '', password: isPasswordMessage ? err.message : '' });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Réinitialiser le mot de passe</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Entrez le code envoyé par email et définissez un nouveau mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Nouveau mot de passe</Label>
              </View>
              <Input
                id="password"
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onPasswordSubmitEditing}
              />
              {error.password ? (
                <Text className="text-sm font-medium text-destructive">{error.password}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="code">Code de vérification</Label>
              <Input
                id="code"
                autoCapitalize="none"
                onChangeText={setCode}
                returnKeyType="send"
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                onSubmitEditing={onSubmit}
              />
              {error.code ? (
                <Text className="text-sm font-medium text-destructive">{error.code}</Text>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              {isLoading ? <Text>Traitement en cours...</Text> : <Text>Valider </Text>}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
