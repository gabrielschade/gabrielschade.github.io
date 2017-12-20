---
layout: post
title:  "Game of Thrones e probabilidade utilizando redes baysianas"
date:   2017-10-27 00:00:00 +0000
comments: true
tags: [Ciência, IA]
---

Game of Thrones (GoT) é sem dúvida um fenômeno mundial. O último episódio da sétima temporada (última temporada exibida) bateu o recorde da série registrando assustadores 12.1 milhões de telespectadores nos Estados Unidos.

Eu não sou nenhum fã super hardcore com conhecimentos sobre toda a mitologia da história e tudo mais, mas uma coisa eu sei, é uma série bastante popular e que nos fornece um bom conteúdo, inclusive para **experimentos**.
<!--more-->
Caso você esteja totalmente por fora da série, você perde um pouco da graça deste post e da brincadeira com os elementos da série, mas o conteúdo ainda será útil, mas já avisando: **contém spoilers**.

A ideia principal deste post surgiu do vídeo entitulado: "A genética do incesto em Game of Thrones" do canal Nerdologia, recomendo assistí-lo antes:

{% include youtube-video.html width=560 height=315 url="https://www.youtube.com/embed/BKJkPVBwh_8?rel=0" %}

Aliás, recomendo não só este vídeo, mas o canal inteiro. 

É uma produção de conteúdos científicos com uma linguagem fácil e bastante divertida. Na minha humilde opinião, um dos melhores canais do youtube brasileiro.

Na história de GoT Cersei Lannister e Jaime Lannister tiveram três filhos. 

Até aí tudo bem, certo?

**Errado**.

Eles não compartilham o sobrenome por serem casados, mas sim, por serem **irmãos**. 

As relações incestuosas não parecem ser um problema cultural em GoT, mas genéticamente falando, este tipo de relação pode ser bastante problemático. 

Vamos entender melhor: cada um de nós recebe material genético do pai e da mãe biológica, metade de cada um. 
E quando produzimos um óvulo ou um espermatozóide, passamos metade deste material genético para frente.

Toda essa mistura faz com que nosso material genético seja bastante diversificado e isso é ótimo. 

Como explicado no vídeo, todos nós carregamos erros em nosso material genético. Mas está tudo bem, afinal herdamos genes dos pais e temos 2 cópias de cada cromossomo.

Com isso, o gene problemático herdado pelo pai pode ser corrigido pelo gene saudável da mãe e vice-versa. Então só teremos este tipo de problema, se tanto os genes da mãe quanto do pai possuierem a mesma falha, ou quando um não for suficiente para corrigir o problema herdado pelo outro. 

Isso é bastante raro, exceto entre familiares.

Diferente do Átila, minha área de pesquisa e atuação não é biologia, então vou vamos focar na questão computacional e probabilística do problema que tenho menos chances de falar besteiras.

A modelagem proposta será feita para identificar a probabilidade dos filhos do casal Lannister possuírem uma falha genética, depois disso, vamos comparar com as chances dos possíveis herdeiros de um certo sobrinho com sua tia. 

Vamos considerar algumas premissas:

1. Vamos utilizar redes bayesianas para modelar este problema;

2. Estamos considerando uma versão simplificada de como a genética do nosso mundo funciona, não há evidências se isso se aplica ao universo de GoT;

3. A chance de uma mutação aleatória causar uma falha genética será 1%;

4. Não será considerado mutação para cura de falhas genéticas herdadas;

5. Vamos limitar a árvore genealógica das famílias envolvidas;


Ok, mas o que é uma **rede bayesinana**?

É uma técnica computacional diretamente ligada à área da Inteligência Artificial, tendo como propósito a reprodução de raciocíonio lógico probabilístico.

A principal ideia por trás é deste tipo de implementação é o fato de que eventos passados alteram a probabilidade de um evento correlacionado ocorrer no futuro.

Esta rede é representada por um grafo, onde cada nó possui diferentes estados. 

Em nosso exemplo, cada nó representará um membro da família, Jaime e Cersei, por exemplo. E cada membro da família terá dois estados: **sem** falha genética (99%) e **com** falha genética (1%).

Veja o nó que representa a Cersei, na imagem abaixo:

{% include image.html link="https://i.imgur.com/ws6e4q8.png" alt="Nó representando Cersei" width=80 %} 

Em toda rede bayesiana os nós são interligados de acordo com sua correlação. Em nosso caso, é bastante simples entender a relação entre os nós: os filhos herdam as falhas genéticas dos pais.

Jaime e Cersei possuem três filhos: Joffrey, Myrcella e Tommen. Cada um deles depende dos pais para terem ou não falhas genéticas, por isso seus estados são um pouco mais complexos:

- Quando ambos os pais **não** possuem a falha genética: a probabilidade de ter a falha permanecerá em 1%.

- Quando um dos pais possui a falha genética: a probabilidade de ter a falha é elevada para 50% (metade do gene herdado);

- Quando ambos os pais possuem a falha genética: a probabilidade de ter a falha será 100% (não estamos considerando mutações que curam falhas genéticas)
 
Veja a representação do nó de Joffrey:

{% include image.html link="https://i.imgur.com/VjICdTv.jpg" alt="Nó representando Joffrey" width=80 %} 

Através das ligações entre os nós é possível propagar uma evidência pela rede, ou seja, ao alterarmos a probabilidade de um estado de um nó, as probabilidades de estados de outros nós também poderão ser alteradas.

Vamos fazer um exemplo. Imagine que o lunático do Joffrey era desta forma por conta de uma falha genética, então vamos sinalizar que ele com certeza possui uma falha, veja o resultado da rede após informarmos esta evidência:

{% include image.html link="https://i.imgur.com/1IZ4kb6.jpg" alt="Evidência em Joffrey" width=80 %}

Mas peraí, 26% para todos os outros? Como assim?

Eu explico, esta probabilidade é o resultado do seguinte cenário: Temos 2 pais, cada um provendo metade dos genes para os filhos, 50% cada um.

Agora em nossa rede, não há nenhuma informação que os pais compartilham qualquer quantidade de genes, sendo assim, estamos tratando como se Cersei e Jaime não fossem irmãos e com isso, os genes de Cersei e Jaime teriam vindo de pais diferentes.

Neste caso Joffrey seria composto por 25% dos genes de cada avô. Somamos isso ao 1% de chance da causa ser uma mutação e chegamos nos 26%.

Esta probabilidade se propaga tanto para os pais, quanto para os irmãos de Joffrey.

Mas para termos um resultado mais real e entendermos melhor o problema, precisamos subir um pouco mais na árvore genealógica da família Lannister.

{% include huge-h2.html content="Criando uma representação da árvore genealógica dos Lannisters" %}

Vamos criar os nós para representar os pais dos Lannisters: Tywin e Joana.

Depois de criar estes nós precisamos reajustar a rede. Agora estes dois são os nós a priori e todos os outros dependem deles, direta ou indiretamente.

Agora as coisas começam a ficar mais complicadas para a família Lannister, se Tywin (também conhecido como pai Lannister) possuir uma falha genética, ferrou.

Cersei e Jaime possuem aproximadamente 50% de chances cada um de ter esta mesma falha, além disso, cada um dos filhos do casal terão uma probabilidade de **75%** de ter este mesmo problema.

{% include image.html link="https://i.imgur.com/oreedzZ.png" alt="Evidência em Tywin" width=80 %}

Mas calma, ainda **piora**.

Piora porque Tywin e Joana Lannister são **primos**. 

E você achando que sua família era complicada.

Para conseguirmos mapear este relacionamento será preciso criar o nó com o pai de Tywin: Tytos e de seu irmão/irmã (não encontrei quem é o parente que é pai biológico) que é um ascendente de Joana.

Também será preciso criar o nó para representar os pais de Tytos (avó de Tywin e bisavó de Cersei e Jaime), desta forma, conseguiremos mapear o parentesco entre Tywin e Joana.

Por fim, vamos completar a família criando o nó do Lannister mais amado, **Tyrion**, ao lado de Jaime e Cersei.

{% include huge-h2.html content="Alguns experimentos" %}

Por conta deste bônus de seus avôs serem primos, as crianças Lannisters compartilham aproximadamente 78% do material genético. Enquanto os irmãos Lannisters compartilham aproximadamente: 57%.

{% include image.html link="https://i.imgur.com/3K91oU3.jpg" alt="Evidência em Tywin e Cersei" width=80 %}

Um comportamento curioso da propagação de evidências que não é muito intuitivo, é o fato de os nós ascendentes sofrem com evidências novas mesmo que a evidência seja revelada em um nó mais profundo.

Tyrion, o melhor anão que você respeita, possui 57% de chance de ter a falha genética no cenário atual, onde temos certeza de que apenas Cersei e Tywin possuem a falha em questão.

E se incluirmos a evidência de que Joffrey com certeza também possui a falha?

{% include image.html link="https://i.imgur.com/jrivrco.jpg" alt="Evidência em Tywin, Cersei e Joffrey" width=80 %}

Ao fazer isso aumentamos as chances de Jaime `(57% -> 72%)` possuir esta falha, afinal se um dos filhos com certeza tem o problema, as chances dele ter também aumentam. 

Pela mesma razão, isso aumenta a probabilidade do pai de Tywin, Tytos `(42% -> 45%)` também ter a falha. E da mesma forma que Joffrey aumentou a probabilidade de seu pai, Tytos também o fez. Aumentando a probabilidade de seu pai em 1%.

O aumento da probabilidade do pai de Tytos possuir a falha, propaga para todos os seus descentes: Tio de Tytos `(16% -> 19%)`, Joana `(13% -> 17%)` e por fim, Tyrion `(57% -> 58%)`.

Note também que, aumentando a probabilidade da falha estar em Tytos Lannister e nos ancestrais Lannister, diminuímos a chance da esposa de Tytos conter esta mesma falha `(20% -> 19%)`.

Neste ponto você já deve ter notado que os resultados deste tipo de sistema são as probabilidades dos eventos ocorrerem baseado nas evidências, devido a esta natureza, chamamos este tipo de sistema de *Sistemas Probabilísticos*.

Ainda sobre probabilidades, agora vamos focar em um outro casal, desta vez não são mais irmãos, mas são tia e sobrinho, isso parece muito errado? 

Calma que assim como no caso Lannisters, **piora**.

{% include huge-h2.html content="Targaryens - destruidores da família tradicional" %}

A árvore genealógica dos Targaryen é **gigante** e com muitas, mas muitas coisas erradas. É pai com filha, sobrinho com tia, irmão com irmã e por aí vai.

A versão original da família Targaryen pode ser encontrada [aqui](https://i.imgur.com/hrlwbTg.jpg), para os experimentos criei uma versão simplificada colocando apenas os casamentos entre irmãos. 

Nas imagens irei mostrar apenas os descendentes a partir do rei louco, mas a rede utilizada é maior que isso (será disponibilizada no final do post).

Por conta da quantidade exagerada de gerações onde os irmãos se casaram e tiveram filhos, os irmãos Targaryen compartilham bem mais genes do que os irmãos Lannisters, vistos na rede anterior.

Vamos atribuir a loucura do rei louco a um falha genética, portanto vamos criar esta evidência. 

Além dele, a querida mãe dos dragões já deu alguns indícios de que não bate muito bem. Seus conselheiros vivem alertando-a sobre uma possível loucura e o quão cuidadosa ela deve ser.

Considerando que ela herdou as falhas do pai. Quais são as chances dos irmãos Rhaegar, Viserys também terem o mesmo problema?

{% include image.html link="https://i.imgur.com/FLNxDuv.jpg" alt="Targaryen" width=80 %}

No caso dos irmãos Lannisters as chances eram de 57%, aqui temos um aumento de enormes 30% por conta dos ascendentes. Logo, cada um dos irmãos compartilham quase **90%** genes. O.O

Vamos o momento do **spoiler**, vá direto para o fim do post caso não queira receber informações indesejadas.

O episódio final da sétima temporada mostrou um relacionamento ( ͡° ͜ʖ ͡°) entre Daenerys e Jon Snow.

Até aí tudo bem, o problema é que este mesmo episódio revelou que Daenerys e Jon na verdade são tia e sobrinho. Ou seja, Jon também é um Targaryen.

Por conta da quantidade de casamentos entre familiares Targaryen, Jon e Daenerys compartilham praticamente a mesma quantidade de genes que dois irmãos (45%).

{% include image.html link="https://i.imgur.com/DUIkefk.jpg" alt="Filho de Jon e Daenerys" width=80 %}

Neste cenário, caso nasça uma criança deste relacionamento, há uma probabilidade de 72% da falha genética se propagar.

Não seria nada mal chamá-lo de Aerys III, tendo em vista que podemos ter mais um rei louco acabando com Westeros e causando mais uma guerra. 

Desde que isso renda outra série com esta qualidade, não vejo problema nenhum.

Você pode encontrar as duas redes baysianas utilizadas no experimento neste repositório:
http://bit.ly/GoT-redes-bayesianas

O que você achou deste post?

Gostou? Odiou?

Me conte nos comentários!

E Até mais!