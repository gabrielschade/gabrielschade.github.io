---
layout: post
title:  "O Big-O importa"
date:   2019-06-17 00:00:00 +0000
image: https://imgur.com/6DpARLR.png
comments: true
tags: [C#, F#, Algoritmos] 
--- 
 
Olá pessoa!

Esse vai ser um pouco mais teórico, será que você sabe medir a complexidade do algoritmo que está criando?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/IA/blob/master/ClassificacaoComentariosMLNet/Program.fs" %} 

A notação Big-O pode assustar um pouco e talvez por isso, seja negligenciada por boa parte dos desenvolvedores, mas acredito ser um conceito bastante importante, principalmente em tempos de soluções escaláveis.

Quando falamos de complexidade podemos estar lidando com complexidade de tempo (performance) ou espaço (memória), neste post estaremos lidando apenas com complexidade de tempo, ok?

> **Observação Importante**
> Complexidade de tempo está ligado à quantidade de vezes em que a operação fundamental ocorre, não confunda isso com o tempo de execução de um determinado algoritmo.
> A diferença entre as duas coisas é que o tempo de execução irá variar de máquina para máquina, processador, memória e etc. Enquanto que a quantidade de vezes que a operação fundamental é executada permanecerá imutável, independente da máquina que executar o algoritmo.

Veja o gráfico abaixo, ele foi gerado com um código simples em F# para ilustrar algumas das complexidades mais comuns:

{% include image.html link="https://imgur.com/6DpARLR.png" alt="Complexidade de Algoritmos" width=80 %}

Essa image e as notações na direita significam algo para você? -Se a resposta for não, talvez você esteja sendo um pouco irresponsável em relação ao código que você tem escrito.

O gráfico ilustra a taxa de crescimento na quantidade de operações em relação ao tamanho da entrada do algoritmo.

Para que você entenda melhor a diferença entre as complexidades vamos começar comparando uma solução de tempo constante com uma solução de tempo linear. A situação de exemplo é ilustrada no livro [Cracking the Coding Interview](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850).

#### Tempo constante vs Tempo linear



Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.