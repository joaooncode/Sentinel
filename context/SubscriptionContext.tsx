import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ALL_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
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
    // Resolver ícone
    let iconSource = icons.plus;
    if (data.iconKey && data.iconKey in icons) {
      iconSource = icons[data.iconKey as keyof typeof icons];
    } else {
      // Tenta inferir pelo nome
      const lowerName = data.name.toLowerCase();
      if (lowerName.includes("spotify")) iconSource = icons.spotify;
      else if (lowerName.includes("notion")) iconSource = icons.notion;
      else if (lowerName.includes("figma")) iconSource = icons.figma;
      else if (lowerName.includes("chatgpt") || lowerName.includes("openai"))
        iconSource = icons.openai;
      else if (lowerName.includes("claude")) iconSource = icons.claude;
      else if (lowerName.includes("adobe")) iconSource = icons.adobe;
      else if (lowerName.includes("github")) iconSource = icons.github;
      else if (lowerName.includes("canva")) iconSource = icons.canva;
      else if (lowerName.includes("dropbox")) iconSource = icons.dropbox;
      else if (lowerName.includes("medium")) iconSource = icons.medium;
    }

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
      icon: iconSource,
      color: data.color || "#8fd1bd",
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
