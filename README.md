# kafka-metrics

[![release](http://github-release-version.herokuapp.com/github/landoop/kafka-metrics-ui/release.svg?style=flat)](https://github.com/landoop/kafka-metrics-ui/releases/latest)

View JMX metrics, and metadata and manage alerts on your Kafka (ZK, Schema Registry, Kafka-Connect, Kafka-REST) cluster

## Live Demo
[kafka-metrics-ui.landoop.com](http://kafka-metrics-ui.landoop.com)

## Build from source

```
    git clone https://github.com/Landoop/kafka-metrics-ui.git
    cd kafka-metrics-ui
    npm install -g bower
    npm install
    bower install
    http-server .
```
Web UI will be available at `http://localhost:8080`

### Setup

Use multiple clusters in `env.js` :
```
var clusters = [
  {
    NAME: "prod",
    KAFKA_LENSES_URL: "http://kafka-lenses.demo.landoop.com/api",
    DEBUG_LOGS_ENABLED: true
  }
];

```
* Set `DEBUG_LOGS_ENABLED` to true to enable the debug logs.

## License

The project is licensed under the [BSL](http://www.landoop.com/bsl) license.

## Relevant Projects

* [schema-registry-ui](https://github.com/Landoop/schema-registry-ui), View, create, evolve and manage your Avro Schemas for multiple Kafka clusters
* [kafka-connect-ui](https://github.com/Landoop/kafka-connect-ui), Set up and manage connectors for multiple connect clusters
* [fast-data-dev](https://github.com/Landoop/fast-data-dev), Docker for Kafka developers (schema-registry,kafka-rest,zoo,brokers,landoop) 
* [Landoop-On-Cloudera](https://github.com/Landoop/Landoop-On-Cloudera), Install and manage your kafka streaming-platform on you Cloudera CDH cluster



<img src="http://www.landoop.com/images/landoop-dark.svg" width="13" /> www.landoop.com

//    "angularjs-humanize-duration": "^0.1.0",
