
var cell = React.createClass({
  handleCellClicked: function() {
    this.props.hanndleCellClicked(this.props.row, this.props.col);
  },
  render: function() {
    var dim = this.props.dim;
    return (
      <rect
        width={dim} height={dim} fill={this.props.fill}
        stroke='#ccc' strokeWidth='1'
        x={dim*this.props.col} y={dim*this.props.row}
        onClick={this.handleCellClicked}
        ></rect>
    );
  }
})

var Board = React.createClass({
  time: new Date().getTime(),
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    var state = {
      custom:false,
      running: false,
      rows:50,
      cols:50,
      fps:1000,
      //cellSize: 20

      birth1:false,
      birth2:false,
      birth3:false,
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
        for(var row=0;row<state.rows;row++){
          for(var col=0; col<state.cols;col++){
            state[[row,col]]= Math.round(Math.random());
          }
        };
        return state;
  },
      render: function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var boardWidth;
        var boardHeight;

        var ratio = (width*2/3-40)/(height -40);
        var boardRatio = this.state.cols/this.state.rows;\
        console.log(ratio+ "_"+boardRatio);
        if(ratio> boardRatio) {
          boardHeight = height - 40;
          boardWidth = boardHeight*(this.state.cols/this.state.rows)
        }else if(ratio < boardRatio) {
          boardWidth = (width*2/3)-40;
          boardHeight = boardWidth*(this.state.rows / this.state.cols)
        }else {
          boardWidth = width*2/3-40;
          boardHeight = height -40;
        }
        var svgStyle = {
          width: boardWidth,
          height: boardHeight,
        }
      }
});

ReactDOM.render(
  <Board />,
  document.getElementById('content')
);
