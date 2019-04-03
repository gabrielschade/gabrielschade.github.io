---
layout: post
title:  "A Heurística da Jóia do Tempo do Dr. Estranho"
date:   2019-04-04 00:00:00 +0000
comments: true
tags: [Algoritmos] 
---

Olá pessoa!

Nesse mês de março muita coisa aconteceu! E terão posts sobre isso, sem dúvida.
Mas hoje o post é de uma ideia bastante legal (que não foi minha), sobre como o Dr. Estranho fez a busca nos futuros possíveis da luta dos vingadores com o titã Thanos.

<!--more-->
Vamos lá, nessa altura do campeonato quase saindo Vingadores: Ultimato você provavelmente já assistiu Vingadores: Guerra Infinita. Em dado momento da história os heróis vão até a lua titã para enfrentar Thanos, o vilão do filme.

Neste momento o vilão tinha em sua posse duas jóias do infinito, fazendo dele um cara no mínimo, bem difícil de enfrentar.

O Doutor Estranho aproveita um tempo antes da luta para dar uma olhada em sua própria jóia do infinito, o olho de Agamotto. Essa é a jóia do **tempo**, o que concede ao Dr. Estranho diversos poderes, entre eles, a possibilidade de dar uma olhadinha nos futuros possíveis para medir as chances dos heróis vencerem a batalha contra o vilão.

No filme o Dr. Estranho fala que verificou pouco mais de 14 milhões de futuros diferentes. Desses futuros possíveis, somente em **um** deles os heróis saíram vitoriosos.

Parece bastante, eu sei. Mas se passarmos a analisar toda a explosão combinatória de possibilidades, a coisa fica um pouco diferente. 

O Dr. Estranho só viu uma pequena parte de um infinito de possibilidades, tudo isso devido ao que chamamos de crescimento exponencial.

### Crescimento Exponencial

O crescimento exponencial ocorre quando uma taxa de crescimento não depende de uma constante, mas sim da interação entre uma constante e uma varíavel, como o tempo, por exemplo.

Existe uma lenda que ilustra esse problema muito bem. Trata-se de um rei indiano que foi presenteado com um tabuleiro de xadrez artesanal belíssimo. Feliz com o presente, o rei perguntou qual recompensa o homem gostaria de receber.

O artesão pediu ao rei que seu pagamento não fosse feito em dinheiro, mas sim em arroz. O rei ficou muito feliz com isso e pediu para o artesão explicar melhor.

Aí que entra a pegadinha, o artesão disse ao rei que gostaria de receber um grão de arroz pela primeira casa, dois pela segunda, quatro pela terceira, oito pela quarta e assim por diante.

Esse pedido pode ser traduzido para 2ⁿ, onde _n_ é o número da casa no tabuleiro:
```
2^0 = 1
2^1 = 2
2^2 = 4
2^3 = 8
2^4 = 16
...
2^10 = 1024
...
2^20 = 1 048 576
2^21 = 2 097 152
2^22 = 4 194 304

...
2^64 = 18 446 744 073 709 551 616
```
{% include image.html link="https://imgur.com/XUOwyXH.png" alt="Crescimento Exponencial" width=80 %}

É interessante notar que a partir da casa 20 do tabuleiro de xadrez, já seriam necessários mais de 1 milhão de grãos de arroz. A partir desse ponto, os números continuam crescendo de uma maneira **muito** alta.

Essa taxa de crescimento é semelhante ao que acontece com o problema do Dr. Estranho tentar prever todas as possibilidades futuras. Cada movimento diferente teria que ser previsto, criando um número muito mais alto de possibilidades que os meros 14 milhões previstos por ele no filme.

Para resolver isso, provavelmente a jóia do tempo do Dr. Estranho utiliza alguma **heurística** para otimizar suas buscas.

### Heurísticas

Em computação uma heurística é, em resumo (bem resumido), um atalho. Este tipo de técnica é útil para resolver problemas em que uma abordagem de força bruta é lenta demais.

Geralmente troca-se a busca de uma solução ótima por uma solução boa o suficiente e que pode ser computacionalmente muito mais rápida.

Existem diferentes tipos de heurísticas, em geral, boa parte delas são utilizadas para buscar algo em uma estrutura de dados. O que se enquandra no nosso caso com uma pequena diferença.

Nós estamos gerando as simulações ao mesmo tempo que as estamos avaliando.

Falando nisso, antes de qualquer coisa precisamos de um ambiente de simulação. Vamos construir um?

### Criando um Ambiente de Simulação

Vamos fazer uma simplificação **bastante** grande da realidade e claro, vamos simplificar o combate dos heróis com o titã.

A ideia é que o simulador crie um combate por turnos, algo comum em RPGs tradicionais, como Pokémon, por exemplo.

{% include image.html link="https://imgur.com/Shl73aS.png" alt="Pokemon Red and Blue" width=80 %}

Geralmente nesses jogos, cada personagem possui um conjunto de golpes, onde o jogador seleciona um deles, depois disso, o inimigo ataca. Um de cada vez, sem toda a movimentação do mundo real.

#### Modelando o Personagem

A nossa simulação será um pouco mais simples, cada personagem só terá um golpe padrão e o que definirá seu dano serão seus atributos. Cada personagem possuirá: Nome, Ataque, Defesa, HP e Pontuacao, veja o Homem de Ferro, por exemplo;

{% include image.html link="https://imgur.com/3eeRp0g.png" alt="Homem de Ferro" width=80 %}

* Ataque: Força de ataque do personagem;
* Defesa: Defesa para se proteger do ataque do oponente;
* HP: Energia para se manter em combate;
* Pontuação: Trata-se da importância do personagem para o combate (falaremos mais disso depois);

Todos os personagens, incluindo o Thanos irão conter essas mesmas propriedades. Além disso, podemos ter uma propriedade calculada que indica se o personagem ainda está vivo, basta checar se o HP é maior do que zero.

Com isso podemos definir um personagem com a classe abaixo:

```csharp
public class Personagem
{
    public string Nome { get; set; }
    public int HP { get; set; }
    public int Ataque { get; set; }
    public int Defesa { get; set; }
    public int Pontuacao {get; set;}
    public bool EstaVivo { get => HP > 0; }
}
```

Com isso já é possível criar os métodos que geram os heróis e o vilão.

Lembrando que o Dr. Estranho fez essas previsões durante a batalha na lua titã, então não vamos considerar todos os vingadores, mas sim aqueles que estavam na batalha: Dr. Estranho, Homem de Ferro, Homem Aranha, Nebula, Peter Quill, Drax e a Mantis.

Para criar o método precisamos configurar os atributos de cada herói, aqui fica uma ressalva **gigante** que, eu gosto muito do universo Marvel, mas não sou um especialista, então entendo que as propriedades dos heróis e do vilão são completamente questionáveis.

Mesmo assim, existem algumas coisas que são bastante justas de dizer:

1. O Dr. Estranho aceitou trocar uma jóia do infinito pela vida do Tony Stark (Homem de Ferro), o que dá a entender que ele é muito importante para essa batalha;

2. Individualmente, o Homem de Ferro, Dr. Estranho e Homem Aranha são mais poderosos ofensivamente e mais importantes, que qualquer guardião da galáxia;

3. O Drax e o Peter Quill possuem uma resistência relativamente alta, sendo o Drax um cara monstruosamente forte e o Quill possui parte de poderes divinos, herdado pelo pai.

4. A Mantis não é um herói poderoso em combate, então ela acaba sendo a mais fraca.

De acordo com essas configurações eu cheguei nos parâmetros abaixo:

```csharp
public static IEnumerable<Personagem> GerarVingadores()
{
    yield return new Personagem()
    {
        Nome = "Homem de Ferro",
        Ataque = 90,
        Defesa = 100,
        HP = 250,
        Pontuacao = 150
    };

    yield return new Personagem()
    {
        Nome = "Homem Aranha",
        Ataque = 85,
        Defesa = 80,
        HP = 170,
        Pontuacao = 80
    };

    yield return new Personagem()
    {
        Nome = "Nebula",
        Ataque = 75,
        Defesa = 80,
        HP = 150,
        Pontuacao = 50
    };

    yield return new Personagem()
    {
        Nome = "Peter Quill",
        Ataque = 80,
        Defesa = 90,
        HP = 170,
        Pontuacao = 50
    };

    yield return new Personagem()
    {
        Nome = "Drax",
        Ataque = 80,
        Defesa = 100,
        HP = 170,
        Pontuacao = 40
    };

    yield return new Personagem()
    {
        Nome = "Mantis",
        Ataque = 40,
        Defesa = 40,
        HP = 100,
        Pontuacao = 10
    };

    yield return new Personagem()
    {
        Nome = "Doutor Estranho",
        Ataque = 95,
        Defesa = 80,
        HP = 170,
        Pontuacao = 120
    };
}
```
O método em si, dispensa explicações. A única coisa um pouco diferente aqui, foi que explicitei o nome dos parâmetros, mas fiz isso apenas para simplificar a leitura.

Agora vamos fazer o método para gerar o vilão. Neste caso, ele é muito mais poderoso que qualquer herói individualmente.

```csharp
public static Personagem GerarThanos()
    => new Personagem()
    {
        Nome = "Thanos",
        Ataque = 240,
        Defesa = 220,
        HP = 500,
        Pontuacao = 0
    };
```

Com isso já conseguimos popular nosso campo de batalha com os personagens abaixo:

<div class="row">
<div class="col s12">
 <div class="carousel" style="height:450px;margin-bottom:40px;margin-top:-150px;">
    <a class="carousel-item" href="https://imgur.com/cU6qAeK.png" target="_blank">
        <img src="https://imgur.com/cU6qAeK.png">
    </a>
    <a class="carousel-item" href="https://imgur.com/kh7fKfq.png" target="_blank">
        <img src="https://imgur.com/kh7fKfq.png">
    </a>
    <a class="carousel-item" href="https://imgur.com/2SPReN7.png" target="_blank">
        <img src="https://imgur.com/2SPReN7.png">
    </a>
    <a class="carousel-item" href="https://imgur.com/lDbzQzJ.png" target="_blank">
        <img src="https://imgur.com/lDbzQzJ.png">
    </a>
    <a class="carousel-item" href="https://imgur.com/z3dIXOn.png" target="_blank">
        <img src="https://imgur.com/z3dIXOn.png">
    </a>
    <a class="carousel-item" href="https://imgur.com/2xHoUe7.png" target="_blank">
        <img src="https://imgur.com/2xHoUe7.png">
    </a>
    <a class="carousel-item" href="https://imgur.com/0EBHohO.png" target="_blank">
        <img src="https://imgur.com/0EBHohO.png">
    </a>
    <a class="carousel-item" href="https://imgur.com/bNeV4mA.png" target="_blank">
        <img src="https://imgur.com/bNeV4mA.png">
    </a>
  </div>
  </div> 
</div>

#### Definindo a Mecânica de Turnos

Apesar de termos simplificado bastante os atributos e golpes dos personagens vamos manter a mecânica de turnos clássica. Quem iniciará o combate será um herói, seguido pelo Thanos, próximo herói, Thanos novamente e assim por diante.

Para nossos testes, os turnos ocorrerão na seguinte ordem:

{% include image.html link="https://imgur.com/gpgBJ56.png" alt="Turnos da simulação" width=80 %}

Na prática é a ordem em que eu criei a lista dos vingadores.

Se a nossa batalha é definida por turnos, precisamos definir em nosso código, o que é um turno, certo? -Certo.

Mas antes precisamos entender como essa simulação será feita.

Partiremos do ponto zero, onde o Homem de Ferro fará a primeira ação (assim como no filme). Para adicionar um pouco de dinamismo no combate, faremos com que o golpe de um herói possua 3 variações de modificadores.

1. Golpe normal;
2. Golpe usando o dobro de ataque;
3. Golpe usando o triplo do ataque;

Qual o motivo dessas variações? -Tentar adicionar o dinamismo de um combate. Os multiplicadores de ataque podem ser entendidos como: o herói recebendo ajuda de um ou mais parceiros ou pegando o vilão desprevinido.

Como o Thanos estará lutando sozinho, ele não terá esse bônus, somente os heróis. Mas no turno do Thanos temos mais variações ainda. Afinal de contas, ele poderá atacar qualquer um dos heróis que ainda esteja de pé.

Isso faz com que as possibilidades de turno sofram do crescimento exponencial que falamos no começo do texto.

Imagine o início da batalha: o Homem de Ferro atacará o Thanos, temos três possibilidades diferentes: ataque normal, forte ou muito forte.

Para cada uma dessas três possibilidades, existem 7 novas possibilidades, onde o Thanos ataca um vingador diferente. Dentro de cada uma dessas 21 possibilidades, são geradas 3 novas, onde o Homem Aranha utiliza as três variações de ataque.

Dentro de cada uma dessas 63 possibilidades, são geradas novas 7 para o turno do Thanos... E acaba virando uma estrutura gigante.

Uma forma de organizar isso de forma navegável e fazer com que cada turno seja um nó em uma árvore contendo as possibilidades futuras.

Tudo começa em um nó raiz, ou nó de início e as possibilidades são geradas a partir disso, simulando apenas 3 turnos a árvore estaria nesse estado:

{% include image.html link="https://imgur.com/UJ4YMTG.png" alt="Árvore de Turnos" width=80 %}

Note que o turno 3 só foi simulado para um dos possíveis futuros, caso contrário teríamos muito mais nós.

Vamos começar com o básico, um turno é o momento em que algum personagem irá atacar um oponente. Então vamos começar criando a classe contendo a propriedade que irá armazenar o Thanos e o Vingador que irá batalhar com ele:

```csharp
 public class Turno
{
    public Personagem Thanos { get; set; }
    public Personagem Vingador { get; set; }
}
```

É interessante que o turno armazene o estado atual de todos os personagens da batalha, dessa forma conseguiremos entender todo o contexto da batalha olhando para o objeto. 

Além disso, também é interessante termos mais informações como: número do turno e a descrição da ação que foi realizada.    

```csharp
 public class Turno
{
    public Personagem Thanos { get; set; }
    public Personagem Vingador { get; set; }

    public List<Personagem> Vingadores { get; set; }
    public string Descricao { get; set; }
    public int Numero { get; set; }
}
```


Bom galera, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.