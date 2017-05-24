dynForm = {
    jsonSchema : {
	    title : "Publier une annonce",
	    icon : "bullhorn",
	    type : "object",	    
	    onLoads : {
	    	//pour creer un subevnt depuis un event existant
	    	sub : function(){
	    		if(contextData.type && contextData.id ){
    				$('#ajaxFormModal #parentId').val(contextData.id);
	    			$("#ajaxFormModal #parentType").val( contextData.type ); 
	    			$("#ajax-modal .modal-header").removeClass("bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-blue bg-turq bg-url")
							  					  .addClass("bg-azure");
	    		 	
	    		 	$("#ajax-modal-modal-title").html(
	    		 		$("#ajax-modal-modal-title").html()+
	    		 		" <br><small class='text-white'>en tant que : <span class='text-dark'>"+contextData.name+"</span></small>" );
	    		}
	    	},
	    	onload : function(){
	    		$(".typeBtntagList, .nametext, .descriptiontextarea, .pricetext, .contactInfotext, .locationlocation, .imageuploader, .formshowerscustom, .tagstags, #btn-submit-form").hide();
	    	},
	    	/*,
	    	loadData : function(data){
		    	mylog.warn("--------------- loadData ---------------------",data);
		    	$('#ajaxFormModal #name').val(data.name);
		    	$('#ajaxFormModal #type').val(data.type);
		    	$('#ajaxFormModal #parentId').val(data.parentId);
	    		$("#ajaxFormModal #parentType").val( data.parentType ); 
		    },*/
	    },
	    beforeBuild : function(){
	    	dyFObj.setMongoId('classified');
	    },
	    beforeSave : function(){
	    	var tagAndTypes = ( $("#ajaxFormModal #tags").val() != "" ) ? $("#ajaxFormModal #tags").val()+"," : "" ;

	    	if( $("#ajaxFormModal #section").val() )
	    		tagAndTypes += $("#ajaxFormModal #section").val();
	    	if( $("#ajaxFormModal #type").val() )
	    		tagAndTypes += ","+$("#ajaxFormModal #type").val();
	    	if( $("#ajaxFormModal #subtype").val() )
	    		tagAndTypes += ","+$("#ajaxFormModal #subtype").val();
	    	$("#ajaxFormModal #tags").val( tagAndTypes );
	    	
	    	if( typeof $("#ajaxFormModal #description").code === 'function' )  
	    		$("#ajaxFormModal #description").val( $("#ajaxFormModal #description").code() );
	    	if($('#ajaxFormModal #parentId').val() == "" && $('#ajaxFormModal #parentType').val() ){
		    	$('#ajaxFormModal #parentId').val(userId);
		    	$("#ajaxFormModal #parentType").val( "citoyens" ); 
		    }
	    },
	    afterSave : function(){
			if( $('.fine-uploader-manual-trigger').fineUploader('getUploads').length > 0 )
		    	$('.fine-uploader-manual-trigger').fineUploader('uploadStoredFiles');
		    else {
		    	dyFObj.closeForm();
		    	urlCtrl.loadByHash( location.hash );	
		    }
	    },
	    canSubmitIf : function () { 
	    	if( $("#ajaxFormModal #section").val() && $("#ajaxFormModal #type").val() &&  $("#ajaxFormModal #subtype").val() )
	    		return true;
	    	else 
	    		return false;
	    },
	    actions : {
	    	clear : function() {
	    		
	    		$("#ajaxFormModal #section, #ajaxFormModal #type, #ajaxFormModal #subtype").val("");

	    		$(".breadcrumbcustom").html( "");
	    		$(".sectionBtntagList").show(); 
	    		$(".typeBtntagList").hide(); 
	    		$(".subtypeSection").html("");
	    		$(".subtypeSectioncustom").show();
	    		$(".typeBtntagList, .nametext, .descriptiontextarea, .pricetext, .contactInfotext, .locationlocation, .imageuploader, .formshowerscustom, .tagstags").hide();
	    		$("#btn-submit-form").hide(); 
	    	}, 
	    	initTypeBtn : function () { 
	    		$(".typeBtn").off().on("click",function(){
	            		
            		$(".typeBtn").removeClass("active btn-dark-blue text-white");
            		$( "."+$(this).data('key')+"Btn" ).toggleClass("active btn-dark-blue text-white");
            		$("#ajaxFormModal #type").val( ( $(this).hasClass('active') ) ? $(this).data('tag') : "" );
            		
            		$(".breadcrumbcustom").html( "<h4><a href='javascript:;'' class='btn btn-xs btn-danger'  onclick='dyFObj.elementObj.dynForm.jsonSchema.actions.clear()'><i class='fa fa-times'></i></a>  "+$(".sectionBtn.active").data('tag')+" > "+$(".typeBtn.active").data('tag')+"</h4>" );
            		$(".typeBtntagList").hide();

            		//$(".typeBtn:not(.active)").hide();
            		$("#ajaxFormModal #subtype").val("");
            		fieldHTML = "";
            		var filt = (classified.currentLeftFilters != null ) ? classified[classified.currentLeftFilters] : classified.filters; 
            		if(filt[ $(this).data('key') ]["subcat"].length >= 1)
            		{
	            		$.each(filt[ $(this).data('key') ]["subcat"], function(k,v) { 
	            			fieldHTML += '<div class="col-md-6 padding-5">'+
	    									'<a class="btn tagListEl subtypeBtn '+k+'Btn " data-tag="'+v+'" href="javascript:;">'+v+'</a>' +
	            						"</div>";
	            		});
	            		$(".subtypeSection").html('<hr class="col-md-12 no-padding">'+
	            								  '<label class="col-md-12 text-left control-label no-padding" for="typeBtn">'+
	            								  	'<i class="fa fa-chevron-down"></i> Sous-catégorie'+
	            								  '</label>' + fieldHTML );

	            		$(".subtypeBtn").off().on("click",function()
		            	{
		            		$( ".subtypeBtn" ).removeClass("active");
		            		$(this).addClass("active");
		            		$("#ajaxFormModal #subtype").val( ( $(this).hasClass('active') ) ? $(this).data('tag') : "" );
		            		$(".nametext, .descriptiontextarea, .pricetext, .contactInfotext, .locationlocation, .imageuploader, .formshowerscustom, .tagstags").show();
		            		//$(".subtypeBtn:not(.active)").hide();

		            		$(".breadcrumbcustom").html( "<h4><a href='javascript:;'' class='btn btn-xs btn-danger'  onclick='dyFObj.elementObj.dynForm.jsonSchema.actions.clear()'><i class='fa fa-times'></i></a> "+$(".sectionBtn.active").data('tag')+" > "+$(".typeBtn.active").data('tag')+" > "+$(".subtypeBtn.active").data('tag')+"</h4>" );
		            		$(".subtypeSectioncustom").hide();
		            		dyFObj.canSubmitIf();
						});
	            	} else {
	            		$(".nametext, .descriptiontextarea, .pricetext, .contactInfotext, .locationlocation, .imageuploader, .formshowerscustom, .tagstags").show();
	            	}
            	});
	    	}
	    },
	    properties : {
	    	info : {
                inputType : "custom",
                html:"",//<p><i class='fa fa-info-circle'></i> Une Annonce est un élément assez libre qui peut etre géolocalisé ou pas, qui peut etre rataché à tous les éléments.</p>",
            },
            breadcrumb : {
                inputType : "custom",
                html:"",
            },
            sectionBtn :{
                label : "De quel type d'annonce s'agit-il ? ",
	            inputType : "tagList",
                placeholder : "Choisir un type",
                list : classified.sections,
                trad : trad,
                init : function(){
                	$(".sectionBtn").off().on("click",function()
	            	{
	            		$(".typeBtntagList").show();
	            		$(".sectionBtn").removeClass("active btn-dark-blue text-white");
	            		$( "."+$(this).data('key')+"Btn" ).toggleClass("active btn-dark-blue text-white");
	            		$("#ajaxFormModal #section").val( ( $(this).hasClass('active') ) ? $(this).data('tag') : "" );
						//$(".sectionBtn:not(.active)").hide();
						var sectionKey = $(this).data('key');
						//alert(sectionKey);
						var what = { title : "Dans quelle catégorie souhaitez-vous publier votre annonce ?", 
				                         icon : classified.sections[sectionKey].icon }
						if( jsonHelper.notNull( "classified.sections."+sectionKey+".filters" ) ){
				            //alert('build btns menu'+classified.sections[sectionKey].filters);
				            classified.currentLeftFilters = classified.sections[sectionKey].filters;
				            var filters = classified[classified.currentLeftFilters]; 
				            directory.sectionFilter( filters, ".typeBtntagList",what,'btn');
				            dyFObj.elementObj.dynForm.jsonSchema.actions.initTypeBtn();
				        }
				        else if( classified.currentLeftFilters != null ) {
				            //alert('rebuild common list'); 
				            directory.sectionFilter( classified.filters, ".typeBtntagList",what,'btn');
				            dyFObj.elementObj.dynForm.jsonSchema.actions.initTypeBtn()
				            classified.currentLeftFilters = null;
				        }
						$(".breadcrumbcustom").html( "<h4><a href='javascript:;'' class='btn btn-xs btn-danger'  onclick='dyFObj.elementObj.dynForm.jsonSchema.actions.clear()'><i class='fa fa-times'></i></a> "+$(this).data('tag')+"</h4>");
						$(".sectionBtntagList").hide();
	            	});
	            }
            },
            section : dyFInputs.inputHidden(),
	        typeBtn :{
                label : "Dans quelle catégorie souhaitez-vous publier votre annonce ? ",
	            inputType : "tagList",
                placeholder : "Choisir une catégorie",
                list : classified.filters,
                init : function(){
                	classified.currentLeftFilters = null;
                	dyFObj.elementObj.dynForm.jsonSchema.actions.initTypeBtn();
	            }
            },
            type : dyFInputs.inputHidden(),
            subtypeSection : {
                inputType : "custom",
                html:"<div class='subtypeSection'></div>"
            },
            subtype : dyFInputs.inputHidden(),
            price : dyFInputs.price(),
            name : dyFInputs.name( "classified" ) ,
            description : dyFInputs.textarea("Description", "..."),
            image : dyFInputs.image(),
            contactInfo : dyFInputs.inputText("Coordonnées", "n° tel, addresse email ..."),
            location : dyFInputs.location,
            tags : dyFInputs.tags(),
            parentId : dyFInputs.inputHidden(),
            parentType : dyFInputs.inputHidden(),
	    }
	}
};