---
layout: default-new
title:  "Update na Tango"
date:   2018-10-01 00:00:00 +0000
comments: true
tags: [C#]
---

Olá pessoa!

Lembram da Tango? A biblioteca para programação funcional em C# que publiquei ano passado?
Que tal um post sobre o update dela que rolou semana passada?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/tango" %} 

Caso você não faça ideia do que eu estou falando, você pode conferir [este post]({{ site.baseurl }}{% link _posts/2017-12-14-welcome-tango.markdown %}), onde eu publiquei pela primeira vez sobre ela.

Mas vamos para a atualização! A primeira pergunta importante é: houve quebra de compatibilidade?

- Definitivamente, **não**.

E o que mudou?

Todas as mudanças estão relacionadas com a struct `Continuation` de alguma forma. A ideia deste *update* foi dar uma repaginada nela e incluir alguns facilitadores.

#### Inclusão do método Finally

A primeira mudança relativamente simples foi a inclusão de um método chamado `Finally`. este método é utilizado geralmente no final da pipeline de processo para evitar duplicidade em algum código que precise ser executado independente do resultado do processo.

A ideia é semelhante ao `Finally` dos promises do JavaScript ou até mesmo do `finally` utilizado na instrução `try-catch`.

```csharp
Continuation<string, int> continuation = 5;

continuation.Then(value => value + 4)
            .Then(value => value + 10)
            .Catch(fail => $"{fail} catched")
            .Finally(() => /*Execute o Código Aqui*/);
```

Note que o `Finally` não dá acesso ao valor armazenado no `Continuation`, isso porque devemos executar esta operação em casos onde não dependemos no valor. No entanto há uma sobrecarga do método que recebe por parâmetro um `Either<TFail, TSuccess>`, onde poderemos acessar o valor, mas sem modificar na estrutura original:


```csharp
Continuation<string, int> continuation = 5;

continuation.Then(value => value + 4)
            .Then(value => value + 10)
            .Catch(fail => $"{fail} catched")
            .Finally(valores => /*Execute o Código Aqui*/); 

//valores = Either<string, int>
```

Essa inclusão também foi feita no modelo de operadores, neste caso o `Finally` ocupa o operador `==`, segue o mesmo código, agora utilizando operadores:

```csharp
Continuation<string, int> continuation = 5;
continuation
>  (value => value + 4)
>  (value => value + 10)
>= (fail => $"{fail} catched")
== (() => /*Execute o Código Aqui*/); 
== (valores => /*Execute o Código Aqui*/); 

//valores = Either<string, int>
```
Note que o operador também funciona com as duas sobrecargas.

> **Atenção**
> Apesar de várias linguagens funcionais utilizarem por padrão a sintaxe com operadores esta não é a forma tradicional do C#, então ela possui limitações.
> Com as funções Then e Catch você pode alterar o tipo do resultado da pipeline utilizando generics: `Then<int>` ou `Catch<string>`, por exemplo. Não é possível realizar esta operação com os operadores.

#### Inclusão do método Merge

Além do método `Finally` a estrutura `Continuation` também recebeu o método `Merge`.

Já era possível realizar a operação de unir dois pipelines diferentes, mas o processo acabava sendo manual demais e bem trabalhoso, a partir de agora, basta utilizar o método e você terá um novo `Continuation` com a união dos dois anteriores, veja:

```csharp
Continuation<string, int> continuation = 10;
Continuation<bool, double> continuation2 = 10.5;

int result =
    continuation.Merge(value => continuation2)
                .Then(values => values.Item1 + values.Item2)
                .Match(value => value, _ => 0);

//result = 20.5
```
O importante deste método é notar o que acontece depois dele. No `Then` que o sucede utilizamos a sintaxe `Item1` e `Item2`, parece familiar?

Isso mesmo, estamos utilizando tuplas! Com o `Merge`, tanto a falha quanto o sucesso se tornam tuplas com os tipos dos dois continuations diferentes. No exemplo que fizemos, tínhamos os seguintes tipos:
`<string, int>` e `<bool, double>`, então o novo `Continuation` gerado possui como falha: `(string, bool)` e como sucesso `(int, double)`.

Como sabemos o estado (sucesso ou falha) do `Continuation` resultante? -Simples, o resultado só será considerado como sucesso, caso **todos** os processo envolvidos tenham sido completados com sucesso. Então o resultado será uma falha caso qualquer um dos dois esteja no estado de falha.

Com isso chegamos em um outro ponto, nos casos onde o resultado é bem sucedido, temos certeza de que o Continuation resultante conterá todos os valores. Mas isso não é verdade para o caso de falha, afinal mesmo se só um deles falhar, o resultado já será uma falha.

Para impedir acesso à informações que não existem, todos os dados da tupla de falha retornada pelo `Merge` são valores opcionais. Então, o retorno do exemplo será `(Option<string>, Option<bool>)`.

Outro ponto importante deste método é que ele **não** possui uma versão com operadores.

#### ContinuationModule

A estrutra `Continuation` não possuía nenhum módulo, diferente dos tipos `Either`, `Option` e `Collection`. Por conta disso, este módulo foi criado provendo três métodos diferentes.

#### Resolve e Reject

Assim como as Promises do JavaScript, agora o módulo de `Continuation` provê uma forma rápida de criar pipelines nos dois estados: *Success* com `Resolve` e *Fail* com `Reject`.

Os dois métodos possuem duas sobrecargas diferentes, uma delas utilizando generics e a outra sem. Nos casos com generics você pode especificar o tipo do sucesso e da falha, caso contrário o tipo assumido será um `Unit`.

No caso do método `Resolve` o tipo `Unit` será atribuído para a falha e o tipo do parâmetro será definido como o tipo de sucesso, para o caso `Reject` isso acontece ao contrário, conforme código:

```csharp
var continuation1 = ContinuationModule.Resolve(10); //Continuation<Unit, int>
var continuation2 = ContinuationModule.Resolve<bool, int>(10); //Continuation<bool, int>

var continuation3 = ContinuationModule.Reject("error"); //Continuation<string, Unit>
var continuation4 = ContinuationModule.Reject<string,int>("error"); //Continuation<string, int>
```
Estes métodos também são acessíveis através do *extension method* `AsContinuation`, conforme código:

```csharp
var continuation1 = 10.AsContinuation<bool, int>(); 
//ContinuationModule.Resolve é chamado gerando um Continuation<bool, int>

var continuation2 = "fail".AsContinuation<string, bool>(); 
//ContinuationModule.Reject é chamado gerando um Continuation<string, bool>
```
No caso do método de extensão ele invocará internamente os métodos `Resolve` ou `Reject` de acordo com o tipo do valor que utilizou o método. 

#### All

Por fim, temos o método `All`, este método deve ser utilizado para unir diferentes pipelines de execução. Na verdade, o método `Merge` citado anteriormente utiliza este método internamente.

A diferença do `All` para o `Merge` é que neste caso, você pode unir até 4 estruturas do tipo `Continuation`.

```csharp
var continuation1 = ContinuationModule.Resolve(10);
var continuation2 = ContinuationModule.Resolve(true);
var continuation3 = ContinuationModule.Resolve("success");

(int, bool, string) result =
ContinuationModule.All(continuation1, continuation2, continuation3)
                    .Match(values => values, _ => (0, false, string.Empty));

//result = (10, true, "success")
```

Este método funciona da mesma maneira para dois, três ou quatro estruturas.

Por enquanto é isso pessoal, se você quiser utilizar este recurso basta realizar a atualização do seu pacote via Nuget ou baixar a versão no Github!

O que achou?

Alguma sugestão para posts futuros? 

Gostou deste tipo de post?

Me conte nos comentários!

E Até mais!