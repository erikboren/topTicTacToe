/*jshint esversion: 6 */
const screenBoard = document.querySelector(".screenBoard");
const gameInfo = document.querySelector(".gameInfo");

const playerFactory = (marker,isBot,playerID) =>{
    
    this.marker = marker;

    this.playerID = playerID;

    this.isWinner = false;

    const play = function(xCord,yCord){
       board.placeMarker(xCord,yCord,this);
    };

    return{marker, isWinner, play, playerID};
};

const fieldFactory = (xCord,yCord) =>{
    this.status = null;
    
   const cord = [xCord,yCord];

    const playField = function(player){
        if (status != null){
            this.status = player.marker;
            return true;
        } else {
            return false;
        }
    };

    return {status, cord, playField};

};

const screenFieldFactory = (xCord,yCord) =>{
    var element = document.createElement('div');
    element.classList.add('screenField');
    element.onclick = function(){
        element.textContent = players[activePlayer].marker;
        players[activePlayer].play(xCord,yCord);
        
    };
    return  {element};
};


const players = [];
players[0] = playerFactory('x',false,0);
players[1] = playerFactory('o',false,1);

const board = (function(){
    let fieldArray =  Array.from(Array(3), () => new Array(3));
    let markerArray = Array.from(Array(3), () => new Array(3));
    
    
    for(i=0;i<3;i++){
        for(k=0; k<3; k++){
            var field = fieldFactory(i,k);
            fieldArray[i][k] = field;
            markerArray[i][k] = field.status;
        }
    }

    const placeMarker = function(xCord,yCord,player){
        fieldArray[xCord][yCord].playField(player);
        activePlayer = changePlayer(player);
        var win = checkWin(player);
        win[0] == true ? screenController.displayWinner(player.playerID): screenController.displayPlayerTurn() ;
        return;
    };

    const checkWin = function(player){
        const possibleWins = [
            [[0,0],[1,1],[2,2]],
            [[2,0],[1,1],[0,2]],
            [[0,0],[1,0],[2,0]],
            [[0,1],[1,1],[2,1]],
            [[0,2],[1,2],[2,2]],
            [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]],
            [[2,0],[2,1],[2,2]]
        ];

        for(i=0; i<8;i++){
            var fields = [];
            for(k=0; k<3;k++){
                fields[k] = fieldArray[possibleWins[i][k][0]][possibleWins[i][k][1]].status;
            }
            if(fields[2] == fields[1] && fields[2] == fields[0] && fields[2] == player.marker){
                player.isWinner = true;
                return [true,player];
                
            } else{
                } 
        }
        return [false,null];
        

    };

    const changePlayer = function(player){
        return player.playerID == 0 ? 1 : 0;
    };
    const printMArray = () => {
        console.table(markerArray);
    };

    const printArray = ()=> console.table(fieldArray);

    return {printArray, fieldArray, placeMarker, printMArray, markerArray, checkWin};

})();

const screenController = (function(){
    
    const display = function(){
        screenBoard.innerHTML = '';
        for(i=0;i<3;i++){
        for(k=0; k<3; k++){
           screenBoard.appendChild(screenFieldFactory(i,k).element); 
            }
        }
    };

    const displayPlayerTurn = function(){
        const displayPlayer = activePlayer+1;
        gameInfo.textContent = "Player " + displayPlayer +"'s turn";
    };
    const displayWinner = function(playerID){
        gameInfo.textContent = 'Player ' + playerID + ' wins!';
    };


    const update = function(){
        display();
        displayPlayerTurn();
    };

    return {update, displayPlayerTurn, displayWinner};
})();



var activePlayer = 0;

screenController.update();

board.printMArray();

board.printArray();
