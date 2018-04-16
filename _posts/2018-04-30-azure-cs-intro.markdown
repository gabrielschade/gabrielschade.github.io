---
layout: post
title:  "Azure Cognitive Services - Uma visão macro"
date:   2018-04-30 00:00:00 +0000
comments: true
tags: [IA]
---

Olá pessoa!

Vamos falar mais um pouco sobre IA? - Dessa vez, sobre o Azure Cognitive Services!
<!--more-->

Se você não é totalmente familiarizado com os termos sobre inteligência artificial, recomendo fortemente que dê uma passadinha neste [post]({{ site.baseurl }}{% link _posts/2018-03-26-IA-concepts.markdown %}), onde falo sobre alguns termos e depois disso volte aqui.

Machine learning é sem dúvidas uma abordagem muito útil, através dela podemos fazer com que nossas aplicações sejam capazes de detectar padrões, tornando-as mais inteligentes. 

Como já vimos neste outro [post]({{ site.baseurl }}{% link _posts/2018-01-08-machine-learning-intro.markdown %}) introdutório sobre *machine learning*, precisamos realizar algumas tarefas até que nossa solução esteja pronta. Entre essas tarefas estão: 

1. Pré-processamento
2. Treinamento
3. Avaliação

O pré-processamento é o momento onde selecionamos, limpamos e filtramos os dados que serão utilizados para fazer com que nossa solução aprenda; Utilizamos parte destes dados (geralmente algo em torno de  70%) e um algoritmo específico para "ensinar" nosso modelo e por fim, realizamos uma avaliação de assertividade do modelo gerado.

{% include image.html link="https://i.imgur.com/33zhCJj.png" alt="Processos para uma solução em Machine Learning" width=80 %}

A ideia principal por trás do Azure Cognitive Services é abstrair estes processos para facilitar a criação de soluções inteligentes.

Neste caso, você não se preocupa em executar os processos que descrevi antes, você pode simplesmente acessá-los através de uma API Rest. Simples assim!

{% include image.html link="https://i.imgur.com/IzF1Hkl.jpg" alt="Processos para uma solução em Machine Learning" width=80 %}

Com isso estabelece-se o conceito de democratização da IA, fica mais fácil de utilizarmos em nossas aplicações se tudo já estiver pronto, é só consumir! Além disso, são APIs rest como qualquer outra, fazendo com que seja possível consumí-las com qualquer linguagem.

Isso significa que você não precisa mais entender nada de IA ou machine learning? - Com toda certeza, **você ainda precisa entender**. Sem ter uma boa base fica muito complicado distinguir quais serviços utilizar, qual abordagem para resolver um problema e assim por diante.

Mas o que eu consigo fazer com isso?

O Azure Cognitive Services expõe uma série de serviços para resolver diferentes tipos de problemas, problemas como: análise de vídeos, imagens e até de textos, como deste artigo que você está lendo.

Estes serviços são divididos em cinco principais categorias: Visão, Fala, Linguagem, Conhecimento  e Pesquisa. Todas as categorias possuem um serviço customizado, onde você pode utilizar seus próprios dados para treinamento do modelo e os serviços pré-definidos.

Vamos ver cada uma das categorias a seguir.

#### Visão

Esta categoria é utilizada para agrupar os serviços da área de [visão computacional](https://pt.wikipedia.org/wiki/Vis%C3%A3o_computacional) utilizados para extrair informações de imagens e vídeos.

Além do serviço customizado, esta categoria conta com cinco serviços diferentes. O **Computer Vision Service** é um dos meus favoritos. Ele permite extrair um monte de informações a respeito de uma imagem, criando uma série de tags, extrair texto de uma imagem e etc.

O **Content Moderator Service** é um pouco mais específico, mas faz um trabalho bastante impressionante, podendo detectar palavrões em vários idiomas e imagens e vídeos com conteúdos ofensivos.

O **Face API e Emotion API** permitem detectar rostos e emoções relacionadas a cada um dos rostos detectados. Você também consegue predizer algumas informações como gênero e idade das pessoas.

O **Video Indexer** é capaz de extrair informações de um vídeo, como o texto dito, sentimento de um discurso, pessoas envolvidas, palavras chaves e etc.

#### Fala

Esta categoria é utilizada para agrupar os serviços relacionados à linguagem natural por meio de som. Coisas como identificar a voz de uma pessoa e converter uma frase dita em textos são exemplos do que estes serviços podem fazer.

O serviço customizado desta categoria é utilizado principalmente para treinar um modelo para compreender jargões ou gírias específicas que podem não estar mapeadas diretamente no modelo provido pela Microsoft. 

O **Translator Speech API** é um serviço bastante útil desta categoria utilizado para o reconhecimento de um áudio e tradução para um idioma diferente. O **Bing Speech API** é capaz de transformar um áudio em texto de maneira simples.

O último serviço é o **Speaker Recognition API**, utilizado para reconhecer uma pessoa de acordo com o áudio enviado.


#### Linguagem

Esta categoria permite o processamento de linguagem natural por meio de textos, podendo extrair sentimentos e até alterar o idioma do texto. 

O primeiro serviço **Language Understanding (LUIS)** é bastante popular, principalmente por sua relação com os chatbots. Este serviço é treinado a partir de textos e comandos, onde você indicará o que cada coisa pode significar. A partir disso, você terá um modelo que usa esses dados para tentar entender o que as pessoas estão dizendo.

O **Bing Spell Check API** pode detectar erros de digitação e gramática em algum texto específico, enquanto o **Web Language Model API** pode predizer a probabilidade de uma próxima palavra em um texto. Esses dois serviços juntos podem auxiliar teclados em dispositivos móveis, por exemplo.

Existem dois serviços diferentes para análises, ambos bastante poderosos, mas tratam de assuntos diferentes: enquanto o **Text Analytics API** analisar o conteúdo de um texto, extraindo palavras chaves e detectando emoções; o **Linguistic Analytics** analisa as estruturas gramaticais das sentenças.

Por fim, temos o **Translator Text API** bastante similar ao tradutor via áudio, mas desta vez a tradução é realizada através de texto enviado.


#### Conhecimento

Esta categoria é utilizada para mapear informações e dados complexos para tomar decisões inteligentes, como um sistema de recomendação, por exemplo.

Esta é a menor das categorias, possuindo até o momento, apenas dois serviços: Um serviço para tomar decisões baseando-se em dados que você precisa fornecer (**Custom**) e outro serviço para transformar textos em perguntas e respostas para poder utilizarmos em um chatbot (**QnA Maker API**).

#### Pesquisa

A última categoria desta lista é a categoria de pesquisa. Os serviços dessa categoria se conectam as APIs de busca do serviço Bing para buscar imagens, notícias, vídeos e informações sobre algo.

Esta é a maior de todas as categorias, essa categoria é bastante relacionada ao Bing, utilizando esse serviço para fazer diferentes tipos de pesquisa.

**News, Web, Entity, Image e Video Search API** são serviços conectados ao Bing para fazer diferentes tipos de pesquisa: notícias, sites, imagens, vídeos e entidades. Esse serviço entende entidades como: filmes, personalidades, séries, lugares e etc.

O **Bing Autosuggest API** como o nome sugere é um serviço para sugerir o *autocomplete* de frases para melhorar o resultado das pesquisas.


#### O Laboratório

Além dos serviços disponíveis neste catálogo existem uma série de serviços que ainda estão no modo laboratório, esses serviços estão declaradamente em fases de teste, mas você pode utilizá-los se quiser, você verificar os serviços [neste link](https://labs.cognitive.microsoft.com/).

#### Conclusões

Existem uma série de serviços diferentes e você pode utilizá-los em conjunto. Vale ressaltar que essa não é a única opção do mercado e que você pode criar coisas incríveis utilizando vários deles simultâneamente.


#### O lado bom e o lado ruim

Existe várias vantagens em utilizar o Cognitive Services, mas como praticamente todas as coisas do mundo, também há algumas desvantagens que precisam ser destacadas.

{% include image.html link="https://i.imgur.com/fNc3z39.jpg" alt="Processos para uma solução em Machine Learning" width=90 %}

Todas as vantagens são ótimos recursos para ganhar tempo na entrega de uma solução. O fato de ser hospedado no Microsoft Azure garante disponibilidade e performance. Além disso, a etapa de pré-processamento e treino também já está pronta na maior parte dos casos.

As desvantagens são bastante situacionais, precisar de internet pode não parecer um problema tão grande, mas é preciso considerar isso no momento de desenvolver aplicações mobile, por exemplo. Dependendo da região, infelizmente ainda não podemos contar com um serviço de internet de qualidade.

Boa parte dos serviços ainda não possui compatibilidade com o idioma *pt-br*, isso pode ser uma barreira no desenvolvimento de sua aplicação, então vale a pena ter isso em mente.

Por último temos a questão monetária, não vou entrar no mérito de dizer se é barato ou caro. Mas acho importantíssimo frisar que todos os serviços do Cognitive Services podem ser acessados de forma **gratuita**. 

Este processo é bem parecido com a utilização de serviços de mapas, por exemplo. Onde você pode utilizar, mas se precisar responder um volume alto de requisições, terá de pagar. Quanto? Depende do serviço e do plano, então vale a pena dar uma conferida no catálogo de preços.

Este é o único serviço para esta finalidade? -**Não**.

Inclusive recomendo fortemente que você teste outros serviços além deste. Acredito que o player mais famoso e o pioneiro desta área é o *Watson* da IBM, mas além dele ainda temos o Google e a Amazon com serviços deste tipo.

Espero que este post tenha sido esclarecedor de alguma forma!

O que você achou deste post? -Me conta nos comentários!

E Até mais!