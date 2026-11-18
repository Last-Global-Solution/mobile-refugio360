# Refúgio 360 Mobile

Aplicativo React Native do Refúgio 360, projeto acadêmico da Global Solution 2026/2 da FIAP. A plataforma busca apoiar cidadãos durante emergências, inicialmente enchentes, por meio de ocorrências, locais seguros, alertas e orientações.

## Estado atual

Este repositório contém o Incremento 7 do mobile:

- shell Expo com TypeScript;
- navegação pública e área principal;
- oito áreas de tela previstas no escopo;
- tema e componentes de estado reutilizáveis;
- cadastro e login integrados à API Java;
- sessão JWT persistida com Expo SecureStore;
- restauração da sessão validada por `/api/auth/me`;
- logout local e tratamento global de expiração;
- clientes Java autenticado e .NET público isolados;
- listagem paginada das ocorrências do usuário;
- criação e detalhe de ocorrências;
- consulta paginada de orientações assíncronas no detalhe da ocorrência;
- polling limitado e cancelável após a abertura do detalhe;
- identificação visual de orientação gerada por IA ou fallback local;
- listagem paginada e detalhe de locais seguros da API Java;
- listagem e detalhe de alertas públicos da API .NET;
- abertura de coordenadas de locais em um aplicativo externo de mapas;
- contratos de autenticação e ocorrências validados contra uma API Java local real;
- execução visual validada no Android Emulator, incluindo sessão real e restauração pelo SecureStore;
- testes automatizados da autenticação, sessão, ocorrências, orientações, locais seguros e alertas.

A edição e a exclusão ainda não estão implementadas porque dependem de ajustes de autorização no backend Java. Em desenvolvimento, o botão de visualização abre a área principal sem criar sessão e sem liberar chamadas protegidas.

## Tecnologias

- Expo SDK 58
- React Native 0.88
- React 19
- TypeScript 6 em modo estrito
- React Navigation 7
- Axios
- React Native Safe Area Context
- Expo SecureStore
- ESLint e Prettier

## Estrutura

```text
src/
  api/          clientes HTTP Java e .NET
  components/   componentes visuais reutilizáveis
  config/       configuração centralizada de ambiente
  features/     telas organizadas por funcionalidade
  navigation/   stacks, abas e tipos de navegação
  session/      contexto e armazenamento seguro de sessão
  theme/        cores, espaçamentos, tipografia e tema de navegação
  types/        tipos compartilhados
  utils/        normalização de erros e utilitários
```

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Expo Go compatível com SDK 58 ou emulador Android/iOS configurado

O projeto foi instalado inicialmente com Node.js 24.14.0 e npm 11.9.0.

## Instalação

```bash
npm install
cp .env.example .env
```

Edite `.env` com URLs alcançáveis pelo dispositivo. O arquivo não deve conter credenciais e não é versionado.

## Configuração das APIs

```dotenv
EXPO_PUBLIC_JAVA_API_URL=https://java-api.exemplo.com
EXPO_PUBLIC_DOTNET_API_URL=https://dotnet-api.exemplo.com
```

- A API Java será usada para autenticação, usuários, ocorrências, locais seguros, pontos de risco e orientações.
- A API .NET será usada somente para alertas públicos.
- O cliente .NET não recebe o token da sessão Java.
- Não use `localhost` como URL para aparelho físico. Em desenvolvimento local, use um endereço de rede acessível pelo dispositivo ou o endereço apropriado do emulador.
- Prefira HTTPS em ambientes compartilhados e publicados.

`EXPO_PUBLIC_JAVA_API_URL` é obrigatória para autenticação, ocorrências e locais seguros. `EXPO_PUBLIC_DOTNET_API_URL` é obrigatória para alertas. A tela de perfil mostra se cada URL foi configurada. Quando uma URL estiver ausente ou o serviço correspondente estiver indisponível, somente essa área exibe erro com retry; o aplicativo não substitui a resposta por dados fictícios.

## Integração Java local

O backend declara Java 21 e usa Maven. Para validar sem alterar o banco local em arquivo, execute-o a partir do repositório Java com H2 em memória e uma porta alternativa:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--server.address=0.0.0.0 --server.port=18081 --spring.datasource.url=jdbc:h2:mem:refugio360-integration --spring.jpa.hibernate.ddl-auto=create-drop --spring.h2.console.enabled=false --spring.rabbitmq.listener.simple.auto-startup=false --spring.rabbitmq.listener.direct.auto-startup=false --spring.rabbitmq.connection-timeout=250ms --spring.rabbitmq.template.retry.enabled=false"
```

Esse banco existe somente durante o processo Java. O console H2 fica desabilitado e nenhum dado do banco padrão `./data/refugio360` é utilizado. Use `127.0.0.1` em `server.address` se acesso pela rede local não for necessário.

O RabbitMQ não é necessário para cadastro, login, criação, persistência, listagem ou detalhe de ocorrências. Ele é necessário para que o evento de uma nova ocorrência gere automaticamente uma orientação. Sem o broker, o Java salva a ocorrência, mas a consulta de orientações pode permanecer vazia. Gemini é opcional: sem `GEMINI_API_KEY`, ou se o provedor falhar, o backend persiste uma orientação automática local com `geradoPorIA: false`.

Para validar a geração assíncrona, suba o RabbitMQ no repositório Java antes da API:

```bash
docker compose up -d
./mvnw spring-boot:run
```

Esse comando usa a configuração de banco padrão do backend. Para testes descartáveis, configure um H2 em memória e mantenha os listeners RabbitMQ habilitados. O comando anterior desta seção, que define `spring.rabbitmq.listener.*.auto-startup=false`, valida ocorrências sem consumir a fila e, portanto, não gera orientações automaticamente.

Configure a URL conforme o cliente que executará o Mobile:

```dotenv
# Android Emulator padrão
EXPO_PUBLIC_JAVA_API_URL=http://10.0.2.2:18081

# Aparelho físico na mesma rede, substituindo pelo IP do computador
EXPO_PUBLIC_JAVA_API_URL=http://192.168.x.x:18081
```

No computador, `http://127.0.0.1:18081` acessa a mesma instância. Para aparelho físico, mantenha o Java em `0.0.0.0`, permita a porta no firewall local e confirme que computador e aparelho estão na mesma rede. HTTP deve ser restrito ao desenvolvimento local; ambientes compartilhados devem usar HTTPS.

Para iniciar também a API .NET, abra outro terminal na pasta `dotnet-refugio-360/Refugio360.Api` e execute:

```bash
dotnet restore
dotnet run
```

Em Development, o serviço normalmente escuta em `http://localhost:5000`. No Android Emulator, configure `EXPO_PUBLIC_DOTNET_API_URL=http://10.0.2.2:5000`; em aparelho físico, use o IP do computador na rede local. O banco SQLite de desenvolvimento inclui um alerta publicado explicitamente identificado como demonstração. Consulte o README do backend .NET para os requisitos do SDK .NET 10 e a configuração opcional dos User Secrets.

No Android 17/API 37, o Expo Go precisa da permissão de rede local para alcançar `10.0.2.2`. Depois que o Expo Go estiver instalado no AVD, conceda-a com:

```bash
adb shell pm grant host.exp.exponent android.permission.ACCESS_LOCAL_NETWORK
```

Na primeira inicialização de um AVD com Play Store, aguarde as atualizações automáticas terminarem antes de avaliar estabilidade. Uma atualização do Android System WebView encerra processos que o utilizam e aparece no `adb logcat` como `killDueToPackageUpdate`; nesse caso, relance `npm run android` após a atualização. Isso é diferente de um crash JavaScript ou nativo do aplicativo.

A validação real confirmou `201` no cadastro, `200` no login e em `/api/auth/me`, `201` na criação, `200` na listagem paginada e no detalhe, `400` para payload inválido, `401` para token ausente, inválido ou expirado, `404` para ID inexistente e `409` para e-mail duplicado. Os serviços Axios usados pelo aplicativo também completaram cadastro, consulta da sessão, criação, listagem e detalhe contra essa instância.

## Autenticação

Contratos utilizados:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Cadastro e login enviam somente `email` e `senha`. A resposta contém o JWT, sua expiração e o perfil do usuário. A senha nunca é persistida pelo aplicativo.

Para testar manualmente:

1. Configure `EXPO_PUBLIC_JAVA_API_URL` com uma API Java alcançável pelo dispositivo.
2. Inicie o Expo com `npm start`.
3. Crie uma conta com e-mail válido e senha entre 8 e 72 caracteres.
4. Confirme a entrada automática na área principal.
5. Feche e reabra o aplicativo para validar a restauração via `/api/auth/me`.
6. Use a tela Perfil para encerrar a sessão.

O JWT local dura uma hora. O aplicativo salva `accessToken` e `expiresAt` no SecureStore, rejeita localmente tokens expirados e confirma tokens válidos em `/api/auth/me`. Como o backend não oferece refresh token, uma sessão expirada retorna o usuário ao login.

O interceptor adiciona Bearer somente às chamadas Java protegidas. Login e cadastro não recebem token, e o cliente público .NET nunca recebe a credencial Java.

## Ocorrências

Endpoints consumidos:

```text
GET  /api/ocorrencias/minhas
GET  /api/ocorrencias/{id}
POST /api/ocorrencias
```

A listagem usa páginas Spring com dez itens e ordenação `id,desc`. O botão “Carregar mais” solicita a próxima página, combina os registros pelo ID numérico e para quando `last` é verdadeiro. O gesto de atualizar recarrega a primeira página e substitui os dados locais.

O formulário envia somente:

```json
{
  "descricao": "Alagamento na via",
  "urgencia": "ALTA",
  "latitude": -23.55,
  "longitude": -46.63,
  "perfil": "GERAL"
}
```

Valores aceitos:

- urgência: `BAIXA`, `MEDIA`, `ALTA`, `CRITICA`;
- perfil: `GERAL`, `IDOSO`, `PCD`, `FAMILIA`;
- latitude: número entre -90 e 90;
- longitude: número entre -180 e 180.

O app não envia autor, usuário, ID ou status. O backend associa o autor pelo JWT. A criação não possui retry automático e usa um guard para impedir POSTs simultâneos. Após sucesso, o formulário sai da pilha e a listagem é recarregada.

Falhas de rede, timeout e respostas `400`, `401`, `403`, `404` e `409` são traduzidas para mensagens de interface. Um `401` protegido também encerra a sessão pelo interceptor Java.

## Orientações

Endpoint autenticado consumido na API Java:

```text
GET /api/ocorrencias/{id}/orientacoes?page=0&size=10&sort=criadaEm,desc
```

A resposta é uma página Spring. Cada item contém `id`, `ocorrenciaId`, `mensagem`, `perfil`, `geradoPorIA`, `locaisConsiderados` e `criadaEm`. O Mobile apresenta o texto, o perfil, a data e os IDs dos locais considerados sem inferir nome, disponibilidade ou segurança. `geradoPorIA: true` identifica conteúdo gerado com Gemini; `false` identifica o fallback automático local e continua sendo um resultado válido.

Ao abrir o detalhe de uma ocorrência, o aplicativo consulta a primeira página imediatamente. Se `content` estiver vazio, repete a leitura após 1, 2, 3 e sucessivos intervalos de até 5 segundos, respeitando um teto total aproximado de 30 segundos. O polling encerra ao encontrar uma orientação, ao receber qualquer erro ou ao atingir o limite. Um `AbortController` cancela temporizadores e a requisição atual quando a tela é fechada, o ID muda ou a sessão termina.

Depois do limite, a interface informa “Orientação ainda indisponível. Você pode tentar novamente mais tarde.” A atualização manual executa uma única leitura e nunca reinicia geração. Orientações anteriores podem ser carregadas por paginação. Página vazia não é apresentada como falha da IA porque o backend não expõe status de processamento.

O endpoint `POST /api/ai/ocorrencias/{id}/orientacao` existe no backend e pode criar uma nova orientação a cada chamada, mas não é utilizado pelo Mobile neste incremento. Polling, refresh e tratamento de erro fazem exclusivamente `GET`. O aplicativo também nunca acessa Gemini diretamente e reutiliza somente o JWT Java existente.

Toda orientação é marcada como conteúdo informativo. Ela não é apresentada como alerta oficial e não substitui instruções da Defesa Civil.

## Locais seguros

Endpoints públicos consumidos na API Java:

```text
GET /api/locais-seguros?page=0&size=10&sort=nome,asc
GET /api/locais-seguros/{id}
```

A listagem lê `content` da página Spring, mostra dez locais por vez em ordem alfabética e oferece refresh e “Carregar mais”. O detalhe apresenta somente nome, tipo, endereço, descrição e coordenadas retornados pela API. O botão de mapa abre uma URL externa com latitude e longitude; disponibilidade, capacidade, acessibilidade e outros atributos não são inferidos.

Uma resposta sem itens gera o estado vazio “Nenhum local encontrado”. Falhas de configuração, rede, timeout e `404` no detalhe possuem mensagens próprias e retry manual.

## Alertas públicos

Endpoints públicos consumidos na API .NET:

```text
GET /api/v1/alertas
GET /api/v1/alertas/{id}
```

O serviço retorna um array com alertas publicados, ativos e não expirados. A interface exibe título, mensagem, fonte informada, status e datas formatadas em português. Marcadores de demonstração aparecem somente quando título, mensagem ou fonte se identificam explicitamente como demo, simulação ou conteúdo fictício. A fonte é apresentada como informação da API, sem inferir autoridade que o contrato não declare.

O cliente .NET é público e isolado: nunca recebe o JWT da sessão Java. A ausência de alertas gera estado vazio; `404`, rede, timeout e `429 Too Many Requests` geram mensagens claras com retry manual. Sem a API .NET disponível, a tela não exibe alertas locais ou mocks.

## Execução

```bash
npm start
npm run android
npm run ios
npm run web
```

O comando para iOS requer macOS e Xcode. O suporte web pode exigir dependências adicionais do Expo e não é o alvo principal deste incremento.

## Qualidade

```bash
npm run typecheck
npm run lint
npm test
npm run format:check
npm run format
```

Os testes usam Jest e Axios Mock Adapter. Eles não dependem de credenciais, rede ou serviços externos.

## Navegação

Área pública:

- Login
- Cadastro
- Sobre

Área principal:

- Início
- Minhas ocorrências
- Locais seguros
- Alertas
- Perfil
- Sobre

A sessão autenticada troca automaticamente o fluxo público pela área principal. Durante a restauração, uma tela de carregamento impede flashes de conteúdo protegido. O modo de visualização permanece disponível somente em desenvolvimento.

## Limitações

- Não existe refresh token.
- O logout é local; um token copiado continua válido no servidor até expirar.
- Não há recuperação ou alteração de senha.
- Não há edição de perfil.
- Ocorrências ainda não podem ser editadas ou excluídas pelo cidadão.
- `GET /api/ocorrencias/{id}` retorna `200` para qualquer cidadão autenticado, mesmo quando a ocorrência pertence a outro usuário. `/api/ocorrencias/minhas` isola os usuários corretamente, e o Mobile só abre IDs vindos dessa lista, mas a autorização precisa ser corrigida no Java.
- Tokens inválidos ou expirados podem retornar `401` sem corpo; o Mobile trata a sessão pelo código HTTP.
- A API não retorna data de criação da ocorrência.
- A API não expõe estado pendente ou falha da geração de orientação; o Mobile só distingue resultado disponível, espera limitada, timeout e erro HTTP/rede.
- Sem RabbitMQ, uma ocorrência nova pode permanecer sem orientação automática. O Mobile não chama o endpoint manual de geração para compensar essa ausência.
- Os locais considerados em uma orientação são retornados apenas como IDs; o detalhe não afirma que estejam abertos, disponíveis ou seguros.
- Coordenadas são informadas manualmente; não há GPS automático.
- As telas de dados exibem estados informativos, não mocks.
- A abertura de mapas depende de um aplicativo ou navegador capaz de tratar a URL externa.
- A API .NET de Development inclui conteúdo acadêmico fictício claramente rotulado; ele não representa um alerta real.
- Não há configuração do Firebase App Distribution.
- O aplicativo foi validado visualmente no Expo Go 58.0.5 em Android 17/API 37. A validação em aparelho físico permanece pendente.

## Próximos passos

1. Corrigir no Java a autorização por ownership do detalhe de ocorrência.
2. Repetir o fluxo visual completo em aparelho físico.
3. Validar visualmente a geração assíncrona com RabbitMQ e uma ocorrência descartável.
4. Conectar edição e exclusão quando as permissões Java estiverem prontas.
5. Preparar build Android e Firebase App Distribution.
