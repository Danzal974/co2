var formInMap = {
	actived : false,
	timeoutAddCity : null,
	NE_insee : "",
	NE_lat : "",
	NE_lng : "",
	NE_city : "",
	NE_cp : "",
	NE_street : "",

	NE_country : "",
	NE_dep : "",
	NE_region : "",

	geoShape : "",

	typeSearchInternational : "",
	formType : "",
	updateLocality : false,
	addressesIndex : false,
	saveCities : new Array(),
	uncomplete : false,

	modePostalCode : false,


	showMarkerNewElement : function(modePC){
		mylog.log("forminmap showMarkerNewElement");
		Sig.clearMap();
		formInMap.actived = true ;
		formInMap.hiddenHtmlMap(true);

		if(typeof Sig.myMarker != "undefined") 
			Sig.map.removeLayer(Sig.myMarker);

		mylog.log("formType", formInMap.formType);
		var options = {  id : 0,
						 icon : Sig.getIcoMarkerMap({'type' : formInMap.formType}),
						 content : Sig.getPopupInfoAddress()
					  };
		mylog.log(options);

		if( notNull(currentUser) && notNull(currentUser.addressCountry) && formInMap.NE_country== "" ){
			formInMap.NE_country = currentUser.addressCountry;
			mylog.log("NE_country", formInMap.NE_country);
		}

		var coordinates = new Array(0, 0);
		if( notNull(contextData) && notNull(contextData.geo) && formInMap.updateLocality == true)
			coordinates = new Array(contextData.geo.latitude, contextData.geo.longitude);
		
		mylog.log("coordinates", coordinates);

		//efface le marker s'il existe
		if(Sig.markerFindPlace != null) 
			Sig.map.removeLayer(Sig.markerFindPlace);
		Sig.markerFindPlace = Sig.getMarkerSingle(Sig.map, options, coordinates);
		Sig.markerFindPlace.openPopup(); 
		Sig.markerFindPlace.dragging.enable();
		Sig.centerPopupMarker(coordinates, 12);
		

		$('[name="newElement_country"]').val(formInMap.NE_country);

		if(formInMap.NE_country != ""){
			$("#divPostalCode").removeClass("hidden");
			$("#divCity").removeClass("hidden");
		}

		if(formInMap.updateLocality == true){
			formInMap.initHtml();
			$("#newElement_btnValidateAddress").prop('disabled', (formInMap.NE_insee==""?true:false));
			if(formInMap.NE_insee != ""){
				$("#divStreetAddress").removeClass("hidden");
			}
		}

		Sig.markerFindPlace.on('dragend', function(){
			formInMap.NE_lat = Sig.markerFindPlace.getLatLng().lat;
			formInMap.NE_lng = Sig.markerFindPlace.getLatLng().lng;
			Sig.markerFindPlace.openPopup();
		});

		formInMap.bindFormInMap();

		$("#right_tool_map_locality").removeClass("hidden");
		$("#right_tool_map_search").addClass("hidden");


	},

	initUpdateLocality : function(address, geo, type, index){
		mylog.log("initUpdateLocality", address, geo, type, index);
		if(address != null && geo != null ){
			formInMap.NE_insee = address.codeInsee;
			formInMap.NE_lat = geo.latitude;
			formInMap.NE_lng = geo.longitude;
			formInMap.NE_city = address.addressLocality;
			formInMap.NE_cp = address.postalCode;
			formInMap.NE_street = address.streetAddress.trim();
			formInMap.NE_country = address.addressCountry;
			formInMap.NE_dep = address.depName;
			formInMap.NE_region = address.regionName;
			if(index)
				formInMap.addressesIndex = index ;
			formInMap.initDropdown();
			formInMap.getDepAndRegion();
			formInMap.getDetailCity();
		}else{
			formInMap.initVarNE();
			if(index)
				formInMap.addressesIndex = index ;
		}
		formInMap.formType = type ;
		formInMap.updateLocality = true;
		if(typeof contextMap == "undefined")
			contextMap = [];
		formInMap.showMarkerNewElement();
	},

	bindFormInMap : function(){
		// ---------------- newElement_country
		$('[name="newElement_country"]').change(function(){
			mylog.log("change country");
			formInMap.NE_country = $('[name="newElement_country"]').val() ;
			formInMap.NE_insee = "";
			formInMap.NE_lat = "";
			formInMap.NE_lng = "";
			formInMap.NE_city = "";
			formInMap.NE_cp = "";
			formInMap.NE_street = "";

			formInMap.initHtml();

			$("#newElement_btnValidateAddress").prop('disabled', true);
			$("#divStreetAddress").addClass("hidden");
			formInMap.initDropdown();
			mylog.log("formInMap.NE_country", formInMap.NE_country, typeof formInMap.NE_country, formInMap.NE_country.length);
			if(formInMap.NE_country != ""){
				$("#divPostalCode").removeClass("hidden");
				$("#divCity").removeClass("hidden");
			}else{
				$("#divPostalCode").addClass("hidden");
				$("#divCity").addClass("hidden");
			}
				
		});

		// ---------------- newElement_city
		$('[name="newElement_city"]').keyup(function(){ 
			$("#dropdown-city-found").show();
			if($('[name="newElement_city"]').val().length > 1){
				formInMap.NE_city = $('[name="newElement_city"]').val();
				formInMap.changeSelectCountrytim();

				if(notNull(formInMap.timeoutAddCity)) 
					clearTimeout(formInMap.timeoutAddCity);

				formInMap.timeoutAddCity = setTimeout(function(){ 
					formInMap.autocompleteFormAddress("locality", $('[name="newElement_city"]').val()); 
				}, 500);
			}
		});

		$('[name="newElement_city"]').focusout(function(){
			if(notNull(formInMap.timeoutAddCity)) 
				clearTimeout(formInMap.timeoutAddCity);
			if( $('[name="dropdown-newElement_city-found"]').length )
				formInMap.timeoutAddCity = setTimeout(function(){ $("#dropdown-newElement_city-found").hide(); }, 200);
			/*if( $('[name="dropdown-newElement_locality-found"]').length )
				formInMap.timeoutAddCity = setTimeout(function(){ $("#dropdown-newElement_locality-found").hide(); }, 200);*/
		});

		$('[name="newElement_city"]').focus(function(){
			$(".dropdown-menu").hide();
			
			if( $('[name="newElement_city"]').length ){
				$("#dropdown-newElement_city-found").show();
				if($('[name="newElement_city"]').val().length > 0){
					formInMap.autocompleteFormAddress("locality", $('[name="newElement_city"]').val());
				}
			}

			if( $('[name="dropdown-newElement_locality-found"]').length ){
				$("#dropdown-newElement_locality-found").show();
				if($('[name="newElement_city"]').val().length > 0){
					formInMap.autocompleteFormAddress("locality", $('[name="newElement_city"]').val());
				}
			}
		});

		// ---------------- newElement_streetAddress
		$("#newElement_btnSearchAddress").click(function(){
			$(".dropdown-menu").hide();
			formInMap.searchAdressNewElement();
		});

		$('[name="newElement_street"]').keyup(function(){ 
			formInMap.showWarningGeo( ( ( $('[name="newElement_street"]').val().length > 0 ) ? true : false ) );
		});


		$("#newElement_btnValidateAddress").click(function(){
			/*if(notEmpty(formInMap.saveCities[formInMap.NE_insee])){
				var obj = { city : formInMap.saveCities[formInMap.NE_insee] }
				obj.city.geoShape = 1;
				if(uncomplete == true){
					var postalCode = {};
					
					postalCode.name = obj.city.name;
					postalCode.postalCode = formInMap.NE_cp;
					postalCode.geo = obj.city.geo;
					postalCode.geoPosition = obj.city.geoPosition;

					mylog.log("saveCities", typeof obj.city.postalCodes, obj.city.postalCodes);

					obj.city.postalCodes.push(postalCode);
				}
				
				$.ajax({
			        type: "POST",
			        url: baseUrl+"/"+moduleId+"/city/save",
			        data: obj,
			       	dataType: "json",
			    	success: function(data){
			    		console.dir(obj.city);
			    		mylog.log("data", data);
			    		if(data.result)
			    			formInMap.backToForm();
			    	},
					error: function(error){
						mylog.log("error", error);
			    		$("#dropdown-newElement_"+currentScopeType+"-found").html("error");
						mylog.log("Une erreur est survenue pendant l'enregistrement de la commune");
					}
				});
			}else*/
				formInMap.backToForm();
		});

		$("#newElement_btnCancelAddress").click(function(){
			formInMap.cancel();
		});
	},


	autocompleteFormAddress : function(currentScopeType, scopeValue){
		mylog.log("autocompleteFormAddress", currentScopeType, scopeValue);
		$("#dropdown-newElement_"+currentScopeType+"-found").html("<li><a href='javascript:'><i class='fa fa-refresh fa-spin'></i></a></li>");
		$("#dropdown-newElement_"+currentScopeType+"-found").show();
		$.ajax({
	        type: "POST",
	        url: baseUrl+"/"+moduleId+"/city/autocompletemultiscope",
	        data: {
	        		type: currentScopeType, 
	        		scopeValue: scopeValue,
	        		geoShape: true,
	        		countryCode : $('[name="newElement_country"]').val()
	        },
	       	dataType: "json",
	    	success: function(data){

	    		mylog.log("autocompleteFormAddress success", data);
	    		html="";
	    		var allCP = new Array();
	    		var allCities = new Array();
	    		var inseeGeoSHapes = new Array();
	    		formInMap.saveCities = new Array();
	    		$.each(data.cities, function(key, value){
	    			var insee = value.insee;
	    			var country = value.country;
	    			var dep = value.depName;
	    			var region = value.regionName;
	    			if(notEmpty(value.save))
	    				formInMap.saveCities[insee] = value;

	    			if(notEmpty(value.geoShape))
				    	inseeGeoSHapes[insee] = value.geoShape.coordinates[0];

	    			if(currentScopeType == "city" || currentScopeType == "locality") { mylog.log("in scope city"); mylog.dir(value);
	    				if(value.postalCodes.length > 0){
	    					$.each(value.postalCodes, function(key, valueCP){
			    				var val = valueCP.name; 
			    				var lbl = valueCP.postalCode ;
			    				var lat = valueCP.geo.latitude;
			    				var lng = valueCP.geo.longitude;
			    				var lblList = value.name + ", " + valueCP.name + ", " + valueCP.postalCode ;
			    				html += "<li><a href='javascript:' data-type='"+currentScopeType+"' data-dep='"+dep+"' data-region='"+region+"' data-country='"+country+"' data-city='"+val+"' data-cp='"+lbl+"' data-lat='"+lat+"' data-lng='"+lng+"' data-insee='"+insee+"' class='item-city-found'>"+lblList+"</a></li>";
			    			});
	    				}else{
	    					var val = value.name; 
		    				var lat = value.geo.latitude;
		    				var lng = value.geo.longitude;
			    				var lblList = value.name ;
	    					html += "<li><a href='javascript:' data-type='"+currentScopeType+"' data-dep='"+dep+"' data-region='"+region+"' data-country='"+country+"' data-city='"+val+"' data-lat='"+lat+"' data-lng='"+lng+"' data-insee='"+insee+"' class='item-city-found-uncomplete'>"+lblList+"</a></li>";
						}
	    			};
	    		});

	    		if(html == "") html = "<i class='fa fa-ban'></i> Aucun résultat";
	    		$("#dropdown-newElement_"+currentScopeType+"-found").html(html);
	    		$("#dropdown-newElement_"+currentScopeType+"-found").show();

	    		$(".item-city-found, .item-cp-found").click(function(){
	    			formInMap.add(true, $(this), inseeGeoSHapes);
	    		});

	    		$(".item-city-found-uncomplete").click(function(){
	    			formInMap.add(false, $(this), inseeGeoSHapes);
	    		});
		    },
			error: function(error){
	    		$("#dropdown-newElement_"+currentScopeType+"-found").html("error");
				mylog.log("Une erreur est survenue pendant autocompleteMultiScope");
			}
		});
	},


	add : function(complete, data, inseeGeoSHapes){
		mylog.log("add", complete, data, inseeGeoSHapes);
		
		formInMap.NE_insee = data.data("insee");
		formInMap.NE_lat = data.data("lat");
		formInMap.NE_lng = data.data("lng");
		formInMap.NE_city = data.data("city");
		formInMap.NE_country = data.data("country");
		formInMap.NE_dep = data.data("dep");
		formInMap.NE_region = data.data("region");

		if(complete == true){
			//$('[name="newElement_cp"]').val(data.data("cp"));
			//$('#cp_sumery_value').html(data.data("cp"));
			formInMap.NE_cp = data.data("cp");
		}else{
			uncomplete = true;
			$('[name="newElement_cp"]').attr( "placeholder", "Vous devez ajouter un code postal" );
			$('#divPostalCode').addClass("has-error");
		}

		formInMap.initHtml();
		
		Sig.markerFindPlace.setLatLng([data.data("lat"), data.data("lng")]);
		mylog.log("geoShape", inseeGeoSHapes);
		if(notEmpty(inseeGeoSHapes[formInMap.NE_insee])){
			var shape = inseeGeoSHapes[formInMap.NE_insee];
			shape = Sig.inversePolygon(shape);
			Sig.showPolygon(shape);
			setTimeout(function(){
				Sig.map.fitBounds(shape);
				Sig.map.invalidateSize();
			}, 1500);
		}else{
			setTimeout(function(){
				Sig.centerPopupMarker([formInMap.NE_lat, formInMap.NE_lng], 12);
			}, 2500);
		}
		$("#dropdown-newElement_cp-found, #dropdown-newElement_city-found, #dropdown-newElement_streetAddress-found, #dropdown-newElement_locality-found").hide();


		//formInMap.updateSummeryLocality(data);
		formInMap.btnValideDisable( (complete == true ? false : true) );
		$("#divStreetAddress").removeClass("hidden");
	},

	searchAdressNewElement : function(){ 
		mylog.log("searchAdressNewElement");
		var providerName = "";
		var requestPart = "";

		var street 	= ($('[name="newElement_street"]').val()  != "") ? $('[name="newElement_street"]').val() : "";
		var city 	= formInMap.NE_city;
		var cp 		= formInMap.NE_cp;
		var countryCode = formInMap.NE_country;


		if($('[name="newElement_street"]').val() != ""){
			providerName = "nominatim";
			formInMap.typeSearchInternational = "address";
			//construction de la requete
			requestPart = addToRequest(requestPart, street);
			requestPart = addToRequest(requestPart, city);
			requestPart = addToRequest(requestPart, cp);
		}else{
			providerName = "communecter"
			formInMap.typeSearchInternational = "city";
			//construction de la requete
			if(cp != ""){
				requestPart = addToRequest(requestPart, cp);
			}
		}

		formInMap.NE_street = $('[name="newElement_street"]').val();

		$("#dropdown-newElement_streetAddress-found").html("<li><a href='javascript:'><i class='fa fa-spin fa-refresh'></i> recherche en cours</a></li>");
		$("#dropdown-newElement_streetAddress-found").show();
		mylog.log("countryCode", countryCode);
		if(countryCode == "NC"){
			countryCode = formInMap.changeCountryForNominatim(countryCode);
			mylog.log("countryCode", countryCode);
			callNominatim(requestPart, countryCode);
		}else{
			countryCode = formInMap.changeCountryForNominatim(countryCode);
			mylog.log("countryCode", countryCode);
			callDataGouv(requestPart, countryCode);
		}
		
		formInMap.btnValideDisable(false);
	},

	// Pour effectuer une recherche a la Réunion avec Nominatim, il faut choisir le code de la France, pas celui de la Réunion
	changeCountryForNominatim : function(country){
		var codeCountry = {
			"FR" : ["RE", "GP", "GF", "MQ", "YT", "NC", "PM"]
		};
		$.each(codeCountry, function(key, countries){
			if(countries.indexOf(country) != -1)
		 		country = key;
		});
		return country ;
	},

	backToForm : function(cancel){
		mylog.log("backToForm");
		formInMap.actived = false ;
		if(formInMap.modePostalCode == false ){
			if(formInMap.updateLocality == false ){
				if(notEmpty($("[name='newElement_lat']").val())){
					locObj = formInMap.createLocalityObj();
					dyFInputs.locationObj.copyMapForm2Dynform(locObj);
					dyFInputs.locationObj.addLocationToForm(locObj);
				}
				$("#form-street").val($('#street_sumery_value').html());
				showMap(false);
				Sig.clearMap();
				if(location.hash != "#referencement" && location.hash != "#web")
					$('#ajax-modal').modal("show");
			}else{
				if(typeof cancel == "undefined" || cancel == false)
					formInMap.updateLocalityElement();
				showMap(false);
				if(typeof contextMap != "undefined")
					Sig.showMapElements(Sig.map, contextMap);
			}	
		}else{
			if(notEmpty($("[name='newPC_lat']").val())){
				postalCodeObj = {
					postalCode : $("[name='newPC_postalCode']").val(),
					name : $("[name='newPC_name']").val(),
					latitude : $("[name='newPC_lat']").val(),
					longitude : $("[name='newPC_lon']").val()
				};
				dyFInputs.locationObj.copyMapForm2Dynform(postalCodeObj);
				dyFInputs.locationObj.addLocationToForm(postalCodeObj);
			}
			showMap(false);
			Sig.clearMap();
			if(location.hash != "#referencement" && location.hash != "#web")
				$('#ajax-modal').modal("show");
		}
	},

	updateLocalityElement : function(){
		mylog.log("updateLocalityElement");
		var locality = formInMap.createLocalityObj(true);

		if(formInMap.addressesIndex)
			locality["addressesIndex"] = formInMap.addressesIndex ;
		
		var params = {
			name : ((formInMap.addressesIndex)?"addresses":"locality"),
			value : locality,
			pk : contextData.id,
			type : contextData.type
		};
		
		if(userId != ""){
			$.ajax({
		        type: "POST",
		        url: baseUrl+"/"+moduleId+"/element/updatefields/type/"+params.type,
		        data: params,
		       	dataType: "json",
		    	success: function(data){
		    		mylog.log("data", data);
			    	
			    	if(data.result){
			    		var inMap = true ;			    		
			    		
		    			if(typeof contextData.address == "undefined" || contextData.address == null){
		    				inMap =false ;
			    		}
			    		contextData.address = locality.address;
						contextData.geo = locality.geo;
			    		contextData.geoPosition = locality.geoPosition;
			    		

						formInMap.hiddenHtmlMap(false);
						formInMap.initData();

						if(!formInMap.addressesIndex){							
							if(contextData.id != userId){
								var typeMap = ((typeof contextData == "undefined" || contextData == null) ? "citoyens" : contextData.type) ;
								if(typeMap == "citoyens")
									typeMap = "people";
								if(inMap == false)
									contextMap = Sig.addContextMap(contextMap, contextData, typeMap);
								else
									contextMap = Sig.modifLocalityContextMap(contextMap, contextData, typeMap);
							}else{
								currentUser.addressCountry = locality.address.addressCountry;
								currentUser.postalCode = locality.address.postalCode;
								currentUser.codeInsee = locality.address.codeInsee;
								if(typeof Sig.myPosition != "undefined"){
									Sig.myPosition.position.latitude = locality.geo.latitude;
									Sig.myPosition.position.longitude = locality.geo.longitude;
								}
							}
						}
						Sig.restartMap();
						$("#right_tool_map_locality").addClass("hidden");
						$("#right_tool_map_search").removeClass("hidden");
						urlCtrl.loadByHash("#page.type."+contextData.type+".id."+contextData.id+".view.detail");
						toastr.success(data.msg);
						
			    	}else{
			    		toastr.error(data.msg);
			    	}
			    }
			});
		}
		
	},

	initDropdown : function(){ 
		$("#dropdown-newElement_cp-found").html("<li><a href='javascript:' class='disabled'>"+trad['Currently researching']+"</a></li>");
		$("#dropdown-newElement_city-found").html("<li><a href='javascript:' class='disabled'>"+trad['Search a city, a town or a postal code'] +"</a></li>");
	},

	initData : function(){
		mylog.log("initData");
		formInMap.timeoutAddCity;
		formInMap.initVarNE();
		formInMap.typeSearchInternational = "";
		formInMap.formType = "";
		formInMap.updateLocality = false;
		formInMap.addressesIndex = false;
		formInMap.initDropdown();
		$("#divStreetAddress").addClass("hidden");
		$("#divPostalCode").addClass("hidden");
		$("#divCity").addClass("hidden");
		formInMap.initHtml();
	},

	initHtml : function(){
		var fieldsLocality = ["insee", "lat", "lng", "city", "dep", "region", "country", "cp", "street"]

		$.each(fieldsLocality, function(key, value){
			$('[name="newElement_'+value+'"]').val(formInMap["NE_"+value]);
			if(value == "country")
				$('#'+value+'_sumery_value').html(tradCountry[ formInMap["NE_"+value] ]);
			else
				$('#'+value+'_sumery_value').html(formInMap["NE_"+value]);
				

			if(formInMap["NE_"+value] != ""){
				$('#'+value+'_sumery').removeClass("hidden");
			}
			else
				$('#'+value+'_sumery').addClass("hidden");
		});
	},

	initVarNE : function(){
		formInMap.NE_insee = "";
		formInMap.NE_lat = "";
		formInMap.NE_lng = "";
		formInMap.NE_city = "";
		formInMap.NE_cp = "";
		formInMap.NE_street = "";
		formInMap.NE_country = "";
		formInMap.NE_dep = "";
		formInMap.NE_region = "";
	},

	createLocalityObj : function(withUnikey){
		mylog.log("createLocalityObj");
		
		var locality = {
			address : {
				"@type" : "PostalAddress",
				codeInsee : formInMap.NE_insee,
				streetAddress : formInMap.NE_street.trim(),
				postalCode : formInMap.NE_cp,
				addressLocality : formInMap.NE_city,
				depName : formInMap.NE_dep,
				regionName : formInMap.NE_region,
				addressCountry : formInMap.NE_country
			},
			geo : {
				"@type" : "GeoCoordinates",
				latitude : formInMap.NE_lat,
				longitude : formInMap.NE_lng
			},
			geoPosition : {
				"type" : "Point",
				"coordinates" : [ parseFloat(formInMap.NE_lng), parseFloat(formInMap.NE_lat) ]
			},
		};

		if(typeof withUnikey != "undefined" && withUnikey == true){
			var unikey = formInMap.NE_country + "_" + formInMap.NE_insee + "-" + formInMap.NE_cp;
			locality.unikey = unikey;
		}

		return locality;
	},

	seenAddress : function(street, cp, city, country, insee){
		var val = "" ;
		val += ( ( notEmpty(street)  ) ? street+"<br/>": ( (notEmpty(insee) ) ? "": trad.UnknownLocality ) );
		val += ( ( notEmpty(cp)  ) ?  cp + ", " : "") + " " + ( ( notEmpty(city) ) ?  city : "")  ;	
		val += ( ( notEmpty(country) && notEmpty(tradCountry[ country ]) ) ? ", " + tradCountry[ country ] : "" ) ;
		return val ;
	},


	getDepAndRegion : function(){
		if(typeof formInMap.NE_dep == "undefined" || formInMap.NE_dep == "" || typeof formInMap.NE_region == "undefined" || formInMap.NE_region == ""){
			$.ajax({
		        type: "POST",
		        url: baseUrl+"/"+moduleId+"/city/getDepAndRegion/",
		        data: {insee : formInMap.NE_insee},
		       	dataType: "json",
		    	success: function(data){
		    		mylog.log("getDepAndRegion", data);
			    	
			    	if(data.depName){
			    		formInMap.NE_dep = data.depName;
			    	}else{
			    		formInMap.NE_dep = "";
			    	}

			    	if(data.regionName){
			    		formInMap.NE_region = data.regionName;
					}else{
			    		formInMap.NE_region = "";
			    	}
			    }
			});
		}
	},


	changeSelectCountrytim : function(){
		mylog.log("changeSelectCountrytim", formInMap.NE_country);
		mylog.log("formInMap.NE_cp.substring(0, 3)");
		var countryFR = ["FR","GP","MQ","GF","RE","PM","YT"];
		var regexNumber = new RegExp("[1-9]+") ;
		if(countryFR.indexOf(formInMap.NE_country) != -1 && regexNumber.test(formInMap.NE_country) ) {
			var name = $('[name="newElement_city"]').val();
			if(name.substring(0, 3) == "971")
				$('[name="newElement_country"]').val("GP");
			else if(name.substring(0, 3) == "972")
				$('[name="newElement_country"]').val("MQ");
			else if(name.substring(0, 3) == "973")
				$('[name="newElement_country"]').val("GF");
			else if(name.substring(0, 3) == "974")
				$('[name="newElement_country"]').val("RE");
			else if(name.substring(0, 3) == "975")
				$('[name="newElement_country"]').val("PM");
			else if(name.substring(0, 3) == "976")
				$('[name="newElement_country"]').val("YT");
			else
				$('[name="newElement_country"]').val("FR");
		}
	},

	btnValideDisable : function(bool){
		$("#newElement_btnValidateAddress").prop('disabled', bool);
	},

	showWarningGeo : function(bool){
		mylog.log("showWarningGeo");
		if(bool == true){
			$("#alertGeo").removeClass("hidden");
			$("#newElement_btnSearchAddress").removeClass("btn-default");
			$("#newElement_btnSearchAddress").addClass("btn-warning");
		}else{
			$("#alertGeo").addClass("hidden");
			$("#newElement_btnSearchAddress").removeClass("btn-warning");
			$("#newElement_btnSearchAddress").addClass("btn-default");
		}
		
	},

	hiddenHtmlMap : function(bool){
		if(bool == true){
			$("#txt-find-place").addClass("hidden");
			$("#input-search-map").addClass("hidden");
			$("#menu-map-btn-start-search").addClass("hidden");
			$("#mainMap .tools-btn").addClass("hidden");
			$("#map-loading-data").addClass("hidden");
		}else{
			$("#txt-find-place").removeClass("hidden");
			$("#input-search-map").removeClass("hidden");
			$("#menu-map-btn-start-search").removeClass("hidden");
			$("#mainMap .tools-btn").removeClass("hidden");
			$("#map-loading-data").removeClass("hidden");
		}
	},

	getDetailCity : function(){
		mylog.log("getDetailCity");
		$.ajax({
			type: "POST",
			url: baseUrl+"/"+moduleId+"/city/detailforminmap/",
			data: {insee : formInMap.NE_insee},
			dataType: "json",
			success: function(data){
				formInMap.geoShape = data.geoShape;
				formInMap.displayGeoShape();
			}
		});
	},

	displayGeoShape : function(){
		mylog.log("displayGeoShape");
		var geoShape = Sig.inversePolygon(formInMap.geoShape.coordinates[0]);
		Sig.showPolygon(geoShape);
		setTimeout(function(){
			Sig.map.fitBounds(geoShape);
			Sig.map.invalidateSize();
		}, 1500);
	},

	cancel : function(){
		$("#right_tool_map_locality").addClass("hidden");
		$("#right_tool_map_search").removeClass("hidden");
		formInMap.initVarNE();
		formInMap.initHtml();
		formInMap.hiddenHtmlMap(false);
		formInMap.backToForm(true);
		
	}

};