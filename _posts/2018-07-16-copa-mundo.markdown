---
layout: post
title:  "IA na Copa do Mundo"
date:   2018-07-16 00:00:00 +0000
comments: true
tags: [IA]
---

Olá pessoa!

A copa do mundo já passou, mas como diria Roberto Carlos (o músico, não o jogador): são tantas emoções!

Vamos utilizar o Azure Cognitive Services para visualizar a emoção dos jogadores na copa?
<!--more-->

Se você não faz ideia do que é o Azure Cognitive Services, sugiro fortemente dar uma olhadinha [nesse post]({{ site.baseurl }}{% link _posts/2018-04-30-azure-cs-intro.markdown %}) antes. Depois volta aqui!

Nosso objetivo é chegar nessa solução aqui:

{% include image.html link="https://i.imgur.com/vy83oZy.png" alt="Jogador bravo" width=90 %}

Veja que temos o mapeamento do rosto do jogador, uma sugestão de idade e para fechar com chave de ouro um emoji representando a emoção mais intensa detectada.

Para fazer isso, vamos utilizar um serviço (gratuito) do Azure, ele que fará todo trabalho complexo para nós. Para esse tipo de problema (análise de imagem) utilizamos o serviço de detecção de faces da categoria **visão computacional**. 

Os detalhes do serviço podem ser visualizados na página: https://azure.microsoft.com/pt-br/services/cognitive-services/directory/vision/

> Se você ainda não tem uma conta **gratuita** no Azure acesse: https://portal.azure.com e cria lá, é rapidinho.

Depois de criar sua conta, você terá acesso ao portal, neste ponto, sua página deve se parecer com esta:

{% include image.html link="https://i.imgur.com/Ah3Zxli.png" alt="Portal Azure" width=90 %}

Agora você pode selecionar a primeira opção: "Criar um recurso", isso vai abrir uma nova aba, procure por "AI + Machine Learning" e por fim, por API de Detecção Facial.

{% include image.html link="https://i.imgur.com/ymgfJp4.png" alt="Portal Azure - 2" width=90 %}

Neste ponto você deve selecionar as configurações de sua assinatura e da criação do recurso. Preste atenção aqui, afinal existe a opção gratuita e a opção paga, para fazer os testes de hoje, você pode optar pelo plano gratuito (F0) sem problemas nenhum.

Pense sobre os planos pagos para aplicações comerciais que possuem uma demanda de requisição maior, não se preocupe com isso nos seus estudos.

{% include image.html link="https://i.imgur.com/bZb6GUO.png" alt="Portal Azure - 3" width=90 %}

Após o cadastro você terá acesso ao recurso em sua *dashboard*, você precisará acessá-lo para obter as chaves que serão enviadas na requisição. Mas agora chega de painel e vamos programar um pouco!

Na prática consumir estes serviços é tão simples quanto consumir uma API Rest **qualquer**, então fique à vontade para consumir com sua linguagem preferida!

Segue um exemplo de código em C#:

```csharp
public async Task<string> ObterEmocoes(string imagemBase64)
{
    HttpResponseMessage respostaHttp;
    string json;
    byte[] bytesImagem = Convert.FromBase64String(imagemBase64);

    string url = "https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect";
    string queryString = "returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,emotion";

    var httpClient = new HttpClient();
    httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "<Sua chave de API>");
    using (var conteudoEmBytes = new ByteArrayContent(bytesImagem))
    {
        conteudoEmBytes.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        respostaHttp = await httpClient.PostAsync( $"{url}?{queryString}", conteudoEmBytes);
        json = await respostaHttp.Content.ReadAsStringAsync();
    }
    return json;
}
```
É um código super simples e você pode utilizá-lo na linguagem que preferir, inclusive na [documentação](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) você encontra exemplos em diversas linguagens.

Vamos analisá-lo de forma breve e entender o que está acontecendo nessa requisição. Na prática o que pode variar de caso pra caso é o *ContentType* e a *query string*.

O *ContentType* pode variar dependendo de como você está enviando a imagem para o Azure, afinal, você pode enviar uma *url* ou um array de bytes. Caso envie uma *url* você precisará alterar o *ContentType* para `"application/json"` e o conteúdo deve estar no seguinte formato:

```javascript
{
    url: "url da imagem que será enviada"
}
```

As alterações na *query string* fazem com que o JSON de retorno acumule resultados, você pode encontrar diversos exemplos [aqui](https://azure.microsoft.com/pt-br/services/cognitive-services/face/).

{% include image.html link="https://i.imgur.com/KCPZlYZ.png" alt="Portal Azure - 4" width=90 %}

Agora vamos lá, como chegamos naquela foto de antes?

Simples, é só analisar o JSON de retorno, lá temos as coordenadas do retângulo para cobrir a face e a sugestão de idade:

```javascript
...,
"faceRectangle": {
      "top": 128,
      "left": 459,
      "width": 224,
      "height": 224
    },
...
 "age": 24.0,
....
```

Ok, mas e os emojis?

Também foi bastante simples, afinal, no parâmetro `returnFaceAttributes` solicitamos o retorno da idade e das emoções! Basta procurar no objeto JSON de retorno que você encontrará o objeto `emotion`:

```javascript
...
"emotion": {
        "anger": 0.0,
        "contempt": 0.0,
        "disgust": 0.0,
        "fear": 0.0,
        "happiness": 1.0,
        "neutral": 0.0,
        "sadness": 0.0,
        "surprise": 0.0
      },
...
```

Cada propriedade desse objeto representa um valor em uma escala de 0 até 1 (ou de 0% até 100%) para cada emoção, o que foi feito para gerar as imagens foi simplesmente um mapeamento da emoção com maior *score* para um emoji que a represente!

Agora vamos fazer nossos testes para medir as emoções na copa do mundo!

<div class="row">
<div class="col s12">
 <div class="carousel">
    <a class="carousel-item">
        <img src="https://imgur.com/Zk499oe.png">
    </a>
    <a class="carousel-item">
        <img src="https://imgur.com/GKNb59z.png">
    </a>
    <a class="carousel-item">
        <img src="https://imgur.com/O2HEwaD.png">
    </a>
    <a class="carousel-item">
        <img src="https://imgur.com/5BDO9ey.png">
    </a>
    <a class="carousel-item">
        <img src="https://imgur.com/0TbgQsc.png">
    </a>
  </div>
  </div> 
</div>

É sempre bom lembrar que as aplicações que utilizam IA não são exatas, portanto, fazer as mesmas requisições podem sim, gerar resultados diferentes, veja nesse exemplo onde a emoção dominante era "dúbia":

{% include image.html link="https://i.imgur.com/O4t7RKc.png" alt="Resultados dúbios" width=90 %}

Esse problema surgiu, por conta da solução abordada, como eu exibo o emoji apenas da emoção com a maior pontuação, existe esta perda quando as pontuações são semelhantes, mas isso fica totalmente à cargo de quem está desenvolvendo!

Ah, para desenhar as coisas eu utilizei o canvas do HTML 5 mesmo, sem nenhuma tecnologia misteriosa!

E por último fica a imagem do menino Ney com esperanças para a copa américa do ano que vem!

{% include image.html link="https://i.imgur.com/MyCVrQM.png" alt="Menino Ney" width=90 %}

O que você achou deste post?

Me conte nos comentários!

E Até mais!