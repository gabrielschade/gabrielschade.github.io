---
layout: post
title:  "E os Testes Unitários em Programação Funcional?"
date:   2019-05-05 00:00:00 +0000
image: https://i.imgur.com/aMTU9M0.png
comments: true
tags: [F#] 
---

Olá pessoa!

Um dos posts mais antigos aqui do blog tratava do assunto de testes unitários em F#, surgiram algumas dúvidas nos comentários e vou tentar responder agora.

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/posts-blog/tree/master/Teste-unitario-fsharp/TesteUnitarioFsharp/CalculoGit" %} 

A primeira grande pergunta é: dá para testar? -**Sim**, dá.

Inclusive eu ouso dizer que o processo para testar seu código funcional é bastante simples. Vamos fazer um exemplo usando F#.

A funcionalidade que vamos implementar e testar será essa:

**O software deve ser capaz de contabilizar: Forks, Estrelas e Issues Abertas dos repositórios de um usuário do Github, agrupando os valores pela linguagem de programação dominante do repositório.**

Simples né?

Vamos começar criando uma conexão com a API do GitHub, faremos isso utilizando o type provider para JSON já discutido [neste antigo post]({{ site.baseurl }}{% link _posts/2017-12-28-web-data-json.markdown %}).

O primeiro passo é instalar o pacote `FSharp.Data`, através do nuget:

```
PM> Install-Package FSharp.Data
```

Com o pacote já instalado podemos criar a conexão com a API, faremos isso utilizando o repositório do .NET como exemplo:

```fsharp
module Dominio
open FSharp.Data

[<Literal>]
let urlRepositorios = "https://api.github.com/users/dotnet/repos"
type Repositorios = JsonProvider<urlRepositorios>
```

Agora vamos criar o nosso próprio tipo para armazenar as propriedades que são interessantes para nossa aplicação:

```fsharp
type GitRepositorio = {
    Forks: int
    Linguagem: string option
    IssuesAbertas: int
    Estrelas: int
}
```

Com isso criamos algo semelhante ao que a Clean Architecture pede, isolamos o tipo que utilizamos em nosso domínio do tipo externo da API.

Agora vamos criar a função que se conecta na API do GitHub e converte os dados para o tipo GitRepositorio. Basta utilizarmos o `Load` para carregar os dados e um `map` para transformar-los nos valores de domínio da nossa aplicação:

```fsharp
let carregarRepositorios() =
    Repositorios.Load urlRepositorios
    |> Array.map( fun repositorio -> 
        {
            Forks = repositorio.ForksCount
            Linguagem = repositorio.Language
            IssuesAbertas = repositorio.OpenIssuesCount
            Estrelas = repositorio.StargazersCount
        })
```

Agora podemos fazer as funções para calcular cada uma das propriedades, começando pelo número de Forks.

Nossa função deve carregar os repositórios, depois realizar o agrupamento por linguagem e por fim, realizar a soma dos Forks, conforme código:

```fsharp
let calcularForksPorLinguagem() = 
    carregarRepositorios()
    |> Array.groupBy( fun repositorio -> repositorio.Linguagem)
    |> Array.map( fun (linguagem, repositorio) -> 
        linguagem, (repositorio |> Array.sumBy(fun repo -> repo.Forks))
    )
```

Esse código resolve o problema? **Sim**.

Isso significa que esse é um bom código? **Não**.

Apesar de resolver o problema proposto, esse código está longe de ser o ideal.

Vamos criar nosso projeto de testes e veremos os problemas aparecerem naturalmente. Para isso, basta criarmos outro projeto Console em F# usando .NET Core normalmente.

Após criar o projeto instale o pacote `FsUnit`, com o comando abaixo:

```
PM> Install-Package FsUnit
```

Isso é o suficiente para transformar seu projeto em um projeto de testes. No entanto, talvez você ainda não seja capaz de executar seus testes.

Precisamos instalar mais dois pacotes: `NUnit3TestAdapter` e `Microsoft.NET.Test.SDK`.

```
PM> Install-Package NUnit3TestAdapter
PM> Install-Package Microsoft.NET.Test.SDK
```
Por fim, precisamos da extensão do Visual Studio para rodar os testes utilizando o NUnit:

{% include image.html link="https://imgur.com/CjwjUZe.png" alt="NUnit Extensão" width=80 %}

Depois dessa volta toda, podemos editar nosso arquivo .fs e começar a criar os testes:

```fsharp
module ``Meus testes do Git``

open NUnit.Framework
open FsUnit

[<Test>]
let ``Primeiro Teste``() =
    3 
    |> should equal 3
```

Claro que este teste irá gerar um resultado positivo, mas é interessante rodarmos para termos certeza de que o ambiente está OK. 

Note que estou utilizando um recurso do F# para dar nomes com espaços e acentos, isso faz nossos testes ficarem mais claros na janela de resultados:

{% include image.html link="https://imgur.com/ZVqJY8C.png" alt="Resultados dos testes" width=80 %}

Agora que nosso ambiente já está OK, vamos efetivamente testar nossa funcionalidade:

```fsharp
[<Test>]
let ``Teste para cálculo de Forks por linguagem``() =
    let resultado = calcularForksPorLinguagem()

    resultado
    |> Array.map ...
```

Aqui já notamos nosso primeiro problema, nossa função busca os repositórios internamente, ou seja, ela está utilizando os recursos externos de forma fixa.

Precisamos melhorar isso fazendo com que ela seja uma função pura. Isso implica que a funçãos deve receber tudo que precisa por parâmetro:

```fsharp
let calcularForksPorLinguagem repositorio =
    repositorio
    |> Array.groupBy( fun repositorio -> repositorio.Linguagem)
    |> Array.map( fun (linguagem, repositorio) -> 
        linguagem, 
        (repositorio |> Array.sumBy(fun repo -> repo.Forks))
    ) 
```

Mas é só isso? - Quase.

Essa simples refatoração gera um problema para a aplicação, agora todas as vezes que precisarmos chamar essa função, teríamos que informar o repositório do Git como parâmetro.

Podemos resolver isso de maneira bastante simples: **composição**.

```fsharp
let calcularForksPorLinguagemEmRepositoriosGit =
    carregarRepositorios
    >> calcularForksPorLinguagem
```
Essa composição cria algo semelhante à uma injeção de dependência local, temos uma função que realiza o trabalho efetivamente (e portanto, o que deve ser testado) e outra função com o repositório já "injetado" nela. 

Legal né?

Agora vamos voltar para nosso teste e ver como fica. 

O primeiro passo é termos o gerador de repositórios falsos, vamos lá:

```fsharp
let criarRepositorioFalso() =
    [| 
        {Linguagem = Some "F#"; Forks = 3; Estrelas = 2; IssuesAbertas = 1;}
        {Linguagem = Some "F#"; Forks = 2; Estrelas = 6; IssuesAbertas = 4;}
        {Linguagem = Some "C#"; Forks = 1; Estrelas = 10; IssuesAbertas = 2;}
    |]
```
Podemos usar o mesmo recurso de composição, mas dessa vez para prepararmos a função para o teste:

```fsharp
[<Test>]
let ``Teste para cálculo de Forks por linguagem``() =
    let calcularComRepositorioMock = 
        criarRepositorioFalso 
        >> calcularForksPorLinguagem 

    let resultado = calcularComRepositorioMock()
    
    resultado.[0]
    |> should equal (Some "F#", 5)
```

Lembre-se que a ideia deste post não é mostrar como fazer o teste de maneira correta, mas sim, mostrar como criar funções que podem ser testadas, algo semelhante a um Mock.

Agora que já conseguimos testar significa que nossa função para está bem feita? - Não tão rápido...

Nossa função ainda pode ser bastante melhorada. Seu principal problema agora é que ela possui um **comportamento** fixo.

Antes, nós tínhamos um dado fixo (os repositórios do Git), agora temos o comportamento de somar Forks de maneira fixa, que tal parametrizarmos isso também?

Vamos subir mais um nível de abstração na função `calcularForksPorLinguagem`, agora vamos alterar seu nome para `calcularPorLinguagem` recebendo a propriedade que será calculada por parâmetro:

```fsharp
let calcularPorLinguagem propriedadeParaCalculo repositorio =
    repositorio
    |> Array.groupBy( fun repositorio -> repositorio.Linguagem)
    |> Array.map( fun (linguagem, repositorio) -> 
        linguagem, 
        (repositorio |> Array.sumBy(propriedadeParaCalculo))
    ) 
```
Fundamentalmente, a única mudança foi substituir a função passada para o `Array.sumBy` por um parâmetro genérico. 

Esse parâmetro deve ser uma função que recebe um repositório e retorna um valor inteiro. Com isso podemos gerar as três funções que completam nossas features, veja:

```fsharp
let calcularForksPorLinguagem repositorio =
    repositorio
    |> calcularPorLinguagem (fun repo -> repo.Forks)

let calcularEstrelasPorLinguagem repositorio =
    repositorio
    |> calcularPorLinguagem (fun repo -> repo.Estrelas)

let calcularIssuesAbertasPorLinguagem repositorio =
    repositorio
    |> calcularPorLinguagem (fun repo -> repo.IssuesAbertas)
```
Essas funções encapsulam a lógica da aplicação, portanto, podemos utilizá-las para testes informando qualquer repositório falso. 

Além disso, com elas, podemos criar as funções para utilizar no código da aplicação, onde já injetamos os repositórios do Git:

```fsharp
let calcularForksPorLinguagemEmRepositoriosGit =
    carregarRepositorios
    >> calcularForksPorLinguagem

let calcularEstrelasPorLinguagemEmRepositoriosGit =
    carregarRepositorios
    >> calcularEstrelasPorLinguagem

let calcularIssuesAbertasPorLinguagemEmRepositoriosGit =
    carregarRepositorios
    >> calcularIssuesAbertasPorLinguagem
```

Veja como testamos:

```fsharp
[<Test>]
let ``Teste para cálculo de Issues por linguagem``() =
    let calcularComRepositorioMock = 
        criarRepositorioFalso 
        >> calcularIssuesAbertasPorLinguagem 

    let resultado = calcularComRepositorioMock()
    
    resultado.[1]
    |> should equal (Some "C#", 2)
```

Através de um setup de testes podemos criar as funções com os mocks uma única vez, e deixar os testes menos verbosos, mas isso fica para um outro post.

E o mais legal, é que podemos utilizar nossas funções com os repositórios online injetados em nossa aplicação real.

Vamos voltar para o nosso arquivo `Program.fs`.

Agora vamos fazer uma função que imprima os valores do repositório de maneira legível.

Ela deverá receber o nome da propriedade que estamos imprimindo (Forks, Issues ou Estrelas) e os dados dos repositórios.

Faremos um `map` para formatar os dados e depois um `iter` para exibirmos no Console, conforme código:

```fsharp
let imprimir propriedade dados =
    dados
    |> Array.map (fun (linguagem, contador) -> 
        sprintf "Linguagem: %s | %s: %i" 
            (   match linguagem with 
                | Some linguagem' -> linguagem' 
                | None -> "Indisponível"
            ) 
            propriedade 
            contador
    )
    |> Array.iter (Console.WriteLine)
```

Agora basta usar nossas funções que já estavam prontas!

```fsharp
[<EntryPoint>]
let main argv =
    calcularForksPorLinguagemEmRepositoriosGit()
    |> imprimir "Forks"

    calcularIssuesAbertasPorLinguagemEmRepositoriosGit()
    |> imprimir "Issues"

    calcularEstrelasPorLinguagemEmRepositoriosGit()
    |> imprimir "Estrelas"

    Console.ReadKey() |> ignore
    0 
```

O resultado disso para os repositórios do usuário dotnet estão listados abaixo:

{% include image.html link="https://imgur.com/1ktvYIA.png" alt="Dados dos repositórios .NET" width=80 %}

> **Atenção**
>
> Você pode visualizar o código desta aplicação [neste link](https://github.com/gabrielschade/posts-blog/tree/master/Teste-unitario-fsharp/TesteUnitarioFsharp/CalculoGit) e do projeto de testes [neste link](https://github.com/gabrielschade/posts-blog/blob/master/Teste-unitario-fsharp/TesteUnitarioFsharp/CalculoGit.Testes/Test.fs).

Bom galera, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.