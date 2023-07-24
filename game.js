
//Les Variables globales
var url_questions = 'https://batman-api.sayna.space/questions'
var on_game = false
var questions = []
const bt_launch = document.querySelector('#bt-launch-game')
const quiz_intro = document.querySelector('.quiz-intro')
const quiz_quest = document.querySelector('.quiz-questions-container')
const quiz_pagination = document.querySelector('.quiz--pagination')
const quiz_quest_value = document.querySelector('.quiz--question-value')
const quiz_resp_list = document.querySelector('.quiz--response-list')
const bt_quest_next = document.querySelector('#bt-quest-next')
const img_left = document.querySelector('.quiz-questions-container .img-left')
const img_right = document.querySelector('.quiz-questions-container .img-right')
const modal_end = document.querySelector('.modal-end')
const modal_title = document.querySelector('.modal-end .modal-title')
const modal_message = document.querySelector('.modal-end .modal-message')
const bt_relaunch_quiz = document.querySelector('.modal-end #bt-relaunch-quiz')

var curQuestIndex = 0
var repList = []
var curRep = null

var img_have_size = false

//Récupérations des questions et réponses
async function getQuestions(){
    try {
        const r = await fetch(url_questions)
        const questions = await r.json()
        return questions
    } catch (e) {
        console.error(e)
        alert('Erreur de récupération des données du jeu')
        return false
    }
}

//
function displayQuestion(index){
    const q = questions[index]
    quiz_pagination.textContent = `${curQuestIndex+1}/${questions.length}`
    quiz_quest_value.textContent = q.question

    quiz_resp_list.innerHTML = ""
    img_left.innerHTML = ""
    img_right.innerHTML = ""


    //Les réponses
    q.response.forEach((e,i) => {
        const span = document.createElement('div')
        span.classList.add('quiz-resp-item')

        span.textContent = e.text
        span.addEventListener('click',function(){
            document.querySelectorAll('.quiz-resp-item').forEach( function(e){
                e.classList.remove('checked')
            })
            span.classList.add('checked')
            curRep = i
        })

        quiz_resp_list.appendChild(span)

    });


    //image d'en gauche
    console.log(quiz_pagination.offsetTop);
    var top_image =  quiz_pagination.offsetTop - quiz_quest.offsetTop
    if(q.images.l){
        //haut
        if(q.images.l[0]){
            const im_tl = document.createElement('img')
            im_tl.src = q.images.l[0]
            im_tl.style.cssText = `position:absolute;top:${top_image}px;right:0px`
            img_left.appendChild(im_tl)
        }
        //bas 
        if(q.images.l[1]){
            const im_bl = document.createElement('img')
            im_bl.src = q.images.l[1]
            im_bl.style.cssText = `position:absolute;bottom:0;right:0px`
            img_left.appendChild(im_bl)
        }
    }


    //image de droite
    if(q.images.r){
        //haut
        if(q.images.r[0]){
            const im_tr = document.createElement('img')
            im_tr.src = q.images.r[0]
            im_tr.style.cssText = 'position:absolute;top:0;left:0px'
            img_right.appendChild(im_tr)
        }
        //bas
        if(q.images.r[1]){
            const im_br = document.createElement('img')
            im_br.src = q.images.r[1]
            im_br.style.cssText = 'position:absolute;bottom:0;left:0px'
            img_right.appendChild(im_br)
        }
    }

    

    //obligé de le mettre sinon le div va s'agrandir petit à petit
    if(!img_have_size){
        img_left.style.height = `${quiz_quest.offsetHeight}px`
        img_right.style.height = `${quiz_quest.offsetHeight}px`

        img_have_size = true
    }


    curQuestIndex++
}

function urlImg(n){
    return `./assets/${n}`
}

//On ajoute les images pour chaque questions
function addImageQuestions(){
    questions[0].images = { l:[urlImg('Batgame_3.png')]}
    questions[1].images = { l:[urlImg('Batgame_4.png')]}
    questions[2].images = { l:[urlImg('Batgame_5.png')]}//
    questions[3].images = { l:[urlImg('Batgame_10.png')]}//
    questions[4].images = { l:[urlImg('Batgame_11.png')]}//
    questions[5].images = { 
        l:[urlImg('Batgame_18.png')],
    }//
    questions[6].images = { 
        l:[urlImg('Batgame_12.png'),urlImg('Batgame_13-1.png'),],
        r:[null,urlImg('Batgame_13.png')]
    }//
    
    // { 
    //     l:[urlImg('Batgame_10.png')],
    // }
    questions[7].images = { 
        l:[urlImg('Batgame_19.png'),],
    }//
    questions[8].images = { 
        l:[urlImg('Batgame_20.png')]
    }//
    questions[9].images = { 
        l:[urlImg('Batgame_21.png'),],
    }
    questions[10].images = { 
        l:[urlImg('Batgame_7.png'),],
    }

    questions[11].images = { 
        l:[urlImg('Batgame_6.png'),],
    }
    
}


//Apparition du pop up de fin pour annoncer la note
function displayNoteEnd(){
    //calcul des notes
    var tt_q = questions.length
    var note = 0
    var tmp = {}
    var titre = ''
    var message = ''

    //ici on va diviser par 3 les notes
    for (let i = 0; i < questions.length; i++) {
        //la réponse est sensé avoir la même taille que la question
        const e = questions[i]
        const rep = repList[i]

        if(rep == -1) continue //l'user n'a pas choisit une réponse
        note += (e.response[rep].isGood)?1:0
    }

    //affichage des textes
    if(note < (tt_q * (2/3))){
        titre = `${note}/${tt_q} C’EST PAS TOUT A FAIT ça...`
        message = `Oula ! Heureusement que le Riddler est sous les verrous... Il faut que vous vous repassiez les films, cette fois en enlevant peut-être le masque qui vous a bloqué la vue ! Aller, rien n’est perdu !`
    }else if(note >= (tt_q * (2/3)) && note <tt_q ){
        titre = `${note}/${tt_q} PAS MAL !`
        message = `Encore un peu d’entraînement avec le Chevalier Noir vous serait bénéfique, mais vous pouvez marcher la tête haute vos connaissances sont là. A vous de les consolider, foncez Gotham est votre terrain de chasse !`
    }else if(note == tt_q){
        titre = `${note}/${tt_q} BRAVO !`
        message = `Vous êtes véritablement un super fan de l’univers de Batman ! Comics, films, rien ne vous échappe. Bruce Wayne a de quoi être fier, Gotham est en paix et Batman peut prendre sa retraite, vous veillez aux grains !`
    }

    //apparition des messages
    modal_title.textContent = titre
    modal_message.textContent = message

    modal_end.style.display =  'flex'
}


//Exécution des script quand tous les éléménts ksont chargés
window.addEventListener('load',async function (){
    questions = await getQuestions()

    addImageQuestions()

    bt_launch.addEventListener('click',function(){
        quiz_intro.style.display = 'none'
        quiz_quest.style.display = 'flex'

        displayQuestion(curQuestIndex)
    })


    //sur la question suivante
    bt_quest_next.addEventListener('click',function(){

        if(curQuestIndex >= questions.length){
            curRep = (curRep == null)?-1:curRep
            repList.push(curRep)

            //apparition du popup
            displayNoteEnd()
        }else{
            curRep = (curRep == null)?-1:curRep
            repList.push(curRep)
            displayQuestion(curQuestIndex)
        }

        curRep = null
        
    })


    //sur le bouton relancer la quiz
    bt_relaunch_quiz.addEventListener('click',function(){
        modal_end.style.display = 'none'
        repList = []
        curRep = null

        curQuestIndex = 0

        displayQuestion(curQuestIndex)
    })

})


//GESION DES ANIMATIONS EN SCROLL
// Fonction pour vérifier si l'élément est dans la fenêtre visible
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fonction pour animer et faire apparaître l'élément lorsqu'il est dans la fenêtre visible
function animateElementOnScroll() {
    const titre = document.querySelector(".quiz-intro h1");
    const img = document.querySelector(".quiz-intro img");

    //les 2 éléments ont deux animations différentes

    if (isElementInViewport(titre) && !titre.classList.contains("animate")) {
        titre.classList.add("animate"); 
        titre.style.opacity = 1
    }
    if (isElementInViewport(img) && !img.classList.contains("animate")) {
        img.classList.add("animate"); 
        img.style.opacity = 1
    }
}

// Événement pour déclencher l'animation lorsque l'utilisateur fait défiler la page
document.addEventListener("scroll", animateElementOnScroll);