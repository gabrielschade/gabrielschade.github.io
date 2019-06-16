---
layout: post
title:  "Como Medimos a Complexidade de um Algoritmo?"
date:   2019-06-17 00:00:00 +0000
image: https://imgur.com/6DpARLR.png
comments: true
tags: [JavaScript, F#, C#, Algoritmos] 
--- 
 
Olá pessoa!

Esse post vai ser um pouco mais teórico, mas muito útil! Será que você sabe medir a complexidade do algoritmo que está criando?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/IA/blob/master/ClassificacaoComentariosMLNet/Program.fs" %} 

Na comunidade de desenvolvimento há essa discussão sobre o quão importante é saber medir a complexidade de um algoritmo. Eu não acredito que isso faça parte do básico que todo programador junior deva saber, mas ao mesmo tempo, eu realmente acho que dominar esse conceito te faz sim um programador melhor.

Principalmente quando começamos a falar de aplicações escaláveis, entender como seu algoritmo funciona dependendo do tamanho da entrada pode ser extremamente útil.

Vou juntar isso com meus estudos de JavaScript, então para dar uma variada os exemplos serão feitos em JavaScript, F# e C#!

#### Entendendo o Conceito

Quando falamos de complexidade de algoritmo podemos estar lidando com complexidade de tempo (performance) ou espaço (alocação em memória, CPU e outros recursos), neste post vamos lidar apenas com complexidade de tempo, ok?

Uma coisa bastante importante é que quando falamos de complexidade de tempo de um algoritmo, estamos nos referindo diretamenta à quantidade de vezes em que a operação fundamental do algoritmo ocorre, **não confunda isso com o tempo de execução de um determinado algoritmo**.

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

Isso não acontece em F# devido à _Tail Recursion_, para saber mais sobre isso, acesse [este post]({{ site.baseurl }}{% link _posts/2019-01-29-recursao-cauda.markdown %}){:target="_blank"}

Bom, o post de hoje era isso!


Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.