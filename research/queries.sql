# this query gives you only those v1 players who played multiple times:
SELECT * from `pasdjo-games-2` WHERE timestamp <= 1510876800000 AND `user` IN
    (SELECT multipleV1Users.user from
        (SELECT user, COUNT(user) as c from `pasdjo-games-2` GROUP BY user having c > 1) as multipleV1Users);

# finding users who have rated all four basic conditions in their first game.
SELECT DISTINCT user FROM `pasdjo-games-2` where common > 0 and mangled > 0 and passphrase > 0 and random > 0 and gameIndex = 1;




# the following queries create views from the dataset:




### using the views we can retrieve detailed information.
### pasdjo-v1-longform:
select `research`.`pasdjo-rounds-2`.`user` AS `user`,`research`.`pasdjo-rounds-2`.`condition` AS `condition`,`research`.`pasdjo-rounds-2`.`gameIndex` AS `gameIndex`,avg(`research`.`pasdjo-rounds-2`.`tendency`) AS `tendency`,avg(`research`.`pasdjo-rounds-2`.`guessesLog10`) AS `guessesLog10`,avg(`research`.`pasdjo-rounds-2`.`guesses`) AS `guesses`,avg(`research`.`pasdjo-rounds-2`.`score`) AS `score`,avg(`research`.`pasdjo-rounds-2`.`userRating`) AS `userRating`,max(date_format(from_unixtime((`research`.`pasdjo-rounds-2`.`timestamp` / 1000)),'%e %b %Y')) AS `timestamp` from `research`.`pasdjo-rounds-2` where (`research`.`pasdjo-rounds-2`.`timestamp` <= 1510009200000) group by `research`.`pasdjo-rounds-2`.`condition`,`research`.`pasdjo-rounds-2`.`user`,`research`.`pasdjo-rounds-2`.`gameIndex` order by `research`.`pasdjo-rounds-2`.`user`,`research`.`pasdjo-rounds-2`.`gameIndex`,`research`.`pasdjo-rounds-2`.`condition`

#### pasdjo-v1-longform-firstgame
select `pasdjo-v1-longform`.`user` AS `user`,`pasdjo-v1-longform`.`condition` AS `condition`,`pasdjo-v1-longform`.`gameIndex` AS `gameIndex`,`pasdjo-v1-longform`.`tendency` AS `tendency`,`pasdjo-v1-longform`.`guessesLog10` AS `guessesLog10`,`pasdjo-v1-longform`.`guesses` AS `guesses`,`pasdjo-v1-longform`.`score` AS `score`,`pasdjo-v1-longform`.`userRating` AS `userRating`,`pasdjo-v1-longform`.`timestamp` AS `timestamp` from `research`.`pasdjo-v1-longform` where (`pasdjo-v1-longform`.`gameIndex` = 1)

### pasdjo-v1-multigames
select `research`.`pasdjo-games-2`.`id` AS `id`,`research`.`pasdjo-games-2`.`user` AS `user`,`research`.`pasdjo-games-2`.`userID` AS `userID`,`research`.`pasdjo-games-2`.`game` AS `game`,`research`.`pasdjo-games-2`.`gameIndex` AS `gameIndex`,`research`.`pasdjo-games-2`.`timestamp` AS `timestamp`,`research`.`pasdjo-games-2`.`isodate` AS `isodate`,`research`.`pasdjo-games-2`.`achieved` AS `achieved`,`research`.`pasdjo-games-2`.`total` AS `total`,`research`.`pasdjo-games-2`.`percent` AS `percent`,`research`.`pasdjo-games-2`.`common` AS `common`,`research`.`pasdjo-games-2`.`mangled` AS `mangled`,`research`.`pasdjo-games-2`.`passphrase` AS `passphrase`,`research`.`pasdjo-games-2`.`random` AS `random`,`research`.`pasdjo-games-2`.`predictable` AS `predictable`,`research`.`pasdjo-games-2`.`overallTendency` AS `overallTendency`,`research`.`pasdjo-games-2`.`overallRatings` AS `overallRatings`,`research`.`pasdjo-games-2`.`overallScores` AS `overallScores`,`research`.`pasdjo-games-2`.`overallGuessesLog10` AS `overallGuessesLog10`,`research`.`pasdjo-games-2`.`overallGuesses` AS `overallGuesses`,`research`.`pasdjo-games-2`.`commonTendency` AS `commonTendency`,`research`.`pasdjo-games-2`.`commonRatings` AS `commonRatings`,`research`.`pasdjo-games-2`.`commonScores` AS `commonScores`,`research`.`pasdjo-games-2`.`commonGuessesLog10` AS `commonGuessesLog10`,`research`.`pasdjo-games-2`.`commonGuesses` AS `commonGuesses`,`research`.`pasdjo-games-2`.`mangledTendency` AS `mangledTendency`,`research`.`pasdjo-games-2`.`mangledRatings` AS `mangledRatings`,`research`.`pasdjo-games-2`.`mangledScores` AS `mangledScores`,`research`.`pasdjo-games-2`.`mangledGuessesLog10` AS `mangledGuessesLog10`,`research`.`pasdjo-games-2`.`mangledGuesses` AS `mangledGuesses`,`research`.`pasdjo-games-2`.`passphraseTendency` AS `passphraseTendency`,`research`.`pasdjo-games-2`.`passphraseRatings` AS `passphraseRatings`,`research`.`pasdjo-games-2`.`passphraseScores` AS `passphraseScores`,`research`.`pasdjo-games-2`.`passphraseGuessesLog10` AS `passphraseGuessesLog10`,`research`.`pasdjo-games-2`.`passphraseGuesses` AS `passphraseGuesses`,`research`.`pasdjo-games-2`.`randomTendency` AS `randomTendency`,`research`.`pasdjo-games-2`.`randomRatings` AS `randomRatings`,`research`.`pasdjo-games-2`.`randomScores` AS `randomScores`,`research`.`pasdjo-games-2`.`randomGuessesLog10` AS `randomGuessesLog10`,`research`.`pasdjo-games-2`.`randomGuesses` AS `randomGuesses`,`research`.`pasdjo-games-2`.`predictableTendency` AS `predictableTendency`,`research`.`pasdjo-games-2`.`predictableRatings` AS `predictableRatings`,`research`.`pasdjo-games-2`.`predictableScores` AS `predictableScores`,`research`.`pasdjo-games-2`.`predictableGuessesLog10` AS `predictableGuessesLog10`,`research`.`pasdjo-games-2`.`predictableGuesses` AS `predictableGuesses` from `research`.`pasdjo-games-2` where ((`research`.`pasdjo-games-2`.`timestamp` <= 1510876800000) and `research`.`pasdjo-games-2`.`user` in (select `multiplev1users`.`user` from (select `research`.`pasdjo-games-2`.`user` AS `user`,count(`research`.`pasdjo-games-2`.`user`) AS `c` from `research`.`pasdjo-games-2` where strcmp(`research`.`pasdjo-games-2`.`isodate`,'2017-11-17') group by `research`.`pasdjo-games-2`.`user` having (`c` > 1)) `multipleV1Users`)) order by `research`.`pasdjo-games-2`.`isodate` desc

### pasdjo-v1-users-allconditions
select distinct `research`.`pasdjo-games-2`.`user` AS `user` from `research`.`pasdjo-games-2` where ((`research`.`pasdjo-games-2`.`common` > 0) and (`research`.`pasdjo-games-2`.`mangled` > 0) and (`research`.`pasdjo-games-2`.`passphrase` > 0) and (`research`.`pasdjo-games-2`.`random` > 0) and (`research`.`pasdjo-games-2`.`gameIndex` = 1))


### pasdjo-v2-longform
select `research`.`pasdjo-rounds-2`.`user` AS `user`,`research`.`pasdjo-rounds-2`.`condition` AS `condition`,`research`.`pasdjo-rounds-2`.`gameIndex` AS `gameIndex`,avg(`research`.`pasdjo-rounds-2`.`tendency`) AS `tendency`,avg(`research`.`pasdjo-rounds-2`.`guessesLog10`) AS `guessesLog10`,avg(`research`.`pasdjo-rounds-2`.`guesses`) AS `guesses`,avg(`research`.`pasdjo-rounds-2`.`score`) AS `score`,avg(`research`.`pasdjo-rounds-2`.`userRating`) AS `userRating`,max(date_format(from_unixtime((`research`.`pasdjo-rounds-2`.`timestamp` / 1000)),'%e %b %Y')) AS `timestamp` from `research`.`pasdjo-rounds-2` where (`research`.`pasdjo-rounds-2`.`timestamp` > 1510009200000) group by `research`.`pasdjo-rounds-2`.`condition`,`research`.`pasdjo-rounds-2`.`user`,`research`.`pasdjo-rounds-2`.`gameIndex` order by `research`.`pasdjo-rounds-2`.`user`,`research`.`pasdjo-rounds-2`.`gameIndex`,`research`.`pasdjo-rounds-2`.`condition`

### pasdjo-v2-longform-firstgame
select `pasdjo-v2-longform`.`user` AS `user`,`pasdjo-v2-longform`.`condition` AS `condition`,`pasdjo-v2-longform`.`gameIndex` AS `gameIndex`,`pasdjo-v2-longform`.`tendency` AS `tendency`,`pasdjo-v2-longform`.`guessesLog10` AS `guessesLog10`,`pasdjo-v2-longform`.`guesses` AS `guesses`,`pasdjo-v2-longform`.`score` AS `score`,`pasdjo-v2-longform`.`userRating` AS `userRating`,`pasdjo-v2-longform`.`timestamp` AS `timestamp` from `research`.`pasdjo-v2-longform` where (`pasdjo-v2-longform`.`gameIndex` = 1)

### pasdjo-v2-users-allconditions
select distinct `research`.`pasdjo-games-2`.`user` AS `user` from `research`.`pasdjo-games-2` where ((`research`.`pasdjo-games-2`.`common` > 0) and (`research`.`pasdjo-games-2`.`mangled` > 0) and (`research`.`pasdjo-games-2`.`passphrase` > 0) and (`research`.`pasdjo-games-2`.`random` > 0) and (`research`.`pasdjo-games-2`.`gameIndex` = 1) and (`research`.`pasdjo-games-2`.`predictable` > 0))


#### pasdjo-v2-multigames
select `research`.`pasdjo-games-2`.`id` AS `id`,`research`.`pasdjo-games-2`.`user` AS `user`,`research`.`pasdjo-games-2`.`userID` AS `userID`,`research`.`pasdjo-games-2`.`game` AS `game`,`research`.`pasdjo-games-2`.`gameIndex` AS `gameIndex`,`research`.`pasdjo-games-2`.`timestamp` AS `timestamp`,`research`.`pasdjo-games-2`.`isodate` AS `isodate`,`research`.`pasdjo-games-2`.`achieved` AS `achieved`,`research`.`pasdjo-games-2`.`total` AS `total`,`research`.`pasdjo-games-2`.`percent` AS `percent`,`research`.`pasdjo-games-2`.`common` AS `common`,`research`.`pasdjo-games-2`.`mangled` AS `mangled`,`research`.`pasdjo-games-2`.`passphrase` AS `passphrase`,`research`.`pasdjo-games-2`.`random` AS `random`,`research`.`pasdjo-games-2`.`predictable` AS `predictable`,`research`.`pasdjo-games-2`.`overallTendency` AS `overallTendency`,`research`.`pasdjo-games-2`.`overallRatings` AS `overallRatings`,`research`.`pasdjo-games-2`.`overallScores` AS `overallScores`,`research`.`pasdjo-games-2`.`overallGuessesLog10` AS `overallGuessesLog10`,`research`.`pasdjo-games-2`.`overallGuesses` AS `overallGuesses`,`research`.`pasdjo-games-2`.`commonTendency` AS `commonTendency`,`research`.`pasdjo-games-2`.`commonRatings` AS `commonRatings`,`research`.`pasdjo-games-2`.`commonScores` AS `commonScores`,`research`.`pasdjo-games-2`.`commonGuessesLog10` AS `commonGuessesLog10`,`research`.`pasdjo-games-2`.`commonGuesses` AS `commonGuesses`,`research`.`pasdjo-games-2`.`mangledTendency` AS `mangledTendency`,`research`.`pasdjo-games-2`.`mangledRatings` AS `mangledRatings`,`research`.`pasdjo-games-2`.`mangledScores` AS `mangledScores`,`research`.`pasdjo-games-2`.`mangledGuessesLog10` AS `mangledGuessesLog10`,`research`.`pasdjo-games-2`.`mangledGuesses` AS `mangledGuesses`,`research`.`pasdjo-games-2`.`passphraseTendency` AS `passphraseTendency`,`research`.`pasdjo-games-2`.`passphraseRatings` AS `passphraseRatings`,`research`.`pasdjo-games-2`.`passphraseScores` AS `passphraseScores`,`research`.`pasdjo-games-2`.`passphraseGuessesLog10` AS `passphraseGuessesLog10`,`research`.`pasdjo-games-2`.`passphraseGuesses` AS `passphraseGuesses`,`research`.`pasdjo-games-2`.`randomTendency` AS `randomTendency`,`research`.`pasdjo-games-2`.`randomRatings` AS `randomRatings`,`research`.`pasdjo-games-2`.`randomScores` AS `randomScores`,`research`.`pasdjo-games-2`.`randomGuessesLog10` AS `randomGuessesLog10`,`research`.`pasdjo-games-2`.`randomGuesses` AS `randomGuesses`,`research`.`pasdjo-games-2`.`predictableTendency` AS `predictableTendency`,`research`.`pasdjo-games-2`.`predictableRatings` AS `predictableRatings`,`research`.`pasdjo-games-2`.`predictableScores` AS `predictableScores`,`research`.`pasdjo-games-2`.`predictableGuessesLog10` AS `predictableGuessesLog10`,`research`.`pasdjo-games-2`.`predictableGuesses` AS `predictableGuesses` from `research`.`pasdjo-games-2` where ((`research`.`pasdjo-games-2`.`timestamp` > 1510009200000) and `research`.`pasdjo-games-2`.`user` in (select `multiplev1users`.`user` from (select `research`.`pasdjo-games-2`.`user` AS `user`,count(`research`.`pasdjo-games-2`.`user`) AS `c` from `research`.`pasdjo-games-2` group by `research`.`pasdjo-games-2`.`user` having (`c` > 1)) `multipleV1Users`))

SELECT data.*, multipleUsers.* FROM `pasdjo-v1-longform` as data, `pasdjo-v1-mutiple-players-games` as multipleUsers where data.user = multipleUsers.user


SELECT * FROM `pasdjo-v1-longform` WHERE user in (SELECT user from `pasdjo-v1-mutiple-players-games`) ORDER BY `user`, `condition`, `gameIndex`

# similar effect but only for the first game with full
SELECT * from `pasdjo-v1-longform` INNER JOIN `pasdjo-v1-users-allconditions-firstgame` on `pasdjo-v1-longform`.user = `pasdjo-v1-users-allconditions-firstgame`.user WHERE `pasdjo-v1-longform`.`gameIndex` = 1


SELECT * FROM `pasdjo-v1-longform-firstgame` WHERE `user` IN (SELECT user from `pasdjo-v1-mutiple-players-games`) ORDER BY `user`, `condition`, `gameIndex`


# average scores of passphrases of different length:
SELECT ANY_VALUE(`password`), COUNT(*) as num, CHAR_LENGTH(`password`) as strlen, AVG(score) as aScore FROM `pasdjo-rounds-2` WHERE `condition`='passphrase' GROUP BY strlen