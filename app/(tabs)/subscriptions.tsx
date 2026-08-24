import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { ALL_SUBSCRIPTIONS } from "@/constants/data";
import SubscriptionCard from "@/components/SubscriptionCard";
import SearchBar from "@/components/SearchBar";
import { formatCurrency } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";

const SafeAreaView = styled(RNSafeAreaView);

const STATUS_FILTERS = [
  { id: "all", label: "Todos os status" },
  { id: "ativo", label: "Ativos" },
  { id: "pausado", label: "Pausados" },
  { id: "cancelado", label: "Cancelados" },
];

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const unique = new Set<string>();
    ALL_SUBSCRIPTIONS.forEach((sub) => {
      if (sub.category) {
        unique.add(sub.category);
      }
    });
    return ["Todas", ...Array.from(unique)];
  }, []);

  // Filter subscriptions according to query, category and status
  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ALL_SUBSCRIPTIONS.filter((sub) => {
      const matchesCategory =
        selectedCategory === "Todas" || sub.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" ||
        sub.status?.toLowerCase() === selectedStatus.toLowerCase();

      const matchesSearch =
        !query ||
        sub.name.toLowerCase().includes(query) ||
        (sub.category && sub.category.toLowerCase().includes(query)) ||
        (sub.plan && sub.plan.toLowerCase().includes(query));

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Statistics calculation for the summary card
  const activeSubscriptions = useMemo(() => {
    return ALL_SUBSCRIPTIONS.filter((sub) => sub.status !== "cancelado");
  }, []);

  const totalMonthlySpend = useMemo(() => {
    return activeSubscriptions.reduce((acc, sub) => {
      // If annual, approximate monthly fraction
      const monthlyPrice =
        sub.billing?.toLowerCase() === "anual" ? sub.price / 12 : sub.price;
      return acc + monthlyPrice;
    }, 0);
  }, [activeSubscriptions]);

  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedCategory !== "Todas" ||
    selectedStatus !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todas");
    setSelectedStatus("all");
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="pb-36"
        ListHeaderComponent={
          <View className="mb-2">
            {/* Header Title */}
            <View className="mb-1 flex-row items-baseline justify-between">
              <Text className="text-3xl font-sans-extrabold text-primary">
                Assinaturas
              </Text>
              <Text className="text-sm font-sans-semibold text-muted-foreground">
                {filteredSubscriptions.length}{" "}
                {filteredSubscriptions.length === 1 ? "item" : "itens"}
              </Text>
            </View>

            {/* Summary Card */}
            <View className="sub-summary-card">
              <View>
                <Text className="sub-summary-label">Gasto Mensal Estimado</Text>
                <Text className="sub-summary-value">
                  {formatCurrency(totalMonthlySpend)}
                </Text>
              </View>
              <View className="sub-summary-badge">
                <Text className="sub-summary-badge-text">
                  {activeSubscriptions.length} ativas
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <View className="my-2">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar por serviço, plano ou categoria..."
              />
            </View>

            {/* Category Filter Chips */}
            <View className="mt-2 mb-1">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ gap: 8 }}
              >
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <Pressable
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      className={clsx(
                        "category-chip",
                        isActive && "category-chip-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          isActive && "category-chip-text-active",
                        )}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Status Filter Tabs / Chips */}
            <View className="my-2">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ gap: 8 }}
              >
                {STATUS_FILTERS.map((statusItem) => {
                  const isActive = selectedStatus === statusItem.id;
                  return (
                    <Pressable
                      key={statusItem.id}
                      onPress={() => setSelectedStatus(statusItem.id)}
                      className={clsx(
                        "rounded-xl border px-3 py-1.5",
                        isActive
                          ? "border-primary bg-primary"
                          : "border-border bg-card",
                      )}
                    >
                      <Text
                        className={clsx(
                          "text-xs font-sans-semibold",
                          isActive
                            ? "text-background"
                            : "text-muted-foreground",
                        )}
                      >
                        {statusItem.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-16">
            <Ionicons
              name="search-outline"
              size={48}
              color="rgba(0, 0, 0, 0.2)"
            />
            <Text className="mt-4 text-center text-lg font-sans-bold text-primary">
              Nenhuma assinatura encontrada
            </Text>
            <Text className="mt-1 text-center text-sm font-sans-medium text-muted-foreground">
              Tente alterar os termos da busca ou selecione outros filtros.
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={handleResetFilters}
                className="mt-4 rounded-full border border-border bg-card px-4 py-2"
              >
                <Text className="text-sm font-sans-semibold text-primary">
                  Limpar filtros
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
