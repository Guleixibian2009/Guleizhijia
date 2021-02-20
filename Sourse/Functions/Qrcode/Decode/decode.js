// http://www.malu.me

var gCtx = null;
var gCanvas = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;

var imghtml='<div id="qrfile"><canvas id="out-canvas" width="320" height="320"></canvas>'+
    '<div id="imghelp" class="btn upload"><div class="cloud"><div class="arrow"></div></div>'+
	'<input type="file" onchange="handleFiles(this.files)"/>'+
	'</div>'+
    '</div>';

var vidhtml = '<video id="v" autoplay></video>';

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;
  if(files.length>0)
  {
	handleFiles(files);
  }
  else
  if(dt.getData('URL'))
  {
	qrcode.decode(dt.getData('URL'));
  }
}

function handleFiles(f)
{
	var o=[];
	
	for(var i =0;i<f.length;i++)
	{
        var reader = new FileReader();
        reader.onload = (function(theFile) {
        return function(e) {
            gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

			qrcode.decode(e.target.result);
        };
        })(f[i]);
        reader.readAsDataURL(f[i]);	
    }
}

function initCanvas(w,h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}


function captureToCanvas() {
    if(stype!=1)
        return;
    if(gUM)
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
            };
        }
        catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
        };
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function show_result() {
    document.getElementById("result").style.display="block";
}

function disable_result() {
    document.getElementById("result").innerHTML="";
    document.getElementById("result").style.display="none";
}

function read(a)
{
    show_result();
    var html="";
    html+="<b>"+htmlEntities(a)+"</b>";
    if(a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
        html+=" <a target='_blank' href='"+a+"'>打开此链接</a>";
    document.getElementById("result").innerHTML=html;
}	

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {
    if(webkit)
        v.src = window.webkitURL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    setTimeout(captureToCanvas, 500);
}
		
function error(error) {
    gUM=false;
    return;
}

function load()
{
	if(isCanvasSupported() && window.File && window.FileReader)
	{
		initCanvas(800, 600);
		qrcode.callback = read;
		document.getElementById("mainbody").style.display="inline";
        // setwebcam();
        setimg();
	}
	else
	{
		document.getElementById("mainbody").style.display="inline";
		document.getElementById("mainbody").innerHTML='<p id="mp1">二维码在线识别</p><br>'+
        '<br><p id="mp2">抱歉您的浏览器不支持，请使用以下浏览器</p><br><br>'+
        '<p id="mp1"> <a href="http://www.mozilla.com/firefox"><img src="http://ww3.sinaimg.cn/large/a83bb572jw1eznbbipcn1j204101f745.jpg"/></a> <a href="http://chrome.google.com"><img src="http://ww4.sinaimg.cn/large/a83bb572jw1eznbba10epg203f014742.gif"/></a> <a href="http://www.opera.com"><img src="http://ww3.sinaimg.cn/large/a83bb572jw1eznbbo3q2qj204601hq2t.jpg"/></a></p>';
	}
}

function setwebcam()
{
    if(stype==1)
    {
        show_result();
        document.getElementById("result").innerHTML="- 扫描中 -";
        setTimeout(captureToCanvas, 500);    
        return;
    }
    disable_result();
    var n=navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v=document.getElementById("v");

    if(n.getUserMedia)
        n.getUserMedia({video: true, audio: false}, success, error);
    else
    if(n.webkitGetUserMedia)
    {
        webkit=true;
        n.webkitGetUserMedia({video:true, audio: false}, success, error);
    }
    else
    if(n.mozGetUserMedia)
    {
        moz=true;
        n.mozGetUserMedia({video: true, audio: false}, success, error);
    }

    document.getElementById("qrimg").style.opacity=0.1;
    document.getElementById("webcamimg").style.opacity=1.0;

    stype=1;
    setTimeout(captureToCanvas, 500);
}
function setimg()
{
    if(stype==2)
        return;
    disable_result();
    document.getElementById("outdiv").innerHTML = imghtml;
    document.getElementById("qrimg").style.opacity=1.0;
    document.getElementById("webcamimg").style.opacity=0.1;
    var qrfile = document.getElementById("qrfile");
    qrfile.addEventListener("dragenter", dragenter, false);  
    qrfile.addEventListener("dragover", dragover, false);  
    qrfile.addEventListener("drop", drop, false);
    stype=2;
}
