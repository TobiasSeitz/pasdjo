/**
 * Created by Tobi on 19/04/2017.
 */


var fs = require('fs');
var path = require('path');

var Util = require('./util');

function Analyzer() {

  const COMMON = 'common'
    , MANGLED = 'mangled'
    , PASSPHRASE = 'passphrase'
    , RANDOM = 'random'
    , PREDICTABLE = 'predictable';

  this.data = {};

  /**
   * @param anything
   * @returns anything in "string quotes"
   */
  function inQuote(anything) {
    return '"' + anything + '"';
  }

  String.prototype.inQuote = function() {
    return inQuote(this);
  };

  Number.prototype.inQuote = function() {
    return inQuote(this);
  };


  /**
   *
   * @param {{games: Object}} users as exported by Firebase
   * @return {{games: string, rounds: string}}
   */
  function toCSV(users) {
    // we have the following data structure
    // games Obj
    //    userID Obj
    //        gameID Obj
    //          rounds Array of Obj
    //          score Obj (achieved, percent, total)

    var gameCSV = '', roundCSV = '';
    var conditions = ['overall', COMMON, MANGLED, PASSPHRASE, RANDOM, PREDICTABLE];
    var metricNames = ['Tendency', 'Ratings', 'Scores', 'GuessesLog10', 'Guesses'];
    var gameColumns = ['id', 'user', 'userID', 'game', 'gameIndex', 'timestamp', 'isodate', 'achieved', 'total', 'percent', COMMON, MANGLED, PASSPHRASE, RANDOM, PREDICTABLE];

    conditions.forEach((condition) => {
      metricNames.forEach((metric) => {
        gameColumns.push(condition + metric);
      })
    });

    gameColumns.map((col) => {
      return col.inQuote()
    });
    gameCSV += gameColumns.join(',') + '\n';

    var roundColumns = [
      'id',
      'user',
      'userID',
      'game',
      'gameIndex',
      'condition',
      'guesses',
      'guessesLog10',
      'password',
      'score',
      'userRating',
      'tendency',
      'timestamp'
    ].map((col) => {
      return col.inQuote()
    });

    roundCSV += roundColumns.join(',') + '\n';


    var gameRowID = 0;
    var userID = 0;
    var pwRowID = 0;


    for (var user in users) {
      var userObj = users[user];
      var userGames = 0;
      userID++;
      for (var game in userObj) {
        userGames++;
        var gameObj = userObj[game];
        var score = gameObj.score || {
          achieved: gameObj.achieved,
          total: gameObj.total,
          percent: gameObj.percent
        }; // it was later renamed to achieved.


        var duration = 0, startTimestamp = 0, endTimestamp = 0, endDate;

        if ('rounds' in gameObj) {
          gameObj.rounds.forEach(function(round) {
            if (!startTimestamp) {
              startTimestamp = round.timestamp;
            }
            if (!endTimestamp) {
              endTimestamp = round.timestamp;
            }

            startTimestamp = Math.min(startTimestamp, round.timestamp);
            endTimestamp = Math.max(endTimestamp, round.timestamp);

            roundCSV += [
              (pwRowID++),
              user,
              userID,
              game,
              userGames,
              round.condition,
              round.guesses,
              round.guesses_log10,
              round.password,
              round.score,
              round.user_rating,
              round.tendency,
              round.timestamp
            ].map((col) => {
              return col.inQuote()
            }).join(',') + '\n';

          });


          function filterByCondition(game, condition) {
            if (game && 'rounds' in game && condition) {
              return game.rounds.filter(function(round) {
                return round.condition === condition;
              })
            }
          }

          var commonRounds = filterByCondition(gameObj, COMMON)
            , mangledRounds = filterByCondition(gameObj, MANGLED)
            , passphraseRounds = filterByCondition(gameObj, PASSPHRASE)
            , randomRounds = filterByCondition(gameObj, RANDOM)
            , predictableRounds = filterByCondition(gameObj, PREDICTABLE);

          var metrics = [
            {
              'key': 'tendency',
              'name': 'tendency'
            }, {
              'key': 'user_rating',
              'name': 'ratings'
            }, {
              'key': 'score',
              'name': 'scores'
            }, {
              'key': 'guesses_log10',
              'name': 'guessesLog10'
            }, {
              'key': 'guesses',
              'name': 'guesses'
            }

          ];

          var averages = {};

          metrics.forEach((metric) => {
            let key = metric.key;
            averages[metric.name] = {
              overall: Util.average(gameObj.rounds, key),
              common: Util.average(commonRounds, key),
              mangled: Util.average(mangledRounds, key),
              passphrase: Util.average(passphraseRounds, key),
              random: Util.average(randomRounds, key),
              predictable: Util.average(predictableRounds, key)
            }
          });
        }

        // we only want the ISO DATE not the time, therefore we split the string and drop the time
        endDate = (new Date(endTimestamp)).toISOString().split('T')[0];
        duration = endTimestamp - startTimestamp;

        if (score && score.total !== 0) {
          var conditionMetrics = ['overall', COMMON, MANGLED, PASSPHRASE, RANDOM, PREDICTABLE];
          var gameDataRows = [
            (gameRowID++),
            user,
            userID,
            game,
            userGames,
            endTimestamp,
            endDate,
            score.achieved,
            score.total,
            score.percent,
            commonRounds.length,
            mangledRounds.length,
            passphraseRounds.length,
            randomRounds.length,
            predictableRounds.length
          ];
          conditionMetrics.forEach((cMetric) => {
            metrics.forEach((metric) => {
              gameDataRows.push(averages[metric.name][cMetric]);
            })
          });
          gameCSV += gameDataRows.map((col) => {
            return col.inQuote()
          }).join(',') + '\n';
        }
      }
    }

    return ({
      games: gameCSV,
      rounds: roundCSV
    });

  }

  function loadData(callback, path) {
    var self = this;
    const rootKey = 'games';
    console.log('using data at ' + path);
    var data = require(path || './data/password-game-export.json')[rootKey];


    function removeKnownTestIDs(data) {
      // these are known test / developer accounts. Do not include them in the analysis.
      const knownTestIDs = [
        'uUcpou1wUBS5E9DVd556oO3dvAT2',
        'n68UIcbuD7amarUJYa73urhEmoL2',
        'jdPKqRRyulcUYgqO3lsM4cR7q6G2',
        'KJQBBl9Hy1aD845drE6r9EFoUFX2',
        'oMFBBJfoX2d6oLiLOdM7t9oDOgi2'
      ];
      knownTestIDs.forEach(function(uid) {
        delete data[uid];
      });
    }

    removeKnownTestIDs(data);

    self.data = data;
    callback(data);
  }


  function createCSVFiles(data) {
    fs.writeFileSync(path.join(__dirname, 'data', 'rounds.csv'), data.rounds);
    fs.writeFileSync(path.join(__dirname, 'data', 'games.csv'), data.games);
  }

  this.analyze = function(path) {
    console.log('PASDJO starting analysis');
    var callback = function(users) {
      var csvs = toCSV(users);
      createCSVFiles(csvs);
      console.log('PASDJO data created');
    };
    loadData(callback, path);
  }

}

var args = process.argv;
var pathToData = args.length > 2 ? path.join(__dirname, args[2]) : null;

var analyzer = new Analyzer();

analyzer.analyze(pathToData);