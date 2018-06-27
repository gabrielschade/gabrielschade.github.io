---
layout: post
title:  "Extraindo dados do World Bank"
date:   2018-07-02 00:00:00 +0000
comments: true
tags: [F#]
serie: Entenda o Mundo com Type Providers
---

Olá pessoa!

Aqui no blog tem vários exemplos de como extrair dados através dos type providers do F#, pois bem, vamos fazer mais um!

Dessa vez vamos utilizar o World Bank Type Provider, talvez um dos mais poderosos. Através dele é possível nos conectarmos com o World Bank, um banco de dados que contém MUITA informações sobre os países.

É sério, tem muita informação mesmo. Que tal obter informações sobre o mundo através deste recurso?
<!--more-->

Este post faz parte de uma série sobre Type Providers! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/entenda o mundo com Type Providers.html %})

A página do World Bank contém diversas informações sobre o projeto, incluindo indicadores e gráficos sobre os países. Você pode acessá-la [aqui](http://www.worldbank.org/en/about).

{% include github-link.html link="https://github.com/gabrielschade/TypeProviderSample/blob/master/WorldBankTypeProviderSample/WorldBankTypeProviderSample/Program.fs" %} 

Como praticamente todos os providers, é super simples de utilizar! Vamos começar com a instalaçao do pacote em nossa aplicação F#, como nos outros exemplos.

Então vamos instalar o pacote `FSharp.Data`, através do nuget:

```
PM> Install-Package FSharp.Data
```

Vamos importar este namespace ao projeto, usando o comando `open`:

```fsharp
open System
open FSharp.Data

[<EntryPoint>]
let main argv = 
    printfn "%A" argv
    0 // return an integer exit code
```

Agora já estamos prontos para acessar os dados! A primeira coisa que precisamos fazer é obter o contexto dos dados, este contexto é a representação da base de dados do World Bank.

Faremos isso através do método `GetDataContext()`, conforme código:

```fsharp
let bancoDadosGlobal = WorldBankData.GetDataContext()
```

Agora já estamos conectados! 

Sem HTTP Client, sem driver para banco de dados, sem configurações, sem precisarmos de **NADA** disso.

Existem várias maneiras de extrair os dados deste contexto, então vou separar alguns países em um array e depois vamos criar alguns indicadores, vamos lá:

```fsharp
let paises = [|
        bancoDadosGlobal.Countries.Brazil
        bancoDadosGlobal.Countries.Canada
        bancoDadosGlobal.Countries.Ireland
        bancoDadosGlobal.Countries.``United Kingdom``
        bancoDadosGlobal.Countries.``United States``
        bancoDadosGlobal.Countries.China
        bancoDadosGlobal.Countries.Japan
    |]
```
Agora temos nosso array de países, fique à vontade para alterar os países que estamos extraindo os dados, na prática, você é livre para fazer sua própria exploração, este código é só um exemplo.

Depois disso, vamos exibir no console um cabeçalho com as informações que iremos extrair:

```fsharp
printfn "País | Capital | População | Homens | Mulheres | 0-14 anos | 15-64 anos | acima"
```

Por fim, podemos acessar os dados de cada um dos países através de uma iteração no array de países. Cada país possui algumas informações básicas e diversos indicadores.

> Você pode visualizar todos os indicadores através [deste link](https://data.worldbank.org/indicator?tab=all).

É importante ressaltar que muitos indicadores não estão disponíveis para todos os anos, portanto, dependendo do indicador e ano escolhido você pode não ter a informação e receber um valor NaN (*not a number*).

Para este exemplo, escolhi o ano de 2015 e os indicadores relacionados à população do páis, conforme código:

```fsharp
paises
|> Array.iter ( fun pais -> 
    printfn "%s | %s | %.0f | %.0f | %.0f | %.0f | %.0f | %.0f" 
        pais.Name 
        pais.CapitalCity
        pais.Indicators.``Population, total``.[2015]
        pais.Indicators.``Population, male``.[2015]
        pais.Indicators.``Population, female``.[2015]
        pais.Indicators.``Population ages 0-14, total``.[2015]
        pais.Indicators.``Population ages 15-64, total``.[2015]
        pais.Indicators.``Population ages 65 and above, total``.[2015]
)
```

Note que as propriedades são definidas de forma textual, portanto, cada indicador possui exatamente o mesmo nome do indicador disponível no site, como a [população total](https://data.worldbank.org/indicator/SP.POP.TOTL?view=chart), por exemplo.

Além disso, os indicadores são arrays, onde o índice utilizado corresponde ao ano que você está obtendo o valor.

O interessante deste provider é que podemos extrair informações sobre o crescimento econômico, educação, saúde e assim por diante. Isso é uma ferramenta muito poderosa!

Veja o resultado:

{% include image.html link="https://i.imgur.com/P3uBgRV.jpg" alt="Resultado da extração dos dados" width=90 %}

## Utilizando os dados para relatórios

Ok, temos os dados, mas o que faremos com eles?

Bom, essa pergunta com certeza tem mais de uma resposta, mas quero mostrar um jeito prático para compartilhar esses dados com alguém não técnico, de forma que agregue valor para e com poucas mudanças no código.

Na verdade, tudo que trocaremos é o divisor de colunas dos dados. Atualmente estamos utilizando um *pipe* `(|)` e vamos simplesmente alterar para ponto e vírgula.

```fsharp
printfn "País;Capital;População;Homens;Mulheres;0-14 anos;15-64 anos;acima"
paises
|> Array.iter ( fun pais -> 
    printfn "%s;%s;%.0f;%.0f;%.0f;%.0f;%.0f;%.0f" 
        pais.Name 
        pais.CapitalCity
        pais.Indicators.``Population, total``.[2015]
        pais.Indicators.``Population, male``.[2015]
        pais.Indicators.``Population, female``.[2015]
        pais.Indicators.``Population ages 0-14, total``.[2015]
        pais.Indicators.``Population ages 15-64, total``.[2015]
        pais.Indicators.``Population ages 65 and above, total``.[2015]
)
```

Pronto! Já estamos prontos para compartilhar isso com pessoas que precisam montar algum tipo de relatório!

Lembrando que estamos falando de uma prototipação rápida, não de um super sistema de relatórios e dashboards, certo?

Agora vem a parte legal, em nenhum momento estamos lidando com leitura e escrita de arquivos, certo?

Mas podemos fazer com que o sistema operacional gere um arquivo para nós! Vamos transformar a saída no console no arquivo preferido de pessoas não técnicas: uma planilha do Excel!

Para fazer isso é super simples, abra o Prompt de Comandos, sim, vamos usar Command Line por aqui. A primeira instrução é super simples, basta irmos até a pasta do projeto:

> `cd "diretório de sua aplicação"`

{% include image.html link="https://i.imgur.com/HZWTKaL.jpg" alt="Arquivos do projeto" width=90 %}

Estando no diretório do arquivo *.fsproj* você será capaz de executá-lo com o comando:

> `dotnet run WorldBankTypeProviderSample`

Com isso você consegue visualizar os resultados separados por ponto e vírgula no próprio console. Ok, mas cadê nosso arquivo?

Aqui que entra o sistema operacional, nós podemos fazer com que ele redirecione a saída do console para um arquivo utilizando a simples sintaxe "> nomeDoArquivo".

Então utilize novamente o comando, mas desta vez com a sintaxe para redirecionar em um arquivo CSV.

> `dotnet run WorldBankTypeProviderSample > paises.CSV`

{% include image.html link="https://i.imgur.com/DChH0F3.jpg" alt="Arquivos CSV gerado" width=90 %}

Se olharmos na pasta do projeto, veremos que o arquivo CSV foi gerado!

A partir daqui é tudo Excel, então esteja livre para brincar com os dados à vontade.

{% include image.html link="https://i.imgur.com/f4tojAe.png" alt="Gráfico com os dados" width=90 %}

É claro que podemos gerar os gráficos diretamente pelo F# e tudo isso, mas é como eu mencionei antes, o foco aqui foi uma prototipação rápida, portanto, sem enrolação e direto ao ponto!

Você pode encontrar o código desenvolvido aqui no meu [Github](https://github.com/gabrielschade/TypeProviderSample/blob/master/WorldBankTypeProviderSample/WorldBankTypeProviderSample/Program.fs).


> **Atenção**
>
> Se quiser se aprofundar mais sobre os type providers você pode encontrar a documentação completa da Microsoft [aqui](https://docs.microsoft.com/en-us/dotnet/fsharp/tutorials/type-providers/).


O que você achou deste post?

Me conte nos comentários!

E Até mais!