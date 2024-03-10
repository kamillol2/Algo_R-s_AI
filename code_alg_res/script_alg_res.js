/*
 * Négation d'une formule
 */
function negationFormule(formule) {
  
    let formuleNeg = negationRec(formule);
    
    return formuleNeg;
}
function negationRec(formule) {
    formule = formule.replace(/\s+/g, '');
    if (!formule.includes('v')) {
        return '~' + formule;
    } else {
        // Cas général
        return '~(' + formule + ')';
    }
}


// Fonction pour mettre une formule logique sous forme d'un ensemble de clauses
function formuleToClauses(formule) {
   
    let cnfClauses = cnfTransformation(formule);
    return cnfClauses;
}

// Fonction de transformation en CNF 
function cnfTransformation(formule) {
    let clauses = [];
    let sousFormules = formule.split('⋀');
    sousFormules.forEach(sousFormule => {
        let literals = sousFormule.split('v');
        clauses.push(literals);
    });
    return clauses;
}



// Fonction pour chercher des clauses résolvantes

function chercherClausesResolvantes(clauses) {
    let resolvantes = [];
    for (let i = 0; i < clauses.length; i++) {
        for (let j = i + 1; j < clauses.length; j++) {
            let resolvent = resoudreClauses(clauses[i], clauses[j]);
            if (resolvent) {
                resolvantes.push(resolvent);
            }
        }
    }
    
    return resolvantes;
}

// Fonction pour résoudre deux clauses et générer une nouvelle clause
function resoudreClauses(clause1, clause2) {
    for (let literal1 of clause1) {
        for (let literal2 of clause2) {
            if (literal1 === "~" + literal2 || "~" + literal1 === literal2) {
                let newClause = [...clause1, ...clause2].filter(literal => literal !== literal1 && literal !== literal2);
                return newClause;
            }
        }
    }
    
    return null;
}

let resolvantes = chercherClausesResolvantes(clauses);
console.log("Clauses résolvantes trouvées : ");
resolvantes.forEach(resolvent => {
    console.log(resolvent);
});



// Algorithme de résolution

function verifierValiditeFormule(formule) {
    let negation = negationFormule(formule);
    let clauses = formuleToClauses(negation);
    let resolvantes = chercherClausesResolvantes(clauses);
    
    let clausesCopy = [...clauses];
    
    for (let i = 0; i < clausesCopy.length && resolvantes.length > 0; i++) {
        let clause = clausesCopy[i];
        let resolvante = resolvantes[0];
        
        let clauseResolue = resoudreClauses(clause, resolvante);
        let resolvantesRestantes = resolvantes.slice(1);
        
        if (clauseResolue !== null && clauseResolue.length === 0)  {
            clausesCopy.splice(i, 1);
            resolvantes = chercherClausesResolvantes(clausesCopy);
            i = -1; 
        } else if (clauseResolue !== null) {
            clausesCopy[i] = clauseResolue;
            resolvantes = chercherClausesResolvantes(clausesCopy);
            i = -1; 
        } else {
            console.error("Clause résolue est null.");
            return false; 
        }
    }
    
    if (clausesCopy.some(clause => clause.length === 0)) {
        console.log("La formule est valide.");
        return true;
    } else {
        console.log("La formule est invalide.");
        return false;
    }
}

// Appeler la fonction verifierValiditeFormule avec la formule en entrée

verifierValiditeFormule(formule);
function resolve() {
    let input = document.getElementById('input').value;
    let resultsList = document.getElementById('resultsList');
    let negation = negationFormule(input);
    let clauses = formuleToClauses(negation);
    let resolvantes = chercherClausesResolvantes(clauses);
    let resultItems = [
        `Négation de la formule : ${negation}`,
        `Ensemble de clauses : ${JSON.stringify(clauses)}`,
        `Clauses résolvantes trouvées : ${JSON.stringify(resolvantes)}`,
        `La formule "${input}" est ${verifierValiditeFormule(input) ? 'valide' : 'invalide'}.`
    ];
    resultsList.innerHTML = '';
    resultItems.forEach(item => {
        let resultItem = document.createElement('li');
        resultItem.textContent = item;
        resultsList.appendChild(resultItem);
    });
}

// Associer la fonction resolve au bouton Submit
document.getElementById('btnSubmit').addEventListener('click', resolve);

// Récupérer l'élément input
let inputElement = document.getElementById('input');

// Récupérer tous les boutons
let btnP = document.getElementById('btnP');
let btnQ = document.getElementById('btnQ');
let btnOpenParen = document.getElementById('btnOpenParen');
let btnCloseParen = document.getElementById('btnCloseParen');
let btnNegation = document.getElementById('btnNegation');
let btnAnd = document.getElementById('btnAnd');
let btnOr = document.getElementById('btnOr');
let btnImplication = document.getElementById('btnImplication');

// Ajouter des gestionnaires d'événements pour chaque bouton
btnP.addEventListener('click', () => {
    inputElement.value += 'P';
});

btnQ.addEventListener('click', () => {
    inputElement.value += 'Q';
});

btnOpenParen.addEventListener('click', () => {
    inputElement.value += '(';
});

btnCloseParen.addEventListener('click', () => {
    inputElement.value += ')';
});

btnNegation.addEventListener('click', () => {
    inputElement.value += '~';
});

btnAnd.addEventListener('click', () => {
    inputElement.value += '⋀';
});

btnOr.addEventListener('click', () => {
    inputElement.value += 'v';
});

btnImplication.addEventListener('click', () => {
    inputElement.value += '->';
});
