// ================= MATCH INFO =================

let team1 = "";
let team2 = "";

let battingTeam = "";
let bowlingTeam = "";

let totalOvers = 0;

let innings = 1;

let firstInningsScore = 0;

// ================= SCORE =================

let runs = 0;
let wickets = 0;

let balls = 0;
let overs = 0;

let currentOver = [];

let overHistory = [];

let history = [];

// ================= BATSMEN =================

let batsmen = [];

let strikerIndex = 0;

let nonStrikerIndex = 1;

let nextBatsmanNumber = 3;

// ================= RULE SETTINGS =================

let countWideRuns = true;
let countNoBallRuns = true;

// ================= INNINGS SCORE STORAGE =================

let inningsData = [];

// ================= BOWLER =================

let currentBowler = {
  name:"",
  runs:0,
  wickets:0,
  balls:0
};

let bowlers = [];

// ================= SOUND =================

let batSound = new Audio("sounds/bat.mp3");

let wicketSound =
  new Audio("sounds/wicket.mp3");

let cheerSound =
  new Audio("sounds/cheer.mp3");

let noballSound =
  new Audio("sounds/noball.mp3");

let wideSound =
  new Audio("sounds/wide.mp3");

function play(sound){

  sound.currentTime = 0;

  sound.play();
}

// ================= CREATE BATSMAN =================

function createBatsman(name){

  return{
    name,
    runs:0,
    balls:0,
    fours:0,
    sixes:0,
    out:false,
    status:"not out"
  };
}

// ================= START MATCH =================

function startMatch() {

  play(cheerSound);

  team1 =
    document.getElementById("team1").value;

  team2 =
    document.getElementById("team2").value;

  totalOvers =
    Number(
      document.getElementById("totalOvers").value
    );

  let opener1 =
    document.getElementById("player1").value;

  let opener2 =
    document.getElementById("player2").value;

  countWideRuns =
    document.getElementById("wideRuns").checked;

  countNoBallRuns =
    document.getElementById("noBallRuns").checked;

  currentBowler.name =
    document.getElementById("bowlerName").value ||
    "Bowler";

  if(
    !team1 ||
    !team2 ||
    !totalOvers ||
    !opener1 ||
    !opener2
  ){

    alert("Fill all details");

    return;
  }

  battingTeam = team1;

  bowlingTeam = team2;

  document.getElementById("setupScreen")
    .classList.add("hidden");

  document.getElementById("matchScreen")
    .classList.remove("hidden");

  document.getElementById("matchTitle")
    .innerText =
    `${battingTeam} vs ${bowlingTeam}`;

  batsmen = [
    createBatsman(opener1),
    createBatsman(opener2)
  ];

  strikerIndex = 0;

  nonStrikerIndex = 1;

  nextBatsmanNumber = 3;

  updateUI();
}

// ================= UPDATE UI =================

function updateUI() {

  document.getElementById("score")
    .innerText =
    `${runs}/${wickets}`;

  document.getElementById("overs")
    .innerText =
    `${overs}.${balls} Overs`;

  // current over

  let overHTML = "";

  currentOver.forEach(ball => {

    overHTML += `<span>${ball}</span>`;
  });

  document.getElementById("currentOver")
    .innerHTML = overHTML;

  // target

  if(innings === 2){

    document.getElementById("targetText")
      .innerText =
      `Target: ${firstInningsScore + 1}`;
  }

  // batsman table

  let batsmanHTML = "";

  batsmen.forEach((player,index)=>{

    let sr =
      player.balls === 0
      ? 0
      : (
          (player.runs / player.balls) * 100
        ).toFixed(1);

    batsmanHTML += `
    
      <tr>

        <td class="${
          index === strikerIndex &&
          !player.out
          ? "striker"
          : ""
        }">

          ${player.name}

          ${
            player.out
            ? ""
            : (
                index === strikerIndex
                ? "*"
                : ""
              )
          }

        </td>

        <td>${player.runs}</td>

        <td>${player.balls}</td>

        <td>${player.fours}</td>

        <td>${player.sixes}</td>

        <td>${sr}</td>

      </tr>
    
    `;
  });

  document.getElementById("batsmanTable")
    .innerHTML = batsmanHTML;

  // ================= CURRENT RUN RATE =================

  let totalBalls =
    (overs * 6) + balls;

  let currentRR =
    totalBalls === 0
    ? 0
    : (
        (runs / totalBalls) * 6
      ).toFixed(2);

  document.getElementById("currentRR")
    .innerText =
    `CRR: ${currentRR}`;

  // ================= REQUIRED RUN RATE =================

  if(innings === 2){

    let runsNeeded =
      (firstInningsScore + 1) - runs;

    let ballsLeft =
      (totalOvers * 6) - totalBalls;

    let requiredRR =
      ballsLeft <= 0
      ? 0
      : (
          (runsNeeded / ballsLeft) * 6
        ).toFixed(2);

    document.getElementById("requiredRR")
      .innerText =
      `RRR: ${requiredRR}`;
  }

  // ================= BOWLER STATS =================

  let bowlerOvers =
    `${Math.floor(currentBowler.balls / 6)}.${currentBowler.balls % 6}`;

  document.getElementById("bowlerStats")
    .innerHTML = `

      <p>${currentBowler.name}</p>

      <p>Overs: ${bowlerOvers}</p>

      <p>Runs: ${currentBowler.runs}</p>

      <p>Wickets: ${currentBowler.wickets}</p>

    `;
}

// ================= SAVE HISTORY =================

function saveHistory(){

  history.push({

    runs,
    wickets,
    balls,
    overs,

    currentOver:[...currentOver],

    overHistory:[...overHistory],

    batsmen:JSON.parse(
      JSON.stringify(batsmen)
    ),

    bowlers:JSON.parse(
      JSON.stringify(bowlers)
    ),

    strikerIndex,
    nonStrikerIndex,
    nextBatsmanNumber,

    currentBowler:JSON.parse(
      JSON.stringify(currentBowler)
    )
  });
}

// ================= RUN =================

function addRun(run){

  play(batSound);

  saveHistory();

  runs += run;

  balls++;

  currentOver.push(run);

  let striker =
    batsmen[strikerIndex];

  striker.runs += run;

  striker.balls++;

  currentBowler.runs += run;

  currentBowler.balls++;

  if(run === 4){

    striker.fours++;

    play(cheerSound);
  }

  if(run === 6){

    striker.sixes++;

    play(cheerSound);
  }

  // strike rotate

  if(run % 2 !== 0){

    let temp = strikerIndex;

    strikerIndex = nonStrikerIndex;

    nonStrikerIndex = temp;
  }

  checkOver();

  updateUI();

  checkWinner();
}

// ================= WICKET =================

function wicket(){

  play(wicketSound);

  saveHistory();

  wickets++;

  balls++;

  currentOver.push("W");

  batsmen[strikerIndex].balls++;

  batsmen[strikerIndex].out = true;

  batsmen[strikerIndex].status =
    `b ${currentBowler.name}`;

  currentBowler.balls++;

  currentBowler.wickets++;

  // all out

  if(wickets === 10){

    updateUI();

    endInnings();

    return;
  }

  let newName =
    prompt(
      `Enter Batsman ${nextBatsmanNumber} Name`
    );

  if(!newName){

    newName =
      `Batsman ${nextBatsmanNumber}`;
  }

  batsmen.push(
    createBatsman(newName)
  );

  strikerIndex =
    batsmen.length - 1;

  nextBatsmanNumber++;

  checkOver();

  updateUI();

  checkWinner();
}

// ================= RETIRED =================

function retiredOut(){

  saveHistory();

  batsmen[strikerIndex].out = true;

  batsmen[strikerIndex].status =
    "Retired Out";

  wickets++;

  let newName =
    prompt(
      `Enter Batsman ${nextBatsmanNumber} Name`
    );

  batsmen.push(
    createBatsman(
      newName || `Batsman ${nextBatsmanNumber}`
    )
  );

  strikerIndex =
    batsmen.length - 1;

  nextBatsmanNumber++;

  updateUI();
}

// ================= WIDE =================

function wideBall(){

  play(wideSound);

  saveHistory();

  if(countWideRuns){

    runs++;

    currentBowler.runs++;
  }

  currentOver.push("WD");

  updateUI();
}

// ================= NO BALL =================

function noBall(){

  play(noballSound);

  saveHistory();

  let extraRun =
    Number(
      prompt(
        "Bat se kitne run aaye?"
      )
    ) || 0;

  runs += 1 + extraRun;

  currentBowler.runs += 1 + extraRun;

  let striker =
    batsmen[strikerIndex];

  striker.runs += extraRun;

  if(extraRun > 0){

    striker.balls++;
  }

  if(extraRun === 4){

    striker.fours++;
  }

  if(extraRun === 6){

    striker.sixes++;
  }

  currentOver.push(`NB+${extraRun}`);

  updateUI();
}

// ================= OVER =================

function checkOver(){

  if(balls === 6){

    overs++;

    overHistory.push(
      `Over ${overs}: ${currentOver.join(" ")}`
    );

    balls = 0;

    currentOver = [];

    // strike rotate

    let temp = strikerIndex;

    strikerIndex = nonStrikerIndex;

    nonStrikerIndex = temp;

    // save current bowler data

    let existingBowler =
      bowlers.find(
        b => b.name === currentBowler.name
      );

    if(existingBowler){

      existingBowler.runs += currentBowler.runs;

      existingBowler.wickets += currentBowler.wickets;

      existingBowler.balls += currentBowler.balls;

    }else{

      bowlers.push({
        ...currentBowler
      });
    }

    // new bowler

    let newBowler =
      prompt("Enter New Bowler Name");

    currentBowler = {
      name: newBowler || "Bowler",
      runs:0,
      wickets:0,
      balls:0
    };
  }

  if(overs === totalOvers){

    endInnings();
  }
}

// ================= UNDO =================

function undo(){

  if(history.length === 0)
    return;

  let last = history.pop();

  runs = last.runs;

  wickets = last.wickets;

  balls = last.balls;

  overs = last.overs;

  currentOver = last.currentOver;

  overHistory = last.overHistory;

  batsmen = last.batsmen;

  bowlers = last.bowlers;

  strikerIndex = last.strikerIndex;

  nonStrikerIndex = last.nonStrikerIndex;

  nextBatsmanNumber =
    last.nextBatsmanNumber;

  currentBowler =
    last.currentBowler;

  updateUI();
}

// ================= END INNINGS =================

function endInnings(){

  // save current bowler

  let existingBowler =
    bowlers.find(
      b => b.name === currentBowler.name
    );

  if(existingBowler){

    existingBowler.runs += currentBowler.runs;

    existingBowler.wickets += currentBowler.wickets;

    existingBowler.balls += currentBowler.balls;

  }else{

    bowlers.push({
      ...currentBowler
    });
  }

 inningsData.push({

  innings,

  team: battingTeam,

  score: `${runs}/${wickets}`,

  overs: `${overs}.${balls}`,

  batsmen: JSON.parse(
    JSON.stringify(batsmen)
  ),

  bowlers: JSON.parse(
    JSON.stringify(bowlers)
  ),

  oversList: JSON.parse(
    JSON.stringify(overHistory)
  )
});

  // first innings

  if(innings === 1){

    firstInningsScore = runs;

    innings = 2;

    battingTeam = team2;

    bowlingTeam = team1;

    runs = 0;

    wickets = 0;

    balls = 0;

    overs = 0;

    currentOver = [];

    overHistory = [];

    history = [];

    bowlers = [];

    currentBowler = {
      name:"",
      runs:0,
      wickets:0,
      balls:0
    };

    let opener1 =
      prompt(
        `${battingTeam} Opening Batsman 1`
      );

    let opener2 =
      prompt(
        `${battingTeam} Opening Batsman 2`
      );

    batsmen = [
      createBatsman(
        opener1 || "Batsman 1"
      ),

      createBatsman(
        opener2 || "Batsman 2"
      )
    ];

    strikerIndex = 0;

    nonStrikerIndex = 1;

    nextBatsmanNumber = 3;

    document.getElementById("inningText")
      .innerText = "2nd Innings";

    document.getElementById("matchTitle")
      .innerText =
      `${battingTeam} vs ${bowlingTeam}`;

    updateUI();

    return;
  }

  checkWinner(true);
}

// ================= WINNER =================

function checkWinner(force = false){

  if(innings !== 2)
    return;

  if(runs > firstInningsScore){

    setTimeout(()=>{

      alert(
        `${battingTeam} won by ${10 - wickets} wickets`
      );

      showSummary();

    },100);

    return;
  }

  if(force || overs === totalOvers){

    setTimeout(()=>{

      if(runs < firstInningsScore){

        alert(
          `${bowlingTeam} won by ${firstInningsScore - runs} runs`
        );

      }else{

        alert("Match Draw");
      }

      showSummary();

    },100);
  }
}

// ================= SUMMARY =================

function showSummary(){

  let html = "";

  inningsData.forEach((inn)=>{

    html += `

      <div class="summary-box">

        <h2>
          ${inn.team}
        </h2>

        <h3>
          ${inn.score}
          (${inn.overs} Overs)
        </h3>

        <h3>Batting</h3>

        <table>

          <tr>
            <th>Name</th>
            <th>R</th>
            <th>B</th>
            <th>4s</th>
            <th>6s</th>
            <th>Status</th>
          </tr>

    `;

    inn.batsmen.forEach(player=>{

      html += `

        <tr>

          <td>${player.name}</td>

          <td>${player.runs}</td>

          <td>${player.balls}</td>

          <td>${player.fours}</td>

          <td>${player.sixes}</td>

          <td>${player.status}</td>

        </tr>

      `;
    });

    html += `

        </table>

        <h3 style="margin-top:20px;">
          Bowling
        </h3>

        <table>

          <tr>
            <th>Name</th>
            <th>O</th>
            <th>R</th>
            <th>W</th>
          </tr>

    `;

    inn.bowlers.forEach(bowler=>{

      html += `

        <tr>

          <td>${bowler.name}</td>

          <td>
            ${Math.floor(bowler.balls / 6)}.${bowler.balls % 6}
          </td>

          <td>${bowler.runs}</td>

          <td>${bowler.wickets}</td>

        </tr>

      `;
    });

    html += `
        </table>

        <h3 style="margin-top:20px;">
          Over Summary
        </h3>

        <div style="
          text-align:left;
          margin-top:10px;
          background:#0f172a;
          padding:15px;
          border-radius:12px;
        ">

    `;

    inn.oversList.forEach(over=>{

      html += `
        <p>${over}</p>
      `;
    });

    html += `
        </div>

      </div>
    `;
  });

  document.getElementById("summaryContent")
    .innerHTML = html;

  document.getElementById("matchScreen")
    .classList.add("hidden");

  document.getElementById("summaryBox")
    .classList.remove("hidden");
}

// ================= RESET =================

function resetMatch(){

  runs = 0;

  wickets = 0;

  balls = 0;

  overs = 0;

  currentOver = [];

  overHistory = [];

  history = [];

  innings = 1;

  firstInningsScore = 0;

  inningsData = [];

  batsmen = [];

  bowlers = [];

  strikerIndex = 0;

  nonStrikerIndex = 1;

  nextBatsmanNumber = 3;

  currentBowler = {
    name:"",
    runs:0,
    wickets:0,
    balls:0
  };

  document.getElementById("setupScreen")
    .classList.remove("hidden");

  document.getElementById("matchScreen")
    .classList.add("hidden");

  document.getElementById("summaryBox")
    .classList.add("hidden");

  document.getElementById("team1").value = "";

  document.getElementById("team2").value = "";

  document.getElementById("totalOvers").value = "";

  document.getElementById("player1").value = "";

  document.getElementById("player2").value = "";

  document.getElementById("bowlerName").value = "";

  document.getElementById("inningText")
    .innerText = "1st Innings";

  document.getElementById("targetText")
    .innerText = "";

  updateUI();
}

// ================= PWA =================

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("/service-worker.js")

    .then(() => console.log("PWA Ready"))

    .catch(err => console.log(err));
}

updateUI();