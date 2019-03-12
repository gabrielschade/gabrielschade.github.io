---
layout: post
title:  "Machine Learning: Métricas para Modelos de Classificação"
date:   2019-03-12 00:00:00 +0000
comments: true
tags: [IA] 
---

Olá pessoa!

Mês passado publiquei um post sobre como criar um classificador de textos utilizando o Azure Machine Learning, que tal entendermos melhor as métricas de avaliação?

<!--more-->

Neste post não vamos implementar nenhum modelo novo, usaremos os modelos de classificação criados anteriormente aqui no blog, você pode encontrar o modelo feito em [Python]({{ site.baseurl }}{% link _posts/2018-04-16-machine-learning-classificador.markdown %}) ou feito com o [Azure Machine Learning Studio]({{ site.baseurl }}{% link _posts/2019-02-19-azure-ml-classificador.markdown %}).

O modelo de classificação que criamos indica se um dado comentário é positivo ou negativo em relação à um filme, lugar ou produto, vamos manter este exemplo durante a explicação das métricas.

Vamos dar uma olhada no resultado do modelo criado no Azure ML Studio:

{% include image.html link="https://imgur.com/kSi62t7.png" alt="Métricas de Confusão" width=80 %}

A primeira coisa que podemos notar aqui é a matriz de confusão, composta pelos quatro primeiros valores: True positive, False negative, False positive e True negative:

{% include image.html link="https://imgur.com/vEYRtVQ.png" alt="Matriz de confusão" width=80 %}

Essa matriz é muito útil para avaliação de seu modelo, primeiro porque os dados dela descrevem o resultado da classificação de cada registro e segundo, porque é através dela que obtemos as demais métricas.

Vamos entender o que são cada um desses valores da matriz:

**True positive (TP)**: Este valor indica a quantidade de registros que foram classificados como positivos corretamente, ou seja, a resposta do classificador foi que o comentário era positivo e o comentário realmente era positivo.

**True negative (TN)**: Este valor indica a quantidade de registros que foram classificados como negativos de maneira correta, ou seja, a resposta do classificador foi que o comentário era negativo e o comentário realmente era negativo.

**False positive (FP)**: Este valor indica a quantidade de registros que foram classificados como comentários positivos de maneira incorreta, ou seja, a resposta do classificador foi que o comentário era positivo, mas o comentário era negativo.

**False negative (FN)**: Este valor indica a quantidade de registros que foram classificados como comentários negativos de maneira incorreta, ou seja, a resposta do classificador foi que o comentário era negativo, mas o comentário era positivo.

Através desses quatro valores, seremos capaz de calcular os indicadores: _Accuracy_, _Precision_, _Recall_ e _F1 Score_.

### Accuracy

A Accuracy é o indicador mais simples de se calcular, ele é simplesmente a divisão entre todos os acertos pelo total.

{% include image.html link="https://imgur.com/aDVVqjC.png" alt="Accuracy" width=80 %}

#### Quando uma pontuação alta significa algo?

Este indicador pode acabar enganando um avaliador, para essa pontuação significar algo de fato, é necessário que a base de dados que foi utilizada para avaliação tenha uma boa variedade de resultados.

No nosso exemplo, dos 600 registros utilizados para treinar 268 eram comentários positivos, ou seja, temos aproximadamente 45% positivos e 55% de negativos. Isso faz torna nossa base de avaliação um bom exemplo para quando utilizarmos a _Accuracy_.

Fique atento para os casos onde a base de dados utilizada para avaliação seja composta por majoritariamente um único tipo de de resultado. 

Vamos usar um exemplo hipotético, imagine que criamos um classificador para responder se um determinado exame contém ou não uma doença. Nesse cenário, nossa base de dados será composta por 90% de registros em que a doença não ocorre e apenas 10% de registros onde a doença ocorra.

Imagine agora, que nosso modelo **sempre** responde que não há doenças. Qual seria a _Accuracy_ desse modelo?

Como nossa base é composta por 90% de registros onde de fato não há doença, nosso modelo teria uma _Accuracy_ de **90%**, mesmo ele sendo completamente horrível.

### Precision

A _Precision_ é utilizada para indicar a relação entre as previsões positivas realizadas corretamente e todas as previsões positivas (incluindo as falsas). Para o nosso modelo ela seria utilizada para responder a seguinte questão: De todos os comentários classificados como positivos, qual percentual **realmente** é positivo?

{% include image.html link="https://imgur.com/Tx0Hy3K.png" alt="Precision" width=80 %}

#### Quando uma pontuação alta significa algo?

A métrica _Precision_ nos dá informação sobre falsos positivos, então trata-se de identificar um determinado resultado de maneira precisa.

Imagine que nossa base de dados contenha 1000 comentários, onde apenas 100 deles são positivo. Caso o modelo responda positivo apenas para um destes caso, a _Precision_ ainda estaria 100%. Isso porque os falsos negativos não são considerados nesta métrica.

A principal utilização desta métrica é para modelos onde é preciso minimizar os falsos positivos, neste caso, quanto mais perto dos 100% chegarmos, melhor.

### Recall

A métrica _Recall_ é utilizada para indicar a relação entre as previsões positivas realizadas corretamente e todas as previsões que realmente são positivas (True Positives e False Negatives). Esta métrica é capaz de responder a questão: De todos os comentários que realmente são positivos, qual percentual é identificado corretamente pelo modelo?

{% include image.html link="https://imgur.com/3dqonQz.png" alt="Recall" width=80 %}

#### Quando uma pontuação alta significa algo?

A _Recall_ nos dá informações sobre falsos negativos, esta métrica por si só, não é diretamente vinculada a classificar todos os casos corretamente. Ela indica o quanto nosso modelo está indentificando os casos **positivos** corretamente.

A _Recall_ é bastante útil quando precisamos minimizar os falsos negativos, isso é especialmente útil para casos de diagnósticos, onde pode haver um dano muito maior em não identificar uma doença, do que identificá-la em pacientes saudáveis.

Sempre que precisarmos minizar os falsos negativos devemos buscar uma maior pontuação nesta métrica.

### F1 Score

Talvez a métrica _F1 Score_ seja a menos intuitiva de entender, mas não é nada demais. De forma bastante simples ela é uma maneira de visualizarmos as métricas _Precision_ e _Recall_ juntas.

Uma maneira de unir as duas métricas seria simplesmente calcular a média aritmética, o problema disso é que existem casos onde a _Precision_ ou a _Recall_ podem ser muito baixas enquanto a outra permanece alta.

Isso indicaria problemas na geração de falsos positivos ou negativos, conforme já vimos nos tópicos anteriores. Para ajustar isso, o cálculo é um pouco diferente, mas ainda acaba sendo uma média entre as duas métricas anteriores.

A média que iremos calcular é a [média harmônica](https://pt.wikipedia.org/wiki/M%C3%A9dia_harm%C3%B4nica), quando os dois valores do cálculo são iguais, essa média gera resultados muito próximos da média "comum".

No entanto, sempre que os valores são diferentes, essa média se aproxima mais dos valores menores.

{% include image.html link="https://imgur.com/jO2Ciev.png" alt="F1 Score" width=80 %}

#### Quando uma pontuação alta significa algo?

Para boa parte dos problemas, o _F1 Score_ é uma métrica melhor que a _Accuracy_. Principalmente em casos onde falsos positivos e falsos negativos possuem impactos diferentes para seu modelo. Afinal o _F1 Score_ cria um resultado a partir dessas divergências.

Bom galera, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.