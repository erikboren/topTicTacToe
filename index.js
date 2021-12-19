/*jshint esversion: 6 */
/*jshint -W030 */
const screenBoard = document.querySelector(".screenBoard");
const gameInfo = document.querySelector(".gameInfo");
const gameInfoText = document.querySelectorAll(".gameInfoText");

const playerFactory = (marker,isBot,playerID,name) =>{
    
    this.marker = marker;

    this.playerID = playerID;

    this.isWinner = false;
    
    this.name = name;

    this.wins = 0;

    const play = function(xCord,yCord){
        board.placeMarker(xCord,yCord,this);
    };

    const botPlay = function(){
        
        const evaluateMove = function(move,markerToPlace,board){
            // perspective is true if the bot is evauating a move of its own, false if it is evaluation opponent move.
            
            const perspective = markerToPlace == marker? true:false; 
            

            boardInstance = deepCopyFunction(board);
            

            boardInstance.fieldArray[move.cord[0]][move.cord[1]].state= markerToPlace;

            const points = boardInstance.checkWin(markerToPlace)[0]? 10: 0;

            return [perspective? points:-points, move.cord, boardInstance];

        };

        const depth = 2;

        const possibleMoves = board.possibleMoves();

        var evaluatedMoves = [];

        possibleMoves.forEach(move =>{
            evaluatedMoves.push(evaluateMove(move,marker,board));
        });

        console.log('evaluated moves');
        console.table(evaluatedMoves);

    };

    return{marker, isWinner, play, botPlay, playerID, name, wins};
};

const fieldFactory = (xCord,yCord) =>{
    var state = 'empty';
    this.state = state;
   const cord = [xCord,yCord];

    const playField = function(marker){
        state = marker;
        this.state = state;
    };

    const resetField = function(){
        state = 'empty';
        this.state = state;
    };



    return {state, cord, playField, resetField};

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
        if(gameController.gameOver == false){
            players[gameController.activePlayer].play(xCord,yCord);
        }
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
        if(fieldArray[xCord][yCord].state == 'empty'){
            fieldArray[xCord][yCord].playField(player.marker);
            gameController.postRound(player);
            screenController.updateField(xCord,yCord);
        } else{
        }
        return;
    };


    const resetBoard = function(){
        fieldArray.forEach(fieldVector =>{
            fieldVector.forEach(field => field.resetField());
        });
    };

    const printArray = ()=> console.table(fieldArray);

    const allFieldsFilled = function(){
        return possibleMoves().length >0? false: true;
    };


    const possibleMoves = function(){
       const freeFields = [];
       
       fieldArray.forEach(fieldVector =>{
        fieldVector.forEach(field =>{
            field.state =='empty'? freeFields.push(field): false;
        });
       });

       return freeFields;
    }; 

    const checkWin = function(marker){
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
                fields[k] = fieldArray[possibleWins[i][k][0]][possibleWins[i][k][1]].state;
            }
            if(fields[2] == fields[1] && fields[2] == fields[0] && fields[2] == marker){
                return [true,marker];
                
            } else{
                } 
        }
        return [false,null];
        

    };
    

    return {printArray, fieldArray, placeMarker, resetBoard, allFieldsFilled, possibleMoves, checkWin};

})();

const screenController = (function(){
    //gameOver Modal
    const statsButton = document.querySelector(".statsButton");
    const gameOverModal = document.querySelector(".gameOverModal");
    const gameOverClose = document.getElementById("gameOverClose");
    const restartGameBtn = document.querySelector(".restartGame");

    const displayGameOverModal = function(){
        viewStatistics();
        gameOverModal.style.display = "block";
    };

    gameOverClose.onclick = function(){
        gameOverModal.style.display = "none";
    };
    
    statsButton.onclick = function(){
        displayGameOverModal();
    };

    restartGameBtn.onclick = function(){
        gameOverModal.style.display = "none";
        gameController.startNewGame();

    };


    // settings Modal
    const settingsModal = document.querySelector(".settingsModal");
    const settingsButton = document.querySelector(".settingsButton");
    const settingsClose = document.getElementById("settingsClose");
    const startGameBtn = document.querySelector(".startGameBtn");
    const nameField = document.querySelectorAll(".nameField");
    
    settingsClose.onclick = function() {
        settingsModal.style.display = "none";
      };

    const displaySettingsModal = function(){
        settingsModal.style.display= "block";
    };

    settingsButton.onclick = function(){
        displaySettingsModal();
    };
   
    startGameBtn.onclick = function(){
        settingsModal.style.display = "none";
        var names = [] ;
        nameField.forEach((element,index) => names[index]=element.value);
        gameController.setupGame(names,true);
    };

    const winsCells = document.querySelectorAll(".wins");
    const nameCells = document.querySelectorAll(".playerName");
    const viewStatistics = function(){
        winsCells.forEach((element,index) =>{
            element.textContent=gameController.players[index].wins;
        });
        nameCells.forEach((element,index) =>{
            element.textContent=gameController.players[index].name;
        });

    };


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
        gameInfoText.forEach(element => element.textContent =name +"'s turn" );
    };
    const displayWinner = function(name){
        gameInfoText.forEach(element => element.textContent =name +" wins!" );
    };

    const displayDraw = function(){
        gameInfoText.forEach(element => element.textContent = "It's a draw!");
    };

    const update = function(name){
        display();
        displayPlayerTurn(name);
       
    };

    const updateField = function(xCord,yCord){
        screenFieldArray[xCord][yCord].textContent = board.fieldArray[xCord][yCord].state;
        screenBoard.innerHTML = '';
        for(i=0;i<3;i++){
            for(k=0; k<3; k++){
               screenBoard.appendChild(screenFieldArray[i][k]); 
                }
            }
    };

    

    return {update, displayPlayerTurn, displayWinner,displayDraw, updateField, displayGameOverModal, displaySettingsModal};
})();

const gameController = (function(){
    this.players = [];
    const createPlayers = function(names,bot){  
        players[0] = playerFactory('x',false,0,names[0]);
        players[1] = playerFactory('o',bot,1,names[1]);
    };

    /* const checkWin = function(marker,fieldArray){
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
                fields[k] = fieldArray[possibleWins[i][k][0]][possibleWins[i][k][1]].state;
            }
            if(fields[2] == fields[1] && fields[2] == fields[0] && fields[2] == marker){
                return [true,marker];
                
            } else{
                } 
        }
        return [false,null];
        

    }; */
    var activePlayer = 0; 
    this.gameOver = false;
    const postRound = function(){
        if(board.checkWin(players[activePlayer].marker)[0] == true){
            screenController.displayWinner(players[activePlayer].name);
            players[activePlayer].wins ++;
            this.gameOver = true;
            screenController.displayGameOverModal();
        } 
        else if(board.allFieldsFilled() == true){
            this.gameOver = true;
            screenController.displayDraw();
            screenController.displayGameOverModal();
        }
        else {
            activePlayer = activePlayer == 0 ? 1 : 0;
            this.activePlayer = activePlayer;
            screenController.displayPlayerTurn(players[activePlayer].name);
        }
    };
    const startNewGame = function(){
        this.gameOver = false;
        board.resetBoard();
        screenController.update(players[activePlayer].name);

    };

    const setupGame = function(names,bot){
        createPlayers(names,bot);
        startNewGame();
        activePlayer =0;
        screenController.update(players[activePlayer].name);
    };

    return {postRound, players, setupGame, activePlayer, gameOver, startNewGame};
})();

const deepCopyFunction = (inObject) => {
    let outObject, value, key;
  
    if (typeof inObject !== "object" || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }
  
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};
  
    for (key in inObject) {
      value = inObject[key];
  
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = deepCopyFunction(value);
    }
  
    return outObject;
  };
  
  
  
screenController.update();






