---
layout: post
title:  "Azure Machine Learning - Parte 2"
date:   2018-01-17 00:00:00 +0000
comments: true
tags: [IA]
---

Olá pessoas!

Terminou o pré-processamento dos dados no post anterior?

Vamos finalizar o exemplo!
<!--more-->

No [post anterior]({{ site.baseurl }}{% link _posts/2018-01-15-azure-machine-learning.markdown %}) começamos a implementar nosso exemplo, para este post, você deve estar no mesmo ponto.

Caso não tenha feito, sugiro fortemente voltar para a parte 1 antes de continuar. Dito isso, vamos começar com as etapas restantes!

Considerando o fluxograma abaixo, o que ainda falta fazer?

![Fluxograma dos processos em Machine Learning](https://i.imgur.com/33zhCJj.png)

Bom, você deve ter percebido que chegamos até o item *Dados Preparados*, pode parecer que ainda falta bastante coisa, mas estas etapas são mais rápidas que o pré-processamento.

Vamos continuar!

### Treinamento

Esta etapa será bem mais rápida do que anterior! Em um exemplo real, este é o momento de analisar e pensar a respeito dos algoritmos disponíveis. Eu não vou entrar no mérito de definir os algoritmos neste post (talvez em um algum futuro), mas podemos nos basear em um guia mais prático da Microsoft.

> **Atenção**
>
> Este guia não dispensa de maneira **nenhuma** o fato de que você precisa estudar e compreender os algoritmos para tomar as melhores decisões, ele é bastante superficial e visa ajudar quem está completamente perdido.

![Escolhendo o algoritmo](https://i.imgur.com/SlxAV1I.png)

A partir do *Start* da imagem podemos seguir 4 caminhos diferentes:

1. Finding unusual data points
2. Discovering structures
3. Predicting categories
4. Predicting values

Bom, estamos tentando predizer **valores**, então seguiremos pelo caminho de número 4. Entre os algoritmos disponíveis, vamos escolher o *Linear Regression*!

Basta arrastar esse algoritmo para o experimento, ele encontra-se em: *Machine Learning* > *Initialize Model* > *Regression* > *Linear Regression*. Basta arrastá-lo e é isso!

Agora precisamos treinar o modelo, fazemos isso selecionando o componente: *Machine Learning* > *Train* > *Train model*.

Este componente recebe dois parâmetros, consegue imaginar o que é? -Se você achou que os parâmetros eram O algoritmo e o conjunto de dados, é isso aí.

Conecte os componentes e ... Erro. Mas o que é agora?

O problema é que precisamos informar qual coluna estamos tentando predizer. Para fazer isso, selecione o componente e utilize novamente o *column selector*. Mas desta vez selecione apenas a coluna *price*.

![Treinamento do Modelo](https://i.imgur.com/vw7st5B.jpg)

Com isso só falta criar nosso modelo candidato!

Ele funciona de maneira similar ao modelo de treinamento, também contendo duas entradas diferentes, mas desta vez, a primeira entrada não é o algoritmo e sim o modelo treinado.

Basta incluir o componente *Machine Learning* > *Score* > *Score model* e conectar as informações.

![Modelo candidato](https://i.imgur.com/q9XepoS.jpg)

Agora já fechamos a etapa de treinamento, fácil né?

### Avaliação

A etapa de avaliação é absurdamente simples para este exemplo, para obter os resultados de nosso experimento basta incluir o componente *Machine Learning* > *Evaluate* > *Evaluate model*, depois disso conectamos a saída do *Score Model* à primeira entrada deste componente e executamos o experimento!

Agora já é possível visualizar os resultados!

![Resultado](https://i.imgur.com/2h85QVI.jpg)

Parabéns, pode ficar orgulhoso, você acaba de criar um experimento capaz de predizer preços de automóveis com uma taxa de 91% de acerto!

### Considerações Finais

Claro que neste post muita coisa foi simplificada, existe um universo bastante vasto sobre Machine Learning, técnicas de IA e tudo mais.

O objetivo principal era só dar um ponta pé inicial e quem sabe você se interesse pelo assunto!

O que você achou deste post? Quer ver mais posts sobre Machine Learning?

Me conte nos comentários!

E Até mais!