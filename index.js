/*jshint esversion: 6 */

const playerFactory = (marker,isBot,playerID) =>{
    
    this.marker = marker;

    this.playerID = playerID;

    var isWinner = false;

    const play = function(xCord,yCord){
       board.placeMarker(xCord,yCord,this);
    };

    return{marker, isWinner, play, playerID};
};

const fieldFactory = (xCord,yCord) =>{
    // this.status = null;
    
   const cord = [xCord,yCord];

    const playField = function(player){
           this.status = player.marker;
    };

    return {status, cord, playField};

};

const players = [];
players[0] = playerFactory('x',false,0);
players[1] = playerFactory('o',false,1);

const board = (function(){
    let fieldArray =  Array.from(Array(3), () => new Array(3));

    for(i=0;i<3;i++){
        for(k=0; k<3; k++){
            var field = fieldFactory(i,k);
            fieldArray[i][k] = field;
        }
    }

    const placeMarker = function(xCord,yCord,player){
        fieldArray[xCord][yCord].playField(player);
        return field;
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
                console.log(fields);
                player.isWinner = true;
                return [true,player];
                
            }
            return [false,null];
        }

        

    };


        let markerArray;

    const printMArray = () => {
        markerArray = Array.from(Array(3), () => new Array(3));

        for(i=0; i<3;i++){
            for(k=0; k<3;k++){
                if(fieldArray[i][k].status != ''){
                    markerArray[i][k] = fieldArray[i][k].status;
                }
                
            }
        }
        console.table(markerArray);
    };

    const printArray = ()=> console.table(fieldArray);

    return {printArray, fieldArray, placeMarker, printMArray, markerArray, checkWin};

})();

// const screenController = (function(){
//     let markerArray = Array.from(Array(3), () => new Array(3));

//     for(i=0; i<3;i++){
//         for(k=0; k<3;k++){
//             markerArray[i][k] = board.fieldArray[i][k].status.marker;
//         }
//     }

//     const printArray = function(){
//         console.table(markerArray);
//     };

//     return {markerArray};
// });


players[0].play(0,0);
players[0].play(1,1);
players[0].play(2,2);

board.printMArray();

board.printArray();

console.log(board.checkWin(players[0]));
