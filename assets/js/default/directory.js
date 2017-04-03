
var indexStepInit = 30;
var indexStep = indexStepInit;
var currentIndexMin = 0;
var currentIndexMax = indexStep;
var scrollEnd = false;
var totalData = 0;

var timeout = null;
var searchType = '';
var searchSType = '';

var translate = {"organizations":"Organisations",
                 "projects":"Projets",
                 "events":"Événements",
                 "people":"Citoyens",
                 "followers":"Ils nous suivent"};

function startSearch(indexMin, indexMax, callBack){
    console.log("startSearch 1", typeof callBack, callBack, loadingData);
    if(loadingData) return;
    loadingData = true;
    
    //mylog.log("loadingData true");
    indexStep = indexStepInit;

    mylog.log("startSearch", indexMin, indexMax, indexStep, searchType);

	  var name = ($('#main-search-bar').length>0) ? $('#main-search-bar').val() : "";
    
    if(name == "" && searchType.indexOf("cities") > -1) return;  

    if(typeof indexMin == "undefined") indexMin = 0;
    if(typeof indexMax == "undefined") indexMax = indexStep;

    currentIndexMin = indexMin;
    currentIndexMax = indexMax;

    if(indexMin == 0 && indexMax == indexStep) {
      totalData = 0;
      mapElements = new Array(); 
    }
    else{ if(scrollEnd) return; }
    
    if(name.length>=3 || name.length == 0)
    {
      var locality = "";
      if( communexionActivated )
      {
  	    if(typeof(cityInseeCommunexion) != "undefined")
        {
    			if(levelCommunexion == 1) locality = cpCommunexion;
    			if(levelCommunexion == 2) locality = inseeCommunexion;
    		}else{
    			if(levelCommunexion == 1) locality = inseeCommunexion;
    			if(levelCommunexion == 2) locality = cpCommunexion;
    		}
        //if(levelCommunexion == 3) locality = cpCommunexion.substr(0, 2);
        if(levelCommunexion == 3) locality = inseeCommunexion;
        if(levelCommunexion == 4) locality = inseeCommunexion;
        if(levelCommunexion == 5) locality = "";
      } 
      autoCompleteSearch(name, locality, indexMin, indexMax, callBack);
    }  
}


function addSearchType(type){
  $.each(allSearchType, function(key, val){
    removeSearchType(val);
  });

  var index = searchType.indexOf(type);
  if (index == -1) {
    searchType.push(type);
    //$(".search_"+type).removeClass("active"); //fa-circle-o");
    $(".search_"+type).addClass("active"); //fa-check-circle-o");
  }
}


function removeSearchType(type){
  var index = searchType.indexOf(type);
  if (index > -1 && searchType.length > 1) {
    searchType.splice(index, 1);
    $(".search_"+type).removeClass("active"); //fa-check-circle-o");
    //$(".search_"+type).addClass("fa-circle-o");
  }
}

var loadingData = false;
var mapElements = new Array(); 


function autoCompleteSearch(name, locality, indexMin, indexMax, callBack){
  console.log("autoCompleteSearch 2", typeof callBack, callBack);
	if(typeof(cityInseeCommunexion) != "undefined"){
	    var levelCommunexionName = { 1 : "CODE_POSTAL_INSEE",
	                             2 : "INSEE",
	                             3 : "DEPARTEMENT",
	                             4 : "REGION"
	                           };
	}else{
		var levelCommunexionName = { 1 : "INSEE",
	                             2 : "CODE_POSTAL_INSEE",
	                             3 : "DEPARTEMENT",
	                             4 : "REGION"
	                           };
	}
    //mylog.log("levelCommunexionName", levelCommunexionName[levelCommunexion]);
    var data = {
      "name" : name, 
      "locality" : "",//locality, 
      "searchType" : searchType, 
      "searchTag" : ($('#searchTags').length ) ? $('#searchTags').val().split(',') : [] , //is an array
      "searchLocalityCITYKEY" : ($('#searchLocalityCITYKEY').length ) ? $('#searchLocalityCITYKEY').val().split(',') : [],
      "searchLocalityCODE_POSTAL" : ($('#searchLocalityCODE_POSTAL').length ) ? $('#searchLocalityCODE_POSTAL').val().split(',') : [], 
      "searchLocalityDEPARTEMENT" : ($('#searchLocalityDEPARTEMENT').length ) ?  $('#searchLocalityDEPARTEMENT').val().split(',') : [],
      "searchLocalityREGION" : ($('#searchLocalityREGION').length ) ? $('#searchLocalityREGION').val().split(',') : [],
      "searchBy" : levelCommunexionName[levelCommunexion], 
      "indexMin" : indexMin, 
      "indexMax" : indexMax
    };

    
				

    if(searchSType != "")
      data.searchSType = searchSType;

    searchSType = "";

    loadingData = true;
    
    str = "<i class='fa fa-circle-o-notch fa-spin'></i>";
    $(".btn-start-search").html(str);
    $(".btn-start-search").addClass("bg-azure");
    $(".btn-start-search").removeClass("bg-dark");
    
    if(indexMin > 0)
      $("#btnShowMoreResult").html("<i class='fa fa-spin fa-circle-o-notch'></i> Recherche en cours ...");
    else
      $("#dropdown_search").html("<div class='col-md-12 col-sm-12 text-center search-loader text-dark'>"+
                                    "<i class='fa fa-spin fa-circle-o-notch'></i> Recherche en cours ..."+
                                  "</div>");
    
    if(isMapEnd)
      $("#map-loading-data").html("<i class='fa fa-spin fa-circle-o-notch'></i> chargement en cours");
   
    mylog.dir(data);
    //alert();
    $.ajax({
        type: "POST",
        url: baseUrl+"/" + moduleId + "/search/globalautocomplete",
        data: data,
        dataType: "json",
        error: function (data){
             mylog.log("error autocomplete search"); mylog.dir(data);     
             //signal que le chargement est terminé
            loadingData = false;     
        },
        success: function(data){ mylog.log("success autocomplete search"); //mylog.dir(data);
            if(!data){ toastr.error(data.content); }
            else
            {
              var countData = 0;
            	$.each(data, function(i, v) { if(v.length!=0){ countData++; } });
              
              totalData += countData;
            
              str = "";
              var city, postalCode = "";

              //parcours la liste des résultats de la recherche
              //mylog.dir(data);
              str += '<div class="col-md-12 text-left" id="">';
              str += "<h4 style='margin-bottom:10px; margin-left:15px;' class='text-dark'>"+
                        "<i class='fa fa-angle-down'></i> " + totalData + " résultats ";
              str += "<small>";
              if(typeof headerParams != "undefined"){
                $.each(searchType, function(key, val){
                  var params = headerParams[val];
                  str += "<span class='text-"+params.color+"'>"+
                            "<i class='fa fa-"+params.icon+" hidden-sm hidden-md hidden-lg padding-5'></i> <span class='hidden-xs'>"+params.name+"</span>"+
                          "</span> ";
                });//console.log("myMultiTags", myMultiTags);
                $.each(myMultiTags, function(key, val){
                  var params = headerParams[val];
                  str += "<span class='text-dark hidden-xs pull-right'>"+
                            "#"+key+
                          "</span> ";
                });
              }
              str += "</small>";
              str += "</h4>";
              str += "<hr style='float:left; width:100%;'/>";
              str += "</div>";
              
              str += directory.showResultsDirectoryHtml(data);
              
              if(str == "") { 
	              $.unblockUI();
                showMap(false);
                  $(".btn-start-search").html("<i class='fa fa-refresh'></i>"); 
                  if(indexMin == 0){
                    //ajout du footer   
                    var msg = "<i class='fa fa-ban'></i> Aucun résultat";    
                    if(name == "" && locality == "") msg = "<h3 class='text-dark padding-20'><i class='fa fa-keyboard-o'></i> Préciser votre recherche pour plus de résultats ...</h3>"; 
                    str += '<div class="pull-left col-md-12 text-left" id="footerDropdown" style="width:100%;">';
                    str += "<hr style='float:left; width:100%;'/><h3 style='margin-bottom:10px; margin-left:15px;' class='text-dark'>"+msg+"</h3><br/>";
                    str += "</div>";
                    $("#dropdown_search").html(str);
                    $("#searchBarText").focus();
                  }
                     
              }
              else
              {       
                //ajout du footer      	
                str += '<div class="pull-left col-md-12 text-center" id="footerDropdown" style="width:100%;">';
                str += "<hr style='float:left; width:100%;'/><h3 style='margin-bottom:10px; margin-left:15px;' class='text-dark'>" + totalData + " résultats</h3>";
                //str += '<span class="" id="">Complétez votre recherche pour un résultat plus précis</span></center><br/>';
                //str += '<button class="btn btn-default" id="btnShowMoreResult"><i class="fa fa-angle-down"></i> Afficher plus de résultat</div></center>';
                str += "</div>";

                //si on n'est pas sur une première recherche (chargement de la suite des résultat)
                if(indexMin > 0){
                    //on supprime l'ancien bouton "afficher plus de résultat"
                    $("#btnShowMoreResult").remove();
                    //on supprimer le footer (avec nb résultats)
                    $("#footerDropdown").remove();

                    //on calcul la valeur du nouveau scrollTop
                    var heightContainer = $(".main-container")[0].scrollHeight - 180;
                    //on affiche le résultat à l'écran
                    $("#dropdown_search").append(str);
                    //on scroll pour afficher le premier résultat de la dernière recherche
                    $(".my-main-container").animate({"scrollTop" : heightContainer}, 1700);
                    //$(".my-main-container").scrollTop(heightContainer);

                //si on est sur une première recherche
                }else{
                    //on affiche le résultat à l'écran
                    $("#dropdown_search").html(str);

                    if(typeof myMultiTags != "undefined"){
                    $.each(myMultiTags, function(key, value){ //mylog.log("binding bold "+key);
                      $("[data-tag-value='"+key+"'].btn-tag").addClass("bold");
                    });
                    }
                  
                }
                //remet l'icon "loupe" du bouton search
                $(".btn-start-search").html("<i class='fa fa-refresh'></i>");
                //active les link lbh
                bindLBHLinks();

                 $(".start-new-communexion").click(function(){  
                    setGlobalScope( $(this).data("scope-value"), $(this).data("scope-name"), $(this).data("scope-type"),
                                     $(this).data("insee-communexion"), $(this).data("name-communexion"), $(this).data("cp-communexion"),
                                      $(this).data("region-communexion"), $(this).data("country-communexion") ) ;
                    activateGlobalCommunexion(true);
                });


                $.unblockUI();
                $("#map-loading-data").html("");
                
                //initialise les boutons pour garder une entité dans Mon répertoire (boutons links)
                initBtnLink();

    	        } //end else (str=="")

              //signal que le chargement est terminé
              loadingData = false;

              //quand la recherche est terminé, on remet la couleur normal du bouton search
    	        $(".btn-start-search").removeClass("bg-azure");
        	  }

            //si le nombre de résultat obtenu est inférieur au indexStep => tous les éléments ont été chargé et affiché
            //mylog.log("SHOW MORE ?", countData, indexStep);
            if(countData < indexStep){
              $("#btnShowMoreResult").remove(); 
              scrollEnd = true;
            }else{
              scrollEnd = false;
            }

            if( typeof page != "undefined" && page == "agenda" && typeof showResultInCalendar != "undefined")
              showResultInCalendar(data);

            if(mapElements.length==0) mapElements = data;
            else $.extend(mapElements, data);
            
            //affiche les éléments sur la carte
            if(CoSigAllReadyLoad)
            Sig.showMapElements(Sig.map, mapElements);
            else{
              setTimeout(function(){ 
                Sig.showMapElements(Sig.map, mapElements);
              }, 3000);
            }
            
            if(typeof callBack == "function")
                callBack();
        }
    });


  }


  function initBtnLink(){ mylog.log("initBtnLink");
      
    $('.tooltips').tooltip();
  	//parcours tous les boutons link pour vérifier si l'entité est déjà dans mon répertoire
  	$.each( $(".followBtn"), function(index, value){
    	var id = $(value).attr("data-id");
   		var type = $(value).attr("data-type");
      mylog.log("error type :", type);
   		if(type == "person") type = "people";
   		else type = typeObjLib.get(type).col;
      //mylog.log("#floopItem-"+type+"-"+id);
   		if($("#floopItem-"+type+"-"+id).length){
   			//mylog.log("I FOLLOW THIS");
   			if(type=="people"){
	   			$(value).html("<i class='fa fa-unlink text-green'></i>");
	   			$(value).attr("data-original-title", "Ne plus suivre cette personne");
	   			$(value).attr("data-ownerlink","unfollow");
   			}
   			else{
	   			$(value).html("<i class='fa fa-user-plus text-green'></i>");
	   			
          if(type == "organizations")
	   				$(value).attr("data-original-title", "Vous êtes membre de cette organization");
	   			else if(type == "projects")
	   				$(value).attr("data-original-title", "Vous êtes contributeur de ce projet");
	   			
          //(value).attr("onclick", "");
	   			$(value).removeClass("followBtn");
	   		}
   		}
   		if($(value).attr("data-isFollowed")=="true"){

	   		$(value).html("<i class='fa fa-unlink text-green'></i>");
	   		$(value).attr("data-original-title", (type == "events") ? "Ne plus participer" : "Ne plus suivre" );
			  $(value).attr("data-ownerlink","unfollow");
        $(value).addClass("followBtn");
   		}
   	});

  	//on click sur les boutons link
   	$(".followBtn").click(function(){
	   	formData = new Object();
   		formData.parentId = $(this).attr("data-id");
   		formData.childId = userId;
   		formData.childType = personCOLLECTION;
   		var type = $(this).attr("data-type");
   		var name = $(this).attr("data-name");
   		var id = $(this).attr("data-id");
   		//traduction du type pour le floopDrawer
   		var typeOrigine = typeObjLib.get(type).col;
      if(typeOrigine == "persons"){ typeOrigine = personCOLLECTION;}
   		formData.parentType = typeOrigine;
   		if(type == "person") type = "people";
   		else type = typeObjLib.get(type).col;

		var thiselement = this;
		$(this).html("<i class='fa fa-spin fa-circle-o-notch text-azure'></i>");
		//mylog.log(formData);
    var linkType = (type == "events") ? "connect" : "follow";
		if ($(this).attr("data-ownerlink")=="follow"){
			$.ajax({
				type: "POST",
				url: baseUrl+"/"+moduleId+"/link/"+linkType,
				data: formData,
				dataType: "json",
				success: function(data) {
					if(data.result){
						toastr.success(data.msg);	
						$(thiselement).html("<i class='fa fa-unlink text-green'></i>");
						$(thiselement).attr("data-ownerlink","unfollow");
						$(thiselement).attr("data-original-title", (type == "events") ? "Ne plus participer" : "Ne plus suivre");
						addFloopEntity(id, type, data.parentEntity);
					}
					else
						toastr.error(data.msg);
				},
			});
		} else if ($(this).attr("data-ownerlink")=="unfollow"){
			formData.connectType =  "followers";
			//mylog.log(formData);
			$.ajax({
				type: "POST",
				url: baseUrl+"/"+moduleId+"/link/disconnect",
				data : formData,
				dataType: "json",
				success: function(data){
					if ( data && data.result ) {
						$(thiselement).html("<i class='fa fa-chain'></i>");
						$(thiselement).attr("data-ownerlink","follow");
						$(thiselement).attr("data-original-title", (type == "events") ? "Participer" : "Suivre");
						removeFloopEntity(data.parentId, type);
						toastr.success(trad["You are not following"]+data.parentEntity.name);
					} else {
					   toastr.error("You leave succesfully");
					}
				}
			});
		}
   	});
   	//on click sur les boutons link
    // $(".btn-tag").click(function(){
    //   setSearchValue($(this).html());
    // });
  }



  function setSearchValue(value){
    $("#searchBarText").val(value);
    startSearch(0, indexStepInit);
  }

  
  
function searchCallback() { 
  directory.elemClass = '.searchEntityContainer ';
  directory.filterTags(true);
  //$(".btn-tag").off().on("click",function(){ directory.toggleEmptyParentSection(null,"."+$(this).data("tag-value"), directory.elemClass, 1)});
  $("#searchBarTextJS").off().on("keyup",function() { 
    directory.search ( null, $(this).val() );
  });
}

var directory = {

    elemClass : smallMenu.destination+' .searchEntityContainer ',
    path : 'div'+smallMenu.destination+' div.favSection',
    tagsT : [],
    scopesT :[],
    multiTagsT : [],
    multiScopesT :[],

    colPos: "left",

    defaultPanelHtml : function(params){
      mylog.log("----------- defaultPanelHtml",params.type,params.name);
      str = "";  
      str += "<div class='col-lg-4 col-md-6 col-sm-6 col-xs-12 searchEntityContainer "+params.type+" "+params.elTagsList+" '>";
      str +=    "<div class='searchEntity'>";

      if(params.itemType!="city" && (params.useMinSize))
          str += "<div class='imgHover'>" + params.imgProfil + "</div>"+
                  "<div class='contentMin'>";

        if(userId != null && userId != "" && params.id != userId){
          isFollowed=false;
          if(typeof params.isFollowed != "undefined" ) isFollowed=true;
          if(params.type!="cities" && params.type!="poi" && params.type!="surveys" && params.type!="actions" ){
            tip = (type == "events") ? "Participer" : 'Suivre';
            str += "<a href='javascript:;' class='btn btn-default btn-sm btn-add-to-directory bg-white tooltips followBtn'" + 
                  'data-toggle="tooltip" data-placement="left" data-original-title="'+tip+'"'+
                  " data-ownerlink='follow' data-id='"+params.id+"' data-type='"+params.type+"' data-name='"+params.name+"' data-isFollowed='"+isFollowed+"'>"+
                      "<i class='fa fa-chain'></i>"+ //fa-bookmark fa-rotate-270
                    "</a>";
          }
        }


        if(params.updated != null && !params.useMinSize)
          str += "<div class='dateUpdated'><i class='fa fa-flash'></i> <span class='hidden-xs'>actif </span>" + params.updated + "</div>";

        if(params.itemType!="city" && (typeof params.size == "undefined" || params.size == "max"))
          str += "<a href='"+params.url+"' class='container-img-profil lbh add2fav'>" + params.imgProfil + "</a>";

        str += "<div class='padding-10 informations'>";


          if(!params.useMinSize){
            if(params.startDate != null)
            str += "<div class='entityDate dateFrom bg-"+params.color+" transparent badge'>" + params.startDate + "</div>";
            if(params.endDate != null)
            str += "<div  class='entityDate dateTo  bg-"+params.color+" transparent badge'>" + params.endDate + "</div>";
            
            if(typeof params.size == "undefined" || params.size == "max"){
              str += "<div class='entityCenter no-padding'>";
              str +=    "<a href='"+params.url+"' class='lbh add2fav'>" + params.htmlIco + "</a>";
              str += "</div>";
            }
          }  
              
            str += "<div class='entityRight no-padding'>";
                             
              
            if(notEmpty(params.parent) && notEmpty(params.parent.name))
              str += "<a href='"+urlParent+"' class='entityName text-"+params.parentColor+" lbh add2fav text-light-weight margin-bottom-5'>" +
                        "<i class='fa "+params.parentIcon+"'></i> "
                        + params.parent.name + 
                      "</a>";

            var iconFaReply = notEmpty(params.parent) ? "<i class='fa fa-reply fa-rotate-180'></i> " : "";
            str += "<a  href='"+params.url+"' class='"+params.size+" entityName text-dark lbh add2fav'>"+
                      iconFaReply + params.name + 
                   "</a>";
            
            var thisLocality = "";
            if(params.fullLocality != "" && params.fullLocality != " ")
                 thisLocality = "<a href='"+params.url+'\' data-id="' + params.dataId + '"' + "  class='entityLocality lbh add2fav'>"+
                                  "<i class='fa fa-home'></i> " + params.fullLocality + 
                                "</a>";
            else thisLocality = "<br>";
            
            if(itemType=="city"){
              var citykey = params.country + "_" + params.insee + "-" + params.cp;
              //$city["country"]."_".$city["insee"]."-".$city["cp"];
              mylog.log(o);
              thisLocality += "<button class='btn btn-sm btn-default item-globalscope-checker start-new-communexion' "+
                                      "data-scope-value='" + citykey + "' " + 
                                      "data-scope-name='" + params.name + "' " + 
                                      "data-scope-type='city' " + 
                                      "data-insee-communexion='" + params.insee + "' "+ 
                                      "data-name-communexion='" + params.name + "' "+ 
                                      "data-cp-communexion='" + params.cp + "' "+ 
                                      "data-region-communexion='" + params.regionName + "' "+ 
                                      "data-country-communexion='" + params.country + "' "+ 
                              ">"+
                                  "Communecter" + 
                              "</button>";

                              
            }

            //debat / actions
            if(notEmpty(params.parentRoom)){
              params.parentUrl = "";
              params.parentIco = "";
              if(type == "surveys"){ params.parentUrl = "#survey.entries.id."+params.survey; params.parentIco = "archive"; }
              else if(type == "actions") {params.parentUrl = "#rooms.actions.id."+params.room;params.parentIco = "cogs";}
              str += "<div class='entityDescription text-dark'><i class='fa fa-" + params.parentIco + "'></i><a href='" + params.parentUrl + "' class='lbh add2fav'> " + params.parentRoom.name + "</a></div>";
              if(notEmpty(params.parentRoom.parentObj)){
                var typeIcoParent = params.parentRoom.parentObj.typeSig;
                //mylog.log("typeIcoParent", params.parentRoom);

                var p = typeObjLib.get(typeIcoParent);
                params.icoParent = p.icon;
                params.colorParent = p.color;

                var thisLocality = notEmpty(params.parentRoom) && notEmpty(params.parentRoom.parentObj) && 
                              notEmpty(params.parentRoom.parentObj.address) ? 
                              params.parentRoom.parentObj.address : null;

                var postalCode = notEmpty(thisLocality) && notEmpty(thisLocality.postalCode) ? thisLocality.postalCode : "";
                var cityName = notEmpty(thisLocality) && notEmpty(thisLocality.addressLocality) ? thisLocality.addressLocality : "";

                thisLocality = postalCode + " " + cityName;
                if(thisLocality != " ") thisLocality = ", <small> " + thisLocality + "</small>";
                else thisLocality = "";

                var ctzCouncil = typeIcoParent=="city" ? "Conseil citoyen de " : "";
                str += "<div class='entityDescription text-"+params.colorParent+"'> <i class='fa "+params.icoParent+"'></i> <b>" + ctzCouncil + params.parentRoom.parentObj.name + "</b>" + thisLocality+ "</div>";
              

              }
            }else{
              str += thisLocality;
            }
            
            if(itemType == "entry"){
              var vUp   = notEmpty(params.voteUpCount)       ? params.voteUpCount.toString()        : "0";
              var vMore = notEmpty(params.voteMoreInfoCount) ? params.voteMoreInfoCount.toString()  : "0";
              var vAbs  = notEmpty(params.voteAbstainCount)  ? params.voteAbstainCount.toString()   : "0";
              var vUn   = notEmpty(params.voteUnclearCount)  ? params.voteUnclearCount.toString()   : "0";
              var vDown = notEmpty(params.voteDownCount)     ? params.voteDownCount.toString()      : "0";
              str += "<div class='pull-left margin-bottom-10 no-padding'>";
                str += "<span class='bg-green lbl-res-vote'><i class='fa fa-thumbs-up'></i> " + vUp + "</span>";
                str += " <span class='bg-blue lbl-res-vote'><i class='fa fa-pencil'></i> " + vMore + "</span>";
                str += " <span class='bg-dark lbl-res-vote'><i class='fa fa-circle'></i> " + vAbs + "</span>";
                str += " <span class='bg-purple lbl-res-vote'><i class='fa fa-question-circle'></i> " + vUn + "</span>";
                str += " <span class='bg-red lbl-res-vote'><i class='fa fa-thumbs-down'></i> " + vDown + "</span>";
              str += "</div>";
            }

            str += "<div class='entityDescription'>" + params.description + "</div>";
         
            str += "<div class='tagsContainer text-red'>"+params.tags+"</div>";

            if(params.useMinSize){
              if(params.startDate != null)
              str += "<div class='entityDate dateFrom bg-"+params.color+" transparent badge'>" + params.startDate + "</div>";
              if(params.endDate != null)
              str += "<div  class='entityDate dateTo  bg-"+params.color+" transparent badge'>" + params.endDate + "</div>";
              
              if(typeof params.size == "undefined" || params.size == "max"){
                str += "<div class='entityCenter no-padding'>";
                str +=    "<a href='"+params.url+"' class='lbh add2fav'>" + params.htmlIco + "</a>";
                str += "</div>";
              }
            }  

        if(params.type!="city" && (params.useMinSize))
          str += "</div>";
          str += "</div>";
        str += "</div>";
      str += "</div>";

      str += "</div>";
      return str;
    },
    // ********************************
    //  ELEMENT DIRECTORY PANEL
    // ********************************
    elementPanelHtml : function(params){
      mylog.log("----------- elementPanelHtml",params.type,params.name);
      str = "";  
      str += "<div class='col-lg-4 col-md-6 col-sm-6 col-xs-12 searchEntityContainer "+params.type+" "+params.elTagsList+" '>";
      str +=    "<div class='searchEntity'>";

      

        if(userId != null && userId != "" && params.id != userId){
          isFollowed=false;
          if(typeof params.isFollowed != "undefined" ) isFollowed=true;
           tip = (type == "events") ? "Participer" : 'Suivre';
            str += "<a href='javascript:;' class='btn btn-default btn-sm btn-add-to-directory bg-white tooltips followBtn'" + 
                  'data-toggle="tooltip" data-placement="left" data-original-title="'+tip+'"'+
                  " data-ownerlink='follow' data-id='"+params.id+"' data-type='"+params.type+"' data-name='"+params.name+"' data-isFollowed='"+isFollowed+"'>"+
                      "<i class='fa fa-chain'></i>"+ //fa-bookmark fa-rotate-270
                    "</a>";
          
        }

        if(params.updated != null )
          str += "<div class='dateUpdated'><i class='fa fa-flash'></i> <span class='hidden-xs'>actif </span>" + params.updated + "</div>";
        
        if(params.type == "citoyens") 
            params.url += '.viewer.' + userId;
        if(typeof params.size == "undefined" || params.size == "max")
          str += "<a href='"+params.url+"' class='container-img-profil lbh add2fav'>" + params.imgProfil + "</a>";

        str += "<div class='padding-10 informations'>";

        str += "<div class='entityRight no-padding'>";

            if(typeof params.size == "undefined" || params.size == "max"){
              str += "<div class='entityCenter no-padding'>";
              str +=    "<a href='"+params.url+"' class='lbh add2fav'>" + params.htmlIco + "</a>";
              str += "</div>";
            }

            var iconFaReply = notEmpty(params.parent) ? "<i class='fa fa-reply fa-rotate-180'></i> " : "";
            str += "<a  href='"+params.url+"' class='"+params.size+" entityName text-dark lbh add2fav'>"+
                      iconFaReply + params.name + 
                   "</a>";                 
            var thisLocality = "";
            if(params.fullLocality != "" && params.fullLocality != " ")
                 thisLocality = "<a href='"+params.url+'" data-id="' + params.dataId + '"' + "  class='entityLocality lbh add2fav'>"+
                                  "<i class='fa fa-home'></i> " + params.fullLocality + 
                                "</a>";
            else thisLocality = "<br>";
            
            str += thisLocality;
            
            str += "<div class='entityDescription'>" + params.description + "</div>";
         
            str += "<div class='tagsContainer text-red'>"+params.tagsLbl+"</div>";

              if(params.startDate != null)
              str += "<div class='entityDate dateFrom bg-"+params.color+" transparent badge'>" + params.startDate + "</div>";
              if(params.endDate != null)
              str += "<div  class='entityDate dateTo  bg-"+params.color+" transparent badge'>" + params.endDate + "</div>";
              
              
          str += "</div>";
        str += "</div>";
      str += "</div>";

      str += "</div>";
      return str;
    },
    // ********************************
    // CALCULATE NEXT PREVIOUS 
    // ********************************
    findNextPrev : function  (hash) { 
        mylog.log("----------- findNextPrev", hash);
        var p = 0;
        var n = 0;
        var nid = 0;
        var pid = 0;
        var  found = false;
        var l = $( '.searchEntityContainer .container-img-profil' ).length;
        $.each( $( '.searchEntityContainer .container-img-profil' ), function(i,val){
            console.log("found ??",$(val).attr('href'), hash);
            if( $(val).attr('href') == hash ){
                found = i;
                console.log("found",found);
                return false;
            }
        });
        
        prevIx = (found == 0) ? l-1 : found-1;
        p =  $( $('.searchEntityContainer .container-img-profil' )[ prevIx ] ).attr('href');
        pid = url.map(p).id;
        
        nextIx = (found == l-1) ? 0 : found+1;
        n = $( $('.searchEntityContainer .container-img-profil' )[nextIx] ).attr('href');
        nid =  url.map(n).id;
        
        console.log("next",n,nid);
        console.log("prev",p,pid);

        return {
            prev : "<a href='"+p+"' data-modalshow='"+pid+"' class='lbhp text-dark'><i class='fa fa-4x fa-arrow-circle-left'></i> </a> ",
            next : "<a href='"+n+"' data-modalshow='"+nid+"' class='lbhp text-dark'> <i class='fa fa-4x fa-arrow-circle-right'></i></a>"
        }
    },
    // ********************************
    //  DIRECTORY PREVIEW PANEL
    // ********************************
    //TODO : ADD link to seller contact page
    previewedObj : null,
    preview : function(params,hash){
        
      directory.previewedObj = {
          hash : hash,
          params : params
      };
      mylog.log("----------- preview",params,params.name, hash);

      str = '<div class="row">'+
              '<div class="col-lg-12 text-center" onclick="$(\'#\')">'+
                  '<h2 class="text-'+typeObj[params.type].color+'"><i class="fa fa-'+typeObj[params.type].icon+' fa-2x padding-bottom-10"></i><br>'+
                      '<span class="font-blackoutT"> '+trad[params.type]+'</span>'+
                  '</h2>'+
              '</div>'+
          '</div><br/><br/>';
      
      // ********************************
      // NEXT PREVIOUS 
      // ********************************
      var nav = directory.findNextPrev(hash);
      str += "<div class='col-xs-1 col-xs-offset-1'>"+nav.prev+"</div>";
      
      // ********************************
      // RIGHT SECTION
      // ********************************
      str += "<div class='col-xs-6 '>";

      if("undefined" != typeof params.profilImageUrl && params.profilImageUrl != "")
        str += '<div class="col-xs-6"><a class="thumb-info" href="'+baseUrl+params.profilImageUrl+'" data-title="" data-lightbox="all">'+
                  "<img class='img-responsive' src='"+baseUrl+params.profilImageUrl+"'/>"+
               '</a></div>';

      // ********************************
      // LEFT SECTION
      // ********************************
      str += "<div class='col-xs-6'>";
      
        cat = (typeof params.category != "undefined") ? params.section+" > "+params.category : "";
        if(params.type == "classified" && typeof params.category != "undefined")
          params.ico = (typeof classifiedTypes[params.category] != "undefined") ? "fa-" + classifiedTypes[params.category]["icon"] : "";
        
        subtype = (typeof params.subtype != "undefined") ? params.subtype+" > " : "";
        price = (typeof params.price != "undefined" && params.price != "") ? "<br/><i class='fa fa-money'></i> " + params.price : "";
        
        str += '<br><br><div class="row">'+
                '<div class="padding-5">'+
                    '<h2 class="text-dark no-margin hidden-xs" style="margin-top:5px!important;">'+
                        cat+" <i class='fa "+ params.ico +"'></i><br/><br/>"+ 
                        subtype+params.name +"<br/>"+
                        price+
                    '</h3>'+
                '</div>'+
            '</div><br/><br/>';

        if(typeof params.description != "undefined" && params.description != "")
            str += "<div class=''>" + params.description + "</div>";

            var thisLocality = "";
            if(params.fullLocality != "" && params.fullLocality != " ")
                 thisLocality = "<a href='"+params.url+'" data-id="' + params.dataId + '"' + "  class='entityLocality pull-right lbhp add2fav letter-red' data-modalshow='"+params.id+"'>"+
                                  "<i class='fa fa-home'></i> " + params.fullLocality + 
                                "</a>";
            //else thisLocality = "<br>";
            
            str += thisLocality;

            if(typeof params.contactInfo != "undefined" && params.contactInfo != "")
            str += "<div class='entityType letter-green'><i class='fa fa-address-card'></i> " + params.contactInfo + "</div>";
         
            str += "<div class='tagsContainer text-red'>"+params.tags+"</div>";

      str += "</div>";

      if( params.creator == userId )
      str += '<br/><br/><a href="javascript:elementLib.openForm(\'classified\', null, directory.previewedObj.params );" style="font-size:25px;" class="btn btn-default letter-green bold ">'+
                '<i class="fa fa-pencil"></i> Edit'+
            '</a>';

      str += "</div>";


      str += "<div class='col-xs-1 col-xs-offset-1'>"+nav.next+"</div>";

      // ********************************
      // ADD NEW Btn
      // ********************************
      str += '<div class="col-xs-12 text-center"> <br/><br/><a href="javascript:elementLib.openForm(\'classified\');" style="font-size:25px;" class="btn btn-default letter-green bold ">'+
                '<i class="fa fa-plus-circle"></i> CRÉER UNE ANNONCE'+
            '</a></div>';
      return str;
    },

    // ********************************
    // CLASSIFIED DIRECTORY PANEL
    // ********************************    
    classifiedPanelHtml : function(params){
      mylog.log("----------- classifiedPanelHtml",params,params.name);

      str = "";  
      str += "<div class='col-lg-6 col-md-12 pull- col-sm-12 col-xs-12 searchEntityContainer "+params.type+params.id+" "+params.type+" "+params.elTagsList+" '>";
      str +=    "<div class='searchEntity'>";
      
     // directory.colPos = directory.colPos == "left" ? "right" : "left";
       
      if(userId != null && userId != "" && params.id != userId){
          isFollowed=false;
          if(typeof params.isFollowed != "undefined" ) isFollowed=true;
           var tip = 'Garder en favoris';
            str += "<a href='javascript:;' class='btn btn-default btn-sm btn-add-to-directory bg-white tooltips followBtn'" + 
                  'data-toggle="tooltip" data-placement="left" data-original-title="'+tip+'"'+
                  " data-ownerlink='follow' data-id='"+params.id+"' data-type='"+params.type+"' data-name='"+params.name+"' data-isFollowed='"+isFollowed+"'>"+
                      "<i class='fa fa-star'></i>"+ //fa-bookmark fa-rotate-270
                    "</a>";
          
        }

        if(params.updated != null )
          str += "<div class='dateUpdated'><i class='fa fa-flash'></i> <span class='hidden-xs'>actif </span>" + params.updated + "</div>";
        
        if(params.type == "citoyens") 
            params.url += '.viewer.' + userId;
        if(typeof params.size == "undefined" || params.size == "max")
          str += "<a href='"+params.url+"' class='container-img-profil lbhp add2fav'  data-modalshow='"+params.id+"'>" + params.imgProfil + "</a>";

        str += "<div class='padding-10 informations'>";

        str += "<div class='entityRight no-padding'>";

            if(typeof params.size == "undefined" || params.size == "max"){
              str += "<div class='entityCenter no-padding'>";
              str +=    "<a href='"+params.url+"' class='lbhp add2fav' data-modalshow='"+params.id+"'>" + params.htmlIco + "</a>";
              str += "</div>";
            }

            if(typeof params.price != "undefined" && params.price != "")
            str += "<div class='entityPrice text-azure'><i class='fa fa-money'></i> " + params.price + "</div>";
         
            if(typeof params.category != "undefined"){
              str += "<div class='entityType bold'>" + params.section+" > "+params.category;
                if(typeof params.subtype != "undefined") str += " > " + params.subtype;
              str += "</div>";
            }

            var iconFaReply = notEmpty(params.parent) ? "<i class='fa fa-reply fa-rotate-180'></i> " : "";
            str += "<a  href='"+params.url+"' class='"+params.size+" entityName text-dark lbhp add2fav'  data-modalshow='"+params.id+"'>"+
                      iconFaReply + params.name + 
                   "</a>";  
       
            
            
            if(typeof params.description != "undefined" && params.description != "")
            str += "<div class='entityDescription'>" + params.description + "</div>";
            

            var thisLocality = "";
            if(params.fullLocality != "" && params.fullLocality != " ")
                 thisLocality = "<a href='"+params.url+'" data-id="' + params.dataId + '"' + "  class='entityLocality pull-right lbhp add2fav letter-red' data-modalshow='"+params.id+"'>"+
                                  "<i class='fa fa-home'></i> " + params.fullLocality + 
                                "</a>";
            //else thisLocality = "<br>";
            
            str += thisLocality;


            if(typeof params.contactInfo != "undefined" && params.contactInfo != "")
            str += "<div class='entityType letter-green'><i class='fa fa-address-card'></i> " + params.contactInfo + "</div>";
         
            str += "<div class='tagsContainer text-red'>"+params.tagsLbl+"</div>";

            if(params.startDate != null)
            str += "<div class='entityDate dateFrom bg-"+params.color+" transparent badge'>" + params.startDate + "</div>";
            if(params.endDate != null)
            str += "<div  class='entityDate dateTo  bg-"+params.color+" transparent badge'>" + params.endDate + "</div>";
      
          str += "</div>";
        str += "</div>";
      str += "</div>";

      str += "</div>";
      return str;
    },
    // ********************************
    // EVENT DIRECTORY PANEL
    // ********************************
    eventPanelHtml : function(params){
      mylog.log("-----------eventPanelHtml", params);
      str = "";  
      str += "<div class='col-xs-12 searchEntityContainer "+params.type+" "+params.elTagsList+" '>";
      str +=    "<div class='searchEntity'>";

        if(params.updated != null && params.updated.indexOf("il y a")>=0)
            params.updated = "En ce moment";

        if(params.updated != null && !params.useMinSize)
          str += "<div class='dateUpdated'><i class='fa fa-flash'></i> " + params.updated + "</div>";

        params.startDay = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("DD") : "";
        params.startMonth = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("MM") : "";
        params.startYear = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("YYYY") : "";
        params.startDayNum = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("d") : "";
        params.startTime = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("HH:mm") : "";
        params.startDate = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("DD MMMM YYYY - HH:mm") : null;
        
        params.endDay = notEmpty(params.endDate) ? moment(params.endDate).local().locale("fr").format("DD") : "";
        params.endMonth = notEmpty(params.endDate) ? moment(params.endDate).local().locale("fr").format("MM") : "";
        params.endYear = notEmpty(params.startDate) ? moment(params.endDate).local().locale("fr").format("YYYY") : "";
        params.endDayNum = notEmpty(params.startDate) ? moment(params.endDate).local().locale("fr").format("d") : "";
        params.endTime = notEmpty(params.endDate) ? moment(params.endDate).local().locale("fr").format("HH:mm") : "";
        params.endDate   = notEmpty(params.endDate) ? moment(params.endDate).local().locale("fr").format("DD MMMM YYYY - HH:mm") : null;
        
        params.startDayNum = directory.getWeekDayName(params.startDayNum);
        params.endDayNum = directory.getWeekDayName(params.endDayNum);

        params.startMonth = directory.getMonthName(params.startMonth);
        params.endMonth = directory.getMonthName(params.endMonth);

        params.attendees = "";
        var cntP = 0;
        var cntIv = 0;
        var cntIt = 0;
        if(typeof params.links != "undefined")
          if(typeof params.links.attendees != "undefined"){
            $.each(params.links.attendees, function(key, val){ 
              if(typeof val.isInviting != "undefined" && val.isInviting == true)
                cntIv++; 
              else
                cntP++; 
            });
          }

        params.attendees = "<hr class='margin-top-10 margin-bottom-10'>";
        
        params.attendees += "<button id='btn-participate' class='text-dark btn btn-link no-padding'><i class='fa fa-street-view'></i> Je participe</button>";
        params.attendees += "<button id='btn-interested' class='text-dark btn btn-link no-padding margin-left-10'><i class='fa fa-thumbs-up'></i> Ça m'intéresse</button>";
        params.attendees += "<button id='btn-share-event' class='text-dark btn btn-link no-padding margin-left-10'> <i class='fa fa-share'></i> Partager</button>";
      
        params.attendees += "<small class='light margin-left-10 tooltips pull-right'  "+
                                    "data-toggle='tooltip' data-placement='bottom' data-original-title='participant(s)'>" + 
                              cntP + " <i class='fa fa-street-view'></i>"+
                            "</small>";

        params.attendees += "<small class='light margin-left-10 tooltips pull-right'  "+
                                    "data-toggle='tooltip' data-placement='bottom' data-original-title='intéressé(s)'>" +
                               cntIt + " <i class='fa fa-thumbs-up'></i>"+
                            "</small>";

        params.attendees += "<small class='light margin-left-10 tooltips pull-right'  "+
                                    "data-toggle='tooltip' data-placement='bottom' data-original-title='invité(s)'>" +
                               cntIv + " <i class='fa fa-envelope'></i>"+
                            "</small>";

           

        mylog.log("-----------eventPanelHtml", params);
        //if(params.imgProfil.indexOf("fa-2x")<0)
        str += '<div class="col-xs-12 col-sm-4 col-md-4 no-padding">'+
                  '<a href="'+params.url+'" class="container-img-profil lbh add2fav">'+params.imgProfil+'</a>'+            
                '</div>';
        
        if(userId != null && userId != "" && params.id != userId){
          isFollowed=false;
          if(typeof params.isFollowed != "undefined" ) isFollowed=true;
          var tip = "Ça m'intéresse";
            str += "<a href='javascript:;' class='btn btn-default btn-sm btn-add-to-directory bg-white tooltips followBtn'" + 
                      'data-toggle="tooltip" data-placement="left" data-original-title="'+tip+'"'+
                      " data-ownerlink='follow' data-id='"+params.id+"' data-type='"+params.type+"' data-name='"+params.name+"'"+
                      " data-isFollowed='"+isFollowed+"'>"+
                      "<i class='fa fa-chain'></i>"+ //fa-bookmark fa-rotate-270
                    "</a>";
        }

        str += "<div class='col-md-8 col-sm-8 col-xs-12 margin-top-25'>";
          
        var startLbl = (params.endDay != params.startDay) ? "Du" : "";
        var endTime = (params.endDay == params.startDay && params.endTime != params.startTime) ? " - " + params.endTime : "";

        if(params.startDate != null)
            str += '<h3 class="text-'+params.color+' text-bold no-margin" style="font-size:20px;">'+
                      '<small>'+startLbl+' </small>'+
                      '<small class="letter-'+params.color+'">'+params.startDayNum+"</small> "+
                      params.startDay + ' ' + params.startMonth + 
                      ' <small class="letter-'+params.color+'">' + params.startYear + '</small>' + 
                      ' <small class="pull-right margin-top-5"><b><i class="fa fa-clock-o margin-left-10"></i> ' + 
                      params.startTime+endTime+"</b></small>"+
                   '</h3>';
        
        if(params.endDay != params.startDay && params.endDate != null && params.startDate != params.endDate)
            str += '<h3 class="text-'+params.color+' text-bold no-margin" style="font-size:20px;">'+
                      "<small>Au </small>"+
                      '<small class="letter-'+params.color+'">'+params.endDayNum+"</small> "+
                      params.endDay + ' ' + params.endMonth + 
                      ' <small class="letter-'+params.color+'">' + params.endYear + '</small>' + 
                      ' <small class="pull-right margin-top-5"><b><i class="fa fa-clock-o margin-left-10"></i> ' + 
                      params.endTime+"</b></small>"+
                   '</h3>';
            
        str += "</div>";

       
        if("undefined" != typeof params.organizerObj && params.organizerObj != null){ 

          str += "<div class='col-md-8 col-sm-8 col-xs-12 entityOrganizer margin-top-10'>";
            if("undefined" != typeof params.organizerObj.profilThumbImageUrl &&
              params.organizerObj.profilThumbImageUrl != ""){
              
                str += "<img class='pull-left img-responsive' src='"+baseUrl+params.organizerObj.profilThumbImageUrl+"' height='50'/>";
                
            }            
            str += "<h5 class='no-margin padding-top-5'><small>Organisé par</small></h5>";
            str += "<small class='entityOrganizerName'>"+params.organizerObj.name+"</small>";
          str += "</div>";

        }
        

        str += "<div class='col-md-8 col-sm-8 col-xs-12 entityRight padding-top-10 margin-top-10' style='border-top: 1px solid rgba(0,0,0,0.2);'>";

        var thisLocality = "";
        if(params.fullLocality != "" && params.fullLocality != " ")
             thisLocality = //"<h4 class='pull-right no-padding no-margin lbh add2fav'>" +
                              "<small class='margin-left-5 letter-red'><i class='fa fa-map-marker'></i> " + params.fullLocality + "</small>" ;
                            //"</h4>";
        else thisLocality = "";
                
       // str += thisLocality;

        var typeEvent = notEmpty(params.typeEvent) ? 
                        (notEmpty(eventTypes[params.typeEvent]) ? 
                        eventTypes[params.typeEvent] : 
                        trad["event"]) : 
                        trad["event"];

        str += "<h5 class='text-dark lbh add2fav no-margin'>"+
                  "<i class='fa fa-reply fa-rotate-180'></i> " + typeEvent + thisLocality +
               "</h5>";

        str += "<a href='"+params.url+"' class='entityName text-dark lbh add2fav'>"+
                  params.name + 
               "</a>";
        
          
        str +=    "<div class='entityDescription margin-bottom-10'>" + 
                    params.description + 
                  "</div>";
        str +=    "<div class='margin-bottom-10'>" + 
                    params.attendees + 
                    //"<button class='btn btn-link no-padding margin-right-10 pull-right'><i class='fa fa-link'></i> Je participe</button>";
          
                  "</div>";
        str +=    "<div class='tagsContainer text-red'>"+params.tagsLbl+"</div>";
        str += "</div>";
            
        str += "</div>";
      str += "</div>";

      str += "</div>";
      return str;
    },
    // ********************************
    // CITY DIRECTORY PANEL
    // ********************************
    cityPanelHtml : function(params){
        mylog.log("-----------cityPanelHtml");
        str = "";  
        str += "<div class='col-lg-4 col-md-6 col-sm-6 col-xs-12 margin-bottom-10 searchEntityContainer "+params.type+" "+params.elTagsList+" '>";
        str +=    "<div class='searchEntity'>";

                if(params.updated != null)
                  str += "<div class='dateUpdated'><i class='fa fa-flash'></i> <span class='hidden-xs'>actif </span>" + params.updated + "</div>";

                str += "<div class='padding-10 informations'>";

                      
                    str += "<div class='entityRight no-padding'>";
                    
                    //params.url = "#city.detail.insee."+params.insee+".postalCode."+params.cp;           
                    params.url = ""; //#main-col-search";
                    params.onclick = 'setScopeValue($(this))'; //"'+params.name.replace("'", "\'")+'");';
                    params.onclickCp = 'setScopeValue($(this));';
                    params.target = "";
                    params.dataId = params.name; 
                    params.fullLocality =  "<b>" +params.name + "</b> - " +  params.cp+ "<br>" +  params.regionName;
                    
                    mylog.log("-----------cityPanelHtml", params);
                    var thisLocality = "";
                    if(params.fullLocality != "" && params.fullLocality != " ")
                         thisLocality = '<span data-id="' + params.dataId + '"' + "  class='margin-bottom-5 entityName letter-red lbh add2fav'>"+
                                          "<i class='fa fa-university'></i> " + params.fullLocality + 
                                        "</span>";
                    else thisLocality = "<br>";
                    
                      var citykey = params.country + "_" + params.insee + "-" + params.cp;
                      //$city["country"]."_".$city["insee"]."-".$city["cp"];
                     
                      thisLocality += "<button class='btn btn-sm btn-default item-globalscope-checker start-new-communexion' "+
                                      "data-scope-value='" + citykey + "' " + 
                                      "data-scope-name='" + params.name + "' " + 
                                      "data-scope-type='city' " + 
                                      "data-insee-communexion='" + params.insee + "' "+ 
                                      "data-name-communexion='" + params.name + "' "+ 
                                      "data-cp-communexion='" + params.cp + "' "+ 
                                      "data-region-communexion='" + params.regionName + "' "+ 
                                      "data-country-communexion='" + params.country + "' "+ 
                                      ">"+
                                          "<i class='fa fa-angle-right'></i> Communecter" + 
                                      "</button>";

                    str += thisLocality;
                    
                  str += "</div>";
                str += "</div>";
              str += "</div>";

              str += "</div>";
              return str;
    },
    // ********************************
    // ROOMS DIRECTORY PANEL
    // ********************************
    roomsPanelHtml : function(params){
      mylog.log("-----------roomsPanelHtml");

      if(params.type == "surveys") params.url = "#survey.entry.id."+params.id;
      else if(params.type == "actions") params.url = "#rooms.action.id."+params.id;
     
      str = "";  
      str += "<div class='col-xs-12 searchEntityContainer "+params.type+" "+params.elTagsList+" '>";
      str +=    "<div class='searchEntity'>";

      
        if(userId != null && userId != "" && params.id != userId){
          isFollowed=false;
          if(typeof params.isFollowed != "undefined" ) isFollowed=true;
          tip = (type == "events") ? "Participer" : 'Suivre';
            str += "<a href='javascript:;' class='btn btn-default btn-sm btn-add-to-directory bg-white tooltips followBtn'" + 
                  'data-toggle="tooltip" data-placement="left" data-original-title="'+tip+'"'+
                  " data-ownerlink='follow' data-id='"+params.id+"' data-type='"+params.type+"' data-name='"+params.name+"' data-isFollowed='"+isFollowed+"'>"+
                      "<i class='fa fa-chain'></i>"+ //fa-bookmark fa-rotate-270
                    "</a>";
        }

        if(params.updated != null && !params.useMinSize)
          str += "<div class='dateUpdated'><i class='fa fa-flash'></i> <span class='hidden-xs'>actif </span>" + params.updated + "</div>";

        params.startDay = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("DD/MM") : "";
        params.startTime = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("HH:mm") : "";
        params.startDate = notEmpty(params.startDate) ? moment(params.startDate).local().locale("fr").format("DD MMMM YYYY - HH:mm") : null;
        params.endDay = notEmpty(params.endDate) ? moment(params.endDate).local().locale("fr").format("DD/MM") : "";
        params.endTime = notEmpty(params.endDate) ? moment(params.endDate).local().locale("fr").format("HH:mm") : "";
        params.endDate   = notEmpty(params.endDate) ? moment(params.endDate).local().locale("fr").format("DD MMMM YYYY - HH:mm") : null;
        
        str += '<div class="col-xs-5">';
        if(params.startDate != null){
            str += '<div class="col-xs-4">';
            if(params.startDate != null)
                str += '<div class="bg-'+params.color+' text-white padding-5 text-bold" style="border: 2px solid #328a00; font-size:27px;margin-top:5px;">'+params.startDay+'</div>'+ params.startTime;
            if(params.endDate != null)
                str += '<div class="bg-'+params.color+' text-white padding-5 text-bold" style="border: 2px solid #328a00; font-size:27px;margin-top:5px;">'+params.endDay+'</div>'+ params.endTime;
            str += '</div>';
        }
        var w = (params.startDate != null) ? "8" : "12"
            str += '<div class="col-xs-'+w+'">'+
                '<a href="'+params.url+'" class="container-img-profil lbh add2fav">'+params.imgProfil+'</a>'+
            '</div>'+
        '</div>';
        
        str += "<div class='padding-10 informations'>";

        str += "<div class='entityRight no-padding'>";
               
            if(notEmpty(params.parent) && notEmpty(params.parent.name))
              str += "<a href='"+urlParent+"' class='entityName text-"+params.parentColor+" lbh add2fav text-light-weight margin-bottom-5'>" +
                        "<i class='fa "+params.parentIcon+"'></i> "
                        + params.parent.name + 
                      "</a>";

            var iconFaReply = notEmpty(params.parent) ? "<i class='fa fa-reply fa-rotate-180'></i> " : "";
            str += "<a  href='"+params.url+"' class='"+params.size+" entityName text-dark lbh add2fav'>"+
                      iconFaReply + params.name + 
                   "</a>";
            
            var thisLocality = "";
            if(params.fullLocality != "" && params.fullLocality != " ")
                 thisLocality = "<a href='"+params.url+'\' data-id="' + params.dataId + '"' + "  class='entityLocality lbh add2fav'>"+
                                  "<i class='fa fa-home'></i> " + params.fullLocality + 
                                "</a>";
            else thisLocality = "<br>";
            
            
            if(notEmpty(params.parentRoom)){
              params.parentUrl = "";
              params.parentIco = "";
              if(params.type == "surveys"){ 
                params.parentUrl = "#survey.entries.id."+params.survey; 
                params.parentIco = "archive"; }
              else if(params.type == "actions") {
                params.parentUrl = "#rooms.actions.id."+params.room;
                params.parentIco = "cogs";}
              str += "<div class='text-dark'>"+

                        "<i class='fa fa-" + params.parentIco + "'></i><a href='" + params.parentUrl + "' class='lbh add2fav'> " + params.parentRoom.name + "</a>"+
                    "</div>";
              if(notEmpty(params.parentRoom.parentObj)){
                var typeIcoParent = params.parentRoom.parentObj.typeSig;
                //mylog.log("typeIcoParent", params.parentRoom);

                var p = typeObjLib.get(typeIcoParent);
                params.icoParent = p.icon;
                params.colorParent = p.color;

                var thisLocality = notEmpty(params.parentRoom) && notEmpty(params.parentRoom.parentObj) && 
                              notEmpty(params.parentRoom.parentObj.address) ? 
                              params.parentRoom.parentObj.address : null;

                var postalCode = notEmpty(thisLocality) && notEmpty(thisLocality.postalCode) ? thisLocality.postalCode : "";
                var cityName = notEmpty(thisLocality) && notEmpty(thisLocality.addressLocality) ? thisLocality.addressLocality : "";

                thisLocality = postalCode + " " + cityName;
                if(thisLocality != " ") thisLocality = ", <small> " + thisLocality + "</small>";
                else thisLocality = "";

                var ctzCouncil = typeIcoParent=="city" ? "Conseil citoyen de " : "";
                str += "<div class=' text-"+params.colorParent+"'> <i class='fa "+params.icoParent+"'></i> <b>" + ctzCouncil + params.parentRoom.parentObj.name + "</b>" + thisLocality+ "</div>";
              

              }
            }else{
              str += thisLocality;
            }
            
            if(itemType == "entry"){
              var vUp   = notEmpty(params.voteUpCount)       ? params.voteUpCount.toString()        : "0";
              var vMore = notEmpty(params.voteMoreInfoCount) ? params.voteMoreInfoCount.toString()  : "0";
              var vAbs  = notEmpty(params.voteAbstainCount)  ? params.voteAbstainCount.toString()   : "0";
              var vUn   = notEmpty(params.voteUnclearCount)  ? params.voteUnclearCount.toString()   : "0";
              var vDown = notEmpty(params.voteDownCount)     ? params.voteDownCount.toString()      : "0";
              str += "<div class='margin-bottom-10 no-padding'>";
                str += "<span class='bg-green lbl-res-vote'><i class='fa fa-thumbs-up'></i> " + vUp + "</span>";
                str += " <span class='bg-blue lbl-res-vote'><i class='fa fa-pencil'></i> " + vMore + "</span>";
                str += " <span class='bg-dark lbl-res-vote'><i class='fa fa-circle'></i> " + vAbs + "</span>";
                str += " <span class='bg-purple lbl-res-vote'><i class='fa fa-question-circle'></i> " + vUn + "</span>";
                str += " <span class='bg-red lbl-res-vote'><i class='fa fa-thumbs-down'></i> " + vDown + "</span>";
              str += "</div>";
            }

            str += "<div>" + params.description + "</div>";
         
            str += "<div class='tagsContainer text-red'>"+params.tagsLbl+"</div>";


          str += "</div>";
        str += "</div>";
      str += "</div>";

      str += "</div>";
      return str;
    },
    showResultsDirectoryHtml : function ( data, contentType, size ){ //size == null || min || max
        mylog.log("START -----------showResultsDirectoryHtml",data, contentType, size)
        var str = "";

        directory.colPos = "left";
        if(typeof data == "object" && data!=null)
        $.each(data, function(i, params) {
            itemType=(contentType) ? contentType :params.type;
            
            if( itemType )
            {
                //mylog.dir(params);
                mylog.log("itemType",itemType,params.name);
                //mylog.log("showResultsDirectoryHtml", o);
                var typeIco = i;
                params.size = size;
                params.id = getObjectId(params);
                params.name = notEmpty(params.name) ? params.name : "";
                params.description = notEmpty(params.shortDescription) ? params.shortDescription : 
                                    (notEmpty(params.message)) ? params.message : 
                                    (notEmpty(params.description)) ? params.description : 
                                    "";

                //mapElements.push(params);

                if(typeof( typeObj[itemType] ) == "undefined")
                    itemType="poi";
                typeIco = itemType;

                if(typeof params.typeOrga != "undefined")
                  typeIco = params.typeOrga;

                var obj = (typeObjLib.get(typeIco)) ? typeObjLib.get(typeIco) : typeObj["default"] ;
                params.ico =  "fa-"+obj.icon;
                params.color = obj.color;
                if(params.parentType){
                    mylog.log("params.parentType",params.parentType);
                    var parentObj = (typeObjLib.get(params.parentType)) ? typeObjLib.get(params.parentType) : typeObj["default"] ;
                    params.parentIcon = "fa-"+parentObj.icon;
                    params.parentColor = parentObj.color;
                }
                if(params.type == "classified" && typeof params.category != "undefined"){
                  params.ico = typeof classifiedTypes[params.category] != "undefined" ?
                               "fa-" + classifiedTypes[params.category]["icon"] : "";
                }

                params.htmlIco ="<i class='fa "+ params.ico +" fa-2x bg-"+params.color+"'></i>";

                // var urlImg = "/upload/communecter/color.jpg";
                // params.profilImageUrl = urlImg;
                params.useMinSize = typeof size != "undefined" && size == "min";
                params.imgProfil = ""; 
                if(!params.useMinSize)
                    params.imgProfil = "<i class='fa fa-image fa-2x'></i>";

                if("undefined" != typeof params.profilImageUrl && params.profilImageUrl != "")
                    params.imgProfil= "<img class='img-responsive' src='"+baseUrl+params.profilImageUrl+"'/>";

                if(typeObjLib.get(itemType) && 
                    typeObjLib.get(itemType).col == "poi" && 
                    typeof params.medias != "undefined" && typeof params.medias[0].content.image != "undefined")
                params.imgProfil= "<img class='img-responsive' src='"+params.medias[0].content.image+"'/>";

                params.insee = params.insee ? params.insee : "";
                params.postalCode = "", params.city="",params.cityName="";
                if (params.address != null) {
                    params.city = params.address.addressLocality;
                    params.postalCode = params.cp ? params.cp : params.address.postalCode ? params.address.postalCode : "";
                    params.cityName = params.address.addressLocality ? params.address.addressLocality : "";
                }
                params.fullLocality = params.postalCode + " " + params.cityName;

                params.type = typeObjLib.get(itemType).col;
                params.urlParent = (notEmpty(params.parentType) && notEmpty(params.parentId)) ? 
                              '#page.type.'+params.parentType+'.id.' + params.parentId : "";

                //params.url = '#page.type.'+params.type+'.id.' + params.id;
                params.url = '#page.type.'+params.type+'.id.' + params.id;
                if(type == "poi")    
                    url = '#element.detail.type.poi.id.' + id;

                params.onclick = 'url.loadByHash("' + url + '");';

                params.elTagsList = "";
                var thisTags = "";
                if(typeof params.tags != "undefined" && params.tags != null){
                  $.each(params.tags, function(key, value){
                    if(value != ""){
                      thisTags += "<span class='badge bg-transparent text-red btn-tag tag' data-tag-value='"+slugify(value)+"'>#" + value + "</span> ";
                      params.elTagsList += slugify(value)+" ";
                    }
                  });
                  params.tagsLbl = thisTags;
                }else{
                  params.tagsLbl = "";
                }

                params.updated   = notEmpty(params.updatedLbl) ? params.updatedLbl : null; 
                
                mylog.log("template principal",params);
                
                  //template principal
                if(params.type == "cities")
                  str += directory.cityPanelHtml(params);  
                else if( $.inArray(params.type, ["citoyens","organizations","project"])>=0) 
                  str += directory.elementPanelHtml(params);  
                else if(params.type == "events")
                  str += directory.eventPanelHtml(params);  
                else if(params.type == "surveys" || params.type == "actions")
                    str += directory.roomsPanelHtml(params);  
                else if(params.type == "classified")
                  str += directory.classifiedPanelHtml(params);
                else
                  str += directory.defaultPanelHtml(params);
            }
        }); //end each
        mylog.log("END -----------showResultsDirectoryHtml")
        return str;
    },

    //builds a small sized list
    buildList : function(list) {
      $(".favSectionBtnNew,.favSection").remove();

      $.each( list, function(key,list)
      {
        var subContent = directory.showResultsDirectoryHtml ( list, key /*,"min"*/); //min == dark template 
        if( notEmpty(subContent) ){
          favTypes.push(typeObj[key].col);
          
          var color = (typeObj[key] && typeObj[key].color) ? typeObj[key].color : "dark";
          var icon = (typeObj[key] && typeObj[key].icon) ? typeObj[key].icon : "circle";
          $(smallMenu.destination + " #listDirectory").append("<div class='"+typeObj[key].col+"fav favSection '>"+
                                            "<div class=' col-xs-12 col-sm-12'>"+
                                            "<h4 class='text-left text-"+color+"'><i class='fa fa-angle-down'></i> "+trad[key]+"</h4><hr>"+
                                            subContent+
                                            "</div>");
          $(".sectionFilters").append(" <a class='text-black btn btn-default favSectionBtn favSectionBtnNew  bg-"+color+"'"+
                                      " href='javascript:directory.showAll(\".favSection\",directory.elemClass);toggle(\"."+typeObj[key].col+"fav\",\".favSection\",1)'> "+
                                          "<i class='fa fa-"+icon+" fa-2x'></i><br>"+trad[key]+
                                        "</a>");
        }
      });

      initBtnLink();
      bindLBHLinks();
      directory.filterList();
      $(directory.elemClass).show();
      //bindTags();
    },
    getWeekDayName : function(numWeek){
      var wdays = new Array("", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche");
      if(typeof wdays[numWeek] != "undefined") return wdays[numWeek];
      else return "";
    },
    getMonthName : function(numMonth){
      numMonth = parseInt(numMonth);
      var wdays = new Array("", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");
      if(typeof wdays[numMonth] != "undefined") return wdays[numMonth];
      else return "";
    },

    //build list of unique tags based on a directory structure
    //on click hides empty parent sections
    filterList : function  (elClass,dest) { 
        directory.tagsT = [];
        directory.scopesT = [];
        $("#listTags").html("");
        $("#listScopes").html("<h4><i class='fa fa-angle-down'></i> Où</h4>");
        mylog.log("tagg", directory.elemClass);
        $.each($(directory.elemClass),function(k,o){
          
          var oScope = $(o).find(".entityLocality").text();
          //mylog.log("tags count",$(o).find(".btn-tag").length);
          $.each($(o).find(".btn-tag"),function(i,oT){
            var oTag = $(oT).data('tag-value');
            if( notEmpty( oTag ) && !inArray( oTag,directory.tagsT ) ){
              directory.tagsT.push(oTag);
              $("#listTags").append("<a class='btn btn-xs btn-link text-red text-left w100p favElBtn "+slugify(oTag)+"Btn' data-tag='"+slugify(oTag)+"' href='javascript:directory.toggleEmptyParentSection(\".favSection\",\"."+slugify(oTag)+"\",directory.elemClass,1)'><i class='fa fa-tag'></i> "+oTag+"</a><br/>");
            }
          });
          if( notEmpty( oScope ) && !inArray( oScope,directory.scopesT ) ){
            directory.scopesT.push(oScope);
            $("#listScopes").append("<a class='btn btn-xs btn-link text-red text-left w100p favElBtn "+slugify(oScope)+"Btn' href='javascript:directory.searchFor(\""+oScope+"\")'><i class='fa fa-map-marker'></i> "+oScope+"</a><br/>");
          }
        })
        //mylog.log("tags count", directory.tagsT.length, directory.scopesT.length);
    },

    //todo add count on each tag
    filterTags : function (withSearch,open) 
    { 
        directory.tagsT = [];
        $("#listTags").html('');
        if(withSearch){
            $("#listTags").append("<h5 class=''><i class='fa fa-search'></i> Filtrer par tag</h5>");
            $("#listTags").append('<input id="searchBarTextJS" data-searchPage="true" type="text" class="input-search form-control">');
        }
       // alert(directory.elemClass);
       // $("#listTags").append("<h4 class=''> <i class='fa fa-tags'></i> trier </h4>");
        $("#listTags").append("<a class='btn btn-link text-red favElBtn favAllBtn' "+
            "href='javascript:directory.toggleEmptyParentSection(\".favSection\",null,directory.elemClass,1)'>"+
            " <i class='fa fa-refresh'></i> <b>Afficher tout</b></a><br/>");
        $.each( $(directory.elemClass),function(k,o){
            $.each($(o).find(".btn-tag"),function(i,oT){
                var oTag = $(oT).data('tag-value').toLowerCase();
                if( notEmpty( oTag ) && !inArray( oTag,directory.tagsT ) ){
                  directory.tagsT.push(oTag);
                  //mylog.log(oTag);
                  $("#listTags").append("<a class='btn btn-link favElBtn text-red "+slugify(oTag)+"Btn' "+
                                            "data-tag='"+slugify(oTag)+"' "+
                                            "href='javascript:directory.toggleEmptyParentSection(\".favSection\",\"."+slugify(oTag)+"\",directory.elemClass,1)'>"+
                                              "#"+oTag+
                                        "</a><br> ");
                }
            });
        });
        if( directory.tagsT.length && open ){
            directory.showFilters();
        }
        //$("#btn-open-tags").append("("+$(".favElBtn").length+")");
    },
    
    showFilters : function () { 
      if($("#listTags").hasClass("hide")){
        $("#listTags").removeClass("hide");
        $("#dropdown_search").removeClass("col-md-offset-1");
      }else{
        $("#listTags").addClass("hide");
        $("#dropdown_search").addClass("col-md-offset-1");
      }
      $("#listTags").removeClass("hide");
      $("#dropdown_search").removeClass("col-md-offset-1");
    },

    addMultiTagsAndScope : function() { 
      directory.multiTagsT = [];
      directory.multiScopesT = [];
      $.each(myMultiTags,function(oTag,oT){
        if( notEmpty( oTag ) && !inArray( oTag,directory.multiTagsT ) ){
          directory.multiTagsT.push(oTag);
          //mylog.log(oTag);
          $("#listTags").append("<a class='btn btn-xs btn-link btn-anc-color-blue  text-left w100p favElBtn "+slugify(oTag)+"Btn' data-tag='"+slugify(oTag)+"' href='javascript:directory.searchFor(\"#"+oTag+"\")'><i class='fa fa-tag'></i> "+oTag+"</a><br/>");
        }
      });
      $.each(myMultiScopes,function(oScope,oT){
        var oScope = oT.name;
        if( notEmpty( oScope ) && !inArray( oScope,directory.multiScopesT ) ){
          directory.multiScopesT.push(oScope);
          $("#listScopes").append("<a class='btn btn-xs btn-link text-white text-left w100p favElBtn "+slugify(oScope)+"Btn' data-tag='"+slugify(oScope)+"' href='javascript:directory.searchFor(\""+oScope+"\")'><i class='fa fa-tag'></i> "+oScope+"</a><br/>");
        }
      });
    },

    //show hide parents when empty
    toggleEmptyParentSection : function ( parents ,tag ,children ) { 
        mylog.log("toggleEmptyParentSection('"+parents+"','"+tag+"','"+children+"')");
        var showAll = true;
        if(tag){
          $(".favAllBtn").removeClass("active");
          //apply tag filtering
          $(tag+"Btn").toggleClass("btn-link text-white").toggleClass("active text-white");

          if( $( ".favElBtn.active" ).length > 0 ) 
          {
            showAll = false;
            tags = "";
            $.each( $( ".favElBtn.active" ) ,function( i,o ) { 
              tags += "."+$(o).data("tag")+",";
            });
            tags = tags.replace(/,\s*$/, "");
            mylog.log(tags)
            toggle(tags,children,1);
            
            directory.toggleParents(directory.elemClass);
          }
        }
        
        if( showAll )
          directory.showAll(parents,children);

        $(".my-main-container").scrollTop(0);
    },

    showAll: function(parents,children,path,color) 
    {
      //show all
      if(!color)
        color = "text-white";
      $(".favElBtn").removeClass("active btn-dark-blue").addClass("btn-link ");//+color+" ");
      $(".favAllBtn").addClass("active");
      $(parents).removeClass('hide');
      $(children).removeClass('hide');
    },
    //be carefull with trailing spaces on elemClass
    //they break togglePArents and breaks everything
    toggleParents : function (path) { 
        //mylog.log("toggleParents",parents,children);
        $.each( favTypes, function(i,k)
        {
          if( $(path.trim()+'.'+k).length == $(path.trim()+'.'+k+'.hide ').length )
            $('.'+k+'fav').addClass('hide');
          else
            $('.'+k+'fav').removeClass('hide');
        });
    },

    //fait de la recherche client dans les champs demandé
    search : function(parentClass, searchVal) { 
        mylog.log("searchDir searchVal",searchVal);           
        if(searchVal.length>2 ){
            $.each( $(directory.elemClass) ,function (i,k) { 
                      var found = null;
              if( $(this).find(".entityName").text().search( new RegExp( searchVal, "i" ) ) >= 0 || 
                  $(this).find(".entityLocality").text().search( new RegExp( searchVal, "i" ) ) >= 0 || 
                  $(this).find(".tagsContainer").text().search( new RegExp( searchVal, "i" ) ) >= 0 )
                {
                  //mylog.log("found");
                  found = 1;
                }

                if(found)
                    $(this).removeClass('hide');
                else
                    $(this).addClass('hide');
            });

            directory.toggleParents(directory.elemClass);
        } else
            directory.toggleEmptyParentSection(parentClass,null, directory.elemClass ,1);
    },

    searchFor : function (str) { 
      $(".searchSmallMenu").val(str).trigger("keyup");
     }
}
