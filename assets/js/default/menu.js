
function removeExplainations(){
	$(".removeExplanation").replaceWith("<i class='fa fa-spin fa-circle-o-notch text-azure'></i>");
	$.ajax({
		type: "POST",
		url: baseUrl+"/"+moduleId+"/person/updatesettings",
		dataType: "json",
		success: function(data) {
		if(data.result){
			toastr.success(data.msg);	
			showMenuExplanation = false;
			$(".removeExplanationCont").hide();
		}
		else
		toastr.error(data.msg);
		},
	});
}

var timeoutSearch = setTimeout(function(){}, 0);
	

function realTimeKKBB(){

	var contents    = $("#iframe-kkbb"); 
	var collected 	= contents.find( ".collected" ).html();
	var amount 		= contents.find( ".amount .small .funded" ).html();

	$("#kkbb-big #collected").html(collected);
	$("#kkbb-big #collected small").html("");
	$("#kkbb-big #collected strong").html("");


	var amountNumeric = amount.replace("%", "");
	$("#kkbb-big #amount").html(amount);	
	$("#kkbb-big .percentage-wrapper").html("");
	$("#kkbb-big .progress-bar").css("width", amount);
	$("#kkbb-big .progress-bar").attr("aria-valuenow", amountNumeric);

	$( "#iframe-kkbb" ).html("");
}


function bindEventMenu(){
	//setTimeout(function(){ 
		$(".globale-announce").css("width", 200);
		$("#kkbb-big").hide(400);
		$("#kkbb-min").show(400);
	//}, 5000);

	$('#btn-close-globale-announce').click( function(e){ 
		$(".globale-announce").css("width", 200);
		$("#kkbb-big").hide(400);
		$("#kkbb-min").show(400);
		//var path = "/";
		//if(location.hostname.indexOf("localhost") >= 0) path = "/ph/";

		//$.cookie('kkbbok',  true, { expires: 365, path: path });
	});
	$('.globale-announce').mouseleave( function(e){ 
		$(".globale-announce").css("width", 200);
		$("#kkbb-big").hide(400);
		$("#kkbb-min").show(400);
		//var path = "/";
		//if(location.hostname.indexOf("localhost") >= 0) path = "/ph/";

		//$.cookie('kkbbok',  true, { expires: 365, path: path });
	});

	$('#kkbb-min').mouseenter( function(e){ 
		$(".globale-announce").css("width", 400);
		$("#kkbb-min").hide(400);
		$("#kkbb-big").show(400);
		
	});

	$('.btn-menu0').click( function(e){ 
		if(location.hash != "#default.twostepregister")
			urlCtrl.loadByHash("#default.home");
		else
			urlCtrl.loadByHash("#default.twostepregister");
	} );

    $('.btn-menu2')
    .click(function(e){ 
    	if(location.hash != "#default.directory" || isMapEnd == false) 
    		urlCtrl.loadByHash("#default.directory"); 
    	else showMap(false);  
    })
    .mouseenter(function(e){ 
	    if(showMenuExplanation){
		    toggle(".explainDirectory",".explain");
			$(".removeExplanation").parent().show();
		}
	});

    $('.btn-menu3')
    .click(function(e){ 
    	if(location.hash != "#default.agenda" || isMapEnd == false) 
    		urlCtrl.loadByHash("#default.agenda"); 
    	else showMap(false);  
    })
    .mouseenter(function(e){ 
	    if(showMenuExplanation){
		    toggle(".explainAgenda",".explain");
			$(".removeExplanation").parent().show();
		}
	});

    $('.btn-menu4')
    .click(function(e){ 
    	if(location.hash != "#default.news" || isMapEnd == false) 
    		urlCtrl.loadByHash("#default.news"); 
    	else showMap(false);  
    })
    .mouseenter(function(e){ 
	    if(showMenuExplanation){
	    	$(".removeExplanation").parent().show();
	    	toggle(".explainNews",".explain")
	    }
	 });



   // $('.btn-menu3').click(function(e){ urlCtrl.loadByHash("#default.agenda"); 		 }).mouseenter(function(e){ toggle(".explainAgenda",".explain")});
   //$('.btn-menu4').click(function(e){ urlCtrl.loadByHash("#default.news");	 }).mouseenter(function(e){ toggle(".explainNews",".explain")} );
    $('.btn-menu5').click(function(e){ 
    	showFloopDrawer(true);	 		 
    })
    .mouseenter(function(e){ 
	   // if(showMenuExplanation)	
	   // 	toggle(".explainMyDirectory",".explain")
	});
    $('.btn-menu6').mouseenter(function(e){ 
	    if(showMenuExplanation){
	    	$(".removeExplanation").parent().show();
	    	toggle(".explainHelpUs",".explain")
	    }
	});
    
    // $(".btn-menu-add").mouseenter(function(){
    // 	$(".drop-up-btn-add").show(400);
    // 	$(".drop-up-btn-add .lbl-btn-menu-name").css("display","inline");
    // 	$(".btn-menu-add .lbl-btn-menu-name").css("display", "inline");
    // });
    
    $(".btn-login").click(function(){
		//mylog.log("btn-login");
		showPanel("box-login");
		//$(".main-col-search").html("");
	}).mouseenter(function(e){ 
		if(showMenuExplanation){
			$(".removeExplanation").parent().show();
			toggle(".explainConnect",".explain");
		}
	});

    $(".btn-register").click(function(){
    	//mylog.log("btn-register");
		showPanel("box-register");
		//$(".main-col-search").html("");
	}).mouseenter(function(e){ 
		if(showMenuExplanation){
			$(".removeExplanation").parent().show();
			toggle(".explainRegister",".explain");
		}
	});

/*	$(".btn-logout").click(function(){
    	mylog.log("btn-logout");
		window.location.href = urlLogout;
	});*/

	$(".btn-scope, .btn-param-postal-code").mouseenter(function(e){
		clearTimeout(timeoutHover);
		$(".hover-info,.hover-info2").hide();
	});

	$(".btn-param-postal-code").mouseenter(function(e){
		showInputCommunexion();
		if(showMenuExplanation){
			$(".removeExplanation").parent().show();
			//showDefinition("explainCommunectMe");
		}
	});
	$(".btn-param-postal-code").click(function(e){
		////mylog.log("cookie", $.cookie('inseeCommunexion'));
		if(typeof $.cookie('inseeCommunexion') == "undefined" && typeof inseeCommunexion == "undefined"){
			//$(".search-loader").html("<i class='fa fa-spin fa-circle-o-notch'></i> Géolocalisation en cours ...");		
			showMap(true);
    		initHTML5Localisation('communexion');
		}else{
			selectScopeLevelCommunexion(1);
		}
	});
	$("#searchBarPostalCode").mouseenter(function(e){
		clearTimeout(timeoutCommunexion);
	});

	$('#searchBarPostalCode').keyup(function(e){
		//if(location.hash == "#default.home"){
	        clearTimeout(timeoutSearch);
      		timeoutSearch = setTimeout(function(){ startNewCommunexion(); }, 5000);
	    //}
    });
    
    $(".btn-geoloc-auto").click(function(e){
		//mylog.log("cookie", $.cookie('inseeCommunexion'));
    	if($.cookie('inseeCommunexion')){
    		//urlCtrl.loadByHash("#city.detail.insee." + $.cookie('inseeCommunexion')+ ".postalCode." + $.cookie('cpCommunexion'));
    	}else{
    		if(geolocHTML5Done == false){
				//$(".search-loader").html("<i class='fa fa-spin fa-circle-o-notch'></i> Géolocalisation en cours ...");		
				
	    		initHTML5Localisation('communexion');
			}
    	}

    }).mouseenter(function(e){
		if(showMenuExplanation){
			showDefinition("explainCommunectMe");
			$(".removeExplanation").parent().show();
		}
	});;
	


	var timeoutHover = setTimeout(function(){}, 0);
	var hoverPersist = false;
	var positionMouseMenu = "out";

	// $(".hover-menu").mouseenter(function(){
	// 	////mylog.log("enter all");
	// 	positionMouseMenu = "in";
	// 	//$(".main-col-search").animate({ opacity:0.3 }, 0 );
	// 	$(".main-menu-right .lbl-btn-menu-name").show(0);
	// 	$(".main-menu-right .lbl-btn-menu-name").css("display", "inline");
	// 	$(".main-menu-right .menu-button-title").addClass("large");

	// 	//showInputCommunexion();

		
	// });

	// $(".hover-menu").mouseleave(function(){
	// 	//clearTimeout(timeoutHover);
	// 	//$(".hover-info").hide();
	// });


	// $(".hover-menu .btn-menu").mouseenter(function(){
	// 	////mylog.log("enter btn, loginRegister", isLoginRegister());
	// 	if(!isLoginRegister()){
	// 		positionMouseMenu = "inBtn";
	// 		//$(".main-col-search").animate({ opacity:0.3 }, 0 );
	// 		$(".main-menu-right .menu-button-title").addClass("large");

	// 		if(!showMenuExplanation)
	// 			$(".removeExplanationCont").hide();

	// 		$(".main-menu-right .lbl-btn-menu-name, .infoVersion").css("display" , "inline");

	// 		clearTimeout(timeoutHover);
	// 		timeoutHover = setTimeout(function(){
	// 			//hoverPersist = true;
	// 			if(showMenuExplanation)
	// 				$(".hover-info").css("display" , "inline");
	// 		}, 1500);
	// 	}
	// });

	$(document).mouseleave(function(){
		if(!isLoginRegister()){
	  //   	hoverPersist = false;
			// clearTimeout(timeoutHover);
			// positionMouseMenu = "out";
			// //$(".main-col-search").animate({ opacity:1 }, 0 );
			// $(".main-menu-right .lbl-btn-menu-name").hide();
			// $(".main-menu-right .menu-button").removeClass("large");
		}
		$(".hover-info,.hover-info2, .infoVersion").hide();
		$(".drop-up-btn-add").hide(400);
		$("#notificationPanelSearch").hide();
		$("#input-communexion").hide(400);

		clearTimeout(timeoutSearch);
		clearTimeout(timeoutHover);
	});

	$(".main-col-search, .mapCanvas").click(function(){
		//permet de savoir si l'utilisateur est en train de se logguer ou de s'inscrire
	    if(!isLoginRegister()){
	    	hoverPersist = false;
			clearTimeout(timeoutHover);
			positionMouseMenu = "out";
			$(".main-col-search").animate({ opacity:1 }, 200 );
			$(".lbl-btn-menu-name").hide();
			$(".menu-button").removeClass("large");
		}
		$(".hover-info,.hover-info2, .infoVersion").hide();
		$(".drop-up-btn-add").hide(400);
		$("#notificationPanelSearch").hide();
		$("#input-communexion").hide(400);

		clearTimeout(timeoutSearch);
		clearTimeout(timeoutHover);
	});

	$(".main-col-search, .mapCanvas").mouseenter(function(){
			//permet de savoir si l'utilisateur est en train de se logguer ou de s'inscrire
		    if(!hoverPersist){
				if(!isLoginRegister()){
					positionMouseMenu = "out";
					$(".main-col-search").animate({ opacity:1 }, 200 );
					$(".main-menu-right .lbl-btn-menu-name").hide();
					$(".menu-button").removeClass("large");
					timeoutCommunexion = setTimeout(function(){ 
						//mylog.log("HIDE HIDE"); $("#input-communexion").hide(200); clearTimeout(timeoutCommunexion); 
					}, 300);
				}
				//$(".hover-info,.hover-info2").hide();
				$(".drop-up-btn-add").hide(400);
				$("#notificationPanelSearch").hide();
				clearTimeout(timeoutHover);
				//$("#input-communexion").hide(400);
			}
	});

	$(".menu-button").click(function(){
		////mylog.log("login display", !isLoginRegister());
		//permet de savoir si l'utilisateur est en train de se logguer ou de s'inscrire
	    var login_register = isLoginRegister();
	    
	    //mylog.log(isLoginRegister());
	    if(!isLoginRegister()){
			positionMouseMenu = "out";
			$(".main-col-search").animate({ opacity:1 }, 200 );
			hoverPersist = false;
			$(".main-menu-right .lbl-btn-menu-name").hide();
			$(".menu-button").removeClass("large");
		}
		$(".hover-info,.hover-info2, .infoVersion").hide();
		//$(".drop-up-btn-add").hide(400);
	});

	// $(".btn-menu-add").click(function(){
 //    	$(".btn-menu-add .lbl-btn-menu-name").show(200);
	// 	$(".btn-menu-add .lbl-btn-menu-name").css("display", "inline");;
 //    });

	
	function isLoginRegister(){
		if($(".box-login").length <= 0) return false;
		return ($(".box-login").css("display") != "none" || $(".box-register").css("display") != "none");
	}
}