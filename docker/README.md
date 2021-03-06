## Kafka Topics UI ##

[![](https://images.microbadger.com/badges/image/landoop/kafka-topics-ui.svg)](http://microbadger.com/images/landoop/kafka-topics-ui)

This is a small docker image for Landoop's kafka-topics-ui.
It serves the kafka-topics-ui from port 8000.
A live version can be found at <https://kafka-topics-ui.landoop.com>

The software is stateless and the only necessary option is your Kafka REST Proxy
URL:

    docker run --rm -it -p 8000:8000 \
               -e "KAFKA_LENSES_URL=http://kafka.rest.proxy.url" \
               landoop/kafka-topics-ui

Visit http://localhost:8000 to see the UI.

### Proxying Kafka REST Proxy

If you have CORS issues or want to pass through firewalls and maybe share your
server, we added the `PROXY` option. Run the container with `-e PROXY=true` and
Caddy server will proxy the traffic to the REST Proxy:

    docker run --rm -it -p 8000:8000 \
               -e "KAFKA_LENSES_URL=http://kafka.rest.proxy.url" \
               -e "PROXY=true" \
               landoop/kafka-topics-ui

> **Important**: When proxying, for the `KAFKA_LENSES_URL` you have to use
> an IP address or a domain that can be resolved to it. **You can't use**
> `localhost` even if you serve Kafka REST port from your localhost. The reason
> for this is that a docker container has its own network, so your _localhost_
> is different from the container's _localhost_. As an example, if you are in
> your home network and have an IP address of `192.168.5.65` and run Kafka REST
> from your computer, instead of `http://127.0.1:8082` you must use
> `http://192.168.5.65:8082`.

If your REST Proxy uses self-signed SSL certificates, you can use the
`PROXY_SKIP_VERIFY=true` environment variable to instruct the proxy to
not verify the backend TLS certificate.
