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
    , RANDOM = 'random';

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
    gameCSV += [
        'id'.inQuote(),
        'user'.inQuote(),
        'userID'.inQuote(),
        'game'.inQuote(),
        'gameIndex'.inQuote(),
        'achieved'.inQuote(),
        'total'.inQuote(),
        'percent'.inQuote(),

        // lengths / number of items
        COMMON.inQuote(),
        MANGLED.inQuote(),
        PASSPHRASE.inQuote(),
        RANDOM.inQuote(),

        // overall averages
        'overallTendency'.inQuote(),
        'overallRatings'.inQuote(),
        'overallScores'.inQuote(),
        'overallGuessesLog10'.inQuote(),
        'overallGuesses'.inQuote(),

        // common averages
        'commonTendency'.inQuote(),
        'commonRatings'.inQuote(),
        'commonScores'.inQuote(),
        'commonGuessesLog10'.inQuote(),
        'commonGuesses'.inQuote(),

        // mangled averages
        'mangledTendency'.inQuote(),
        'mangledRatings'.inQuote(),
        'mangledScores'.inQuote(),
        'mangledGuessesLog10'.inQuote(),
        'mangledGuesses'.inQuote(),

        // passphrase averages
        'passphraseTendency'.inQuote(),
        'passphraseRatings'.inQuote(),
        'passphraseScores'.inQuote(),
        'passphraseGuessesLog10'.inQuote(),
        'passphraseGuesses'.inQuote(),

        // random averages
        'randomTendency'.inQuote(),
        'randomRatings'.inQuote(),
        'randomScores'.inQuote(),
        'randomGuessesLog10'.inQuote(),
        'randomGuesses'.inQuote(),

      ].join(',') + '\n';

    roundCSV += [
        'id'.inQuote(),
        'user'.inQuote(),
        'userID'.inQuote(),
        'game'.inQuote(),
        'gameIndex'.inQuote(),
        'condition'.inQuote(),
        'guesses'.inQuote(),
        'guessesLog10'.inQuote(),
        'password'.inQuote(),
        'score'.inQuote(),
        'userRating'.inQuote(),
        'tendency'.inQuote(),
        'timestamp'.inQuote()
      ].join(',') + '\n';


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
        var score = gameObj.score;


        var duration = 0, startTimestamp, endTimestamp;

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
                (pwRowID++).inQuote(),
                user.inQuote(),
                userID.inQuote(),
                game.inQuote(),
                userGames.inQuote(),
                round.condition.inQuote(),
                round.guesses.inQuote(),
                round.guesses_log10.inQuote(),
                round.password.inQuote(),
                round.score.inQuote(),
                round.user_rating.inQuote(),
                round.tendency.inQuote(),
                round.timestamp.inQuote()
              ].join(',') + '\n';

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
            , randomRounds = filterByCondition(gameObj, RANDOM);


          var averages = {
            tendency: {
              overall: Util.average(gameObj.rounds, 'tendency'),
              common: Util.average(commonRounds, 'tendency'),
              mangled: Util.average(mangledRounds, 'tendency'),
              passphrase: Util.average(passphraseRounds, 'tendency'),
              random: Util.average(randomRounds, 'tendency')
            },
            ratings: {
              overall: Util.average(gameObj.rounds, 'user_rating'),
              common: Util.average(commonRounds, 'user_rating'),
              mangled: Util.average(mangledRounds, 'user_rating'),
              passphrase: Util.average(passphraseRounds, 'user_rating'),
              random: Util.average(randomRounds, 'user_rating')
            },
            scores: {
              overall: Util.average(gameObj.rounds, 'score'),
              common: Util.average(commonRounds, 'score'),
              mangled: Util.average(mangledRounds, 'score'),
              passphrase: Util.average(passphraseRounds, 'score'),
              random: Util.average(randomRounds, 'score')
            },
            guessesLog10: {
              overall: Util.average(gameObj.rounds, 'guesses_log10'),
              common: Util.average(commonRounds, 'guesses_log10'),
              mangled: Util.average(mangledRounds, 'guesses_log10'),
              passphrase: Util.average(passphraseRounds, 'guesses_log10'),
              random: Util.average(randomRounds, 'guesses_log10')
            },
            guesses: {
              overall: Util.average(gameObj.rounds, 'guesses'),
              common: Util.average(commonRounds, 'guesses'),
              mangled: Util.average(mangledRounds, 'guesses'),
              passphrase: Util.average(passphraseRounds, 'guesses'),
              random: Util.average(randomRounds, 'guesses')
            }
          };
        }

        duration = endTimestamp - startTimestamp;

        if (score && score.total !== 0) {

          gameCSV += [
              (gameRowID++).inQuote(),
              user.inQuote(),
              userID.inQuote(),
              game.inQuote(),
              userGames.inQuote(),
              score.achieved.inQuote(),
              score.total.inQuote(),
              score.percent.inQuote(),

              commonRounds.length.inQuote(),
              mangledRounds.length.inQuote(),
              passphraseRounds.length.inQuote(),
              randomRounds.length.inQuote(),

              // overall
              averages.tendency.overall.inQuote(),
              averages.ratings.overall.inQuote(),
              averages.scores.overall.inQuote(),
              averages.guessesLog10.overall.inQuote(),
              averages.guesses.overall.inQuote(),

              // common
              averages.tendency.common.inQuote(),
              averages.ratings.common.inQuote(),
              averages.scores.common.inQuote(),
              averages.guessesLog10.common.inQuote(),
              averages.guesses.common.inQuote(),

              // mangled
              averages.tendency.mangled.inQuote(),
              averages.ratings.mangled.inQuote(),
              averages.scores.mangled.inQuote(),
              averages.guessesLog10.mangled.inQuote(),
              averages.guesses.mangled.inQuote(),

              // passphrases
              averages.tendency.passphrase.inQuote(),
              averages.ratings.passphrase.inQuote(),
              averages.scores.passphrase.inQuote(),
              averages.guessesLog10.passphrase.inQuote(),
              averages.guesses.passphrase.inQuote(),

              // random
              averages.tendency.random.inQuote(),
              averages.ratings.random.inQuote(),
              averages.scores.random.inQuote(),
              averages.guessesLog10.random.inQuote(),
              averages.guesses.random.inQuote()

            ].join(',') + '\n';
        }

      }
    }


    return ({
      games: gameCSV,
      rounds: roundCSV
    });

  }

  function loadData(callback) {
    var self = this;
    const rootKey = 'games';
    var data = require('./data/password-game-export.json')[rootKey];


    function removeKnownTestIDs(data) {
      // these are known test / developer accounts. Do not include them in the analysis.
      const knownTestIDs = [
        'uUcpou1wUBS5E9DVd556oO3dvAT2',
        'n68UIcbuD7amarUJYa73urhEmoL2',
        'jdPKqRRyulcUYgqO3lsM4cR7q6G2',
        'KJQBBl9Hy1aD845drE6r9EFoUFX2'
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

  this.analyze = function() {
    console.log('PASDJO starting analysis');
    loadData(function(users) {
      var csvs = toCSV(users);
      createCSVFiles(csvs);
      console.log('PASDJO data created');
    });
  }

}

var analyzer = new Analyzer();
analyzer.analyze();