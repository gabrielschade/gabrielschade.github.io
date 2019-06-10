---
layout: post
title:  "ML .NET: IA para ajudar o Detetive Pikachu com Descobertas sobre Pokémon"
date:   2019-06-10 00:00:00 +0000
image: https://imgur.com/2JAqPKU.png
imageHeader: true
comments: true
tags: [IA, F#] 
serie: IA com ML.NET
--- 
 
Olá pessoa!

Que tal ajudarmos o detetive Pikachu em uma investigação usando IA para descobertas sobre Pokémon?

<!--more--> 

{% include github-link.html link="https://github.com/gabrielschade/IA/tree/master/PokeClustering" %} 

Este post faz parte de uma série sobre o ML.NET! Para visualizar a série inteira clique [aqui]({{ site.baseurl }}{% link posts-serie/ia com ml.net.html %})

Nessa publicação vamos usar inteligência artificial para ajudar o detetive Pikachu a investigar uma base sobre pokémon de diferentes regiões.

A base de dados que usaremos com as características dos pokémon foi encontrada no Github do usuário [armgilles](https://gist.github.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6). Essa base contém os atributos base: HP, Attack, Sp. Attack, Defense, Sp. Defense e Speed. Além disso, contém outras informações como: nome, número, tipos, região e identificação de lendários.

Essa base contém as mega evoluções e todos os pokémon até a região de Kalos (dos jogos Pokémon X & Y), você pode verificar o formato dos dados na imagem abaixo:

{% include image.html link="https://imgur.com/hTzL0hS.png" alt="Pokemon.csv" width=80 %}

Agora vamos criar nosso projeto F# para importar esses dados usando Type Providers!

Crie um projeto do tipo Console em F# normalmente e como quase sempre fazemos por aqui, instale o pacote FSharp.Data:

```
PM> Install-Package FSharp.Data
```
Se você nunca utilizou o CsvProvider sugiro que dê uma olhadinha nesse [post aqui]({{ site.baseurl }}{% link _posts/2018-01-10-type-provider-excel.markdown %})) e depois volte pra cá!

Assim como fizemos no post anterior de ML.NET, vamos fazer o download do arquivo CSV e incorporá-lo no projeto, conforme imagem a seguir:

{% include image.html link="https://imgur.com/ZT8gGo1.png" alt="Pokemon.csv no projeto" width=80 %}

Lembre-se também de alterar a propriedade _Copy to Output Directory_ para _Copy if newer_.

Feito isso, vamos carregar nosso CSV:

```fsharp
[<Literal>]
let url = "Dataset/pokemon.csv"
type PokemonCSV = CsvProvider<url>

[<EntryPoint>]
let main argv =
    let allPokemon = PokemonCSV.Load url
```

Simples assim!

Agora vamos criar o nosso próprio tipo para Pokémon, obtendo apenas as propriedades que forem necessárias para nossa exploração.

Para isso, vamos criar um novo arquivo chamado Types e incluir o nosso tipo lá:

```fsharp
module Types

type Pokemon = {
    Number : single
    Name : string
    Type1: string
    Type2 : string
    Total: single
    HP : single
    Attack : single
    Defense : single
    SpAttack : single
    SpDefense : single
    Speed : single
}   
```
Note que estamos alterando o tipo de todas as propriedades básicas para single, isso porque nos cálculos que vamos usar poderemos precisar de casas decimais.

Agora vamos voltar para a função `main` e transformar os dados carregados do CSV para valores do nosso domínio. Para isso, basta utilizarmos um `map`, conforme código:

```fsharp
let listOfPokemon = allPokemon.Rows
                    |> Seq.map (fun pokemon -> {
                        Number = (single) pokemon.Number
                        Name = pokemon.Name 
                        Type1 = pokemon.``Type 1``
                        Type2 = pokemon.``Type 2``
                        HP = (single) pokemon.HP
                        Attack = (single) pokemon.Attack
                        SpAttack = (single) pokemon.``Sp. Atk``
                        Defense = (single) pokemon.Defense
                        SpDefense = (single) pokemon.``Sp. Def``
                        Speed = (single) pokemon.Speed
                        Total = (single) pokemon.Total
                    })
```

Agora como estamos utilizando o ML.NET, precisamos criar nosso contexto de machine learning, sem ele não conseguimos nem carregar os nossos dados para treinamento:

```fsharp
let mlContext = new MLContext();
let data = listOfPokemon
            |> mlContext.Data.LoadFromEnumerable
```

Neste ponto já preparamos nossos dados, agora é hora de entender o que vamos fazer e o que estamos tentando descobrir nessa base!

#### Clusterização

Diferente da classificação de comentários feito anteriormente, não temos nenhuma classificação previamente feita em nossa base de dados. Isso implica que não temos a resposta para treinar o modelo.

O que fazer então?

Vamos utilizar o que chamamos de aprendizado não supervisionado. Isso significa que executaremos um algoritmo que precisará encontrar a relação entre os dados por si só. Para fazer isso precisamos informar quantos grupos (clusters) queremos classificar a base e quais são os parâmetros para localizar a similaridade entre os grupos.

De forma bastante simplista, o algoritmo irá separar os dados na quantidade de clusters que informarmos. Para fazer isso será gerado um centróide com uma média de todas as características determinadas. 

Depois disso, a distância de cada registro para cada centróide é calculada. No fim desse cálculo, o registro fará parte do cluster que possui o centróide mais próximo.

Para fazer essa clusterização, usaremos o algoritmo **K-Means**.

#### K-Means no ML.NET

Como já dito, precisamos escolher as informações para calcular os centróides dos clusters. Para nosso problema, vamos usar os tipos e atributos base.

Só temos um pequeno problema, os tipos são do tipo `string` e o restante dos valores são `single`. Precisamos transformar os tipos em um valor `single` também, dessa forma todas as informações (features) utilizadas serão do mesmo tipo.

Vamos começar criando uma nova propriedade no tipo Pokemon:

```fsharp
type Pokemon = {
    //...
    Type1: string
    Type2 : string
    ConvertedType1:single
    ConvertedType2:single
    //...
}
```
Agora vamos criar um método para converter o tipo de `string` para `single`. Basta fazermos um pattern matching para isso:

```fsharp
let typeToSingle pkmnType = 
    match pkmnType with
    |"Bug" -> 0
    |"Dark"-> 1
    |"Dragon"-> 2
    |"Electric"-> 3
    |"Fairy"-> 4
    |"Fighting"-> 5
    |"Fire"-> 6
    |"Flying"-> 7
    |"Ghost"-> 8
    |"Grass"-> 9
    |"Ground"-> 10
    |"Ice"-> 11
    |"Normal"-> 12
    |"Poison"-> 13
    |"Psychic"-> 14
    |"Rock"-> 15
    |"Stell"-> 16
    |"Water"-> 17
    | _ -> -1

    |> (single)
```
Pronto! Agora já podemos preencher esse valor no momento que carregamos o CSV:

```fsharp
//...
let listOfPokemon = allPokemon.Rows
                    |> Seq.map (fun pokemon -> {
                        //...
                        Type1 = pokemon.``Type 1``
                        ConvertedType1 = (typeToSingle pokemon.``Type 1``)
                        Type2 = pokemon.``Type 2``
                        ConvertedType2 = (typeToSingle pokemon.``Type 2``)
                        //...
                    })
```

Feito!

Agora já podemos voltar ao processo de treinamento do algoritmo e informar todos as propriedades que serão utilizadas para fazer a clusterização.

Faremos isso criando um `EstimatorChain` que deve criar uma coluna chamada "Features" com todas as propriedades, veja:

```fsharp
let pipeline = EstimatorChain().Append(
                           mlContext.Transforms.Concatenate( "Features", 
                               "ConvertedType1","ConvertedType2",
                               "HP","Attack","SpAttack", 
                               "Defense", "SpDefense", "Speed","Total" ))  
```

Essa é a hora de criarmos o algoritmo que treinará o modelo, para isso, precisamos indicar o número de clusters e o campo com as _features_ que acabamos de criar:

```fsharp
let options = Trainers.KMeansTrainer.Options()
options.NumberOfClusters <- 3
options.FeatureColumnName <- "Features"
    
let trainer = mlContext.Clustering.Trainers.KMeans options
```
Neste ponto, para criar o modelo basta unirmos a pipeline criada anteriormente com o nosso algoritmo de treino:

```fsharp
let pipelineTraining = pipeline.Append trainer
let model = pipelineTraining.Fit data
```

Agora já podemos utilizar nosso modelo? -**Quase**.

Precisamos criar um `PredictionEngine`. Ele pode ser gerado através de nosso modelo, no entanto, para criarmos um motor de predição precisamos informar o tipo usado como entrada e o tipo de saída.

Vamos voltar no nosso arquivo `Types.fs` e criar o tipo para a saída do algoritmo, ele deve conter o cluster e a distância para todos os centróides:

```fsharp
open Microsoft.ML.Data

//...

[<CLIMutable>]
type ClusterPrediction = {
    [<ColumnName("PredictedLabel")>] 
    PredictedClusterId : uint32

    [<ColumnName("Score")>] 
    Distances : single array
}
```
Veja que estamos utilizando as anotações do ML.NET para indicar os valores resultantes.

Voltando para a função `main`, já podemos criar nosso motor de predição:

```fsharp
let predictiveModel = 
    mlContext.Model.CreatePredictionEngine<Pokemon, ClusterPrediction>(model)
```

Agora que temos nosso motor de predição, vamos percorrer nossa base e verificar o resultado para cada registro:

```fsharp
let clusterizedList = 
    listOfPokemon
    |> Seq.map(fun pokemon -> pokemon,(predictiveModel.Predict pokemon))
```
Note que criamos uma _sequence_ agrupando o pokémon e seu resultado em uma tupla. Isso facilitará nosso trabalho tendo uma coleção unificando com os dois valores.

Vamos simplesmente exibir o resultado no console, mas vamos fazer isso em um formato de CSV:

```fsharp
printfn "Number; Name; Total; Type1; Type2; Cluster"

clusterizedList
|> Seq.iter(fun (pkmn, result) -> printfn "%i;%s;%i;%s;%s;%i" 
                                            ((int)pkmn.Number) 
                                            pkmn.Name 
                                            ((int)pkmn.Total)
                                            pkmn.Type1
                                            pkmn.Type2
                                            result.PredictedClusterId
```

Simples, não?

Ao executar já podemos conferir o resultado, veja:

{% include image.html link="https://imgur.com/HPe9knl.png" alt="Pokemon no Console" width=80 %}

Podemos exportar o resultado do console para um arquivo CSV, dessa forma fica mais fácil de visualizarmos os dados. Faremos isso da forma mais simples e sem precisar alterar nosso código, vamos utilizar o prompt de comandos do Windows.

Primeiro navegue até o diretório do projeto e execute o projeto redirecionando o console para o arquivo:

```
DIRETORIO DO PROJETO> dotnet run PokeClustering >pkmn.csv
``` 

Feito isso temos um arquivo CSV pronto para visualizarmos. Podemos abrir no Excel, realizar filtros e fazer qualquer tipo de operação:

{% include image.html link="https://imgur.com/xX6v0oA.png" alt="Pokemon no CSV" width=80 %}

Ao realizar filtros por cluster fica bastante claro o tipo a classificação, veja os primeiros registros do Cluster 1:

{% include image.html link="https://imgur.com/0f9eGAY.png" alt="Pokemon no CSV - Cluster 1" width=80 %}

Não precisamos de muito tempo para verificar que todos os pokémon do cluster 1 não são necessariamente poderosos. Talvez os mais poderosos que tenha aparecido nesses registros sejam mesmo o Pidgeotto e o grande Pikachu.

Note que eu digo talvez, mesmo com o status base deles sendo claramente maior. Isso porque nossos dados são uma versão resumida dos monstrinhos, não estamos levando em consideração a lista de movimentos nem o nível necessário para evolução, por exemplo.

A média do total dos atributos do cluster 1 ficou em: 303.90, sendo a menor média de todos os clusters. Vamos chamar este cluster de "Pokémon mais fracos".

Vamos primeiro para o terceiro cluster, afinal ele é o cluster intermediário.

{% include image.html link="https://imgur.com/dkYGP8j.png" alt="Pokemon no CSV - Cluster 2" width=80 %}

Note que podemos ver as evoluções dos pokémon iniciais e até uma mega evolução (Mega Beedrill). A média deste cluster ficou em: 472.97.

Por fim, temos o cluster dos pokémon mais poderosos! Esse cluster possui uma média de 622.57. Ele é formado praticamente por lendários, pseudo-lendários (como o Dragonite) e Mega evoluções:

{% include image.html link="https://imgur.com/ocUo8tZ.png" alt="Pokemon no CSV - Cluster 3" width=80 %}

Note que existem alguns _outliers_, como o Arcanine, por exemplo. Ele possui uma média relativamente menor do que resto, mas acaba estando mais próximo deste cluster do que do anterior.

Já conseguimos visualizar como o agrupamento funcionou nesta planilha, mas que tal gerarmos um gráfico completo?

#### Visualização dos dados

Não vamos conseguir gerar um gráfico usando todas as features utilizadas para a clusterização, isso porque o gráfico teria dimensões demais para ser visualizado. Mas podemos ter um resultado muito semelhante em um gráfico de 3 dimensões: onde X e Y representam o tipo do pokémon e Z representa o Total dos atributos.

Para fazer esse gráfico vamos instalar o pacote nuget: Xplot.Plotly.

```
PM> Install-Package Xplot.Plotly
```

Agora precisamos criar os dados para nosso gráfico, podemos fazer isso através de uma list comprehension, onde iremos iterar por todos os cluster, gerando a série de dados:

```fsharp
let chartData = [
    for cluster in 1..options.NumberOfClusters do
        let pkmn = clusterizedList 
                    |> Seq.filter( fun (pkmn, result) -> result.PredictedClusterId = (uint32) cluster)

        yield //...
]
```
Ok, estamos percorrendo os clusters e filtrando os pokémon de cada um, mas o que precisamos retornar no `yield`?

Precisamos de um valor do tipo `Scatter3d`, nele podemos definir quais valores serão usados em quais eixos, qual valor deve ser utilizado para o label e até o tamanho do ponto no gráfico.

```fsharp
let chartData = [
    for cluster in 1..options.NumberOfClusters do
        let pkmn = clusterizedList 
                    |> Seq.filter( fun (pkmn, result) -> result.PredictedClusterId = (uint32) cluster)

        yield Scatter3d(
                x = (pkmn |> Seq.map( fun (pkmn, result) -> pkmn.ConvertedType1)),
                y = (pkmn |> Seq.map( fun (pkmn, result) -> pkmn.ConvertedType2)),
                z = (pkmn |> Seq.map( fun (pkmn, result) -> pkmn.Total)),
                text = (pkmn |> Seq.map( fun (pkmn, result) -> pkmn.Name)),
                mode = "markers",
                marker =
                    Marker(
                        size = 12.,
                        opacity = 0.8
                    )
        )
]
```

Pronto, agora é só configurarmos algumas coisinhas e realizarmos a plotagem:

```fsharp
let chartOptions = Options ( title = "Pokémon Cluster")
    
let chart = 
    chartData
    |> Chart.Plot
    |> Chart.WithOptions chartOptions
    |> Chart.WithHeight 600
    |> Chart.WithWidth 800
    |> Chart.WithLabels ["Pokémon mais fracos"; "Pokémon muito poderosos";"Pokémon"]
```
Note que nos labels estou nomeando os clusters para facilitar a visualização. Agora com o mesmo snippet que sempre utilizamos podemos fazer o gráfico ser gerado e visualizado no Chrome:

```fsharp
let html = chart.GetHtml()
File.AppendAllLines ("metrics.html",[html])

Process.Start (@"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", 
               "file:\\" + Directory.GetCurrentDirectory() + "\\metrics.html")
               |> ignore
```
Você pode conferir o resultado do gráfico gerado (apenas para os pokémon da primeira geração) abaixo:

{% include embedded.html width=800 height=620 url="https://gabrielschade.github.io/posts-embedded/pkmnKantoKMeans" %}

Optei por colocar apenas os pokémon da primeira região para facilitar a visualização, caso esteja interessado, você pode visualizar o gráfico com todos eles [aqui](https://gabrielschade.github.io/posts-embedded/pkmnKMeans).

Com isso utilizamos K-means com ML.NET para realizar a clusterização e análise de uma base Pokémon!

> **Atenção**
>
> Você pode verificar o código fonte completo [aqui](https://github.com/gabrielschade/IA/tree/master/PokeClustering) e os arquivos resultantes (modelo e CSV) [aqui](https://github.com/gabrielschade/IA/tree/master/PokeClustering/Result).

Bom, o post de hoje termina por aqui aqui.

Espero que tenham gostado, qualquer dúvida, correção ou sugestão, deixem nos comentários!

Até mais.