import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let cname = props.highlight ? "square hl" : "square";
    return (
        <button className={cname} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, winnerHighlight) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} 
            highlight={winnerHighlight} />;
    }

    render() {
        let board = [];
        for(let r=0; r<3; r++){
            let row = [];
            for(let c=0; c<3; c++){
                let unfoldIdx = r+c*3;
                let highlight = (this.props.winnerSq ? this.props.winnerSq.includes(unfoldIdx) : false);
                row.push(this.renderSquare(unfoldIdx, highlight));
            }
            board.push(<div key={r} className="board-row">{row}</div>);
        }
        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                movePos: ""
            }],
            stepNumber: 0,
            xIsNext: true,
            ascSort: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ 
            history: history.concat([{
                squares: squares,
                movePos: "("+(i%3)+","+Math.floor(i/3)+")",
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggleOrder(){
        this.setState({
            ascSort: !this.state.ascSort,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " " + step.movePos :
                'Go to game start';
            let bold = (move === this.state.stepNumber ? 'bold' : '');
            return (
                <li key={move}>
                    <button className={bold} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        if(!this.state.ascSort) moves.reverse();

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            if(this.state.stepNumber === 9){
                status = 'DRAW!!!';
            }else{
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerSq={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
                <button onClick={() => this.toggleOrder()}>Change order</button>
            </div>
        );
    }
}


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
