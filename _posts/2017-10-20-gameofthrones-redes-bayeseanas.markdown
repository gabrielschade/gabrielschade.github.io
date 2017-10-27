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

3. A chance de uma mutação causar uma falha genética será 1%;

4. Não será considerado mutação para cura de falhas genéticas herdadas;

5. Vamos limitar a árvore genealógica das famílias envolvidas;


Ok, mas o que é uma rede bayesinana?

É uma técnica computacional diretamente ligada à área da Inteligência Artificial, tendo como propósito a reprodução de raciocíonio lógico probabilístico.
A principal ideia por trás é que eventos passados alteram a probabilidade de um evento correlacionado ocorrer no futuro.

Esta rede é representada por um grafo, onde cada nó possui diferentes estados. Em nosso exemplo, cada nó representará um membro da família, Jaime e Cersei, por exemplo. E cada membro da família terá dois estados: **sem** falha genética (99%) e **com** falha genética (1%).

// INCLUIR PRINT DOS NÓS

Em toda rede bayeseana os nós são interligados de acordo com sua correlação. Em nosso caso, é bastante simples entender a relação entre os nós: os filhos herdam as falhas genéticas dos pais.

Jaime e Cersei possuem três filhos: Joffrey, Myrcella e Tomen. Cada um deles depende dos pais para terem ou não falhas genéticas, por isso seus estados são um pouco mais complexos:

* Quando ambos os pais **não** possuem a falha genética: a probabilidade de ter a falha permanecerá em 1%.
* Quando um dos pais possui a falha genética: a probabilidade de ter a falha é elevada para 50% (metade do gene herdado);
* Quando ambos os pais possuem a falha genética: a probabilidade de ter a falha será 100% (não estamos considerando mutações que curam falhas genéticas)

// INCLUIR PRINT DOS ESTADOS DOS NÓS FILHOS DAS LIGAÇÔES

Através das ligações entre os nós é possível propagar uma evidência pela rede. Ou seja, ao alterarmos a probabilidade de um estado de um nó, todas as outras probabilidades também serão alteradas.

Vamos fazer um exemplo. Imagine que o lunático do Joffrey era desta forma por conta de uma falha genética, então vamos sinalizar que ele com certeza possui uma falha, veja o resultado da rede após informarmos esta evidência:

//IMAGEM APÓS EVIDENCIA

Mas peraí, 26%? Como assim?

Eu explico, esta probabilidade é o resultado do seguinte cenário: Temos 2 pais, cada um provendo metade dos genes para os filhos, 50% cada um.

Agora em nossa rede, não há nenhuma informação que os pais compartilham qualquer quantidade de genes, sendo assim, estamos tratando como se Cersei e Jaime não fossem irmãos e com isso, os genes de Cersei e Jaime teriam vindo de pais diferentes.

Neste caso Joffrey seria composto por 25% dos genes de cada avô. Somamos isso ao 1% de chance da causa ser uma mutação e chegamos nos 26%. Isso se propaga tanto para os pais, quanto para os irmãos de Joffrey.

Mas para termos um resultado mais real e entendermos melhor o problema, precisamos subir um pouco mais na árvore genealógica da família Lannister.

## Criando uma representação da árvore genealógica dos Lannisters

Antes de criarmos os ascendentes dos irmãos, vamos criar o nó do Lannister mais amado **Tyrion** ao lado de Jaime e Cersei.

Agora vamos criar os nós para representar os pais dos Lannisters: Tywin e Joana.

Depois de criar estes nós precisamos reajustar a rede. Agora estes dois são os nós a priori e todos os outros dependem deles, direta ou indiretamente.

Agora as coisas começam a ficar mais complicadas para a família Lannister, se Tywin (também conhecido como pai Lannister) possuir uma falha genética, ferrou.

Cersei e Jaime possuem 50% de chances cada um de ter esta mesma falha, se por um acaso ela realmente foi passada adiante, cada um dos últimos filhos dos Lannister vão ter uma probabilidade de **75%** de ter este mesmo problema.

//IMAGEM APÓS EVIDENCIA

Mas calma, ainda **piora**.

Piora porque Tywin e Joana Lannister são **primos**. E você achando que sua família era complicada.
Para conseguirmos mapear este relacionamento será preciso criar o nó com o pai de Tywin: Tytos e de seu irmão/irmã (não encontrei quem é o parente que é pai biológico) que é um ascendente de Joana.

E para garantir que a rede entenda que eles são irmãos, também criaremos o nó do pai de Tytos (avó de Tywin e bisavó de Cersei e Jaime).

## Experimentos

Por conta deste bônus de seus avôs serem primos, as crianças Lannisters compartilham aproximadamente 78% do material genético. Enquanto os irmãos Lannisters compartilham aproximadamente: 57%.

// IMAGEM APÓS EVIDENCIA

Um comportamento curioso da propagação de evidências que não é muito intuitivo, é o fato de os nós ascendentes sofrem com evidências novas mesmo em nós mais profundos.

Tyrion, o melhor anão que você respeita possui 57% de chance de ter a mesma falha, isso considerando que apenas a Cersei e o Tywin possuíam a falha em questão.

FALAR SOBRE GERAR EVIDENCIA NO JOFFREY E VER OS IMPACTOS + IMAGENS FINAIS

Notem que este tipo de sistema mostra como resultado a probabilidade dos eventos aconteceram, devido à esta natureza, chamamos este tipo de sistema de *Sistemas Probabilísticos*.

Agora vamos fazer algumas experiências para verificar o comportamento da rede!

O que você acha disso?

Me conte nos comentários!

E Até mais!