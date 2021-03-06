function RecordedReadAssistant(smsId, num){
	msgId = smsId;
	sendNumber = num;
	}
var email;
var msgId;
var password;
var msgList;
var lastTime;
var intID;
var sendNumber;
RecordedReadAssistant.prototype.setup = function() {
	jQuery.noConflict();
	//Setup widgets
	email = kt.cookies.get("voogle_userString").split('||')[0];
	password = kt.cookies.get("voogle_userString").split('||')[1];
	msgList = Array();
this.controller.setupWidget("msgScroller",
        this.attributes = {
            mode: 'vertical'
        },
        this.model = {
        }
    ); 
// If you don't already have one, get a reference to the media element, using its ID
this.mediaObj = this.controller.get("voicemailAudio");

this.mediaObj.addEventListener("playing", this.playing.bind(this), true);
this.mediaObj.addEventListener("paused", this.stopped.bind(this), true);
this.mediaObj.addEventListener("ended", this.stopped.bind(this), true);
this.mediaObj.addEventListener("error", this.stopped.bind(this), true);
this.mediaObj.addEventListener("abort", this.stopped.bind(this), true);

	this.controller.setupWidget(Mojo.Menu.commandMenu,
    this.attributes = {
        spacerHeight: 0,
        menuClass: 'no-fade'
    },
    this.menumodel = {
        visible: true,
        items: [  
			{iconPath:"images/menu-icon-music-play.png", command:"play"},
			{icon:"delete", command:"delete"}
        ]
    }
);

document.getElementById('voicemailAudio').src = "http://kandutech.net/voogle/beta/downloadMsg.php?email="+encodeURIComponent(email)+"&password="+encodeURI(password)+"&msgid="+msgId;
	
	Voogle.markRead(kt.cookies.get("voogle_userString"), msgId, function() {});

	this.controller.setupWidget("loader",
        this.attributes = {
            spinnerSize: "large"
        },
        this.model = {
            spinning: true 
        }
    );								
								
		/*this.controller.setupWidget("msgs",
        this.attributes = {
            itemTemplate: "smsRead/msgs-list",

            swipeToDelete: false,
            reorderable: false
         },
         this.inboxmodel = {
             listTitle: "Messages",
             items : msgList
          }
    );		*/						
								
	Voogle.getRecorded(kt.cookies.get("voogle_userString"), function(data){
		document.getElementById('loader').style.display = "none";
		document.getElementById('msgs').innerHTML = "";
		var json = data.substr(data.indexOf("<json><![CDATA") + 14);
		json = json.substr(0, json.indexOf("]></json>"));
		json = jQuery.parseJSON(json);
		var xmlData = data.substr(data.indexOf('<html><![CDATA[') + 15);
		xmlData = xmlData.substr(0, xmlData.indexOf(']]></html>'));
		var oldList = inboxList;
		var messages = json[0]["messages"];
		var x = 1;
		jQuery.each(messages, function(i, msg){
			var id = msg.id;
			var convos = xmlData.split(msg.id);
			var convo = convos[x];
			//Mojo.Controller.errorDialog(convo);
			var label = msg.labels[1];
			if (label == "unread" || label == "inbox" || label == "starred") {
				label = msg.labels[2];
			}
			if (label == "unread") {
				label = msg.labels[3];
			}
			if (label == "recorded" && msg.id == msgId) {
				var lastIndex = convos[x].indexOf('<div class="gc-message-message-display">');
				var recentMsg = convos[x].substr(lastIndex + 40);
				recentMsg = recentMsg.substr(0, recentMsg.indexOf('</div>'));
				if (convo.indexOf('<span title="">Unknown</span>') != -1) {
					from = "Unknown";
				}
				else {
					var fromIndex = convo.lastIndexOf('<a class="gc-under gc-message-name-link" title="Go to contact" href="javascript://">');
					var from = convo.substr(fromIndex + 84);
					from = from.substr(0, from.indexOf('</a>'));
				}
				var timeIndex = convos[x].indexOf('<span class="gc-message-time">');
				var time = convos[x].substr(timeIndex + 30);
				time = time.substr(0, time.indexOf('</span>'));
				//Add time divider...
				document.getElementById('msgs').innerHTML += '<table class="palm-divider labeled"><tbody><tr><td class="right"></td><td class="left"></td><td class="label">' + time + '</td><td class="right"></td><td class="left"></td></tr></tbody></table>';
				if (from != "") {
				
					document.getElementById('convoname').innerHTML = from;
				//document.getElementById('msgs').innerHTML += recentMsg;
				//msgScroller.mojo.revealBottom();
				/*msgList.push({
				 "body": recentMsg,
				 "id": msg.id,
				 "side": side
				 });*/
				}
			}
		})
		
		
	});

}

RecordedReadAssistant.prototype.handleCommand = function(event) {
	if(event.command == "play")
	{
		this.mediaObj.play();
		this.menumodel.items[0].iconPath = "images/menu-icon-music-pause.png";
		this.menumodel.items[0].command = "pause";
		this.controller.modelChanged(this.menumodel, this);
	}
	if(event.command == "pause")
	{
		this.mediaObj.pause();
		this.menumodel.items[0].iconPath = "images/menu-icon-music-play.png";
		this.menumodel.items[0].command = "play";
		this.controller.modelChanged(this.menumodel, this);
	}
	
	if(event.command == "delete")
	{
		var dialog = this.controller.showDialog({
			template: 'dialogs/deleting-dialog',
			assistant: new DeletingDialog(this),
			preventCancel:true
		});
		jQuery.ajax({
			url: "http://kandutech.net/voogle?email="+kt.utilities.urlescape(email)+"&password="+kt.utilities.urlescape(password)+"&cmd=deleteMsg&id="+delId,
			type: 'GET',
			success: function(data) {
				dialog.mojo.close();
				Mojo.Controller.stageController.popScene();
			}.bind(this)
		});
	}
}

function callUser() {
	Mojo.Controller.stageController.pushScene("dialer", sendNumber);
}

RecordedReadAssistant.prototype.playing = function() {
		this.menumodel.items[0].iconPath = "images/menu-icon-music-pause.png";
		this.menumodel.items[0].command = "pause";
		this.controller.modelChanged(this.menumodel, this);
}

RecordedReadAssistant.prototype.stopped = function() {
		this.menumodel.items[0].iconPath = "images/menu-icon-music-play.png";
		this.menumodel.items[0].command = "play";
		this.controller.modelChanged(this.menumodel, this);
}