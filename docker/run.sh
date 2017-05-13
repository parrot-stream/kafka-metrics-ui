#!/bin/sh

PROXY_SKIP_VERIFY="${PROXY_SKIP_VERIFY:-false}"
INSECURE_PROXY=""

if echo "$PROXY_SKIP_VERIFY" | egrep -sq "true|TRUE|y|Y|yes|YES|1"; then
    INSECURE_PROXY=insecure_skip_verify
fi

if echo $PROXY | egrep -sq "true|TRUE|y|Y|yes|YES|1" \
        && [[ ! -z "$KAFKA_LENSES_URL" ]]; then
    echo "Enabling proxy."
    cat <<EOF >>/caddy/Caddyfile
proxy /api/kafka-rest-proxy $KAFKA_LENSES_URL {
    without /api/kafka-rest-proxy
    $INSECURE_PROXY
}
EOF
KAFKA_LENSES_URL=/api/kafka-rest-proxy
fi

if [[ -z "$KAFKA_LENSES_URL" ]]; then
    echo "Kafka Lenses Proxy URL was not set via KAFKA_LENSES_URL environment variable."
else
    echo "Kafka Lenses URL to $KAFKA_LENSES_URL."
    cat <<EOF >kafka-topics-ui/env.js
var clusters = [
   {
     NAME:"default",
     KAFKA_LENSES_URL: "$KAFKA_LENSES_URL",
     DEBUG_LOGS_ENABLED: true
   }
]
EOF
fi

echo

exec /caddy/caddy -conf /caddy/Caddyfile
