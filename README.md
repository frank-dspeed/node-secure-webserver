# node-secure-webserver
This Project is used to filter legit connections. And Applys Frank Lemanschik 's best security shema

we address the following problems and more.

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


## SSL
use mkcert util or

```
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```


## Design decissions
- Accept only http/2 to bundle connections into logical units
- Even better Use http/3 connections to bundle connections
- do not pushHeaders when serviceWorker is used
- https://slacker.ro/2019/09/20/when-tcp-sockets-refuse-to-die/


- OpenSSL quick support upstream https://github.com/openssl/openssl/pull/8797
- OpenSSL Fork with quic support https://github.com/quictls/openssl