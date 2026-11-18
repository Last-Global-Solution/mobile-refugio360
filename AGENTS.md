# Convenções do Refúgio 360 Mobile

## Escopo

- Este repositório contém somente o aplicativo React Native.
- Não altere os repositórios Java ou .NET a partir daqui.
- Não invente endpoints, campos ou estados. Confira os contratos reais dos backends antes de integrar.
- Preserve o foco no MVP acadêmico e evite abstrações sem uso concreto.

## Arquitetura

- Organize telas por funcionalidade em `src/features`.
- Mantenha navegação e seus tipos em `src/navigation`.
- Coloque clientes e funções HTTP em `src/api`.
- Centralize URLs e configuração em `src/config`.
- Centralize tokens visuais em `src/theme`; não replique cores e espaçamentos nas telas.
- Use `src/session` para token e perfil. Nunca armazene senha.
- Tipos compartilhados pertencem a `src/types`; tipos locais devem permanecer próximos ao uso.
- Prefira componentes pequenos e reutilizáveis apenas quando houver repetição real.

## Integração HTTP

- `javaClient` atende recursos Java autenticados e públicos.
- `dotnetPublicClient` atende somente alertas públicos.
- Nunca adicione o token Java ao cliente .NET.
- Leia URLs apenas de `EXPO_PUBLIC_JAVA_API_URL` e `EXPO_PUBLIC_DOTNET_API_URL`.
- Não fixe `localhost`, IPs ou URLs de produção no código.
- Trate os contratos Java paginados por `content`; endpoints públicos .NET retornam arrays.
- Preserve timeouts e normalize falhas de rede antes de apresentá-las ao usuário.
- Para ocorrências do cidadão, use somente `/api/ocorrencias/minhas`; não troque pela listagem comunitária.
- O backend ainda não valida ownership em `GET /api/ocorrencias/{id}`. Abra detalhes somente a partir de IDs retornados por `/minhas` e não exponha deep links para essa rota até a correção Java.
- O autor da ocorrência vem do JWT. Nunca envie usuário, autor ou status no payload de criação.
- Não faça retry automático de `POST /api/ocorrencias`; bloqueie submissões concorrentes no cliente.
- Consulte orientações somente por `GET /api/ocorrencias/{id}/orientacoes`, usando o `javaClient` autenticado e lendo `content` da página Spring.
- Uma página de orientações vazia não comprova falha da IA. Apresente indisponibilidade sem inventar estado de processamento.
- Nunca acesse Gemini pelo Mobile nem crie outra autenticação para IA.
- Não chame `POST /api/ai/ocorrencias/{id}/orientacao` automaticamente, durante polling, refresh ou recuperação de erro. Cada chamada pode persistir outra orientação.
- Polling de orientações deve ter backoff limitado, parar ao encontrar conteúdo ou receber erro e ser cancelado ao desmontar a tela ou encerrar a sessão.

## Sessão

- Armazene o JWT exclusivamente com Expo SecureStore.
- Persista token e `expiresAt`; nunca persista senha.
- Restaure a sessão validando o token com a API, não apenas pela presença local.
- Em `401`, encerre a sessão e volte ao login.
- Não encerre uma sessão existente por `401` retornado por login ou cadastro.
- Configure autenticação pelo binding único de `configureJavaAuth`; não registre interceptors em telas.
- Não implemente refresh token enquanto o backend não oferecer esse contrato.
- Logout local deve apagar token, perfil, caches privados e estado de navegação.
- O modo preview deve existir somente com `__DEV__` e nunca liberar mutações protegidas.

## Interface

- Toda tela remota deve tratar loading, erro, vazio e refresh.
- Toda mutação deve tratar submitting e impedir toques duplicados.
- Listas paginadas devem preservar refresh manual, estado vazio e fim de paginação.
- Use áreas de toque com pelo menos 44 pontos.
- Mantenha contraste, rótulos de acessibilidade e mensagens em português claro.
- Não apresente dados fictícios como se viessem das APIs.
- Não remova o aviso de que o aplicativo não substitui canais oficiais de emergência.
- Diferencie orientação gerada por IA de fallback local, mas trate ambas como conteúdo informativo e nunca como alerta oficial confirmado.

## Qualidade

- Mantenha TypeScript estrito e evite `any`.
- Execute `npm run typecheck`, `npm run lint` e `npm run format:check` antes de concluir alterações.
- Execute `npm test` para toda alteração em sessão, clientes HTTP ou autenticação.
- Use `npx expo install` para dependências nativas compatíveis com o SDK atual.
- Não adicione Redux, bibliotecas de formulário, cache remoto ou testes sem uma necessidade do incremento.
- Não versione `.env`, credenciais, tokens, keystores ou arquivos de assinatura.
- Atualize o README quando comandos, variáveis ou arquitetura mudarem.
