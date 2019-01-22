---
layout: post
title:  "Vamos entender o IEnumerable? - Parte II"
date:   2019-01-22 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoa!

Vamos continuar com o post sobre IEnumerable em C#, dessa vez, vamos ver os efeitos colaterais de usar esta interface de maneira errada.

<!--more-->

Caso você não faça ideia do que eu estou falando, você pode conferir [este post]({{ site.baseurl }}{% link _posts/2019-01-15-usando-ienumerable.markdown %}), onde eu publiquei a primeira parte do conteúdo sobre o `IEnumerable`.

A leitura do primeiro post não é obrigatória para você entender este, mas recomendo para que você possa compreender melhor como o `IEnumerable` funciona.

Neste post vamos ver as diferenças de comportamento entre um `IEnumerable` e um `List`, parece simples não é?

Vamos começar com o seguinte com o seguinte exemplo de código:

```csharp
IEnumerable<int> colecao = new int[] { 1, 3, 5, 6, 7 };

int[] array = colecao.Where(value => value % 2 == 0)
                     .Select(value => value * value)
                     .ToArray();
```
Este é um código bastante simples, você provavelmente já deve ter visto algo parecido.

Mas você saberia me dizer como este código realmente é executado? -Quantos elementos passam pelo `Where`? E pelo `Select`?

Se o código fosse executado de maneira "tradicional", como são duas chamadas distintas, o algoritmo iria percorrer toda a coleção removendo os elementos que não passam pelo filtro e depois disso elevando os elementos que sobraram ao quadrado.

Neste caso, este algoritmo teria complexidade _O(N)_ + _O(M)_ onde, N é o tamanho do array antes do filtro e M é o tamanho do array depois do filtro.

No entanto, a complexidade real deste algoritmo é de apenas _O(N)_, isso porque as operações acontecem uma após à outra durante o **mesmo** loop. O que é bastante interessante, mas pode causar alguns efeitos comportamentais que, se não sabidos previamente, podem dar uma boa dor de cabeça.

Vamos começar fazendo o exemplo utilizando uma lista, onde as coisas são executadas de maneira "tradicional". Para começar criaremos o método que gera a lista, esse método irá fazer um loop de zero até 9 adicionando o número na lista:

```csharp
List<int> GenerateList()
{
    List<int> list = new List<int>();
    for (int index = 0; index < 10; index++)
    {
        Console.WriteLine($"The value {index} has been added.");
        list.Add(index);
    }

    return list;
}
```
Vamos colocar mensagens no console na interação com cada elemento, desse jeito facilitamos a visualização do que está ocorrendo durante a execução.

No método `Main` faremos algumas operações com esta lista. Primeiro vamos simplesmente fazer um loop utilizando o `foreach`:

```csharp
static void Main(string[] args)
{
    List<int> list = GenerateList();

    Console.WriteLine("");
    Console.WriteLine("List has been created");

    foreach (var value in list)
    {
        Console.WriteLine($"The value {value} has been found.");
    }
    
    Console.ReadKey();
}
```
Agora vamos continuar fazendo mais três operações:
1. Mostrar o resultado da propriedade `Count`;
2. Mostrar o resultado do método `Any`;
3. Executar o método `ToArray`.

```csharp
//...
Console.WriteLine("");
Console.WriteLine($"Count: {list.Count}");

Console.WriteLine("");
Console.WriteLine($"Any: {list.Any()}");

Console.WriteLine("");
int[] array = list.ToArray();
//...
```
Vamos executar e ver o resultado destas operações:

{% include image.html link="https://imgur.com/Ejur5ky.png" alt="List operations" width=75 %}

Até aqui nenhuma grande surpresa, as coisas são executadas na ordem em que foram declaradas, primeiro quando cada elemento é adicionado na lista, depois no `foreach`, `Count` e por fim no `Any`.

Vamos fazer a mesma coisa, mas desta vez, vamos trabalhar com um `IEnumerable` ao invés de uma lista.

Vamos começar com o método para gerar o `IEnumerable`, dessa vez, usando a palavra reservada `yield`:

```csharp
IEnumerable<int> GenerateIEnumerable()
{
    for (int index = 0; index < 10; index++)
    {
        Console.WriteLine($"The value {index} has been added.");
        yield return index;
    }
}
```
O método em sua essência é o mesmo, gera uma coleção, exibindo uma mensagem ao passar por cada elemento.

Todo o corpo do método principal não precisa ser alterado, basta alterarmos o tipo da lista para um `IEnumerable` e apontar a chamada para criação da coleção para o novo método:

```csharp
static void Main(string[] args)
{
    IEnumerable<int> ienumerable = GenerateIEnumerable();
    //...
}
```

Antes de executar, você consegue prever o resultado? -Talvez você se assuste um pouco.

Mas vamos lá:

{% include image.html link="https://imgur.com/uyoPZ4p.png" alt="IEnumerable operations" width=75 %}

Se você se surpreendeu com o resultado, tenho más notícias, talvez você esteja piorando seu software sem nem se dar conta disso.

Note que foram feitas muitas operações a mais do que no caso da lista, isso significa que usar a lista é melhor que usar um `IEnumerable`? - De maneira nenhuma.

Simplesmente estávamos trabalhando com o `IEnumerable` como se fosse uma lista, o que claramente não é o caso. Vamos fazer um passo a passo para entender o que houve.

Note que a mensagem notificando que o `IEnumerable` foi gerado foi exibida antes das mensagens que notificam que cada elemento foi adicionado na coleção, por quê?

Isso ocorre por conta do `IEnumerable` possuir uma característica de avaliação _lazy_, ou seja, o valor de um `IEnumerable` não está armazenado verdadeiramente na estrutura, ele só será computado quando precisarmos dele.

Esse é o motivo dele conseguir realizar as operações no mesmo loop o que pode causar um imenso ganho de performance (ou perda, quando usado de forma errada).

Note que quando começamos a iterar cada elemento no `foreach` ele é computado individualmente, ou seja, o nosso `yield` return é executado de um elemento e ainda nesta iteração, a operação interna do foreach já é executada sobre o **mesmo elemento**.

No caso da lista, criar a lista e percorrê-la possuia complexidade _O(N²)_, enquanto no caso do `IEnumerable` realizamos estas duas operações em _O(N)_, legal né?

Depois disso, vimos que a lista é gerada novamente quando utilizamos o `Count`, mas por que diabos isso acontece?

Você sempre precisa lembrar que o `IEnumerable` não contém os dados de verdade, ele precisa computá-los, então para contar quantos elementos existem na lista ele irá percorrê-la até o fim.

No caso da lista, nós já sabíamos quantos elementos ela continha, por conta disso, `Count` é uma **propriedade** dentro da lista e um **método** no `IEnumerable`. A diferença em termos de execução aqui, também é gritante. 

No caso da lista temos a complexidade _O(1)_ afinal, basta checarmos uma propriedade que já contém este valor armazenado, enquanto que no `IEnumerable` temos a complexidade _O(N)_.

Imagine que o `Count` do `IEnumerable` seja um método similar à este:

```csharp
int Count<T>(IEnumerable<T> source)
{
    int count = 0;
    using (IEnumerator<T> enumerator = source.GetEnumerator())
    {
        while (enumerator.MoveNext())
        {
            count++;
        }
    }

    return count;
}
```
Talvez agora pareça um pouco mais doloroso aquele seu `Count() > 0` que eu sei que você já fez. O que nos leva ao próximo método utilizado no exemplo: `Any()`.

**Sempre** que você precisar verificar: `Count() > 0` em um `IEnumerable`, por favor, substitua-o por um `Any()`, não é de sacanagem que existem dois métodos.

Se você notar na saída do console, o método `Any()` exibiu apenas a mensagem do primeiro elemento sendo adicionado, por quê?

Simples, se houver qualquer elemento na coleção ele já deve retornar `true` então não faz sentido percorrer a coleção inteira, o que nos deixa sempre com a complexidade _O(1)_.

O método `Any` é um método similar ao método abaixo:

```csharp
bool Any<T>(IEnumerable<T> source)
{
    using (IEnumerator<T> enumerator = source.GetEnumerator())
    {
        return enumerator.MoveNext();
    }
}
```
Por fim, ao realizarmos o `ToArray()` notamos que o `IEnumerable` é computado mais uma vez, ou seja, tome muito cuidado com suas transformações de coleções, você pode estar gerando computação extra por nada.

Mas afinal, qual a melhor solução?

Neste caso, o correto seria transformarmos o `IEnumerable` em uma lista ou em um array no momento certo, ou seja, temos que garantir que os dois loops são executados em conjunto e que as operações seguintes (`Count` e `Any`) possam ser executadas em _O(1)_.

Como fazer?

Teremos que realizar alguns ajustes, isso porque o loop `foreach` irá forçar a avaliação do `IEnumerable` se ele ficar neste escopo, precisamos mudá-lo para fazer com que ele continue o comportamento _lazy_ do `IEnumerable`.

Aqui temos dois caminhos distintos:
1. Utilizar o Select ao invés de um `foreach`;
2. Transformar essa iteração em um método separado.

Primeiro vamos fazer a implementação utilizando o método `Select`, para isso, faremos a chamada da criação do `IEnumerable` normalmente, depois vamos executar um `Select` seguido de um `ToList`. 

A partir daí salvaremos o valor em uma lista para podermos executar as próximas operações sem percorrer todos os elementos, conforme código:

```csharp
static void Main(string[] args)
{

    IEnumerable<int> ienumerable = GenerateIEnumerable();
    Console.WriteLine("");
    Console.WriteLine("IEnumerable has been created");
    List<int> list = ienumerable
        .Select(value =>
        {
            Console.WriteLine($"The value {value} has been found.");
            return value;
        })
        .ToList();

    Console.WriteLine("");
    Console.WriteLine($"Count: {list.Count}");

    Console.WriteLine("");
    Console.WriteLine($"Any: {list.Any()}");

    Console.ReadKey();
}
```
> **Atenção**
>
> Vale lembrar que isso é apenas para efeito de exemplo, o método `Select` não deve causar **nenhum** tipo de efeito colateral, como uma saída no console.

Dessa forma, nossa implementação consegue utilizar o melhor dos dois mundos, usando cada tipo no seu melhor caso.

A segunda opção de implementação é transformar o loop em um método, retornando uma nova coleção através do `yield return`, conforme código:

```csharp
static IEnumerable<T> FindElements<T>(IEnumerable<T> source)
{
    foreach (T value in source)
    {
        Console.WriteLine($"The value {value} has been found.");
        yield return value;
    }
}
```

Agora precisamos chamar esta nova função antes de transformar o `IEnumerable` em uma lista:

```csharp
static void Main(string[] args)
{

    IEnumerable<int> ienumerable = GenerateIEnumerable();
    Console.WriteLine("");
    Console.WriteLine("IEnumerable has been created");

    ienumerable = FindElements(ienumerable);
    List<int> list = ienumerable.ToList();

    Console.WriteLine("");
    Console.WriteLine($"Count: {list.Count}");

    Console.WriteLine("");
    Console.WriteLine($"Any: {list.Any()}");

    Console.ReadKey();
}
```

Com isso, temos o resultado esperado:

{% include image.html link="https://imgur.com/GAGeil4.png" alt="Mixed operations" width=75 %}

> **Atenção**
>
> Usei a estrutura `List` para exemplificar, mas sempre que a você não precisar alterar o tamanho da coleção, prefira utilizar um array.

A lição principal deste post é: utilize as coisas com sabedoria, nem sempre o seu `ToList()` está errado e as vezes manter tudo como `IEnumerable` custa bem caro.

O ideal é entender até onde vale manter a estrutura como um `IEnumerable` e realizar a computação para uma estrutura em memória quando precisar.

Gostou desse tipo de post?

Me conte nos comentários!

E Até mais!