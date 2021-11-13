/*jshint esversion: 6 */

const playerFactory = (marker,isBot) =>{
    return{marker};
};

const fieldFactory = (xCord,yCord) =>{
    var status = 'empty';
    
    const getStatus = function(){
        return status;
    };

    const getCord = function(){
        return [xCord,yCord];
    };

    const playField = function(player){
        if(status != 'empty'){
            return 'fail';
        } else {
            status = player;
        }
    };

    return {getStatus, getCord, playField};

};

const player1 = playerFactory('x',false);
const player2 = playerFactory('o',false);

const board = (function(){
    let fieldArray =  Array.from(Array(3), () => new Array(3));

    for(i=0;i<3;i++){
        for(k=0; k<3; k++){
            fieldArray[i][k] = fieldFactory(i,k);
        }
    }


    const checkWin = function(){
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
                fields[k] = fieldArray[possibleWins[i][k][0]][possibleWins[i][k][1]].getStatus();
            }
            if(fields[2] == fields[1] == fields[0]){
                // wins
                return fields[1];
            }
        }
        

    };

    const printArray = ()=> console.table(fieldArray);

    return {printArray, fieldArray};

})();




