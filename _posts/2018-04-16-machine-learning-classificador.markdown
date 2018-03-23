---
layout: post
title:  "Criando um classificador de sentimentos com Machine Learning"
date:   2018-04-16 00:00:00 +0000
comments: true
tags: [Python]
---


Tive duas "reclamações" aqui no blog: "Ah, mas machine learning com ferramenta pronta é diferente" e "Só faz código super básico em Python".

Então ok, vamos resolver os dois problemas juntos! 

Agora vamos fazer codificar uma Machine Learning com algoritmo de classificação com Python!

<!--more-->

{% include github-link.html link="https://github.com/gabrielschade/IA/tree/master/ClassificacaoComentariosComNaiveBayes" %} 

Este post exige um conhecimento básico tanto em *machine learning* quanto em Python, se você não estiver familiarizado com estes temas sugiro que você acesse os links abaixo:

- [Machine Learning]({{ site.baseurl }}{% link _posts/2018-01-08-machine-learning-intro.markdown %})
- [Python]({{ site.baseurl }}{% link posts-serie/programe em python!.html %})

Agora já podemos começar!

Antes de qualquer implementação, precisamos entender bem nosso problema. Vamos criar uma solução que seja capaz de identificar se um comentário sobre alguma coisa passa uma mensagem positiva ou negativa.

Isso pode ser útil para identificar a satisfação de seus clientes sobre um respectivo produto, por exemplo. Agora para entendermos como criar esta solução vamos responder as três perguntas básicas propostas no post de introdução à machine learning:

1. Escolher a pergunta que estamos tentando responder;
2. Escolher o conjunto de dados para responder esta pergunta;
3. Identificar como medir o resultado.

A pergunta que iremos responder será: "O sentimento de uma pessoa em relação à um produto é positivou ou negativo?".

O conjunto de dados que vamos utilizar são três fontes públicas que contém comentários dos sites: [IMDb](http://www.imdb.com/), [Amazon](https://www.amazon.com/) e [Yelp](https://www.yelp.com/). Juntando todas as fontes de dados teremos três mil registros.

Para medirmos o resultado, vamos utilizar a mesma estratégia do Azure. Utilizaremos um percentual da base para treinamento e outro percentual para fazermos a avaliação dos resultados.

Para criar a solução vamos utilizar um ambiente Python no Visual Studio! Antes de qualquer coisa vamos configurar o ambiente, precisaremos de pacotes externos!

{% include image.html link="https://i.imgur.com/QUYjpzh.jpg" alt="Ambiente Python" width=80 %} 

> Atenção
>
> A Microsoft tem um post explicando sobre como instalar pacotes em seu ambiente Python no Visual Studio, caso tenha dúvidas acesse [este link](https://docs.microsoft.com/pt-br/visualstudio/python/tutorial-working-with-python-in-visual-studio-step-05-installing-packages).

Com o ambiente pronto podemos começar a programar!

### Pré-processamento dos dados

Vamos começar coletando os dados que usaremos para treinar o nosso algoritmo classificador. Felizmente há um *dataset* pronto para consumo que pode ser encontrando [aqui](https://archive.ics.uci.edu/ml/datasets/Sentiment+Labelled+Sentences).

Ótimo, depois de termos baixado as três fontes de dados já podemos importá-las em nossa solução. Vamos começar criando a função para obter as fontes.

```python
def obter_dados_das_fontes():
    diretorio_base = "DIRETORIO DOS ARQUIVOS BAIXADOS"
```

Conforme código acima, a variável `diretorio_base` deve receber o valor igual ao diretório onde os arquivos das fontes de dados foram salvos, por exemplo: `"C:\\Users\\Gabril\\Documents\\I.A\\"`.

Depois disso, só precisamos abrir cada um dos arquivos e adicioná-los à uma lista. 

```python
def obter_dados_das_fontes():
    diretorio_base = "DIRETORIO DOS ARQUIVOS BAIXADOS"

    with open(diretorio_base + "imdb_labelled.txt", "r") as arquivo_texto:
        dados = arquivo_texto.read().split('\n')

    with open(diretorio_base + "amazon_cells_labelled.txt", "r") as arquivo_texto:
        dados += arquivo_texto.read().split('\n')

    with open(diretorio_base + "yelp_labelled.txt", "r") as arquivo_texto:
        dados += arquivo_texto.read().split('\n')

    return dados
```

Com isso temos todos os 3003 registros importados em uma lista Python!

Agora precisamos tratar os dados, ou seja, remover as inconsistências. Por inconsistência você pode entender: os registros que não estão no formato correto, os registros que não estão classificados e os registros que não possuem o comentário.

Além disso, tratar os dados também significa colocá-los em um formato onde conseguimos tirar as informações com mais facilidade. Para isso, vamos entender o formato de cada registro.

Cada registro, ou seja, cada linha dos arquivos de texto contém o comentário, seguido pela sua classificação. Onde o resultado é colocado como '0' para comentários negativos e '1' para comentários negativos, veja este exemplo:

> Worst movie ever!     0

Há uma frase, seguida de uma classificação, estes dois itens são separados pelo deslocamento de um *tab*. Ok, todas as linhas devem seguir este mesmo formato, caso contrário, elas devem ser ignoradas.

Durante o tratamento, vamos fazer com que cada item da lista se torne uma lista contendo apenas 2 itens: comentário e resposta. Dessa forma separamos completamente os dados, tornando mais simples o processo de treinamento e validação.

Então, nosso codigo precisa: percorrer os registros validando o formato e caso tudo esteja de acordo, quebrar cada registro em uma lista de 2 itens (comentário, resposta), veja como o código fica:

```python
def tratamento_dos_dados(dados):
    dados_tratados = []
    for dado in dados:
        if len(dado.split("\t")) == 2 and dado.split("\t")[1] != "":
            dados_tratados.append(dado.split("\t"))

    return dados_tratados
```

Com isso limpamos 3 registros incosistentes da base e transformamos os dados para um formato mais adequado de trabalho. Agora vamos fazer a operação de `split`, para dividir os dados que serão utilizados para treinamento e os dados que serão utilizados para a validação do algoritmo classificador.

A função para separar o dado é super simples, basta percorrermos todos os dados e separarmos os registros em duas listas diferentes, uma para treino e outra para validação. 

Para este exemplo vamos utilizar 75% dos registros para treino e 25% para validação, conforme código:

```python
def dividir_dados_para_treino_e_validacao(dados):
    quantidade_total = len(dados)
    percentual_para_treino = 0.75
    treino = []
    validacao = []

    for indice in range(0, quantidade_total):
        if indice < quantidade_total * percentual_para_treino:
            treino.append(dados[indice])
        else:
            validacao.append(dados[indice])

    return treino, validacao
```

No final de tudo, retornamos os registros de treino e validação separados em uma tupla. Por fim, Vamos unir as funções criadas anteriormente em uma função de pré-processamento:

```python
def pre_processamento():
    dados = obter_dados_das_fontes()
    dados_tratados = tratamento_dos_dados(dados)

    return dividir_dados_para_treino_e_validacao(dados_tratados)
```

### Treinamento

Agora vamos partir para a próxima etapa, como utilizar algum algoritmo para compreender comentários? Vamos lá!

Para identificar como as pessoas se sentem à respeito de algo, precisamos utilizar uma técnica chamada de *Sentiment Analysis*.

{% include image.html link="https://i.imgur.com/MELW7WF.jpg" alt="Ambiente Python" width=80 %} 

O que nossa análise de sentimentos vai tentar fazer é: extrair o sentimento da pessoa através de um comentário escrito em linguagem do dia-a-dia (em inglês).

O desafio desta implementação é justamente esse. Como identificar o sentimento passado através de um texto?

Para fazermos isso utilizaremos a **representação de frequência de termos**. Ok, mas o que isso significa?

Na pratica, esta representação consiste em primeiro criar uma lista com todas as palavras que aparecem na base de dados. A partir disso, podemos representar qualquer texto como uma lista de frequência de cada uma destas palavras.

Vamos fazer um exemplo!

Imagine que todas as palavras das fontes de dados são: 

- (hello, this, is, a, list, for, test)

Até aqui, tudo bem, certo?

Agora considere o seguinte comentário: `"this is a test"`. Como representamos este comentário? Simples, basta substituir a lista com todas as palavras pela frequência que cada palavra aparece neste comentário:

- (0, 1, 1, 1, 0, 0, 1)

{% include image.html link="https://i.imgur.com/pnNKogG.jpg" alt="Representação de frequência de termos" width=80 %} 

Com isso conseguiremos transformar todos os comentários em uma lista de valores númericos representando a frequência da cada palavra, agora precisaremos de um pouco de matemática.

A partir destas frequências podemos calcular a pontuação para sentimentos positivos e para sentimentos negativos para cada uma das palavras e portanto, de todo o comentário.

Vamos fazer o teste com a palavra `"love"`!

A pontuação para sentimentos positivos da palavra `"love"` pode ser calculada a partir do cálculo: 

{% include image.html link="https://i.imgur.com/uRp40R1.jpg" alt="Pontuação positiva do termo love" width=80 %} 

Para calcular a pontuação positiva é muito mais simples, basta usar a fórmula: `1 - Pontuação positiva`.
Com isso podemos ter uma pontuação positiva e negativa para cada uma das palavras que aparecem em nossas fontes de dados, legal né?

Depois disso entra o algoritmo `Naive Bayes`, internamente ele utilizará esta informação para criar uma classificação para qualquer comentário recebido.

Imagine que ele receba o comentário: `"love that movie!"`, para computar a pontuação positiva ele irá multiplicar individualmente a pontuação de cada palavra (por isso `Naive`) e do total presente nas fontes de dados. 

Depois fará a mesma coisa para calcular a pontuação negativa, mas desta vez, sempre utilizando a fórmula `1 - Pontuação positiva`. Ao final teremos uma pontuação positiva e outra negativa, então basta realizar a comparação entre as duas para descobrirmos qual o resultado final do comentário!

Agora chega de conversa e vamos implementar!

Vamos criar uma função chamada `realizar_treinamento`, esta função será responsável por transformar os comentários em sua representação de frequência de cada termo e assim gerar um classificador.

Felizmente não precisaremos implementar tudo que foi explicado manualmente, para gerar a representação de frequência vamos utilizar o `CountVectorizer`, importado do pacote `sklearn.feature_extraction.text`. Também não iremos implementar do zero o algoritmo `Naive Bayes`, para isso importaremos o `BernoulliNB` do pacote `sklearn.naive_bayes`, conforme código:

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import BernoulliNB
```
Coloque o código das importações no topo de seu arquivo.

Agora vamos entender como implementar toda a parte teórica vista. Primeiro precisaremos separar todos os registros de treino em duas listas, uma contendo o texto e a outra contendo as respostas.

```python
def realizar_treinamento(registros_de_treino):
    treino_comentarios = [registro_treino[0] for registro_treino in registros_de_treino]
    treino_respostas = [registro_treino[1] for registro_treino in registros_de_treino]
```

Até aqui, tudo certo! Agora precisaremos utilizar o `CountVectorizer` para criar a representação de frequência e através dela gerar nosso classificador. Para fazer isso, vamos receber o `Vectorizer` por parâmetro, veja:

```python
def realizar_treinamento(registros_de_treino, vetorizador):
    treino_comentarios = [registro_treino[0] for registro_treino in registros_de_treino]
    treino_respostas = [registro_treino[1] for registro_treino in registros_de_treino]

    treino_comentarios = vetorizador.fit_transform(treino_comentarios)
```
Agora já estamos substituindo os textos pela sua representação de frequência, basta utilizarmos o método `fit` presente em `BernoulliNB` para gerar o modelo classificador.

```python
def realizar_treinamento(registros_de_treino, vetorizador):
    treino_comentarios = [registro_treino[0] for registro_treino in registros_de_treino]
    treino_respostas = [registro_treino[1] for registro_treino in registros_de_treino]

    treino_comentarios = vetorizador.fit_transform(treino_comentarios)

    return BernoulliNB().fit(treino_comentarios, treino_respostas)
```

Com isso já temos nosso modelo pronto para avaliar novos comentários! Basta obtermos o retorno deste método e utilizarmos a função `predict`!

```python
registros_de_treino, registros_para_avaliacao = pre_processamento()
vetorizador = CountVectorizer(binary = 'true')
classificador = realizar_treinamento(registros_de_treino, vetorizador)
resultado = classificador.predict(vetorizador.transform(["love this movie!"])
```
O resultado desta função é um array contendo `'1'` para comentários considerados positivos e  `'0'` para comentários negativos.

Não foi tão difícil assim, né?

Para facilitar a visualização do resultado, vamos criar duas funções auxiliares, uma para analisar a frase e outra para exibir o resultado, veja:

```python
def exibir_resultado(valor):
    frase, resultado = valor
    resultado = "Frase positiva" if resultado[0] == '1' else "Frase negativa"
    print(frase, ":", resultado)

def analisar_frase(classificador, vetorizador, frase):
    return frase, classificador.predict(vetorizador.transform([frase]))
```

A partir de agora podemos analisar novos comentários utilizando estas funções!

```python
registros_de_treino, registros_para_avaliacao = pre_processamento()
vetorizador = CountVectorizer(binary = 'true')
classificador = realizar_treinamento(registros_de_treino, vetorizador)

exibir_resultado( analisar_frase(classificador, vetorizador,"this is the best movie"))
exibir_resultado( analisar_frase(classificador, vetorizador,"this is the worst movie"))
exibir_resultado( analisar_frase(classificador, vetorizador,"awesome!"))
exibir_resultado( analisar_frase(classificador, vetorizador,"10/10"))
exibir_resultado( analisar_frase(classificador, vetorizador,"so bad"))
```

{% include image.html link="https://i.imgur.com/u7GhkF4.jpg" alt="Resultado do console" width=80 %} 

Bem legal né?

Mas achou que já tá tudo pronto?

{% include image.html link="https://i.imgur.com/iUk4RvN.jpg" alt="Choque de cultura" width=80 %} 

Piadinhas à parte, antes de finalizarmos nossa implementação precisamos saber a eficiência de nosso modelo candidato, lembram das 3 etapas? Pois é, então precisamos medir os resultados!

### Avaliação

Já definimos nossa estratégia de validação lá no comecinho do post! 

Vamos percorrer todos os registros que separamos para este teste e compararmos o resultado real com o resultado obtido a partir de nosso modelo. Em cada um destes resultados nós podemos contabilizar os acertos.

```python
def realizar_avaliacao_simples(registros_para_avaliacao):
    avaliacao_comentarios = [registro_avaliacao[0] for registro_avaliacao in registros_para_avaliacao]
    avaliacao_respostas   = [registro_avaliacao[1] for registro_avaliacao in registros_para_avaliacao]

    total = len(avaliacao_comentarios)
    acertos = 0

    for indice in range(0, total):
        resultado_analise = analisar_frase(classificador, vetorizador, avaliacao_comentarios[indice])
        frase, resultado = resultado_analise
        acertos += 1 if resultado[0] == avaliacao_respostas[indice] else 0

    return acertos * 100 / total
```
Este algoritmo é a forma mais simples de extrairmos uma avaliação para assertividade. Com isso obteremos um percentual de 82% de assertividade. Mas isso não nos diz muita coisa, idealmente precisamos coletar os verdadeiros e falsos positivos e negativos.

Dessa forma teremos 4 métricas diferentes. Vamos lá, a implementação é bastante semelhante, a única coisa que precisaremos alterar são as comparações e iremos contabilizar 4 contadores ao invés de apenas um.

No momento de retornar os dados podemos criar uma tupla contendo as quatro informações diferentes. Desta forma, basta desconstruir a tupla na aplicação principal e poderemos utilizar todas as informações!

```python
def realizar_avaliacao_completa(registros_para_avaliacao):
    avaliacao_comentarios = [registro_avaliacao[0] for registro_avaliacao in registros_para_avaliacao]
    avaliacao_respostas   = [registro_avaliacao[1] for registro_avaliacao in registros_para_avaliacao]

    total = len(avaliacao_comentarios)
    verdadeiros_positivos = 0
    verdadeiros_negativos = 0
    falsos_positivos = 0
    falsos_negativos = 0

    for indice in range(0, total):
        resultado_analise = analisar_frase(classificador, vetorizador, avaliacao_comentarios[indice])
        frase, resultado = resultado_analise
        if resultado[0] == '0':
            verdadeiros_negativos += 1 if avaliacao_respostas[indice] == '0' else 0
            falsos_negativos += 1 if avaliacao_respostas[indice] != '0' else 0
        else:
            verdadeiros_positivos += 1 if avaliacao_respostas[indice] == '1' else 0
            falsos_positivos += 1 if avaliacao_respostas[indice] != '1' else 0

    return ( verdadeiros_positivos * 100 / total, 
             verdadeiros_negativos * 100 / total,
             falsos_positivos * 100 / total,
             falsos_negativos * 100 / total
           )
```

Agora, após realizar nossas análises de novos comentários podemos incluir a avaliação, veja:

```python
percentual_acerto = realizar_avaliacao_simples(registros_para_avaliacao)
informacoes_analise = realizar_avaliacao_completa(registros_para_avaliacao)
verdadeiros_positivos,verdadeiros_negativos,falsos_positivos,falsos_negativos = informacoes_analise

print("O modelo teve uma taxa de acerto de", percentual_acerto, "%")

print("Onde", verdadeiros_positivos, "% são verdadeiros positivos")
print("e", verdadeiros_negativos, "% são verdadeiros negativos")

print("e", falsos_positivos, "% são falsos positivos")
print("e", falsos_negativos, "% são falsos negativos")
```

{% include image.html link="https://i.imgur.com/vLaMXj6.jpg" alt="Choque de cultura" width=80 %} 


Agora sim! Já podemos finalizar!

Todo o código desta solução está disponível em meu [GitHub](https://github.com/gabrielschade/IA/tree/master/ClassificacaoComentariosComNaiveBayes)!

O que achou deste post?

Me conte nos comentários!

E Até mais!