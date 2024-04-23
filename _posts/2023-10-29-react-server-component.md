---
layout: post
title: "React Server Component in Next.js"
#date: 2024-02-07 12:00:00
lang: en
description: "What is React Server Component? How is the application in Next.js?"
comments: false
keywords: "tech, javascript, "
category: essay
---

This is written form of my talk in a JogjaJS forum, on 28 October 2023.

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/Cy9oCyhS3eL/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/Cy9oCyhS3eL/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/Cy9oCyhS3eL/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Hanief Utama (@haniefutama)</a></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>

Here is the slides from my talk:

<iframe src="https://www.slideshare.net/slideshow/embed_code/key/mJu6HGvCuJuTlZ?hostedIn=slideshare&page=upload" width="476" height="400" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></iframe>

Here is the recording of me delivering the talk:

<iframe width="560" height="315" src="https://www.youtube.com/embed/RsiNvvj0PZQ?si=FZVagYGJUgqQIgMO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


**TL;DR**, Only use React Server Component if you need performance/SEO optimisation and you are already in Next.js.

# History of web technologies

![Image of first web server](/assets/images/First_Web_Server.jpg)

Web has been here for more than 30 years. When [Sir Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee) proposed a system for CERN researchers to use and share documents, he not only built the [specification](https://en.wikipedia.org/wiki/HTML), but also the browser and server software for demo purposes. Thus born the first web server.

2 years later, [PHP](https://en.wikipedia.org/wiki/PHP) was born from the hand of Rasmus Lerdorf so we can create dynamic response for web request. Only 6 months after that, Brendan Eich invented [JavaScript](https://en.wikipedia.org/wiki/JavaScript) as a way to manipulate the web page after they are loaded on the browser. Thus born dynamic web application that enables giant modern software and services like google and facebook.

Javascript is a little bit younger than PHP. It has been historically used in a different place. But, since V8 JS engine and Node.js, JavaScript has reached even wider use case. Not only it has been used in browser, but now it can be used in server environment too, like PHP.

[React.js](https://en.wikipedia.org/wiki/React_(JavaScript_library)), is JavaScript library built inside Facebook/Meta. It is replacing jQuery as arguably the [world's number 1 JS library](https://gist.github.com/tkrotoff/b1caa4c3a185629299ec234d2314e190) for frontend development. It has changed a lot since its conception. It has also spawned many other libraries and frameworks supporting its ecosystem. 

One of the most recent and popular framework for React.js is Next.js. It aims to take React to the next level by providing technologies and optimisation so it can be used for production level app. 

The most recent technology developed for React and supported by Next.js is a feature called React Server Component (RSC). It has created a lot of chatter in the web dev sphere because of its funny syntax and supposedly its transformation into PHP. The OG server scripting language.

![React transformation into PHP](/assets/images/rsc-1.png)

But what is React Server Component? 

Ironically, eventhough its actually a React feature, there's [not](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) [much](https://react.dev/reference/react/use-server) documentation explaining it in the [React docs](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components). Next.js has better [documentation](https://nextjs.org/docs/app/building-your-application/rendering) about it.

So I am now trying to make sense of it, and put it in a blog post as my own notes and hopefully can be useful for any FE dev out there.

I feel the best explanation on RSC out there is from Josh Comeau in his [Making Sense of React Server Components](https://www.joshwcomeau.com/react/server-components/) post. I urge you to read it from there. It has cool illustration and really easy to understand break down.

Its so good, my own post will be heavily inspired from it and use some of his illustration.

# JS rendering methods

To be able to understand RSC, first we have to understand React rendering methods.

## What is Client Side Rendering

The OG React rendering method is of course Client Side rendering. You have to download all of JS files to be able to see the content.

![Client Side Rendering](/assets/images/rsc-2.png)
Chart adapted from [Josh W Comeau](https://www.joshwcomeau.com/react/server-components/)

This approach is simple and has been used for some time. But, this means the first paint and page interactive is quite far away from the first request. This has implication on SEO and performance. It has to wait for script download, shell render, API roundback, database query, and content render to be able to display real content on web page.

This approach is not suitable for content heavy apps such as e-commerce sites or blogs. But its still ok for non-public non-heavy-traffic app such as internal dashboard.

## Server Side Rendering

![Server Side Rendering](/assets/images/rsc-4.png)
Chart adapted from [Josh W Comeau](https://www.joshwcomeau.com/react/server-components/)

To fix the SEO problem, React and framework such as Next.js added new method of rendering called Server Side Rendering. This method put the rendering of initial shell to the server, so when the initial request came it can respond with default/initial content to the browser. 

Once the shell arrived at the browser, it will download the real content using a method called hydration. Hydration basically works like it is named. Imagine an empty bottle, hydration is filling the bottle with water from the tap. The container/shell already there and can be seen / interacted by user, but it needs to be filled for user to be able to drink.

## Server Component

![Server Component](/assets/images/rsc-5.png)
Chart adapted from [Josh W Comeau](https://www.joshwcomeau.com/react/server-components/)

SSR is already helping with performance and SEO. But we can go further. Why should we receive initial shell on first response? Why do we not get the whole content? Especially if we have access to the underlying database in the server. We also still get a huge bundle everytime we download the JS script.

If you thought about this, then Server Component is for you.

Server Component basically enables React component to be rendered and interacting with server code via Node.js. This unlocked powerful capabilities such as direct DB access. We can also compartmentalize the code downloaded to browser since we don't need JS to render the content. Hence the smaller bundle size. We only download what we need.


# The difference between Server Component and Client Component

![Server Side Rendering](/assets/images/rsc-3.png)

What's the difference between Server and Client Component? The first thing that you notice is the "use client" directive at the top of the Client Component. That's because in the RSC paradigm, default component type is Server Component.

Only when we need the component to be client component, we explicitly changed it to client.

The other thing that we notice is we can directly connect to the DB from the component. 🤯 That is crazy! It feels that it should be illegal.

Here are the summary of the differences:

|               Server Component                |              Client Component            |
|-----------------------------------------------|------------------------------------------|
| Render only on server                         | Render on server and client              |
| New kind of component                         | The component that we already know       |
| Default component                             | "use client"                             |
| No state                                      | Can use state                            |
| Can import Client Component                   | Can **ONLY** import Client Component     |


# Useful visualisation for client boundary

The most helpful way to think about separation of client and server component is if we use the concept of client boundary. 

In this boundary, when we make a component became a client component, all of its children components became client component too.

Let's look at the component tree below, here the App and Header is Server Components since its default. But the Article and all its children are client because we put directive "use client" on the Article component. This assignment created an imaginary client boundary for the Article component and its descendants.

![client boundary](/assets/images/rsc-6.png)

# Next.js is the only framework that offer full support of RSC

![RSC Meme](/assets/images/rsc-7.png)

Strangely, even though RSC is an official React feature, since it has to have server implementation, they need to collaborate with framework teams that can support it. As of October 2023, the only framework that support it is Next.js. If you use other framework like Remix, well though luck. RSC is not for you yet.

# How to use Server Components in Next.js?

- Use Next.js version 13.4+

  You need to be on the latest version of Next.js. The RSC support doesn't ship before version 13.4.

- Use App Router

  You need to use the App router paradigm. You need to migrate the Pages router to App router.

- Server Components is default.
  
  By default all components is Server Components. If you want to make it Client Components you need to add "use client" directive explicitly.

# Pros and Cons of using RSC

Before you decide if you want to use RSC, these are some of the pros and cons of RSC:

### Pros

- Smaller bundle size
- Faster rendering
- Server is controllable vs different kind of browser
- Hydrate only what is needed
- Keep sensitive data on the server
- Caching

### Cons
- No CSS-in-JS
- React Context doesn't work
- More things to think about
- More work on server
- Need to control which part will hydrate

# Should I use RSC?

The big question is, should I use it? This table will probably help your decision making:

|                        Yes                         |                  No                 |
|----------------------------------------------------|-------------------------------------|
| You are already deeply invested in React + Next.js |                                     |
| You have control of the server                     |                                     |
| Performance is very important to you               |                                     |
| Your bundle size is too big                        |                                     |
|                                                    | Your life is complex enough already |

Adding React Server Components will only make your app more complex, since you have to take care the server logic as well. I recommend only use it when you have to.

# Adoption Strategy

So, with all the asterisks and headache listed above, you still decided that you want to adopt RSC. Then I recommend that you use this strategy:

1. Add the "use client" directive to the root of your app.
   
   This way all your application becomes client component by default. This will prevent some headache with the mix between server and client components along the component tree.

2. Move the directive as low as possible in the rendering tree.

   When you are ready, try move the "use client" directive one level at a time. If there's no broken parts, continue move down. When you find a problem, try rearrange your component to separate the interactive parts. When you can't move it further down, you found your final directive position.

3. Adopt advanced pattern when performance issues arise.

   Only use advanced tricks when the default/standard way is not enough anymore to handle your needs. Don't do premature optimization.

# Conclusion

If you need more performance from your app, or you need to have better SEO, React Server Components is for you. 

Also, you need to be already in Next.js environment, since the only frawework supporting this feature is them.
