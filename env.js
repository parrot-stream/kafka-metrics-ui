// Replace with the URL where a Kafka Lenses is listening
var clusters = [
  {
    NAME: "Preview",
    KAFKA_LENSES_URL: "http://kafka-lenses.demo.landoop.com/api",
    DEBUG_LOGS_ENABLED: true
  },
  {
    NAME: "Docker",
    KAFKA_LENSES_URL: "http://localhost:8080/api",
    DEBUG_LOGS_ENABLED: true
  }
];

module.exports = clusters;