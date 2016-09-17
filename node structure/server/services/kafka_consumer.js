var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client(),
    GoogleSearchClass = require('./googlesearch');

module.exports = function() {

    var consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'chatmessages' }
        ],
        {
            autoCommit: true,
            autoCommitIntervalMs: 5000
        }
    );

    consumer.on('message', function (kafkaMessage) {
        console.log('Received message ' + kafkaMessage.value);
        googleSearch = new GoogleSearchClass();
        googleSearch.crawGoogleSearch(kafkaMessage.value);
        //var message = JSON.parse(kafkaMessage.value);
        //chatServer.broadcast(message);
    });

    return {
        close : function() {
            console.log('Shutting down consumer');
            consumer.close(false, function() {
                console.log('Consumer closed');
                console.log('Shutting down consumer client');
                client.close(function() {
                    console.log('Consumer Client closed');
                });
            });
        }
    };
};

