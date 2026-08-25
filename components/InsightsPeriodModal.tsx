import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export type PeriodType = "weekly" | "monthly" | "yearly";

interface InsightsPeriodModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPeriod: PeriodType;
  onSelectPeriod: (period: PeriodType) => void;
}

const PERIOD_OPTIONS: { id: PeriodType; label: string; description: string }[] =
  [
    {
      id: "weekly",
      label: "Semanal",
      description: "Visualizar gastos distribuídos por dias da semana",
    },
    {
      id: "monthly",
      label: "Mensal",
      description: "Visualizar consolidação e histórico do mês atual",
    },
    {
      id: "yearly",
      label: "Anual",
      description: "Visão macro e projeção acumulada do ano",
    },
  ];

export default function InsightsPeriodModal({
  visible,
  onClose,
  selectedPeriod,
  onSelectPeriod,
}: InsightsPeriodModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="modal-overlay justify-end">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                paddingBottom: Math.max(insets.bottom, 20),
              }}
              className="modal-container"
            >
              {/* Header */}
              <View className="modal-header">
                <Text className="modal-title">Período de Análise</Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="modal-close"
                  accessibilityRole="button"
                  accessibilityLabel="Fechar"
                >
                  <Ionicons name="close" size={20} color="#081126" />
                </TouchableOpacity>
              </View>

              {/* Options */}
              <View className="p-5 gap-3">
                {PERIOD_OPTIONS.map((opt) => {
                  const isSelected = selectedPeriod === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => {
                        onSelectPeriod(opt.id);
                        onClose();
                      }}
                      activeOpacity={0.7}
                      className={`flex-row items-center justify-between rounded-2xl border p-4 ${
                        isSelected
                          ? "border-accent bg-accent/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <View className="flex-1">
                        <Text
                          className={`text-base ${
                            isSelected
                              ? "font-sans-bold text-accent"
                              : "font-sans-bold text-primary"
                          }`}
                        >
                          {opt.label}
                        </Text>
                        <Text className="mt-0.5 text-xs font-sans-medium text-muted-foreground">
                          {opt.description}
                        </Text>
                      </View>

                      {isSelected && (
                        <View className="size-6 items-center justify-center rounded-full bg-accent">
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#ffffff"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
