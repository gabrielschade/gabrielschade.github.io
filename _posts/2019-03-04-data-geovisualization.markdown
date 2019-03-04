---
layout: post
title:  "Visualização de Dados com F#"
date:   2019-03-04 00:00:00 +0000
comments: true
tags: [F#]
serie: Entenda o Mundo com F#
---

Olá pessoa!

Já faz um tempo desde o último post sobre F# com Type Providers, hoje vamos fazer mais um! Dessa vez focando um pouco mais na visualização dos dados.

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/TypeProviderSample/blob/master/DataGeoVisualizationSample/DataGeoVisualizationSample/Program.fs" %} 

Este post faz parte de uma série sobre Type Providers! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/entenda o mundo com fsharp.html %})

No post de hoje usaremos os providers para o [world bank](http://www.worldbank.org/en/about) e para requisições HTTP com o retorno em JSON.

Para seguir, é recomendável que você leia os posts sobre os dois type providers citados:

1. [World Bank Data]({{ site.baseurl }}{% link _posts/2018-07-02-world-bank-data.markdown %})
2. [JSON]({{ site.baseurl }}{% link _posts/2017-12-28-web-data-json.markdown %})

Como em toda utilização de providers, precisaremos do pacote `FSharp.Data`, vamos instalá-lo a partir do nuget:

```
PM> Install-Package FSharp.Data
```

No post de hoje, vamos mostrar a visualização dos resultados de forma mais rica que apenas uma saída em console, então vamos aproveitar um pouco do `Google Charts`. Para isso, basta instalarmos seu pacote:

```
PM> Install-Package XPlot.GoogleCharts
```

Com tudo instalado, já podemos pensar em nossa implementação.

### Coletando dados globais

A ideia para este post é buscarmos informações dos países ao redor do mundo, vamos trabalhar com dois tipos de informação: Emissão de CO2 e Temperatura.

Vamos usar esses dois indicadores, buscando-os de fontes diferentes. E nos dois casos vamos gerar um HTML com o mapa mundi do gráfico.

Vamos começar com a emissão de CO2, para isso, vamos utilizar os indicadores do World Bank, como fizemos no post citado anteriormente.

Vamos começar com as importações necessárias:

```fsharp
open FSharp.Data
open XPlot.GoogleCharts

open System
```
Com isso, já podemos utilizar os providers tranquilamente.

```fsharp
[<EntryPoint>]
let main argv =
    let bancoDadosGlobal = WorldBankData.GetDataContext()
```

Agora vamos extrair a emissão de CO2 dos países através do indicador `"CO2 emissions (metric tons per capita)"`. Para exibir o gráfico vamos utilizar o ano de 2014 como referência, mas é sempre melhor deixarmos esta configuração parametrizável.

Vamos retornar os dados em uma tupla contendo o nome do país e o indicador, conforme código:

```fsharp
let emissaoCO2Global 
    (bancoDadosGlobal: WorldBankData.ServiceTypes.WorldBankDataService) 
        ano = 
        bancoDadosGlobal.Countries
        |> Seq.map( fun pais -> 
            pais.Name, 
            pais.Indicators.``CO2 emissions (metric tons per capita)``.[ano]
        )
```

Ótimo, agora já conseguimos consumir nossa função:

```fsharp
[<EntryPoint>]
let main argv =
    let bancoDadosGlobal = WorldBankData.GetDataContext()
   
    emissaoCO2Global bancoDadosGlobal 2014
    |> Seq.iter (fun pais -> Console.WriteLine(pais))
    
    Console.ReadKey() |> ignore
```

Com isso já temos o resultado:

{% include image.html link="https://imgur.com/8VXTF7d.png" alt="Emissão de CO2 em Console" width=80 %}

Agora é a hora de transformarmos isso em um gráfico bonitão!

### Construindo a Visualização dos Dados

A função para obter o gráfico é bastante simples, mesmo esperando diversos parâmetros. A ideia aqui é exibirmos um mapa mundi colorindo os países de acordo com a quantidade de emissão, por exemplo, caso o país emita pouco, pintaremos ele de verde, caso emita muito, de vermelho.

Para isso, precisamos de um array definindo os valores de emissão para cada cor, e outro array para informarmos o hexadecimal de cada cor. Além disso, também precisaremos informar a descrição do tooltip do mapa e os valores propriamente ditos.

Isso nos dá uma assinatura relativamente grande:

```fsharp
let obterGrafico cores valoresEixo descricao (valores: seq<string * float>) =
    ...
```
Vamos quebrar isso em apenas dois parâmetros diferentes: configurações do gráfico e valores.

Para isso, vamos criar um novo tipo:

```fsharp
type ConfiguracoesGrafico = {
    CoresEixo : string array
    ValoresEixo : int array
    Descricao : string
}
```

E vamos alterar a assinatura do método:

```fsharp
let obterGrafico configuracoes (valores: seq<string * float>) =
    ...
```

Agora precisamos criar o gráfico propriamente dito, para isso, precisamos criar o eixo de cores (ColorAxis) com os valores da configuração. Por fim usaremos as funções disponíveis em `Chart`, para gerarmos o gráfico e retornar o HTML, conforme código:

```fsharp
let obterGrafico configuracoes (valores: seq<string * float>) =
    let eixo = ColorAxis(values = configuracoes.ValoresEixo, colors = configuracoes.CoresEixo)
    let chart =
        valores
        |> Chart.Geo
        |> Chart.WithOptions(Options(colorAxis=eixo))
        |> Chart.WithLabel configuracoes.Descricao
    chart.GetHtml()
```

Vamos voltar para a função `main` e criar a configuração do nosso gráfico. Vamos dividir os valores da seguinte maneira:

1. Emissão baixa(valores de 0 até 5) na cor verde (#98f442);
2. Emissão média (valores de 5 até 10) na cor amarela (#f1f441);
3. Emissão alta (valores de 10 até 20) na cor laranja (#efaf39);
3. Emissão muito alta (valores acima 20) na cor vermelha (#ef5a39);

```fsharp
let configuracoesCO2 = {
    CoresEixo   = [| "#98f442";"#f1f441";"#efaf39";"#ef5a39" |]
    ValoresEixo = [| 0;+5;+10;+20 |]
    Descricao   = "Emissão CO2"
}
```

Agora já conseguimos obter a string contendo o HTML do gráfico:

```fsharp
emissaoCO2Global bancoDadosGlobal 2014
    |> obterGrafico configuracoesCO2  
```
Precisamos utilizar esta string para escrever um arquivo HTML, faremos isso utilizando a classe `System.IO.File` do .NET.

```fsharp
open System.IO

let escreverArquivoHtml html =
    File.AppendAllLines ("map.html",[html])
```

Agora podemos concluir a função `main`, gerando o arquivo HTML:

```fsharp
let main argv =
    let bancoDadosGlobal = WorldBankData.GetDataContext()

    let configuracoesCO2 = {
        CoresEixo = [| "#98f442";"#f1f441";"#efaf39";"#ef5a39" |]
        ValoresEixo = [| 0;+5;+10;+20 |]
        Descricao = "Emissão CO2"
    }

    emissaoCO2Global bancoDadosGlobal 2014
    |> obterGrafico configuracoesCO2  
    |> escreverArquivoHtml

    0
```

Acessando o diretório da aplicação ("\bin\debug\netcoreapp2.1") você encontrará o arquivo HTML gerado, ao abrir você encontrará o gráfico:

{% include image.html link="https://imgur.com/pG7fzBX.png" alt="Emissão de CO2 em Gráfico" width=80 %}

Legal né? E o gráfico é interativo, permitindo visualizar os dados de cada país individualmente.

Mas vamos facilitar um pouco nosso trabalho, que tal fazermos uma chamada ao sistema operacional para que ele abra o navegador com o gráfico gerado?

É bem simples fazer isso, basta iniciarmos o processo do navegador informando o diretório do arquivo. Para iniciar um processo precisamos utilizar o namespace `System.Diagnostics`, então, vamos dar um open nele antes de partir para o código.

```fsharp
open System.Diagnostics
```
Agora basta utilizarmos a função `Process.Start`, informando os parâmetros. No meu caso usarei o navegador Google Chrome:

```fsharp
//...
emissaoCO2Global bancoDadosGlobal 2014
    |> obterGrafico configuracoesCO2  
    |> escreverArquivoHtml

Process.Start (@"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", 
                    "file:\\" + Directory.GetCurrentDirectory() + "\\map.html")
    |> ignore
```

Pronto! Se executarmos novamente o código, o navegador será aberto automaticamente!

### Obtendo Dados de um Serviço

Agora vamos mostrar o mesmo tipo de gráfico, só que desta vez unindo informações do World Bank com um outro serviço (também aberto). Vamos usar o [openweather](https://openweathermap.org/api), é possível utilizá-lo de forma gratuita, mas é necessário o registro.

Faça o registro no site e gere um _App Key_, você precisará dela para fazer as requisições.

Com a _App Key_ em mãos podemos começar a implementação.

Primeiro usaremos o `JsonProvider` para gerar o tipo de forma dinâmica:

```fsharp
[<Literal>]
let urlBase = 
    "http://api.openweathermap.org/data/2.5/forecast?appid={SUA APP KEY}&units=metric&q="

type Clima = 
    JsonProvider<"http://api.openweathermap.org/data/2.5/forecast?appid={SUA APP KEY}&units=metric&q=London,UK">
    
```

Com o tipo definido já podemos criar a função que irá buscar a temperatura atual através desta API. Essa função terá de receber um local por parâmetro, com o formato indicado no `JsonProvider`: `"London,UK"`.

Por enquanto vamos assumir que já receberemos o dado formato, portanto teremos apenas um parâmetro chamado `local`, conforme código:

```fsharp
let obterTemperatura local =
    //...
```
A função é bastante simples, precisamos utilizar a função `Load` do tipo `Clima`, conforme já vimos no post sobre `JsonProvider`. O retorno de nossa chamada contém a previsão dos próximos cinco dias, mas vamos usar apenas a previsão do dia seguinte.

Então basta obtermos a temperatura (`Main.Temp`) do primeiro valor da lista (`head`), conforme código:

```fsharp
let obterTemperatura local =
    let clima = Clima.Load(urlBase + local)
    let amanha = Seq.head clima.List
    (float) amanha.Main.Temp
```

Note que estamos fazendo um cast do tipo `decimal` para o tipo `float`, isso é feito apenas para compatibilidade com nossa função geradora do gráfico criada anteriormente.

Aqui temos um pequeno problema, existem casos onde a descrição retornada do World Bank não é compatível com a descrição esperada nesta API. Apesar disso acontecer poucas vezes, precisamos realizar um tratamento, caso contrário nosso código irá quebrar.

Mesmo sendo bastante contra o uso de exceções, vamos utilizá-las por aqui. Caso o `Load` do type provider falhe, iremos simplesmente retornar zero. Faremos isso capturando a exceção `WebException`, conforme código.

```fsharp
let obterTemperatura local =
    try
        let clima = Clima.Load(urlBase + local)
        let amanha = Seq.head clima.List
        (float) amanha.Main.Temp
    with :? System.Net.WebException as ex ->
        0.0
```
Não se preocupe em causar distorções no mapa, afinal, esses valores acabam sendo ignorados no mapa e não são pintados de nenhuma cor.

Agora que já temos a função que obtém a temperatura de um local específico precisamos criar a função que realiza múltiplas chamadas dela. Dessa forma, teremos a temperatura de vários locais.

Vamos utilizar a capital de cada país como referência, conforme código:

```fsharp
let temperaturaGlobal 
    (bancoDadosGlobal: WorldBankData.ServiceTypes.WorldBankDataService) =
        bancoDadosGlobal.Countries
        |> Seq.map( fun pais ->
                    pais.Name,
                    obterTemperatura (pais.CapitalCity + "," + pais.Name)
        )
```

Simples né?

### Refatorando o Uso dos Indicadores

Se você é atento, deve ter notado que a função `temperaturaGlobal` e a função `emissaoCO2Global` são praticamente idênticas. A única coisa que está diferente é o indicador retornado, veja:

```fsharp
let emissaoCO2Global 
    (bancoDadosGlobal: WorldBankData.ServiceTypes.WorldBankDataService) 
        ano = 
        bancoDadosGlobal.Countries
        |> Seq.map( fun pais -> 
            pais.Name, 
            pais.Indicators.``CO2 emissions (metric tons per capita)``.[ano]
        )

let temperaturaGlobal 
    (bancoDadosGlobal: WorldBankData.ServiceTypes.WorldBankDataService) =
        bancoDadosGlobal.Countries
        |> Seq.map( fun pais ->
                    pais.Name,
                    obterTemperatura (pais.CapitalCity + "," + pais.Name)
        )
```

Vamos refatorá-las e transformar a função que obtém o indicador em um parâmetro:

```fsharp
let obterIndicadorGlobal 
    (bancoDadosGlobal: WorldBankData.ServiceTypes.WorldBankDataService) 
    indicador =
        bancoDadosGlobal.Countries
        |> Seq.map( fun pais ->
                    pais.Name,
                    indicador pais
        )
```

Agora com a função `obterIndicadorGlobal` podemos informar a função no parâmetro `indicador`, veja:

```fsharp
let emissaoCO2Global 
    (bancoDadosGlobal: WorldBankData.ServiceTypes.WorldBankDataService) 
     ano = 
        obterIndicadorGlobal bancoDadosGlobal
         (fun pais -> pais.Indicators.``CO2 emissions (metric tons per capita)``.[ano])

let temperaturaGlobal 
    (bancoDadosGlobal: WorldBankData.ServiceTypes.WorldBankDataService) =
        obterIndicadorGlobal bancoDadosGlobal
         (fun pais -> obterTemperatura (pais.CapitalCity + "," + pais.Name))
```

### Finalizando

Por fim, teremos que criar as configurações do gráfico de temperatura e adicionarmos ele ao HTML gerado. Para as configurações utilizaremos as seguintes cores e valores:

1. Temperaturas muito baixas (valores até -20) na cor azul clara (#d8fffc);
2. Temperaturas baixas (valores de -20 até 0) na cor azul (#7badfc);
3. Temperaturas um pouco baixas (valores de 0 até 15) na cor verde (#98F442);
4. Temperaturas agradáveis (valores de 15 até 30) na cor amarela (#f1f441);
5. Temperaturas altas (valores de 30 até 40) na cor vermelho (#ef5a39);
6. Temperaturas muito altas (valores até 60) na cor vermelho forte (#ff3916);

```fsharp
let configuracoesTemperatura ={
    CoresEixo = [| "#d8fffc";"#7badfc"; "#98f442";"#f1f441";"#ef5a39";"#ff3916" |]
    ValoresEixo = [| -20; 0;+15;+30;+40;+60 |]
    Descricao = "Temperatura"
}
```

Agora é só fazermos o mesmo procedimento para gerar o gráfico e adicionar ao HTML:

```fsharp
temperaturaGlobal bancoDadosGlobal
    |> obterGrafico configuracoesTemperatura        
    |> escreverArquivoHtml
```

Executando novamente, teremos o HTML com os dois gráficos!

{% include image.html link="https://imgur.com/XNL6Hwu.png" alt="Gráfico da Temperatura Global" width=80 %}

>**Atenção**
>
>Você pode fazer o download da página HTML com os gráficos [aqui](https://raw.githubusercontent.com/gabrielschade/TypeProviderSample/master/DataGeoVisualizationSample/DataGeoVisualizationSample/Plot/map.html)

Os demais gráficos disponíveis fica para um post no futuro, quem sabe até com alguma implementação de machine learning!

Qualquer dúvida ou sugestão, deixem nos comentários!

E até mais.