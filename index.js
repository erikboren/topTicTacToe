/*jshint esversion: 6 */
const screenBoard = document.querySelector(".screenBoard");
const gameInfo = document.querySelector(".gameInfo");
const gameInfoText = document.getElementById("gameInfoText");

const playerFactory = (marker,isBot,playerID,name) =>{
    
    this.marker = marker;

    this.playerID = playerID;

    this.isWinner = false;
    
    this.name = name;

    const play = function(xCord,yCord){
        board.placeMarker(xCord,yCord,this);
    };

    return{marker, isWinner, play, playerID, name};
};

const fieldFactory = (xCord,yCord) =>{
    this.status = null;
   const cord = [xCord,yCord];

    const playField = function(player){
        this.status = player.marker;
    };

    return {status, cord, playField};

};

const screenFieldFactory = (xCord,yCord) =>{
    var element = document.createElement('div');
    
    element.classList.add('screenField');
    
    const cordSum = xCord+yCord+1;
    
    if(cordSum % 2 == 1){
        element.classList.add("oddField");
    } else{
        element.classList.add("evenField");
    }
    
    element.onclick = function(){
        players[gameController.activePlayer].play(xCord,yCord);
    };
    return  {element};
};

const board = (function(){
    let fieldArray =  Array.from(Array(3), () => new Array(3));
    
    
    for(i=0;i<3;i++){
        for(k=0; k<3; k++){
            var field = fieldFactory(i,k);
            fieldArray[i][k] = field;
        }
    }

    const placeMarker = function(xCord,yCord,player){
        if(fieldArray[xCord][yCord].status == 'null'){
            fieldArray[xCord][yCord].playField(player);
            gameController.postRound(player);
            screenController.updateField(xCord,yCord);
        } else{
            console.log('bajs deluze');
        }
        return;
    };


    const printArray = ()=> console.table(fieldArray);

    return {printArray, fieldArray, placeMarker};

})();

const screenController = (function(){
    var screenFieldArray = Array.from(Array(3), () => new Array(3));
    const display = function(){
        screenBoard.innerHTML = '';
        for(i=0;i<3;i++){
        for(k=0; k<3; k++){
            screenFieldArray[i][k] = screenFieldFactory(i,k).element;
           screenBoard.appendChild(screenFieldArray[i][k]); 
            }
        }
    };

    const displayPlayerTurn = function(name){
        
        gameInfoText.textContent = name +"'s turn" ;
    };
    const displayWinner = function(name){
        gameInfoText.textContent = name+ ' wins!';
    };


    const update = function(name){
        display();
        displayPlayerTurn(name);
    };

    const updateField = function(xCord,yCord){
        screenFieldArray[xCord][yCord].textContent = board.fieldArray[xCord][yCord].status;
        screenBoard.innerHTML = '';
        for(i=0;i<3;i++){
            for(k=0; k<3; k++){
               screenBoard.appendChild(screenFieldArray[i][k]); 
                }
            }
    };

    return {update, displayPlayerTurn, displayWinner, updateField};
})();

const gameController = (function(){
    this.players = [];
    const createPlayers = function(names){  
        players[0] = playerFactory('x',false,0,names[0]);
        players[1] = playerFactory('o',false,1,names[1]);
    };

    const checkWin = function(marker,fieldArray){
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
            if(fields[2] == fields[1] && fields[2] == fields[0] && fields[2] == marker){
                return [true,marker];
                
            } else{
                } 
        }
        return [false,null];
        

    };
    var activePlayer = 0; 
    
    const postRound = function(){
        if(checkWin(players[activePlayer].marker,board.fieldArray)[0] == true){
            screenController.displayWinner(players[activePlayer].name);
        } 
        else
        {
            activePlayer = activePlayer == 0 ? 1 : 0;
            this.activePlayer = activePlayer;
            screenController.displayPlayerTurn(players[activePlayer].name);
        }
    };

    const setupGame = function(mode,names){
        createPlayers(names);
        screenController.update(players[activePlayer].name);
    };

    const bot = (function(marker){
        const evaluate = function(marker){
            const freeFields = function(fieldArray){
                const possibleActions = [];
                fieldArray.forEach((row) => row.forEach((element)=> element.status == 'null' ? possibleActions.push(element.cord) : null));
                return possibleActions;
            };
            var possibleActions = freeFields(board.fieldArray);

            possibleActions.forEach((freeField) =>{
                const boardInstance = structuredClone(board.fieldArray);
                boardInstance[freeField[0]][freeField[1]].playField(marker);
                if(checkWin(marker,boardInstance)[0] == true){
                    freeField[2] = 10;
                }
                else freeField[2] = 0;

            });
            console.table(possibleActions);
        };
        return {evaluate};
        
    })();

    return {postRound, checkWin, players, setupGame, activePlayer, bot};
})();


gameController.setupGame('',['Player1','Player2']);