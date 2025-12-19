import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { UserMenu } from '@/components/user-menu';
import { useUser } from '@clerk/clerk-expo';
import { router, Stack } from 'expo-router';
import * as React from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import Loader from '@/components/Loader';
import { amountColor, cn, formatCurrency, formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  BadgeEuro,
  BanknoteArrowUp,
  BanknoteArrowDown,
  Trash2,
  PlusIcon,
  Beef,
  ShoppingBag,
  Motorbike,
  Clapperboard,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Screen() {
  const { user } = useUser();

  const [refreshing, setRefreshing] = React.useState(false);

  const SCREEN_OPTIONS = {    
    header: () => (
      <View className="top-safe flex-row justify-between py-2 web:mx-2">
        <View className="flex-row items-center gap-3">
          <Image source={require('@/assets/logo.svg')} style={{ width: 50, height: 45 }} />
          <View className="flex-1">
            <Text className="text-xs font-normal leading-4 text-muted-foreground">Bienvenue,</Text>
            {user?.fullName?.length ? (
              <Text className="text-sm font-medium leading-5">
                {user?.fullName || user?.emailAddresses[0]?.emailAddress}
              </Text>
            ) : null}
          </View>
        </View>
        <UserMenu />
      </View>
    ),
  };

  const { transactions, summary, loading, deleteTransaction, loadData } = useTransactions(
    (user?.id as string) ?? ''
  );

  if (loading && !refreshing) return <Loader />;

  // const summary = {
  //   income: 2000,
  //   expenses: 1500,
  //   balance: 500,
  // };

  const IconRender = (category: string) => {
    switch (category) {
      case 'income':
        return (
          <View className="size-10 items-center justify-center rounded-full bg-green-100 p-2">
            <BanknoteArrowUp className="size-6 text-green-500" />
          </View>
        );
      case 'expense':
        return (
          <View className="size-10 items-center justify-center rounded-full bg-red-100 p-2">
            <BanknoteArrowDown className="size-6 text-red-500" />
          </View>
        );
      case 'food&drinks':
        return (
          <View className="size-10 items-center justify-center rounded-full bg-red-100 p-2">
            <Beef className="size-6 text-red-500" />
          </View>
        );
      case 'shopping':
        return (
          <View className="size-10 items-center justify-center rounded-full bg-blue-100 p-2">
            <ShoppingBag className="size-6 text-blue-500" />
          </View>
        );
      case 'transportation':
        return (
          <View className="size-10 items-center justify-center rounded-full bg-gray-100 p-2">
            <Motorbike className="size-6 text-gray-800" />
          </View>
        );
      case 'entertainment':
        return (
          <View className="size-10 items-center justify-center rounded-full bg-gray-100 p-2">
            <Clapperboard className="size-6 text-gray-500" />
          </View>
        );
      default:
        return (
          <View className="size-10 items-center justify-center rounded-full bg-gray-100 p-2">
            <BadgeEuro className="size-6 text-gray-500" />
          </View>
        );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <>
      <Stack.Screen options={ !refreshing ? SCREEN_OPTIONS : { headerShown: false}} />

      <ScrollView className="flex-1 gap-8 p-3 pt-6">
        <Card className="max-w-xl rounded-md bg-gray-50 shadow-md">
          <CardHeader>
            <CardDescription>Balance Totale</CardDescription>
            <CardTitle className="text-2xl text-gray-900 dark:text-gray-900">
              {formatCurrency(summary?.balance)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 gap-1">
                <Text className="text-sm font-normal leading-4 text-muted-foreground">Revenus</Text>
                <Text className="text-xl font-semibold text-green-500">
                  {formatCurrency(summary.income)}
                </Text>
              </View>
              <Separator orientation="vertical" className="h-10" />
              <View className="gap-1">
                <Text className="text-sm font-normal leading-4 text-muted-foreground">
                  D&eacute;penses
                </Text>
                <Text className="text-xl font-semibold text-red-500">
                  {formatCurrency(summary.expenses)}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
        <Text variant="h4" className="mb-6 mt-4 text-left">
          Transactions r&eacute;centes
        </Text>
        <FlatList
          data={
            // [
            //   // { title: 'Dev Test', category: 'income', amount: 100, created_at: new Date() },
            //   // { title: 'Dev Test', category: 'expense', amount: 100, created_at: new Date() },
            //   // { title: 'Dev Test', category: 'debt', amount: 9000, created_at: new Date() },
            //   // { title: 'Dev Test je suis trop long', category: 'debt is too big what the fck !', amount: 122000, created_at: new Date() },
            // ]
            transactions
          }
          renderItem={({ item: { id, title, category, amount, created_at } }) => (
            <Card className="max-w-xl flex-row items-center justify-between rounded-md bg-gray-50 p-4 shadow-md">
              <View className="flex-row items-center gap-2">
                {IconRender(category)}
                <View>
                  <Text
                    className="max-w-24 truncate font-bold leading-5 text-gray-800"
                    variant="large">
                    {title}
                  </Text>
                  <Text className="max-w-24 truncate text-xs font-medium leading-4 text-muted-foreground">
                    {category}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <View>
                  <Text
                    className={cn('text-right font-bold leading-5', amountColor(category))}
                    variant="large">
                    {formatCurrency(amount)}
                  </Text>
                  <Text className="text-right text-xs font-medium leading-4 text-muted-foreground">
                    {formatDate(created_at)}
                  </Text>
                </View>
                <Separator orientation="vertical" className="mx-2 h-10" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Pressable>
                      <Icon as={Trash2} size={21} className="text-red-500" />
                    </Pressable>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la transaction ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cette action supprimera votre compte
                        et supprimera vos données de nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        <Text>Annuler</Text>
                      </AlertDialogCancel>
                      <AlertDialogAction onPress={() => handleDeleteTransaction(id)}>
                        <Text>Continuer</Text>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </View>
            </Card>
          )}
          // keyExtractor={(item) => item.title}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => <View className="h-2" />}
          ItemSeparatorComponent={() => <View className="h-2" />}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center gap-4">
              <Text className="text-center text-muted-foreground">Aucune transaction.</Text>
              <Button variant="outline" size="sm" onPress={() => router.push('/transaction/add')}>
                <Icon as={PlusIcon} className="size-4" />
                <Text>Ajouter une transaction</Text>
              </Button>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </ScrollView>
    </>
  );
}
