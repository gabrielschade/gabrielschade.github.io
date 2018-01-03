---
layout: post
title:  "Desmistificando Machine Learning"
date:   2018-01-08 00:00:00 +0000
comments: true
tags: [IA]
---

Olá pessoas!

Hoje o post vai ser um pouquinho mais teórico, mas calma, é fácil e pode te ajudar muito!

Se você está lendo este post provavelmente você já ouviu falar em *Machine Learning*, certo?

Mas o que é Machine Learning? - Além de uma buzzword, claro.

Vamos desmistificar este conceito e entender porque tanta gente fala disso.

<!--more-->

Não importa a tecnologia que você trabalha, na verdade você nem precisa ser desenvolvedor. E você deveria conhecer pelo menos o básico sobre Machine Learning.

Esta tecnologia está cada dia mais importante e fazendo mais e mais parte de nossas vidas. Suas recomendações da Netflix, as promoções que você recebe, a montagem da sua timeline, sugestões no YouTube e muitas, mas muitas outras coisas são exemplos do quanto Machine Learning já está presente em nossas vidas.

Ok, vimos o que ela é capaz de fazer. Mas ainda não respondemos a pergunta.

**O que é Machine Learning**?

> Machine learning é uma área da ciência da computação que concede à computadores a habilidade de aprender sem precisar serem explicitamente programados.

Esta definição não é unânime, mas acho que é um caminho.

Listei um monte de exemplos de uso, mas o que todos eles tem em comum?

1. Analisam dados;
2. Buscam padrões nestes dados;
3. Utiliza estes padrões para tentar predizer o futuro;

Ok, o item 3. pode soar meio mágico mesmo. Mas calma, vamos entendê-lo melhor quando chegar a hora.

Mas por que essa tecnologia se chama Machine **Learning**? O que isso tem a ver com aprender?

Bom, você já parou para pensar o que aprender, realmente significa?

Como fazemos para aprender um segundo idioma? Ou mesmo o idioma nativo?

1. Analisamos os dados - Neste caso as letras;
2. Encontramos padrões nestes dados - os sons das letras e como juntas elas formam palavras;
3. Reconhecemos estes padrões cada vez que vimos eles.

De certa forma, isso é o que Machine Learning faz.

Vamos tentar aplicar isso no conjunto de dados abaixo:

| Nome    |  Idade  | Saldo no banco |
|---------|--------:|---------------:|
| Gabriel |  27     | R$ 1600        |
| João    |  18     | R$ 35000       |
| Julia   |  24     | R$ 36500       |
| Amanda  |  30     | R$ 2400        |

Fica fácil encontrar o padrão nestes dados!

Toda pessoa que o nome começa com "J" tem mais de 30000 no banco!

É óbvio que sabemos que isso não é verdade. Este é um dos problemas sobre Machine Learning, para que ela encontre padrões significativos, você precisa ter dados suficientes.

> **Dica**
>
> 4 registros **não** serão suficientes.

No exemplo anterior, o que estávamos tentando encontrar? 

* Uma estimativa de saldo no banco por pessoa?
* Identificar se a pessoa é confiável para um crédito em sua loja?

A resposta é simples, não foi definido o que estávamos procurando. O que nos leva a etapa primordial.

### A primeira e mais importante etapa

Antes de começarmos qualquer tipo de implementação, precisamos de algumas coisas:

1. Escolher a pergunta que estamos tentando responder;
2. Escolher o conjunto de dados para responder esta pergunta;
3. Identificar como medir o resultado.

Escolher a pergunta certa talvez seja a etapa mais importante, afinal, não importa quão boa seja a resposta encontrada quando a pergunta não faz sentido.

Depois disso, precisamos identificar se nosso *dataset* é capaz de encontrar esta resposta e por fim, é importantíssimo identificar como medir se o quão boa ou ruim é a resposta encontrada.

### Terminologia

Antes de falarmos dos processos envolvidos, é interessante você entender alguns termos que são recorrentes neste assunto.

| Termo                          |  Descrição                                                                       |
|--------------------------------|----------------------------------------------------------------------------------|
| Treinamento                    | Preparar os dados para criar um model que pode ser utilizado por uma aplicação   |
| Aprendizado supervisionado     | O resultado que será predizido está nos dados utilizados para treinamento        |
| Aprendizado não supervisionado | O resultado que será predizido **não** está nos dados utilizados para treimaento |

### Processos em Machine Learning

Para entendermos melhor o que significa Machine Learning é importantíssimo entendermos os processos envolvidos!

Veja o fluxo abaixo:

![Fluxograma dos processos em Machine Learning](https://i.imgur.com/33zhCJj.png)

O fluxo define claramente três processos principais:

1. Pré-processamento;
2. Treinamento;
3. Avaliação.

Nesta primeira etapa é onde você obtém os dados de uma ou mais fontes para prepará-los. Esta etapa é muito importante e geralmente é onde você passará mais tempo.

Nos dados que você irá utilizar haverão inconsistências, falta de valores, valores repetidos, informações que você não precisa e assim por diante.

Todos estes tratamentos são os chamados pré-processamentos.

Como resultado, teremos um conjunto de dados tratados e preparados para serem utilizados! Mas não se engane, dificilmente você fará isso de primeira. Como eu disse antes, você passará bastante tempo aqui.

Este processo é altamente interativo, então geralmente você irá tratar os dados várias vezes até que finalmente eles estejam preparados de fato.

Depois dessa longa jornada, você estará pronto para começar a etapa de treinamento.

Na segunda etapa, você deve aplicar algoritmos de aprendizado de máquina sobre os dados preparados que foram obtidos anteriormente. Geralmente os produtos de Machine Learning que você encontra no mercado já possuem uma gama de algoritmos implementados.

Na maioria dos casos, a questão importante aqui é saber quando utilizar cada um dos algoritmos e não como eles são implementados de fato. Eu acho bastante interessante entender os algoritmos e tudo mais, mas você não precisa disso para utilizar Machine Learning.

Estes resultados variam de acordo com os dados e o tipo de aprendizado: supervisionado ou não supervisionado. Existe uma quantidade bem grande de algoritmos possíveis que vão desde árvores de decisão, até redes bayesianas, redes neurais e algoritmos de clusterização.

Como resultado da aplicação deste algoritmo, você terá um modelo candidato, ou seja, um candidato à resultado.

Por fim, na terceira etapa é realizada a avaliação deste modelo, fazendo com que estes dois passos também sejam interativos. Dificilmente seu modelo candidato cumprirá seu papel logo na primeira tentativa.

Após algumas interações você chegará ao seu modelo ideal, que poderá ser disponibilizado para as aplicações o utilizarem!

### Conclusões

O objetivo deste post era explicar os conceitos iniciais e desmitificar algumas coisas sobre este termo tão popular. A partir de agora você já deve estar apto à pelo menos entender uma visão macro desta tecnologia.

Machine Learning não é o futuro, é uma realidade. Estamos usando-a o tempo todo, só nos acostumamos a não percebê-la.

O que você achou deste post?

Me conte nos comentários!

E Até mais!