import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { HistoryTransaction } from "@/types/subscription";
import HistoryCard from "@/components/HistoryCard";
import SearchBar from "@/components/SearchBar";

interface InsightsHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  transactions: HistoryTransaction[];
}

export default function InsightsHistoryModal({
  visible,
  onClose,
  transactions,
}: InsightsHistoryModalProps) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = transactions.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="modal-overlay justify-end">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                paddingBottom: Math.max(insets.bottom, 20),
                maxHeight: "85%",
              }}
              className="modal-container"
            >
              {/* Header */}
              <View className="modal-header">
                <Text className="modal-title">Histórico de Cobranças</Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="modal-close"
                  accessibilityRole="button"
                  accessibilityLabel="Fechar histórico"
                >
                  <Ionicons name="close" size={20} color="#081126" />
                </TouchableOpacity>
              </View>

              {/* Search & List */}
              <View className="p-5">
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Buscar cobrança..."
                />
              </View>

              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                }}
                renderItem={({ item }) => <HistoryCard item={item} />}
                ListEmptyComponent={
                  <View className="items-center justify-center py-10">
                    <Text className="text-base font-sans-medium text-muted-foreground">
                      Nenhuma cobrança encontrada.
                    </Text>
                  </View>
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
