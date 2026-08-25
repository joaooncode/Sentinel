import React, { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

import ListHeading from "@/components/ListHeading";
import InsightsBarChart from "@/components/InsightsBarChart";
import HistoryCard from "@/components/HistoryCard";
import InsightsHistoryModal from "@/components/InsightsHistoryModal";
import InsightsPeriodModal, {
  PeriodType,
} from "@/components/InsightsPeriodModal";

import { useSubscriptions } from "@/context/SubscriptionContext";
import {
  HISTORY_TRANSACTIONS,
  INSIGHTS_WEEKLY_DEFAULT,
} from "@/constants/data";
import type { HistoryTransaction, InsightsDayData } from "@/types/subscription";

const SafeAreaView = styled(RNSafeAreaView);

const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function Insights() {
  const router = useRouter();
  const { subscriptions, totalMonthlySpend } = useSubscriptions();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("monthly");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

  // Generate dynamic/hybrid weekly chart data based on active subscriptions
  const weeklyData: InsightsDayData[] = useMemo(() => {
    // Distribute subscription expenses into days of week
    const daysMap: Record<string, { label: string; amount: number }> = {
      Seg: { label: "Seg", amount: 0 },
      Ter: { label: "Ter", amount: 0 },
      Qua: { label: "Qua", amount: 0 },
      Qui: { label: "Qui", amount: 0 },
      Sex: { label: "Sex", amount: 0 },
      Sáb: { label: "Sáb", amount: 0 },
      Dom: { label: "Dom", amount: 0 },
    };

    const dayKeys = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    if (subscriptions.length > 0) {
      subscriptions.forEach((sub) => {
        if (sub.status !== "cancelado") {
          const date = sub.renewalDate ? dayjs(sub.renewalDate) : dayjs();
          const dayIndex = date.day(); // 0 is Dom, 1 is Seg...
          const dayKey = dayKeys[dayIndex];
          if (daysMap[dayKey]) {
            daysMap[dayKey].amount += Math.round(sub.price / 4.33); // approx weekly portion
          }
        }
      });
    }

    // Merge with default proportions if sparse for consistent visual layout
    const calculated = Object.keys(daysMap).map((key) => {
      const defaultItem = INSIGHTS_WEEKLY_DEFAULT.find((d) => d.day === key);
      const calculatedAmount = daysMap[key].amount;
      return {
        day: key,
        label: daysMap[key].label,
        amount:
          calculatedAmount > 0 ? calculatedAmount : defaultItem?.amount || 20,
      };
    });

    return calculated;
  }, [subscriptions]);

  // Combine mocked history transactions with active subscriptions for rich history list
  const historyList: HistoryTransaction[] = useMemo(() => {
    const activeFromContext: HistoryTransaction[] = subscriptions
      .filter((s) => s.status !== "cancelado")
      .slice(0, 3)
      .map((s, idx) => ({
        id: `tx-active-${s.id}-${idx}`,
        name: s.name,
        date: s.renewalDate
          ? `${dayjs(s.renewalDate).format("DD")} de ${
              MONTHS_PT[dayjs(s.renewalDate).month()]
            }, ${dayjs(s.renewalDate).format("HH:mm")}`
          : "25 de Junho, 12:00",
        price: s.price,
        currency: s.currency || "BRL",
        billing: s.billing === "Mensal" ? "por mês" : s.billing,
        color: s.color || (idx % 2 === 0 ? "#f5d03b" : "#8fd1bd"),
        icon: s.icon,
        brandLogoUri: s.brandLogoUri,
        brandHex: s.brandHex,
        lucideIcon: s.lucideIcon,
      }));

    return [...HISTORY_TRANSACTIONS, ...activeFromContext];
  }, [subscriptions]);

  const currentPeriodTitle =
    selectedPeriod === "weekly"
      ? "Insights Semanais"
      : selectedPeriod === "yearly"
        ? "Insights Anuais"
        : "Insights Mensais";

  const currentMonthLabel = `${MONTHS_PT[dayjs().month()]} de ${dayjs().year()}`;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <View className="insights-header">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="insights-icon-btn"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={22} color="#081126" />
        </TouchableOpacity>

        <Text className="insights-title">{currentPeriodTitle}</Text>

        <TouchableOpacity
          onPress={() => setIsPeriodModalOpen(true)}
          className="insights-icon-btn"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Opções de período"
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#081126" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        data={historyList.slice(0, 3)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-36"
        ListHeaderComponent={() => (
          <View>
            {/* Upcoming Section */}
            <ListHeading
              title="Próximas"
              actionText="Ver todos"
              onActionPress={() => router.push("/(tabs)/subscriptions")}
            />

            {/* Weekly Bar Chart Card */}
            <InsightsBarChart
              data={weeklyData}
              totalExpenses={totalMonthlySpend > 0 ? totalMonthlySpend : 424.63}
              periodLabel={currentMonthLabel}
              changePercentage="+12%"
            />

            {/* History Section Heading */}
            <View className="mt-4">
              <ListHeading
                title="Histórico"
                actionText="Ver todos"
                onActionPress={() => setIsHistoryModalOpen(true)}
              />
            </View>
          </View>
        )}
        renderItem={({ item }) => <HistoryCard item={item} />}
      />

      {/* Modals */}
      <InsightsHistoryModal
        visible={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        transactions={historyList}
      />

      <InsightsPeriodModal
        visible={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
      />
    </SafeAreaView>
  );
}
