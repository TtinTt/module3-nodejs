// const teams  = {
//   NFL: [
//     "ARIZONA CARDINALS",
//     "ATLANTA FALCONS",
//     "BUFFALO BILLS",
//     "CAROLINA PANTHERS",
//     "CHICAGO BEARS",
//     "CLEVELAND BROWN",
//     "CINCINNATI BENGALS",
//     "DALLAS COWBOYS",
//     "DENVER BRONCOS",
//     "DETROIT LIONS",
//     "GREEN BAY PACKERS",
//     "HOUSTON TEXANS",
//     "INDIANAPOLIS COLTS",
//     "JACKSONVILLE JAGUARS",
//     "KANSAS CITY CHIEFS",
//     "LAS VEGAS RAIDERS",
//     "LOS ANGELES CHARGERS",
//     "LOS ANGELES RAMS",
//     "MIAMI DOLPHINS",
//     "MINNESOTA VIKINGS",
//     "NEW ENGLAND PATRIOTS",
//     "NEW ORLEANS SAINTS",
//     "NEW YORK GIANTS",
//     "NEW YORK JETS",
//     "PHILADELPHIA EAGLES",
//     "PITTSBURGH STEELERS",
//     "SAN FRANCISCO 49ERS",
//     "SEATTLE SEAHAWKS",
//     "TAMPA BAY BUCCANEERS",
//     "TENNESSEE TITANS",
//     "WASHINGTON COMMANDERS",
//   ],
//   NBA: [
//     "ATLANTA HAWKS",
//     "BOSTON CELTICS",
//     "BROOKLYN NETS",
//     "CHARLOTTE HORNETS",
//     "CHICAGO BULLS",
//     "CLEVELAND CAVALIERS",
//     "DALLAS MAVERICKS",
//     "DENVER NUGGETS",
//     "DETROIT PISTONS",
//     "GOLDEN STATE WARRIORS",
//     "HOUSTON ROCKETS",
//     "INDIANA PACERS",
//     "LA CLIPPERS",
//     "LOS ANGELES LAKERS",
//     "MEMPHIS GRIZZLIES",
//     "MIAMI HEAT",
//     "MILWAUKEE BUCKS",
//     "MINNESOTA TIMBERWOLVES",
//     "NEW ORLEANS PELICANS",
//     "NEW YORK KNICKS",
//     "OKLAHOMA CITY THUNDER",
//     "ORLANDO MAGIC",
//     "PHILADELPHIA 76ERS",
//     "PHOENIX SUNS",
//     "PORTLAND TRAIL BLAZERS",
//     "SACRAMENTO KINGS",
//     "SAN ANTONIO SPURS",
//     "TORONTO RAPTORS",
//     "UTAH JAZZ",
//     "WASHINGTON WIZARDS",
//   ],
//   MLB: [
//     "ARIZONA DIAMONDBACKS",
//     "ATLANTA BRAVES",
//     "BALTIMORE ORIOLES",
//     "BOSTON RED SOX",
//     "CHICAGO CUBS",
//     "CHICAGO WHITE SOX",
//     "CINCINNATI REDS",
//     "CLEVELAND GUARDIANS",
//     "COLORADO ROCKIES",
//     "DETROIT TIGERS",
//     "HOUSTON ASTROS",
//     "KANSAS CITY ROYALS",
//     "LOS ANGELES ANGELS",
//     "LOS ANGELES DODGERS",
//     "MIAMI MARLINS",
//     "MILWAUKEE BREWERS",
//     "MINNESOTA TWINS",
//     "NEW YORK METS",
//     "NEW YORK YANKEES",
//     "OAKLAND ATHLETICS",
//     "PHILADELPHIA PHILLIES",
//     "PITTSBURGH PIRATES",
//     "SAN DIEGO PADRES",
//     "SAN FRANCISCO GIANTS",
//     "SEATTLE MARINERS",
//     "ST. LOUIS CARDINALS",
//     "TAMPA BAY RAYS",
//     "TEXAS RANGERS",
//     "TORONTO BLUE JAYS",
//     "WASHINGTON NATIONALS",
//   ],
//   NHL: [
//     "ANAHEIM DUCKS",
//     "ARIZONA COYOTES",
//     "BOSTON BRUINS",
//     "BUFFALO SABRES",
//     "CALGARY FLAMES",
//     "CAROLINA HURRICANES",
//     "CHICAGO BLACKHAWKS",
//     "COLORADO AVALANCHE",
//     "COLUMBUS BLUE JACKETS",
//     "DALLAS STARS",
//     "DETROIT RED WINGS",
//     "EDMONTON OILERS",
//     "FLORIDA PANTHERS",
//     "LOS ANGELES KINGS",
//     "MINNESOTA WILD",
//     "NASHVILLE PREDATORS",
//     "NEW JERSEY DEVILS",
//     "NEW YORK ISLANDERS",
//     "NEW YORK RANGERS",
//     "OTTAWA SENATORS",
//     "PHILADELPHIA FLYERS",
//     "PITTSBURGH PENGUINS",
//     "SAN JOSE SHARKS",
//     "SEATTLE KRAKEN",
//     "ST. LOUIS BLUES",
//     "TAMPA BAY LIGHTNING",
//     "TORONTO MAPLE LEAFS",
//     "VANCOUVER CANUCKS",
//     "VEGAS GOLDEN KNIGHTS",
//     "WASHINGTON CAPITALS",
//     "WINNIPEG JETS",
//   ],
// };

// // Sort teams in each league by name length, descending
// for (let league in teams) {
//     teams[league].sort((a, b) => b.length - a.length);
//   }

//   function getTeamAndLeague(str) {
//     str = str.toUpperCase();

//     // Check if string contains team name
//     for (let league in teams) {
//       for (let team of teams[league]) {
//         if (str.includes(team)) {
//           return { team: team, league: league };
//         }
//       }
//     }

//     // If no team name found, check if string contains league name
//     for (let league in teams) {
//       if (str.includes(league)) {
//         return { team: null, league: league };
//       }
//     }

//     // If no team or league name found, return null
//     return null;
//   }
