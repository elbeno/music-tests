var clefs = [ 'treble', 'bass' ];

var clefNotes = { 'treble':
                  [ 'cn/4', 'c#/4',
                    'db/4', 'dn/4', 'd#/4',
                    'eb/4', 'en/4',
                    'fn/4', 'f#/4',
                    'gb/4', 'gn/4', 'g#/4',
                    'ab/4', 'an/4', 'a#/4',
                    'bb/4', 'bn/4',
                    'cn/5', 'c#/5',
                    'db/5', 'dn/5', 'd#/5',
                    'eb/5', 'en/5',
                    'fn/5', 'f#/5',
                    'gb/5', 'gn/5', 'g#/5',
                    'ab/5', 'an/5',
                    'bb/5', 'bn/5',
                    'cn/6' ],
                  'bass':
                  [ 'cn/2', 'c#/2',
                    'db/2', 'dn/2', 'd#/2',
                    'eb/2', 'en/2',
                    'fn/2', 'f#/2',
                    'gb/2', 'gn/2', 'g#/2',
                    'ab/2', 'an/2', 'a#/2',
                    'bb/2', 'bn/2',
                    'cn/3', 'c#/3',
                    'db/3', 'dn/3', 'd#/3',
                    'eb/3', 'en/3',
                    'fn/3', 'f#/3',
                    'gb/3', 'gn/3', 'g#/3',
                    'ab/3', 'an/3',
                    'bb/3', 'bn/3',
                    'cn/4' ],
                }

var notes = [];

function reset()
{
  notes = [];

  var f = document.applyTemplate('notename_tmpl');
  var html = '<table>';

  var w = 5;
  var h = 3;

  var randomNotes = [];
  for (var i = 0; i < clefNotes['treble'].length; ++i)
  {
    randomNotes[i] = i;
  }
  shuffleArray(randomNotes);

  for (var i = 0; i < h; ++i)
  {
    html += '<tr>';
    for (var j = 0; j < w; ++j)
    {
      var element = generateNote(randomNotes[i * w + j]);
      html += '<td>' + f(element) + '</td>';
      notes.push(element);
    }
    html += '</tr>';
  }

  html += '</table>';

  var results = document.getElementById('results');
  results.innerHTML = html;

  notes.forEach(render);
}

var score = 0;

function check()
{
  score = 0;
  notes.forEach(checkNote);

  var results = document.getElementById('score');
  var scoreText = 'Score: ' + score + '/' + notes.length;
  results.innerText = scoreText;
  results.textContent = scoreText;
}

function checkNote(info)
{
  var notename = document.forms[info.formname_id][info.notename_id].value;
  var modifier = document.forms[info.formname_id][info.modifier_id].value;

  if (info.note[0] == notename
      && info.note[1] == modifier)
  {
    document.getElementById(info.answer_id).innerText = '\u2713';
    document.getElementById(info.answer_id).textContent = '\u2713';
    ++score;
  }
  else
  {
    document.getElementById(info.answer_id).innerText = '\u2717';
    document.getElementById(info.answer_id).textContent = '\u2717';
  }
}

function generateNote(n)
{
  var info = {};
  info.id = 'note_' + n;
  info.canvas_id = 'canvas_' + n;
  info.formname_id = 'form_' + n;
  info.notename_id = 'notename_' + n;
  info.modifier_id = 'modifier_' + n;
  info.answer_id = 'answer_' + n;

  info.clef = randomFromArray(clefs);
  info.note = clefNotes[info.clef][n];

  return info;
}

function render(info)
{
  var canvas = document.getElementById(info.canvas_id);
  if (!canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  // clear the canvas
  clearCanvas(canvas, ctx);

  // reset the forms to plain
  document.getElementById(info.answer_id).innerText = '';
  document.getElementById(info.answer_id).textContent = '';

  // make a new vexflow renderer
  var renderer = new Vex.Flow.Renderer(
    canvas,
    Vex.Flow.Renderer.Backends.CANVAS);

  ctx = renderer.getContext();
  var stave = new Vex.Flow.Stave(10, 0, 110);

  // draw the clef
  stave.addClef(info.clef);
  stave.addKeySignature('C');
  stave.setContext(ctx).draw();

  // make the note
  var staveNote = new Vex.Flow.StaveNote({ keys: [info.note], duration: 'w', clef: info.clef });
  if (info.note[1] == '#' && info.note[2] == '#')
  {
    staveNote.addAccidental(0, new Vex.Flow.Accidental('##'));
  }
  else if (info.note[1] == '#')
  {
    staveNote.addAccidental(0, new Vex.Flow.Accidental('#'));
  }
  else if (info.note[1] == 'b' && info.note[2] == 'b')
  {
    staveNote.addAccidental(0, new Vex.Flow.Accidental('bb'));
  }
  else if (info.note[1] == 'b')
  {
    staveNote.addAccidental(0, new Vex.Flow.Accidental('b'));
  }

  // Create the notes
  var notes = [staveNote];

  // Helper function to justify and draw a 4/4 voice
  Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes);
}
