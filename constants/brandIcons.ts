export interface BrandConfig {
  slug: string;
  hex?: string;
  name: string;
}

/**
 * Mapeamento inteligente de keywords para slugs e cores oficiais da CDN do Simple Icons.
 * A CDN (cdn.simpleicons.org) possui +3.000 marcas atualizadas diariamente.
 */
export const BRAND_MAP: Record<string, BrandConfig> = {
  // Streaming de Música & Áudio
  spotify: { slug: "spotify", hex: "1ED760", name: "Spotify" },
  deezer: { slug: "deezer", hex: "A238FF", name: "Deezer" },
  tidal: { slug: "tidal", hex: "000000", name: "Tidal" },
  "apple music": { slug: "applemusic", hex: "FA243C", name: "Apple Music" },
  "youtube music": {
    slug: "youtubemusic",
    hex: "FF0000",
    name: "YouTube Music",
  },
  audible: { slug: "audible", hex: "F8991C", name: "Audible" },
  soundcloud: { slug: "soundcloud", hex: "FF5500", name: "SoundCloud" },

  // Streaming de Vídeo
  netflix: { slug: "netflix", hex: "E50914", name: "Netflix" },
  "prime video": { slug: "primevideo", hex: "00A8E1", name: "Prime Video" },
  "amazon prime": { slug: "primevideo", hex: "00A8E1", name: "Prime Video" },
  primevideo: { slug: "primevideo", hex: "00A8E1", name: "Prime Video" },
  "disney+": { slug: "disneyplus", hex: "113CCF", name: "Disney+" },
  "disney plus": { slug: "disneyplus", hex: "113CCF", name: "Disney+" },
  disney: { slug: "disneyplus", hex: "113CCF", name: "Disney+" },
  "hbo max": { slug: "hbomax", hex: "9900FF", name: "HBO Max" },
  hbo: { slug: "hbo", hex: "000000", name: "HBO" },
  max: { slug: "max", hex: "002BE7", name: "Max" },
  "apple tv": { slug: "appletv", hex: "000000", name: "Apple TV" },
  "paramount+": { slug: "paramountplus", hex: "0064FF", name: "Paramount+" },
  paramount: { slug: "paramountplus", hex: "0064FF", name: "Paramount+" },
  crunchyroll: { slug: "crunchyroll", hex: "F47521", name: "Crunchyroll" },
  youtube: { slug: "youtube", hex: "FF0000", name: "YouTube" },
  twitch: { slug: "twitch", hex: "9146FF", name: "Twitch" },
  vimeo: { slug: "vimeo", hex: "1AB7EA", name: "Vimeo" },
  globoplay: { slug: "globoplay", hex: "FB0036", name: "Globoplay" },

  // Inteligência Artificial & Ferramentas Dev
  openai: { slug: "openai", hex: "000000", name: "OpenAI" },
  chatgpt: { slug: "openai", hex: "10A37F", name: "ChatGPT" },
  claude: { slug: "claude", hex: "D97757", name: "Claude" },
  anthropic: { slug: "anthropic", hex: "191919", name: "Anthropic" },
  midjourney: { slug: "midjourney", hex: "000000", name: "Midjourney" },
  cursor: { slug: "cursor", hex: "000000", name: "Cursor" },
  github: { slug: "github", hex: "181717", name: "GitHub" },
  "github copilot": {
    slug: "githubcopilot",
    hex: "000000",
    name: "GitHub Copilot",
  },
  copilot: { slug: "githubcopilot", hex: "000000", name: "Copilot" },
  gitlab: { slug: "gitlab", hex: "FC6D26", name: "GitLab" },
  bitbucket: { slug: "bitbucket", hex: "0052CC", name: "Bitbucket" },
  jetbrains: { slug: "jetbrains", hex: "000000", name: "JetBrains" },
  "vs code": { slug: "visualstudiocode", hex: "007ACC", name: "VS Code" },
  vscode: { slug: "visualstudiocode", hex: "007ACC", name: "VS Code" },

  // Design & Criatividade
  figma: { slug: "figma", hex: "F24E1E", name: "Figma" },
  canva: { slug: "canva", hex: "00C4CC", name: "Canva" },
  adobe: { slug: "adobe", hex: "FF0000", name: "Adobe" },
  photoshop: { slug: "adobephotoshop", hex: "31A8FF", name: "Photoshop" },
  illustrator: { slug: "adobeillustrator", hex: "FF9A00", name: "Illustrator" },
  framer: { slug: "framer", hex: "0055FF", name: "Framer" },
  sketch: { slug: "sketch", hex: "F7B500", name: "Sketch" },

  // Produtividade & Gestão
  notion: { slug: "notion", hex: "000000", name: "Notion" },
  obsidian: { slug: "obsidian", hex: "7C3AED", name: "Obsidian" },
  evernote: { slug: "evernote", hex: "00A82D", name: "Evernote" },
  linear: { slug: "linear", hex: "5E6AD2", name: "Linear" },
  jira: { slug: "jira", hex: "0052CC", name: "Jira" },
  trello: { slug: "trello", hex: "0052CC", name: "Trello" },
  asana: { slug: "asana", hex: "F06A6A", name: "Asana" },
  clickup: { slug: "clickup", hex: "7B68EE", name: "ClickUp" },
  monday: { slug: "mondaydotcom", hex: "FF3D57", name: "Monday.com" },
  todoist: { slug: "todoist", hex: "E44332", name: "Todoist" },

  // Cloud & Hospedagem
  dropbox: { slug: "dropbox", hex: "0061FF", name: "Dropbox" },
  "google drive": { slug: "googledrive", hex: "4285F4", name: "Google Drive" },
  "google cloud": { slug: "googlecloud", hex: "4285F4", name: "Google Cloud" },
  googlecloud: { slug: "googlecloud", hex: "4285F4", name: "Google Cloud" },
  aws: { slug: "amazonwebservices", hex: "232F3E", name: "AWS" },
  amazon: { slug: "amazon", hex: "FF9900", name: "Amazon" },
  digitalocean: { slug: "digitalocean", hex: "0080FF", name: "DigitalOcean" },
  "digital ocean": {
    slug: "digitalocean",
    hex: "0080FF",
    name: "DigitalOcean",
  },
  vercel: { slug: "vercel", hex: "000000", name: "Vercel" },
  railway: { slug: "railway", hex: "0B0D0E", name: "Railway" },
  render: { slug: "render", hex: "000000", name: "Render" },
  netlify: { slug: "netlify", hex: "00C7B7", name: "Netlify" },
  heroku: { slug: "heroku", hex: "430098", name: "Heroku" },

  // Comunicação
  discord: { slug: "discord", hex: "5865F2", name: "Discord" },
  slack: { slug: "slack", hex: "4A154B", name: "Slack" },
  telegram: { slug: "telegram", hex: "26A5E4", name: "Telegram" },
  zoom: { slug: "zoom", hex: "0B5CFF", name: "Zoom" },
  "microsoft teams": { slug: "microsoftteams", hex: "6264A7", name: "Teams" },
  teams: { slug: "microsoftteams", hex: "6264A7", name: "Teams" },
  whatsapp: { slug: "whatsapp", hex: "25D366", name: "WhatsApp" },

  // Educação & Idiomas
  duolingo: { slug: "duolingo", hex: "58CC02", name: "Duolingo" },
  babbel: { slug: "babbel", hex: "F37021", name: "Babbel" },
  coursera: { slug: "coursera", hex: "0056D2", name: "Coursera" },
  udemy: { slug: "udemy", hex: "A435F0", name: "Udemy" },
  alura: { slug: "alura", hex: "001E61", name: "Alura" },
  linkedin: { slug: "linkedin", hex: "0A66C2", name: "LinkedIn" },

  // Jogos & Games
  xbox: { slug: "xbox", hex: "107C10", name: "Xbox" },
  playstation: { slug: "playstation", hex: "003791", name: "PlayStation" },
  psn: { slug: "playstation", hex: "003791", name: "PlayStation" },
  steam: { slug: "steam", hex: "000000", name: "Steam" },
  nintendo: { slug: "nintendoswitch", hex: "E60012", name: "Nintendo" },
  "ea play": { slug: "ea", hex: "FF4747", name: "EA Play" },

  // Saúde, Fitness & Estilo de Vida
  strava: { slug: "strava", hex: "FC4C02", name: "Strava" },
  headspace: { slug: "headspace", hex: "F47D31", name: "Headspace" },
  calm: { slug: "calm", hex: "0066FF", name: "Calm" },
  nike: { slug: "nike", hex: "111111", name: "Nike" },
  gympass: { slug: "wellhub", hex: "FF0055", name: "Gympass / Wellhub" },
  wellhub: { slug: "wellhub", hex: "FF0055", name: "Wellhub" },

  // Notícias, Leitura & Mídia
  medium: { slug: "medium", hex: "000000", name: "Medium" },
  substack: { slug: "substack", hex: "FF6719", name: "Substack" },
  kindle: { slug: "amazon", hex: "FF9900", name: "Kindle" },

  // Mobilidade & Delivery
  uber: { slug: "uber", hex: "000000", name: "Uber" },
  "uber eats": { slug: "ubereats", hex: "06C167", name: "Uber Eats" },
  ifood: { slug: "ifood", hex: "EA1D2C", name: "iFood" },
  rappi: { slug: "rappi", hex: "FF441F", name: "Rappi" },
  waze: { slug: "waze", hex: "33CCFF", name: "Waze" },

  // Bancos & Fintechs
  nubank: { slug: "nubank", hex: "820AD1", name: "Nubank" },
  inter: { slug: "bancointer", hex: "FF7A00", name: "Banco Inter" },
  picpay: { slug: "picpay", hex: "11C76F", name: "PicPay" },
  revolut: { slug: "revolut", hex: "0075EB", name: "Revolut" },
  paypal: { slug: "paypal", hex: "00457C", name: "PayPal" },

  // Big Tech
  apple: { slug: "apple", hex: "000000", name: "Apple" },
  google: { slug: "google", hex: "4285F4", name: "Google" },
  microsoft: { slug: "microsoft", hex: "5E5E5E", name: "Microsoft" },
};

export interface ResolvedBrandInfo {
  name: string;
  slug: string;
  hex: string;
  logoUri: string;
}

/**
 * Constrói a URL otimizada do SVG hospedado na CDN oficial do Simple Icons.
 * O Simple Icons CDN aceita: `https://cdn.simpleicons.org/{slug}/{color}`
 */
export function buildSimpleIconCdnUrl(slug: string, hexColor?: string): string {
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (hexColor) {
    const cleanHex = hexColor.replace("#", "");
    return `https://cdn.simpleicons.org/${cleanSlug}/${cleanHex}`;
  }
  return `https://cdn.simpleicons.org/${cleanSlug}`;
}

/**
 * Identifica a marca correspondente pelo nome e retorna sua URL oficial na CDN e metadados.
 * Se o nome não estiver no mapa pré-definido, tenta normalizar como um slug válido.
 */
export function resolveBrandInfo(name: string): ResolvedBrandInfo | null {
  if (!name || !name.trim()) return null;
  const lowerName = name.toLowerCase().trim();

  // 1. Busca por keyword no catálogo
  for (const [keyword, config] of Object.entries(BRAND_MAP)) {
    if (lowerName.includes(keyword)) {
      return {
        name: config.name,
        slug: config.slug,
        hex: config.hex || "081126",
        logoUri: buildSimpleIconCdnUrl(config.slug, config.hex),
      };
    }
  }

  // 2. Tenta inferência direta do primeiro termo como slug (ex: "Stripe", "Linear", "Prisma")
  const words = lowerName.split(/[\s-_]+/);
  const potentialSlug = words[0]?.replace(/[^a-z0-9]/g, "");

  if (potentialSlug && potentialSlug.length >= 3) {
    return {
      name: name.trim(),
      slug: potentialSlug,
      hex: "081126",
      logoUri: buildSimpleIconCdnUrl(potentialSlug),
    };
  }

  return null;
}
