---
layout: page
title: Essays
permalink: /essays/
description: "Legacy essays route"
---

<p class="section-kicker">ROUTE NOTICE</p>
<h2>THIS FEED MOVED TO /WRITING</h2>
<p>Primary essay route is now <a href="{{ '/writing/' | prepend: site.baseurl }}">/writing</a>.</p>

<div class="writing-log" style="margin-top: 1.2rem;">
  {% assign essays = site.posts | where: 'category', 'essay' %}
  {% for post in essays limit:20 %}
  <article class="log-row">
    <span class="log-date">[{{ post.date | date: "%Y-%m-%d" }}]</span>
    <div>
      <a class="log-title" href="{{ post.url | prepend: site.baseurl | prepend: site.url }}">{{ post.title }}</a>
    </div>
  </article>
  {% endfor %}
</div>
