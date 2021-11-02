class Stato {
	constructor(row,col,value) {
		this.row = row;
		this.col = col;
		this.enable = value;
	}
}

class Nodo {
	constructor(g,h,s,p) {
		this.gCost = g;
		this.hCost = h;
		this.fCost = (g+h);
		this.state = s;
		this.parentNode = p;
	}
}

class Problem {
	constructor(lab,init,goal) {
		this.lab = lab;
		this.initState = init;
		this.goalState = goal;
	}

	goalTest(nodo) {
		return ((nodo.state.row == this.goalState.row) && (nodo.state.col == this.goalState.col));
	}

	getHeuristicCost(state) {
		return (Math.abs(state.row - this.goalState.row) + Math.abs(state.col - this.goalState.col))
	}
}

function colorsACell(i,j,color) {
	var rows = document.getElementById("labirynth").children[0].children;  //table -> tbody -> rows
	var cols = rows[i].children;
	cols[j].style.backgroundColor = color;
} 

function clickHandler(color) {
	var id = event.target.id;
	var ij = id.substring(1, id.length-1).split(",");
	if(selected==0) { 
		event.target.style.backgroundColor = color;
		initState=labirinto[ij[0]][ij[1]];
		selected++;
		document.getElementById("info").innerHTML = "Click the goal cell";
		return;
	}
	if(selected==1) { 
		event.target.style.backgroundColor = color;
		goalState=labirinto[ij[0]][ij[1]];
		selected++;
		start();
		document.getElementById("info").innerHTML = "";
		return;
	}
}

function drawLab(lab) {
	var body = document.getElementsByTagName('body')[0];
	var table = document.createElement('table');
	table.id="labirynth";
	table.style.width = '700px';
	table.style.height = '500px';
	table.style.margin = 'auto';
	table.style.marginTop = '10px';
	table.style.borderCollapse= "collapse";
	var tbody = document.createElement('tbody');
	for (var i = 0; i < MAXROW; i++) {
	    var tr = document.createElement('tr');
	    for (var j = 0; j < MAXCOL; j++) {
	        var td = document.createElement('td');
	        td.style.border = "1px solid black";
	        td.id="["+i+","+j+"]";
	        if(lab[i][j].enable == false) {
	        	td.style.backgroundColor = "#000000";
	        }
	        else {
	        	td.style.backgroundColor = "#FFFFFF";
	        	td.addEventListener("click",function(){ clickHandler("rgb(183, 106, 1)")})
	        }
	        tr.appendChild(td)     
	    }
	    tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	body.appendChild(table);
}

function createLab(r,c) { 
	var lab = new Array(r);
	for (var i = 0; i < lab.length; i++) {
		lab[i] = new Array(c);
		for (var j = 0; j < lab[i].length; j++) {
			lab[i][j] = new Stato(i,j,1);
		}
	}
	var i = 0;
	while(i<(MAXROW/1.7)*(MAXCOL/2)) {
		var r = Math.floor(Math.random() * MAXROW); 
		var c = Math.floor(Math.random() * MAXCOL); 
		if(lab[r][c].enable==1) {
			i++;
			lab[r][c].enable=0;
		}
	}
	return lab;
} 

function getSons(nodo,problem) {
	var r = nodo.state.row;
	var c = nodo.state.col;
	var newStates = new Array();
	if(((r+1)<MAXROW) && (problem.lab[r+1][c].enable==1)) { newStates.push(problem.lab[r+1][c]); }
	if(((c+1)<MAXCOL) && (problem.lab[r][c+1].enable==1)) { newStates.push(problem.lab[r][c+1]); }
	if(((r-1)>=0) && (problem.lab[r-1][c].enable==1)) { newStates.push(problem.lab[r-1][c]); }
	if(((c-1)>=0) && (problem.lab[r][c-1].enable==1)) { newStates.push(problem.lab[r][c-1]); }

	var sons = new Array();
	for(var i=0; i < newStates.length; i++) {
		sons[i] = new Nodo((nodo.gCost+1),p.getHeuristicCost(newStates[i]),newStates[i],nodo);
	}
	return sons;
}

function contains(arr,nodo) {
	for(var i = 0; i<arr.length; i++) {
		if((nodo.state.row == arr[i].state.row) && (nodo.state.col == arr[i].state.col)) {
			return true;
		}
	}
	return false;
}

function getPos(arr,nodo) {
	var i=0;
	while((i<arr.length) && (nodo.fCost)>=(arr[i].fCost)) {
		i++
	}
	return i;
}

function showInfo(toExpand,closed,pathStr,pathLen) {
	var body = document.getElementsByTagName('body')[0];
	var p1 = document.createElement("p");
	p1.style.width = "1300px";
	p1.style.height = "60px";
	p1.innerHTML = "PATH<br><br>"+pathStr;
	var p2 = document.createElement("p");
	p2.innerHTML = "PATH LENGTH : "+pathLen;
	var p3 = document.createElement("p");
	p3.innerHTML = "NUM OF NODES TO EXPAND : "+toExpand;
	var p4 = document.createElement("p");
	p4.innerHTML = "NUM OF CLOSED NODES    : "+closed;
	body.appendChild(p1);
	body.appendChild(p2);
	body.appendChild(p3);
	body.appendChild(p4);
}

function showPath(initState,nodo,color,toExpand,closed) {
	colorsACell(nodo.state.row,nodo.state.col,color);
	var pathLen = 1;
	var pathStr = "["+nodo.state.row+","+nodo.state.col+"]";
	while((initState.row!=nodo.state.row) || (initState.col!=nodo.state.col)) {
		nodo = nodo.parentNode;
		colorsACell(nodo.state.row,nodo.state.col,color);
		pathLen = pathLen+1;
		pathStr = "["+nodo.state.row+","+nodo.state.col+"] "+pathStr;
	}
	showInfo(toExpand,closed,pathStr,pathLen);
}

/* QUESTA FUNZIONE CALCOLA IL PATH SENZA MOSTRARE L'ANIMAZIONE 
function searchPath(p) {
	var nodesToExpand = new Array();
	var closedNodes = new Array();
	nodesToExpand.push(new Nodo(0,p.getHeuristicCost(p.initState),p.initState));
	
	while(nodesToExpand.length > 0) {
		var n = nodesToExpand.shift();
		closedNodes.push(n);
		if(p.goalTest(n)) { 
			showPath(p.initState,n,"#DC143C",nodesToExpand.length,closedNodes.length);
			return;
		} else {
			var sons = getSons(n,p);
			for(var i=0; i < sons.length; i++) {
				if((contains(nodesToExpand,sons[i]) == false) && (contains(closedNodes,sons[i]) == false)) {
					nodesToExpand.splice(getPos(nodesToExpand,sons[i]), 0, sons[i]);
					colorsACell(sons[i].state.row,sons[i].state.col,"#6B8E23");
				}
			}
		}
		if(!(p.goalTest(n))) {
			colorsACell(n.state.row,n.state.col,"#2F4F4F");
		}
	}
}*/

/* QUESTA FUNZIONE CALCOLA IL PATH MOSTRANDO L'ANIMAZIONE */
function searchPathAnimation(p) {
	var nodesToExpand = new Array();
	var closedNodes = new Array();
	nodesToExpand.push(new Nodo(0,p.getHeuristicCost(p.initState),p.initState));
	timer = setInterval(function(){ 
							if(nodesToExpand.length > 0) {
								var n = nodesToExpand.shift();
								console.log("Exploring state:",n.state.row,n.state.col)
								closedNodes.push(n);
								if(p.goalTest(n)) { 
									clearInterval(timer);
									showPath(p.initState,n,"#DC143C",nodesToExpand.length,closedNodes.length);
								} else {
									var sons = getSons(n,p);
									for(var i=0; i < sons.length; i++) {
										if((contains(nodesToExpand,sons[i]) == false) && (contains(closedNodes,sons[i]) == false)) {
											nodesToExpand.splice(getPos(nodesToExpand,sons[i]), 0, sons[i]);
											colorsACell(sons[i].state.row,sons[i].state.col,"#6B8E23");
										}
									}
									colorsACell(n.state.row,n.state.col,"#2F4F4F");
								}
								
							}
							else {
								clearInterval(timer);
							}
						}
						,MSEC);
}

function contains2(arr,nodo) {
	for(var i = 0; i<arr.length; i++) {
		if((nodo.state.row == arr[i].state.row) && (nodo.state.col == arr[i].state.col)) {
			return i;
		}
	}
	return -1;
}

function searchPathAnimation2(p) {
	var nodesToExpand = new Array();
	var closedNodes = new Array();
	nodesToExpand.push(new Nodo(0,p.getHeuristicCost(p.initState),p.initState));
	timer = setInterval(function(){ 
							if(nodesToExpand.length > 0) {
								var n = nodesToExpand.shift();
								closedNodes.push(n);
								if(p.goalTest(n)) { 
									clearInterval(timer);
									showPath(p.initState,n,"#DC143C",nodesToExpand.length,closedNodes.length);
								} else {
									var sons = getSons(n,p);
									for(var i=0; i < sons.length; i++) {
										if(contains2(closedNodes,sons[i]) == -1) {
											var pos = contains2(nodesToExpand,sons[i])
											if (pos == -1) {
												nodesToExpand.splice(getPos(nodesToExpand,sons[i]), 0, sons[i]);
												colorsACell(sons[i].state.row,sons[i].state.col,"#6B8E23");
											} else {
												if(sons[i].fCost<nodesToExpand[pos].fCost){
													console.log("Metto ",sons[i].parentNode.state.row,sons[i].parentNode.state.col)
													console.log("al posto di ",nodesToExpand[pos].parentNode.state.row,nodesToExpand[pos].parentNode.state.col)
													nodesToExpand[pos]= new Nodo(sons[i].gCost,sons[i].hCost, new Stato(sons[i].state.row,sons[i].state.col,sons[i].state.enable),sons[i].parentNode)

												}
											}
										}
									}
									colorsACell(n.state.row,n.state.col,"#2F4F4F");
								}
								
							}
							else {
								clearInterval(timer);
							}
						}
						,MSEC);
}

function start() {
	p = new Problem(labirinto,initState,goalState)
	setTimeout(function(){ searchPathAnimation2(p)},200);
} 




