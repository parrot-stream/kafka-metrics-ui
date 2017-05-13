angularAPP.factory('consumerFactory', function ($rootScope, $http, $log, $q, $filter, $cookies, env, HttpFactory) {


  var CONTENT_TYPE_JSON = 'application/vnd.kafka.v2+json';
  var CONSUMER_NAME_PREFIX = 'kafka-topics-ui-';
  var PRINT_DEBUG_CURLS = false;

  /**
   * Creates consumer + group with unique uuid and type in name.
   **/
  function createConsumer(format, topicName, uuid) {
  }

  /**
   * Waits for the pre-requisite requests to be done and then
   * starts polling records (/records).
   * When gets the records, deletes the consumer
   **/
  function getDataFromBeginning(consumer, format, topicName) {
  }

  function getDataFromEnd(consumer, format, topicName) {
  }

  function getDataForPartition(topicName, consumer, format, partition, offset, position) {
  }

  /**
   * Does all the required requests before polling
   * 1) Gets the paritions for topic (/partitions)
   * 2) Assigns ALL the partitions to consumer (/assignments)
   * 3) Moves all the partitions to beginning (/positions/beginning)
   * TODO pass the partitions because
   * TODO         a) we have them so no need for requests b)
   * TODO         a) will make it generic to be used for 1 partition as well
   * TODO                      seekForPartition(topicName, consumer, beginningOrEnd, partition, offset)
   **/
  function seekAll(beginningOrEnd, consumer, topicName) {
  }

  function getConsumerOffsets(consumer, topicName, partition) {
  }

  /* PRIMITIVE REQUESTS RETURN PROMISES */

  function postConsumerAssignments(consumer, topicName, partitions) {
  }

  function getConsumerAssignments(consumer) {
  }

  function getPartitions(topicName) {
  }

  function deleteConsumer(consumer, topicName) {
  }

  function postConsumerPositions(consumer, topicName, partition, offset, position) {
  }

  //UTILITIES / STATICS

  function getConsumer(format, uuid) {
  }

  function preparePartitionData(topicName, partitions) {
  }

  function consumerUUID() {
  }

  function saveTopicTypeToCookie(topicName, format) {
  }

  function hasCookieType(topicName) {
  }

  function isKnownBinaryTopic(topicName) {
  }

  function isKnownJSONTopic(topicName) {
  }
  function getConsumerType(topicName) {
  }
  function getConsumerTypeRetry(previousFormatTried, topicName) {
  }

  //PUBLIC METHODS // TODO cleanup

  return {
    createConsumer: function (format, topicName, uuid) {
      return createConsumer(format, topicName, uuid);
    },
    getConsumer: function (format, uuid) {
      return getConsumer(format, uuid);
    },
    getConsumerType: function (topicName) {
      return getConsumerType(topicName);
    },
    getConsumerTypeRetry: function (previousFormatTried, topicName) {
      return getConsumerTypeRetry(previousFormatTried, topicName);
    },
    getDataFromBeginning: function (consumer, format, topicName) {
      return getDataFromBeginning(consumer, format, topicName);
    },
    getDataFromEnd: function (consumer, format, topicName) {
      return getDataFromEnd(consumer, format, topicName);
    },
    seekAll: function (beginningOrEnd, consumer, topicName, partition) {
      return seekAll(beginningOrEnd, consumer, topicName, partition);
    },
    postConsumerPositions: function (consumer, topicName, partition, offset) {
      return postConsumerPositions(consumer, topicName, partition, offset);
    },
    postConsumerAssignments: function (consumer, topicName, partitions) {
      return postConsumerAssignments(consumer, topicName, partitions);
    },
    getRecords: function (consumer, format) {
      return getRecords(consumer, format);
    },
    getConsumerOffsets: function (consumer, topicName, partition) {
      return getConsumerOffsets(consumer, topicName, partition);
    },
    getConsumerAssignments: function (consumer) {
      return getConsumerAssignments(consumer);
    },
    getPartitions: function (topicName) {
      return getPartitions(topicName);
    },
    genUUID: function () {
      return consumerUUID();
    },
    getDataForPartition: function (topicName, consumer, format, partition, offset, position) {
      return getDataForPartition(topicName, consumer, format, partition, offset, position);
    }
  }
});
