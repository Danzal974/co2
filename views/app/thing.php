<?php
$cs = Yii::app()->getClientScript();
//HtmlHelper::registerCssAndScriptsFiles( $cssAnsScriptFilesModule ,Yii::app()->request->baseUrl);

$layoutPath = 'webroot.themes.'.Yii::app()->theme->name.'.views.layouts.';
    //header + menu
    $this->renderPartial($layoutPath.'header',
          array( "layoutPath"=>$layoutPath, 
            "page" => "thing") ); 

//tu auras "states":true si ta communexion est activée
//pour récupérer les valeurs de communexion tu a juste à faire ça : CO2::getCommunexionCookies();
//$boardIds = Thing::getDistinctBoardId();
//$deviceIds= Thing::getDistinctDeviceId();

$communexion = CO2::getCommunexionCookies();
        if($communexion["state"] == false){
          //$postalCode= " " ;
        }else{
          //$postalCode=$cpCommunexion;
        }
$this->renderPartial($layoutPath.'breadcrum_communexion', array("type"=>@$type));
?>
<style>

.main-container{
  margin-top: 40px;
  padding-top: 40px;

}
#sub-menu-left{
    margin-top:1px;
    /*text-align: left;*/
}
#sub-menu-left .btn{
    /*background-color: #4285f4;
    border-color: #4285f4;*/
  /*color:white;*/
    /*border-radius:80px;*/
    font-weight: 700;
}
#sub-menu-left.subsub .btn{
  width:95%;    
  text-align: left;
  background-color: white;
  border-color: white;
  color:#4285f4;
}
#sub-menu-left.subsub{
  min-width: 180px;
}
#page #dropdown_thing{
  min-height:500px;
        /*margin-top:30px;*/
}
#page .row.headerDirectory{
  margin-top: 20px;
  display: none;
}
#page p {
  font-size: 13px;
}
.breadcrum-communexion{ 
    margin-top:25px;
}

.breadcrum-communexion .item-globalscope-checker{
    border-bottom:1px solid #e6344d;
}
.item-globalscope-checker.inactive{
    color:#DBBCC1 !important;
    border-bottom:0px;
    margin(top:-6px;)
}
.item-globalscope-checker:hover,
.item-globalscope-checker:active,
.item-globalscope-checker:focus{
    color:#e6344d !important;
    border-bottom:1px solid #e6344d;
    text-decoration: none !important;
}

.keycat:hover,
.keycat.active,
.btn-select-category-1:hover,
.btn-select-category-1.active{
  background-color: #2C3E50!important;
  color: #fff!important;
  border-color:transparent!important;
}


</style>

<div class="col-md-12 col-sm-12 col-xs-12 container bg-white no-padding shadow" id="content-thing" style="min-height:700px;">

 <div class="padding-5" id="page">
 <?php $thing = CO2::getContextList("thing"); ?>

  <div id="menu-section-thing" class="row col-xs-12 col-md-12 col-sm-12 text-center subsub">
    <h4 class="padding-10 letter-azure label-category col-md-3 col-sm-3 hidden-xs" id="title-menu-section">
      <i class="fa fa-object-group"></i> <span id="title-sub-thing">Objets CO2 </span> 
    </h4>
    <?php 
      $currentSection = 1;
      foreach ($thing["sections"] as $key => $section) { ?>
        <div class="col-md-3 col-sm-4 col-xs-6 no-padding">
        <button class="btn btn-default col-md-12 col-sm-12 padding-10 bold text-dark elipsis btn-select-type-anc" 
          data-type-anc="<?php echo @$section["label"]; ?>" data-key="<?php echo @$section["key"]; ?>" data-type="thing"
          style="border-radius:0px; border-color: transparent; text-transform: uppercase;">
          <i class="fa fa-<?php echo @$section["icon"]; ?> fa-2x"></i> <span class=""><?php echo @$section["label"]; ?></span>
        </button>
        </div>
    <?php } ?>
    <hr class="col-md-12 col-sm-12 col-xs-12 no-padding" id="before-section-result">
  </div>
  <div class="row ">
    <div class="col-md-3 col-sm-3 col-xs-12 margin-top-15 text-right subsub thingFilters" id="sub-menu-left">
      <?php 
       //$thing = CO2::getContextList("thing");
       foreach ($thing as $key1 => $filters) {
        if(strpos($key1,"Filters")!=false){
          if (is_array($filters)) {
          foreach ($filters as $key => $action) { 
          //$setbutton=false;
          if(!isset($action["forAdmin"]) || (isset($action["forAdmin"])&& $action["forAdmin"]=="true" &&  Role::isSuperAdmin(Role::getRolesUserId(Yii::app()->session["userId"]) ) ) ){ 
            $setbutton=true;
          } 
          else {$setbutton=false;}
          if (is_array($action) && $setbutton==true){ ?>
           <button class="btn btn-default text-dark margin-bottom-5 btn-select-category-1 hidden btn-select-<?php echo @$action["key"]; ?>" style="margin-left:-5px;" data-keycat="<?php echo $key; ?>" data-section="<?php echo @$action["key"]; ?>" data-page="<?php echo @$action["page"]; ?>">
            <i class="fa fa-<?php echo @$action["icon"]; ?>"></i> <?php echo $action['label']; ?>
           </button>
           <?php foreach ($action["subcat"] as $key2 => $action2) { ?>
            <button class="btn btn-default text-dark margin-bottom-5 margin-left-15 hidden keycat keycat-<?php echo $key; ?> btn-<?php echo @$action["key"]; ?>" data-categ="<?php echo $key; ?>" data-key="<?php echo @$action["key"]; ?>" data-key2="<?php echo $key2; ?>">
             <i class="fa fa-angle-right"></i> <?php echo $action2; ?>
            </button><br class="hidden">
           <?php } 
          } 
          }
         } 
         }
         }
      ?>
    </div>
    <div class="col-sm-7 col-md-7 col-xs-12 " id="dropdown_thing"></div>
  </div>


  
 <!-- col-sm-push-3 col-md-push-3 col-lg-push-2 
col-lg-push-2 col-md-push-3 col-sm-push-3 
col-lg-pull-10 col-md-pull-9 col-sm-pull-9
 -->
 </div>    
</div>


<?php $this->renderPartial($layoutPath.'footer', array("subdomain"=>"thing")); ?>

<script>
/*----------------------------- */
var alReady=false;
var section = "";
var classType = "";
var classSubType = "";

var smartCitizenSelector = { 
  "Dernieres-Mesures" : [ "lastreading", [ "all" , "temp" , "hum" , "light" , "co" , "no2" , "noise" , "nets", "bat" , "pv" ]],  
  "Graphes" : ["graph-data",[ "data-from-api-sc" , "data-from-communecter" ]], 
  "Gestion-SCK" :[ "sck-maj",[ "sck-maj-principal", "sck-maj-secondaire" ]] 
};

function getpageSCK(viewsThing){ 

  
   getAjax('#dropdown_thing',baseUrl+'/'+moduleId+"/thing/"+viewsThing, function(){
     alReady=true;
     setTimeout(function(){alReady=false; },2000 );
     },"html"); 
  

}


function getpageCOPI(viewsCopi){
  //todo pour les CO-PI ;
  $("#dropdown_thing").html("<h3> COPI (Vide actuellement) <h3> <p> Ici vous avez accès au pages concernant les COPIs <p> ");

}

function bindLeftMenuFilters () { 

    $(".btn-select-type-anc").off().on("click", function()
    {   
        section = $(this).data("type-anc");
        sectionKey = $(this).data("key");

        $(".btn-select-type-anc, .btn-select-category-1, .keycat").removeClass("active");
        $(".keycat").addClass("hidden");
        $(".btn-select-category-1").addClass("hidden");
        $(".btn-select-"+sectionKey).removeClass("hidden");
        $(this).addClass("active");

        KScrollTo("#dropdown_thing");
        
        if( sectionKey == "smartCitizen"){
          $("#dropdown_thing").html("<h3> Smart-Citizen-Kit<h3> <p> Ici vous avez accès aux pages concernant les kits configurer en double push<p> ");   
        }else{
          $("#dropdown_thing").html("<h3> COPI (Vide actuellement) <h3> <p> Ici vous avez accès au pages concernant les COPIs <p> ");
        }
        
    });

    $(".btn-select-category-1").off().on("click", function(){
      if (alReady==false) {

        $(".btn-select-category-1").removeClass("active");
        $(this).addClass("active");

        var classType = $(this).data("keycat");
        var page = $(this).data("page");
        mylog.log("classType : "+classType);
        sectionKey = $(this).data("section");
        $("#title-menu-section").text(classType);

        $(".keycat").addClass("hidden");
        $(".keycat").removeClass("active");
        $(".keycat-"+classType).removeClass("hidden");   

        if(sectionKey=="smartCitizen") {
          getpageSCK(page); 
        }else{
          getpageCOPI(page);
        }
      
      }
    });

    $(".keycat").off().on("click", function(){

      $(".keycat").removeClass("active");
      $(this).addClass("active");
      var classSubType = $(this).data("keycat");

      var classType = $(this).data("categ");
      var key2 = $(this).data("key2");
      idToShow = smartCitizenSelector[classType][1][key2];
      classToHide = smartCitizenSelector[classType][0];

      mylog.log("idToShow : "+idToShow+"classToHide : "+classToHide) ;
      $("."+classToHide).addClass('hidden');

      $("#"+idToShow).removeClass('hidden');

    });

 }


jQuery(document).ready(function() {
    initKInterface({"affixTop":0});
    bindLeftMenuFilters();
    //communexion=<?php //echo json_encode($communexion); ?>;

  /*var postalCode=<?php //echo $postalCode ?>;
    mylog.log("communexion postalCode : ");
    mylog.log(postalCode);*/

/*function initClassifiedInterface(){ return;
    classified.currentLeftFilters = null;
    $('#menu-section-'+typeInit).removeClass("hidden");
    $("#btn-create-classified").click(function(){
         elementLib.openForm('classified');
    });    
}*/

/* -------------------------*/
  
    setTitle("Gestion SCK","fa-database");
    //console.log("Thing : page index");
  
   //Index.init();

   //getAjax('#central-container' ,baseUrl+'/'+moduleId+"/thing/graph",function(){//todo des trucs },"html"); 
  });

</script>