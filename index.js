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

    return{marker, isWinner, play, playerID, name, wins};
};

const fieldFactory = (xCord,yCord) =>{
    this.status = null;
   const cord = [xCord,yCord];

    const playField = function(marker){
        this.status = marker;
    };

    const resetField = function(){
        this.status = null;
    };

    return {status, cord, playField, resetField};

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
        if(fieldArray[xCord][yCord].status == 'null'){
            fieldArray[xCord][yCord].playField(player.marker);
            gameController.postRound(player);
            screenController.updateField(xCord,yCord);
        } else{
            console.log('bajs deluze');
        }
        return;
    };


    const resetBoard = function(){
        fieldArray.forEach(fieldVector =>{
            fieldVector.forEach(field => field.resetField);
        });
    };

    const printArray = ()=> console.table(fieldArray);

    return {printArray, fieldArray, placeMarker, resetBoard};

})();

const screenController = (function(){
    //gameOver Modal
    const statsButton = document.querySelector(".statsButton");
    const gameOverModal = document.querySelector(".gameOverModal");
    const gameOverClose = document.getElementById("gameOverClose");

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
        gameController.setupGame('',names);
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

    

    return {update, displayPlayerTurn, displayWinner, updateField, displayGameOverModal, displaySettingsModal};
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
    this.gameOver = false;
    const postRound = function(){
        if(checkWin(players[activePlayer].marker,board.fieldArray)[0] == true){
            screenController.displayWinner(players[activePlayer].name);
            players[activePlayer].wins ++;
            this.gameOver = true;
            screenController.displayGameOverModal();
        } 
        else
        {
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

    const setupGame = function(mode,names){
        createPlayers(names);
        startNewGame();
        activePlayer =0;
        screenController.update(players[activePlayer].name);
    };

   
    const bot = (function(marker){
        const evaluate = function(){
            const freeFields = function(fieldArray){
                const freeFields = [];
                fieldArray.forEach((row) => row.forEach((element)=> element.status == 'null' ? freeFields.push(element.cord) : null));
                return freeFields;
            };
            var possibleActions = freeFields(board.fieldArray);

            possibleActions.forEach((freeField) =>{
                const boardInstance = deepCopyFunction(fieldArray);
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

    return {postRound, checkWin, players, setupGame, activePlayer, bot, gameOver};
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






