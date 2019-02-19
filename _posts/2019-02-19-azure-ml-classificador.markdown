---
layout: post
title:  "Classificador de Sentimentos - Azure ML"
date:   2019-02-19 00:00:00 +0000
comments: true
tags: [IA]
---

Olá pessoa!

Em abril do ano passado publiquei um post em Python sobre a criação de um classificador de sentimentos, que tal fazermos o mesmo exemplo, dessa vez utilizando o Machine Learning Studio do Azure?

<!--more-->

Você pode encontrar o post original feito em Python [neste link]({{ site.baseurl }}{% link _posts/2018-04-16-machine-learning-classificador.markdown %}). Além dele, também disponibilzei uma atualização do post, dessa vez em inglês lá [no medium](https://itnext.io/how-to-create-a-sentiment-analyzer-with-text-classification-python-ai-f3a5d10922c5).

O objetivo aqui é fazermos a mesma implementação, só que dessa vez, com o [Azure Machine Learning Studio]({{ site.baseurl }}{% link _posts/2018-01-15-azure-machine-learning.markdown %}).

Vamos usar o mesmo conjunto de dados do post anterior, mas naquela vez os arquivos estavam salvos em um TXT, fiz uma pequena atualização deles para convertê-los para CSV, isso facilitará nosso trabalho.

Você pode acessar os dados [neste repositório](https://github.com/gabrielschade/IA/tree/master/ClassificacaoComentariosAzureML/Datasets) do meu GitHub.

Agora já podemos começar nossa implementação!

A primeira coisa é acessar o [https://studio.azureml.net](https://studio.azureml.net) e autenticar-se (ou criar sua conta, é gratuito).

Feito isso, acesse a aba _Datasets_, é lá que iremos carregar os arquivos CSV que vamos utilizar.

Após abrir a aba, pressione o botão _+ NEW_, conforme imagem abaixo:

{% include image.html link="https://imgur.com/mC958vO.png" alt="Azure ML - Datasets" width=75 %}

Depois disso, carregue o arquivo localmente de sua máquina, selecionando o tipo de dataset como: _Generic CSV File with a header_ e pressione o botão de _OK_.

{% include image.html link="https://imgur.com/GzAbaoK.png" alt="Azure ML - Datasets upload" width=75 %}

Agora já podemos criar nosso experimento, selecionando a opção _experiments_ > _ + NEW_ > _Blank Experiment_.

O primeiro passo em nosso experimento é unir todos os _datasets_ em um único. Você pode fazer isso manualmente criando um novo arquivo CSV com todos os dados, mas podemos mantê-los separados e unir conforme a necessidade do experimento.

Vamos incluir os _datasets_ no experimento. Você pode encontrá-los no módulo _Saved Datasets_ > _My Datasets_, conforme imagem:

{% include image.html link="https://imgur.com/uzaKOGt.png" alt="Azure ML - Datasets no experimento" width=80 %}

Quando precisarmos fazer algum tipo de alteração nos dados provavelmente precisaremos dos módulos agrupados em _Data Transformation_. Nesse caso de agora, vamos unir os dados de diferentes datasets, para isso, usaremos o módulo _Manipulation_ > _Add Rows_.

Este módulo recebe dois parâmetros, ambos datasets, e retorna um novo dataset com a união dos registros dos parâmetros. Simples né?

Vamos utilizar este mesmo módulo duas vezes, dessa forma conseguiremos unir os três datasets distintos.

{% include image.html link="https://imgur.com/66BHcUF.png" alt="Azure ML - Unindo Datasets" width=80 %}

Você pode visualizar os dados combinados no resultado do último módulo:

{% include image.html link="https://imgur.com/N5q5mSJ.png" alt="Azure ML - Datasets unidos" width=80 %}

Agora vamos utilizar um pouquinho de SQL, eu sei disse que não teria código (e na verdade nem precisaria), mas facilitará a visualização dos dados.

Vamos alterar a coluna Value de '0' e '1' para 'Negative' e 'Positive' respectivamente. Para isso, utilize o módulo _Apply SQL Transformation_, ainda no grupo _Manipulation_ de _Data Transformation_. 

Apesar de ser possível incluir três parâmetros diferentes, utilizaremos apenas um. Como configuração do módulo, vamos utilizar um script simples, que irá converter o valor numérico para o valor textual:

```sql
SELECT 
    Text,
    CASE WHEN Value = 1 THEN 'Positive'
         ELSE 'Negative' 
    END AS Value
         
FROM 
    t1;
```

E pronto! -Ah, se estiver tendo problemas para visualizar os dados, lembre-se de executar o experimento pressionando o botão _RUN_ sempre que adicionar novos módulos!

Agora estamos no momento em que, no post em Python, utilizávamos o vetorizador para transformar cada palavra do texto em um valor númerico. Este valor representava quantas vezes a palavra aparece no texto.

Estes valores são utilizados para o cálculo do quão positivo (ou negativo) é um comentário. Você pode ver a explicação completa na [publicação original]({{ site.baseurl }}{% link _posts/2018-04-16-machine-learning-classificador.markdown %}).

Para fazer isso no Azure ML vamos utilizar o módulo _Feature Hashing_ do grupo _Text Analytics_, basta conectá-lo à saída do módulo _Apply SQL Transformation_:

{% include image.html link="https://imgur.com/qGI9SkX.png" alt="Azure ML - Feature Hashing" width=80 %}

Vamos alterar as propriedades do _Feature Hashing_ para que ele leve em consideração apenas a coluna: _Text_, conforme imagem:

{% include image.html link="https://imgur.com/4G05064.png" alt="Azure ML - Feature Hashing - 2" width=80 %}

Assim como fizemos no experimento anterior, vamos dividir os dados para treinamento e avaliação. Neste caso, vamos utilizar como ponto de corte 75% dos registros.

Para fazer esta separação vamos utilizar o módulo: _Data Transformation_ > _Sample and Split_ > _Split Data_, configurando-o para 75%.

{% include image.html link="https://imgur.com/NSdPNov.png" alt="Azure ML - Split" width=80 %}

Agora os dados já estão preparados!

### Fazendo a Classificação

Vamos utilizar o algoritmo **Two-class Bayes Point Machine**, um algoritmo diferente do utilizado em Python. Este módulo encontra-se em: _Machine Learning_ > _Initialize Model_ > _Classification_. Neste caso vamos manter a configuração padrão do algoritmo, simplesmente vamos consumí-lo.

Agora é preciso conectar tanto o algoritmo quanto uma das partes dos dados com o modelo de treinamento.

{% include image.html link="https://imgur.com/tNID0NE.png" alt="Azure ML - Train Model" width=80 %}

Com as conexões feitas, vamos configurar o modelo para que a classificação seja o valor da coluna _Value_. Um ponto interessante de notar aqui, é que após o _Feature Hashing_, nosso dataset ficou com muito mais colunas do que continha originalmente.

{% include image.html link="https://imgur.com/BlCK1Es.png" alt="Azure ML - Train Model Settings" width=80 %}

Agora conectaremos o resultado do _Train Model_ e a porção de dados ainda não utilizadas com o _Score Model_, que por sua vez, deverá se conectar ao _Evaluate Model_.

{% include image.html link="https://imgur.com/Woe1zZ3.png" alt="Azure ML - Score Model " width=80 %}

Antes de executar o experimento, lembre-se de desmarcar a opção _Append score columns to output_, isso servirá para excluirmos as colunas do dataset do resultado, afinal, só precisamos da análise preditiva.

Já podemos executar e ver os resultados!

### Resultados e Publicação

Ao selecionar a opção _Visualize_ no _Evaluate Model_ podemos checar todo o resultado obtido:

{% include image.html link="https://imgur.com/pqEl81V.png" alt="Azure ML - Evaluate Model " width=80 %}

Aqui temos a matriz de confusão e outras métricas importantes para verificarmos a validação do nosso modelo (que por sinal não é grande coisa). Vamos entender e explorar essas métricas no futuro, agora vamos partir diretamente para a publicação do modelo como um serviço web.

Para iniciarmos o processo de publicação precisamos configurar o ambiente. Podemos fazer isso escolhendo a opção: _Predictive Web Service_ encontrada na barra inferior dentro do agrupador _SET UP WEB SERVICE_, conforme imagem:

{% include image.html link="https://imgur.com/NdBsRNO.png" alt="Azure ML - Publish-1" width=80 %}

Ao pressionar este botão um novo experimento é criado, ele ficará em uma nova aba chamada _Predictive experiment_ dentro do mesmo ambiente.

Aqui faremos alguns pequenos ajustes, simplesmente para melhorarmos o consumo do web service.

Primeiro vamos ajustar a passagem de parâmetro que é feita automaticamente. No Azure ML o parâmetro é definido pelo dataset ao qual o módulo _Web Service Input_ está conectado.

Se voltarmos ao início do experimento, notaremos que o _Web Service Input_ está conectado com o módulo _Add Rows_. Neste dataset temos duas informações: o texto e o resultado esperado da classificação.

{% include image.html link="https://imgur.com/nkzKT5Z.png" alt="Azure ML - Web service input" width=80 %}

Não faz sentido esperarmos que o consumidor do nosso serviço passe o resultado esperado, afinal, o objetivo de criarmos isso é a detecção automática da classificação. Permitir que o usuário informe o resultado esperado pode ser utilizado posteriormente para melhorar a assertividade do algoritmo, mas este não é o foco aqui, então vamos limpar isso.

Para fazer isso basta uma configuração simples, vamos utilizar o módulo _Data Input and Output_ > _Enter Data Manually_. Este módulo nos permite criarmos um CSV manualmente.

Vamos criar um contendo somente um cabeçalho, chamado _Text_. Depois disso, ao seu lado, vamos criar outro módulo deste, também com um único cabeçalho, mas desta vez, chamado de _Value_. Isso faz com que tenhamos dois datasets onde cada um possui apenas um dos campos de nossos dados.

Vamos uní-los através do módulo _Data Transformation_ > _Add Columns_, isso fará com que os dois datasets se tornem um só, com o mesmo formato dos demais. Agora vamos conectar o parâmetro de entrada do web service no mesmo parâmetro de entrada do módulo _Add Columns_ onde ligamos o dataset contendo somente a coluna _Text_.

Isso fará com que seja necessário informar apenas este valor como parâmetro. Por fim vamos usar o módulo _Add Rows_ para unir o dataset contendo o parâmetro do web service com os dados que utilizamos no treinamento, assim como nas outras vezes:

{% include image.html link="https://imgur.com/0jsk1OF.png" alt="Azure ML - Web service input - 2" width=80 %}

Agora, por último, vamos simplificar o valor de retorno utilizando o módulo _Data Transformation_ > _Manipulation_ > _Select Columns in Dataset_ entre o _Score Model_ e o _Web Service Output_.

Nas propriedades do módulo incluído vamos selecionar apenas as colunas _Scored Labels_ e _Scored Probabilities_.

Agora sim! -Pressione o botão _RUN_ e depois _DEPLOY WEB SERVICE_ para vermos como nosso serviço irá se comportar!

### Testando o experimento

Após pressionar o botão você será levado automaticamente para a aba _Web services_, nela você poderá realizar seus testes, tanto enviando um único registro, quanto enviando vários (batch execution).

Ao pressionar o botão _Test_ destacado em azul, um diálogo será aberto para que preencha o texto que será enviado como parâmetro:

{% include image.html link="https://imgur.com/0jsk1OF.png" alt="Azure ML - Web service" width=80 %}

Após o processamento o resultado é mostrado na barra inferior:

{% include image.html link="https://imgur.com/1Hwy1lL.png" alt="Azure ML - Web service output" width=80 %}

Neste caso o resultado retornado foi "Positivo", conforme o esperado.

Eu particularmente prefiro o teste que ainda está em preview, ele facilita a visualização dos resultados, veja como o mesmo teste se comporta:

{% include image.html link="https://imgur.com/DwGfrRv.png" alt="Azure ML - Web service output" width=80 %}

Fique à vontade para fazer quantos testes desejar, e aprofunde-se para melhorar ainda mais o modelo que criamos juntos!

{% include image.html link="https://imgur.com/lK2B0zV.png" alt="Azure ML - Web service outputs" width=80 %}

Qualquer dúvida ou sugestão, deixem nos comentários!

E até mais.