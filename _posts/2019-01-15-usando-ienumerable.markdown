---
layout: post
title:  "Vamos entender o IEnumerable?"
date:   2019-01-15 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoa!

Praticamente todo programador C# já se deparou com a interface IEnumerable, né?

Principalmente com aquele `ToList()` depois de uma operação LINQ. E talvez, só talvez, você ainda não tenha entendido como esta interface funciona.

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/posts-blog/tree/master/IEnumerableSamples/IEnumerableSamples" %} 

O motivo principal de eu escrever este artigo é a quantidade de vezes que já me deparei com utilizações no mínimo questionáveis desta interface tão popular.

Você deve ter visto esta interface quando precisou utilizar alguma coleção do C#, pode ser um array, uma lista e por aí vai.

Antes de começarmos temos que ter em mente três características básicas do IEnumerable:

1. Ele não permite alteração nas coleções, funciona apenas como leitura (por isso que o LINQ gera novas coleções ao invés de causar efeitos colaterais);

2. Ele não fornece nenhuma informação sobre a coleção além do necessário para percorrê-la;

3. Ele não permite acesso à posições aleatórias da coleção, você só consegue percorrer de forma sequencial ou retornar ao início.

Uma boa forma de visualizar como funciona a iteração da coleção é lembrar da fita da máquina de turing, ok, talvez eu tenha ido um pouco longe, mas vamos lá:

{% include image.html link="https://i.imgur.com/TNuQcrF.png" alt="Colecao" width=75 %}

A seta indica a posição atual do elemento, lembrando que esta seta só se move para a direita.

Agora vamos falar um pouco da implementação, começando pela inteface IEnumerable:

```csharp
public interface IEnumerable<out T> : IEnumerable
{
    IEnumerator<T> GetEnumerator();
}

public interface IEnumerable
{
    IEnumerator GetEnumerator();
}
```

É só isso. IEnumerable é uma interface de um único método: `GetEnumerator`, que como o nome sugere, obtém um _enumerador_, um objeto que implementa a interface `IEnumerator`.

Este sim é o nosso cara, o `IEnumerator` possui a seguinte implementação:

```csharp
public interface IEnumerator
{
    object Current { get; }
    bool MoveNext();
    void Reset();
}
```
Obs: também há uma implementação de IEnumerator **com** generics, a única diferença é a tipagem do `Current` de `object` para `T`:

```csharp
public interface IEnumerator<out T> : IEnumerator, IDisposable
{
    T Current { get; }
}
```

O `IEnumerator` é o que permite iterarmos pela **coleção**, então, esse é o cara responsável por deixarmos algo iterável. De fato, quando utilizamos um foreach, internamente o C# chama o método `GetEnumerator` da coleção e a cada condição do loop ele executa um `MoveNext`.

Vamos fazer um exemplo **super** simples que percorre um array de inteiros:

```csharp
void ForeachIterate(IEnumerable<int> colection)
{
    foreach(int value in colection)
    {
        Console.WriteLine(value);
    }
}
```

O que eu comentei sobre o processo interno do C# é que o código anterior, é apenas um atalho sintático para a seguinte operação:

```csharp
void WhileIterate(IEnumerable<int> colection)
{
    using(IEnumerator<int> enumerator = colection.GetEnumerator())
    {
        while (enumerator.MoveNext())
        {
            int value = enumerator.Current;
            Console.WriteLine(value);
        }
    }
}
```
Código muito mais feio, mas que faz a mesmíssima coisa. A primeira etapa é obtermos o enumerator, pois como falamos antes, ele que nos dá o controle necessário para a iteração na coleção.

Neste ponto é interessante lembrarmos da imagem do estado inicial da coleção, lá do começo do post, onde tínhamos uma seta (cursor) indicando a posição atual (apontando para um posição antes do início da coleção) e uma fita mostrando as posições da coleção.

O método `MoveNext` realiza duas operações diferentes: a primeira é alterar o cursor do enumerator uma posição para a direita, depois disso, o método retorna `true` caso o cursor esteja apontando para uma posição válida da coleção ou `false` caso não esteja.

Na primeira iteração, o resultado da coleção seria este:

{% include image.html link="https://i.imgur.com/teti0zA.png" alt="Colecao estado 2" width=75 %}

A propriedade `Current` simplesmente obtém o valor para o qual o cursor está apontando neste momento.

Legal né?

Com isso, conseguimos inclusive criar uma estrutura que interaja com o `foreach`. Que tal fazermos uma coleção que contenha **todos** os números inteiros positivos que existem?

Ué, como vamos fazer uma coleção com todos os números positivos, se eles são infinitos? -Simples, fazendo uma lista que compute infinitamente o próximo número.

Antes de começarmos vale um disclaimer, o objetivo dessa implementação é vermos como os métodos do IEnumerator interagem com o foreach e a com a coleção, não julgue isso como a melhor implementação possível para uma coleção do zero, certo?

Agora sim, vamos começar. Primeiro vamos implementar o `IEnumerator` da nossa lista infinita:

```csharp
public class InfinityNumbersListEnumerator : IEnumerator<int>
{
    public int Current => throw new NotImplementedException();

    object IEnumerator.Current => throw new NotImplementedException();

    public bool MoveNext()
    {
        throw new NotImplementedException();
    }

    public void Reset()
    {
        throw new NotImplementedException();
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }
}
```

Este é o template de nosso código, simplesmente criamos a classe e implementamos a interface `IEnumerator`.

Além disso, vamos criar um membro interno para conter o valor atual que será retornado pelo `Current` (geralmente este valor é coletado da coleção e não fica no enumerador).

```csharp
public class InfinityNumbersListEnumerator : IEnumerator<int>
{
    private int _current = -1;
    public int Current => _current;

    object IEnumerator.Current => _current;

    public bool MoveNext()
    {
        throw new NotImplementedException();
    }

    public void Reset()
    {
        throw new NotImplementedException();
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }
}
```
Por que este valor inicia com -1? Simples, lembre-se que o cursor começa antes da posição zero, então este valor deve ser zero após a primeira chamada do método `MoveNext`.

Depois dessa, fica fácil saber como implementar o `MoveNext` né? Basta adicionar um ao `_current` e sempre retornarmos `true`, afinal, a coleção não deverá acabar.

No caso do `Reset` iremos simplesmente retornar o valor para o inicial.

```csharp
public class InfinityNumbersListEnumerator : IEnumerator<int>
{
    private int _current = -1;
    public int Current => _current;

    object IEnumerator.Current => _current;
    public bool MoveNext()
    {
        _current++;
        return true;
    }

    public void Reset()
    {
        _current = -1;
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }
}
```

Por enquanto vamos deixar o método `Dispose` assim mesmo. Agora vamos para a implementação da lista que irá implementar `IEnumerable<int>`.

```csharp
public class InfinityNumbersList : IEnumerable<int>
{
    private readonly InfinityNumbersListEnumerator _enumerator;
    
    public InfinityNumbersList()
    {
        _enumerator = new InfinityNumbersListEnumerator();
    }
    public IEnumerator<int> GetEnumerator()
    => _enumerator;

    IEnumerator IEnumerable.GetEnumerator()
    => _enumerator;
}
```
Simples né? -Talvez você precise retornar novos enumerators à cada chamada por algum motivo de paralelismo ou algum caso específico, mas para o nosso exemplo, termos apenas um funcionará corretamente.

Agora já podemos percorrer nossa lista utilizando um foreach! Claro que o código

```csharp
static void Main(string[] args)
{
    InfinityNumbersList allNumbers = new InfinityNumbersList();
    foreach(int number in allNumbers)
    {
        Console.WriteLine(number);
    }
}
```

Com isso teremos um laço de repetição infinito em um **foreach**, conforme imagem:

{% include image.html link="https://i.imgur.com/31zU4HB.png" alt="Colecao infinita sendo executada" width=75 %}

Legal né?

Isso significa que tudo foi implementado corretamente? -Não mesmo. Vamos forçar uma quebra do laço de repetição para vermos o que acontece:

```csharp
InfinityNumbersList allNumbers = new InfinityNumbersList();
foreach(int number in allNumbers)
{
    Console.WriteLine(number);

    if (number >= 100)
        break;
}
```

Uma *exception* foi lançada!

Isso porque não implementamos o método `Dispose`. Mas peraí, não estamos utilizando o `using` porque o método `Dispose` foi chamado?

Lembra do exemplo que fizemos lá no começo mostrando como o `foreach` é implementado com o `while`? Pois é, na prática nosso código funciona como se fosse escrito desta maneira:

```csharp
InfinityNumbersList allNumbers = new InfinityNumbersList();
using (IEnumerator<int> enumerator = allNumbers.GetEnumerator())
{
    while (enumerator.MoveNext())
    {
        int value = enumerator.Current;
        Console.WriteLine(value);

        if (value >= 100)
            break;
    }
}
```
Assim fica bem mais claro o motivo do método `Dispose` ser chamado, afinal, estamos em um bloco de `using`. Vamos simplesmente colocar uma chamada ao método `Reset` dentro do `Dispose` e testar novamente.

Agora sim, sem problemas! -Inclusive podemos testar mais de uma vez que o `Current` reiniciará corretamente.

> **Atenção**
> Esta não é a maneira correta de implementar o `Dispose`, não quis estender o post e alterar o foco, por isso simplesmente chamamos o `Reset`.



Gostou desse tipo de post?

Me conte nos comentários!

E Até mais!