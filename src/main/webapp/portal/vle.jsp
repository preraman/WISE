<%@ include file="include.jsp"%>
<!DOCTYPE html>
<html dir="${textDirection}" style="height:100%">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="chrome=1" />
<%@ include file="favicon.jsp"%>
<title>SCORE</title>

<script type="text/javascript">
var contentUrl = "${contentUrl}";

function notifyFatal(type,args,obj){
	window.location = '${contextPath}/errors/outsideerror.html?msg=' + encodeURIComponent(args[0]);
};

function notifyCleaningComplete(type,args,obj){
	window.parent.processCleaningResults(args[0]);
};

function topiframeOnLoad() {
	var vleConfigUrl = "${vleConfigUrl}";
	window.frames["topifrm"].load(vleConfigUrl);
};

function startAuthorMode() {
	window.frames['topifrm'].eventManager.subscribe('fatalError', notifyFatal);
	window.frames['topifrm'].eventManager.subscribe('notifyCleaningComplete', notifyCleaningComplete);
	window.frames['topifrm'].view.startAuthorMode("${portalAuthorUrl}", "${command}", "${relativeProjectUrl}", "${projectId}", "${projectTitle}", "${editPremadeComments}");
};

function startWithConfig() {
	var vleConfigUrl = "${vleConfigUrl}";
	window.frames['topifrm'].document.dir = "${textDirection}";
	window.frames['topifrm'].eventManager.subscribe('fatalError', notifyFatal);
	window.frames['topifrm'].view.startVLEFromConfig(vleConfigUrl);
};
</script>
</head>
<body style="height:100%; overflow-y:hidden; margin:0px;">
<iframe style="overflow-x:auto; overflow-y:hidden;" id="topifrm" src="${vleurl}" name="topifrm" width="100%" height="100%" frameborder="0">
	<spring:message code="student.vle.noIFrameSupport" />
</iframe>
</body>
</html>
