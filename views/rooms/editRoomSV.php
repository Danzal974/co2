
<?php $moduleId = Yii::app()->controller->module->id; ?>

<style type="text/css">
    blockquote{border-color: #2BB0C6; cursor: pointer;}

    #editRoomsContainer .select2TagsInput{
      border:0px !important;
    }

    #editRoomsContainer .tagstags ul.select2-choices{
      border: solid 1px #DADADA !important
    }

    #editRoomsContainer .form-actions hr{
      display: none;
    }

    #editRoomsContainer .control-label{
      margin-bottom:10px;
    }
</style>

<div id="editRoomsContainer" class=""></div>

<script type="text/javascript">
var listRoomTypes = <?php echo json_encode($listRoomTypes)?>;
var tagsList = <?php echo json_encode($tagsList)?>;
var roomFormDefinition = {
    "jsonSchema" : {
        "title" : "News Form",
        "type" : "object",
        "properties" : {
            "id" :{
              "inputType" : "hidden",
              "value" : "<?php echo (isset($id)) ? $id : '' ?>"
            },
            "type" :{
              "inputType" : "hidden",
              "value" : "<?php echo (isset($type)) ? $type : '' ?>"
            },
            "roomType" :{
                "inputType" : "hidden",
                "placeholder" : "<?php echo Yii::t('rooms', 'Type of Room', null, $moduleId)?>",
                // "options" : listRoomTypes
              },
            "name" :{
              "inputType" : "text",
              "placeholder" : "Nom de l'espace",
              "label" : "Nom de l'espace",
              "rules" : {
                "required" : true
              }
            },
            "tags" :{
                "inputType" : "tags",
                "placeholder" : "Tags",
                "values" : tagsList
              },
        }
    }
};

var dataBind = {
   "#editEntryContainer #message" : "message",
   "#editEntryContainer #name" : "name",
   "#editEntryContainer #tags" : "tags",
   "#editEntryContainer #id"   : "parentId",
   "#editEntryContainer #type" : "parentType",
};

jQuery(document).ready(function() {
  mylog.warn("--------------- newRoom ---------------------");
  
  setTitle("<span class='text-dark'> Créer un nouvel espace coopératif</span>","<i class='fa fa-connectdevelop fa-red'></i> <i class='fa fa-plus fa-red'></i>","Créer un nouvel espace coopératif");
  //getAjax("#editRoomsContainer",baseUrl+"/"+moduleId+"/rooms/editRoom", "html");
  editRoomSV();
  $(".newRoom").off().on("click",function() { 
    mylog.warn("--------------- newRoom CLIK---------------------");
    //openSubView('Add a Room', '/communecter/rooms/editRoom',null,function(){editRoomSV ();});
  });
});



function editRoomSV (roomObj) { 
  mylog.warn("--------------- editEntrySV ---------------------");
  $("#editRoomsContainer").html("<div class=''>"+
              "<div class='space20'></div>"+
              //"<h1 id='proposerloiFormLabel' ><?php echo Yii::t('rooms', 'New Room', null, $moduleId)?></h1>"+
              "<form id='ajaxFormRoom'></form>"+
              "<div class='space20'></div>"+
             //   "<div class='clear'><?php echo Yii::t('rooms', 'Surveys contain subject to vote on, brainstorm sessions, discussions...', null, $moduleId)?></div>"+ 
              "</div>");
    
        var form = $.dynForm({
          formId : "#editRoomsContainer #ajaxFormRoom",
          formObj : roomFormDefinition,
          onLoad : function  () {
            if( roomObj ){
              $("#editRoomsContainer #name").val(data.title);
            }
            $(".mainDynFormCloseBtn").addClass("hidden");
          },
          onSave : function(){
            mylog.log("saving Room!!");
            mylog.log("type : ", $("#editRoomsContainer #roomType").val());
            //processingBlockUi();
            var params = { 
               "email" : "<?php echo Yii::app()->session['userEmail']?>" , 
               "name" : $("#editRoomsContainer #name").val() , 
               "tags" : $("#editRoomsContainer #tags").val().split(","),
               <?php  
               //"cp" : "<?php echo (isset($survey['cp']) ) ? $survey['cp'] : ''" , 
               ?>
               "type" : $("#editRoomsContainer #roomType").val(), //select2("val"), 
            };
            if( $("#editRoomsContainer #type").val() != "")
              params.parentType = $("#editRoomsContainer #type").val();
            if( $("#editRoomsContainer #id").val() != "")
              params.parentId = $("#editRoomsContainer #id").val();
           mylog.dir(params);
            $.ajax({
              type: "POST",
              url: '<?php echo Yii::app()->createUrl($this->module->id."/rooms/saveroom")?>',
              data: params,
              success: function(data){
                if(data.result){
                  delete window.myActionsList;
                  delete window.myVotesList;
                  mylog.log("SUCCESS SAVE ROOM :");
                  mylog.dir(data);

                  /*
                    if( data.newInfos.type == "<?php echo ActionRoom::TYPE_DISCUSS ?>" )
                      urlCtrl.loadByHash("#comment.index.type.actionRooms.id."+data.newInfos["_id"]["$id"]);
                    else if(data.newInfos.type == "<?php echo ActionRoom::TYPE_FRAMAPAD ?>" )
                      urlCtrl.loadByHash("#rooms.external.id."+data.newInfos["_id"]["$id"]);
                    else if( data.newInfos.type == "<?php echo ActionRoom::TYPE_ACTIONS ?>")
                      urlCtrl.loadByHash("#rooms.actions.id."+data.newInfos["_id"]["$id"]);
                    else 
                      urlCtrl.loadByHash("#survey.entries.id."+data.newInfos["_id"]["$id"]);*/
                  toastr.success("Le nouvel espace a bien été créé");
                  loadActionRoom(); 
                    //rooms.index.type.<?php echo (isset($_GET['type'])) ? $_GET['type'] : '' ?>.id.<?php echo (isset($_GET['id'])) ? $_GET['id'] : '' ?>");
                    $("#modal-create-room").modal("toogle");
                }
                else {
                  toastr.error(data.msg);
                }
                $.unblockUI();
              },
              dataType: "json"
            });

            return false;
          }
        });
        mylog.dir(form);
}

/*
function editRoomSV (roomObj) { 
  mylog.warn("--------------- editEntrySV ---------------------");
  $("#ajaxSV").html("<div class='col-sm-8 col-sm-offset-2'>"+
              "<div class='space20'></div>"+
              "<h1 id='proposerloiFormLabel' >New Room</h1>"+
              "<form id='ajaxForm'></form>"+
              "<div class='space20'></div>"+
                "<div class='clear'>Surveys contain subject to vote on, brainstorm sessoins, discussions...</div>"+ 
              "</div>");
    $.subview({
      content : "#ajaxSV",
      onShow : function() 
      {
        var form = $.dynForm({
          formId : "#ajaxForm",
          formObj : roomFormDefinition,
          onLoad : function  () {
            if( roomObj ){
              $("#name").val(data.title);
            }
          },
          onSave : function(){
            mylog.log("saving Room!!");
            one = getRandomInt(0,10);
            two = getRandomInt(0,10);
            if( prompt("combien font "+one+"+"+two+" ?") == one+two )
            {
              $.blockUI({
                    message : '<i class="fa fa-spinner fa-spin"></i> Processing... <br/> '+
                          '<blockquote>'+
                            '<p>each Time I plant a seed'+
                              '<br/>they say kill it before it grows.</p>'+
                            '<cite title="Bob Marley ">Bob Marley </cite>'+
                          '</blockquote> '
                  });
              var params = { 
                 "email" : "<?php echo Yii::app()->session['userEmail']?>" , 
                 "name" : $("#name").val() , 
                 "tags" : $("#tags").val().split(","),
                 <?php  
                 //"cp" : "<?php echo (isset($survey['cp']) ) ? $survey['cp'] : ''" , 
                 ?>
                 "type" : $("#roomType").select2("val"), 
              };
              if( $("#type").val() != "")
                params.parentType = $("#type").val();
              if( $("#id").val() != "")
                params.parentId = $("#id").val();
             mylog.dir(params);
             $.ajax({
                type: "POST",
                url: '<?php echo Yii::app()->createUrl($this->module->id."/rooms/saveroom")?>',
                data: params,
                success: function(data){
                  if(data.result){
                      window.location.reload();
                  }
                  else {
                    toastr.error(data.msg);
                  }
                  $.unblockUI();
                },
                dataType: "json"
              });
          } else 
            alert("mauvaise réponse, etes vous humain ?");


            return false;
          }
        });
        mylog.dir(form);
      },
      onHide : function() {
        $("#ajaxSV").html('');
        //$.hideSubview();
      },
      onSave: function() {
        $("#ajaxForm").submit();
      }
    });
}
*/

function getUrls(){
    var urls = [];
    $.each($('.addmultifield'), function() {
        urls.push( $(this).val() );
    });
    return urls;
};

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function readEntrySV(data,type) { 
  mylog.warn("--------------- readEntrySV ---------------------");
  mylog.dir(data);
  $("#editRoomsContainer #ajaxSV").html("<div class='col-sm-10 col-sm-offset-1'>"+
              "<div class='space20'></div>"+
              "<h1 id='entryTitle' >Faites une proposition</h1>"+
              "<div id='entryContent'></div>"+
              //'<div id="container2" style="min-width: 350px; height: 350px; margin: 0 auto"></div>'+
              "</div>");
  $.subview({
        content : "#editRoomsContainer #ajaxSV",
        onShow : function() 
        {
          $("#editRoomsContainer #entryContent").html(data.content);
          $("#editRoomsContainer #entryTitle").html(data.title);
          if(type=="graph")
            setUpGraph();
        },
        onHide : function() {
          $("#editRoomsContainer #ajaxSV").html('');
          //$.hideSubview();
        }
      });
}


</script>
