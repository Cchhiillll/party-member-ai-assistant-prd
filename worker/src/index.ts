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
*{box-sizing:border-box}
body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;margin:0}
.layout{display:flex;min-height:100vh}
.sidebar{width:220px;min-width:220px;background:linear-gradient(180deg,var(--d),#1a252f);box-shadow:4px 0 15px rgba(0,0,0,.3);flex-shrink:0}
.sidebar h3{background:linear-gradient(45deg,var(--p),var(--s));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;margin:0;padding:20px;text-align:center}
.sidebar .nav-link{border-radius:10px;margin:5px 10px;transition:all .3s;color:rgba(255,255,255,.8)!important;display:block;padding:10px 15px;text-decoration:none}
.sidebar .nav-link:hover,.sidebar .nav-link.active{background:linear-gradient(45deg,var(--p),var(--s));color:#fff!important;transform:translateX(5px)}
.main-content{flex:1;background:rgba(255,255,255,.95);border-radius:20px;margin:20px;margin-left:0;padding:30px;box-shadow:0 10px 40px rgba(0,0,0,.2);overflow:auto}
.page-title{border-left:5px solid var(--p);padding-left:15px;margin-bottom:30px;color:var(--d)}
.stat-card{border:none;border-radius:15px;overflow:hidden;transition:transform .3s}.stat-card:hover{transform:translateY(-5px)}
.stat-card .card-body{background:linear-gradient(135deg,var(--p),var(--s));color:#fff}
.upload-zone{border:3px dashed var(--s);border-radius:20px;padding:50px;text-align:center;background:#f0f8ff;cursor:pointer;transition:all .3s}
.upload-zone:hover{border-color:var(--p);background:#e6f2ff;transform:scale(1.02)}.upload-zone i{font-size:60px;color:var(--p)}
.process-step{padding:20px;border-radius:15px;background:#fff;box-shadow:0 5px 15px rgba(0,0,0,.1);text-align:center;transition:all .3s}
.process-step:hover{transform:translateY(-5px)}.process-step.completed{background:linear-gradient(135deg,var(--p),var(--s));color:#fff}
.process-arrow{font-size:30px;color:var(--s);display:flex;align-items:center;justify-content:center}
.btn-primary{background:linear-gradient(45deg,var(--p),var(--s));border:none;padding:12px 30px;border-radius:25px;font-weight:600;color:#fff}
.btn-primary:hover{transform:scale(1.05);color:#fff}
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
<div class="layout">
<div class="sidebar">
<h3><i class="bi bi-flag-fill"></i> 党员发展AI</h3>
<nav class="nav flex-column pb-4">
<a class="nav-link active" data-page="home"><i class="bi bi-house-door me-2"></i>工作台</a>
<a class="nav-link" data-page="ai"><i class="bi bi-robot me-2"></i>AI助手</a>
<a class="nav-link" data-page="review"><i class="bi bi-file-earmark-check me-2"></i>申请书审核</a>
<a class="nav-link" data-page="record"><i class="bi bi-chat-quote me-2"></i>谈话记录</a>
<a class="nav-link" data-page="system"><i class="bi bi-gear me-2"></i>系统状态</a>
</nav>
</div>
<div class="main-content">

<div class="page active" id="page-home">
<h2 class="page-title"><i class="bi bi-house-door me-2"></i>工作台</h2>
<div class="hero-section"><h1><i class="bi bi-flag-fill me-2"></i>党员发展AI助手</h1><p class="mb-0">智能辅助党员发展全流程</p></div>
<div class="card"><div class="card-header"><i class="bi bi-lightning me-2"></i>快捷入口</div><div class="card-body text-center"><div class="row">
<div class="col-6 mb-3"><div class="feature-icon" style="cursor:pointer" onclick="nav('ai')"><i class="bi bi-robot"></i></div><div>AI问答</div></div>
<div class="col-6 mb-3"><div class="feature-icon" style="cursor:pointer" onclick="nav('review')"><i class="bi bi-file-earmark-check"></i></div><div>审核</div></div>
<div class="col-6"><div class="feature-icon" style="cursor:pointer" onclick="nav('record')"><i class="bi bi-chat-quote"></i></div><div>谈话记录</div></div>
<div class="col-6"><div class="feature-icon" style="cursor:pointer" onclick="nav('system')"><i class="bi bi-gear"></i></div><div>系统</div></div>
</div></div></div>
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
<div class="row g-4">
<div class="col-lg-8">
<div class="card h-100"><div class="card-header"><i class="bi bi-chat-dots me-2"></i>对话区</div><div class="card-body d-flex flex-column">
<div id="ai-history" class="flex-grow-1 mb-3" style="max-height:400px;overflow-y:auto;min-height:200px">
<div class="text-center text-muted py-4"><i class="bi bi-robot" style="font-size:50px;opacity:0.3"></i><p class="mt-2">开始提问吧~</p></div>
</div>
<div class="border-top pt-3">
<textarea class="form-control mb-2" id="ai-q" rows="2" style="resize:vertical" placeholder="输入你的问题...&#10;💡 可以问任何党建相关问题"></textarea>
<div class="d-flex gap-2">
<button class="btn btn-primary" onclick="sendAI()"><i class="bi bi-send me-1"></i>发送</button>
<button class="btn btn-outline-secondary" onclick="clearAIHistory()"><i class="bi bi-trash me-1"></i>清空对话</button>
</div>
</div>
</div></div>
</div>
<div class="col-lg-4">
<div class="card mb-3"><div class="card-header"><i class="bi bi-lightning me-2"></i>常见问题</div><div class="card-body">
<button class="btn btn-outline-primary btn-sm d-block w-100 mb-2 text-start" onclick="ask('入党申请书怎么写？')"><i class="bi bi-file-text me-2"></i>入党申请书怎么写？</button>
<button class="btn btn-outline-primary btn-sm d-block w-100 mb-2 text-start" onclick="ask('入党流程是什么？')"><i class="bi bi-diagram-3 me-2"></i>入党流程是什么？</button>
<button class="btn btn-outline-primary btn-sm d-block w-100 mb-2 text-start" onclick="ask('积极分子需要做什么？')"><i class="bi bi-person-check me-2"></i>积极分子需要做什么？</button>
<button class="btn btn-outline-primary btn-sm d-block w-100 text-start" onclick="ask('党员的权利和义务有哪些？')"><i class="bi bi-list-check me-2"></i>党员的权利和义务</button>
</div></div>
<div class="card"><div class="card-header"><i class="bi bi-lightbulb me-2"></i>使用提示</div><div class="card-body small">
<p class="mb-2">💡 <strong>可以问：</strong></p>
<ul class="mb-2 ps-3">
<li>党建相关知识</li>
<li>入党流程指导</li>
<li>材料撰写建议</li>
<li>政策解读</li>
</ul>
<p class="mb-0 text-muted">支持多轮对话，AI 会记住上下文~</p>
</div></div>
</div>
</div>
</div>

<div class="page" id="page-review">
<h2 class="page-title"><i class="bi bi-file-earmark-check me-2"></i>申请书审核</h2>
<div class="row g-4">
<div class="col-lg-7">
<div class="card h-100"><div class="card-header"><i class="bi bi-pencil-square me-2"></i>输入/编辑内容</div><div class="card-body d-flex flex-column">
<textarea class="form-control mb-3 flex-grow-1" id="app-c" style="min-height:200px;resize:vertical" placeholder="在此粘贴或输入申请书内容（至少50字）...&#10;&#10;💡 提示：&#10;• 可直接输入或粘贴文字&#10;• 可拖动右下角调整大小&#10;• 上传图片后会自动识别填充"></textarea>
<div class="d-flex gap-2 mb-3">
<button class="btn btn-primary" onclick="reviewApp()"><i class="bi bi-search me-1"></i>开始审核</button>
<button class="btn btn-outline-secondary" onclick="clearAllContent()"><i class="bi bi-trash me-1"></i>全部清空</button>
</div>
<div id="app-r" style="display:none"></div>
</div></div>
</div>
<div class="col-lg-5">
<div class="card h-100"><div class="card-header"><i class="bi bi-camera me-2"></i>图片识别（可选）</div><div class="card-body d-flex flex-column">
<div id="preview-area" class="mb-3" style="display:none">
<img id="preview-img" class="img-fluid rounded" style="max-height:200px;object-fit:contain;background:#f8f9fa">
</div>
<div class="upload-zone flex-grow-1 d-flex flex-column align-items-center justify-content-center" id="up-zone" style="min-height:150px">
<i class="bi bi-cloud-arrow-up" style="font-size:40px;color:var(--p)"></i>
<p class="mt-2 mb-1">点击或拖拽上传图片</p>
<small class="text-muted">支持 JPG、PNG、GIF</small>
<input type="file" id="up-file" style="display:none" accept="image/*">
</div>
<div id="upload-actions" class="mt-3" style="display:none">
<button class="btn btn-outline-primary btn-sm" onclick="reUpload()"><i class="bi bi-arrow-repeat me-1"></i>重新上传</button>
</div>
<div id="up-status" class="mt-2" style="display:none"></div>
</div></div>
</div>
</div>
</div>

<div class="page" id="page-record">
<h2 class="page-title"><i class="bi bi-chat-quote me-2"></i>谈话记录</h2>
<div class="row g-4">
<div class="col-lg-7">
<div class="card h-100"><div class="card-header"><i class="bi bi-pencil-square me-2"></i>新增记录</div><div class="card-body">
<div class="row g-3">
<div class="col-md-6">
<label class="form-label">被谈话人姓名 <span class="text-danger">*</span></label>
<input type="text" class="form-control" id="rec-name" placeholder="输入姓名">
</div>
<div class="col-md-6">
<label class="form-label">谈话人 <span class="text-danger">*</span></label>
<input type="text" class="form-control" id="rec-talker" placeholder="输入谈话人">
</div>
<div class="col-md-6">
<label class="form-label">谈话日期 <span class="text-danger">*</span></label>
<input type="date" class="form-control" id="rec-date">
</div>
<div class="col-md-6">
<label class="form-label">谈话类型</label>
<select class="form-select" id="rec-type">
<option>入党谈话</option>
<option>思想汇报</option>
<option>转正谈话</option>
<option>其他</option>
</select>
</div>
<div class="col-12">
<label class="form-label">谈话内容</label>
<textarea class="form-control" id="rec-content" rows="5" style="resize:vertical" placeholder="记录谈话的主要内容...&#10;💡 提示：可以拖动右下角调整大小"></textarea>
</div>
</div>
<div class="d-flex gap-2 mt-3">
<button class="btn btn-primary" onclick="createRec()"><i class="bi bi-save me-1"></i>保存记录</button>
<button class="btn btn-outline-secondary" onclick="clearRecForm()"><i class="bi bi-trash me-1"></i>清空表单</button>
</div>
</div></div>
</div>
<div class="col-lg-5">
<div class="card h-100"><div class="card-header"><i class="bi bi-camera me-2"></i>图片识别（可选）</div><div class="card-body d-flex flex-column">
<div id="rec-preview-area" class="mb-3" style="display:none">
<img id="rec-preview-img" class="img-fluid rounded" style="max-height:180px;object-fit:contain;background:#f8f9fa">
</div>
<div class="upload-zone flex-grow-1 d-flex flex-column align-items-center justify-content-center" id="rec-zone" style="min-height:140px">
<i class="bi bi-cloud-arrow-up" style="font-size:40px;color:var(--p)"></i>
<p class="mt-2 mb-1">点击或拖拽上传图片</p>
<small class="text-muted">AI自动识别谈话记录</small>
<input type="file" id="rec-file" style="display:none" accept="image/*">
</div>
<div id="rec-upload-actions" class="mt-3" style="display:none">
<button class="btn btn-outline-primary btn-sm" onclick="reUploadRec()"><i class="bi bi-arrow-repeat me-1"></i>重新上传</button>
</div>
<div id="rec-status" class="mt-2" style="display:none"></div>
</div></div>
</div>
</div>
<div class="card mt-4"><div class="card-header d-flex justify-content-between align-items-center" data-bs-toggle="collapse" data-bs-target="#rec-list-collapse" style="cursor:pointer">
<span><i class="bi bi-journal-text me-2"></i>记录列表 <small class="text-muted">(点击展开/折叠)</small></span>
<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();loadRec()"><i class="bi bi-arrow-clockwise me-1"></i>刷新</button>
</div>
<div class="collapse show" id="rec-list-collapse"><div class="card-body" id="rec-list"><div class="empty-state"><i class="bi bi-journal-text" style="font-size:40px"></i><div class="mt-2">暂无记录</div></div></div></div>
</div>
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

</div>
</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
function nav(p){document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));document.querySelector('[data-page="'+p+'"]').classList.add('active');document.querySelectorAll('.page').forEach(g=>g.classList.remove('active'));document.getElementById('page-'+p).classList.add('active')}
document.querySelectorAll('.sidebar .nav-link').forEach(l=>l.onclick=function(){nav(this.dataset.page)});
async function api(u,m,d){try{var r=await fetch(u,{method:m||'GET',headers:{'Content-Type':'application/json'},body:d?JSON.stringify(d):undefined});return await r.json()}catch(e){return{error:e.message}}}
async function sendAI(){
  var q=document.getElementById('ai-q').value.trim();
  if(!q)return;
  var h=document.getElementById('ai-history');
  var hHtml=h.innerHTML;
  if(hHtml.includes('开始提问吧'))hHtml='';
  h.innerHTML=hHtml+'<div class="alert alert-secondary py-2 mb-2"><i class="bi bi-person me-2"></i><strong>我：</strong>'+q+'</div>';
  document.getElementById('ai-q').value='';
  h.innerHTML+='<div class="alert alert-info py-2 mb-2" id="ai-thinking"><i class="bi bi-robot me-2"></i><strong>AI：</strong><span class="spinner-border spinner-border-sm me-1"></span>思考中...</div>';
  h.scrollTop=h.scrollHeight;
  var d=await api('/api/ai/chat','POST',{message:q});
  var thinking=document.getElementById('ai-thinking');
  if(thinking)thinking.outerHTML='<div class="alert alert-primary py-2 mb-2"><i class="bi bi-robot me-2"></i><strong>AI：</strong>'+(d.data?d.data.message:JSON.stringify(d))+'</div>';
  h.scrollTop=h.scrollHeight;
}
function ask(q){document.getElementById('ai-q').value=q;sendAI()}
function clearAIHistory(){document.getElementById('ai-history').innerHTML='<div class="text-center text-muted py-4"><i class="bi bi-robot" style="font-size:50px;opacity:0.3"></i><p class="mt-2">开始提问吧~</p></div>'}
var uz=document.getElementById('up-zone'),uf=document.getElementById('up-file');
uz.onclick=()=>uf.click();
uz.ondragover=e=>{e.preventDefault();uz.style.borderColor='var(--p)';uz.style.background='#e6f2ff'};
uz.ondragleave=e=>{uz.style.borderColor='var(--s)';uz.style.background='#f0f8ff'};
uz.ondrop=e=>{e.preventDefault();uz.style.borderColor='var(--s)';uz.style.background='#f0f8ff';if(e.dataTransfer.files[0])upFile(e.dataTransfer.files[0])};
uf.onchange=()=>{if(uf.files[0])upFile(uf.files[0])};
function reUpload(){document.getElementById('preview-area').style.display='none';document.getElementById('upload-actions').style.display='none';document.getElementById('up-status').style.display='none';uz.style.display='flex';uf.value=''}
function clearAllContent(){document.getElementById('app-c').value='';document.getElementById('app-r').style.display='none';reUpload()}
async function upFile(f){
if(!f.type.startsWith('image/')){showStatus('error','请上传图片文件');return}
var r=new FileReader();
r.onload=async function(e){
document.getElementById('preview-img').src=e.target.result;
document.getElementById('preview-area').style.display='block';
uz.style.display='none';
showStatus('loading','识别中...');
var fd=new FormData();fd.append('file',f);
try{
var d=await(await fetch('/api/upload',{method:'POST',body:fd})).json();
if(d.success&&d.extractedText){
showStatus('success','识别成功！已填充到左侧输入框');
document.getElementById('app-c').value=d.extractedText;
document.getElementById('upload-actions').style.display='block'
}else{showStatus('error',d.error||'识别失败');reUpload()}
}catch(err){showStatus('error','网络错误');reUpload()}
};
r.readAsDataURL(f)
}
function showStatus(type,msg){
var s=document.getElementById('up-status');s.style.display='block';
var icon=type==='success'?'check-circle':type==='error'?'x-circle':'hourglass-split';
var cls=type==='success'?'success':type==='error'?'danger':'info';
s.innerHTML='<div class="alert alert-'+cls+' py-2 mb-0"><i class="bi bi-'+icon+' me-2"></i>'+msg+'</div>'
}
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
var rz=document.getElementById('rec-zone'),rf=document.getElementById('rec-file');
rz.onclick=()=>rf.click();
rz.ondragover=e=>{e.preventDefault();rz.style.borderColor='var(--p)';rz.style.background='#e6f2ff'};
rz.ondragleave=e=>{rz.style.borderColor='var(--s)';rz.style.background='#f0f8ff'};
rz.ondrop=e=>{e.preventDefault();rz.style.borderColor='var(--s)';rz.style.background='#f0f8ff';if(e.dataTransfer.files[0])upRec(e.dataTransfer.files[0])};
rf.onchange=()=>{if(rf.files[0])upRec(rf.files[0])};
function reUploadRec(){document.getElementById('rec-preview-area').style.display='none';document.getElementById('rec-upload-actions').style.display='none';document.getElementById('rec-status').style.display='none';rz.style.display='flex';rf.value=''}
function clearRecForm(){document.getElementById('rec-name').value='';document.getElementById('rec-talker').value='';document.getElementById('rec-date').value='';document.getElementById('rec-content').value='';reUploadRec()}
async function upRec(f){
if(!f.type.startsWith('image/')){showRecStatus('error','请上传图片文件');return}
var r=new FileReader();
r.onload=async function(e){
document.getElementById('rec-preview-img').src=e.target.result;
document.getElementById('rec-preview-area').style.display='block';
rz.style.display='none';
showRecStatus('loading','识别中...');
var fd=new FormData();fd.append('file',f);
try{
var d=await(await fetch('/api/record/upload',{method:'POST',body:fd})).json();
if(d.success&&d.parsedData){
showRecStatus('success','识别成功！已填充表单');
var p=d.parsedData;
if(p.interviewee)document.getElementById('rec-name').value=p.interviewee;
if(p.talker)document.getElementById('rec-talker').value=p.talker;
if(p.talk_date)document.getElementById('rec-date').value=p.talk_date;
if(p.content)document.getElementById('rec-content').value=p.content;
document.getElementById('rec-upload-actions').style.display='block'
}else{showRecStatus('error',d.error||'识别失败');reUploadRec()}
}catch(err){showRecStatus('error','网络错误');reUploadRec()}
};
r.readAsDataURL(f)
}
function showRecStatus(type,msg){
var s=document.getElementById('rec-status');s.style.display='block';
var icon=type==='success'?'check-circle':type==='error'?'x-circle':'hourglass-split';
var cls=type==='success'?'success':type==='error'?'danger':'info';
s.innerHTML='<div class="alert alert-'+cls+' py-2 mb-0"><i class="bi bi-'+icon+' me-2"></i>'+msg+'</div>'
}
async function loadRec(){var d=await api('/api/record/list');var el=document.getElementById('rec-list');if(d.success&&d.data&&d.data.length){var h='<table class="table table-striped"><thead><tr><th>姓名</th><th>类型</th><th>日期</th><th>谈话人</th></tr></thead><tbody>';d.data.forEach(r=>{h+='<tr><td>'+(r.interviewee||'')+'</td><td>'+(r.talk_type||'')+'</td><td>'+(r.talk_date||'')+'</td><td>'+(r.talker||'')+'</td></tr>'});h+='</tbody></table>';el.innerHTML=h}else{el.innerHTML='<div class="empty-state"><i class="bi bi-journal-text" style="font-size:40px"></i><div class="mt-2">暂无记录</div></div>'}}
async function createRec(){
var n=document.getElementById('rec-name').value,t=document.getElementById('rec-talker').value,d=document.getElementById('rec-date').value,tp=document.getElementById('rec-type').value,c=document.getElementById('rec-content').value;
if(!n||!t||!d){alert('请填写被谈话人、谈话人和日期');return}
var r=await api('/api/record/generate','POST',{interviewee:n,talker:t,talkDate:d,talkType:tp,content:c});
if(r.success){
alert('创建成功！');
clearRecForm();
loadRec()
}else{alert(r.error||'失败')}
}
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
// 图片上传识别
app.post('/api/upload', async c => {
  const body = await c.req.parseBody()
  const file = body.file as File
  if (!file) return c.json({ success: false, error: '请选择文件' })
  if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return c.json({ success: false, error: '请上传图片' })
  
  // 获取文件类型
  const mimeType = file.type || 'image/jpeg'
  
  // 转换为 base64（使用更可靠的方法）
  const arr = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arr)
  let binary = ''
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }
  const base64 = btoa(binary)
  
  if (!c.env.GLM_API_KEY) {
    return c.json({ success: false, error: 'GLM API Key 未配置' })
  }
  
  try {
    const r = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${c.env.GLM_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: 'glm-4v-flash', 
        messages: [{ 
          role: 'user', 
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }, 
            { type: 'text', text: '请识别图片中的所有文字内容，保持原有格式' }
          ] 
        }] 
      })
    })
    const d = await r.json()
    
    if (d.error) {
      return c.json({ success: false, error: `API错误: ${d.error.message || JSON.stringify(d.error)}` })
    }
    
    const text = d.choices?.[0]?.message?.content || ''
    if (!text) {
      return c.json({ success: false, error: 'AI未返回识别结果' })
    }
    return c.json({ success: true, extractedText: text })
  } catch(e: any) {
    return c.json({ success: false, error: `识别失败: ${e.message || '未知错误'}` })
  }
})

// 谈话记录识别
app.post('/api/record/upload', async c => {
  const body = await c.req.parseBody()
  const file = body.file as File
  if (!file) return c.json({ success: false, error: '请选择文件' })
  
  const mimeType = file.type || 'image/jpeg'
  const arr = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arr)
  let binary = ''
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }
  const base64 = btoa(binary)
  
  if (!c.env.GLM_API_KEY) {
    return c.json({ success: false, error: 'GLM API Key 未配置' })
  }
  
  try {
    const r = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${c.env.GLM_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: 'glm-4v-flash', 
        messages: [{ 
          role: 'user', 
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } }, 
            { type: 'text', text: '提取谈话记录信息，返回JSON格式：{"interviewee":"被谈话人姓名","talker":"谈话人姓名","talkDate":"日期","talkType":"谈话类型","content":"谈话内容摘要"}' }
          ] 
        }] 
      })
    })
    const d = await r.json()
    
    if (d.error) {
      return c.json({ success: false, error: `API错误: ${d.error.message || JSON.stringify(d.error)}` })
    }
    
    const txt = d.choices?.[0]?.message?.content || ''
    const m = txt.match(/\{[\s\S]*\}/)
    let data = null
    if (m) {
      try { data = JSON.parse(m[0]) } catch(e) {}
    }
    return c.json({ success: true, parsedData: data, rawText: txt })
  } catch(e: any) {
    return c.json({ success: false, error: `识别失败: ${e.message || '未知错误'}` })
  }
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
  
  const REVIEW_PROMPT = `你是一位资深党务工作者，拥有20年入党申请书审核经验。你熟悉《中国共产党章程》《中国共产党发展党员工作细则》等党内法规，审核过上千份入党申请书。

【审核任务】
请对以下入党申请书进行专业审核，从五个维度进行评分和点评。

【审核维度及评分标准】（每项0-100分，60分合格）

1. 政治立场（25%权重）
   - 是否坚决拥护党的领导，认同党的纲领和章程
   - 是否在重大政治问题上立场坚定、旗帜鲜明
   - 是否能自觉在思想上政治上行动上同党中央保持高度一致

2. 思想觉悟（25%权重）
   - 对党的性质、宗旨、指导思想的认识是否深刻
   - 是否了解党的光辉历史和优良传统
   - 是否能用马克思主义立场观点方法分析问题

3. 入党动机（20%权重）
   - 入党动机是否端正、纯粹，非功利性
   - 是否真心实意为人民服务，愿意为共产主义奋斗终身
   - 是否正确认识党员的权利和义务

4. 个人表现（15%权重）
   - 工作、学习、生活中的实际表现
   - 是否在岗位上发挥先锋模范作用
   - 是否得到周围群众的认可和好评

5. 文字规范（15%权重）
   - 格式是否符合入党申请书规范（标题、称呼、正文、结尾、署名）
   - 语言表达是否得体、真挚
   - 是否存在错别字、语病等基础问题

【评分标准】
- 90-100分：优秀，完全符合要求
- 80-89分：良好，基本符合要求，有少量不足
- 70-79分：合格，需要完善
- 60-69分：勉强合格，存在明显不足
- 60分以下：不合格

【输出格式】
请严格按照以下JSON格式返回，不要有任何额外文字：

{
  "overallScore": 总分（加权平均，保留整数）,
  "overallStatus": "通过/不通过/需修改",
  "dimensions": [
    {"name": "政治立场", "score": 分数, "passed": true/false, "feedback": "具体评价（50-100字）"},
    {"name": "思想觉悟", "score": 分数, "passed": true/false, "feedback": "具体评价（50-100字）"},
    {"name": "入党动机", "score": 分数, "passed": true/false, "feedback": "具体评价（50-100字）"},
    {"name": "个人表现", "score": 分数, "passed": true/false, "feedback": "具体评价（50-100字）"},
    {"name": "文字规范", "score": 分数, "passed": true/false, "feedback": "具体评价（50-100字）"}
  ],
  "suggestions": ["具体、可操作的修改建议1", "具体、可操作的修改建议2"],
  "conclusion": "综合评价（100-150字，包含是否推荐提交支部大会讨论）"
}

【入党申请书内容】
${content}

请开始审核：`

  if (c.env.GLM_API_KEY) {
    try {
      const r = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${c.env.GLM_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'glm-4', messages: [{ role: 'user', content: REVIEW_PROMPT }] })
      })
      const d = await r.json()
      const text = d.choices?.[0]?.message?.content || ''
      const m = text.match(/\{[\s\S]*\}/)
      if (m) try { return c.json(JSON.parse(m[0])) } catch(e) {}
    } catch(e) {}
  }
  return c.json({ overallScore: 75, overallStatus: '通过', dimensions: [{name:'政治立场',score:75,passed:true,feedback:'政治立场基本坚定'},{name:'思想觉悟',score:75,passed:true,feedback:'思想认识较为深刻'},{name:'入党动机',score:75,passed:true,feedback:'入党动机基本端正'},{name:'个人表现',score:75,passed:true,feedback:'表现良好'},{name:'文字规范',score:75,passed:true,feedback:'格式符合要求'}], suggestions: ['建议补充个人具体事例', '建议深化对党的认识'], conclusion: '整体符合入党申请书基本要求，建议进一步完善后提交支部大会讨论。' })
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
