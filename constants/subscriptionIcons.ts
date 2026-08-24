import {
  Apple,
  BookOpen,
  Bot,
  Briefcase,
  Cloud,
  Code2,
  Globe,
  Languages,
  Layers,
  ListTodo,
  LucideIcon,
  MessageSquare,
  MessagesSquare,
  Monitor,
  Music2,
  NotebookPen,
  Paintbrush,
  Play,
  Rocket,
  Server,
  Star,
  Tv2,
  Video,
  Dumbbell,
  ShoppingBag,
  Newspaper,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Map,
} from "lucide-react-native";

/**
 * Mapeia keywords (lowercase) de nomes de marcas para um ícone Lucide.
 * A chave pode ser qualquer substring do nome da assinatura.
 */
export const BRAND_ICON_MAP: Record<string, LucideIcon> = {
  // Música & Streaming de Áudio
  spotify: Music2,
  deezer: Music2,
  tidal: Music2,
  "apple music": Music2,

  // Vídeo & Streaming
  netflix: Tv2,
  "hbo max": Tv2,
  "max ": Tv2,
  "prime video": Tv2,
  "amazon prime": Tv2,
  "disney+": Tv2,
  "disney plus": Tv2,
  "paramount+": Tv2,
  "apple tv": Tv2,
  peacock: Tv2,
  crunchyroll: Tv2,
  globoplay: Tv2,

  // Plataformas de Vídeo
  youtube: Play,
  twitch: Play,
  vimeo: Play,

  // Dev & Code
  github: Code2,
  gitlab: Code2,
  bitbucket: Code2,
  "jetbrains ": Code2,
  "vs code": Code2,

  // Design
  figma: Paintbrush,
  canva: Paintbrush,
  "adobe ": Paintbrush,
  sketch: Paintbrush,
  "affinity ": Paintbrush,

  // Produtividade & Notas
  notion: NotebookPen,
  obsidian: NotebookPen,
  evernote: NotebookPen,
  "roam ": NotebookPen,
  "bear ": NotebookPen,

  // IA
  openai: Bot,
  chatgpt: Bot,
  claude: Bot,
  gemini: Bot,
  midjourney: Bot,
  "cursor ": Bot,

  // Cloud & Storage
  dropbox: Cloud,
  "google drive": Cloud,
  icloud: Cloud,
  "one drive": Cloud,
  onedrive: Cloud,
  backblaze: Cloud,

  // Comunicação
  discord: MessageSquare,
  slack: MessagesSquare,
  "microsoft teams": MessagesSquare,
  teams: MessagesSquare,
  telegram: MessageSquare,
  zoom: Video,
  "google meet": Video,

  // Leitura & Mídia
  medium: BookOpen,
  substack: BookOpen,
  kindle: BookOpen,
  audible: BookOpen,
  "pocket ": BookOpen,

  // Apple
  "apple one": Apple,
  "apple arcade": Apple,

  // Google & Microsoft
  google: Globe,
  "microsoft 365": Monitor,
  "office 365": Monitor,
  "microsoft ": Monitor,

  // Cloud / Infra
  aws: Server,
  "amazon web": Server,
  "google cloud": Server,
  "azure ": Server,
  "digital ocean": Server,

  // DevOps / Deploy
  vercel: Rocket,
  railway: Rocket,
  render: Rocket,
  netlify: Rocket,
  heroku: Rocket,

  // Gestão / PM
  linear: ListTodo,
  jira: ListTodo,
  asana: ListTodo,
  trello: ListTodo,
  monday: ListTodo,
  clickup: ListTodo,
  basecamp: ListTodo,

  // Idiomas
  duolingo: Languages,
  babbel: Languages,
  rosetta: Languages,

  // Fitness & Saúde
  nike: Dumbbell,
  peloton: Dumbbell,
  strava: Dumbbell,
  calm: HeartPulse,
  headspace: HeartPulse,

  // Jogos
  "xbox ": Gamepad2,
  "playstation ": Gamepad2,
  "nintendo ": Gamepad2,
  "ea play": Gamepad2,
  "game pass": Gamepad2,

  // Educação
  coursera: GraduationCap,
  udemy: GraduationCap,
  alura: GraduationCap,
  pluralsight: GraduationCap,
  "linkedin learning": GraduationCap,

  // Notícias
  "new york times": Newspaper,
  "the economist": Newspaper,
  bloomberg: Newspaper,

  // Mapas
  "google maps": Map,
  waze: Map,

  // E-commerce / Compras
  amazon: ShoppingBag,
};

/**
 * Mapeia categorias da assinatura para um ícone Lucide de fallback semântico.
 */
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Entretenimento: Tv2,
  Música: Music2,
  "Ferramentas IA": Bot,
  "Ferramentas Dev": Code2,
  Design: Paintbrush,
  Produtividade: NotebookPen,
  Nuvem: Cloud,
  Comunicação: MessagesSquare,
  Educação: GraduationCap,
  Saúde: HeartPulse,
  Jogos: Gamepad2,
  Leitura: BookOpen,
  Negócios: Briefcase,
  Outros: Star,
};

/**
 * Resolve o ícone Lucide mais adequado para uma assinatura.
 * Primeiro busca por keyword de marca no nome, depois usa a categoria como fallback.
 *
 * @param name - Nome da assinatura (case-insensitive)
 * @param category - Categoria da assinatura (opcional)
 * @returns O componente Lucide correspondente
 */
export function resolveSubscriptionIcon(
  name: string,
  category?: string,
): LucideIcon {
  const lowerName = name.toLowerCase();

  // 1. Busca por marca conhecida
  for (const [keyword, Icon] of Object.entries(BRAND_ICON_MAP)) {
    if (lowerName.includes(keyword)) {
      return Icon;
    }
  }

  // 2. Fallback por categoria
  if (category) {
    for (const [cat, Icon] of Object.entries(CATEGORY_ICON_MAP)) {
      if (category.toLowerCase().includes(cat.toLowerCase())) {
        return Icon;
      }
    }
  }

  // 3. Fallback genérico
  return Star;
}

/**
 * Retorna o nome (string) do ícone Lucide para armazenar no modelo de dados.
 * Útil para serialização.
 */
export function resolveSubscriptionIconName(
  name: string,
  category?: string,
): string {
  const lowerName = name.toLowerCase();

  for (const [keyword] of Object.entries(BRAND_ICON_MAP)) {
    if (lowerName.includes(keyword)) {
      return keyword;
    }
  }

  if (category) {
    for (const [cat] of Object.entries(CATEGORY_ICON_MAP)) {
      if (category.toLowerCase().includes(cat.toLowerCase())) {
        return cat;
      }
    }
  }

  return "default";
}
