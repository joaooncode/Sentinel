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

// Helper to convert non-BRL subscriptions for unified chart calculations
const normalizeToBrl = (price: number, currency?: string): number => {
  if (!currency || currency.toUpperCase() === "BRL") return price;
  if (currency.toUpperCase() === "USD") return price * 5.7; // approximate conversion
  if (currency.toUpperCase() === "EUR") return price * 6.2;
  return price;
};

export default function Insights() {
  const router = useRouter();
  const { subscriptions, totalMonthlySpend } = useSubscriptions();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("monthly");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

  // Generate dynamic chart data based on active subscriptions and selected period
  const chartData: InsightsDayData[] = useMemo(() => {
    if (selectedPeriod === "yearly") {
      // 4 Quarters / Bimesters
      const bimestres: Record<string, { label: string; amount: number }> = {
        Q1: { label: "Jan-Mar", amount: 0 },
        Q2: { label: "Abr-Jun", amount: 0 },
        Q3: { label: "Jul-Set", amount: 0 },
        Q4: { label: "Out-Dez", amount: 0 },
      };

      subscriptions.forEach((sub) => {
        if (sub.status !== "cancelado") {
          const normPrice = normalizeToBrl(sub.price, sub.currency);
          const yearlyPortion =
            sub.billing === "Anual"
              ? normPrice
              : sub.billing === "Semanal"
                ? normPrice * 52
                : normPrice * 12;
          const quarterAmount = Math.round(yearlyPortion / 4);
          bimestres.Q1.amount += quarterAmount;
          bimestres.Q2.amount += quarterAmount;
          bimestres.Q3.amount += quarterAmount;
          bimestres.Q4.amount += quarterAmount;
        }
      });

      return Object.keys(bimestres).map((key) => ({
        day: key,
        label: bimestres[key].label,
        amount: bimestres[key].amount,
      }));
    }

    if (selectedPeriod === "monthly") {
      // 4 Weeks of the Month
      const weeks: Record<string, { label: string; amount: number }> = {
        W1: { label: "Sem 1", amount: 0 },
        W2: { label: "Sem 2", amount: 0 },
        W3: { label: "Sem 3", amount: 0 },
        W4: { label: "Sem 4", amount: 0 },
      };

      subscriptions.forEach((sub) => {
        if (sub.status !== "cancelado") {
          const normPrice = normalizeToBrl(sub.price, sub.currency);
          const monthlyPortion =
            sub.billing === "Anual"
              ? normPrice / 12
              : sub.billing === "Semanal"
                ? normPrice * 4.33
                : normPrice;
          const weeklySplit = Math.round(monthlyPortion / 4);
          weeks.W1.amount += weeklySplit;
          weeks.W2.amount += weeklySplit;
          weeks.W3.amount += weeklySplit;
          weeks.W4.amount += weeklySplit;
        }
      });

      return Object.keys(weeks).map((key) => ({
        day: key,
        label: weeks[key].label,
        amount: weeks[key].amount,
      }));
    }

    // Default: Weekly view (Seg - Dom)
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

    subscriptions.forEach((sub) => {
      if (sub.status !== "cancelado") {
        const normPrice = normalizeToBrl(sub.price, sub.currency);
        const date = sub.renewalDate ? dayjs(sub.renewalDate) : dayjs();
        const dayIndex = date.day(); // 0 is Dom, 1 is Seg...
        const dayKey = dayKeys[dayIndex];
        if (daysMap[dayKey]) {
          daysMap[dayKey].amount += Math.round(normPrice / 4.33); // weekly portion
        }
      }
    });

    return Object.keys(daysMap).map((key) => ({
      day: key,
      label: daysMap[key].label,
      amount: daysMap[key].amount,
    }));
  }, [subscriptions, selectedPeriod]);

  // Dynamic period totals and labels
  const { periodTotal, periodLabel, currentPeriodTitle } = useMemo(() => {
    if (selectedPeriod === "yearly") {
      return {
        periodTotal: totalMonthlySpend * 12,
        periodLabel: `Ano de ${dayjs().year()}`,
        currentPeriodTitle: "Insights Anuais",
      };
    }
    if (selectedPeriod === "weekly") {
      return {
        periodTotal: Math.round(totalMonthlySpend / 4.33),
        periodLabel: "Semana Atual",
        currentPeriodTitle: "Insights Semanais",
      };
    }
    return {
      periodTotal: totalMonthlySpend,
      periodLabel: `${MONTHS_PT[dayjs().month()]} de ${dayjs().year()}`,
      currentPeriodTitle: "Insights Mensais",
    };
  }, [selectedPeriod, totalMonthlySpend]);

  // Derive history from actual subscriptions
  const historyList: HistoryTransaction[] = useMemo(() => {
    return subscriptions
      .filter((s) => s.status !== "cancelado")
      .map((s, idx) => ({
        id: `tx-${s.id}-${idx}`,
        name: s.name,
        date: s.renewalDate
          ? `${dayjs(s.renewalDate).format("DD")} de ${
              MONTHS_PT[dayjs(s.renewalDate).month()]
            }, ${dayjs(s.renewalDate).format("HH:mm")}`
          : `${dayjs().format("DD")} de ${MONTHS_PT[dayjs().month()]}, 12:00`,
        price: s.price,
        currency: s.currency || "BRL",
        billing: s.billing === "Mensal" ? "por mês" : s.billing,
        color: s.color || (idx % 2 === 0 ? "#f5d03b" : "#8fd1bd"),
        icon: s.icon,
        brandLogoUri: s.brandLogoUri,
        brandHex: s.brandHex,
        lucideIcon: s.lucideIcon,
      }));
  }, [subscriptions]);

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
        data={historyList.slice(0, 5)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-36"
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-8">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              Nenhuma transação registrada no período.
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            {/* Upcoming Section */}
            <ListHeading
              title="Próximas"
              actionText="Ver todos"
              onActionPress={() => router.push("/(tabs)/subscriptions")}
            />

            {/* Bar Chart Card */}
            <InsightsBarChart
              data={chartData}
              totalExpenses={periodTotal}
              periodLabel={periodLabel}
              changePercentage={periodTotal > 0 ? "+12%" : "0%"}
            />

            {/* History Section Heading */}
            <View className="mt-4">
              <ListHeading
                title="Histórico"
                actionText="Ver todos"
                onActionPress={
                  historyList.length > 0
                    ? () => setIsHistoryModalOpen(true)
                    : undefined
                }
                showAction={historyList.length > 0}
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
