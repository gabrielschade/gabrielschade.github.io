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

O Azure Cognitive Services expõe uma série de serviços para resolver diferentes tipos de problemas, problemas como: análise de vídeos, imagens e até de textos, como este artigo que você está lendo.



### O lado bom e o lado ruim

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