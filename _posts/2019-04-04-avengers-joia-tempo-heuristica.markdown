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

{% include github-link.html link="https://github.com/gabrielschade/algorithms/tree/master/AvengersSimulatorHeuristic" %} 

Vamos lá, nessa altura do campeonato quase saindo Vingadores: Ultimato você provavelmente já assistiu Vingadores: Guerra Infinita. Em dado momento da história os heróis vão até a lua titã para enfrentar Thanos, o vilão do filme.

Neste momento o vilão tinha em sua posse duas jóias do infinito, fazendo dele um cara no mínimo, bem difícil de enfrentar.

O Doutor Estranho aproveita um tempo antes da luta para dar uma olhada em sua própria jóia do infinito, o olho de Agamotto. Essa é a jóia do **tempo**, o que concede ao Dr. Estranho diversos poderes, entre eles, a possibilidade de dar uma olhadinha nos futuros possíveis para medir as chances dos heróis vencerem a batalha contra o vilão.

No filme o Dr. Estranho fala que verificou pouco mais de 14 milhões de futuros diferentes. Desses futuros possíveis, somente em **um** deles os heróis saíram vitoriosos.

{% include image.html link="https://imgur.com/JJSLrhh.gif" alt="Olhando para o Futuro" width=50 %}

Parece bastante, eu sei. Mas se passarmos a analisar toda a explosão combinatória de possibilidades, a coisa fica um pouco diferente. Na verdade o Dr. Estranho só viu uma pequena parte de um infinito de possibilidades.

Antes de qualquer coisa precisamos de um ambiente de simulação. Vamos construir um?

### Criando um Ambiente de Simulação

Para permitir a criação de um ambiente de simulação vamos fazer uma simplificação **bastante** grande da realidade do filme e claro, vamos simplificar a forma como os heróis e o titã interagem.

A ideia é que o simulador crie um combate por turnos, algo comum em RPGs tradicionais, como Pokémon, por exemplo.

Geralmente nesses jogos, cada personagem possui um conjunto de golpes, onde o jogador seleciona um deles, depois disso, o inimigo ataca. Um de cada vez de maneira bastante sistemática, sem toda a movimentação e complexa de uma batalha mais real.

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

Isso faz com que as possibilidades de turno cresçam bastante, sofrendo do que chamamos de crescimento exponencial.

Imagine o início da batalha: o Homem de Ferro atacará o Thanos, temos três possibilidades diferentes: ataque normal, forte ou muito forte.

Para cada uma dessas três possibilidades, existem 7 novas possibilidades, onde o Thanos ataca um vingador diferente. Dentro de cada uma dessas 21 possibilidades, são geradas 3 novas, onde o Homem Aranha utiliza as três variações de ataque.

Dentro de cada uma dessas 63 possibilidades, são geradas novas 7 para o turno do Thanos, totalizando 441 e por aí vai. Resultando em uma estrutura gigante.

Uma maneira de organizar isso de forma navegável é fazer com que cada turno seja um nó em uma árvore, todo nó irá conter as possibilidades futuras a partir de si próprio como nós filhos.

Tudo começa em um nó raiz, ou nó de início e as possibilidades são geradas a partir disso, simulando apenas 3 turnos a árvore estaria nesse estado:

{% include image.html link="https://imgur.com/UJ4YMTG.png" alt="Árvore de Turnos" width=100 %}

Note que o turno 3 só foi simulado para um dos possíveis futuros, caso contrário teríamos muito mais nós.

Agora que entendemos como a estrutura deve se comportar, vamos iniciar a implementação da classe `Turno`.

Começando com o básico, bom, o turno é o momento em que algum personagem irá atacar seu oponente. 

Então vamos começar criando as propriedades que irão armazenar o Thanos e o Vingador que irá batalhar com ele:

```csharp
 public class Turno
{
    public Personagem Thanos { get; set; }
    public Personagem Vingador { get; set; }
}
```

É interessante que o turno armazene o estado atual de todos os personagens da batalha, dessa forma conseguiremos entender todo o contexto da batalha olhando para o objeto. 

Também é interessante termos mais informações como: número do turno e a descrição da ação que foi realizada.    

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

Além disso, como vimos anteriormente, vamos criar uma estrutura de árvore, portanto precisamos fazer com que os turnos sejam navegáveis entre os nós da árvore. 

Para isso, vamos fazer com que cada turno possua acesso ao turno anterior que o gerou e aos seus turnos seguintes possíveis:

```csharp
public class Turno
{
    //...
    public List<Turno> TurnosSeguintesPossiveis { get; set; }
    public Turno TurnoAnterior { get; set; }
}
```

Por último teremos uma propriedade calculada para identificar se a batalha acabou neste turno. Essa propriedade deverá retornar `true` quando Thanos estiver sem HP (caso de vitória dos vingadores) ou quando **todos** os vingadores estiverem sem HP (caso de vitória de Thanos).

```csharp
public class Turno
{
    public bool BatalhaAcabou {
        get => !Thanos.EstaVivo 
                || Vingadores.All(vingador => !vingador.EstaVivo);
    }
}
```

Por fim, vamos fazer o cálculo da batalha. No cálculo levaremos em conta o personagem que está atacando, o personagem que está defendendo e os multiplicadores de poder já discutidos anteriormente.

Vamos aproveitar também para registrar a descrição do turno, descrevendo quem atacou quem e qual foi o dano do combate, conforme código:

```csharp
public void CalcularAtaque(
            Personagem atacante,
            Personagem defensor,
            int extraAtacante,
            int extraDefensor)
{
    int ataque = atacante.Ataque * extraAtacante;
    int defesa = defensor.Defesa * extraDefensor;
    int dano = Math.Max(ataque - defesa, 0);
    
    defensor.HP -= dano;
    string caiu = defensor.EstaVivo ? 
                  string.Empty
                  : $"{Environment.NewLine}{defensor.Nome} caiu.";

    Descricao = $"{atacante.Nome} atacou {defensor.Nome} causando {dano} de dano.{caiu}";
}
```

Eu não gosto da ideia de alterarmos a propriedade do HP diretamente por aqui, então que tal criar um método para causar dano no personagem?

Já aproveitamos e validamos que o mínimo de HP possível é zero, evitando que os personagens fiquem com o HP negativo, conforme código:

```csharp
public class Personagem{
    //...

    public void CausarDano(int dano)
    {
        HP -= dano;
        HP = Math.Max(0, HP);
    }
}
```
Agora podemos substituir a alteração via propriedade por uma chamada deste método:

```csharp
public void CalcularAtaque(
            Personagem atacante,
            Personagem defensor,
            int extraAtacante,
            int extraDefensor)
{
    int ataque = atacante.Ataque * extraAtacante;
    int defesa = defensor.Defesa * extraDefensor;
    int dano = Math.Max(ataque - defesa, 0);

    defensor.CausarDano(dano);
    //...
}
```

Antes de criarmos o gerador da simulação já vamos deixar pronto os contrutores para facilitar a criação de nosso turno.

Aqui fica um toque, como queremos armazenar o estado do turno, não podemos simplesmente copiar os objetos para o turno, porque na etapa seguinte, eles sofreriam alteração de estado, afinal um objeto é por padrão, um tipo por referência.

Fica aqui um _disclaimer_, mas estou fazendo a clonagem de valor de uma forma bastante crassa. Eu simplesmente estou transformando a lista dos vingadores em uma `string` JSON e convertendo de volta para objeto.

Isso faz com que seja criada uma lista inteiramente nova, perdendo qualquer vínculo com as referências.

```csharp
public class Turno{
    public Turno()
        {
            TurnosSeguintesPossiveis = new List<Turno>();
        }

        public Turno(
            Personagem thanos, 
            List<Personagem> vingadores, 
            int numero,
            int vingador, 
            Turno turnoAnterior)
        {
            Thanos = new Personagem(thanos);
            TurnosSeguintesPossiveis = new List<Turno>();
            Numero = numero;
            TurnoAnterior = turnoAnterior;

            Vingadores = JsonConvert.DeserializeObject<List<Personagem>>(
                            JsonConvert.SerializeObject(vingadores));

            Vingador = Vingadores[vingador];
        }
}
```

#### Criando o Motor de Simulação

Por fim, a peça que falta para terminarmos nossa simulação é o motor que realiza a simulação própriamente dita. Este motor é responsável por gerar os turnos e controlar a interação entre os personagens.

Vamos começar criando a classe que representa a simulação de batalha. Lembrando que, não iremos simular uma única batalha, mas sim, todos os futuros possíveis previstos pelo Dr. Estranho.

Lembram quando vimos a estrutura da árvore? Ela precisa ter um nó inicial, então a simulação pode ser explorada através do turno inicial.

Além disso, vamos armazenar os nós finais das árvores, onde a batalha acabou. Na prática eles já estariam armazenados em um nó filho do turno inicial, mas é interessante guardarmos os nós finais para facilitar a contagem de batalhas.

Podemos já saber a quantidade de finais possíveis se fizermos um "cache" no momento da construção da árvore, sem precisar navegar pela estrutura mais uma vez.

```csharp
public class SimulacaoBatalha
{
    public Turno TurnoInicial { get; }
    public List<Turno> Vitorias { get; }
    public List<Turno> Derrotas { get; }

    public SimulacaoBatalha(Turno turnoInicial)
    {
        TurnoInicial = turnoInicial;
        Vitorias = new List<Turno>();
        Derrotas = new List<Turno>();
    }
}
```

Agora vamos para o método que gera os novos turnos! Esse método é bem mais simples do que parece, afinal, já criamos boa parte da estrutura antes.

Tudo que ele deverá fazer é, checar o personagem ativo no turno atual: Thanos ou um vingador e gerar os turnos subsequentes de acordo com as regras que definimos anteriormente (força de ataque ou qual vingador o Thanos irá atacar).

Depois dos turnos futuros serem gerados para cada possibilidade, iremos percorrê-los verificando se a batalha já acabou ou se é necessário avançar mais um nível de profundidade para uma nova geração de turnos.

Como esse método será recursivo é interessante mantermos no parâmetro o número de turno (que representa a profundidade do nó na árvore) e o vingador que irá jogar o turno atual.

Vamos criar o esqueleto deste método:

```csharp
 public void GerarProximosTurnosPossiveis(
            Turno turnoAtual,
            int numeroTurno,
            int vingador)
{
    bool turnoThanos = numeroTurno % 2 == 0;
    IEnumerable<Turno> turnosGerados =
        turnoThanos ?
        GerarTurnosPossiveisThanos(turnoAtual, numeroTurno)
        : GerarTurnosPossiveisVingadores(turnoAtual, numeroTurno, vingador);
}

private IEnumerable<Turno> GerarTurnosPossiveisVingadores(Turno turnoAtual, int numeroTurno, int vingadorIndice)
=> Enumerable.Empty<Turno>();

private IEnumerable<Turno> GerarTurnosPossiveisThanos(Turno turnoAtual, int numeroTurno)
=> Enumerable.Empty<Turno>();
```

Para definir se o turno é do Thanos ou de um dos Vingadores, basta checar o nível de profundidade da árvore/número do turno atual. O Thanos sempre irá jogar nos turnos pares, enquanto os vingadores nos turnos ímpares.

Depois disso, são chamados métodos diferentes para cada tipo de turno, afinal os turnos dos vingadores geram três nós subsequentes, enquanto os do Thanos geram sete.

Depois de gerar os turnos precisamos adicioná-los na lista de turnos subsequentes do turno atual, você pode usar o `AddRange` para adicionar a coleção inteira.

```csharp
 public void GerarProximosTurnosPossiveis(
            Turno turnoAtual,
            int numeroTurno,
            int vingador)
{
    bool turnoThanos = numeroTurno % 2 == 0;
    IEnumerable<Turno> turnosGerados =
        turnoThanos ?
        GerarTurnosPossiveisThanos(turnoAtual, numeroTurno)
        : GerarTurnosPossiveisVingadores(turnoAtual, numeroTurno, vingador);

    turnoAtual.TurnosSeguintesPossiveis.AddRange(turnosGerados.ToList());
}
```
Por último criaremos um laço de repetição para percorrer os turnos gerados. Nesse laço, vamos verificar se o turno encerrou o combate ou se é preciso chamar esta função recursivamente para criar novas possibilidades e ir ainda mais fundo na árvore.

```csharp
 public void GerarProximosTurnosPossiveis(
            Turno turnoAtual,
            int numeroTurno,
            int vingador)
{
    bool turnoThanos = numeroTurno % 2 == 0;
    IEnumerable<Turno> turnosGerados =
        turnoThanos ?
        GerarTurnosPossiveisThanos(turnoAtual, numeroTurno)
        : GerarTurnosPossiveisVingadores(turnoAtual, numeroTurno, vingador);

    turnoAtual.TurnosSeguintesPossiveis.AddRange(turnosGerados.ToList());

    foreach (var turnoSeguinte in turnoAtual.TurnosSeguintesPossiveis)
    {
        if (turnoSeguinte.BatalhaAcabou)
            AtualizarValoresPorFimBatalha(turnoSeguinte);
        else
            GerarProximosTurnosPossiveis(
                turnoSeguinte,
                numeroTurno + 1,
                ObterProximoVingador(vingador, turnoThanos, turnoSeguinte));
    }
}

private int ObterProximoVingador(int vingador, bool turnoThanos, Turno turno)
    => 0;

private void AtualizarValoresPorFimBatalha(Turno turnoFinal)
{}
```
Agora que o motor principal está criado, vamos implementar os métodos periféricos, começando pelo último: `AtualizarValoresPorFimBatalha`.

Tudo que temos que fazer aqui é verificar quem venceu a batalha e adicionar na lista correta:

```csharp
private void AtualizarValoresPorFimBatalha(Turno turnoFinal)
{
    if (turnoFinal.Thanos.HP > 0)
        Derrotas.Add(turnoFinal);
    else
        Vitorias.Add(turnoFinal);
}
```

Agora vamos implementar o método `ObterProximoVingador`, tudo que ele deve fazer é alterar o índice dos vingadores após um turno de um vingador, ou incrementar o índice caso o vingador atual tenha sido derrotado em combate.

Lembrando que precisamos voltar ao início da lista depois da última posição.

```csharp
private int ObterProximoVingador(int vingador, bool turnoThanos, Turno turno)
{
    int proximoVingador =
        turnoThanos ?
            vingador
            : ProximoIndiceVingador(vingador);

    while (!turno.Vingadores[proximoVingador].EstaVivo)
        proximoVingador = ProximoIndiceVingador(proximoVingador);

    return proximoVingador;
}

private int ProximoIndiceVingador(int vingador)
{
    vingador++;
    if (vingador > TurnoInicial.Vingadores.Count - 1)
        vingador = 0;
    return vingador;
}
```

Acabei criando um método auxiliar, mas acredito que eles não demandem explicações. Basta procurar pelo próximo vingador vivo.

Agora sim, vamos para os métodos **geradores** de turnos.

Vamos começar com um turno de um vingador. Lembrando que esse turno deve gerar 3 possibilidades: uma com o ataque normal; uma com o ataque dobrado; e outra com o ataque triplicado.

Além de gerar o turno, precisamos calcular o ataque do vingador no Thanos e retornar a coleção de turnos gerados:

```csharp
private IEnumerable<Turno> GerarTurnosPossiveisVingadores(Turno turnoAtual, int numeroTurno, int vingadorIndice)
    => Enumerable.Range(1, 3)
        .Select(poderAdicional =>
        {
            var turno = new Turno(turnoAtual.Thanos,
                        turnoAtual.Vingadores,
                        numeroTurno,
                        vingadorIndice,
                        turnoAtual);

            turno.CalcularAtaque(turno.Vingador,
                                turno.Thanos,
                                poderAdicional,
                                1);
            return turno;
        });
```
Sim, eu sei, estou gerando efeito colateral dentro de um _map_. Isso é uma corrupção em programação funcional, mas para esse contexto, realmente não importa.

Agora vamos para o método gerador de turnos que ocorre quando o Thanos ataca. Nesse caso são gerados N turnos, onde N é o número de vingadores vivos.

Para esse caso, vamos utilizar o bom e velho `for`, percorrendo toda a lista de vingadores e gerando um novo turno para cada ataque.

No caso do Thanos, vamos manter o ataque dele dobrado, mas multiplicaremos a defesa dos vingadores por quatro. Faremos isso para controlar o dano e mesmo assim mantermos um dano bem mais alto quando ele ataca vingadores com menos defesas.

```csharp
private IEnumerable<Turno> GerarTurnosPossiveisThanos(Turno turnoAtual, int numeroTurno)
{
    for (int vingadorIndice = 0; 
        vingadorIndice < turnoAtual.Vingadores.Count; 
        vingadorIndice++)
        if (turnoAtual.Vingadores[vingadorIndice].EstaVivo)
        {
            var turno = new Turno(turnoAtual.Thanos,
                                    turnoAtual.Vingadores,
                                    numeroTurno,
                                    vingadorIndice,
                                    turnoAtual);

            turno.CalcularAtaque(turno.Thanos,
                    turno.Vingador, 2, 4);

            yield return turno;
        }
}
```

Agora vamos para a classe `Program` e fazer a simulação executar!

```csharp
var vingadores = Personagem.GerarVingadores().ToList();
var thanos = Personagem.GerarThanos();

Turno turnoInicial = new Turno(
    thanos,
    vingadores,
    0,
    0,
    null);

SimulacaoBatalha simulacao = 
    new SimulacaoBatalha(turnoInicial);

simulacao.GerarProximosTurnosPossiveis(turnoInicial, 1, 0);
```

Agora é a hora que você nota que seu computador **não é uma jóia do infinito**.

Não conseguimos simular todas as possibilidades, simplesmente porque elas são **muitas**. Vamos fazer uma conta para termos alguma noção numérica.

| Turno | Possibilidades | Nós gerados no Turno |
|-------|----------------|----------------------|
| 0     | 1              | 1                    |
| 1     | 3              | 3                    |
| 2     | 21             | 7                    |
| 3     | 63             | 3                    |
| 4     | 441            | 7                    |
| 5     | 1.323          | 3                    |
| 6     | 9.261          | 7                    |
| 7     | 27.783         | 3                    |
| 8     | 194.481        | 7                    |
| 9     | 583.443        | 3                    |
| 10    | 4.084.101      | 7                    |
| 11    | 12.252.303     | 3                    |
| 12    | 85.766.121     | 7                    |
| 13    | 257.298.363    | 3                    |
| 14    | 1.801.088.541  | 7                    |
| 15    | 5.403.265.623  | 3                    |

{% include image.html link="https://imgur.com/9DYoGnf.png" alt="Olhando para o Futuro" width=50 %}

{% include image.html link="https://i.imgur.com/mVDxIo0.gif" alt="Muitas possibilidades" width=80 %}

Mas se não conseguimos simular tudo, como chegamos em algum lugar?

Precisamos utilizar uma **heurística**.

### Heurísticas

Em computação uma heurística é, em resumo (bem resumido), um atalho. Este tipo de técnica é útil para resolver problemas em que uma abordagem de força bruta é lenta demais.

Geralmente troca-se a busca de uma solução ótima por uma solução boa o suficiente e que pode ser computacionalmente muito mais rápida.

Existem diferentes tipos de heurísticas, em geral, boa parte delas são utilizadas para buscar algo em uma estrutura de dados. O que se enquandra no nosso caso com uma pequena diferença.

Nós estamos gerando as simulações ao mesmo tempo que as estamos avaliando, mas tudo bem, podemos aplicar a heurística da mesma maneira.

Mas como ela funciona?

Na prática precisamos ter uma **função de avaliação**. Essa função irá avaliar os turnos gerados escolhendo de alguma maneira quais caminhos possíveis ainda valem a pena e quais podem ser descartados. 

Por exemplo, se o Thanos derrotar o Dr. Estranho **e** o Homem de Ferro, será que ainda vale a pena tentar continuar a batalha? -Provavelmente não, afinal eles são os dois vingadores mais poderosos.

Você deve se lembrar que cada personagem continha uma propriedade chamada **Pontuacao**, essa é a hora de utilizá-la!

Para a função de avaliação precisamos testar a pontuação do turno e não invidualmente de cada personagem. Vamos utilizar a seguinte fórmula para identificar o quão bom um turno é ou não para os heróis:

```
Pontuacao = Soma da pontuação dos heróis vivos - Quanto o Thanos ainda tem de HP
```

Podemos codificar esta expressão através da seguinte propriedade:

```csharp
public int PontuacaoBatalha
{
    get => Vingadores.Where(vingador => vingador.EstaVivo)
                     .Sum(vingador => vingador.Pontuacao)
            - Thanos.HP;
}
```

Ok, mas por que estamos chamando a propriedade de `PontuacaoBatalha`? -Simples, essa expressão que fizemos reflete a pontuação da batalha até chegar neste turno.

O que é diferente de quanto este turno influênciou para a batalha. Para calcularmos isso, criaremos uma nova propriedade, calculando a diferente entre a pontuação da batalha no turno anterior e após o turno atual.

Essa sim é a expressão que indica a alteração de pontuação causada pelo turno.

```csharp
public int Pontuacao
{
    get => PontuacaoBatalha - TurnoAnterior.PontuacaoBatalha;
}
```

Com essas duas novas propriedades na classe `Turno` podemos partir para a alteração da classe `SimulacaoBatalha`.

Na classe de simulação iremos aplicar um filtro antes de adicionar os nós dos turnos gerados, veja um exemplo:

```csharp
//...

IEnumerable<Turno> turnosGerados =
    turnoThanos ?
    GerarTurnosPossiveisThanos(turnoAtual, numeroTurno)
    : GerarTurnosPossiveisVingadores(turnoAtual, numeroTurno, vingador);


List<Turno> turnosFuturos = AplicarFuncaoAvaliacao(turnosGerados.ToList());
turnoAtual.TurnosSeguintesPossiveis.AddRange(turnosFuturos);

//...

private List<Turno> AplicarFuncaoAvaliacao(IEnumerable<Turno> turnosGerados)
{
    Derrotas.AddRange(turnosGerados.Where(turno => turno.Pontuacao <= -100));
    return turnosGerados.Where(turno => turno.Pontuacao > -100)
                        .ToList();
}
```
No exemplo acima, estamos considerando que só podemos continuar seguindo em frente, caso a pontuação esteja mais alta que -100, caso contrário, simplesmente adicionamos os turnos para a lista de derrotas.

Essa simulação ainda será demorada, mas já temos noção de como aplicar uma função de avaliação. 

Neste teste, chegamos em um milhão de derrotas sem alcançar nenhuma vitória...

{% include image.html link="https://i.imgur.com/2DOP2ah.gif" alt="Thanos vencendo" width=80 %}

Agora que tal parametrizar a função de avaliação? Vamos fazer com que ao criar uma simulação, o programador possa escolher a função de avaliação!

Para isso, nossa função deve receber 2 parâmetros: a lista de turnos futuros possíveis e o turno atual que está sendo comparado.

Além disso ela deve retornar um `bool`, indicando se o turno passou pela função com sucesso e deve continuar sendo um caminho possível.

Vamos criar a propriedade para armazenar a função de avaliação e permitir que ela seja informada no construtor:

```csharp
    public class SimulacaoBatalha
    {
        //...
        public Func<List<Turno>, Turno, bool> FuncaoAvaliacao { get; }

        public SimulacaoBatalha(Turno turnoInicial,
            Func<List<Turno>,Turno, bool> funcaoAvaliacao)
        {
            TurnoInicial = turnoInicial;
            FuncaoAvaliacao = funcaoAvaliacao;
            Vitorias = new List<Turno>();
            Derrotas = new List<Turno>();
        }
    }
```

Agora, vamos alterar o método `AplicarFuncaoAvaliacao` para utilizarmos nossa propriedade:

```csharp
private List<Turno> AplicarFuncaoAvaliacao(List<Turno> turnosGerados)
{
    Derrotas.AddRange(turnosGerados.Where(turno => !FuncaoAvaliacao(turnosGerados, turno)));
    return turnosGerados.Where(turno => FuncaoAvaliacao(turnosGerados, turno))
                        .ToList();
}
```

Agora podemos definí-la na criação da simulação:

```csharp
SimulacaoBatalha simulacao = new SimulacaoBatalha(
                turnoInicial,
                (turnos,turnoAtual) => turnoAtual.Pontuacao > -100
                );
```

Por fim, para simplificar nossas métricas e ver se os vingadores conseguem vencer, podemos aplicar a **extensão singular**. Uma heurística bastante simples que irá seguir apenas pelo melhor turno possível, ou seja, irá seguir por um caminho único:

```csharp
SimulacaoBatalha simulacao = new SimulacaoBatalha(
                turnoInicial,
                (turnos,turnoAtual) => 
                    turnoAtual == turnos.OrderByDescending(t => t.PontuacaoBatalha).First()
                );
```

Nesse caso conseguimos chegar no final da simulação bastante rápido e já podemos ver os resultados:

```
Vit¢rias: 1
Derrotas: 99
Descrição da batalha que levou à vitória:

Homem de Ferro atacou Thanos causando 50 de dano.
Thanos atacou Homem de Ferro causando 80 de dano.

Homem Aranha atacou Thanos causando 35 de dano.
Thanos atacou Homem de Ferro causando 80 de dano.

Nebula atacou Thanos causando 5 de dano.
Thanos atacou Homem de Ferro causando 80 de dano.

Peter Quill atacou Thanos causando 20 de dano.
Thanos atacou Homem Aranha causando 160 de dano.

Drax atacou Thanos causando 20 de dano.
Thanos atacou Peter Quill causando 120 de dano.

Mantis atacou Thanos causando 0 de dano.
Thanos atacou Drax causando 80 de dano.

Doutor Estranho atacou Thanos causando 65 de dano.
Thanos atacou Drax causando 80 de dano.

Homem de Ferro atacou Thanos causando 50 de dano.
Thanos atacou Doutor Estranho causando 160 de dano.

Homem Aranha atacou Thanos causando 35 de dano.
Thanos atacou Mantis causando 320 de dano.
Mantis caiu.

Nebula atacou Thanos causando 5 de dano.
Thanos atacou Drax causando 80 de dano.
Drax caiu.

Peter Quill atacou Thanos causando 20 de dano.
Thanos atacou Nebula causando 160 de dano.
Nebula caiu.

Doutor Estranho atacou Thanos causando 65 de dano.
Thanos atacou Peter Quill causando 120 de dano.
Peter Quill caiu.

Homem de Ferro atacou Thanos causando 50 de dano.
Thanos atacou Homem Aranha causando 160 de dano.
Homem Aranha caiu.

Doutor Estranho atacou Thanos causando 65 de dano.
Thanos atacou Doutor Estranho causando 160 de dano.
Doutor Estranho caiu.

Homem de Ferro atacou Thanos causando 50 de dano.
Thanos caiu.
```

Isso significa que no melhor caso, nosso amigo Tony Stark acaba vencendo o titã!

{% include image.html link="https://i.imgur.com/2JVd48D.gif" alt="Homem de Ferro vencendo" width=80 %}

Uma coisa interessante de notar no resultado gerado, é são listadas apenas 99 derrotas, infelizmente para os nossos heróis essa informação não é completamente verdadeira.

Isso porque os turnos são descartados antes de acabar, então muitos dos nós subsequentes também ocasionariam em uma derrota.

Mesmo em menor escala, vale lembrar que isso também aconteceria para as vitórias, provavelmente os nós próximos ao turno final que levou a vitória também resultariam com a queda do titã.

Vamos fazer uma alteração leve na função de avaliação. Agora vamos continuar pegando sempre o melhor turno, mas depois da jogada de número 25, vamos manter a segunda melhor jogada também.

Isso nos entregaria um resultado de 115 derrotas (podadas) e 3 vitórias diferentes!

Os dois melhores casos acabam com o Tony Stark derrubando o titã, mas em um futuro alternativo, quem faz o trabalho final e fica de pé é o próprio Dr. Estranho!

{% include image.html link="https://i.imgur.com/hEWuGLy.gif" alt="Dr. Estranho vencendo" width=50 %}

Uma das dificuldades de encontrar uma boa função de avaliação é fazer com que o descarte dos turnos aconteça cedo o suficiente para economizar tempo de processamento gerando uma boa amostragem do que pode ou não acontecer.

Você pode fazer clonar o repositório Git desse post e fazer suas próprias simulações!

> O repositório no git está em inglês, mas o código é o mesmo.

### A ideia

Por fim, vale ressaltar que a ideia de usar o Dr. Estranho para gerar uma árvore e utilizar uma heurística para percorrê-la não foi minha.

Eu assisti essa ideia em um vídeo no canal Nerdologia (que já recomendei por aqui), você pode conferir o vídeo abaixo:

{% include youtube-video.html width=560 height=315 url="https://www.youtube.com/embed/Y8j892-qg-4?rel=0" %}

Bom galera, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.