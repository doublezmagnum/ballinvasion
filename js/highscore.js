<?php 
//////////////////////////////////////////////////
//
// a primitive high score manager in php
// (c) copyright 2007 javascriptgamer.com
//
// usage:
//
//    maintains a textfile containing $FILE_SIZE scores
//    returns an XML file with the top $LIST_SIZE scores
//    requires write access to $SCORE_FILE
//
//    Sanitizes incoming and outgoing data, but 
//    does NOT attempt to prevent cheating. 
//
//////////////////////////////////////////////////

$SCORE_FILE = "highscores.txt";
$FILE_SIZE = 100; // keep up to this many scores
$LIST_SIZE = 10;  // how many scores to return 

$OLD = "old";
$NEW = "new"; // marker for the new score in the list
this is not a php tutorial, but the code is very simple

It just stores the data in a text file.

// #### high scores ##############################

var SCORE_SCRIPT = 'highscores.php';


function get_scores() {
    new Ajax.Request(SCORE_SCRIPT, {
        method: 'get',
        onComplete: show_scores,
        onFailure: show_error
    });
}

var posted_scores     = false;
function post_score() {
    if (posted_scores) return; // prevent double post
    new Ajax.Request(SCORE_SCRIPT, {
        method: 'post',
        parameters: $H({
                        'name':  $F('player_name'),
                        'level': $F('player_level'),
                        'score': $F('player_score')
                    }).toQueryString(),
        onComplete: swap_scores,
        onFailure: show_error
    });
    posted_scores = true;
}


var low_high_score = 100;

function show_scores(req) {
    $('result').value = req.responseText;
    var scores = $A(req.responseXML.getElementsByTagName('score'));
    scores.each(function(node) {
        place = node.getAttribute('place');
        Element.update($('high_score_' + place), node.getAttribute('score'));
        Element.update($('high_name_' + place), node.getAttribute('name'));
        $('high_row_' + place).className = node.getAttribute('age'); // 'old' or 'new'
    });
    low_high_score = parseInt(scores[scores.length -1].getAttribute('score'));
}


function show_error(req){
    $('result').value = 'error';
}
@TODO: fix path/permission issue with scores

Fetch Current High Scores

getting the current scores

/// read /////////////////////////////////////////
$scores = array();
$fp = fopen($SCORE_FILE, "r+"); 
$fp || die("couldn't open $SCORE_FILE");

// get an exclusive lock for writing
flock($fp, LOCK_EX);

// read the entire high score list
// each line contains: ip, level, score, name
// separated by spaces (name can contain extra spaces)
while (!feof($fp)) {
  list($ip, $level, $score, $name) = split(" ", rtrim(fgets($fp)), 4);
  // skip blank lines (including last newline)
  if (! $ip) continue;
  $level = 0 + $level;
  $score = 0 + $score;
  $scores[] = array($score, $level, $name, $ip, $OLD);
}
Prevent XSS Attacks in the XML


// show //////////////////////////////////////////

// now output the score list as xml

header("content-type: text/xml"); 

echo("<scores>\n"):

$count = 0; 
foreach ($scores as $index => $data) {
  if (++$count > $GLOBALS['LIST_SIZE']) break;
  list($score, $level, $name, $ip, $age) = $data;
  // escape HTML characters in names:
  // (we don't have to escape the other fields because
  // we ensured they were numbers before writing)
  $name = htmlentities($name, ENT_QUOTES);
  echo("<score place='$count' score='$score' level='$level' name='$name' age='$age'/>\n");
}
echo("</scores>\n");
?>
Create Fake Initial Scores

127.0.0.1 1 10 alice
127.0.0.1 1 9 bob
127.0.0.1 1 8 charlie
127.0.0.1 1 7 darla
127.0.0.1 1 6 eddie
127.0.0.1 1 5 flora
127.0.0.1 1 4 gabe
127.0.0.1 1 3 hannah
127.0.0.1 1 2 ian
127.0.0.1 1 1 jamie
Prompt Player for Name on Making High Score List

var ENTER_NAME_SCREEN = Object.extend(new Screen('congrats'), {
    show : function () {
        Screen.prototype.show.call(this);
        $('player_name').focus();
    }
});
  <!-- enter your name screen -->
  <div id="congrats" class="overlay screen">
    <img src="../sprites/congrats.png" alt="congratulations!" />
  	<p>You made the High Score List! Enter Your Name!</p>
    <label>name
      <input type="text" id="player_name" name="player_name" />
      <input type="hidden" id="player_score" name="player_score" />
      <input type="hidden" id="player_level" name="player_level" />
    </label>
    <button onclick="post_score()">go</button>
  </div>
Post Name and Score to the Server


/// post /////////////////////////////////////////

// if new score is being posted
if ($_SERVER['REQUEST_METHOD'] == "POST") {

  // convert the level and score to numbers:
  $level = 0 + $_POST['level'];
  $score = 0 + $_POST['score'];
  
  // remove excess whitespace from the name 
  // (especially newlines, which would corrupt our file!)
  $name = implode(" ", preg_split("/\s+/", $_POST['name']));
  
  // now append the new score to the list
  $scores[] = array($score, $level, $name, $_SERVER['REMOTE_ADDR'], $NEW);


  // sort the merged list
  function with_high_scores_first($a, $b) {
    return -gmp_cmp($a[0], $b[0]);
  }
  usort($scores, "with_high_scores_first");
 
  // and write the list back to the file:
  fseek($fp, 0);	
  $count = 0;
  foreach ($scores as $index => $data) {
    if (++$count > $GLOBALS['FILE_SIZE']) break;
    list($score, $level, $name, $ip, $age) = $data;
    fwrite($fp, "$ip $level $score $name\n");
  }
}

// unlock and close the file
flock($fp, LOCK_UN);
fclose($fp);
Firebug Makes Cheating Easy

cheating is easy with this kind of system

>>> score_set(9999)
n game works around this problem by recording whole events

Highlight User in the High Score List

race condition on high traffic game

(user gets on high list but someone else beats him)

Show High Scores Alongside Title Screen

var SCORES_SCREEN = Object.extend(new Screen('scores'), {
    show : function () {
        Screen.prototype.show.call(this);
        gameconsole.scheduleSwap(TITLE_SCREEN);
    },
    
    keyUp : TITLE_SCREEN.keyUp
});
#scoretable {
  width: 350px;
  margin:auto;
  margin-top: 5px;
  border-collapse:collapse;
  border: solid #666 3px;
}

#scoretable td {
  padding: 2px;
  background-color:#FFFFFF;
  border:none;
  height: 20px;
  text-align: left;
}

#scoretable tr.old {
  color: inherit;
}

#scoretable tr.new {
  color: #333333;
  font-weight:bold;
}

#scoretable td.score {
  text-align: right;
}
  <!-- high score screen -->
  <div id="scores" class="overlay screen">
    <img src="../sprites/highscores.png" alt="high scores" />
    <table id="scoretable" width="100%">
    </table>
    <script type="text/javascript">
    /* <![CDATA[ */
		for (i=1; i<=5; i++) {
			$('scoretable').innerHTML += (
			   '<tr id="high_row_' + i +  '" class="old">' +
			   '<td class="name" id="high_name_' + i + '"</td>'+
			   '<td class="score" id="high_score_' + i + '"</td>'+
			   '</tr>');
		}
    /* ]]> */
    </script>
    <p class="pressenter">press <strong>enter</strong> to start</p>
  </div>
  
function swap_scores(req) {
    show_scores(req);
    ENTER_NAME_SCREEN.hide();
    gameconsole.swap(SCORES_SCREEN);
}
	gameconsole.scheduleSwap(SCORES_SCREEN);
previous: Those Other Screensnext: Potential Enhancements