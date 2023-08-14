let currentPokemon;
let loadButton = document.getElementById('loadMoreButton')
let loadedPokemon = 30;
let loadedPokemonCounter = 1;
let maxHP = 255;
let maxAT = 190;
let maxDEF = 230;
let maxSAT = 194;
let maxSDEF = 230;
let maxSPD = 180;
let statsOpen = 0;
let allPokemon = [];


async function loadAllPokemonIntoArray() {
    for (e = 1; e < 1010; e++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${e}/`
        let response = await fetch(url);
        let currentPokemon = await response.json();
        allPokemon.push(currentPokemon['name'])
    }
}
loadAllPokemonIntoArray();


loadButton.addEventListener('click', () => {
    loadMorePokemon();
})


async function loadPokemon() {
    for (i = loadedPokemonCounter; i < loadedPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}/`
        let response = await fetch(url);
        let currentPokemon = await response.json();
        printPokemon(currentPokemon);
        refreshLoadingBar(i, loadedPokemon)
        setLoadingScreen();
    }
}


function setLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'flex';
}


function releaseLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'none';
}


function refreshLoadingBar(l, LP) {
    let loadingBar = (l / LP) * 100
    document.getElementById('loadingBar').style = `width:${loadingBar}%`
    document.getElementById('loadingBar').innerText = `Pokemon are loading: ${loadingBar.toFixed()}%`
    if (loadingBar.toFixed() > 94) {
        document.getElementById('loadingBar').innerText = `${LP} von 1010 Pokemon geladen`
        document.getElementById('loadingBar').style = `width:100%`
        setTimeout(() => {
            releaseLoadingScreen();
        }, 1000)
    }
}


function loadMorePokemon() {
    if (loadedPokemon < 900) {
        loadedPokemonCounter = loadedPokemonCounter + 30
        loadedPokemon = loadedPokemon + 30;
        loadPokemon();
    }
    else if (loadedPokemon == 900) {
        loadedPokemonCounter = loadedPokemonCounter + 100
        loadedPokemon = loadedPokemon + 110;
        loadPokemon();
        document.getElementById('loadMoreButton').innerText = 'Alle 1010 Pokemon geladen'
    }
}


function printPokemon(cP) {
    document.getElementById('pokemonContainer').innerHTML += `
    <div onclick="showPokemonDetail(${i})" class="pokeContainer ${checkForClass(cP)}" id="pokeID${i}"><img src="${cP['sprites']['front_default']}">
    <b class="pokeNameDesigne">${cP['name']}</b>
    <b class="pokeNameDesigne">ID: #${cP['id']}</b>
    <div>
        <img class="typePic" src="types/${checkForClass(cP)}.png" alt="type1">
        <img class="typePic" src="types/${checkForClass2(cP)}.png" alt="type2">
    </div>
    </div>`
}


async function showPokemonDetail(spd) {
    let information = `https://pokeapi.co/api/v2/pokemon/${spd}/`
    let response = await fetch(information)
    let detailInformation = await response.json();
    loadDetailInformation(detailInformation);
    setArrows(spd)
    setDetailCardBackground(detailInformation);
    closeDetailCardContainer();
    document.getElementById('body').style.overflow = 'hidden'
}


function setArrows(arrowID) {
    document.getElementById('arrowContainer').innerHTML = `
    <span onclick="showPreviousPokemon(${arrowID})" id="arrowBack" class="material-symbols-outlined arrow">
        arrow_back
    </span>
    <span onclick="showNextPokemon(${arrowID})" id="arrowForward" class="material-symbols-outlined arrow">
        arrow_forward
    </span>`
}


function loadDetailInformation(detailInformation) {
    document.getElementById('typeClass2').innerText = '-'
    document.getElementById('pokeDetailPic').src = detailInformation['sprites']['front_default']
    document.getElementById('detailName').innerText = detailInformation['name']
    document.getElementById('ID').innerText = detailInformation['id']
    document.getElementById('typeClass').innerText = detailInformation['types']['0']['type']['name']
    document.getElementById('weight').innerText = detailInformation['weight']
    document.getElementById('height').innerText = detailInformation['height']
    document.getElementById('attackBtnContainer').innerHTML = `<button onclick="loadAttacks(${detailInformation['id']})" id="attackButton" class="btn btn-dark">Attacks</button>
    <button onclick="loadStats(${detailInformation['id']})" id="statButton" class="btn btn-dark">Stats</button>`
    if (detailInformation['types']['1']) {
        document.getElementById('typeClass2').innerText = detailInformation['types']['1']['type']['name']
    }
}


function setDetailCardBackground(data) {
    document.getElementById('centerOverAll').style.display = 'flex';
    document.getElementById('pokeDetailCard').style.display = 'inline';
    document.getElementById('pokeDetailCard').style.backgroundImage = `url(types/${checkForClass(data)}.png)`
}


function closeDetail() {
    document.getElementById('centerOverAll').style.display = 'none';
    document.getElementById('pokeDetailCard').style.display = 'none';
    document.getElementById('typeClass2').innerText = '-';
    document.getElementById('attackContainer').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    statsOpen = 0;
    document.getElementById('body').style.overflow = 'visible'
}


function showNextPokemon(next) {
    next++
    showPokemonDetail(next)
    document.getElementById('attackContainer').style.display = 'none';
    if (statsOpen == 1) {
        loadStats(next)
    }
}


function showPreviousPokemon(previous) {
    if (previous > 1) {
        previous--
        showPokemonDetail(previous)
    }
    document.getElementById('attackContainer').style.display = 'none';
    if (statsOpen == 1) {
        loadStats(previous)
    }
}


async function filter() {
    let inputVal = document.getElementById('pokeSearch').value
    if (inputVal.length > 0) {
        document.getElementById('searchedPokemonContainer').innerHTML = ``;
        let L;
        let data = String(document.getElementById('pokeSearch').value);
        L = data.split(' ').map(i => i.split(''));
        // iterate over array
        const out = allPokemon.filter(el => {
            let count = 0;// initialize count to zero
            el.split('').forEach(letter => {// iterate over current element's letters
                if (L[0][count] === letter) { count++; }// if current letter in L is letter, increment count
            });
            return count === L[0].length;// after iterating, check if all L letters were found in order
        });
        // out für die Ausgabe verwenden
        for (let index = 0; index < out.length; index++) {
            printSearchedPokemon(out[index])
            console.log(out[index])
        }
    }
    else {
        document.getElementById('searchedPokemonContainer').style.display = 'none';
    }
}


function deleteSearch(){
    document.getElementById('searchedPokemonContainer').style.display = 'none';
    document.getElementById('body').style.overflow = 'visible';
    document.getElementById('pokeSearch').value = ``;
}


async function printSearchedPokemon(sP) {
    let information = `https://pokeapi.co/api/v2/pokemon/${sP}/`
    let response = await fetch(information)
    let detailInformation = await response.json();
    document.getElementById('searchedPokemonContainer').style.display = 'flex';
    document.getElementById('searchedPokemonContainer').innerHTML += `
    <div onclick="showPokemonDetail(${detailInformation['id']})" class="pokeContainer ${checkForClass(detailInformation)}" id="pokeID">
        <img src="${detailInformation['sprites']['front_default']}">
        <b class="pokeNameDesigne">${detailInformation['name']}</b>
    </div>`
    document.getElementById('body').style.overflow = 'hidden'
}


function closeDetailCardContainer() {
    document.getElementById('searchedPokemonContainer').style.display = 'none';
    document.getElementById('body').style.overflow = 'visible';
}


async function loadAttacks(attackID) {
    statsOpen = 0;
    document.getElementById('stats').style.display = 'none';
    document.getElementById('attackContainer').style.display = 'flex';
    document.getElementById('attackTable').innerHTML = `
    <table id="attackTable">
    </table>`;
    let information = `https://pokeapi.co/api/v2/pokemon/${attackID}/`
    let response = await fetch(information)
    let detailInformation = await response.json();
    for (i = 0; i < detailInformation['moves'].length; i++) {
        document.getElementById('attackTable').innerHTML += `
        <table id="attackTable">
        <tr><th>${detailInformation['moves'][`${i}`]['move']['name']}</th></tr>
        </table>`
    }
}


async function loadStats(statID) {
    let information = `https://pokeapi.co/api/v2/pokemon/${statID}/`
    let response = await fetch(information)
    let detailInformation = await response.json();
    printStats(detailInformation)
    document.getElementById('stats').style.display = 'flex';
    statsOpen = 1;
}


function printStats(detailInformation) {
    document.getElementById('hp').style = `width:${calcStat(detailInformation['stats']['0']['base_stat'], maxHP)}%`
    document.getElementById('hp').innerText = `${calcStat(detailInformation['stats']['0']['base_stat'], maxHP).toFixed()}`
    document.getElementById('attack').style = `width:${calcStat(detailInformation['stats']['1']['base_stat'], maxAT)}%`
    document.getElementById('attack').innerText = `${calcStat(detailInformation['stats']['1']['base_stat'], maxAT).toFixed()}`
    document.getElementById('defense').style = `width:${calcStat(detailInformation['stats']['2']['base_stat'], maxDEF)}%`
    document.getElementById('defense').innerText = `${calcStat(detailInformation['stats']['2']['base_stat'], maxDEF).toFixed()}`
    document.getElementById('spAttack').style = `width:${calcStat(detailInformation['stats']['3']['base_stat'], maxSAT)}%`
    document.getElementById('spAttack').innerText = `${calcStat(detailInformation['stats']['3']['base_stat'], maxSAT).toFixed()}`
    document.getElementById('spDefense').style = `width:${calcStat(detailInformation['stats']['4']['base_stat'], maxSDEF)}%`
    document.getElementById('spDefense').innerText = `${calcStat(detailInformation['stats']['4']['base_stat'], maxSDEF).toFixed()}`
    document.getElementById('speed').style = `width:${calcStat(detailInformation['stats']['5']['base_stat'], maxSPD)}%`
    document.getElementById('speed').innerText = `${calcStat(detailInformation['stats']['5']['base_stat'], maxSPD).toFixed()}`
}


function calcStat(sum1, sum2) {
    let result = (sum1 / sum2) * 100
    return result;
}


function checkForClass(data) {
    if (data['types']['0']['type']['name'] == 'normal') {
        return 'normal'
    }
    else if (data['types']['0']['type']['name'] == 'fire') {
        return 'fire'
    }
    else if (data['types']['0']['type']['name'] == 'water') {
        return 'water'
    }
    else if (data['types']['0']['type']['name'] == 'electric') {
        return 'electric'
    }
    else if (data['types']['0']['type']['name'] == 'grass') {
        return 'grass'
    }
    else if (data['types']['0']['type']['name'] == 'ice') {
        return 'ice'
    }
    else if (data['types']['0']['type']['name'] == 'fighting') {
        return 'fighting'
    }
    else if (data['types']['0']['type']['name'] == 'poison') {
        return 'poison'
    }
    else if (data['types']['0']['type']['name'] == 'ground') {
        return 'ground'
    }
    else if (data['types']['0']['type']['name'] == 'flying') {
        return 'flying'
    }
    else if (data['types']['0']['type']['name'] == 'psychic') {
        return 'psychic';
    }
    else if (data['types']['0']['type']['name'] == 'bug') {
        return 'bug'
    }
    else if (data['types']['0']['type']['name'] == 'rock') {
        return 'rock'
    }
    else if (data['types']['0']['type']['name'] == 'ghost') {
        return 'ghost';
    }
    else if (data['types']['0']['type']['name'] == 'dragon') {
        return 'dragon'
    }
    else if (data['types']['0']['type']['name'] == 'dark') {
        return 'dark'
    }
    else if (data['types']['0']['type']['name'] == 'steel') {
        return 'steel'
    }
    else if (data['types']['0']['type']['name'] == 'fairy') {
        return 'fairy'
    }
}


function checkForClass2(data) {
    if (data['types']['1'] !== undefined) {
        if (data['types']['1']['type']['name'] == 'normal') {
            return 'normal'
        }
        else if (data['types']['1']['type']['name'] == 'fire') {
            return 'fire'
        }
        else if (data['types']['1']['type']['name'] == 'water') {
            return 'water'
        }
        else if (data['types']['1']['type']['name'] == 'electric') {
            return 'electric'
        }
        else if (data['types']['1']['type']['name'] == 'grass') {
            return 'grass'
        }
        else if (data['types']['1']['type']['name'] == 'ice') {
            return 'ice'
        }
        else if (data['types']['1']['type']['name'] == 'fighting') {
            return 'fighting'
        }
        else if (data['types']['1']['type']['name'] == 'poison') {
            return 'poison'
        }
        else if (data['types']['1']['type']['name'] == 'ground') {
            return 'ground'
        }
        else if (data['types']['1']['type']['name'] == 'flying') {
            return 'flying'
        }
        else if (data['types']['1']['type']['name'] == 'psychic') {
            return 'psychic';
        }
        else if (data['types']['1']['type']['name'] == 'bug') {
            return 'bug'
        }
        else if (data['types']['1']['type']['name'] == 'rock') {
            return 'rock'
        }
        else if (data['types']['1']['type']['name'] == 'ghost') {
            return 'ghost';
        }
        else if (data['types']['1']['type']['name'] == 'dragon') {
            return 'dragon'
        }
        else if (data['types']['1']['type']['name'] == 'dark') {
            return 'dark'
        }
        else if (data['types']['1']['type']['name'] == 'steel') {
            return 'steel'
        }
        else if (data['types']['1']['type']['name'] == 'fairy') {
            return 'fairy'
        }
    }
    else if (data['types']['1'] === undefined) {
        return 'normal'
    }
}