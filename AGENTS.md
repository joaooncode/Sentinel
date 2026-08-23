# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

# Custom Agent Commands & Shortcuts

Whenever the user starts a prompt with any of the following shortcuts, immediately activate the `.agents/skills/git-workflow/SKILL.md` skill and execute the workflow:

- `/commit [instrução ou mensagem opcional]`:
  1. Inspecionar alterações com `git status` e `git diff`.
  2. Identificar arquivos alterados e gerar mensagem semântica (Conventional Commits).
  3. Adicionar arquivos e realizar o commit via terminal.

- `/pr [título/descrição opcional]`:
  1. Verificar status atual da branch (`git status`, `git log`).
  2. Fazer push para a branch remota (`git push -u origin HEAD`).
  3. Criar o Pull Request utilizando `gh pr create` estruturado com descrição, lista de alterações, instruções de teste e labels adequadas (`--label "enhancement"`, `--label "bug"`, etc.).

- `/commit-pr [mensagem/instrução opcional]`:
  1. Realizar o fluxo do `/commit` seguido imediatamente pelo fluxo do `/pr`.
