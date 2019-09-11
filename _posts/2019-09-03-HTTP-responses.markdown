---
layout: post
title:  "Entendendo as respostas HTTP"
date:   2019-09-11 00:00:00 +0000
image: https://imgur.com/1PEhKiE.png
comments: true
featured: false
tags: [Discussões] 
--- 
 
Olá pessoa!

Se você trabalha com serviços web é importante entender o que cada resposta pode significar, principalmente quando as coisas dão errado!

<!--more-->

Primeiro vamos entender o que é uma resposta HTTP, mas para isso, vamos dar um passo para trás e entender um pouco mais sobre o que é o HTTP.

HTTP é um acrônimo para *Hyper Text Transfer Protocol*. Ou seja, ele é um **protocolo**.

Ele é um protocolo para comunicação entre partes de um sistema distribuído. Ele é praticamente o fundamento da web como conhecemos hoje. É justo dizer que um programador web deveria entender esse protocolo de maneira razoável.

Não pretendo entrar em detalhes das camadas de redes ou algo do tipo, a ideia aqui será focar no que você precisa para o desenvolvimento web, principalmente para quando as coisas estão dando errado e você precisa fazer uma **investigação**.

#### Respostas HTTP

Como já dito anteriormente, esse protocolo é utilizado para comunicação entre partes. A comunicação básica através do HTTP é composta por uma **requisição** e uma **resposta**. Mas vamos focar aqui nas respostas HTTP que indicam problemas.

Geralmente é a partir da faixa de respostas HTTP 400 que sua investigação vai começar, mas antes de observarmos código por código é importante ressaltar algumas dicas gerais:

1. Atualize o navegador depois de fazer qualquer atualização no servidor, pode parecer óbvio, mas muitas vezes é só isso mesmo;
2. Logs, logs e mais logs. Sempre é um bom ponto de partida.
3. As respostas HTTP dependem do servidor, você pode em sua aplicação, simplesmente retornar 200 SEMPRE depois de um try-catch da vida, então tenha certeza que o servidor está lidando bonitinho com as respostas HTTP.

#### 4XX (Quatrocentos e alguma coisa) - Erro no Client

Existem diversos tipos de erros diferentes, mas sugiro dar mais atenção aos mais comuns: **400**, **401**, **403** e **404**.

###### 400 - Bad Request

Talvez esse seja o segundo código de erro mais comum da faixa 400 e algo. Geralmente quando isso ocorre significa que sua chamada para a API/servidor não está correta.

Por não estar correta, entenda: problemas sintáticos, argumentos ou cabeçalhos faltando e por aí vai. Em alguns casos, cookies corrompidos também podem gerar isso. Vale o bom e velho limpar os cookies e tentar de novo.

Novamente pode parecer óbvio, mas releia a documentação e confirme se sua chamada está coerente.

###### 401 - Unauthorized

Esse problema também é bastante comum e infelizmente ele possui um nome nada intuitivo. Apesar do nome falar sobre autorização, essa é a resposta HTTP que ocorre com problemas de **autenticação**. 

Sendo assim, ele ocorre quando o client está fazendo um request para algum recurso que necessita de autenticação. Isso significa que o client pode não estar autenticado ou está autenticado, mas não da forma correta.

Geralmente após fornecer as credenciais com algum tipo de login você estará apto a acessar o recurso.

###### 403 - Forbidden

Esse é o código que ocorre quando de fato existe um problema na **autorização**. Diferente do código 401, quando um código 403 é retornado isso geralmente significa que o servidor sabe quem o client é, mas ele não está autorizado a receber o conteúdo.

Imagine que você tem menos de 18 anos, com isso você não tem autorização para dirigir, certo?

O código 401 seria o equivalente ao guarda pedindo sua carteira de motorista, ou seja, ele não sabe quem você é e precisa checar. Para o código 403 o guarda já conhece você da vizinha e **sabe** que você ainda não tem 18 anos. Essa é basicamente a diferença entre os dois códigos.

Existe um problema relativamente comum que gera esse código HTTP. Em alguns casos, o usuário do sistema operacional (lá no servidor) que está executando a aplicação Web Server (IIS, Apache ou qualquer outro) não possui permissão para acessar um arquivo X ou Y.

Um jeito simples para identificar esse problema é checar se isso ocorre com TODOS os usuários da aplicação. Caso a resposta seja sim, esse pode ser o problema. Vá até o servidor e confirme se as permissões de usuário estão corretas.


###### 404 - Not Found

Talvez esse código deva receber o prêmio de código mais comum da faixa 400. Em poucas palavras o que ele diz é o seguinte: o client comunicou-se com o servidor com sucesso, mas o servidor não conseguiu encontrar o recurso solicitado, seja lá o que o client pediu.

Vale ressaltar que no caso de APIs REST esse código pode ser retornado caso o filtro informado pelo client não retorne nenhum registro. 

Por exemplo: api.meu-web-service.net/**user/99**. Neste caso, eu estaria executando um método `GET` para tentar obter o usuário com o `id= 99`, caso não exista um usuário com este `id` a API retornará o erro 404.

Esse problema pode ser causado por várias coisas diferentes:

A URL foi digitada corretamente? - Pode ser só um problema de digitação.

O recurso realmente existe? - Páginas podem ter sido removidas, registros apagados, arquivos movidos e assim por diante.

A rota no servidor aponta corretamente para o diretório dos recursos? - Suspeite desse problema caso todos os usuários estejam passando por isso.

###### 405 - Method Not Allowed

Esse código indica que o método HTTP (POST, PUT, DELETE e etc) não é uma operação válida para o servidor. Este método é uma sinalização ao consumidor de que servidor entendeu a requisição, mas o método HTTP é intencionalmente não suportado.

#### 5XX (Quinhentos e alguma coisa) - Erro no Servidor

###### 500 - Internal Server Error

Sem dúvida esse é o erro mais comum na faixa 500. De maneira geral isso significa que: Deu ruim e não sabemos o que é.

Isso pode ser desde um problema de configuração até um problema do código da aplicação que está sendo executada no servidor. Em .NET, por exemplo, se uma exceção é lançada e não é tratada pela aplicação ela retornará um erro 500 ao client.

###### 501 - Not Implemented 

Essa resposta é semelhante à resposta `405 - Method Not Allowed`. No caso da resposta 405, o servidor entende o método requisitado e intencionalmente não suporta ele. No caso da resposta 501 o servidor não é capaz de identificar o recurso que ele deve executar de acordo com o método informado.

Teoricamente esse problema pode acontecer com qualquer método exceto `GET` e `HEAD`.

###### 502 - Bad Gateway

Esse erro é outro que entra no grupo de: Deu ruim. Na prática ele geralmente é um problema generalizado em alguma escala. Por definição essa resposta indica que o servidor que o client está requisitando é um Gateway ou um Proxy e este por sua vez, não está conseguindo obter a resposta do servidor que trata a requisição.

É comum esse problema começar a aparecer quando utilizamos proxy reverso, como um load balancer, por exemplo. O erro pode estar relacionado com problemas no servidor final (um ou mais nós no caso de escala horizontal), problema de configuração no seu proxy reverso e problemas na comunicação entre o proxy reverso e os servidores.

Para o caso da comunicação sempre dê uma olhada em configuração de firewall e nas portas permitidas por ele.

###### 503 - Service Unavailable

Esse código é retornado quando o servidor é derrubado propositalmente para manutenções ou quando ele acaba sendo sobrecarregado. Ele funciona como um indicativo de que provavelmente voltará em breve.

Para os casos onde o servidor não está em manutenção, esse problema pode ocorrer por diferentes motivos como falta de CPU ou memória para manipular as requisições ou até a necessidade de uma configuração para permitir mais usuários.

Sempre que for possível estimar o tempo para o servidor se tornar disponível novamente é recomendado que a resposta contenha o cabeçalho `Retry-After` com o tempo estimado para o serviço voltar.

###### 504 - Gateway Timeout

Esse erro é relativamente similar ao erro 502, consiste da mesma dinâmica entre a comunicação entre um servidor proxy ou gateway e os servidores de aplicação. No entanto, nesses casos o problema está relacionado a velocidade de resposta entre os servidores.

Isso pode ocorrer devido à um problema de conexão entre o proxy e o servidor de aplicação, problemas de performance no servidor de aplicação (aplicação lenta demais) ou até problemas de configuração para um _timeout_ limite muito curto.


###### 505 - HTTP Version Not Supported

Esse é erro é bastante direto, ele simplesmente indica que a versão HTTP utilizada pelo client não é suportada pelo servidor. Tão simples quanto isso.

###### 511 - Network Authentication Required

Esse erro geralmente é gerado por proxies intermediários entre o client e o servidor. Isso normalmente indica ao client que algum tipo de autenticação, aceite de termos ou qualquer outra interação deve ser feita para garantir o acesso ao servidor.


Bom, o post de hoje ficou um pouco diferente do normal, mas por enquanto é isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.