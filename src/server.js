const http2 = require('http2');
const {
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;

/*
    maxDeflateDynamicTableSize <number> Sets the maximum dynamic table size for deflating header fields. Default: 4Kib.
    maxSettings <number> Sets the maximum number of settings entries per SETTINGS frame. The minimum value allowed is 1. Default: 32.
    maxSessionMemory<number> Sets the maximum memory that the Http2Session is permitted to use. The value is expressed in terms of number of megabytes, e.g. 1 equal 1 megabyte. The minimum value allowed is 1. This is a credit based limit, existing Http2Streams may cause this limit to be exceeded, but new Http2Stream instances will be rejected while this limit is exceeded. The current number of Http2Stream sessions, the current memory use of the header compression tables, current data queued to be sent, and unacknowledged PING and SETTINGS frames are all counted towards the current limit. Default: 10.
    maxHeaderListPairs <number> Sets the maximum number of header entries. This is similar to http.Server#maxHeadersCount or http.ClientRequest#maxHeadersCount. The minimum value is 4. Default: 128.
    maxOutstandingPings <number> Sets the maximum number of outstanding, unacknowledged pings. Default: 10.
    maxSendHeaderBlockLength <number> Sets the maximum allowed size for a serialized, compressed block of headers. Attempts to send headers that exceed this limit will result in a 'frameError' event being emitted and the stream being closed and destroyed.
    paddingStrategy <number> The strategy used for determining the amount of padding to use for HEADERS and DATA frames. Default: http2.constants.PADDING_STRATEGY_NONE. Value may be one of:
    http2.constants.PADDING_STRATEGY_NONE: No padding is applied.
    http2.constants.PADDING_STRATEGY_MAX: The maximum amount of padding, determined by the internal implementation, is applied.
    http2.constants.PADDING_STRATEGY_ALIGNED: Attempts to apply enough padding to ensure that the total frame length, including the 9-byte header, is a multiple of 8. For each frame, there is a maximum allowed number of padding bytes that is determined by current flow control state and settings. If this maximum is less than the calculated amount needed to ensure alignment, the maximum is used and the total frame length is not necessarily aligned at 8 bytes.
    peerMaxConcurrentStreams <number> Sets the maximum number of concurrent streams for the remote peer as if a SETTINGS frame had been received. Will be overridden if the remote peer sets its own value for maxConcurrentStreams. Default: 100.
    maxSessionInvalidFrames <integer> Sets the maximum number of invalid frames that will be tolerated before the session is closed. Default: 1000.
    maxSessionRejectedStreams <integer> Sets the maximum number of rejected upon creation streams that will be tolerated before the session is closed. Each rejection is associated with an NGHTTP2_ENHANCE_YOUR_CALM error that should tell the peer to not open any more streams, continuing to open streams is therefore regarded as a sign of a misbehaving peer. Default: 100.
    settings <HTTP/2 Settings Object> The initial settings to send to the remote peer upon connection.
    Http1IncomingMessage <http.IncomingMessage> Specifies the IncomingMessage class to used for HTTP/1 fallback. Useful for extending the original http.IncomingMessage. Default: http.IncomingMessage.
    Http1ServerResponse <http.ServerResponse> Specifies the ServerResponse class to used for HTTP/1 fallback. Useful for extending the original http.ServerResponse. Default: http.ServerResponse.
    Http2ServerRequest <http2.Http2ServerRequest> Specifies the Http2ServerRequest class to use. Useful for extending the original Http2ServerRequest. Default: Http2ServerRequest.
    Http2ServerResponse <http2.Http2ServerResponse> Specifies the Http2ServerResponse class to use. Useful for extending the original Http2ServerResponse. Default: Http2ServerResponse.
    unknownProtocolTimeout <number> Specifies a timeout in milliseconds that a server should wait when an 'unknownProtocol' is emitted. If the socket has not been destroyed by that time the server will destroy it. Default: 10000.
    ...: Any net.createServer() option can be provided.
*/
const options = {
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem')
};
const server = http2.createSecureServer(options);
//options.origins = ['https://ddd.ddd']
server.on('stream', (stream) => {
  /*
    rejecting a stream 
    http2session.goaway([code[, lastStreamID[, opaqueData]]])
    does not end the session
  */
    /*
    multiple streams can get created per session
    the can be expected via the session.state.nextStreamID
  */
    const method = headers[HTTP2_HEADER_METHOD];
    const path = headers[HTTP2_HEADER_PATH];
    // ...
    stream.respond({
        [HTTP2_HEADER_STATUS]: 200,
        [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8'
    });
    stream.write('hello ');
    stream.end('world');
    /**
     * using a push response to validate client
     * best used with response.addTrailers(headers) // http2stream.additionalHeaders(headers)
     * stream.pushAllowed
     */
     //http2stream.pushStream(headers[, options], callback)
     /*
     stream.respond({ ':status': 200 }, { waitForTrailers: true });
        stream.on('wantTrailers', () => {
            stream.sendTrailers({ ABC: 'some value to send' });
        });
      User code must call either http2stream.sendTrailers() or http2stream.close() to close the Http2Stream.
     */
});
server.on('session', (session) => {
  /*
    http2session.originSet gives array of strings that are valid origins
    use that to validate origin logic
  */
    session.origin('https://example.com', 'https://example.org');
  /*
   Session ping for permernent connected proxy
   session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
    if (!err) {
        console.log(`Ping acknowledged in ${duration} milliseconds`);
        console.log(`With payload '${payload.toString()}'`);
    }
    });
  */
  /*
    direct facing without permernent proxy you want to discard the session
    session.setTimeout(2000);
    session.on('timeout', () => http2session.destroy([error][, code]));
  */

  /**
   * Session.settings(config)
   * to get current settings http2session.localSettings
   * after usage check http2session.pendingSettingsAck should be false before timeout.
   */
  /* 
    config object
    headerTableSize <number> Specifies the maximum number of bytes used for header compression. The minimum allowed value is 0. The maximum allowed value is 2232-1. Default: 4096.
    enablePush <boolean> Specifies true if HTTP/2 Push Streams are to be permitted on the Http2Session instances. Default: true.
    initialWindowSize <number> Specifies the sender's initial window size in bytes for stream-level flow control. The minimum allowed value is 0. The maximum allowed value is 232-1. Default: 65535.
    maxFrameSize <number> Specifies the size in bytes of the largest frame payload. The minimum allowed value is 16,384. The maximum allowed value is 2224-1. Default: 16384.
    maxConcurrentStreams <number> Specifies the maximum number of concurrent streams permitted on an Http2Session. There is no default value which implies, at least theoretically, 232-1 streams may be open concurrently at any given time in an Http2Session. The minimum value is 0. The maximum allowed value is 232-1. Default: 4294967295.
    maxHeaderListSize <number> Specifies the maximum size (uncompressed octets) of header list that will be accepted. The minimum allowed value is 0. The maximum allowed value is 2232-1. Default: 65535.
    maxHeaderSize <number> Alias for maxHeaderListSize.
    enableConnectProtocol<boolean> Specifies true if the "Extended Connect Protocol" defined by RFC 8441 is to be enabled. This setting is only meaningful if sent by the server. Once the enableConnectProtocol setting has been enabled for a given Http2Session, it cannot be disabled. Default: false.
  */
  /**
   * Session State
   */
  /*  
  <Object>
    effectiveLocalWindowSize <number> The current local (receive) flow control window size for the Http2Session.
    effectiveRecvDataLength <number> The current number of bytes that have been received since the last flow control WINDOW_UPDATE.
    nextStreamID <number> The numeric identifier to be used the next time a new Http2Stream is created by this Http2Session.
    localWindowSize <number> The number of bytes that the remote peer can send without receiving a WINDOW_UPDATE.
    lastProcStreamID <number> The numeric id of the Http2Stream for which a HEADERS or DATA frame was most recently received.
    remoteWindowSize <number> The number of bytes that this Http2Session may send without receiving a WINDOW_UPDATE.
    outboundQueueSize <number> The number of frames currently within the outbound queue for this Http2Session.
    deflateDynamicTableSize <number> The current size in bytes of the outbound header compression state table.
    inflateDynamicTableSize <number> The current size in bytes of the inbound header compression state table.
  */
});
/* 
    if you got special scaling needs for 1mio + connections consider altsvc addition
    in over 99% of scenarios our defered standard model is scaleable enough. 
    onSession: session.altsvc('h2=":8000"', 'https://example.org:80');
    onStream: stream.session.altsvc('h2=":8000"', stream.id);
    Also usable to slow down attacks
    you will need that also for http3 support
    h3-29=":443"; ma=2592000,h3-T051=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"
*/