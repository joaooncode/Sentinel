import React, { useState } from "react";
import { View } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LucideIcon, Star } from "lucide-react-native";
import {
  BRAND_ICON_MAP,
  CATEGORY_ICON_MAP,
} from "@/constants/subscriptionIcons";
import { resolveBrandInfo } from "@/constants/brandIcons";

interface SubscriptionIconProps {
  /** PNG asset local (retrocompatibilidade com dados mock) */
  icon?: ImageSourcePropType;
  /** Nome da assinatura para resolução automática da URL oficial na CDN */
  name?: string;
  /** URL direta do logo oficial (Simple Icons CDN) */
  brandLogoUri?: string;
  /** Cor hexadecimal oficial da marca */
  brandHex?: string;
  /** Chave do mapa de ícones Lucide (categoria ou fallback) */
  lucideIcon?: string;
  /** Tamanho do ícone/logo em pixels (default: 24) */
  size?: number;
  /** Cor padrão caso não use a cor da marca (default: "#081126") */
  color?: string;
  /** Classes NativeWind aplicadas ao wrapper View (ex: "sub-icon", "upcoming-icon") */
  className?: string;
}

/**
 * Componente de ícone de alta eficiência para assinaturas.
 *
 * 1. Se houver `brandLogoUri` (ou se o `name` corresponder a uma marca conhecida),
 *    carrega o SVG oficial da CDN do Simple Icons usando `expo-image` com cache em disco permanente.
 * 2. Se a imagem falhar ou for um serviço genérico, renderiza o ícone vetorial Lucide da categoria.
 * 3. Se for um mock antigo com PNG local (`icon`), renderiza via `expo-image`.
 */
export default function SubscriptionIcon({
  icon,
  name,
  brandLogoUri,
  brandHex,
  lucideIcon,
  size = 24,
  color = "#081126",
  className,
}: SubscriptionIconProps) {
  const [hasRemoteError, setHasRemoteError] = useState(false);

  // 1. Tentar resolver a URL da CDN e a cor da marca
  let finalUri = brandLogoUri;
  if (!finalUri && name) {
    const brandInfo = resolveBrandInfo(name);
    if (brandInfo) {
      finalUri = brandInfo.logoUri;
    }
  }

  // Se tiver URL remota e não deu erro de carregamento:
  if (finalUri && !hasRemoteError) {
    return (
      <View
        className={className ?? "items-center justify-center"}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <ExpoImage
          source={{ uri: finalUri }}
          style={{ width: size, height: size }}
          contentFit="contain"
          cachePolicy="disk"
          transition={150}
          onError={() => setHasRemoteError(true)}
        />
      </View>
    );
  }

  // 2. Se houver ícone Lucide por categoria/fallback
  if (lucideIcon) {
    const ResolvedIcon: LucideIcon =
      BRAND_ICON_MAP[lucideIcon] ?? CATEGORY_ICON_MAP[lucideIcon] ?? Star;

    return (
      <View
        className={className ?? "items-center justify-center"}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <ResolvedIcon size={size} color={color} strokeWidth={1.75} />
      </View>
    );
  }

  // 3. Fallback: ícone PNG local existente (retrocompatível com dados mock)
  if (icon) {
    return (
      <ExpoImage
        source={icon}
        className={className ?? "sub-icon"}
        contentFit="contain"
        style={{ width: size, height: size }}
      />
    );
  }

  // 4. Último fallback: ícone genérico
  return (
    <View
      className={className ?? "items-center justify-center"}
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Star size={size} color={color} strokeWidth={1.75} />
    </View>
  );
}
