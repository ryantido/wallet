import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { TextInput, View } from 'react-native';

export function SignUpForm() {
  const { signUp, isLoaded } = useSignUp();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit() {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      setIsLoading(true);
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      router.push(`/(auth)/sign-up/verify-email?email=${email}`);
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        const isEmailMessage =
          err.message.toLowerCase().includes('identifier') ||
          err.message.toLowerCase().includes('email');
        setError(isEmailMessage ? { email: err.message } : { password: err.message });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }
    finally {
      setIsLoading(false);
    }
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Cr&eacute;er un compte</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Bienvenue ! Veuillez remplir les informations suivantes pour commencer.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="grid grid-cols-2 gap-2">
              <View className="gap-1.5">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="John"
                  keyboardType="default"
                  autoComplete="name-given"
                  autoCapitalize="words"
                  onChangeText={setLastName}
                  returnKeyType="next"
                  submitBehavior="submit"                  
                />
              </View>
              <View className="gap-1.5">
                <View className="flex-row items-center">
                  <Label htmlFor="firstName">Pr&eacute;nom</Label>
                </View>
                <Input
                  id="firstName"
                  onChangeText={setFirstName}                  
                  placeholder="Schwartz"
                  keyboardType="default"
                  autoComplete="name-family"
                  autoCapitalize="words"
                  returnKeyType="next"
                  submitBehavior="submit"
                />
              </View>
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="john@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.email ? (
                <Text className="text-sm font-medium text-destructive">{error.email}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Mot de passe</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
              {error.password ? (
                <Text className="text-sm font-medium text-destructive">{error.password}</Text>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading || !email || !password || !firstName || !lastName}>
              {isLoading ? <Text>Traitement en cours...</Text> : <Text>Cr&eacute;er mon compte</Text>}
            </Button>
          </View>
          <Text className="text-center text-sm">
            Vous avez d&eacute;ja un compte ?{' '}
            <Link href="/(auth)/sign-in" dismissTo className="text-sm underline underline-offset-4">
              Connectez-vous
            </Link>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
