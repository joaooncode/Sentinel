import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { clsx } from "clsx";
import {
  BILLING_CYCLES,
  BillingCycle,
  DEFAULT_CATEGORIES,
  FormValidationErrors,
  newSubscriptionSchema,
} from "@/schemas/subscription";
import { useSubscriptions } from "@/context/SubscriptionContext";

interface NewSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewSubscriptionModal({
  visible,
  onClose,
}: NewSubscriptionModalProps) {
  const { addSubscription } = useSubscriptions();
  const insets = useSafeAreaInsets();

  // Estados dos campos do formulário
  const [name, setName] = useState("");
  const [priceText, setPriceText] = useState("");
  const [billing, setBilling] = useState<BillingCycle>("Mensal");
  const [category, setCategory] = useState<string>("Produtividade");
  const [customCategory, setCustomCategory] = useState("");

  // Erros e status de envio
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manipulador de preço
  const handlePriceChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9.,]/g, "").replace(",", ".");
    setPriceText(cleaned);
    setErrors((prev) => ({ ...prev, price: undefined }));
  }, []);

  // Reset do formulário ao fechar
  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    setName("");
    setPriceText("");
    setBilling("Mensal");
    setCategory("Produtividade");
    setCustomCategory("");
    setErrors({});
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  // Submissão e validação com Zod
  const handleSubmit = async () => {
    Keyboard.dismiss();
    const numericPrice = parseFloat(priceText);
    const finalCategory =
      category === "Outros" && customCategory.trim()
        ? customCategory.trim()
        : category;

    const rawFormData = {
      name,
      price: isNaN(numericPrice) ? 0 : numericPrice,
      billing,
      category: finalCategory,
    };

    const validation = newSubscriptionSchema.safeParse(rawFormData);

    if (!validation.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
        () => {},
      );
      const fieldErrors: FormValidationErrors = {};
      const issues = validation.error.issues || [];
      issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FormValidationErrors;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );

      addSubscription(validation.data);
      handleClose();
    } catch {
      setErrors({
        name: "Ocorreu um erro ao salvar a assinatura. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = useMemo(() => {
    return name.trim().length >= 2 && parseFloat(priceText) > 0;
  }, [name, priceText]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Overlay — toca fora para fechar */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/30" />
      </TouchableWithoutFeedback>

      {/* Bottom sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
      >
        <View
          className="rounded-t-3xl bg-background"
          style={{ paddingBottom: insets.bottom || 24 }}
        >
          {/* Handle bar */}
          <View className="items-center pt-3 pb-1">
            <View className="h-1 w-10 rounded-full bg-border" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
            <Text className="text-2xl font-sans-bold text-primary">
              Nova Assinatura
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.7}
              className="size-9 items-center justify-center rounded-full bg-muted"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-base font-sans-bold text-primary">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form Scrollable */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 8,
              gap: 20,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 520 }}
          >
            {/* Campo: Nome */}
            <View style={{ gap: 6 }}>
              <Text className="text-sm font-sans-bold text-primary">Nome</Text>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Nome da assinatura"
                placeholderTextColor="rgba(0, 0, 0, 0.35)"
                className={clsx(
                  "rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary",
                  errors.name && "border-destructive",
                )}
              />
              {errors.name ? (
                <Text className="text-xs font-sans-medium text-destructive">
                  {errors.name}
                </Text>
              ) : null}
            </View>

            {/* Campo: Valor */}
            <View style={{ gap: 6 }}>
              <Text className="text-sm font-sans-bold text-primary">Valor</Text>
              <TextInput
                value={priceText}
                onChangeText={handlePriceChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="rgba(0, 0, 0, 0.35)"
                className={clsx(
                  "rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary",
                  errors.price && "border-destructive",
                )}
              />
              {errors.price ? (
                <Text className="text-xs font-sans-medium text-destructive">
                  {errors.price}
                </Text>
              ) : null}
            </View>

            {/* Campo: Frequência */}
            <View style={{ gap: 6 }}>
              <Text className="text-sm font-sans-bold text-primary">
                Frequência
              </Text>
              <View className="flex-row gap-3">
                {BILLING_CYCLES.map((cycle) => {
                  const isSelected = billing === cycle;
                  return (
                    <TouchableOpacity
                      key={cycle}
                      onPress={() => {
                        Haptics.impactAsync(
                          Haptics.ImpactFeedbackStyle.Light,
                        ).catch(() => {});
                        setBilling(cycle);
                        setErrors((prev) => ({
                          ...prev,
                          billing: undefined,
                        }));
                      }}
                      activeOpacity={0.8}
                      className={clsx(
                        "flex-1 items-center rounded-2xl border py-4",
                        isSelected
                          ? "border-accent/40 bg-accent/15"
                          : "border-border bg-card",
                      )}
                    >
                      <Text
                        className={clsx(
                          "text-sm font-sans-semibold",
                          isSelected ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        {cycle}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.billing ? (
                <Text className="text-xs font-sans-medium text-destructive">
                  {errors.billing}
                </Text>
              ) : null}
            </View>

            {/* Campo: Categoria */}
            <View style={{ gap: 6 }}>
              <Text className="text-sm font-sans-bold text-primary">
                Categoria
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        Haptics.impactAsync(
                          Haptics.ImpactFeedbackStyle.Light,
                        ).catch(() => {});
                        setCategory(cat);
                        setErrors((prev) => ({
                          ...prev,
                          category: undefined,
                        }));
                      }}
                      activeOpacity={0.8}
                      className={clsx(
                        "rounded-full border px-4 py-2",
                        isSelected
                          ? "border-accent/40 bg-accent/15"
                          : "border-border bg-card",
                      )}
                    >
                      <Text
                        className={clsx(
                          "text-sm font-sans-semibold",
                          isSelected ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {category === "Outros" ? (
                <TextInput
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  placeholder="Especifique a categoria personalizada"
                  placeholderTextColor="rgba(0, 0, 0, 0.35)"
                  className="mt-1 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-sans-medium text-primary"
                />
              ) : null}
              {errors.category ? (
                <Text className="text-xs font-sans-medium text-destructive">
                  {errors.category}
                </Text>
              ) : null}
            </View>

            {/* Botão de Criação */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              activeOpacity={0.85}
              className={clsx(
                "items-center rounded-2xl bg-accent py-4",
                (isSubmitting || !isFormValid) && "bg-accent/50",
              )}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#081126" />
              ) : (
                <Text className="text-base font-sans-bold text-primary">
                  Criar Assinatura
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
