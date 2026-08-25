import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ALL_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { resolveSubscriptionIconName } from "@/constants/subscriptionIcons";
import { resolveBrandInfo } from "@/constants/brandIcons";
import type { Subscription, UpcomingSubscription } from "@/types/subscription";
import type { NewSubscriptionFormData } from "@/schemas/subscription";
import dayjs from "dayjs";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  upcomingSubscriptions: UpcomingSubscription[];
  totalMonthlySpend: number;
  addSubscription: (data: NewSubscriptionFormData) => Subscription;
  cancelSubscription: (id: string) => void;
  pauseSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(ALL_SUBSCRIPTIONS);
  const [upcomingSubscriptions] = useState<UpcomingSubscription[]>(
    UPCOMING_SUBSCRIPTIONS,
  );

  const addSubscription = useCallback((data: NewSubscriptionFormData) => {
    // 1. Tentar resolver logo oficial via Simple Icons CDN
    const matchedBrand = resolveBrandInfo(data.name);

    // 2. Se não for marca conhecida, resolver ícone por categoria (Lucide)
    const fallbackLucideKey = !matchedBrand
      ? resolveSubscriptionIconName(data.name, data.category)
      : undefined;

    // Normalizar data para formato ISO
    let renewalIso = dayjs().add(1, "month").toISOString();
    if (data.renewalDate) {
      if (data.renewalDate.includes("/")) {
        const [day, month, year] = data.renewalDate.split("/");
        renewalIso = dayjs(
          `${year}-${month}-${day}T12:00:00.000Z`,
        ).toISOString();
      } else if (data.renewalDate.includes("-")) {
        renewalIso = dayjs(`${data.renewalDate}T12:00:00.000Z`).toISOString();
      }
    }

    const newSub: Subscription = {
      id: `${data.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: data.name,
      price: data.price,
      billing: data.billing,
      category: data.category,
      plan: data.plan || "Padrão",
      paymentMethod: data.paymentMethod || "Não informado",
      status: "ativo",
      startDate: dayjs().toISOString(),
      renewalDate: renewalIso,
      currency: "BRL",
      icon: icons.plus,
      brandLogoUri: matchedBrand?.logoUri,
      brandHex: matchedBrand?.hex,
      lucideIcon: fallbackLucideKey,
      color:
        data.color || (matchedBrand ? `#${matchedBrand.hex}18` : "#8fd1bd"),
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    return newSub;
  }, []);

  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status: "cancelado" } : sub,
      ),
    );
  }, []);

  const pauseSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: "pausado" } : sub)),
    );
  }, []);

  const resumeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: "ativo" } : sub)),
    );
  }, []);

  const totalMonthlySpend = useMemo(() => {
    return subscriptions
      .filter((sub) => sub.status !== "cancelado")
      .reduce((acc, sub) => {
        const monthly =
          sub.billing?.toLowerCase() === "anual"
            ? sub.price / 12
            : sub.billing?.toLowerCase() === "semanal"
              ? sub.price * 4.33
              : sub.price;
        return acc + monthly;
      }, 0);
  }, [subscriptions]);

  const value = useMemo(
    () => ({
      subscriptions,
      upcomingSubscriptions,
      totalMonthlySpend,
      addSubscription,
      cancelSubscription,
      pauseSubscription,
      resumeSubscription,
    }),
    [
      subscriptions,
      upcomingSubscriptions,
      totalMonthlySpend,
      addSubscription,
      cancelSubscription,
      pauseSubscription,
      resumeSubscription,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptions deve ser utilizado dentro de um SubscriptionProvider",
    );
  }
  return context;
};
