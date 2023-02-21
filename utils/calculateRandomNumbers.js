function calculate(cantParam){
    const cant = cantParam || 100000000;
    const max = 1000;
    const min = 1;
    const numbers = [];
    for(let i = 0; i < cant; i++){
        let numberRandom = Math.floor((Math.random() * (max - min + 1)) + min);
        numbers.push(numberRandom);
    }
    return numbers.reduce((prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev), {})
}

process.on('message', cantParam => {
    const result = calculate(cantParam);
    process.send(result);
    process.exit();
});

process.send("ready");