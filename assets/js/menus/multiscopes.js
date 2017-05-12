
function scopeExists(scopeValue){
	return typeof myMultiScopes[scopeValue] != "undefined";
}

function saveMultiScope(){ mylog.log("saveMultiScope() try - userId = ",userId); mylog.dir(myMultiScopes);
	hideSearchResults();
	if(userId != null && userId != ""){
		if(!notEmpty(myMultiScopes)) myMultiScopes = {};
		$.ajax({
	        type: "POST",
	        url: baseUrl+"/"+moduleId+"/person/updatemultiscope",
	        data: {"multiscopes" : myMultiScopes},
	       	dataType: "json",
	    	success: function(data){
	    		//mylog.log("saveMultiScope() success");
	    		
		    },
			error: function(error){
				mylog.log("Une erreur est survenue pendant l'enregistrement des scopes");
			}
		});
	}else{
		
	}
	showCountScope();
	rebuildSearchScopeInput();
	saveCookieMultiscope();
}
function saveCookieMultiscope(){ 
	mylog.log("saveCookieMultiscope", typeof myMultiScopes, myMultiScopes);
	$.cookie('multiscopes',   	JSON.stringify(myMultiScopes), { expires: 365, path: location.pathname });
	/*if(location.hash.indexOf("#city.detail")==0)
		urlCtrl.loadByHash("#default.live");*/
}

function autocompleteMultiScope(){
	var scopeValue = $('#input-add-multi-scope').val();
	$("#dropdown-multi-scope-found").html("<li><i class='fa fa-refresh fa-spin'></i></li>");
	$.ajax({
        type: "POST",
        url: baseUrl+"/"+moduleId+"/city/autocompletemultiscope",
        data: {
        		type: currentScopeType, 
        		scopeValue: scopeValue
        },
       	dataType: "json",
    	success: function(data){
    		//mylog.log("autocompleteMultiScope() success");
    		//mylog.dir(data);
    		$("#dropdown-multi-scope-found").html("Aucun résultat");
    		html="";
    		var allCP = new Array();
    		var allCities = new Array();
    		$.each(data.cities, function(key, value){
    			if(currentScopeType == "city") { //mylog.log("in scope city");
    				val = value.country + '_' + value.insee; 
		    		lbl = (typeof value.name!= "undefined") ? value.name : ""; //value.name ;
		    		lblList = lbl + " (" +value.depName + ")";
		    		html += "<li><a href='javascript:' onclick='addScopeToMultiscope(\""+val+"\",\""+lbl+"\" )'>"+lblList+"</a></li>";
    				/*$.each(value.postalCodes, function(key, valueCP){
    					if($.inArray(valueCP.postalCode, allCP)<0){ 
	    					allCP.push(valueCP.postalCode);
		    				val = valueCP.postalCode; 
		    				lbl = valueCP.postalCode ;
		    				lblList = valueCP.name + ", " +valueCP.postalCode ;
		    				html += "<li><a href='javascript:' onclick='addScopeToMultiscope(\""+val+"\",\""+lbl+"\" )'>"+lblList+"</a></li>";
	    			}
	    			});*/
    			}; 
    			if(currentScopeType == "cp") { 
    				$.each(value.postalCodes, function(key, valueCP){ //mylog.log(allCities);
		    			//if($.inArray(valueCP.name, allCities)<0){ 
	    					//allCities.push(valueCP.name);
		    				val = valueCP.postalCode; 
		    				lbl = valueCP.postalCode ;
		    				lblList = valueCP.name + ", " +valueCP.postalCode ;
		    				html += "<li><a href='javascript:' onclick='addScopeToMultiscope(\""+val+"\",\""+lbl+"\" )'>"+lblList+"</a></li>";
    					//}
    				});
    			}; 
    			
    			if(currentScopeType == "dep" || currentScopeType == "region"){
    				val = value; lbl = value; lblList = value;
	    			html += "<li><a href='javascript:' onclick='addScopeToMultiscope(\""+val+"\",\""+lbl+"\" )'>"+lblList+"</a></li>";
	    		}
    		});
    		if(html != "")
    		$("#dropdown-multi-scope-found").html(html);
    		
	    },
		error: function(error){
    		$("#dropdown-multi-scope-found").html("error");
			mylog.log("Une erreur est survenue pendant autocompleteMultiScope");
		}
	});
}
/**********************************************/
function loadMultiScopes(){
	$.each(myMultiScopes, function(key, value){
		showScopeInMultiscope(key);
	});
	bindCommunexionScopeEvents();
	showCountScope();
	saveCookieMultiscope();
}
function showCountScope(){
	var count = 0; 
	var types = new Array("city", "cp", "dep", "region");
	//mylog.log("showCountScope");
	//mylog.dir(myMultiScopes);
	$.each(myMultiScopes, function(key, value){
		if(value.active==true) count++;
		//mylog.log(types.indexOf(value.type), value.type);
		if(types.indexOf(value.type)>-1)
			types.splice(types.indexOf(value.type), 1);
	});
	$.each(types, function(key, value){
		$("#multi-scope-list-"+value).hide();
	});
	$(".scope-count").html(count);
	//showTagsScopesMin(".list_tags_scopes");
	showEmptyMsg();
}
function selectAllScopes(select){
	if(typeof select == "undefined"){ select = true;
		$.each(myMultiScopes, function(key, value){
			 if(value.active) select = false;
		});
	}
	$.each(myMultiScopes, function(key, value){
		 toogleScopeMultiscope(key, select);
	});
	saveMultiScope();
}
function showScopeInMultiscope(scopeValue){ //mylog.log("showScopeInMultiscope()", scopeValue);
	var html = "";
	if(scopeExists(scopeValue)){
		var scope = myMultiScopes[scopeValue];
		if(typeof scope.name == "undefined") scope.name = scopeValue;
		var faActive = (myMultiScopes[scopeValue].active == true) ? "check-circle" : "circle-o";
		var classDisable = (myMultiScopes[scopeValue].active == false) ? "disabled" : "";
		html = 
		'<span class="item-scope-input bg-red item-scope-'+scope.type+' '+classDisable+'" data-scope-value="'+scopeValue+'">' +
				'<a href="javascript:" class="item-scope-checker tooltips"' +
					'data-toggle="tooltip" data-placement="bottom" ' +
					'title="Activer/Désactiver" data-scope-value="'+scopeValue+'">' +
					'<i class="fa fa-'+faActive+'"></i>' +
				'</a>' +
				'<span class="item-scope-name" >'+scope.name+'</span>' +
				'<a href="javascript:" class="item-scope-deleter tooltips"' +
					'data-toggle="tooltip" data-placement="bottom" ' +
					'title="Supprimer" data-scope-value="'+scopeValue+'">' +
					'<i class="fa fa-times"></i>' +
			'</a>' +
		'</span>';
		$("#multi-scope-list-"+scope.type).append(html);
		$("#multi-scope-list-"+scope.type).show();
		if(actionOnSetGlobalScope=="save")
			$("#scopeListContainerForm").html(html);
		//$(".item-scope-checker").off().click(function(){alert(); toogleScopeMultiscope( $(this).data("scope-value")) });
		$(".item-scope-deleter").off().click(function(){ deleteScopeInMultiscope( $(this).data("scope-value")); });
		//showMsgInfoMultiScope("Le scope a bien été ajouté", "success");
	}else{
		html = "";
		//showMsgInfoMultiScope("showScopeInMultiscope error : ce lieu n'existe pas - " + scopeValue, "error");
	}
	
	$(".tooltips").tooltip();
}

//scopeValue est la valeur utilisée pour la recherche
//scopeName est la valeur affichée
function addScopeToMultiscope(scopeValue, scopeName){  
	if(scopeValue == "") return;
	if(!scopeExists(scopeValue)){ //mylog.log("adding", scopeValue);
		myMultiScopes[scopeValue] = { name: scopeName, active: true, type: currentScopeType };
		showScopeInMultiscope(scopeValue);
		$("#input-add-multi-scope").val("");
		saveMultiScope();
	}else{
		showMsgInfoMultiScope("Ce lieu est déjà dans votre liste", "info");
	}
	$("#dropdown-multi-scope-found").hide();
}


function deleteScopeInMultiscope(scopeValue){ //mylog.log("deleteScopeInMultiscope(scopeValue)", scopeValue);
	if(scopeExists(scopeValue)){
		delete myMultiScopes[scopeValue];
		$("[data-scope-value='"+scopeValue+"']").remove();
		saveMultiScope();
	}
	//mylog.dir(myMultiScopes);
}

function toogleScopeMultiscope(scopeValue){ mylog.log("toogleScopeMultiscope(scopeValue)", scopeValue);
	if(scopeExists(scopeValue)){
		myMultiScopes[scopeValue].active = !myMultiScopes[scopeValue].active;
		
		if(typeof selected == "undefined") saveMultiScope();
		else myMultiScopes[scopeValue].active = selected;
		
		/*if(myMultiScopes[scopeValue].active){
			$("[data-scope-value='"+scopeValue+"'] .item-scope-checker i.fa").removeClass("fa-circle-o");
			$("[data-scope-value='"+scopeValue+"'] .item-scope-checker i.fa").addClass("fa-check-circle");
			$("[data-scope-value='"+scopeValue+"'].item-scope-input").removeClass("disabled");
		}else{
			$("[data-scope-value='"+scopeValue+"'] .item-scope-checker i.fa").addClass("fa-circle-o");
			$("[data-scope-value='"+scopeValue+"'] .item-scope-checker i.fa").removeClass("fa-check-circle");
			$("[data-scope-value='"+scopeValue+"'].item-scope-input").addClass("disabled");
		}*/
		console.log("before rebuildSearchScopeInput from toogleScope");
		rebuildSearchScopeInput();
	}else{
		//showMsgInfoMultiScope("Ce scope n'existe pas", "danger");
	}
}

function getMultiScopeList(){ return myMultiScopes; }

var timerMsgMultiscope;
function showMsgInfoMultiScope(msg, type){
	if(type == "success") msg = "<i class='fa fa-check'></i> " + msg;
	if(type == "danger") msg = "<i class='fa fa-times'></i> " + msg;
	if(type == "info") msg = "<i class='fa fa-info-circle'></i> " + msg;
	
	var id = "#lbl-info-select-multi-scope";
	$(id).html(msg);
	if(type == "success") $(id).addClass("label-success"); else $(id).removeClass("label-success");
	if(type == "danger") $(id).addClass("label-danger"); else $(id).removeClass("label-danger");
	if(type == "info") $(id).addClass("label-info"); else $(id).removeClass("label-info");

	$(id).off().hide();
	$(id).show(200);

	if(typeof timerMsgMultiscope != "undefined") clearTimeout(timerMsgMultiscope);
	timerMsgMultiscope = setTimeout(function(){ $(id).off().hide(500)}, 3000);
}

/**********************************************/

function rebuildSearchScopeInput()
{ console.log("rebuildSearchScopeInput");
	$("#searchLocalityLEVEL").val("");
	/*****************************************************************************************/
	searchLocalityCITYKEYs = "";
	$.each($('.item-scope-city'), function(key, value){
		if(!$(value).hasClass('disabled')){
			key = $(value).data("scope-value");
			searchLocalityCITYKEYs += (searchLocalityCITYKEYs == "") ? key :   ","+key;
		}
	});
	//mylog.log("searchLocalityCITYKEYs",searchLocalityCITYKEYs);
	if( $("#searchLocalityCITYKEY") )
		$("#searchLocalityCITYKEY").val(searchLocalityCITYKEYs);

	/*****************************************************************************************/
	searchLocalityCODE_POSTALs = "";
	$.each($('.item-scope-cp'), function(key, value){
		if(!$(value).hasClass('disabled')){
			key = $(value).data("scope-value");
			searchLocalityCODE_POSTALs += (searchLocalityCODE_POSTALs == "") ? key :   ","+key;
		}
	});
	//mylog.log("searchLocalityCODE_POSTALs",searchLocalityCODE_POSTALs);
	if( $("#searchLocalityCODE_POSTAL") )
		$("#searchLocalityCODE_POSTAL").val(searchLocalityCODE_POSTALs);

	/*****************************************************************************************/
	searchLocalityDEPARTEMENTs = "";
	$.each($('.item-scope-dep'), function(key, value){
		if(!$(value).hasClass('disabled')){
			key = $(value).data("scope-value");
			searchLocalityDEPARTEMENTs += (searchLocalityDEPARTEMENTs == "") ? key :   ","+key;
		}
	});
	//mylog.log("searchLocalityDEPARTEMENTs",searchLocalityDEPARTEMENTs);
	if( $("#searchLocalityDEPARTEMENT") )
		$("#searchLocalityDEPARTEMENT").val(searchLocalityDEPARTEMENTs);

	/*****************************************************************************************/
	searchLocalityREGIONs = "";
	$.each($('.item-scope-region'), function(key, value){
		if(!$(value).hasClass('disabled')){
			key = $(value).data("scope-value");
			searchLocalityREGIONs += (searchLocalityREGIONs == "") ? key :   ","+key;
		}
	});
	//mylog.log("searchLocalityREGIONs",searchLocalityREGIONs);
	if( $("#searchLocalityREGION") )
		$("#searchLocalityREGION").val(searchLocalityREGIONs);

	
	$(".list_tags_scopes").removeClass("tagOnly");
	$(".city-name-locked").html("");
	//if( typeof searchCallback == "function" )
		//searchCallback();
}


function lockScopeOnCityKey(cityKey, cityName){ //mylog.log("lockScopeOnCityKey", cityKey);
	$("#searchLocalityCITYKEY").val(cityKey);
	$("#searchLocalityCODE_POSTAL").val("");
	$("#searchLocalityDEPARTEMENT").val("");
	$("#searchLocalityREGION").val("");
	$(".list_tags_scopes").addClass("tagOnly");

	var insee = cityKeyPart(cityKey, "insee");
	var cp = cityKeyPart(cityKey, "cp");
	var url = "#city.detail.insee." + insee;
	if(cp != "") url += ".postalCode." + cityKeyPart(cityKey, "cp");
	
	$(".city-name-locked").html("<a href='javascript:' class='text-red'>"+
									"<i class='fa fa-lock tooltips' id='cadenas' data-toggle='tooltip' data-placement='top' title='Débloquer'></i>"+
								"</a> <a href='"+url+"' class='lbh homestead text-red tooltips' data-toggle='tooltip' data-placement='top' title='Retourner sur la page'>"+ cityName + "</a>" );

	$(".city-name-locked").click(function(){
		rebuildSearchScopeInput();
	});
	$("#cadenas").mouseover(function(){
		$("#cadenas").removeClass("fa-lock").addClass("fa-unlock");
	});
	$("#cadenas").mouseout(function(){
		$("#cadenas").addClass("fa-lock").removeClass("fa-unlock");
	});
}

function openDropdownMultiscope(){
	if(!$("#dropdown-content-multi-scope").hasClass('open'))
	setTimeout(function(){ $("#dropdown-content-multi-scope").addClass('open'); }, 300);
}

function setGlobalScope(scopeValue, scopeName, scopeType, scopeLevel,
						  inseeCommunexion, cityNameCommunexion, cpCommunexion, 
						  regionNameCommunexion, countryCommunexion){  
	mylog.log("setGlobalScope", scopeValue, scopeName, scopeType, scopeLevel,
			  inseeCommunexion, cityNameCommunexion, cpCommunexion, regionNameCommunexion, countryCommunexion);
	if(scopeValue == "") return;
	//if(!scopeExists(scopeValue)){ //mylog.log("adding", scopeValue);
		//myMultiScopes[scopeValue] = { name: scopeName, active: true, type: scopeType };
		mylog.log("myMultiScopes", myMultiScopes, indexStepInit);
		$("#searchLocalityCITYKEY").val("");
		$("#searchLocalityCODE_POSTAL").val("");
		$("#searchLocalityDEPARTEMENT").val("");
		$("#searchLocalityREGION").val("");
		if(scopeType == "city") {$("#searchLocalityCITYKEY").val(scopeValue);} 
		if(scopeType == "cp") $("#searchLocalityCODE_POSTAL").val(scopeValue);
		if(scopeType == "dep") $("#searchLocalityDEPARTEMENT").val(scopeValue);
		if(scopeType == "region") $("#searchLocalityREGION").val(scopeValue);
		$("#searchLocalityLEVEL").val(scopeLevel);
		$("#main-scope-name").html('<i class="fa fa-university"></i> ' + scopeName + "<small class='text-dark'>.CO</small>");
		$.cookie('communexionType', scopeType, { expires: 365, path: "/" });
		$.cookie('communexionValue', scopeValue, { expires: 365, path: "/" });
		$.cookie('communexionName', scopeName, { expires: 365, path: "/" });
		$.cookie('communexionLevel', scopeLevel, { expires: 365, path: "/" });
		//$.cookie('currentLevel', scopeType, { expires: 365, path: "/" });
	
		if(inseeCommunexion != null){
			$.cookie('inseeCommunexion',   		inseeCommunexion,  		{ expires: 365, path: "/" });
			$.cookie('cityNameCommunexion', 	cityNameCommunexion,	{ expires: 365, path: "/" });
			$.cookie('cpCommunexion',   		cpCommunexion,  		{ expires: 365, path: "/" });		
			//$.cookie('regionNameCommunexion',   regionNameCommunexion,  { expires: 365, path: "/" });
			//$.cookie('countryCommunexion',   	countryCommunexion,  	{ expires: 365, path: "/" });
		}else{
			if(actionOnSetGlobalScope == "filter"){
				if(location.hash.indexOf("#live") > 0)
                	startNewsSearch(true);
            	else
					startSearch(0, indexStepInit, searchCallback);
			}
		}
		//rebuildSearchScopeInput();
		//activateGlobalCommunexion(true);
		//startSearch(0, indexStepInit, searchCallback);
		//loadByHash(location.hash);
}

//vision city : scoping global for all applications
//levelCO == city cp dep region
