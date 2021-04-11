'use strict';
// https://nodejs.org/dist/v15.7.0/docs/api/quic.html#quic_example
const key = getTLSKeySomehow();
const cert = getTLSCertSomehow();
// The net module provides an implementation of the QUIC protocol. To access it, the Node.js binary must be compiled using the --experimental-quic configuration flag.
const { createQuicSocket } = require('net');

/*
client <Object> A default configuration for QUIC client sessions created using quicsocket.connect().
disableStatelessReset <boolean> When true the QuicSocket will not send stateless resets. Default: false.
endpoint <Object> An object describing the local address to bind to.
address <string> The local address to bind to. This may be an IPv4 or IPv6 address or a host name. If a host name is given, it will be resolved to an IP address.
port <number> The local port to bind to.
type <string> Can be one of 'udp4', 'upd6', or 'udp6-only' to use IPv4, IPv6, or IPv6 with dual-stack mode disabled. Default: 'udp4'.
lookup <Function> A custom DNS lookup function. Default: undefined.
maxConnections <number> The maximum number of total active inbound connections.
maxConnectionsPerHost <number> The maximum number of inbound connections allowed per remote host. Default: 100.
maxStatelessResetsPerHost <number> The maximum number of stateless resets that the QuicSocket is permitted to send per remote host. Default: 10.
qlog <boolean> Whether to enable 'qlog' for incoming sessions. (For outgoing client sessions, set client.qlog.) Default: false.
retryTokenTimeout <number> The maximum number of seconds for retry token validation. Default: 10 seconds.
server <Object> A default configuration for QUIC server sessions.
statelessResetSecret <Buffer> | <Uint8Array> A 16-byte Buffer or Uint8Array providing the secret to use when generating stateless reset tokens. If not specified, a random secret will be generated for the QuicSocket. Default: undefined.
validateAddress <boolean> When true, the QuicSocket will use explicit address validation using a QUIC RETRY frame when listening for new server sessions. Default: false.
*/
// Create the QUIC UDP IPv4 socket bound to local IP port 1234
const socket = createQuicSocket({ endpoint: { port: 1234 } });

socket.on('session', async (session) => {
  // A new server side session has been created!
  session.on('secure', () => {
    // The QuicServerSession can now be used for application data
  });
  const uni = await session.openStream({ halfOpen: true });
  uni.write('hi ');
  uni.end('from the server!');
  // The peer opened a new stream!
  session.on('stream', (stream, headers) => {
    //
    //If headers are supported by the application protocol in use for a given QuicSession, the 'initialHeaders', 'informationalHeaders', and 'trailingHeaders' events will be emitted by the QuicStream object when headers are received; and the submitInformationalHeaders(), submitInitialHeaders(), and submitTrailingHeaders() methods can be used to send headers.
    if (headers[":path"] === "/") {
        stream.respondWithFile("./files/index.html");
    }
    // Let's say hello
    stream.end('Hello World');

    // Let's see what the peer has to say...
    stream.setEncoding('utf8');
    stream.on('data', console.log);
    stream.on('end', () => console.log('stream ended'));
  });


});

// Tell the socket to operate as a server using the given
// key and certificate to secure new connections, using
// the fictional 'hello' application protocol.
(async function() {
  await socket.listen({ key, cert, alpn: 'hello' });
  console.log('The socket is listening for sessions!');
})();

//https://w3c.github.io/webtransport/#privacy-security

//https://developer.mozilla.org/en-US/docs/Web/API/AbortController

//chrome://net-internals/#quic 
//chrome://net-export/ => https://netlog-viewer.appspot.com/#import