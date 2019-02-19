---
layout: post
title:  "Classificador de Sentimentos - Azure ML"
date:   2019-02-19 00:00:00 +0000
comments: true
tags: [IA]
serie: Azure Machine Learning
---

Olá pessoa!

Em abril do ano passado publiquei um post em Python sobre a criação de um classificador de sentimentos, que tal fazermos o mesmo exemplo, dessa vez utilizando o Machine Learning Studio do Azure?

<!--more-->

Você pode encontrar o post original feito em Python [neste link]({{ site.baseurl }}{% link _posts/2018-04-16-machine-learning-classificador.markdown %}). Além dele, também disponibilzei uma atualização do post, dessa vez em inglês lá [no medium](https://itnext.io/how-to-create-a-sentiment-analyzer-with-text-classification-python-ai-f3a5d10922c5).

O objetivo aqui é fazermos a mesma implementação, só que dessa vez, com o [Azure Machine Learning Studio]({{ site.baseurl }}{% link _posts/2018-01-15-azure-machine-learning.markdown %}).

Vamos usar o mesmo conjunto de dados do post anterior, mas naquela vez os arquivos estavam salvos em um TXT, fiz uma pequena atualização deles para convertê-los para CSV, isso facilitará nosso trabalho.

Você pode acessar os dados [neste repositório](https://github.com/gabrielschade/IA/tree/master/ClassificacaoComentariosAzureML/Datasets) do meu GitHub.


### Vamos começar nossa implementação!

A primeira coisa é acessar o [https://studio.azureml.net](https://studio.azureml.net) e autenticar-se (ou criar sua conta, é gratuito).

Feito isso, acesse a aba _Datasets_, é lá que iremos carregar os arquivos CSV que vamos utilizar.

Após abrir a aba, pressione o botão _+ NEW_, conforme imagem abaixo:

{% include image.html link="https://imgur.com/mC958vO.png" alt="Azure ML - Datasets" width=75 %}

Depois disso, carregue o arquivo localmente de sua máquina, selecionando o tipo de dataset como: _Generic CSV File with a header_ e pressione o botão de _OK_.

{% include image.html link="https://imgur.com/GzAbaoK.png" alt="Azure ML - Datasets upload" width=75 %}

Agora já podemos criar nosso experimento, selecionando a opção _experiments_ > _ + NEW_ > _Blank Experiment_.

O primeiro passo em nosso experimento é unir todos os _datasets_ em um único. Você pode fazer isso manualmente criando um novo arquivo CSV com todos os dados, mas podemos mantê-los separados e unir conforme a necessidade do experimento.

Você pode encontrá-los no módulo _Saved Datasets_ > _My Datasets_, conforme imagem:

{% include image.html link="https://imgur.com/uzaKOGt.png" alt="Azure ML - Datasets no experimento" width=80 %}

Quando precisarmos fazer algum tipo de alteração nos dados provavelmente precisaremos dos módulos agrupados em _Data Transformation_. Nesse caso de agora, vamos unir os dados de diferentes datasets, para isso, usaremos o módulo _Manipulation_ > _Add Rows_.

Este módulo recebe dois parâmetros, ambos datasets, e retorna um novo dataset com a união dos registros dos parâmetros. Simples né?

Vamos utilizar este mesmo módulo duas vezes, dessa forma conseguiremos unir os três datasets distintos.

{% include image.html link="https://imgur.com/66BHcUF.png" alt="Azure ML - Unindo Datasets" width=80 %}

Você pode visualizar os dados combinados no resultado do último módulo:

{% include image.html link="https://imgur.com/N5q5mSJ.png" alt="Azure ML - Datasets unidos" width=80 %}

Agora vamos utilizar um pouquinho de SQL, eu sei disse que não teria código (e na verdade nem precisaria), mas facilitará a visualização dos dados.

Vamos alterar a coluna Value de '0' e '1' para 'Negative' e 'Positive' respectivamente. Para isso, utilize o módulo _Apply SQL Transformation_, ainda no grupo _Manipulation_ de _Data Transformation_. 

Apesar deste módulo poder receber três parâmetros diferentes, utilizaremos apenas um. E como configuração do módulo, utilizarem um script bastante simples, conforme código:

```sql
SELECT 
    Text,
    CASE WHEN Value = 1 THEN 'Positive'
         ELSE 'Negative' 
    END AS Value
         
FROM 
    t1;
```

E pronto!

Não se esqueça também que, caso esteja tendo problemas para visualizar os dados, é necessário executar o experimento pressionando o botão _RUN_ sempre que adicionar novos módulos.

Agora estamos no momento em que, no post em Python, utilizávamos o vetorizador para transformar cada palavra do texto em um valor númerico. Esse valor representa o número de vezes que cada palavra aparece no texto.

Eles são utilizados para o cálculo do quão positivo (ou negativo) é um comentário. Você pode ver a explicação completa na [publicação original]({{ site.baseurl }}{% link _posts/2018-04-16-machine-learning-classificador.markdown %}).

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

Para que o modelo de treinamento seja criado é necessário que ele receba tant o algoritmo quanto o conjunto de dados que será utilizado como treinamento.

{% include image.html link="https://imgur.com/tNID0NE.png" alt="Azure ML - Train Model" width=80 %}

Com as conexões feitas, vamos configurar o modelo para que a classificação tenha como objetivo chegar no valor da coluna _Value_. Um ponto interessante de se notar aqui, é que após o _Feature Hashing_, nosso dataset ficou com muito mais colunas do que continha originalmente, afinal, para cada palavra possível dos dados, uma coluna foi adicionada.

{% include image.html link="https://imgur.com/BlCK1Es.png" alt="Azure ML - Train Model Settings" width=80 %}

Agora conectaremos o resultado do _Train Model_ e a dados para validação com o _Score Model_, que por sua vez, deverá se conectar ao _Evaluate Model_.

{% include image.html link="https://imgur.com/Woe1zZ3.png" alt="Azure ML - Score Model " width=80 %}

Antes de executar o experimento, lembre-se de desmarcar a opção _Append score columns to output_, isso servirá para excluirmos as colunas do dataset do resultado, afinal, só precisamos da análise preditiva.

Já podemos executar e ver os resultados!

### Resultados e Publicação

Ao selecionar a opção _Visualize_ no _Evaluate Model_ podemos checar todo o resultado obtido:

{% include image.html link="https://imgur.com/pqEl81V.png" alt="Azure ML - Evaluate Model " width=80 %}

Aqui temos a matriz de confusão e outras métricas importantes para verificarmos a validação do nosso modelo (que por sinal não é grande coisa). Vamos entender e explorar essas métricas em um post futuro, no momento vamos partir diretamente para a publicação do modelo como um serviço web.

Para iniciarmos o processo de publicação precisamos configurar o ambiente. Podemos fazer isso escolhendo a opção: _Predictive Web Service_ encontrada na barra inferior dentro do agrupador _SET UP WEB SERVICE_, conforme imagem:

{% include image.html link="https://imgur.com/NdBsRNO.png" alt="Azure ML - Publish-1" width=80 %}

Ao pressionar este botão um novo experimento baseado no atual é criado. Ele ficará sob uma nova aba chamada _Predictive experiment_ dentro deste mesmo ambiente.

No novo experimento faremos alguns pequenos ajustes, simplesmente para melhorarmos o consumo do web service.

Primeiro vamos ajustar o que precisa ser passado por parâmetro para o serviço, isso é definido automaticamente pelo Azure ML, mas pode ser facilmente alterado. No Azure ML os parâmetros do web service são definidos pelo dataset ao qual o módulo _Web Service Input_ está conectado.

Se voltarmos ao início do experimento, notaremos que o _Web Service Input_ está conectado com o módulo _Add Rows_. Neste dataset temos duas informações, as colunas: Text e Value, que referenciam o texto e o resultado esperado da classificação.

{% include image.html link="https://imgur.com/nkzKT5Z.png" alt="Azure ML - Web service input" width=80 %}

No nosso contexto, não faz sentido esperarmos que o consumidor do serviço informe o resultado esperado, afinal, o objetivo de criarmos isso é a detecção automática da classificação. 

Este tipo de informação pode ser útil para melhorar a assertividade do modelo enquanto ele ainda é utilizado, mas este não é o foco aqui, então vamos fazer com que seja necessário informar apenas o texto isso.

Para isso, basta fazermos um _work around_, vamos utilizar o módulo _Data Input and Output_ > _Enter Data Manually_. Ele nos permitirá criarmos um CSV manualmente.

Aqui vem o pulo do gato, vamos criar um contendo somente uma coluna: a _Text_. Depois disso, criaremos outro módulo com, mas desta vez, apenas com a coluna _Value_. Isso faz com que tenhamos dois datasets onde cada um possui apenas um dos campos de nossos dados.

Vamos uní-los através do módulo _Data Transformation_ > _Add Columns_, isso fará com que os dois datasets se tornem um só, com o mesmo formato outros datasets do experimento. 

Agora vamos conectar o parâmetro de entrada do web service no mesmo local de entrada do módulo _Add Columns_ em que o dataset com a coluna _Text_ foi conectado. Isso fará com que seja necessário informar apenas o _Text_ como parâmetro do serviço. 

Por fim vamos usar o módulo _Add Rows_ para unir o dataset contendo o parâmetro do web service com os dados que utilizamos no treinamento, assim como nas outras vezes:

{% include image.html link="https://imgur.com/0jsk1OF.png" alt="Azure ML - Web service input - 2" width=80 %}

Terminamos os parâmetros, agora vamos simplificar o valor de retorno. Usaremos o módulo _Select Columns in Dataset_ entre o _Score Model_ e o _Web Service Output_.

Nas propriedades deste módulo vamos selecionar apenas as colunas esperadas como retorno: _Scored Labels_ e _Scored Probabilities_.

Agora sim! -Pressione o botão _RUN_ e depois _DEPLOY WEB SERVICE_ para colocar o nosso serviço no ar!

### Testando o experimento

Após pressionar o botão você será levado automaticamente para a aba _Web services_, nela você poderá realizar seus testes, tanto enviando um único registro, quanto enviando vários (batch execution).

Ao pressionar o botão _Test_ destacado em azul, um diálogo será aberto para que você preencha o texto que será enviado como parâmetro:

{% include image.html link="https://imgur.com/1hL2GZ8.png" alt="Azure ML - Web service" width=80 %}

Após o processamento o resultado é mostrado na barra inferior:

{% include image.html link="https://imgur.com/1Hwy1lL.png" alt="Azure ML - Web service output" width=80 %}

Neste caso o resultado retornado foi "Positivo", conforme o esperado.

Eu particularmente prefiro o teste que ainda está em preview, ele facilita a visualização dos resultados, veja como o um outro teste se comporta:

{% include image.html link="https://imgur.com/DwGfrRv.png" alt="Azure ML - Web service output" width=80 %}

Fique à vontade para fazer quantos testes desejar, e aprofundar-se para melhorar ainda mais o modelo que criamos juntos!

{% include image.html link="https://imgur.com/lK2B0zV.png" alt="Azure ML - Web service outputs" width=80 %}

Qualquer dúvida ou sugestão, deixem nos comentários!

E até mais.