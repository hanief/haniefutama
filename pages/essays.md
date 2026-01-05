---
layout: page
title: Essays
permalink: /essays/
---

<section class="post-list">
  {% for post in site.posts %}
    {% if post.category == "essay" %}
    <article class="post-item">
      <span class="post-meta date-label"
        >{{ post.date | date: "%d/%m/%y" }}</span
      >
      <h5 class="article-title">
        <a
          class="post-link"
          href="{{ post.url | prepend: site.baseurl | prepend: site.url }}"
          >{{ post.title }}</a
        >
      </h5>
    </article>
    {% endif %}
  {% endfor %}
</section>
