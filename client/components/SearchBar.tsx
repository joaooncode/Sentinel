import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar assinaturas...",
  onClear,
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View className="search-wrap">
      <Ionicons name="search-outline" size={20} color="rgba(0, 0, 0, 0.5)" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        className="search-input"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="search-clear"
          accessibilityLabel="Limpar busca"
        >
          <Ionicons name="close" size={14} color="#081126" />
        </TouchableOpacity>
      )}
    </View>
  );
}
