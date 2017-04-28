<?php 
	$cssAnsScriptFilesModule = array(
		//Data helper
		'/js/dataHelpers.js',
		'/js/postalCode.js',
		'/js/default/editInPlace.js',
	);
	HtmlHelper::registerCssAndScriptsFiles($cssAnsScriptFilesModule, $this->module->assetsUrl);

?>
<style type="text/css">
	.valueAbout{
		border-left: 1px solid #dbdbdb;
	}
	.contentInformation{
		border-bottom: 1px solid #dbdbdb;
	}
	#ficheInfo{
		border:inherit !important;
	}
	.labelAbout span{
		width: 20px;
		padding-right: 5px;
		text-align: -moz-center;
		text-align: center;
		text-align: -webkit-center;
		float: left;
	}
	.labelAbout span i{
		font-size: 14px;
	}
	.panel-title{
		line-height:35px;
	}

	.md-preview{
		text-align:left;
		padding: 0px 10px;
	}

	.md-editor > textarea {
		padding: 10px;
	}

	.descriptiontextarea label{
		margin-left:10px;
	}
</style>

<div class='col-md-12 margin-bottom-15'>
	<i class="fa fa-info-circle fa-2x"></i><span class='Montserrat' id='name-lbl-title'> A propos</span>
</div>

<div id="ficheInfo" class="panel panel-white col-lg-12 col-md-12 col-sm-12 no-padding shadow2">
	
	<div class="panel-heading border-light col-lg-12 col-md-12 col-sm-12 col-xs-12" style="background-color: #dee2e680;">
		<h4 class="panel-title text-dark pull-left"> 
			<i class="fa fa-pencil"></i> <?php echo Yii::t("common","Descriptions") ?>
		</h4>
		<?php if($edit==true || $openEdition==true ){?>
		  	<button class="btn-update-descriptions btn btn-default letter-blue pull-right tooltips" 
				data-toggle="tooltip" data-placement="top" title="" alt="" data-original-title="<?php echo Yii::t("common","Update description") ?>">
				<b><i class="fa fa-pencil"></i> <?php echo Yii::t("common", "Edit") ?></b>
			</button>
		 <?php } ?>
	</div>
	<div class="panel-body no-padding">
		<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
			<div class="col-md-3 col-sm-3 col-xs-3 labelAbout padding-10">
				<span><i class="fa fa-pencil"></i></span> <?php echo Yii::t("common", "Short description") ?>
			</div>
			<div id="shortDescriptionAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10"><?php echo (@$element["shortDescription"]) ? $element["shortDescription"] : '<i>'.Yii::t("common","Not specified").'</i>'; ?></div>
		</div>
		<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
			<div class="col-md-3 col-sm-3 col-xs-3 labelAbout padding-10">
				<span><i class="fa fa-pencil"></i></span> <?php echo Yii::t("common", "Description") ?>
			</div>
			<div id="descriptionAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
				<?php echo (@$element["description"]) ? $element["description"] : '<i>'.Yii::t("common","Not specified").'</i>'; ?>
			</div>
		</div>
		<input type="hidden" id="descriptionMarkdown" name="descriptionMarkdown" value="<?php echo (!empty($element['description'])) ? $element['description'] : ''; ?>">
	</div>
</div>
<div id="ficheInfo" class="panel panel-white col-lg-8 col-md-12 col-sm-12 no-padding shadow2">

	<div class="panel-heading border-light col-lg-12 col-md-12 col-sm-12 col-xs-12" style="background-color: #dee2e680;">
		<h4 class="panel-title text-dark pull-left"> 
			<i class="fa fa-info-circle"></i> <?php echo Yii::t("common","General information") ?>
		</h4>
		<?php if($edit==true || $openEdition==true ){?>
			<button class="btn-update-info btn btn-default letter-blue pull-right tooltips" 
				data-toggle="tooltip" data-placement="top" title="" alt="" data-original-title="<?php echo Yii::t("common","Update general information") ?>">
				<b><i class="fa fa-pencil"></i> <?php echo Yii::t("common", "Edit") ?></b>
			</button>
		<?php } ?>
	</div>
	<div class="panel-body no-padding">
		<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
			<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
				<span><i class="fa fa-pencil"></i></span> <?php echo Yii::t("common", "Name") ?>
			</div>
			<div id="nameAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
				<?php echo $element["name"]; ?>
			</div>
		</div>
		<?php if($type==Project::COLLECTION && @$avancement){ ?>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-cycle"></i></span> <?php echo Yii::t("project","Project maturity"); ?>
				</div>
				<div  id="avancementAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php echo (@$avancement) ? Yii::t("project",$avancement) : '<i>'.Yii::t("common","Not specified").'</i>' ?>
				</div>
			</div>
		<?php } ?>

		<?php if($type==Person::COLLECTION){ ?>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-user-secret"></i></span> <?php echo Yii::t("common","Username"); ?>
				</div>
				<div id="usernameAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php echo (@$element["username"]) ? $element["username"] : '<i>'.Yii::t("common","Not specified").'</i>' ?>
				</div>
			</div>
		<?php if(Preference::showPreference($element, $type, "birthDate", Yii::app()->session["userId"])){ ?>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-birthday-cake"></i></span> <?php echo Yii::t("person","Birth date"); ?>
				</div>
				<div id="birthDateAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php echo (@$element["birthDate"]) ? date("d/m/Y", strtotime($element["birthDate"]))  : '<i>'.Yii::t("common","Not specified").'</i>'; ?>
				</div>
			</div>
		<?php }
		} 


 		if($type==Organization::COLLECTION || $type==Event::COLLECTION){ ?>
 				<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
					<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
						<span><i class="fa fa-angle-right"></i></span><?php echo Yii::t("common", "Type"); ?> 
					</div>
					<div id="typeAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
						<?php echo (@$element["type"]) ? Yii::t("common", $element["type"]) : '<i>'.Yii::t("common","Not specified").'</i>'; ?>
					</div>
				</div>
		<?php }

		if( (	$type==Person::COLLECTION && 
				Preference::showPreference($element, $type, "email", Yii::app()->session["userId"]) ) || 
		  	$type!=Person::COLLECTION ) { ?>
		  	<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-envelope"></i></span> <?php echo Yii::t("common","E-mail"); ?>
				</div>
				<div id="emailAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php echo (@$element["email"]) ? $element["email"]  : '<i>'.Yii::t("common","Not specified").'</i>'; ?>
				</div>
			</div>
		<?php } ?>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-desktop"></i></span> <?php echo Yii::t("common","Website URL"); ?>
				</div>
				<div id="webAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">

				<?php 
					if(@$element["url"]){
						//If there is no http:// in the url
						$scheme = ( (!preg_match("~^(?:f|ht)tps?://~i", $element["url"]) ) ? 'http://' : "" ) ;
					 	echo '<a href="'.$scheme.$element['url'].'" target="_blank" id="urlWebAbout" style="cursor:pointer;">'.$element["url"].'</a>';
					}else
						echo '<i>'.Yii::t("common","Not specified").'</i>'; ?>
				</div>
			</div>
		<?php  if($type==Organization::COLLECTION || $type==Person::COLLECTION){ ?>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-phone"></i></span> <?php echo Yii::t("common","Phone"); ?>
				</div>
				<div id="fixeAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php
						$fixe = '<i>'.Yii::t("common","Not specified").'</i>';
						if( !empty($element["telephone"]["fixe"]))
							$fixe = ArrayHelper::arrayToString($element["telephone"]["fixe"]);
						
						echo $fixe;
					?>	
				</div>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-mobile"></i></span> <?php echo Yii::t("common","Mobile"); ?>
				</div>
				<div id="mobileAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php
						$mobile = '<i>'.Yii::t("common","Not specified").'</i>';
						if( !empty($element["telephone"]["mobile"]))
							$mobile = ArrayHelper::arrayToString($element["telephone"]["mobile"]);	
						echo $mobile;
					?>	
				</div>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-fax"></i></span> <?php echo Yii::t("common","Fax"); ?>
				</div>
				<div id="faxAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php
						$fax = '<i>'.Yii::t("common","Not specified").'</i>';
						if( !empty($element["telephone"]["fax"]) )
							$fax = ArrayHelper::arrayToString($element["telephone"]["fax"]);		
						echo $fax;
					?>
				</div>
			</div>
		<?php } ?>

			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation no-padding">
				<div class="col-md-4 col-sm-4 col-xs-4 labelAbout padding-10">
					<span><i class="fa fa-desktop"></i></span> <?php echo Yii::t("common","Tags"); ?>
				</div>
				<div id="tagsAbout" class="col-md-8 col-sm-8 col-xs-8 valueAbout padding-10">
					<?php 	if(!empty($element["tags"])){
								foreach ($element["tags"]  as $key => $tag) { 
		        					echo '<span class="badge letter-red bg-white">'.$tag.'</span>';
		   						}
							}else{
								echo '<i>'.Yii::t("common","Not specified").'</i>';
							} ?>	
				</div>
			</div>
	</div>
	
</div>

<div class="no-ing col-lg-4 col-md-12 col-sm-12">
	<div id="adressesAbout" class="panel panel-white col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding shadow2">
		<div class="panel-heading border-light padding-15" style="background-color: #dee2e680;">
			<h4 class="panel-title text-dark"> 
				<i class="fa fa-map-marker"></i> <?php echo Yii::t("common","Localitie(s)"); ?>
			</h4>
		</div>
		<div class="panel-body no-padding">		

			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelAbout padding-10">
				<span><i class="fa fa-home"></i></span> <?php echo Yii::t("common", "Main locality") ?>
				<?php if (!empty($element["address"]["codeInsee"]) && !empty($element["address"]["codeInsee"]) && $edit==true || $openEdition==true ){ 
					echo '<a href="javascript:;" id="btn-remove-geopos" class="pull-right tooltips" data-toggle="tooltip" data-placement="bottom" title="'.Yii::t("common","Remove Locality").'">
								<i class="fa text-red fa-trash-o"></i>
							</a> 
							<a href="javascript:;" id="btn-update-geopos" class="pull-right tooltips margin-right-15" data-toggle="tooltip" data-placement="bottom" title="'.Yii::t("common","Update Locality").'" >
								<i class="fa text-red fa-map-marker"></i>
							</a> ';	
				} ?>
			</div>
			<div class="col-md-12 col-xs-12 valueAbout no-padding" style="padding-left: 25px !important">
			<?php 
				if( ($type == Person::COLLECTION && Preference::showPreference($element, $type, "locality", Yii::app()->session["userId"])) ||  $type!=Person::COLLECTION) {
					$address = "";
					$address .= '<span id="detailAddress"> '.
									(( @$element["address"]["streetAddress"]) ? 
										$element["address"]["streetAddress"]."<br/>": 
										((@$element["address"]["codeInsee"])?"":Yii::t("common","Unknown Locality")));
					$address .= (( @$element["address"]["postalCode"]) ?
									 $element["address"]["postalCode"].", " :
									 "")
									." ".(( @$element["address"]["addressLocality"]) ? 
											 $element["address"]["addressLocality"] : "") ;
					$address .= (( @$element["address"]["addressCountry"]) ?
									 ", ".OpenData::$phCountries[ $element["address"]["addressCountry"] ] 
					 				: "").
					 			'</span>';
					echo $address;
					if(empty($element["address"]["codeInsee"]) && $type==Person::COLLECTION && $edit==true) {
						echo '<a href="javascript:;" class="cobtn btn btn-danger btn-sm" style="margin: 10px 0px;">'.Yii::t("common", "Connect to your city").'</a> <a href="javascript:;" class="whycobtn btn btn-default btn-sm explainLink" style="margin: 10px 0px;" data-id="explainCommunectMe" >'. Yii::t("common", "Why ?").'</a>';
					}
			}else
				echo '<i>'.Yii::t("common","Not specified").'</i>';
			?>
			</div>
		</div>
		<?php if( !empty($element["addresses"]) ){ ?>
			<div class="col-md-12 col-xs-12 labelAbout padding-10">
				<span><i class="fa fa-map"></i></span> <?php echo Yii::t("common", "Others localities") ?>
			</div>
			<div class="col-md-12 col-xs-12 valueAbout no-padding" style="padding-left: 25px !important">
			<?php	foreach ($element["addresses"] as $ix => $p) { ?>			
				<span id="addresses_<?php echo $ix ; ?>">
					<span>
					<?php 
					$address = '<span id="detailAddress_'.$ix.'"> '.
									(( @$p["address"]["streetAddress"]) ? 
										$p["address"]["streetAddress"]."<br/>": 
										((@$p["address"]["codeInsee"])?"":Yii::t("common","Unknown Locality")));
					$address .= (( @$p["address"]["postalCode"]) ?
									 $p["address"]["postalCode"].", " :
									 "")
									." ".(( @$p["address"]["addressLocality"]) ? 
											 $p["address"]["addressLocality"] : "") ;
					$address .= (( @$p["address"]["addressCountry"]) ?
									 ", ".OpenData::$phCountries[ $p["address"]["addressCountry"] ] 
					 				: "").
					 			'</span>';
					echo $address;
					?>

					<a href='javascript:removeAddresses("<?php echo $ix ; ?>");'  class="addresses pull-right tooltips margin-right-15" data-toggle="tooltip" data-placement="bottom" title="<?php echo Yii::t("common","Remove Locality");?>"><i class="fa text-red fa-trash-o"></i></a>
					<a href='javascript:updateLocalityEntities("<?php echo $ix ; ?>", <?php echo json_encode($p);?>);' class=" pull-right pull-right tooltips margin-right-15" data-toggle="tooltip" data-placement="bottom" title="<?php echo Yii::t("common","Update Locality");?>"><i class="fa text-red fa-map-marker addresses"></i></a></span>
				</span>
				<hr/>
			<?php 	} ?>
			</div>
		<?php } ?>
		<div class="text-right padding-10">
			<?php if(empty($element["address"]) && $type!=Person::COLLECTION && ($edit==true || $openEdition==true )){ ?>
				<b><a href="javascript:;" class="btn btn-default letter-blue margin-top-5 addresses" id="btn-update-geopos">
					<i class="fa fa-map-marker"></i>
					<span class="hidden-sm"><?php echo Yii::t("common","Add a primary address") ; ?></span>
				</a></b>
			<?php	}
			if($type!=Person::COLLECTION && !empty($element["address"]) && ($edit==true || $openEdition==true )) { ?>
				<b><a href='javascript:updateLocalityEntities("<?php echo count(@$element["addresses"]) ; ?>");' id="btn-add-geopos" class="btn btn-default letter-blue margin-top-5 addresses" style="margin: 10px 0px;">
					<i class="fa fa-plus" style="margin:0px !important;"></i> 
					<span class="hidden-sm"><?php echo Yii::t("common","Add an address"); ?></span>
				</a></b>
			<?php } ?>						
		</div>
	</div>
	<?php 
		$skype = (!empty($element["socialNetwork"]["skype"])? $element["socialNetwork"]["skype"]:"javascript:;") ;
		$telegram =  (!empty($element["socialNetwork"]["telegram"])? "https://web.telegram.org/#/im?p=@".$element["socialNetwork"]["telegram"]:"javascript:;") ;
		$facebook = (!empty($element["socialNetwork"]["facebook"])? $element["socialNetwork"]["facebook"]:"javascript:;") ;
		$twitter =  (!empty($element["socialNetwork"]["twitter"])? $element["socialNetwork"]["twitter"]:"javascript:;") ;
		$googleplus =  (!empty($element["socialNetwork"]["googleplus"])? $element["socialNetwork"]["googleplus"]:"javascript:;") ;
		$gitHub =  (!empty($element["socialNetwork"]["github"])? $element["socialNetwork"]["github"]:"javascript:;") ;
		$instagram =  (!empty($element["socialNetwork"]["instagram"])? $element["socialNetwork"]["instagram"]:"javascript:;") ;
	?>
	<div id="socialAbout" class="panel panel-white col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padding shadow2">
		<div class="panel-heading border-light col-lg-12 col-md-12 col-sm-12 col-xs-12" style="background-color: #dee2e680;">
			<h4 class="panel-title text-dark pull-left"> 
				<i class="fa fa-connectdevelop"></i> <?php echo Yii::t("common","Socials"); ?>
			</h4>
			<?php if($edit==true || $openEdition==true ){?>
				<button class="btn-update-network btn btn-default letter-blue pull-right tooltips" 
					data-toggle="tooltip" data-placement="top" title="" alt="" data-original-title="<?php echo Yii::t("common","Update network") ?>">
					<b><i class="fa fa-pencil"></i></b>
				</button>
			<?php } ?>
		</div>
		<div class="panel-body no-padding">
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation social padding-10 tooltips" data-toggle="tooltip" data-placement="left" title="Facebook">
				<span><i class="fa fa-facebook"></i></span> 
				<a href="<?php echo $facebook ; ?>" target="_blank" id="facebookAbout" class="socialIcon "><?php echo ($facebook != "javascript:;") ? $facebook : '<i>'.Yii::t("common","Not specified").'</i>' ; ?></a>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation social padding-10 tooltips" data-toggle="tooltip" data-placement="left" title="Twitter">
				<span><i class="fa fa-twitter"></i></span> 
				<a href="<?php echo $twitter ; ?>" target="_blank" id="twitterAbout" class="socialIcon" ><?php echo ($twitter != "javascript:;") ? $twitter : '<i>'.Yii::t("common","Not specified").'</i>' ; ?></a>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation social padding-10 tooltips" data-toggle="tooltip" data-placement="left" title="Instagram">
				<span><i class="fa fa-instagram"></i></span> 
				<a href="<?php echo $instagram ; ?>" target="_blank" id="instagramAbout" class="socialIcon" ><?php echo ($instagram != "javascript:;") ? $instagram : '<i>'.Yii::t("common","Not specified").'</i>' ; ?></a>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation social padding-10 tooltips" data-toggle="tooltip" data-placement="left" title="Skype" >
				<span><i class="fa fa-skype"></i></span> 
				<a href="<?php echo $skype ; ?>" target="_blank" id="skypeAbout" class="socialIcon" >
				<?php echo ($skype != "javascript:;") ? $skype : '<i>'.Yii::t("common","Not specified").'</i>' ; ?></a>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation social padding-10 tooltips" data-toggle="tooltip" data-placement="left" title="Google Plus">
				<span><i class="fa fa-google-plus"></i></span> 
				<a href="<?php echo $googleplus ; ?>" target="_blank" id="gpplusAbout" class="socialIcon" ><?php echo ($googleplus != "javascript:;") ? $googleplus : '<i>'.Yii::t("common","Not specified").'</i>' ; ?></a>
			</div>
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation social padding-10 tooltips" data-toggle="tooltip" data-placement="left" title="GitHub">
				<span><i class="fa fa-github"></i></span> 
				<a href="<?php echo $gitHub ; ?>" target="_blank" id="gitHubAbout" class="socialIcon" ><?php echo ($gitHub != "javascript:;") ? $gitHub : '<i>'.Yii::t("common","Not specified").'</i>' ; ?></a>
			</div>
			<?php if($type==Person::COLLECTION){ ?> 
			<div class="col-md-12 col-sm-12 col-xs-12 contentInformation social padding-10 tooltips" data-toggle="tooltip" data-placement="left" title="Telegram">
				<span><i class="fa fa-telegram"></i></span> 
				<a href="<?php echo $telegram ; ?>" target="_blank" id="telegramAbout" class="socialIcon" ><?php echo ($telegram != "javascript:;") ? $telegram : '<i>'.Yii::t("common","Not specified").'</i>' ; ?></a>
			</div>
			<?php } ?>
		</div>	
    </div>  
</div>


<script type="text/javascript">
	
	jQuery(document).ready(function() {
		bindDynFormEditable();
		initDate();
		inintDescs();
		//changeHiddenFields();
		bindAboutPodElement();

		$("#small_profil").html($("#menu-name").html());
		$("#menu-name").html("");

		$(".cobtn").click(function () {
			communecterUser();				
		});

		$("#btn-update-geopos").click(function(){
			updateLocalityEntities();
		});

		$("#btn-add-geopos").click(function(){
			updateLocalityEntities();
		});

		$("#btn-update-organizer").click(function(){
			updateOrganizer();
		});
		$("#btn-add-organizer").click(function(){
			updateOrganizer();
		});

		$("#btn-remove-geopos").click(function(){
			var msg = trad["suredeletelocality"] ;
			if(contextData.type == "<?php echo Person::COLLECTION; ?>")
				msg = trad["suredeletepersonlocality"] ;

			bootbox.confirm({
				message: msg + "<span class='text-red'></span>",
				buttons: {
					confirm: {
						label: "<?php echo Yii::t('common','Yes');?>",
						className: 'btn-success'
					},
					cancel: {
						label: "<?php echo Yii::t('common','No');?>",
						className: 'btn-danger'
					}
				},
				callback: function (result) {
					if (!result) {
						return;
					} else {
						param = new Object;
				    	param.name = "locality";
				    	param.value = "";
				    	param.pk = contextData.id;
						$.ajax({
					        type: "POST",
					        url: baseUrl+"/"+moduleId+"/element/updatefields/type/"+contextData.type,
					        data: param,
					       	dataType: "json",
					    	success: function(data){
						    	//
						    	if(data.result){
									if(contextData.type == "<?php echo Person::COLLECTION ;?>"){
										//Menu Left
										$("#btn-geoloc-auto-menu").attr("href", "javascript:");
										$('#btn-geoloc-auto-menu > span.lbl-btn-menu').html("Communectez-vous");
										$("#btn-geoloc-auto-menu").attr("onclick", "communecterUser()");
										$("#btn-geoloc-auto-menu").off().removeClass("lbh");
										//Dashbord
										$("#btn-menuSmall-mycity").attr("href", "javascript:");
										$("#btn-menuSmall-citizenCouncil").attr("href", "javascript:");
										//Multiscope
										$(".msg-scope-co").html("<i class='fa fa-cogs'></i> Paramétrer mon code postal</a>");
										//MenuSmall
										$(".hide-communected").show();
										$(".visible-communected").hide();
									}
									toastr.success(data.msg);
									urlCtrl.loadByHash("#page.type."+contextData.type+".id."+contextData.id);

						    	}
						    }
						});
					}
				}
			});	

		});

		$("#btn-update-geopos-admin").click(function(){
			findGeoPosByAddress();
		});

		//console.log("contextDatacontextData", contextData, contextData.type,contextData.id);
		//buildQRCode(contextData.type,contextData.id.$id);		
		
	});

	function initDate() {//DD/mm/YYYY hh:mm
		formatDateView = "DD MMMM YYYY" ;
		if($("#startDateAbout").html() != "")
	    	$("#startDateAbout").html(moment($("#startDateAbout").html()).local().format(formatDateView));
	    if($("#endDateAbout").html() != "")
	    	$("#endDateAbout").html(moment($("#endDateAbout").html()).local().format(formatDateView));
	    $('#dateTimezone').attr('data-original-title', "Fuseau horaire : GMT " + moment().local().format("Z"));
	}

	function descHtmlToMarkdown() {
		mylog.log("htmlToMarkdown");
		if(typeof contextData.descriptionHTML != "undefined" && contextData.descriptionHTML == "1"){
			if($("#descriptionAbout").html() != ""){
				var descToMarkdown = toMarkdown($("#descriptionMarkdown").val()) ;
				mylog.log("descToMarkdown", descToMarkdown);
	    		$("#descriptionMarkdown").html(descToMarkdown);
				var param = new Object;
				param.name = "description";
				param.value = descToMarkdown;
				param.id = contextData.id;
				param.typeElement = contextData.type;
				param.block = "toMarkdown";
	    		$.ajax({
			        type: "POST",
			       	url : baseUrl+"/"+moduleId+"/element/updateblock/type/"+contextData.type,
			        data: param,
			       	dataType: "json",
			    	success: function(data){
			    		mylog.log("here");
				    	toastr.success(data.msg);
				    }
				});
				mylog.log("param", param);
			}
		}
	}

	function inintDescs() {
		mylog.log("inintDescs");
		descHtmlToMarkdown();
		mylog.log("after");
		$("#descriptionAbout").html(dataHelper.markdownToHtml($("#descriptionMarkdown").val()));
	}

</script>