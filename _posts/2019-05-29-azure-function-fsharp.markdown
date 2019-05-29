---
layout: post
title:  "Existe Azure Functions em F#?"
date:   2019-05-29 00:00:00 +0000
image: https://i.imgur.com/MfHj1HZ.png
comments: true
tags: [F#, C#] 
---

Olá pessoa!

Você já ouviu falar do Azure Functions? Que tal utilizar ele com F#? Vale a pena?

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/posts-blog/tree/master/AzureFunctions" %} 

Vamos começar falando um pouquinho sobre o que é o **Azure Functions**.

De maneira BASTANTE resumida podemos descreve o Azure Function como um serviço computacional para executar trechos de código por demanda. Na prática, você pode tornar um método ou função disponível sem precisar criar e hospedar uma aplicação web. É só um método isolado.

Isso faz parte do conjunto de coisas que chamamos de _serverless_, afinal, não precisamos de um servidor de aplicação. Mas por favor, não se engane em achar que o que veremos aqui é uma aplicação totalmente _serverless_, existem vários outros fatores que este post não cobre.

Além disso, existem diferentes tipos de gatilhos para fazer a chamada dessa função:

{% include image.html link="https://imgur.com/O6ELQje.png" alt="Gatilhos para o Azure Function" width=80 %}

Você pode utilizar uma requisição HTTP; timers para disparar a função de tempos em tempos; interações com banco de dados, filas e até armazenamento de arquivos.

Para o nosso exemplo, utilizaremos um gatilho HTTP. Dessa forma, teremos um end-point para acessarmos nossa função, semelhante a uma chamada REST normal, mas claro, sem um servidor de aplicação.

Como este post não é diretamente ligado ao Azure Function, encerramos nossa introdução por aqui.

### Criando uma Azure Function com C# 

Vamos criar um projeto para publicar uma Azure Function!

Ao selecionar a opção para criar um novo projeto você pode filtrar pela palavra Azure, isso já diminui bastante a lista e o projeto do tipo Azure Function, tende a ser a primeira opção:

{% include image.html link="https://imgur.com/Fgdw3dN.png" alt="Criando um Azure Function" width=80 %}

Depois disso, podemos escolher o tipo de gatilho que será utilizado para chamar nossa função, escolha HTTP:

{% include image.html link="https://imgur.com/IlwgO1D.png" alt="Criando um Azure Function - Parte 2" width=80 %}

O resultado disso gera um código meio maluco, mas nada tão complicado, vamos checar:

```csharp
public static class Function1
{
    [FunctionName("Function1")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");

        string name = req.Query["name"];

        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        name = name ?? data?.name;

        return name != null
            ? (ActionResult)new OkObjectResult($"Hello, {name}")
            : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
    }
}
```
Parece bastante coisa, mas vamos entender as coisas por partes.

A classe estática gerada automaticamente existe apenas para comportar a função, como não podem haver funções fora de classe, precisamos dessa estrutura, apenas por isso que ela existe.

A função possui um atributo modificador (anotação) do tipo `FunctionName`, como o próprio nome sugere, isso indicará o nome da função para ser chamada.

O primeiro parâmetro também possui notação, isso indica que a requisição vem de um gatilho HTTP do Azure Function. Até aqui tranquilo né?

O segundo parâmetro é simplesmente um objeto para realizar logs, poderemos vê-los durante a execução da function.

Sobre o corpo da função em si, é bastante simples. Primeiro tentamos obter o parâmetro `name` da query string para requisições GET, depois tentamos extrair a propriedade `name` do corpo da requisição para requisições POST.

No final de tudo, caso a função tenha encontrado um nome ela retorna um status de OK e devolve uma mensagem, caso contrário indica um Bad Request com uma mensagem de erro.

Simples né?

Mas vamos deixar nossa função disponível apenas para GET, para simplificar um pouco as coisas:

```csharp
[FunctionName("Function1")]
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];
    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

Vamos executar esse projeto e ver o que acontece?

Se tudo estiver configurado no seu Visual Studio, o emulador do Azure Function será aberto com a URL para você realizar a chamada:

{% include image.html link="https://imgur.com/6dYFetn.png" alt="Criando um Azure Function - Parte 3" width=80 %}

Agora já podemos testar nossa Azure Function no navegador!

{% include image.html link="https://imgur.com/9g6Zzkc.png" alt="Criando um Azure Function - Parte 4" width=80 %}

Nós também conseguimos ver a atividade do `log.LogInformation` no console:

{% include image.html link="https://imgur.com/meH3WyR.png" alt="Criando um Azure Function - Parte 5" width=80 %}

Parabéns, finalizamos nossa primeira Azure Function em C#, mas e se formos fazer em F#?

### Criando uma Azure Function com F# 

Eu sempre comento que as coisas em F# tendem a ser mais simples para criar do que C#, isso definitivamente não é verdade para uma Azure Function.

Vamos criar um novo projeto para ver como isso funciona.

Na hora de criar o projeto vamos novamente digitar Azure e filtrar pela linguagem F#:

{% include image.html link="https://imgur.com/xDKsjZg.png" alt="Criando um Azure Function FSharp - Parte 1" width=80 %}

Peraí, nada?

Exato... Nada.

Mas isso significa que não tem como fazer? -De maneira nenhuma. Só que vamos ter que fazer um "rolê" bem maior. Depois de algumas tentativas vou mostrar a forma mais simples que encontrei:

Vamos criar um projeto de Azure Function (Sim, em C# mesmo). Depois disso, vamos até o Explorer e vamos alterar o tipo do projeto de .csproj para .fsproj.

Eu sei, dói em mim também ter que fazer isso.

Lembre-se de incluir os arquivos que já existiam no projeto: host.json, local.settings.json e o .gitignore.

O arquivo Function1.cs pode ser excluído tranquilamente. Agora sim, vamos criar nosso código.

Para usar a mesma nomenclatura, vamos chamá-lo de Function1.fs. Podemos utilizar as mesmas anotações e parâmetros que usamos em C# para criar uma função idêntica:

```fsharp
module Function1 =

    [<FunctionName("Function1FSharp")>]
    let Run ([<HttpTrigger(AuthorizationLevel.Function, "get", Route = null)>] request: HttpRequest ) 
            (log: ILogger) =

        log.LogInformation "F# HTTP trigger function processed a request."
        let name = if request.Query.ContainsKey "name"
                   then request.Query.["name"].ToString() |> Some
                   else None

        match name with
        | Some name -> OkObjectResult (sprintf "Hello, %s" name) :> IActionResult
        | None -> BadRequestObjectResult "Please pass a name on the query string or in the request body" :> IActionResult
```

O código é basicamente o mesmo, mas usamos um `Option` ao invés de utilizarmos `null` para o parâmetro `name`.

Vamos executar?

{% include image.html link="https://imgur.com/wIvDPmC.png" alt="Criando um Azure Function FSharp - Parte 2" width=80 %}


### Vale a pena usar F# em um Azure Function?

De maneira geral, eu tendo a dizer que **depende**. Isso porque você acaba passando um pouco mais de trabalho para deixar o projeto preparado, tendo que cobrir alguns problemas que simplesmente não existem em C#.

Por outro lado, uma vez que o projeto está criado, ele simplesmente funciona normal, inclusive todo processo de publicação no Azure é identico.

Eu tendo a dizer que: se você não for utilizar nenhuma feature específica do F#, vai de C#!

Como assim uma _feature_ específica? - [Type Providers]({{ site.baseurl }}{% link posts-serie/entenda o mundo com fsharp.html %}), por exemplo.

Em um dos exemplos da série de Type Providers, utilizamos o HtmlProvider para estruturar dados de uma página HTML, que tal fazer isso na Azure Function?

Tudo isso funciona da mesma forma, vamos primeiro instalar o pacote:

```
PM> Install-Package FSharp.Data
```

Depois disso, vamos utilizar o provider e criar nosso próprio tipo, conforme código:

```fsharp
module Function1 =
    //...

    [<Literal>]
    let url = "https://en.wikipedia.org/wiki/List_of_Marvel_Cinematic_Universe_films"
    type MarvelCinematicPage = HtmlProvider<url>
    
    type Film = { 
        Name:string; 
        Critical: string
    }
```

Agora já podemos utilizar este provider em nossa Azure Function, vamos mostrar a lista dos filmes com a nota da crítica no Rotten:

```fsharp
[<FunctionName("FunctionTypeProviderFSharp")>]
let Run ([<HttpTrigger(AuthorizationLevel.Function, "get", Route = null)>] request: HttpRequest ) 
        (log: ILogger) =
    let page = MarvelCinematicPage.Load url

    page.Tables.``Critical response``.Rows
    |> Seq.filter( fun data -> data.Film <> "Average")
    |> Seq.map (fun data -> {Name = data.Film; Critical = data.``Rotten Tomatoes``})
    |> OkObjectResult
```
Agora vamos checar os resultados gerados:

{% include image.html link="https://imgur.com/kXacgqz.png" alt="Criando um Azure Function FSharp - Parte 3" width=80 %}

Bom, o post de hoje era isso!

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

E até mais.