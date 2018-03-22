---
layout: post
title:  "Nas profundezas do C#"
date:   2018-01-22 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoa!

Hoje vamos discutir sobre quatro conceitos importantíssimos no C#, conceitos estes que todos os programadores deveriam saber, mas na prática, não é bem assim.

Você já ouviu falar de: 

* Stack vs Heap memory
* Boxing vs Unboxing

Caso não esteja afiado, você pode ser surpreendido em uma entrevista de emprego!

Vem comigo e vamos debater um à um!
<!--more-->

Em um [post mais antigo]({{ site.baseurl }}{% link _posts/2017-09-08-equality.markdown %}) comentei sobre a diferença entre as comparações referênciais e estruturais, não é a mesma coisa que discutiremos aqui, mas o tipo do post é similar, talvez você goste daquele também.

Primeiro vamos entender o que acontece quando declaramos uma variável em C#.

Quando declaramos uma variável em uma aplicação .NET estamos alocando um espaço na memória RAM, este espaço vai conter três informações distintas: nome, tipo e valor.

Dependendo do tipo da sua variável ela será alocada em um tipo diferente de memória: *Stack* ou *Heap*.

Vamos entender onde isso acontece com um trecho de código de exemplo:

```csharp
public void Metodo()
{
    int inteiro = 10;
    int segundoInteiro = 5;

    MinhaClasse objeto = 
        new MinhaClasse();
}
```
Com essas três linhas podemos descrever o comportamento citado, vamos lá:

1. Quando declaramos a variável `inteiro` o compilador irá alocar um espaço de memória na *Stack memory*;
2. Quando declaramos a variável `segundoInteiro` o compilar novamente irá alocar um espaço de memória na *Stack memory*;
3. Agora estamos criando um objeto, isso muda tudo. Quando essa linha é executada, é criado um **ponteiro** na *Stack memory* apontando para um objeto na *Heap memory*.

Veja a ilustração a seguir para entender melhor o que está acontecendo linha por linha:

![Stack vs Heap Memory](https://i.imgur.com/c5CjI2u.png)

Podemos perceber algumas coisas na ilustração acima. A primeira delas é que a *Stack memory* de fato funciona de acordo com a estrutura de dados pilha (*stack*), pois cada nova alocação é inserida no topo da pilha. O mesmo vale para a desalocação, apesar de não estar visível na imagem.

Esta memória é responsável por alocar espaço para manter a aplicação operacional, focada em valores à curto prazo, note por exemplo, que ao sair do método a *Stack* é limpa, enquanto a *Heap* permanece intacta.

Além de não ser apagada ao término do escopo, a *Heap memory* não utiliza a estrutura de dados pilha. é somente um espaço contendo vários objetos que podem ser encontrados à qualquer momento em sua aplicação.

Isso significa que os espaços alocados na *Heap memory* nunca saem da memória? Claro que não. Mas para fazer esse trabalho temos o famoso [*Garbage collector*](https://docs.microsoft.com/en-us/dotnet/standard/garbage-collection/).

Outro ponto importante que não fica totalmente transparente na imagem é: a declaração de um objeto não irá alocar automaticamente um espaço na *Heap memory*, ela irá apenas criar o ponteiro na *Stack memory* e manterá seu valor como `null`. O espaço é alocado através da palavra reservada `new`.

Mas afinal, porque existem estes dois tipos diferentes de memória?

Bom, a resposta é simples: Precisa de memória estática? O C# usa a *Stack memory*; precisa de memória dinâmica? - O C# usa a *Heap memory*. Estes conceitos estão bastante relacionados aos *value types* e *reference types* já discutidos no blog.

Agora você já sabe as principais diferenças entre estas duas memórias! Que tal entendermos como passar valores entre elas?

As operações que realizam esta troca de tipo de memória se chamam *Boxing* e *Unboxing*.

Mover dados de um tipo de memória para o outro são considerados **bem** caros em termos de performance, portanto utilize isso, somente quando for necessário.

Mas como isso este tipo de movimentação na memória é feito? - Simples, quando atribuímos um tipo baseado em valor para um tipo baseado em referência. Veja o exemplo:

```csharp
public void Boxing()
{
    int inteiro = 10;

    object objeto = inteiro;
}
```

No código acima estamos realizando uma operação de *Boxing*, ou seja, estamos movendo um dado da *Stack memory* para a *Heap memory*. O *Unboxing* acontece quando é feito o caminho contrário:

```csharp
public void Unboxing()
{
    //...
    object objeto = inteiro;
    int segundoInteiro = (int) objeto;
}
```

Simples né? -Parece ser um monte de nomes complicados, mas na verdade são coisas rotineiras, mas é sempre bom entender melhor o que acontece por baixo dos panos para não fazer besteira.

Gostou deste tipo de post?

Me conte nos comentários!

E Até mais!