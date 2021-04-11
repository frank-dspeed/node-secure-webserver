# node-secure-webserver
This Project is used to filter legit connections. And Applys Frank Lemanschik 's best security shema

we address the following problems and more.
https://www.lucidchart.com/techblog/2019/04/10/why-turning-on-http2-was-a-mistake/


## Features
- Accept only HTTP/2 Connections to make distributed attacks more hard.
- Clustering Support via Redis
- Supports Permernent Connected Proxys (eg. Cloudflare) via x-forwarded header.
- iptables support if directly frontend facing without permernent proxy
- Often it is a clever idea to Switch Away from Permernent Proxy Connections like eg: Cloudflare to prevent Complex Attacks
  - in this scenario we need to reconfigure the dns of our domains
  - we use iptables to block the traffic + inform our provider about bad ips to block on the gateway level.
- Scheduling via Workers.
- NEL
- serviceWorker
- general security headers and test if they get enforced via the connection
- iptables (kernel) based loadbalancing of nodejs Instances.
- socket activation based workers for dev or 
