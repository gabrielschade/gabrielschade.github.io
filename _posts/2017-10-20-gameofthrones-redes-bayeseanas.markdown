---
layout: post
title:  "Game of Thrones e probabilidade utilizando redes bayseanas"
date:   2018-10-20 00:00:00 +0000
comments: true
tags: [Ciência, IA]
---

Game of Thrones (GoT) é sem dúvida um fenômeno mundial. O último episódio da sétima temporada (última temporada exibida) bateu o recorde da série registrando assustadores 12.1 milhões de telespectadores nos Estados Unidos.

Eu não sou nenhum fã super hardcore com conhecimentos sobre toda a mitologia da história e tudo mais, mas uma coisa eu sei, é uma série bastante popular e que nos fornece um bom conteúdo inclusive para **experimentos**.

Caso você esteja totalmente por fora da série você perderá um pouco da graça deste post, mas o conteúdo ainda será útil, mas já avisando: **contém spoilers**.

A ideia principal deste post surgiu do vídeo entitulado: "A genética do incesto em Game of Thrones" do canal Nerdologia, recomendo assistí-lo antes:

{% include youtube-video.html width=560 height=315 url="https://www.youtube.com/embed/BKJkPVBwh_8?rel=0" %}

Aliás, recomendo não só este vídeo, mas o canal inteiro. É uma produção de conteúdos científicos com uma linguagem fácil e bastante divertida. Na minha humilde opinião, um dos melhores canais do youtube brasileiro.

Na história de GoT Cersei Lannister e Jaime Lannister tiverem três filhos. Até aí tudo bem, certo?

**Errado**.

Eles não compartilham o sobrenome por serem casados, mas sim, por serem **irmãos**. As relações incestuosas são um tabu e genéticamente falando isso faz muito sentido. 

Vamos entender melhor o problema: cada um de nós é tem material genético herdado pelo pai e pela mãe biológica, metade de cada um. E quando produzimos um óvulo ou um espermatozóide, passamos metade deste material genético para frente.

Toda essa mistura faz com que nosso material genético seja bastante diversificado e isso é ótimo. Como explicado no vídeo, todos nós carregamos erros em nosso material genético. Mas está tudo bem, afinal herdamos genes dos pais e temos 2 cópias de cada cromossomo.

Com isso, o gene problemático herdado pelo pai pode ser corrigido pelo gene saudável da mãe e vice-versa. Então só teremos problemas, se tanto os genes da mãe quanto do pai possuierem a mesma falha. Isso é bastante raro, exceto entre familiares.

Mas diferente do Átila, minha área de pesquisa não é biologia, então vou vamos focar na questão probabilística do problema.

A modelagem proposta será feita para identificar a probabilidade dos filhos do casal Lannister possuírem uma falha genética, depois disso, vamos comparar com as chances dos possíveis herdeiros de um certo sobrinho com sua tia. 

Vamos partir de algumas premissas:

1. Vamos utilizar redes bayseanas para modelar este problema;

2. Estamos considerando como a genética do nosso mundo funciona, não há evidências se isso se aplica ao universo de GoT;

3. A chance de uma falha genética existir será 1%;

4. Vamos limitar a árvore genealógica das famílias envolvidas;


Ok, mas o que é uma rede bayesinana?

É uma técnica computacional diretamente ligada à área da Inteligência Artificial, tendo como propósito a reprodução de raciocíonio lógico probabilístico.
A principal ideia por trás é que eventos passados alteram a probabilidade de um evento correlacionado ocorrer no futuro.

Esta rede é representada por um grafo, onde cada nó possui diferentes estados. Em nosso exemplo, cada nó representará um membro da família, Jaime e Cersei, por exemplo. E cada membro da família terá dois estados: **sem** falha genética (99%) e **com** falha genética (1%).

// INCLUIR PRINT DOS NÓS

Em toda rede bayeseana os nós são interligados de acordo com sua correção. Em nosso caso, é bastante simples entender esta relação: os filhos herdam as falhas genéticas dos pais.

// INCLUIR PRINT DAS LIGAÇÔES

Através desta ligação torna-se possível que a descoberta de uma evidência do problema altere a probabilidade dos estados de outros nós desta mesma rede.

Caso a Cersei tenha uma falha genética ela herdou de um dos pais, então a probabilidade dos pais da Cersei terem a falha genética não é mais apenas 1%, além disso, como Jaime é seu irmão e herdou os mesmos genes, a probabilidade dele também conter esta falha aumenta.

Notem que este tipo de sistema mostra como resultado a probabilidade dos eventos aconteceram, devido à esta natureza, chamamos este tipo de sistema de *Sistemas Probabilísticos*.

Agora vamos fazer algumas experiências para verificar o comportamento da rede!

O que você acha disso?

Me conte nos comentários!

E Até mais!