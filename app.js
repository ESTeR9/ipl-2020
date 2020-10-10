const appData ={
    show: new  Event('show'),
    pages:[],
    'teams':[],
    'csk':[],
    'dc':[],
    'kxip':[],
    'kkr':[],
    'mi':[],
    'rr':[],
    'rc':[],
    'srh':[],
    error:true,
    teamsIDs:{
    'home':'teams',
    'sunrisers-hyderabad':'srh',
    'royal-challengers-bangalore':'rcb',
    'chennai-super-kings':'csk',
    'mumbai-indians':'mi',
    'kolkata-knight-riders':'kkr',
    'rajasthan-royals':'rr',
    'kings-xi-punjab':'kxip',
    'delhi-capitals':'dc'
}
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function getData(){
    console.log('I came to getData');
    appData['teams']= getLocalItem('https://ipl-t20.herokuapp.com/teams','teams');
    appData['csk']= getLocalItem('https://ipl-t20.herokuapp.com/teams/chennai-super-kings','csk');
    appData['dc']= getLocalItem('https://ipl-t20.herokuapp.com/teams/delhi-capitals','dc');
    appData['kxip']= getLocalItem('https://ipl-t20.herokuapp.com/teams/kings-xi-punjab','kxip');
    appData['kkr']= getLocalItem('https://ipl-t20.herokuapp.com/teams/kolkata-knight-riders','kkr');
    appData['mi']= getLocalItem('https://ipl-t20.herokuapp.com/teams/mumbai-indians','mi');
    appData['rr']= getLocalItem('https://ipl-t20.herokuapp.com/teams/rajasthan-royals','rr');
    appData['rcb']= getLocalItem('https://ipl-t20.herokuapp.com/teams/royal-challengers-bangalore','rcb');
    appData['srh']= getLocalItem('https://ipl-t20.herokuapp.com/teams/sunrisers-hyderabad','srh'); 
    return new Promise((resolve, reject) => {
        resolve(0);
    });
}
function StartApp(){
    console.log('I came to StartApp');
    console.log('appData.error=',appData.error);
    if(!appData.error){
        let currentContent=document.querySelector('.active');
        if(currentContent!=null)        
            currentContent.classList.remove('active');
        document.getElementById('home').classList.add('active');
        document.getElementById('home').classList.add('grid-display');
        document.getElementById('home').dispatchEvent(appData.show);
        history.replaceState({},'Home','#home')
        loadHomePage();
    }
    else{
        errorPage();
    }

    pages = document.querySelectorAll('.page');
    pages.forEach( (pg)=>{
        pg.addEventListener('show',pageShown);
    })
    document.querySelectorAll('.nav-link').forEach((link)=>{
        link.addEventListener('click',nav);
    });
    window.addEventListener('popstate',poppin);
    return new Promise((resolve, reject) => {
        resolve(0);
    });

}
async function intiate(){
    await getData();
    await sleep(1000);
    await StartApp();
}
function nav(ev){
    ev.preventDefault();
    let currentPage= document.querySelector('.active');
    let currentPageID=currentPage.getAttribute('id');
    document.querySelector('.active').classList.remove('active');
    let nextPageID=ev.target.getAttribute('data-target');
    if(currentPageID=='home'){
        document.getElementById('home').classList.remove('grid-display');
    }
    if(nextPageID==='home')
    {   
        document.getElementById('home').classList.add('grid-display');
        if(currentPageID==='error'){
            location.reload();
            return;
        }
        if(currentPageID==='loading'){
            return;
        }
    }
    console.log(ev)
    let nextPage=document.getElementById(nextPageID);
    nextPage.classList.add('active');
    console.log(location.hash,nextPageID);
    if('#'+nextPageID!=location.hash)
        history.pushState({},nextPageID,'#'+nextPageID);
    nextPage.dispatchEvent(appData.show);
}

function errorPage(){
    let currentContent=document.querySelector('.active');
    if(currentContent!=null)
        currentContent.classList.remove('active');
    let nextPage=document.getElementById('error');
    nextPage.classList.add('active');
    if('#error'!=location.hash)
        history.pushState({},error,'#error');
    nextPage.dispatchEvent(appData.show);
}

function pageShown(ev){
    console.log('Page',ev.target.id,'just shown.');
    //youcan add any animations if you want to
}

function poppin(ev){
    console.log(location.hash,'popstate event');
    let hash=location.hash.replace('#','');
    let prevPage=document.getElementById(hash);
    if(!(prevPage===null)){
        document.querySelector('.active').classList.remove('active');
        prevPage.classList.add('active');
        if(hash==='home'){
            document.getElementById('home').classList.add('grid-display');
        }
        prevPage.dispatchEvent(appData.show);
    }
}

function getLocalItem (API,localKey){
    if(localStorage.getItem(localKey)===null){
    fetch(API
        ).then(function(res){
            console.log(appData.error);
            if(res.ok){
                return res.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(data=>{
                localStorage.setItem(localKey,JSON.stringify(data));
        }).catch(err=>{
            appData.error=true;
            return null;
        });
    }
    appData.error=false;
    return JSON.parse(localStorage.getItem(localKey));
}

function loadHomePage(){
    let teamCards=[];
    appData['teams'].forEach(team => {
        let homePage=document.getElementById('home');

        let teamCard=document.createElement('div');
        teamCard.classList.add('team-card');
        teamCard.id= appData.teamsIDs[team['id']];

        let teamLogo=document.createElement("IMG");
        teamLogo.classList.add('team-logo');
        teamLogo.setAttribute("src",`assets/${appData.teamsIDs[team['id']]}.png`);
        teamCard.appendChild(teamLogo);

        let teamNameHolder=document.createElement('div');
        teamNameHolder.classList.add('team-name');
        teamNameHolder.appendChild(document.createTextNode(team['teamName']));
        teamCard.appendChild(teamNameHolder);

        let venueNameHolder=document.createElement('div');
        venueNameHolder.classList.add("venue-name");
        venueNameHolder.appendChild(document.createTextNode(team['venue']));
        teamCard.appendChild(venueNameHolder); 
        let winningYears;       
        if(team['winningYears'].length>0){
            winningYears=document.createElement('div');
            winningYears.classList.add('winning-years');
            let trophyIcon=document.createElement('i');
            trophyIcon.classList.add("fa","fa-trophy");
            winningYears.appendChild(trophyIcon);
            winningYears.appendChild(document.createTextNode(team['winningYears'].toString()));
        }
        else{
            winningYears=document.createElement('span');
            winningYears.classList.add('no-wins-span');
        }
        teamCard.appendChild(winningYears);
        
        let viewTeamButton=document.createElement('a');
        viewTeamButton.classList.add('view-team-btn','nav-link');
        viewTeamButton.setAttribute('href','#');
        viewTeamButton.setAttribute('data-target',team.id);
        viewTeamButton.appendChild(document.createTextNode('View Team'));
        teamCard.appendChild(viewTeamButton);

        homePage.appendChild(teamCard);
    })
}

document.addEventListener('DOMContentLoaded',intiate());