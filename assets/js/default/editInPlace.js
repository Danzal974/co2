function bindAboutPodElement() {
		$("#editGeoPosition").click(function(){
			Sig.startModifyGeoposition(contextData.id, contextData.type, contextData);
			showMap(true);
		});
		
		$("#editElementDetail").on("click", function(){
			switchModeElement();
		});
	}

	function changeHiddenFields() { 
		mylog.log("-----------------changeHiddenFields----------------------");
		//
		listFields = [	"username", "birthDate", "email", "avancement", "url", "fixe",
						"mobile","fax", "facebook", "twitter", "gpplus", "gitHub", "skype", "telegram"];
		
		$.each(listFields, function(i,value) {
			mylog.log("listFields", value, typeof contextData[value]);
			if(typeof contextData[value] != "undefined" && contextData[value].length == 0)
				$("."+value).val("<i>"+trad.notSpecified+"<i>");
		});
		mylog.log("-----------------changeHiddenFields END----------------------");
	}

	function updateCalendar() {
		if(contextData.type == typeObj.event.col){
			getAjax(".calendar",baseUrl+"/"+moduleId+"/event/calendarview/id/"+contextData.id +"/pod/1?date=1",null,"html");
		}
	}

	function removeAddresses (index, formInMap){

		bootbox.confirm({
			message: trad["suredeletelocality"]+"<span class='text-red'></span>",
			buttons: {
				confirm: {
					label: trad["yes"],
					className: 'btn-success'
				},
				cancel: {
					label: trad["no"],
					className: 'btn-danger'
				}
			},
			callback: function (result) {
				if (!result) {
					return;
				} else {
					var addresses = { addressesIndex : index };
					var param = new Object;
					param.name = "addresses";
					param.value = addresses;
					param.pk = contextData.id;
					$.ajax({
				        type: "POST",
				        url: baseUrl+"/"+moduleId+"/element/updatefields/type/"+contextData.type,
				        data: param,
				       	dataType: "json",
				    	success: function(data){
					    	if(data.result){
								toastr.success(data.msg);

								if(formInMap == true){
									$(".locationEl"+ index).remove();
									dyFInputs.locationObj.elementLocation = null;
									dyFInputs.locationObj.elementLocations.splice(ix,1);
									//TODO check if this center then apply on first
									//$(".locationEl"+dyFInputs.locationObj.countLocation).remove();
								}
								else
									urlCtrl.loadByHash(location.hash);
					    	}
					    }
					});
				}
			}
		});		
	}

	function updateOrganizer() {
		bootbox.confirm({
			message: 
				trad["udpateorganizer"]+
				buildSelect("organizerId", "organizerId", 
							{"inputType" : "select", "options" : firstOptions(), 
							"groupOptions":myAdminList( ["organizations","projects"] )}, ""),
			buttons: {
				confirm: {
					label: trad["udpateorganizer"],
					className: 'btn-success'
				},
				cancel: {
					label: trad["cancel"],
					className: 'btn-danger'
				}
			},
			
			callback: function (result) {
				if (!result) {
					return;
				} else {
					var organizer = { "organizerId" : organizerId, "organizerType" : organizerType };

					var param = new Object;
					param.name = "organizer";
					param.value = organizer;
					param.pk = contextData.id;
					$.ajax({
				        type: "POST",
				        url: baseUrl+"/"+moduleId+"/element/updatefields/type/"+contextData.type,
				        data: param,
				       	dataType: "json",
				    	success: function(data){
					    	if(data.result){
								toastr.success(data.msg);
								urlCtrl.loadByHash("#page.type."+contextData.type+".id."+contextData.id+".view.detail");
					    	} else {
					    		toastr.error(data.msg);
					    	}
					    }
					});
				}
			}
		}).init(function(){
        	console.log("init de la bootbox !");
        	$("#organizerId").off().on("change",function(){
        		organizerId = $(this).val();
        		if(organizerId == "dontKnow" )
        			organizerType = "dontKnow";
        		else if( $('#organizerId').find(':selected').data('type') && typeObj[$('#organizerId').find(':selected').data('type')] )
        			organizerType = typeObj[$('#organizerId').find(':selected').data('type')].col;
        		else
        			organizerType = typeObj["person"].col;

        		mylog.warn( "organizer",organizerId,organizerType );
        		$("#ajaxFormModal #organizerType ").val( organizerType );
        	});
        })
	}
	
	function buildSelect(id, field, fieldObj,formValues) {
		var fieldClass = (fieldObj.class) ? fieldObj.class : '';
		var placeholder = (fieldObj.placeholder) ? fieldObj.placeholder+required : '';
		var fieldHTML = "";
		if ( fieldObj.inputType == "select" || fieldObj.inputType == "selectMultiple" ) 
        {
       		var multiple = (fieldObj.inputType == "selectMultiple") ? 'multiple="multiple"' : '';
       		mylog.log("build field "+field+">>>>>> select selectMultiple");
       		var isSelect2 = (fieldObj.isSelect2) ? "select2Input" : "";
       		fieldHTML += '<select class="'+isSelect2+' '+fieldClass+'" '+multiple+' name="'+field+'" id="'+field+'" style="width: 100%;height:30px;" data-placeholder="'+placeholder+'">';
			if(placeholder)
				fieldHTML += '<option class="text-red" style="font-weight:bold" disabled selected>'+placeholder+'</option>';
			else
				fieldHTML += '<option></option>';

			var selected = "";
			
			//initialize values
			if(fieldObj.options)
				fieldHTML += buildSelectOptions(fieldObj.options, fieldObj.value);
			
			if( fieldObj.groupOptions ){
				fieldHTML += buildSelectGroupOptions(fieldObj.groupOptions, fieldObj.value);
			} 
			fieldHTML += '</select>';
        }
        return fieldHTML;
	}


	function bindDynFormEditable(){
		$(".btn-update-when").off().on( "click", function(){
			var form = {
				saveUrl : baseUrl+"/"+moduleId+"/element/updateblock/",
				dynForm : {
					jsonSchema : {

						title : trad["Update date"],
						icon : "fa-key",
						onLoads : {
							initUpdateWhen : function(){
								mylog.log("initUpdateInfo");
								$("#ajax-modal .modal-header").removeClass("bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-blue bg-turq bg-url")
											  					  .addClass("bg-dark");
							}
						},
						beforeSave : function(){
							mylog.log("beforeSave");
							var allDay = $("#ajaxFormModal #allDay").is(':checked');
							$("#ajaxFormModal #allDayHidden").val(allDay);
					    	removeFieldUpdateDynForm(contextData.type);
					    	
					    	var dateformat = "DD/MM/YYYY";
					    	var outputFormat="YYYY-MM-DD";
					    	if (! allDay && contextData.type == typeObj.event.col) {
					    		var dateformat = "DD/MM/YYYY HH:mm" ;
					    		var outputFormat="YYYY-MM-DD HH::mm";
					    	}
					    	$("#ajaxFormModal #startDate").val( moment( $("#ajaxFormModal #startDate").val(), dateformat).format(outputFormat));
							$("#ajaxFormModal #endDate").val( moment( $("#ajaxFormModal #endDate").val(), dateformat).format(outputFormat));
					    },
						afterSave : function(data){
							mylog.dir(data);
							if(data.result && data.resultGoods.result){
								if(typeof data.resultGoods.values.allDay != "undefined"){
									contextData.allDay = data.resultGoods.values.allDay;

									$("#allDayAbout").html((contextData.allDay ? trad["yes"] : trad["no"]));
								}  
								if(typeof data.resultGoods.values.startDate != "undefined"){
									contextData.startDate = data.resultGoods.values.startDate;
									//$("#startDateAbout").html(moment(contextData.startDate).local().locale("fr").format(formatDateView));
									//$("#startDateAbout").html(directory.returnDate(contextData.startDate, formatDateView));
								}  
								if(typeof data.resultGoods.values.endDate != "undefined"){
									contextData.endDate = data.resultGoods.values.endDate;
									//$("#endDateAbout").html(moment(contextData.endDate).local().locale("fr").format(formatDateView));
									//$("#endDateAbout").html(directory.returnDate(contextData.endDate, formatDateView));
								}
								initDateHeaderPage(contextData);
								initDate();
								updateCalendar();
							}
							//urlCtrl.loadByHash(location.hash);
							dyFObj.closeForm();
						},
						properties : {
							block : dyFInputs.inputHidden(),
							typeElement : dyFInputs.inputHidden(),
							isUpdate : dyFInputs.inputHidden(true)
						}
					}
				}
			};

			var typeDate = "date";
			if(contextData.type == typeObj.event.col){
				var checked = (notNull(contextData.allDay) && contextData.allDay == true) ?  true : false ;
				form.dynForm.jsonSchema.properties.allDay = dyFInputs.allDay(checked);
				form.dynForm.jsonSchema.properties.allDayHidden = dyFInputs.inputHidden(checked);
				mylog.log("allDay", checked)
				if(checked == false )
					typeDate = "datetime";
				
			}
			
			
			form.dynForm.jsonSchema.properties.startDate = dyFInputs.startDateInput(typeDate);
			form.dynForm.jsonSchema.properties.endDate = dyFInputs.endDateInput(typeDate);

			var dataUpdate = {
				block : "when",
		        id : contextData.id,
		        typeElement : contextData.type,
			};
			
			if(notEmpty(contextData.startDateDB))
				dataUpdate.startDate = moment(contextData.startDateDB,"YYYY-MM-DD HH:mm").local().format(formatDatedynForm);

			if(notEmpty(contextData.endDateDB))
				dataUpdate.endDate = moment(contextData.endDateDB,"YYYY-MM-DD HH:mm").local().format(formatDatedynForm);

			mylog.log("btn-update-when", form, dataUpdate, formatDatedynForm);
			dyFObj.openForm(form, "initUpdateWhen", dataUpdate);
		});


		$(".btn-update-info").off().on( "click", function(){

			var form = {
				saveUrl : baseUrl+"/"+moduleId+"/element/updateblock/",
				dynForm : {
					jsonSchema : {
						title : trad["Update general information"],
						icon : "fa-key",
						onLoads : {
							initUpdateInfo : function(){
								mylog.log("initUpdateInfo");
								$(".emailtext").slideToggle();
								$("#ajax-modal .modal-header").removeClass("bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-blue bg-turq bg-url")
											  					  .addClass("bg-dark");
							}
						},
						beforeSave : function(){
							mylog.log("beforeSave");
							removeFieldUpdateDynForm(contextData.type);
					    },
						afterSave : function(data){
							mylog.dir(data);
							if(data.result && data.resultGoods.result){

								if(typeof data.resultGoods.values.name != "undefined"){
									contextData.name = data.resultGoods.values.name;
									$("#nameHeader").html(contextData.name);
									$("#nameAbout").html(contextData.name);
								}

								if(typeof data.resultGoods.values.username != "undefined"){
									contextData.username = data.resultGoods.values.username;
									$("#usernameAbout").html(contextData.username);
								}
									
								if(typeof data.resultGoods.values.tags != "undefined"){
									contextData.tags = data.resultGoods.values.tags;
									var strHeader = "";
									var strAbout = trad["notSpecified"];
									if($('.header-tags').length && typeof contextData.tags != "undefined" && contextData.tags.length > 0){
										strAbout = "" ;
										$.each(contextData.tags, function (key, tag){
											/*str +=	'<div class="tag label label-danger pull-right" data-val="'+tag+'">'+
														'<i class="fa fa-tag"></i>'+tag+
													'</div>';*/
											strHeader += '<span class="badge letter-red bg-white" style="vertical-align: top;">#'+tag+'</span>';
											/*if(typeof globalTheme == "undefined" || globalTheme != "network")
												addTagToMultitag(tag);*/
											strAbout +=	'<span class="badge letter-red bg-white">'+tag+'</span>';
										});
									}
									$('.header-tags').html(strHeader);
									$('#tagsAbout').html(strAbout);
									if(strHeader == "" && typeof contextData.address == "undefined")
										$('.header-address-tags').addClass("hidden");
									else
										$('.header-address-tags').removeClass("hidden");

									if(strHeader == "")
										$('#separateurTag').addClass("hidden");
									else
										$('#separateurTag').removeClass("hidden");

								}

								if(typeof data.resultGoods.values.avancement != "undefined"){
									contextData.avancement = data.resultGoods.values.avancement.trim();
									val=0;
							    	if(contextData.avancement=="idea")
										val=5;
									else if(contextData.avancement=="concept")
										val=20;
									else if (contextData.avancement== "started")
										val=40;
									else if (contextData.avancement == "development")
										val=60;
									else if (contextData.avancement == "testing")
										val=80;
									else if (contextData.avancement == "mature")
										val=100;
									$('#progressStyle').val(val);
									$('#labelProgressStyle').html(contextData.avancement);
									$('#avancementAbout').html(trad["Project maturity"] + " : " + trad[contextData.avancement] );
								}

								if(typeof data.resultGoods.values.type != "undefined"){

									if(contextData.type == typeObj.organization.col )
										contextData.typeOrga = data.resultGoods.values.type;
									else
										contextData.typeEvent = data.resultGoods.values.type;
									//$("#typeHeader").html(data.resultGoods.values.type);
									$("#typeAbout").html(trad[data.resultGoods.values.type]);
									$("#typeHeader .type-header").html(trad[data.resultGoods.values.type]);
								}

								if(typeof data.resultGoods.values.email != "undefined"){
									mylog.log("update email");
									contextData.email = data.resultGoods.values.email;
									$("#emailAbout").html(contextData.email);
								}

								if(typeof data.resultGoods.values.url != "undefined"){
									mylog.log("update url");
									contextData.url = data.resultGoods.values.url.trim();
									if(contextData.url != "" ){
										$("#webAbout").html('<a href="'+contextData.url+'" target="_blank" id="urlWebAbout" style="cursor:pointer;">'+contextData.url+'</a>');
									}else{
										$("#webAbout").html("<i>"+trad["notSpecified"]+"</i>");
									}
								}  
									
								if(typeof data.resultGoods.values.birthDate != "undefined"){
									mylog.log("update birthDate");
									contextData.birthDate = data.resultGoods.values.birthDate;
									$("#birthDateAbout").html(moment(contextData.birthDate).local().format("DD/MM/YYYY"));
								}

								if(typeof data.resultGoods.values.fixe != "undefined"){
									mylog.log("update fixe");
									contextData.fixe = parsePhone(data.resultGoods.values.fixe);
									$("#fixeAbout").html(contextData.fixe);
								}

								if(typeof data.resultGoods.values.mobile != "undefined"){
									mylog.log("update mobile");
									contextData.mobile = parsePhone(data.resultGoods.values.mobile);
									$("#mobileAbout").html(contextData.mobile);
								}

								if(typeof data.resultGoods.values.fax != "undefined"){
									mylog.log("update fax");
									contextData.fax = parsePhone(data.resultGoods.values.fax);
									$("#faxAbout").html(contextData.fax);
								}
							}
							dyFObj.closeForm();
							changeHiddenFields();
						},
						properties : {
							block : dyFInputs.inputHidden(),
							name : dyFInputs.name(contextData.type),
							typeElement : dyFInputs.inputHidden(),
							isUpdate : dyFInputs.inputHidden(true)
						}
					}
				}
			};

			if(contextData.type == typeObj.person.col ){
				form.dynForm.jsonSchema.properties.username = dyFInputs.inputText("Username", "Username", { required : true });
				form.dynForm.jsonSchema.properties.birthDate = dyFInputs.birthDate;
			}

			if(contextData.type == typeObj.organization.col ){
				form.dynForm.jsonSchema.properties.type = dyFInputs.inputSelect("Type d'organisation", "Type d'organisation", organizationTypes, { required : true });
			}else if(contextData.type == typeObj.event.col ){
				form.dynForm.jsonSchema.properties.type = dyFInputs.inputSelect("Type d'événement", "Type d'événement", eventTypes, { required : true });
			}

			if(contextData.type == typeObj.project.col ){
				form.dynForm.jsonSchema.properties.avancement = dyFInputs.inputSelect("L'avancement du project", "Avancement du projet", avancementProject);
			}

			form.dynForm.jsonSchema.properties.tags = dyFInputs.tags();

			if(contextData.type == typeObj.person.col || contextData.type == typeObj.organization.col ){
				form.dynForm.jsonSchema.properties.email = dyFInputs.email();
				form.dynForm.jsonSchema.properties.fixe= dyFInputs.inputText("Fixe","Saisir les numéros de téléphone séparer par une virgule");
				form.dynForm.jsonSchema.properties.mobile= dyFInputs.inputText("Mobile","Saisir les numéros de portable séparer par une virgule");
				form.dynForm.jsonSchema.properties.fax= dyFInputs.inputText("Fax","Saisir les numéros de fax séparer par une virgule");
			}
			if(contextData.type != typeObj.poi.col) 
				form.dynForm.jsonSchema.properties.url = dyFInputs.inputUrl();
			
			var dataUpdate = {
				block : "info",
		        id : contextData.id,
		        typeElement : contextData.type,
		        name : contextData.name,	
			};
			
			if(notNull(contextData.tags) && contextData.tags.length > 0)
				dataUpdate.tags = contextData.tags;

			if(contextData.type == typeObj.person.col ){
				if(notNull(contextData.username) && contextData.username.length > 0)
					dataUpdate.username = contextData.username;
				if(notEmpty(contextData.birthDate))
					dataUpdate.birthDate = moment(contextData.birthDate).local().format("DD/MM/YYYY");
			}

			if(contextData.type == typeObj.organization.col ){
				if(notEmpty(contextData.typeOrga))
					dataUpdate.type = contextData.typeOrga;
			}

			if(contextData.type == typeObj.event.col ){
				if(notEmpty(contextData.typeEvent))
					dataUpdate.type = contextData.typeEvent;
			}

			if(contextData.type == typeObj.project.col ){
				if(notEmpty(contextData.avancement))
					dataUpdate.avancement = contextData.avancement;
			}
			
			if(contextData.type == typeObj.person.col || contextData.type == typeObj.organization.col ){
				if(notEmpty(contextData.email)) 
					dataUpdate.email = contextData.email;
				if(notEmpty(contextData.fixe))
					dataUpdate.fixe = contextData.fixe;
				if(notEmpty(contextData.mobile))
					dataUpdate.mobile = contextData.mobile;
				if(notEmpty(contextData.fax))
					dataUpdate.fax = contextData.fax;
			}
			
			if(contextData.type != typeObj.poi.col && notEmpty(contextData.url)) 
				dataUpdate.url = contextData.url;
			
			mylog.log("dataUpdate", dataUpdate);
			dyFObj.openForm(form, "initUpdateInfo", dataUpdate);
		});

		$(".btn-update-descriptions").off().on( "click", function(){

			var form = {
				saveUrl : baseUrl+"/"+moduleId+"/element/updateblock/",
				dynForm : {
					jsonSchema : {
						title : trad["Update description"],
						icon : "fa-key",
						onLoads : {
							
							markdown : function(){
								dataHelper.activateMarkdown("#ajaxFormModal #description");
								$("#ajax-modal .modal-header").removeClass("bg-dark bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-blue bg-turq bg-url")
											  					  .addClass("bg-dark");
								//bindDesc("#ajaxFormModal");
							}
						},
						afterSave : function(data){
							mylog.dir(data);
							if(data.result && data.resultGoods.result){
								if(data.resultGoods.values.shortDescription=="")
									$(".contentInformation #shortDescriptionAbout").html('<i>'+trad["notSpecified"]+'</i>');
								else
									$(".contentInformation #shortDescriptionAbout").html(data.resultGoods.values.shortDescription);
								$(".contentInformation #shortDescriptionAboutEdit").html(data.resultGoods.values.shortDescription);
								$("#shortDescriptionHeader").html(data.resultGoods.values.shortDescription);
								if(data.resultGoods.values.description=="")
									$(".contentInformation #descriptionAbout").html(dataHelper.markdownToHtml('<i>'+trad["notSpecified"]+'</i>'));
								else
									$(".contentInformation #descriptionAbout").html(dataHelper.markdownToHtml(data.resultGoods.values.description));
								$("#descriptionMarkdown").html(data.resultGoods.values.description);
							}
							dyFObj.closeForm();
							changeHiddenFields();
						},
						properties : {
							block : dyFInputs.inputHidden(),
							typeElement : dyFInputs.inputHidden(),
							isUpdate : dyFInputs.inputHidden(true),
							shortDescription : 	dyFInputs.textarea("Description courte", "...",{ maxlength: 140 }),
							description : dyFInputs.textarea("Description longue", "..."),
						}
					}
				}
			};

			var dataUpdate = {
				block : "descriptions",
		        id : contextData.id,
		        typeElement : contextData.type,
		        name : contextData.name,
		        shortDescription : $(".contentInformation #shortDescriptionAboutEdit").html(),
				description : $("#descriptionMarkdown").html(),	
			};

			dyFObj.openForm(form, "markdown", dataUpdate);
		});


		$(".btn-update-network").off().on( "click", function(){
			var form = {
				saveUrl : baseUrl+"/"+moduleId+"/element/updateblock/",
				dynForm : {
					jsonSchema : {
						title : trad["Update network"],
						icon : "fa-key",
						onLoads : {
							sub : function(){
								$("#ajax-modal .modal-header").removeClass("bg-dark bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-blue bg-turq bg-url")
											  				  .addClass("bg-dark");
								//bindDesc("#ajaxFormModal");
							}
						},
						beforeSave : function(){
							mylog.log("beforeSave");
					    	removeFieldUpdateDynForm(contextData.type);
					    },
						afterSave : function(data){
							mylog.dir(data);
							if(data.result && data.resultGoods.result){

								if(typeof data.resultGoods.values.telegram != "undefined"){
									contextData.socialNetwork.telegram = data.resultGoods.values.telegram.trim();
									changeNetwork('#telegramAbout', contextData.socialNetwork.telegram, 'https://web.telegram.org/#/im?p=@'+contextData.socialNetwork.telegram);
								}

								if(typeof data.resultGoods.values.facebook != "undefined"){
									contextData.socialNetwork.facebook = data.resultGoods.values.facebook.trim();
									changeNetwork('#facebookAbout', contextData.socialNetwork.facebook, contextData.socialNetwork.facebook);
								}

								if(typeof data.resultGoods.values.twitter != "undefined"){
									contextData.socialNetwork.twitter = data.resultGoods.values.twitter.trim();
									changeNetwork('#twitterAbout', contextData.socialNetwork.twitter, contextData.socialNetwork.twitter);
								}

								if(typeof data.resultGoods.values.gitHub != "undefined"){
									contextData.socialNetwork.gitHub = data.resultGoods.values.gitHub.trim();
									changeNetwork('#gitHubAbout', contextData.socialNetwork.gitHub, contextData.socialNetwork.gitHub);
								}

								if(typeof data.resultGoods.values.skype != "undefined"){
									contextData.socialNetwork.skype = data.resultGoods.values.skype.trim();
									changeNetwork('#skypeAbout', contextData.socialNetwork.skype, contextData.socialNetwork.skype);
								}

								if(typeof data.resultGoods.values.gpplus != "undefined"){
									contextData.socialNetwork.gpplus = data.resultGoods.values.gpplus.trim();
									changeNetwork('#gpplusAbout', contextData.socialNetwork.gpplus, contextData.socialNetwork.gpplus);
								}
							}
							dyFObj.closeForm();
							changeHiddenFields();
						},

						properties : {
							block : dyFInputs.inputHidden(),
							typeElement : dyFInputs.inputHidden(),
							isUpdate : dyFInputs.inputHidden(true), 
							skype : dyFInputs.inputUrl("Lien vers Skype"),
							gitHub : dyFInputs.inputUrl("Lien vers Git Hub"), 
							gpplus : dyFInputs.inputUrl("Lien vers Google Plus"),
					        twitter : dyFInputs.inputUrl("Lien vers Twitter"),
					        facebook :  dyFInputs.inputUrl("Lien vers Facebook"),
						}
					}
				}
			};

			if(contextData.type == typeObj.person.col ){
				form.dynForm.jsonSchema.properties.telegram = dyFInputs.inputText("Votre Speudo Telegram","Votre Speudo Telegram");
			}

			var dataUpdate = {
				block : "network",
		        id : contextData.id,
		        typeElement : contextData.type,
			};

			if(notEmpty(contextData.socialNetwork) && notEmpty(contextData.socialNetwork.twitter))
				dataUpdate.twitter = contextData.socialNetwork.twitter;
			if(notEmpty(contextData.socialNetwork) && notEmpty(contextData.socialNetwork.gpplus))
				dataUpdate.gpplus = contextData.socialNetwork.gpplus;
			if(notEmpty(contextData.socialNetwork) && notEmpty(contextData.socialNetwork.gitHub))
				dataUpdate.gitHub = contextData.socialNetwork.gitHub;
			if(notEmpty(contextData.socialNetwork) && notEmpty(contextData.socialNetwork.skype))
				dataUpdate.skype = contextData.socialNetwork.skype;
			if(notEmpty(contextData.socialNetwork) && notEmpty(contextData.socialNetwork.telegram))
				dataUpdate.telegram = contextData.socialNetwork.telegram;
			if(notEmpty(contextData.socialNetwork) && notEmpty(contextData.socialNetwork.facebook))
				dataUpdate.facebook = contextData.socialNetwork.facebook;

			dyFObj.openForm(form, "sub", dataUpdate);

			
		});
	}

	function changeNetwork(id, url, str){
		mylog.log("changeNetwork", id, url, str);
		$(id).attr('href', url);
		$(id).html(str);
	}

	function parsePhone(arrayPhones){
		var str = "";
		$.each(arrayPhones, function(i,num) {
			if(str != "")
				str += ", ";
			str += num.trim();
		});
		return str ;
	}


	/*function bindDesc(parent){
		$(".maxlengthTextarea").off().keyup(function(){
			var name = "#" + $(this).attr("id") ;
			mylog.log(".maxlengthTextarea", parent+" "+name, $(this).attr("id"), $(parent+" "+name).val().length, $(this).val().length);
			$(parent+" #maxlength"+$(this).attr("id")).html($(parent+" "+name).val().length);
			maxlengthshortDescription
		});
	}*/


	function updateUrl(ind, title, url, type) {
		mylog.log("updateUrl", ind, title, url, type);
		var params = {
			title : title,
			type : type,
			url : url,
			index : ind
		}
		mylog.log("params",params);
		dyFObj.openForm( 'url','sub', params);
	}


	function updateContact(ind, name, email, role, telephone) {
		mylog.log("updateContact", ind, name, email, role, telephone);
		dataUpdate = { index : ind } ;
		if(name != "undefined")
			dataUpdate.name = name;
		if(email != "undefined")
			dataUpdate.email = email;
		if(role != "undefined")
			dataUpdate.role = role;
		if(telephone != "undefined")
			dataUpdate.phone = telephone;
		mylog.log("dataUpdate", dataUpdate);
		dyFObj.openForm ('contactPoint','contact', dataUpdate);
	}

	function removeUrl(ind) {
		bootbox.confirm({
			message: trad["suretodeletelink"]+"<span class='text-red'></span>",
			buttons: {
				confirm: {
					label: trad["yes"],
					className: 'btn-success'
				},
				cancel: {
					label: trad["no"],
					className: 'btn-danger'
				}
			},
			callback: function (result) {
				if (!result) {
					return;
				} else {
					param = new Object;
			    	param.name = "urls";
			    	param.value = {index : ind};
			    	param.pk = contextData.id;
					param.type = contextData.type;
					$.ajax({
				        type: "POST",
				        url: baseUrl+"/"+moduleId+"/element/updatefields/type/"+contextData.type,
				        data: param,
				       	dataType: "json",
				    	success: function(data){
				    		mylog.log("data", data);
					    	if(data.result){
								toastr.success(data.msg);
								urlCtrl.loadByHash(location.hash);
					    	}
					    }
					});
				}
			}
		});
		
	}

	

	function removeContact(ind) {
		bootbox.confirm({
			message: trad["suretodeletecontact"]+"<span class='text-red'></span>",
			buttons: {
				confirm: {
					label: trad["yes"],
					className: 'btn-success'
				},
				cancel: {
					label: trad["no"],
					className: 'btn-danger'
				}
			},
			callback: function (result) {
				if (!result) {
					return;
				} else {
					param = new Object;
			    	param.name = "contacts";
			    	param.value = {index : ind};
			    	param.pk = contextData.id;
					param.type = contextData.type;
					$.ajax({
				        type: "POST",
				        url: baseUrl+"/"+moduleId+"/element/updatefields/type/"+contextData.type,
				        data: param,
				       	dataType: "json",
				    	success: function(data){
				    		mylog.log("data", data);
					    	if(data.result){
								toastr.success(data.msg);
								urlCtrl.loadByHash(location.hash);
					    	}
					    }
					});
				}
			}
		});
	}


	function removeFieldUpdateDynForm(collection){
		mylog.log("------------------------ removeFieldUpdateDynForm", collection);
		var fieldsElement = [ 	"name", "tags", "email", "url", "fixe", "mobile", "fax", 
								"telegram", "gitHub", "skype", "twitter", "facebook", "gpplus"];
		var fieldsPerson = ["username",  "birthDate"];
		var fieldsProject = [ "avancement", "startDate", "endDate" ];
		var fieldsOrga = [ "type" ];
		var fieldsEvent = [ "type", "startDate", "endDate"];

		if(collection == typeObj.person.col)
			fieldsElement = fieldsElement.concat(fieldsPerson);
		else if(collection == typeObj.project.col)
			fieldsElement = fieldsElement.concat(fieldsProject);
		else if(collection == typeObj.organization.col)
			fieldsElement = fieldsElement.concat(fieldsOrga)
		else if(collection == typeObj.event.col)
			fieldsElement = fieldsElement.concat(fieldsEvent);
		var valCD = "";
		$.each(fieldsElement, function(key, val){ 

			valCD = val;
			if(val == "type" && collection == typeObj.organization.col)
				valCD = "typeOrga";
			else if(val == "type" && collection == typeObj.event.col)
				valCD = "typeEvent";

			if(	$("#ajaxFormModal #"+val).length && 
				( 	( 	typeof contextData[valCD] != "undefined" && 
						contextData[valCD] != null && 
						$("#ajaxFormModal #"+val).val() == contextData[valCD] 
					) ||  
					( 	( 	typeof contextData[valCD] == "undefined" || 
							contextData[valCD] == null ) && 
						$("#ajaxFormModal #"+val).val().trim().length == 0 ) 
				) 
			){
				$("#ajaxFormModal #"+val).remove();
			}
			else if(val == "birthDate"){
				var dateformat = "DD/MM/YYYY";
			    $("#ajaxFormModal #"+val).val( moment( $("#ajaxFormModal #"+val).val(), dateformat).format());
			}

		});
	}


