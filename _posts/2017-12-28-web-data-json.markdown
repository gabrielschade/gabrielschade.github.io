---
layout: post
title:  "Extraindo dados da web - JSON"
date:   2017-12-28 00:00:00 +0000
comments: true
tags: [F#]
---

Olá pessoa!

Na semana passada fiz um post sobre como extrair dados da web através dos type providers!

Vamos continuar com essa extração, mas desta vez, ao invés de obtermos as informações via HTML iremos obtê-las com JSON.

Provavelmente você já deve conhecer uma ou mais formas de obter os dados a partir de um retorno JSON, certo?

Mas a facilidade que o F# provê, permite criar isso com **três** linhas de código.

É sério, não tem enrolação, são só três linhas mesmo.
<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/TypeProviderSample/blob/master/JsonTypeProviderSample/JsonTypeProviderSample/Program.fs" %} 

É absurdamente fácil realizar esta tarefa através do `JsonTypeProvider`.

Assim como vimos com o [provider para html]({{ site.baseurl }}{% link _posts/2017-12-19-web-data.markdown %}), também é possível criar um tipo a partir de um JSON.

Primeiro vamos escolher quais dados serão obtidos para o teste. Como sugestão, proponho utilizar a API pública do GitHub, mas você pode utilizar qualquer outra URL que os passos para realizar a busca dos dados são os mesmos.

Assim como no outro exemplo, vamos criar uma aplicação console em F#!

Depois disso, crie uma **constante** com a url da API à sua escolha, conforme código:

```fsharp
[<Literal>]
let url = "https://api.github.com/users/gabrielschade"
```

Perceba que estou utilizando o serviço para obter os dados do meu usuário: */gabrielschade*, fique à vontade para substituir pelo seu ou por qualquer outro usuário.

Veja o resultado desta chamada no navegador:

![Resultado da API do GitHub](https://i.imgur.com/jbTTp0D.jpg)

As propriedades sublinhadas são as propriedades que iremos obter para o teste.

Ok, já vimos os dados, mas como obtê-los? Através do type provider, é claro! 

Então vamos instalar o pacote `FSharp.Data`, através do nuget:

```
PM> Install-Package FSharp.Data
```

Vamos importar este namespace ao projeto, com o comando `open`:

```fsharp
open FSharp.Data

[<Literal>]
let url = "https://api.github.com/users/gabrielschade"

[<EntryPoint>]
let main argv = 
    printfn "%A" argv
    0 // return an integer exit code
```

Agora falta pouco!

Precisamos definir o tipo do retorno.

> Então precisamos ver quais são as propriedades retornadas pelo JSON e criar uma por uma?

**Não**.

Deixe o JsonProvider fazer todo trabalho!

```fsharp
type PerfilGitHub = JsonProvider<url>
```
Com a definição do tipo `PerfilGitHub` já podemos acessar as informações com os tipos corretos!

Para carregar a página utilize a função `Load` presente no tipo `PerfilGitHub`, informando a url do perfil que deseja buscar:

``` fsharp
let perfil = PerfilGitHub.Load url
```

E é isso, está pronto!

Não é preciso criar um `HttpClient`, nem nada disso.

Simplesmente, definir a url, o tipo e realizar a carga. Simples assim.

Agora vamos listar as propriedades sublinhadas anteriormente, para mostrar que tudo funcionou conforme o planejado:

```fsharp
printfn "%s com %i seguidores" perfil.Name perfil.Followers
printfn "%s" perfil.Bio
printfn "Blog: %s" perfil.Blog
```

Perceba que a propriedade `Followers` que representa o número de seguidores, já vem tipada como um inteiro, por conta disso utilizamos o `%i` para exibí-lo.

Veja o resultado:

![Resultado da extração dos dados](https://i.imgur.com/5Uvz01B.jpg)

Você pode encontrar o código desenvolvido aqui no meu [Github](https://github.com/gabrielschade/TypeProviderSample/blob/master/JsonTypeProviderSample/JsonTypeProviderSample/Program.fs).


> **Atenção**
>
> Se quiser se aprofundar mais sobre os type providers você pode encontrar a documentação completa da Microsoft [aqui](https://docs.microsoft.com/en-us/dotnet/fsharp/tutorials/type-providers/).


O que você achou deste post?

Me conte nos comentários!

E Até mais!