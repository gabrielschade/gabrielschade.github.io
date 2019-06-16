---
layout: post
title:  "Como Medimos a Complexidade de um Algoritmo?"
date:   2019-06-16 00:00:00 +0000
image: https://imgur.com/6DpARLR.png
comments: true
tags: [JavaScript, F#, C#, Algoritmos] 
--- 
 
Olá pessoa!

Esse post vai ser um pouco mais teórico, mas muito útil! Será que você sabe medir a complexidade do algoritmo que está criando?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/algorithms/tree/master/BigO" %} 

Na comunidade de desenvolvimento há essa discussão sobre o quão importante é saber medir a complexidade de um algoritmo. Eu não acredito que isso faça parte do básico que todo programador junior deva saber, mas ao mesmo tempo, eu realmente acho que dominar esse conceito te faz sim um programador melhor.

Principalmente quando começamos a falar de aplicações escaláveis, entender como seu algoritmo se comporta de acordo com o tamanho da entrada pode ser extremamente útil.

Vou juntar isso com meus estudos de JavaScript, então para dar uma variada os exemplos serão feitos em JavaScript, F# e C#!

#### Entendendo o Conceito

Quando falamos de complexidade de algoritmo podemos estar lidando com complexidade de tempo (performance) ou espaço (alocação em memória, CPU e outros recursos), neste post vamos lidar apenas com complexidade de tempo, ok?

Outro ponto que é precisi deixar claro é que a complexidade de tempo de um algoritmo, se refere diretamenta à quantidade de vezes em que a operação fundamental do algoritmo é executada, **não confunda isso com o tempo de execução de um determinado algoritmo**.

A diferença entre as duas coisas é bastante nítida. Afinal, o tempo de execução de um programa irá variar de máquina para máquina de acordo com suas configurações. Enquanto que a quantidade de vezes que a operação fundamental é executada permanecerá imutável, independente da máquina que executar o algoritmo.

Veja o gráfico abaixo, ele foi gerado com um código simples em F# para ilustrar algumas das complexidades mais comuns:

{% include image.html link="https://imgur.com/6DpARLR.png" alt="Complexidade de Algoritmos" width=80 %}

No gráfico mostrado acima, o eixo X representa o tamanho da entrada _n_, enquanto o eixo Y representa a quantidade de vezes que a operação fundamental é executada. Na legenda na direita da imagem temos a legenda com algumas das complexidades mais comuns, vamos passar por boa parte delas nesse post.

#### Complexidade O(1) - Tempo Constante

Algoritmos de tempo constante são bastante intuitivos, eles **não** alteram o tempo de execução, independente do tamanho da entrada. Isso significa que esses algoritmos sempre serão os mais rápidos?

-**Não**.

Isso simplesmente significa que eles não irão variar seu tempo de execução, independente do tamanho da entrada, podendo ser um elemento ou cem milhões.

A complexidade sempre estará mais ligada ao quanto o algoritmo é escalável do que ao tempo de fato.

O livro _Cracking the Code Interview_ dá um ótimo exemplo sobre isso, vou pegar ele emprestado para esse post:

Imagine o seguinte cenário, você possui um arquivo em seu computador e precisa compartilhar ele o mais rápido possível com outra pessoa da equipe, essa pessoa está em uma outra cidade. Qual seria a melhor forma de entregar o arquivo para ela?

A resposta mais intuitiva é que enviaríamos esse arquivo pela internet, certo? -Bom, mais ou menos. E se esse arquivo fosse muito, **muito** grande?

Podemos pegar como exemplo, o caso recente dos dados coletados para a foto do buraco negro. Todos os dados foram entregues em discos físicos de avião. Parece estranho, mas de fato era mais rápido entregar os dados com um avião do que transferí-los pela internet.

É aí que entra o tempo constante, entregar um arquivo de avião leva um **tempo constante**, não importa se os dados são um HD de 100TB ou um pen drive de 4GB, pegar o avião e entregar fisicamente para outra pessoa levaria o mesmo tempo.

O que é diferente de um **tempo linear**, que seria o caso da transferência via internet, onde quanto maior o tamanho do arquivo, maior o tempo para transferência.

Ok, mas e um exemplo de código onde isso ocorra?

Podemos checar se uma determinada posição em um array é um número par ou ímpar. Como estamos informando o índice, não importa o tamanho do array, a complexidade sempre será O(1):

{% assign headers = "JavaScript|F#|C#" | split: "|" %}
{% assign gists = "https://gist.github.com/gabrielschade/8bc53b85b0591091f89a2587b0ce5d4d.js|https://gist.github.com/gabrielschade/a365a6d1137a1af6e801d5b1959c1324.js|https://gist.github.com/gabrielschade/190e776dd6c524e62ab0900d815b505f.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=0 %}

#### Complexidade O(n) - Tempo Linear

Algoritmos com complexidade de tempo linear executam a operação fundamental praticamente a mesma quantidade de vezes que o tamanho de sua entrada. Comumente operações que precisam ler um coleção de dados unidimensional completa possuem esta complexidade.

É importante falar que mesmo algoritmos que fazem uso do retorno prematuro, como por exemplo, procurar por um elemento no array, ainda são considerados algoritmos de tempo linear. Pois no pior cenário, este será o tempo consumido pelo algoritmo.

O gráfico abaixo demonstra o crescimento linear de acordo com a entrada do algoritmo:

{% include image.html link="https://imgur.com/fhVAkLi.png" alt="Complexidade de Tempo Linear" width=80 %}

Um exemplo bastante simples de complexidade deste tipo é a busca por um valor em um determinado array:

{% assign gists = "https://gist.github.com/gabrielschade/1bf9914e22e55dd7816e099256b65f69.js|https://gist.github.com/gabrielschade/0fad4b69b8fcc069a719ae8ddb4d10fe.js|https://gist.github.com/gabrielschade/e3838dff7caac8406e865ae9847efab5.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=1 %}

Note que neste exemplo o código em F# destoa bastante dos outros dois, isso porque em F# recomenda-se utilizar recursividade ao invés de laços de repetição. Isso é algo que normalmente tornaria o código pior em termos de complexidade de espaço, afinal teríamos que alocar mais recurso para a _Call Stack_.

Isso não acontece em F# devido à _Tail Recursion_, para saber mais sobre isso, acesse [este post]({{ site.baseurl }}{% link _posts/2019-01-29-recursao-cauda.markdown %}){:target="_blank"}.

#### Complexidade O(n²) - Tempo Quadrático

As coisas começam a ficar mais complicadas a partir de agora, algoritmos com complexidade de tempo quadrática crescem igual ao quadrado do tamanho da entrada. Vários algoritmos que parecem inofensivos acabam entrando aqui, algoritmos como o bom e velho _bubblesort_, por exemplo.

Esses algoritmos geralmente envolvem percorrer uma coleção inteira para cada elemento da coleção. Comumente isso é aplicado em soluções de força bruta. Uma maneira simples de detectar é a identificação de dois laços de repetição aninhados (cuidado, isso não representa a totalidade dos algoritmos de tempo quadrático, é só uma ajudinha).

O tempo de execução desses algoritmos cresce de maneira bastante rápida, veja o gráfico abaixo:

{% include image.html link="https://imgur.com/hDTfwdX.png" alt="Complexidade de Tempo Quadrático" width=80 %}

Veja que em um array de 100 elementos, faríamos 10.000 iterações! Enquanto em um algoritmo de tempo linear, faríamos apenas 100.

Como exemplo para algoritmo deste tipo, veja esta solução para verificar se existem valores duplicados em um array:

{% assign gists = "https://gist.github.com/gabrielschade/ee5f5cf4adde31790ec079607d1afc85.js|https://gist.github.com/gabrielschade/54bc916276dac7dc8d8dd574459a0f74.js|https://gist.github.com/gabrielschade/b3161dbe16352793178ce978ebb3e565.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=2 %}

Veja que como dito antes, os algoritmos em JavaScript e C# possuem 2 laços de repetição aninhados. No entanto, o algoritmo feito em F# também possui complexidade quadrática mesmo sem ter nenhum laço de repetição explícito.

Repetições feitas através de chamadas recursivas também aumentam a complexidade do algoritmo que você está medindo.

#### Complexidade O(2^n) - Tempo Exponencial

Algoritmos de tempo exponencial geralmente indicam um algoritmo que não escala nada bem, em poucas palavras ele indica que para cada novo elemento incrementado no tamanho da entrada a quantidade de operações fundamentais será **dobrada**.

Isso significa que, um algoritmo de tempo exponencial atinge 1 milhão de interações com uma entrada de tamanho 20. Portanto tenha muito cuidado com este tipo de algoritmo, normalmente você precisará de uma heurística ou de programação dinamica para melhorá-los.

Veja o gráfico de crescimento:

{% include image.html link="https://i.imgur.com/JtX6WSz.png" alt="Complexidade de Tempo Exponencial" width=80 %}

Esse gráfico pode enganar um pouco, porque até décimo segundo elemento parece que o resultado está próximo de zero, mas note como os números absolutos no eixo Y são altos. Na verdade, com uma entrada de tamanho 10 o resultado já passa de mil iterações.

Diferente dos algoritmos de tempo quadrático os algoritmos de tempo exponencial podem ser um pouco mais difíceis de detectar, mas geralmente eles envolvem múltiplas ramificações em uma função recursiva. Veja esse exemplo que parece bobo, mas pode ser bastante perigoso, ele lembra bastante um Fibonacci recursivo, mas as duas ramificações abrem diminuindo o valor em 1 (no caso do Fibonacci as duas ramificações são diferentes):

{% assign gists = "https://gist.github.com/gabrielschade/35a749a8a451e7da250a5df260e6cd7c.js|https://gist.github.com/gabrielschade/e3da74e5fe628d20592d61f0c2aea7b9.js|https://gist.github.com/gabrielschade/90eb9c2b72e630ffa58c1b46c41d3a9f.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=3 %}

Nesse caso as três soluções são praticamente idênticas.

#### Complexidade O(log n) - Tempo logarítmico

Essa complexidade de tempo é bastante rápida, na verdade, como você deve notar, ela é inclusive mais baixa do que a complexidade linear O(n). Geralmente algoritmos com esta complexidade cortam o tamanho do problema pela metade até chegar à solução.

Os exemplos mais comuns são operações em árvores binárias ou a famosa busca binária em coleções ordenadas. Essas soluções são altamente escaláveis e eficientes. Com uma entrada de tamanho 1000 são realizadas apenas 10 interações, veja o gráfico:

{% include image.html link="https://i.imgur.com/YQxbmFD.png" alt="Complexidade de Tempo logarítmico" width=80 %}

Para exemplo de código, vamos ver a famosa busca binária:

{% assign gists = "https://gist.github.com/gabrielschade/08dc0075b26bcf51ec93e62619ca993e.js|https://gist.github.com/gabrielschade/1e3a28884a145ac4eceb2790a2033c05.js|https://gist.github.com/gabrielschade/bdb1394ca58d879b6e640e7636558de7.js" | split: "|" %}
{% include code-tab.html headers=headers gists=gists number=4 %}

#### Outros Detalhes

Quando medimos complexidade de algoritmo as constantes são descartadas, por exemplo, caso façamos dois laços de repetição (não aninhados) em uma coleção a complexidade do algoritmo seria O(2n), mas consideramos apenas O(n). 

Vale relembrar que isso acontece porque estamos medindo o quanto o algoritmo é escalável e não o tempo de fato que ele leva para executar.

Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.