<?php
$userId = Yii::app()->session["userId"] ;

$layoutPath = 'webroot.themes.'.Yii::app()->theme->name.'.views.layouts.';
//header + menu
$this->renderPartial($layoutPath.'header', 
                    array(  "layoutPath"=>$layoutPath , 
                            "page" => "admin") );
?>
<div class="panel panel-white col-lg-offset-1 col-lg-10 col-xs-12 no-padding">
	<div>
		<div class="panel-heading text-center border-light">
			<h3 class="panel-title text-red"><i class="fa fa-map-marker"></i>   <?php echo Yii::t("common", "CHECKGEOCODAGE"); ?></h3>
		</div>
		<div class="panel-body">
			<div class="col-xs-12">
				<a href="#" class="btn btn-primary" id="btnCheckGeo"> Récupérer les entités qui sont mal géolocaliser</a>
			</div>
			<div class="col-xs-12">
				Process : <br/>
				- On vérifie si l'entité a une adresse, si il en a une, on vérifie si l'entité a un code postal et un code INSEE : <br/>
					&nbsp;&nbsp;&nbsp;&nbsp;- Si il n'y en pas alors on retourne avec l'erreur : "Code INSEE ou code postal absent".<br/>
					&nbsp;&nbsp;&nbsp;&nbsp;- Sinon on test si il y a une géolocalisation :<br/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Si il n'y en pas alors on retourne avec l'erreur : "Pas de géolocalisation"<br/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Intérrogation du SIG avec la lat/lon/cp  : <br/>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Si aucune commune , on affiche un message d'erreur : "Mal<br/>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- On test si le code INSEE de la commune et celui de l'entité sont identiques <br/>
			</div>
		</div>
	</div>


	<div id="divCheckEvents">
		<div class="panel-heading border-light">
			<h4 class="panel-title">Entité mal géolocalisé</h4>
		</div>
		<div class="panel-body">
			<table id="tableEntity" class="col-xs-12">
				

			</table>
		</div>
	</div>
</div>

<script type="text/javascript">

jQuery(document).ready(function() {
	setTitle("Espace administrateur : Entités mal géolocalisé","cog");
	
	bindCheckGeo();
});

function bindCheckGeo(){
	$("#btnCheckGeo").off().on('click', function(e){
		rand = Math.floor((Math.random() * 8) + 1);
  		$.blockUI({message : '<div class="title-processing homestead"><i class="fa fa-spinner fa-spin"></i> Processing... </div>'
			+'<a class="thumb-info" href="'+proverbs[rand]+'" data-title="Proverbs, Culture, Art, Thoughts"  data-lightbox="all">'
			+ '<img src="'+proverbs[rand]+'" style="border:0px solid #666; border-radius:3px;"/></a><br/><br/>'
		});
		$.ajax({
	        type: 'POST',
	        url: baseUrl+'/communecter/admin/getentitybadlygeolocalited/',
	        dataType : 'json',
	        success: function(data)                                                   
	        {
	        	mylog.log("data",data);
	        	textHTML = "<tr><th>Type</th><th>Entité</th><th>Msg Error</th></tr>";
	        	$.each(data, function(typeEntity, listEntity){
	  				$.each(listEntity, function(key, entity){
	  					textHTML += "<tr>"+
	  									"<td>"+typeEntity+"</td>"+          
	  									"<td>"+								    
	  										'<a  href="#'+typeEntity+'.detail.id.'+entity["id"]+'" class="lbh"> '+
	  										entity["name"]+ "</a></td>"+
	  									"<td>"+entity["error"]+"</td>"+
	  								"</tr>";
					});
	  			});
	        	$("#tableEntity").html(textHTML);
	        	$.unblockUI();
	        }
		});
	});


}

</script>