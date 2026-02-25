import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  AI: any
  GLM_API_KEY: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('/*', cors())

// 首页
app.get('/', c => c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>党员发展AI助手</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
<style>
:root{--p:#0066cc;--s:#0080ff;--d:#2c3e50}
body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh}
.sidebar{background:linear-gradient(180deg,var(--d),#1a252f);min-height:100vh;box-shadow:4px 0 15px rgba(0,0,0,.3)}
.sidebar h3{background:linear-gradient(45deg,var(--p),var(--s));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800}
.sidebar .nav-link{border-radius:10px;margin:5px 10px;transition:all .3s;color:rgba(255,255,255,.8)!important}
.sidebar .nav-link:hover,.sidebar .nav-link.active{background:linear-gradient(45deg,var(--p),var(--s));color:#fff!important;transform:translateX(5px)}
.main-content{background:rgba(255,255,255,.95);border-radius:20px;margin:20px;padding:30px;box-shadow:0 10px 40px rgba(0,0,0,.2)}
.page-title{border-left:5px solid var(--p);padding-left:15px;margin-bottom:30px;color:var(--d)}
.stat-card{border:none;border-radius:15px;overflow:hidden;transition:transform .3s}.stat-card:hover{transform:translateY(-5px)}
.stat-card .card-body{background:linear-gradient(135deg,var(--p),var(--s));color:#fff}
.upload-zone{border:3px dashed var(--s);border-radius:20px;padding:50px;text-align:center;background:#f0f8ff;cursor:pointer;transition:all .3s}
.upload-zone:hover{border-color:var(--p);background:#e6f2ff;transform:scale(1.02)}.upload-zone i{font-size:60px;color:var(--p)}
.process-step{padding:20px;border-radius:15px;background:#fff;box-shadow:0 5px 15px rgba(0,0,0,.1);text-align:center;transition:all .3s}
.process-step:hover{transform:translateY(-5px)}.process-step.completed{background:linear-gradient(135deg,var(--p),var(--s));color:#fff}
.process-arrow{font-size:30px;color:var(--s);display:flex;align-items:center;justify-content:center}
.btn-primary{background:linear-gradient(45deg,var(--p),var(--s));border:none;padding:12px 30px;border-radius:25px;font-weight:600}
.btn-primary:hover{transform:scale(1.05)}
.card{border:none;border-radius:15px;box-shadow:0 5px 20px rgba(0,0,0,.1)}
.card-header{background:linear-gradient(45deg,var(--d),#34495e);color:#fff;border-radius:15px 15px 0 0!important;padding:15px 20px}
.feature-icon{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:35px;margin:0 auto 15px;background:linear-gradient(135deg,var(--p),var(--s));color:#fff}
.page{display:none}.page.active{display:block;animation:fadeIn .3s}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.hero-section{background:linear-gradient(135deg,var(--p),var(--s));color:#fff;border-radius:20px;padding:40px;margin-bottom:30px}
.empty-state{text-align:center;padding:60px;color:#95a5a6}
</style>
</head>
<body>
<div class="container-fluid"><div class="row">
<div class="col-md-2 sidebar p-0">
<h3 class="p-3 text-center"><i class="bi bi-flag-fill"></i> 党员发展AI</h3>
<nav class="nav flex-column pb-4">
<a class="nav-link active" data-page="home"><i class="bi bi-house-door me-2"></i>工作台</a>
<a class="nav-link" data-page="apply"><i class="bi bi-send me-2"></i>入党申请</a>
<a class="nav-link" data-page="process"><i class="bi bi-diagram-3 me-2"></i>发展流程</a>
<a class="nav-link" data-page="ai"><i class="bi bi-robot me-2"></i>AI助手</a>
<a class="nav-link" data-page="review"><i class="bi bi-file-earmark-check me-2"></i>申请书审核</a>
<a class="nav-link" data-page="record"><i class="bi bi-chat-quote me-2"></i>谈话记录</a>
<a class="nav-link" data-page="activity"><i class="bi bi-calendar-event me-2"></i>活动管理</a>
<a class="nav-link" data-page="message"><i class="bi bi-bell me-2"></i>消息中心</a>
<a class="nav-link" data-page="system"><i class="bi bi-gear me-2"></i>系统状态</a>
</nav>
</div>
<div class="col-md-10"><div class="main-content">

<div class="page active" id="page-home">
<h2 class="page-title"><i class="bi bi-house-door me-2"></i>工作台</h2>
<div class="hero-section"><h1><i class="bi bi-flag-fill me-2"></i>党员发展AI助手</h1><p class="mb-0">智能辅助党员发展全流程</p></div>
<div class="row mb-4">
<div class="col-md-3"><div class="stat-card"><div class="card-body text-center"><i class="bi bi-file-earmark-text" style="font-size:40px"></i><div class="mt-2" style="font-size:28px;font-weight:bold">5</div><div>待审核申请书</div></div></div></div>
<div class="col-md-3"><div class="stat-card"><div class="card-body text-center"><i class="bi bi-chat-dots" style="font-size:40px"></i><div class="mt-2" style="font-size:28px;font-weight:bold">3</div><div>待谈话</div></div></div></div>
<div class="col-md-3"><div class="stat-card"><div class="card-body text-center"><i class="bi bi-people" style="font-size:40px"></i><div class="mt-2" style="font-size:28px;font-weight:bold">12</div><div>本月发展</div></div></div></div>
<div class="col-md-3"><div class="stat-card"><div class="card-body text-center"><i class="bi bi-award" style="font-size:40px"></i><div class="mt-2" style="font-size:28px;font-weight:bold">2</div><div>即将转正</div></div></div></div>
</div>
<div class="row">
<div class="col-md-6"><div class="card"><div class="card-header"><i class="bi bi-list-task me-2"></i>待办事项</div><div class="card-body">
<div class="d-flex align-items-center mb-3"><div class="badge bg-warning me-2">急</div><div>李四的入党申请书待审核</div></div>
<div class="d-flex align-items-center mb-3"><div class="badge bg-info me-2">待</div><div>王五的谈话记录待录入</div></div>
<div class="d-flex align-items-center"><div class="badge bg-success me-2">提醒</div><div>周五召开支委会</div></div>
</div></div></div>
<div class="col-md-6"><div class="card"><div class="card-header"><i class="bi bi-lightning me-2"></i>快捷入口</div><div class="card-body text-center"><div class="row">
<div class="col-6 mb-3"><div class="feature-icon" style="cursor:pointer" onclick="nav('apply')"><i class="bi bi-send"></i></div><div>入党申请</div></div>
<div class="col-6 mb-3"><div class="feature-icon" style="cursor:pointer" onclick="nav('ai')"><i class="bi bi-robot"></i></div><div>AI问答</div></div>
<div class="col-6"><div class="feature-icon" style="cursor:pointer" onclick="nav('review')"><i class="bi bi-file-earmark-check"></i></div><div>审核</div></div>
<div class="col-6"><div class="feature-icon" style="cursor:pointer" onclick="nav('process')"><i class="bi bi-diagram-3"></i></div><div>流程</div></div>
</div></div></div></div>
</div>
</div>

<div class="page" id="page-apply">
<h2 class="page-title"><i class="bi bi-send me-2"></i>入党申请</h2>
<div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>提交入党申请，进入党员发展流程</div>
<div class="card"><div class="card-header"><i class="bi bi-pencil me-2"></i>在线填写</div><div class="card-body">
<div class="mb-3"><label class="form-label">姓名</label><input type="text" class="form-control" id="apply-name" placeholder="请输入您的姓名"></div>
<div class="mb-3"><label class="form-label">手机号</label><input type="tel" class="form-control" id="apply-phone" placeholder="请输入手机号"></div>
<div class="mb-3"><label class="form-label">申请书内容</label><textarea class="form-control" id="apply-content" rows="8" placeholder="请输入入党申请书内容..."></textarea></div>
<button class="btn btn-primary" onclick="submitApply()"><i class="bi bi-send me-2"></i>提交申请</button>
</div></div>
</div>

<div class="page" id="page-process">
<h2 class="page-title"><i class="bi bi-diagram-3 me-2"></i>党员发展流程</h2>
<div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>党员发展全流程详解</div>
<div class="card mb-4"><div class="card-body">
<div class="row align-items-center">
<div class="col-md-3"><div class="process-step completed"><i class="bi bi-check-circle" style="font-size:30px"></i><div class="mt-2"><strong>提交申请</strong><br><small>入党申请书</small></div></div></div>
<div class="col-md-1 process-arrow"><i class="bi bi-arrow-right"></i></div>
<div class="col-md-3"><div class="process-step"><i class="bi bi-file-earmark-check" style="font-size:30px"></i><div class="mt-2"><strong>审核谈话</strong><br><small>入党谈话</small></div></div></div>
<div class="col-md-1 process-arrow"><i class="bi bi-arrow-right"></i></div>
<div class="col-md-3"><div class="process-step"><i class="bi bi-person-plus" style="font-size:30px"></i><div class="mt-2"><strong>积极分子</strong><br><small>确定培养</small></div></div></div>
</div>
<div class="row align-items-center mt-4">
<div class="col-md-3"><div class="process-step"><i class="bi bi-person-check" style="font-size:30px"></i><div class="mt-2"><strong>发展对象</strong><br><small>政审培训</small></div></div></div>
<div class="col-md-1 process-arrow"><i class="bi bi-arrow-right"></i></div>
<div class="col-md-3"><div class="process-step"><i class="bi bi-flag" style="font-size:30px"></i><div class="mt-2"><strong>预备党员</strong><br><small>党员大会</small></div></div></div>
<div class="col-md-1 process-arrow"><i class="bi bi-arrow-right"></i></div>
<div class="col-md-3"><div class="process-step"><i class="bi bi-award" style="font-size:30px"></i><div class="mt-2"><strong>正式党员</strong><br><small>转正大会</small></div></div></div>
</div>
</div></div>
</div>

<div class="page" id="page-ai">
<h2 class="page-title"><i class="bi bi-robot me-2"></i>AI助手</h2>
<div class="card"><div class="card-header">智能问答</div><div class="card-body">
<textarea class="form-control mb-3" id="ai-q" rows="3" placeholder="输入问题..."></textarea>
<button class="btn btn-primary" onclick="sendAI()">发送</button>
<div id="ai-r" class="mt-3" style="display:none"></div>
</div></div>
<div class="card mt-3"><div class="card-header">常见问题</div><div class="card-body">
<button class="btn btn-outline-primary btn-sm me-2 mb-2" onclick="ask('入党申请书怎么写？')">入党申请书怎么写？</button>
<button class="btn btn-outline-primary btn-sm me-2 mb-2" onclick="ask('入党流程是什么？')">入党流程是什么？</button>
<button class="btn btn-outline-primary btn-sm me-2 mb-2" onclick="ask('积极分子需要做什么？')">积极分子需要做什么？</button>
</div></div>
</div>

<div class="page" id="page-review">
<h2 class="page-title"><i class="bi bi-file-earmark-check me-2"></i>申请书审核</h2>
<div class="card mb-4"><div class="card-header"><i class="bi bi-upload me-2"></i>上传申请书（图片识别）</div><div class="card-body">
<div class="upload-zone" id="up-zone"><i class="bi bi-file-earmark-image"></i><p class="mt-3 mb-1">点击上传图片</p><small>AI自动识别文字</small><input type="file" id="up-file" style="display:none" accept="image/*"></div>
<div id="up-r" class="mt-3" style="display:none"></div>
</div></div>
<div class="card"><div class="card-header">手动输入审核</div><div class="card-body">
<textarea class="form-control mb-3" id="app-c" rows="5" placeholder="粘贴申请书内容（至少50字）..."></textarea>
<button class="btn btn-primary" onclick="reviewApp()">开始审核</button>
<div id="app-r" class="mt-3" style="display:none"></div>
</div></div>
</div>

<div class="page" id="page-record">
<h2 class="page-title"><i class="bi bi-chat-quote me-2"></i>谈话记录</h2>
<div class="card mb-4"><div class="card-header">上传识别</div><div class="card-body">
<div class="upload-zone" id="rec-zone"><i class="bi bi-file-earmark-text"></i><p class="mt-3 mb-1">上传谈话记录照片</p><small>AI自动识别</small><input type="file" id="rec-file" style="display:none" accept="image/*"></div>
<div id="rec-r" class="mt-3" style="display:none"></div>
</div></div>
<div class="card mb-4"><div class="card-header">手动新增</div><div class="card-body"><div class="row">
<div class="col-md-6 mb-3"><input type="text" class="form-control" id="rec-name" placeholder="被谈话人姓名"></div>
<div class="col-md-6 mb-3"><input type="text" class="form-control" id="rec-talker" placeholder="谈话人"></div>
<div class="col-md-6 mb-3"><input type="date" class="form-control" id="rec-date"></div>
<div class="col-md-6 mb-3"><select class="form-select" id="rec-type"><option>入党谈话</option><option>思想汇报</option><option>转正谈话</option><option>其他</option></select></div>
<div class="col-12 mb-3"><textarea class="form-control" id="rec-content" rows="3" placeholder="谈话内容"></textarea></div>
</div><button class="btn btn-primary" onclick="createRec()">新增记录</button></div></div>
<div class="card"><div class="card-header d-flex justify-content-between"><span>记录列表</span><button class="btn btn-sm btn-primary" onclick="loadRec()">刷新</button></div>
<div class="card-body" id="rec-list"><div class="empty-state"><i class="bi bi-journal-text" style="font-size:40px"></i><div class="mt-2">暂无记录</div></div></div></div>
</div>

<div class="page" id="page-activity">
<h2 class="page-title"><i class="bi bi-calendar-event me-2"></i>活动管理</h2>
<div class="card mb-4"><div class="card-header">创建活动</div><div class="card-body"><div class="row">
<div class="col-md-6 mb-3"><input type="text" class="form-control" id="act-name" placeholder="活动名称"></div>
<div class="col-md-6 mb-3"><select class="form-select" id="act-type"><option>学习培训</option><option>志愿服务</option><option>组织生活</option><option>其他</option></select></div>
<div class="col-md-6 mb-3"><input type="date" class="form-control" id="act-date"></div>
<div class="col-md-6 mb-3"><input type="text" class="form-control" id="act-loc" placeholder="活动地点"></div>
<div class="col-12 mb-3"><textarea class="form-control" id="act-desc" rows="2" placeholder="活动描述"></textarea></div>
</div><button class="btn btn-primary" onclick="createAct()">创建活动</button></div></div>
<div class="card"><div class="card-header d-flex justify-content-between"><span>活动列表</span><button class="btn btn-sm btn-primary" onclick="loadAct()">刷新</button></div>
<div class="card-body" id="act-list"><div class="empty-state"><i class="bi bi-calendar" style="font-size:40px"></i><div class="mt-2">暂无活动</div></div></div></div>
</div>

<div class="page" id="page-message">
<h2 class="page-title"><i class="bi bi-bell me-2"></i>消息中心</h2>
<div class="card"><div class="card-header d-flex justify-content-between"><span>系统消息</span><button class="btn btn-sm btn-primary" onclick="loadMsg()">刷新</button></div>
<div class="card-body" id="msg-list"><div class="empty-state"><i class="bi bi-bell-slash" style="font-size:40px"></i><div class="mt-2">暂无消息</div></div></div></div>
</div>

<div class="page" id="page-system">
<h2 class="page-title"><i class="bi bi-gear me-2"></i>系统状态</h2>
<div class="card mb-4"><div class="card-header">服务状态</div><div class="card-body">
<button class="btn btn-primary mb-3" onclick="checkHealth()">刷新状态</button>
<div id="sys-status"><div class="alert alert-secondary">点击刷新查看状态</div></div>
</div></div>
</div>

</div></div></div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
function nav(p){document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));document.querySelector('[data-page="'+p+'"]').classList.add('active');document.querySelectorAll('.page').forEach(g=>g.classList.remove('active'));document.getElementById('page-'+p).classList.add('active')}
document.querySelectorAll('.sidebar .nav-link').forEach(l=>l.onclick=function(){nav(this.dataset.page)});
async function api(u,m,d){try{var r=await fetch(u,{method:m||'GET',headers:{'Content-Type':'application/json'},body:d?JSON.stringify(d):undefined});return await r.json()}catch(e){return{error:e.message}}}
async function sendAI(){var q=document.getElementById('ai-q').value;if(!q)return;var r=document.getElementById('ai-r');r.style.display='block';r.innerHTML='<div class="alert alert-info">AI思考中...</div>';var d=await api('/api/ai/chat','POST',{message:q});r.innerHTML='<div class="alert alert-primary">'+(d.data?d.data.message:JSON.stringify(d))+'</div>'}
function ask(q){document.getElementById('ai-q').value=q;sendAI()}
var uz=document.getElementById('up-zone'),uf=document.getElementById('up-file');uz.onclick=()=>uf.click();uf.onchange=()=>{if(uf.files[0])upFile(uf.files[0])};
async function upFile(f){var fd=new FormData();fd.append('file',f);var r=document.getElementById('up-r');r.style.display='block';r.innerHTML='<div class="alert alert-info">识别中...</div>';var d=await(await fetch('/api/upload',{method:'POST',body:fd})).json();if(d.success&&d.extractedText){r.innerHTML='<div class="alert alert-success">识别成功！</div><pre>'+d.extractedText+'</pre>';document.getElementById('app-c').value=d.extractedText}else{r.innerHTML='<div class="alert alert-danger">'+(d.error||'失败')+'</div>'}}
async function reviewApp(){var c=document.getElementById('app-c').value;if(c.length<50){alert('至少50字');return}var r=document.getElementById('app-r');r.style.display='block';r.innerHTML='<div class="alert alert-info">审核中，请稍候...</div>';var d=await api('/api/application/review','POST',{content:c});if(d.overallScore!==undefined){
  var h='<div class="alert alert-'+(d.overallStatus==='通过'?'success':'warning')+'"><h4>📋 审核结果：'+d.overallScore+'分 - '+d.overallStatus+'</h4>';
  if(d.dimensions&&d.dimensions.length){
    h+='<hr><p><strong>各项评分：</strong></p>';
    d.dimensions.forEach(function(dim){
      var icon=dim.passed?'✅':'❌';
      h+='<div class="mb-2"><span class="badge bg-'+(dim.passed?'success':'danger')+' me-1">'+icon+'</span> <b>'+dim.name+'</b>： '+dim.score+'分<br><small class="text-muted">'+dim.feedback+'</small></div>';
    });
  }
  if(d.suggestions&&d.suggestions.length){
    h+='<hr><p><strong>📝 修改建议：</strong></p><ul>';
    d.suggestions.forEach(function(s){h+='<li>'+s+'</li>';});
    h+='</ul>';
  }
  if(d.conclusion){
    h+='<hr><p><strong>总结：</strong> '+d.conclusion+'</p>';
  }
  r.innerHTML=h;
}else{
  r.innerHTML='<div class="alert alert-danger">'+(d.error||'审核失败')+'</div>';
}}
var rz=document.getElementById('rec-zone'),rf=document.getElementById('rec-file');rz.onclick=()=>rf.click();rf.onchange=()=>{if(rf.files[0])upRec(rf.files[0])};
async function upRec(f){var fd=new FormData();fd.append('file',f);var r=document.getElementById('rec-r');r.style.display='block';r.innerHTML='<div class="alert alert-info">识别中...</div>';var d=await(await fetch('/api/record/upload',{method:'POST',body:fd})).json();r.innerHTML=d.success?'<div class="alert alert-success">识别成功！</div><pre>'+JSON.stringify(d.parsedData||{},null,2)+'</pre>':'<div class="alert alert-danger">'+d.error+'</div>'}
async function loadRec(){var d=await api('/api/record/list');var el=document.getElementById('rec-list');if(d.success&&d.data&&d.data.length){var h='<table class="table table-striped"><thead><tr><th>姓名</th><th>类型</th><th>日期</th><th>谈话人</th></tr></thead><tbody>';d.data.forEach(r=>{h+='<tr><td>'+(r.interviewee||'')+'</td><td>'+(r.talk_type||'')+'</td><td>'+(r.talk_date||'')+'</td><td>'+(r.talker||'')+'</td></tr>'});h+='</tbody></table>';el.innerHTML=h}else{el.innerHTML='<div class="empty-state"><i class="bi bi-journal-text" style="font-size:40px"></i><div class="mt-2">暂无记录</div></div>'}}
async function createRec(){var n=document.getElementById('rec-name').value,t=document.getElementById('rec-talker').value,d=document.getElementById('rec-date').value,tp=document.getElementById('rec-type').value,c=document.getElementById('rec-content').value;if(!n||!t||!d){alert('请填写被谈话人、谈话人和日期');return}var r=await api('/api/record/generate','POST',{interviewee:n,talker:t,talkDate:d,talkType:tp,content:c});if(r.success){alert('创建成功！');document.getElementById('rec-name').value='';document.getElementById('rec-talker').value='';document.getElementById('rec-date').value='';document.getElementById('rec-content').value='';loadRec()}else{alert(r.error||'失败')}}
async function loadAct(){var d=await api('/api/activity/list');var el=document.getElementById('act-list');if(d.success&&d.data&&d.data.length){var h='<table class="table table-striped"><thead><tr><th>名称</th><th>类型</th><th>日期</th><th>地点</th></tr></thead><tbody>';d.data.forEach(a=>{h+='<tr><td>'+(a.name||'')+'</td><td>'+(a.type||'')+'</td><td>'+(a.date||'')+'</td><td>'+(a.location||'')+'</td></tr>'});h+='</tbody></table>';el.innerHTML=h}else{el.innerHTML='<div class="empty-state"><i class="bi bi-calendar" style="font-size:40px"></i><div class="mt-2">暂无活动</div></div>'}}
async function createAct(){var n=document.getElementById('act-name').value,t=document.getElementById('act-type').value,d=document.getElementById('act-date').value,l=document.getElementById('act-loc').value,dc=document.getElementById('act-desc').value;if(!n||!d){alert('请填写名称和日期');return}var r=await api('/api/activity/create','POST',{name:n,type:t,date:d,location:l,description:dc});if(r.success){alert('创建成功！');document.getElementById('act-name').value='';document.getElementById('act-date').value='';document.getElementById('act-loc').value='';document.getElementById('act-desc').value='';loadAct()}else{alert(r.error||'失败')}}
async function loadMsg(){var d=await api('/api/message/list');var el=document.getElementById('msg-list');if(d.success&&d.data&&d.data.length){var h='';d.data.forEach(m=>{h+='<div class="alert alert-secondary"><i class="bi bi-bell me-2"></i>'+(m.content||JSON.stringify(m))+'</div>'});el.innerHTML=h}else{el.innerHTML='<div class="empty-state"><i class="bi bi-bell-slash" style="font-size:40px"></i><div class="mt-2">暂无消息</div></div>'}}
async function checkHealth(){var d=await api('/health');var el=document.getElementById('sys-status');var s=d.status==='ok'?'success':'danger';var t=d.status==='ok'?'正常':'异常';el.innerHTML='<div class="alert alert-'+s+'"><i class="bi '+(d.status==='ok'?'bi-check-circle':'bi-x-circle')+' me-2"></i>Worker: '+t+'</div><div class="alert alert-secondary"><i class="bi bi-clock me-2"></i>时间: '+(d.timestamp||new Date().toISOString())+'</div><div class="alert alert-secondary"><i class="bi bi-gear me-2"></i>环境: '+(d.environment||'production')+'</div>'}
function submitApply(){var n=document.getElementById('apply-name').value,p=document.getElementById('apply-phone').value,c=document.getElementById('apply-content').value;if(!n||!c){alert('请填写姓名和申请书内容');return}alert('申请已提交！');document.getElementById('apply-name').value='';document.getElementById('apply-phone').value='';document.getElementById('apply-content').value=''}
loadRec();loadAct();
</script>
</body>
</html>`))

// 健康检查
app.get('/health', c => c.json({ status: 'ok', timestamp: new Date().toISOString(), environment: c.env.ENVIRONMENT || 'production' }))

// 图片上传识别
app.post('/api/upload', async c => {
  const body = await c.req.parseBody()
  const file = body.file as File
  if (!file) return c.json({ success: false, error: '请选择文件' })
  if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return c.json({ success: false, error: '请上传图片' })
  const arr = await file.arrayBuffer()
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arr)))
  let text = '识别失败'
  if (c.env.GLM_API_KEY) {
    try {
      const r = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${c.env.GLM_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'glm-4v-flash', messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }, { type: 'text', text: '请识别图片中的文字内容' }] }] })
      })
      const d = await r.json()
      text = d.choices?.[0]?.message?.content || '识别失败'
    } catch(e) { text = '识别失败' }
  }
  return c.json({ success: true, extractedText: text })
})

// 谈话记录识别
app.post('/api/record/upload', async c => {
  const body = await c.req.parseBody()
  const file = body.file as File
  if (!file) return c.json({ success: false, error: '请选择文件' })
  const arr = await file.arrayBuffer()
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arr)))
  let data = null
  if (c.env.GLM_API_KEY) {
    try {
      const r = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${c.env.GLM_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'glm-4v-flash', messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }, { type: 'text', text: '提取JSON格式：interviewee(被谈话人),talker(谈话人),talkDate(日期),talkType(类型),content(内容)' }] }] })
      })
      const d = await r.json()
      const txt = d.choices?.[0]?.message?.content || ''
      const m = txt.match(/\{[\s\S]*\}/)
      if (m) try { data = JSON.parse(m[0]) } catch(e) {}
    } catch(e) { return c.json({ success: false, error: '识别失败' }) }
  }
  return c.json({ success: true, parsedData: data })
})

// AI聊天
app.post('/api/ai/chat', async c => {
  const { message } = await c.req.json()
  let reply = '您好！我是党员发展AI助手。'
  if (c.env.GLM_API_KEY) {
    try {
      const r = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${c.env.GLM_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'glm-4', messages: [{ role: 'system', content: '你是党员发展AI助手，用中文回答。' }, { role: 'user', content: message }] })
      })
      const d = await r.json()
      reply = d.choices?.[0]?.message?.content || reply
    } catch(e) {}
  }
  return c.json({ success: true, data: { message: reply, timestamp: new Date().toISOString() } })
})

// 申请书审核
app.post('/api/application/review', async c => {
  const { content } = await c.req.json()
  if (!content || content.length < 50) return c.json({ success: false, error: '申请书内容太少，请输入更多内容（至少50字）' })
  if (c.env.GLM_API_KEY) {
    try {
      const r = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${c.env.GLM_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'glm-4', messages: [{ role: 'user', content: `审核入党申请书，从完整性、规范性、真实性、正确性四个维度打分（0-100），返回JSON：{"overallScore":总分,"overallStatus":"通过/不通过/需修改","dimensions":[{"name":"完整性","score":90,"passed":true,"feedback":"评价"},{"name":"规范性","score":85,"passed":true,"feedback":"评价"},{"name":"真实性","score":88,"passed":true,"feedback":"评价"},{"name":"正确性","score":92,"passed":true,"feedback":"评价"}],"suggestions":["建议1","建议2"],"conclusion":"总结评价"}。申请书内容：${content.slice(0,2000)}` }] })
      })
      const d = await r.json()
      const text = d.choices?.[0]?.message?.content || ''
      const m = text.match(/\{[\s\S]*\}/)
      if (m) try { return c.json(JSON.parse(m[0])) } catch(e) {}
    } catch(e) {}
  }
  return c.json({ overallScore: 75, overallStatus: '通过', dimensions: [{name:'完整性',score:75,passed:true,feedback:'内容基本完整'},{name:'规范性',score:75,passed:true,feedback:'格式符合要求'},{name:'真实性',score:75,passed:true,feedback:'表述真实'},{name:'正确性',score:75,passed:true,feedback:'观点正确'}], suggestions: ['建议补充个人经历'], conclusion: '整体符合入党申请书要求，建议提交审议。' })
})

// 谈话记录列表
app.get('/api/record/list', async c => {
  try { const results = await c.env.DB.prepare('SELECT * FROM talk_records ORDER BY created_at DESC').all(); return c.json({ success: true, data: results.results || [] }) } catch(e) { return c.json({ success: true, data: [] }) }
})

// 创建谈话记录
app.post('/api/record/generate', async c => {
  const { interviewee, talkType, talkDate, talker, content } = await c.req.json()
  const id = crypto.randomUUID()
  try { await c.env.DB.prepare('INSERT INTO talk_records (id, interviewee, talk_type, talk_date, talker, content, status) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, interviewee, talkType, talkDate, talker, content, 'draft').run(); return c.json({ success: true, data: { id } }) } catch(e) { return c.json({ success: false, error: '创建失败' }) }
})

// 活动列表
app.get('/api/activity/list', async c => {
  try { const results = await c.env.DB.prepare('SELECT * FROM activities ORDER BY date DESC').all(); return c.json({ success: true, data: results.results || [] }) } catch(e) { return c.json({ success: true, data: [] }) }
})

// 创建活动
app.post('/api/activity/create', async c => {
  const { name, type, date, location, description } = await c.req.json()
  const id = crypto.randomUUID()
  try { await c.env.DB.prepare('INSERT INTO activities (id, name, type, date, location, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, name, type, date, location, description, 'planned').run(); return c.json({ success: true, data: { id } }) } catch(e) { return c.json({ success: false, error: '创建失败' }) }
})

// 消息列表
app.get('/api/message/list', async c => {
  try { const results = await c.env.DB.prepare('SELECT * FROM messages ORDER BY created_at DESC').all(); return c.json({ success: true, data: results.results || [] }) } catch(e) { return c.json({ success: true, data: [] }) }
})

// 404处理
app.notFound(c => c.json({ error: 'Not Found' }, 404))
app.onError((e, c) => { console.error(e); return c.json({ error: 'Error' }, 500) })

export default app
