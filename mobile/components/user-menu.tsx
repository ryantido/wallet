import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { useAuth, useUser } from '@clerk/clerk-expo';
import type { TriggerRef } from '@rn-primitives/popover';
import { LogOutIcon, MoonStarIcon, PlusIcon, SettingsIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { router } from 'expo-router';

export function UserMenu() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const popoverTriggerRef = React.useRef<TriggerRef>(null);

  async function onSignOut() {
    popoverTriggerRef.current?.close();
    await signOut();
  }

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
  };

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatar />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="p-0">
        <View className="gap-3 border-b border-border p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar className="size-10" />
            <View className="flex-1">
              <Text className="font-medium leading-5">
                {user?.fullName || user?.emailAddresses[0]?.emailAddress}
              </Text>
              {user?.fullName?.length ? (
                <Text className="text-sm font-normal leading-4 text-muted-foreground">
                  {user?.username || user?.emailAddresses[0]?.emailAddress}
                </Text>
              ) : null}
            </View>

            <Button
              onPress={toggleColorScheme}
              size="icon"
              variant="ghost"
              className="rounded-full">
              <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-6" />
            </Button>
          </View>
          <View className="flex-row flex-wrap gap-3 py-0.5">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Icon as={SettingsIcon} className="size-4" />
                  <Text>Manage Account</Text>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>&Eacute;ditez votre profil</DialogTitle>
                  <DialogDescription>
                    Faites des changements dans votre profil ici. Cliquez sur enregistrer lorsque
                    vous avez fini.
                  </DialogDescription>
                </DialogHeader>
                <View className="grid gap-4">
                  <View className="grid gap-3">
                    <Label htmlFor="name-1">Nom</Label>
                    <Input
                      id="name-1"
                      defaultValue={user?.fullName || user?.emailAddresses[0].emailAddress}
                    />
                  </View>
                  <View className="grid gap-3">
                    <Label htmlFor="username-1">adresse e-mail</Label>
                    <Input id="username-1" defaultValue={user?.emailAddresses[0].emailAddress} />
                  </View>
                </View>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">
                      <Text>Annuler</Text>
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>
                      <Text>Enregistrer</Text>
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" className="flex-1" onPress={onSignOut}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
        <Button
          variant="ghost"
          size="lg"
          className="h-16 justify-start gap-3 rounded-none rounded-b-md px-3 sm:h-14"
          onPress={() => {
            popoverTriggerRef.current?.close();
            router.push('/transaction/add');
          }}>
          <View className="size-10 items-center justify-center">
            <View className="size-7 items-center justify-center rounded-full border border-dashed border-border bg-muted/50">
              <Icon as={PlusIcon} className="size-5" />
            </View>
          </View>
          <Text>Ajouter une transaction</Text>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function UserAvatar(props: Omit<React.ComponentProps<typeof Avatar>, 'alt'>) {
  const { user } = useUser();

  const { initials, imageSource, userName } = React.useMemo(() => {
    const userName = user?.fullName || user?.emailAddresses[0]?.emailAddress || 'Unknown';
    const initials = userName
      .split(' ')
      .map((name) => name[0])
      .join('');

    const imageSource = user?.imageUrl ? { uri: user.imageUrl } : undefined;
    return { initials, imageSource, userName };
  }, [user?.imageUrl, user?.fullName, user?.emailAddresses[0]?.emailAddress]);

  return (
    <Avatar alt={`${userName}'s avatar`} {...props}>
      <AvatarImage source={imageSource} />
      <AvatarFallback>
        <Text>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
