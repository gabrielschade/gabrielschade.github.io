---
layout: page
title: Posts
---

## Posts

{% for post in site.posts %} {% include postdate.html %}
[ {{ post.title }} ]({{ post.url }}) 

{% endfor %}