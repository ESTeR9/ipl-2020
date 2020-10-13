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
    },
    teamColors:{
        'chennai-super-kings': ['#fdb913','#f85c00','#ffc721','#ff6717'],
        'delhi-capitals': ['#004c93','#0358a7','#175aa7','#1b63b2'],
        'kings-xi-punjab': ['#aa4545','#740f0b','#b75756','#861a19'],
        'kolkata-knight-riders': ['#70458f','#3d2057','#7d579a','#472962'],
        'mumbai-indians': ['#005da0','#003a63','#0f6baa','#0f496f'],
        'rajasthan-royals': ['#2d4d9d','#172e5e','#3959a9','#293b6b'],
        'royal-challengers-bangalore': ['#000','#464646','#222','#555'],
        'sunrisers-hyderabad': ['#fb643e','#b81c25','#ff6f49','#c42930']
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
function loadPages(){
    appData.teams.forEach(team=>{
        let page=document.getElementById(team.id);

        let CaptianName='';
        appData[appData.teamsIDs[team.id]]['players'].forEach(player=>{
            if(player['id']===appData[appData.teamsIDs[team.id]]['team']['captainId']){
                CaptianName=player['name'];
                return;
            }
        })
        
        let teamBanner=document.createElement('div');
        teamBanner.classList.add('team-banner');
        teamBanner.setAttribute('style',`background-image: url(assets/${appData.teamsIDs[team['id']]}-banner.jpg)`);

        let bannerOverlay=document.createElement('div');
        bannerOverlay.setAttribute('style',`background-color: ${appData.teamColors[team.id][0]}`)
        bannerOverlay.classList.add('banner-overlay');
        teamBanner.appendChild(bannerOverlay);
        
        let teamLogo=document.createElement("IMG");
        teamLogo.classList.add('team-logo');
        teamLogo.setAttribute("src",`assets/${appData.teamsIDs[team.id]}.png`);
        teamBanner.appendChild(teamLogo);

        let teamDetails=document.createElement('div');
        teamDetails.classList.add('team-details');
        let teamName=document.createElement('div');
        teamName.classList.add('team-name');
        teamName.appendChild(document.createTextNode(team.teamName));
        teamDetails.appendChild(teamName); 
        let winningYears=document.createElement('div');
        let trophyIcon=document.createElement('i');
        trophyIcon.classList.add("fa","fa-trophy");
        winningYears.classList.add('winning-years');   
        winningYears.appendChild(trophyIcon);   
        if(team['winningYears'].length>0){
            winningYears.appendChild(document.createTextNode(team['winningYears'].toString()));
        }
        else{
            winningYears.classList.add('no-wins');
        }
        teamDetails.appendChild(winningYears);
        let teamCaptian=document.createElement('div');
        teamCaptian.innerHTML=`<span>Captian</span>${CaptianName}`;
        teamDetails.appendChild(teamCaptian);
        let teamVenue=document.createElement('div');
        teamVenue.innerHTML=`<span>Venue</span>${team['venue']}`;
        teamDetails.appendChild(teamVenue);

        
        teamBanner.appendChild(teamDetails);

        
        page.appendChild(teamBanner);

    })
    return new Promise((resolve, reject) => {
        resolve(0);
    });
}
async function intiate(){
    await getData();
    await loadPages();
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
        teamCard.setAttribute('style',`background: linear-gradient(135deg,${appData.teamColors[team.id][0]},${appData.teamColors[team.id][1]})`);
        teamCard.onmouseover=function(){
            teamCard.setAttribute('style',`background: linear-gradient(135deg,${appData.teamColors[team.id][2]},${appData.teamColors[team.id][3]})`);
        }
        teamCard.onmouseout=function(){
            teamCard.setAttribute('style',`background: linear-gradient(135deg,${appData.teamColors[team.id][0]},${appData.teamColors[team.id][1]})`);
        }
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
        let winningYears=document.createElement('div');
        let trophyIcon=document.createElement('i');
        trophyIcon.classList.add("fa","fa-trophy");
        winningYears.classList.add('winning-years');   
        winningYears.appendChild(trophyIcon);   
        if(team['winningYears'].length>0){
            winningYears.appendChild(document.createTextNode(team['winningYears'].toString()));
        }
        else{
            winningYears.classList.add('no-wins');
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