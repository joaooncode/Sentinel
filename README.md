# 🛡️ Sentinel — Gestão Inteligente de Assinaturas

<p align="center">
  <img src="./assets/images/icon.png" alt="Sentinel Logo" width="120" style="border-radius: 24px;" />
</p>

<p align="center">
  <strong>Mantenha o controle total sobre seus gastos recorrentes e nunca mais seja pego de surpresa por renovações automáticas.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-v54.0.36-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native 0.81" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
</p>

---

## 📖 Visão Geral

O **Sentinel** é um aplicativo móvel moderno projetado para simplificar e centralizar o gerenciamento de assinaturas, serviços de streaming, licenças de software e despesas recorrentes.

Com uma interface intuitiva e design refinado, o Sentinel calcula seus custos mensais consolidados, prevê datas de cobrança e fornece relatórios detalhados para ajudar você a economizar e tomar decisões financeiras mais inteligentes.

---

## ✨ Funcionalidades

- 📊 **Dashboard Financeiro Consolidado**: Visão geral de gastos acumulados no mês, saldo e resumo de assinaturas ativas.
- 🔔 **Próximas Renovações**: Carrossel visual com as próximas cobranças para evitar cobranças indesejadas.
- ➕ **Cadastro Ágil de Assinaturas**:
  - Detecção automática de logotipos oficiais via CDN (_Simple Icons_).
  - Ícones inteligentes de fallback por categoria (_Lucide Icons_).
  - Ciclos de cobrança flexíveis (mensal, semanal, anual) com conversão automática de custo mensal.
  - Validação robusta de formulários com **Zod**.
- 🔍 **Busca e Filtros Avançados**: Localize rapidamente assinaturas por nome, categoria ou status.
- ⚙️ **Gestão de Ciclo de Vida**: Pause, reative ou cancele assinaturas diretamente pelo app.
- 📈 **Insights e Análises**: Distribuição percentual de despesas por categoria e tendências de gastos.
- 🔐 **Autenticação Segura com Clerk**:
  - Login social (OAuth) e login tradicional por e-mail/senha.
  - Armazenamento seguro de tokens no dispositivo via `expo-secure-store`.
- 🎨 **Design System & Tipografia Personalizada**: Interface com a fonte _Plus Jakarta Sans_, suporte a _NativeWind v5_ e experiência otimizada para iOS e Android (New Architecture e Edge-to-Edge).

---

## 🛠️ Tecnologias e Bibliotecas

| Tecnologia                                                                                | Finalidade                                                 |
| :---------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| **[Expo](https://expo.dev/) (SDK 54)**                                                    | Framework e ecossistema universal para React Native        |
| **[React Native](https://reactnative.dev/) (0.81.5)**                                     | Base do aplicativo móvel com _New Architecture_ habilitada |
| **[Expo Router](https://docs.expo.dev/router/introduction/) (v6)**                        | Navegação e roteamento file-based com rotas tipadas        |
| **[NativeWind](https://www.nativewind.dev/) (v5) / Tailwind CSS (v4)**                    | Estilização utilitária e design system declarativo         |
| **[Clerk](https://clerk.com/) (`@clerk/expo`)**                                           | Autenticação completa de usuários, sessões e OAuth         |
| **[TypeScript](https://www.typescriptlang.org/) (v5.9)**                                  | Tipagem estática e segurança em tempo de desenvolvimento   |
| **[Zod](https://zod.dev/)**                                                               | Validação de esquemas de dados e formulários               |
| **[Dayjs](https://day.js.org/)**                                                          | Manipulação, formatação e cálculos de datas e renovações   |
| **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (v4)**   | Animações fluidas a 60/120 FPS                             |
| **[Husky](https://typicode.github.io/husky/) & [Commitlint](https://commitlint.js.org/)** | Padronização de commits (Conventional Commits) e hooks git |

---

## 📁 Estrutura do Projeto

```text
sentinel/
├── app/                        # Rotas e páginas (Expo Router)
│   ├── (auth)/                 # Fluxos de autenticação (sign-in, sign-up)
│   ├── (tabs)/                 # Navegação principal por abas (Home, Subscriptions, Insights, Settings)
│   ├── subscriptions/          # Rotas dinâmicas de assinaturas ([id].tsx)
│   ├── onboarding.tsx          # Tela de apresentação inicial
│   └── _layout.tsx             # Layout raiz, providers (Clerk, Subscription, Fontes)
├── assets/                     # Imagens, ícones de marcas e fontes (Plus Jakarta Sans)
├── components/                 # Componentes reutilizáveis de UI e modais
├── constants/                  # Cores do tema, dados estáticos e mapeamentos de ícones
├── context/                    # Contextos React (ex: SubscriptionContext)
├── hooks/                      # Hooks customizados (ex: useAuthFlow)
├── lib/                        # Utilitários de formatação e helpers
├── schemas/                    # Schemas de validação Zod
├── types/                      # Definições de tipos TypeScript
└── package.json                # Dependências e scripts do projeto
```

---

## 🚀 Como Começar

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **pnpm** (recomendado) ou **npm** / **yarn**
- Aplicativo **Expo Go** em seu celular físico ou emulador configurado (**Android Studio** / **Xcode**)

### 1. Clonar o Repositório

```bash
git clone https://github.com/joaooncode/Sentinel.git
cd Sentinel
```

### 2. Instalar Dependências

```bash
pnpm install
# ou
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com sua chave pública do Clerk:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_seu_token_aqui
```

> 💡 **Nota:** Obtenha sua chave publicável criando uma conta gratuita no painel do [Clerk Dashboard](https://dashboard.clerk.com/).

### 4. Executar a Aplicação

```bash
# Iniciar o servidor de desenvolvimento Expo
pnpm start

# Ou rodar diretamente em uma plataforma específica:
pnpm android   # Abrir no Android Emulator / dispositivo conectado
pnpm ios       # Abrir no iOS Simulator (macOS)
pnpm web       # Abrir versão Web
```

---

## 📜 Scripts Disponíveis

| Comando         | Descrição                                           |
| :-------------- | :-------------------------------------------------- |
| `pnpm start`    | Inicia o servidor Metro Bundler do Expo             |
| `pnpm android`  | Executa o aplicativo no Android                     |
| `pnpm ios`      | Executa o aplicativo no iOS Simulator               |
| `pnpm web`      | Inicia a versão web no navegador                    |
| `pnpm lint`     | Executa o linter para verificar problemas de código |
| `pnpm lint:fix` | Corrige problemas automáticos de formatação e lint  |

---

## 🤝 Padrões de Contribuição

O projeto segue as convenções de commits semânticos (**Conventional Commits**):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `refactor:` Refatoração de código sem alterar o comportamento
- `perf:` Melhorias de performance
- `docs:` Alterações na documentação
- `style:` Ajustes visuais ou de formatação
- `test:` Inclusão ou ajuste de testes
- `chore:` Atualizações de build, dependências ou configurações

Os commits são validados automaticamente no pré-commit via **Husky** e **Commitlint**.

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de gestão pessoal. Consulte o repositório para detalhes sobre direitos e licenciamento.
