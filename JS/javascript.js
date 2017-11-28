var Cell = React.createClass({
    handleCellClicked: function() {
      this.props.handleCellClicked(this.props.row, this.props.col);
    },

    render: function() {
      var dim = this.props.dim;
      return (
        <rect
        width={dim} height={dim} fill={this.props.fill}
        stroke='#ccc' strokeWidth='1'
        x={dim*this.props.col} y={dim*this.props.row}
        onClick={this.handleCellClicked}>
        </rect>
      );
    }
  });

  var Board = React.createClass({
    time: new Date().getTime(),
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      var state = {
        custom:false,
        running:false,
        rows:50,
        cols:50,
        fps:1000,
        generation:0,
        //cellSize: 20,

        birth1:false,
        birth2:false,
        birth3:true,
        birth4:false,
        birth5:false,
        birth6:false,
        birth7:false,
        birth8:false,

        survival1:false,
        survival2:true,
        survival3:true,
        survival4:false,
        survival5:false,
        survival6:false,
        survival7:false,
        survival8:false
      };

      for (var row = 0 ; row < state.rows ; row ++ ) {
        for (var col = 0 ; col < state.cols; col ++ ) {
          state[[row,col]] = Math.round(Math.random());
        }
      };

      return state;
    },

    render: function() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      var boardWidth;
      var boardHeight;

      var ratio = (width * 2/3 - 40) / (height - 40);
      var boardRatio = this.state.cols / this.state.rows;
      console.log(ratio + " _ " + boardRatio);
      if (ratio > boardRatio) {
        boardHeight = height - 40;
        boardWidth = boardHeight * (this.state.cols / this.state.rows)
      } else if (ratio < boardRatio) {
        boardWidth = (width * 2 / 3) - 40;
        boardHeight = boardWidth * (this.state.rows / this.state.cols)
      } else {
        boardWidth = width * 2/3 - 40;
        boardHeight = height - 40;
      }

      var svgStyle = {
        width: boardWidth,
        height: boardHeight,
      }

      var cellLength = Math.min(boardWidth, boardHeight) / Math.min(this.state.rows, this.state.cols);

      var a = [];
      for (var row=0; row<this.state.rows; row++) {
        for (var col=0; col<this.state.cols; col++) {
          a.push(<Cell
                 dim={cellLength} col={col} row={row}
                 key={row + ',' + col}
                 fill={this.state[[row,col]] ? '#16C725': 'white'}
                 handleCellClicked={this.handleCellClicked}
                 />);
        }
      }

      return (
        <div id="game" className='gol'>
          <div id="control" className="col control">
            <h1>Game of Life (react.js)</h1>
            <h3> Generation: {this.state.generation} </h3>
            <br />
            <h3> Settings </h3>
            <p>
              Number of Rows: <input id="rows" type="range" min="1" max="100" valueLink={this.linkState('rows')}/> {this.state.rows}
            </p>
            <p>
              Number of Columns: <input id="cols" type="range" min="1" max="100" valueLink={this.linkState('cols')}/> {this.state.cols}
            </p>
            <br />
            <h3>Control</h3>
            <button id="blank" className="warning" onClick={this.blank}>clear</button>
            <button id="randomize" className="info" onClick={this.randomize}>randomize</button>
            <button id="startButton" className={this.state.running ? "danger" : "success"}  onClick={this.handleToggle}>{this.state.running ? 'Pause' : 'Play'}</button>
            <button id="stepButton" className="primary" onClick={this.step}>Step</button>
          </div>

          <svg width={svgStyle.width} height={svgStyle.height} className="col svg">
            {a}
          </svg>

        </div>
      )
    },

    birthRule: function() {
      var rule = '';
      for (var i = 1 ; i < 9 ; i ++ ) {
        if (this.state['birth' + i]) rule += String(i);
      }

      return rule;
    },

    survivalRule: function() {
      var rule = '';
      for (var i = 1 ; i < 9 ; i ++ ) {
        if (this.state['survival' + i]) rule += String(i);
      }

      return rule;
    },

    step: function(){
      this.time = new Date().getTime();
      var newState = {};
      for (var r = 0 ; r < this.state.rows ; r ++ ) {
        for (var c = 0 ; c < this.state.cols ; c ++ ) {
          if(this.checkState(this.state, r, c)) {
            newState[[r,c]] = this.state[[r,c]] ? 0 : 1;
          }
        }
      }

      this.state.generation++;
      this.setState(newState);


      var now = new Date().getTime();
      var delta = now - this.time;
      while (delta < 1000 / this.state.fps) {
        now = new Date().getTime();
        delta = now - this.time;
      }
    },

    update: function() {
      this.step();
      this.intervalID = requestAnimationFrame(this.update);
    },

    checkState: function(state, row, col) {
      var rStart = Math.max(row - 1, 0);
      var cStart = Math.max(col - 1, 0);
      var rEnd = Math.min(row + 1, this.state.rows - 1);
      var cEnd = Math.min(col + 1, this.state.cols - 1);

      var sum = 0;
      var currentState = state[[row,col]];

      for (var r = rStart ; r <= rEnd; r ++ ) {
        for (var c = cStart ; c <= cEnd ; c ++ ) {
          sum += state[[r,c]];
        }
      }

      sum -= state[[row,col]];
      var change = false;
      if (currentState == 1) {
        if (!this.state['survival' + sum]) {
          change = true;
        }
      } else if ( currentState == 0 ) {
        if (this.state['birth' + sum]) {
          change = true;
        }
      }

      return change;
    },

    blank: function() {
      var state = {};
      for (var row = 0 ; row < this.state.rows ; row ++ ) {
        for (var col = 0 ; col < this.state.cols; col ++ ) {
          state[[row,col]] = 0;
        }
      };

      state.generation = 0;
      this.setState(state);
    },

    randomize: function() {
      var state = {};
      for (var row = 0 ; row < this.state.rows ; row ++ ) {
        for (var col = 0 ; col < this.state.cols; col ++ ) {
          state[[row,col]] = Math.round(Math.random());
        }
      };

      state.generation = 0;
      this.setState(state);
    },

    handleChecked: function() {
      var newState = {};
      newState[event.target.getAttribute('data-rule')] = event.target.checked;
      this.setState(newState);
    },

    handleCellClicked: function(r, c) {
      cancelAnimationFrame(this.intervalID);
      this.state[[r,c]] = this.state[[r,c]] ? 0: 1;
      if (this.state.running) {
        this.state.running = false;
        this.forceUpdate(this.handleToggle);
      } else {
        this.forceUpdate();
      }
    },

    handleToggle: function() {
      if (this.state.running) {
        this.setState({running:false});
        cancelAnimationFrame(this.intervalID);
      } else {
        this.setState({running:true});
        this.intervalID = requestAnimationFrame(this.update);
      }
    },
  });

ReactDOM.render(
  <Board />,
  document.getElementById('content')
);
