---
layout: post
title:  "Async em F#"
date:   2019-09-23 00:00:00 +0000
image: https://imgur.com/xjZ22qq.png
comments: true
featured: false
tags: [F#] 
--- 
 
Olá pessoa!

Que tal entendermos como funciona uma pipeline usando o Async em F#?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/posts-blog/blob/master/AsyncWorkflow/AsyncWorkflow/Program.fs" %} 
A ideia principal deste post é cobrir os fundamentos básicos para programação assíncrona em F#. 

Ué, mas F# não é .NET? -É só utilizarmos `Tasks`!

Ok, F# é sim .NET e você pode sim utilizar `Task`, mas temos alguns probleminhas nisso. O primeiro é que a classe `Task` foi feita para trabalhar com o `delegate Action`. No C# até temos uma conversão implícita entre uma função `void` e esse delegate, mas isso não é verdade para F#, então teríamos que converter na mão.

Outro ponto que é inclusive mais importante que esse primeiro é o fato de que geralmente operações mais longas em F# são realizadas através de pipelines, veja um exemplo:

```fsharp
let atualizarCliente =
    verificaSeClienteExiste
    >> verificaNomeOuSobrenomeEmBranco
    >> verificaFormatoEmail
    >> verificaFormatoCPF
    >> transformarInicialNomeEmMaiusculo
    >> atualizarClienteNoBanco
    >> transformarListaEmResposta
```

Não precisamos entender o código interno da função, basta entendermos que geralmente um funcionalidade é implementada através da composição de diferentes funções menores.

Simplesmente não conseguimos utilizar um `await` como no C#, porque todas as chamadas resultam em uma única expressão e não vários _statements_.

Uma outra diferença que vale a pena ser destacada aqui é que uma `Task` em .NET produz um valor depois de seu processamento e se encerra, enquanto um `Async` é apenas um bloco que explicitamente precisa ser avaliado. Isso significa que, se você quiser o fazer qualquer tipo de `cache` no resultado, é necessário fazer isso explicitamente.

Como último lembrete, como praticamente tudo no C# e F# são "conversáveis", temos transformações do tipo `Task` para o tipo `Async` dentro do módulo `Async` através das funções: `Async.StartAsTask` e `Async.AwaitTask`.

Existem mais complexidades no meio disso e até alguns comportamentos inesperados que podem acontecer quando utilizamos `Tasks` dentro do F# sem prestar as devidas atenções, mas isso fica para um outro post.

Para deixar o código com mais cara de F#, temos outro recurso para programação assíncrona chamado `Async`. Ele é trazido para o F# no formato de um _computation express_, eu falei disso brevemente aqui no blog [neste post]({{ site.baseurl }}{% link _posts/2018-11-27-computation-express-1.markdown %}){:target="_blank"}.


Vamos começar fazendo um exemplo bastante simples e depois disso, vamos paralelizar sua execução. A tarefa será simplesmente lermos o HTML de alguns sites diferentes, só isso.

Para podermos fazer isso, precisamos importar o namespace `System.Net` e `System.IO`:

```fsharp
open System.Net
open System.IO
```
Depois disso, vamos criar uma função que receba uma URL por parâmetro e fazer uma requisição para a página:

```fsharp
let fetchUrl url =
    let request = WebRequest.Create (Uri url)
    use response = request.GetResponse()
    use stream = response.GetResponseStream()
    use reader = new StreamReader( stream)
    let html = reader.ReadToEnd()
    printfn "finished reading %s" url
    html
```
Esse código é relativamente simples, mas vamos lembrar de algumas coisas aqui:

1. Estamos fazendo uma requisição HTTP normal para obter a página informada na URL;
2. Estamos usando o `ReadToEnd` para simplificar, mas no "mundo real", leia linha por linha sempre que possível, isso pode evitar problemas com consumo de memória.
3. Entender a diferença entre o `let` e o `use` é bastante importante. Sempre que você tiver um recurso que implemente a interface `IDisposable` você deve utilizar o `use` para que o método `Dispose` seja chamado quando o programa encerrar a execução do escopo.

Agora vamos ao método `main` para executar essa função passando diferentes endereços:

```fsharp
let main argv =
    let sites = [
        "https://www.github.com/"
        "https://www.google.com/"
        "https://www.amazon.com/"
        "https://gabrielschade.github.io/"
    ]
    
    sites
    |> List.map(fetchUrl)
    |> ignore
``` 
Assim como em C#, podemos utilizar um `Stopwatch` para medirmos o tempo de execução dessa tarefa:

```fsharp
let sites = [
    //...
]

let stopwatch = new Diagnostics.Stopwatch()
stopwatch.Start()

sites
|> List.map(fetchUrl)
|> ignore

printfn "Elapsed Time: %i" stopwatch.ElapsedMilliseconds
```

Vamos executar para ver o resultado:

{% include image.html link="https://i.imgur.com/pifx5ag.png" alt="Result" width=80 %}

Agora vamos tornar essa execução paralela com alguns ajustes. Para manter duas funções separadas, vamos copiar a função original e renomeá-la para `asyncFetchUrl`.

Depois disso, vamos envolvê-la no _computation express_ `async`. Pera, como assim?

Calma, eu explico. Todo _computation express_ precisa de um contexto, esse contexto é definido pelo nome do _computation_ e por chaves envolvendo o bloco, veja:

```fsharp
let asyncFetchUrl url = async{
    let request = WebRequest.Create (Uri url)
    use response = request.GetResponse()
    use stream = response.GetResponseStream()
    use reader = new StreamReader( stream)
    let html = reader.ReadToEnd()
    printfn "finished reading %s" url
    html
}
```
Até aqui nossa função praticamente não mudou, certo? -Mais ou menos.

Se formos checar o tipo dela, podemos verificar que ele passou de: `string -> string` para `string -> Async<unit>`. Peraí, por que `unit` se a última linha estamos retornando o `html`?

Na verdade, quando estamos dentro de um _computation_ precisamos explicitar a palavra reservada `return`, veja:

```fsharp
let asyncFetchUrl url = async{
    let request = WebRequest.Create (Uri url)
    use response = request.GetResponse()
    use stream = response.GetResponseStream()
    use reader = new StreamReader( stream)
    let html = reader.ReadToEnd()
    printfn "finished reading %s" url
    return html
}
```
Agora sim temos um método que retorna `Async<string>`. Vamos testar?        

{% include image.html link="https://i.imgur.com/xoPO7jw.png" alt="Result 2" width=80 %}

Foi super rápido! Mas também não fez nada...

O motivo disso é bastante claro, lembra que no início do post eu falei que o bloco `Async` precisa ser explicitamente avaliado? Então... Esse é o problema. Tudo que nossa função está fazendo é envolvendo um bloco de código para identificá-lo como assíncrono.

Na prática o que temos é uma lista de `Async<string>` que precisa ser executada. Existem diversas formas de fazer isso, uma delas é executando um a um em ordem, ou seja, realizando as tarefas de forma síncrona:

```fsharp
 sites
|> List.map(asyncFetchUrl)
|> List.map(fun asynchronous -> Async.RunSynchronously asynchronous)
|> ignore
```

É claro que isso é só para demonstrar que precisamos explicitamente executar um `Async`, porque não faz absolutamente NENHUM sentido executarmos todos eles um a um de forma síncrona.

O que podemos fazer utilizando o módulo `Async` é transformar nossa lista de `Asyncs` em um único `Async` com uma lista de tarefas, ou seja, podemos paralelizar nossas chamadas:

```fsharp
sites
|> List.map(asyncFetchUrl)
|> Async.Parallel
|> Async.RunSynchronously
|> ignore
```

{% include image.html link="https://i.imgur.com/GOjk3na.png" alt="Result 3" width=80 %}

Agora sim! Note que a ordem das respostas está diferente e o tempo está relativamente menor.

Maaaaas, ainda não estamos fazendo as coisas de maneira síncrona, na prática cada um das chamadas ainda estão bloqueando suas respectivas threads durante a operação de requisição. Estamos paralelizando várias funções síncronas.

É como se estivessemos usando em C# uma chamada à um método `async`, que internamente não realiza nenhuma outra chamada assíncrona, ou seja, um `async` sem um `await` (não por opção, mas por não poder utilizar).

Então vamos alterar nossa função `asyncFetchUrl` mais uma vez, incluindo UM caracter: `!` e alterando uma chamada:

```fsharp
let asyncFetchUrl url = async{
    let request = WebRequest.Create (Uri url)
    use! response = request.AsyncGetResponse() //use! && AsyncGetResponse
    use stream = response.GetResponseStream()
    use reader = new StreamReader( stream)
    let html = reader.ReadToEnd()
    printfn "finished reading %s" url
    return html
}
```
Vamos executar de novo:

{% include image.html link="https://i.imgur.com/DPFSnmN.png" alt="Result 4" width=80 %}

Agora sim! Mas o que aconteceu?

Bom, agora estamos de fato utilizando uma chamada assíncrona e liberando que o programa continue executando. Além disso, note que estamos utilizando o _Bang_ (!) após o `use`. Isso significa que estamos escolhando a função `Use` do _computation express_ ao invés da função do `use` padrão do F#.

Vamos entender melhor sobre a sintaxe do _Bang_ (no contexto Async, afinal sua funcionalidade pode mudar de acordo com o _computation express_):

#### Sintaxe Bang(!)

Essa sintaxe existe para qualquer _computation express_, mas vamos focar nas funcionalidades providas pelo **Async**.

Dentro de um escopo `Async` devemos utilizar o operador _Bang (!)_ sempre que interagirmos com algo assíncrono, em muitos casos o `!` funcionará como um `await` para essa sintaxe. Vamos ver o que podemos com esse operador:

##### **Do**

O `do` normalmente funciona como um _statement_ isolado, ele é quase que um caso especial de `let` onde não precisamos atribuir um resultado. Na prática utilizamos o `do` para executar uma função que não retorna nada, ou seja, que retorna um `unit`. 

```fsharp
let print text =
    printfn "%s" text

let functionDoExample() =
    do print "Hello World"
```

O que geralmente nos faz estranhar o `do` é por que ele pode ser completamente omitido e o código continua funcionando da mesma maneira:

```fsharp
let functionDoExample() =
    print "Hello World"
```

No entanto, apesar de podermos omití-lo em nosso código tradicional, precisamos saber da existência dele no caso de processamentos assíncronos, isso porque ele se torna útil quando precisarmos realizar um "`await`". Nesse caso, precisamos da sintaxe _bang_ (`do!`).

Vamos fazer a prova real disso, primeiro usaremos o `Async.Sleep` sem o `do!`:

```fsharp
let wait seconds = async{
    printfn "before working"
    Async.Sleep (seconds * 1000)
    printfn "after working"
}

[<EntryPoint>]
let main argv =
    printfn "started"
    Async.RunSynchronously (wait 20)
    printfn "finished"
```

Ao executar podemos notar que o resultado é imediato, mesmo que o código esteja dizendo para aguardarmos 20 segundos. Isso porque não estamos realizando um "`await`", ou seja, não estamos esperando a operação terminar.

Simplesmente inserindo o `do!` podemos notar que a função agora precisa esperar o `Sleep`.

```fsharp
let wait seconds = async{
    printfn "before working"
    do! Async.Sleep (seconds * 1000)
    printfn "after working"
}
```
Isso é especialmente útil quando precisamos orquestrar processamentos assíncronos ou paralelos.

##### **Let**

Como você já deve saber em F#, o `let` funciona como uma forma de atribuirmos ou vincularmos um valor de função ou um valor discreto para uma variável. No contexto `Async` podemos utilizar o `let!` sempre que precisarmos esperar uma operação assíncrona que retorna valor terminar, ele é basicamente o mesmo que o `do!` com operações que retornam valor.

Geralmente aqui usa-se exemplos fakes para simplificar, mas vamos lá, não vai ser complicado. Vamos fazer uma função assíncrona para utilizar a API do GitHub e obtermos o número de repositórios públicos de um perfil.

Primeiro vamos instalar o pacote `Fsharp.Data`:

```
Install-Package FSharp.Data
```

Agora basta criarmos os types providers, se você não sabe o que eu estou falando, acessa [este post](({{ site.baseurl }}{% link _posts/2017-12-28-web-data-json.markdown %}){:target="_blank"}) e depois volta aqui!

Agora vamos criar o tipo para o perfil do github:

```fsharp
[<Literal>]
let githubUrl = "https://api.github.com/users/gabrielschade"
type GitHubProfile = JsonProvider<githubUrl>
```

E vamos fazer nossa função assíncrona a partir usando a função `AsyncLoad` do nosso tipo:

```fsharp
let printNumberOfRepos userName = async {
    let baseUrl = "https://api.github.com/users/"
    let url = sprintf "%s%s" baseUrl userName
    let! data = GitHubProfile.AsyncLoad url
    printfn "%s Repos: %i" userName data.PublicRepos
}
```
Note que se não utilizarmos o `let!` na chamada assíncrona nós nem conseguimos acessar a propriedade `PublicRepos`, porque estaríamos lidando com um `Async<GitHubProfile>` ao invés de um `GitHubProfile`.

O interessante disso é que o _bang_ faz com que a operação seguinte dentro do bloco precise esperar a conclusão do `AsyncLoad`, mas isso não é necessariamente verdade para quem chamar essa função. Vamos fazer um teste:

```fsharp
[<EntryPoint>]
let main argv =
    printfn "started"
    Async.Start (printNumberOfRepos "gabrielschade")
    printfn "finished"
```

Qual o resultado esperado aqui?

Bom, como a função `Start` não determina que a thread precise aguardar o término do processamento, o resultado será esse:

{% include image.html link="https://i.imgur.com/rQcjLdT.png" alt="Result my repo" width=80 %}

É claro que podemos aguardar o processamento se quisermos, basta alterarmos a função `Start` para `RunSynchronously`. Além disso, também podemos fazer o mesmo que o exemplo anterior e carregarmos essas informações de diferentes usuários, veja:

```fsharp
[<EntryPoint>]
let main argv =
    let users = [
        "gabrielschade"
        "google"
        "microsoft"
        "dotnet"
    ]

    printfn "started"
    users
    |> List.map printNumberOfRepos
    |> Async.Parallel
    |> Async.RunSynchronously
    |> ignore

    printfn "finished"
```

{% include image.html link="https://imgur.com/RiAgWEG.png" alt="Result multiples repos" width=80 %}

Como já utilizamos o `use!` anteriormente e ele é praticamente o mesmo que o `let!`, com o adendo do `Dispose`, vamos omití-lo aqui, mas é sempre bom lembrarmos da existência dele!

```fsharp
use resource = disposableValue 
async {
    use resource = disposableValue 
    use! resource = asyncDisposableValue
}
```

##### **Match**

O `match` é a palavra reservada para realizarmos o tão famoso _pattern matching_, essa é uma inclusão relativamente nova na linguagem, mas agora temos um _syntax sugar_ para realizarmos um `await` dentro da expressão do _pattern matching_ utilizando `match!`

```fsharp
match functionOrValue with
| option1 -> //...
| _ -> //...

async{
    match functionOrValue with
    | option1 -> //...
    | _ -> //...

    match! asyncFunctionOrValue with
    | option1 -> //...
    | _ -> //...
}
```

É importante ressaltar que isso é apenas um atalho sintático para o código abaixo:

```fsharp
async{
    let! value = asyncFunctionOrValue
    match value with
    | option1 -> //...
    | _ -> //...
}
```

Vamos fazer uma função nova que ao invés de imprimir o número de repositórios ela simplesmente retorna-os. Por enquanto vamos simplesmente fazer uma outra versão da função para simplificar as coisas, mas a forma mais correta seria criarmos um pipeline de execução.

Mas para mantermos as coisas um pouquinho mais simples, vamos simplesmente gerar uma outra função, conforme código:

```fsharp
let getNumberOfRepos userName = async{
    let baseUrl = "https://api.github.com/users/"
    let url = sprintf "%s%s" baseUrl userName
    let! data = GitHubProfile.AsyncLoad url
    return data.PublicRepos
}
```
É basicamente a mesma função, com um `return` ao invés do `printfn`. Agora vamos utilizar o `match!`:

```fsharp
let evaluateRepos userName = async {
    let print value =
        printfn "%s: %s" userName value

    match! getNumberOfRepos userName with
    | value when value > 2000 -> print "Fantastic"
    | value when value > 1000 -> print "Huge"
    | value when value > 100 -> print "Great"
    | _ -> print "Meh"
}
```
Agora é só alterarmos a função lá na `main` e vermos o novo resultado:

{% include image.html link="https://imgur.com/eL54MuZ.png" alt="Result evaluate repos" width=80 %}

```fsharp
[<EntryPoint>]
let main argv =
    //...
    users
    |> List.map evaluateRepos //<-
    |> Async.Parallel
    |> Async.RunSynchronously
    |> ignore
    //...
```

##### **Return**

Por fim, temos o `return` que é um pouco diferente do resto. Mas nada super complicado. 
Diferente dos anteriores o `return` já faz parte do bloco `async`, peraí, como assim?

Como mostrei nos exemplos acima, podemos utilizar os comandos: `let, use, do e match` fora de um _computation express_ sem problemas, na verdade, utilizamos eles toda hora!

No caso do `return` ele só existe aqui dentro mesmo, e o que pode tornar isso confuso, é que além dele, também temos sua versão com o _bang_: `return!`. O que isso quer dizer?

Bom, o `return` é o que faz com que um valor seja "envelopado" em um objeto `Async`, por exemplo:

```fsharp
async{
    return 10
}
```

Se avaliarmos essa expressão, ela retornará `Async<int>`. Lembram do [meu post sobre os conceitos de programação funcional utilizando Stranger Things]({{ site.baseurl }}{% link _posts/2019-07-15-funcional-stranger-things.markdown %}){:target="_blank"}? 

Pois é, lá falamos sobre o conceito do `return`, que nesse caso é literalmente o uso da palavra `return`.
Já vimos isso em uma das funções criadas anteriormente: `getNumberOfRepos`, conforme código:

```fsharp
let getNumberOfRepos userName = async{
    let baseUrl = "https://api.github.com/users/"
    let url = sprintf "%s%s" baseUrl userName
    let! data = GitHubProfile.AsyncLoad url
    return data.PublicRepos
}
```
Originalmente o campo `PublicRepos` é do tipo `int`, mas ao analizarmos a função veremos que ela retorna um tipo `Async<int>`. Isso porque precisamos sinalizar para quem irá consumir a função que ela ainda não foi executada e que trata-se de uma operação assíncrona, mesmo não estando diretamente ligada com o retorno.

No nosso exemplo acima, a operação assíncrona é a busca das informações no perfil do GitHub, uma operação necessário para obtermos o número de repositórios, mesmo que ela não seja o retorno direto.

Agora vamos imaginar uma outra situação. Para fins de exemplo, vamos fazer com que a cada novo usuário que obtermos o número de repositórios precisaremos esperar um determinado tempo.

```fsharp
let waitAndDo seconds userName = async {
    return 1
}
```
Para fazer isso vamos reaproveitar a lista de usuários do GitHub e utilizarmos o índice dos elementos como tempo. Para obtermos o índice e o elemento vamos utilizar a função `List.mapi` ao invés de `List.map`, além disso, vamos imprimir todos os números retornados pela função `waitAndDo`, conforme código.

```fsharp
[<EntryPoint>]
let main argv =
    //...
    users
    |> List.mapi (fun index user -> waitAndDo index user)
    |> Async.Parallel
    |> Async.RunSynchronously
    |> Array.iter (printfn "%i")
    //...
```
Se executarmos da forma que está iremos imprimir o número 1 quatro vezes. Precisamos alterar a função para realizar sua tarefa real. O que faremos é simplesmente esperarmos o tempo em segundos e depois vamos imprimir o número de repositórios do usuário usando a função.

```fsharp
let waitAndDo seconds userName = async {
    do! Async.Sleep (seconds * 1000)
    return getNumberOfRepos userName
}
```
Ao fazermos isso o compilador já irá reclamar do nosso pipeline. A partir de agora a última parte `Array.iter` esperando um inteiro irá causar problemas. Você consegue descobrir o motivo?

Na prática o que está acontecendo é o seguinte: a função `getNumberOfRepos` já retorna um `Async<int>`, logo, quando utilizamos o `return` novamente estamos criando um objeto do tipo `Async<Async<int>>`.

Para não encapsularmos o resultado novamente em um `Async` utilizamos a versão _bang_ do `return`, ou seja, `return!`:

```fsharp
let waitAndDo seconds userName = async {
    do! Async.Sleep (seconds * 1000)
    return! getNumberOfRepos userName
}
```

E a partir de agora tudo funciona conforme o esperado!

E essa é a _bang_ sintax do `Async`!

{% include image.html link="https://imgur.com/vJ3uMPY.gif" alt="Bang" width=80 %}

Apesar de ter muito mais coisa para explorar, como cancelamentos, workflows aninhados e por aí vai. 
Mas por enquanto ficaremos por aqui.

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.