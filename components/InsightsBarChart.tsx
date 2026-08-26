import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { InsightsDayData } from "@/types/subscription";
import { formatCurrency } from "@/lib/utils";

interface InsightsBarChartProps {
  data: InsightsDayData[];
  totalExpenses?: number;
  periodLabel?: string;
  changePercentage?: string;
}

const CHART_TOTAL_HEIGHT = 195;
const TOP_OFFSET = 32;
const BASELINE_TOP = 150;
const MAX_BAR_HEIGHT = BASELINE_TOP - TOP_OFFSET; // 118px

export default function InsightsBarChart({
  data,
  totalExpenses = 424.63,
  periodLabel = "Março de 2026",
  changePercentage = "+12%",
}: InsightsBarChartProps) {
  // Dynamically calculate maxY to prevent bar overflow
  const maxY = useMemo(() => {
    const maxDataAmount = Math.max(...data.map((d) => d.amount), 0);
    return Math.max(45, Math.ceil(maxDataAmount / 10) * 10);
  }, [data]);

  const yAxisValues = useMemo(() => {
    return [
      maxY,
      Math.round(maxY * 0.77),
      Math.round(maxY * 0.55),
      Math.round(maxY * 0.15),
      0,
    ];
  }, [maxY]);

  // Default selected day to 'Qui' / 'Thr' or index 3
  const initialIndex = data.findIndex(
    (d) => d.day === "Qui" || d.day === "Thr" || d.label === "Qui",
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(
    initialIndex !== -1 ? initialIndex : 3,
  );

  return (
    <View className="insights-chart-card">
      {/* Chart Area */}
      <View
        style={{ height: CHART_TOTAL_HEIGHT }}
        className="relative justify-between"
      >
        {/* Horizontal Dashed Grid Lines & Y-Axis Labels */}
        {yAxisValues.map((val) => {
          const ratio = (maxY - val) / maxY;
          const topPosition = TOP_OFFSET + ratio * (BASELINE_TOP - TOP_OFFSET);

          return (
            <View
              key={val}
              style={{ top: topPosition }}
              className="absolute left-0 right-0 flex-row items-center"
            >
              <Text className="w-7 text-[11px] font-sans-medium text-muted-foreground">
                {val}
              </Text>
              <View
                style={{
                  borderStyle: "dashed",
                  borderWidth: 0.5,
                  borderColor: "rgba(0, 0, 0, 0.12)",
                }}
                className="h-0 flex-1"
              />
            </View>
          );
        })}

        {/* Bars Container */}
        <View
          style={{ height: CHART_TOTAL_HEIGHT }}
          className="absolute bottom-0 left-8 right-1 top-0 flex-row items-end justify-between px-1"
        >
          {data.map((item, index) => {
            const isSelected = selectedIndex === index;
            const barHeight = Math.max(
              14,
              Math.min(MAX_BAR_HEIGHT, (item.amount / maxY) * MAX_BAR_HEIGHT),
            );

            return (
              <Pressable
                key={item.day}
                onPress={() => setSelectedIndex(index)}
                className="items-center"
                style={{ width: 38 }}
                accessibilityRole="button"
                accessibilityLabel={`${item.label}: ${formatCurrency(item.amount)}`}
              >
                {/* Floating Tooltip above active bar - Never wrap lines */}
                {isSelected && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: barHeight + 28,
                      alignItems: "center",
                      alignSelf: "center",
                      zIndex: 30,
                      minWidth: 70,
                    }}
                    pointerEvents="none"
                  >
                    <View className="flex-row items-center justify-center rounded-xl border border-accent/30 bg-background px-2.5 py-1 shadow-sm">
                      <Text
                        numberOfLines={1}
                        style={{ flexShrink: 0 }}
                        className="text-xs font-sans-bold text-accent"
                      >
                        {formatCurrency(item.amount)}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Vertical Pill Bar */}
                <View
                  style={{
                    height: barHeight,
                    width: 14,
                    borderRadius: 9999,
                  }}
                  className={isSelected ? "bg-accent" : "bg-primary"}
                />

                {/* Day Label */}
                <Text
                  className={`mt-2 text-xs ${
                    isSelected
                      ? "font-sans-bold text-accent"
                      : "font-sans-semibold text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Expenses Summary Footer */}
      <View className="insights-expenses-box">
        <View>
          <Text className="text-xl font-sans-bold text-primary">Despesas</Text>
          <Text className="mt-0.5 text-sm font-sans-semibold text-muted-foreground">
            {periodLabel}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-2xl font-sans-extrabold text-primary">
            -{formatCurrency(totalExpenses)}
          </Text>
          <Text className="mt-0.5 text-xs font-sans-semibold text-muted-foreground">
            {changePercentage}
          </Text>
        </View>
      </View>
    </View>
  );
}
