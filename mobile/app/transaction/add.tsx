import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Check, SquarePen, Tag } from 'lucide-react-native';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@clerk/clerk-expo';
import { useTransactions } from '@/hooks/useTransactions';

export default function AddTransaction() {
  const { user } = useUser();
  const { createTransaction } = useTransactions((user?.id as string) ?? '');

  const [category, setCategory] = React.useState('income');
  const [amount, setAmount] = React.useState('');
  const [title, setTitle] = React.useState('');

  const categories = [
    'income',
    'expense',
    'food&drinks',
    'shopping',
    'transportation',
    'entertainment',
    'other',
  ];

  const handleSubmit = () => {
    if (!user) return;
    if (!title.trim() || !amount.trim() || !category.trim()) return;

    createTransaction({
      user_id: user?.id as string,
      title,
      amount: Number(amount),
      category,
    });

    alert('Votre transaction a été ajoutée avec succès.');
    router.back() ?? router.replace('/');
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <View className="top-safe flex-row items-center justify-between px-px py-6 web:mx-2">
              <Pressable
                onPress={() => {
                  router.back() ?? router.replace('/');
                }}>
                <Icon as={ArrowLeft} size={20} />
              </Pressable>
              <Text variant="large" className="text-gray-800 dark:text-gray-200">
                Ajouter une transaction
              </Text>
              <Pressable
                className="flex flex-row items-center gap-2 font-semibold text-green-500"
                onPress={() => handleSubmit()}>
                valider <Icon as={Check} size={20} className="text-green-500" />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView className="flex-1 p-2">
        <Card className="rounded-xl p-3">
          <Text variant="h3">Ajouter une transaction</Text>
          <Text variant="muted">
            Ajouter une transaction pour suivre vos dépenses et vos revenus.
          </Text>
          <View className="relative mt-2 gap-1.5">
            <Label className="text-base font-semibold">Transaction</Label>
            <Label className="absolute left-2 top-[19px] font-semibold">
              <Icon as={SquarePen} size={16} />
            </Label>
            <Input
              placeholder="e.g. fees"
              keyboardType="default"
              className="border-b border-gray-200 pl-8"
              onChangeText={setTitle}
            />
          </View>
          <View className="relative gap-1.5">
            <Label className="text-base font-semibold">Montant</Label>
            <Label className="absolute left-2.5 top-3 text-base font-semibold">$</Label>
            <Input
              placeholder="0.00"
              keyboardType="numeric"
              className="border-b border-gray-200 pl-6"
              onChangeText={setAmount}
            />
          </View>
          <View className="my-2 flex-row items-center gap-2">
            <Tag size={20} className="text-foreground" />
            <Text variant="h4">Cat&eacute;gorie</Text>
          </View>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <Button
                key={item}
                variant="outline"
                className={cn(
                  'flex-1 rounded-full text-sm font-semibold capitalize dark:text-gray-50',
                  category === item && 'border-0 bg-amber-800 text-amber-50 hover:bg-amber-900'
                )}
                onPress={() => setCategory(item)}>
                {item}
              </Button>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row gap-2 flex-wrap max-w-full"
          />
        </Card>
      </ScrollView>
    </>
  );
}
